import React, { useState, useRef, useEffect } from "react";
import {
  Checkbox,
  Row,
  Col,
  Input,
  Form,
  Select,
  Tooltip,
  TreeSelect,
} from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import TextArea from "antd/lib/input/TextArea";
import { InfoCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { setItem } from "../../../../../utility/localStorageControl";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import {
  addOrUpdateBingage,
  getAllBingageList,
} from "../../../../../redux/bingage/actionCreator";
import {
  addOrUpdateInventory,
  getAllInventoryList,
} from "../../../../../redux/inventory/actionCreator";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TableWrapper, Main } from "../../../../styled";
const addInventory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { SHOW_PARENT } = TreeSelect;
  const [totalIds, setTotalId] = useState([]);
  const [emailId, setEmailid] = useState(false);
  const [bingageErr, setBingageErr] = useState(false);

  const [RegisterList, setRegisterList] = useState([]);
  const [bingageList, setBingageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabledSave, setDisabledSave] = useState(false);
  const [apiData, setApiData] = useState();
  const [treevalues, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [registererr, setRegisterErr] = useState(false);
  async function fetchInventoryList() {
    const getInventoryList = await dispatch(getAllInventoryList("sell"));
    console.log("checkadadadad", getInventoryList);
    if (isMounted.current && getInventoryList && getInventoryList.taxesList) {
      let linkedRegister = [];
      getInventoryList.taxesList.map((val) => {
        val.linked_registers.map((j) => {
          linkedRegister.push(j);
        });
      });
      setInventoryList(linkedRegister);
    }
  }
  useEffect(() => {
    // fetchBingagesList();
    async function fetchRegisterList() {
      const getRegisterList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
        setRegisterList(getRegisterList.RegisterList);
      if (location && location.state && location.state.data) {
        console.log("data9090909data", location.state.data);

        setDisabledSave(true);
        setApiData({
          inventory_name: location?.state?.data?.inventory_name,
          description: location.state.data?.description,
          email_alerts: location.state.data?.email_alerts,
          email_id: location.state.data?.email_id,
        });
        form.setFieldsValue({
          inventory_name: location?.state?.data?.inventory_name,
          description: location.state.data?.description,
          email_alerts: location.state.data?.email_alerts,
          email_id: location.state.data?.email_id,
        });
        setValues(location.state.data?.linked_registers);
        setEmailid(location.state.data?.email_alerts);
      }
    }

    if (isMounted.current) {
      fetchRegisterList();
      fetchInventoryList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let titledata = [];
    if (RegisterList.length) {
      const data = [];
      const initialValues = [];
      let object1 = {
        title: "All Register",
        value: "0-0",
        key: "0-0",
        children: [],
      };
      console.log(
        "RegisterListRegisterList",
        location?.state?.data.linked_registers
      );

      RegisterList.map((value) => {
        console.log("sdcdsc");
        if (
          location?.state?.data.linked_registers.includes(value._id) ||
          inventoryList.find((k) => k == value._id) == undefined
        ) {
          titledata.push({
            title: value.register_name,
            value: value._id,
          });
          let obj2 = {};
          obj2.title = value.register_name;
          obj2.value = value._id;
          obj2.key = value._id;
          object1["children"].push(obj2);
          initialValues.push(value._id);
        }
      });
      object1.value = [...initialValues];
      data.push(object1);
      setTotalId(initialValues);
      setTreeData(titledata);
    }

    // if (Object.keys(productData).length) {
    //   let register = "";
    //   if (productData.limit_to_register.length > 0) {
    //     let ids = [];
    //     productData.limit_to_register.map((val) => {
    //       let register = registerListData.find((value) => value._id == val);
    //       if (register) {
    //         ids.push(register._id);
    //       }
    //     });
    //     if (ids.length > 0) {
    //       register = ids;
    //     } else {
    //       const data = [];
    //       registerListData.map((value) => {
    //         data.push(value._id);
    //       });
    //       register = data;
    //     }
    //   } else {
    //     const data = [];
    //     registerListData.map((value) => {
    //       data.push(value._id);
    //     });
    //     register = data;
    //   }

    //   setValues(register);
    //   productData.option_status === "combo"
    //     ? setRegular(false)
    //     : setRegular(true);

    // }
  }, [RegisterList, inventoryList]);

  const fetchBingagesList = async () => {
    const getBinagesList = await dispatch(getAllBingageList());
    setBingageList(getBinagesList);
  };

  const handleSubmit = async (formData) => {
    if (treevalues.length) {
      formData.linked_registers = treevalues;
      console.log("formData90999909559090", formData);
      setLoading(true);
      let response;
      if (location?.state?.data?.id) {
        response = await dispatch(
          addOrUpdateInventory(formData, location?.state?.data?.id)
        );
      } else {
        response = await dispatch(addOrUpdateInventory(formData));
        console.log("sagarchecnjnsda", response);
      }

      if (response) {
        const getInventoryList = await dispatch(getAllInventoryList());

        if (getInventoryList?.taxesList) {
          setLoading(false);
          history.push(`/inventory`);
        }
      } else {
        setLoading(false);
      }
    } else {
      setRegisterErr(true);
    }
  };

  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    if (apiData) {
      let currentFormData = {};
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          currentFormData[findData.name[0]] =
            findData.name[0] == "tax_percentage"
              ? Number(findData.value)
              : findData.value;
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
  let email = localStorage.getItem("email_id");
  return (
    <Main className="inventory-items">
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Your Inventory Details</Heading>
            <span>
              An inventory is a physical location where you keep your goods.
              Inventory can be your outlet or a separate warehouse.
              <br />
              Inventory can be standalone or linked to one or more registers.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              name="add inventory"
              onFinish={handleSubmit}
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
              onChange={() => setBingageErr(false)}
            >
              <Form.Item
                name="inventory_name"
                label="Inventory Name"
                rules={[
                  {
                    min: 3,
                    message:
                      "Inventory name must be at least 3 characters long",
                  },
                  {
                    max: 50,
                    message:
                      "Inventory name cannot be more than 50 characters long.",
                  },
                  { required: true, message: "Inventory name is required" },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Inventory Name"
                />
              </Form.Item>
              <Form.Item name="description" label="Description (optional)">
                <Input style={{ marginBottom: 10 }} placeholder="Description" />
              </Form.Item>

              <Form.Item
                name="linked_registers"
                label="Select the Registers linked to this Inventory"
                validateStatus={registererr ? "error" : false}
                help={registererr ? "Register is required" : null}
              >
                <p style={{ display: "none" }}>{treevalues?.length}</p>
                <TreeSelect
                  showSearch={true}
                  multiple
                  value={treevalues}
                  treeData={[
                    {
                      title:
                        treevalues.length > 0 ? (
                          <span
                            onClick={() => {
                              setValues([]);
                            }}
                            style={{
                              display: "inline-block",
                              color: "rgb(0, 140, 186)",
                              cursor: "pointer",
                            }}
                          >
                            Unselect all
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              setValues(totalIds);
                            }}
                            style={{
                              display: "inline-block",
                              color: "rgb(0, 140, 186)",
                              cursor: "pointer",
                            }}
                          >
                            {treeData.length == 0
                              ? "No registers are available to link to this inventory"
                              : "Select all"}
                          </span>
                        ),
                      value: "xxx",
                      disableCheckbox: true,
                      disabled: true,
                    },
                    ...treeData,
                  ]}
                  className="minHeight"
                  treeDefaultExpandAll
                  onChange={(val) => setValues(val)}
                  treeCheckable={true}
                  showCheckedStrategy={SHOW_PARENT}
                  placeholder="Please select Register"
                  filterTreeNode={(search, item) => {
                    return (
                      item?.title
                        ?.toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0
                    );
                  }}
                  style={{
                    width: "100%",
                    marginBottom: 10,
                  }}
                />
              </Form.Item>
              <Form.Item
                name="email_alerts"
                valuePropName="checked"
                label="Email Alerts"
              >
                <Checkbox
                  className="add-form-check"
                  onChange={(e) => setEmailid(e.target.checked)}
                >
                  Receive alert when inventory reaches zero / goes below reorder
                  level
                </Checkbox>
              </Form.Item>
              {emailId && (
                <Form.Item
                  name="email_id"
                  initialValue={email}
                  label="Email ID"
                  rules={[
                    { message: "Email address is required", required: true },
                    { type: "email", message: "A valid email is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}

              <Form.Item style={{ float: "right" }}>
                <Button
                  onClick={() => history.push("/inventory")}
                  className="go-back-button"
                  size="medium"
                  type="white"
                  style={{ marginRight: "10px" }}
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
    </Main>
  );
};

export { addInventory };
