import React, { useState, useRef, useEffect } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { Form, Input, Button, Tooltip, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthWrapper } from "./style";
import {
  secretPinAuth,
  forgotPin,
} from "../../../../redux/authentication/actionCreator";
import { getAllWaiterUserList } from "../../../../redux/waiterUser/actionCreator";
import { getAllkitchenUserList } from "../../../../redux/kitchenUser/actionCreator";

import { Checkbox } from "../../../../components/checkbox/checkbox";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getItem, setItem } from "../../../../utility/localStorageControl";
import { getAllRegisterList } from "../../../../redux/register/actionCreator";
import { localeData } from "moment";

const PinAuth = () => {
  const history = useHistory();
  const { Option } = Select;
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loading);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [state] = useState({});
  const [showTextBox, setShowTextBox] = React.useState(false);
  const [modalVisible, setModelVisible] = useState(false);
  const [modalForgotPin, setModelForgotPin] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [pinValue, setPinValue] = useState(false);
  const [waiterUserAndKitchenUser, setWaiterUserAndKitchenUser] = useState([]);
  let isMounted = useRef(true);

  let emailData = localStorage.getItem("email_id");
  let userName = localStorage.getItem("username");
  const [RegisterNameList, setRegisterNameList] = useState([]);
  let [activeRegister, setActiveRegister] = useState(
    getItem("setupCache")
      ? getItem("setupCache").register.find((val) => val.active)._id
      : ""
  );

  useEffect(() => {
    let waiterUserAndKitchenUserPin = [];
    async function fetchkitchenUserList() {
      const getkitchenUserList = await dispatch(getAllkitchenUserList());
      if (
        isMounted.current &&
        getkitchenUserList &&
        getkitchenUserList.kitchenUserList
      )
        getkitchenUserList.kitchenUserList.map((val) => {
          waiterUserAndKitchenUserPin.push(val.pin);
        });
    }
    async function fetchwaiterUserList() {
      const getwaiterUserList = await dispatch(getAllWaiterUserList());
      if (
        isMounted.current &&
        getwaiterUserList &&
        getwaiterUserList.waiterUserList
      )
        getwaiterUserList.waiterUserList.map((val) => {
          waiterUserAndKitchenUserPin.push(val.pin);
          setWaiterUserAndKitchenUser(waiterUserAndKitchenUserPin);
        });
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.RegisterList);
      form1.setFieldsValue({
        register_assigned_to: activeRegister,
      });
    }
    if (isMounted.current) {
      fetchkitchenUserList();
      fetchwaiterUserList();
      fetchRegisterName();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  let [pin, setpin] = useState();
  let [cashBalance, setcashbalance] = useState();
  const deleteSelectedTaxes = async () => {
    let allLocalData = getItem("setupCache");
    allLocalData.register.map((i) => {
      if (i._id == activeRegister) {
        i.active = true;
      } else {
        i.active = false;
      }
    });
    setItem("setupCache", allLocalData);
    let pinauthDetails = await dispatch(
      secretPinAuth({ pin: pin }, cashBalance)
    );

    if (pinauthDetails) {
      history.push("/sell");
    }
  };

  const handleSubmit = async (formData) => {
    setpin(formData.pin);
    setcashbalance(formData.cash_balance);
    let openBalance = formData.cash_balance ? formData.cash_balance : undefined;
    const found = waiterUserAndKitchenUser.find(
      (element) => element == formData.pin
    );
    let checkShopOwner = getItem("setupCache").shopDetails;

    if (found) {
      setErr(true);
      setErrMsg("Owner / Cashier / App user PIN is incorrect");
    } else if (
      checkShopOwner.shop_owner_pin == formData.pin &&
      showTextBox &&
      getItem("setupCache").register.length > 1
    ) {
      setModelDeleteVisible(true);
    } else {
      let allLocalData = getItem("setupCache");

      if (
        allLocalData.userList.cashierUserList &&
        allLocalData.userList.cashierUserList.length
      ) {
        let cashier = allLocalData.userList.cashierUserList.find(
          (cashier) => cashier.pin == formData.pin
        );
        if (cashier) {
          allLocalData.register.map((i) => {
            if (i._id == cashier.register_assigned_to._id) {
              i.active = true;
            } else {
              i.active = false;
            }
          });
          setItem("setupCache", allLocalData);
        }
      }
      let addPin = await dispatch(
        secretPinAuth({ pin: formData.pin }, openBalance, history)
      );

      if (
        addPin?.err?.data?.messageCode &&
        addPin.err.data.messageCode == "INVALID_PIN"
      ) {
        setErr(true);
        setErrMsg("Please enter valid PIN");
      } else if (addPin) {
        history.push("/sell");
      }
    }
  };
  const handleCancelRegisterchanges = () => {
    setModelDeleteVisible(false);
  };

  const onChange = () => {
    if (showTextBox !== true) {
      setShowTextBox(true);
    } else {
      setShowTextBox(false);
    }
  };

  const handleLock = () => {};

  const handleCancel = (e) => {
    setModelForgotPin(false);
  };

  const forgotpin = async () => {
    let getforgotpinData = await dispatch(forgotPin({ email: emailData }));

    if (
      getforgotpinData &&
      getforgotpinData.ForgotPinData &&
      !getforgotpinData.ForgotPinData.error
    ) {
      setModelForgotPin(false);
    }
  };
  return (
    <AuthWrapper>
      <div className="auth-contents secret_top">
        <Form
          autoComplete="off"
          name="login"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="pin"
            validateStatus={err ? "error" : false}
            rules={[
              {
                required: true,
                message: "Pin is required",
              },
            ]}
            help={err ? errMsg : null}
            label="Secret Pin"
          >
            <Input
              type="password"
              placeholder="Please enter your pin"
              style={{ marginBottom: 10 }}
              onChange={(e) => {
                setErr(false);
              }}
            />
          </Form.Item>
          {showTextBox === true ? (
            <Form.Item
              name="cash_balance"
              rules={[
                {
                  message: "Please enter your secret pin.",
                  required: true,
                },
              ]}
            >
              <Input
                min={0}
                type="number"
                placeholder="Enter opening cash balance"
                style={{ marginBottom: 10 }}
                onKeyPress={(event) => {
                  if (event.key.match("[0-9,.]+")) {
                    return true;
                  } else {
                    return event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          ) : (
            ""
          )}
          <div className="auth-form-action">
            <Checkbox onChange={onChange}>
              Start a new shift &nbsp;
              <Tooltip title="Trackig shifts will report sales and payments during a cashier shift and useful to verify cash balance.">
                <QuestionCircleOutlined style={{ cursor: "pointer" }} />
              </Tooltip>
            </Checkbox>
          </div>
          <div className="blong_clr">
            <NavLink to="#" onClick={() => setModelForgotPin(true)}>
              Forgot PIN?
            </NavLink>
          </div>

          <Modal
            title="Forgot PIN?"
            okText="Get PIN By Email"
            visible={modalForgotPin}
            onOk={forgotpin}
            onCancel={handleCancel}
            width={600}
          >
            <p>Do you want us to send the Owner PIN to your {emailData}?</p>
          </Modal>
          <Form.Item>
            <Button
              className="btn-signin"
              htmlType="submit"
              type="primary"
              size="large"
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title="Select a register to start the shift"
          okText="Start Shift"
          visible={modalDeleteVisible}
          onOk={deleteSelectedTaxes}
          onCancel={handleCancelRegisterchanges}
          width={600}
        >
          <Form form={form1} name="changeRegister">
            <Form.Item
              name="register_assigned_to"
              label="Register"
              rules={[
                {
                  required: true,
                  message: "A register must be selected .",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select a Register"
                onChange={(value) => setActiveRegister(value)}
              >
                {RegisterNameList.map((groupedData) => (
                  <Option key={groupedData._id} value={groupedData._id}>
                    {groupedData.register_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>{" "}
          </Form>
        </Modal>
      </div>
    </AuthWrapper>
  );
};

export { PinAuth };
