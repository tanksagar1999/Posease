import React from "react";
import { Row, Col } from "antd";
import { AccountWrapper } from "./style";
import Printers from "./Printerpage/Printers";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const PrinterBuilder = () => {
  return (
    <AccountWrapper>
      <Row>
        <Col xs={24} className="settings-top">
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                <Printers />
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export { PrinterBuilder };
