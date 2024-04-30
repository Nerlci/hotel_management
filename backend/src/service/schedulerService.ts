import { ACUpdateRequest, acStatus, acUpdateRequest } from "shared";
import { prisma } from "../prisma";
import { statusService } from "./statusService";

interface SchedulerItem extends ACUpdateRequest {
  onTimestamp: Date;
  timestamp: Date;
}

const SERVE_LIMIT = Number(process.env.SERVE_LIMIT);
const ROUND_ROBIN_INTERVAL = Number(process.env.ROUND_ROBIN_INTERVAL);

const waitingList: SchedulerItem[] = [];
const servingList: SchedulerItem[] = [];
const roundRobinList: { interval: NodeJS.Timeout, item: SchedulerItem }[] = [];

const statusChange = async (status: SchedulerItem) => {
  const { userId, onTimestamp, ...rest } = status;
  const data = {
    user: {
      connect: {
        id: userId,
      },
    },
    ...rest,
    type: 1
  };
  await prisma.aCRecord.create({
    data: data,
  });

  const statusMessage = acStatus.parse(data);
  statusService.updateStatus(statusMessage);
}

const checkWaitingList = () => {
  if (waitingList.length === 0) { return; }

  const sortedList = servingList.sort((a, b) => 
    a.fanSpeed === b.fanSpeed ? b.fanSpeed - a.fanSpeed: b.onTimestamp.getTime() - a.onTimestamp.getTime()
  );
  waitingList.splice(0, waitingList.length);
  for (const waitingItem of sortedList) {
    schedulerStep(waitingItem);
  }
}

const preemptService = (item: SchedulerItem, preemptedItem: SchedulerItem) => {
  const now = new Date();
  const idx = servingList.findIndex(item => item.roomId === preemptedItem.roomId);
  servingList.splice(idx, 1);

  statusChange(item);
  servingList.push({
    ...item,
    onTimestamp: now,
    timestamp: now,
  });

  statusChange({
    ...preemptedItem,
    on: false,
  });
  waitingList.push({
    ...preemptedItem,
    onTimestamp: now,
    timestamp: now,
  });

  const rrIdx = roundRobinList.findIndex(rrItem => rrItem.item.roomId === item.roomId);
  if (rrIdx !== -1) {
    clearInterval(roundRobinList[rrIdx].interval);
    roundRobinList.splice(rrIdx, 1);

    const newInterval = setInterval(rrPreempt, ROUND_ROBIN_INTERVAL, preemptedItem.roomId);
    roundRobinList.push({
      interval: newInterval,
      item: {
        ...preemptedItem,
        onTimestamp: now,
        timestamp: now,
      }
    });
  }
}

const rrPreempt = (roomId: string) => {
  const idx = roundRobinList.findIndex(item => item.item.roomId === roomId);
  if (idx === -1) { return; }

  if (servingList.length < SERVE_LIMIT) {
    const item = roundRobinList[idx].item;
    const now = new Date();
    statusChange(item);
    servingList.push({
      ...item,
      onTimestamp: now,
      timestamp: now,
    });
    clearInterval(roundRobinList[idx].interval);
    roundRobinList.splice(idx, 1);

    return;
  }

  const item = roundRobinList[idx].item;
  const interval = roundRobinList[idx].interval;
  const sameFanSpeedItems = servingList.filter(servingItem => servingItem.fanSpeed === item.fanSpeed).sort((a, b) => a.onTimestamp.getTime() - b.onTimestamp.getTime());
  if (sameFanSpeedItems.length === 0) {
    roundRobinList.splice(idx, 1);
    clearInterval(interval);
    return;
  }

  const preemptedItem = sameFanSpeedItems[0];
  preemptService(item, preemptedItem);
}

const schedulerStep = (item: ACUpdateRequest) => {
  const now = new Date();

  // 如果请求对象在时间片调度队列中，将其移除
  const rrIdx = roundRobinList.findIndex(rrItem => rrItem.item.roomId === item.roomId);
  if (rrIdx !== -1) {
    clearInterval(roundRobinList[rrIdx].interval);
    roundRobinList.splice(rrIdx, 1);
  }

  // 如果正在服务
  const servingItemIdx = servingList.findIndex(servingItem => servingItem.roomId === item.roomId);
  if (servingItemIdx !== -1) {
    const modifiedItem = {
      ...servingList[servingItemIdx],
      ...item,
      timestamp: now,
    };
    statusChange(modifiedItem);

    if (!item.on) {
      servingList.splice(servingItemIdx, 1);
      
      checkWaitingList();
    } else {
      servingList[servingItemIdx] = modifiedItem;
      if (item.fanSpeed < servingList[servingItemIdx].fanSpeed) {
        checkWaitingList();
      }
    }

    return;
  }

  // 如果正在等待
  const waitingItemIdx = waitingList.findIndex(waitingItem => waitingItem.roomId === item.roomId);
  if (waitingItemIdx !== -1) {
    waitingList.splice(waitingItemIdx, 1);
  }

  // 如果没有正在服务，且请求关闭服务，则直接返回
  if (!item.on) { return; }

  // 当服务对象数小于服务对象上限时，所有请求会被分配一个服务对象
  if (servingList.length < SERVE_LIMIT) {
    const modifiedItem = {
      ...item,
      onTimestamp: now,
      timestamp: now,
    };
    statusChange(modifiedItem);
    servingList.push(modifiedItem);

    return;
  }

  // 当服务对象数大于等于服务对象上限时，启动调度策略

  // 首先判断是否符合优先级策略：请求服务的风速和服务对象的风速的大小
  const requestFanSpeed = item.fanSpeed;
  const servingFanSpeeds = servingList.map(item => item.fanSpeed);

  // 如果请求风速大于某些服务对象的风速
  if (requestFanSpeed > Math.min(...servingFanSpeeds)) {
    // 找到风速低于请求风速的服务对象
    const minFanSpeedItems = servingList.filter(item => item.fanSpeed < requestFanSpeed).sort((a, b) => a.fanSpeed - b.fanSpeed);

    // 如果只有一个风速最低的服务对象，或者有多个但风速不相等
    if (minFanSpeedItems.length === 1 || new Set(minFanSpeedItems.map(item => item.fanSpeed)).size > 1) {
      const minFanSpeedItem = minFanSpeedItems[0];
      const modifiedItem = {
        ...item,
        onTimestamp: now,
        timestamp: now,
      };
      preemptService(modifiedItem, minFanSpeedItem);

      return;
    }

    // 如果有多个风速相等且低于请求风速的服务对象，找到服务时长最大的服务对象
    const maxServiceDuration = Math.max(...minFanSpeedItems.map(item => now.getTime() - item.onTimestamp.getTime()));
    const maxServiceDurationItem = minFanSpeedItems.find(item => now.getTime() - item.onTimestamp.getTime() === maxServiceDuration)!;
    const modifiedItem = {
      ...item,
      onTimestamp: now,
      timestamp: now,
    };
    preemptService(modifiedItem, maxServiceDurationItem);
  }

  // 如果请求风速等于某些服务对象的风速，启动时间片调度策略
  if (requestFanSpeed === Math.min(...servingFanSpeeds)) {
    // 将请求对象放置于等待队列，并分配一个等待服务时长
    // 在这两分钟期间，如果没有任何服务状态的变化，当等待服务时长=0 时将服务队列中服务时长最大的服务对象释放
    // 在这等待的两分钟期间内，如果有任何一个服务对象的目标温度到达或关机，则等待队列中的等待服务时长最小的对象获得服务对象
    
    const roundRobinInterval = setInterval(rrPreempt, ROUND_ROBIN_INTERVAL, item.roomId);
    roundRobinList.push({
      interval: roundRobinInterval,
      item: {
        ...item,
        onTimestamp: now,
        timestamp: now,
      },
    });
    waitingList.push({
      ...item,
      onTimestamp: now,
      timestamp: now,
    });

    return;
  }

  // 如果请求风速小于所有服务对象的风速，请求对象必须等到某个服务对象空闲后才能得到服务
  waitingList.push({
    ...item,
    onTimestamp: now,
    timestamp: now,
  });
  
  return;
}

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
    type: 0,
    timestamp: now,
  };
  await prisma.aCRecord.create({
    data: data,
  });

  schedulerStep(request);
}

const schedulerService = {
  addUpdateRequest: addUpdateRequest,
};

export { schedulerService };