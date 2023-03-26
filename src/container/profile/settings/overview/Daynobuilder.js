import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import Dyno from "./DynoPage/Dyno";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const Daynobuilder = () => {
  return (
    <AccountWrapper>
      <Row>
        <Col xs={24} className="settings-top">
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                <Dyno />
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export { Daynobuilder };
