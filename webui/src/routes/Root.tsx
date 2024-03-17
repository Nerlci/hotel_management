import { Link } from "react-router-dom";
import { NAME } from "shared";
import { UserType } from "./Login";

function Root() {
  return (
    <div className="bg-white dark:bg-black h-screen">
      <h1 className="dark:text-white font-bold underline">{NAME}</h1>
      <div className="flex flex-row gap-10">
        <Link
          className="dark:text-gray-300 text-gray-800"
          to={`login/${UserType.Customer}`}
        >
          我是顾客
        </Link>
        <Link
          className="dark:text-gray-300 text-gray-800"
          to={`login/${UserType.Staff}`}
        >
          我是服务员
        </Link>
        <Link
          className="dark:text-gray-300 text-gray-800"
          to={`login/${UserType.Admin}`}
        >
          我是老板
        </Link>
      </div>
    </div>
  );
}

export default Root;
