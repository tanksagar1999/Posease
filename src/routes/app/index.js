import React, { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import withAdminLayout from "../../layout/withAdminLayout";
import Application from "../../container/Application/Application";
import SmsReceipts from "../../container/Application/SmsReceipts";
import Analytics from "../../container/Application/Analytics";

const AppRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route path={`${path}/appstore`} component={Application} />
        <Route path={`${path}/app/sms-receipts`} component={SmsReceipts} />
        <Route path={`${path}/app/analytics`} component={Analytics} />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(AppRoute);
