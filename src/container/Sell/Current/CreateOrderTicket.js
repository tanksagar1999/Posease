import React, { useState } from "react";
import { Row, Col, Tabs, Breadcrumb } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { NavLink } from "react-router-dom";
import { Main } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { ItemsList } from "../PriceBook/Items/Items";
import { VariantPrice } from "../PriceBook/Items/Variant";
import { AddonPrice } from "../PriceBook/Items/Addons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import FeatherIcon from "feather-icons-react";
import { ImportOutlined } from "@ant-design/icons";
import { Popover } from "../../../components/popup/popup";

const PriceBookItemBuilder = () => {
  const { TabPane } = Tabs;

  const [modalVisible, setModelVisible] = useState(false);

  const content = (
    <>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  return (
    <>
      <PageHeader
        title="PriceBook items"
        buttons={[
          <div key="1" className="page-header-actions">
            <NavLink
              to="/admin/products/pricebook/import"
              className="ant-btn ant-btn-white ant-btn-md"
            >
              <ImportOutlined /> Import
            </NavLink>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <Button size="small" type="white">
                <FeatherIcon icon="download" size={14} />
                Export
              </Button>
            </Popover>
            <NavLink
              to="/admin/products/pricebook/add"
              className="ant-btn ant-btn-primary ant-btn-md"
            >
              <FeatherIcon icon="plus" size={14} />
              Add New
            </NavLink>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col md={24} xs={24}>
            <Cards headless>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <NavLink to="/admin/dashboard">Home</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <NavLink to="/admin/products/">Product</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Edit</Breadcrumb.Item>
              </Breadcrumb>
            </Cards>
            <Cards headless>
              <Tabs type="card">
                <TabPane tab="Products" key="1">
                  <ItemsList />
                </TabPane>
                <TabPane tab="Variants" key="2">
                  <VariantPrice />
                </TabPane>
                <TabPane tab="Addons" key="3">
                  <AddonPrice />
                </TabPane>
              </Tabs>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default PriceBookItemBuilder;
