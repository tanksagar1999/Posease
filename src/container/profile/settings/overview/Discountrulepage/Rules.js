import React, { useRef, useEffect, useState } from "react";
import { Table, Input, Modal, Badge } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import { NavLink, useHistory } from "react-router-dom";
import "../../setting.css";
import commonFunction from "../../../../../utility/commonFunctions";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDiscountRulesList,
  deleteDiscountRules,
} from "../../../../../redux/discountRules/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Rules = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let [search, setsearch] = useState("");
  const [selectionType] = useState("checkbox");
  const dispatch = useDispatch();
  const history = useHistory();
  let isMounted = useRef(true);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [DiscountRulesList, setDiscountRulesList] = useState([]);
  const [state, setState] = useState();

  useEffect(() => {
    async function fetchDiscountRulesList() {
      const getDiscountRulesList = await dispatch(
        getAllDiscountRulesList("sell")
      );
      if (
        isMounted.current &&
        getDiscountRulesList &&
        getDiscountRulesList.DiscountRulesList
      )
        setDiscountRulesList(getDiscountRulesList.DiscountRulesList);
    }
    if (isMounted.current) {
      fetchDiscountRulesList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deleteSelectedDiscountRules = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allDiscountRulesIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allDiscountRulesIdsForDelete.push(item.id);
    });
    const getDeletedDiscountRules = await dispatch(
      deleteDiscountRules({ ids: allDiscountRulesIdsForDelete })
    );
    if (
      getDeletedDiscountRules &&
      getDeletedDiscountRules.DiscountRulesDeletedData &&
      !getDeletedDiscountRules.DiscountRulesDeletedData.error
    ) {
      const getDiscountRulesList = await dispatch(getAllDiscountRulesList());
      setModelDeleteVisible(false);
      setDiscountRulesList(getDiscountRulesList.DiscountRulesList);
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };

  const contentforaction = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setLoading(false);
          setModelDeleteVisible(true);
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  let searchArrDiscount = DiscountRulesList.filter((value) =>
    value.coupon_code.toLowerCase().includes(search.toLowerCase())
  );
  if (DiscountRulesList.length)
    searchArrDiscount.map((value) => {
      const {
        key,
        _id,
        coupon_code,
        discount_type,
        level,
        discount,
        start_date,
        end_date,
        status,
      } = value;

      return dataSource.push({
        id: _id,
        key: key,
        coupon_code: coupon_code,
        type:
          discount_type == "fixed_amount"
            ? "Fixed Amount"
            : discount_type == "percentage"
            ? "Percentage"
            : "Buy X Get Y",
        level: level == "product" ? "Product" : "Order",
        discount:
          discount_type == "percentage"
            ? discount == undefined
              ? ""
              : `${discount}%`
            : discount,
        start_date: start_date,
        end_date: end_date,
        status: status === "enable" ? "Enabled" : "Disabled",
      });
    });
  const columns = [
    {
      title: (
        <>
          <Popover
            placement="bottomLeft"
            content={contentforaction}
            trigger="click"
          >
            <CaretDownOutlined style={{ marginLeft: "0px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      width: "2%",
    },
    {
      title: "Coupon code",
      dataIndex: "coupon_code",
      key: "coupon_code",

      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date, record) => (
        <div>{commonFunction.convertToDate(start_date, "MMM DD, Y")}</div>
      ),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date, record) =>
        end_date ? (
          <div>{commonFunction.convertToDate(end_date, "MMM DD, Y")}</div>
        ) : (
          <div style={{ marginLeft: "30px" }}>-</div>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "left",
      render(text, record) {
        return {
          props: {
            className: "custom-td",
            style: { textAlign: "left" },
          },
          children: (
            <div>
              <Badge status={text === "Enabled" ? "success" : "error"} />
              {text}
            </div>
          ),
        };
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", margin: "0 0 0 3px" }}>
            <Input
              suffix={<SearchOutlined />}
              className="set_serbt"
              autoFocus
              placeholder="Search by Coupon code"
              style={{
                borderRadius: "30px",
                width: "250px",
              }}
              onChange={(e) => setsearch(e.target.value)}
              value={search}
            />
          </div>
        }
        isbutton={
          <NavLink
            to={offLineMode ? "#" : "/settings/discount-rules/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Discount Rule
          </NavLink>
        }
      >
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
        </Modal>
        <p style={{ display: "none" }}>{loading}</p>
        <Modal
          title="Confirm Delete"
          okText={
            loading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 16, color: "white", margin: "0px 14px" }}
                    spin
                  />
                }
              />
            ) : (
              "Delete"
            )
          }
          visible={modalDeleteVisible}
          onOk={deleteSelectedDiscountRules}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected DiscountRules ?</p>
        </Modal>
        <Table
          rowKey="id"
          fixed={true}
          dataSource={dataSource}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`/settings/discount-rules/edit/${row.id}`),
          })}
          columns={columns}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Rules;
