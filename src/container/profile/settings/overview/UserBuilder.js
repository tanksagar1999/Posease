import React, { useState, useEffect } from "react";
import { getItem } from "../../../../utility/localStorageControl";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import { useDispatch } from "react-redux";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import Cashier from "./Userpage/Cashier";
import Appuser from "./Userpage/Appuser";
import Waiter from "./Userpage/Waiters";
import Kitchens from "./Userpage/Kitchen";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";
import { getShopDetail } from "../../../../redux/shop/actionCreator";

const { TabPane } = Tabs;
const UserBuilder = (props) => {
  const userDetail = getItem("userDetails");
  const dispatch = useDispatch();
  const search = new URLSearchParams(props.location.search);
  let type = search.get("type");
  const [activeTab, changeTab] = useState(
    type == null
      ? "CASHIER"
      : type == "cashier"
      ? "CASHIER"
      : type == "app_user"
      ? "APP_USER"
      : type == "waiter"
      ? "WAITER"
      : type == "kitchen"
      ? "KITCHEN"
      : "CASHIER"
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchShopDetail() {
      const data = await dispatch(getShopDetail(userDetail._id));
      if (data) {
      }
    }
    if (isMounted) {
      fetchShopDetail();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AccountWrapper>
      <PageHeader
        className="setup-custom-page-header"
        title={
          <Tabs
            type="card"
            activeKey={activeTab}
            size="small"
            onChange={changeTab}
          >
            <TabPane
              tab="Cashiers"
              key="CASHIER"
              className="ant-tabs-tab-active"
            ></TabPane>
            <TabPane tab="App users" key="APP_USER"></TabPane>
            {getItem("waiter_app_enable") && (
              <TabPane tab="Waiters" key="WAITER"></TabPane>
            )}

            {/* <TabPane tab="Kitchen Users" key="KITCHEN"></TabPane> */}
          </Tabs>
        }
      />

      <Row>
        <Col xs={24}>
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                {activeTab === "CASHIER" ? <Cashier /> : ""}
                {activeTab === "APP_USER" ? <Appuser /> : ""}
                {activeTab === "WAITER" ? <Waiter /> : ""}
                {activeTab === "KITCHEN" ? <Kitchens /> : ""}
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export { UserBuilder };
