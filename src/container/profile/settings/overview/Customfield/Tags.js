import React, { useState, useRef, useEffect } from "react";
import { Table, Modal, Input } from "antd";
import { NavLink, useHistory } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import "../../setting.css";
import {
  getAllTagList,
  deleteCustomField,
} from "../../../../../redux/customField/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Tags = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let [search, setsearch] = useState("");
  const [selectionType] = useState("checkbox");
  const dispatch = useDispatch();
  const [state, setState] = useState();
  const history = useHistory();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  let isMounted = useRef(true);
  const [TagList, setTagList] = useState([]);

  useEffect(() => {
    async function fetchTagList() {
      const getTagList = await dispatch(getAllTagList("sell"));
      if (isMounted.current && getTagList && getTagList.TagList)
        setTagList(getTagList.TagList);
    }
    if (isMounted.current) {
      fetchTagList();
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
      const getCustomFieldList = await dispatch(getAllTagList());
      setModelDeleteVisible(false);
      setTagList(getCustomFieldList.TagList);
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
  let searchArrTag = TagList.filter((value) =>
    value.name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchArrTag.length)
    searchArrTag.map((value) => {
      const {
        key,
        _id,
        name,
        sub_type,
        tag_color,
        print_this_field_on_receipts,
      } = value;
      return dataSource.push({
        id: _id,
        tag_name: name,
        tag_type: sub_type === "sale" ? "Sale Data" : "Customer Data",
        tag_color: tag_color,
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
      title: "Tag Name",
      dataIndex: "tag_name",
      key: "tag_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Tag Type",
      dataIndex: "tag_type",
      key: "tag_type",
    },
    {
      title: "Tag Color",
      dataIndex: "tag_color",
      key: "tag_color",
    },
    {
      title: "Is Printable",
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
            to={offLineMode ? "#" : "/settings/custom-fields/add/tag"}
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
          <p>Are you sure you want to delete selected tags ?</p>
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
                : history.push(`/settings/custom-fields/add/tag`, {
                    CutomeField_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Tags;
