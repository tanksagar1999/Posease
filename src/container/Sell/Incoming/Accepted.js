import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Checkbox, Radio, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Main, TableWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import ReactDOMServer from "react-dom/server";
import {
  acceptOnlineOrderList,
  removeCartFromLocalStorage,
} from "../../../utility/localStorageControl";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "../sell.css";
import {
  createOnlineTakeAway,
  setOrderTickets,
  setItem,
  getItem,
  getCartInfoFromLocalKey,
} from "../../../utility/localStorageControl";
import {
  CreateOrder,
  AddAndUpdateBooking,
} from "../../../redux/sell/actionCreator";
import { cancelOrder } from "../../../redux/receipts/actionCreator";
import OrderTicketPrint from "../Current/OrderTicketPrint";
import {
  getAllOrderList,
  redayOrders,
  onlineOrderProductList,
  getZometoDetail,
  getSwiggyDetail,
} from "../../../redux/onlineOrder/actionCreator";
import { Spin } from "antd";
import ReceiptPrint from "../Print/ReceiptPrint";
import { LoadingOutlined } from "@ant-design/icons";
const { ipcRenderer, ipcMain, BrowserWindow } = window.require("electron");
import moment from "moment";
const Accepted = (props) => {
  const [loader, setLoader] = useState({
    recordId: "",
    check: false,
  });
  const { currentRegisterData, changeTab } = props;
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [totalOrders, setTotalOrderList] = useState([]);
  let [setupList, setsetupPrinterList] = useState(
    getItem("setupCache")?.setUpPrinter?.length > 0
      ? getItem("setupCache").setUpPrinter
      : []
  );
  let numberofdiffrentPrint = [];
  async function fetchAllOrders() {
    if (currentRegisterData?.onlineOrder) {
      const getAllAcceptOrderDetailsList = acceptOnlineOrderList();

      if (getAllAcceptOrderDetailsList) {
        setTotalOrderList(
          getAllAcceptOrderDetailsList.map((val) => {
            val.clickRow = false;
            return val;
          })
        );
        return getAllAcceptOrderDetailsList;
      }
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      fetchAllOrders();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const createOrderDetails = (record) => {
    const { localData } = record;

    let orderData = {};
    orderData["ReceiptNumber"] =
      localData.orderTicketsData[0]?.receiptNumberDetails?.number;
    orderData.updatePaymentDate = new Date();
    orderData.customer = {
      mobile: 0,
      name: localData.onlineOrder?.Customer,
    };

    orderData.actual_time =
      localData?.orderTicketsData && localData.orderTicketsData[0]
        ? localData.orderTicketsData[0].enterDate
        : new Date();
    orderData.details = {
      source: "web",
      sourceVersion: "5.2",
      saleType: "immediate",
      paymentStatus: "paid",
      itemsSold: localData.data,
      fulfillmentStatus: "Fulfilled",
      tableName: localData.tableName,
      order_by_name: getItem("userDetails"),
      register_data: currentRegisterData,
      orderType: "TakeAway",
      immediate_sale: {
        multiple_payments_type: [
          {
            name: record.Source,
            value: record.Value,
            paymentDate: new Date(),
          },
        ],
      },
      priceSummery: {
        total: record.Value,
        totalTaxes:
          record.Source == "Swiggy" && localData.onlineOrder.tax
            ? localData.onlineOrder.tax
            : 0,
      },
    };
    if (localData.onlineOrder.disconut > 0) {
      orderData.details.bulckDiscountValue = localData.onlineOrder.disconut;
    }

    orderData.details.onlineOrder = localData.onlineOrder;
    return orderData;
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

  const sendPrintReq = (numberofdiffrentPrint) => {
    ipcRenderer.send("PrintReceipt", numberofdiffrentPrint);
  };
  const printReceipt = (getOrder, onlineOrder) => {
    const { orderData } = getOrder;

    if (currentRegisterData.print_receipts) {
      window.frames[
        "print_frame"
      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <ReceiptPrint
          onlineOrder={onlineOrder}
          receiptsDetails={orderData}
          shopDetails={getItem("setupCache")?.shopDetails}
          registerData={currentRegisterData}
          ReceiptNumber={orderData.ReceiptNumber}
        />
      );
      window.frames["print_frame"].window.focus();
      let connnectName = setupList.find(
        (val) => val.printer_type == "receipt_print"
      );

      let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
        <ReceiptPrint
          onlineOrder={onlineOrder}
          receiptsDetails={orderData}
          shopDetails={getItem("setupCache")?.shopDetails}
          registerData={currentRegisterData}
          ReceiptNumber={orderData.ReceiptNumber}
        />
      );
      let obj = {
        printerName:
          connnectName?.connected_printer_name &&
          connnectName?.connected_printer_name != ""
            ? connnectName?.connected_printer_name
            : undefined,
        printDiv: multipleDifrentKithen,
        top: connnectName?.top ? connnectName?.top : undefined,
        left: connnectName?.left ? connnectName?.left : undefined,
        content_size: connnectName?.content_size
          ? connnectName?.content_size
          : undefined,
      };

      numberofdiffrentPrint.push(obj);
      sendPrintReq(numberofdiffrentPrint);
      // window.frames["print_frame"].window.print();
    }
  };
  const cancelReceiptPrint = async (
    ReceiptNumber,
    cancelBookingObj,
    localCartInfo
  ) => {
    let orderData = {};

    let receipt_number = ReceiptNumber;

    orderData.actual_time = new Date();

    orderData["ReceiptNumber"] = receipt_number;
    orderData.updatePaymentDate = new Date();
    orderData.customer = {
      mobile: 0,
      name: localCartInfo?.onlineOrder?.Customer,
    };

    if (localCartInfo?.type == "booking_cart") {
      localCartInfo.bookingDetails.details.priceSummery.orderCacel = true;
      orderData.details = localCartInfo.bookingDetails.details;
    } else {
      orderData.details = {
        source: "web",
        sourceVersion: "5.2",
        saleType: "immediate",
        paymentStatus: "unpaid",
        itemsSold: localCartInfo.data,
        fulfillmentStatus: "Unfulfilled",
        tableName: localCartInfo?.tableName,
        order_by_name: getItem("userDetails"),
        register_data: currentRegisterData,
        immediate_sale: {
          multiple_payments_type: [
            {
              name: localCartInfo?.onlineOrder?.Source
                ? localCartInfo?.onlineOrder?.Source
                : "Online Order",
              value: 0,
              paymentDate: new Date(),
            },
          ],
        },
        priceSummery: {
          total: 0,
          totalTaxes: 0,
          orderCacel: true,
        },
      };
    }

    if (localCartInfo) {
      orderData.details.orderTicketsData = localCartInfo.orderTicketsData;
    }
    if (localCartInfo) {
      orderData.details.onlineOrder = localCartInfo.onlineOrder;
    }

    let getOrder = await dispatch(CreateOrder(orderData));

    if (getOrder && getOrder.orderData) {
      const getCancelOrder = await dispatch(
        cancelOrder(
          {
            cancellation: {
              cancel_Date: new Date(),
              refund_amount: 0,
              refund_pay_type: "cash",
            },
          },
          getOrder.orderData._id
        )
      );
    }
  };
  let numberOfKitchen = [];
  const cancelOrderTikets = (localCartInfo) => {
    {
      if (
        localCartInfo &&
        getCartInfoFromLocalKey(localCartInfo?.cartKey, currentRegisterData) &&
        getCartInfoFromLocalKey(localCartInfo?.cartKey, currentRegisterData)
          ?.orderTicketsData
      ) {
        localCartInfo = getCartInfoFromLocalKey(
          localCartInfo?.cartKey,
          currentRegisterData
        );
        let receipt_number =
          localCartInfo?.orderTicketsData?.length > 0
            ? localCartInfo.orderTicketsData[0].receiptNumberDetails.number
            : getReceiptNumber(currentRegisterData, OrderTicketsData);

        let totalOrderTikets = [];
        let PreviousTikets = [];
        localCartInfo.orderTicketsData.map((val) => {
          PreviousTikets.push(val.tiketNumber);

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
          obj2.push({ key: prop, newqty: holder[prop] });
        }

        let filterCancelList = obj2.map((val) => {
          let product = totalOrderTikets.find((itm) => itm.key == val.key);

          product.newqty = product.quantity;
          product.add_remove = "Removed Items";
          return product;
        });

        let arrayData = Object.values(
          filterCancelList.reduce(function(res, value) {
            if (!res[value?.order_ticket_group?._id]) {
              res[value?.order_ticket_group?._id] = {
                categoryName:
                  value?.order_ticket_group?.order_ticket_group_name,
                data: [value],
              };
            } else {
              res[value?.order_ticket_group?._id].data.push(value);
            }

            return res;
          }, {})
        );
        let createOrderTiketsList = [];
        arrayData.map((val) => {
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
            orderNotes: " " /* values.order_tickets_notes*/,
            tiketNumber: OrderTicketNumber,
            categoryName: val.categoryName,
            add_remove: "Removed Items",
            itemList: val.data,
            enterDate: new Date(),
            table_name: localCartInfo?.tableName,
          };
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
          window.frames[
            "print_frame"
          ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
            <OrderTicketPrint
              onlineOrder={{
                source: localCartInfo?.onlineOrder?.Source
                  ? localCartInfo?.onlineOrder?.Source
                  : "",
                orderId: localCartInfo?.onlineOrder?.order_id
                  ? localCartInfo?.onlineOrder?.order_id
                  : "",
              }}
              categoryDetails={object}
              PreviousTikets={PreviousTikets}
              ReceiptNumber={receipt_number}
              TableName={
                localCartInfo?.tableName ? localCartInfo?.tableName : ""
              }
            />
          );
          window.frames["print_frame"].window.focus();
          // window.frames["print_frame"].window.print();
          let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
            <OrderTicketPrint
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
              categoryDetails={object}
              PreviousTikets={PreviousTikets}
              ReceiptNumber={receiptNumber}
              TableName={
                localCartInfo?.tableName ? localCartInfo?.tableName : ""
              }
            />
          );

          let setupfind = setupList.find(
            (val1) => val1.printer_type == "Main Kitchen"
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
        });
        setOrderTickets(localCartInfo?.cartKey, createOrderTiketsList);
        sendPrintReq(numberOfKitchen);
        cancelReceiptPrint(receipt_number, undefined, localCartInfo);

        removeCartFromLocalStorage(localCartInfo.cartKey);
        fetchAllOrders();
      }
    }
  };

  const cancelReceipt = (localData) => {
    cancelOrderTikets(localData);
  };

  const readyForOrder = async (record) => {
    if (record.order_id) {
      setLoader({
        recordId: record.order_id,
        check: true,
      });

      let zomatoUrl = currentRegisterData.onlineOrder.find(
        (val) => val.orderType == "zomato"
      );
      let swiggyUrl = currentRegisterData.onlineOrder.find(
        (val) => val.orderType == "swiggy"
      );
      console.log("currentRegisterData", zomatoUrl);
      if (zomatoUrl && zomatoUrl.url && record.Source == "Zomato") {
        const response1 = await dispatch(
          getZometoDetail(zomatoUrl.url, record.order_id)
        );

        if (response1?.rejectionDetails) {
          cancelReceipt(record.localData);
        } else {
          if (response1?.supportingRiderDetails[0]) {
            record.deliveryBoyInfo = response1?.supportingRiderDetails[0];
          }

          const response = await dispatch(
            redayOrders(
              currentRegisterData.onlineOrder,
              record.order_id,
              record.Source
            )
          );
          if (response) {
            let orderData = createOrderDetails(record);
            if (response1 && response1.supportingRiderDetails[0]) {
              orderData.details.deliveryBoyInfo =
                response1.supportingRiderDetails[0];
            }
            const getOrder = await dispatch(CreateOrder(orderData));
            console.log("getOrdergetOrdergetOrdergetOrder", getOrder);
            if (getOrder) {
              if (record?.localData?.cartKey) {
                removeCartFromLocalStorage(record.localData.cartKey);
              }
              printReceipt(getOrder, {
                source: record.Source,
                orderId: record.order_id,
              });
              fetchAllOrders();
              setLoader({
                recordId: "",
                check: false,
              });
            }
          }
        }
      }

      if (swiggyUrl && swiggyUrl.url && record.Source == "Swiggy") {
        const response = await dispatch(
          getSwiggyDetail(swiggyUrl.url, record.order_id)
        );

        if (response && response.status.order_status == "cancelled") {
          cancelReceipt(record.localData);
        } else {
          const response = await dispatch(
            redayOrders(currentRegisterData.onlineOrder, record.order_id)
          );
          if (response) {
            let orderData = createOrderDetails(record);
            const getOrder = await dispatch(CreateOrder(orderData));
            if (getOrder) {
              if (record?.localData?.cartKey) {
                removeCartFromLocalStorage(record.localData.cartKey);
              }
              printReceipt(getOrder, {
                source: record.Source,
                orderId: record.order_id,
              });
              fetchAllOrders();
            }
          }
        }
      }
    }
  };

  const dataSource = [];
  if (totalOrders.length)
    totalOrders.map((value) => {
      if (value.onlineOrder) {
        return dataSource.push({
          id: value.onlineOrder.order_id,
          Source: value.onlineOrder.Source,
          order_id: value.onlineOrder.order_id,
          Value: value.onlineOrder.Value,
          Time: value.onlineOrder.Time,
          Items: value.data,
          deliveryBoyInfo: value.onlineOrder.deliveryBoyInfo,
          Customer: value.onlineOrder.Customer,
          localData: value,
          clickRow: value.clickRow,
        });
      }
    });

  const columns = [
    {
      title: "Order Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Source",
      dataIndex: "Source",
      key: "Source",
      filters: [
        {
          text: "Zomato",
          value: "Zomato",
        },
        {
          text: "Swiggy",
          value: "Swiggy",
        },
      ],
      onFilter: (value, record) => record.Source.includes(value),
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: "15%",
    },
    {
      title: "Items",
      dataIndex: "Items",
      key: "Items",
      render(value, record, index1) {
        return {
          children: (
            <>
              {/* {value.map((val) => <p>{val.quantity} x {val.display_name}</p>)} */}

              {record.clickRow ? (
                value.map((val, index) =>
                  index == value.length - 1 ? (
                    <p
                      style={{ marginTop: "0px", marginBottom: "0px" }}
                      onClick={() => {
                        totalOrders.map((val, index) => {
                          if (index1 == index) {
                            val.clickRow = !val.clickRow;
                          }
                          return val;
                        });
                        setTotalOrderList([...totalOrders]);
                      }}
                    >
                      {val.quantity} x {val.display_name}{" "}
                      <UpOutlined
                        style={{
                          cursor: "pointer",
                          fontSize: "10px",
                        }}
                      />{" "}
                    </p>
                  ) : (
                    <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                      {val.quantity} x {val.display_name}{" "}
                    </p>
                  )
                )
              ) : (
                <p
                  onClick={() => {
                    totalOrders.map((val, index) => {
                      if (index1 == index) {
                        val.clickRow = !val.clickRow;
                      }
                      return val;
                    });
                    setTotalOrderList([...totalOrders]);
                  }}
                >
                  {value[0].quantity} x {value[0].display_name}{" "}
                  <DownOutlined
                    style={{
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  />
                </p>
              )}
            </>
          ),
        };
      },
    },
    {
      title: "Value",
      dataIndex: "Value",
      key: "Value",
    },
    {
      title: "Customer",
      dataIndex: "Customer",
      key: "Customer",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",

      render(value, record) {
        return {
          children: (
            <>
              <Button
                size="medium"
                className="btn-custom"
                type="primary"
                raised
                onClick={() => readyForOrder(record)}
              >
                <span className="whiteloader">
                  {loader.check && loader.recordId == record.id ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 16,
                            margin: "0px 50px",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    "Ready & Complete"
                  )}
                </span>
              </Button>
            </>
          ),
        };
      },
    },
  ];

  return (
    <div>
      <TableWrapper className="table-responsive">
        <Table
          rowKey="id"
          size="small"
          className="seller-table"
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            total: dataSource.length,
          }}
        />
      </TableWrapper>
    </div>
  );
};

export { Accepted };
