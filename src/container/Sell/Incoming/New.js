import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Checkbox, Radio, Tag, Tooltip } from "antd";

import { Main, TableWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import {
  getAllOrderList,
  accetOrders,
  onlineOrderProductList,
  getZometoDetail,
} from "../../../redux/onlineOrder/actionCreator";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "../sell.css";
import {
  createOnlineTakeAway,
  setOrderTickets,
  setItem,
  getItem,
  getCartInfoFromLocalKey,
} from "../../../utility/localStorageControl";
import moment from "moment";
import OrderTicketPrint from "../Current/OrderTicketPrint";
import ReactDOMServer from "react-dom/server";
import { Spin } from "antd";
const { ipcRenderer } = window.require("electron");

import { getReceiptNumber } from "../../../utility/utility";
import { getAllSetUpPrinterList } from "../../../redux/printer/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { setIsLoading } from "../../../redux/chartContent/actionCreator";
// import { useDispatch, useSelector } from "react-redux";
const New = (props) => {
  const { currentRegisterData, changeTab } = props;
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [totalOrders, setTotalOrderList] = useState([]);
  const { onlineOrderList } = useSelector((state) => {
    return {
      onlineOrderList: state.kitchenUser.kitchenUserList,
    };
  });
  const [loader, setLoader] = useState({
    recordId: "",
    check: false,
  });
  useEffect(() => {
    if (getItem("totalOnlineOrder")?.length) {
      setTotalOrderList(getItem("totalOnlineOrder"));
    }
  }, [getItem("totalOnlineOrder")?.length]);
  // [{
  //   Source: "zomato", Time: "sas", order_id: "sas", Items: [{ name: "pizza", quantity: 3 }],
  //   Value: 30, Customer: "sagar5"
  // }]

  async function fetchAllOrders(first) {
    if (currentRegisterData?.onlineOrder) {
      const getAllOrderDetailsList = await dispatch(
        getAllOrderList(currentRegisterData.onlineOrder)
      );

      if (getAllOrderDetailsList) {
        console.log("getAllOrderDetailsList", getAllOrderDetailsList);
        setItem("totalOnlineOrder", getAllOrderDetailsList.kitchenUserList);
        // setTotalOrderList(getAllOrderDetailsList[0]?.orders?.filter((val) => val.status.order_status == "ordered" && val.status.placed_status == "unplaced"))
        console.log(
          "getAllOrderDetailsList.kitchenUserList",
          getAllOrderDetailsList.kitchenUserList
        );
        if (first != "first") {
          setTotalOrderList(getAllOrderDetailsList.kitchenUserList);
        }
        return getAllOrderDetailsList;
      }
    }
  }

  useEffect(() => {
    if (isMounted.current) {
      fetchAllOrders("first");
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  let [setupList, setsetupPrinterList] = useState([]);

  useEffect(async () => {
    let getSetupPrintList = await dispatch(getAllSetUpPrinterList("sell"));
    if (getSetupPrintList) {
      setsetupPrinterList(getSetupPrintList);
    }
  }, []);

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

  const checkListOfProduct = (localCartInfo, items) => {
    let selectedProduct = items;
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
        if (!res[value?.product_category]) {
          res[value?.product_category] = {
            categoryName: value?.product_category,
            data: [value],
          };
        } else {
          res[value?.product_category].data.push(value);
        }

        return res;
      }, {})
    );

    arrayData = arrayData.filter((val) => val.categoryName);

    return [...arrayData];
  };
  let numberOfKitchen = [];
  const createOrderTikets = (localCartInfo, items) => {
    let PreviousTikets = [];
    let receiptNumber =
      localCartInfo && localCartInfo.receipt_Number
        ? localCartInfo.receipt_Number
        : getReceiptNumber(currentRegisterData, []);
    let listOfProducts = [
      { categoryName: "Main Kitchen", data: localCartInfo.data },
    ];
    let createOrderTiketsList = [];
    listOfProducts.map((val) => {
      let OrderTicketNumber;
      if (getItem("previousOrderTicketNumber") != null) {
        let Details = getItem("previousOrderTicketNumber");
        if (
          moment(moment(Details.date).format("L")).isSame(moment().format("L"))
        ) {
          if (
            dateCompare(moment(Details.date).format("HH:mm:ss"), "06:00:00") ==
              -1 &&
            dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
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
            dateCompare(moment(new Date()).format("HH:mm:ss"), "06:00:00") >= 0
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
        orderNotes: val?.order_tickets_notes,
        tiketNumber: OrderTicketNumber,
        categoryName: val.categoryName,
        add_remove: checkCategory(val),
        itemList: val.data,
        enterDate: new Date(),
        table_name: localCartInfo.tableName,
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
          TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
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
          ReceiptNumber={receiptNumber}
          TableName={localCartInfo?.tableName ? localCartInfo?.tableName : ""}
        />
      );
      window.frames["print_frame"].window.focus();
    });

    if (localCartInfo?.cartKey) {
      setOrderTickets(localCartInfo?.cartKey, createOrderTiketsList);
    }
    sendPrintReq(numberOfKitchen);
    return true;
  };
  const acceptOrder = async (record) => {
    if (record.order_id && loader.check == false) {
      setLoader({
        recordId: record.order_id,
        check: true,
      });
      const response = await dispatch(
        accetOrders(
          currentRegisterData.onlineOrder,
          record.order_id,
          record.Source
        )
      );
      console.log("response745874587", response);
      if (response) {
        let allOrderList = await fetchAllOrders();

        if (allOrderList && allOrderList.kitchenUserList) {
          let items = [];
          record.Items.map((val) => {
            let obj = {
              AddonOptions: [],
              add_or_remove: "Added Items",
              calculatedprice: val.calculatedprice,
              display_name: val.name,
              id: val.item_id,
              isAddon: false,
              isAddon1st: false,
              isAddon2nd: false,
              isAddon3rd: false,
              isVarience: false,
              item: val.name,
              key: val.item_id,
              key_price: 0,
              new_item: true,
              newqty: val.quantity,
              option_addon_group: [],
              option_item_group: [],
              option_variant_group: [],
              order_ticket_group: {},
              price: val.price,
              productTaxes: 0,
              product_category: val.category,
              quantity: val.quantity,
              taxGroup: {},
              variance_object: {},
              variance_price: 0,
            };
            items.push(obj);
          });

          let localCartInfo = createOnlineTakeAway(
            items,
            currentRegisterData,
            record
          );

          if (localCartInfo) {
            let response = createOrderTikets(localCartInfo, items);
            if (response) {
              setLoader({
                recordId: "",
                check: false,
              });
            }
          }
        }
      }
    }
  };

  // const dataSource = [];
  // if (totalOrders.length)
  //   totalOrders.map((value) => {
  //     const {
  //       id,
  //       source,
  //       order_id,
  //       Time,
  //       cart,
  //       bill,
  //       Type,
  //       customer,
  //       customer_comment,
  //       status
  //     } = value;
  //     const { items } = value.cart

  //     return dataSource.push({
  //       id: order_id,
  //       GST_details: value.GST_details,
  //       Source: source,
  //       order_id: order_id,
  //       Value: bill,
  //       Time: moment(status.ordered_time).format("MMM DD, Y, h:mm A"),
  //       Items: items,
  //       Status: customer_comment,
  //       Customer: customer,
  //     });
  //   });

  const columns = [
    {
      title: "Order Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Source",
      dataIndex: "Source",
      key: "source",
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
      width: "25%",
      render(value, record, index1) {
        return {
          children: (
            <>
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
                      {val.quantity} x {val.name}{" "}
                      <UpOutlined
                        style={{
                          cursor: "pointer",
                          fontSize: "10px",
                        }}
                      />{" "}
                    </p>
                  ) : (
                    <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                      {val.quantity} x {val.name}{" "}
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
                  {value[0].quantity} x {value[0].name}{" "}
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
                onClick={() => acceptOrder(record)}
                // style={{ cursor: "pointer", fontSize: "17px", marginRight: 10 }}
              >
                <span className="whiteloader">
                  {loader.check && loader.recordId == record.id ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 16,
                            margin: "0px 14px",
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    "Accept"
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
      <TableWrapper>
        <Table
          rowKey="id"
          size="small"
          dataSource={totalOrders}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            total: totalOrders.length,
          }}
        />
      </TableWrapper>
    </div>
  );
};

export { New };
