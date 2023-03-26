import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Modal } from "antd";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Button } from "../../../components/buttons/buttons";
import { Popover } from "../../../components/popup/popup";
import {
  getAllOrderTicketGroupedList,
  deleteOrderTicketGrouped,
} from "../../../redux/products/actionCreator";
import "./OrderTicket.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const OrderTicketGroup = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const history = useHistory();
  let searchInput = useRef(null);
  let isMounted = useRef(true);
  let [orderTicketGroupListData, setOrderTicketGroupListData] = useState([]);
  const [selectionType] = useState("checkbox");
  const dispatch = useDispatch();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  useEffect(() => {
    async function fetchOrderTicketGroupList() {
      const getOrderedTicketGroupList = await dispatch(
        getAllOrderTicketGroupedList("sell")
      );
      if (
        isMounted.current &&
        getOrderedTicketGroupList &&
        getOrderedTicketGroupList.orderTicketGroupList
      )
        setOrderTicketGroupListData(
          getOrderedTicketGroupList.orderTicketGroupList
        );
    }
    if (isMounted.current) {
      fetchOrderTicketGroupList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: orderTicketGroupListData,
  });

  const { item } = state;

  useEffect(() => {
    if (orderTicketGroupListData) {
      setState({
        item: orderTicketGroupListData,
      });
    }
  }, [orderTicketGroupListData]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#BD025D" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
  });

  const handleSearch = (selectedKeys = "", confirm) => {
    confirm();
    setState({
      ...state,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({
      ...state,
    });
  };

  const deleteSelectedOrderTicketGroup = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allOrderTicketIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allOrderTicketIdsForDelete.push(item.id);
    });
    const getDeletedOrderTicketGrouped = await dispatch(
      deleteOrderTicketGrouped({ ids: allOrderTicketIdsForDelete })
    );
    if (
      getDeletedOrderTicketGrouped &&
      getDeletedOrderTicketGrouped.deletedItem &&
      !getDeletedOrderTicketGrouped.deletedItem.error
    ) {
      const getGroupedList = await dispatch(getAllOrderTicketGroupedList());
      setModelDeleteVisible(false);
      setOrderTicketGroupListData(getGroupedList.orderTicketGroupList);
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

  if (orderTicketGroupListData.length > 0) {
    item.map((value, i) => {
      const { _id, order_ticket_group_name } = value;
      return dataSource.push({
        id: _id,
        key: i,
        order_ticket_group_name: order_ticket_group_name,
      });
    });
  }

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
      width: "10%",
    },
    {
      title: (
        <>
          <span style={{ float: "left" }}>Order Ticket Group</span>
        </>
      ),
      dataIndex: "order_ticket_group_name",
      key: "order_ticket_group_name",
      ...getColumnSearchProps("order_ticket_group_name"),
      render(text, record) {
        return {
          children: (
            <div style={text === "Main Kitchen" ? {} : { color: "#008cba" }}>
              {text}
            </div>
          ),
        };
      },
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
    <div>
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
        onOk={deleteSelectedOrderTicketGroup}
        onCancel={handleCancel}
        width={600}
      >
        <p>Are you sure you want to delete selected order ticket groups ?</p>
      </Modal>
      {dataSource.length > 0 && (
        <Table
          rowKey="id"
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              row.order_ticket_group_name !== "Main Kitchen"
                ? offLineMode
                  ? setOfflineModeCheck(true)
                  : history.push(
                      `product-categories/add-new-order-ticket-group`,
                      { order_ticket_grouped_id: row.id }
                    )
                : "",
          })}
          size="small"
          dataSource={dataSource}
          columns={columns}
          fixed={true}
          rowClassName={(record) =>
            record.order_ticket_group_name === "Main Kitchen" && "disabled-row"
          }
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            total: dataSource.length,
          }}
        />
      )}
    </div>
  );
};

export { OrderTicketGroup };
