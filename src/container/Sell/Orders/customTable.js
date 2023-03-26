import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "antd";
import "../sell.css";

import {
  getTableStatusFromId,
  checkIfTableIsSelected,
  getTableNameTo,
  getTotalOfUnpaid,
  getItem,
  getCartInfoLocalListsData,
} from "../../../utility/localStorageControl";

const CustomTable = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    searchText,
    handleSplit,
  } = props;

  function setTableStatusOccupied(tableName) {
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr);
  }

  CustomTableData = CustomTableData.filter((value) =>
    value.toLowerCase().includes(searchText.toLowerCase())
  );
  const [localAllTableData, setLocalTableData] = useState(
    getCartInfoLocalListsData(currentRegisterData)
  );
  return (
    <div className="sell-table-parent customTable-parent list-boxmain">
      <Row gutter={[2, 2]} className="takeway-row list-box-row">
        {CustomTableData.length > 0
          ? CustomTableData.map((value, index) => {
              let tableData = localAllTableData?.find(
                (itm) =>
                  itm.tablekey == value.replace(/\s+/g, "-").toLowerCase() &&
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
                      onClick={() => setTableStatusOccupied(value)}
                    >
                      <div class="sell-table-counter">
                        <div class="counter_served">{value}</div>
                        <div class="postion">
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
                    {(status == "In Progress" || status == "Unpaid") &&
                      tableData.customSplit == undefined &&
                      tableData.swapTableCustum == undefined && (
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                            color: "#008cba",
                          }}
                          onClick={() => handleSplit(value, index - 2)}
                        >
                          Split
                        </div>
                      )}
                  </Col>
                </>
              );
            })
          : ""}
      </Row>
    </div>
  );
};

export { CustomTable };
