import React from "react";
import LoginForm from "../components/forms/LoginForm";

function Login() {
  return (
    <div className="flex justify-center mx-auto px-[14px]">
      <div className="mt-[50px]">
        <h1 className="text-[1.5rem] md:text-[2.5rem] leading-[100%]">
          Continue from where you left off!
        </h1>
        <p className="text-[0.865rem] md:text-[1rem] mt-[12px] text-neutral-400">
          Few steps a away from your project management.
        </p>

        <div className="mt-[20px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
