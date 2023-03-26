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

const EditApp = () => {
  // const handleSubmit = values => {
  //   setState({ ...state, submitValues: values });
  // };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">App User Details</Heading>
            <span>App users have access only to Poster Apps. </span>
            <span>
              An app user will require a PIN to lock and unlock the application.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form.Item
              name="name"
              label="App User Name"
              rules={[{ required: true, message: "App UserName required" }]}
            >
              <Input style={{ marginBottom: 10 }} />
            </Form.Item>
            <Form.Item
              name="name"
              label="App User PIN"
              rules={[{ required: true, message: "App User Pin required" }]}
            >
              <Input style={{ marginBottom: 10 }} />
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

export { EditApp };
