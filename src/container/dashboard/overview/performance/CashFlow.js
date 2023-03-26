import React, { useState, useEffect } from "react";
import { Spin, Col, Row, Divider, Tooltip, Menu, Dropdown, Select } from "antd";
import FeatherIcon from "feather-icons-react";
import { NavLink, Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CardBarChart, Pstates } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { ChartjsBarChartTransparent } from "../../../../components/charts/chartjs";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import {
  cashFlowGetData,
  cashFlowFilterData,
} from "../../../../redux/chartContent/actionCreator";
import { getSaleSummaryDatwiseChangeData } from "../../../../redux/dashboard/actionCreator";
import moment from "moment";

import { getItem, setItem } from "../../../../utility/localStorageControl";
const CashFlow = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);
  const [other, setOther] = useState(0);
  const [custumPayment, setCustumPaymnet] = useState(0);
  const [currentDate, setCurrentDate] = useState("today");
  const [allCustomPaymnetList, setAllCustomPaymnetList] = useState([]);
  const [pattyCashDetails, setPattyCashDetails] = useState();
  const [dashboardDetails, setDashBoardDetails] = useState();
  const [totalBooking, setTotalBooking] = useState(0);
  const { registerList } = useSelector(
    (state) => ({
      registerList: state.register.RegisterList,
    }),
    shallowEqual
  );

  let regiterId = false;
  let registerName = false;
  if (getItem("userDetails").role == "cashier" && registerList.length > 0) {
    if (registerList.find((val) => val.active)) {
      let activeRegisterName = registerList.find((val) => val.active);
      if (activeRegisterName) {
        regiterId = activeRegisterName._id;
        registerName = activeRegisterName.register_name;
      }
    }
  }
  const [dropDownValue, setDropDownValue] = useState(
    registerName ? registerName : "All Registers"
  );
  const [id, setId] = useState(regiterId ? regiterId : "allRegister");
  let [cashCardOther, setCashCardOther] = useState([]);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  useEffect(() => {
    async function fetchTopProduct() {
      let startDate;
      let endDate;

      if (currentDate === "today") {
        startDate = moment().format("L");
        endDate = moment().format("L");
      } else if (currentDate === "yesterday") {
        var curr = new Date();

        startDate = moment(curr.setDate(curr.getDate() - 1)).format("L");
        endDate = startDate; /*moment(new Date()).format("L");*/
      } else if (currentDate === "this_month") {
        var nowdate = new Date();
        var monthStartDay = new Date(
          nowdate.getFullYear(),
          nowdate.getMonth(),
          1
        );

        var monthEndDay = new Date(
          nowdate.getFullYear(),
          nowdate.getMonth() + 1,
          0
        );
        startDate = moment(monthStartDay).format("L");
        endDate = moment(monthEndDay).format("L");
      } else if (currentDate === "last_month") {
        var date = new Date();
        startDate = moment(
          new Date(date.getFullYear(), date.getMonth() - 1, 1)
        ).format("L");
        endDate = moment(
          new Date(date.getFullYear(), date.getMonth(), 0)
        ).format("L");
      }

      const getDashboardData = await dispatch(
        getSaleSummaryDatwiseChangeData(startDate, endDate, currentDate, id)
      );

      if (getDashboardData) {
        setDashBoardDetails(
          getDashboardData.saleSummaruydashboardDateWiseDetails
        );
        setPattyCashDetails(
          getDashboardData.saleSummaruydashboardDateWiseDetails.pettyCash
        );

        dashboardDetails?.total_booking[0]?.count > 0 &&
          setTotalBooking(dashboardDetails.total_booking[0]?.count);
        let threePaymnetType = [];

        if (
          getDashboardData?.saleSummaruydashboardDateWiseDetails
            ?.payment_summary
        ) {
          let customPaymnetList = [];
          let custompaymnetSum = 0;

          getDashboardData.saleSummaruydashboardDateWiseDetails.payment_summary.map(
            (val) => {
              if (val._id == "cash") {
                setCash(val.sum);
                threePaymnetType.push(val);
              } else if (val._id == "card") {
                setCard(val.sum);
                threePaymnetType.push(val);
              } else if (val._id == "other") {
                setOther(val.sum);
                threePaymnetType.push(val);
              } else if (val._id == "pending") {
                let pending = val.sum;
              } else {
                custompaymnetSum += val.sum;
                customPaymnetList.push(val);
              }
            }
          );

          setCustumPaymnet(custompaymnetSum);
          setAllCustomPaymnetList(customPaymnetList);
        } else {
          setCash(0);
          setCard(0);
          setOther(0);
        }
        setCashCardOther(threePaymnetType);
      }
    }

    fetchTopProduct();
  }, [currentDate, dropDownValue, id]);

  const dispatch = useDispatch();

  const { cashFlowState, cfIsLoading } = useSelector((state) => {
    return {
      cashFlowState: state.chartContent.cashFlowData,
      cfIsLoading: state.chartContent.cfLoading,
    };
  });

  useEffect(() => {
    if (cashFlowGetData) {
      dispatch(cashFlowGetData());
    }
  }, [dispatch]);

  let labels = [];
  let data = [];

  function compareFunction(a, b) {
    return a._id - b._id;
  }

  if (dashboardDetails !== undefined) {
    dashboardDetails.hourly_selling &&
      dashboardDetails.hourly_selling.sort(compareFunction);
  }

  dashboardDetails &&
    dashboardDetails.hourly_selling &&
    dashboardDetails.hourly_selling.map((i) => {
      let b = i._id.toString();
      if (b.length > 1) {
        labels.push(`${i._id}:00`);
      } else {
        labels.push(`0${i._id}:00`);
      }
      data.push(i.total);
    });

  let totalBookings;

  dashboardDetails &&
    (totalBookings =
      dashboardDetails.total_booking[0] &&
      dashboardDetails.total_booking[0].count);

  let newLabels = [];
  let newtotalls = [];

  labels.map((i, idx) => {
    let c = labels[idx + 1];

    for (let j = i; j < c; j++) {
      if (labels.includes(j)) {
        newLabels.push(j);
        newtotalls.push(data[labels.indexOf(j)]);
      } else {
        newLabels.push(j);
        newtotalls.push(0);
      }
    }
  });

  newLabels.push(labels[labels.length - 1]);

  newtotalls.push(data[data.length - 1]);

  let scale;
  let stepSize;

  if (currentDate == "today" || currentDate == "yesterday") {
    let max = 0;
    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 109) {
      stepSize = 50;
    } else if (max > 99 && max <= 1001) {
      stepSize = 200;
    } else if (max > 999 && max <= 5000) {
      stepSize = 2000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function(val, index) {
              return val;
            },
          },
        },
      ],
    };
  }

  if (currentDate == "this_month") {
    newLabels = [];
    newtotalls = [];

    const monthLabel = [];
    const monthsArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const presentMonth = new Date().getMonth();
    const currentDates = new Date().getDate();

    if (dashboardDetails !== "undefined") {
      if (dashboardDetails?.hourly_selling?.length > 0) {
        for (let i = 1; i <= currentDates; i++) {
          monthLabel.push(`${monthsArr[presentMonth]} ${i}`);
        }
      }
    }

    newLabels = monthLabel;

    if (
      dashboardDetails &&
      dashboardDetails.hourly_selling &&
      dashboardDetails.hourly_selling.length > 0
    ) {
      newLabels.map((i, idx) => {
        dashboardDetails.hourly_selling.map((j) => {
          if (j._id == idx + 1) {
            newtotalls[idx] = j.total;
          }
        });
      });
    }

    let max = 0;
    let stepSize;

    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 100) {
      stepSize = 50;
    } else if (max > 100 && max <= 1000) {
      stepSize = 100;
    } else if (max > 1000 && max <= 5000) {
      stepSize = 1000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function(val, index) {
              return index % 2 === 0 ? val : "";
            },
          },
        },
      ],
    };
  }

  if (currentDate == "last_month") {
    let lastMonth = dashboardDetails?.hourly_selling;

    newLabels = [];
    newtotalls = [];

    let today = new Date();
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    let month = lastDayOfMonth.getMonth();

    const monthLabel = [];
    const monthsArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let maxDate = 1;
    lastMonth.map((i) => {
      if (i._id > maxDate) {
        maxDate = i._id;
      }
    });

    for (let i = 1; i < maxDate + 1; i++) {
      monthLabel.push(`${monthsArr[month]} ${i}`);
    }

    newLabels = monthLabel;

    if (lastMonth.length > 0) {
      newLabels.map((i, idx) => {
        lastMonth.map((j) => {
          if (j._id == idx + 1) {
            newtotalls[idx] = j.total;
          }
        });
      });
    }

    let max = 0;
    let stepSize;

    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 100) {
      stepSize = 50;
    } else if (max > 99 && max <= 1000) {
      stepSize = 100;
    } else if (max > 999 && max <= 5000) {
      stepSize = 1000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    if (lastMonth.length == 0) {
      newLabels = [];
      newtotalls = [];
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function(val, index) {
              return index % 2 === 0 ? val : "";
            },
          },
        },
      ],
    };
  }

  const chartData = {
    labels: newLabels[0] == undefined ? [0] : newLabels,
    datasets: [
      {
        data: newtotalls,
        backgroundColor: "#bd025d",
        maxBarThickness: 5,
        barThickness: 5,
      },
    ],
  };

  scale.yAxes[0].ticks["callback"] = function(value) {
    var ranges = [
      { divider: 1e6, suffix: "M" },
      { divider: 1e3, suffix: "k" },
    ];
    function formatNumber(n) {
      for (var i = 0; i < ranges.length; i++) {
        if (n >= ranges[i].divider) {
          return (n / ranges[i].divider).toString() + ranges[i].suffix;
        }
      }
      return n;
    }
    return formatNumber(value);
  };

  const handleDropdownClick = (data) => {
    const { _id, register_name } = data;

    setDropDownValue(register_name);
    _id != undefined ? setId(data._id) : setId("allRegister");
  };

  const menu = (
    <Menu className="Dash_dropList">
      <Menu.Item>
        <Link
          to="#"
          onClick={() =>
            handleDropdownClick({ register_name: "All Registers" })
          }
        >
          All Registers
        </Link>
      </Menu.Item>

      {registerList.map((data, idx) => {
        return (
          <Menu.Item key={idx}>
            <Link
              to="#"
              key={data._id}
              onClick={() => handleDropdownClick(data)}
            >
              {data.register_name}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <>
      <Cards
        title="Sale Summary"
        isbutton={
          <div className="card-nav dashcard-nav">
            <ul>
              <li>
                <p style={{ display: "none" }}>{id}</p>
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  disabled={
                    getItem("userDetails").role == "cashier" ? true : false
                  }
                >
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {dropDownValue} <DownOutlined />
                  </a>
                </Dropdown>
              </li>
              <li className={currentDate === "today" ? "active" : "regular"}>
                <Link onClick={() => setCurrentDate("today")} to="#">
                  Today
                </Link>
              </li>
              <li
                className={currentDate === "yesterday" ? "active" : "regular"}
              >
                <Link onClick={() => setCurrentDate("yesterday")} to="#">
                  Yesterday
                </Link>
              </li>
              <li
                className={currentDate === "this_month" ? "active" : "regular"}
              >
                <Link onClick={() => setCurrentDate("this_month")} to="#">
                  This Month
                </Link>
              </li>
              <li
                className={currentDate === "last_month" ? "active" : "regular"}
              >
                <Link onClick={() => setCurrentDate("last_month")} to="#">
                  Last Month
                </Link>
              </li>
            </ul>
          </div>
        }

        // more={moreContent}
      >
        <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }} className="bod_botm">
          <Col xs={12} xl={8}>
            <div className="growth-upward borderdas_rght mobile-frbr">
              <p>
                Cash{" "}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "cash") &&
                    cashCardOther.find((val) => val._id == "cash").out
                    ? cashCardOther.find((val) => val._id == "cash").out
                    : 0
                ) > 0 && (
                  <Tooltip
                    title={
                      <div>
                        <div>
                          In : {rsSymbol}
                          {Number(
                            cashCardOther.length > 0 &&
                              cashCardOther.find((val) => val._id == "cash") &&
                              cashCardOther.find((val) => val._id == "cash").in
                              ? cashCardOther.find((val) => val._id == "cash")
                                  .in
                              : 0
                          ).toFixed(2)}
                        </div>
                        {
                          <div>
                            Refund: {rsSymbol}
                            {Number(
                              cashCardOther.find((val) => val._id == "cash").out
                            ).toFixed(2)}
                          </div>
                        }
                      </div>
                    }
                  >
                    <ExclamationCircleOutlined
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                )}
              </p>
              <h3>
                {" "}
                {rsSymbol}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "cash") &&
                    cashCardOther.find((val) => val._id == "cash").sum
                    ? cashCardOther.find((val) => val._id == "cash").sum
                    : 0
                ).toFixed(2)}
              </h3>
            </div>
          </Col>

          <Col xs={12} xl={8}>
            <div className="growth-upward borderdas_rght mobileamrgt">
              <p>
                Card{" "}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "card") &&
                    cashCardOther.find((val) => val._id == "card").out
                    ? cashCardOther.find((val) => val._id == "card").out
                    : 0
                ) > 0 && (
                  <Tooltip
                    title={
                      <div>
                        <div>
                          In : {rsSymbol}
                          {Number(
                            cashCardOther.length > 0 &&
                              cashCardOther.find((val) => val._id == "card") &&
                              cashCardOther.find((val) => val._id == "card").in
                              ? cashCardOther.find((val) => val._id == "card")
                                  .in
                              : 0
                          ).toFixed(2)}
                        </div>
                        {
                          <div>
                            Refund: {rsSymbol}
                            {Number(
                              cashCardOther.find((val) => val._id == "card").out
                            ).toFixed(2)}
                          </div>
                        }
                      </div>
                    }
                  >
                    <ExclamationCircleOutlined
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                )}
              </p>
              <h3>
                {" "}
                {rsSymbol}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "card") &&
                    cashCardOther.find((val) => val._id == "card").sum
                    ? cashCardOther.find((val) => val._id == "card").sum
                    : 0
                ).toFixed(2)}
              </h3>
            </div>
          </Col>
          <Col xs={12} xl={8}>
            <div className="growth-upward mobile-frbr">
              <p>
                Other{" "}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "other") &&
                    cashCardOther.find((val) => val._id == "other").out
                    ? cashCardOther.find((val) => val._id == "other").out
                    : 0
                ) > 0 && (
                  <Tooltip
                    title={
                      <div>
                        <div>
                          In : {rsSymbol}
                          {Number(
                            cashCardOther.length > 0 &&
                              cashCardOther.find((val) => val._id == "other") &&
                              cashCardOther.find((val) => val._id == "other").in
                              ? cashCardOther.find((val) => val._id == "other")
                                  .in
                              : 0
                          ).toFixed(2)}
                        </div>
                        {Number(
                          cashCardOther.length > 0 &&
                            cashCardOther.find((val) => val._id == "other") &&
                            cashCardOther.find((val) => val._id == "other").out
                            ? cashCardOther.find((val) => val._id == "other")
                                .out
                            : 0
                        ) > 0 && (
                          <div>
                            Refund: {rsSymbol}
                            {Number(
                              cashCardOther.find((val) => val._id == "other")
                                .out
                            ).toFixed(2)}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <ExclamationCircleOutlined
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                )}
              </p>
              <h3>
                {" "}
                {rsSymbol}
                {Number(
                  cashCardOther.length > 0 &&
                    cashCardOther.find((val) => val._id == "other") &&
                    cashCardOther.find((val) => val._id == "other").sum
                    ? cashCardOther.find((val) => val._id == "other").sum
                    : 0
                ).toFixed(2)}
              </h3>
            </div>
          </Col>
          <Col xs={12} xl={8}>
            <div className="growth-upward borderdas_rght mobileamrgt">
              <p>
                Custom{" "}
                {allCustomPaymnetList.length > 0 && (
                  <Tooltip
                    title={
                      <div>
                        {allCustomPaymnetList.map((val) => {
                          if (
                            val._id &&
                            val._id != "false" &&
                            val._id != "pending"
                          ) {
                            return (
                              <div>
                                <div>
                                  {val._id} : {rsSymbol}
                                  {Number(val.sum).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                                {Number(val.out).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) > 0 && (
                                  <span>
                                    In:
                                    {Number(val.in).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    {Number(val.out) > 0 && (
                                      <span>
                                        ,Refund:
                                        {Number(val.out).toLocaleString(
                                          "en-US",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    }
                    // cursor={{fill:"#bd025d"}}
                  >
                    <ExclamationCircleOutlined
                      style={{
                        cursor: "pointer",
                        // backgroundColor:"#bd025d"
                      }}
                    />
                  </Tooltip>
                )}
              </p>

              <h3>
                {" "}
                {rsSymbol}
                {Number(custumPayment).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </Col>
          <Col xs={12} xl={8}>
            {pattyCashDetails ? (
              <div className="growth-upward  borderdas_rght mobile-frbr">
                <p>
                  Petty Cash{" "}
                  {typeof pattyCashDetails.cashOut == "number" &&
                    Number(pattyCashDetails.cashOut) > 0 && (
                      <Tooltip
                        title={
                          <div>
                            <div>
                              Cash In : + <span>{rsSymbol}</span>{" "}
                              {Number(pattyCashDetails.cashIn).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </div>
                            <div>
                              Cash Out: - <span>{rsSymbol}</span>{" "}
                              {Number(pattyCashDetails.cashOut).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </div>
                          </div>
                        }
                      >
                        <ExclamationCircleOutlined
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    )}
                </p>
                <h3>
                  {" "}
                  {rsSymbol}
                  {pattyCashDetails
                    ? Number(pattyCashDetails?.sum).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : Number(0).toFixed(2)}
                </h3>
              </div>
            ) : (
              <div className="growth-upward  borderdas_rght mobile-frbr">
                <p>
                  Petty Cash{" "}
                  {/* <Tooltip
                    title={
                      <div>
                        <div>
                          Cash In : + <span>{rsSymbol}</span>{" "}
                          {Number(0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div>
                          Cash Out: - <span>{rsSymbol}</span>{" "}
                          {Number(0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    }
                  >
                    <ExclamationCircleOutlined
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip> */}
                </p>
                <h3>
                  {" "}
                  {rsSymbol}
                  {pattyCashDetails
                    ? Number(pattyCashDetails?.sum).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : Number(0).toFixed(2)}
                </h3>
              </div>
            )}
          </Col>
          <Col xs={12} xl={8}>
            <div className="growth-upward mobileamrgt">
              <p>Total Bookings </p>
              <h2 style={{ color: "#008cba", fontWeight: "600", margin: "0" }}>
                {totalBookings}
              </h2>
            </div>
          </Col>
        </Row>
        {/* <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}>
            
          </Row> */}
        {cfIsLoading ? (
          <div className="sd-spin">
            <Spin />
          </div>
        ) : (
          <CardBarChart>
            <div>
              <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}>
                <Col xs={12} xl={12} style={{ marginBottom: "10px" }}>
                  <div className="mobile-frbr">
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>
                      {dashboardDetails ? dashboardDetails?.total_bills : 0}
                    </span>{" "}
                    <span style={{ fontWeight: "500", fontSize: "16px" }}>
                      Receipts
                    </span>
                  </div>
                </Col>

                <Col xs={12} xl={12} style={{ marginBottom: "20px" }}>
                  <span className="rec-rgtamount">
                    {rsSymbol}
                    {dashboardDetails
                      ? Number(dashboardDetails?.total_sales).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )
                      : Number(0).toFixed(2)}
                  </span>
                </Col>
              </Row>
            </div>
            {/* 
              <Row>
                <Divider type="horizontal" style={{ height: "100%" }} />
              </Row> */}

            <ChartjsBarChartTransparent
              chartData={chartData}
              displayLegend={false}
              scale={scale}
            />

            {/* <ChartjsBarChartTransparent
                labels={cashFlowState.labels}
                datasets={cashFlowDataset}
                height={106}
                options={{
                  maintainAspectRatio: true,
                  responsive: true,
                  layout: {
                    padding: {
                      top: 20,
                    },
                  },
                  legend: {
                    display: false,
                    position: "bottom",
                    align: "start",
                    labels: {
                      boxWidth: 6,
                      display: false,
                      usePointStyle: true,
                    },
                  },
                  scales: {
                    yAxes: [
                      {
                        gridLines: {
                          color: "#e5e9f2",
                          borderDash: [3, 3],
                          zeroLineColor: "#e5e9f2",
                          zeroLineWidth: 1,
                          zeroLineBorderDash: [3, 3],
                        },

                        ticks: {
                          beginAtZero: true,
                          fontSize: 12,
                          fontColor: "#182b49",
                          max: Math.max(...cashFlowState.dataIn),
                          stepSize: Math.floor(
                            Math.max(...cashFlowState.dataIn) / 5
                          ),
                          callback(label) {
                            return `${label}ok`;
                            label;
                          },
                        },
                      },
                    ],
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          zeroLineWidth: 2,
                          zeroLineColor: "#fff",
                          color: "transparent",
                          z: 1,
                        },
                        ticks: {
                          beginAtZero: true,
                          fontSize: 12,
                          fontColor: "#182b49",
                        },
                      },
                    ],
                  },
                }}
              /> */}

            {/* <ul className="chart-dataIndicator">
                {cashFlowDataset &&
                  cashFlowDataset.map((item, key) => {

                      return (
                        <li
                          key={key + 1}
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              display: "flex",
                              backgroundColor: item.hoverBackgroundColor,
                              borderRadius: "50%",
                              margin: "0px 6.5px",
                            }}
                          />
                          {item.label}
                        </li>
                      );
                  
                  })}
              </ul> */}
          </CardBarChart>
        )}
      </Cards>
    </>
  );
};

export default CashFlow;
