import { useState, useRef, useEffect } from "react";

const useSSE = (url: string) => {
  const source = useRef<EventSource | null>(null);
  //接收到的sse数据
  const [sseData, setSseData] = useState({});

  // sse状态
  const [sseReadyState, setSseReadyState] = useState({
    key: 0,
    value: "正在链接中",
  });

  const creatSource = () => {
    const stateArr = [
      { key: 0, value: "正在链接中" },
      { key: 1, value: "已经链接并且可以通讯" },
      { key: 2, value: "连接已关闭或者没有链接成功" },
    ];

    try {
      source.current = new EventSource(url, {
        withCredentials: true,
      });
      source.current.onopen = (_e) => {
        setSseReadyState(stateArr[source.current?.readyState ?? 0]);
      };

      source.current.onerror = (_) => {
        setSseReadyState(stateArr[source.current?.readyState ?? 0]);
      };
      source.current.onmessage = (e) => {
        setSseData({ ...JSON.parse(e.data) });
      };
    } catch (error) {
      console.log(error);
    }
  };

  const sourceInit = () => {
    if (!source.current || source.current.readyState === 2) {
      creatSource();
    }
  };

  //  关闭 WebSocket
  const closeSource = () => {
    source.current?.close();
  };

  //重连
  const reconnectSSE = () => {
    try {
      closeSource();
      source.current = null;
      creatSource();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    sourceInit();
  }, []);

  return {
    sseData,
    sseReadyState,
    closeSource,
    reconnectSSE,
  };
};
export default useSSE;
