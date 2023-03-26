import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import "../sell.css";
import { getAllTableList } from "../../../redux/sell/actionCreator";
import { getItem } from "../../../utility/localStorageControl";
import {
  setItem,
  getCartInfoLocalListsData,
} from "../../../utility/localStorageControl";
import { TakeAway } from "../Orders/TakeAway";

const All = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    handleSplit,
    localTableUpdate,
  } = props;
  const dispatch = useDispatch();

  let {
    createNewTakeawayInLocalStorageHandler,
    getAllTakeAwayDataInLocalFn,
    getTakeawayInLocalStorageHandler,
    searchText,
  } = props;
  let [takeAwayData, settakeAwayData] = useState([]);

  const [deliveryData, setDeliveryData] = useState([]);
  let {
    createNewDeliveryInLocalStorageHandler,
    getAllDeliveryDataInLocalFn,
    getDeliveryInLocalStorageHandler,
  } = props;

  let [allTableList, setAllTableList] = useState([]);
  let isMounted = useRef(true);
  const { currentRegisterData, waiterTableChanges } = useSelector((state) => {
    return {
      currentRegisterData: state.register.RegisterList.find(
        (val) => val.active
      ),
      waiterTableChanges: state.auth.localTableDataArray,
    };
  });

  function dateCompare(time1, time2) {
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0], parts[1], parts[2], 0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], parts[2], 0);

    // returns 1 if greater, -1 if less and 0 if the same
    if (t1.getTime() > t2.getTime()) return 1;
    if (t1.getTime() < t2.getTime()) return -1;
    return 0;
  }
  useEffect(() => {
    async function fetchAllTableList() {
      const allTableList = await dispatch(getAllTableList());

      if (isMounted.current && allTableList && allTableList.tableList)
        setAllTableList(allTableList.tableList);
    }
    if (isMounted.current && currentRegisterData) {
      fetchAllTableList();
      settakeAwayData(getAllTakeAwayDataInLocalFn(currentRegisterData));
      setDeliveryData(getAllDeliveryDataInLocalFn(currentRegisterData));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  function setTableStatusOccupied(tableName, table) {
    setItem("bookingDetails", false);
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr, table);
  }

  //Take Away
  function createNewTakeawayInLocalStorage() {
    let takeAwayNumber;
    if (getItem("previousTakeAwayNumber") != null) {
      let Details = getItem("previousTakeAwayNumber");
      if (
        moment(moment(Details.date).format("L")).isSame(moment().format("L"))
      ) {
        if (
          dateCompare(moment(Details.date).format("HH:mm:ss"), "06:00:00") ==
            -1 &&
          dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
        ) {
          takeAwayNumber = 1;
          setItem("previousTakeAwayNumber", {
            date: new Date(),
            number: 1,
          });
        } else {
          takeAwayNumber = 1 + Details.number;
          setItem("previousTakeAwayNumber", {
            date: new Date(),
            number: 1 + Details.number,
          });
        }
      } else {
        if (
          dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
        ) {
          takeAwayNumber = 1;
          setItem("previousTakeAwayNumber", {
            date: new Date(),
            number: 1,
          });
        } else {
          takeAwayNumber = 1 + Details.number;
          setItem("previousTakeAwayNumber", {
            date: new Date(),
            number: 1 + Details.number,
          });
        }
      }
    } else {
      takeAwayNumber = 1;
      setItem("previousTakeAwayNumber", {
        date: new Date(),
        number: 1,
      });
    }
    createNewTakeawayInLocalStorageHandler(takeAwayNumber);
  }

  let filterArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("take-away") !== -1;
  });

  //
  //Delivery
  let filterDeliveryArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("delivery") !== -1;
  });

  function createNewDeliveryInLocalStorage() {
    let deleveryNumber;
    if (getItem("previousDeliveryNumber") != null) {
      let Details = getItem("previousDeliveryNumber");
      if (
        moment(moment(Details.date).format("L")).isSame(moment().format("L"))
      ) {
        if (
          dateCompare(moment(Details.date).format("HH:mm:ss"), "06:00:00") ==
            -1 &&
          dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
        ) {
          deleveryNumber = 1;
          setItem("previousDeliveryNumber", {
            date: new Date(),
            number: 1,
          });
        } else {
          deleveryNumber = 1 + Details.number;
          setItem("previousDeliveryNumber", {
            date: new Date(),
            number: 1 + Details.number,
          });
        }
      } else {
        if (
          dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
        ) {
          deleveryNumber = 1;
          setItem("previousDeliveryNumber", {
            date: new Date(),
            number: 1,
          });
        } else {
          deleveryNumber = 1 + Details.number;
          setItem("previousDeliveryNumber", {
            date: new Date(),
            number: 1 + Details.number,
          });
        }
      }
    } else {
      deleveryNumber = 1;
      setItem("previousDeliveryNumber", {
        date: new Date(),
        number: 1,
      });
    }
    createNewDeliveryInLocalStorageHandler(deleveryNumber);
  }

  function getDeliveryInLocalStorage(key) {
    localStorage.setItem("active_cart", key);
    getDeliveryInLocalStorageHandler(key);
  }

  //
  let AllTableList = [];
  filterArray.map((value) => {
    AllTableList.push({
      prefix: "take-away",
      table_name: value.table_prefix,
    });
  });
  takeAwayData.map((values) => {
    if (values.Status != "Delete") {
      AllTableList.push({
        tablekey: values.tablekey,
        table_name: values.tableName,
        cartKey: values.cartKey,
      });
    }
  });

  filterDeliveryArray.map((value) => {
    AllTableList.push({
      prefix: "Delivery",
      table_name: value.table_prefix,
    });
  });
  deliveryData.map((values) => {
    if (values.Status != "Delete") {
      AllTableList.push({
        tablekey: values.tablekey,
        table_name: values.tableName,
        cartKey: values.cartKey,
      });
    }
  });

  CustomTableData.map((table) => {
    table.rows.map((value) => {
      AllTableList.push({
        table_name: value,
      });
    });
  });
  AllTableList = AllTableList.filter((value) =>
    value?.table_name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const [localAllTableData, setLocalTableData] = useState(
    getCartInfoLocalListsData(currentRegisterData)
  );

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      setLocalTableData([...getCartInfoLocalListsData(currentRegisterData)]);
    } else {
      didMount.current = true;
      setLocalTableData([...getCartInfoLocalListsData(currentRegisterData)]);
    }
  }, [waiterTableChanges]);

  return (
    <div className="sell-table-parent all-parent list-boxmain">
      <Row gutter={[2, 2]} className="all-row list-box-row">
        {AllTableList.length > 0 &&
          AllTableList.map((values, index) => {
            if (values.prefix) {
              return (
                <Col
                  xxl={4}
                  lg={4}
                  xl={4}
                  xs={12}
                  className="sell-table-col"
                  key={index}
                >
                  <div
                    className="sell-empty"
                    onClick={() => {
                      if (values.prefix == "take-away") {
                        createNewTakeawayInLocalStorage();
                      } else {
                        createNewDeliveryInLocalStorage();
                      }
                    }}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{values.table_name}</div>
                      <div className="postion"></div>
                    </div>
                  </div>
                </Col>
              );
            } else if (values.tablekey) {
              let tableData = localAllTableData?.find(
                (itm) =>
                  itm.tablekey == values.tablekey &&
                  itm.register_id === currentRegisterData._id
              );

              const status = tableData?.Status
                ? tableData.Status
                : "sell-main-order";
              if (status != "Delete") {
                return (
                  <Col xxl={4} lg={4} xl={4} xs={12} className="sell-table-col">
                    <div
                      className={
                        status == "In Progress"
                          ? "sell-main-order"
                          : status == "Unpaid"
                          ? "sell-unpaid"
                          : "sell-empty"
                      }
                      onClick={() => getDeliveryInLocalStorage(values.cartKey)}
                    >
                      <div className="sell-table-counter">
                        <div className="counter_served">
                          {values.table_name}
                        </div>
                        <div className="postion">
                          <div className="product-price inlineDIv">
                            {tableData &&
                              tableData.cartKey == getItem("active_cart") && (
                                <span className="active-dots" />
                              )}
                            {status != "sell-main-order" &&
                            tableData?.onlineOrder
                              ? `${tableData?.onlineOrder.Source}  |  ${tableData?.onlineOrder.order_id}`
                              : status}
                            {status == "Unpaid" && (
                              <span>{` ${rsSymbol}${Number(
                                tableData?.otherDetails?.finalCharge
                              ).toFixed(2)}`}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              }
            } else {
              let tableData = localAllTableData?.find(
                (itm) =>
                  itm.tablekey ==
                    values.table_name.replace(/\s+/g, "-").toLowerCase() &&
                  itm.register_id === currentRegisterData._id
              );

              const status = tableData?.Status
                ? tableData.Status
                : "sell-main-order";
              return (
                <>
                  <Col
                    xxl={4}
                    lg={4}
                    xl={4}
                    xs={12}
                    className="sell-table-col"
                    key={index}
                  >
                    <div
                      className={
                        status == "In Progress"
                          ? "sell-main-order"
                          : status == "Unpaid"
                          ? "sell-unpaid"
                          : "sell-empty"
                      }
                      onClick={() => setTableStatusOccupied(values.table_name)}
                    >
                      <div>
                        <div></div>
                        <div className="sell-table-counter">
                          <div className="counter_served">
                            {values.table_name}
                          </div>
                          <div className="postion">
                            <div className="product-price inlineDIv">
                              {tableData &&
                                tableData.cartKey == getItem("active_cart") && (
                                  <span className="active-dots" />
                                )}
                              {status != "sell-main-order" && status}
                              {status == "Unpaid" && (
                                <span>{` ${rsSymbol}${Number(
                                  tableData?.otherDetails?.finalCharge
                                ).toFixed(2)}`}</span>
                              )}
                            </div>
                          </div>
                          {tableData?.waiterName &&
                          getItem("waiter_app_enable") ? (
                            <div className="product-price inlineDIv">
                              {tableData?.waiterName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {(status == "In Progress" || status == "Unpaid") &&
                      tableData.customSplit == undefined &&
                      tableData.swapTableCustum == undefined && (
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                            color: "#008cba",
                          }}
                          onClick={() =>
                            handleSplit(values.table_name, index - 2)
                          }
                        >
                          Split
                        </div>
                      )}
                  </Col>
                </>
              );
            }
          })}
      </Row>
    </div>
  );
};

export { All };
