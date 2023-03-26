import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import Bingages from "./BingagePage/Bingages";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const BingageBuilder = () => {
  return (
    <AccountWrapper>
      <Row>
        <Col xs={24} className="settings-top">
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                <Bingages />
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export { BingageBuilder };
