import React, { useState, useRef, useEffect } from "react";
import { Table, Checkbox, Row, Col, Input, Divider, Form, Select } from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import "../../setting.css";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { useHistory, useLocation } from "react-router-dom";
import {
  addOrUpdateWaiterUser,
  getWaiterUserById,
  getAllWaiterUserList,
} from "../../../../../redux/waiterUser/actionCreator";

const AddWaiter = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  let isMounted = useRef(true);
  const { Option } = Select;
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [waiterUserData, setWaiterUserData] = useState({});
  const [checkbox, setCheckbox] = useState(false);

  // fetch register name
  useEffect(() => {
    async function fetchWaiterUserData() {
      if (location.state) {
        const getWaiterUserData = await dispatch(
          getWaiterUserById(location.state.waiterUser_id)
        );
        if (isMounted.current)
          setWaiterUserData(getWaiterUserData.waiterUserIdData);
      }
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.RegisterList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchWaiterUserData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (formData) => {
    formData.role = "waiter";

    let waiterUser_id =
      location && location.state ? location.state.waiterUser_id : null;
    const getAddedwaiterUser = await dispatch(
      addOrUpdateWaiterUser(formData, waiterUser_id)
    );

    if (
      getAddedwaiterUser &&
      getAddedwaiterUser.waiterUserData &&
      !getAddedwaiterUser.waiterUserData.error
    ) {
      const getwaiterUserList = await dispatch(getAllWaiterUserList());
      if (getwaiterUserList && getwaiterUserList.waiterUserList) {
        history.push("/settings/users?type=waiter");
      }
    }
  };
  useEffect(() => {
    if (waiterUserData) {
      form.setFieldsValue({
        pin: waiterUserData.pin,
        register_assigned_to: waiterUserData.register_assigned_to,
        username: waiterUserData.username,
      });
    }
  }, [waiterUserData]);

  return (
    <>
      <Cards
        marginTop={true}
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
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
                label="Waiter Name"
                rules={[
                  {
                    min: 3,
                    message: "Waiter name must be at least 3 characters long.",
                  },
                  {
                    max: 40,
                    message:
                      "Waiter name cannot be more than 40 characters long.",
                  },
                  { required: true, message: "Waiter name is required." },
                ]}
              >
                <Input style={{ marginBottom: 10 }} placeholder="Waiter name" />
              </Form.Item>
              <Form.Item
                name="pin"
                label="Waiter PIN"
                rules={[{ required: true, message: "Waiter Pin required" }]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="4 to 6 digit waiter PIN Eg:1234"
                />
              </Form.Item>
              <Form.Item
                name="register_assigned_to"
                label="Register"
                rules={[
                  {
                    required: true,
                    message: "A register must be selected for the cashier.",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  placeholder="Select a Register"
                >
                  {RegisterNameList.map((groupedData) => (
                    <Option key={groupedData._id} value={groupedData._id}>
                      {groupedData.register_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => history.push("/settings/users?type=waiter")}
                >
                  Go Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export { AddWaiter };
