import React from "react";

export enum UserType {
  Customer = "customer",
  Staff = "staff",
  Admin = "admin",
}

export interface LoginProps {
  type: UserType;
}

const Login: React.FC<LoginProps> = ({ type }) => {
  return (
    <div className="h-screen dark:bg-black">
      <div className="dark:text-white">Login</div>
    </div>
  );
}

export default Login;
