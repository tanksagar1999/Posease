import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Table,
  Space,
  Popover,
  Card,
  message,
  Radio,
  Typography,
  Spin,
  Checkbox,
  List,
  Select,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SellModuleNav } from "../Style";
import { Button } from "../../../components/buttons/buttons";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CloseCircleFilled,
  CheckCircleOutlined,
  SearchOutlined,
  StopOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { filterListData } from "../../../redux/customer/actionCreator";
import {
  getAllOrderList,
  redayOrders,
  onlineOrderProductList,
  getZometoDetail,
  getSwiggyDetail,
} from "../../../redux/onlineOrder/actionCreator";
import {
  CreateOrder,
  AddAndUpdateBooking,
} from "../../../redux/sell/actionCreator";
import ChargeDetails from "./ChargeDetails";
import { cancelOrder } from "../../../redux/receipts/actionCreator";
import { NavLink } from "react-router-dom";
import { getTopSellList } from "../../../redux/products/actionCreator";
import CustomerModal from "./customerModal";
import ProductDetailModal from "./productDetailModal";
import NewProductModal from "./newProductModal";
import SwapTableModal from "./SwapTableModal";
import OrderTicketModal from "./OrderTicketModal";
import GridViewCurrent from "./GridViewCurrent";
import {
  getItem,
  setItem,
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  createNewCartwithKeyandPush,
  getCartInfoFromLocalKey,
  removeItem,
  storeOtherData,
  setOrderTickets,
} from "../../../utility/localStorageControl";
import EditTableNameModal from "./../../Sell/Current/EditTableNameModal";
import ReceiptPrint from "../Print/ReceiptPrint";
import moment from "moment";
import ModalPopUp from "./popUp";
import ReactDOMServer from "react-dom/server";
import OrderTicketPrint from "./OrderTicketPrint";
import { getBookingNumber, getReceiptNumber } from "../../../utility/utility";
import ProductShow from "./ProductShow";
import { SocketContext } from "../../../socket/socketContext";

const { ipcRenderer, remote } = window.require("electron");

const CurrentBuilder = (props) => {
  const socket = getItem("waiter_app_enable") && useContext(SocketContext);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const { waiterTableChanges } = useSelector((state) => {
    return {
      waiterTableChanges: state.auth.localTableDataArray,
    };
  });
  let {
    tabChangeToCurrent,
    setCustomerAndCartData,
    search,
    nullSearch,
    localCartInfo,
    tableName,
    updateCartCount,
    swapTableNameList,
    setlocalCartInfo,
    setTableName,
    customeTableList,
    registerData,
    setDarftCount,
    productListOfdata,
    allLocalData,
    suffix1,
    setSeacrhItems1,
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

  const [windowWidth, setWindowWidth] = useState(
    remote.getCurrentWindow().getSize()[0]
  );
  useEffect(() => {
    setWindowWidth(remote.getCurrentWindow().getSize()[0]);
  }, [remote.getCurrentWindow().getSize()[0]]);
  let [selectedProduct, setSelectedProduct] = useState(
    localCartInfo != undefined && Object.keys(localCartInfo).length > 0
      ? localCartInfo?.data?.filter((k) => k.quantity > 0)
      : []
  );
  const [modalVisibleOrderCancel, setModalVisibleOrderCancel] = useState(false);
  const [selectedTable, setselectedTable] = useState(
    localCartInfo && localCartInfo.tableName != ""
      ? localCartInfo.tableName
      : tableName
  );
  let [status, setStatus] = useState(false);
  let [setupList, setsetupPrinterList] = useState(
    allLocalData?.setUpPrinter ? allLocalData.setUpPrinter : []
  );

  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const [newProductDetailsvisible, setNewProductdetailsVisible] = useState(
    false
  );
  const [editTableNameModal, setEditTableNameModal] = useState(false);

  const coupanCodeRef = useRef();
  const inputRef = useRef();
  const discountRef = useRef();
  const [swapModalVisible, setSwapModalVisible] = useState(false);

  const [orderTiketModalVisible, setOrderTiketModalVisible] = useState(false);
  let [customer, setCustomer] = useState(
    localCartInfo &&
      localCartInfo.otherDetails &&
      localCartInfo.otherDetails.customer &&
      localCartInfo.otherDetails.customer.mobile != null
      ? localCartInfo.otherDetails.customer.mobile
      : "Add Customer"
  );
  let [CustomerData, setCustomerData] = useState(
    localCartInfo &&
      localCartInfo.otherDetails &&
      localCartInfo.otherDetails.customer
      ? localCartInfo.otherDetails.customer
      : null
  );
  let [CategoryID, setCategoryId] = useState(
    getItem("hideAllAndTop")
      ? allLocalData.productCategory[0]?._id
        ? allLocalData.productCategory[0]._id
        : ""
      : "All"
  );
  const [activeAll, setActiveAll] = useState("");
  const [activeTop, setActiveTop] = useState(false);

  let [allCategoryList, setAllCategoryList] = useState(
    allLocalData.productCategory.sort(function(a, b) {
      return a.sort_order - b.sort_order;
    })
  );
  const [PaymentType, setPaymentType] = useState("cash");
  let [productDetailsForUpdate, setProductDetailsForUpdate] = useState({});
  let [PopoverVisible, setPopoverVisible] = useState(false);
  let [PopoverVisibleAdditional, setPopoverVisibleAdditional] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  let [AddtionalChargeList, setAddtionalChargeList] = useState([]);
  const [PaymentTypeList, setPaymentTypeList] = useState(
    allLocalData?.customFields?.paymnetType?.length > 0
      ? allLocalData.customFields.paymnetType
      : []
  );

  let tickAdditionalList = [];
  let totalAddtionalcharge = 0;

  let [newProductData, setNewProductData] = useState({});
  let [spinOn, setSpinOn] = useState(false);
  const [change, setNotChange] = useState(false);
  const [enforceCustomer, setEnforceCustomer] = useState(false);
  const [DiscountMoreThanTotal, setDiscountMoreThanTotal] = useState(
    "Bulk Discount"
  );
  const [colorBulk, setColorBulk] = useState("#008cba");

  let [buclkDiscontDetails, setBulckDisountDetails] = useState({
    type: localCartInfo?.otherDetails?.bulkDiscountDetails?.type
      ? localCartInfo.otherDetails.bulkDiscountDetails.type
      : "FLAT",
    value: localCartInfo?.otherDetails?.bulkDiscountDetails?.value
      ? localCartInfo.otherDetails.bulkDiscountDetails.value
      : 0,
    click: false,
  });
  let [bulckdiscuntButtonText, setBulckDiscontButtonText] = useState({
    text: "Bulk discount",
    color: "#008cba",
    discountValue: 0,
  });
  const [bingageBalanace, setBingageBalance] = useState(
    localCartInfo?.bingageDetails?.balance
      ? localCartInfo?.bingageDetails?.balance
      : false
  );
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { Text } = Typography;
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  const [bulkValue, setBulkValue] = useState(
    localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkValue
      ? localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkValue
      : 0
  );
  const [finalCoupanCodeValue, setFinalCoupanCodeValue] = useState(0);
  const [finalCoupan_code, setFinalCoupan_code] = useState();
  const [cartToEdit, setCartToEdit] = useState({});

  const [coupanCodeValue, setCoupanCodeCodeValue] = useState(0);
  const [listViewOnOff, setListViewOnOff] = useState(false);
  const [chargeClick, setChargeClick] = useState(
    localCartInfo?.otherDetails?.chargeClick
      ? localCartInfo?.type != "booking_cart" &&
          localCartInfo?.otherDetails?.chargeClick
      : false
  );
  const [searchItems, setsearchItems] = useState("");
  const [AdddiscountValue, setAdddiscountValue] = useState([]);
  const [onClickList, setOnClickList] = useState(false);
  const [manualCouponObject, setManualCouponObject] = useState(null);
  const [staticManualCouponObject, setStaticManualCouponObject] = useState(
    null
  );
  const [userDetailData, setuserDetailData] = useState(false);
  const [topSellList, setTopSellList] = useState([]);
  const orderTicketClickRef = useRef();

  const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

  const { Option } = Select;

  const [shopDetails, setShopDetails] = useState(allLocalData.shopDetails);
  const [printDetails, setPrintDetails] = useState();
  const [notUpdate, setNotUpdate] = useState(false);
  const [popUpData, setPopUpData] = useState();
  const [popUpModel, setPopUpModel] = useState(false);
  const [ModelView, setModelViewData] = useState(false);
  let [round, setround] = useState(0);
  let [TotalAddtionalChargeValue, setTotalAddtionalChargeValue] = useState(0);
  var [selecteddiscountProducts, setselecteddiscountProducts] = useState([]);
  let [discountAppliedProductId, setdiscountAppliedProductId] = useState({
    index: "",
  });
  let [adddiscountFlag, setadddiscountFlag] = useState(false);
  var [discountValue, setDiscountValue] = useState([]);
  var [customDiscountPresent, setCustomDiscountValue] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [disCountValues, setDiscountValues] = useState(0);
  const [key, setKey] = useState(false);

  let numberOfKitchen = [];
  useEffect(() => {
    if (localCartInfo && localCartInfo.data && localCartInfo.data.length > 0) {
      setSelectedProduct(localCartInfo?.data?.filter((k) => k.quantity > 0));
    }
  }, [waiterTableChanges]);

  // useEffect(() => {
  //   if (localCartInfo?.Status == "Unpaid") {
  //     setNotUpdate(true);
  //   }
  // }, [localCartInfo?.Status]);

  const [checkCurrent, setCheckCurrent] = useState(true);
  const [coupanCodeDetails, setCoupanCodeDetails] = useState({
    click: false,
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // useEffect(() => {
  //   if (orderTicketClickRef && orderTicketClickRef.current) {
  //     alert("calldown");
  //     orderTicketClickRef.current.addEventListener(
  //       "keydown",
  //       handleKeyDown,
  //       false
  //     );
  //     return () => {
  //       orderTicketClickRef.current.removeEventListener(
  //         "keydown",
  //         handleKeyDown
  //       );
  //     };
  //   }
  // }, []);

  useEffect(() => {
    let AllProduct = productListOfdata;

    if (AllProduct.length > 0) {
      const getSections = () => {
        if (AllProduct.length === 0) {
          return [];
        }
        let filterdArray = AllProduct.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        setCharWiseProductList(filterdArray);
        return Object.values(
          filterdArray.reduce((acc, word) => {
            let firstLetter = word.product_name[0].toLocaleUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = {
                title: firstLetter,
                data: [word],
              };
            } else {
              acc[firstLetter].data.push(word);
            }
            return acc;
          }, {})
        );
      };

      setFilterArray(getSections());
    }
  }, [productListOfdata]);

  useEffect(() => {
    if (localCartInfo && localCartInfo?.Status == "Unpaid") {
      setChargeClick(true);
    }
  }, []);

  useEffect(() => {
    if (localCartInfo && localCartInfo.tableName != "") {
      setselectedTable(localCartInfo.tableName);
    } else if (tableName) {
      setselectedTable(tableName);
    }
  }, [tableName]);

  async function fetchAllAddtionalChargeList() {
    let filterList = [];
    let deliveryAddCharge = [];
    let dineInAddCharge = [];
    let takeAwayAddCharge = [];

    let localData = getItem("setupCache");

    const allAddtionalChargeList = localData?.additionalCharges;

    if (allAddtionalChargeList)
      filterList = allAddtionalChargeList?.filter(
        (value) => value.order_type === "all_orders"
      );
    setAddtionalChargeList(filterList);
    if (
      localCartInfo?.type == "delivery-local" &&
      allAddtionalChargeList.length > 0
    )
      deliveryAddCharge = allAddtionalChargeList.filter(
        (value) =>
          value.order_type === "delivery" || value.order_type === "all_orders"
      );

    if (
      localCartInfo?.type === "custom-table-local" &&
      allAddtionalChargeList.length > 0
    ) {
      dineInAddCharge = allAddtionalChargeList?.filter(
        (value) =>
          value.order_type === "dine_in" || value.order_type === "all_orders"
      );
    }

    if (
      localCartInfo?.type === "take-away-local" &&
      allAddtionalChargeList.length > 0
    ) {
      takeAwayAddCharge = allAddtionalChargeList.filter(
        (value) =>
          value.order_type === "take_away" || value.order_type === "all_orders"
      );
    }

    takeAwayAddCharge &&
      takeAwayAddCharge.map((value) => {
        if (
          localCartInfo &&
          localCartInfo.otherDetails &&
          localCartInfo.otherDetails.AddtionalChargeList?.length > 0
        ) {
          localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
            if (value._id == val._id && val.is_automatically_added) {
              value.is_automatically_added = true;
            }
          });
        }
        if (value.tax_group && value.tax_group.taxes) {
          let totalTax = 0;
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
        } else {
          value.tax_group.Totaltax = 0;
        }
      });

    filterList &&
      filterList.map((value) => {
        if (
          localCartInfo &&
          localCartInfo.otherDetails &&
          localCartInfo.otherDetails.AddtionalChargeList?.length > 0
        ) {
          localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
            if (value._id == val._id && val.is_automatically_added) {
              value.is_automatically_added = true;
            }
          });
        }
        if (value.tax_group && value.tax_group.taxes) {
          let totalTax = 0;
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
        } else {
          value.tax_group.Totaltax = 0;
        }
      });

    dineInAddCharge &&
      dineInAddCharge.map((value) => {
        if (
          localCartInfo &&
          localCartInfo.otherDetails &&
          localCartInfo.otherDetails.AddtionalChargeList?.length > 0
        ) {
          localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
            if (value._id == val._id && val.is_automatically_added) {
              value.is_automatically_added = true;
            }
          });
        }

        if (value.tax_group && value.tax_group.taxes) {
          let totalTax = 0;
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
        } else {
          value.tax_group.Totaltax = 0;
        }
      });

    deliveryAddCharge &&
      deliveryAddCharge.map((value) => {
        if (
          localCartInfo &&
          localCartInfo.otherDetails &&
          localCartInfo.otherDetails.AddtionalChargeList?.length > 0
        ) {
          localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
            if (value._id == val._id && val.is_automatically_added) {
              value.is_automatically_added = true;
            }
          });
        }

        if (value.tax_group && value.tax_group.taxes) {
          let totalTax = 0;
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
        } else {
          value.tax_group.Totaltax = 0;
        }
      });

    if (filterList?.length > 0) setAddtionalChargeList(filterList);
    if (deliveryAddCharge?.length > 0)
      setAddtionalChargeList(deliveryAddCharge);
    if (dineInAddCharge?.length > 0) setAddtionalChargeList(dineInAddCharge);
    if (takeAwayAddCharge?.length > 0)
      setAddtionalChargeList(takeAwayAddCharge);
  }
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
  useEffect(() => {
    setActiveAll("active");

    async function fetchUserDetail() {
      getItem("userDetails") != null &&
        setuserDetailData(getItem("userDetails"));
    }

    async function fetchTopSellList() {
      const allTopSellList = await dispatch(getTopSellList());

      if (
        isMounted.current &&
        allTopSellList &&
        allTopSellList.topProductList.length
      ) {
        setTopSellList(allTopSellList.topProductList);
      }
    }

    if (isMounted.current) {
      fetchUserDetail();
      fetchTopSellList();
      fetchAllAddtionalChargeList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  // total calculation part  //
  //totalvaru new
  let [totalcalculatedPrice, setTotalCalculatedPrice] = useState(0);
  let [totalcalculatedTax, setTotalCalculatedTax] = useState(0);
  function taxesCalculated(product, customDiscount) {
    if (customDiscount) {
      product.taxGroup.taxes?.length > 0 &&
        product.taxGroup.taxes.map(
          (j) =>
            (j.totalTaxPrice =
              (j.tax_percentage * (product.calculatedprice - customDiscount)) /
              100)
        );
      return (
        (product.productTaxes * (product.calculatedprice - customDiscount)) /
        100
      );
    } else {
      product.taxGroup.taxes?.length > 0 &&
        product.taxGroup.taxes.map(
          (j) =>
            (j.totalTaxPrice =
              (j.tax_percentage * product.calculatedprice) / 100)
        );
      return (product.productTaxes * product.calculatedprice) / 100;
    }
  }
  function roundOffTotal(total) {
    let total1 = total;
    total = Math.round(total);
    let float_part = Number((total1 - total).toFixed(2));
    setround(float_part * -1);
    return total;
  }
  function addAdtionalchargeValue(total, totalTaxes) {
    if (AddtionalChargeList.length > 0 && selectedProduct.length > 0) {
      let orignalTotal = total;
      let totalAddtionalcharge = 0;
      AddtionalChargeList.map((value) => {
        if (value.is_automatically_added) {
          if (value.tax_group?.taxes) {
            let TotalTax =
              value.tax_group.taxes?.length > 0 &&
              value.tax_group.taxes.reduce(
                (accumulator, current) => accumulator + current.tax_percentage,
                0
              );
            let addtionalCharge = 0;
            if (value.charge_type === "percentage") {
              addtionalCharge = (value.charge_value * orignalTotal) / 100;
              value.AddtionalCalculatedValue =
                (value.charge_value * orignalTotal) / 100;
            } else {
              addtionalCharge = value.charge_value;
              value.AddtionalCalculatedValue = value.charge_value;
            }
            value.tax_group.taxes?.length > 0 &&
              value.tax_group.taxes.map(
                (j) =>
                  (j.totalTaxPrice = (j.tax_percentage * addtionalCharge) / 100)
              );
            totalTaxes += (TotalTax * addtionalCharge) / 100;
          }

          if (value.charge_type === "percentage") {
            totalAddtionalcharge += (value.charge_value * orignalTotal) / 100;
            total += (value.charge_value * orignalTotal) / 100;
          } else {
            totalAddtionalcharge += value.charge_value;
            total += value.charge_value;
          }
        }
      });
      setTotalAddtionalChargeValue(Number(totalAddtionalcharge).toFixed(2));
      return {
        totalValues: total,
        taxValue: totalTaxes,
        totalAddtionalcharge: totalAddtionalcharge,
      };
    } else {
      return {
        totalValues: total,
        taxValue: totalTaxes,
        totalAddtionalcharge: totalAddtionalcharge,
      };
    }
  }

  // let checkCoupanCideValid = (DiscountValue) => {
  //   let today = moment().format("YYYY-MM-DD");
  //   let startDate = moment(DiscountValue.start_date).format("YYYY-MM-DD");
  //   let endDate = DiscountValue.end_date
  //     ? moment(DiscountValue.end_date).format("YYYY-MM-DD")
  //     : undefined;

  //   let abc = moment(today).isBetween(startDate, endDate);

  // };

  // let coupanCodeCalCulation = (total, totalTaxes) => {
  //   if (coupanCodeList?.length > 0) {
  //     let DiscountValue = coupanCodeList.find(
  //       (val) => val.coupon_code?.toLowerCase() == coupanCodeText.toLowerCase()
  //     );

  //     if (
  //       DiscountValue &&
  //       DiscountValue.status == "enable" &&
  //       DiscountValue.registers.includes(registerData._id) &&
  //       DiscountValue.days_of_week.includes(moment().format("dddd")) &&
  //       DiscountValue.level == "order"
  //     ) {
  //       checkCoupanCideValid(DiscountValue);
  //     }
  //   }
  // };

  let bulckDiscontCalculation = (total, totalTaxes) => {
    let crrentTotalPrice = total + totalTaxes;
    if (
      buclkDiscontDetails.type == "FLAT" &&
      buclkDiscontDetails.value > crrentTotalPrice
    ) {
      setBulckDiscontButtonText({
        color: "red",
        text: "Discount is more than total",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    } else if (
      buclkDiscontDetails.type == "FLAT" &&
      buclkDiscontDetails.value > 0
    ) {
      let bulkPrice = buclkDiscontDetails.value / total;
      let taxesArr = [];
      let Totaltaxandbulk = 0;
      let totalPrice = 0;
      selectedProduct.map((value, index) => {
        let calCulatedPrice =
          value.calculatedprice -
          Number(value.customDiscountedValue ? value.customDiscountedValue : 0);

        totalPrice += calCulatedPrice;

        let bulkprice2 = calCulatedPrice * bulkPrice;
        let bulkPrice3 = calCulatedPrice - bulkprice2;
        taxesArr.push((bulkPrice3 * value.productTaxes) / 100);
        value.taxGroup.taxes.map((i) => {
          i.totalTaxPrice = (bulkPrice3 * i.tax_percentage) / 100;
        });
      });
      taxesArr.map((tax) => (Totaltaxandbulk += tax));

      let bulkfinalTotal = totalPrice - buclkDiscontDetails.value;
      setBulckDiscontButtonText({
        text: `Bulk discount ${rsSymbol}${Number(
          buclkDiscontDetails.value
        ).toFixed(2)}`,
        color: "#008cba",
        discountValue: Number(buclkDiscontDetails.value).toFixed(2),
      });

      return {
        total: bulkfinalTotal,
        totalTaxes: Totaltaxandbulk,
      };
    } else if (
      buclkDiscontDetails.type == "PERCENTAGE" &&
      buclkDiscontDetails.value > 0
    ) {
      selectedProduct.map((product) => {
        let calCulatedPrice =
          product.calculatedprice -
          Number(
            product.customDiscountedValue ? product.customDiscountedValue : 0
          );
        product?.taxGroup?.taxes?.length > 0 &&
          product.taxGroup.taxes.map((j) => {
            let bulckProductTax =
              j.tax_percentage -
              (j.tax_percentage * buclkDiscontDetails.value) / 100;

            return (j.totalTaxPrice =
              (bulckProductTax * calCulatedPrice) / 100);
          });
      });

      let calTax = totalTaxes - (totalTaxes * buclkDiscontDetails.value) / 100;

      let caltotal = total - (total * buclkDiscontDetails.value) / 100;
      setBulckDiscontButtonText({
        text: `Bulk discount ${rsSymbol}${Number(
          (total * buclkDiscontDetails.value) / 100
        ).toFixed(2)}`,
        color: "#008cba",
        discountValue: Number(
          (total * buclkDiscontDetails.value) / 100
        ).toFixed(2),
      });
      return {
        total: caltotal,
        totalTaxes: calTax,
      };
    } else if (
      buclkDiscontDetails.type == "PERCENTAGE" &&
      buclkDiscontDetails.value > (total * buclkDiscontDetails.value) / 100
    ) {
      setBulckDiscontButtonText({
        color: "red",
        text: "Discount is more than total",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    } else {
      setBulckDiscontButtonText({
        color: "#008cba",
        text: "Bulk discount",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    }
  };

  useEffect(() => {
    if (localCartInfo?.onlineOrder) {
      setTotalCalculatedPrice(
        Number(localCartInfo.onlineOrder.Value).toFixed(2)
      );
      if (localCartInfo?.onlineOrder.GST_details?.swiggy_liable_gst) {
        setTotalCalculatedTax(
          localCartInfo.onlineOrder.GST_details.swiggy_liable_gst
        );
      }
    } else {
      let total = 0;
      let totalTaxes = 0;
      let status = false;
      selectedProduct.map((product) => {
        if (product.quantity > 0 && Number(product?.discountData) > 0) {
          status = true;
        }

        if (product.productTaxes > 0) {
          if (
            product.customDiscountedValue &&
            product.customDiscountedValue > 0
          ) {
            totalTaxes += taxesCalculated(
              product,
              product.customDiscountedValue
            );
          } else {
            totalTaxes += taxesCalculated(product);
          }
        }

        total += product.calculatedprice;
        if (
          product.customDiscountedValue &&
          product.customDiscountedValue > 0
        ) {
          total = total - product.customDiscountedValue;
        }
      });

      setStatus(status);
      let bulckChargeDetails = bulckDiscontCalculation(total, totalTaxes);

      total = bulckChargeDetails.total;
      totalTaxes = bulckChargeDetails.totalTaxes;

      let addtinalChrage = addAdtionalchargeValue(total, totalTaxes);
      total = addtinalChrage.totalValues;
      totalTaxes = addtinalChrage.taxValue;
      total = total + totalTaxes;

      if (getItem("doNotRoundOff") === false) {
        total = roundOffTotal(total);
      }

      total < 0
        ? setTotalCalculatedPrice(0)
        : setTotalCalculatedPrice(Number(total).toFixed(2));

      totalTaxes < 0
        ? setTotalCalculatedTax(0)
        : setTotalCalculatedTax(totalTaxes);
    }
  }, [
    selectedProduct,
    AddtionalChargeList,
    buclkDiscontDetails,
    coupanCodeDetails.click,
  ]);

  function renderBulkDiscountContent() {
    return (
      <div>
        {finalCoupanCodeValue > 0 ? (
          <div>
            <span>
              Coupon {finalCoupan_code} applied -
              {coupanCodeValue.discount_type == "percentage"
                ? `${coupanCodeValue.discount}%`
                : `${rsSymbol}${Number(finalCoupanCodeValue).toFixed(2)}`}
            </span>
          </div>
        ) : (
          <>
            {getItem("userDetails") != null &&
            getItem("userDetails").role == "cashier" &&
            (getItem("allow_cashier_to_discount") == null ||
              getItem("allow_cashier_to_discount") == false) ? (
              <p>You are not allow discount</p>
            ) : (
              <div
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  fontSize: "11px",
                  padding: "3px",
                }}
              >
                <Radio.Group
                  style={{ marginBottom: 10 }}
                  onChange={(event) => {
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      type: event.target.value,
                    });
                  }}
                  value={buclkDiscontDetails.type}
                >
                  <Radio value="FLAT">Cash</Radio>
                  <Radio value="PERCENTAGE">Percentage</Radio>
                </Radio.Group>
                <br></br>
                <Input
                  type="number"
                  ref={discountRef}
                  step="any"
                  style={{ marginBottom: 10 }}
                  placeholder="Discount values"
                  min={0}
                  onChange={(event) => {
                    setDiscountValues(event.target.value);
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      value: event.target.value,
                    });
                  }}
                  value={buclkDiscontDetails.value}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9,.]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />{" "}
                <br></br>
                {buclkDiscontDetails.type == "PERCENTAGE" &&
                buclkDiscontDetails.value > 100 ? (
                  <p style={{ color: "red" }}>
                    Discount cannot be more than 100%.
                  </p>
                ) : null}
                <Button
                  size="middle"
                  type="success"
                  className="bulk_hovers"
                  disabled={
                    buclkDiscontDetails.type == "PERCENTAGE" &&
                    buclkDiscontDetails.value > 100
                      ? true
                      : notUpdate
                  }
                  style={{
                    marginLeft: 55,
                    color: "white",
                    background: "#BD025D",
                    border: "#BD025D",
                    opacity:
                      buclkDiscontDetails.type == "PERCENTAGE" &&
                      buclkDiscontDetails.value > 100
                        ? 0.65
                        : "",
                  }}
                  onClick={() => {
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      click: !buclkDiscontDetails.click,
                      check: "bulck",
                    });

                    setPopoverVisible(false);
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  useEffect(() => {
    setSelectedProduct(getItem("product_Details"));
  }, [chargeClick]);

  let suffix =
    searchItems != "" ? (
      <CloseCircleFilled onClick={() => setsearchItems("")} />
    ) : (
      <SearchOutlined />
    );

  function setProductClassFromCategoryIndex(cat_id) {
    let index = allCategoryList.findIndex((p) => p._id == cat_id);
    if (index > 40 && index <= 80) {
      return "product-cat_id-" + index - 40;
    } else if (index > 81 && index <= 120) {
      return "product-cat_id-" + index - 80;
    } else if (index > 120 && index <= 160) {
      return "product-cat_id-" + index - 120;
    } else {
      return "product-cat_id-" + index;
    }
  }
  let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);
  useEffect(() => {
    if (getItem("orderTicketButton")) {
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

        var result = selectedProduct?.filter(function(o1) {
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
            findData.newqty = i.newqty;
            findData.add_or_remove = "Removed Items";
            finalData.push(findData);
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

      let status = false;
      arrayData.map((i) => {
        if (i.data[0].newqty > 0) {
          status = true;
        }
      });

      setListOfUpdatedProduts([...arrayData]);
    }
  }, [selectedProduct]);
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
  let OrderTicketsData = [];
  let receiptNumber;
  const createOrderTikits = () => {
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

    let receiptNumber =
      localCartInfo?.orderTicketsData?.length > 0
        ? localCartInfo.orderTicketsData[0].receiptNumberDetails.number
        : localCartInfo?.type == "booking_cart"
        ? getBookingNumber(registerData, OrderTiketsData)
        : getReceiptNumber(registerData, OrderTicketsData);
    let createOrderTiketsList = [];
    listOfUpdatedproducts.map((val) => {
      let OrderTicketNumber;
      if (getItem("previousOrderTicketNumber") != null) {
        let Details = getItem("previousOrderTicketNumber");

        if (moment(Details.date).isSame(moment().format("L"))) {
          OrderTicketNumber = 1 + Details.number;
          setItem("previousOrderTicketNumber", {
            date: moment().format("L"),
            number: 1 + Details.number,
          });
        } else {
          let now = moment().format("HH:mm");
          let hour = now.split(":")[0];
          let minute = now.split(":")[1];
          if (hour > 6 && minute > 0) {
            OrderTicketNumber = 1;
            setItem("previousOrderTicketNumber", {
              date: moment().format("L"),
              number: 1,
            });
          } else {
            OrderTicketNumber = 1 + Details.number;
            setItem("previousOrderTicketNumber", {
              date: moment().format("L"),
              number: 1 + Details.number,
            });
          }
        }
      } else {
        OrderTicketNumber = 1;
        setItem("previousOrderTicketNumber", {
          date: moment().format("L"),
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
        table_name: selectedTable,
        receiptNumber: receiptNumber,
        receiptNumberDetails: {
          type: localCartInfo?.type == "booking_cart" ? "booking" : "receipt",
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
      window.frames[
        "print_frame"
      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <OrderTicketPrint
          categoryDetails={object}
          PreviousTikets={PreviousTikets}
          TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
        />
      );
      window.frames["print_frame"].window.focus();
      // window.frames["print_frame"].window.print();
      // if (
      //   getItem("print_server_copy") !== null &&
      //   getItem("print_server_copy") == true
      // ) {
      //   window.frames[
      //     "print_frame"
      //   ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
      //     <OrderTicketPrint
      //       title="SERVER COPY"
      //       categoryDetails={object}
      //       PreviousTikets={PreviousTikets}
      //       TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
      //     />
      //   );
      //   window.frames["print_frame"].window.focus();
      //   // window.frames["print_frame"].window.print();
      // }
    });
    setListOfUpdatedProduts([]);
    setOrderTickets(localCartInfo?.cartKey, createOrderTiketsList);
  };
  const sendPrintReq = (valuesOfKitchen) => {
    ipcRenderer.send("PrintReceipt", valuesOfKitchen);
  };
  const deskTopReceiptPrint = (multipleDifrentKithen) => {
    if (registerData.print_receipts) {
      let connnectName = setupList.find(
        (val) => val.printer_type == "receipt_print"
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

      numberOfKitchen.push(obj);
      sendPrintReq(numberOfKitchen);
    }
  };

  async function checkOnlineOrderCancel() {
    let check = false;
    if (localCartInfo.onlineOrder) {
      let zomatoUrl = registerData.onlineOrder.find(
        (val) => val.orderType == "zomato"
      );
      let swiggyUrl = registerData.onlineOrder.find(
        (val) => val.orderType == "swiggy"
      );

      if (
        zomatoUrl &&
        zomatoUrl.url &&
        localCartInfo.onlineOrder.Source == "Zomato"
      ) {
        const response1 = await dispatch(
          getZometoDetail(zomatoUrl.url, localCartInfo.onlineOrder.order_id)
        );

        if (response1?.rejectionDetails) {
          setPopUpData(localCartInfo);
          setPopUpModel(true);
          check = true;
        } else {
          check = false;
        }
      }
      if (
        swiggyUrl &&
        swiggyUrl.url &&
        localCartInfo.onlineOrder.Source == "Swiggy"
      ) {
        const response = await dispatch(
          getSwiggyDetail(swiggyUrl.url, localCartInfo.onlineOrder.order_id)
        );

        if (response && response.status.order_status == "cancelled") {
          setPopUpData(localCartInfo);
          setPopUpModel(true);
          check = true;
        } else {
          check = false;
        }
      }
    } else {
      check = false;
    }
    return check;
  }
  const setCartAndCustomerDataAndNavigate = async () => {
    if (change) {
      onClickSearch();
      setNotChange(false);
      return;
    } else {
      if (
        totalcalculatedPrice == 0 &&
        selectedProduct.filter((val) => val.quantity == 0).length ==
          selectedProduct.length
      ) {
        setSelectedProduct([]);

        return;
      }

      if (
        getItem("orderTicketButton") != null &&
        getItem("orderTicketButton") == true &&
        getItem("enable_quick_billing") != null &&
        getItem("enable_quick_billing")
      ) {
        createOrderTikits();
      }

      setCustomerAndCartData(cartinfo);
      if (getItem("enable_quick_billing")) {
        let orderData = {};
        let receipt_number =
          localCartInfo?.orderTicketsData?.length > 0
            ? localCartInfo.orderTicketsData[0].receiptNumberDetails.number
            : getReceiptNumber(registerData, OrderTicketsData);
        orderData.actual_time =
          localCartInfo?.orderTicketsData && localCartInfo.orderTicketsData[0]
            ? localCartInfo.orderTicketsData[0].enterDate
            : new Date();

        orderData["ReceiptNumber"] = receipt_number;
        orderData.updatePaymentDate = new Date();

        orderData.customer = {
          mobile: CustomerData?.mobile
            ? Number(CustomerData.mobile)
            : customer == "Add Customer"
            ? ""
            : Number(customer),
          email: CustomerData?.email == undefined ? "" : CustomerData?.email,
          name: CustomerData?.name,
          shipping_address: CustomerData?.shipping_address,
          zipcode: CustomerData?.zipcode,
          city: CustomerData?.city,
        };

        orderData.details = {
          source: "web",
          sourceVersion: "5.2",
          saleType: "immediate",
          paymentStatus: "paid",
          itemsSold: getItem("product_Details"),
          fulfillmentStatus: "Fulfilled",
          tableName: tableName,
          order_by_name: userDetailData,
          register_data: registerData,
          orderType:
            localCartInfo?.type == "delivery-local"
              ? "Delivery"
              : localCartInfo?.type == "custom-table-local"
              ? "CustomTable"
              : localCartInfo?.type == "take-away-local"
              ? "TakeAway"
              : "Darft",
          bingagePaymnetType: PaymentType,
          immediate_sale: {
            multiple_payments_type: [
              {
                name: PaymentType,
                value: totalcalculatedPrice,
                paymentDate: new Date(),
              },
            ],
          },
          priceSummery: {
            total: totalcalculatedPrice,
            totalTaxes: totalcalculatedTax,
          },
        };
        let inventoryList = allLocalData?.inventorys?.map((val) => {
          if (val.linked_registers.includes(registerData._id)) {
            return val._id;
          }
        });

        if (inventoryList?.length) {
          orderData.details.inventoryList = inventoryList.filter(
            (val) => val != undefined
          );
        }
        if (localCartInfo?.bingageDetails) {
          orderData.details.bingageDetails = localCartInfo?.bingageDetails;
        }
        if (
          getItem("orderTicketButton") != null &&
          getItem("orderTicketButton") == true
        ) {
          let localData = getCartInfoFromLocalKey(
            localCartInfo?.cartKey,
            registerData
          );
          orderData.details.orderTicketsData = localData.orderTicketsData;
        }
        round != 0 &&
          (orderData.details.priceSummery.round_off_value = round.toFixed(2));
        if (Number(bulckdiscuntButtonText.discountValue) > 0) {
          orderData.details.bulckDiscountValue = Number(
            bulckdiscuntButtonText.discountValue
          );
        }

        if (TotalAddtionalChargeValue > 0) {
          orderData.details.AddtionChargeValue = AddtionalChargeList;
        }

        if (CustomerData?.custom_fields?.length) {
          let tagList = [];
          let additionalList = [];
          TagList.map((field) => {
            CustomerData.custom_fields.map((val) => {
              if (val.type == "tag" && field.name == val.name) {
                tagList.push(field);
              } else if (val.type == "additional_detail")
                additionalList.push(val);
            });
          });
          orderData.details.custom_fields = tagList;
          orderData.details.customer_custom_fields = additionalList;
        }

        let printDiv = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
            ReceiptNumber={receipt_number}
          />
        );
        deskTopReceiptPrint(printDiv);
        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <ReceiptPrint
            receiptsDetails={orderData}
            shopDetails={shopDetails}
            registerData={registerData}
          />
        );
        emptyCart();
        const getOrder = await dispatch(CreateOrder(orderData));

        if (getOrder) {
          setItem("receiptDetails", getOrder.orderData);
          // if (
          //   getItem("print_server_copy") !== null &&
          //   getItem("print_server_copy") == true
          // ) {
          //   let printDiv = ReactDOMServer.renderToStaticMarkup(
          //     <ReceiptPrint
          //       title="SERVER COPY"
          //       receiptsDetails={orderData}
          //       shopDetails={shopDetails}
          //       registerData={registerData}
          //       ReceiptNumber={receipt_number}
          //     />
          //   );
          //   deskTopReceiptPrint(printDiv);
          //   // window.frames[
          //   //   "print_frame"
          //   // ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          //   //   <ReceiptPrint
          //   //     title="SERVER COPY"
          //   //     receiptsDetails={getOrder.orderData}
          //   //     shopDetails={shopDetails}
          //   //     registerData={registerData}
          //   //   />
          //   // );
          //   // window.frames["print_frame"].window.focus();
          //   // window.frames["print_frame"].window.print();
          // }
        }
        return;
      } else {
        if (
          totalcalculatedPrice == 0 &&
          selectedProduct.filter((val) => val.quantity == 0).length ==
            selectedProduct.length
        ) {
          setSelectedProduct([]);
        } else {
          setSelectedProduct(selectedProduct.filter((val) => val.quantity > 0));
          (await checkOnlineOrderCancel()) ? "" : setChargeClick(true);
        }

        return;
      }

      return;
    }
  };

  // total Calculateds

  function currentcustomerData(value) {
    form.setFieldsValue({
      mobile: value.mobile,
      name: value.name === "" ? value.mobile : value.name,
    });
    setCustomerData({
      name: value.name === "" ? "" : value.name,
      mobile: value.mobile,
      shipping_address: value.shipping_address,
      city: value.city,
      zipcode: value.zipcode,
      _id: value.id ? value.id : "",
    });
  }

  const onSearch = async (e) => {
    let satus = "NotFind";
    if (e.key === "Enter" && e.target.value !== "") {
      setSpinOn(true);
      setNotChange(false);

      const getSearchList = await dispatch(filterListData(e.target.value));
      if (getSearchList && getSearchList.customerListData.length > 0) {
        if (
          getSearchList.customerListData[0] &&
          getSearchList.customerListData[0].bingageDetails?.balance
        ) {
          setBingageBalance(
            getSearchList.customerListData[0].bingageDetails?.balance
          );
        }
        message.success({
          content: "Mobile number is match",
          style: {
            float: "right",
            marginTop: "2vh",
          },
        });
        setSpinOn(false);
        getSearchList.customerListData[0].status = "Find";
        getSearchList.customerListData[0].totalcalculatedPrice = totalcalculatedPrice;
        setCustomerData(getSearchList.customerListData[0]);
      } else {
        message.error({
          content: "Mobile number is not match",
          style: {
            float: "right",
            marginTop: "2vh",
          },
        });
        setSpinOn(false);
        CustomerData = {
          status: "NotFind",
        };

        setCustomerData({
          ...CustomerData,
        });
      }
    }
  };

  const onClickSearch = async () => {
    customer != "Add Customer" && setSpinOn(true);

    const getSearchList = await dispatch(filterListData(customer));

    if (getSearchList && getSearchList.customerListData.length > 0) {
      setSpinOn(false);
      getSearchList.customerListData[0].status = "Find";
      if (
        getSearchList.customerListData[0] &&
        getSearchList.customerListData[0].bingageDetails?.balance
      ) {
        setBingageBalance(
          getSearchList.customerListData[0].bingageDetails?.balance
        );
      }
      message.success({
        content: "Mobile number is match",
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
      getSearchList.customerListData[0].totalcalculatedPrice = totalcalculatedPrice;
      setCustomerData(getSearchList.customerListData[0]);
    } else {
      customer != "Add Customer" && setSpinOn(false);

      CustomerData = {
        status: "NotFind",
      };

      setCustomerData({
        ...CustomerData,
      });
    }
  };

  const qunatityChange = (records, e) => {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo?.cartKey,
      registerData
    );
    if (
      localCartInfo &&
      (localCartInfo?.Status == "Unpaid" ||
        localCartInfo?.hasOwnProperty("onlineOrder"))
    ) {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex(
        (product) => product.key === records.key
      );
      if (findIndex != -1) {
        selectedProduct[findIndex].quantity = Number(e.target.value);

        let price1 = 0;

        if (selectedProduct[findIndex].price) {
          price1 = selectedProduct[findIndex].price;
        } else {
          price1 = selectedProduct[findIndex].key_price;
        }

        if (
          selectedProduct[findIndex].discountType == "free_item" &&
          selectedProduct[findIndex]?.customDiscountedValue
        ) {
          if (
            selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price >=
            selectedProduct[findIndex].discountData *
              selectedProduct[findIndex].price
          ) {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].price *
              selectedProduct[findIndex].discountData;
          } else {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price;
          }
          // } else {
          //   if (selectedProduct[findIndex]?.discountData) {
          //     if (
          //       selectedProduct[findIndex].quantity * price1 >=
          //       selectedProduct[findIndex].discountData
          //     ) {
          //       // if((selectedProduct[findIndex].discountData * price1)>=selectedProduct[findIndex].calculatedprice){
          //       // selectedProduct[findIndex].customDiscountedValue = selectedProduct[findIndex].calculatedprice
          //       // }else{
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].discountData * price1;
          //       // }
          //     } else {
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].quantity * price1;
          //     }
          //   }
        }
        let price = getProductPrice(selectedProduct[findIndex]);
        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        if (selectedProduct[findIndex].productInclusivePrice != undefined) {
          selectedProduct[findIndex].productInclusivePricecalculatedprice =
            selectedProduct[findIndex].quantity *
            (selectedProduct[findIndex].productInclusivePriceKeyPrice
              ? selectedProduct[findIndex].productInclusivePriceKeyPrice
              : selectedProduct[findIndex].productInclusivePrice);
        }
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   // selectedProduct[findIndex]?.quantity *
          //     selectedProduct[findIndex].discountData
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              selectedProduct[findIndex].discountData
          ).toFixed(2);
        }
        applyDiscount(findIndex);
      }
      setSelectedProduct([...selectedProduct]);
      if (localCartInfo) {
        let returnObj = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
        localCartInfo = returnObj.default_cart_object;
      }
    }
  };

  function removeAllDiscounts() {
    selectedProduct.map((value) => {
      value.discountedValue = 0;
      return value;
    });
  }

  function applyManualDiscount(manualDiscountStateObject, findIndex) {
    let applied = false;
    if (manualDiscountStateObject !== null && manualCouponObject === null) {
      let presentInBuy = manualDiscountStateObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualDiscountStateObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
            applied = true;
          }
        }
      } else {
        let presentInGet = manualDiscountStateObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualDiscountStateObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            );
            applied = true;
          }
        }
      }
    }
    return applied;
  }

  function getDiscountObject(productsArray) {
    let getDiscountProduct = getItem("ApplyBuyOneGetOne")?.find(function(o1) {
      return productsArray?.some(function(o2) {
        return (
          o1.get_products.includes(o2.id) || o1.buy_products.includes(o2.id)
        );
      });
    });
    return getDiscountProduct;
  }

  function applyDiscount(findIndex) {
    let applied = applyManualDiscount(staticManualCouponObject, findIndex);
    if (applied) {
      let clone = JSON.parse(JSON.stringify(staticManualCouponObject));
      setManualCouponObject(clone);
      // pass if applied
    } else if (manualCouponObject != null) {
      let presentInBuy = manualCouponObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualCouponObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[
              index
            ].discountedValue = manualCouponObject.apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price);
          }
        }
      } else {
        let presentInGet = manualCouponObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualCouponObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[
              findIndex
            ].discountedValue = manualCouponObject.apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price);
          }
        }
      }
    } else {
      let presentInBuy = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(selectedProduct[findIndex].id);
      });
      let discountObject = getDiscountObject(selectedProduct);
      let apply_discount_only_once_per_order = discountObject
        ? discountObject.apply_discount_only_once_per_order
        : false;

      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
            return o2.get_products.includes(o1.id);
          });
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[
              index
            ].discountedValue = apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price);
          }
        }
      } else {
        let presentInGet = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.get_products.includes(selectedProduct[findIndex].id);
        });
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
              return o2.buy_products.includes(o1.id);
            });
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[
              findIndex
            ].discountedValue = apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price);
          }
        }
      }
    }
    let presentDiscount = selectedProduct.filter(
      (data) =>
        parseInt(data.customDiscountedValue) !== 0 &&
        data.customDiscountedValue !== undefined
    );
    let presentCustomDiscount = selectedProduct.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );

    setDiscountValue(presentDiscount);
    setCustomDiscountValue(presentCustomDiscount);
  }
  let [localDetails, setLocalDetails] = useState();
  const newProductSaveInCart = (formdata, getProduct) => {
    const findIndex = selectedProduct.findIndex((product, findIndex) => {
      if (product.key === getProduct.key) {
        selectedProduct[findIndex].quantity =
          selectedProduct[findIndex].quantity + getProduct.quantity;
        selectedProduct[findIndex].newqty = selectedProduct[findIndex].quantity;
        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].calculatedprice +
          getProduct.calculatedprice;
        if (selectedProduct[findIndex].productInclusivePrice != undefined) {
          selectedProduct[findIndex].productInclusivePricecalculatedprice =
            selectedProduct[findIndex].productInclusivePricecalculatedprice +
            getProduct.productInclusivePricecalculatedprice;
        }

        selectedProduct.splice(findIndex, 1);
        selectedProduct.unshift(product);
        return product;
      }
    });
    let pro = [...selectedProduct];

    if (findIndex < 0) {
      getProduct.newqty = getProduct.quantity;
      pro = [getProduct, ...selectedProduct];

      setItem("product_Details", pro);
    } else {
      pro = [...selectedProduct];

      setItem("product_Details", pro);
    }

    if (manualCouponObject == null) {
      let index = pro?.findIndex(function(o1) {
        return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.buy_products.includes(o1.id);
        });
      });

      if (index !== -1) {
        getItem("ApplyBuyOneGetOne") &&
          getItem("ApplyBuyOneGetOne").map((data) =>
            pro.map((item) => {
              if (data.get_products.includes(item.id)) {
                item.discountedValue = item.price;
              } else {
                item.discountedValue = 0;
              }
            })
          );
      }
      let presentDiscount = pro.filter(
        (data) =>
          parseInt(data.discountedValue) !== 0 &&
          data.discountedValue !== undefined
      );
      let presentCustomDiscount = pro.some(
        (data) =>
          data.customDiscountedValue !== 0 &&
          data.customDiscountedValue !== undefined
      );
      setDiscountValue(presentDiscount);
      setCustomDiscountValue(presentCustomDiscount);
      setAdddiscountValue(presentDiscount);
    }

    applyProductAutoDiscount(pro);
    setSelectedProduct(pro);

    if (localCartInfo && localCartInfo.cartKey) {
      let returnObj = setCartInfoFromLocalKey(localCartInfo?.cartKey, pro);
      localCartInfo = returnObj?.default_cart_object;
      let localTableData = returnObj?.allLocalData;
    } else if (registerData.table_numbers == "") {
      localCartInfo = createNewCartwithKeyandPush(
        "DRAFT_CART",
        pro,
        registerData
      );
      setLocalDetails(localCartInfo);
    }
  };

  function addOneQuantity(records, checkPlus) {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo?.cartKey,
      registerData
    );

    if (
      localCartInfo &&
      (localCartInfo?.Status == "Unpaid" ||
        localCartInfo?.hasOwnProperty("onlineOrder"))
    ) {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex((product, findIndex) => {
        if (product.key === records.key) {
          if (findIndex != -1 && checkPlus == undefined) {
            selectedProduct[findIndex].quantity = ++selectedProduct[findIndex]
              .quantity;
            selectedProduct[findIndex].newqty =
              selectedProduct[findIndex].quantity;
            let price1 = 0;

            if (selectedProduct[findIndex].price) {
              price1 = selectedProduct[findIndex].price;
            } else {
              price1 = selectedProduct[findIndex].key_price;
            }

            if (
              selectedProduct[findIndex].discountType == "free_item" &&
              selectedProduct[findIndex]?.customDiscountedValue
            ) {
              if (
                selectedProduct[findIndex].quantity *
                  selectedProduct[findIndex].price >=
                selectedProduct[findIndex].discountData *
                  selectedProduct[findIndex].price
              ) {
                selectedProduct[findIndex].customDiscountedValue =
                  selectedProduct[findIndex].price *
                  selectedProduct[findIndex].discountData;
              } else {
                selectedProduct[findIndex].customDiscountedValue =
                  selectedProduct[findIndex].quantity *
                  selectedProduct[findIndex].price;
              }
              // } else {
              //   if (selectedProduct[findIndex]?.discountData) {
              //     if (
              //       selectedProduct[findIndex].quantity * price1 >=
              //       selectedProduct[findIndex].discountData
              //     ) {
              //       // if((selectedProduct[findIndex].discountData * price1)>=selectedProduct[findIndex].calculatedprice){
              //       // selectedProduct[findIndex].customDiscountedValue = selectedProduct[findIndex].calculatedprice
              //       // }else{
              //       selectedProduct[findIndex].customDiscountedValue =
              //         selectedProduct[findIndex].discountData * price1;
              //       // }
              //     } else {
              //       selectedProduct[findIndex].customDiscountedValue =
              //         selectedProduct[findIndex].quantity * price1;
              //     }
              //   }
            }
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].calculatedprice =
              selectedProduct[findIndex].quantity * price;
            if (selectedProduct[findIndex].productInclusivePrice != undefined) {
              selectedProduct[findIndex].productInclusivePricecalculatedprice =
                selectedProduct[findIndex].quantity *
                (selectedProduct[findIndex].productInclusivePriceKeyPrice
                  ? selectedProduct[findIndex].productInclusivePriceKeyPrice
                  : selectedProduct[findIndex].productInclusivePrice);
            }
            //used to set custom discount as quantity vary
            if (selectedProduct[findIndex].discountType === "cash") {
            } else if (
              selectedProduct[findIndex].discountType === "percentage"
            ) {
              selectedProduct[findIndex].customDiscountedValue = Number(
                (selectedProduct[findIndex]?.calculatedprice / 100) *
                  selectedProduct[findIndex].discountData
              ).toFixed(2);
            }
            applyDiscount(findIndex);
            selectedProduct.splice(findIndex, 1);
            selectedProduct.unshift(product);
          }

          return product;
        }
      });

      if (findIndex != -1 && checkPlus) {
        selectedProduct[findIndex].quantity = ++selectedProduct[findIndex]
          .quantity;
        selectedProduct[findIndex].newqty = selectedProduct[findIndex].quantity;
        let price1 = 0;

        if (selectedProduct[findIndex].price) {
          price1 = selectedProduct[findIndex].price;
        } else {
          price1 = selectedProduct[findIndex].key_price;
        }

        if (
          selectedProduct[findIndex].discountType == "free_item" &&
          selectedProduct[findIndex]?.customDiscountedValue
        ) {
          if (
            selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price >=
            selectedProduct[findIndex].discountData *
              selectedProduct[findIndex].price
          ) {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].price *
              selectedProduct[findIndex].discountData;
          } else {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price;
          }
          // } else {
          //   if (selectedProduct[findIndex]?.discountData) {
          //     if (
          //       selectedProduct[findIndex].quantity * price1 >=
          //       selectedProduct[findIndex].discountData
          //     ) {
          //       // if((selectedProduct[findIndex].discountData * price1)>=selectedProduct[findIndex].calculatedprice){
          //       // selectedProduct[findIndex].customDiscountedValue = selectedProduct[findIndex].calculatedprice
          //       // }else{
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].discountData * price1;
          //       // }
          //     } else {
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].quantity * price1;
          //     }
          //   }
        }
        let price = getProductPrice(selectedProduct[findIndex]);
        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        if (selectedProduct[findIndex].productInclusivePrice != undefined) {
          selectedProduct[findIndex].productInclusivePricecalculatedprice =
            selectedProduct[findIndex].quantity *
            (selectedProduct[findIndex].productInclusivePriceKeyPrice
              ? selectedProduct[findIndex].productInclusivePriceKeyPrice
              : selectedProduct[findIndex].productInclusivePrice);
        }
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   // selectedProduct[findIndex]?.quantity *
          //     selectedProduct[findIndex].discountData
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              selectedProduct[findIndex].discountData
          ).toFixed(2);
        }
        applyDiscount(findIndex);
      }

      setSelectedProduct([...selectedProduct]);
      if (localCartInfo) {
        let returnObj = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
        localCartInfo = returnObj?.default_cart_object;
        let localTableData = returnObj?.allLocalData;
      }
      return selectedProduct[findIndex].quantity;
    }
  }

  function applyDiscountNegetive(findIndex) {
    if (manualCouponObject != null) {
      let presentInBuy = manualCouponObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualCouponObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
          if (selectedProduct[findIndex]?.quantity === 0) {
            setManualCouponObject(null);
            applyProductAutoDiscount(selectedProduct);
          }
        }
      } else {
        let presentInGet = manualCouponObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualCouponObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
          if (selectedProduct[findIndex]?.quantity === 0) {
            setManualCouponObject(null);
            applyProductAutoDiscount(selectedProduct);
          }
        }
      }
    } else {
      let presentInBuy = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(selectedProduct[findIndex].id);
      });
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
            return o2.get_products.includes(o1.id);
          });
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
        }
      } else {
        let presentInGet = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.get_products.includes(selectedProduct[findIndex].id);
        });
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
              return o2.buy_products.includes(o1.id);
            });
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
        }
      }
    }
  }

  function removeOneQuantity(records) {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo?.cartKey,
      registerData
    );
    if (
      (localCartInfo && localCartInfo?.Status == "Unpaid") ||
      localCartInfo?.hasOwnProperty("onlineOrder")
    ) {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex(
        (product) => product.key === records.key
      );

      if (findIndex != -1) {
        selectedProduct[findIndex].quantity = --selectedProduct[findIndex]
          .quantity;
        selectedProduct[findIndex].newqty = selectedProduct[findIndex].quantity;
        if (
          selectedProduct[findIndex].quantity *
            selectedProduct[findIndex].price <
          selectedProduct[findIndex].customDiscountedValue
        ) {
          selectedProduct[findIndex].customDiscountedValue =
            selectedProduct[findIndex].quantity *
            selectedProduct[findIndex].price;
        }
        let price = getProductPrice(selectedProduct[findIndex]);

        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        if (selectedProduct[findIndex].productInclusivePrice != undefined) {
          selectedProduct[findIndex].productInclusivePricecalculatedprice =
            selectedProduct[findIndex].quantity *
            (selectedProduct[findIndex].productInclusivePriceKeyPrice
              ? selectedProduct[findIndex].productInclusivePriceKeyPrice
              : selectedProduct[findIndex].productInclusivePrice);
        }
        // removeOneQuantityOrderTikets(selectedProduct[findIndex]);
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   selectedProduct[findIndex]?.quantity *
          //     Number(selectedProduct[findIndex].discountData)
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              Number(selectedProduct[findIndex].discountData)
          ).toFixed(2);
        }
        applyDiscountNegetive(findIndex);
      }
      let presentDiscount = selectedProduct.filter(
        (data) =>
          parseInt(data.discountedValue) !== 0 &&
          data.discountedValue !== undefined
      );
      let presentCustomDiscount = selectedProduct.some(
        (data) =>
          data.customDiscountedValue !== 0 &&
          data.customDiscountedValue !== undefined
      );
      setDiscountValue([{ presentDiscount }]);
      setCustomDiscountValue(presentCustomDiscount);
      selectedProduct = selectedProduct.filter((i) => !i.quantity == 0);
      setSelectedProduct([...selectedProduct]);
      if (localCartInfo && localCartInfo.cartKey) {
        let returnObj = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
        localCartInfo = returnObj.default_cart_object;
      }
    }
  }
  const [TagList, setTagList] = useState(
    allLocalData?.customFields?.tag?.length > 0
      ? allLocalData.customFields.tag
      : []
  );

  function applyProductAutoDiscount(pro) {
    let discountObject = getDiscountObject(pro);
    let apply_discount_only_once_per_order = discountObject
      ? discountObject.apply_discount_only_once_per_order
      : false;
    let index = pro?.findIndex(function(o1) {
      return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(o1.id);
      });
    });
    if (index !== -1) {
      getItem("ApplyBuyOneGetOne") &&
        getItem("ApplyBuyOneGetOne").map((data) =>
          pro.map((item) => {
            if (data.get_products.includes(item.id)) {
              let price = getProductPrice(item);
              item.discountedValue = apply_discount_only_once_per_order
                ? price
                : Number(item.quantity * price).toFixed(2);
            }
          })
        );
    }
    var presentDiscount = pro.filter(
      (data) => data.discountedValue !== 0 && data.discountedValue !== undefined
    );
    let presentCustomDiscount = pro.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );
    setDiscountValue(presentDiscount);
    setCustomDiscountValue(presentCustomDiscount);
    setAdddiscountValue(presentDiscount);
  }

  function productDetails(productdetails, click) {
    if (
      (localCartInfo && localCartInfo?.Status == "Unpaid") ||
      localCartInfo?.hasOwnProperty("onlineOrder")
    ) {
      setNotUpdate(true);
    } else {
      let details = JSON.parse(JSON.stringify(productdetails));
      if (
        details.option_variant_group.length > 0 ||
        details.option_addon_group.length > 0 ||
        details.option_item_group.length > 0
      ) {
        setNewProductdetailsVisible(true);
        let isVarience = false;
        let isAddon = false;
        let isAddon1st = false;
        let isAddon2nd = false;
        let isAddon3rd = false;
        let isAddon4rd = false;
        let isAddon5rd = false;
        let product_variants = [];
        let isAddon1stOptions = [];
        let isAddon2ndOptions = [];
        let isAddon3rdOptions = [];
        let isAddon4rdOptions = [];
        let isAddon5rdOptions = [];
        let AddonOptions = [];

        if (details.option_variant_group.length >= 1) {
          isVarience = true;
          product_variants = details.option_variant_group[0].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));
          product_variants.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_variant_group[0].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 2) {
          isVarience = true;
          product_variants = details.option_variant_group[1].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          product_variants.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_variant_group[1].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 3) {
          isVarience = true;
          product_variants = details.option_variant_group[2].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          product_variants.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_variant_group[2].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 4) {
          isVarience = true;
          product_variants = details.option_variant_group[3].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          product_variants.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_variant_group[3].product_variants = product_variants;
        }
        if (details.option_variant_group.length >= 5) {
          isVarience = true;
          product_variants = details.option_variant_group[4].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          product_variants.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_variant_group[4].product_variants = product_variants;
        }

        if (details.option_addon_group.length > 0) {
          isAddon = true;
        }

        if (details.option_addon_group.length >= 1) {
          isAddon1st = true;
          isAddon1stOptions = details.option_addon_group[0].product_addons;
          isAddon1stOptions = isAddon1stOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          isAddon1stOptions.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_addon_group[0].product_addons = isAddon1stOptions;
        }

        if (details.option_addon_group.length >= 2) {
          isAddon2nd = true;
          isAddon2ndOptions = details.option_addon_group[1].product_addons;
          isAddon2ndOptions = isAddon2ndOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          isAddon2ndOptions.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_addon_group[1].product_addons = isAddon2ndOptions;
        }

        if (details.option_addon_group.length >= 3) {
          isAddon3rd = true;
          isAddon3rdOptions = details.option_addon_group[2].product_addons;
          isAddon3rdOptions = isAddon3rdOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          isAddon3rdOptions.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_addon_group[2].product_addons = isAddon3rdOptions;
        }
        if (details.option_addon_group.length >= 4) {
          isAddon4rd = true;
          isAddon4rdOptions = details.option_addon_group[3].product_addons;
          isAddon4rdOptions = isAddon4rdOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          isAddon3rdOptions.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_addon_group[3].product_addons = isAddon4rdOptions;
        }
        if (details.option_addon_group.length >= 5) {
          isAddon5rd = true;
          isAddon5rdOptions = details.option_addon_group[4].product_addons;
          isAddon5rdOptions = isAddon5rdOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          isAddon3rdOptions.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
          details.option_addon_group[4].product_addons = isAddon5rdOptions;
        }
        AddonOptions = [
          ...isAddon1stOptions,
          ...isAddon2ndOptions,
          ...isAddon3rdOptions,
          ...isAddon4rdOptions,
          ...isAddon5rdOptions,
        ];

        if (details.option_addon_group) {
          details.option_addon_group.sort((a, b) =>
            a.sort_order > b.sort_order ? 1 : -1
          );
        }

        details.option_variant_group.sort((a, b) =>
          a.sort_order > b.sort_order ? 1 : -1
        );

        //option_variant_group = option_variant_group.map(v => ({...v, isActive: true}))
        let taxes = 0;
        details.tax_group.taxes.map((data) => {
          taxes += data.tax_percentage;
        });

        let Details = {
          key: details._id,
          id: details._id,
          item: details.product_name,
          display_name: details.product_name,
          price: details.price,
          calculatedprice: details.price,
          quantity: 1,
          productInclusivePrice: details.productInclusivePrice,
          productInclusivePricecalculatedprice: details.productInclusivePrice,
          newqty: 1,
          option_variant_group: details.option_variant_group,
          old_varints_group: details.option_variant_group,
          option_addon_group: details.option_addon_group,
          cal: details.calculatedprice,
          qty: details.quantity,
          new_item: true,
          isAddon: isAddon,
          isAddon1st: isAddon1st,
          isAddon2nd: isAddon2nd,
          isAddon3rd: isAddon3rd,
          AddonOptions: AddonOptions,
          isVarience: isVarience,
          variance_price: 0,
          variance_object: {},
          productTaxes: details.tax_group.Totaltax,
          taxGroup: details.tax_group,
          option_item_group: details.option_item_group,
          option_status: details.option_status,
          order_ticket_group: details.product_category.order_ticket_group,
          notes: details.notes,
          add_or_remove: "Added Items",
          product_category: details.product_category.category_name,
        };

        setNewProductData(Details);
        // updateCartCount();
        return;
      } else {
        const getProductAddedIndex = selectedProduct.findIndex(
          (product) => product.key === details._id
        );
        if (getProductAddedIndex === -1) {
          let isVarience = false;
          let isAddon = false;
          let isAddon1st = false;
          let isAddon2nd = false;
          let isAddon3rd = false;

          let AddonOptions = [];

          let product = {
            key: details._id,
            id: details._id,
            key_price: 0,
            item: details.product_name,
            display_name: details.product_name,
            productInclusivePrice: details.productInclusivePrice,
            productInclusivePricecalculatedprice: details.productInclusivePrice,
            productInclusivePriceKeyPrice: 0,
            price: details.price,
            calculatedprice: details.price,
            quantity: 1,
            newqty: 1,
            notes: details.notes,
            option_variant_group: details.option_variant_group,
            option_addon_group: details.option_addon_group,
            cal: details.calculatedprice,
            new_item: true,
            isAddon: isAddon,
            isAddon1st: isAddon1st,
            isAddon2nd: isAddon2nd,
            isAddon3rd: isAddon3rd,
            AddonOptions: AddonOptions,
            isVarience: isVarience,
            variance_price: 0,
            variance_object: {},
            productTaxes: details.tax_group.Totaltax,
            taxGroup: details.tax_group,
            option_item_group: details.option_item_group,
            add_or_remove: "Added Items",
            order_ticket_group: details.product_category.order_ticket_group,
            product_category: details.product_category.category_name,
          };

          let pro = [product, ...selectedProduct];
          setSelectedProduct(pro);
          updateCartCount();
          if (manualCouponObject == null) {
            applyProductAutoDiscount(pro);
          }
          setItem("product_Details", pro);
          if (
            localCartInfo != undefined &&
            Object.keys(localCartInfo).length > 0
          ) {
            let returnObj = setCartInfoFromLocalKey(
              getItem("active_cart"),
              pro
            );
            localCartInfo = returnObj?.default_cart_object;
            let localTableData = returnObj?.allLocalData;
          } else if (registerData.table_numbers == "") {
            localCartInfo = createNewCartwithKeyandPush(
              "DRAFT_CART",
              [...selectedProduct, product],
              registerData
            );
          }
        } else {
          updateCartCount();
          return addOneQuantity(selectedProduct[getProductAddedIndex]);
        }
      }
    }
  }

  function existsInManualDiscountProducts(discountObject, product) {
    let exists = false;
    if (discountObject !== null) {
      let presentInBuy = discountObject.buy_products.includes(product.id);
      if (presentInBuy) {
        exists = true;
      } else {
        let presentInGet = discountObject.get_products.includes(product.id);
        if (presentInGet) {
          exists = true;
        }
      }
    }
    return exists;
  }

  const removeSelectedItems = (itemToRemove) => {
    setEditProductModalVisible(false);
    const findIndex = selectedProduct.findIndex(
      (product) => product.key === itemToRemove.key
    );
    selectedProduct.splice(findIndex, 1);
    let exists = existsInManualDiscountProducts(
      manualCouponObject,
      itemToRemove
    );
    if (exists) {
      setManualCouponObject(null);
      setStaticManualCouponObject(null);
      removeAllDiscounts();
      applyProductAutoDiscount(selectedProduct);
    }
    setSelectedProduct([...selectedProduct]);

    if (localCartInfo && localCartInfo?.cartKey) {
      let returnObj = setCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        selectedProduct
      );
      localCartInfo = returnObj?.default_cart_object;
      let localTableData = returnObj?.allLocalData;
    }
  };

  const emptyCart = () => {
    setSelectedProduct([]);
    setTableName();
    setselectedTable();
    setPaymentType("cash");
    setBingageBalance(false);
    setBulckDisountDetails({
      click: false,
      type: "FLAT",
      value: 0,
    });
    setBulckDiscontButtonText({
      text: "Bulk discount",
      color: "#008cba",
      discountValue: 0,
    });
    if (localCartInfo?.cartKey) {
      let response = removeCartFromLocalStorage(
        localCartInfo.cartKey,
        registerData
      );
      if (response?.allLocalData) {
        getItem("waiter_app_enable") &&
          socket?.emit("send_local_table_data", response.allLocalData);
      }
      setSelectedProduct([]);
      setselectedTable();
      setlocalCartInfo({});
      localCartInfo = {};

      setCustomer("Add Customer");
      setCustomerData(null);
      updateCartCount();
      if (response?.allLocalData) {
        registerData.table_numbers != ""
          ? tabChangeToCurrent("ORDER")
          : setChargeClick(false);
        setSelectedProduct([]);
        fetchAllAddtionalChargeList();
      } else {
        // alert("notclear");
      }
    } else {
      // alert("not find localData");
    }
  };

  const makeDraftOnHold = () => {
    setEditTableNameModal(true);
  };

  const redirectToCurrentFunc = () => {
    tabChangeToCurrent("CURRENT");
  };

  const saveFromEditModal = (formData, getProduct, ops) => {
    let checkItemSame = selectedProduct.filter(
      (val, index) => val.key === getProduct.key
    );
    const findIndex = getProduct.index;

    if (checkItemSame.length == 2) {
      selectedProduct.splice(findIndex, 1);
      let indexOfproduct = selectedProduct.findIndex(
        (val, index) => val.key === getProduct.key
      );

      selectedProduct[indexOfproduct].quantity = ++selectedProduct[
        indexOfproduct
      ].quantity;
      let price = getProductPrice(selectedProduct[indexOfproduct]);
      selectedProduct[indexOfproduct].calculatedprice =
        selectedProduct[indexOfproduct].quantity * price;

      if (selectedProduct[indexOfproduct].productInclusivePrice != undefined) {
        selectedProduct[indexOfproduct].productInclusivePricecalculatedprice =
          selectedProduct[indexOfproduct].quantity *
          (selectedProduct[indexOfproduct].productInclusivePriceKeyPrice
            ? selectedProduct[indexOfproduct].productInclusivePriceKeyPrice
            : selectedProduct[indexOfproduct].productInclusivePrice);
      }
      setSelectedProduct([...selectedProduct]);
    } else {
      selectedProduct[findIndex] = getProduct;
    }

    let presentDiscount = selectedProduct.filter(
      (data) =>
        parseInt(data.discountedValue) !== 0 &&
        data.discountedValue !== undefined
    );
    let presentCustomDiscount = selectedProduct.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );
    setDiscountValue([{ presentDiscount }]);
    setCustomDiscountValue(presentCustomDiscount);

    setSelectedProduct([...selectedProduct]);
    setEditProductModalVisible(false);
    if (localCartInfo && localCartInfo.cartKey) {
      let returnObj = setCartInfoFromLocalKey(localCartInfo?.cartKey, [
        ...selectedProduct,
      ]);

      localCartInfo = returnObj?.default_cart_object;
      let localTableData = returnObj?.allLocalData;
    }
  };

  function productDetailsForEdit(details2, index) {
    details2.index = index;
    setEditProductModalVisible(true);

    setProductDetailsForUpdate(details2);
  }

  function CalculationAddtionalCharge(e, id) {
    AddtionalChargeList.map((value) => {
      if (value._id === id) {
        value.is_automatically_added = e.target.checked;
        setAddtionalChargeList([...AddtionalChargeList]);

        if (value.is_automatically_added === true) {
          tickAdditionalList.push(value);
        }
      }
    });
  }
  //List View
  const [charWiseProductList, setCharWiseProductList] = useState([]);

  let searchItemsList = [];

  if (searchItems != "" && onClickList == false) {
    searchItemsList = charWiseProductList.filter((value) => {
      return value.product_name
        .toLowerCase()
        .includes(searchItems.toLowerCase());
    });
  }

  function AddAdditionalCharge() {
    return (
      <div className="adib_btns">
        <p className="custom-label">Select applicable charges</p>
        <div className="checkboxGroup">
          {AddtionalChargeList.map((value, index) => {
            if (value.is_automatically_added === true) {
              tickAdditionalList.push(value);
            }
            return (
              <>
                <Checkbox
                  defaultChecked={value.is_automatically_added}
                  key={index}
                  onChange={(e) => CalculationAddtionalCharge(e, value._id)}
                >
                  {value.charge_type === "percentage"
                    ? `${value.charge_name} - ${Number(
                        value.charge_value
                      ).toFixed(2)}%`
                    : `${value.charge_name} - ${rsSymbol}${Number(
                        value.charge_value
                      ).toFixed(2)}`}
                </Checkbox>
                <br></br>
              </>
            );
          })}
        </div>
        <Button
          size="small"
          type="success"
          style={{
            marginLeft: 40,
            marginTop: 10,
            background: "#BD025D",
            color: "white",
            border: "#BD025D",
          }}
          onClick={() => {
            setPopoverVisibleAdditional(false);
          }}
        >
          Done
        </Button>
      </div>
    );
  }

  function getProductPrice(product) {
    let price = 0;
    if (product.isVarience) {
      price = Number(product.key_price);
    } else {
      price = Number(product.price);
    }
    return price;
  }

  function calQty(idodproduct) {
    if (selectedProduct.length > 0) {
      let totalQuantity = 0;
      let CurrentProduct = selectedProduct.filter(
        (value) => value.id === idodproduct
      );

      if (CurrentProduct.length > 0) {
        CurrentProduct.map((value) => (totalQuantity += value.quantity));
        return `${totalQuantity} x`;
      }
    }
  }

  let cartinfo = {
    itemsSold: selectedProduct,
    customer: CustomerData,
    totalPrice: totalcalculatedPrice,
    customerMobialNumber: customer,
    PaymentTypeList,
    totalTaxes: totalcalculatedTax,
    onMobialNumberFiledEnterClick: onSearch,
    round_off_value: round,
    tableName: tableName,
    order_by: userDetailData,
  };

  const cancelOrdertikets = async (ReceiptNumber, cancelBookingObj) => {
    let orderData = {};

    let receipt_number = ReceiptNumber;

    orderData.actual_time = new Date();

    orderData["ReceiptNumber"] = receipt_number;
    orderData.updatePaymentDate = new Date();
    orderData.customer = {
      mobile: CustomerData?.mobile
        ? Number(CustomerData.mobile)
        : customer == "Add Customer"
        ? ""
        : Number(customer),
      email: CustomerData?.email == undefined ? "" : CustomerData?.email,
      name: CustomerData?.name,
      shipping_address: CustomerData?.shipping_address,
      zipcode: CustomerData?.zipcode,
      city: CustomerData?.city,
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
        itemsSold: selectedProduct,
        fulfillmentStatus: "Unfulfilled",
        tableName: tableName,
        order_by_name: userDetailData,
        bingagePaymnetType: PaymentType,
        register_data: registerData,
        immediate_sale: {
          multiple_payments_type:
            localCartInfo?.type == "booking_cart"
              ? [
                  {
                    name: PaymentType,
                    value: totalcalculatedPrice,
                    paymentDate: new Date(),
                  },
                ]
              : [],
        },
        priceSummery: {
          total:
            localCartInfo?.type == "booking_cart" ? totalcalculatedPrice : 0,
          totalTaxes: 0,
          orderCacel: true,
        },
      };
    }
    let inventoryList = allLocalData?.inventorys?.map((val) => {
      if (val.linked_registers.includes(registerData._id)) {
        return val._id;
      }
    });

    if (inventoryList?.length) {
      orderData.details.inventoryList = inventoryList.filter(
        (val) => val != undefined
      );
    }
    if (localCartInfo?.onlineOrder) {
      orderData.details.onlineOrder = localCartInfo.onlineOrder;
    }
    if (
      getItem("orderTicketButton") != null &&
      getItem("orderTicketButton") == true
    ) {
      let localData = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      );
      orderData.details.orderTicketsData = localData.orderTicketsData;
    }
    if (Number(bulckdiscuntButtonText.discountValue) > 0) {
      orderData.details.bulckDiscountValue = Number(
        bulckdiscuntButtonText.discountValue
      );
    }
    if (TotalAddtionalChargeValue > 0) {
      orderData.details.AddtionChargeValue = AddtionalChargeList;
    }

    if (CustomerData?.custom_fields) {
      let tagList = [];
      let additionalList = [];
      TagList.map((field) => {
        CustomerData.custom_fields.map((val) => {
          if (val.type == "tag" && field.name == val.name) {
            tagList.push(field);
          } else if (val.type == "additional_detail") additionalList.push(val);
        });
      });
      orderData.details.custom_fields = tagList;
      orderData.details.customer_custom_fields = additionalList;
      return;
    }

    let getOrder;

    if (localCartInfo?.type == "booking_cart") {
      orderData.ReceiptNumber = getReceiptNumber(registerData, []);
      orderData.receiptCreate = true;
      orderData.draftList = false;
      getOrder = await dispatch(
        AddAndUpdateBooking(orderData, localCartInfo?.bookingDetails._id)
      );

      if (getOrder && getOrder.bookingData) {
        let cancelObj = cancelBookingObj
          ? cancelBookingObj
          : {
              cancel_Date: new Date(),
              refund_amount: 0,
              refund_pay_type: "cash",
            };
        const getCancelOrder = await dispatch(
          cancelOrder(
            {
              cancellation: cancelObj,
            },
            getOrder.bookingData._id
          )
        );
      }
    } else {
      getOrder = await dispatch(CreateOrder(orderData));
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
    }
  };
  const cancelreceipt = (cancelObject, checkOnlineCancel) => {
    if (
      localCartInfo &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData) &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData)
        ?.orderTicketsData
    ) {
      localCartInfo = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      );
      let receipt_number =
        localCartInfo?.orderTicketsData?.length > 0
          ? localCartInfo.orderTicketsData[0].receiptNumberDetails.number
          : getReceiptNumber(registerData, OrderTicketsData);

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
        obj2.push({
          key: prop,
          newqty: holder[prop],
        });
      }

      let filterCancelList = obj2.map((val) => {
        let product = totalOrderTikets.find((itm) => itm.key == val.key);
        product.newqty = val.newqty;
        product.add_remove = "Removed Items";
        return product;
      });

      let arrayData = Object.values(
        filterCancelList.reduce(function(res, value) {
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
      let createOrderTiketsList = [];
      console.log("pppppppqqqqqqqqqq", arrayData);
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
          add_remove: "Removed Items",
          itemList: val.data,
          enterDate: new Date(),
          table_name: selectedTable,
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
        let multipleDifrentKithen = ReactDOMServer.renderToStaticMarkup(
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
            TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
          />
        );

        let setupfind = setupList.find(
          (val1) =>
            val1.printer_type ==
            (localCartInfo?.onlineOrder ? "Main Kitchen" : val.categoryName)
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
            TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
          />
        );
        window.frames["print_frame"].window.focus();
        // window.frames["print_frame"].window.print();
        // if (
        //   getItem("print_server_copy") !== null &&
        //   getItem("print_server_copy") == true
        // ) {
        //   let servercopy = ReactDOMServer.renderToStaticMarkup(
        //     <OrderTicketPrint
        //       title="SERVER COPY"
        //       categoryDetails={object}
        //       PreviousTikets={PreviousTikets}
        //       ReceiptNumber={receipt_number}
        //       TableName={
        //         localCartInfo?.tableName ? localCartInfo?.tableName : ""
        //       }
        //     />
        //   );
        //   let obj = {
        //     printerName:
        //       setupfind?.connected_printer_name &&
        //       setupfind?.connected_printer_name != ""
        //         ? setupfind?.connected_printer_name
        //         : undefined,
        //     printDiv: servercopy,
        //     top: setupfind?.top ? setupfind?.top : undefined,
        //     left: setupfind?.left ? setupfind?.left : undefined,
        //     content_size: setupfind?.content_size
        //       ? setupfind?.content_size
        //       : undefined,
        //   };
        //   numberOfKitchen.push(obj);
        // }
      });
      console.log("kokkokkadad", numberOfKitchen);
      setListOfUpdatedProduts([]);
      setOrderTickets(localCartInfo?.cartKey, createOrderTiketsList);
      cancelOrdertikets(receipt_number, cancelObject);
      sendPrintReq(numberOfKitchen);
    } else {
      cancelOrdertikets("re", cancelObject);
    }
  };

  let handlePopUpModel = () => {
    cancelreceipt();
    setSelectedProduct([]);
    setDiscountMoreThanTotal("Bulk Discount");
    setColorBulk("#bd025d");

    emptyCart();
    setItem("discount", false);
    setPopUpModel(false);
  };

  const modelNameViewer = (value) => {
    setModelViewData(value);
  };

  const chargeOnClick = () => {
    if (
      getItem("product_Details") !== null &&
      getItem("product_Details").length > 0
    ) {
      if (
        getItem("enforce_customer_mobile_number") &&
        customer === "Add Customer"
      ) {
        setEnforceCustomer(true);
      } else {
        setCartAndCustomerDataAndNavigate();
      }
    }
  };

  const [modelopened, setModelOpened] = useState(false);

  const handleKeyDown = (event, current) => {
    if (event.keyCode == 120) {
      let localDataInfo;
      if (
        localCartInfo &&
        localCartInfo.cartKey &&
        getCartInfoFromLocalKey(localCartInfo.cartKey, registerData)
      ) {
        localDataInfo = getCartInfoFromLocalKey(
          localCartInfo.cartKey,
          registerData
        );
      } else if (getItem("active_cart") != null && getItem("active_cart")) {
        localDataInfo = getCartInfoFromLocalKey(
          getItem("active_cart"),
          registerData
        );
      }

      if (
        getItem("orderTicketButton") !== null &&
        getItem("orderTicketButton") == true
      ) {
        if (
          localDataInfo &&
          localDataInfo.data?.length > 0 &&
          orderTiketModalVisible == false
        ) {
          setKey(!key);
          setOrderTiketModalVisible(true);
          setModelOpened(true);
        }
      }

      return;
    }

    // if (event.keyCode == 113) {
    //   if (
    //     getItem("product_Details") !== null &&
    //     getItem("product_Details").length > 0
    //   ) {
    //     setKey(!key);
    //     chargeOnClick();
    //   }
    //   return;
    // }

    if (event.keyCode == 119) {
      inputRef.current.focus();
      return;
    }
  };

  useEffect(() => {
    setDarftCount(
      getItem("LOCAL_STORAGE_CART_KEY_NAME")?.filter(
        (d) => d.type == "DRAFT_CART" && d.register_id == registerData._id
      ).length
    );
  }, [selectedProduct, localDetails]);
  let otherDetails = {};

  otherDetails.customer = {
    mobile: CustomerData?.mobile
      ? CustomerData.mobile
      : customer == "Add Customer"
      ? "Add Customer"
      : customer,
    email: CustomerData?.email == undefined ? "" : CustomerData?.email,
  };

  if (CustomerData?.name) {
    otherDetails.customer["name"] = CustomerData?.name;
  }
  if (CustomerData?.shipping_address) {
    otherDetails.customer["shipping_address"] = CustomerData?.shipping_address;
  }
  if (CustomerData?.zipcode) {
    otherDetails.customer["zipcode"] = CustomerData?.zipcode;
  }
  if (CustomerData?.city) {
    otherDetails.customer["city"] = CustomerData?.city;
  }

  // store a other details
  otherDetails.bulkDiscountDetails = {
    ...buclkDiscontDetails,
    bulkValue: bulckdiscuntButtonText.discountValue,
  };
  otherDetails.AddtionalChargeList = AddtionalChargeList;
  otherDetails.TotalAddtionalChargeValue = TotalAddtionalChargeValue;
  otherDetails.finalCharge = totalcalculatedPrice;
  otherDetails.chargeClick = chargeClick;

  if (localCartInfo && localCartInfo.cartKey) {
    storeOtherData(localCartInfo.cartKey, otherDetails);
  } else if (localDetails) {
    storeOtherData(localDetails.cartKey, otherDetails);
  }

  let registerDatadetails = allLocalData.register.find((val) => val.active);
  const didMount = useRef(false);
  // useEffect(() => {
  //   if (didMount.current) {
  //     if (registerData.table_numbers == "") {
  //       setlocalCartInfo({});
  //       removeItem("active_cart");

  //       setCustomer("Add Customer");
  //       setCustomerData(null);

  //       setBulckDisountDetails({
  //         click: false,
  //         type: "FLAT",
  //         value: 0,
  //       });
  //       setBulckDiscontButtonText({
  //         text: "Bulk discount",
  //         color: "#008cba",
  //         discountValue: 0,
  //       });
  //       let localData = allLocalData;

  //       fetchAllAddtionalChargeList();
  //       setSelectedProduct([]);
  //       setTableName("Current Sale");
  //     } else {
  //       localCartInfo = {};
  //       setlocalCartInfo({});
  //       removeItem("active_cart");
  //       setCustomer("Add Customer");
  //       setCustomerData(null);
  //       setBulckDisountDetails({
  //         click: false,
  //         type: "FLAT",
  //         value: 0,
  //       });
  //       setBulckDiscontButtonText({
  //         text: "Bulk discount",
  //         color: "#008cba",
  //         discountValue: 0,
  //       });

  //       fetchAllAddtionalChargeList();
  //       setSelectedProduct([]);

  //       setTableName();
  //     }
  //   } else {
  //     didMount.current = true;
  //   }
  // }, [registerDatadetails._id]);
  useEffect(() => {
    if (localCartInfo?.onlineOrder?.disconut) {
      setBulckDisountDetails({
        click: false,
        type: "FLAT",
        value: localCartInfo.onlineOrder.disconut,
      });
      setBulckDiscontButtonText({
        text: `Bulk discount ${rsSymbol}${Number(
          localCartInfo?.onlineOrder?.disconut
        ).toFixed(2)}`,
        color: "#008cba",
        discountValue: localCartInfo.onlineOrder.disconut,
      });
    }
  }, []);

  // cancel Booking
  const [cancelPaymentType, setCancelPaymentType] = useState();
  const cancelReceipts = (localData) => {
    if (localData.type != "booking_cart") {
      setPopUpModel(true);
      setPopUpData(localData);
    } else {
      if (
        Number(
          localData?.bookingDetails?.details?.bookingDetails?.booking_advance
        ) > 0
      ) {
        form1.setFieldsValue({
          refund_amount: Number(
            localData.bookingDetails.details.bookingDetails.booking_advance
          ),
        });
        setRefundAmount(
          Number(
            localData.bookingDetails.details.bookingDetails.booking_advance
          )
        );
        setModalVisibleOrderCancel(true);
      } else {
        setPopUpModel(true);
      }
      setPopUpData(localData);
    }
  };

  const cancellationBooking = (value) => {
    form1
      .validateFields()
      .then(async (formData) => {
        setModalVisibleOrderCancel(false);
        formData.cancel_Date = new Date();

        let obj = { ...formData };

        cancelreceipt(obj);
        setSelectedProduct([]);
        setDiscountMoreThanTotal("Bulk Discount");
        setColorBulk("#bd025d");

        emptyCart();
        setItem("discount", false);
        setPopUpModel(false);
      })
      .catch((errorInfo) => errorInfo);
  };
  setItem("product_Details", selectedProduct);
  let statusUnpaid = false;

  const columns = () => {
    let cols = [
      {
        title: "Item",
        dataIndex: "display_name",
        key: "display_name",
        width: "30%",
        render(text, record) {
          let text2 = text.toString();

          let newSpilitArray = text2.split(/[+]/);
          let newSpilitArray1 = text2.split(/[,]/);
          let finalArray = [];
          newSpilitArray.map((value) => {
            finalArray.push(value.replace(/,/gi, ""));
          });

          return {
            children: (
              <>
                {text2.includes("-") ? (
                  newSpilitArray1.map((val) => <div>{val}</div>)
                ) : (
                  <div>
                    {" "}
                    {finalArray.length > 1 ? (
                      <div>
                        {finalArray.map((value, index) => {
                          return (
                            <div>
                              {index > 0 ? "+" : null}
                              {value}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div>{text}</div>
                    )}
                  </div>
                )}
              </>
            ),
          };
        },
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "left",
        render(text, record, index) {
          return {
            children: (
              <>
                {getItem("hide_quantity_increase_decrease_buttons") ? (
                  <Input
                    className="qchnagew quantity_inp"
                    type="number"
                    min={1}
                    value={record.quantity}
                    onChange={(e) => {
                      qunatityChange(record, e);
                    }}
                  />
                ) : (
                  <div className="quantityies qucuentlft">
                    <span
                      className="qunatity-adjust"
                      onClick={() => text > 0 && removeOneQuantity(record)}
                    >
                      −
                    </span>
                    {text}
                    <span
                      className="qunatity-adjust"
                      onClick={() => addOneQuantity(record, "plusclick")}
                    >
                      +
                    </span>
                  </div>
                )}
              </>
            ),
          };
        },
      },
      {
        title: "Price",
        dataIndex: "calculatedprice",
        key: "calculatedprice",
        align: "left",
        render(text, value) {
          return {
            children: (
              <div>
                {rsSymbol}
                {Number(
                  value.productInclusivePricecalculatedprice
                    ? value.productInclusivePricecalculatedprice
                    : text
                ).toFixed(2)}
              </div>
            ),
          };
        },
      },
      {
        title: "",
        align: "center",
        render(text, record, index) {
          return {
            children: (
              <EditOutlined
                onClick={() => {
                  localCartInfo = getCartInfoFromLocalKey(
                    localCartInfo?.cartKey,
                    registerData
                  );
                  if (
                    (localCartInfo && localCartInfo?.Status == "Unpaid") ||
                    localCartInfo?.hasOwnProperty("onlineOrder")
                  ) {
                    setNotUpdate(true);
                  } else {
                    setItem("product_Details", selectedProduct);
                    productDetailsForEdit(record, index);
                  }
                }}
              />
            ),
          };
        },
      },
    ];

    let col_discount = {
      title: "Discount",
      align: "center",
      render(text, record, index) {
        return {
          children: (
            <div>
              {text.discountedValue ||
                (text.customDiscountedValue &&
                  text.quantity > 0 &&
                  `${rsSymbol}${text.discountedValue ||
                    text.customDiscountedValue} `)}
            </div>
          ),
        };
      },
    };

    if (status) {
      cols.splice(cols.length - 1, 0, col_discount);
    }

    return cols;
  };

  let locale = {
    emptyText: <span>Add items by selecting from the list.</span>,
  };
  const orderTable = useMemo(() => {
    return (
      <>
        <Table
          locale={locale}
          rowKey="key"
          className={
            getItem("enable_quick_billing")
              ? "tbl_data handleScroll-enable"
              : "tbl_data handleScroll-normal"
          }
          dataSource={selectedProduct}
          columns={columns()}
          size="small"
          // scroll={{
          //   y: getItem("enable_quick_billing")
          //     ? "calc(53vh - 130px)"
          //     : "calc(66vh - 130px)",
          // }}
          pagination={false}
          summary={(pageData) => {
            return (
              <>
                {selectedProduct.length ? (
                  <Table.Summary.Row>
                    {totalcalculatedTax > 0 && (
                      <>
                        <Table.Summary.Cell>Taxes</Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell className="center-tax">
                          <Text>
                            {rsSymbol}
                            {Number(totalcalculatedTax).toFixed(2)}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                      </>
                    )}
                  </Table.Summary.Row>
                ) : (
                  ""
                )}

                {getItem("doNotRoundOff") ? (
                  ""
                ) : selectedProduct.length > 0 ? (
                  <Table.Summary.Row>
                    {(round < 0 || round > 0) && (
                      <>
                        <Table.Summary.Cell>Roundoff</Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell className="center-tax">
                          <Text>
                            {rsSymbol}
                            {Number(round).toFixed(2)}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                      </>
                    )}
                  </Table.Summary.Row>
                ) : (
                  ""
                )}
              </>
            );
          }}
        />
      </>
    );
  }, [selectedProduct, status, totalcalculatedTax]);

  let tickImg = (
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
  );

  const productObjectMobialViewList = (product, index) => {
    let value = JSON.parse(JSON.stringify(product));
    let productShow = true;

    if (value && value._id) {
      if (value.priceBook?.length > 0) {
        let tabletype =
          localCartInfo && Object.keys(localCartInfo).length > 0
            ? localCartInfo.type == "delivery-local"
              ? "delivery"
              : localCartInfo.type == "custom-table-local"
              ? "dine_in"
              : localCartInfo.type == "take-away-local"
              ? "take_away"
              : "all_orders"
            : "all_orders";
        let pricebookDetails = value.priceBook.find((val) => {
          if (
            (val.orderType == tabletype || val.orderType == "all_orders") &&
            registerData._id == val.registerAssignedTo
          ) {
            return val;
          }
        });
        if (pricebookDetails) {
          value.price = pricebookDetails.priceBookPrice;

          if (pricebookDetails.disable) {
            productShow = false;
          }
        }
      }

      let orignalPrice = value.price;
      let totalTax = 0;
      value.price = Number(value.price);
      let itemPrice = 0;
      if (value.option_status === "combo") {
        if (value.option_item_group.length > 0) {
          value.option_item_group.map((item) => {
            let minimumArray = [];

            item.products.map((value) => {
              let FilterVarints = item.product_variants.filter(
                (data) => data.product_id._id === value._id
              );
              if (FilterVarints.length > 0) {
                FilterVarints.map((variant) => {
                  minimumArray.push(
                    variant.product_id.price + variant.variant_id.price
                  );
                });
              } else {
                minimumArray.push(value.price);
              }
            });
            let itemMinPrice = Math.min.apply(Math, minimumArray);
            itemPrice += itemMinPrice;
          });

          value.newPrice = Number(value.price + itemPrice);
        } else {
          value.newPrice = Number(value.price);
        }
      } else {
        if (value.option_variant_group.length > 0) {
          let varintsPrice = 0;
          value.option_variant_group.map((varints) => {
            let minimumArray = [];

            varints.product_variants.map((variant) => {
              minimumArray.push(variant.price);
            });
            let variantMinPrice = Math.min.apply(Math, minimumArray);
            varintsPrice += variantMinPrice;
          });
          value.newPrice = Number(value.price + varintsPrice);
        } else {
          value.newPrice = Number(value.price);
        }
      }

      if (value.product_name.length > 30) {
        let divideArray = value.product_name.match(/.{1,30}/g);
        value.Newproduct_name = value.product_name.replace(
          divideArray[1],
          ".."
        );
      }

      value &&
        value.tax_group &&
        value.tax_group.taxes &&
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));

      if (value?.tax_group) {
        value.tax_group.Totaltax = totalTax;
      }

      if (
        value.tax_group !== null &&
        value.tax_group.taxes_inclusive_in_product_price
      ) {
        value.productInclusivePrice = Number(orignalPrice);

        if (value?.option_variant_group?.length > 0) {
          value?.option_variant_group.map((val) => {
            val.product_variants.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value?.option_addon_group?.length > 0) {
          value?.option_addon_group.map((val) => {
            val.product_addons.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value.price === 0) {
          value.price = value.price;
        } else {
          let price1;
          if (totalTax === 0) {
            value.price = Number(value.price);
          } else {
            let total2;
            let price2;
            let price3;
            price1 = value.price * totalTax;
            total2 = 100 + totalTax;
            price2 = price1 / total2;
            price3 = Number(value.price - price2);
            value.price = Number(price3);
          }
        }
      }

      if (productShow) {
        return (
          <>
            <tr onClick={() => productDetails(value)}>
              <td>
                <a className="sp-product-name">
                  {value.Newproduct_name
                    ? value.Newproduct_name
                    : value.product_name}{" "}
                </a>
                <span className="text-muted">
                  {" "}
                  in {value.product_category.category_name}
                </span>
              </td>
              <td>
                {calQty(value._id)}
                {rsSymbol}
                {value.newPrice}
                {value.option_addon_group?.length > 0 ||
                value.option_item_group?.length > 0 ||
                value.option_variant_group?.length > 0 ? (
                  <div className="inlineDIv">
                    <div className="sp-price-plus">+</div>
                  </div>
                ) : (
                  ""
                )}
              </td>
            </tr>
          </>
        );
      }
    }
  };
  const productObjectMobialViewFilterList = (product, index) => {
    let value = JSON.parse(JSON.stringify(product));
    let productShow = true;

    if (value && value._id) {
      if (value.priceBook?.length > 0) {
        let tabletype =
          localCartInfo && Object.keys(localCartInfo).length > 0
            ? localCartInfo.type == "delivery-local"
              ? "delivery"
              : localCartInfo.type == "custom-table-local"
              ? "dine_in"
              : localCartInfo.type == "take-away-local"
              ? "take_away"
              : "all_orders"
            : "all_orders";
        let pricebookDetails = value.priceBook.find((val) => {
          if (
            (val.orderType == tabletype || val.orderType == "all_orders") &&
            registerData._id == val.registerAssignedTo
          ) {
            return val;
          }
        });
        if (pricebookDetails) {
          value.price = pricebookDetails.priceBookPrice;

          if (pricebookDetails.disable) {
            productShow = false;
          }
        }
      }

      let orignalPrice = value.price;
      let totalTax = 0;
      value.price = Number(value.price);
      let itemPrice = 0;
      if (value.option_status === "combo") {
        if (value.option_item_group.length > 0) {
          value.option_item_group.map((item) => {
            let minimumArray = [];

            item.products.map((value) => {
              let FilterVarints = item.product_variants.filter(
                (data) => data.product_id._id === value._id
              );
              if (FilterVarints.length > 0) {
                FilterVarints.map((variant) => {
                  minimumArray.push(
                    variant.product_id.price + variant.variant_id.price
                  );
                });
              } else {
                minimumArray.push(value.price);
              }
            });
            let itemMinPrice = Math.min.apply(Math, minimumArray);
            itemPrice += itemMinPrice;
          });

          value.newPrice = Number(value.price + itemPrice);
        } else {
          value.newPrice = Number(value.price);
        }
      } else {
        if (value.option_variant_group.length > 0) {
          let varintsPrice = 0;
          value.option_variant_group.map((varints) => {
            let minimumArray = [];

            varints.product_variants.map((variant) => {
              minimumArray.push(variant.price);
            });
            let variantMinPrice = Math.min.apply(Math, minimumArray);
            varintsPrice += variantMinPrice;
          });
          value.newPrice = Number(value.price + varintsPrice);
        } else {
          value.newPrice = Number(value.price);
        }
      }

      if (value.product_name.length > 30) {
        let divideArray = value.product_name.match(/.{1,30}/g);
        value.Newproduct_name = value.product_name.replace(
          divideArray[1],
          ".."
        );
      }

      value &&
        value.tax_group &&
        value.tax_group.taxes &&
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));

      if (value?.tax_group) {
        value.tax_group.Totaltax = totalTax;
      }

      if (
        value.tax_group !== null &&
        value.tax_group.taxes_inclusive_in_product_price
      ) {
        value.productInclusivePrice = Number(orignalPrice);

        if (value?.option_variant_group?.length > 0) {
          value?.option_variant_group.map((val) => {
            val.product_variants.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value?.option_addon_group?.length > 0) {
          value?.option_addon_group.map((val) => {
            val.product_addons.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value.price === 0) {
          value.price = value.price;
        } else {
          let price1;
          if (totalTax === 0) {
            value.price = Number(value.price);
          } else {
            let total2;
            let price2;
            let price3;
            price1 = value.price * totalTax;
            total2 = 100 + totalTax;
            price2 = price1 / total2;
            price3 = Number(value.price - price2);
            value.price = Number(price3);
          }
        }
      }

      if (productShow) {
        return (
          <div>
            {index == 0 ? (
              <List.Item
                className="select_frst"
                onClick={() => {
                  productDetails(value);
                  setsearchItems(
                    value.Newproduct_name
                      ? value.Newproduct_name
                      : value.product_name
                  );
                  setOnClickList(true);
                }}
              >
                <CheckCircleOutlined />
                <tr>
                  <td>
                    <p className="sp-product-name">
                      {value.Newproduct_name
                        ? value.Newproduct_name
                        : value.product_name}{" "}
                      <em className="text-muted">
                        in {value.product_category.category_name}
                      </em>
                    </p>
                  </td>
                  <td>
                    {calQty(value._id)}
                    {rsSymbol}
                    {value.newPrice ? value.newPrice : value.price}
                    {value.option_addon_group?.length > 0 ||
                    value.option_item_group?.length > 0 ||
                    value.option_variant_group?.length > 0 ? (
                      <div className="inlineDIv">
                        <div className="sp-price-plus">+</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </List.Item>
            ) : (
              <List.Item
                onClick={() => {
                  productDetails(value);
                  setsearchItems(
                    value.Newproduct_name
                      ? value.Newproduct_name
                      : value.product_name
                  );
                  setOnClickList(true);
                }}
              >
                <tr>
                  <td>
                    <p className="sp-product-name">
                      {value.Newproduct_name
                        ? value.Newproduct_name
                        : value.product_name}{" "}
                      <em className="text-muted">
                        in {value.product_category.category_name}
                      </em>
                    </p>
                  </td>
                  <td>
                    {calQty(value)}
                    {rsSymbol}
                    {value.newPrice ? value.newPrice : value.price}
                    {value.option_addon_group?.length > 0 ||
                    value.option_item_group?.length > 0 ||
                    value.option_variant_group?.length > 0 ? (
                      <div className="inlineDIv">
                        <div className="sp-price-plus">+</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </List.Item>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div
      ref={orderTicketClickRef}
      onClick={() => {
        if (change) {
          onClickSearch();
          setNotChange(false);
        }
      }}
    >
      <div>
        {chargeClick ? (
          <div>
            <ChargeDetails
              tabChangeToCurrent={tabChangeToCurrent}
              orderCartData={cartinfo}
              localCartInfo={localCartInfo}
              chargeClick={setChargeClick}
              setCustomer={setCustomer}
              onclickFun={onClickSearch}
              searchApi={change}
              setNotSarchApi={setNotChange}
              shopDetails={shopDetails}
              registerData={registerData}
              table_name={selectedTable}
              selectedProduct={selectedProduct}
              emptyCart={emptyCart}
              checkClick={chargeClick}
              allLocalData={allLocalData}
              spinOn={spinOn}
            />
          </div>
        ) : (
          <div>
            {/* <p>
              width:w{windowWidth}
              {window.innerWidth}
            </p> */}
            {windowWidth >= 992 ? (
              <Input
                suffix={suffix1}
                autoFocus
                placeholder="Search items"
                style={{
                  height: "40px",
                  width: "58%",
                  marginTop: "-10px",
                  marginBottom: "6px",
                }}
                className="search-none"
                // style={{
                //   borderRadius: "30px",
                //   width:
                //     tabCalCalCulation == 2
                //       ? "calc(42vw - 100px)"
                //       : tabCalCalCulation == 3
                //       ? "calc(32vw - 100px)"
                //       : "calc(22vw - 100px)",
                // }}
                onChange={(e) => setSeacrhItems1(e.target.value)}
                value={search}
                // className={`cre_avf - ${activeTab}`}
              />
            ) : null}
            {windowWidth >= 992 && (
              <Row className="dec-current">
                <Col
                  xxl={14}
                  lg={14}
                  xl={14}
                  xs={24}
                  md={14}
                  // style={{ backgroundColor: "red" }}
                >
                  {getItem("listView") ? (
                    <Row
                      style={{
                        backgroundColor: "#fff",
                        padding: 10,
                      }}
                    >
                      <GridViewCurrent
                        addToCart={productDetails}
                        allLocalData={allLocalData}
                        selectedAllProduct={selectedProduct}
                        productListOfdata={productListOfdata}
                        categoryList={allCategoryList}
                        calculationQty={calQty}
                        topSellList={topSellList}
                        registerData={registerData}
                        localCartInfo={localCartInfo}
                      />
                    </Row>
                  ) : (
                    <Row>
                      <Col
                        xxl={5}
                        lg={5}
                        xl={5}
                        xs={7}
                        className="category-col"
                      >
                        <Card headless className="category-card">
                          <SellModuleNav>
                            <ul className="currentbuild-ul">
                              {search != "" ? (
                                <li
                                  style={{
                                    fontSize: 13,
                                  }}
                                >
                                  <NavLink to="#" className="active">
                                    <span className="nav-text">
                                      <span>Search results</span>
                                    </span>
                                  </NavLink>
                                </li>
                              ) : (
                                false
                              )}
                              {getItem("hideAllAndTop") ? (
                                ""
                              ) : (
                                <>
                                  <li
                                    style={{
                                      fontSize: 13,
                                    }}
                                  >
                                    <NavLink
                                      to="#"
                                      className={activeAll}
                                      onClick={() => {
                                        setCategoryId("All");
                                        // getCategoryById(null);
                                        setActiveAll("active");
                                        setActiveTop(false);
                                        nullSearch("");
                                      }}
                                    >
                                      <span className="nav-text">
                                        <span>All</span>
                                      </span>
                                    </NavLink>
                                  </li>
                                  <li
                                    style={{
                                      fontSize: 13,
                                    }}
                                  >
                                    <NavLink
                                      to="#"
                                      className={
                                        activeTop ? "active" : "not-active"
                                      }
                                      onClick={() => {
                                        setActiveTop(true);
                                        setActiveAll("not-active");
                                        // getCategoryById("Top");
                                        setCategoryId("Top");
                                      }}
                                    >
                                      <span className="nav-text">
                                        <span>Top</span>
                                      </span>
                                    </NavLink>
                                  </li>
                                </>
                              )}
                              {allCategoryList.length > 0
                                ? allCategoryList.map((value, index) => {
                                    let active = "";
                                    value._id === CategoryID
                                      ? (active = "active")
                                      : (active = "not-active");
                                    return (
                                      <li
                                        style={{
                                          fontSize: 13,
                                        }}
                                        key={index}
                                        className="category-list"
                                      >
                                        <NavLink
                                          to="#"
                                          className={active}
                                          onClick={() => {
                                            setActiveAll("not-active");
                                            setActiveTop(false);
                                            setCategoryId(value._id);
                                            // getCategoryById(value._id);
                                            nullSearch("");
                                          }}
                                        >
                                          <span className="nav-text">
                                            <span data-id={value._id}>
                                              {value.category_name}
                                            </span>
                                          </span>
                                        </NavLink>
                                      </li>
                                    );
                                  })
                                : ""}
                            </ul>
                          </SellModuleNav>
                        </Card>
                      </Col>

                      <Col
                        xxl={19}
                        lg={19}
                        xl={19}
                        xs={17}
                        className="menuitem-col"
                      >
                        <Card headless className="menu-item-card">
                          <div
                            id="scrollableDiv"
                            className="sell-table-parentss"
                          >
                            <ProductShow
                              productListOfdata={productListOfdata}
                              setProductClassFromCategoryIndex={
                                setProductClassFromCategoryIndex
                              }
                              calQty={calQty}
                              productDetails={productDetails}
                              searchText={search}
                              CategoryID={CategoryID}
                              selectedProduct={selectedProduct}
                              topSellList={topSellList}
                              registerData={registerData}
                              localCartInfo={localCartInfo}
                              windowWidth={windowWidth}
                            />
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col
                  xxl={10}
                  lg={10}
                  md={10}
                  xl={10}
                  xs={24}
                  className="cart-sell-data cart-col"
                  // style={{ backgroundColor: "green" }}
                >
                  <Card headless>
                    <div className="order-summery-main">
                      <p className="order-summry-header">
                        <span className="sp-hide-if-sm-screen">
                          <small>
                            <div className="tabel_namecurnt">
                              {(localCartInfo &&
                                localCartInfo?.Status == "Unpaid") ||
                                (localCartInfo?.hasOwnProperty(
                                  "onlineOrder"
                                ) && <StopOutlined />)}

                              {selectedTable ? selectedTable : "Current Sale"}
                            </div>
                            <span
                              style={{
                                marginLeft: "10px",
                              }}
                            >
                              |
                            </span>

                            {localCartInfo?.onlineOrder ? (
                              <span
                                style={{
                                  fontSize: "13px",
                                  paddingTop: "2px",
                                  fontWeight: 500,
                                }}
                              >
                                {" "}
                                {`${localCartInfo?.onlineOrder?.Source} - ${localCartInfo?.onlineOrder?.order_id}`}
                              </span>
                            ) : (
                              <NavLink
                                to="#"
                                style={{
                                  marginLeft: "10px",
                                  fontSize: 13,
                                  color: "#008cba",
                                  position: "relative",
                                  top: "0px",
                                }}
                                className="customer-data-btn"
                                onClick={() => {
                                  if (
                                    customer === "Add Customer" ||
                                    CustomerData
                                  ) {
                                    setCustomerModalVisible(true);
                                  }
                                  onClickSearch();
                                }}
                              >
                                {spinOn ? (
                                  <Spin indicator={antIcon} />
                                ) : CustomerData ? (
                                  CustomerData.name ? (
                                    CustomerData.name
                                  ) : CustomerData.mobile ? (
                                    CustomerData.mobile
                                  ) : (
                                    customer
                                  )
                                ) : (
                                  customer
                                )}
                                {bingageBalanace && (
                                  <span>
                                    <WalletOutlined
                                      style={{
                                        marginLeft: "8px",
                                        marginRight: "5px",
                                      }}
                                    />
                                    {Number(bingageBalanace).toFixed(2)}
                                  </span>
                                )}
                              </NavLink>
                            )}
                          </small>
                        </span>

                        <span className="pull-right sp-bill-actions">
                          <div>
                            {(localCartInfo &&
                              localCartInfo?.Status == "Unpaid") ||
                            localCartInfo?.hasOwnProperty(
                              "onlineOrder"
                            ) ? null : (
                              <Row>
                                <NavLink
                                  to="#"
                                  className="customer-data-btn"
                                  style={{
                                    fontSize: 13,
                                  }}
                                >
                                  {registerData.table_numbers != "" &&
                                  localCartInfo?.type ==
                                    "custom-table-local" ? (
                                    <>
                                      <span
                                        style={{
                                          color: "#008cba",
                                        }}
                                        onClick={() => {
                                          setSwapModalVisible(true);
                                        }}
                                      >
                                        Swap&nbsp;
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {registerData.table_numbers == "" && (
                                        <span
                                          onClick={() => {
                                            makeDraftOnHold();
                                          }}
                                          style={{
                                            color: "#008cba",
                                          }}
                                        >
                                          Hold&nbsp;
                                        </span>
                                      )}
                                    </>
                                  )}
                                  <DeleteOutlined
                                    style={{
                                      marginRight: 8,
                                      color: "#008cba",
                                    }}
                                    onClick={() => {
                                      setLocalDetails();
                                      setBulckDisountDetails({
                                        ...buclkDiscontDetails,
                                        type: "FLAT",
                                        value: 0,
                                      });
                                      setBulckDiscontButtonText({
                                        text: "Bulk discount",
                                        color: "#008cba",
                                        discountValue: 0,
                                      });
                                      let data = getCartInfoFromLocalKey(
                                        localCartInfo?.cartKey,
                                        registerData
                                      );
                                      if (
                                        data?.orderTicketsData?.length ||
                                        data?.type == "booking_cart"
                                      ) {
                                        cancelReceipts(data);
                                      } else {
                                        setSelectedProduct([]);
                                        setDiscountMoreThanTotal(
                                          "Bulk Discount"
                                        );
                                        setColorBulk("#bd025d");
                                        emptyCart();
                                      }
                                    }}
                                  />
                                </NavLink>
                              </Row>
                            )}
                          </div>
                        </span>
                      </p>
                      <Form form={form}>
                        <Form.Item name="mobile" className="w-100">
                          <Input
                            placeholder="Customer mobile number(F8)"
                            type="number"
                            disabled={
                              localCartInfo?.Status == "Unpaid" ||
                              localCartInfo?.hasOwnProperty("onlineOrder")
                                ? true
                                : false
                            }
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                            onKeyDown={(e) => onSearch(e)}
                            value={customer === "Add Customer" ? "" : customer}
                            onChange={(e) => {
                              setNotChange(true);
                              setCustomer(
                                e.target.value === ""
                                  ? "Add Customer"
                                  : e.target.value
                              );
                              setCustomerData(false);
                            }}
                            ref={inputRef}
                          />

                          {enforceCustomer && customer === "Add Customer" ? (
                            <p className="text-danger">
                              Customer mobile number is required for this sale.
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Item>
                        <Space size="medium" />
                        <div
                          style={{
                            display: "none",
                          }}
                        >
                          {discountValue.length}
                        </div>

                        {orderTable}

                        {selectedProduct?.length > 0 &&
                        windowWidth <= 992 == false ? (
                          <>
                            <div className="discount-section">
                              <Popover
                                content={renderBulkDiscountContent()}
                                trigger={
                                  localCartInfo?.Status == "Unpaid" ||
                                  localCartInfo?.hasOwnProperty("onlineOrder")
                                    ? "null"
                                    : "click"
                                }
                                visible={PopoverVisible}
                                onVisibleChange={(visible) =>
                                  setPopoverVisible(visible)
                                }
                              >
                                <Button
                                  type="link"
                                  className="onhover"
                                  style={{
                                    color: bulckdiscuntButtonText.color,
                                    fontSize: "13px",
                                    background: "#F4F5F7",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    if (
                                      (localCartInfo &&
                                        localCartInfo?.Status == "Unpaid") ||
                                      localCartInfo?.hasOwnProperty(
                                        "onlineOrder"
                                      )
                                    ) {
                                      setNotUpdate(true);
                                    } else {
                                      setPopoverVisible(!PopoverVisible);
                                    }
                                  }}
                                >
                                  {bulckdiscuntButtonText.text}
                                </Button>
                              </Popover>

                              {AddtionalChargeList?.length > 0 &&
                                windowWidth <= 992 == false && (
                                  <Popover
                                    content={AddAdditionalCharge()}
                                    trigger={
                                      localCartInfo?.Status == "Unpaid" ||
                                      localCartInfo?.hasOwnProperty(
                                        "onlineOrder"
                                      )
                                        ? "null"
                                        : "click"
                                    }
                                    visible={PopoverVisibleAdditional}
                                    onVisibleChange={(visible) =>
                                      setPopoverVisibleAdditional(visible)
                                    }
                                  >
                                    <Button
                                      type="link"
                                      className="onhover"
                                      style={{
                                        color: "#008cba",
                                        fontSize: "13px",
                                        background: "#F4F5F7",
                                        border: "none",
                                      }}
                                      onClick={() => {
                                        if (
                                          (localCartInfo &&
                                            localCartInfo?.Status ==
                                              "Unpaid") ||
                                          localCartInfo?.hasOwnProperty(
                                            "onlineOrder"
                                          )
                                        ) {
                                          setNotUpdate(true);
                                        } else {
                                          setPopoverVisibleAdditional(
                                            !PopoverVisibleAdditional
                                          );
                                        }
                                      }}
                                    >
                                      {TotalAddtionalChargeValue > 0 &&
                                      tickAdditionalList.length > 0
                                        ? `Addtional Charge ${rsSymbol}${TotalAddtionalChargeValue}`
                                        : `Addtional Charge`}
                                    </Button>
                                  </Popover>
                                )}
                            </div>
                            {getItem("enable_quick_billing") && (
                              <Radio.Group
                                onChange={(e) => setPaymentType(e.target.value)}
                                value={PaymentType}
                                className="tick-radio block-center"
                              >
                                <Radio.Button
                                  value="cash"
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {PaymentType === "cash" ? tickImg : ""}
                                  Cash
                                </Radio.Button>
                                <Radio.Button
                                  value="card"
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {PaymentType === "card" ? tickImg : ""} Credit
                                  / Debit Card
                                </Radio.Button>
                                {PaymentTypeList.map((val, index) => {
                                  return (
                                    <Radio.Button
                                      value={val.name}
                                      style={{
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {PaymentType === val.name ? tickImg : ""}
                                      {val.name}
                                    </Radio.Button>
                                  );
                                })}
                              </Radio.Group>
                            )}
                          </>
                        ) : (
                          ""
                        )}

                        <div className="discount-section upper-btns orderfntbtn">
                          {getItem("orderTicketButton") ? (
                            <>
                              <Button
                                type="primary"
                                size="large"
                                id="orderTicketId"
                                style={{
                                  marginRight: "5px",
                                  borderRadius: "inherit",
                                  opacity:
                                    selectedProduct.length > 0 ? "" : 0.65,
                                  cursor:
                                    selectedProduct.length > 0
                                      ? "pointer"
                                      : "no-drop",
                                  width: "50%",
                                  height: "40px",
                                }}
                                onClick={() => {
                                  if (
                                    totalcalculatedPrice == 0 &&
                                    selectedProduct.filter(
                                      (val) => val.quantity == 0
                                    ).length == selectedProduct.length
                                  ) {
                                    setSelectedProduct([]);
                                  }
                                  setSelectedProduct(
                                    selectedProduct.filter(
                                      (val) => val.quantity > 0
                                    )
                                  );
                                  setOrderTiketModalVisible(true);
                                }}
                              >
                                Order Ticket (F9)
                              </Button>
                              <Button
                                type="success"
                                size="large"
                                style={{
                                  borderRadius: "inherit",
                                  width: "50%",
                                  opacity:
                                    selectedProduct.length > 0 ? "" : 0.65,
                                  cursor:
                                    selectedProduct.length > 0
                                      ? "pointer"
                                      : "no-drop",
                                  height: "40px",
                                  background: "#BD025D",
                                }}
                                onClick={() => chargeOnClick()}
                              >
                                {localCartInfo?.onlineOrder
                                  ? "Procced"
                                  : `Charge ${rsSymbol}${totalcalculatedPrice}`}{" "}
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="success"
                              size="large"
                              style={{
                                borderRadius: "inherit",
                                width: "100%",
                                opacity: selectedProduct.length > 0 ? "" : 0.65,
                                cursor:
                                  selectedProduct.length > 0
                                    ? "pointer"
                                    : "no-drop",
                                height: "40px",

                                background: "#BD025D",
                              }}
                              onClick={() => chargeOnClick()}
                            >
                              {localCartInfo?.onlineOrder
                                ? "Procced"
                                : `Charge ${rsSymbol}${totalcalculatedPrice}`}{" "}
                            </Button>
                          )}
                        </div>
                      </Form>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {windowWidth < 992 && (
              <>
                <div className={`mob-cart list-open-${listViewOnOff}`}>
                  <ul className="items-view">
                    <li>
                      {" "}
                      <NavLink
                        to="#"
                        onClick={() => setListViewOnOff(!listViewOnOff)}
                        style={{
                          color: "#008cba",
                        }}
                      >
                        View Items
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="#">
                        <DeleteOutlined
                          style={{
                            marginRight: 8,
                            color: "#008cba",
                          }}
                          onClick={() => {
                            setLocalDetails();
                            setBulckDisountDetails({
                              ...buclkDiscontDetails,
                              type: "FLAT",
                              value: 0,
                            });
                            setBulckDiscontButtonText({
                              text: "Bulk discount",
                              color: "#008cba",
                              discountValue: 0,
                            });
                            let data = getCartInfoFromLocalKey(
                              localCartInfo?.cartKey,
                              registerData
                            );
                            if (
                              data?.orderTicketsData?.length ||
                              data?.type == "booking_cart"
                            ) {
                              cancelReceipts(data);
                            } else {
                              setSelectedProduct([]);
                              setDiscountMoreThanTotal("Bulk Discount");
                              setColorBulk("#bd025d");
                              emptyCart();
                            }
                          }}
                        />
                      </NavLink>
                    </li>
                  </ul>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Customer mobile number"
                    onKeyDown={(e) => onSearch(e)}
                    disabled={
                      localCartInfo?.Status == "Unpaid" ||
                      localCartInfo?.hasOwnProperty("onlineOrder")
                        ? true
                        : false
                    }
                    value={customer === "Add Customer" ? "" : customer}
                    onChange={(e) => {
                      setNotChange(true);
                      setCustomer(
                        e.target.value === "" ? "Add Customer" : e.target.value
                      );
                      setCustomerData(false);
                    }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                  <br />
                  <br />

                  <Input
                    suffix={suffix}
                    onChange={(e) => {
                      setsearchItems(e.target.value);
                      setOnClickList(false);
                    }}
                    value={searchItems}
                    placeholder="Search Items"
                  />
                  {searchItemsList.length > 0 ? (
                    <List
                      className="mobile_serlist"
                      bordered
                      dataSource={searchItemsList}
                      renderItem={productObjectMobialViewFilterList}
                    />
                  ) : null}

                  <br />
                  <br />
                  <div
                    style={{
                      display: "none",
                    }}
                  >
                    {discountValue.length}
                  </div>
                  <Table
                    locale={locale}
                    className="tbl_data"
                    dataSource={selectedProduct}
                    columns={columns()}
                    size="small"
                    scroll={{ y: 350 }}
                    pagination={false}
                    summary={(pageData) => {
                      return (
                        <>
                          {selectedProduct.length > 0 ? (
                            <Table.Summary.Row>
                              {totalcalculatedTax > 0 && (
                                <>
                                  <Table.Summary.Cell>Taxes</Table.Summary.Cell>
                                  <Table.Summary.Cell>
                                    <Text></Text>
                                  </Table.Summary.Cell>

                                  <Table.Summary.Cell>
                                    <Text>
                                      {rsSymbol}
                                      {Number(totalcalculatedTax).toFixed(2)}
                                    </Text>
                                  </Table.Summary.Cell>

                                  <Table.Summary.Cell>
                                    <Text></Text>
                                  </Table.Summary.Cell>
                                </>
                              )}
                            </Table.Summary.Row>
                          ) : (
                            ""
                          )}
                          {getItem("doNotRoundOff") ? (
                            ""
                          ) : selectedProduct.length > 0 ? (
                            <Table.Summary.Row>
                              {(round < 0 || round > 0) && (
                                <>
                                  <Table.Summary.Cell>
                                    Roundoff
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell>
                                    <Text></Text>
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell>
                                    <Text>
                                      {rsSymbol}
                                      {Number(round).toFixed(2)}
                                    </Text>
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell>
                                    <Text></Text>
                                  </Table.Summary.Cell>
                                </>
                              )}
                            </Table.Summary.Row>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    }}
                  />

                  <>
                    <div className="discount-section">
                      <Popover
                        content={renderBulkDiscountContent()}
                        trigger={
                          localCartInfo?.Status == "Unpaid" ||
                          localCartInfo?.hasOwnProperty("onlineOrder")
                            ? "false"
                            : "click"
                        }
                        visible={PopoverVisible}
                        onVisibleChange={(visible) =>
                          setPopoverVisible(visible)
                        }
                      >
                        <Button
                          type="link"
                          className="onhover"
                          style={{
                            color: bulckdiscuntButtonText.color,
                            fontSize: "13px",
                            background: "#F4F5F7",
                            border: "none",
                          }}
                          onClick={() => {
                            if (
                              (localCartInfo &&
                                localCartInfo?.Status == "Unpaid") ||
                              localCartInfo?.hasOwnProperty("onlineOrder")
                            ) {
                              setNotUpdate(true);
                            } else {
                              setPopoverVisible(!PopoverVisible);
                            }
                          }}
                        >
                          {bulckdiscuntButtonText.text}
                        </Button>
                      </Popover>

                      {AddtionalChargeList?.length > 0 && windowWidth <= 992 && (
                        <Popover
                          content={AddAdditionalCharge()}
                          trigger={
                            localCartInfo?.Status == "Unpaid" ||
                            localCartInfo?.hasOwnProperty("onlineOrder")
                              ? "null"
                              : "click"
                          }
                          visible={PopoverVisibleAdditional}
                          onVisibleChange={(visible) =>
                            setPopoverVisibleAdditional(visible)
                          }
                        >
                          <Button
                            type="link"
                            className="onhover"
                            style={{
                              color: "#008cba",
                              fontSize: "13px",
                              background: "#F4F5F7",
                              border: "none",
                            }}
                            onClick={() => {
                              if (
                                (localCartInfo &&
                                  localCartInfo?.Status == "Unpaid") ||
                                localCartInfo?.hasOwnProperty("onlineOrder")
                              ) {
                                setNotUpdate(true);
                              } else {
                                setPopoverVisibleAdditional(
                                  !PopoverVisibleAdditional
                                );
                              }
                            }}
                          >
                            {TotalAddtionalChargeValue > 0 &&
                            tickAdditionalList.length > 0
                              ? `Addtional Charge ${rsSymbol}${TotalAddtionalChargeValue}`
                              : `Addtional Charge`}
                          </Button>
                        </Popover>
                      )}
                    </div>
                    {getItem("enable_quick_billing") && (
                      <Radio.Group
                        onChange={(e) => setPaymentType(e.target.value)}
                        value={PaymentType}
                        className="tick-radio block-center"
                      >
                        <Radio.Button
                          value="cash"
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          {PaymentType === "cash" ? tickImg : ""}
                          Cash
                        </Radio.Button>
                        <Radio.Button
                          value="card"
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          {PaymentType === "card" ? tickImg : ""} Credit / Debit
                          Card
                        </Radio.Button>
                        {PaymentTypeList.map((val, index) => {
                          return (
                            <Radio.Button
                              value={val.name}
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === val.name ? tickImg : ""}
                              {val.name}
                            </Radio.Button>
                          );
                        })}
                      </Radio.Group>
                    )}
                  </>

                  <div className="discount-section upper-btns orderfntbtn">
                    {getItem("orderTicketButton") ? (
                      <>
                        <Button
                          type="primary"
                          size="large"
                          id="orderTicketId"
                          style={{
                            marginRight: "5px",
                            borderRadius: "inherit",
                            opacity: selectedProduct.length > 0 ? "" : 0.65,
                            cursor:
                              selectedProduct.length > 0
                                ? "pointer"
                                : "no-drop",
                            width: "50%",
                            height: "40px",
                          }}
                          onClick={() => {
                            if (
                              totalcalculatedPrice == 0 &&
                              selectedProduct.filter((val) => val.quantity == 0)
                                .length == selectedProduct.length
                            ) {
                              setSelectedProduct([]);
                            }
                            setSelectedProduct(
                              selectedProduct.filter((val) => val.quantity > 0)
                            );
                            setOrderTiketModalVisible(true);
                          }}
                          ref={orderTicketClickRef}
                        >
                          Order Ticket (F9)
                        </Button>
                        <Button
                          type="success"
                          size="large"
                          style={{
                            borderRadius: "inherit",
                            width: "50%",
                            opacity: selectedProduct.length > 0 ? "" : 0.65,
                            cursor:
                              selectedProduct.length > 0
                                ? "pointer"
                                : "no-drop",
                            height: "40px",
                            background: "#BD025D",
                          }}
                          onClick={() => chargeOnClick()}
                        >
                          {localCartInfo?.onlineOrder
                            ? "Procced"
                            : `Charge ${rsSymbol}${totalcalculatedPrice}`}{" "}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="success"
                        size="large"
                        style={{
                          borderRadius: "inherit",
                          width: "100%",
                          opacity: selectedProduct.length > 0 ? "" : 0.65,
                          cursor:
                            selectedProduct.length > 0 ? "pointer" : "no-drop",
                          height: "40px",

                          background: "#BD025D",
                        }}
                        onClick={() => chargeOnClick()}
                      >
                        {localCartInfo?.onlineOrder
                          ? "Procced"
                          : `Charge ${rsSymbol}${totalcalculatedPrice}`}{" "}
                      </Button>
                    )}
                  </div>
                </div>

                <div className={`mob-cart list-view-${listViewOnOff}`}>
                  <NavLink
                    to="#"
                    onClick={() => setListViewOnOff(!listViewOnOff)}
                    className="view-bill"
                  >
                    View Bill
                  </NavLink>
                  {filterArray.map((item) => {
                    return (
                      <>
                        <div className="container">
                          <div className="table-srd">
                            <span className="title">{item.title}</span>
                            <table className="table">
                              <tbody>
                                {item.data.map(productObjectMobialViewList)}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            )}

            {customerModalVisible && (
              <CustomerModal
                bulkDiscountDetails={buclkDiscontDetails}
                bulckdiscuntButtonText={bulckdiscuntButtonText}
                setBulckDiscontButtonText={setBulckDiscontButtonText}
                setBulckDisountDetails={setBulckDisountDetails}
                setNotUpdate={setNotUpdate}
                customerModalVisible={customerModalVisible}
                setCustomerModalVisible={setCustomerModalVisible}
                titleCheck={customer}
                customer_Data={CustomerData}
                onclickFun={onClickSearch}
                setCustomerData={setCustomer}
                onEnter={onSearch}
                currentData={currentcustomerData}
                localCartInfo={localCartInfo}
                setlocalCartInfo={setlocalCartInfo}
                setCustomerDetials={setCustomerData}
                setBingageBalance={setBingageBalance}
              />
            )}
            {editProductModalVisible && (
              <ProductDetailModal
                editProductModalVisible={editProductModalVisible}
                setEditProductModalVisible={setEditProductModalVisible}
                setadddiscountFlag={setadddiscountFlag}
                productDetailsUpdate={productDetailsForUpdate}
                removeSelectedItems={removeSelectedItems}
                saveFromEditModal={saveFromEditModal}
                SetProductList={setSelectedProduct}
              />
            )}
            {editTableNameModal && (
              <EditTableNameModal
                setEditTableNameModal={setEditTableNameModal}
                editTableNameModal={editTableNameModal}
                cartDetails={cartToEdit}
                redirectToCurrent="yes"
                setSelectedProduct={setSelectedProduct}
                finalTotal={totalcalculatedPrice}
                localCartInfo={localCartInfo}
                redirectToCurrentFunction={redirectToCurrentFunc}
                selectedProduct={selectedProduct}
                modelVisible={modelNameViewer}
                modelVisibleValue={ModelView}
                registerData={registerData}
                setselectedTable={setselectedTable}
                setlocalCartInfo={setlocalCartInfo}
                setBulkValue={setBulkValue}
                setAddtionalChargeList={setAddtionalChargeList}
                setCustomerData={setCustomerData}
                setCustomer={setCustomer}
                setBulckDiscontButtonText={setBulckDiscontButtonText}
                setBulckDisountDetails={setBulckDisountDetails}
                fetchAllAddtionalcharge={fetchAllAddtionalChargeList}
              />
            )}

            {newProductDetailsvisible && (
              <NewProductModal
                setNewProductdetailsVisible={setNewProductdetailsVisible}
                newProductDetailsvisible={newProductDetailsvisible}
                productDetails={newProductData}
                newProductSave={newProductSaveInCart}
                selecteddiscountProducts={selecteddiscountProducts}
                setadddiscountFlag={setadddiscountFlag}
                discountAppliedProductId={discountAppliedProductId}
                adddiscountFlag={adddiscountFlag}
                selectedProduct={selectedProduct}
                setdiscountAppliedProductId={setdiscountAppliedProductId}
                SetProductList={setSelectedProduct}
              />
            )}
            {swapModalVisible && (
              <SwapTableModal
                setSwapModalVisible={setSwapModalVisible}
                swapModalVisible={swapModalVisible}
                table_name={selectedTable}
                swapTableNameList={swapTableNameList}
                selectedProduct={selectedProduct}
                setlocalCartInfo={setlocalCartInfo}
                setTableName={setTableName}
                localCartInfo={localCartInfo}
                customeTableList={customeTableList}
                registerData={registerData}
              />
            )}

            {orderTiketModalVisible && (
              <OrderTicketModal
                setOrderTiketModalVisible={setOrderTiketModalVisible}
                orderTiketModalVisible={orderTiketModalVisible}
                table_name={selectedTable}
                swapTableNameList={swapTableNameList}
                selectedProduct={selectedProduct}
                setlocalCartInfo={setlocalCartInfo}
                setTableName={setTableName}
                localCartInfo={localCartInfo}
                customeTableList={customeTableList}
                registerData={registerData}
                setCheckCurrent={setCheckCurrent}
              />
            )}

            {notUpdate && (
              <Modal
                title="Update Not Allowed"
                visible={notUpdate}
                onCancel={() => setNotUpdate(false)}
                onOk={() => setNotUpdate(false)}
              >
                <p>You cannot update a locked receipt.</p>
              </Modal>
            )}
            {modalVisibleOrderCancel && (
              <Modal
                title="Clear Booking"
                bodyStyle={{
                  paddingTop: 0,
                  paddingBottom: "12px",
                }}
                visible={modalVisibleOrderCancel}
                onCancel={() => {
                  setModalVisibleOrderCancel(false);
                  form.setFieldsValue({
                    refund_amount: refundAmount,
                  });
                }}
                width={600}
                footer={[
                  <Button
                    type="default"
                    className="btn-cancel btn-custom go_back"
                    onClick={() => {
                      setModalVisibleOrderCancel(false);
                      form.setFieldsValue({
                        refund_amount: refundAmount,
                      });
                    }}
                  >
                    Go Back
                  </Button>,
                  <Button
                    type="primary"
                    disabled={PaymentType || refundAmount == 0 ? false : true}
                    onClick={() => cancellationBooking()}
                  >
                    Cancel Booking
                  </Button>,
                ]}
              >
                <Form
                  style={{ width: "100%" }}
                  name="CancelBooking"
                  form={form1}
                  onFinish={cancellationBooking}
                >
                  <Form.Item
                    name="refund_amount"
                    label="Enter Refund Amount"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (Number(value) >= 0) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              "Refund price should be a positive number."
                            );
                          }
                        },
                      },
                      {
                        validator: (_, value) => {
                          if (Number(value) > refundAmount) {
                            return Promise.reject(
                              "Refund amount cannot be more than the paid amount."
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Refund Amount" type="number" />
                  </Form.Item>
                  <Form.Item
                    name="refund_pay_type"
                    label="Payment Type"
                    rules={[
                      {
                        message: "Choose a payment type to proceed",
                        required: refundAmount > 0 ? true : false,
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(e) => setCancelPaymentType(e.target.value)}
                      className="tick-radio"
                    >
                      <Radio.Button
                        value="cash"
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {cancelPaymentType === "cash" ? tickImg : ""}
                        Cash
                      </Radio.Button>
                      <Radio.Button
                        value="card"
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {cancelPaymentType === "card" ? tickImg : ""} Credit /
                        Debit Card
                      </Radio.Button>
                      {PaymentTypeList.map((val, index) => {
                        return (
                          <Radio.Button
                            value={val.name}
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {cancelPaymentType === val.name ? tickImg : ""}
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
                        {cancelPaymentType === "other" ? tickImg : ""}
                        Other
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="cancellation_reason"
                    label="Cancellation Notes2"
                    rules={[
                      {
                        max: 50,
                        message:
                          "Cancellation Notes cannot be more than 50 characters long.",
                      },
                    ]}
                  >
                    <Input placeholder="Cancellation notes" />
                  </Form.Item>
                </Form>
              </Modal>
            )}
            {popUpModel && (
              <ModalPopUp
                data={popUpData}
                title={
                  localCartInfo?.type == "booking_cart"
                    ? "Clear Booking"
                    : "Clear Receipt"
                }
                visible={popUpModel}
                onOk={handlePopUpModel}
                onCancel={() => {
                  setPopUpModel(false);
                }}
              >
                {localCartInfo?.type == "booking_cart" ? (
                  <p>
                    This will create a cancellation order ticket and cancel this
                    booking. Are you sure you want to proceed?
                  </p>
                ) : (
                  <p>
                    This will create a cancellation order ticket and cancel this
                    order. Are you sure you want to proceed?
                  </p>
                )}
              </ModalPopUp>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CurrentBuilder);
