import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Tooltip, Button } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import { Spin } from "antd";
import {
  addOrUpdateOrderTicketGroup,
  getOrderTicketGroupedById,
  getAllOrderTicketGroupedList,
} from "../../../redux/products/actionCreator";
import { getItem } from "../../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";
import "../category.css";

const AddOrderTicketGroup = () => {
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    submitValues: {},
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let [orderTicketGroupData, setOrderTicketGroupData] = useState({});

  useEffect(() => {
    async function fetchOrderTicketGroup() {
      if (location.state) {
        const getOrderedTicketGroupList = await dispatch(
          getOrderTicketGroupedById(location.state.order_ticket_grouped_id)
        );
        if (isMounted.current)
          setOrderTicketGroupData(
            getOrderedTicketGroupList.orderTicketGroupedData
          );
      }
    }
    if (isMounted.current) {
      fetchOrderTicketGroup();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(orderTicketGroupData).length) {
      setState({
        ...state,
        orderTicketGroupData,
      });
      form.setFieldsValue({
        order_ticket_group_name:
          orderTicketGroupData && orderTicketGroupData.order_ticket_group_name
            ? orderTicketGroupData.order_ticket_group_name
            : "",
      });
    }
  }, [orderTicketGroupData]);

  const handleSubmit = async (formData) => {
    setState({ ...state, submitValues: formData });
    setLoading(true);
    let order_ticket_grouped_id =
      location && location.state
        ? location.state.order_ticket_grouped_id
        : null;
    const getAddedOrderTicketGroup = await dispatch(
      addOrUpdateOrderTicketGroup(formData, order_ticket_grouped_id)
    );
    if (
      getAddedOrderTicketGroup &&
      getAddedOrderTicketGroup.orderTicketGroupedData &&
      !getAddedOrderTicketGroup.orderTicketGroupedData.error
    ) {
      let list = await dispatch(getAllOrderTicketGroupedList());
      if (list && list.orderTicketGroupList) {
        setLoading(false);
        history.push("/product-categories?type=order_group");
      }
    }
  };
  let allSetupcache = getItem("setupCache");
  return (
    <>
      <Main className="padding-top-form">
        <br></br>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Your Order Ticket Group Details</Heading>
              <span>
                You can use Order Ticket Group to split and print KOTs across
                kitchens.<br></br> For example, you can create a group called
                Sandwich Counter and assign Sandwich category products to use a
                separate KOT print.
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                name="addOrderTicketGroup"
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="order_ticket_group_name"
                  label={
                    <span>
                      Order Ticket Group Name&nbsp;&nbsp;
                      <Tooltip
                        title="Eg. Sandwich counter, Juice counter etc. "
                        color="#FFFF"
                      >
                        <InfoCircleFilled style={{ color: "#AD005A" }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    {
                      min: 3,
                      message:
                        "Order ticket group name must be at least 3 characters long",
                    },
                    {
                      max: 40,
                      message:
                        "Order ticket group name cannot be more than 40 characters long.",
                    },
                    {
                      required: true,
                      message: "Order ticket group name is required",
                    },
                    {
                      validator: (a, value) => {
                        setLoading(false);
                        if (allSetupcache && allSetupcache.orderTicketGroups) {
                          let orderTiketGroupName = allSetupcache.orderTicketGroups.find(
                            (val) =>
                              val.order_ticket_group_name.toLowerCase() ==
                              value.toLowerCase()
                          );

                          if (
                            orderTiketGroupName &&
                            orderTicketGroupData &&
                            orderTiketGroupName.order_ticket_group_name !=
                              orderTicketGroupData.order_ticket_group_name
                          ) {
                            return Promise.reject(
                              value + " already exist in orderTicketGroup"
                            );
                          } else if (orderTiketGroupName) {
                            return Promise.reject(
                              value + " already exist in orderTicketGroup"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 10 }}
                    placeholder="Order Ticket Group Name"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      history.push("/product-categories?type=order_group");
                    }}
                  >
                    Go Back
                  </Button>
                  <Button type="primary" size="medium" htmlType="submit">
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
              </Form>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default AddOrderTicketGroup;
