import { Link } from "react-router-dom";
import { UserType } from "./Login";
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function Root() {
  return (
    <>
      <NavBar />
      <div className="flex flex-wrap gap-5 justify-center mt-52 max-w-96 ml-auto mr-auto">
        <Link to={`/login/${UserType.Customer}`}>
          <Card className="dark:hover:bg-slate-950 hover:bg-slate-100">
            <CardHeader>
              <CardTitle className="text-sm">我是顾客</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Staff}`}>
          <Card className="dark:hover:bg-slate-950 hover:bg-slate-100">
            <CardHeader>
              <CardTitle className="text-sm">我是服务员</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Admin}`}>
          <Card className="dark:hover:bg-slate-950 hover:bg-slate-100">
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
