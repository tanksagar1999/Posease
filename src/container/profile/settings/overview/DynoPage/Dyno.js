import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";

import "../../setting.css";
import {
  SearchOutlined,
  ArrowRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";

import {
  getAlldynoList,
  deleteDynos,
} from "../../../../../redux/onlineOrder/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Dyno = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [DynoList, setDynoList] = useState([]);

  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  useEffect(() => {
    async function fetchDynoList() {
      const getdaynolist = await dispatch(getAlldynoList());

      if (isMounted.current && getdaynolist) {
        setDynoList(getdaynolist);
      }
    }
    if (isMounted.current) {
      fetchDynoList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: DynoList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (DynoList) {
      setState({
        item: DynoList,
        selectedRowKeys,
      });
    }
  }, [DynoList, selectedRowKeys]);

  const deleteSelectedRegister = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allRegisterIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allRegisterIdsForDelete.push(item.id);
    });
    const getDeletedBingages = await dispatch(
      deleteDynos({ ids: allRegisterIdsForDelete })
    );
    if (getDeletedBingages && !getDeletedBingages.error) {
      setModelDeleteVisible(false);
      async function fetchDynoList() {
        const getdaynolist = await dispatch(getAlldynoList());
        if (isMounted.current && getdaynolist) {
          setDynoList(getdaynolist);
        }
      }
      if (isMounted.current) {
        fetchDynoList();
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

  let searchArrTaxes = DynoList.filter((value) =>
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

  if (DynoList.length)
    searchArrTaxes.map((value) => {
      const { _id, registerId, url, orderType } = value;
      return dataSource.push({
        id: _id,
        register_name: registerId.register_name,
        url: url,
        Source: orderType,
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
            <CaretDownOutlined />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
    },
    {
      title: "Register Name",
      dataIndex: "register_name",
    },
    {
      title: "URL",
      dataIndex: "url",
    },
    {
      title: "Source",
      dataIndex: "Source",
    },

    // {
    //   title: "Manage Items",
    //   dataIndex: "Items",
    //   key: "Items",
    //   align: "left",
    //   render(text, record) {
    //     return {
    //       props: {
    //         style: { textAlign: "left" },
    //       },
    //       children: (
    //         <div>
    //           <ArrowRightOutlined
    //             onClick={(e) => {
    //               if (offLineMode) {
    //                 setOfflineModeCheck(true);
    //               } else {
    //                 e.stopPropagation();
    //                 history.push(`/settings/dyno/products`, {
    //                   urlName: `${record.url}`,
    //                 });
    //               }
    //             }}
    //           />
    //         </div>
    //       ),
    //     };
    //   },
    // },
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
              placeholder="Search by register name"
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
            to={offLineMode ? "#" : "dyno/add"}
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
          <p>Are you sure you want to delete Dyno ?</p>
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
                : history.push(`dyno/add`, {
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

export default Dyno;
