import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Upload,
  message,
} from "antd";

const Exportform = () => {
  return (
    <div>
      <Form style={{ width: "100%" }} name="addProduct">
        <div className="add-product-block">
          <div className="add-product-content">
            <Form.Item name="Email Address" label="Send to Email Address">
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export { Exportform };
