import React from "react";
import { List, Typography } from "antd";
import "../sell.css";

const data = [
  "All",
  "Top",
  "Soup",
  "Sandwitches & Pizza",
  "Oriental Starter",
  "Tandoori Starter",
  "Continental Starter",
  "Salad & Raita",
];

const ItemCategoryList = (props) => {
  return (
    <>
      <List
        header={<div>Category</div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text mark></Typography.Text> {item}
          </List.Item>
        )}
      />
    </>
  );
};

export { ItemCategoryList };
