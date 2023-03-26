import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import Registers from "./Registerpage/Registers";

import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const { TabPane } = Tabs;
const RegisterBuilder = () => {
  const [activeTab, changeTab] = useState();

  return (
    <AccountWrapper>
      <PageHeader
        title={
          <Tabs
            type="card"
            activeKey={activeTab}
            size="small"
            onChange={changeTab}
          >
            <TabPane
              tab="All Register"
              key="first"
              className="ant-tabs-tab-active"
            ></TabPane>
          </Tabs>
        }
      />

      <Row>
        <Col xs={24}>
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                <Registers />
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export default RegisterBuilder;
