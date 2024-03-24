import { Link } from "react-router-dom";
import { UserType } from "./Login";
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function Root() {
  return (
    <>
      <NavBar />
      <div className="ml-auto mr-auto mt-52 flex max-w-96 flex-wrap justify-center gap-5">
        <Link to={`/login/${UserType.Customer}`}>
          <Card className="hover:bg-slate-100 dark:hover:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm">我是顾客</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Staff}`}>
          <Card className="hover:bg-slate-100 dark:hover:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm">我是服务员</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Admin}`}>
          <Card className="hover:bg-slate-100 dark:hover:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm">我是管理员</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

export default Root;
