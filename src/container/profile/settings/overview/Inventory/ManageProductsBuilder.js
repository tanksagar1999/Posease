import React, { useState, useEffect } from "react";
import { Row, Col, Tabs, Button } from "antd";
import { AccountWrapper } from ".././style";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import PosProducts from "./ManageItems/PosProducts";
import InventoryProducts from "./ManageItems/InventoryProducts";
import { UserTableStyleWrapper } from "../../../../pages/style";
import { TableWrapper } from "../../../../styled";
import { Main } from "../../../../styled";
import { useHistory } from "react-router-dom";
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
const ManageProductsBuilder = (props) => {
  const [posProductCount, setPosProductConut] = useState(0);
  const search = new URLSearchParams(props.location.search);
  let type = search.get("type");
  const history = useHistory();
  const [activeTab, changeTab] = useState(
    type && type == "taxes_group" ? "TAX_GROUP" : "TAX"
  );
  const PosListCount = (count) => {
    setPosProductConut(count);
  };
  return (
    <Main>
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
                tab={
                  <div className="drft_counno">
                    POS Products
                    <span>{posProductCount}</span>
                  </div>
                }
                key="TAX"
                className="ant-tabs-tab-active"
                style={{ outline: "none" }}
              ></TabPane>
              {/* <TabPane
              tab="POS Products"
              key="TAX"
              className="ant-tabs-tab-active"
            ></TabPane> */}
              {/* <TabPane
                tab="Inventory Items"
                key="TAX_GROUP"
                className="ant-tabs-tab-active"
              ></TabPane> */}
            </Tabs>
          }
          buttons={[
            <Button key="3" onClick={() => history.push("/inventory")}>
              <ArrowLeftOutlined />
              Go back
            </Button>,
          ]}
        />

        <Row>
          <Col xs={24}>
            <UserTableStyleWrapper>
              <div className="contact-table">
                <TableWrapper className="table-responsive">
                  {activeTab === "TAX" ? (
                    <PosProducts PosListCount={PosListCount} />
                  ) : (
                    ""
                  )}
                  {activeTab === "TAX_GROUP" ? <InventoryProducts /> : ""}
                </TableWrapper>
              </div>
            </UserTableStyleWrapper>
          </Col>
        </Row>
      </AccountWrapper>
    </Main>
  );
};

export { ManageProductsBuilder };
