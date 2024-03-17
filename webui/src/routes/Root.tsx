import { Link } from "react-router-dom";
import { UserType } from "./Login";
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function Root() {
  return (
    <>
      <NavBar />
      <div className="flex flex-row gap-5 justify-center mt-10">
        <Link to={`/login/${UserType.Customer}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">我是顾客</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Staff}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">我是服务员</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link to={`/login/${UserType.Admin}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">我是管理员</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

export default Root;
