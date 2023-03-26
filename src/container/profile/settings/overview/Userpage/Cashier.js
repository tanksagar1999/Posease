import React, { useState, useEffect, useRef } from "react";
import { Table, Checkbox, Modal, Input } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import propTypes from "prop-types";
import "../../setting.css";
import {
  getAllCashiersList,
  deleteCashiers,
} from "../../../../../redux/cashiers/actionCreator";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AutoCompleteStyled } from "../../../../../components/autoComplete/style";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Cashier = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let isMounted = useRef(true);
  const [selectionType] = useState("checkbox");
  const [CashiersList, setCashiersList] = useState([]);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let [search, setsearch] = useState("");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);

  useEffect(() => {
    async function fetchCashiersList() {
      const getCashiersList = await dispatch(getAllCashiersList("sell"));
      if (isMounted.current && getCashiersList && getCashiersList.cashiersList)
        setCashiersList(getCashiersList.cashiersList);
      return getCashiersList.cashiersList;
    }
    if (isMounted.current) {
      let data = fetchCashiersList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: CashiersList,
  });

  const deleteSelectedCashiers = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allCashiersIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allCashiersIdsForDelete.push(item.id);
    });
    const getDeletedCashiers = await dispatch(
      deleteCashiers({ ids: allCashiersIdsForDelete })
    );
    if (
      getDeletedCashiers &&
      getDeletedCashiers.cashiersDeletedData &&
      !getDeletedCashiers.cashiersDeletedData.error
    ) {
      const getCashiersList = await dispatch(getAllCashiersList());
      setModelDeleteVisible(false);
      setCashiersList(getCashiersList.cashiersList);
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  let searchArrCashiers = CashiersList.filter((value) =>
    value.username.toLowerCase().includes(search.toLowerCase())
  );
  const dataSource = [];
  if (searchArrCashiers.length)
    searchArrCashiers.map((value) => {
      const {
        _id,
        key,
        username,
        pin,
        has_manager_permission,
        register_assigned_to,
      } = value;

      return dataSource.push({
        id: _id,
        cashier_name: username,
        cashier_pin: pin,
        has_manager: has_manager_permission === true ? "Yes" : "No",
        register: register_assigned_to
          ? register_assigned_to.register_name
          : "",
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
            <CaretDownOutlined style={{ marginLeft: "12px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      width: "2%",
    },
    {
      title: "Cashier Name",
      dataIndex: "cashier_name",
      key: "cashier_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Cashier Pin",
      dataIndex: "cashier_pin",
      key: "cashier_pin",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "Has Manager Permissions?",
      dataIndex: "has_manager",
      key: "has_manager",
    },
    {
      title: "Cashier Register",
      dataIndex: "register",
      align: "left",
      key: "register",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", marginLeft: "10px" }}>
            <Input
              suffix={<SearchOutlined />}
              autoFocus
              placeholder="Search by Cashier Name"
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
            to={offLineMode ? "#" : "/settings/users/add/cashier"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Cashier
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
          onOk={deleteSelectedCashiers}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected cashiers ?</p>
        </Modal>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`/settings/users/add/cashier`, {
                    cashiers_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

Cashier.propTypes = {
  match: propTypes.object,
};

export default Cashier;
