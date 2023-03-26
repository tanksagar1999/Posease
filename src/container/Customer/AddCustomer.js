import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Form, Input, Button } from "antd";
import { NavLink, useHistory } from "react-router-dom";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import Heading from "../../components/heading/heading";
import { AddSingleCustomer } from "../../redux/customer/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { message } from "antd";

const AddCustomer = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const add = await dispatch(AddSingleCustomer(values));

    if (add.type == "CUSTOMER_ADD" && !add.CustomerData.error) {
      setLoading(false);
      history.push("/customers");
    } else if (add.type == "CUSTOMER_ADD_ERR") {
      setLoading(false);
      message.error({
        content: add.err.message,
        style: {
          float: "center",
          marginTop: "2vh",
        },
      });
    }
  };

  return (
    <>
      <Main>
        <PageHeader ghost className="comman-custom-pageheader" />
        <br></br>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Add Customer Details</Heading>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                className="comman-input"
                autoComplete="off"
                style={{ width: "100%" }}
                form={form}
                name="editProduct"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="name"
                  label="Cutomer Name"
                  rules={[
                    {
                      max: 50,
                      message:
                        "Customer Name cannot be more than 50 characters long.",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Name"
                  />
                </Form.Item>
                <Form.Item
                  name="mobile"
                  label="Customer Mobile"
                  rules={[
                    {
                      message: "Please enter customer mobile number",
                      required: true,
                    },
                    {
                      min: 4,
                      message: "Mobile number must be minimum 4 characters.",
                    },
                    {
                      max: 14,
                      message: "Mobile number must be maximum 14 characters.",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Number"
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Customer Email"
                  rules={[
                    {
                      message: "Please enter valid email",
                      type: "email",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Email"
                  />
                </Form.Item>
                <Form.Item name="shipping_address" label="Shipping Address">
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Street Address"
                  />
                </Form.Item>

                <Form.Item
                  name="city"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="City"
                >
                  <Input style={{ marginBottom: 6 }} placeholder="City" />
                </Form.Item>
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    lineHeight: "32px",
                    textAlign: "center",
                  }}
                ></span>

                <Form.Item
                  name="zipcode"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="Zipcode"
                >
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Zipcode"
                    type="number"
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <div className="add-form-action" style={{ float: "right" }}>
                  <Form.Item>
                    <NavLink to="/customers/" style={{ marginRight: 10 }}>
                      <Button className="btn-cancel btn-custom" size="medium">
                        Go Back
                      </Button>
                    </NavLink>
                    <Button
                      size="medium"
                      className="btn-custom"
                      htmlType="submit"
                      type="primary"
                      raised
                    >
                      {loading ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 16,
                                color: "white",
                                margin: "0px 8px",
                              }}
                              spin
                            />
                          }
                        />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default AddCustomer;
