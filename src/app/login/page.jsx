import Image from "next/image";
import React from "react";
import LoginImage from "@/images/login-img.jpg";

const Login = () => {
  return (
    <div className="flex items-center justify-center">
      <Image src={LoginImage} alt="login-img" width={300} height={300} />
    </div>
  );
};

export default Login;
