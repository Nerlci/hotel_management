import { useState, useRef, useEffect, useCallback } from "react";

const stateArr = [
  { key: 0, value: "正在链接中" },
  { key: 1, value: "已经链接并且可以通讯" },
  { key: 2, value: "连接已关闭或者没有链接成功" },
];

export function useSSE<T>(url: string) {
  const source = useRef<EventSource | null>(null);
  const [sseData, setSseData] = useState<T>();
  const [sseReadyState, setSseReadyState] = useState(stateArr[0]);

  const creatSource = () => {
    try {
      source.current = new EventSource(url, {
        withCredentials: true,
      });
      source.current.onopen = () => {
        setSseReadyState(stateArr[source.current?.readyState ?? 0]);
      };
      source.current.onerror = () => {
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

  const closeSource = useCallback(() => {
    source.current?.close();
  }, []);

  const reconnectSSE = () => {
    try {
      closeSource();
      source.current = null;
      creatSource();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(sourceInit);

  return {
    sseData,
    sseReadyState,
    closeSource,
    reconnectSSE,
  };
}
