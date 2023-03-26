import React, { useState } from "react";
import { Checkbox, Row, Col, Input, Form, Select, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import TextArea from "antd/lib/input/TextArea";
import { InfoCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setItem, getItem } from "../../../../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import {
  addOrUpdateRegister,
  getAllRegisterList,
} from "../../../../../redux/register/actionCreator";
import { getAllProductList } from "../../../../../redux/products/actionCreator";
import { useEffect } from "react";
const { ipcRenderer, remote } = window.require("electron");
const AddRegister = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [checkedprint, setprint] = useState(false);
  const [checkedlogo, setlogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getLocalIp, setGetIp] = useState(false);

  useEffect(() => {
    ipcRenderer.send("sendReqForConnectIpAddress", "check");
    ipcRenderer.on("getIpAddress", async (event, connectedIpAddres) => {
      if (connectedIpAddres?.length > 0) {
        setGetIp(connectedIpAddres[0]);
      }
    });
  }, []);
  const handleSubmit = async (formData) => {
    setLoading(true);
    formData.print_receipts = checkedprint;
    formData.include_shop_logo = checkedlogo;
    setItem("print_receipts", checkedprint);
    setItem("Include_shop_logo", checkedlogo);
    const getAddRegisters = await dispatch(addOrUpdateRegister(formData, ""));
    if (
      getAddRegisters &&
      getAddRegisters.registerData &&
      !getAddRegisters.registerData.error
    ) {
      if (getItem("waiter_app_enable")) {
        ipcRenderer.send("sendReqForNodeServerStart", true);
      }
      const registerList = await dispatch(getAllRegisterList());
      if (!registerList.error && registerList.RegisterList) {
        setLoading(false);
        let getProductList = await dispatch(getAllProductList());
        if (getProductList && getProductList.productList) {
          history.push("/settings/registers");
        }
      }
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
    return holder.length === 0;
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

  const onChangeprint = (e) => {
    setprint(e.target.checked);
  };

  const onChangelogo = (e) => {
    setlogo(e.target.checked);
  };

  const handleFormChange = (item, allFileds) => {
    setLoading(false);
  };

  return (
    <>
      <Cards
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
        marginTop={true}
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
                    min: 3,
                    message: "Register name must be at least 3 characters long",
                  },
                  {
                    max: 40,
                    message:
                      "Register name cannot be more than 40 characters long.",
                  },
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
                name="register_type"
                label="Printer Type (for PosEase Web)"
              >
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  placeholder="Printer Type (for PosEase Web)Printer Type (for PosEase Web)"
                >
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

              <Form.Item name="print_receipts">
                <Checkbox
                  onChange={onChangeprint}
                  className="add-form-check"
                  style={{ marginTop: 10 }}
                >
                  Print receipts and order tickets (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item name="include_shop_logo">
                <Checkbox
                  onChange={onChangelogo}
                  className="add-form-check"
                  style={{ marginBottom: 10 }}
                >
                  Include shop logo in printed receipts (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="table_numbers"
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
                rules={[
                  {
                    validator: (_, value) => {
                      let tableName =
                        value &&
                        value.split(",").map((val) => val.split("(")[0]);

                      if (value == "" || value == undefined) {
                        return Promise.resolve();
                      } else if (value && value.split(") ").length > 1) {
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
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Eg:1-6 or 1,2,3,4,5,6 (optional)"
                />
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  onClick={() => history.push("/settings/registers")}
                  className="go-back-button"
                  size="medium"
                  type="white"
                  style={{ marginRight: "10px" }}
                >
                  Go Back
                </Button>
                <Button type="primary" htmlType="submit">
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

export { AddRegister };
