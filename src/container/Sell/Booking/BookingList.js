import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Modal } from "antd";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "../Style";
import { UserTableStyleWrapper } from "../../pages/style";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../../components/buttons/calendar-button/calendar-button";
import {
  getAllBookingList,
  getBookingById,
} from "../../.././redux/sell/actionCreator";
import { Popover } from "../../../components/popup/popup";
import commonFunction from "../../../utility/commonFunctions";
import "./booking.css";
import { bookingAddInLocalData } from "../../../utility/localStorageControl";
import moment from "moment";

const BookingList = (props) => {
  const { tabChangeToCurrent } = props;
  const dispatch = useDispatch();
  const { BookingList1 } = useSelector((state) => {
    return {
      BookingList1: state.sellData.bookingList,
    };
  }, shallowEqual);
  // console.log("BookingList1", BookingList1);
  const [BookingList, setBookingList] = useState([]);
  const didMount = useRef(false);
  useEffect(() => {
    const fetchdata = async () => {
      let bookinglist = await dispatch(getAllBookingList());
      if (bookinglist?.bookingList?.length) {
        setBookingList([
          ...bookinglist?.bookingList.filter(
            (x) =>
              commonFunction.convertToDate(
                new Date(
                  `${x.details.bookingDetails.delivery_date},${x.details.bookingDetails.delivery_time}`
                ),
                "MM/DD/YYYY"
              ) >= moment().format("L") &&
              commonFunction.convertToDate(
                new Date(
                  `${x.details.bookingDetails.delivery_date},${x.details.bookingDetails.delivery_time}`
                ),
                "MM/DD/YYYY"
              ) <= moment().format("L")
          ),
        ]);
        didMount.current = true;
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (didMount.current) {
      setBookingList([...BookingList1]);
    }
  }, [BookingList1]);

  const [modalVisible, setModelVisible] = useState(false);
  let searchArrByBookingNumber = [];
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

  const dataSource = [];

  if (BookingList.length > 0) {
    BookingList.map((value) => {
      const { _id, created_at, details, customer } = value;
      return dataSource.push({
        id: _id,
        created_at: created_at,
        booking_number: details.bookingDetails?.booking_number,
        customer_mobial: customer?.mobile,
        customer_name: customer.name ? customer.name : "-",
        total: details.priceSummery.total,
        booking_amount: details.bookingDetails.booking_advance
          ? details.bookingDetails.booking_advance
          : "-",
        delivery_date_time:
          details.bookingDetails.delivery_date +
          " " +
          details.bookingDetails.delivery_time,
        dateformatDelivery_date_time: moment(
          details.bookingDetails.delivery_date +
            " " +
            details.bookingDetails.delivery_time
        ).format(),
      });
    });
  }

  const columns = [
    {
      title: "Booking Number",
      dataIndex: "booking_number",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },

    {
      title: "Customer Mobile",
      dataIndex: "customer_mobial",
    },
    ,
    {
      title: "Customer Name",
      dataIndex: "customer_name",
    },
    {
      title: "Booking Amount",
      dataIndex: "booking_amount",
    },
    {
      title: "	Total",
      dataIndex: "total",
    },
    {
      title: "	Created At",
      dataIndex: "created_at",
      sorter: (a, b) =>
        moment(a.created_at).unix() - moment(b.created_at).unix(),
      render: (created_at, record) => (
        <span>
          {commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A")}
        </span>
      ),
    },
    {
      title: "Delivery At",
      dataIndex: "dateformatDelivery_date_time",
      align: "left",
      sorter: (a, b) =>
        moment(a.dateformatDelivery_date_time).unix() -
        moment(b.dateformatDelivery_date_time).unix(),
      render: (text, record) => <span>{record.delivery_date_time}</span>,
    },
  ];

  const getBookingData = async (id) => {
    const bookigData = await dispatch(getBookingById(id));

    if (bookigData) {
      bookigData.bookingIdData.details.localCartInfo &&
        bookingAddInLocalData(
          bookigData.bookingIdData.details.localCartInfo,
          bookigData.bookingIdData
        );
      tabChangeToCurrent("CURRENT");
    }
  };

  return (
    <>
      <Main className="booking_tab bookin_tabtp">
        <CardToolbox>
          <PageHeader
            ghost
            className="rec_booking"
            subTitle={
              <>
                <div className="table_titles">
                  <h2>Bookings</h2>
                  <span className="title-counter">
                    {" "}
                    {BookingList1.length} Bookings{" "}
                  </span>
                </div>
                <div
                  style={{ boxShadow: "none", marginLeft: "10px" }}
                  className="search_lrm"
                ></div>
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <CalendarButtonPageHeader key="1" type="booking" />
                {/* <Popover
                  placement="bottomLeft"
                  content={content}
                  trigger="click"
                >
                  <Button size="small" type="white">
                    <FeatherIcon icon="download" size={14} />
                    Export
                  </Button>
                </Popover> */}
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
                    <Table
                      className="receipt-custom-table"
                      rowKey="id"
                      size="small"
                      dataSource={dataSource}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      onRow={(row) => ({
                        onClick: () => getBookingData(row.id),
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
            </Cards>
          </Col>
        </Row>

        <Modal
          title="Request a Report"
          visible={modalVisible}
          onOk={() => setModelVisible(false)}
          onCancel={() => setModelVisible(false)}
          width={600}
        ></Modal>
      </Main>
    </>
  );
};

export { BookingList };
