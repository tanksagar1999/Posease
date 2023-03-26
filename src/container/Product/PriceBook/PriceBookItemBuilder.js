import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Tabs, Breadcrumb, Modal, Form, Input } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { useHistory, NavLink } from "react-router-dom";
import { Main, TableWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { useLocation, useParams } from "react-router-dom";
import { ItemsList } from "../PriceBook/Items/Items";
import { VariantPrice } from "../PriceBook/Items/Variant";
import { AddonPrice } from "../PriceBook/Items/Addons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { UserTableStyleWrapper } from "../../pages/style";
import { TopToolBox, CardToolbox, ContactPageheaderStyle } from "../Style";
import FeatherIcon from "feather-icons-react";
import { ImportOutlined } from "@ant-design/icons";
import { Popover } from "../../../components/popup/popup";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateProductPriceBook,
  exportPricebookProduct,
  exportPricebookAddons,
  exportPricebookVarints,
} from "../../../redux/pricebook/actionCreator";

import { getAllProductList } from "../../../redux/products/actionCreator";
const PriceBookItemBuilder = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { TabPane } = Tabs;
  const productListRef = useRef();
  const addonListRef = useRef();
  const variantListRef = useRef();
  let [productList, setProductList] = useState();
  const dispatch = useDispatch();
  const [activeTab, changeTab] = useState("1");
  const location = useLocation();
  const [ExportType, SetExportType] = useState("");
  const queryParams = useParams();

  function prodcutListPass(item) {
    setProductList(item);
  }
  const handleUpdateProductList = async () => {
    if (productList.length > 0) {
      let obj;
      productList[0].product_id && (obj = { products: productList });
      productList[0].variant_id && (obj = { variants: productList });
      productList[0].addon_id && (obj = { addons: productList });

      const getAllUpdateData = await dispatch(
        UpdateProductPriceBook(obj, queryParams.pricebook_id)
      );

      if (getAllUpdateData && getAllUpdateData.UpdateProductData) {
        if (obj.products) {
          let productList = await productListRef.current.Productlist();

          if (productList) {
            let list = await dispatch(getAllProductList());
          }
        }

        obj.addons && addonListRef.current.Addonslist();
        obj.variants && variantListRef.current.Variantlist();
      }
    }
    setModelVisible(false);
  };
  const [modalVisible, setModelVisible] = useState(false);

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelVisible1(false);
  };
  const [modalVisible1, setModelVisible1] = useState(false);
  let email = localStorage.getItem("email_id");

  const submitExport = (values) => {
    values.type = ExportType;
    if (ExportType && activeTab == 1 && activeTab != 2 && activeTab != 3) {
      dispatch(exportPricebookProduct(values, queryParams.pricebook_id));
      setModelVisible1(false);
    } else if (
      ExportType &&
      activeTab == 2 &&
      activeTab != 3 &&
      activeTab != 1
    ) {
      dispatch(exportPricebookVarints(values, queryParams.pricebook_id));
      setModelVisible1(false);
    } else {
      dispatch(exportPricebookAddons(values, queryParams.pricebook_id));
      setModelVisible1(false);
    }
  };

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible1(true);
          SetExportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible1(true);
          SetExportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible1(true);
          SetExportType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const Actionbuttons = (
    <>
      {activeTab != 2 && activeTab != 3 && activeTab == 1 ? (
        <div key="1" className="page-header-actions">
          <NavLink
            to={`pricebook-items/produt/import/${queryParams.pricebook_id}`}
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
          <Button
            size="middle"
            type="primary"
            Style={{ padding: 10 }}
            onClick={() => history.push("/products/pricebook")}
          >
            Go back
          </Button>
          <Button
            size="middle"
            type="primary"
            Style={{ padding: 10 }}
            onClick={() => setModelVisible(true)}
          >
            Save Product
          </Button>
        </div>
      ) : (
        ""
      )}
      {activeTab == 2 && activeTab !== 3 && activeTab !== 1 ? (
        <div key="1" className="page-header-actions">
          <NavLink
            to="pricebook-items/variant/import"
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
          <Button
            size="middle"
            type="primary"
            Style={{ padding: 10 }}
            onClick={() => history.push("/products/pricebook")}
          >
            Go back
          </Button>
          <Button
            size="middle"
            type="primary"
            Style={{ padding: 10 }}
            onClick={() => setModelVisible(true)}
          >
            Save Variant
          </Button>
        </div>
      ) : (
        ""
      )}
      {activeTab == 3 && activeTab != 1 && activeTab != 2 ? (
        <div key="1" className="page-header-actions">
          <NavLink
            to={`pricebook-items/addon/import/${queryParams.pricebook_id}`}
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
          <Button
            size="middle"
            type="primary"
            Style={{ padding: 10 }}
            onClick={() => history.push("/products/pricebook")}
          >
            Go back
          </Button>
          <Button
            size="middle"
            type="ant-btn ant-btn-default btn-cancelprimary"
            Style={{ padding: 10 }}
            onClick={() => setModelVisible(true)}
          >
            Save Addon
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );

  return (
    <Main>
      <CardToolbox>
        <ContactPageheaderStyle>
          <PageHeader
            title={[
              <Tabs
                type="card"
                activeKey={activeTab}
                size="small"
                onChange={changeTab}
              >
                <TabPane tab="Products" key="1"></TabPane>
                <TabPane tab="Variants" key="2"></TabPane>
                <TabPane tab="Addons" key="3"></TabPane>
              </Tabs>,
            ]}
            buttons={Actionbuttons}
          />
        </ContactPageheaderStyle>
      </CardToolbox>
      <Row gutter={15}>
        <Col md={24}>
          <Cards headless>
            <UserTableStyleWrapper>
              <div className="contact-table">
                <TableWrapper className="table-responsive">
                  {activeTab != 2 && activeTab != 3 && activeTab == 1 ? (
                    <ItemsList passFun={prodcutListPass} ref={productListRef} />
                  ) : (
                    ""
                  )}
                  {activeTab == 2 && activeTab !== 3 && activeTab !== 1 ? (
                    <VariantPrice
                      passFun={prodcutListPass}
                      ref={variantListRef}
                    />
                  ) : (
                    ""
                  )}
                  {activeTab == 3 && activeTab != 1 && activeTab != 2 ? (
                    <AddonPrice passFun={prodcutListPass} ref={addonListRef} />
                  ) : (
                    ""
                  )}
                </TableWrapper>
              </div>
              <Modal
                title={
                  activeTab != 2 && activeTab != 3 && activeTab == 1
                    ? "Save Products"
                    : activeTab == 2 && activeTab !== 3 && activeTab !== 1
                    ? "Save Variants"
                    : "Save Addons"
                }
                visible={modalVisible}
                onOk={handleUpdateProductList}
                onCancel={handleCancel}
                okText={
                  activeTab != 2 && activeTab != 3 && activeTab == 1
                    ? "Save Products"
                    : activeTab == 2 && activeTab !== 3 && activeTab !== 1
                    ? "Save Variants"
                    : "Save Addons"
                }
                width={600}
              >
                <p>
                  Are you sure you want to save{" "}
                  {activeTab != 2 && activeTab != 3 && activeTab == 1
                    ? "products"
                    : activeTab == 2 && activeTab !== 3 && activeTab !== 1
                    ? "variants"
                    : "addons"}
                  ?
                </p>
              </Modal>
              <Modal
                title={`Export ${
                  activeTab != 2 && activeTab != 3 && activeTab == 1
                    ? "Products"
                    : activeTab == 2 && activeTab !== 3 && activeTab !== 1
                    ? "Variants"
                    : "Addons"
                }`}
                visible={modalVisible1}
                width={600}
                onOk={form.submit}
                onCancel={handleCancel}
              >
                <Form name="export" form={form} onFinish={submitExport}>
                  <div className="add-product-block">
                    <div className="add-product-content">
                      <Form.Item
                        name="email"
                        initialValue={email ? email : ""}
                        label="Send to Email Address"
                        rules={[
                          {
                            message: "Email address is required",
                            required: true,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Modal>
            </UserTableStyleWrapper>
          </Cards>
        </Col>
      </Row>
    </Main>
  );
};

export default PriceBookItemBuilder;
