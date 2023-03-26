import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Table } from "antd";
import { getCartInfoLocalListsData } from "../../../utility/localStorageControl";
import { useSelector } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import EditTableNameModal from "./../../Sell/Current/EditTableNameModal";
import commonFunction from "../../../utility/commonFunctions";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { getItem, setItem } from "../../../utility/localStorageControl";

const DraftBuilder = (props) => {
  const [ModelView, setModelViewData] = useState(false);

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
  const {
    editCartProductDetails,
    setLocalCartCount,
    tabChangeToCurrent,
    setlocalCartInfo,
    setTableName,
  } = props;
  const [cartInfoLocalListsData, setCartInfoLocalListsData] = useState([]);
  setLocalCartCount(cartInfoLocalListsData ? cartInfoLocalListsData.length : 0);
  const [cartToEdit, setCartToEdit] = useState({});
  const editTableNameModalRef = useRef();
  const editTableNameFunction = (data) => {
    setCartToEdit(data);
    setModelViewData(true);
  };

  useEffect(() => {
    if (currentRegisterData) {
      setCartInfoLocalListsData(
        getCartInfoLocalListsData(currentRegisterData)
          .filter(
            (d) =>
              d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
          )
          .sort(function(left, right) {
            return moment
              .utc(left.created_at)
              .diff(moment.utc(right.created_at));
          })
          .reverse()
      );
    }
  }, []);
  const modelNameViewer = (value) => {
    setModelViewData(value);
  };

  const editTableName = (data) => {
    editCartProductDetails(data);
  };

  const updateInfoLocalListsDataFunction = () => {
    if (currentRegisterData) {
      setCartInfoLocalListsData(
        getCartInfoLocalListsData(currentRegisterData)
          .filter(
            (d) =>
              d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
          )
          .sort(function(left, right) {
            return moment
              .utc(left.created_at)
              .diff(moment.utc(right.created_at));
          })
          .reverse()
      );
    }
  };

  const columns = [
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at, item) => (
        <div
          onClick={(e) => {
            editTableName(item);
          }}
        >
          {item.cartKey == localStorage.getItem("active_cart") ? (
            <span className="active-dots" />
          ) : (
            ""
          )}
          {commonFunction.convertToDate(created_at, "MMM DD, Y h:mm A")}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "tableName",
      key: "tableName",
      render: (value, item) => (
        <div
          onClick={(e) => {
            editTableName(item);
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "otherDetails",

      key: "otherDetails",
      render: (record, item) => {
        return (
          <div
            onClick={(e) => {
              editTableName(item);
            }}
          >
            <a
              style={{ color: "#008cba", fontSize: "13px" }}
            >{`${rsSymbol}${record?.finalCharge}
          `}</a>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",

      key: "id",
      render: (tableName, item) => (
        <EditOutlined
          onClick={(e) => {
            editTableNameFunction(item);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Row gutter={15}>
        <Col md={24}>
          <Cards headless>
            <Table dataSource={cartInfoLocalListsData} columns={columns} />
          </Cards>
        </Col>
        <EditTableNameModal
          ref={editTableNameModalRef}
          cartDetails={cartToEdit}
          tabChangeToCurrent={tabChangeToCurrent}
          updateInfoLocalListsData={updateInfoLocalListsDataFunction}
          redirectToCurrent="no"
          modelVisible={modelNameViewer}
          modelVisibleValue={ModelView}
          setCartInfoLocalListsData={setCartInfoLocalListsData}
          setlocalCartInfo={setlocalCartInfo}
          setTableName={setTableName}
          activeTab="draftBuilder"
        />
      </Row>
    </>
  );
};
export { DraftBuilder };
