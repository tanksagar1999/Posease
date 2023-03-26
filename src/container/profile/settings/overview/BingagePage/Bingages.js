import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import { SearchOutlined } from "@ant-design/icons";
// import {
//   deleteBingages,
// } from "../../../../../redux/register/actionCreator";
import { getAllProductList } from "../../../../../redux/products/actionCreator";
import {
  getAllBingageList,
  deleteBingages,
} from "../../../../../redux/bingage/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Bingages = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [RegisterList, setRegisterList] = useState([]);

  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  useEffect(() => {
    async function fetchRegisterList() {
      const getRegisterList = await dispatch(getAllBingageList());

      if (isMounted.current && getRegisterList) {
        setRegisterList(getRegisterList);
      }
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
    const getDeletedBingages = await dispatch(
      deleteBingages({ ids: allRegisterIdsForDelete })
    );
    if (getDeletedBingages && !getDeletedBingages.error) {
      setModelDeleteVisible(false);
      async function fetchRegisterList() {
        const getRegisterList = await dispatch(getAllBingageList());
        if (isMounted.current && getRegisterList) {
          setRegisterList(getRegisterList);
        }
      }
      if (isMounted.current) {
        fetchRegisterList();
      }
      return () => {
        isMounted.current = false;
      };
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
    value.registerId?.register_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
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
      const { _id, registerId, bingageKey } = value;
      return dataSource.push({
        id: _id,
        register_name: registerId.register_name,
        receipt_number_prefix: bingageKey,
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
      title: "CRM API key",
      dataIndex: "receipt_number_prefix",
      key: "receipt_number_prefix",
      render(text, record) {
        return {
          children: <div>{`XXXXXXXXXX${text.substr(text.length - 5)}`}</div>,
        };
      },
    },
  ];

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", margin: " 0 0 0 3px" }}>
            <Input
              suffix={<SearchOutlined />}
              className="set_serbt"
              autoFocus
              placeholder="Search by api key"
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
            to={offLineMode ? "#" : "bingage/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Integration
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
          onOk={deleteSelectedRegister}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete Bingages ?</p>
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
                : history.push(`bingage/add`, {
                    data: row,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Bingages;
