import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col, Table, Input, Modal, Space, Button, Form, Spin } from "antd";
import { SearchOutlined, ImportOutlined } from "@ant-design/icons";
import { UserTableStyleWrapper } from "../pages/style";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Cards } from "../../components/cards/frame/cards-frame";
import Highlighter from "react-highlight-words";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover } from "../../components/popup/popup";
import {
  getCustomerList,
  filterListData,
  ExportCustomer,
} from "../../redux/customer/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import { useHistory } from "react-router-dom";
import "./customer.css";
import { getItem } from "../../utility/localStorageControl";

const Customer = () => {
  const { path } = useRouteMatch();
  let location = useLocation();
  const dispatch = useDispatch();
  const [sizeOfData, setSize] = useState(10);
  let searchInput = useRef(null);
  const history = useHistory();
  const [form] = Form.useForm();
  const [changePage, setChangePage] = useState(1);
  const [totalCustomer, setTotalCustomer] = useState();
  const [CustomerListData, setCustomerListData] = useState([]);
  const [exportType, setExportType] = useState();
  const [loading, setLoading] = useState(false);
  let isMounted = useRef(true);
  const [modalVisible, setModelVisible] = useState(false);
  const [loader, setLoader] = useState(true);

  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let searchText = "";
  useEffect(() => {
    async function fetchCustomerList() {
      setLoader(true);

      if (location.state) {
        setChangePage(location.state.currentPage_data);
        setSize(location.state.sizeOf_data);
      }
      const getcustomerList = await dispatch(
        getCustomerList(
          location.state ? location.state.currentPage_data : changePage,
          location.state ? location.state.sizeOf_data : sizeOfData
        )
      );
      if (getcustomerList && getcustomerList.customerListData) {
        setLoader(false);
        setCustomerListData(getcustomerList.customerListData);
        setTotalCustomer(getcustomerList.totalCounts);
      }
    }
    fetchCustomerList();
  }, [changePage]);

  let changePageData = async (value, limit) => {
    setLoader(true);
    const getcustomerList = await dispatch(getCustomerList(value, limit));
    if (getcustomerList && getcustomerList.customerListData)
      setCustomerListData(getcustomerList.customerListData);
    setTotalCustomer(getcustomerList.totalCounts);
    setLoader(false);
  };

  let email = localStorage.getItem("email_id");

  const onSubmit = async (values) => {
    setLoading(true);
    if (loading) {
      setModelVisible(false);
      setLoading(false);
    }
    values.type = exportType;
    let ExportCustomerAPI = await dispatch(ExportCustomer(values));
    // if (!ExportCustomerAPI.error) {
    //   setLoading(false);
    //   setModelVisible(false);
    // }
  };

  const handleCancel = (e) => {
    setModelVisible(false);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, height: 35, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button onClick={() => handleReset(clearFilters)} size="small">
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#BD025D" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const onSearch = async (e) => {
    let searchtext = e.target.value;
    if (searchtext === "") {
      const getcustomerList = await dispatch(getCustomerList(1, 10));
      if (getcustomerList && getcustomerList.customerListData) setChangePage(1);
      setCustomerListData(getcustomerList.customerListData);
      setTotalCustomer(getcustomerList.totalCounts);
    } else {
      const getSaerchList = await dispatch(filterListData(searchtext));
      if (getSaerchList && getSaerchList.customerListData)
        setCustomerListData(getSaerchList.customerListData);
      setTotalCustomer(getSaerchList.totalCounts);
    }
  };

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
  let locale = {
    emptyText: (
      <Spin
        style={{
          marginTop: "20px",
        }}
      />
    ),
  };
  const dataSource = [];
  if (CustomerListData.length > 0)
    CustomerListData.map((value, i) => {
      const {
        _id,
        name,
        mobile,
        order_count,
        order_value,
        created_at,
        last_seen,
      } = value;
      return dataSource.push({
        id: _id,
        key: i,
        name: name,
        mobile: mobile,
        order_count: order_value,
        order_value: order_count,
        created_at: created_at,
        last_seen: last_seen,
      });
    });

  const columns = [
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: "20%",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      onFilter: (value, record) => record.name.includes(value),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Order Count",
      dataIndex: "order_count",
      key: "order_count",
      align: "left",
      sorter: (a, b) => a.order_count - b.order_count,
    },
    {
      title: "Order Value",
      dataIndex: "order_value",
      key: "order_value",
      align: "left",
      sorter: (a, b) => a.order_value - b.order_value,
      render: (order_value) => (
        <span>
          {rsSymbol}
          {order_value}
        </span>
      ),
    },
    {
      title: "Last Seen",
      dataIndex: "last_seen",
      key: "last_seen",
      align: "left",
      render: (last_seen, record) => (
        <span>
          {last_seen == "-"
            ? last_seen
            : commonFunction.convertToDate(last_seen, "MMM DD, Y, h:mm A")}
        </span>
      ),
    },
  ];

  return (
    <>
      <Main>
        <CardToolbox>
          <PageHeader
            ghost
            className="comman-other-custom-pageheader receipts-top0"
            subTitle={
              <>
                <div className="table_titles">
                  <h2>Customers</h2>
                  {/* <span className="title-counter">
                    {totalCustomer} Customers
                  </span> */}
                </div>
                <div
                  style={{ boxShadow: "none", marginLeft: "10px" }}
                  className="search_lrm"
                >
                  <Input
                    suffix={<SearchOutlined />}
                    autoFocus
                    placeholder="Search by Mobile no"
                    style={{
                      borderRadius: "30px",
                      width: "250px",
                    }}
                    onChange={(e) => onSearch(e)}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </div>
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <NavLink to={`${path}/import`}>
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
                  to={`${path}/add`}
                  className="ant-btn ant-btn-primary ant-btn-md addprdpls"
                >
                  <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
                  Add Customer
                </NavLink>
              </div>,
            ]}
          />
        </CardToolbox>
        <Row gutter={15}>
          <Col md={24}>
            <Cards headless>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    {loader ? (
                      <Table
                        locale={locale}
                        rowKey="_id"
                        onRow={(row) => ({
                          onClick: () =>
                            history.push(`${path}/edit/` + row.id, {
                              current_page: changePage,
                              size_data: sizeOfData,
                            }),
                        })}
                        size="small"
                        dataSource={[]}
                        columns={columns}
                        fixed={true}
                        scroll={{ x: 800 }}
                        pagination={false}
                        // pagination={{
                        //   total: totalCustomer,
                        //   pageSize: sizeOfData,
                        //   current: changePage,
                        //   onChange: (currentpage, size) => {
                        //     changePageData(currentpage, size);
                        //     setChangePage(currentpage);
                        //     setSize(size);
                        //   },
                        //   showSizeChanger: totalCustomer > 10 ? true : false,
                        //   onShowSizeChange: (current, size) =>
                        //     changePageData(current, size),
                        // }}
                      />
                    ) : (
                      <Table
                        rowKey="_id"
                        onRow={(row) => ({
                          onClick: () =>
                            history.push(`${path}/edit/` + row.id, {
                              current_page: changePage,
                              size_data: sizeOfData,
                            }),
                        })}
                        size="small"
                        dataSource={dataSource}
                        columns={columns}
                        fixed={true}
                        scroll={{ x: 800 }}
                        pagination={false}

                        // pagination={{
                        //   total: totalCustomer,
                        //   pageSize: sizeOfData,
                        //   current: changePage,
                        //   onChange: (currentpage, size) => {
                        //     changePageData(currentpage, size);
                        //     setChangePage(currentpage);
                        //     setSize(size);
                        //   },
                        //   showSizeChanger: totalCustomer > 10 ? true : false,
                        //   onShowSizeChange: (current, size) =>
                        //     changePageData(current, size),
                        // }}
                      />
                    )}
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Button
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50px",
                  }}
                  onClick={() => setChangePage(changePage - 1)}
                  disabled={changePage == 1 ? true : false}
                >
                  <FeatherIcon
                    size={20}
                    icon="chevron-left"
                    style={{ position: "relative", left: "-11px", top: "2px" }}
                  />
                </Button>
                <Button
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50px",
                    marginLeft: "40px",
                  }}
                  onClick={() => setChangePage(changePage + 1)}
                >
                  <FeatherIcon
                    size={20}
                    icon="chevron-right"
                    style={{ position: "relative", left: "-9px", top: "2px" }}
                  />
                </Button>
              </p>
            </Cards>
          </Col>
        </Row>
        <Modal
          title="Export Customer"
          visible={modalVisible}
          onOk={form.submit}
          okText={"OK"}
          onCancel={handleCancel}
          width={600}
        >
          <Form form={form} name="export_customer" onFinish={onSubmit}>
            <div className="add-product-block">
              <div className="add-product-content">
                {loading ? (
                  <p>
                    It would take about 5 to 10 minutes to export and you will
                    be send by email.
                  </p>
                ) : (
                  <Form.Item
                    name="email"
                    label="Send to Email Address"
                    initialValue={email}
                    rules={[
                      { message: "Email address is required", required: true },
                      { type: "email", message: "A valid semail is required" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )}
              </div>
            </div>
          </Form>
        </Modal>
      </Main>
    </>
  );
};

export default Customer;
