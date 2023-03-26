import React, { useState } from "react";

import "../../setting.css";
import { useHistory, useLocation } from "react-router-dom";

const EditCashier = () => {
  const location = useLocation();

  // const handleSubmit = (values) => {
  //   setState({ ...state, submitValues: values });
  // };

  return (
    <>
      <h1>hi</h1>
      {/* <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Cashier Details123</Heading>
            <span>Cashiers have access only to billing. </span>
            <span>Cashier will use PIN to lock and unlock their register.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form.Item
              name="name"
              label="Cashier Name"
              rules={[{ required: true, message: "Cashier Name required" }]}
            >
              <Input style={{ marginBottom: 10 }} />
            </Form.Item>
            <Form.Item
              name="name"
              label="Cashier PIN"
              rules={[{ required: true, message: "Cashier Pin required" }]}
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
      </Cards> */}
    </>
  );
};

export { EditCashier };
