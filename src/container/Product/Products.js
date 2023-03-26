import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Modal, Form } from "antd";
import { ImportOutlined, CaretDownOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { UserTableStyleWrapper } from "../pages/style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Popover } from "../../components/popup/popup";
import { SearchOutlined } from "@ant-design/icons";
import "./product.css";
import {
  getAllProductList,
  deleteProduct,
  ExportProduct,
  getAllCategoriesList,
} from "../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { getTaxGroupList } from "../../redux/taxGroup/actionCreator";
import { getItem } from "../../utility/localStorageControl";
const Products = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const { offLineMode, statusSetupApiCall } = useSelector((state) => {
    return {
      offLineMode: state.auth.offlineMode,
      statusSetupApiCall: state.sellData.setUpCacheApiStatus,
    };
  });

  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let isMounted = useRef(true);
  let [productListData, setProductListData] = useState([]);
  const [selectionType] = useState("checkbox");

  const dispatch = useDispatch();
  const [state, setState] = useState();
  let [productCategoryList, setProductCategoryList] = useState([]);
  let [taxGroupList, setTaxGroupList] = useState([]);
  const [loading, setLoading] = useState(false);
  let [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [exportType, setExportType] = useState();
  async function fetchProductList() {
    const getProductList = await dispatch(getAllProductList("sell"));
    if (isMounted.current && getProductList && getProductList.productList)
      setProductListData(
        getProductList.productList ? getProductList.productList : []
      );
  }

  useEffect(() => {
    async function fetchProductCategoryList() {
      const getProductCategoryList = await dispatch(
        getAllCategoriesList("sell")
      );

      if (isMounted.current && getProductCategoryList) {
        let mappedCategoryArray = getProductCategoryList.categoryList.map(
          (category) => {
            return {
              text: category.category_name,
              value: category.category_name,
            };
          }
        );
        setProductCategoryList(mappedCategoryArray);
      }
    }
    async function fetchTaxGroupList() {
      const taxGroupList = await dispatch(getTaxGroupList("sell"));

      if (isMounted.current && taxGroupList) {
        let mappedTaxArray = taxGroupList.taxGroupList.map((taxes) => {
          return { text: taxes.tax_group_name, value: taxes.tax_group_name };
        });
        setTaxGroupList(mappedTaxArray);
      }
    }
    if (isMounted.current) {
      fetchProductList();
      fetchProductCategoryList();
      fetchTaxGroupList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  let email = localStorage.getItem("email_id");

  useEffect(() => {
    if (statusSetupApiCall) {
      fetchProductList();
    }
  }, [statusSetupApiCall]);
  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setExportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setExportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setExportType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const submitExport = async (values) => {
    setLoading(true);
    values.type = exportType;
    let ExportAllEmail = await dispatch(ExportProduct(values));
    if (!ExportAllEmail.error) {
      setLoading(false);
      setModelVisible(false);
    }
  };

  const deleteSelectedProduct = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;

    const getDeletedProduct = await dispatch(
      deleteProduct({ ids: allSelectedRowsForDelete })
    );
    if (
      getDeletedProduct &&
      getDeletedProduct.deletedItem &&
      !getDeletedProduct.deletedItem.error
    ) {
      const getProductList = await dispatch(getAllProductList());
      setModelDeleteVisible(false);
      if (getProductList?.productList) {
        setProductListData(
          getProductList.productList ? getProductList.productList : []
        );
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  const contentforaction = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setLoading(false);
          setModelDeleteVisible(true);
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  /**
   * Added searchArr for manage search by product name
   */
  let [search, setsearch] = useState("");
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };
  const dataSource = [];
  let searchList = productListData.filter((value) =>
    value.product_name.toLowerCase().includes(search.toLowerCase())
  );
  if (searchList.length) {
    searchList.map((value) => {
      const {
        _id,
        product_name,
        product_category,
        price,
        tax_group,
        product_option,
        option_status,
        sort_order,
      } = value;
      return dataSource.push({
        id: _id,
        product_name: <span className="social-name">{product_name}</span>,
        product_option: product_option,
        product_category: product_category
          ? product_category.category_name
          : "-",
        price: price,
        sort_order: sort_order,
        option_status: option_status,
        tax_group: tax_group ? tax_group.tax_group_name : "-",
      });
    });
  }
  const columns = [
    {
      title: (
        <>
          <Popover
            placement="bottomLeft"
            content={contentforaction}
            trigger="click"
          >
            <CaretDownOutlined style={{ marginLeft: "12px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      width: "5%",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div className="product-name">{text}</div>,
        };
      },
    },
    {
      title: "Product Options",
      dataIndex: "product_option",
      key: "product_option",
      // width: "30%",
      render: (data, record) => (
        <span>
          {record.option_status === "regular" &&
          Array.isArray(record.product_option["option_variant_group"])
            ? Array.isArray(record.product_option["option_variant_group"]) &&
              record.product_option["option_variant_group"].length
              ? record.product_option["option_variant_group"].map((value) => (
                  <div key={value.variant_group_name}>
                    {value.variant_group_name}
                  </div>
                ))
              : ""
            : ""}
          {record.option_status === "regular"
            ? Array.isArray(record.product_option["option_addon_group"]) &&
              record.product_option["option_addon_group"].length
              ? record.product_option["option_addon_group"].map((value1) => (
                  <div key={value1.addon_group_name}>
                    {value1.addon_group_name}
                  </div>
                ))
              : ""
            : ""}
          {record.option_status === "combo"
            ? Array.isArray(record.product_option["option_addon_group"]) &&
              record.product_option["option_addon_group"].length
              ? record.product_option["option_addon_group"].map((value1) => (
                  <div key={value1.addon_group_name}>
                    {value1.addon_group_name}
                  </div>
                ))
              : ""
            : ""}
          {record.option_status === "combo"
            ? Array.isArray(record.product_option["option_item_group"]) &&
              record.product_option["option_item_group"].length
              ? record.product_option["option_item_group"].map((value1) => (
                  <div key={value1.item_group_name}>
                    {value1.item_group_name}
                  </div>
                ))
              : ""
            : ""}
        </span>
      ),
    },
    {
      title: "Tax Group",
      dataIndex: "tax_group",
      key: "tax_group",
      filters: taxGroupList,
      align: "left",
      width: "12%",
      onFilter: (value, record) => record.tax_group.indexOf(value) === 0,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
      align: "left",
      filters: productCategoryList,
      onFilter: (value, record) => record.product_category.indexOf(value) === 0,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["descend", "ascend"],
      render: (text) => (
        <div>
          {rsSymbol}
          {text}
        </div>
      ),
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
      align: "left",
      width: "12%",

      sorter: (a, b) => a.sort_order - b.sort_order,
      sortDirections: ["descend", "ascend"],
      render(text) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  return (
    <>
      <Main>
        <CardToolbox>
          <PageHeader
            ghost
            className="comman-other-custom-pageheader"
            subTitle={
              <>
                <div className="table_titles">
                  <h2>Products</h2>
                  <span className="title-counter">
                    {" "}
                    {productListData.length} Products{" "}
                  </span>
                </div>

                <div
                  style={{ boxShadow: "none", marginLeft: "10px" }}
                  className="search_lrm"
                >
                  <Input
                    suffix={<SearchOutlined />}
                    autoFocus
                    placeholder="Search by Name"
                    style={{
                      borderRadius: "30px",
                      width: "250px",
                    }}
                    onChange={(e) => setsearch(e.target.value)}
                  />
                </div>
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <NavLink to="products/import">
                  <Button size="middle" type="white">
                    <ImportOutlined /> Import
                  </Button>
                </NavLink>
                <Popover
                  placement="bottomLeft"
                  content={content}
                  trigger="click"
                >
                  <Button size="middle" type="white">
                    <FeatherIcon icon="download" size={14} />
                    Export
                  </Button>
                </Popover>
                <NavLink
                  to={offLineMode ? "#" : "products/add"}
                  className="ant-btn ant-btn-primary ant-btn-md addprdpls"
                  style={{ color: "#FFF" }}
                  onClick={() =>
                    offLineMode
                      ? setOfflineModeCheck(true)
                      : setOfflineModeCheck(false)
                  }
                >
                  <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
                  Add Products
                </NavLink>
              </div>,
            ]}
          />
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
                  <TableWrapper className="table-responsive ">
                    <Table
                      className="products_lsttable"
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      rowKey="id"
                      size="small"
                      dataSource={dataSource.reverse()}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      onRow={(row) => ({
                        onClick: () =>
                          offLineMode
                            ? setOfflineModeCheck(true)
                            : history.push(`products/edit/${row.id}`),
                      })}
                      pagination={{
                        total: dataSource.length,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "50", "100", "500", "1000"],
                      }}
                    />
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
              <p style={{ display: "none" }}>{loading}</p>
              <Modal
                title="Confirm Delete"
                okText={
                  loading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 16,
                            color: "white",
                            margin: "0px 14px",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    "Delete"
                  )
                }
                visible={modalDeleteVisible}
                onOk={deleteSelectedProduct}
                onCancel={handleCancel}
                width={600}
              >
                <p>Are you sure you want to delete selected products?</p>
              </Modal>
            </Cards>
          </Col>
        </Row>
        <Modal
          title="Export Products"
          visible={modalVisible}
          onOk={form.submit}
          okText={
            loading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 16, color: "white", margin: "0px 2px" }}
                    spin
                  />
                }
              />
            ) : (
              "OK"
            )
          }
          onCancel={() => setModelVisible(false)}
          width={600}
        >
          <div>
            <Form
              style={{ width: "100%" }}
              name="export"
              form={form}
              onFinish={submitExport}
            >
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item
                    label="Send to Email Address"
                    name="email"
                    initialValue={email ? email : ""}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email",
                      },
                      { type: "email", message: "A valid email is required" },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </Main>
    </>
  );
};

export default Products;
