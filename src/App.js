import "./App.css";
import * as axios from "axios";
import { useEffect, useState, useMemo, useContext, useRef } from "react";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { ConfigProvider, message } from "antd";
import store from "./redux/store";
import {
  waiterTableUpdate,
  addWaiterData,
  removeWaiterData,
} from "./redux/authentication/actionCreator";
import Admin from "./routes/admin";
import Restaurant from "./routes/restaurant";
import Cashier from "./routes/cashier";
import AppRoute from "./routes/app";
import Auth from "./routes/auth";
import "./static/css/style.css";
import { SocketProvider, SocketContext } from "./socket/socketContext";
import ReactDOMServer from "react-dom/server";
import OrderTicketPrint from "../src/container/Sell/Current/OrderTicketPrint";

import config from "./config/config";
import ProtectedRoute from "./components/utilities/protectedRoute";
import {
  Item,
  setItem,
  removeItem,
  getItem,
  setOrderTickets,
  getCartInfoLocalListsData,
  getCartInfoFromTableKey,
  createNewCartwithKeyandPush,
} from "./utility/localStorageControl";
import { useDispatch } from "react-redux";
import { offLineMode } from "./redux/authentication/actionCreator";
import {
  onlineToOpenSihft,
  onlineToClosedShift,
} from "./redux/authentication/actionCreator";
import { CreateOrder, AddAndUpdateBooking } from "./redux/sell/actionCreator";
import { getAllSetUpList } from "./redux/setUp/actionCreator";
import { addOrUpdatePatty } from "./redux/pattyCash/actionCreator";
import { getReceiptNumber, dateCompare } from "./utility/utility";

import { getAllOrderList } from "./redux/onlineOrder/actionCreator";
import moment from "moment";
import "antd/dist/antd.css";
import { array } from "prop-types";

const { theme } = config;

const { ipcRenderer } = window.require("electron");

const ProviderConfig = () => {
  const dispatch = useDispatch();
  const {
    rtl,
    isLoggedIn,
    topMenu,
    darkMode,
    userRole,
    isShopSetUp,
    waiterTableList,
    updateTrue,
  } = useSelector((state) => {
    const userDetails = getItem("userDetails");
    return {
      darkMode: state.ChangeLayoutMode.data,
      rtl: state.ChangeLayoutMode.rtlData,
      topMenu: state.ChangeLayoutMode.topMenu,
      isLoggedIn: state.auth.login,
      waiterTableList: state.auth.waiterTableDataList,
      userRole: userDetails ? userDetails.role : "",
      isShopSetUp: userDetails ? userDetails.is_shop : "",
      updateTrue: state.auth.checkUpdate,
    };
  });

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    window.onload = function() {
      dispatch(getAllSetUpList());
    };
    let unmounted = false;
    if (!unmounted) {
      setPath(window.location.pathname);
    }
    return () => (unmounted = true);
  }, [setPath]);

  const [online, setOnline] = useState(window.navigator.onLine);
  function useOnlineStatus() {
    useEffect(() => {
      function handleOnline() {
        setOnline(true);
      }

      function handleOffline() {
        setOnline(false);
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);

    return online;
  }
  let status = useOnlineStatus();
  useEffect(() => {
    if (status) {
      let pendingReceiptsList = getItem("pendingReceipts")?.reverse();
      console.log("kpkpkpkpkp90909", pendingReceiptsList);
      if (
        pendingReceiptsList != null &&
        pendingReceiptsList &&
        pendingReceiptsList.length > 0
      ) {
        let pendinglist = [];
        let totalCount = pendingReceiptsList.length;
        let pending = [];
        pendingReceiptsList.map(async (val, index) => {
          if (val.draftList) {
            let data = await dispatch(AddAndUpdateBooking(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          } else {
            let data = await dispatch(CreateOrder(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          }
        });
        setItem("pendingReceipts", pendinglist);
      }
      let pendingshiftsList = getItem("pendingShiftList")?.reverse();

      if (pendingshiftsList != null && pendingshiftsList.length > 0) {
        pendingshiftsList.map(async (val) => {
          if (val["openbalance"] !== undefined) {
            let data = await onlineToOpenSihft(val.openbalance, val.userName);
          } else {
            let data = await onlineToClosedShift(
              val.closebalance,
              val.userName
            );
          }
        });
        setItem("pendingShiftList", []);
      }

      let pendingPaattycashList = getItem("pendingPattyCashEntries")?.reverse();
      if (pendingPaattycashList != null && pendingPaattycashList.length > 0) {
        let pending = [];
        let pendinglist = [];
        pendingPaattycashList.map(async (val, index) => {
          let data = await dispatch(addOrUpdatePatty(val));
          if (data) {
            pending.push(index);
            pendingPaattycashList.shift();
            pendinglist = pendingPaattycashList;
          } else {
            pendinglist = pendingPaattycashList;
          }
        });
        setItem("pendingPattyCashEntries", []);
      }
      dispatch(offLineMode(false));
    } else {
      dispatch(offLineMode(true));
    }
  }, [status]);

  const MINUTE_MS = 20000;

  // socket Connection
  const socket = getItem("waiter_app_enable") && useContext(SocketContext);

  let [setupList, setsetupPrinterList] = useState(
    getItem("setupCache")?.setUpPrinter
  );
  let confirmOrderTable = [];
  const getTableList = (currentRegisterData) => {
    if (currentRegisterData) {
      let AllTableList = [];
      if (currentRegisterData.table_numbers != "") {
        let tableNosArray = currentRegisterData.table_numbers.split("),");
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

        finalTableArray.map((table) => {
          table.rows.map((value) => {
            AllTableList.push({
              table_name: value,
            });
          });
        });
      }
      return AllTableList;
    }
  };
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
  let numberOfKitchen = [];
  const [tableListOfData, setTableList] = useState([]);
  const [printDone, setPrintDone] = useState(false);
  const sendPrintReq = (valuesOfKitchen) => {
    setPrintDone(false);
    ipcRenderer.send("PrintReceipt", valuesOfKitchen);
    numberOfKitchen = [];
    // ipcRenderer.on("printDone", async (event, printDone) => {
    //   if (printDone == valuesOfKitchen.length) {
    //     setPrintDone(true);
    //     numberOfKitchen = [];
    //     confirmOrderTable = [];
    //   }
    // });
  };

  const findListOfUpdateProduct = (
    localCartKey,
    registerData,
    addItemList,
    removeItemList,
    tableName,
    deviceId
  ) => {
    let localCartInfo = getCartInfoFromTableKey(localCartKey, registerData);
    console.log("localCartInfpdots", localCartInfo);
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      let localDataTableList = getCartInfoLocalListsData(registerData);
      socket?.emit("send_local_table_data", localDataTableList, deviceId);
      socket?.emit(
        "send_succuses_msg",
        "Settle Payment of this table.",
        deviceId
      );
      let obj = { listOfProdut: [] };
      return obj;
    }
    if (localCartInfo == undefined) {
      localCartInfo = createNewCartwithKeyandPush(
        "custom-table-local",
        {
          tableName: tableName,
          tablekey: localCartKey,
        },
        registerData,
        {}
      );
      console.log("localCartInfocheckproper", localCartInfo);
    }
    let selectedProduct = localCartInfo?.data ? localCartInfo.data : [];
    console.log("addItemListodata9099", localCartInfo, localCartKey);
    let allUpdatedProduct = [];
    if (selectedProduct && addItemList && addItemList.length) {
      addItemList.reverse().map((val) => {
        allUpdatedProduct.push(val.key);
        let findIndex = selectedProduct.findIndex((j) => j.key == val.key);
        if (findIndex != -1) {
          selectedProduct[findIndex].orderTiketsNotes = val.orderTiketsNotes
            ? val.orderTiketsNotes
            : "";
          selectedProduct[findIndex].updatedTime = new Date().getTime();
          selectedProduct[findIndex].quantity =
            selectedProduct[findIndex].quantity + val.quantity;
          selectedProduct[findIndex].calculatedprice =
            selectedProduct[findIndex].quantity *
            (selectedProduct[findIndex].key_price
              ? selectedProduct[findIndex].key_price
              : selectedProduct[findIndex].price);
          if (selectedProduct[findIndex].productInclusivePrice != undefined) {
            selectedProduct[findIndex].productInclusivePricecalculatedprice =
              selectedProduct[findIndex].quantity *
              (selectedProduct[findIndex].productInclusivePriceKeyPrice
                ? selectedProduct[findIndex].productInclusivePriceKeyPrice
                : selectedProduct[findIndex].productInclusivePrice);
          }
        } else {
          val.updatedTime = new Date().getTime();
          selectedProduct.push(val);
        }
      });
    }
    if (selectedProduct && removeItemList?.length) {
      removeItemList.reverse().map((val) => {
        allUpdatedProduct.push(val.key);
        let findIndex = selectedProduct.findIndex((j) => j.key == val.key);
        if (findIndex != -1) {
          selectedProduct[findIndex].updatedTime = new Date().getTime();
          selectedProduct[findIndex].quantity =
            selectedProduct[findIndex].quantity - val.quantity;
          selectedProduct[findIndex].calculatedprice =
            selectedProduct[findIndex].quantity *
            (selectedProduct[findIndex].key_price
              ? selectedProduct[findIndex].key_price
              : selectedProduct[findIndex].price);
          if (selectedProduct[findIndex].productInclusivePrice != undefined) {
            selectedProduct[findIndex].productInclusivePricecalculatedprice =
              selectedProduct[findIndex].quantity *
              (selectedProduct[findIndex].productInclusivePriceKeyPrice
                ? selectedProduct[findIndex].productInclusivePriceKeyPrice
                : selectedProduct[findIndex].productInclusivePrice);
          }
        } else {
          val.updatedTime = new Date().getTime();

          selectedProduct.push(val);
        }
      });
    }
    console.log("sagarbhaicheckPlaese", allUpdatedProduct);

    selectedProduct
      .filter((val) => val.quantity > 0)
      .sort((a, b) => parseFloat(b.updatedTime) - parseFloat(a.updatedTime));
    let finalData = [];
    let privewsTikets = [];
    if (localCartInfo && localCartInfo.orderTicketsData) {
      let totalOrderTikets = [];
      let checkdata = [];
      localCartInfo.orderTicketsData.map((val) => {
        checkdata.push(val.tiketNumber);
        val.itemList.map((i) => {
          totalOrderTikets.push(i);
        });
      });
      privewsTikets = checkdata;
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

    arrayData = arrayData.filter((val) => {
      if (val.categoryName && val.data && val.data.length) {
        val["data"] = val.data.filter((z) => {
          let find = allUpdatedProduct.find((y) => y == z.key);
          if (find) {
            return z;
          }
        });
        if (val.data.length) {
          return val;
        }
      }
    });
    console.log("howcanchecknjsjc", arrayData);
    let obj = {
      selectedProduct: selectedProduct,
      listOfProdut: arrayData,
      localCartInfo: localCartInfo,
      privewsTikets: privewsTikets,
    };
    return obj;
  };

  const waiterToCreateOrder = (tableData, waiterName, deviceId) => {
    let registerData = getItem("setupCache")?.register?.find(
      (val) => val.active
    );
    console.log("checkBromkdmdmad", tableData);
    const {
      listOfProdut,
      localCartInfo,
      selectedProduct,
      privewsTikets,
    } = findListOfUpdateProduct(
      tableData.tablekey,
      registerData,
      tableData.addItemList,
      tableData.removeItemList,
      tableData.tableName,
      deviceId
    );
    console.log("xlistOfProdut", listOfProdut);

    if (listOfProdut.length == 0) {
      return true;
    }
    console.log("localcartInfo", localCartInfo);
    if (localCartInfo) {
      let receiptNumber =
        localCartInfo && localCartInfo.receipt_Number
          ? localCartInfo.receipt_Number
          : getReceiptNumber(registerData, []);

      let finalResponse;
      let createOrderTiketsList = [];
      console.log("sagartankhhhcbehcbecbeceed", listOfProdut);
      listOfProdut.map((val) => {
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
          orderNotes: tableData.orderTiktesNotes,
          tiketNumber: OrderTicketNumber,
          categoryName: val.categoryName,
          add_remove: checkCategory(val),
          itemList: val.data,
          enterDate: new Date(),
          table_name: localCartInfo?.tableName,
          receiptNumber: receiptNumber,
          receiptNumberDetails: {
            type: "receipt",
            number: receiptNumber,
          },
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
            categoryDetails={object}
            PreviousTikets={privewsTikets}
            ReceiptNumber={receiptNumber}
            TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
            waiterName={localCartInfo?.waiterName}
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
      });

      sendPrintReq(numberOfKitchen);
      if (localCartInfo?.cartKey && createOrderTiketsList) {
        finalResponse = setOrderTickets(
          localCartInfo.cartKey,
          createOrderTiketsList,
          selectedProduct,
          waiterName
        );
      }
      console.log("howcancheckFinal", selectedProduct, finalResponse);
      if (finalResponse?.allLocalData) {
        dispatch(waiterTableUpdate([...finalResponse.allLocalData]));
        socket?.emit(
          "send_local_table_data",
          finalResponse.allLocalData,
          deviceId
        );
        // console.log("sagarbhaicheckwaiteriswait", finalResponse);

        socket?.emit("send_succuses_msg", "Order created", deviceId);
      } else {
        return true;
      }
      return localCartInfo?.cartKey;
    }
  };

  function resoleveMultipleTable(tableData) {
    return new Promise((resolve) => {
      console.log("Testing Table Data ==> ", tableData.tableName);
      let localAllTableData = getItem("LOCAL_STORAGE_CART_KEY_NAME");
      let findTable = localAllTableData?.find(
        (val) =>
          val.tablekey == tableData.tablekey &&
          val.register_id == tableData.register_id
      );

      if (findTable == undefined) {
        setItem("LOCAL_STORAGE_CART_KEY_NAME", [
          ...localAllTableData,
          tableData,
        ]);
        dispatch(waiterTableUpdate([...localAllTableData, tableData]));
      }
      resolve();
    });
  }

  function resoleveMultiplePrint(receiveConfirmOrder, deviceId) {
    return new Promise((resolve) => {
      waiterToCreateOrder(
        receiveConfirmOrder,
        receiveConfirmOrder?.waiterName,
        deviceId
      );
      resolve();
    });
  }

  // const handlePrint = (confirmOrderList) => {
  //   console.log("daadadadad", confirmOrderList.length);
  //   confirmOrderList.map(async ({ receiveConfirmOrder, deviceId }) => {
  //     console.log("09099090090909444", receiveConfirmOrder.tableName);
  //     await resoleveMultiplePrint(receiveConfirmOrder, deviceId);
  //   });
  //   console.log("sagartankbhaijovne", numberOfKitchen.length);
  //   sendPrintReq(numberOfKitchen);
  // };
  const didMount = useRef(false);
  let printDoneArray = [];
  // useEffect(() => {
  //   if (didMount.current && waiterTableList && waiterTableList.length) {
  //     let i = 0;
  //     console.log("checkdsjjdasdadad", i, waiterTableList.length);
  //     do {
  //       const { receiveConfirmOrder, deviceId, cartKey } = waiterTableList[i];
  //       let printDoneArray = getItem("printDoneArray")
  //         ? getItem("printDoneArray")
  //         : [];
  //       console.log("sagarbhaicheckdadadad7879", printDoneArray);
  //       if (printDoneArray?.find((val) => val == cartKey) == undefined) {
  //         const timer = setTimeout(() => {
  //           console.log("This will run after 1 second!");
  //           waiterToCreateOrder(
  //             receiveConfirmOrder,
  //             receiveConfirmOrder?.waiterName,
  //             deviceId
  //           );
  //           setItem("printDoneArray", [...printDoneArray, cartKey]);
  //           dispatch(removeWaiterData(cartKey));
  //         }, 500);
  //         return () => clearTimeout(timer);
  //       }
  //       i++;
  //     } while (i < waiterTableList.length);
  //   } else {
  //     didMount.current = true;
  //   }
  // }, [updateTrue]);
  // useEffect(() => {
  //   if (waiterTableList.length == 0) {
  //     setItem("printDoneArray", []);
  //   }
  // }, [waiterTableList]);
  useEffect(() => {
    if (getItem("waiter_app_enable")) {
      socket?.on("localStorage", (socketId) => {
        const allLocalData = getItem("setupCache");
        const currentRegisterData = allLocalData?.register?.find(
          (val) => val.active
        );
        const localTableData = getCartInfoLocalListsData(currentRegisterData);
        const tableList = getTableList(currentRegisterData);
        const productList = getItem("productList")?.filter((val) => {
          if (val?.limit_to_register.length > 0) {
            if (val.limit_to_register.includes(currentRegisterData?._id)) {
              return val;
            }
          } else {
            return val;
          }
        });

        socket?.emit(
          "localStorageData",
          {
            tableList: tableList,
            productList: productList,
            localTableData: localTableData,
            allLocalData: allLocalData,
          },
          socketId
        );
      });

      socket?.on("receive_mobile_local_table_data", async (tableData) => {
        await resoleveMultipleTable(tableData);
      });
      let checkNew = [];
      socket?.on(
        "receive_mobile_to_confirm_order",
        async (receiveConfirmOrder, deviceId) => {
          // socket?.emit("send_succuses_msg", "Order created", deviceId);
          // console.log("dsdgadadhjadadadadad", receiveConfirmOrder);
          // const timer = setTimeout(() => {
          //   console.log("saassasasasa", receiveConfirmOrder.tableName);
          //   waiterToCreateOrder(
          //     receiveConfirmOrder,
          //     receiveConfirmOrder?.waiterName,
          //     deviceId
          //   );
          // }, 1000);
          // return () => clearTimeout(timer);
          // dispatch(
          //   addWaiterData({
          //     cartKey: receiveConfirmOrder.tablekey,
          //     receiveConfirmOrder,
          //     deviceId,
          //   })
          // );
          await resoleveMultiplePrint(receiveConfirmOrder, deviceId);
          // socket?.emit("send_local_table_data", [], deviceId);
          // checkNew.push({
          //   receiveConfirmOrder: receiveConfirmOrder,
          //   deviceId: deviceId,
          // });
          // confirmOrderTable.push({
          //   receiveConfirmOrder: receiveConfirmOrder,
          //   deviceId: deviceId,
          // });

          // socket?.emit("send_succuses_msg", "Order created", deviceId);

          // const timer = setTimeout(() => {
          //   let totallist = confirmOrderTable;
          //   console.log(
          //     "9090909909jijij8989898",
          //     totallist.length,
          //     confirmOrderTable.length,
          //     checkNew.length
          //   );
          //   handlePrint(totallist);
          //   // setTableList([...confirmOrderTable]);
          //   confirmOrderTable = [];
          //   // checkNew = [];
          // }, 1000);

          //   return () => clearTimeout(timer);
        }
      );
    }
  }, [socket]);

  useEffect(() => {
    if (getItem("dyno_api_enable")) {
      const interval = setInterval(async () => {
        let oldOrder = getItem("totalOnlineOrder")?.length
          ? getItem("totalOnlineOrder").length
          : 0;
        let registerData = getItem("setupCache")?.register?.find(
          (val) => val.active
        );

        if (registerData && registerData.onlineOrder?.length) {
          let data = await dispatch(getAllOrderList(registerData.onlineOrder));

          if (data && oldOrder != data.kitchenUserList.length) {
            setItem("totalOnlineOrder", data.kitchenUserList);
            message.success({
              content: "New Order Coming",
              style: {
                float: "center",
                marginTop: "2vh",
              },
            });
          }
        }
      }, MINUTE_MS);

      return () => clearInterval(interval);
    }
    // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [getItem("dyno_api_enable")]);

  // useEffect(() => {
  //   console.log("confirmOrderTable7979", tableListOfData.length);
  //   confirmOrderTable = [];
  //   tableListOfData.map(async ({ receiveConfirmOrder, deviceId }) => {
  //     console.log("09099090090909444", receiveConfirmOrder.tableName);
  //     await resoleveMultiplePrint(receiveConfirmOrder, deviceId);
  //   });
  //   console.log("sagartankbhaijovne", numberOfKitchen.length);
  //   sendPrintReq(numberOfKitchen);

  //   // setTableList([]);
  // }, [tableListOfData.length]);

  return (
    <ConfigProvider direction={rtl ? "rtl" : "ltr"}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
        <Router basename={process.env.PUBLIC_URL}>
          {!isLoggedIn ? (
            <Route path="/" component={Auth} />
          ) : userRole === "admin" ? (
            <ProtectedRoute path="/admin" component={Admin} />
          ) : userRole === "cashier" ? (
            <ProtectedRoute path="" component={Cashier} />
          ) : userRole === "app_user" ? (
            <ProtectedRoute path="/app" component={AppRoute} />
          ) : (
            <ProtectedRoute path="" component={Restaurant} />
          )}

          {isLoggedIn &&
            (path === process.env.PUBLIC_URL ||
              path === `${process.env.PUBLIC_URL}/` ||
              path ===
                `${process.env.PUBLIC_URL}/
              ` ||
              path === `${process.env.PUBLIC_URL}/pin-auth`) &&
            (userRole === "admin" ? (
              <Redirect to="/admin" />
            ) : userRole === "app_user" ? (
              <Redirect to="/app/app/all" />
            ) : userRole === "cashier" ? (
              <Redirect to="/sell" />
            ) : userRole === "restaurant" && !isShopSetUp ? (
              <Redirect to="/settings/shop" />
            ) : (
              <Redirect to="/sell" />
            ))}

          {/* <p>{online ? "online" : "offline"}</p> */}
        </Router>
      </ThemeProvider>
      {/* <p>{printDone ? "printDone" : "not Print Done"}</p>
      <p>tableListOfData length {tableListOfData.length}</p>
      <p>confirmOrderTable length {confirmOrderTable.length}</p> */}
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      {JSON.parse(localStorage.getItem("waiter_app_enable")) ? (
        <SocketProvider>
          <ProviderConfig />
        </SocketProvider>
      ) : (
        <ProviderConfig />
      )}
    </Provider>
  );
}

export default App;
