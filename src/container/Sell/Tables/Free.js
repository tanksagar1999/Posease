import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import "../sell.css";
import { updateTableSelected } from "../../../redux/sell/actionCreator";
import {
  getTableStatusFromId,
  checkIfTableIsSelected,
  getCartInfoLocalListsData,
} from "../../../utility/localStorageControl";
import _ from "lodash";

const Free = (props) => {
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    searchText,
  } = props;

  const dispatch = useDispatch();
  let [freeData, setFreeData] = useState([]);
  const currentRegisterDetails = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  useEffect(() => {
    let localStoreData = getCartInfoLocalListsData(currentRegisterDetails);

    if (localStoreData != null && currentRegisterDetails) {
      let inProgressTables = localStoreData.filter(
        (data) =>
          (data.Status == "In Progress" || data.Status == "Unpaid") &&
          data.register_id == currentRegisterDetails._id
      );

      if (CustomTableData != null && CustomTableData.length > 0) {
        setFreeData(
          CustomTableData.map((table) => {
            let dataTable = { ...table };
            dataTable.rows = dataTable.rows.filter(
              (row) =>
                !inProgressTables.filter((data) => data.tableName == row)
                  .length > 0
            );
            return dataTable;
          })
        );
      }
    }
  }, [props]);

  function setTableStatusOccupied(tableName) {
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
    <div className="sell-table-parent free-parent list-boxmain">
      <Row gutter={[2, 2]} className="all-row list-box-row">
        {freeData.length > 0
          ? freeData.map((table) =>
              table.rows.map((value, index) => (
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
                    onClick={() => setTableStatusOccupied(value)}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{value}</div>
                      <div className="postion">
                        <div className="product-price inlineDIv"></div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            )
          : ""}
      </Row>
    </div>
  );
};

export { Free };
