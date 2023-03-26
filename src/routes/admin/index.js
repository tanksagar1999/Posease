import React, { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import withAdminLayout from "../../layout/withAdminLayout";
import AdminDashboard from "../../container/dashboard/Admin";
import Enquiry from "../../container/enquiryManagement/Enquiry";
import UserManagement from "../../container/userManagement/UserManagement";

const Admin = () => {
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
        <Route exact path={`${path}`} component={AdminDashboard} />
        <Route exact path={`${path}/enquiry-management`} component={Enquiry} />

        <Route
          exact
          path={`${path}/user-management`}
          component={UserManagement}
        />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(Admin);
