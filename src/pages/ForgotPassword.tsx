import React from "react";
import LoginForm from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <div className="flex justify-center mx-auto">
      <div className="mt-[50px]">
        <h1 className="text-[2.5rem] leading-[100%]">Forgot Password?</h1>
        <p className="mt-[12px]">Reset password now.</p>

        <div className="mt-[20px]">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
