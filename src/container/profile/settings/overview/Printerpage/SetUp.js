import React, { useState, useEffect } from "react";
import { Row, Col, Form, Select, Tabs } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getItem } from "../../../../../utility/localStorageControl";
import {
  setUpAdd,
  getAllSetUpPrinterList,
} from "../../../../../redux/printer/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const SetUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { Option } = Select;
  let [totalPrintList, setTotalPrintList] = useState([]);
  let [kitchenList, setKitchenList] = useState([]);
  const [loading, setLoading] = useState(false);
  let [receiptPrintObj, setReceiptPrintObj] = useState({
    printer_id: "",
    printer_type: "receipt_print",
    printer_name: "",
  });

  let fetchOrderTikits = (totaLprinterList) => {
    let localdata = getItem("setupCache");
    if (
      localdata &&
      localdata.orderTicketGroups &&
      localdata.printerList &&
      localdata.setUpPrinter
    ) {
      let totalListPrint = [
        {
          printer_name: "do_not_print",
          selected: true,
          defaultValueData: "do_not_print",
        },
        ...localdata.printerList,
        { printer_name: "browser_print", selected: false },
      ];

      localdata.orderTicketGroups.map((val1) => {
        if (localdata.setUpPrinter.length > 0) {
          let findPrinterSelect = localdata.setUpPrinter?.find(
            (v1) => v1.printer_type == val1.order_ticket_group_name
          );
          if (findPrinterSelect) {
            val1.totalListPrint = totalListPrint.map((val) => {
              if (findPrinterSelect.printer_name == val.printer_name) {
                val.selected = true;
                val1.defaultValueData = val.printer_name;
                return val;
              } else {
                val.selected = false;

                return val;
              }
            });
          } else {
            val1.totalListPrint = totalListPrint;
          }
        }
      });
      setKitchenList(localdata.orderTicketGroups);
    }
  };
  const allSetupPrinterList = (allPrinterList, allSetUpPrinterList) => {
    let setupPrinterList = allSetUpPrinterList;
    let findReceiptPrinterName = setupPrinterList?.find(
      (val) => val.printer_type == "receipt_print"
    );
    if (findReceiptPrinterName) {
      if (
        allPrinterList.find(
          (val) => val.printer_name == findReceiptPrinterName.printer_name
        )
      ) {
        let obj = {
          printer_id: findReceiptPrinterName._id,
          printer_type: findReceiptPrinterName.printer_type,
          printer_name: findReceiptPrinterName.printer_name,
        };
        setReceiptPrintObj(obj);
      } else {
        let obj = {
          printer_id: "",
          printer_type: "receipt_print",
          printer_name: undefined,
        };
        setReceiptPrintObj(obj);
      }
    }
  };
  useEffect(() => {
    let totalPrinterList = [];
    let getAllLocal = getItem("setupCache");
    if (getAllLocal && getAllLocal.printerList) {
      allSetupPrinterList(getAllLocal.printerList, getAllLocal.setUpPrinter);
      setTotalPrintList([
        { printer_name: "do_not_print", selected: true },
        ...getAllLocal.printerList,
        { printer_name: "browser_print", selected: false },
      ]);
    }

    fetchOrderTikits(totalPrinterList);
  }, []);

  let [saveButtonDisabled, setSaveButtonDisaled] = useState(true);
  let [saveButtonDisabledMultiple, setSaveButtonDisaledMutiple] = useState(
    true
  );
  let receiptsPrint = async (value) => {
    setLoading(true);
    if (value.type == "orderReceipt") {
      let addReceiptPrint = await dispatch(setUpAdd(receiptPrintObj));
      if (!addReceiptPrint.error) {
        setLoading(false);
        await dispatch(getAllSetUpPrinterList());
      }
    } else if (value.type == "orderTikets") {
      let printerDetails = value?.data?.totalListPrint?.find(
        (val) => val.selected
      );
      let setupPrinterList = await dispatch(getAllSetUpPrinterList("sell"));
      let findReceiptPrinterName = setupPrinterList?.find(
        (val) => val.printer_type == value.kitchenName
      );
      let orderPrintObj = {
        printer_id: findReceiptPrinterName ? findReceiptPrinterName._id : "",
        printer_type: value.kitchenName,
        printer_name: printerDetails.printer_name,
      };
      if (printerDetails.connect_printer) {
        orderPrintObj.connected_printer_name = printerDetails.connect_printer;
      }
      if (printerDetails._id) {
        orderPrintObj.add_printer_id = printerDetails._id;
      }
      if (printerDetails.top) {
        orderPrintObj.top = printerDetails.top;
      }
      if (printerDetails.left) {
        orderPrintObj.left = printerDetails.left;
      }
      if (printerDetails.content_size) {
        orderPrintObj.content_size = printerDetails.content_size;
      }
      let addReceiptPrintdata = await dispatch(setUpAdd(orderPrintObj));
      if (!addReceiptPrintdata.error) {
        setLoading(false);
        await dispatch(getAllSetUpPrinterList());
      }
    }
    setSaveButtonDisaledMutiple(true);
    setSaveButtonDisaled(true);
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
          <Col xxl={12} md={12} sm={18} xs={24}>
            <h1>Your Receipt Printer Details</h1>
          </Col>
          <Col xxl={12} md={12} sm={18} xs={24}>
            <Form.Item name="printer_name" label="Selected Printer">
              <p style={{ display: "none" }}>{receiptPrintObj.printer_name}</p>
              <Select
                style={{ width: "100%", marginBottom: 10 }}
                value={receiptPrintObj.printer_name}
                placeholder="Select A Printer Type"
                onChange={(value) => {
                  let connectPrintername = totalPrintList?.find(
                    (val) => val.printer_name == value
                  );

                  setReceiptPrintObj({
                    ...receiptPrintObj,
                    printer_name: value,
                    connected_printer_name:
                      connectPrintername && connectPrintername.connect_printer
                        ? connectPrintername.connect_printer
                        : undefined,
                    top:
                      connectPrintername && connectPrintername.top
                        ? connectPrintername.top
                        : undefined,
                    left:
                      connectPrintername && connectPrintername.left
                        ? connectPrintername.left
                        : undefined,
                    content_size:
                      connectPrintername && connectPrintername.content_size
                        ? connectPrintername.content_size
                        : undefined,
                    add_printer_id:
                      connectPrintername && connectPrintername._id
                        ? connectPrintername._id
                        : undefined,
                  });
                  setSaveButtonDisaled(false);
                }}
              >
                {totalPrintList.length > 0 &&
                  totalPrintList.map((val) => {
                    return (
                      <Option value={val.printer_name}>
                        {val.printer_name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item style={{ float: "left" }}>
              <Button
                onClick={() => history.push("/settings/Printers")}
                className="go-back-button"
                type="white"
                style={{ marginRight: "10px" }}
              >
                Go back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={saveButtonDisabled}
                onClick={() => {
                  receiptsPrint({
                    type: "orderReceipt",
                    printerdetails: receiptPrintObj,
                  });
                }}
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
          </Col>
        </Row>
        <br />

        {getItem("orderTicketButton") != null &&
          getItem("orderTicketButton") == true &&
          kitchenList.length > 0 &&
          kitchenList.map((val) => {
            return (
              <>
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={12} sm={18} xs={24}>
                    <h1>
                      {`Your ${val.order_ticket_group_name} Printer Details`}
                    </h1>
                  </Col>
                  <Col xxl={12} md={12} sm={18} xs={24}>
                    <Form.Item name="printer_name" label="Selected Printer">
                      <Select
                        style={{ width: "100%", marginBottom: 10 }}
                        placeholder="Select A Printer Type"
                        defaultValue={val.defaultValueData}
                        onChange={(value) => {
                          val.totalListPrint?.map((kk123) => {
                            setSaveButtonDisaledMutiple(false);
                            if (kk123.printer_name == value) {
                              kk123.selected = true;
                            } else {
                              kk123.selected = false;
                            }
                          });
                        }}
                      >
                        {totalPrintList.length > 0 &&
                          totalPrintList.map((val) => {
                            return (
                              <Option value={val.printer_name}>
                                {val.printer_name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item style={{ float: "left" }}>
                      <Button
                        onClick={() => history.push("/settings/Printers")}
                        className="go-back-button"
                        type="white"
                        style={{ marginRight: "10px" }}
                      >
                        Go back
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={saveButtonDisabledMultiple}
                        onClick={() => {
                          receiptsPrint({
                            type: "orderTikets",
                            data: val,
                            kitchenName: val.order_ticket_group_name,
                          });
                        }}
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
                  </Col>
                </Row>
                <br />
              </>
            );
          })}
      </Cards>
    </>
  );
};

export { SetUp };
