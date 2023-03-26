import React, { useState, useEffect, useRef, useContext } from "react";

import _ from "lodash";
import "./productEditModal.css";
import { Modal, Button, Form, Input, Tooltip, Badge, Row, Col } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import {
  setOrderTickets,
  setItem,
  getItem,
  getCartInfoFromLocalKey,
} from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
import moment from "moment";

import OrderTicketPrint from "./OrderTicketPrint";
import ReactDOMServer from "react-dom/server";
import { useDispatch } from "react-redux";
import {
  getAllSetUpPrinterList,
  getAllPrinterList,
} from "../../../redux/printer/actionCreator";
import { getReceiptNumber } from "../../../utility/utility";
import { SocketContext } from "../../../socket/socketContext";
const { ipcRenderer } = window.require("electron");

const OrderTicketModal = (props, ref) => {
  let {
    table_name,
    localCartInfo,
    registerData,
    setCheckCurrent,
    setOrderTiketModalVisible,
    orderTiketModalVisible,
  } = props;

  const selectedProduct = JSON.parse(
    JSON.stringify(props.selectedProduct.filter((val) => val.quantity > 0))
  );

  const [form] = Form.useForm();
  const socket = getItem("waiter_app_enable") && useContext(SocketContext);
  let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);

  const onClickButton = useRef();
  const dispatch = useDispatch();
  let numberOfKitchen = [];

  const handleCancel = () => {
    setOrderTiketModalVisible(false);
  };

  useEffect(() => {
    let finalData = [];
    if (localCartInfo && localCartInfo.orderTicketsData) {
      let totalOrderTikets = [];
      localCartInfo.orderTicketsData.map((val) => {
        val.itemList.map((i) => {
          totalOrderTikets.push(i);
        });
      });

      var holder = {};
      totalOrderTikets.forEach(function(d) {
        d.newqty = d.newqty ? d.newqty : d.quantity;
        if (d.add_or_remove == "Added Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] + d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        } else if (d.add_or_remove == "Removed Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] - d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        }
      });

      var obj2 = [];
      for (var prop in holder) {
        obj2.push({
          key: prop,
          newqty: holder[prop],
        });
      }
      obj2.map((i) => {
        selectedProduct.reverse().map((data) => {
          if (i.key === data.key) {
            if (data.quantity > i.newqty) {
              data.add_or_remove = "Added Items";
              data.newqty = data.quantity - i.newqty;
              finalData.push(data);
            } else if (data.quantity < i.newqty) {
              data.add_or_remove = "Removed Items";
              data.newqty = i.newqty - data.quantity;
              finalData.push(data);
            }
          }
        });
      });

      var result = selectedProduct.reverse().filter(function(o1) {
        return !obj2.some(function(o2) {
          return o1.key === o2.key;
        });
      });

      if (result.length > 0) {
        result.map((val) => {
          finalData.push(val);
        });
      }
      var result2 = obj2.filter(function(o1) {
        return !selectedProduct.reverse().some(function(o2) {
          return o1.key === o2.key;
        });
      });

      if (result2.length > 0) {
        result2.map((i) => {
          let findData = totalOrderTikets.find((j) => j.key === i.key);
          if (i.newqty > 0) {
            findData.add_or_remove = "Removed Items";
            finalData.push({
              ...findData,
              newqty: i.newqty,
            });
          }
        });
      }
    } else {
      selectedProduct.reverse().map((val) => {
        val.newqty = val.quantity;
        finalData.push(val);
      });
    }

    let arrayData = Object.values(
      finalData.reduce(function(res, value) {
        if (!res[value?.order_ticket_group?._id]) {
          res[value?.order_ticket_group?._id] = {
            categoryName: value?.order_ticket_group?.order_ticket_group_name,
            data: [value],
          };
        } else {
          res[value?.order_ticket_group?._id].data.push(value);
        }

        return res;
      }, {})
    );

    arrayData = arrayData.filter((val) => val.categoryName);

    setListOfUpdatedProduts([...arrayData]);
  }, [orderTiketModalVisible]);

  const [PreviousTikets, setPreviosTikets] = useState([]);
  let [setupList, setsetupPrinterList] = useState([]);

  useEffect(async () => {
    let getSetupPrintList = await dispatch(getAllSetUpPrinterList("sell"));
    if (getSetupPrintList) {
      setsetupPrinterList(getSetupPrintList);
    }
  }, []);

  let [OrderTicketsData, setOrderTicketsData] = useState([]);

  useEffect(() => {
    if (localCartInfo?.cartKey) {
      let localData = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      );

      if (localData?.orderTicketsData?.length) {
        let PreviousTikets1 = [];
        localData.orderTicketsData.map((val) => {
          PreviousTikets1.push(val.tiketNumber);
        });
        setPreviosTikets(PreviousTikets1);
        setOrderTicketsData(localData.orderTicketsData.reverse());
      } else {
        setOrderTicketsData([]);
      }
    } else {
      setOrderTicketsData([]);
    }
  }, [orderTiketModalVisible]);

  function checkCategory(val) {
    let Add = [];
    let remove = [];
    val.data.map((j) => {
      if (j.add_or_remove == "Removed Items") {
        remove.push(j);
      } else {
        Add.push(j);
      }
    });
    return Add.length > 0 && remove.length > 0
      ? "both"
      : Add.length > 0 && remove.length == 0
      ? "Added Items"
      : "Removed Items";
  }

  const sendPrintReq = (valuesOfKitchen) => {
    ipcRenderer.send("PrintReceipt", valuesOfKitchen);
  };

  function dateCompare(time1, time2) {
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0], parts[1], parts[2], 0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], parts[2], 0);

    // returns 1 if greater, -1 if less and 0 if the same
    if (t1.getTime() > t2.getTime()) return 1;
    if (t1.getTime() < t2.getTime()) return -1;
    return 0;
  }
  const onSubmit = () => {
    setOrderTiketModalVisible(false);
    form
      .validateFields()
      .then(async (values) => {
        let receiptNumber =
          localCartInfo && localCartInfo.receipt_Number
            ? localCartInfo.receipt_Number
            : getReceiptNumber(registerData, OrderTicketsData);
        let createOrderTiketsList = [];
        listOfUpdatedproducts.map((val) => {
          let OrderTicketNumber;
          if (getItem("previousOrderTicketNumber") != null) {
            let Details = getItem("previousOrderTicketNumber");
            if (
              moment(moment(Details.date).format("L")).isSame(
                moment().format("L")
              )
            ) {
              if (
                dateCompare(
                  moment(Details.date).format("HH:mm:ss"),
                  "06:00:00"
                ) == -1 &&
                dateCompare(
                  moment(new Date()).format("HH:mm:ss"),
                  "06:00:00"
                ) >= 0
              ) {
                OrderTicketNumber = 1;
                setItem("previousOrderTicketNumber", {
                  date: new Date(),
                  number: 1,
                });
              } else {
                OrderTicketNumber = 1 + Details.number;
                setItem("previousOrderTicketNumber", {
                  date: new Date(),
                  number: 1 + Details.number,
                });
              }
            } else {
              if (
                dateCompare(
                  moment(new Date()).format("HH:mm:ss"),
                  "06:00:00"
                ) >= 0
              ) {
                OrderTicketNumber = 1;
                setItem("previousOrderTicketNumber", {
                  date: new Date(),
                  number: 1,
                });
              } else {
                OrderTicketNumber = 1 + Details.number;
                setItem("previousOrderTicketNumber", {
                  date: new Date(),
                  number: 1 + Details.number,
                });
              }
            }
          } else {
            OrderTicketNumber = 1;
            setItem("previousOrderTicketNumber", {
              date: new Date(),
              number: 1,
            });
          }

          let object = {
            orderNotes: values?.order_tickets_notes,
            tiketNumber: OrderTicketNumber,
            categoryName: val.categoryName,
            add_remove: checkCategory(val),
            itemList: val.data,
            enterDate: new Date(),
            table_name: table_name,
            receiptNumber: receiptNumber,
            receiptNumberDetails: {
              type: "receipt",
              number: receiptNumber,
            },
          };
          OrderTicketsData.push(object);
          createOrderTiketsList.push({
            enterDate: new Date(),
            itemList: object.itemList,
            orderNotes: object.orderNotes,
            tiketNumber: object.tiketNumber,
            categoryName: object.categoryName,
            add_remove: object.add_remove,
            table_name: object.table_name,
            receiptNumberDetails: object.receiptNumberDetails,
          });

          let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
            <OrderTicketPrint
              categoryDetails={object}
              PreviousTikets={PreviousTikets}
              ReceiptNumber={receiptNumber}
              TableName={
                localCartInfo?.tableName ? localCartInfo?.tableName : ""
              }
            />
          );

          let setupfind = setupList.find(
            (val1) => val1.printer_type == val.categoryName
          );

          let obj = {
            printerName:
              setupfind?.connected_printer_name &&
              setupfind?.connected_printer_name != ""
                ? setupfind?.connected_printer_name
                : undefined,
            printDiv: multipleDifrentKithen,
            top: setupfind?.top ? setupfind?.top : undefined,
            left: setupfind?.left ? setupfind?.left : undefined,
            content_size: setupfind?.content_size
              ? setupfind?.content_size
              : undefined,
          };
          numberOfKitchen.push(obj);
          window.frames[
            "print_frame"
          ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
            <OrderTicketPrint
              categoryDetails={object}
              PreviousTikets={PreviousTikets}
              ReceiptNumber={receiptNumber}
              TableName={
                localCartInfo?.tableName ? localCartInfo?.tableName : ""
              }
            />
          );
          window.frames["print_frame"].window.focus();
        });

        if (getItem("active_cart") != null && getItem("active_cart")) {
          let response = setOrderTickets(
            getItem("active_cart"),
            createOrderTiketsList
          );
          if (response?.allLocalData) {
            console.log("handlebhaidaproper", response);
            getItem("waiter_app_enable") &&
              socket?.emit("send_local_table_data", response.allLocalData);
          }
        }
        sendPrintReq(numberOfKitchen);
        form.resetFields();
      })
      .catch((errorInfo) => errorInfo);
  };

  const multiFunctions = () => {
    onSubmit();
  };

  const handlePrintCategory = (val) => {
    let priTickets = PreviousTikets.filter((item) => item !== val.tiketNumber);
    let receiptNumber =
      localCartInfo && localCartInfo.receipt_Number
        ? localCartInfo.receipt_Number
        : getReceiptNumber(registerData, OrderTicketsData);

    window.frames[
      "print_frame"
    ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <OrderTicketPrint
        categoryDetails={val}
        PreviousTikets={priTickets}
        ReceiptNumber={receiptNumber}
        TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
      />
    );
    window.frames["print_frame"].window.focus();
    let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
      <OrderTicketPrint
        title="DUPLICATE"
        customerComment={
          localCartInfo?.onlineOrder?.comment
            ? localCartInfo?.onlineOrder?.comment
            : undefined
        }
        onlineOrder={{
          source: localCartInfo?.onlineOrder?.Source
            ? localCartInfo?.onlineOrder?.Source
            : "",
          orderId: localCartInfo?.onlineOrder?.order_id
            ? localCartInfo?.onlineOrder?.order_id
            : "",
        }}
        categoryDetails={val}
        PreviousTikets={priTickets}
        ReceiptNumber={receiptNumber}
        TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
      />
    );

    let setupfind = setupList.find(
      (val1) => val1.printer_type == val.categoryName
    );

    let obj = {
      printerName:
        setupfind?.connected_printer_name &&
        setupfind?.connected_printer_name != ""
          ? setupfind?.connected_printer_name
          : undefined,
      printDiv: multipleDifrentKithen,
      top: setupfind?.top ? setupfind?.top : undefined,
      left: setupfind?.left ? setupfind?.left : undefined,
      content_size: setupfind?.content_size
        ? setupfind?.content_size
        : undefined,
    };
    numberOfKitchen.push(obj);

    sendPrintReq(numberOfKitchen);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleKeyDown = (event) => {
    if (event.keyCode == 121) {
      onClickButton && onClickButton.current && onClickButton.current.click();
      setOrderTiketModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        title="Order Ticket"
        centered
        visible={orderTiketModalVisible}
        bodyStyle={{ paddingTop: 0 }}
        onOk={form.submit}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button
            type="default"
            className="btn-cancel btn-custom go_back"
            onClick={() => {
              setOrderTiketModalVisible(false);
            }}
          >
            Go Back
          </Button>,
          <Button
            type="primary"
            disabled={listOfUpdatedproducts.length > 0 ? false : true}
            ref={onClickButton}
            onClick={() => {
              multiFunctions();
            }}
          >
            {listOfUpdatedproducts.length > 0
              ? "Create Order Ticket(F9)"
              : "No New Updates"}
          </Button>,
        ]}
      >
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form}
          onFinish={onSubmit}
          name="editProduct"
        >
          {listOfUpdatedproducts.length > 0 ? (
            <Row>
              <Col md={12} lg={12} sm={24}>
                <Form.Item
                  name="darft_name"
                  label={
                    <>
                      Darft Name&nbsp;
                      <Tooltip title="Creating order ticket will also backup the sale to darfts. The draft name can help tp identify the order ticket for example,a restaurant can provide the table number as a draft name.">
                        <QuestionCircleOutlined
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                  style={{ marginRight: "10px" }}
                >
                  <div
                    style={{
                      display: "none",
                    }}
                  >
                    {" "}
                    {table_name}
                  </div>
                  <Input
                    value={table_name}
                    disabled={true}
                    style={{
                      backgroundColor: "hsla(0,0%,93%,.27058823529411763)",
                      color: "black",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={12} sm={24}>
                <Form.Item
                  name="order_tickets_notes"
                  label="Order Ticket Notes"
                >
                  <Input placeholder="Order ticket notes (optional)" />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Form.Item
              name="darft_name"
              label={
                <>
                  Darft Name&nbsp;
                  <Tooltip title="Creating order ticket will also backup the sale to darfts. The draft name can help tp identify the order ticket for example,a restaurant can provide the table number as a draft name.">
                    <QuestionCircleOutlined
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </>
              }
              style={{ marginRight: "10px" }}
            >
              <div
                style={{
                  display: "none",
                }}
              >
                {" "}
                {table_name}
              </div>
              <Input
                value={table_name}
                disabled={true}
                style={{
                  backgroundColor: "hsla(0,0%,93%,.27058823529411763)",
                  color: "black",
                }}
              />
            </Form.Item>
          )}
        </Form>

        <div
          style={{
            overflowY: "scroll",
            maxHeight: "300px",
          }}
        >
          {listOfUpdatedproducts.length > 0 && (
            <>
              {listOfUpdatedproducts.map((categorydata) => {
                if (checkCategory(categorydata) != "both") {
                  return (
                    <>
                      {
                        <div
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <label>
                            {categorydata.categoryName}
                            -Updated Now
                          </label>
                          <div className="borderUpper-top"></div>
                          <label>
                            <Badge
                              status={
                                checkCategory(categorydata) == "Removed Items"
                                  ? "error"
                                  : "success"
                              }
                            />
                            {checkCategory(categorydata)}
                          </label>
                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            {categorydata.data.map((i) => {
                              let text2 = i.display_name.toString();
                              let newSpilitArray = text2.split(/[+]/);
                              let newSpilitArray1 = text2.split(/[,]/);
                              let finalArray = [];
                              newSpilitArray.map((value) => {
                                finalArray.push(value.replace(/,/gi, ""));
                              });
                              return (
                                <>
                                  <div
                                    style={{
                                      marginBottom: "7px",
                                    }}
                                  >
                                    <>
                                      {text2.includes("-") ? (
                                        newSpilitArray1.map((val, index) => (
                                          <div>
                                            {index == 0
                                              ? `${
                                                  i.newqty
                                                    ? i.newqty
                                                    : i.quantity
                                                } x `
                                              : null}
                                            {val}
                                          </div>
                                        ))
                                      ) : (
                                        <div>
                                          {finalArray.length > 1 ? (
                                            <div>
                                              {finalArray.map(
                                                (value, index) => {
                                                  return (
                                                    <div>
                                                      {index == 0
                                                        ? `${
                                                            i.newqty
                                                              ? i.newqty
                                                              : i.quantity
                                                          } x `
                                                        : null}
                                                      {index > 0 ? "+" : null}
                                                      {value}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          ) : (
                                            <div>
                                              {i.newqty ? i.newqty : i.quantity}{" "}
                                              x {i.display_name}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                    {i.orderTiketsNotes && (
                                      <div
                                        style={{
                                          fontSize: "12px",
                                        }}
                                      >
                                        Notes - {i.orderTiketsNotes}
                                      </div>
                                    )}
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      }
                    </>
                  );
                } else {
                  return (
                    <>
                      {
                        <div
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <label>
                            {categorydata.categoryName}
                            -Updated Now
                          </label>
                          <div className="borderUpper-top"></div>
                          <Row xxl={24} md={24} sm={24} xs={24}>
                            <Col xxl={12} md={12} sm={24} xs={24}>
                              <label>
                                <Badge status="success" />
                                Added Items
                              </label>
                              <div
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                {categorydata.data.map((i) => {
                                  let text2 = i.display_name.toString();
                                  let newSpilitArray = text2.split(/[+]/);
                                  let newSpilitArray1 = text2.split(/[,]/);
                                  let finalArray = [];
                                  newSpilitArray.map((value) => {
                                    finalArray.push(value.replace(/,/gi, ""));
                                  });
                                  if (i.add_or_remove == "Added Items") {
                                    return (
                                      <>
                                        <div
                                          style={{
                                            marginBottom: "7px",
                                          }}
                                        >
                                          <>
                                            {text2.includes("-") ? (
                                              newSpilitArray1.map(
                                                (val, index) => (
                                                  <div>
                                                    {index == 0
                                                      ? `${
                                                          i.newqty
                                                            ? i.newqty
                                                            : i.quantity
                                                        } x `
                                                      : null}
                                                    {val}
                                                  </div>
                                                )
                                              )
                                            ) : (
                                              <div>
                                                {" "}
                                                {finalArray.length > 1 ? (
                                                  <div>
                                                    {finalArray.map(
                                                      (value, index) => {
                                                        return (
                                                          <div>
                                                            {index == 0
                                                              ? `${
                                                                  i.newqty
                                                                    ? i.newqty
                                                                    : i.quantity
                                                                } x `
                                                              : null}
                                                            {index > 0
                                                              ? "+"
                                                              : null}
                                                            {value}
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div>
                                                    {i.newqty
                                                      ? i.newqty
                                                      : i.quantity}{" "}
                                                    x {i.display_name}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                          {i.orderTiketsNotes && (
                                            <div
                                              style={{
                                                fontSize: "12px",
                                              }}
                                            >
                                              Notes - {i.orderTiketsNotes}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  }
                                })}
                              </div>
                            </Col>
                            <Col xxl={12} md={12} sm={24} xs={24}>
                              <label>
                                <Badge status="error" />
                                Removed Items
                              </label>
                              <div
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                {categorydata.data.map((i) => {
                                  let text2 = i.display_name.toString();
                                  let newSpilitArray = text2.split(/[+]/);
                                  let newSpilitArray1 = text2.split(/[,]/);
                                  let finalArray = [];
                                  newSpilitArray.map((value) => {
                                    finalArray.push(value.replace(/,/gi, ""));
                                  });
                                  if (i.add_or_remove == "Removed Items") {
                                    return (
                                      <>
                                        <div
                                          style={{
                                            marginBottom: "7px",
                                          }}
                                        >
                                          <>
                                            {text2.includes("-") ? (
                                              newSpilitArray1.map(
                                                (val, index) => (
                                                  <div>
                                                    {index == 0
                                                      ? `${
                                                          i.newqty
                                                            ? i.newqty
                                                            : i.quantity
                                                        } x `
                                                      : null}
                                                    {val}
                                                  </div>
                                                )
                                              )
                                            ) : (
                                              <div>
                                                {" "}
                                                {finalArray.length > 1 ? (
                                                  <div>
                                                    {finalArray.map(
                                                      (value, index) => {
                                                        return (
                                                          <div>
                                                            {index == 0
                                                              ? `${
                                                                  i.newqty
                                                                    ? i.newqty
                                                                    : i.quantity
                                                                } x `
                                                              : null}
                                                            {index > 0
                                                              ? "+"
                                                              : null}
                                                            {value}
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div>
                                                    {i.newqty
                                                      ? i.newqty
                                                      : i.quantity}{" "}
                                                    x {i.display_name}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                          {i.orderTiketsNotes && (
                                            <div
                                              style={{
                                                fontSize: "12px",
                                              }}
                                            >
                                              Notes - {i.orderTiketsNotes}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  }
                                })}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      }
                    </>
                  );
                }
              })}
            </>
          )}

          {OrderTicketsData &&
            OrderTicketsData.length > 0 &&
            OrderTicketsData.map((val) => {
              if (val.add_remove != "both") {
                return (
                  <>
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <label className="space-content">
                        <span>
                          {val.categoryName}
                          {` - Order Ticket #${val.tiketNumber} `}
                          <small>| Accepted </small>
                          <span
                            style={{
                              color: "#008cba",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handlePrintCategory(val);

                              // handlePrint();
                            }}
                          >
                            Print
                          </span>
                        </span>
                        <span
                          style={{
                            marginRight: "10px",
                          }}
                        >
                          {commonFunction.convertToDate(
                            val.enterDate,
                            "MMM DD, Y h:mm A"
                          )}{" "}
                          | {getItem("userDetails").username}
                        </span>
                      </label>
                      <div className="borderUpper-top"></div>
                      <label>
                        <Badge
                          status={
                            val.add_remove == "Added Items"
                              ? "success"
                              : "error"
                          }
                        />
                        {val.add_remove}
                      </label>
                      <div
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        {val.itemList.map((i) => {
                          let text2 = i.display_name.toString();
                          let newSpilitArray = text2.split(/[+]/);
                          let newSpilitArray1 = text2.split(/[,]/);
                          let finalArray = [];
                          newSpilitArray.map((value) => {
                            finalArray.push(value.replace(/,/gi, ""));
                          });
                          return (
                            <>
                              <div
                                style={{
                                  marginBottom: "7px",
                                }}
                              >
                                <>
                                  {text2.includes("-") ? (
                                    newSpilitArray1.map((val, index) => (
                                      <div>
                                        {index == 0
                                          ? `${
                                              i.newqty ? i.newqty : i.quantity
                                            } x `
                                          : null}

                                        {val}
                                      </div>
                                    ))
                                  ) : (
                                    <div>
                                      {" "}
                                      {finalArray.length > 1 ? (
                                        <div>
                                          {finalArray.map((value, index) => {
                                            return (
                                              <div>
                                                {index == 0
                                                  ? `${
                                                      i.newqty
                                                        ? i.newqty
                                                        : i.quantity
                                                    } x `
                                                  : null}
                                                {index > 0 ? "+" : null}
                                                {value}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <div>
                                          {" "}
                                          {i.newqty
                                            ? i.newqty
                                            : i.quantity} x {i.display_name}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                                {i.orderTiketsNotes && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    Notes - {i.orderTiketsNotes}
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })}
                        {val.orderNotes &&
                          `Order ticket notes - ${val.orderNotes}`}
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <label className="space-content">
                        <span>
                          {val.categoryName}
                          {` - Order Ticket #${val.tiketNumber} `}
                          <small>| Accepted </small>
                          <span
                            style={{
                              color: "#008cba",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handlePrintCategory(val);
                            }}
                          >
                            Print
                          </span>
                        </span>
                        <span
                          style={{
                            marginRight: "10px",
                          }}
                        >
                          {commonFunction.convertToDate(
                            val.enterDate,
                            "MMM DD, Y h:mm A"
                          )}{" "}
                          | {getItem("userDetails").username}
                        </span>
                      </label>
                      <Row xxl={24} md={24} sm={24} xs={24}>
                        <Col xxl={12} md={12} sm={24} xs={24}>
                          <label>
                            <Badge status={"success"} />
                            Added Items
                          </label>
                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            {val.itemList.map((i) => {
                              let text2 = i.display_name.toString();
                              let newSpilitArray = text2.split(/[+]/);
                              let newSpilitArray1 = text2.split(/[,]/);
                              let finalArray = [];
                              newSpilitArray.map((value) => {
                                finalArray.push(value.replace(/,/gi, ""));
                              });
                              if (i.add_or_remove == "Added Items") {
                                return (
                                  <>
                                    <div
                                      style={{
                                        marginBottom: "7px",
                                      }}
                                    >
                                      <>
                                        {text2.includes("-") ? (
                                          newSpilitArray1.map((val, index) => (
                                            <div>
                                              {index == 0
                                                ? `${
                                                    i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                  } x `
                                                : null}
                                              {val}
                                            </div>
                                          ))
                                        ) : (
                                          <div>
                                            {" "}
                                            {finalArray.length > 1 ? (
                                              <div>
                                                {finalArray.map(
                                                  (value, index) => {
                                                    return (
                                                      <div>
                                                        {index == 0
                                                          ? `${
                                                              i.newqty
                                                                ? i.newqty
                                                                : i.quantity
                                                            } x `
                                                          : null}
                                                        {index > 0 ? "+" : null}
                                                        {value}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            ) : (
                                              <div>
                                                {" "}
                                                {i.newqty
                                                  ? i.newqty
                                                  : i.quantity}{" "}
                                                x {i.display_name}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </>
                                      {i.orderTiketsNotes && (
                                        <div
                                          style={{
                                            fontSize: "12px",
                                          }}
                                        >
                                          Notes - {i.orderTiketsNotes}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                );
                              }
                            })}
                            {val.orderNotes &&
                              `Order ticket notes - ${val.orderNotes}`}
                          </div>
                        </Col>
                        <Col xxl={12} md={12} sm={24} xs={24}>
                          <label>
                            <Badge status="error" />
                            Removed Items
                          </label>
                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            {val.itemList.map((i) => {
                              let text2 = i.display_name.toString();
                              let newSpilitArray = text2.split(/[+]/);
                              let newSpilitArray1 = text2.split(/[,]/);
                              let finalArray = [];
                              newSpilitArray.map((value) => {
                                finalArray.push(value.replace(/,/gi, ""));
                              });
                              if (i.add_or_remove == "Removed Items") {
                                return (
                                  <>
                                    <div
                                      style={{
                                        marginBottom: "7px",
                                      }}
                                    >
                                      <>
                                        {text2.includes("-") ? (
                                          newSpilitArray1.map((val, index) => (
                                            <div>
                                              {index == 0
                                                ? `${
                                                    i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                  } x `
                                                : null}{" "}
                                              {val}
                                            </div>
                                          ))
                                        ) : (
                                          <div>
                                            {" "}
                                            {finalArray.length > 1 ? (
                                              <div>
                                                {finalArray.map(
                                                  (value, index) => {
                                                    return (
                                                      <div>
                                                        {index == 0
                                                          ? `${
                                                              i.newqty
                                                                ? i.newqty
                                                                : i.quantity
                                                            } x `
                                                          : null}
                                                        {index > 0 ? "+" : null}
                                                        {value}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            ) : (
                                              <div>
                                                {" "}
                                                {i.newqty
                                                  ? i.newqty
                                                  : i.quantity}{" "}
                                                x {i.display_name}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </>
                                      {i.orderTiketsNotes && (
                                        <div
                                          style={{
                                            fontSize: "12px",
                                          }}
                                        >
                                          Notes - {i.orderTiketsNotes}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                );
                              }
                            })}
                            {val.orderNotes &&
                              `Order ticket notes - ${val.orderNotes}`}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                );
              }
            })}
        </div>
      </Modal>
    </>
  );
};

export default React.memo(OrderTicketModal);
