import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const [countDown, setCountDown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((c) => c - 1);
      if (countDown == 1) {
        clearInterval(timer);
        navigate("/");
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center dark:text-white">
        <h1 className="text-3xl">404</h1>
        <p>在 {countDown} 秒后返回主页</p>
      </div>
    </div>
  );
}
