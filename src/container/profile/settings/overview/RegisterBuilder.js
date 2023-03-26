import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import Registers from "./Registerpage/Registers";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const RegisterBuilder = () => {
  return (
    <AccountWrapper>
      <Row>
        <Col xs={24} className="settings-top">
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

export { RegisterBuilder };
