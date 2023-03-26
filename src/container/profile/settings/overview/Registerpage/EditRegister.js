import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Checkbox, Row, Col, Input, Form, Select, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import { InfoCircleFilled } from "@ant-design/icons";
import {
  addOrUpdateRegister,
  getRegisterById,
  getAllRegisterList,
} from "../../../../../redux/register/actionCreator";
import { getAllProductList } from "../../../../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { setItem, getItem } from "../../../../../utility/localStorageControl";
import _ from "lodash";
const { ipcRenderer, remote } = window.require("electron");

const EditRegister = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const location = useLocation();
  const [RegisterData, setRegisterData] = useState();
  let isMounted = useRef(true);
  const [getLocalIp, setGetIp] = useState(false);
  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ipcRenderer.send("sendReqForConnectIpAddress", "check");
    ipcRenderer.on("getIpAddress", async (event, connectedIpAddres) => {
      if (connectedIpAddres?.length > 0) {
        setGetIp(connectedIpAddres[0]);
      }
    });
  }, []);
  useEffect(() => {
    async function fetchRegisterData() {
      if (location.state !== null) {
        const getRegisterData = await dispatch(
          getRegisterById(location.state.register_id)
        );
        if (isMounted.current) setRegisterData(getRegisterData.registerIdData);
      }
    }
    if (isMounted.current) {
      fetchRegisterData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (RegisterData) {
      setDisabledSave(true);
      setApiData({
        register_name: RegisterData.register_name,
        receipt_number_prefix: RegisterData.receipt_number_prefix,
        bill_header: RegisterData.bill_header,
        bill_footer: RegisterData.bill_footer,
        printer_type: RegisterData.printer_type,
        print_receipts: RegisterData.print_receipts,
        include_shop_logo: RegisterData.include_shop_logo,
        table_numbers: RegisterData.table_numbers,
        server_ip_address: RegisterData.server_ip_address,
      });
      form.setFieldsValue({
        register_name: RegisterData.register_name,
        receipt_number_prefix: RegisterData.receipt_number_prefix,
        bill_header: RegisterData.bill_header,
        bill_footer: RegisterData.bill_footer,
        printer_type: RegisterData.printer_type,
        print_receipts: RegisterData.print_receipts ? true : false,
        include_shop_logo: RegisterData.include_shop_logo ? true : false,
        table_numbers: RegisterData.table_numbers,
        server_ip_address: RegisterData.server_ip_address,
        kds_stale_time: RegisterData.kds_stale_time,
        enable_accept_status: RegisterData.enable_accept_status,
        enable_served_status: RegisterData.enable_served_status,
        allow_to_change_status: RegisterData.allow_to_change_status,
      });
    }
  }, [RegisterData]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    localStorage.removeItem("active_cart");

    if (formData.table_numbers) {
      let spiltArrayNumber = formData.table_numbers.split("-");
      let spiltComaNumber = formData.table_numbers.split(",");

      if (spiltArrayNumber[0][1] && spiltArrayNumber[0][1] != ",") {
        spiltArrayNumber = spiltArrayNumber[0][1].split(",");
      }

      if (spiltComaNumber.length > 1) {
        spiltComaNumber = spiltComaNumber;
      }

      let charArray = [];
      let NumericString = [];
      let NumberAndChar = [];
      spiltComaNumber.map((value) => {
        value = value.replace(")", "");
        value = value.replace("(", "");
        if (value.search(/[^a-zA-Z]+/) === -1) {
          charArray.push(value);
        }
      });
      spiltComaNumber.map((value) => {
        value = value.replace(")", "");
        value = value.replace("(", "");
        if (value.match(/^[0-9]+$/)) {
          NumericString.push(value);
        }
      });
      spiltComaNumber.map((value) => {
        value = value.replace(")", "");
        let arry = value.split("(");
        let arry2 = [];
        if (arry.length > 1) {
          arry2 = arry[1].split("-");
        } else {
          arry2 = arry[0].split("-");
        }

        value = value.replace("(", "");

        if (value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9-]+)$/)) {
          let countFirst = parseInt(arry2[0].trim());

          let tables = Array.from(
            { length: arry2[1] - (arry2[0] - 1) },
            (_, i) => arry[0] + (i + countFirst)
          );
          NumberAndChar = NumberAndChar.concat(tables);
        }
      });

      let onlyNumber = Array.from(
        { length: spiltArrayNumber[0] },
        (_, i) => i + 1
      );
      formData.table_data = {
        numbers: onlyNumber,
        string: charArray,
        alphanumeric: NumberAndChar,
      };
      if (onlyNumber.length > 1) {
        formData.table_data = {
          numbers: onlyNumber,
          string: charArray,
          alphanumeric: NumberAndChar,
        };
      }
      if (NumericString.length > 0) {
        formData.table_data = {
          numbers: NumericString,
          string: charArray,
          alphanumeric: NumberAndChar,
        };
      }
    } else {
      formData.table_data = {};
    }

    const getAddRegisters = await dispatch(
      addOrUpdateRegister(formData, location.state.register_id)
    );
    if (
      getAddRegisters &&
      getAddRegisters.registerData &&
      !getAddRegisters.error
    ) {
      if (getItem("waiter_app_enable")) {
        ipcRenderer.send("sendReqForNodeServerStart", true);
      }
      const registerList = await dispatch(getAllRegisterList());
      if (registerList && registerList.RegisterList) {
        let getProductList = await dispatch(getAllProductList());
        if (getProductList && getProductList.productList) {
          history.push("/settings/registers");
        }
      }
    }
  };

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

  function checkBrecketIsClose(expr) {
    const holder = [];
    const openBrackets = ["("];
    const closedBrackets = [")"];
    for (let letter of expr) {
      if (openBrackets.includes(letter)) {
        holder.push(letter);
      } else if (closedBrackets.includes(letter)) {
        const openPair = openBrackets[closedBrackets.indexOf(letter)];
        if (holder[holder.length - 1] === openPair) {
          holder.splice(-1, 1);
        } else {
          holder.push(letter);
          break;
        }
      }
    }
    return holder.length === 0; // return true if length is 0, otherwise false
  }
  function containsEmpty(a) {
    return (
      []
        .concat(a)
        .sort()
        .reverse()
        .pop() === ""
    );
  }
  function checkBracketisBlank(value) {
    if (value.match(/\(.*?\)/g) != null) {
      let arry = value.match(/\(.*?\)/g).map((x) => x.replace(/[()]/g, ""));
      return containsEmpty(arry);
    }
  }
  function checkMinusSign(value) {
    let checkArray = value.split("),");
    if (checkArray.length > 0) {
      let FilterData = checkArray.filter(
        (val) =>
          val.charAt(val.indexOf("(") + 1) == "-" ||
          val.charAt(val.indexOf(")") - 1) == "-"
      );
      return FilterData.length > 0 ? true : false;
    } else {
      return false;
    }
  }
  const checkIsNumber = (value) => {
    if (value != "") {
      let tableNosArray = value.split("),");
      let finalTableArray = [];
      let tableNosName;
      let tableNosRange;
      let splitedTbs;
      let roomArray = [];
      let i;
      tableNosArray.forEach((items) => {
        let inputNumberItem = items[0];
        if (items[0] == 1) {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            tableNosRange = items.split(",");
            tableNosRange.forEach((items) => {
              roomArray.push("Table" + " " + items);
            });
          }

          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
          if (i == 1) {
            finalTableArray.push({
              name: "Table",
              status: "Empty",
              rows: roomArray,
            });
          }
        } else if (isNaN(inputNumberItem) && items && items.indexOf("-") > -1) {
          splitedTbs = items.split("(");

          tableNosName = splitedTbs[0];
          tableNosRange = splitedTbs[1];
          let roomCharArray = [];

          tableNosRange = tableNosRange.replace(")", "");

          tableNosRange = tableNosRange.split("-");
          tableNosRange[0] = parseInt(tableNosRange[0]);
          tableNosRange[1] = parseInt(tableNosRange[1]);

          if (tableNosRange[0] > tableNosRange[1]) {
            for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
              roomCharArray.push("Table" + " " + i);
            }
          } else {
            for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
              roomCharArray.push(tableNosName + " " + i);
            }
          }

          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else if (items && items.indexOf(",") > -1) {
          let tempTables = items.split("(");
          tableNosName = tempTables[0];
          tableNosRange = tempTables[1];
          tableNosRange = tableNosRange.replace(")", "");
          tableNosRange = tableNosRange.split(",");
          let roomCharArray = [];
          tableNosRange.forEach((items) => {
            roomCharArray.push(tableNosName + " " + items);
          });
          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            let tempTables = items.split("(");
            tableNosName = tempTables[0];
            tableNosRange = items.split(",");

            tableNosRange.forEach((items) => {
              tempTables[1].indexOf(")") > -1
                ? finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1].slice(0, -1)],
                  })
                : finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1]],
                  });
            });
          }
          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
        }
      });

      let filterA = finalTableArray.filter((val) => val.rows.length == 0);

      if (filterA.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const checkFirstNumber = (value) => {
    let array = value.split("),");

    if (array.length > 0) {
      let A;
      let B;
      array.map((k) => {
        if (k.indexOf("-") > -1) {
          let splitArray = k.split("-");
          splitArray.map((j) => {
            if (j.indexOf(")") > -1) {
              if (j.split(")")[0]) {
                B = parseInt(j.split(")")[0]);
              }
            } else {
              if (j.split("(")[1]) {
                A = parseInt(j.split("(")[1]);
              }
            }
          });
        }
      });

      if (A && B && A >= B) {
        return true;
      } else if (A && B && A < B) {
        return false;
      }
    }
  };
  return (
    <>
      <Cards
        marginTop={true}
        title={
          <div className="setting-card-title">
            <Heading as="h4">Your Register Details</Heading>
            <span>
              Enable receipt printing to print receipts while billing with this
              register.
            </span>
            <span>
              By default, The shop name will be printed on the receipt.
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
              name="add Register"
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
              onFinish={handleSubmit}
            >
              <Form.Item
                name="register_name"
                label="Register Name"
                rules={[
                  {
                    required: true,
                    message: "Register name is required",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Register Name"
                />
              </Form.Item>
              <Form.Item
                name="receipt_number_prefix"
                label={
                  <span>
                    Receipt Number Prefix &nbsp;&nbsp;
                    <Tooltip
                      title="Two letter prefix code for recepit number E.G Prefix AB Will generate receipt numbers like AB1,AB2 etc"
                      color="#FFFF"
                    >
                      <InfoCircleFilled
                        style={{
                          color: "#AD005A",
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    message: "Register prefix is required",
                    required: true,
                  },
                  {
                    max: 2,
                    message:
                      "Register prefix cannot be more than 2 characters long.",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Receipt Number Prefix"
                />
              </Form.Item>
              <Form.Item
                name="bill_header"
                label={
                  <span>
                    Bill Header &nbsp;&nbsp;
                    <Tooltip
                      title="The bill header will be printed at the top of the receipt and can be used to add your shop detail like address phone & tax numbers"
                      color="#FFFF"
                    >
                      <InfoCircleFilled
                        style={{
                          color: "#AD005A",
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Bill header content (optional)"
                />
              </Form.Item>
              <Form.Item
                name="bill_footer"
                label={
                  <span>
                    Bill Footer &nbsp;&nbsp;
                    <Tooltip
                      title="The bill footer will be printed at the bottom of the receipt and can be used to add details like terms and condition"
                      color="#FFFF"
                    >
                      <InfoCircleFilled
                        style={{
                          color: "#AD005A",
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Bill footer content (optional)"
                />
              </Form.Item>
              <Form.Item
                name="printer_type"
                label="Printer Type (for PosEase Web)"
              >
                <Select style={{ width: "100%", marginBottom: 10 }}>
                  <Option value="80mm">3 inch recepit (80mm)</Option>
                  <Option value="58mm">2 inch receipt (58mm)</Option>
                  <Option value="A4">A4 size</Option>
                  <Option value="A5">A5 size</Option>
                </Select>
              </Form.Item>
              {getItem("waiter_app_enable") && (
                <>
                  <Form.Item
                    name="server_ip_address"
                    label="Server IP Address For Waiter"
                  >
                    <Input
                      placeholder="Server IP Address For Waiter"
                      style={{ marginBottom: 5 }}
                    />
                  </Form.Item>
                  <span>
                    Available networks :{" "}
                    {getLocalIp ? getLocalIp : "Not Fetch ip"}
                  </span>
                </>
              )}
              <Form.Item name="print_receipts" valuePropName="checked">
                <Checkbox className="add-form-check" style={{ marginTop: 10 }}>
                  Print receipts and order tickets (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item name="include_shop_logo" valuePropName="checked">
                <Checkbox
                  className="add-form-check"
                  style={{ marginBottom: 10 }}
                >
                  Include shop logo in printed receipts (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="table_numbers"
                rules={[
                  {
                    validator: (_, value) => {
                      let tableName = value
                        .split(",")
                        .map((val) => val.split("(")[0]);

                      if (value.split(") ").length > 1) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (
                        tableName.filter(
                          (item, index) => tableName.indexOf(item) !== index
                        ).length > 0
                      ) {
                        return Promise.reject(
                          "Same categories name not allowed"
                        );
                      } else if (
                        (tableName.filter((val) => val == val.trim()).length ==
                          tableName.length) ==
                        false
                      ) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (checkBrecketIsClose(value) == false) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (
                        checkBracketisBlank(value) != undefined &&
                        checkBracketisBlank(value)
                      ) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (value.charAt(value.length - 1) == ",") {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (
                        value.split("),").length > 1 &&
                        value
                          .split("),")
                          .filter(
                            (val) =>
                              !val.includes("-") &&
                              !val.includes(")") &&
                              !val.includes("(")
                          ).length > 0
                      ) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (checkMinusSign(value)) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (checkIsNumber(value)) {
                        return Promise.reject(
                          "Table numbers are invalid, specify a range or a set of comma separated values."
                        );
                      } else if (checkFirstNumber(value)) {
                        return Promise.reject("Number should be greater");
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
                label={
                  <span>
                    Table Numbers &nbsp;&nbsp;
                    <Tooltip
                      title="Provide table numbers either as a range eg:1-6,or as comman seprated values e.g G1,G2,G3,U1,U2,U3 if this field is set you will be able to manage table orders ,take aways and deliveries from the Sell page"
                      color="#FFFF"
                    >
                      <InfoCircleFilled
                        style={{
                          color: "#AD005A",
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  onChange={(e) => {
                    let tableNosArray = e.target.value.split("),");

                    let finalTableArray = [];
                    let tableNosName;
                    let tableNosRange;
                    let splitedTbs;
                    let roomArray = [];
                    let i;
                    tableNosArray.forEach((items) => {
                      let inputNumberItem = items[0];
                      if (items[0] == 1) {
                        if (items.indexOf("-") > -1) {
                          tableNosRange = items.split("-");
                          tableNosRange[0] = parseInt(tableNosRange[0]);
                          tableNosRange[1] = parseInt(tableNosRange[1]);

                          if (tableNosRange[0] > tableNosRange[1]) {
                            for (
                              i = tableNosRange[1];
                              i <= tableNosRange[0];
                              i++
                            ) {
                              roomArray.push("Table" + " " + i);
                            }
                          } else {
                            for (
                              i = tableNosRange[0];
                              i <= tableNosRange[1];
                              i++
                            ) {
                              roomArray.push("Table" + " " + i);
                            }
                          }
                        } else {
                          tableNosRange = items.split(",");
                          tableNosRange.forEach((items) => {
                            roomArray.push("Table" + " " + items);
                          });
                        }

                        i = 1;
                        finalTableArray.forEach((item) => {
                          if (item.name == "Table") {
                            i = 2;
                            item.rows = roomArray;
                          }
                        });
                        if (i == 1) {
                          finalTableArray.push({
                            name: "Table",
                            status: "Empty",
                            rows: roomArray,
                          });
                        }
                      } else if (
                        isNaN(inputNumberItem) &&
                        items &&
                        items.indexOf("-") > -1
                      ) {
                        splitedTbs = items.split("(");
                        tableNosName = splitedTbs[0];
                        tableNosRange = splitedTbs[1];
                        let roomCharArray = [];
                        tableNosRange = tableNosRange.replace(")", "");
                        tableNosRange = tableNosRange.split("-");
                        tableNosRange[0] = parseInt(tableNosRange[0]);
                        tableNosRange[1] = parseInt(tableNosRange[1]);

                        if (tableNosRange[0] > tableNosRange[1]) {
                          for (
                            i = tableNosRange[1];
                            i <= tableNosRange[0];
                            i++
                          ) {
                            roomCharArray.push("Table" + " " + i);
                          }
                        } else {
                          for (
                            i = tableNosRange[0];
                            i <= tableNosRange[1];
                            i++
                          ) {
                            roomCharArray.push("Table" + " " + i);
                          }
                        }

                        finalTableArray.push({
                          name: tableNosName,
                          status: "Empty",
                          rows: roomCharArray,
                        });
                      } else if (items && items.indexOf(",") > -1) {
                        let tempTables = items.split("(");
                        tableNosName = tempTables[0];
                        tableNosRange = tempTables[1];
                        tableNosRange = tableNosRange.replace(")", "");
                        tableNosRange = tableNosRange.split(",");
                        let roomCharArray = [];
                        tableNosRange.forEach((items) => {
                          roomCharArray.push("Table" + " " + items);
                        });

                        finalTableArray.push({
                          name: tableNosName,
                          status: "Empty",
                          rows: roomCharArray,
                        });
                      } else {
                        if (items.indexOf("-") > -1) {
                          tableNosRange = items.split("-");
                          tableNosRange[0] = parseInt(tableNosRange[0]);
                          tableNosRange[1] = parseInt(tableNosRange[1]);

                          if (tableNosRange[0] > tableNosRange[1]) {
                            for (
                              i = tableNosRange[1];
                              i <= tableNosRange[0];
                              i++
                            ) {
                              roomArray.push("Table" + " " + i);
                            }
                          } else {
                            for (
                              i = tableNosRange[0];
                              i <= tableNosRange[1];
                              i++
                            ) {
                              roomArray.push("Table" + " " + i);
                            }
                          }
                        } else {
                          tableNosRange = items.split(",");

                          tableNosRange.forEach((items) => {
                            roomArray.push("Table" + " " + items);
                          });
                        }

                        i = 1;
                        finalTableArray.forEach((item) => {
                          if (item.name == "Table") {
                            i = 2;
                            item.rows = roomArray;
                          }
                        });
                        if (i == 1) {
                          finalTableArray.push({
                            name: "Table",
                            status: "Empty",
                            rows: roomArray,
                          });
                        }
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => history.push("/settings/registers")}
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

export { EditRegister };
