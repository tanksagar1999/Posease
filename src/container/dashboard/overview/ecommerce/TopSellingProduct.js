import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { getAlldashboradDatwiseChangeData } from "../../../../redux/dashboard/actionCreator";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import moment from "moment";
import "./ecomstyle.css";
const TopSellingProduct = ({ dashBoardDataDetails }) => {
  const dispatch = useDispatch();
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (dashBoardDataDetails?.top_selling) {
      setTopProducts(dashBoardDataDetails.top_selling);
    }
  }, [dashBoardDataDetails]);

  const sellingData = [];
  if (topProducts.length > 0) {
    topProducts.map((value) => {
      const { count, _id } = value;
      return sellingData.push({
        _id,
        count,
      });
    });
  }

  const sellingColumns = [
    {
      className: "ProductClass",
      title: "Product Name",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: "30%",
    },
    {
      width: "40%",
    },
    {
      className: "ProductClass",
      title: "Today Demand",
      dataIndex: "count",
      align: "center",
      key: "count",
      width: "30%",
    },
  ];

  return (
    <div className="full-width-table to-sel-pad top_selltab">
      <Cards title="Top Selling" size="large">
        <div className="table-responsive">
          <Table
            scroll={false}
            columns={sellingColumns}
            dataSource={sellingData}
            pagination={false}
            fixed={true}
            size="small"
          />
        </div>
      </Cards>
    </div>
  );
};

export { TopSellingProduct };
