import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Checkbox, Radio, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Main, TableWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { getAllOrderList, } from "../../../redux/onlineOrder/actionCreator"
import "../sell.css";

const Ready = (props) => {
  const { currentRegisterData, orderTabChange } = props
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [totalOrders, setTotalOrderList] = useState([])
  async function fetchAllOrders() {
    if (currentRegisterData?.onlineOrder) {
      const getAllOrderDetailsList = await dispatch(getAllOrderList(currentRegisterData.onlineOrder));
      console.log("getAllOrderListgetAllOrderList", getAllOrderDetailsList)
      if (getAllOrderDetailsList && getAllOrderDetailsList[0]?.orders) {
        setTotalOrderList(getAllOrderDetailsList[0].orders.filter((val) => val.status.order_status == "ordered" && val.status.delivery_status == "arrived"))
        return getAllOrderDetailsList[0].orders
      }

    }

  }
  useEffect(() => {
    if (isMounted.current) {
      fetchAllOrders();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const acceptOrder = async (record) => {
    orderTabChange("ORDER")
  }

  const dataSource = [];
  console.log("totalOrders", totalOrders)
  if (totalOrders.length)
    totalOrders.map((value) => {
      const {
        id,
        Source,
        order_id,
        Time,
        cart,
        bill,
        Type,
        customer,
        status
      } = value;
      const { items } = value.cart
      console.log("Items32323", value)
      return dataSource.push({
        id: order_id,

        Source: Source,
        order_id: order_id,
        Value: bill,
        Time: Time,
        Items: items,
        Type: status.order_status,
        Customer: customer,
      });
    });

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render(value, record) {
        return {
          children: (
            <>
              <Button
                onClick={() => acceptOrder(record)}
                style={{ cursor: "pointer", fontSize: "17px", marginRight: 10 }}
              >
                Complate
              </Button>
            </>
          ),
        };
      },

    },
    {
      title: "Source",
      dataIndex: "Source",
      key: "source",
      onFilter: (value, record) => record.channel.includes(value),
      filters: [
        {
          text: "Zometo",
          value: "Zometo",
        },
        {
          text: "Swiggi",
          value: "Swiggi",
        },
      ],
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: "15%",
    },
    {
      title: "Items",
      dataIndex: "Items",
      key: "Items",
      render(value, record) {
        return {
          children: (
            <>
              {value.map((val) => <p>{val.quantity} x {val.name}</p>)}
            </>
          ),
        };
      },
    },
    {
      title: "Value",
      dataIndex: "Value",
      key: "Value",
    },
    {
      title: "Satatus ",
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: "Customer",
      dataIndex: "Customer",
      key: "Customer",
      render(value, record) {
        return {
          children: (
            <>
              {
                value.customer_name
              }
            </>
          ),
        };
      },
    },
  ]

  return (
    <div>
      <TableWrapper className="table-seller table-responsive">
        <Table
          rowKey="id"
          size="small"
          className="seller-table"
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            total: dataSource.length,
          }}
        />
      </TableWrapper>
    </div>
  );
};

export { Ready };
