import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Radio,
  Button,
  Tag,
  Checkbox,
  DatePicker,
  TimePicker,
  Modal,
  Tooltip,
  message,
} from "antd";
import moment from "moment";
import ReactDOMServer from "react-dom/server";
import { useDispatch } from "react-redux";
import {
  CreateOrder,
  AddAndUpdateBooking,
} from "../../../redux/sell/actionCreator";
import {
  getAllOrderList,
  redayOrders,
  onlineOrderProductList,
  getZometoDetail,
  getSwiggyDetail,
} from "../../../redux/onlineOrder/actionCreator";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  getItem,
  setItem,
  storeOtherData,
  getCartInfoFromLocalKey,
  setOrderTickets,
  tableStatusChange,
  removeItem,
} from "../../../utility/localStorageControl";
import "../sell.css";

import { SplitBookingAdvance } from "./SplitBookingAdvance";
import ReceiptPrint from "../Print/ReceiptPrint";

import OrderTicketPrint from "./OrderTicketPrint";

import { getReceiptNumber, getBookingNumber } from "../../../utility/utility";
import { SocketContext } from "../../../socket/socketContext";

const { ipcRenderer, ipcMain, BrowserWindow } = window.require("electron");

const ChargeDetails = (props) => {
  const socket = getItem("waiter_app_enable") && useContext(SocketContext);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let {
    tabChangeToCurrent,
    orderCartData,
    chargeClick,
    setCustomer,
    onclickFun,
    localCartInfo,
    searchApi,
    setNotSarchApi,
    checkClick,
    shopDetails,
    registerData,
    selectedProduct,
    emptyCart,
    table_name,
    allLocalData,
    spinOn,
  } = props;

  if (
    localCartInfo &&
    localCartInfo.cartKey &&
    getCartInfoFromLocalKey(localCartInfo.cartKey, registerData)
  ) {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo.cartKey,
      registerData
    );
  } else if (getItem("active_cart") != null && getItem("active_cart")) {
    localCartInfo = getCartInfoFromLocalKey(
      getItem("active_cart"),
      registerData
    );
  }

  const [form] = Form.useForm();
  const [spiltForm] = Form.useForm();
  const { TextArea } = Input;
  let isMounted = useRef(true);
  const splitBookingAdvance = useRef();
  const [notUpdate, setNotUpdate] = useState(
    localCartInfo?.hasOwnProperty("onlineOrder") ||
      localCartInfo?.hasOwnProperty("bingageDetails")
      ? true
      : false
  );

  let numberofdiffrentPrint = [];
  const formref = useRef();

  const [DateString, setDateString] = useState(
    localCartInfo?.bookingDetails?.details?.bookingDetails?.delivery_date
      ? localCartInfo?.bookingDetails?.details?.bookingDetails?.delivery_date
      : moment().format("LL")
  );
  const [bookingAdvance, setBookingAdvance] = useState(
    localCartInfo?.bookingDetails
      ? localCartInfo?.bookingDetails.details.bookingDetails?.booking_advance
        ? localCartInfo?.bookingDetails.details.bookingDetails?.booking_advance
        : 0
      : localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_advance !=
        ""
        ? Number(
            localCartInfo?.otherDetails?.details?.bookingDetails
              ?.booking_advance
          )
        : 0
      : 0
  );
  let [allPriterList, setAllPrinterList] = useState(
    allLocalData?.printerList?.length > 0 ? allLocalData.printerList : []
  );
  let [setupList, setsetupPrinterList] = useState(
    allLocalData?.setUpPrinter?.length > 0 ? allLocalData.setUpPrinter : []
  );
  const [modalSpiltVisible, setModelSpiltVisible] = useState(false);

  const [splitCustomerEqually, setSplitCustomerEqually] = useState(false);
  const [DeliveryDoor, setDeliveryDoor] = useState(
    localCartInfo?.bookingDetails?.details?.bookingDetails?.is_door_delivery
      ? true
      : false
  );

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingOrderTiketsData, setBookingOrderTiketsData] = useState([]);

  const [immediateSubmitButtonText, setimmediateSubmitButtonText] = useState(
    localCartInfo &&
      localCartInfo.cartKey &&
      localCartInfo.Status == "Unpaid" &&
      localCartInfo.bingageDetails == undefined
      ? "Received"
      : localCartInfo?.bookingDetails != false &&
        localCartInfo?.bookingDetails != null
      ? "Fullfill, Pending"
      : getItem("print_receipt_first") != null &&
        getItem("print_receipt_first") == true
      ? "Print receipt for"
      : "Received"
  );

  const [printFirst, setPrintFirst] = useState(
    localCartInfo &&
      localCartInfo.cartKey &&
      localCartInfo.Status == "Unpaid" &&
      localCartInfo.bingageDetails == undefined
      ? false
      : getItem("print_receipt_first")
      ? localCartInfo.bingagePrintFirstTrueClick
        ? false
        : localCartInfo.onlineOrder
        ? false
        : true
      : false
  );

  const [bookingSubmitButtonText, setBookingSubmitButtonText] = useState(
    localCartInfo?.bookingDetails != false &&
      localCartInfo?.bookingDetails != null
      ? getItem("print_receipt_first")
        ? "Print receipt for Fullfill, Pending"
        : "Fullfill, Pending"
      : getItem("print_receipt_first")
      ? `Print receipt for ${rsSymbol}${0.0}/`
      : `Received ${rsSymbol}${0} of`
  );

  const { TabPane } = Tabs;
  const { CheckableTag } = Tag;
  const dispatch = useDispatch();
  const [activeSplitTab, setActiveSplitTab] = useState("payment_type");
  function callback(key) {}
  const [PaymentType, setPaymentType] = useState(
    localCartInfo?.onlineOrder?.Source
      ? localCartInfo.onlineOrder?.Source
      : false
  );
  const [bookingAdvancePaymnetType, setBookingAdvancePaymnetType] = useState(
    false
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localCartInfo?.bookingDetails != false &&
      localCartInfo?.bookingDetails != null
      ? "booking"
      : localCartInfo &&
        localCartInfo.cartKey &&
        localCartInfo.otherDetails &&
        localCartInfo.details &&
        localCartInfo.details.saleType
      ? localCartInfo.details.saleType
      : "immediate"
  );
  let [AddtionalList, setAddtionalList] = useState([]);
  const [DeliveryTime, setDeliveryTime] = useState(
    localCartInfo?.bookingDetails?.details?.bookingDetails?.delivery_time
      ? localCartInfo?.bookingDetails?.details?.bookingDetails?.delivery_time
      : moment().format("LT")
  );
  const [customerMobialNumber, setCustomerMobaialNumer] = useState(
    localCartInfo?.otherDetails?.customer?.mobile
      ? localCartInfo?.otherDetails.customer.mobile
      : null
  );
  const [customerName, setCustomerName] = useState(
    localCartInfo?.otherDetails?.customer?.name
      ? localCartInfo?.otherDetails.customer.name
      : null
  );
  const [customerEmail, setCustomerEmail] = useState(
    localCartInfo?.otherDetails?.customer?.email
      ? localCartInfo?.otherDetails.customer.email
      : null
  );
  const [zipCode, setZipCode] = useState(
    localCartInfo?.otherDetails?.customer?.zipcode
      ? localCartInfo?.otherDetails.customer.zipcode
      : null
  );
  const [city, setCity] = useState(
    localCartInfo?.otherDetails?.customer?.city
      ? localCartInfo?.otherDetails.customer.city
      : null
  );
  const [shippingAddress, setShippingAddress] = useState(
    localCartInfo?.otherDetails?.customer?.shipping_address
      ? localCartInfo?.otherDetails.customer.shipping_address
      : null
  );
  const [selectedTags, setselectedTags] = useState([]);
  const [change, setNotChange] = useState(true);
  const [modelVisibleColse, setModelVisibleColse] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("paid");
  const [pendingPaymnets, setPendingPayments] = useState(0);
  const [splitCustomerType, setSplitCustomerType] = useState("equally");
  const [numberOfSplitCustomer, setNumberOfSplitCustomer] = useState([]);
  const [splitCustomerNo, setSplitCustomerNo] = useState();

  const [balanceToCustomer, setBalanceToCustomer] = useState();
  let [
    splitCustomerNextButtonCliked,
    setSplitCustomerNextButtonCliked,
  ] = useState(false);
  const [orderTicketsNotes, setOrderTicketNotes] = useState("");
  const [occupantsSeat, setOccupantsSeat] = useState("");
  const [cashTender, setCashTender] = useState("");
  const [cardDetails, setCardDetails] = useState("");
  const [paymentNotes, setPaymnetsNotes] = useState("");
  const [bookingNotes, setBookingNotes] = useState(
    localCartInfo && localCartInfo.cartKey && localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_notes !=
        ""
        ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_notes
        : ""
      : localCartInfo?.bookingDetails?.details?.bookingDetails?.booking_notes
      ? localCartInfo?.bookingDetails?.details?.bookingDetails?.booking_notes
      : ""
  );

  let [
    splitCustomerNext2ButtonCliked,
    setSplitCustomerNext2ButtonCliked,
  ] = useState(false);
  let [disabledImmedateAndBooking, setdisabledImmedateAndBooking] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid" ? true : false
  );
  let [splitErr, setSplitErr] = useState(false);
  let [avialableItems, setAvialableItems] = useState();
  const [
    splitByItemsCurrentCustomer,
    setSplitByItemsCurrentCustomer,
  ] = useState(1);
  const [printDetails, setPrintDetails] = useState();
  let OrderTicketsData = [];
  useEffect(() => {
    let totalItems = getItem("product_Details");

    if (totalItems) {
      totalItems.map((product) => {
        product.oldCalculatedPrice = product.calculatedprice;
        product.calculatedprice =
          (product.calculatedprice * product.productTaxes) / 100 +
          product.calculatedprice;
      });
      setAvialableItems(totalItems);
    }
  }, [splitCustomerNo]);
  useEffect(() => {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo?.cartKey,
      registerData
    );
    setNotChange(false);
    if (
      orderCartData.customer &&
      orderCartData.customer.mobile &&
      orderCartData.customer.mobile != "Add Customer" &&
      orderCartData.customer.status == "Find"
    ) {
      setCustomerMobaialNumer(orderCartData.customer.mobile);
      form.setFieldsValue({
        name: orderCartData.customer.name
          ? orderCartData.customer.name
          : customerName,
        mobile: orderCartData.customer.mobile,
      });

      orderCartData.customer.name &&
        setCustomerName(orderCartData.customer.name);

      orderCartData.customer.email &&
        setCustomerEmail(orderCartData.customer.email);
      orderCartData.customer.city && setCity(orderCartData.customer.city);
      orderCartData.customer.zipcode &&
        setZipCode(orderCartData.customer.zipcode);
      orderCartData.customer.shipping_address &&
        setShippingAddress(orderCartData.customer.shipping_address);
    } else {
      if (
        localCartInfo?.otherDetails &&
        localCartInfo?.otherDetails.customer &&
        localCartInfo?.otherDetails.customer.mobile != "Add Customer"
      ) {
        form.setFieldsValue({
          name: localCartInfo?.otherDetails.customer.name,
          mobile:
            localCartInfo?.otherDetails.customer.mobile != null &&
            localCartInfo?.otherDetails.customer.mobile != 0
              ? Number(localCartInfo?.otherDetails.customer.mobile)
              : undefined,
        });
      }
      if (orderCartData?.customer?.status == "NotFind") {
        form.setFieldsValue({
          name: "",
        });
        setCustomerName();
        setCustomerEmail();
        setZipCode();
        setShippingAddress();
        setCity();
        setselectedTags([]);
      }
    }
  }, [orderCartData.customer]);

  useEffect(() => {
    if (localCartInfo?.bookingDetails) {
      setTotalPrice(
        orderCartData.totalPrice -
          localCartInfo?.bookingDetails.details.bookingDetails?.booking_advance
      );
    } else if (orderCartData?.totalPrice) {
      setTotalPrice(orderCartData.totalPrice);
    }
  }, [orderCartData.totalPrice]);

  useEffect(() => {
    if (localCartInfo?.details) {
      setPaymentMethod(localCartInfo?.details.saleType);
    }
  }, []);
  useEffect(() => {
    async function fetchAddtionalList() {
      let CustomArray = [];
      const getAddtionalList = allLocalData?.customFields?.addtional?.length
        ? allLocalData.customFields.addtional
        : [];

      if (isMounted.current && getAddtionalList)
        getAddtionalList.map((val) => {
          if (val.sub_type === "customer") {
            CustomArray.push(val);
          }
        });

      if (orderCartData.customer?.custom_fields) {
        orderCartData.customer.custom_fields.map((val) => {
          if (val.type == "additional_detail") {
            CustomArray.map((data) => {
              if (data.name == val.name) {
                data.value = val.value;
              }
            });
          }
        });
      }

      setAddtionalList(CustomArray);
    }
    fetchAddtionalList();
  }, [orderCartData.customer?.custom_fields]);

  const [TagList, setTagList] = useState(
    allLocalData?.customFields?.tag?.length > 0
      ? allLocalData.customFields.tag
      : []
  );

  useEffect(() => {
    if (orderCartData.customer?.custom_fields) {
      const array = [];
      orderCartData.customer.custom_fields.map((field, index) => {
        if (field.type === "tag") {
          return field.value === true
            ? array.push(field.name)
            : selectedTags.filter((t) => t !== field.name);
        }
      });

      setselectedTags(array);
    }
  }, [orderCartData.customer?.custom_fields]);

  let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);

  let totalOrderTikets = [];
  useEffect(() => {
    if (getItem("orderTicketButton")) {
      let finalData = [];
      if (localCartInfo && localCartInfo.orderTicketsData) {
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
          obj2.push({ key: prop, newqty: holder[prop] });
        }
        obj2.map((i) => {
          selectedProduct.map((data) => {
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

        var result = selectedProduct.filter(function(o1) {
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
          return !selectedProduct.some(function(o2) {
            return o1.key === o2.key;
          });
        });

        if (result2.length > 0) {
          result2.map((i) => {
            let findData = totalOrderTikets.find((j) => j.key === i.key);
            if (i.newqty > 0) {
              findData.add_or_remove = "Removed Items";
              finalData.push({ ...findData, newqty: i.newqty });
            }
          });
        }
      } else {
        selectedProduct.map((val) => {
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
    }
  }, []);
  let num = 0;
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
    let receiptNumberObj;
    let receiptNumber;
    if (localCartInfo && localCartInfo?.orderTicketsData?.length > 0) {
      receiptNumber =
        localCartInfo.orderTicketsData[0].receiptNumberDetails.number;
      receiptNumberObj = {
        type: "receipt",
        number: receiptNumber,
      };
    } else if (
      getItem("create_receipt_while_fullfilling_booking") &&
      paymentMethod == "booking"
    ) {
      receiptNumber = getBookingNumber(registerData, []);
      receiptNumberObj = {
        type: "booking",
        number: receiptNumber,
      };
    } else {
      receiptNumber = getReceiptNumber(registerData, OrderTicketsData);
      receiptNumberObj = {
        type: "receipt",
        number: receiptNumber,
      };
    }
    let bookingOrdertiketsDataDetails = [];
    let createOrderTiketsList = [];
    listOfUpdatedproducts.length > 0 &&
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
              dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >=
                0
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
              dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >=
              0
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
          add_remove: checkCategory(val),
          itemList: val.data,
          enterDate: new Date(),
          table_name: table_name,
          receiptNumber: receiptNumber,
          receiptNumberDetails: receiptNumberObj,
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
        OrderTicketsData.push(object);
        let setupfind = setupList.find(
          (val1) => val1.printer_type == val.categoryName
        );

        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
          <OrderTicketPrint
            title={
              getItem("create_receipt_while_fullfilling_booking") &&
              paymentMethod == "booking"
                ? "Booking"
                : undefined
            }
            deliceryDateAndTime={
              getItem("create_receipt_while_fullfilling_booking") &&
              paymentMethod == "booking"
                ? `${DateString},${DeliveryTime}`
                : undefined
            }
            categoryDetails={object}
            PreviousTikets={PreviousTikets}
            ReceiptNumber={receiptNumber}
            TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
          />
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

        numberofdiffrentPrint.push(obj);

        if (registerData.print_receipts) {
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
        }
        bookingOrdertiketsDataDetails.push({
          enterDate: new Date(),
          itemList: val.data,
          orderNotes: object.orderNotes,
          tiketNumber: object.tiketNumber,
          categoryName: object.categoryName,
          add_remove: object.add_remove,
          table_name: object.table_name,
          receiptNumberDetails: object.receiptNumberDetails,
        });
      });
    setOrderTickets(localCartInfo?.cartKey, createOrderTiketsList);
    setListOfUpdatedProduts([]);

    return bookingOrdertiketsDataDetails;
  };
  let [connectprinterList, setConnectPrinterList] = useState([]);
  useEffect(() => {
    ipcRenderer.send("sendReqForConnectPrinterList", "pls send List");
    ipcRenderer.on("getPrinterList", (event, arg) => {
      setConnectPrinterList(arg);
    });
  }, []);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    setselectedTags(nextSelectedTags);
  };

  const sendPrintReq = (valuesOfKitchen) => {
    ipcRenderer.send("PrintReceipt", valuesOfKitchen);
  };
  const [printFirstReceiptNumber, setPrintReceiptNumber] = useState(
    localCartInfo?.printFirstReceiptNumber
  );
  const createOrderdetails = (value, val, checkBooking) => {
    console.log(
      "🚀 ~ file: ChargeDetails.js:755 ~ createOrderdetails ~ localCartInfo:",
      localCartInfo
    );
    if (localCartInfo) {
      let receiptNumber;
      if (checkBooking == "fullFillBooking") {
        let list = value.totalOrderTiketsList ? value.totalOrderTiketsList : [];
        receiptNumber = printFirstReceiptNumber
          ? printFirstReceiptNumber
          : getBookingNumber(registerData, list);
      } else if (checkBooking == "allredybookingNumber") {
        receiptNumber = localCartInfo?.bookingDetails?.ReceiptNumber;
      } else {
        receiptNumber = printFirstReceiptNumber
          ? printFirstReceiptNumber
          : localCartInfo?.orderTicketsData?.length > 0
          ? localCartInfo.orderTicketsData[0].receiptNumberDetails?.number
          : getReceiptNumber(registerData, OrderTicketsData);
      }

      let orderData = {};
      console.log(
        "🚀 ~ file: ChargeDetails.js:773 ~ createOrderdetails ~ orderData:",
        orderData
      );

      orderData["ReceiptNumber"] = receiptNumber
        ? receiptNumber
        : "DM-QNO-2219-11";
      orderData.updatePaymentDate = new Date();
      orderData.customer = {
        mobile: Number(customerMobialNumber),
        email: customerEmail,
        name: value.name,
        shipping_address: shippingAddress,
        zipcode: zipCode,
        city: city,
      };

      orderData.actual_time =
        localCartInfo.orderTicketsData && localCartInfo.orderTicketsData[0]
          ? localCartInfo.orderTicketsData[0].enterDate
          : new Date();

      orderData.details = {
        source: "web",
        sourceVersion: "5.2",
        saleType: paymentMethod,
        paymentStatus: paymentstatus,
        itemsSold: selectedProduct,
        order_tickets_notes: value.order_tickets_notes,
        occupants: value.occupants,
        tableName: orderCartData.tableName,
        order_by_name: orderCartData.order_by,
        fulfillmentStatus: "Fulfilled",
        date: new Date(),
        register_data: registerData,
        orderType:
          localCartInfo?.type == "delivery-local"
            ? "Delivery"
            : localCartInfo?.type == "custom-table-local"
            ? "CustomTable"
            : localCartInfo?.type == "take-away-local"
            ? "TakeAway"
            : "Darft",
        bingagePaymnetType:
          paymentMethod == "immediate"
            ? PaymentType
            : bookingAdvancePaymnetType
            ? bookingAdvancePaymnetType
            : "case",
        priceSummery: {
          total: orderCartData.totalPrice,
          totalTaxes: orderCartData.totalTaxes,
          sub_total: orderCartData.sub_total,
        },
      };
      let inventoryList =
        allLocalData &&
        allLocalData.inventorys &&
        allLocalData.inventorys.map((val) => {
          if (val.linked_registers.includes(registerData._id)) {
            return val._id;
          }
        });
      console.log(
        "🚀 ~ file: ChargeDetails.js:827 ~ createOrderdetails ~ inventoryList:",
        inventoryList
      );
      if (inventoryList && inventoryList.length) {
        orderData.details.inventoryList = inventoryList.filter(
          (val) => val != undefined
        );
      }
      console.log(
        "🚀 ~ file: ChargeDetails.js:845 ~ createOrderdetails ~ bingageDetai:"
      );
      if (localCartInfo && localCartInfo.bingageDetails) {
        orderData.details.bingageDetails = localCartInfo.bingageDetails;
      }
      console.log(
        "🚀 ~ file: ChargeDetails.js:856 ~ createOrderdetails ~ bulkDiscountDetails:"
      );
      if (
        localCartInfo &&
        localCartInfo.cartKey &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.bulkDiscountDetails &&
        localCartInfo.otherDetails.bulkDiscountDetails.bulkValue &&
        Number(localCartInfo.otherDetails.bulkDiscountDetails.bulkValue) > 0
      ) {
        orderData.details.bulckDiscountValue = Number(
          localCartInfo.otherDetails.bulkDiscountDetails.bulkValue
        );
      }
      console.log("saxscasascacaca870");
      if (value.totalOrderTiketsList) {
        orderData.details.orderTicketsData = value.totalOrderTiketsList;
      }
      console.log("saxscasascacaca874");

      if (
        localCartInfo &&
        localCartInfo.cartKey &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.TotalAddtionalChargeValue &&
        localCartInfo.otherDetails.TotalAddtionalChargeValue > 0
      ) {
        orderData.details.AddtionChargeValue = localCartInfo.otherDetails
          ?.AddtionalChargeList
          ? localCartInfo.otherDetails?.AddtionalChargeList
          : [];
      }
      console.log("saxscasascacaca888");

      orderCartData.round_off_value != 0 &&
        (orderData.details.priceSummery.round_off_value =
          orderCartData.round_off_value);
      console.log("saxscasascacaca893");
      if (paymentMethod === "immediate") {
        orderData.details.immediate_sale = {
          cash_tender: value.cash_tender,
          balance_to_customer: balanceToCustomer,
          card_Details: value.card_details,
          payment_notes: value.payment_notes,
        };

        filterSplitArray.length > 0 &&
          filterSplitArray.map((i) => {
            if (i.name == "Cash") {
              i.name = "cash";
              i.paymentDate = new Date();
            } else if (i.name == "Credit / Debit Card") {
              i.name = "card";
              i.paymentDate = new Date();
            } else if (i.name == "Other") {
              i.name = "other";
              i.paymentDate = new Date();
            } else {
              i.name = i.name;
              i.paymentDate = new Date();
            }
          });
        numberOfSplitCustomer.length > 0 &&
          numberOfSplitCustomer.map((val) => {
            val.payment_type_list.map((i) => {
              if (i.tick == true) {
                if (i.name == "Cash") {
                  i.name = "cash";
                  i.paymentDate = new Date();
                } else if (i.name == "Credit / Debit Card") {
                  i.name = "card";
                  i.paymentDate = new Date();
                } else if (i.name == "Other") {
                  i.name = "other";
                  i.paymentDate = new Date();
                } else {
                  i.name = i.name;
                  i.paymentDate = new Date();
                }
              }
            });
          });

        numberOfSplitCustomer.length > 0 &&
          numberOfSplitCustomer.map((val) => {
            val.payment_type_list.map((i) => {
              if (i.tick == true) {
                i.price = val.value;
                val.customerName = val.name;
                val.name = i.name;
                val.paymentDate = i.paymentDate;
              }
            });
          });

        filterSplitArray.length > 1
          ? splitCustomerEqually
            ? (orderData.details.immediate_sale.multiple_payments_type = numberOfSplitCustomer)
            : (orderData.details.immediate_sale.multiple_payments_type = filterSplitArray)
          : (orderData.details.immediate_sale.multiple_payments_type = [
              { name: PaymentType, value: totalPrice, paymentDate: new Date() },
            ]);

        pendingPaymnets > 0 &&
          (orderData.details.immediate_sale.pending_payments = pendingPaymnets);
      } else {
        filterBookingSplitArray.length > 0 &&
          filterBookingSplitArray.map((i) => {
            if (i.name == "Cash") {
              i.name = "cash";
              i.bookingDate = new Date();
            } else if (i.name == "Credit / Debit Card") {
              i.name = "card";
              i.bookingDate = new Date();
            } else if (i.name == "Other") {
              i.name = "other";
              i.bookingDate = new Date();
            } else {
              i.name = i.name;
              i.bookingDate = new Date();
            }
          });

        orderData.details.bookingDetails = {
          delivery_date: DateString,
          delivery_time: DeliveryTime,
          is_door_delivery: DeliveryDoor,
          booking_notes: bookingNotes,
          booking_advance: isNaN(value.booking_advance)
            ? 0
            : value.booking_advance,

          booking_advance_payment_card_details: value.card_details,
        };

        filterBookingSplitArray.length > 1
          ? (orderData.details.bookingDetails.booking_advance_payment_type = filterBookingSplitArray)
          : (orderData.details.bookingDetails.booking_advance_payment_type = [
              {
                name: bookingAdvancePaymnetType,
                value: bookingAdvance,
                bookingDate: new Date(),
              },
            ]);
      }
      console.log("saxscasascacaca1001");

      var arr = [];
      let totalTagList = [];
      if (selectedTags.length > 0) {
        TagList.map((field) => {
          if (selectedTags.indexOf(field.name) > -1) {
            arr.push(field);
            totalTagList.push({
              ...field,
              value: true,
            });
          } else {
            totalTagList.push(field);
          }
        });
      }
      console.log("saxscasascacaca1018");

      orderData.details["custom_fields"] = arr;
      let checkValueIsOrNot = AddtionalList.find((val) => {
        if (val.value) {
          return true;
        }
      });
      console.log("saxscasascacaca1026");

      if (checkValueIsOrNot != undefined) {
        orderData.details.customer_custom_fields = AddtionalList;
      }
      orderData.customer["custom_fields"] = [...totalTagList, ...AddtionalList];
      return orderData;
    } else {
      alert("notlocalCartInfo");
    }
  };
  const createFullFillBooking = async (orderData) => {
    orderData.details.paymentStatus = "unpaid";
    orderData.details.bookingDetails.booking_number = orderData.ReceiptNumber;

    orderData.draftList = true;

    localCartInfo.orderTicketsData = orderData.details.orderTicketsData;

    orderData.details.localCartInfo = localCartInfo;

    if (printFirst) {
      if (registerData.print_receipts) {
        let connnectName = setupList.find(
          (val) => val.printer_type == "receipt_print"
        );

        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
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

        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
            ReceiptNumber={orderData.ReceiptNumber}
          />
        );
        window.frames["print_frame"].window.focus();
        //  window.frames["print_frame"].window.print();
      }
      setPrintFirst(false);
      setdisabledImmedateAndBooking(true);

      setBookingSubmitButtonText(
        `Received ${rsSymbol}${bookingAdvance > 0 ? bookingAdvance : 0} of `
      );

      setPrintReceiptNumber(orderData.ReceiptNumber);
      const { default_cart_object, allLocalData } = tableStatusChange(
        localCartInfo?.cartKey,
        "Unpaid",
        orderData.ReceiptNumber,
        undefined,
        localCartInfo.Status == "Unpaid" && localCartInfo.bingageDetails
          ? true
          : false
      );
      getItem("waiter_app_enable") &&
        socket?.emit("send_local_table_data", allLocalData);
    } else {
      let printFirst =
        getItem("print_receipt_first") == null
          ? false
          : getItem("print_receipt_first");

      let printSettlement =
        getItem("print_settlement_paymnet") == null
          ? false
          : getItem("print_settlement_paymnet");
      if (printFirst == false && registerData.print_receipts) {
        let connnectName = setupList.find(
          (val) => val.printer_type == "receipt_print"
        );

        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            title="ESTIMATE"
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
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
      } else if (printFirst && printSettlement && registerData.print_receipts) {
        let connnectName = setupList.find(
          (val) => val.printer_type == "receipt_print"
        );

        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            title="ESTIMATE"
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
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
      }

      const bookingData = await dispatch(AddAndUpdateBooking(orderData));
      if (bookingData) {
      }
    }
  };

  const immedatePaymnetOrderCreate = async (orderData) => {
    console.log(
      "🚀 ~ file: ChargeDetails.js:1235 ~ immedatePaymnetOrderCreate ~ orderData:",
      orderData
    );
    // if (
    //   getItem("orderTicketButton") != null &&
    //   getItem("orderTicketButton") == true
    // ) {
    //   let localData = getCartInfoFromLocalKey(
    //     localCartInfo?.cartKey,
    //     registerData
    //   );
    //   orderData.details.orderTiketsDetails = localData;
    // }

    if (printFirst) {
      if (registerData.print_receipts) {
        let connnectName = setupList.find(
          (val) => val.printer_type == "receipt_print"
        );

        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
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
        console.log("dashdadbadbdh", orderData);
        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            onlineOrder={
              localCartInfo?.onlineOrder
                ? {
                    source: localCartInfo?.onlineOrder?.Source
                      ? localCartInfo?.onlineOrder?.Source
                      : "",
                    orderId: localCartInfo?.onlineOrder?.order_id
                      ? localCartInfo?.onlineOrder?.order_id
                      : "",
                  }
                : undefined
            }
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
            ReceiptNumber={orderData.ReceiptNumber}
          />
        );

        console.log("sagartankdandnd", orderData);
        window.frames["print_frame"].window.focus();
        //  window.frames["print_frame"].window.print();
      }
      setPrintFirst(false);
      setdisabledImmedateAndBooking(true);
      paymentMethod == "booking"
        ? setBookingSubmitButtonText(
            `Received ${rsSymbol}${bookingAdvance > 0 ? bookingAdvance : 0} of `
          )
        : setimmediateSubmitButtonText("Recevied");
      setPrintReceiptNumber(orderData.ReceiptNumber);
      const { default_cart_object, allLocalData } = tableStatusChange(
        localCartInfo?.cartKey,
        "Unpaid",
        orderData.ReceiptNumber,
        undefined,
        localCartInfo?.Status == "Unpaid" && localCartInfo.bingageDetails
          ? true
          : false
      );
      getItem("waiter_app_enable") &&
        socket?.emit("send_local_table_data", allLocalData);
    } else {
      console.log(
        "🚀 ~ file: ChargeDetails.js:1338 ~ immedatePaymnetOrderCreate ~ orderData:",
        orderData
      );
      if (
        localCartInfo &&
        localCartInfo.onlineOrder &&
        localCartInfo.onlineOrder.order_id
      ) {
        const response = await dispatch(
          redayOrders(
            registerData.onlineOrder,
            localCartInfo?.onlineOrder?.order_id,
            localCartInfo?.onlineOrder.Source
          )
        );
      }
      console.log(
        "🚀 ~ file: ChargeDetails.js:1355 ~ immedatePaymnetOrderCreate ~ orderData:",
        orderData
      );
      const getOrder = await dispatch(CreateOrder(orderData));
      console.log(
        "🚀 ~ file: ChargeDetails.js:1359 ~ immedatePaymnetOrderCreate ~ getOrder:",
        getOrder
      );
      if (getOrder && getOrder.orderData && getOrder.orderData.details) {
        if (
          getOrder.orderData.details.immediate_sale &&
          getOrder.orderData.details.immediate_sale.multiple_payments_type
            .length
        ) {
          getOrder.orderData.details.immediate_sale.multiple_payments_type.map(
            (i, idx) => {
              if (i.name == "") {
                i.name = `Customer ${idx + 1}`;
              }
            }
          );
        }

        let printFirst =
          getItem("print_receipt_first") == null
            ? false
            : getItem("print_receipt_first");

        let printSettlement =
          getItem("print_settlement_paymnet") == null
            ? false
            : getItem("print_settlement_paymnet");
        if (printFirst == false || getOrder?.orderData?.details?.onlineOrder) {
          setPrintDetails(getOrder.orderData);

          if (
            getOrder.orderData.details.immediate_sale &&
            getOrder.orderData.details.immediate_sale.multiple_payments_type
              .length
          ) {
            if (
              getOrder.orderData.details.immediate_sale
                .multiple_payments_type[0].customer_type == "by_items"
            ) {
              for (
                let i = 0;
                i <
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length;
                i++
              ) {
                // getOrder.orderData.details.itemsSold = [
                //   ...getOrder.orderData.details.immediate_sale
                //     .multiple_payments_type[i].product_List,
                // ];
                // // let price;
                // let tax = 0;
                // let price = 0;
                // getOrder.orderData.details.itemsSold.map((i) => {
                //   price = price + i.price;
                //   tax = Number(tax) + Number((price / 100) * i.productTaxes);
                // });

                // getOrder.orderData.details.priceSummery = {
                //   total: price + tax,
                //   totalTaxes: tax,
                // };

                if (registerData.print_receipts) {
                  let connnectName = setupList.find(
                    (val) => val.printer_type == "receipt_print"
                  );

                  let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
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
                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      ReceiptNumber={orderData.ReceiptNumber}
                    />
                  );
                  window.frames["print_frame"].window.focus();
                  //  window.frames["print_frame"].window.print();
                }
              }
            } else {
              for (
                let i = 0;
                i <
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length;
                i++
              ) {
                let price =
                  getOrder?.orderData.details?.immediate_sale
                    .multiple_payments_type[i]?.value;
                if (registerData.print_receipts) {
                  let connnectName = setupList.find(
                    (val) => val.printer_type == "receipt_print"
                  );

                  let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      price={price}
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

                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      price={price}
                      ReceiptNumber={orderData.ReceiptNumber}
                    />
                  );
                  window.frames["print_frame"].window.focus();
                  //  window.frames["print_frame"].window.print();
                }
              }
            }
          } else {
            if (registerData.print_receipts) {
              let connnectName = setupList.find(
                (val) => val.printer_type == "receipt_print"
              );

              let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
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
              window.frames[
                "print_frame"
              ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
                  ReceiptNumber={orderData.ReceiptNumber}
                />
              );
              window.frames["print_frame"].window.focus();
              //  window.frames["print_frame"].window.print();
            }
          }
        } else if (printFirst && printSettlement) {
          setPrintDetails(getOrder.orderData);
          if (
            getOrder.orderData.details.immediate_sale &&
            getOrder.orderData.details.immediate_sale.multiple_payments_type
              .length
          ) {
            if (
              getOrder.orderData.details.immediate_sale
                .multiple_payments_type[0].customer_type == "by_items"
            ) {
              for (
                let i = 0;
                i <
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length;
                i++
              ) {
                // getOrder.orderData.details.itemsSold = [
                //   ...getOrder.orderData.details.immediate_sale
                //     .multiple_payments_type[i].product_List,
                // ];
                // // let price;
                // let tax = 0;
                // let price = 0;
                // getOrder.orderData.details.itemsSold.map((i) => {
                //   price = price + i.price;
                //   tax = Number(tax) + Number((price / 100) * i.productTaxes);
                // });

                // getOrder.orderData.details.priceSummery = {
                //   total: price + tax,
                //   totalTaxes: tax,
                // };

                if (registerData.print_receipts) {
                  let connnectName = setupList.find(
                    (val) => val.printer_type == "receipt_print"
                  );

                  let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
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
                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      ReceiptNumber={orderData.ReceiptNumber}
                    />
                  );
                  window.frames["print_frame"].window.focus();
                  //  window.frames["print_frame"].window.print();
                }
              }
            } else {
              for (
                let i = 0;
                i <
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length;
                i++
              ) {
                let price =
                  getOrder?.orderData?.details?.immediate_sale
                    .multiple_payments_type[i]?.value;
                if (registerData.print_receipts) {
                  let connnectName = setupList.find(
                    (val) => val.printer_type == "receipt_print"
                  );

                  let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      price={price}
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

                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      onlineOrder={
                        localCartInfo?.onlineOrder
                          ? {
                              source: localCartInfo?.onlineOrder?.Source
                                ? localCartInfo?.onlineOrder?.Source
                                : "",
                              orderId: localCartInfo?.onlineOrder?.order_id
                                ? localCartInfo?.onlineOrder?.order_id
                                : "",
                            }
                          : undefined
                      }
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                      partnerData={
                        getOrder.orderData.details.immediate_sale
                          .multiple_payments_type[i]
                      }
                      price={price}
                      ReceiptNumber={orderData.ReceiptNumber}
                    />
                  );
                  console.log("orderData789979879", orderData);
                  window.frames["print_frame"].window.focus();
                  //  window.frames["print_frame"].window.print();
                }
              }
            }
          } else {
            if (registerData.print_receipts) {
              let connnectName = setupList.find(
                (val) => val.printer_type == "receipt_print"
              );

              let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
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
              window.frames[
                "print_frame"
              ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
                  ReceiptNumber={orderData.ReceiptNumber}
                />
              );
              window.frames["print_frame"].window.focus();
              //  window.frames["print_frame"].window.print();
            }
          }
        }
      }
    }

    return numberofdiffrentPrint;
  };

  const checkOutOrder = async (value, val) => {
    console.log(
      "🚀 ~ file: ChargeDetails.js:1889 ~ checkOutOrder ~ checkOutOrder:"
    );

    !printFirst && emptyCart();
    console.log(
      "🚀 ~ file: ChargeDetails.js:1892 ~ checkOutOrder ~ printFirst:",
      printFirst
    );

    if (
      getItem("orderTicketButton") != null &&
      getItem("orderTicketButton") == true
    ) {
      let newList = onSubmit();
      let TotalOrdertiketsDetailslist = [];
      if (localCartInfo.orderTicketsData) {
        TotalOrdertiketsDetailslist = localCartInfo.orderTicketsData.concat(
          newList
        );
      } else {
        TotalOrdertiketsDetailslist = newList;
      }

      value.totalOrderTiketsList = TotalOrdertiketsDetailslist;
    }
    console.log("🚀 ~ file: ChargeDetails.js:1909 ~ checkOutOrder ~ value:");
    if (
      getItem("create_receipt_while_fullfilling_booking") &&
      paymentMethod == "booking" &&
      (localCartInfo?.bookingDetails == false ||
        localCartInfo?.bookingDetails == null)
    ) {
      let orderData = createOrderdetails(value, val, "fullFillBooking");
      createFullFillBooking(orderData);
    } else {
      if (localCartInfo?.bookingDetails && localCartInfo?.bookingDetails._id) {
        let orderData = createOrderdetails(value, val);
        orderData.details.bookingDetails =
          localCartInfo?.bookingDetails?.details.bookingDetails;
        if (
          orderData?.details?.bookingDetails?.booking_advance_payment_type
            ?.length
        ) {
          orderData.details.bookingDetails.booking_advance_payment_type.push({
            name: bookingAdvancePaymnetType,
            paymentDate: new Date(),
            value: totalPrice,
          });
        }
        if (
          getItem("orderTicketButton") &&
          printFirstReceiptNumber == undefined
        ) {
          orderData.ReceiptNumber = getReceiptNumber(registerData, []);
        }
        orderData.draftList = false;
        orderData.receiptCreate = true;

        if (printFirst) {
          if (registerData.print_receipts) {
            let connnectName = setupList.find(
              (val) => val.printer_type == "receipt_print"
            );

            let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
              <ReceiptPrint
                onlineOrder={
                  localCartInfo?.onlineOrder
                    ? {
                        source: localCartInfo?.onlineOrder?.Source
                          ? localCartInfo?.onlineOrder?.Source
                          : "",
                        orderId: localCartInfo?.onlineOrder?.order_id
                          ? localCartInfo?.onlineOrder?.order_id
                          : "",
                      }
                    : undefined
                }
                receiptsDetails={orderData}
                shopDetails={shopDetails}
                registerData={registerData}
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

            window.frames[
              "print_frame"
            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
              <ReceiptPrint
                onlineOrder={
                  localCartInfo?.onlineOrder
                    ? {
                        source: localCartInfo?.onlineOrder?.Source
                          ? localCartInfo?.onlineOrder?.Source
                          : "",
                        orderId: localCartInfo?.onlineOrder?.order_id
                          ? localCartInfo?.onlineOrder?.order_id
                          : "",
                      }
                    : undefined
                }
                receiptsDetails={orderData}
                shopDetails={shopDetails}
                registerData={registerData}
                ReceiptNumber={orderData.ReceiptNumber}
              />
            );
            window.frames["print_frame"].window.focus();
            //  window.frames["print_frame"].window.print();
          }
          setPrintFirst(false);
          setdisabledImmedateAndBooking(true);
          setBookingSubmitButtonText("Fullfill, Pending");
          setPrintReceiptNumber(orderData.ReceiptNumber);
          const { default_cart_object, allLocalData } = tableStatusChange(
            localCartInfo?.cartKey,
            "Unpaid",
            orderData.ReceiptNumber,
            undefined,
            localCartInfo.Status == "Unpaid" && localCartInfo.bingageDetails
              ? true
              : false
          );
          getItem("waiter_app_enable") &&
            socket?.emit("send_local_table_data", allLocalData);
        } else {
          const getOrder = await dispatch(
            AddAndUpdateBooking(orderData, localCartInfo?.bookingDetails._id)
          );
          let printFirst =
            getItem("print_receipt_first") == null
              ? false
              : getItem("print_receipt_first");

          let printSettlement =
            getItem("print_settlement_paymnet") == null
              ? false
              : getItem("print_settlement_paymnet");
          if (getOrder) {
            if (printFirst == false && registerData.print_receipts) {
              let connnectName = setupList.find(
                (val) => val.printer_type == "receipt_print"
              );

              let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
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
              window.frames[
                "print_frame"
              ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
                  ReceiptNumber={orderData.ReceiptNumber}
                />
              );
              window.frames["print_frame"].window.focus();
              //  window.frames["print_frame"].window.print();
            } else if (
              printFirst &&
              printSettlement &&
              registerData.print_receipts
            ) {
              let connnectName = setupList.find(
                (val) => val.printer_type == "receipt_print"
              );

              let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
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
              window.frames[
                "print_frame"
              ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                <ReceiptPrint
                  onlineOrder={
                    localCartInfo?.onlineOrder
                      ? {
                          source: localCartInfo?.onlineOrder?.Source
                            ? localCartInfo?.onlineOrder?.Source
                            : "",
                          orderId: localCartInfo?.onlineOrder?.order_id
                            ? localCartInfo?.onlineOrder?.order_id
                            : "",
                        }
                      : undefined
                  }
                  receiptsDetails={getOrder.orderData}
                  shopDetails={shopDetails}
                  registerData={registerData}
                  ReceiptNumber={orderData.ReceiptNumber}
                />
              );
              window.frames["print_frame"].window.focus();
            }
          }
        }
      } else {
        let orderData = createOrderdetails(value, val);
        console.log(
          "🚀 ~ file: ChargeDetails.js:2181 ~ checkOutOrder ~ orderData:",
          orderData
        );

        if (orderData) {
          if (
            Number(bookingAdvance) == Number(totalPrice) &&
            paymentMethod == "booking"
          ) {
            orderData.details.fulfillmentStatus = "Unfulfilled";
            orderData.details.paymentStatus = "paid";
          } else if (paymentMethod == "booking") {
            orderData.details.bookingDetails.pending_payments =
              Number(totalPrice) -
              Number(isNaN(bookingAdvance) ? 0 : bookingAdvance);
            orderData.details.paymentStatus = "unpaid";
            orderData.details.fulfillmentStatus = "Unfulfilled";
          }
          if (localCartInfo && localCartInfo.onlineOrder) {
            let zomatoUrl = registerData.onlineOrder.find(
              (val) => val.orderType == "zomato"
            );
            if (zomatoUrl) {
              const response1 = await dispatch(
                getZometoDetail(
                  zomatoUrl.url,
                  localCartInfo.onlineOrder.order_id
                )
              );
              if (response1 && response1.supportingRiderDetails[0]) {
                localCartInfo.onlineOrder.deliveryBoyInfo =
                  response1.supportingRiderDetails[0];
              }
            }
            orderData.details.onlineOrder = localCartInfo.onlineOrder;
          }

          console.log(
            "🚀 ~ file: ChargeDetails.js:2216 ~ checkOutOrder ~ orderData:"
          );

          await immedatePaymnetOrderCreate(orderData);
        } else {
          alert("notOrderData");
        }
      }
    }
    sendPrintReq(numberofdiffrentPrint);
  };

  //completeButton
  const CompleteButtonFunction = () => {
    if (localCartInfo?.bookingDetails) {
      setModelVisibleColse(true);
    } else {
      //  emptyCart();
    }
  };

  //BookingUpdate
  const BookingUpdate = () => {
    emptyCart();
    form.validateFields().then(async (value) => {
      if (
        getItem("orderTicketButton") != null &&
        getItem("orderTicketButton") == true
      ) {
        let newList = onSubmit();
        let TotalOrdertiketsDetailslist = [];
        if (localCartInfo.orderTicketsData) {
          TotalOrdertiketsDetailslist = localCartInfo.orderTicketsData.concat(
            newList
          );
        } else {
          TotalOrdertiketsDetailslist = newList;
        }

        value.totalOrderTiketsList = TotalOrdertiketsDetailslist;
      }
      let orderData = createOrderdetails(value, "", "allredybookingNumber");
      orderData.details.paymentStatus = "unpaid";
      orderData.details.bookingDetails.booking_number =
        localCartInfo.bookingDetails?.details.bookingDetails.booking_number;
      let bookingId = localCartInfo?.bookingDetails._id;
      localCartInfo.orderTicketsData = orderData.details.orderTicketsData;

      orderData.details.localCartInfo = localCartInfo;
      const bookingData = await dispatch(
        AddAndUpdateBooking(orderData, bookingId)
      );
    });
  };

  const DiscardChanges = () => {
    emptyCart();
  };

  function disabledDate(current) {
    return current && current < moment().subtract(1, "days");
  }

  //spilt work

  let [pyamnetTypeArrayList, setPaymnetTypeArrayList] = useState([
    {
      name: "Cash",
      value: 0,
    },
    { name: "Credit / Debit Card", value: 0 },
    ...orderCartData.PaymentTypeList,
    { name: "Other", value: 0 },
    { name: "Credit Sales (Pending)", value: 0 },
  ]);
  const [splitPaymnetsIs, setSplitPaymnetsIs] = useState(false);
  const [splitUpdateButoonDisbled, setSplitUpdateButtonDisbled] = useState(
    true
  );

  const [excess, setExcess] = useState(0);
  const [pending, setPending] = useState(totalPrice);

  const [filterSplitArray, setFilterSplitArray] = useState([]);
  const [filterBookingSplitArray, setFilterbookingSplitArray] = useState([]);

  useEffect(() => {
    let paymnetType;
    if (PaymentType == "cash") {
      paymnetType = "Cash";
    } else if (PaymentType == "card") {
      paymnetType = "Credit / Debit Card";
    } else if (PaymentType == "other") {
      paymnetType = "Other";
    } else if (PaymentType == "pending") {
      paymnetType = "Credit Sales (Pending)";
    } else {
      paymnetType = PaymentType;
    }
    pyamnetTypeArrayList.map((data) => {
      if (data.name == paymnetType) {
        data.value = totalPrice;
      } else {
        data.value = 0;
      }
    });
    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
      return acc + Number(obj.value);
    }, 0);

    if (sum == totalPrice) {
      setSplitUpdateButtonDisbled(false);
    }
    if (PaymentType == "pending" && paymentMethod == "immediate") {
      setimmediateSubmitButtonText("Pending Payment");
      setPaymentStatus("unpaid");
      setPendingPayments(totalPrice);
    } else if (
      paymentMethod == "immediate" &&
      printFirst != null &&
      printFirst == false
    ) {
      setimmediateSubmitButtonText(
        localCartInfo?.hasOwnProperty("onlineOrder")
          ? "Ready & Complete"
          : "Received"
      );
      setPaymentStatus("paid");
      setPendingPayments(0);
    }
  }, [PaymentType]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const SubmitSplitPaymentType = () => {
    let filterSplitArray = pyamnetTypeArrayList.filter((item) => {
      if (
        item.name == "Credit Sales (Pending)" &&
        item.value > 0 &&
        item.value != ""
      ) {
        setPaymentStatus("unpaid");
        setPendingPayments(item.value);
        setimmediateSubmitButtonText(
          `Received ${rsSymbol}${totalPrice - item.value} of`
        );
      } else {
        setPendingPayments(0);
        setimmediateSubmitButtonText("Received");
        setPaymentStatus("paid");
      }

      return item.value > 0 && item.value != "";
    });

    setFilterSplitArray(filterSplitArray);
    setModelSpiltVisible(false);
  };

  const SubmitSplitBookingAdvancePaymentType = (pyamnetTypeArray) => {
    let filterSplitArray = pyamnetTypeArray.filter((item) => {
      return item.value > 0 && item.value != "";
    });
    setFilterbookingSplitArray(filterSplitArray);
    setPaymentStatus("unpaid");
    splitBookingAdvance.current.hideModal();
  };

  const handleCancel = (e) => {
    setModelSpiltVisible(false);
    setFilterSplitArray([]);
    setimmediateSubmitButtonText("Received");
  };

  let arr56 = [];

  let activeTabPayment_type = [
    <Button onClick={() => handleCancel()}>Cancel</Button>,
    <Button
      type="primary"
      onClick={() => SubmitSplitPaymentType()}
      disabled={splitUpdateButoonDisbled}
    >
      Update
    </Button>,
  ];

  let otherDetails = { ...localCartInfo?.otherDetails };
  otherDetails.customer = {
    mobile: Number(customerMobialNumber),
    email: customerEmail,
    name: customerName,
    shipping_address: shippingAddress,
    zipcode: zipCode,
    city: city,
  };
  otherDetails.details = {
    saleType: paymentMethod,
    paymentStatus: paymentstatus,
    order_tickets_notes: orderTicketsNotes,
    occupants: occupantsSeat,
    priceSummery: {
      total: orderCartData.totalPrice,
      totalTaxes: orderCartData.totalTaxes,
      sub_total: orderCartData.sub_total,
    },
  };

  if (paymentMethod === "immediate") {
    otherDetails.details.immediate_sale = {
      cash_tender: cashTender,
      balance_to_customer: balanceToCustomer,
      card_Details: cardDetails,
      payment_notes: paymentNotes,
    };

    filterSplitArray.length > 1
      ? splitCustomerEqually
        ? (otherDetails.details.immediate_sale.multiple_payments_type = numberOfSplitCustomer)
        : (otherDetails.details.immediate_sale.multiple_payments_type = filterSplitArray)
      : (otherDetails.details.immediate_sale.multiple_payments_type = [
          { name: PaymentType, value: totalPrice, paymentDate: new Date() },
        ]);
    pendingPaymnets > 0 &&
      (otherDetails.details.immediate_sale.pending_payments = pendingPaymnets);
  } else {
    otherDetails.details.bookingDetails = {
      delivery_date: DateString,
      delivery_time: DeliveryTime,
      is_door_delivery: DeliveryDoor,
      booking_notes: bookingNotes,
      booking_advance: bookingAdvance == "" ? 0 : bookingAdvance,
      booking_advance_payment_card_details: cardDetails,
    };
    filterBookingSplitArray.length > 1
      ? (otherDetails.details.bookingDetails.booking_advance_payment_type = filterBookingSplitArray)
      : (otherDetails.details.bookingDetails.booking_advance_payment_type = [
          {
            name: bookingAdvancePaymnetType,
            value: bookingAdvance,
            bookingDate: new Date(),
          },
        ]);
  }

  var arr = [];
  if (selectedTags.length > 0) {
    TagList.map((field) => {
      if (selectedTags.indexOf(field.name) > -1) {
        arr.push(field);
      }
    });
  }

  otherDetails.details.custom_fields = arr;
  let checkValueIsOrNot = AddtionalList.find((val) => {
    if (val.value) {
      return true;
    }
  });
  if (checkValueIsOrNot != undefined) {
    otherDetails.details.customer_custom_fields = AddtionalList;
  }
  otherDetails.saleType = paymentMethod;
  otherDetails.chargeClick = checkClick;

  if (localCartInfo) {
    storeOtherData(localCartInfo.cartKey, otherDetails);
  }

  //OrderTikets related
  let PreviousTikets = [];
  if (
    localCartInfo &&
    getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData) &&
    getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData)
      ?.orderTicketsData
  ) {
    OrderTicketsData = getCartInfoFromLocalKey(
      localCartInfo?.cartKey,
      registerData
    ).orderTicketsData.reverse();

    OrderTicketsData.map((val) => {
      PreviousTikets.push(val.tiketNumber);
    });
  }

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

  const handleKeyDown = (event) => {
    // if (event.keyCode == 113) {
    //   formref.current.submit();
    // }
  };

  return (
    <div
      style={{ background: "#fff", padding: "25px" }}
      onClick={() => {
        if (change) {
          onclickFun();
          setNotChange(false);
        }
      }}
    >
      <p style={{ display: "none" }}>
        {printFirstReceiptNumber ? printFirstReceiptNumber : "false"}
      </p>

      <Form
        form={form}
        onFinish={checkOutOrder}
        onKeyDown={handleKeyDown}
        ref={formref}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xxl={12} md={12} sm={24} xs={24}>
            <Form.Item>
              <Radio.Group
                style={{ marginBottom: 6 }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio
                  value="immediate"
                  disabled={
                    localCartInfo?.bookingDetails || disabledImmedateAndBooking
                      ? true
                      : false
                  }
                >
                  Immediate Sale
                </Radio>
                <Radio
                  value="booking"
                  disabled={
                    disabledImmedateAndBooking
                      ? true
                      : localCartInfo &&
                        localCartInfo.receipt_Number &&
                        localCartInfo.type != "booking_cart"
                      ? true
                      : false
                  }
                >
                  Booking
                </Radio>
              </Radio.Group>{" "}
            </Form.Item>
            {/* <button onClick={() => printHanlde()}>ONPRINT</button> */}
            {getItem("orderTicketButton") &&
            listOfUpdatedproducts.length != 0 ? (
              <Form.Item label="Order Ticket Notes" name="order_tickets_notes">
                <TextArea
                  rows={1}
                  style={{ marginBottom: 6 }}
                  placeholder="Order ticket notes (optional)"
                  value={orderTicketsNotes}
                  onChange={(e) => setOrderTicketNotes(e.target.value)}
                />
              </Form.Item>
            ) : null}
            {paymentMethod === "booking" ? (
              <div>
                <Row>
                  <Col xxl={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Delivery Date & Time">
                      <DatePicker
                        className="book_picker"
                        defaultValue={moment(DateString, "LL")}
                        size="large"
                        disabledDate={disabledDate}
                        onChange={(date, string) => {
                          setDateString(string);
                        }}
                        format="LL"
                      />
                    </Form.Item>
                  </Col>{" "}
                  <Col xxl={12} md={12} sm={24} xs={24}>
                    <Form.Item label={`${DateString},${DeliveryTime}`}>
                      <TimePicker
                        className="book_picker"
                        use12Hours
                        format="h:mm A"
                        DeliveryTime
                        defaultValue={moment(DeliveryTime, "h:mm A")}
                        size="large"
                        onChange={(time, timeString) =>
                          setDeliveryTime(timeString)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="is_door">
                  <Checkbox
                    checked={DeliveryDoor}
                    onChange={(e) => setDeliveryDoor(e.target.checked)}
                    className="is_debvs"
                  >
                    Is Door Delivery?
                  </Checkbox>
                </Form.Item>

                <Form.Item label="Booking Notes" name="booking_notes">
                  <p style={{ display: "none" }}>{bookingNotes}</p>
                  <TextArea
                    rows={1}
                    placeholder=" Type instructions or notes here (optional)"
                    onChange={(e) => setBookingNotes(e.target.value)}
                    value={bookingNotes}
                  >
                    {" "}
                  </TextArea>
                </Form.Item>

                <Form.Item
                  label="Booking Advance"
                  name="booking_advance"
                  initialValue={isNaN(bookingAdvance) ? 0 : bookingAdvance}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (Number(value) > orderCartData.totalPrice) {
                          return Promise.reject(
                            "Booking amount cannot be more than the total."
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9,.]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                    value={isNaN(bookingAdvance) ? 0 : bookingAdvance}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setBookingAdvance(false);
                        setBookingSubmitButtonText(
                          `Received ${rsSymbol}${0} of `
                        );
                      } else {
                        if (printFirst) {
                          setBookingSubmitButtonText(
                            `Print receipt for ${rsSymbol}${e.target.value}/`
                          );
                        } else {
                          setBookingSubmitButtonText(
                            `Received ${rsSymbol}${e.target.value} of `
                          );
                        }

                        setBookingAdvance(e.target.value);
                      }
                    }}
                    placeholder="Booking advance payment (optional)"
                    disabled={localCartInfo?.bookingDetails ? true : false}
                  />
                </Form.Item>

                {bookingAdvance > 0 &&
                (localCartInfo?.bookingDetails == false ||
                  localCartInfo?.bookingDetails == null) &&
                printFirst != true ? (
                  <div>
                    {filterBookingSplitArray.length > 1 ? (
                      <Form.Item name="filterSplit" label="Payment Type">
                        <Radio.Group className="tick-radio">
                          {filterBookingSplitArray.map((item) => {
                            return (
                              <Radio.Button
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <svg
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                  viewBox="0 0 123 102"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                    fill="#BE3D5D"
                                  />
                                </svg>
                                {item.name} -{item.value}
                              </Radio.Button>
                            );
                          })}

                          <Button
                            onClick={() =>
                              splitBookingAdvance.current.showModal()
                            }
                            className="splits-button"
                          >
                            Spilt
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <Form.Item name="Payment Type" label="Payment Type">
                        <Radio.Group
                          onChange={(e) =>
                            setBookingAdvancePaymnetType(e.target.value)
                          }
                          value={PaymentType}
                          className="tick-radio"
                        >
                          <Radio.Button
                            value="cash"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {bookingAdvancePaymnetType === "cash" ? (
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                            ) : (
                              ""
                            )}
                            Cash
                          </Radio.Button>
                          <Radio.Button
                            value="card"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {bookingAdvancePaymnetType === "card" ? (
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                            ) : (
                              ""
                            )}{" "}
                            Credit / Debit Card
                          </Radio.Button>
                          {orderCartData.PaymentTypeList.map((val, index) => {
                            return (
                              <Radio.Button
                                value={val.name}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {bookingAdvancePaymnetType === val.name ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}
                                {val.name}
                              </Radio.Button>
                            );
                          })}
                          <Radio.Button
                            value="other"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {bookingAdvancePaymnetType === "other" ? (
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                            ) : (
                              ""
                            )}
                            Other
                          </Radio.Button>

                          <Button
                            onClick={() => {
                              splitBookingAdvance.current.showModal();
                            }}
                            className="splits-button"
                          >
                            Spilt
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    )}

                    <SplitBookingAdvance
                      ref={splitBookingAdvance}
                      paymnetsList={orderCartData.PaymentTypeList}
                      bookingAdvance={bookingAdvance}
                      bookingAdvancePaymnetType={bookingAdvancePaymnetType}
                      SubmitSplitBookingAdvancePaymentType={
                        SubmitSplitBookingAdvancePaymentType
                      }
                    />

                    {bookingAdvancePaymnetType === "card" ? (
                      <>
                        <Form.Item label="Card Details " name="card_details">
                          <Input
                            placeholder="Card details (optional)"
                            onChange={(e) => setCardDetails(e.target.value)}
                            value={cardDetails}
                          ></Input>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}

                    {bookingAdvancePaymnetType === "other" ||
                    PaymentType ===
                      orderCartData.PaymentTypeList.find(
                        (data) => data.name === PaymentType
                      )?.name ? (
                      <>
                        <Form.Item label="Payment Notes" name="payment_notes">
                          <TextArea
                            rows={1}
                            placeholder="Notes (optional)"
                            onChange={(e) => setPaymnetsNotes(e.target.value)}
                            value={paymentNotes}
                          ></TextArea>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <>
                    {localCartInfo?.bookingDetails && printFirst != true && (
                      <div>
                        {localCartInfo?.bookingDetails.details.bookingDetails
                          .booking_advance > 0 &&
                          localCartInfo?.bookingDetails.details?.bookingDetails
                            ?.booking_advance_payment_type && (
                            <Form.Item label="Advance Payment Details">
                              <span>
                                {localCartInfo?.bookingdetails?.details?.bookingDetails?.booking_advance_payment_type?.map(
                                  (val) => {
                                    return (
                                      <>
                                        <span className="advance-payment">
                                          <svg
                                            width="13px"
                                            style={{ marginRight: "2px" }}
                                            viewBox="0 0 123 102"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                              fill="#BE3D5D"
                                            />
                                          </svg>
                                          &nbsp; {val.name}-{val.value}
                                        </span>
                                      </>
                                    );
                                  }
                                )}
                              </span>
                            </Form.Item>
                          )}

                        <Form.Item
                          name="Payment Type"
                          label="Payment Type"
                          rules={[
                            {
                              required: modelVisibleColse ? false : true,
                              message: "Choose a payment type to proceed",
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={(e) =>
                              setBookingAdvancePaymnetType(e.target.value)
                            }
                            value={bookingAdvancePaymnetType}
                            className="tick-radio"
                          >
                            <Radio.Button
                              value="cash"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {bookingAdvancePaymnetType === "cash" ? (
                                <svg
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                  viewBox="0 0 123 102"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                    fill="#BE3D5D"
                                  />
                                </svg>
                              ) : (
                                ""
                              )}
                              Cash
                            </Radio.Button>
                            <Radio.Button
                              value="card"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {bookingAdvancePaymnetType === "card" ? (
                                <svg
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                  viewBox="0 0 123 102"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                    fill="#BE3D5D"
                                  />
                                </svg>
                              ) : (
                                ""
                              )}{" "}
                              Credit / Debit Card
                            </Radio.Button>
                            {orderCartData.PaymentTypeList.map((val, index) => {
                              return (
                                <Radio.Button
                                  value={val.name}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {bookingAdvancePaymnetType === val.name ? (
                                    <svg
                                      width="13px"
                                      style={{ marginRight: "2px" }}
                                      viewBox="0 0 123 102"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                        fill="#BE3D5D"
                                      />
                                    </svg>
                                  ) : (
                                    ""
                                  )}
                                  {val.name}
                                </Radio.Button>
                              );
                            })}
                            <Radio.Button
                              value="other"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {bookingAdvancePaymnetType === "other" ? (
                                <svg
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                  viewBox="0 0 123 102"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                    fill="#BE3D5D"
                                  />
                                </svg>
                              ) : (
                                ""
                              )}
                              Other
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                {filterSplitArray.length > 1 ? (
                  <Form.Item name="filterSplit" label="Payment Type">
                    <Radio.Group className="tick-radio">
                      {filterSplitArray.map((item) => {
                        return (
                          <Radio.Button
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <svg
                              width="13px"
                              style={{ marginRight: "2px" }}
                              viewBox="0 0 123 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                fill="#BE3D5D"
                              />
                            </svg>
                            {item.name} -{item.value}
                          </Radio.Button>
                        );
                      })}

                      <Button
                        onClick={() => setModelSpiltVisible(true)}
                        className="splits-button"
                      >
                        Spilt
                      </Button>
                    </Radio.Group>
                  </Form.Item>
                ) : (
                  <div>
                    {printFirst != null && printFirst == true ? null : (
                      <>
                        {localCartInfo?.hasOwnProperty("onlineOrder") ? (
                          <>
                            <b>Payments -Paid</b>
                            <p>
                              {rsSymbol}
                              {totalPrice} on{" "}
                              {localCartInfo?.onlineOrder?.Source}{" "}
                            </p>
                          </>
                        ) : (
                          <Form.Item
                            name="Payment Type"
                            label="Payment Type"
                            rules={[
                              {
                                required: true,
                                message: "Choose a payment type to proceed",
                              },
                            ]}
                          >
                            <Radio.Group
                              onChange={(e) => setPaymentType(e.target.value)}
                              value={PaymentType}
                              className="tick-radio"
                            >
                              <Radio.Button
                                value="cash"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "cash" ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}
                                Cash
                              </Radio.Button>
                              <Radio.Button
                                value="card"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "card" ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}{" "}
                                Credit / Debit Card
                              </Radio.Button>
                              {orderCartData.PaymentTypeList.map(
                                (val, index) => {
                                  return (
                                    <Radio.Button
                                      value={val.name}
                                      style={{
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {PaymentType === val.name ? (
                                        <svg
                                          width="13px"
                                          style={{ marginRight: "2px" }}
                                          viewBox="0 0 123 102"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                            fill="#BE3D5D"
                                          />
                                        </svg>
                                      ) : (
                                        ""
                                      )}
                                      {val.name}
                                    </Radio.Button>
                                  );
                                }
                              )}
                              <Radio.Button
                                value="other"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "other" ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}
                                Other
                              </Radio.Button>
                              <Radio.Button
                                value="pending"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "pending" ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}
                                Credit Sales (Pending)
                              </Radio.Button>

                              <Button
                                onClick={() => setModelSpiltVisible(true)}
                                className="splits-button"
                              >
                                Split
                              </Button>
                            </Radio.Group>
                          </Form.Item>
                        )}
                      </>
                    )}
                  </div>
                )}

                <Modal
                  title="Split Payments / Bill"
                  okText="Spilt"
                  visible={modalSpiltVisible}
                  closable={activeSplitTab == "payment_type" ? true : false}
                  closeIcon={
                    <CloseOutlined
                      onClick={() => setModelSpiltVisible(false)}
                    />
                  }
                  footer={
                    activeSplitTab == "payment_type"
                      ? activeTabPayment_type
                      : splitCustomerNextButtonCliked
                      ? splitCustomerType == "by_items"
                        ? [
                            <div>
                              <Button
                                onClick={() =>
                                  setSplitCustomerNextButtonCliked(false)
                                }
                              >
                                Go Back
                              </Button>
                              <Button
                                type="primary"
                                disabled={
                                  numberOfSplitCustomer.find((val) => {
                                    if (
                                      val.product_List.length == 0 ||
                                      avialableItems.length != 0
                                    ) {
                                      return true;
                                    }
                                  }) != undefined
                                }
                                onClick={() => {
                                  numberOfSplitCustomer.map((val) => {
                                    val.value = val.product_List.reduce(
                                      function(acc, obj) {
                                        return (
                                          acc + Number(obj.calculatedprice)
                                        );
                                      },
                                      0
                                    );
                                  });
                                  setNumberOfSplitCustomer([
                                    ...numberOfSplitCustomer,
                                  ]);
                                  setSplitCustomerNext2ButtonCliked(true);
                                  setSplitCustomerNextButtonCliked(false);
                                }}
                              >
                                Next
                              </Button>
                              {numberOfSplitCustomer.find((val) => {
                                if (
                                  val.product_List.length == 0 ||
                                  avialableItems.length != 0
                                ) {
                                  return true;
                                }
                              }) != undefined && (
                                <>
                                  <br></br>
                                  <small>
                                    All available items must be assigned to
                                    customers.
                                  </small>
                                </>
                              )}
                            </div>,
                          ]
                        : [
                            <Button
                              onClick={() =>
                                setSplitCustomerNextButtonCliked(false)
                              }
                            >
                              Go Back
                            </Button>,

                            <Button
                              type="primary"
                              disabled={
                                numberOfSplitCustomer.find((val) => {
                                  val.payment_type_list.map((item) => {
                                    if (item.tick == true) {
                                      arr56.push(item);
                                    }
                                  });
                                  if (
                                    arr56.length == numberOfSplitCustomer.length
                                  ) {
                                    return true;
                                  } else {
                                    return false;
                                  }
                                }) != undefined
                                  ? false
                                  : true
                              }
                              onClick={() => {
                                let ArrSplitFilter = [];
                                numberOfSplitCustomer.map((val) => {
                                  val.payment_type_list.map((data) => {
                                    if (data.tick == true) {
                                      ArrSplitFilter.push({
                                        name: data.name,
                                        value: Number(val.value).toFixed(2),
                                      });
                                    }
                                  });
                                });
                                setFilterSplitArray(ArrSplitFilter);
                                setModelSpiltVisible(false);
                                setSplitCustomerEqually(true);
                                setSplitCustomerNextButtonCliked(false);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Update
                            </Button>,
                          ]
                      : splitCustomerNext2ButtonCliked == true &&
                        splitCustomerNextButtonCliked == false
                      ? [
                          <Button
                            onClick={() => {
                              setSplitCustomerNext2ButtonCliked(false);
                              setSplitCustomerNextButtonCliked(true);
                            }}
                          >
                            Go Back
                          </Button>,
                          <Button
                            type="primary"
                            disabled={
                              numberOfSplitCustomer.find((val) => {
                                val.payment_type_list.map((item) => {
                                  if (item.tick == true) {
                                    arr56.push(item);
                                  }
                                });
                                if (
                                  arr56.length == numberOfSplitCustomer.length
                                ) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }) != undefined
                                ? false
                                : true
                            }
                            onClick={() => {
                              let ArrSplitFilter = [];
                              numberOfSplitCustomer.map((val) => {
                                val.payment_type_list.map((data) => {
                                  if (data.tick == true) {
                                    ArrSplitFilter.push({
                                      name: data.name,
                                      value: Number(val.value).toFixed(2),
                                    });
                                  }
                                });
                              });
                              setFilterSplitArray(ArrSplitFilter);
                              setModelSpiltVisible(false);
                              setSplitCustomerEqually(true);
                              setSplitCustomerNextButtonCliked(false);
                              setSplitCustomerNext2ButtonCliked(false);
                            }}
                          >
                            Update
                          </Button>,
                        ]
                      : [
                          <div>
                            <Button
                              onClick={() => {
                                handleCancel();
                                setSplitCustomerEqually(false);
                                setFilterSplitArray([]);
                                setSplitCustomerNo();
                                setActiveSplitTab("payment_type");
                                setNumberOfSplitCustomer([]);
                                setSplitCustomerType("equally");
                                setSplitCustomerNextButtonCliked(false);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Clear Splits
                            </Button>

                            <Button
                              type="primary"
                              disabled={
                                numberOfSplitCustomer.length <= 1 ? true : false
                              }
                              onClick={() => {
                                numberOfSplitCustomer.map(
                                  (val) =>
                                    (val.value = totalPrice / splitCustomerNo)
                                );
                                setSplitCustomerNextButtonCliked(true);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Next
                            </Button>

                            {numberOfSplitCustomer.length <= 1 ? (
                              <>
                                {" "}
                                <br></br>
                                <small></small>
                              </>
                            ) : (
                              false
                            )}
                          </div>,
                        ]
                  }
                  width={600}
                >
                  <Tabs activeKey={activeSplitTab} onChange={setActiveSplitTab}>
                    <TabPane tab="By Payment Type" key="payment_type">
                      {splitUpdateButoonDisbled && (
                        <small style={{ paddingBottom: "10px" }}>
                          {pending > 0 && excess == 0 && (
                            <span className="span-center">
                              {rsSymbol}
                              {pending} pending
                            </span>
                          )}
                          {excess > 0 && pending == 0 && (
                            <span className="span-center">
                              {rsSymbol}
                              {excess} excess
                            </span>
                          )}
                        </small>
                      )}

                      <Form
                        style={{ width: "100%" }}
                        name="export"
                        form={spiltForm}
                        labelCol={{ span: 10 }}
                      >
                        {pyamnetTypeArrayList.map((val, index) => {
                          return (
                            <Form.Item label={val.name} name={val.name}>
                              <div style={{ display: "none" }}>{val.value}</div>
                              <Input
                                placeholder="0"
                                type="number"
                                value={val.value}
                                style={{ marginBottom: 6 }}
                                a-key={index}
                                onChange={(e) => {
                                  pyamnetTypeArrayList[
                                    e.target.getAttribute("a-key")
                                  ] = {
                                    name: val.name,
                                    value: e.target.value,
                                  };
                                  setPaymnetTypeArrayList([
                                    ...pyamnetTypeArrayList,
                                  ]);
                                  var sum = pyamnetTypeArrayList.reduce(
                                    function(acc, obj) {
                                      return acc + Number(obj.value);
                                    },
                                    0
                                  );

                                  if (sum == totalPrice) {
                                    setSplitUpdateButtonDisbled(false);
                                    setPending(0);
                                    setExcess(0);
                                  } else if (sum > totalPrice) {
                                    setSplitUpdateButtonDisbled(true);
                                    setPending(0);
                                    setExcess(sum - totalPrice);
                                  } else if (totalPrice > sum) {
                                    setSplitUpdateButtonDisbled(true);
                                    setExcess(0);
                                    setPending(totalPrice - sum);
                                  } else {
                                    setSplitUpdateButtonDisbled(true);
                                  }
                                }}
                              />
                            </Form.Item>
                          );
                        })}
                      </Form>
                    </TabPane>

                    <TabPane tab="Between Customers" key="multiple_customer">
                      {splitCustomerNext2ButtonCliked == false &&
                      splitCustomerNextButtonCliked == true ? (
                        splitCustomerType == "by_items" ? (
                          <div>
                            <Radio.Group
                              style={{ marginBottom: "25px" }}
                              value={splitByItemsCurrentCustomer}
                              onChange={(e) =>
                                setSplitByItemsCurrentCustomer(e.target.value)
                              }
                            >
                              {numberOfSplitCustomer.map((val) => {
                                return (
                                  <>
                                    <Radio value={val.no}>
                                      {val.name != ""
                                        ? val.name
                                        : `Customer ${val.no}`}
                                    </Radio>
                                  </>
                                );
                              })}
                            </Radio.Group>
                            <Row xxl={24} md={24} sm={24} xs={24}>
                              <Col
                                xxl={12}
                                md={12}
                                sm={24}
                                xs={24}
                                style={{ paddingRight: "10px" }}
                              >
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>Available Items</label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div className="product-list">
                                    <p
                                      onClick={() => {
                                        if (avialableItems.length != 0) {
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List = [
                                            ...numberOfSplitCustomer[
                                              splitByItemsCurrentCustomer - 1
                                            ].product_List,
                                            ...avialableItems,
                                          ];

                                          setAvialableItems([]);

                                          setNumberOfSplitCustomer([
                                            ...numberOfSplitCustomer,
                                          ]);
                                        }
                                      }}
                                    >
                                      {">>"}
                                    </p>
                                    <ul className="ul-list">
                                      {avialableItems.map(
                                        (product, keyIndex) => {
                                          let text2 = product.display_name.toString();
                                          let newSpilitArray = text2.split(
                                            /[+]/
                                          );
                                          let newSpilitArray1 = text2.split(
                                            /[,]/
                                          );
                                          let finalArray = [];
                                          newSpilitArray.map((value) => {
                                            finalArray.push(
                                              value.replace(/,/gi, "")
                                            );
                                          });
                                          return (
                                            <>
                                              <li
                                                className="li-list"
                                                onClick={() => {
                                                  numberOfSplitCustomer[
                                                    splitByItemsCurrentCustomer -
                                                      1
                                                  ].product_List.push(product);

                                                  avialableItems.splice(
                                                    keyIndex,
                                                    1
                                                  );
                                                  setAvialableItems([
                                                    ...avialableItems,
                                                  ]);
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              >
                                                <>
                                                  {text2.includes("-") ? (
                                                    newSpilitArray1.map(
                                                      (val) => (
                                                        <div>{`${val} - ${rsSymbol}${Number(
                                                          product.calculatedprice
                                                        ).toFixed(2)}`}</div>
                                                      )
                                                    )
                                                  ) : (
                                                    <div>
                                                      {finalArray.length > 1 ? (
                                                        <div>
                                                          {finalArray.map(
                                                            (value, index) => {
                                                              return (
                                                                <div>
                                                                  {index > 0
                                                                    ? "+"
                                                                    : null}
                                                                  {value}
                                                                </div>
                                                              );
                                                            }
                                                          )}{" "}
                                                          {` - ${rsSymbol}${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)} `}
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          {`${
                                                            product.display_name
                                                          } - ${rsSymbol}${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)}`}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </>
                                              </li>
                                            </>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </Col>
                              </Col>
                              <Col
                                xxl={12}
                                md={12}
                                sm={24}
                                xs={24}
                                style={{ paddingRight: "10px" }}
                              >
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>
                                    {" "}
                                    {numberOfSplitCustomer[
                                      splitByItemsCurrentCustomer - 1
                                    ].name != ""
                                      ? numberOfSplitCustomer[
                                          splitByItemsCurrentCustomer - 1
                                        ].name
                                      : `Customer ${splitByItemsCurrentCustomer}`}{" "}
                                    - Assigned Items
                                  </label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div className="product-list">
                                    <p
                                      onClick={() => {
                                        if (
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List.length != 0
                                        ) {
                                          avialableItems = [
                                            ...avialableItems,
                                            ...numberOfSplitCustomer[
                                              splitByItemsCurrentCustomer - 1
                                            ].product_List,
                                          ];
                                          setAvialableItems([
                                            ...avialableItems,
                                          ]);
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List = [];
                                          setNumberOfSplitCustomer([
                                            ...numberOfSplitCustomer,
                                          ]);
                                        }
                                      }}
                                    >
                                      {"<<"}
                                    </p>

                                    <ul className="ul-list">
                                      {numberOfSplitCustomer[
                                        splitByItemsCurrentCustomer - 1
                                      ].product_List.map(
                                        (product, key_index) => {
                                          let text2 = product.display_name.toString();
                                          let newSpilitArray = text2.split(
                                            /[+]/
                                          );
                                          let newSpilitArray1 = text2.split(
                                            /[,]/
                                          );
                                          let finalArray = [];
                                          newSpilitArray.map((value) => {
                                            finalArray.push(
                                              value.replace(/,/gi, "")
                                            );
                                          });
                                          return (
                                            <>
                                              <li
                                                className="li-list"
                                                onClick={() => {
                                                  avialableItems.push(product);

                                                  numberOfSplitCustomer[
                                                    splitByItemsCurrentCustomer -
                                                      1
                                                  ].product_List.splice(
                                                    key_index,
                                                    1
                                                  );
                                                  setAvialableItems([
                                                    ...avialableItems,
                                                  ]);
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              >
                                                <>
                                                  {text2.includes("-") ? (
                                                    newSpilitArray1.map(
                                                      (val) => (
                                                        <div>{`${val} - ${rsSymbol}${Number(
                                                          product.calculatedprice
                                                        ).toFixed(2)}`}</div>
                                                      )
                                                    )
                                                  ) : (
                                                    <div>
                                                      {finalArray.length > 1 ? (
                                                        <div>
                                                          {finalArray.map(
                                                            (value, index) => {
                                                              return (
                                                                <div>
                                                                  {index > 0
                                                                    ? "+"
                                                                    : null}
                                                                  {value}
                                                                </div>
                                                              );
                                                            }
                                                          )}{" "}
                                                          {` - ${rsSymbol}${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)} `}
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          {`${
                                                            product.display_name
                                                          } - ${rsSymbol}${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)}`}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </>
                                              </li>
                                            </>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </Col>
                              </Col>
                            </Row>

                            {splitErr && (
                              <span style={{ color: "red" }}>
                                All available items must be assigned to
                                customers
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{ overflowY: "scroll", maxHeight: "400px" }}
                          >
                            {numberOfSplitCustomer.map((item, index1) => {
                              return (
                                <>
                                  <Form.Item
                                    name="Payment Type1"
                                    label={
                                      item.name != ""
                                        ? `Payment Type for ${
                                            item.name
                                          } - ${rsSymbol}${Number(
                                            item.value
                                          ).toFixed(2)}`
                                        : `Payment Type for Customer ${
                                            item.no
                                          } - ${rsSymbol}${Number(
                                            item.value
                                          ).toFixed(2)}`
                                    }
                                  >
                                    <div style={{ display: "none" }}>
                                      {item.product_List.length}
                                    </div>
                                    <Radio.Group
                                      className="tick-radio"
                                      onChange={(e) => {
                                        numberOfSplitCustomer.map(
                                          (val, index) => {
                                            if (index == item.no - 1) {
                                              val.payment_type_list.map(
                                                (data, key) => {
                                                  if (key == e.target.value) {
                                                    data.tick =
                                                      e.target.checked;
                                                  } else {
                                                    data.tick = false;
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        );
                                        setNumberOfSplitCustomer([
                                          ...numberOfSplitCustomer,
                                        ]);
                                      }}
                                    >
                                      {item.payment_type_list.map(
                                        (val, index) => {
                                          return (
                                            <>
                                              <Radio.Button
                                                style={{
                                                  marginRight: "10px",
                                                  marginBottom: "10px",
                                                }}
                                                value={index}
                                              >
                                                {val.tick == true && (
                                                  <svg
                                                    width="13px"
                                                    style={{
                                                      marginRight: "2px",
                                                    }}
                                                    viewBox="0 0 123 102"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                                      fill="#BE3D5D"
                                                    />
                                                  </svg>
                                                )}

                                                {val.name}
                                              </Radio.Button>
                                            </>
                                          );
                                        }
                                      )}
                                    </Radio.Group>
                                  </Form.Item>
                                </>
                              );
                            })}
                          </div>
                        )
                      ) : (
                        <>
                          {splitCustomerNext2ButtonCliked == true &&
                          splitCustomerNextButtonCliked == false ? (
                            <>
                              <div
                                style={{
                                  overflowY: "scroll",
                                  maxHeight: "400px",
                                }}
                              >
                                {numberOfSplitCustomer.map((item) => {
                                  return (
                                    <>
                                      <Form.Item
                                        name="Payment Type1"
                                        label={
                                          item.name != ""
                                            ? `Payment Type for ${
                                                item.name
                                              } - ${rsSymbol}${Number(
                                                item.value
                                              ).toFixed(2)}`
                                            : `Payment Type for Customer ${
                                                item.no
                                              } - ${rsSymbol}${Number(
                                                item.value
                                              ).toFixed(2)}`
                                        }
                                      >
                                        <div style={{ display: "none" }}>
                                          {item.product_List.length}
                                        </div>
                                        <Radio.Group
                                          className="tick-radio"
                                          onChange={(e) => {
                                            numberOfSplitCustomer.map(
                                              (val, index) => {
                                                if (index == item.no - 1) {
                                                  val.payment_type_list.map(
                                                    (data, key) => {
                                                      if (
                                                        key == e.target.value
                                                      ) {
                                                        data.tick =
                                                          e.target.checked;
                                                      } else {
                                                        data.tick = false;
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                            );
                                            setNumberOfSplitCustomer([
                                              ...numberOfSplitCustomer,
                                            ]);
                                          }}
                                        >
                                          {item.payment_type_list.map(
                                            (val, index) => {
                                              return (
                                                <>
                                                  <Radio.Button
                                                    style={{
                                                      marginRight: "10px",
                                                      marginBottom: "10px",
                                                    }}
                                                    value={index}
                                                  >
                                                    {val.tick == true && (
                                                      <svg
                                                        width="13px"
                                                        style={{
                                                          marginRight: "2px",
                                                        }}
                                                        viewBox="0 0 123 102"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                                          fill="#BE3D5D"
                                                        />
                                                      </svg>
                                                    )}

                                                    {val.name}
                                                  </Radio.Button>
                                                </>
                                              );
                                            }
                                          )}
                                        </Radio.Group>
                                      </Form.Item>
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              <Row gutter={25} style={{ marginBottom: 10 }}>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>How do you want to split?</label>
                                </Col>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 20 }}
                                >
                                  <Radio.Group
                                    value={splitCustomerType}
                                    onChange={(e) =>
                                      setSplitCustomerType(e.target.value)
                                    }
                                  >
                                    <Radio value="equally">Equally</Radio>
                                    <Radio value="by_items">By Items</Radio>
                                  </Radio.Group>
                                </Col>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>
                                    Number of Customers{" "}
                                    <Tooltip title="Number of customers can be minimum 2 and maximum 10.">
                                      <QuestionCircleOutlined
                                        style={{ cursor: "pointer" }}
                                      />
                                    </Tooltip>
                                  </label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div style={{ display: "none" }}>
                                    {splitCustomerNo}
                                  </div>
                                  <Input
                                    placeholder="Number of Customers"
                                    type="number"
                                    value={splitCustomerNo}
                                    onChange={(e) => {
                                      setSplitCustomerNo(e.target.value);
                                      if (
                                        e.target.value != "" &&
                                        e.target.value != 0 &&
                                        e.target.value <= 10
                                      ) {
                                        setNumberOfSplitCustomer(
                                          Array.from(
                                            { length: e.target.value },
                                            (_, i) => {
                                              let newPaymnetList = orderCartData.PaymentTypeList.map(
                                                (val) => {
                                                  return {
                                                    name: val.name,
                                                    tick: false,
                                                  };
                                                }
                                              );
                                              return {
                                                no: i + 1,
                                                name: "",
                                                mobial: "",
                                                value:
                                                  totalPrice / e.target.value,
                                                payment_type_list: [
                                                  {
                                                    name: "Cash",
                                                    tick: false,
                                                  },
                                                  {
                                                    name: "Credit / Debit Card",
                                                    tick: false,
                                                  },
                                                  ...newPaymnetList,
                                                  {
                                                    name: "Other",
                                                    tick: false,
                                                  },
                                                ],
                                                product_List: [],
                                                customer_type: splitCustomerType,
                                              };
                                            }
                                          )
                                        );
                                      } else {
                                        setNumberOfSplitCustomer([]);
                                      }
                                    }}
                                  />
                                  {numberOfSplitCustomer.length > 0 &&
                                    numberOfSplitCustomer.length < 2 && (
                                      <p style={{ color: "red" }}>
                                        Number of customers must be greater than
                                        1.
                                      </p>
                                    )}
                                </Col>
                              </Row>
                              {numberOfSplitCustomer.length > 0 && (
                                <>
                                  {numberOfSplitCustomer.map((val) => {
                                    return (
                                      <>
                                        <Row xxl={24} md={24} sm={24} xs={24}>
                                          <Col
                                            xxl={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            style={{ paddingRight: "10px" }}
                                          >
                                            <Col
                                              xxl={18}
                                              md={18}
                                              sm={18}
                                              xs={18}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <label>
                                                Customer {val.no} Name
                                              </label>
                                            </Col>
                                            <Col
                                              xxl={24}
                                              md={24}
                                              sm={24}
                                              xs={24}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <div style={{ display: "none" }}>
                                                {numberOfSplitCustomer.length}
                                              </div>
                                              <Input
                                                placeholder="Customer name (Optional)"
                                                value={val.name}
                                                onChange={(e) => {
                                                  numberOfSplitCustomer[
                                                    val.no - 1
                                                  ].name = e.target.value;
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              />
                                            </Col>
                                          </Col>
                                          <Col
                                            xxl={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            style={{ paddingRight: "10px" }}
                                          >
                                            <Col
                                              xxl={18}
                                              md={18}
                                              sm={18}
                                              xs={18}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <label>
                                                Customer {val.no} Phone
                                              </label>
                                            </Col>
                                            <Col
                                              xxl={24}
                                              md={24}
                                              sm={24}
                                              xs={24}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <div style={{ display: "none" }}>
                                                {numberOfSplitCustomer.length}
                                              </div>

                                              <Input
                                                placeholder="Customer mobile (Optional)"
                                                type="number"
                                                disabled={notUpdate}
                                                value={val.mobial}
                                                onChange={(e) => {
                                                  numberOfSplitCustomer[
                                                    val.no - 1
                                                  ].mobial = e.target.value;
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              />
                                            </Col>
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </TabPane>
                  </Tabs>
                </Modal>
                {PaymentType === "cash" ? (
                  <>
                    <Form.Item
                      label="Cash Tendered"
                      name="cash_tender"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (Number(value) < totalPrice && value != "") {
                              return Promise.reject(
                                "Cash tendered cannot be lower than the total."
                              );
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Cash tendered"
                        min={0}
                        value={cashTender}
                        onKeyPress={(event) => {
                          if (event.key.match("[0-9,.]+")) {
                            return true;
                          } else {
                            return event.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          if (e.target.value != "") {
                            setBalanceToCustomer(
                              Number(
                                Number(e.target.value) - totalPrice
                              ).toFixed(2)
                            );
                            setCashTender(e.target.value);
                          } else {
                            setBalanceToCustomer();
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Balance to Customer">
                      <Input
                        type="text"
                        readonly
                        disabled
                        style={{
                          backgroundColor: "hsla(0,0%,93%,.27058823529411763)",
                          color: "black",
                        }}
                        value={
                          balanceToCustomer && balanceToCustomer != NaN
                            ? balanceToCustomer
                            : ""
                        }
                        placeholder="Balance to customer"
                      />
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}
                {PaymentType === "card" ? (
                  <>
                    <Form.Item label="Card Details" name="card_details">
                      <Input placeholder="Card details (optional)"></Input>
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}

                {PaymentType === "other" ||
                PaymentType ===
                  orderCartData.PaymentTypeList.find(
                    (data) => data.name === PaymentType
                  )?.name ? (
                  <>
                    <Form.Item label="Payment Notes" name="payment_notes">
                      <TextArea
                        placeholder="Notes (optional)"
                        rows={1}
                      ></TextArea>
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
            <Modal
              title="Close Booking"
              okText="Save & Close"
              visible={modelVisibleColse}
              onOk={() => BookingUpdate()}
              onCancel={() => DiscardChanges()}
              cancelText="Discard Changes"
              width={600}
            >
              <p>Are you sure you want to save updates?</p>
            </Modal>
            <Form.Item style={{ marginTop: "15px" }}>
              <Button
                size="medium"
                className="mb_btnd"
                style={{ marginRight: 0, marginLeft: 5 }}
                onClick={() => chargeClick(false)}
              >
                Back
              </Button>
              {localCartInfo?.bookingDetails ? (
                <Button
                  size="medium"
                  className="mb_btnd"
                  style={{ marginRight: 0, marginLeft: 6 }}
                  onClick={() => CompleteButtonFunction()}
                >
                  Close
                </Button>
              ) : (
                <>
                  <p style={{ display: "none" }}>
                    {printFirst ? "true" : "false"}
                  </p>
                  {paymentMethod == "booking" ? (
                    <Button
                      size="medium"
                      className="mb_btnd"
                      style={
                        bookingAdvance > 0 && bookingAdvancePaymnetType == false
                          ? filterBookingSplitArray.length > 1
                            ? { marginRight: 0, marginLeft: 6 }
                            : { marginRight: 0, marginLeft: 6, color: "black" }
                          : { marginRight: 0, marginLeft: 6 }
                      }
                      disabled={
                        bookingAdvance > 0 && bookingAdvancePaymnetType == false
                          ? filterBookingSplitArray.length > 1
                            ? spinOn == false
                              ? false
                              : true
                            : true
                          : spinOn == false
                          ? false
                          : true
                      }
                      htmlType="submit"
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button
                      size="medium"
                      className="mb_btnd"
                      style={
                        PaymentType || filterSplitArray.length > 1
                          ? { marginRight: 0, marginLeft: 6 }
                          : { marginRight: 0, marginLeft: 6, color: "black" }
                      }
                      disabled={
                        spinOn == false &&
                        (PaymentType || filterSplitArray.length > 1)
                          ? false
                          : true
                      }
                      htmlType="submit"
                    >
                      Complete
                    </Button>
                  )}
                </>
              )}

              {paymentMethod == "booking" ? (
                <>
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                    className="mb_btnd btn_class"
                    disabled={
                      bookingAdvance > 0 && bookingAdvancePaymnetType == false
                        ? filterBookingSplitArray.length > 1 ||
                          (printFirst != null && printFirst == true)
                          ? spinOn == false
                            ? false
                            : true
                          : true
                        : spinOn == false
                        ? false
                        : true
                    }
                    style={
                      bookingAdvance > 0 && bookingAdvancePaymnetType == false
                        ? filterBookingSplitArray.length > 1 ||
                          (printFirst != null && printFirst == true)
                          ? { margin: 6 }
                          : { margin: 6, color: "black" }
                        : { margin: 6 }
                    }
                  >
                    {bookingSubmitButtonText}&nbsp;{rsSymbol}
                    {totalPrice}{" "}
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  size="medium"
                  htmlType="submit"
                  className="mb_btnd btn_class"
                  disabled={
                    spinOn == false &&
                    (PaymentType ||
                      filterSplitArray.length > 1 ||
                      (printFirst != null && printFirst == true))
                      ? false
                      : true
                  }
                  style={
                    printFirst
                      ? {
                          margin: 6,
                        }
                      : { margin: 6 }
                  }
                >
                  {immediateSubmitButtonText}&nbsp;{rsSymbol}
                  {totalPrice}
                </Button>
              )}
            </Form.Item>{" "}
          </Col>
          <Col xxl={12} md={12} sm={24} xs={24}>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="General" key="1">
                <Form.Item
                  name="mobile"
                  label="Customer Mobile"
                  rules={[
                    {
                      required:
                        paymentMethod == "booking" ||
                        PaymentType == "pending" ||
                        pendingPaymnets > 0
                          ? true
                          : false,
                      message:
                        "Customer mobile number is required for this sale.",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Number"
                    disabled={notUpdate}
                    onChange={(e) => {
                      setCustomer(e.target.value);
                      setNotChange(true);
                      setCustomerMobaialNumer(e.target.value);
                    }}
                    onKeyDown={(e) =>
                      orderCartData.onMobialNumberFiledEnterClick(e)
                    }
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Cutomer Name"
                  rules={[
                    {
                      required:
                        paymentMethod == "booking" ||
                        PaymentType == "pending" ||
                        pendingPaymnets > 0
                          ? true
                          : false,
                      message: "Customer name is required for this sale.",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Name"
                    disabled={notUpdate}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Customer Email"
                  rules={[
                    {
                      message: "Please enter valid email",
                      type: "email",
                    },
                  ]}
                >
                  <div className="hide-customerdata">{customerEmail}</div>
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Email"
                    value={customerEmail}
                    disabled={notUpdate}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name="occupants" label="Occupants">
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Number of seats occupied(optional)"
                    value={occupantsSeat}
                    disabled={notUpdate}
                    onChange={(e) => setOccupantsSeat(e.target.value)}
                  />
                </Form.Item>
                <div style={{ display: "flex" }}>
                  {TagList.map((field, index, i) =>
                    field.sub_type === "customer" ? (
                      <>
                        <Form.Item>
                          <CheckableTag
                            disabled={notUpdate}
                            className={field.tag_color}
                            style={{
                              border: "1px solid " + field.tag_color,
                              color: field.tag_color,
                            }}
                            key={field.name}
                            checked={selectedTags.indexOf(field.name) > -1}
                            onChange={(checked) =>
                              handleChange(field.name, checked)
                            }
                          >
                            {field.name}
                          </CheckableTag>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )
                  )}
                </div>
              </TabPane>

              <TabPane tab="Delivery" key="2">
                <Form.Item name="shipping_address" label="Shipping Address">
                  <div className="hide-customerdata">{shippingAddress}</div>
                  <Input
                    disabled={notUpdate}
                    style={{ marginBottom: 6 }}
                    placeholder="Street Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="city"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="City"
                >
                  <div className="hide-customerdata">{city}</div>
                  <Input
                    disabled={notUpdate}
                    style={{ marginBottom: 6 }}
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
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
                  name="zipcode"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="Zipcode"
                >
                  <div className="hide-customerdata">{zipCode}</div>
                  <Input
                    type="number"
                    style={{ marginBottom: 6 }}
                    placeholder="Zipcode"
                    value={zipCode}
                    disabled={notUpdate}
                    onChange={(e) => setZipCode(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </TabPane>

              {AddtionalList.length > 0 && (
                <TabPane tab="Custom" key="3">
                  {AddtionalList.map((field, index, i) => (
                    <>
                      <Form.Item name={field.name} label={field.name}>
                        <div className="hide-customerdata">{field.value}</div>
                        <Input
                          value={field.value ? field.value : ""}
                          style={{ marginBottom: 6 }}
                          placeholder={field.name}
                          a-key={index}
                          disabled={notUpdate}
                          onChange={(e) => {
                            AddtionalList[e.target.getAttribute("a-key")] = {
                              ...field,
                              value: e.target.value,
                            };
                            setAddtionalList([...AddtionalList]);
                          }}
                        />
                      </Form.Item>
                    </>
                  ))}
                </TabPane>
              )}
            </Tabs>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default React.memo(ChargeDetails);
