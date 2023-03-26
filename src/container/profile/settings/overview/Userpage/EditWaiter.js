import React, { useState } from "react";
import { Table, Checkbox, Row, Col, Input, Divider, Form, Select } from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";

const EditWaiter = () => {
  // const handleSubmit = values => {
  //   setState({ ...state, submitValues: values });
  // };

  return (
    <>
      <h1>hi</h1>
      {/* <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Waiter Details</Heading>
            <span>
              Waiters can take table orders using the Poster Waiter app. Make
              sure you have contacted team@Posease.com and enabled Waiter app
              for your account.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form.Item
              name="name"
              label="Waiter Name"
              rules={[{ required: true, message: "Waiter Name required" }]}
            >
              <Input style={{ marginBottom: 10 }} />
            </Form.Item>
            <Form.Item
              name="name"
              label="Waiter PIN"
              rules={[{ required: true, message: "Waiter Pin required" }]}
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
                <Option value="">select a Register</Option>
                <Option value="Main Register">The Elegance</Option>
              </Select>
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
      </Cards> */}
    </>
  );
};

export { EditWaiter };
