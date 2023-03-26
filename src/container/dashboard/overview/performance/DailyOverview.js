import React, { useState, useEffect, useRef } from "react";
import { Progress, Input, Modal, Form } from "antd";
import FeatherIcon from "feather-icons-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { OverviewCard } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { Button } from "../../../../components/buttons/buttons";
import { Dropdown } from "../../../../components/dropdown/dropdown";
import { Popover } from "../../../../components/popup/popup";
import { getItem, setItem } from "../../../../utility/localStorageControl";
const DailyOverview = ({ dashBoardDataDetails }) => {
  const { rtl } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [totalBooking, setTotalBooking] = useState(0);
  useEffect(() => {
    if (
      dashBoardDataDetails &&
      dashBoardDataDetails.total_booking &&
      dashBoardDataDetails.total_booking.length > 0
    ) {
      setTotalBooking(dashBoardDataDetails.total_booking[0].count);
    }
  }, [dashBoardDataDetails]);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
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
    <OverviewCard>
      <div className="d-flex align-items-center justify-content-between overview-head">
        <Heading as="h4">Daily Overview</Heading>
        {/* <Popover placement="bottomLeft" content={content} trigger="click">
          <Button>
            Export <FeatherIcon icon="chevron-down" size={14} />
          </Button>
        </Popover> */}
      </div>
      <div className="overview-box">
        <Modal
          title="Request a Report"
          visible={modalVisible}
          onOk={() => setModelVisible(false)}
          onCancel={() => setModelVisible(false)}
          width={600}
        >
          <div>
            <Form style={{ width: "100%" }} name="addProduct">
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item name="Email Address" label="Send to Email Address">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div
              className="icon-box box-primary"
              style={{
                backgroundColor: "#5f63f210",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="50px"
                width="50px"
                viewBox="0 0 32 30.665"
              >
                <g id="graph" transform="translate(-8 -8.835)">
                  <g id="bold_1_" transform="translate(8 8.835)">
                    <g
                      id="Group_1113"
                      data-name="Group 1113"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Union_7"
                        data-name="Union 7"
                        d="M.39,12.942a1.336,1.336,0,0,1,0-1.886L8.347,3.1,6.957,1.708A1,1,0,0,1,7.666,0h4.665a1,1,0,0,1,1,1V5.666a1,1,0,0,1-1.708.707l-1.39-1.39L2.276,12.942a1.336,1.336,0,0,1-1.886,0Z"
                        transform="translate(2.669 0)"
                        fill="#5f63f2"
                        opacity="0.5"
                      />
                      <g
                        id="Group_1112"
                        data-name="Group 1112"
                        transform="translate(1.334 6.665)"
                      >
                        <path
                          id="Path_1026"
                          data-name="Path 1026"
                          d="M16.667,19.166v7.666h-8V19.166A1.666,1.666,0,0,1,10.333,17.5H15A1.668,1.668,0,0,1,16.667,19.166Z"
                          transform="translate(-8.667 -6.834)"
                          fill="#5f63f2"
                        />
                        <path
                          id="Path_1027"
                          data-name="Path 1027"
                          d="M22,16.5v13H14v-13a1.666,1.666,0,0,1,1.666-1.666h4.666A1.665,1.665,0,0,1,22,16.5Z"
                          transform="translate(-3.334 -9.5)"
                          fill="#5f63f2"
                        />
                        <path
                          id="Path_1028"
                          data-name="Path 1028"
                          d="M27.333,13.833V32.167h-8V13.833A1.666,1.666,0,0,1,21,12.167h4.668A1.666,1.666,0,0,1,27.333,13.833Z"
                          transform="translate(1.999 -12.167)"
                          fill="#5f63f2"
                        />
                      </g>
                      <path
                        id="Path_1029"
                        data-name="Path 1029"
                        d="M39,25.167H9a1,1,0,0,1,0-2H39a1,1,0,1,1,0,2Z"
                        transform="translate(-8 5.498)"
                        fill="#5f63f2"
                        opacity="0.5"
                      />
                    </g>
                  </g>
                </g>
              </svg>
              {/* <img
                src={require(`../../../../../src/static/img/SalesRevenue.svg`)}
                alt=""
                height="50px"
                width="50px"
              /> */}
            </div>
            <div className="overview-box-single">
              <h2
                style={{
                  color: "#008cba",
                  fontWeight: "600",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                {dashBoardDataDetails?.total_sales.toFixed(2) &&
                  `${rsSymbol}${dashBoardDataDetails?.total_sales.toFixed(2)}`}
              </h2>
              <p>Total sales Today</p>
            </div>
            {/* <div className="overview-box-single text-right">
              <Heading as="h2"> ₹582.75</Heading>
              <p>Total sales</p>
            </div> */}
          </div>
          {/* <Progress
            percent={70}
            showInfo={false}
            className="progress-primary"
          /> */}

          {/* <p>
            <span className="growth-upward">
              <FeatherIcon icon="arrow-up" size={14} />
              25% <span>Since yesterday</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              70%
            </span>
          </p> */}
        </Cards>
      </div>
      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div
              className="icon-box box-secondary"
              style={{
                backgroundColor: "#20c99710",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="50px"
                width="50px"
                viewBox="0 0 31.996 26.985"
              >
                <g
                  id="Group_1641"
                  data-name="Group 1641"
                  transform="translate(0.003 -40.092)"
                >
                  <path
                    id="Path_1032"
                    data-name="Path 1032"
                    d="M27.95,40.379c-7.364,3.59-16.356,4-18.951,4.038H2.815A2.819,2.819,0,0,0,0,47.233C0,63.434-.015,62.5.032,62.705a1.32,1.32,0,0,0,.432.714h0a42.008,42.008,0,0,0,8.59.309,55.153,55.153,0,0,0,7.127-.574A43.054,43.054,0,0,0,29.366,59.3a13.8,13.8,0,0,0,2.628-1.272V42.913A2.814,2.814,0,0,0,27.95,40.379Zm1.415,15.943a39.344,39.344,0,0,1-13.555,4.231c-4.688.667-7.368.564-13.184.551V47.233a.188.188,0,0,1,.188-.187H8.057c6.692.106,15.072-1.395,21.045-4.306a.185.185,0,0,1,.264.171Z"
                    transform="translate(0 0)"
                    fill="#20c997"
                  />
                  <path
                    id="Path_1033"
                    data-name="Path 1033"
                    d="M186.243,193.368a4.651,4.651,0,1,0-4.651-4.651A4.656,4.656,0,0,0,186.243,193.368Zm0-6.674a2.023,2.023,0,1,1-2.023,2.023,2.025,2.025,0,0,1,2.023-2.023Z"
                    transform="translate(-170.246 -134.976)"
                    fill="#20c997"
                  />
                  <path
                    id="Path_1034"
                    data-name="Path 1034"
                    d="M375.136,133.958c.287,0,.222,0,2.418-.735a1.314,1.314,0,0,0-.831-2.493l-2,.667a1.314,1.314,0,0,0,.415,2.561Z"
                    transform="translate(-350.463 -84.909)"
                    fill="#20c997"
                    opacity="0.5"
                  />
                  <path
                    id="Path_1035"
                    data-name="Path 1035"
                    d="M65.429,314.851h2a1.314,1.314,0,0,0,0-2.628h-2a1.314,1.314,0,0,0,0,2.628Z"
                    transform="translate(-60.111 -255.125)"
                    fill="#20c997"
                    opacity="0.5"
                  />
                  <path
                    id="Path_1036"
                    data-name="Path 1036"
                    d="M39.008,327.06v3.522a2.817,2.817,0,0,1-1.483,2.48c-4.157,2.245-9.31,3.05-14.09,3.05-9.914,0-15.552-3.393-15.795-3.541a1.236,1.236,0,0,1-.161-.117,42,42,0,0,0,8.59.309c6.267,1.27,14.589,1.021,20.207-2.013a.193.193,0,0,0,.1-.168v-2.25A13.8,13.8,0,0,0,39.008,327.06Z"
                    transform="translate(-7.015 -269.034)"
                    fill="#20c997"
                    opacity="0.5"
                  />
                </g>
              </svg>
              {/* <img
                src={require(`../../../../../src/static/img/Profit.svg`)}
                alt=""
                height="50px"
                width="50px"
              /> */}
            </div>
            <div className="overview-box-single">
              <h2
                style={{
                  color: "#008cba",
                  fontWeight: "600",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                {" "}
                {dashBoardDataDetails?.total_bills}
              </h2>
              <p>Total Bills Today</p>
            </div>
            {/* <div className="overview-box-single text-right">
              <Heading as="h2">2000</Heading>
              <p>Total Bills</p>
            </div> */}
          </div>
          {/* <Progress
            percent={75}
            showInfo={false}
            className="progress-primary"
          /> */}

          {/* <p>
            <span className="growth-upward">
              <FeatherIcon icon="arrow-up" size={14} />
              25% <span>Since yesterday</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              70%
            </span>
          </p> */}
        </Cards>
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div
              className="icon-box box-secondary"
              style={{
                backgroundColor: "#ff69a510",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="50px"
                width="50px"
                viewBox="0 0 35.012 18.235"
              >
                <g id="user" transform="translate(-8 -12.583)">
                  <g
                    id="Group_1111"
                    data-name="Group 1111"
                    transform="translate(8 14.773)"
                  >
                    <circle
                      id="Ellipse_46"
                      data-name="Ellipse 46"
                      cx="2.917"
                      cy="2.917"
                      r="2.917"
                      transform="translate(2.919)"
                      fill="#f63178"
                      opacity="0.5"
                    />
                    <path
                      id="Path_1020"
                      data-name="Path 1020"
                      d="M17.731,17.5A6.115,6.115,0,0,0,15.3,22.386v.365h-6.2A1.1,1.1,0,0,1,8,21.657v-.729a4.009,4.009,0,0,1,4.011-4.011h3.648A4,4,0,0,1,17.731,17.5Z"
                      transform="translate(-8 -9.623)"
                      fill="#f63178"
                      opacity="0.5"
                    />
                    <circle
                      id="Ellipse_47"
                      data-name="Ellipse 47"
                      cx="2.917"
                      cy="2.917"
                      r="2.917"
                      transform="translate(26.259)"
                      fill="#f63178"
                      opacity="0.5"
                    />
                    <path
                      id="Path_1021"
                      data-name="Path 1021"
                      d="M29.283,20.929v.729a1.1,1.1,0,0,1-1.094,1.094h-6.2v-.365A6.112,6.112,0,0,0,19.554,17.5a3.978,3.978,0,0,1,2.072-.584h3.648A4.012,4.012,0,0,1,29.283,20.929Z"
                      transform="translate(5.729 -9.625)"
                      fill="#f63178"
                      opacity="0.5"
                    />
                  </g>
                  <circle
                    id="Ellipse_48"
                    data-name="Ellipse 48"
                    cx="4"
                    cy="4"
                    r="4"
                    transform="translate(21 12.583)"
                    fill="#f63178"
                  />
                  <path
                    id="Path_1022"
                    data-name="Path 1022"
                    d="M24.369,17.583H16.344a4.015,4.015,0,0,0-4.011,4.011v2.188a1.1,1.1,0,0,0,1.094,1.094H27.286a1.1,1.1,0,0,0,1.094-1.094V21.594A4.015,4.015,0,0,0,24.369,17.583Z"
                    transform="translate(5.149 5.941)"
                    fill="#f63178"
                  />
                </g>
              </svg>
              {/* <img
                src={require(`../../../../../src/static/img/Newcustomer.svg`)}
                alt=""
                height="50px"
                width="50px"
              /> */}
            </div>
            <div className="overview-box-single">
              <h2
                style={{
                  color: "#008cba",
                  fontWeight: "600",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                {dashBoardDataDetails?.new_customers}
              </h2>

              <p>New customers</p>
            </div>
          </div>
        </Cards>
        {/* <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
            <h2 style={{color:"#008cba",fontWeight:"600",margin:"0"}}>
                {totalBooking}
            </h2>
              <p>Total Bookings</p>
            </div>
          </div>
        </Cards> */}
      </div>
    </OverviewCard>
  );
};

export { DailyOverview };
