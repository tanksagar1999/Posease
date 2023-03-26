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
  getAllAddtionalList,
  deleteCustomField,
} from "../../../../../redux/customField/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const AdditionalDetails = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let [search, setsearch] = useState("");
  const [selectionType] = useState("checkbox");
  const dispatch = useDispatch();
  const history = useHistory();
  let isMounted = useRef(true);
  const [state, setState] = useState();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [AddtionalList, setAddtionalList] = useState([]);
  useEffect(() => {
    async function fetchAddtionalList() {
      const getAddtionalList = await dispatch(getAllAddtionalList("sell"));
      if (
        isMounted.current &&
        getAddtionalList &&
        getAddtionalList.AddtionalList
      )
        setAddtionalList(getAddtionalList.AddtionalList);
    }
    if (isMounted.current) {
      fetchAddtionalList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const deleteSelectedCustomField = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allCustomFieldIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allCustomFieldIdsForDelete.push(item.id);
    });
    const getDeletedCustomField = await dispatch(
      deleteCustomField({ ids: allCustomFieldIdsForDelete })
    );
    if (
      getDeletedCustomField &&
      getDeletedCustomField.CustomFieldDeletedData &&
      !getDeletedCustomField.CustomFieldDeletedData.error
    ) {
      const getCustomFieldList = await dispatch(getAllAddtionalList());
      setModelDeleteVisible(false);
      setAddtionalList(getCustomFieldList.AddtionalList);
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
  let searchArrAddtional = AddtionalList.filter((value) =>
    value.name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchArrAddtional.length)
    searchArrAddtional.map((value) => {
      const { _id, name, sub_type, print_this_field_on_receipts } = value;
      return dataSource.push({
        id: _id,
        additional_name: name,
        additional_detail: sub_type,
        is_printable: print_this_field_on_receipts === true ? "Yes" : "No",
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
      title: "Name",
      dataIndex: "additional_name",
      key: "additional_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Additional Detail Type",
      dataIndex: "additional_detail",
      key: "additional_detail",
    },
    {
      title: "Is Printable On Receipt?",
      dataIndex: "is_printable",
      key: "is_printable",
    },
  ];
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
                : "/settings/custom-fields/add/additional_detail"
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
          <p>Are you sure you want to delete selected additional details ?</p>
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
                : history.push(
                    `/settings/custom-fields/add/additional_detail`,
                    {
                      CutomeField_id: row.id,
                    }
                  ),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default AdditionalDetails;
