import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Space, Spin, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { UserTableStyleWrapper } from "../pages/style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import Highlighter from "react-highlight-words";
import { getAllReceiptsList } from "../../redux/receipts/actionCreator";
import { Popover } from "../../components/popup/popup";
import Exportform from "./Exportform";
import commonFunction from "../../utility/commonFunctions";
import "./receipt.css";
import { getItem } from "../../utility/localStorageControl";
import moment from "moment";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
const Receipts = () => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const history = useHistory();
  let searchInput = useRef(null);
  const dispatch = useDispatch();
  let [search, setsearch] = useState("");
  const [state, setState] = useState();
  const [reportType, setReportType] = useState();
  const {
    totalReceipts,
    currentRegister,
    ReceiptsListDeatils,
    startDate,
    endDate,
  } = useSelector(
    (state) => ({
      ReceiptsListDeatils: state.receipts.ReceiptsList,
      totalReceipts: state.receipts.totalReceipts,
      startDate: state.receipts.startDate,
      endDate: state.receipts.endDate,
      currentRegister: state.register.RegisterList.find((val) => val.active),
    }),
    shallowEqual
  );
  const [loading, setloading] = useState(true);
  console.log("sgaraggsgdferefefedadadasaa", ReceiptsListDeatils);
  const [ReceiptsList, setReceiptList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(async () => {
    setloading(true);
    const receiptList = await dispatch(
      getAllReceiptsList(currentPage, 10, startDate, endDate)
    );
    if (receiptList?.ReceiptsList) {
      // setReceiptList(receiptList.ReceiptsList);
      setloading(false);
    }
  }, [currentRegister, currentPage]);

  const { searchText, searchedColumn } = useSelector((state) => {
    return {
      searchText: state.receipts.searchText,
      searchedColumn: state.receipts.searchedColumn,
    };
  });

  const [modalVisible, setModelVisible] = useState(false);

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
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: "90" }}
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
    onFilterDropdo0wnVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setState({
      ...state,
      searchText: selectedKeys[0],
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({
      ...state,
      searchText: "",
    });
  };
  let searchArrByRecepitsNumber = ReceiptsListDeatils?.filter((value) =>
    value.receipt_number.toLowerCase().includes(search.toLowerCase())
  );

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setReportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setReportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setReportType("CSV");
          setModelVisible(true);
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  if (searchArrByRecepitsNumber.length)
    searchArrByRecepitsNumber.map((value) => {
      const { _id, receipt_number, order_details } = value;
      let created_at;

      if (order_details?.details?.orderTicketsData?.length > 0) {
        created_at = order_details.details.orderTicketsData[0].enterDate;
      } else {
        created_at = order_details.actual_time;
      }
      return dataSource.push({
        id: _id,
        created: created_at,
        receipt_number: receipt_number,
        customer_mobile: order_details?.customer
          ? order_details?.customer.mobile
            ? order_details?.customer.mobile
            : "-"
          : "-",
        payment_status:
          order_details?.details.paymentStatus == "paid" ? "Paid" : "Unpaid",
        total: order_details?.details.priceSummery?.total,
        fulfillmentStatus: order_details?.details.fulfillmentStatus,
        cancelReceipt: order_details?.cancellationStatus ? true : false,
        channel: order_details?.details?.onlineOrder?.Source
          ? order_details?.details?.onlineOrder?.Source
          : order_details?.details.orderType == "CustomTable"
          ? "Dine In"
          : order_details?.details.orderType,
      });
    });

  let lastIndex = 0;
  const updateIndex = () => {
    lastIndex++;
    return lastIndex;
  };
  const columns = [
    {
      title: "Bill Number",
      dataIndex: "receipt_number",
      key: "receipt_number",
      width: "25%",
      className: "center-col-padding",
      render(text, record) {
        let path = `#`;
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: record.cancelReceipt ? (
            <NavLink
              to={path}
              style={{ textDecoration: "line-through", color: "#008cba" }}
            >
              {text}
            </NavLink>
          ) : (
            <NavLink to={path} style={{ color: "#008cba" }}>
              {text}
            </NavLink>
          ),
        };
      },
    },
    {
      title: "Created At",
      dataIndex: "created",
      key: `created${updateIndex()}`,
      width: "20%",
      render(created_at, record) {
        return {
          children: record.cancelReceipt ? (
            <span style={{ textDecoration: "line-through" }}>
              {commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A")}
            </span>
          ) : (
            <span>
              {commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A")}
            </span>
          ),
        };
      },
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: `channel`,
      width: "15%",
      render(text, record) {
        return {
          children: record.cancelReceipt ? (
            <div style={{ textDecoration: "line-through" }}> {text}</div>
          ) : (
            <div>{text}</div>
          ),
        };
      },
    },
    {
      title: "Customer Mobile",
      dataIndex: "customer_mobile",
      key: `customer_mobile${updateIndex()}`,
      width: "15%",
      ...getColumnSearchProps("customer_mobile"),
      render(text, record) {
        return {
          children: record.cancelReceipt ? (
            <div style={{ textDecoration: "line-through" }}> {text}</div>
          ) : (
            <div>{text}</div>
          ),
        };
      },
    },
    {
      title: "Fulfillment Status",
      dataIndex: "fulfillmentStatus",
      width: "15%",
      filters: [
        {
          text: "Unfulfilled",
          value: "Unfulfilled",
        },
        {
          text: "Fulfilled",
          value: "Fulfilled",
        },
      ],
      onFilter: (value, record) => record.fulfillmentStatus.includes(value),
      render(text, record) {
        return {
          children: record.cancelReceipt ? (
            <div style={{ textDecoration: "line-through" }}> {text}</div>
          ) : (
            <div>{text}</div>
          ),
        };
      },
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      width: "15%",
      key: `payment_status${updateIndex()}`,
      filters: [
        {
          text: "Paid",
          value: "Paid",
        },
        {
          text: "Unpaid",
          value: "Unpaid",
        },
      ],
      onFilter: (value, record) => record.payment_status.includes(value),
      render(text, record) {
        return {
          children: record.cancelReceipt ? (
            <div style={{ textDecoration: "line-through" }}> {text}</div>
          ) : (
            <div>{text}</div>
          ),
        };
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "10%",
      align: "left",
      render(text, record) {
        return {
          children: record.cancelReceipt ? (
            <div style={{ textDecoration: "line-through" }}>
              {rsSymbol}
              {Number(text).toFixed(2)}
            </div>
          ) : (
            <div>
              {rsSymbol}
              {Number(text).toFixed(2)}
            </div>
          ),
        };
      },
    },
  ];
  let changePageData = async (value, limit) => {
    setloading(true);
    const receiptList = await dispatch(getAllReceiptsList(value, limit));
    if (receiptList?.ReceiptsList) {
      // setReceiptList(receiptList.ReceiptsList);
      setloading(false);
    }
    // dispatch(getAllReceiptsList(value, limit));
  };

  let locale = {
    emptyText: (
      <Spin
        style={{
          marginTop: "20px",
        }}
      />
    ),
  };
  return (
    <>
      <Main>
        <CardToolbox>
          <PageHeader
            ghost
            title=""
            subTitle={
              <>
                <div className="table_titles">
                  <h2>Receipts</h2>
                  {/* <span className="title-counter">
                    {totalReceipts} Receipts
                  </span> */}
                </div>
                &nbsp;
                <Input
                  suffix={<SearchOutlined />}
                  autoFocus
                  placeholder="Search by Bill Number"
                  style={{
                    borderRadius: "30px",
                    width: "250px",
                  }}
                  onChange={(e) => setsearch(e.target.value)}
                  value={search}
                  autoComplete="off"
                  className="receipts-search"
                />
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <Tooltip
                  title={
                    <p
                      style={{
                        textAlign: "center",
                        marginTop: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      Showing receipts from{" "}
                      {startDate
                        ? moment(startDate).format("MMMM Do YYYY")
                        : moment()
                            .startOf("month")
                            .format("MMMM Do YYYY")}
                      {" to"}{" "}
                      {endDate
                        ? moment(endDate).format("MMMM Do YYYY")
                        : moment().format("MMMM Do YYYY")}
                    </p>
                  }
                >
                  <ExclamationCircleOutlined
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  />
                </Tooltip>
                <CalendarButtonPageHeader key="1" type="receipts" />
                <Popover
                  placement="bottomLeft"
                  content={content}
                  trigger="click"
                >
                  <Button size="small" type="white">
                    <FeatherIcon icon="download" size={14} />
                    Export
                  </Button>
                </Popover>
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
                    {loading ? (
                      <>
                        <Table
                          className="receipt-custom-table"
                          locale={locale}
                          rowKey="id"
                          size="small"
                          dataSource={[]}
                          columns={columns}
                          fixed={true}
                          scroll={{ x: 800 }}
                          onRow={(row) => ({
                            onClick: () => {
                              history.push(`receipts/${row.id}`);
                            },
                          })}
                          pagination={false}
                          // pagination={{
                          //   total: totalReceipts,
                          //   showSizeChanger: true,
                          //   pageSizeOptions: ["10", "50", "100", "500", "1000"],
                          //   onChange: (currentpage, limit) => {
                          //     changePageData(currentpage, limit);
                          //   },
                          // }}
                        />
                      </>
                    ) : (
                      <Table
                        className="receipt-custom-table"
                        locale={loading ? locale : false}
                        rowKey="id"
                        size="small"
                        dataSource={dataSource}
                        columns={columns}
                        fixed={true}
                        scroll={{ x: 800 }}
                        onRow={(row) => ({
                          onClick: () => {
                            history.push(`receipts/${row.id}`);
                          },
                        })}
                        pagination={false}
                        // pagination={{
                        //   total: totalReceipts,
                        //   showSizeChanger: true,
                        //   pageSizeOptions: ["10", "50", "100", "500", "1000"],
                        //   onChange: (currentpage, limit) => {
                        //     changePageData(currentpage, limit);
                        //   },
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
                  className="remove-extra-css"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage == 1 ? true : false}
                >
                  <FeatherIcon
                    size={20}
                    icon="chevron-left"
                    style={{ position: "relative", left: "-9px", top: "3px" }}
                  />
                </Button>
                {/* <p>{dataSource?.length}</p> */}
                <Button
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50px",
                    marginLeft: "40px",
                  }}
                  className="remove-extra-css"
                  disabled={ReceiptsListDeatils?.length < 10 ? true : false}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FeatherIcon
                    size={20}
                    icon="chevron-right"
                    style={{ position: "relative", left: "-7px", top: "3px" }}
                  />
                </Button>
              </p>
            </Cards>
          </Col>
        </Row>

        <Exportform
          modalVisible={modalVisible}
          setModelVisible={setModelVisible}
          reportType={reportType}
        />
      </Main>
    </>
  );
};

export default Receipts;
