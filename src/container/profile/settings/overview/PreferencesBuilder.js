import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import { AccountWrapper } from "./style";
import Selling from "./Preferencespage/Selling";
import Printing from "./Preferencespage/Printing";
import Permission from "./Preferencespage/Permission";

import "../setting.css";
const { TabPane } = Tabs;

const PreferencesBuilder = () => {
  const [activeTab, changeTab] = useState();

  return (
    <>
      <AccountWrapper>
        <PageHeader
          ghost
          title={
            <Tabs
              type="card"
              activeKey={activeTab}
              size="small"
              onChange={changeTab}
            >
              <TabPane
                tab="Selling Preferences"
                key="first"
                className="ant-tabs-tab-active"
              ></TabPane>
              <TabPane tab="Printing Preferences" key="second"></TabPane>
              <TabPane tab="Permission Preferences" key="third"></TabPane>
            </Tabs>
          }
        />
        <Row>
          <Col xs={24}>
            {activeTab != "second" &&
            activeTab !== "third" &&
            activeTab !== "fourth" ? (
              <Selling />
            ) : (
              ""
            )}
            {activeTab == "second" &&
            activeTab !== "one" &&
            activeTab !== "third" &&
            activeTab !== "fourth" ? (
              <Printing />
            ) : (
              ""
            )}
            {activeTab == "third" &&
            activeTab !== "one" &&
            activeTab !== "second" &&
            activeTab !== "fourth" ? (
              <Permission />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </AccountWrapper>
    </>
  );
};

export { PreferencesBuilder };
