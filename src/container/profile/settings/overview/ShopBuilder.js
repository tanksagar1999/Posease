import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import { AccountWrapper } from "./style";
import AddBasic from "./Shoppage/AddBasic";
import AddAccount from "./Shoppage/AddAccount";

import "../setting.css";

const { TabPane } = Tabs;

const ShopBuilder = () => {
  const [activeTab, changeTab] = useState("BASIC_DETAILS");

  return (
    <>
      <AccountWrapper>
        <PageHeader
          className="shop-Details"
          ghost
          title={
            <Tabs
              type="card"
              activeKey={activeTab}
              size="small"
              onChange={changeTab}
            >
              <TabPane
                tab="Basic Details"
                key="BASIC_DETAILS"
                className="ant-tabs-tab-active"
              ></TabPane>
              <TabPane tab="Account Details" key="ACCOUNT_DETAILS"></TabPane>
            </Tabs>
          }
        />
        <Row>
          <Col xs={24}>
            {activeTab === "BASIC_DETAILS" ? <AddBasic /> : ""}
            {activeTab === "ACCOUNT_DETAILS" ? <AddAccount /> : ""}
          </Col>
        </Row>
      </AccountWrapper>
    </>
  );
};

export { ShopBuilder };
