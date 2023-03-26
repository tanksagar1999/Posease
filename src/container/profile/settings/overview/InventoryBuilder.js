import React, { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import Inventroy from "./Inventory/Inventory";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper, Main } from "../../../styled";
const InventoryBuilder = () => {
  return (
    <Main className="inventory-builder">
      <AccountWrapper>
        <Row>
          <Col xs={24} className="settings-top">
            <UserTableStyleWrapper>
              <div className="contact-table">
                <TableWrapper className="table-responsive">
                  <Inventroy />
                </TableWrapper>
              </div>
            </UserTableStyleWrapper>
          </Col>
        </Row>
      </AccountWrapper>
    </Main>
  );
};

export { InventoryBuilder };
