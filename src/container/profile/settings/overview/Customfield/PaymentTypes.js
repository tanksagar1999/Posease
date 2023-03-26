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
  getAllPaymentTypeList,
  deleteCustomField,
} from "../../../../../redux/customField/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const PaymentTypes = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  let [search, setsearch] = useState("");
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [PaymentTypeList, setPaymentTypeList] = useState([]);
  const [state, setState] = useState();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  useEffect(() => {
    async function fetchPaymentType() {
      const getPaymentTypeList = await dispatch(getAllPaymentTypeList("sell"));
      if (
        isMounted.current &&
        getPaymentTypeList &&
        getPaymentTypeList.PaymentTypeList
      )
        setPaymentTypeList(getPaymentTypeList.PaymentTypeList);
    }

    if (isMounted.current) {
      fetchPaymentType();
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
      const getCustomFieldList = await dispatch(getAllPaymentTypeList());
      setModelDeleteVisible(false);
      setPaymentTypeList(getCustomFieldList.PaymentTypeList);
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
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  const dataSource = [];
  let searchArrPaymentType = PaymentTypeList.filter((value) =>
    value.name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchArrPaymentType.length)
    searchArrPaymentType.map((value) => {
      const { key, _id, name, description } = value;
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
      width: "2%",
    },
    {
      title: "Payment Name",
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
      width: "50%",
      align: "left",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
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
              className="set_serbt"
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
            to={offLineMode ? "#" : "/settings/custom-fields/add/payment_type"}
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
          <p>Are you sure you want to delete selected payment types ?</p>
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
                : history.push(`/settings/custom-fields/add/payment_type`, {
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

export default PaymentTypes;
