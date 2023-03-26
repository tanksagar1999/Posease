import React, { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthLayout from "../container/profile/authentication/Index";
import { getItem } from "../utility/localStorageControl";
import { SignIn } from "../container/profile/authentication/overview/SignIn";
import { SignUp } from "../container/profile/authentication/overview/Signup";
import { ForgotPassword } from "../container/profile/authentication/overview/ForgotPassword";
import { ResetPassword } from "../container/profile/authentication/overview/ResetPassword";
import { PinAuth } from "../container/profile/authentication/overview/PinAuth";

const NotFound = () => {
  const userDetails = getItem("userDetails");

  if (userDetails !== null) {
    return <Redirect to="/pin-auth" />;
  } else if (window.location.pathname != "/app/resetPassword") {
    return <Redirect to="/login" />;
  } else {
    return "";
  }
};

const FrontendRoutes = () => {
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/login" component={SignIn} />
        <Route exact path="/pin-auth" component={PinAuth} />
        <Route exact path="*" component={NotFound} />
      </Suspense>
    </Switch>
  );
};

export default AuthLayout(FrontendRoutes);
