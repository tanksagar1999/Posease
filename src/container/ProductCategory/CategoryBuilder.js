import React, { useState } from "react";
import { Row, Col, Tabs, Modal } from "antd";
import { useSelector } from "react-redux";
import { PageHeader } from "../../components/page-headers/page-headers";
import { NavLink } from "react-router-dom";
import { Main, TableWrapper } from "../styled";
import { CategoryList } from "../ProductCategory/List/CategoryList";
import { OrderTicketGroup } from "../ProductCategory/List/OrderTicketGroup";
import { Cards } from "../../components/cards/frame/cards-frame";
import FeatherIcon from "feather-icons-react";
import { UserTableStyleWrapper } from "../pages/style";
import { CardToolbox, ContactPageheaderStyle } from "./Style";
import "./category.css";
import { getItem } from "../../utility/localStorageControl";
const CategoryBuilder = (props) => {
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const { TabPane } = Tabs;
  const search = new URLSearchParams(props.location.search);
  let type = search.get("type");
  const [activeTab, changeTab] = useState(
    type && type == "order_group" ? "ORDER" : "CATEGORY"
  );

  const Actionbuttons = (
    <>
      <div key="1" className="page-header-actions">
        {activeTab === "CATEGORY" ? (
          <NavLink
            to={offLineMode ? "#" : "product-categories/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Product Category
          </NavLink>
        ) : (
          ""
        )}
        {activeTab === "ORDER" ? (
          <NavLink
            to={
              offLineMode
                ? "#"
                : "product-categories/add-new-order-ticket-group"
            }
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Order Ticket Group
          </NavLink>
        ) : (
          ""
        )}
      </div>
    </>
  );

  return (
    <>
      <Main>
        <CardToolbox>
          <ContactPageheaderStyle>
            <PageHeader
              className="comman-custom-pageheader"
              size="small"
              title={[
                <Tabs
                  type="card"
                  activeKey={activeTab}
                  size="small"
                  onChange={changeTab}
                >
                  <TabPane
                    tab="Product Categories"
                    key="CATEGORY"
                    className="ant-tabs-tab-active"
                  ></TabPane>
                  {getItem("orderTicketButton") != null &&
                    getItem("orderTicketButton") && (
                      <TabPane tab="Order Ticket Groups" key="ORDER"></TabPane>
                    )}
                </Tabs>,
              ]}
              buttons={Actionbuttons}
            />
          </ContactPageheaderStyle>
        </CardToolbox>
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
        </Modal>
        <Row gutter={15}>
          <Col md={24}>
            <Cards headless>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    {activeTab === "CATEGORY" && <CategoryList />}
                    {activeTab === "ORDER" && <OrderTicketGroup />}
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default CategoryBuilder;
