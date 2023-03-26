import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Modal,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Form,
  Input,
  Space,
} from "antd";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { InfoWraper, NavAuth, UserDropDwon } from "./auth-info-style";
import Message from "./message";
import Notification from "./notification";
import { Popover } from "../../popup/popup";
import Support from "./support";
import { Dropdown } from "../../dropdown/dropdown";
import {
  logOut,
  LockRegister,
} from "../../../redux/authentication/actionCreator";
import Heading from "../../heading/heading";
import { Button } from "../../buttons/buttons";
import {
  getAllRegisterList,
  SwitchRegister,
} from "../../../redux/register/actionCreator";
import { getItem, setItem } from "../../../utility/localStorageControl";
import {
  QuestionCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { array } from "prop-types";
import { getTime } from "date-fns";

const AuthInfo = ({}) => {
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [RegisterListData, setRegisterListData] = useState([]);
  const [modalVisible, setModelVisible] = useState(false);
  const [modalVisibleLock, setModelVisibleLock] = useState(false);
  const [RegisterId, setRegisterId] = useState("");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [ActiveRegister, setActiveRegister] = useState("");
  const userDetails = getItem("userDetails");
  const username = getItem("username");
  const role = getItem("role");
  const [showForm, setShowForm] = React.useState(false);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const [show, setShow] = React.useState(false);
  const [denominationValueArray, setDenominationValueArray] = useState([]);
  const [denominationCountArray, setDenominationCountArray] = useState([]);
  const [finalTotal, setFinalTotal] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (userDetails) {
      dispatch(getAllRegisterList("sell"));
    }
  }, []);

  const { RegisterList } = useSelector(
    (state) => ({
      RegisterList: state.register.RegisterList,
    }),
    shallowEqual
  );
  const [RegisterName, setRegisterName] = useState("");
  useEffect(() => {
    if (RegisterList?.length) {
      setRegisterName(RegisterList?.find((val) => val.active)?.register_name);
    }
  }, [RegisterList]);
  const [state, setState] = useState({
    flag: "english",
  });
  const { flag } = state;

  const SignOut = (e) => {
    if (offLineMode) {
      setOfflineModeCheck(true);
      return;
    }
    e.preventDefault();
    dispatch(logOut(history));
  };

  let pathName = window.location.pathname;
  if (pathName.split(":").length > 1) {
    pathName = pathName.split(":")[1];
  }
  const HandleswitchRegister = async () => {
    localStorage.removeItem("active_cart");
    let localDataDetails = getItem("setupCache");
    if (localDataDetails != null && localDataDetails.register) {
      localDataDetails.register = localDataDetails.register.map((value) => {
        if (value._id == RegisterId) {
          value.active = true;
        } else {
          value.active = false;
        }
        return value;
      });
      setItem("setupCache", localDataDetails);
      dispatch(getAllRegisterList("sell"));
      if (getItem("localReceipt") === true) {
        setItem("isStartSellingFromThisDevice", true);
      }
      if (getItem("waiter_app_enable")) {
        window.location.reload();
      }
      setModelVisible(false);
    }
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelVisibleLock(false);
  };

  const showModal = (id = "") => {
    let obj = RegisterList.find((o) => o._id === id);
    setRegisterName(obj.register_name);
    if (id && id != "") {
      setRegisterId(id);
    }
    setModelVisible(true);
  };

  const HandleEndShift = () => {
    if (showForm !== true) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  };

  const userContent = (
    <UserDropDwon
      onClick={(e) => {
        e.preventDefault();
        setShow(false);
      }}
      onBlur={() => {
        setShow(false);
      }}
    >
      <div className="user-dropdwon">
        <figure className="user-dropdwon__info">
          <Avatar
            src={
              getItem("setupCache") &&
              getItem("setupCache").shopDetails &&
              getItem("setupCache").shopDetails.shop_logo
            }
            size={50}
            icon={<UserOutlined />}
            style={{ marginLeft: "1px" }}
          />

          <figcaption style={{ margin: "0 10px" }}>
            <Heading as="h5">{username}</Heading>
            <p>{role === "restaurant" ? "Admin" : role?.toUpperCase()}</p>
          </figcaption>
        </figure>
        <ul className="user-dropdwon__links">
          {userDetails &&
          userDetails.is_shop &&
          userDetails.role === "restaurant" ? (
            <li>
              <NavLink to={`${path}settings/shop`}>
                <FeatherIcon icon="settings" /> Settings
              </NavLink>
            </li>
          ) : (
            ""
          )}
          {/* <li>
            <NavLink to="#">
              <FeatherIcon icon="dollar-sign" /> Billing
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="#"
              onClick={() => window.open("https://help.posease.com/")}
            >
              <FeatherIcon icon="bell" /> Help
            </NavLink>
          </li>
          <li>
            <NavLink to="#" onClick={() => setModelVisibleLock(true)}>
              <FeatherIcon icon="lock" /> Lock Register
            </NavLink>
          </li>
        </ul>
        {userDetails?.role === "cashier" ? (
          ""
        ) : (
          <NavLink
            className="user-dropdwon__bottomAction"
            onClick={SignOut}
            to="#"
          >
            <FeatherIcon icon="log-out" /> Sign Out
          </NavLink>
        )}
      </div>
    </UserDropDwon>
  );

  let registercontent = "";
  let active_register = "";
  if (RegisterList.length > 0) {
    registercontent = RegisterList.map((value, i) => {
      if (value.active === true) {
        active_register += value.register_name;
      }
      return (
        <>
          <NavAuth key={value._id}>
            <NavLink
              onClick={
                RegisterList.length !== 1 &&
                value.register_name !== active_register
                  ? showModal.bind("", value._id)
                  : ""
              }
              to="#"
            >
              <span>{value.register_name}</span>
              <span style={{ display: "none" }} data-id={value._id}>
                {value._id}
              </span>
            </NavLink>
          </NavAuth>
        </>
      );
    });
  }

  const denominationValue = (event, index) => {
    denominationValueArray[index + 1] = event.target.value;
    setDenominationValueArray([...denominationValueArray]);
  };

  const denominationCount = (event, index) => {
    denominationCountArray[index + 1] = event.target.value;
    setDenominationCountArray([...denominationCountArray]);
  };

  useEffect(() => {
    calculateFinalValue(denominationValueArray, denominationCountArray);
  }, [denominationValueArray]);

  useEffect(() => {
    calculateFinalValue(denominationValueArray, denominationCountArray);
  }, [denominationCountArray]);

  const calculateFinalValue = (
    denominationValueArray,
    denominationCountArray
  ) => {
    let getTotalOfCount = 0;
    for (let i = 0; i < denominationValueArray.length; i++) {
      let denominationValue = denominationValueArray[i]
        ? +denominationValueArray[i]
        : 1;
      let denominationCount = denominationCountArray[i]
        ? +denominationCountArray[i]
        : 1;
      getTotalOfCount = getTotalOfCount + denominationValue * denominationCount;

      if (getTotalOfCount != 1) {
        setFinalTotal(getTotalOfCount);
      }
    }
  };

  const removeRowForCalculation = (index) => {
    denominationValueArray.splice(index + 1, 1);
    setDenominationValueArray([...denominationValueArray]);
    denominationCountArray.splice(index + 1, 1);
    setDenominationCountArray([...denominationCountArray]);
  };

  const handleSubmit = () => {
    dispatch(LockRegister(history, finalTotal, username));
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [pathName]);

  return (
    <InfoWraper>
      <Modal
        title="You are Offline"
        visible={offLineModeCheck}
        onOk={() => setOfflineModeCheck(false)}
        onCancel={() => setOfflineModeCheck(false)}
        width={600}
      >
        <p>You are not allowd to sign out while you are offline.</p>
      </Modal>
      <Modal
        title="Lock Register"
        visible={modalVisibleLock}
        onOk={form.submit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          autoComplete="off"
          form={form}
          size="large"
          onFinish={handleSubmit}
        >
          <p>
            Once you lock the register you need the Owner / Cashier / App User
            PIN to unlock, do you want to continue?
          </p>
          <div className="auth-form-action">
            <Checkbox onChange={HandleEndShift} style={{ marginBottom: 10 }}>
              End shift for {RegisterName} &nbsp;
              <Tooltip title="Trackig shifts will report sales and payments during a cashier shift and useful to verify cash balance.">
                <QuestionCircleOutlined style={{ cursor: "pointer" }} />
              </Tooltip>
            </Checkbox>
          </div>
          {showForm === true ? (
            <>
              <Row>
                <Col xs={24} xl={10} lg={10} className="gutter-box">
                  <Form.Item name="denomination_value" id="denomination_value">
                    <Input
                      type="number"
                      min={0}
                      initialValue={0}
                      placeholder="Denomination Value"
                      onChange={(e) => denominationValue(e, -1)}
                    />
                  </Form.Item>
                </Col>
                <Space></Space>
                <Col xs={24} xl={2} lg={2} className="gutter-box">
                  <Form.Item className="action-class">
                    <CloseOutlined />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={10} lg={10} className="gutter-box">
                  <Form.Item name="denomination_count">
                    <Input
                      type="number"
                      id="denomination_count"
                      min={0}
                      initialValue={0}
                      placeholder="Denomination count"
                      onChange={(e) => denominationCount(e, -1)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={2} lg={2} className="gutter-box"></Col>
              </Row>
              <Form.List name="start">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row key={field.key} style={{ marginBottom: 8 }}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area ||
                            prevValues.sights !== curValues.sights
                          }
                        >
                          {() => (
                            <>
                              <Col
                                xs={24}
                                xl={10}
                                lg={10}
                                className="gutter-box"
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, "denomination_value"]}
                                  fieldKey={[
                                    field.fieldKey,
                                    "denomination_value",
                                  ]}
                                >
                                  <Input
                                    placeholder="Denomination Value"
                                    type="number"
                                    min={0}
                                    initialValue={0}
                                    onChange={(e) =>
                                      denominationValue(e, index)
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={2} lg={2} className="gutter-box">
                                <Form.Item className="action-class">
                                  <CloseOutlined />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                xl={10}
                                lg={10}
                                className="gutter-box"
                              >
                                <Form.Item
                                  {...field}
                                  fieldKey={[
                                    field.fieldKey,
                                    "Denomination_count",
                                  ]}
                                  name={[field.name, "Denomination_count"]}
                                >
                                  <Input
                                    placeholder="Denomination Count"
                                    type="number"
                                    min={0}
                                    initialValue={0}
                                    onChange={(e) =>
                                      denominationCount(e, index)
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={2} lg={2} className="gutter-box">
                                <Form.Item {...field} className="action-class">
                                  <DeleteOutlined
                                    onClick={() => {
                                      removeRowForCalculation(index);
                                      remove(field.name);
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </>
                          )}
                        </Form.Item>
                      </Row>
                    ))}
                    <div style={{ marginLeft: 9 }}>
                      {/* <Form.Item> */}
                      <NavLink
                        type="link"
                        to="#"
                        style={{
                          color: "#008cba",
                          border: "none",
                        }}
                        onClick={() => add()}
                      >
                        Add Denomination
                      </NavLink>
                      {/* </Form.Item> */}
                    </div>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Col xs={24} xl={24} lg={24} className="gutter-box">
                  <Form.Item
                    name="final_value"
                    rules={
                      finalTotal === ""
                        ? [
                            {
                              message:
                                "Closing cash balance is required to end a shift.",
                              required: true,
                            },
                          ]
                        : ""
                    }
                  >
                    <p style={{ display: "none" }}>{finalTotal}</p>
                    <Input
                      type="number"
                      value={finalTotal}
                      placeholder={
                        finalTotal != ""
                          ? finalTotal
                          : "Enter closing cash balance"
                      }
                      onChange={(e) => setFinalTotal(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Form.Item>
            </>
          ) : (
            ""
          )}
        </Form>
      </Modal>
      <Modal
        title={"Switch to " + RegisterName}
        okText="Switch Register"
        visible={modalVisible}
        onOk={HandleswitchRegister}
        okButtonProps={{
          disabled: getItem("enable_billing_only_when_shift_is_opened")
            ? true
            : false,
        }}
        onCancel={handleCancel}
        width={600}
      >
        <p>
          If you are in an active shift, you might want to end the shift before
          switching to another register.
        </p>
      </Modal>
      {userDetails && userDetails.role == "cashier"
        ? null
        : (pathName == "/app/receipts" ||
            pathName == "/app/products/pricebook" ||
            pathName == "/app/pettycash" ||
            pathName == "/app/sell") && <Support />}

      {(pathName == "/app/receipts" ||
        pathName == "/app/products/pricebook" ||
        pathName == "/app/pettycash" ||
        pathName == "/app/sell") && (
        <div className="nav-author">
          <Dropdown
            placement="bottomRight"
            content={registercontent}
            action="click"
          >
            <NavLink to="#" className="head-example">
              <Button
                type="default"
                size="small"
                // className="auth-box-button"
                disabled={
                  userDetails && userDetails.role == "cashier" ? true : false
                }
                className={
                  userDetails && userDetails.role == "cashier"
                    ? "auth-box-button"
                    : getItem("dark_mode")
                    ? "darks_btnThe"
                    : "emyty"
                }
                style={
                  userDetails && userDetails.role == "cashier"
                    ? { color: "black", background: "#f4f5f700" }
                    : getItem("dark_mode")
                    ? { background: "#272b41", color: "#A8AAB3" }
                    : {}
                }
              >
                <FeatherIcon
                  icon="arrow-down-circle"
                  style={
                    userDetails && userDetails.role == "cashier"
                      ? getItem("dark_mode")
                        ? {
                            color: "#f5f5f5",
                            background: "#f4f5f700",
                            marginLeft: "3px",
                          }
                        : {}
                      : getItem("dark_mode")
                      ? {
                          background: "#272b41",
                          color: "#A8AAB3",
                          marginLeft: "3px",
                        }
                      : { marginLeft: "3px" }
                  }
                />{" "}
                <span
                  style={
                    userDetails && userDetails.role == "cashier"
                      ? getItem("dark_mode")
                        ? {
                            color: "#f5f5f5",
                            background: "#f4f5f700",
                            marginLeft: "3px",
                          }
                        : {}
                      : getItem("dark_mode")
                      ? {
                          background: "#272b41",
                          color: "#A8AAB3",
                          marginLeft: "3px",
                        }
                      : { marginLeft: "3px" }
                  }
                >
                  {active_register}
                </span>{" "}
              </Button>
            </NavLink>
          </Dropdown>
        </div>
      )}

      <div className="nav-author">
        <Popover
          placement="bottomRight"
          content={userContent}
          trigger="click"
          visible={show}
        >
          <NavLink
            to="#"
            className="head-example"
            onClick={(e) => {
              e.preventDefault();
              setShow(true);
            }}
            onBlur={() => {
              setShow(false);
            }}
            tabIndex={0}
          >
            <Avatar
              src={
                getItem("setupCache") &&
                getItem("setupCache").shopDetails &&
                getItem("setupCache").shopDetails.shop_logo
              }
              icon={<UserOutlined style={{ marginTop: "5px" }} />}
            />
          </NavLink>
        </Popover>
      </div>
    </InfoWraper>
  );
};

export default AuthInfo;
