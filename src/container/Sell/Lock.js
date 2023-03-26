import React, { useState, useEffect } from "react";
import {
  Input,
  Form,
  Card,
  Button,
  Modal,
  Tooltip,
  Checkbox,
  Row,
  Col,
  Space,
} from "antd";
import { useDispatch } from "react-redux";

import sellmsg from "../../static/img/sell/sellmsg.svg";
import { NavLink, useHistory } from "react-router-dom";
import { LockRegister } from "../../redux/authentication/actionCreator";
import { getAllRegisterList } from "../../redux/register/actionCreator";
import { getItem } from "../../utility/localStorageControl";
import {
  QuestionCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const Lock = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalVisibleLock, setModelVisibleLock] = useState(false);
  const userDetails = getItem("userDetails");
  const username = getItem("username");
  const [showForm, setShowForm] = React.useState(false);
  const [denominationValueArray, setDenominationValueArray] = useState([]);
  const [denominationCountArray, setDenominationCountArray] = useState([]);
  const [finalTotal, setFinalTotal] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (userDetails) {
      dispatch(getAllRegisterList("sell"));
    }
  }, []);

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

  const handleCancel = (e) => {
    setModelVisibleLock(false);
  };

  const HandleEndShift = () => {
    if (showForm !== true) {
      setShowForm(true);
    } else {
      setShowForm(false);
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

  return (
    <>
      <Card>
        <div className="start_selling">
          <img src={sellmsg} alt="" width={200} />
          <h3>No active shift Found</h3>
          <p>
            To start selling here, you have to <span>lock register</span> and
            opena <span>new shift.</span>
          </p>
          <Button
            size="small"
            className="btn-custom"
            type="primary"
            onClick={() => setModelVisibleLock(true)}
          >
            Lock Register
          </Button>
          <em>
            You are seeing this because you have enforced shift for billing in
            your prefrences setup.
          </em>
        </div>
      </Card>

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
              End shift for1 &nbsp;
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
                      <Form.Item>
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
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Col xs={24} xl={24} lg={24} className="gutter-box">
                  <Form.Item name="final_value">
                    <p style={{ display: "none" }}>{finalTotal}</p>
                    <Input
                      type="number"
                      value={finalTotal}
                      onChange={(e) => setFinalTotal(e.target.value)}
                      placeholder={
                        finalTotal != ""
                          ? finalTotal
                          : "Enter closing cash balance"
                      }
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
    </>
  );
};

export default Lock;
