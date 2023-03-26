import React, { useState, useEffect } from "react";
import { Row, Col, Input, Form, Select, Tabs, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import TestPrinter from "../../../../Sell/Print/TestPrinter";
import ReactDOMServer from "react-dom/server";
import {
  addOrUpdatePrinter,
  getAllPrinterList,
  getPrinterById,
} from "../../../../../redux/printer/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const { ipcRenderer } = window.require("electron");

const AddPrinter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();
  const { Option } = Select;
  let [connectprinterList, setConnectPrinterList] = useState([]);
  let [printerType, setPrinterType] = useState();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData) => {
    setLoading(true);
    formData.top = Number(formData.top);
    formData.left = Number(formData.left);
    formData.content_size =
      formData.printer_size == "80MM"
        ? "64mm"
        : formData.printer_size == "58MM"
        ? "44mm"
        : "190mm";

    let printer_id =
      location && location.state && location.state.printer_id
        ? location.state.printer_id
        : null;
    console.log("kkkmkdadadaasdsadsa", formData);
    let response = await dispatch(addOrUpdatePrinter(formData, printer_id));
    if (response && !response.data.error) {
      let list = await dispatch(getAllPrinterList());
      if (list) {
        setLoading(false);
        history.push("/settings/Printers");
      }
    }
  };

  useEffect(() => {
    ipcRenderer.send("sendReqForConnectPrinterList", "sagar");
    ipcRenderer.on("getPrinterList", async (event, connectedPrinterList) => {
      setConnectPrinterList(connectedPrinterList);

      if (location && location.state && location.state.printer_id) {
        let printerData = await dispatch(
          getPrinterById(location.state.printer_id)
        );

        if (printerData) {
          setPrinterType(printerData.printer_type);
          form.setFieldsValue({
            printer_name: printerData.printer_name,
            printer_size: printerData.printer_size,
            printer_type: printerData.printer_type,
            connect_printer: connectedPrinterList.find(
              (val) => val.name == printerData.connect_printer
            )
              ? printerData.connect_printer
              : undefined,
            content_size: printerData.content_size,
            top: printerData.top,
            left: printerData.left,
          });
        }
      }
    });
  }, []);

  const testPrinter = () => {
    form.validateFields().then(async (value) => {
      let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
        <TestPrinter />
      );
      let obj = {
        printerName: value.connect_printer,
        printDiv: multipleDifrentKithen,
        top: Number(value.top),
        left: Number(value.left),
        content_size:
          value.printer_size == "80MM"
            ? "64mm"
            : value.printer_size == "58MM"
            ? "47mm"
            : "190mm",
      };

      ipcRenderer.send("PrintReceipt", [obj]);
    });
  };
  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Your Printer Details</Heading>
            <span>
              Printers specific to iOS, Android or Desktop can be added only
              from their respective apps.
            </span>
            <span>
              Posease Web uses the register settings, these printers are
              applicable only for Mobile and Desktop.
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
              name="add Printer"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="printer_name"
                label="Printer Name"
                rules={[
                  {
                    min: 3,
                    message: "Printer name must be at least 3 characters long",
                  },
                  {
                    max: 40,
                    message:
                      "Printer name cannot be more than 40 characters long.",
                  },
                  {
                    required: true,
                    message: "Printer name is required",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Printer Name"
                />
              </Form.Item>
              <Form.Item
                name="printer_type"
                label="Printer Type"
                rules={[
                  {
                    required: true,
                    message: "Select A Printer Type is required",
                  },
                ]}
              >
                <Select
                  style={{
                    width: "100%",
                    marginBottom: 10,
                  }}
                  placeholder="Select A Printer Type"
                  onChange={(value) => {
                    setPrinterType(value);
                  }}
                >
                  <Option value="silent-print">Slient Print</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="printer_size"
                label="Printer Size"
                rules={[
                  {
                    required: true,
                    message: "Select A Printer Size is required",
                  },
                ]}
              >
                <Select
                  style={{
                    width: "100%",
                    marginBottom: 10,
                  }}
                  placeholder="Select A Printer Size"
                >
                  <Option value="80MM">3 inch recepit (80mm)</Option>
                  <Option value="58MM">2 inch receipt (58mm)</Option>
                  <Option value="A4">A4 size</Option>
                  <Option value="A5">A5 size</Option>
                </Select>
              </Form.Item>
              {printerType == "silent-print" && (
                <Form.Item
                  name="connect_printer"
                  label="Connected Printer"
                  rules={[
                    {
                      required: true,
                      message: "Connected Printer is required",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: "100%",
                      marginBottom: 10,
                    }}
                    placeholder="Select A Printer"
                  >
                    {connectprinterList.length > 0 ? (
                      connectprinterList.map((val) => {
                        return <Option value={val.name}>{val.name}</Option>;
                      })
                    ) : (
                      <>not connect any printer</>
                    )}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                name="left"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                initialValue={0}
                label={
                  <>
                    Left to Right (0mm){" "}
                    <Tooltip title="Adjust to match your printer">
                      <QuestionCircleOutlined
                        style={{
                          cursor: "pointer",
                          marginLeft: "2px",
                        }}
                      />
                    </Tooltip>
                  </>
                }
              >
                <Input
                  style={{ marginBottom: 6 }}
                  placeholder="Left to right"
                  type="number"
                />
              </Form.Item>
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              ></span>
              <Form.Item
                name="top"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                label={
                  <>
                    Top to Bottom (0mm){" "}
                    <Tooltip title="Adjust to match your printer">
                      <QuestionCircleOutlined
                        style={{
                          cursor: "pointer",
                          marginLeft: "2px",
                        }}
                      />
                    </Tooltip>
                  </>
                }
                initialValue={0}
              >
                <Input
                  style={{ marginBottom: 6 }}
                  placeholder="Top to Bottom"
                  type="number"
                />
              </Form.Item>

              <Form.Item style={{ float: "right" }}>
                <Button
                  onClick={() => history.push("/settings/Printers")}
                  className="go-back-button"
                  type="white"
                  style={{ marginRight: "10px" }}
                >
                  Go Back
                </Button>
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={testPrinter}
                >
                  Test Print
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

export { AddPrinter };
