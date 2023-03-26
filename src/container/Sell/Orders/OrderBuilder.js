import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, Input } from "antd";
import { SellModuleNav } from "../Style";
import { NavLink } from "react-router-dom";
import { TakeAway } from "../Orders/TakeAway";
import { CustomTable } from "../Orders/customTable";
import { Delivery } from "../Orders/Delivery";
import { All } from "../Tables/All";
import { Free } from "../Tables/Free";
import { Occupied } from "../Tables/Occupied";
import {
  getAllTakeAwayDataInLocal,
  getAllDeliveryDataInLocal,
  getTableStatusFromId,
  getItem,
  getallCustomSwapList,
  getallCustomSplitList,
  AddLastSplitName,
  getTableNameTo,
  setItem,
} from "../../../utility/localStorageControl";
import { useDispatch } from "react-redux";
import { Unpaid } from "../Tables/Unpaid";

const OrderBuilder = (props) => {
  const [currentStatus, setStatus] = useState("ALL");
  let customTablesInfo = [];
  const [selectedCustomTable, setSelectedCustomTable] = useState([]);
  let {
    createNewTakeawayInLocalAndNavigate,
    getTakeawayInLocalAndNavigate,
    search,
    localCartInfo,
    currentRegisterData,
    setSearhTables,
    suffixTables,
    localTableUpdate,
  } = props;
  const setCategory = (type) => {
    setStatus(type);
    localStorage.setItem("tabStatus", type);
  };

  const setTableBoxes = (data) => {
    setStatus(data.name);
    setSelectedCustomTable(data);
    localStorage.setItem("tabStatus", "CUSTOM_TABLE");
  };

  const createNewTakeawayInLocalFunction = (takeawayNumber) => {
    let type = "take-away-local";
    let navigateTo = "CURRENT";
    let data = {
      tablekey: "TakeAway " + takeawayNumber,
      tableName: "TakeAway " + takeawayNumber,
    };
    createNewTakeawayInLocalAndNavigate(type, navigateTo, data);
  };

  let customSplitData = getallCustomSplitList(currentRegisterData);

  const setCustomTableOrderInLocalStoragFunction = (
    tableName,
    tablekey,
    splitTablename,
    indexOfSplit
  ) => {
    let type = "custom-table-local";
    let navigateTo = "CURRENT";
    let data = {
      tablekey: tablekey,
      tableName: tableName,
    };
    let SwipList = [];
    customTablesInfo.map((table) => {
      table.rows.map((value, index) => {
        const status = getTableStatusFromId(
          value.replace(/\s+/g, "-").toLowerCase(),
          currentRegisterData
        );

        if (status == "In Progress" && tableName != value) {
          let table_Name_Arr = value.split("-");
          let val;

          if (table_Name_Arr.length > 1) {
            val = `${table_Name_Arr[0]}-${Number(table_Name_Arr[1]) + 1}`;
          } else if (table_Name_Arr.length == 1) {
            val = value.concat("-1");
          }

          SwipList.push({
            swapTableName: val,
            this_index: index,
            swapCustum: true,
          });
        } else if (status != "In Progress" && tableName != value) {
          SwipList.push({
            swapTableName: value,
            this_index: index,
            swapCustum: false,
          });
        }
      });
    });

    createNewTakeawayInLocalAndNavigate(
      type,
      navigateTo,
      data,
      SwipList,
      customTablesInfo,
      splitTablename,
      indexOfSplit
    );
  };

  const getTakeawayInLocalStorageHandlerFunction = (key) => {
    let type = "take-away-local";
    let navigateTo = "CURRENT";
    getTakeawayInLocalAndNavigate(type, navigateTo, key);
  };

  const createNewDeliveryInLocalFunction = (takeawayNumber) => {
    let type = "delivery-local";
    let navigateTo = "CURRENT";
    let data = {
      tablekey: "Delivery " + takeawayNumber,
      tableName: "Delivery " + takeawayNumber,
    };
    createNewTakeawayInLocalAndNavigate(type, navigateTo, data);
  };

  const getDeliveryInLocalStorageHandlerFunction = (key) => {
    let type = "delivery-local";
    let navigateTo = "CURRENT";
    getTakeawayInLocalAndNavigate(type, navigateTo, key);
  };

  if (currentRegisterData) {
    if (currentRegisterData.table_numbers != "") {
      let tableNosArray = currentRegisterData.table_numbers.split("),");
      let finalTableArray = [];
      let tableNosName;
      let tableNosRange;
      let splitedTbs;
      let roomArray = [];
      let i;
      tableNosArray.forEach((items) => {
        let inputNumberItem = items[0];
        if (items[0] == 1) {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            tableNosRange = items.split(",");
            tableNosRange.forEach((items) => {
              roomArray.push("Table" + " " + items);
            });
          }

          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
          if (i == 1) {
            finalTableArray.push({
              name: "Table",
              status: "Empty",
              rows: roomArray,
            });
          }
        } else if (isNaN(inputNumberItem) && items && items.indexOf("-") > -1) {
          splitedTbs = items.split("(");
          tableNosName = splitedTbs[0];
          tableNosRange = splitedTbs[1];
          let roomCharArray = [];
          tableNosRange = tableNosRange.replace(")", "");
          tableNosRange = tableNosRange.split("-");
          tableNosRange[0] = parseInt(tableNosRange[0]);
          tableNosRange[1] = parseInt(tableNosRange[1]);
          if (tableNosRange[0] > tableNosRange[1]) {
            for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
              roomCharArray.push("Table" + " " + i);
            }
          } else {
            for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
              roomCharArray.push(tableNosName + " " + i);
            }
          }
          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else if (items && items.indexOf(",") > -1) {
          let tempTables = items.split("(");
          tableNosName = tempTables[0];
          tableNosRange = tempTables[1];
          tableNosRange = tableNosRange.replace(")", "");
          tableNosRange = tableNosRange.split(",");
          let roomCharArray = [];
          tableNosRange.forEach((items) => {
            roomCharArray.push(tableNosName + " " + items);
          });
          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            let tempTables = items.split("(");
            tableNosName = tempTables[0];
            tableNosRange = items.split(",");

            tableNosRange.forEach((items) => {
              tempTables[1].indexOf(")") > -1
                ? finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1].slice(0, -1)],
                  })
                : finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1]],
                  });
            });
          }

          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
        }
      });

      customTablesInfo = finalTableArray;
    }
  }

  if (customSplitData.length > 0) {
    customTablesInfo.map((l) => {
      let finalRows = [];
      l.rows.map((i) => {
        finalRows.push(i);
        customSplitData.filter((v, ind) => {
          if (i == v.tableName.split("-")[0]) {
            finalRows.push(v.tableName);
          }
        });
      });
      l.rows = finalRows;
    });
  }

  const handleSplit = (tableName, index) => {
    let currenttableDetalis = getTableNameTo(tableName, currentRegisterData);
    if (currenttableDetalis.lastSplitName) {
      let table_name = currenttableDetalis.lastSplitName.split("-")[0];
      let tableNo = Number(currenttableDetalis.lastSplitName.split("-")[1]);
      tableName = table_name + `-${tableNo + 1}`;
      let splitIndex = currenttableDetalis.splitIndex + 1;
      AddLastSplitName(
        currenttableDetalis.cartKey,
        currenttableDetalis,
        tableName,
        currentRegisterData,
        splitIndex
      );
      setItem("bookingDetails", false);
      let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
      setCustomTableOrderInLocalStoragFunction(
        tableName,
        tableNameStr,
        tableName,
        splitIndex
      );
    } else {
      tableName = tableName + "-1";
      AddLastSplitName(
        currenttableDetalis.cartKey,
        currenttableDetalis,
        tableName,
        currentRegisterData,
        index
      );
      setItem("bookingDetails", false);
      let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
      setCustomTableOrderInLocalStoragFunction(
        tableName,
        tableNameStr,
        tableName,
        index
      );
    }
  };

  return (
    <>
      <Row>
        <Input
          suffix={suffixTables}
          autoFocus
          placeholder="Search Tables"
          style={{
            height: "40px",
            marginTop: "-10px",
            marginBottom: "6px",
          }}
          onChange={(e) => setSearhTables(e.target.value)}
          value={search}
          className="search-none"
          // className={`cre_avf - ${activeTab}`}
        />
        {currentRegisterData !== undefined &&
          currentRegisterData.table_numbers != "" && (
            <Col xxl={3} lg={3} xl={3} xs={7} className="category-col">
              <Card headless className="category-card">
                <SellModuleNav>
                  <ul className="currentbuild-ul">
                    <li style={{ fontSize: 13 }}>
                      <NavLink
                        to="#"
                        onClick={setCategory.bind(this, "ALL")}
                        className={
                          currentStatus === "ALL" ? "active" : "not-active"
                        }
                      >
                        <span className="nav-text">
                          <span>All</span>
                        </span>
                      </NavLink>
                    </li>

                    <li style={{ fontSize: 13 }}>
                      <NavLink
                        to="#"
                        onClick={setCategory.bind(this, "TAKE_AWAY")}
                        className={
                          currentStatus === "TAKE_AWAY"
                            ? "active"
                            : "not-active"
                        }
                      >
                        <span className="nav-text">
                          <span>TakeAway</span>
                        </span>
                      </NavLink>
                    </li>

                    <li style={{ fontSize: 13 }}>
                      <NavLink
                        to="#"
                        onClick={setCategory.bind(this, "DELIVERY")}
                        className={
                          currentStatus === "DELIVERY" ? "active" : "not-active"
                        }
                      >
                        <span className="nav-text">
                          <span>Delivery</span>
                        </span>
                      </NavLink>
                    </li>

                    <li style={{ fontSize: 13 }}>
                      <NavLink
                        to="#"
                        onClick={setCategory.bind(this, "FREE")}
                        className={
                          currentStatus === "FREE" ? "active" : "not-active"
                        }
                      >
                        <span className="nav-text">
                          <span>Free</span>
                        </span>
                      </NavLink>
                    </li>

                    <li style={{ fontSize: 13 }}>
                      <NavLink
                        to="#"
                        onClick={setCategory.bind(this, "OCCUPIED")}
                        className={
                          currentStatus === "OCCUPIED" ? "active" : "not-active"
                        }
                      >
                        <span className="nav-text">
                          <span>Occupied</span>
                        </span>
                      </NavLink>
                    </li>

                    {customTablesInfo.length > 0
                      ? customTablesInfo.map((values) => (
                          <li style={{ fontSize: 13 }}>
                            <NavLink
                              to="#"
                              onClick={setTableBoxes.bind(this, values)}
                              className={
                                currentStatus === values.name
                                  ? "active"
                                  : "not-active"
                              }
                            >
                              <span className="nav-text">
                                <span>{values.name}</span>
                              </span>
                            </NavLink>
                          </li>
                        ))
                      : ""}

                    {getItem("print_receipt_first") ? (
                      getItem("print_receipt_first") === true ? (
                        <li style={{ fontSize: 13 }}>
                          <NavLink
                            to="#"
                            className={
                              currentStatus === "UNPAID"
                                ? "active"
                                : "not-active"
                            }
                            onClick={setCategory.bind(this, "UNPAID")}
                          >
                            <span className="nav-text">
                              <span>Unpaid</span>
                            </span>
                          </NavLink>
                        </li>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </ul>
                </SellModuleNav>
              </Card>
            </Col>
          )}
        <Col xxl={21} lg={21} xl={21} xs={17}>
          <Card
            headless
            size="large"
            className="order-card"
            style={{ backgroundColor: "transparent" }}
          >
            {currentStatus === "ALL" && (
              <All
                searchText={search}
                CustomTableData={customTablesInfo}
                setCustomTableOrderInLocalStorageHandler={
                  setCustomTableOrderInLocalStoragFunction
                }
                createNewTakeawayInLocalStorageHandler={
                  createNewTakeawayInLocalFunction
                }
                getAllTakeAwayDataInLocalFn={getAllTakeAwayDataInLocal}
                getTakeawayInLocalStorageHandler={
                  getTakeawayInLocalStorageHandlerFunction
                }
                createNewDeliveryInLocalStorageHandler={
                  createNewDeliveryInLocalFunction
                }
                getAllDeliveryDataInLocalFn={getAllDeliveryDataInLocal}
                getDeliveryInLocalStorageHandler={
                  getDeliveryInLocalStorageHandlerFunction
                }
                localCartInfo={localCartInfo}
                handleSplit={handleSplit}
              />
            )}
            {currentStatus === "TAKE_AWAY" && (
              <TakeAway
                props={props}
                searchText={search}
                createNewTakeawayInLocalStorageHandler={
                  createNewTakeawayInLocalFunction
                }
                getAllTakeAwayDataInLocalFn={getAllTakeAwayDataInLocal}
                getTakeawayInLocalStorageHandler={
                  getTakeawayInLocalStorageHandlerFunction
                }
                localCartInfo={localCartInfo}
              />
            )}
            {currentStatus === "DELIVERY" && (
              <Delivery
                searchText={search}
                props={props}
                createNewDeliveryInLocalStorageHandler={
                  createNewDeliveryInLocalFunction
                }
                getAllDeliveryDataInLocalFn={getAllDeliveryDataInLocal}
                getDeliveryInLocalStorageHandler={
                  getDeliveryInLocalStorageHandlerFunction
                }
                localCartInfo={localCartInfo}
              />
            )}
            {currentStatus === "FREE" && (
              <Free
                searchText={search}
                props={props}
                CustomTableData={customTablesInfo}
                setCustomTableOrderInLocalStorageHandler={
                  setCustomTableOrderInLocalStoragFunction
                }
                localCartInfo={localCartInfo}
              />
            )}
            {currentStatus === "OCCUPIED" && (
              <Occupied
                searchText={search}
                CustomTableData={customTablesInfo}
                setCustomTableOrderInLocalStorageHandler={
                  setCustomTableOrderInLocalStoragFunction
                }
                localCartInfo={localCartInfo}
                handleSplit={handleSplit}
              />
            )}
            {currentStatus == selectedCustomTable.name && (
              <CustomTable
                searchText={search}
                props={props}
                CustomTableData={selectedCustomTable.rows}
                setCustomTableOrderInLocalStorageHandler={
                  setCustomTableOrderInLocalStoragFunction
                }
                localCartInfo={localCartInfo}
                handleSplit={handleSplit}
              />
            )}
            {currentStatus == "UNPAID" && (
              <Unpaid
                searchText={search}
                CustomTableData={customTablesInfo}
                setCustomTableOrderInLocalStorageHandler={
                  setCustomTableOrderInLocalStoragFunction
                }
                localCartInfo={localCartInfo}
                handleSplit={handleSplit}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { OrderBuilder };
