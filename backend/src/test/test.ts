import * as newman from "newman";
import * as path from "path";
import * as fs from "fs";
import { CookieJar } from "tough-cookie";

// 读取 Postman collection 文件
const collectionFilePath = path.resolve(
  __dirname,
  "../../../cold.postman_collection.json",
);
const collection = JSON.parse(fs.readFileSync(collectionFilePath, "utf8"));
const cookieJar = new CookieJar();

// Newman 配置选项
const newmanOptions: newman.NewmanRunOptions = {
  collection: collection,
  reporters: "cli",
  insecure: true,
  cookieJar: cookieJar,
};

// 获取最接近的整10秒时间点
const getClosestRoundTenSeconds = (timestamp: number) => {
  return Math.round(timestamp / 10000) * 10000;
};

// 请求执行函数
const runRequest = (item: any) => {
  const singleItemCollection = {
    info: collection.info,
    item: [item],
    variable: collection.variable,
  };
  const singleRequestOptions = {
    ...newmanOptions,
    collection: singleItemCollection,
  };

  newman.run(singleRequestOptions, (err, summary) => {
    if (err) {
      throw err;
    }
    console.log(`Request "${item.name}" complete!`);
    // 检查请求的测试结果
    summary.run.executions.forEach((execution) => {
      // console.log(`Response for "${execution.item.name}":`);
      // if (execution.response && execution.response.stream) {
      //   console.log(execution.response.stream.toString());
      // }
      if (execution.assertions) {
        execution.assertions.forEach((assertion) => {
          console.log(
            `${assertion.assertion}: ${assertion.error ? "FAILED" : "PASSED"}`,
          );
          if (assertion.error) {
            console.error(`  Error: ${assertion.error.message}`);
          }
        });
      }
    });
  });
};

// 记录脚本开始时间
const startTime = Date.now();
console.log(`Script started at ${startTime}`);

// 计算每个请求的目标发送时间
const requestsWithTargetTime = collection.item.map((item: any) => {
  const delay = item.delay || 0; // 使用 item 中的 delay 字段，如果没有则默认为 0
  const targetTime = startTime + delay;
  // const roundedTargetTime = getClosestRoundTenSeconds(targetTime);
  // console.log(
  //   `Request "${item.name}" scheduled for ${roundedTargetTime}ms after start`,
  // ); // 输出调度时间
  return { item, targetTime: targetTime };
});

// 持续检查并发送请求
const checkAndSendRequests = () => {
  // console.log(`Checking requests at ${Date.now() - startTime}ms after start`);
  const currentTime = Date.now();
  requestsWithTargetTime.forEach(
    (request: { targetTime: number; item: any }) => {
      // console.log(
      //   currentTime - request.targetTime,
      //   request.targetTime,
      //   currentTime,
      // );
      if (Math.abs(currentTime - request.targetTime) <= 50) {
        console.log(
          `Sending request "${request.item.name}" at ${currentTime - startTime}ms after start`,
        );
        runRequest(request.item);
        // 移除已发送的请求
        requestsWithTargetTime.splice(
          requestsWithTargetTime.indexOf(request),
          1,
        );
      }
    },
  );

  if (requestsWithTargetTime.length > 0) {
    setImmediate(checkAndSendRequests); // 继续检查
  }
};

checkAndSendRequests(); // 开始检查和发送请求
