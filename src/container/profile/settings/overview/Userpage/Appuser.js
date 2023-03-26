import React, { useState, useEffect, useRef } from "react";
import { Table, Checkbox, Modal, Input } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import {
  getAllappUserList,
  deleteappUser,
} from "../../../../../redux/appUser/actionCreator";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Appuser = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let isMounted = useRef(true);
  const [selectionType] = useState("checkbox");
  const [appUserList, setappUserList] = useState([]);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let [search, setsearch] = useState("");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);

  useEffect(() => {
    async function fetchappUserList() {
      const getappUserList = await dispatch(getAllappUserList("sell"));
      if (isMounted.current && getappUserList && getappUserList.appUserList)
        setappUserList(getappUserList.appUserList);
    }
    if (isMounted.current) {
      fetchappUserList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: appUserList,
  });

  const deleteSelectedappUser = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allappUserIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allappUserIdsForDelete.push(item.id);
    });
    const getDeletedappUser = await dispatch(
      deleteappUser({ ids: allappUserIdsForDelete })
    );
    if (
      getDeletedappUser &&
      getDeletedappUser.appUserDeletedData &&
      !getDeletedappUser.appUserDeletedData.error
    ) {
      const getappUserList = await dispatch(getAllappUserList());
      setModelDeleteVisible(false);
      setappUserList(getappUserList.appUserList);
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

  let searchArrappUser = appUserList.filter((value) =>
    value.username.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];
  if (searchArrappUser.length)
    searchArrappUser.map((value) => {
      const { _id, key, username, pin } = value;
      return dataSource.push({
        id: _id,
        appUser_name: username,
        appUser_pin: pin,
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
      title: "app User Name",
      dataIndex: "appUser_name",
      key: "appUser_name",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "app User PIN",
      dataIndex: "appUser_pin",
      key: "appUser_pin",
      align: "left",
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
              placeholder="Search by app user name"
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
            to={offLineMode ? "#" : "/settings/users/add/app-user"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add App User
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
          onOk={deleteSelectedappUser}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected appUser user ?</p>
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
                : history.push(`/settings/users/add/app-user`, {
                    appUser_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Appuser;
