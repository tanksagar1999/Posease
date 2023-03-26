import React, { useState, useContext } from "react";
import { CheckOutlined } from "@ant-design/icons";
import moment from "moment";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";

const getItem = (key) => {
  const data = typeof window !== "undefined" ? localStorage.getItem(key) : "";

  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

const setItem = (key, value) => {
  const stringify = typeof value !== "string" ? JSON.stringify(value) : value;
  return localStorage.setItem(key, stringify);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const localStorageCartKeyName = "LOCAL_STORAGE_CART_KEY_NAME";

const getLocalCartDataByType = (type, registerId) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.type == type && registerId && data.register_id == registerId
    );
  }
};

const getLocalCartCount = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [].length;
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.Status == "In Progress" &&
        registerDetails &&
        data.register_id == registerDetails._id
    ).length;
  }
};

const getAllTakeAwayDataInLocal = (registerDetails) => {
  if (registerDetails) {
    let local_cart_data = getLocalCartDataByType(
      "take-away-local",
      registerDetails._id
    );
    return local_cart_data;
  }
};
const getallCustomSwapList = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.type == "custom-table-local" &&
        registerDetails &&
        data.register_id == registerDetails._id &&
        data.swapTableCustum
    );
  }
};
const getallCustomSplitList = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        (data.type == "custom-table-local" &&
          registerDetails &&
          data.register_id == registerDetails._id &&
          data.customSplit) ||
        data.swapTableCustum
    );
  }
};

const getAllDeliveryDataInLocal = (registerId) => {
  let local_cart_data = getLocalCartDataByType(
    "delivery-local",
    registerId?._id
  );
  return local_cart_data;
};

// const tableStatus = {
//   Empty: "Empty",
//   Serving: "Serving",
//   Unpaid: "Unpaid",
//   Paid: "Paid",
//   Occupied: "Occupied",
// };

const createNewCartwithKeyandPush = (
  type,
  data,
  registerDetails,
  formData,
  splitName,
  indexOfSplit
) => {
  console.log(
    "sagarbhaduschefck",
    type,
    data,
    registerDetails,
    formData,
    splitName,
    indexOfSplit
  );
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  const userName = getItem("userDetails")?.username
    ? getItem("userDetails")?.username
    : "";
  let isCartAlreadyExists = true;
  if (local_cart_data == null) {
    local_cart_data = [];
  } else {
    local_cart_data = JSON.parse(local_cart_data);
  }

  let cartKey =
    Math.floor(Math.random() * 1000000000) + "_time_" + new Date().getTime();
  let RegisterId = registerDetails?._id;

  let default_cart_object = {
    type: type,
    data: [],
    Status: "In Progress",
    created_at: new Date(),
    cartKey: cartKey,
    register_id: RegisterId,
    waiterName: userName,
  };

  splitName && (default_cart_object.customSplit = true);
  indexOfSplit && (default_cart_object.index = indexOfSplit);
  if (type == "DRAFT_CART") {
    default_cart_object.data = data;
    formData?.tableName &&
      (default_cart_object.tableName = formData?.tableName);

    default_cart_object = { ...default_cart_object };
  } else {
    default_cart_object = { ...default_cart_object, ...data };
  }

  if (type == "custom-table-local") {
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == data.tablekey && itm.register_id == registerDetails?._id
      );
    });

    if (cartData.length > 0) {
      isCartAlreadyExists = false;
      localStorage.setItem("active_cart", cartData[0].cartKey);
      return cartData[0];
    }
  }

  localStorage.setItem("active_cart", cartKey);
  local_cart_data.push(default_cart_object);
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return default_cart_object;
};

const bookingAddInLocalData = (localcartInfo, bookingData) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);

  if (local_cart_data == null) {
    local_cart_data = [];
  } else {
    local_cart_data = JSON.parse(local_cart_data);
  }

  let default_cart_object = {
    ...localcartInfo,
    cartKey:
      Math.floor(Math.random() * 1000000000) + "_time_" + new Date().getTime(),
    Status: "In Progress",
    type: "booking_cart",
    tableName: bookingData.ReceiptNumber,
    tablekey: bookingData.ReceiptNumber,
    bookingDetails: bookingData,
  };

  localStorage.setItem("active_cart", default_cart_object.cartKey);
  local_cart_data.push(default_cart_object);
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return default_cart_object;
};
const getCartInfoFromLocalKey = (key, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  local_cart_data = JSON.parse(local_cart_data);
  if (local_cart_data) {
    let cartData = local_cart_data.filter(function(itm) {
      return itm.cartKey == key && itm.register_id === registerDetails?._id;
    })[0];
    if (cartData != null && Object.keys(cartData).length > 0) {
    }

    // localStorage.setItem("active_cart", key);
    return cartData;
  }
};
const getCartInfoFromTableKey = (key, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  local_cart_data = JSON.parse(local_cart_data);
  if (local_cart_data) {
    let cartData = local_cart_data.filter(function(itm) {
      return itm.tablekey == key && itm.register_id === registerDetails?._id;
    })[0];
    if (cartData != null && Object.keys(cartData).length > 0) {
    }

    // localStorage.setItem("active_cart", key);
    return cartData;
  }
};

const getCartInfoLocalListsData = (currentRegisterData) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data).filter(
      (data) => data.register_id == currentRegisterData?._id
    );
    return local_cart_data;
  } else {
    return [];
  }
};
const setCartInfoFromLocalKey = (
  key,
  data,
  darftUpdate,
  formData,
  splitName
) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1) {
    local_cart_data[findIndex].Status = "In Progress";
    local_cart_data[findIndex].data = data;
    darftUpdate == "darftupdate" &&
      (local_cart_data[findIndex].created_at = new Date());

    formData?.tableName &&
      (local_cart_data[findIndex].tableName = formData?.tableName);

    darftUpdate == "darftupdate" &&
      (local_cart_data[findIndex].darftDetalisUpdate = true);
  }

  localStorage.setItem("active_cart", key);

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  let obj = {
    default_cart_object: local_cart_data[findIndex],
    allLocalData: local_cart_data,
  };
  return obj;
};

const getTableStatusFromId = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (cartData.length > 0) {
      return cartData[0].Status;
    } else {
      return "";
    }
  } else {
    return "";
  }
};
const getTotalOfUnpaid = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (
      cartData.length > 0 &&
      cartData[0].otherDetails?.finalCharge &&
      cartData[0].otherDetails?.finalCharge
    ) {
      return cartData[0].otherDetails?.finalCharge;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

const tableStatusChange = (
  key,
  status,
  receipt_Number,
  bingageDetails,
  bingaePrintFristTrue
) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1 && status == "Delete") {
    // local_cart_data[findIndex].Status = "Delete";
    // local_cart_data[findIndex].data = [];
    // localStorage.removeItem("active_cart");
  } else {
    local_cart_data[findIndex].Status = status;
    if (bingaePrintFristTrue) {
      local_cart_data[findIndex].bingagePrintFirstTrueClick = true;
    }
    if (bingageDetails) {
      local_cart_data[findIndex].bingageDetails = bingageDetails;
    }
    if (getItem("orderTicketButton") != true && receipt_Number != "") {
      local_cart_data[findIndex].printFirstReceiptNumber = receipt_Number;
    }
  }
  let obj = {
    default_cart_object: local_cart_data[findIndex],
    allLocalData: local_cart_data,
  };
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return obj;
};

const checkIfTableIsSelected = (id, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerDetails &&
        itm.register_id == registerDetails._id
      );
    });
    if (cartData.length > 0) {
      if (cartData[0].cartKey == localStorage.getItem("active_cart")) {
        return <span className="active-dots" />;
      } else {
        return "";
      }
      //return cartData[0].Status;
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const checkIfTableIsSelectedByCartkey = (id) => {
  if (id == localStorage.getItem("active_cart")) {
    return <span className="active-dots" />;
  } else {
    return "";
  }
};

const updateTableNameFromCartId = (tableName, cartKey) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data.findIndex(
    (item) => item.cartKey === cartKey
  );
  local_cart_data[findIndex].tableName = tableName;
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const removeCartFromLocalStorage = (cartKey, registerData) => {
  if (registerData) {
    let local_cart_data = localStorage.getItem(localStorageCartKeyName)
      ? localStorage.getItem(localStorageCartKeyName)
      : [];
    local_cart_data = JSON.parse(local_cart_data);

    const findIndex = local_cart_data.findIndex(
      (item) => item.cartKey === cartKey && item.register_id == registerData._id
    );

    local_cart_data.splice(findIndex, 1);

    localStorage.removeItem("product_Details");
    localStorage.removeItem("active_cart");
    let obj = {
      default_cart_object: local_cart_data[findIndex],
      allLocalData: local_cart_data,
    };
    localStorage.setItem(
      localStorageCartKeyName,
      JSON.stringify(local_cart_data)
    );
    return obj;
  } else {
    alert("notdfindRegisterdtainremovecart");
  }
};

const storeOtherData = (key, data) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1) {
    local_cart_data[findIndex].otherDetails = data;
    local_cart_data[findIndex].details = data.details;
  }

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const setOrderTickets = (
  key,
  createOrderTiketsList,
  selectedAllProduct,
  mobileWaiterName
) => {
  console.log("createOrderTiketsList", key, createOrderTiketsList);
  const userName = getItem("userDetails")?.username
    ? getItem("userDetails")?.username
    : "";
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);

  findIndex !== -1
    ? (local_cart_data[findIndex].receipt_Number =
        createOrderTiketsList[0]?.receiptNumberDetails?.number)
    : null;

  if (local_cart_data[findIndex]?.orderTicketsData) {
    if (findIndex !== -1) {
      local_cart_data[findIndex].orderTicketsData = [
        ...local_cart_data[findIndex].orderTicketsData,
        ...createOrderTiketsList,
      ];
      if (selectedAllProduct) {
        local_cart_data[findIndex].data = selectedAllProduct;
      }
      local_cart_data[findIndex].waiterName = mobileWaiterName
        ? mobileWaiterName
        : userName;
    }
  } else {
    if (findIndex !== -1) {
      console.log("bbbbbbbbb89888989", createOrderTiketsList);
      local_cart_data[
        findIndex
      ].orderTicketsData = createOrderTiketsList?.length
        ? createOrderTiketsList
        : [];
      local_cart_data[findIndex].waiterName = mobileWaiterName
        ? mobileWaiterName
        : userName;
      if (selectedAllProduct) {
        local_cart_data[findIndex].data = selectedAllProduct;
      }
    }
  }

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return {
    default_cart_object: local_cart_data[findIndex],
    allLocalData: local_cart_data,
  };
};
const darftCount = (currentRegisterData) => {
  return getCartInfoLocalListsData().filter(
    (d) => d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
  ).length;
};
const getTableNameTo = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tableName == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (cartData.length > 0) {
      return cartData[0];
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const AddLastSplitName = (key, alldata, splitName, registerDetails, index) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex(
    (item) => item.cartKey === key && item.register_id === registerDetails._id
  );
  if (findIndex !== -1) {
    local_cart_data[findIndex] = {
      ...alldata,
      lastSplitName: splitName,
      splitIndex: index,
    };
  }

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};
const checkTakeAwayTodayYaNot = (allTakeAwayData) => {
  if (
    allTakeAwayData?.length > 0 &&
    allTakeAwayData[allTakeAwayData.length - 1]?.created_at
  ) {
    if (
      moment(
        moment(allTakeAwayData[allTakeAwayData.length - 1].created_at).format(
          "MM/DD/YYYY"
        )
      ).isSame(moment().format("MM/DD/YYYY"))
    ) {
      return allTakeAwayData.length + 1;
    } else {
      return 1;

      // let local_cart_data = localStorage.getItem(localStorageCartKeyName);
      // if (local_cart_data == null) {
      //   return 1;
      // } else {
      //   local_cart_data = JSON.parse(local_cart_data);
      //   let removeTakeAwayData = local_cart_data.filter(
      //     (val) => val.type !== "take-away-local"
      //   );
      //   localStorage.setItem(
      //     localStorageCartKeyName,
      //     JSON.stringify(removeTakeAwayData)
      //   );
      //   return 1;
      // }
    }
  } else {
    return 1;
  }
};
const checkDeliveryTodayYaNot = (allDeliverydata) => {
  if (
    allDeliverydata?.length > 0 &&
    allDeliverydata[allDeliverydata.length - 1]?.created_at
  ) {
    if (
      moment(
        moment(allDeliverydata[allDeliverydata.length - 1].created_at).format(
          "MM/DD/YYYY"
        )
      ).isSame(moment().format("MM/DD/YYYY"))
    ) {
      return allDeliverydata.length + 1;
    } else {
      // let local_cart_data = localStorage.getItem(localStorageCartKeyName);
      // if (local_cart_data == null) {
      //   return 1;
      // } else {
      //   local_cart_data = JSON.parse(local_cart_data);
      //   let removeDeliverydata = local_cart_data.filter(
      //     (val) => val.type !== "delivery-local"
      //   );
      //   console.log("removeDeliverydata", removeDeliverydata);
      //   localStorage.setItem(
      //     localStorageCartKeyName,
      //     JSON.stringify(removeDeliverydata)
      //   );
      //   return 1;
      // }
      return 1;
    }
  } else {
    return 1;
  }
};

const swaptable = (key, data, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex(
    (item) => item.cartKey === key && item.register_id === registerDetails._id
  );
  if (findIndex !== -1) {
    local_cart_data[findIndex] = data;
  }

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  let obj = {
    default_cart_object: local_cart_data[findIndex],
    allLocalData: local_cart_data,
  };
  return obj;
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
const getTakeAwayNumber = () => {
  let takeAwayNumber;
  if (getItem("previousTakeAwayNumber") != null) {
    let Details = getItem("previousTakeAwayNumber");
    if (moment(moment(Details.date).format("L")).isSame(moment().format("L"))) {
      if (
        dateCompare(moment(Details.date).format("HH:mm:ss"), "06:00:00") ==
          -1 &&
        dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
      ) {
        takeAwayNumber = 1;
        setItem("previousTakeAwayNumber", {
          date: new Date(),
          number: 1,
        });
      } else {
        takeAwayNumber = 1 + Details.number;
        setItem("previousTakeAwayNumber", {
          date: new Date(),
          number: 1 + Details.number,
        });
      }
    } else {
      if (dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0) {
        takeAwayNumber = 1;
        setItem("previousTakeAwayNumber", {
          date: new Date(),
          number: 1,
        });
      } else {
        takeAwayNumber = 1 + Details.number;
        setItem("previousTakeAwayNumber", {
          date: new Date(),
          number: 1 + Details.number,
        });
      }
    }
  } else {
    takeAwayNumber = 1;
    setItem("previousTakeAwayNumber", {
      date: new Date(),
      number: 1,
    });
  }
  return takeAwayNumber;
};
const createOnlineTakeAway = (data, registerDetails, record) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    local_cart_data = [];
  } else {
    local_cart_data = JSON.parse(local_cart_data);
  }
  let cartKey =
    Math.floor(Math.random() * 1000000000) + "_time_" + new Date().getTime();
  let RegisterId = registerDetails?._id;
  let takwAwayNumber = getTakeAwayNumber();

  let default_cart_object = {
    Status: "In Progress",
    cartKey: cartKey,
    created_at: new Date(),
    data: data,
    register_id: RegisterId,
    onlineOrder: record,
    tableName: "TakeAway " + takwAwayNumber,
    tablekey: "TakeAway " + takwAwayNumber,
    type: "take-away-local",
    onlineOrderType: "Accept",
    otherDetails: {
      bulkDiscountDetails: {
        type: "FLAT",
        value: record.disconut,
        bulkValue: record.disconut,
      },
    },
  };

  if (registerDetails?.table_numbers != "") {
    localStorage.setItem("active_cart", cartKey);
  }
  local_cart_data.push(default_cart_object);
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return default_cart_object;
};

const acceptOnlineOrderList = () => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    local_cart_data = [];
  } else {
    local_cart_data = JSON.parse(local_cart_data);
  }
  let filterAccept = local_cart_data.filter(
    (val) => val.onlineOrderType && val.onlineOrderType == "Accept"
  );
  return filterAccept.reverse();
};
export {
  getItem,
  setItem,
  removeItem,
  createNewCartwithKeyandPush,
  getAllTakeAwayDataInLocal,
  getLocalCartCount,
  getCartInfoFromLocalKey,
  setCartInfoFromLocalKey,
  getTableStatusFromId,
  getCartInfoLocalListsData,
  updateTableNameFromCartId,
  removeCartFromLocalStorage,
  checkIfTableIsSelected,
  checkIfTableIsSelectedByCartkey,
  getAllDeliveryDataInLocal,
  storeOtherData,
  setOrderTickets,
  tableStatusChange,
  getallCustomSwapList,
  darftCount,
  getTableNameTo,
  AddLastSplitName,
  getallCustomSplitList,
  getTotalOfUnpaid,
  bookingAddInLocalData,
  checkTakeAwayTodayYaNot,
  checkDeliveryTodayYaNot,
  swaptable,
  createOnlineTakeAway,
  acceptOnlineOrderList,
  getCartInfoFromTableKey,
};
