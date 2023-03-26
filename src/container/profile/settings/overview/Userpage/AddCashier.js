import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Checkbox,
  Row,
  Col,
  Input,
  Divider,
  Form,
  Select,
  Tooltip,
} from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover } from "../../../../../components/popup/popup";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import "../../setting.css";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { useHistory, useLocation } from "react-router-dom";
import {
  addOrUpdateCashiers,
  getCashiersById,
  getAllCashiersList,
} from "../../../../../redux/cashiers/actionCreator";
import { QuestionCircleOutlined } from "@ant-design/icons";
import _ from "lodash";

const AddCashier = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { Option } = Select;
  let isMounted = useRef(true);
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [CashiersData, setCashiersData] = useState({});
  const [checkbox, setCheckbox] = useState(false);
  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch register name
  useEffect(() => {
    async function fetchCashiersData() {
      if (location.state) {
        const getCashiersData = await dispatch(
          getCashiersById(location.state.cashiers_id)
        );
        if (isMounted.current) setCashiersData(getCashiersData.cashiersIdData);
      }
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.RegisterList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchCashiersData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleSubmit = async (formData) => {
    setLoading(true);
    formData.role = "cashier";
    let cashiers_id =
      location && location.state ? location.state.cashiers_id : null;
    const getAddedCashiers = await dispatch(
      addOrUpdateCashiers(formData, cashiers_id)
    );
    if (
      getAddedCashiers &&
      getAddedCashiers.cashiersData &&
      !getAddedCashiers.error
    ) {
      const getCashiersList = await dispatch(getAllCashiersList());
      if (
        isMounted.current &&
        getCashiersList &&
        getCashiersList.cashiersList
      ) {
        setLoading(false);
        history.push("/settings/users?type=cashier");
      }
    }
  };
  useEffect(() => {
    if (CashiersData) {
      setDisabledSave(true);
      setApiData({
        pin: CashiersData.pin,
        register_assigned_to: CashiersData.register_assigned_to,
        username: CashiersData.username,
        has_manager_permission: CashiersData.has_manager_permission
          ? true
          : false,
      });
      form.setFieldsValue({
        pin: CashiersData.pin,
        register_assigned_to: CashiersData.register_assigned_to,
        username: CashiersData.username,
        has_manager_permission: CashiersData.has_manager_permission
          ? true
          : false,
      });
    }
  }, [CashiersData]);
  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    if (apiData) {
      let currentFormData = {};
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);

        if (findData) {
          currentFormData[findData.name[0]] = findData.value;
        }
      });

      if (_.isEqual(apiData, currentFormData)) {
        setDisabledSave(true);
      } else {
        setDisabledSave(false);
      }
      return true;
    }
  };

  return (
    <>
      <Cards
        marginTop={true}
        title={
          <div className="setting-card-title">
            <Heading as="h4">Cashier Details</Heading>
            <span>Cashiers have access only to billing. </span>
            <span>Cashier will use PIN to lock and unlock their register.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form
              form={form}
              onFinish={handleSubmit}
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
            >
              {" "}
              <Form.Item
                name="username"
                label="Cashier Name"
                rules={[
                  {
                    min: 3,
                    message: "Cashier name must be at least 3 characters long.",
                  },
                  {
                    max: 40,
                    message:
                      "Cashier name cannot be more than 40 characters long.",
                  },
                  { required: true, message: "Cashier name is required." },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Cashier name"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                name="pin"
                label="Cashier PIN"
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
                  placeholder="4 to 6 digit cashiers PIN Eg:1234"
                  autoComplete="off"
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
                  style={{ width: "100%" }}
                  placeholder="Select a Register"
                >
                  {RegisterNameList.map((groupedData) => (
                    <Option key={groupedData._id} value={groupedData._id}>
                      {groupedData.register_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="has_manager_permission"
                valuePropName="checked"
                style={{ marginTop: "10px" }}
              >
                <Checkbox
                  className="add-form-check"
                  // checked={checkbox}
                  // onChange={(e) => {
                  //   setCheckbox(e.target.checked);
                  // }}
                >
                  Allow manager permissions{" "}
                  <Tooltip title="Cashiers with manager permissions will have access to screens other than setup.However, thay will be restricted to access only their register's receipts.">
                    <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="medium"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    history.push("/settings/users?type=cashier");
                  }}
                >
                  Go Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabledSave}
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
            </Form>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export { AddCashier };
