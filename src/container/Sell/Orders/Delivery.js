import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import "../sell.css";
import moment from "moment";
import { getAllTableList } from "../../../redux/sell/actionCreator";
import {
  getItem,
  setItem,
  getCartInfoLocalListsData,
} from "../../../utility/localStorageControl";

const Delivery = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let [allTableList, setAllTableList] = useState([]);
  let {
    createNewDeliveryInLocalStorageHandler,
    searchText,
    getAllDeliveryDataInLocalFn,
    getDeliveryInLocalStorageHandler,
  } = props;
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  let [deliveryData, setDeliveryData] = useState([]);
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  useEffect(() => {
    async function fetchAllTableList() {
      const allTableList = await dispatch(getAllTableList());
      if (isMounted.current && allTableList && allTableList.tableList)
        setAllTableList(allTableList.tableList);
    }
    if (isMounted.current && currentRegisterData) {
      fetchAllTableList();
      setDeliveryData(getAllDeliveryDataInLocalFn(currentRegisterData));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  let filterArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("delivery") !== -1;
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

  deliveryData = deliveryData.filter((value) =>
    value.tableName.toLowerCase().includes(searchText.toLowerCase())
  );

  const [localAllTableData, setLocalTableData] = useState(
    getCartInfoLocalListsData(currentRegisterData)
  );

  return (
    <div className="sell-table-parent delivery-parent list-boxmain">
      <Row gutter={[12, 12]} className="delivery-row list-box-row">
        {filterArray.length > 0
          ? filterArray.map((value, index) => (
              <Col
                xxl={4}
                lg={4}
                xl={4}
                xs={12}
                key={index}
                className="sell-table-col"
              >
                <div
                  className="sell-empty"
                  onClick={() => createNewDeliveryInLocalStorage()}
                >
                  <div className="sell-table-counter">
                    <div className="counter_served">{value.table_prefix}</div>
                    <div className="postion"></div>
                  </div>
                </div>
              </Col>
            ))
          : ""}
        {deliveryData.length > 0
          ? deliveryData.map((values, index) => {
              let tableData = localAllTableData?.find(
                (itm) =>
                  itm.tablekey == values.tablekey &&
                  itm.register_id === currentRegisterData._id
              );
              const status = tableData?.Status
                ? tableData.Status
                : "sell-main-order";

              return (
                status != "Delete" && (
                  <Col xxl={4} lg={4} xl={4} xs={12} className="sell-table-col">
                    <div
                      className={
                        status == "In Progress"
                          ? "sell-main-order"
                          : status == "Unpaid"
                          ? "sell-unpaid"
                          : "sell-empty"
                      }
                    >
                      <div
                        onClick={() =>
                          getDeliveryInLocalStorage(values.cartKey)
                        }
                      >
                        <div className="sell-table-counter">
                          <div className="counter_served">
                            {values.tableName}
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
                        </div>
                      </div>
                    </div>
                  </Col>
                )
              );
            })
          : ""}
      </Row>
    </div>
  );
};

export { Delivery };
