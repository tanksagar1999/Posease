import React, { useState, useEffect, useRef } from "react";
import { Table, Checkbox, Modal, Input } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import {
  getAllWaiterUserList,
  deleteWaiterUser,
} from "../../../../../redux/waiterUser/actionCreator";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Waiters = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let isMounted = useRef(true);
  const [selectionType] = useState("checkbox");
  const [waiterUserList, setwaiterUserList] = useState([]);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let [search, setsearch] = useState("");

  useEffect(() => {
    async function fetchwaiterUserList() {
      const getwaiterUserList = await dispatch(getAllWaiterUserList("sell"));
      if (
        isMounted.current &&
        getwaiterUserList &&
        getwaiterUserList.waiterUserList
      )
        setwaiterUserList(getwaiterUserList.waiterUserList);
    }
    if (isMounted.current) {
      fetchwaiterUserList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const [state, setState] = useState();
  const dataSource = [];

  let searchWaiterArr = waiterUserList.filter((value) =>
    value.username.toLowerCase().includes(search.toLowerCase())
  );
  if (searchWaiterArr.length)
    searchWaiterArr.map((value) => {
      const { _id, username, pin, register_assigned_to } = value;
      return dataSource.push({
        id: _id,
        kitchen_name: username,
        kitchen_pin: pin,
        register: register_assigned_to?.register_name
          ? register_assigned_to?.register_name
          : "",
      });
    });

  const deleteSelectedWaiterUser = async () => {
    const { allSelectedRowsForDelete } = state;
    let allwaiterUserIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allwaiterUserIdsForDelete.push(item.id);
    });
    const getDeletedwaiterUser = await dispatch(
      deleteWaiterUser({ ids: allwaiterUserIdsForDelete })
    );
    if (
      getDeletedwaiterUser &&
      getDeletedwaiterUser.waiterUserDeletedData &&
      !getDeletedwaiterUser.waiterUserDeletedData.error
    ) {
      const getwaiterUserList = await dispatch(getAllWaiterUserList());
      setModelDeleteVisible(false);

      setwaiterUserList(getwaiterUserList.waiterUserList);
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };

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
  const columns = [
    {
      title: (
        <>
          {" "}
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
      title: "Waiter Name",
      dataIndex: "kitchen_name",
      key: "kitchen_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Waiter PIN",
      dataIndex: "kitchen_pin",
      key: "kitchen_pin",
    },
    {
      title: "Waiter Register",
      dataIndex: "register",
      key: "register",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", marginLeft: "10px" }}>
            <Input
              suffix={<SearchOutlined />}
              autoFocus
              placeholder="Search by waiter name"
              style={{
                borderRadius: "30px",
                width: "250px",
              }}
              onChange={(e) => setsearch(e.target.value)}
              value={search}
            />
          </div>
        }
        isbutton={[
          <NavLink
            to={offLineMode ? "#" : "/settings/users/add/waiter"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Waiter
          </NavLink>,
        ]}
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
        <Modal
          title="Confirm Delete"
          okText="Delete"
          visible={modalDeleteVisible}
          onOk={deleteSelectedWaiterUser}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected waiter ?</p>
        </Modal>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          size="small"
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`/settings/users/add/waiter`, {
                    waiterUser_id: row.id,
                  }),
          })}
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Waiters;
