import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "antd";
import "../sell.css";
import {
  getCartInfoLocalListsData,
  getTableStatusFromId,
  checkIfTableIsSelected,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";
import { getItem } from "../../../utility/localStorageControl";
const Unpaid = (props) => {
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    searchText,
    handleSplit,
  } = props;
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let [freeData, setFreeData] = useState([]);

  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );

  useEffect(() => {
    let localStoreData = getCartInfoLocalListsData(currentRegisterData);

    if (localStoreData != null && currentRegisterData) {
      let unPaidTables = localStoreData.filter(
        (data) =>
          data.Status == "Unpaid" && data.register_id == currentRegisterData._id
      );

      if (CustomTableData != null && CustomTableData.length > 0) {
        setFreeData(
          CustomTableData.map((table) => {
            let dataTable = { ...table };
            dataTable.rows = dataTable.rows.filter(
              (row) =>
                unPaidTables.filter((data) => data.tableName == row).length > 0
            );
            return dataTable;
          })
        );
      }
    }
  }, [props]);

  function setTableStatusUnpaid(tableName) {
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr);
  }

  freeData = freeData.map((table) => {
    let dataTable = { ...table };
    dataTable.rows = dataTable.rows.filter((tableName) =>
      tableName.toLowerCase().includes(searchText.toLowerCase())
    );
    return dataTable;
  });

  return (
    <div>
      <div className="sell-table-parent">
        <Row>
          {freeData.length > 0 &&
            freeData.map((table) =>
              table.rows.map((item, idx) => {
                return (
                  <Col span={4} key={idx} className="sell-table-col">
                    <div
                      className="sell-main sell-unpaid"
                      onClick={() => setTableStatusUnpaid(item)}
                    >
                      <div className="sell-table-title">{item}</div>

                      <div className="postion">
                        <div className="product-price inlineDIv">
                          {checkIfTableIsSelected(
                            item.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          )}
                          {getTableStatusFromId(
                            item.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          )}
                          <span>{` ${rsSymbol}${Number(
                            getTotalOfUnpaid(
                              item.replace(/\s+/g, "-").toLowerCase(),
                              currentRegisterData
                            )
                          ).toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        color: "#008cba",
                      }}
                      onClick={() => handleSplit(item, idx - 2)}
                    >
                      Split
                    </div>
                  </Col>
                );
              })
            )}
        </Row>
      </div>
    </div>
  );
};

export { Unpaid };
