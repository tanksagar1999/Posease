import React, { useState, useEffect, useRef } from "react";
import { Table, Checkbox, Modal, Input } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import {
  getAllkitchenUserList,
  deletekitchenUser,
} from "../../../../../redux/kitchenUser/actionCreator";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Kitchens = () => {
  const dispatch = useDispatch();
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const history = useHistory();
  let isMounted = useRef(true);
  const [selectionType] = useState("checkbox");
  const [kitchenUserList, setkitchenUserList] = useState([]);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let [search, setsearch] = useState("");
  useEffect(() => {
    async function fetchkitchenUserList() {
      const getkitchenUserList = await dispatch(getAllkitchenUserList("sell"));
      if (
        isMounted.current &&
        getkitchenUserList &&
        getkitchenUserList.kitchenUserList
      )
        setkitchenUserList(getkitchenUserList.kitchenUserList);
    }
    if (isMounted.current) {
      fetchkitchenUserList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: kitchenUserList,
  });
  const deleteSelectedkitchenUser = async () => {
    const { allSelectedRowsForDelete } = state;
    let allkitchenUserIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allkitchenUserIdsForDelete.push(item.id);
    });
    const getDeletedkitchenUser = await dispatch(
      deletekitchenUser({ ids: allkitchenUserIdsForDelete })
    );
    if (
      getDeletedkitchenUser &&
      getDeletedkitchenUser.kitchenUserDeletedData &&
      !getDeletedkitchenUser.kitchenUserDeletedData.error
    ) {
      const getkitchenUserList = await dispatch(getAllkitchenUserList());
      setModelDeleteVisible(false);
      setkitchenUserList(getkitchenUserList.kitchenUserList);
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };
  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
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

  let searchArrkitchenUser = kitchenUserList.filter((value) =>
    value.username.toLowerCase().includes(search.toLowerCase())
  );

  const dataSourceitem = [];

  const dataSource = [];
  if (searchArrkitchenUser.length)
    searchArrkitchenUser.map((value) => {
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
        kitchen_name: username,
        kitchen_pin: pin,
        register: register_assigned_to?.register_name,
      });
    });
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };
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
      title: "Kitchen Name",
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
      title: "Kitchen PIN",
      dataIndex: "kitchen_pin",
      key: "kitchen_pin",
    },
    {
      title: "Kitchen Register",
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
              placeholder="Search by kitchen name"
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
            to={offLineMode ? "#" : "/settings/users/add/kitchen"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Kitchen User
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
          onOk={deleteSelectedkitchenUser}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected kitchen user ?</p>
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
                : history.push(`/settings/users/add/kitchen`, {
                    kitchenUser_id: row.id,
                  }),
          })}
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Kitchens;
