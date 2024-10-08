import { ACStatus, ACUpdateRequest } from "shared";
import { prisma } from "../prisma";
import { statusService } from "./statusService";
import { configService } from "./configService";
import { tempService } from "./tempService";

interface SchedulerItem extends ACUpdateRequest {
  waiting: boolean;
  onTimestamp: Date;
  timestamp: Date;
}

const SERVE_LIMIT = configService.getConfig().ac.serveLimit;
const ROUND_ROBIN_INTERVAL =
  configService.getConfig().ac.roundRobinInterval - 50;

const waitingList: SchedulerItem[] = [];
const servingList: SchedulerItem[] = [];
const rrList: { interval: NodeJS.Timeout; item: SchedulerItem }[] = [];
const shutdownList: { timeout: NodeJS.Timeout; item: SchedulerItem }[] = [];

const modifyTimestamps = (item: SchedulerItem, now: Date) => {
  return {
    ...item,
    onTimestamp: now,
    timestamp: now,
  };
};

const stopRR = (roomId: string) => {
  const idx = rrList.findIndex((item) => item.item.roomId === roomId);
  if (idx === -1) {
    return;
  }

  clearInterval(rrList[idx].interval);
  rrList.splice(idx, 1);
};

const statusChange = async (status: SchedulerItem) => {
  const { userId, onTimestamp, ...rest } = status;
  const data = {
    user: {
      connect: {
        id: userId,
      },
    },
    ...rest,
    temp: tempService.getTemp(status.roomId, status.timestamp),
    priceRate: configService.getFanSpeedPriceRate(status.fanSpeed),
    type: 1,
  };

  const rate =
    configService.getRate(data.fanSpeed * (data.on && !data.waiting ? 1 : 0)) *
    (!data.on || data.waiting || data.mode === 0 ? 1 : -1);

  if (data.on && !data.waiting) {
    const targetTime =
      ((data.target - data.temp) / rate) * 1000 + data.timestamp.getTime() - 50;

    if (targetTime < Date.now()) {
      const servingItemIdx = servingList.findIndex(
        (item) => item.roomId === data.roomId,
      );
      if (servingItemIdx !== -1) {
        servingList[servingItemIdx] = status;
      }
      shutdownRoom(data.roomId);
      return;
    }

    const timeout = setTimeout(
      shutdownRoom,
      targetTime - Date.now(),
      data.roomId,
    );
    const timeoutIdx = shutdownList.findIndex(
      (item) => item.item.roomId === status.roomId,
    );
    if (timeoutIdx !== -1) {
      clearTimeout(shutdownList[timeoutIdx].timeout);
      shutdownList.splice(timeoutIdx, 1);
    }
    shutdownList.push({
      timeout: timeout,
      item: status,
    });
  }

  await prisma.aCRecord.create({
    data: data,
  });

  const { user, ...restData } = data;
  const statusMessage: ACStatus = {
    ...restData,
    timestamp: status.timestamp.toISOString(),
    initTemp: configService.getRoom(data.roomId)?.initTemp || 0,
    rate,
  };
  statusService.updateStatus(statusMessage);

  tempService.updateTemp({
    roomId: status.roomId,
    temp: data.temp,
    rate: rate,
    on: data.on && !data.waiting,
    timestamp: status.timestamp,
  });
};

const checkWaitingList = () => {
  if (waitingList.length === 0) {
    return;
  }

  waitingList.sort((a, b) =>
    a.fanSpeed === b.fanSpeed
      ? a.timestamp.getTime() - b.timestamp.getTime()
      : b.fanSpeed - a.fanSpeed,
  );
  const minServingFanSpeed = Math.min(
    ...servingList.map((item) => item.fanSpeed),
  );
  for (const waitingItem of waitingList) {
    if (
      waitingItem.fanSpeed < minServingFanSpeed &&
      servingList.length >= SERVE_LIMIT
    ) {
      continue;
    }
    schedulerStep(waitingItem);
  }
};

const preemptService = (item: SchedulerItem, preemptedItem: SchedulerItem) => {
  const now = new Date();
  const servingIdx = servingList.findIndex(
    (item) => item.roomId === preemptedItem.roomId,
  );
  servingList.splice(servingIdx, 1);

  const waitingIdx = waitingList.findIndex(
    (waitingItem) => waitingItem.roomId === item.roomId,
  );
  if (waitingIdx !== -1) {
    waitingList.splice(waitingIdx, 1);
  }

  const modifiedItem = modifyTimestamps({ ...item, waiting: false }, now);
  statusChange(modifiedItem);
  servingList.push(modifiedItem);

  statusChange({
    ...preemptedItem,
    waiting: true,
    timestamp: now,
  });
  waitingList.push(modifyTimestamps({ ...preemptedItem }, now));

  // 如果当前对象在时间片调度中，清除他的定时器
  const rrIdx = rrList.findIndex(
    (rrItem) => rrItem.item.roomId === item.roomId,
  );
  if (rrIdx !== -1) {
    clearInterval(rrList[rrIdx].interval);
    rrList.splice(rrIdx, 1);
  }

  // 如果当前对象还有其他同风速的服务对象在等待队列，设置定时器
  let sameFanSpeedItems = waitingList.filter(
    (waitingItem) => waitingItem.fanSpeed === item.fanSpeed,
  );
  for (const sameFanSpeedItem of sameFanSpeedItems) {
    const rrIdx = rrList.findIndex(
      (rrItem) => rrItem.item.roomId === sameFanSpeedItem.roomId,
    );
    if (rrIdx === -1) {
      const newInterval = setInterval(
        rrPreempt,
        ROUND_ROBIN_INTERVAL,
        sameFanSpeedItem.roomId,
      );
      rrList.push({
        interval: newInterval,
        item: sameFanSpeedItem,
      });
    }
  }

  // 如果被抢占的对象的风速还有其他服务对象在使用，为被抢占对象设置定时器
  sameFanSpeedItems = servingList.filter(
    (servingItem) => servingItem.fanSpeed === preemptedItem.fanSpeed,
  );
  if (sameFanSpeedItems.length !== 0) {
    const rrIdx = rrList.findIndex(
      (rrItem) => rrItem.item.roomId === preemptedItem.roomId,
    );
    if (rrIdx === -1) {
      const newInterval = setInterval(
        rrPreempt,
        ROUND_ROBIN_INTERVAL,
        preemptedItem.roomId,
      );
      rrList.push({
        interval: newInterval,
        item: modifyTimestamps(preemptedItem, now),
      });
    }
  }

  // 释放被抢占对象的关闭定时器
  const shutdownIdx = shutdownList.findIndex(
    (item) => item.item.roomId === preemptedItem.roomId,
  );
  if (shutdownIdx !== -1) {
    clearTimeout(shutdownList[shutdownIdx].timeout);
    shutdownList.splice(shutdownIdx, 1);
  }
};

const rrPreempt = (roomId: string) => {
  const idx = rrList.findIndex((item) => item.item.roomId === roomId);
  if (idx === -1) {
    return;
  }

  const item = rrList[idx].item;
  const interval = rrList[idx].interval;
  const sameFanSpeedItems = servingList
    .filter((servingItem) => servingItem.fanSpeed === item.fanSpeed)
    .sort((a, b) => a.onTimestamp.getTime() - b.onTimestamp.getTime());
  if (sameFanSpeedItems.length === 0) {
    rrList.splice(idx, 1);
    clearInterval(interval);
    return;
  }

  const preemptedItem = sameFanSpeedItems[0];
  preemptService(item, preemptedItem);
};

const shutdownRoom = (roomId: string) => {
  const now = new Date();
  const servingIdx = servingList.findIndex(
    (item) => item.roomId === roomId && item.on,
  );
  if (servingIdx === -1) {
    return;
  }

  schedulerStep({
    ...servingList[servingIdx],
    on: false,
    timestamp: now,
  });
};

const schedulerStep = (item: SchedulerItem) => {
  const now = new Date();

  // 如果正在服务
  const servingItemIdx = servingList.findIndex(
    (servingItem) => servingItem.roomId === item.roomId,
  );
  if (servingItemIdx !== -1) {
    const modifiedItem = {
      ...item,
      onTimestamp: servingList[servingItemIdx].onTimestamp,
      timestamp: now,
    };

    const previousFanSpeed = servingList[servingItemIdx].fanSpeed;

    if (item.on && item.fanSpeed < previousFanSpeed) {
      // 先修改服务列表为新的风速，再检查等待队列
      servingList[servingItemIdx] = modifiedItem;
      checkWaitingList();

      // 如果已经被抢占了，不需要再次修改状态
      const nowIdx = servingList.findIndex(
        (servingItem) => servingItem.roomId === item.roomId,
      );
      if (nowIdx === -1) {
        return;
      }
    }

    statusChange(modifiedItem);

    if (!item.on) {
      const shutdownIdx = shutdownList.findIndex(
        (shutdownItem) => shutdownItem.item.roomId === item.roomId,
      );

      if (shutdownIdx !== -1) {
        clearTimeout(shutdownList[shutdownIdx].timeout);
        shutdownList.splice(shutdownIdx, 1);
      }
      servingList.splice(servingItemIdx, 1);
      checkWaitingList();

      return;
    }

    servingList[servingItemIdx] = modifiedItem;

    return;
  }

  // 如果正在等待，先将其移除
  const waitingItemIdx = waitingList.findIndex(
    (waitingItem) => waitingItem.roomId === item.roomId,
  );
  if (waitingItemIdx !== -1) {
    const rrIdx = rrList.findIndex(
      (rrItem) => rrItem.item.roomId === item.roomId,
    );
    if (rrIdx !== -1) {
      clearInterval(rrList[rrIdx].interval);
      rrList.splice(rrIdx, 1);
    }

    waitingList.splice(waitingItemIdx, 1);
  }

  // 如果没有正在服务，且请求关闭服务
  if (!item.on) {
    // 如果请求关闭服务的对象在时间片等待中，将其移除
    stopRR(item.roomId);

    if (waitingItemIdx) {
      statusChange(item);
    }

    return;
  }

  // 当服务对象数小于服务对象上限时，所有请求会被分配一个服务对象
  if (servingList.length < SERVE_LIMIT) {
    stopRR(item.roomId);
    const modifiedItem = modifyTimestamps(item, now);
    servingList.push(modifiedItem);
    statusChange(modifiedItem);

    return;
  }

  // 当服务对象数大于等于服务对象上限时，启动调度策略

  // 首先判断是否符合优先级策略：请求服务的风速和服务对象的风速的大小
  const requestFanSpeed = item.fanSpeed;
  const servingFanSpeeds = servingList.map((item) => item.fanSpeed);

  // 如果请求风速大于某些服务对象的风速
  if (requestFanSpeed > Math.min(...servingFanSpeeds)) {
    // 找到风速低于请求风速的服务对象
    const minFanSpeedItems = servingList
      .filter((item) => item.fanSpeed < requestFanSpeed)
      .sort((a, b) => a.fanSpeed - b.fanSpeed);

    // 如果只有一个风速最低的服务对象，或者有多个但风速不相等
    if (
      minFanSpeedItems.length === 1 ||
      new Set(minFanSpeedItems.map((item) => item.fanSpeed)).size > 1
    ) {
      const minFanSpeedItem = minFanSpeedItems[0];
      preemptService(item, minFanSpeedItem);

      return;
    }

    // 如果有多个风速相等且低于请求风速的服务对象，找到服务时长最大的服务对象
    const maxServiceDuration = Math.max(
      ...minFanSpeedItems.map(
        (item) => now.getTime() - item.onTimestamp.getTime(),
      ),
    );
    const maxServiceDurationItem = minFanSpeedItems.find(
      (item) =>
        now.getTime() - item.onTimestamp.getTime() === maxServiceDuration,
    )!;
    preemptService(item, maxServiceDurationItem);

    return;
  }

  // 如果请求风速等于某些服务对象的风速，启动时间片调度策略
  if (requestFanSpeed === Math.min(...servingFanSpeeds)) {
    // 将请求对象放置于等待队列，设置定时器
    const rrIdx = rrList.findIndex(
      (rrItem) => rrItem.item.roomId === item.roomId,
    );
    if (rrIdx !== -1) {
      return;
    }

    const rrInterval = setInterval(
      rrPreempt,
      ROUND_ROBIN_INTERVAL,
      item.roomId,
    );
    rrList.push({
      interval: rrInterval,
      item: modifyTimestamps(item, now),
    });
    waitingList.push(modifyTimestamps({ ...item }, now));
    statusChange(modifyTimestamps({ ...item, waiting: true }, now));

    return;
  }

  // 如果请求风速小于所有服务对象的风速，请求对象必须等到某个服务对象空闲后才能得到服务
  waitingList.push({ ...item });
  statusChange(modifyTimestamps({ ...item, waiting: true }, now));

  return;
};

const addUpdateRequest = async (request: ACUpdateRequest) => {
  const { userId, ...rest } = request;
  const now = new Date();

  const data = {
    user: {
      connect: {
        id: userId,
      },
    },
    ...rest,
    waiting: false,
    temp: tempService.getTemp(request.roomId, now),
    priceRate: configService.getFanSpeedPriceRate(request.fanSpeed),
    type: 0,
    timestamp: now,
  };
  await prisma.aCRecord.create({
    data: data,
  });

  schedulerStep(
    modifyTimestamps(
      { ...request, waiting: false, onTimestamp: now, timestamp: now },
      now,
    ),
  );
};

const schedulerService = {
  addUpdateRequest: addUpdateRequest,
};

export { schedulerService };
