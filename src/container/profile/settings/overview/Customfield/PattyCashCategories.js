import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Input } from "antd";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import "../../setting.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPattyCashList,
  deleteCustomField,
} from "../../../../../redux/customField/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const PattyCashCategories = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const dispatch = useDispatch();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let isMounted = useRef(true);
  let [search, setsearch] = useState("");
  const history = useHistory();
  const [PattyCashList, setPattyCashList] = useState([]);
  const [selectionType] = useState("checkbox");
  const [state, setState] = useState();
  useEffect(() => {
    async function fetchPattyCashList() {
      const getPattyCashList = await dispatch(getAllPattyCashList("sell"));
      if (
        isMounted.current &&
        getPattyCashList &&
        getPattyCashList.PattyCashList
      )
        setPattyCashList(getPattyCashList.PattyCashList);
    }
    if (isMounted.current) {
      fetchPattyCashList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const deleteSelectedCustomField = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;

    const getDeletedCustomField = await dispatch(
      deleteCustomField({ ids: allSelectedRowsForDelete })
    );
    if (
      getDeletedCustomField &&
      getDeletedCustomField.CustomFieldDeletedData &&
      !getDeletedCustomField.CustomFieldDeletedData.error
    ) {
      const getCustomFieldList = await dispatch(getAllPattyCashList());
      setModelDeleteVisible(false);
      setPattyCashList(getCustomFieldList.PattyCashList);
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
  let searchArrPattyCash = PattyCashList.filter((value) =>
    value.name.toLowerCase().includes(search.toLowerCase())
  );
  if (searchArrPattyCash.length)
    searchArrPattyCash.map((value) => {
      const { _id, name, description } = value;
      return dataSource.push({
        id: _id,
        payment_name: name,
        description: description,
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
    },
    {
      title: "Petty Cash Category",
      dataIndex: "payment_name",
      key: "payment_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          <div style={{ boxShadow: "none", marginLeft: "10px" }}>
            <Input
              className="set_serbt"
              suffix={<SearchOutlined />}
              autoFocus
              placeholder="Search by Name"
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
            to={
              offLineMode
                ? "#"
                : "/settings/custom-fields/add/petty_cash_category"
            }
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Custom Field
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
          onOk={deleteSelectedCustomField}
          onCancel={handleCancel}
          width={600}
        >
          <p>
            Are you sure you want to delete selected petty cash categories ?
          </p>
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
                : history.push(
                    `/settings/custom-fields/add/petty_cash_category`,
                    {
                      CutomeField_id: row.id,
                    }
                  ),
          })}
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default PattyCashCategories;
