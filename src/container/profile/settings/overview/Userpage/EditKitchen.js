import React, { useState } from "react";
import { Table, Checkbox, Row, Col, Input, Divider, Form, Select } from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";

import "../../setting.css";

const EditKitchen = () => {
  // const handleSubmit = values => {
  //   setState({ ...state, submitValues: values });
  // };
  const { Option } = Select;
  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Kitchen User Details</Heading>
            <span>
              Kitchen users have access only to Poster Kitchen Display System
              (KDS) App.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form.Item
              name="name"
              label="Kitchen User Name"
              rules={[
                { required: true, message: "Kitchen User Name required" },
              ]}
            >
              <Input style={{ marginBottom: 10 }} />
            </Form.Item>

            <Form.Item
              name="name"
              label="Kitchen User PIN"
              rules={[{ required: true, message: "Kitchen User Pin required" }]}
            >
              <Input style={{ marginBottom: 10 }} />
            </Form.Item>

            <Form.Item
              name="register_type"
              initialValue="Wine"
              label="Register"
              rules={[{ required: true, message: "Register type required" }]}
            >
              <Select style={{ width: "100%" }}>
                <Option value="">Please Cashier Register</Option>
                <Option value="Main Register">Main Register</Option>
              </Select>
            </Form.Item>
            <Form.Item name="remember">
              <Checkbox className="add-form-check">
                Allow manager permissions{" "}
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ float: "right" }}>
              <Button
                className="go-back-button"
                size="small"
                type="white"
                style={{ marginRight: "10px" }}
              >
                Go Back
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export { EditKitchen };
