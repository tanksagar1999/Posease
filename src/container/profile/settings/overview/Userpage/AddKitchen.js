import React, { useState, useRef, useEffect } from "react";
import { Table, Checkbox, Row, Col, Input, Divider, Form, Select } from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";

import { Popover } from "../../../../../components/popup/popup";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import FeatherIcon from "feather-icons-react";
import { useDispatch } from "react-redux";
import "../../setting.css";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { useHistory, useLocation } from "react-router-dom";
import {
  addOrUpdatekitchenUser,
  getkitchenUserById,
  getAllkitchenUserList,
} from "../../../../../redux/kitchenUser/actionCreator";
import { QuestionCircleOutlined } from "@ant-design/icons";

const AddKitchen = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const { Option } = Select;
  const location = useLocation();
  let isMounted = useRef(true);
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [kitchenUserData, setkitchenUserData] = useState({});
  const [checkbox, setCheckbox] = useState(false);

  // fetch register name
  useEffect(() => {
    async function fetchkitchenUserData() {
      if (location.state) {
        const getkitchenUserData = await dispatch(
          getkitchenUserById(location.state.kitchenUser_id)
        );

        if (isMounted.current)
          setkitchenUserData(getkitchenUserData.kitchenUserIdData);
      }
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.RegisterList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchkitchenUserData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleSubmit = async (formData) => {
    formData.role = "kitchen_user";
    let kitchenUser_id =
      location && location.state ? location.state.kitchenUser_id : null;
    const getAddedkitchenUser = await dispatch(
      addOrUpdatekitchenUser(formData, kitchenUser_id)
    );
    if (
      getAddedkitchenUser &&
      getAddedkitchenUser.kitchenUserData &&
      !getAddedkitchenUser.kitchenUserData.error
    ) {
      const getkitchenUserList = await dispatch(getAllkitchenUserList());
      if (getkitchenUserList && getkitchenUserList.kitchenUserList) {
        history.push("/settings/users?type=kitchen");
      }
    }
  };
  useEffect(() => {
    if (kitchenUserData) {
      form.setFieldsValue({
        pin: kitchenUserData.pin,
        register_assigned_to: kitchenUserData.register_assigned_to,
        username: kitchenUserData.username,
      });
    }
  }, [kitchenUserData]);

  return (
    <>
      <Cards
        marginTop={true}
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
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
                label="Kitchen User Name"
                rules={[
                  { required: true, message: "Kitchen User Name required" },
                  {
                    max: 40,
                    message:
                      "Waiter name cannot be more than 40 characters long.",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Kitchen user name"
                />
              </Form.Item>

              <Form.Item
                name="pin"
                label="Kitchen User PIN"
                rules={[
                  {
                    pattern: new RegExp("^[0-9]{4,6}$"),
                    required: true,
                    message: "PIN should be a 4 to 6 digit number",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="4 to 6 digit kitchenUser PIN Eg:1234"
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
                  onClick={() => {
                    history.push("/settings/users?type=kitchen");
                  }}
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

export { AddKitchen };
