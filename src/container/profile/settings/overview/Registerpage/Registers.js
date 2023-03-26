import React, { useState, useRef, useEffect, useContext } from "react";
import { Table, Input, Modal, Button } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllRegisterList,
  deleteRegister,
} from "../../../../../redux/register/actionCreator";
import { setItem, getItem } from "../../../../../utility/localStorageControl";

import { getAllProductList } from "../../../../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Registers = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [RegisterList, setRegisterList] = useState([]);
  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [mobialResponse, setMobialResponse] = useState("");

  useEffect(() => {
    async function fetchRegisterList() {
      const getRegisterList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
        setRegisterList(getRegisterList.RegisterList);
    }
    if (isMounted.current) {
      fetchRegisterList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: RegisterList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (RegisterList) {
      setState({
        item: RegisterList,
        selectedRowKeys,
      });
    }
  }, [RegisterList, selectedRowKeys]);

  const deleteSelectedRegister = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allRegisterIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allRegisterIdsForDelete.push(item.id);
    });
    const getDeletedRegister = await dispatch(
      deleteRegister({ ids: allRegisterIdsForDelete })
    );

    if (
      getDeletedRegister &&
      getDeletedRegister.RegisterDeletedData &&
      !getDeletedRegister.RegisterDeletedData.error
    ) {
      const getRegisterList = await dispatch(getAllRegisterList());
      if (getRegisterList?.RegisterList) {
        let getProductList = await dispatch(getAllProductList());
        if (getProductList && getProductList.productList) {
          setModelDeleteVisible(false);
          setRegisterList(getRegisterList.RegisterList);
          setState({
            ...state,
            allSelectedRowsForDelete: [],
          });
        }
      }
    }
  };
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);

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
  let searchArrTaxes = RegisterList.filter((value) =>
    value.register_name.toLowerCase().includes(search.toLowerCase())
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  if (searchArrTaxes.length)
    searchArrTaxes.map((value) => {
      const {
        key,
        _id,
        register_name,
        print_receipts,
        receipt_number_prefix,
      } = value;
      return dataSource.push({
        id: _id,
        register_name: register_name,
        receipt_number_prefix: receipt_number_prefix,
        print_receipts: print_receipts,
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
      title: "Register Name",
      dataIndex: "register_name",
      textAlign: "center",
      key: "register_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Receipt Number Prefix",
      dataIndex: "receipt_number_prefix",
      key: "receipt_number_prefix",
    },
    {
      title: "Print Receipts?",
      dataIndex: "print_receipts",
      key: "print_receipts",
      align: "left",
      render(text, record) {
        return {
          children: <div>{text === true ? "Yes" : "No"}</div>,
        };
      },
    },
  ];

  return (
    <>
      <Cards
        title={
          <div
            style={{
              boxShadow: "none",
              margin: " 0 0 0 3px",
            }}
          >
            <Input
              suffix={<SearchOutlined />}
              className="set_serbt"
              autoFocus
              placeholder="Search by Register Name"
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
            to={offLineMode ? "#" : "registers/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Register
          </NavLink>
        }
      >
        <p style={{ display: "none" }}>{loading}</p>
        <Modal
          title="Confirm Delete"
          okText={
            loading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 16,
                      color: "white",
                      margin: "0px 14px",
                    }}
                    spin
                  />
                }
              />
            ) : (
              "Delete"
            )
          }
          visible={modalDeleteVisible}
          onOk={deleteSelectedRegister}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete Register ?</p>
        </Modal>
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
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
                : history.push(`registers/edit`, {
                    register_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Registers;
