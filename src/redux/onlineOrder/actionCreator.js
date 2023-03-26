import actions from "./actions";
import axios from "axios";
import moment from "moment";
import { getItem, setItem } from "../../utility/localStorageControl";
import { faVanShuttle } from "@fortawesome/free-solid-svg-icons";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { ZoomControl } from "react-leaflet";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  kitchenUserAdd,
  kitchenUserAddErr,
  kitchenUserList,
  kitchenUserListErr,
  kitchenUserId,
  kitchenUserIdErr,
  kitchenUserDelete,
  kitchenUserDeleteErr,
} = actions;

const addOrUpdateDyno = (formData, dynoId) => {
  return async (dispatch) => {
    try {
      let getAddedDyno = {};
      if (dynoId) {
        let response = await axios.post(`${formData.dynoUrl}/login`);
        if (
          response?.data?.statusMessage == "Success" ||
          response?.data?.status?.status == "success"
        ) {
          let payLoad = {
            registerId: formData.registerId,
            orderType:
              formData.dynoUrl.indexOf("zomato") > -1 ? "zomato" : "swiggy",
            url: formData.dynoUrl,
            details: {},
          };
          getAddedDyno = await DataService.put(
            API.onlineOrder.updateDyno + "/" + dynoId,
            payLoad
          );
        }
      } else {
        let response = await axios.post(`${formData.dynoUrl}/login`);
        if (
          response?.data?.statusMessage == "Success" ||
          response?.data?.status?.status == "success"
        ) {
          let payLoad = {
            registerId: formData.registerId,
            orderType:
              formData.dynoUrl.indexOf("zomato") > -1 ? "zomato" : "swiggy",
            url: formData.dynoUrl,
            details: {},
          };
          getAddedDyno = await DataService.post(
            API.onlineOrder.addDyno,
            payLoad
          );
        }
      }

      if (!getAddedDyno.data.error) {
        return getAddedDyno.data.data;
      } else {
        return dispatch(kitchenUserAddErr(getAddedDyno.data.data));
      }
    } catch (err) {
      dispatch(kitchenUserAddErr(err));
    }
  };
};

const onlineOrderProductList = (url) => {
  return async (dispatch) => {
    try {
      let response = await axios.get(url);
      if (response?.data?.data) {
        return response.data.data;
      } else {
        return response.data.data;
      }
    } catch (err) {
      return false;
    }
  };
};
const accetOrders = (onlineOrder, orderID, checkZomato) => {
  return async (dispatch) => {
    try {
      if (onlineOrder && onlineOrder.length > 0) {
        let zomatoUrl = onlineOrder.find((val) => val.orderType == "zomato")
          ?.url;
        let swiggyUrl = onlineOrder.find((val) => val.orderType == "swiggy")
          ?.url;
        // for (let i = 0; i < onlineOrder.length; i++) {
        console.log("checkZomatodgdgdgd", swiggyUrl);
        if (swiggyUrl && checkZomato != "Zomato") {
          const response = await axios.post(
            `${swiggyUrl}/orders/accept?order_id=${orderID}`
          );
          if (response) {
            return true;
          }
        } else if (zomatoUrl && checkZomato == "Zomato") {
          const response = await axios.post(
            `${zomatoUrl}/orders/accept_order?order_id=${orderID}`
          );
          if (response) {
            return true;
          }
        }
        // }
      }
    } catch (err) {
      return false;
    }
  };
};
const redayOrders = (onlineOrder, orderID, checkZomato) => {
  return async (dispatch) => {
    try {
      if (onlineOrder && onlineOrder.length > 0) {
        let zomatoUrl = onlineOrder.find((val) => val.orderType == "zomato")
          ?.url;
        let swiggyUrl = onlineOrder.find((val) => val.orderType == "swiggy")
          ?.url;
        // for (let i = 0; i < onlineOrder.length; i++) {
        if (swiggyUrl && checkZomato != "Zomato") {
          const response = await axios.post(
            `${swiggyUrl}/orders/ready?order_id=${orderID}`
          );
        } else if (zomatoUrl && checkZomato == "Zomato") {
          const response = await axios.post(
            `${zomatoUrl}/orders/mark_ready?order_id=${orderID}`
          );
        }
        // }
        return true;
      }
    } catch (err) {
      return false;
    }
  };
};
const markInOutOfStock = (item) => {
  return async (dispatch) => {
    try {
      if (item.available == 1) {
        //outOfStockApiCall
        let response = await axios.post(
          `${item.url}/items/outofstock?item_id=${item.itemId}`
        );
        return response;
      } else {
        //inStockApicall
        let response = await axios.post(
          `${item.url}/items/instock?item_id=${item.itemId}`
        );
        return response;
      }
    } catch (err) {
      return false;
    }
  };
};

const getAlldynoList = () => {
  return async (dispatch) => {
    try {
      const getAllList = await DataService.get(`${API.onlineOrder.dynoList}`);

      if (!getAllList.data.error) {
        return getAllList.data.data;
      }
    } catch (err) {
      dispatch(kitchenUserIdErr(err));
    }
  };
};

let zomatoOrder = {
  id: "4458976615",
  resId: "19027430",
  state: "NEW",
  handoverDetails: {
    time: 18,
    maxTime: 23,
    minTime: 13,
    text: "Set food preparation time",
    stepSize: 1,
    isPreparationDelayAllowed: true,
  },
  creator: {
    userId: "101990931",
    name: "Harman",
    countryIsdCode: "91",
    orderCount: 12,
    orderCountDisplay: "12th order by Harman",
    address: {
      id: "93352037",
      address: "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)",
      location: {
        latitude: 30.6897469,
        longitude: 76.2452087,
      },
      locality: "Alaur, Gobindgarh, Khanna (<1 km, 4 mins away)",
    },
    profilePictureUrl:
      "https://b.zmtcdn.com/data/user_profile_pictures/734/1f93e1998f7eb131bfdcf39049cb6734.jpg",
    profileUrl: "https://www.zomato.com/users/101990931",
    customerSegmentation: "STANDARD",
    isRepeatCustomer: true,
    originalName: "Harman Kharoud",
  },
  createdAt: "2022-11-07T06:41:02Z",
  actionedAt: "2022-11-07T06:41:02Z",
  paymentMethod: "PAID",
  zomatoDelivered: true,
  deliveryMode: "DELIVERY",
  otp: "0038",
  acceptExpiryTime: 60,
  pickupThresholdTime: 180,
  paymentDetails: {
    paymentType: "PAID",
    paymentMethod: "PAID",
  },
  orderMessages: [
    {
      messageType: "ORDER",
      messageTag: "order_top",
      value: {
        message: "Don’t send cutlery, tissues and straws",
        type: "ALERT",
        icon: "e9c2",
      },
    },
  ],
  alert: {
    alertType: "RING",
    toOpen: true,
    eventType: "ORDER_NEW",
  },
  meta: {
    actionExpiryTime: "2022-11-07T06:42:02Z",
    actionExpiryDuration: 60,
  },
  nextStates: ["MERCHANT_REJECTED", "UNDER_REVIEW", "PREPARING"],
  updatedAt: "2022-11-07T06:41:02Z",
  cartDetails: {
    items: {
      dishes: [
        {
          id: "1",
          name: "Make Your Own Non-Veg Meal",
          referenceType: "DRT_VARIANT",
          referenceId: "451410141",
          quantity: 1,
          unitCost: 365,
          totalCost: 365,
          subCategoryId: "24347604",
          customisations: [
            {
              id: "2",
              name: "Murgh Rara",
              referenceType: "DCRT_PROPERTY_VALUE",
              referenceId: "105275582",
              groupName: "Choice of Non-Veg Curry",
              referenceGroupType: "DCGRT_PROPERTY",
              referenceGroupId: "38333034",
              quantity: 1,
              metadata: {
                refGroupVei: "4222205-39781",
                refItemVei: "pv143527-4222205",
              },
            },
            {
              id: "3",
              name: "2 Missi Roti",
              referenceType: "DCRT_VARIANT",
              referenceId: "254253032",
              groupName: "Choice of Breads",
              referenceGroupType: "DCGRT_MODIFIER_GROUP",
              referenceGroupId: "29470591",
              unitCost: 15,
              quantity: 1,
              metadata: {
                catalogueId: "210209125",
                refGroupVei: "mg39774",
                refItemVei: "i143500",
              },
              totalCost: 15,
              custUnitCost: 15,
              custTotalCost: 15,
            },
            {
              id: "4",
              name: "2Pc Hot Gulab Jamun",
              referenceType: "DCRT_VARIANT",
              referenceId: "451410192",
              groupName: "Dessert",
              referenceGroupType: "DCGRT_MODIFIER_GROUP",
              referenceGroupId: "29470592",
              unitCost: 50,
              quantity: 1,
              metadata: {
                catalogueId: "362686970",
                refGroupVei: "mg39780",
                refItemVei: "i143526",
              },
              totalCost: 50,
              custUnitCost: 50,
              custTotalCost: 50,
            },
          ],
          calculations: [
            {
              id: "5",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 365,
              entityType: "DCT_VOUCHER_DISCOUNT",
              entityId: "641576356",
              value: 36.5,
              amount: 36.5,
              calcAppliedOnAmount: 365,
              appliedPercentageValue: 36.5,
              calcAmount: 36.5,
            },
            {
              id: "6",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 365,
              name: "taxable_discount",
              entityType: "DCT_TOTAL_TAXABLE_DISCOUNT",
              value: 36.5,
              amount: 36.5,
              calcAppliedOnAmount: 365,
              appliedPercentageValue: 36.5,
              calcAmount: 36.5,
            },
            {
              id: "7",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 328.5,
              name: "CGST",
              entityType: "DCT_TAX",
              entityId: "4",
              isPercentage: true,
              value: 2.5,
              amount: 8.21249962,
              calcAppliedOnAmount: 328.5,
              appliedPercentageValue: 2.5,
              calcAmount: 8.2125,
            },
            {
              id: "8",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 328.5,
              name: "SGST",
              entityType: "DCT_TAX",
              entityId: "3",
              isPercentage: true,
              value: 2.5,
              amount: 8.21249962,
              calcAppliedOnAmount: 328.5,
              appliedPercentageValue: 2.5,
              calcAmount: 8.2125,
            },
            {
              id: "9",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 328.5,
              name: "CGST",
              entityType: "DCT_SOURCE_TAX",
              entityId: "4",
              isPercentage: true,
              value: 2.5,
              amount: 8.21249962,
              calcAppliedOnAmount: 328.5,
              appliedPercentageValue: 2.5,
              calcAmount: 8.2125,
            },
            {
              id: "10",
              appliedOnType: "DCAOT_DISH",
              appliedOnAmount: 328.5,
              name: "SGST",
              entityType: "DCT_SOURCE_TAX",
              entityId: "3",
              isPercentage: true,
              value: 2.5,
              amount: 8.21249962,
              calcAppliedOnAmount: 328.5,
              appliedPercentageValue: 2.5,
              calcAmount: 8.2125,
            },
          ],
          metadata: {
            tags: ["non-veg", "restaurant-recommended", "services"],
            catalogueId: "210221452",
            refVei: "v4222205-143527",
            catalogueVei: "i4222205",
          },
          chooseText:
            "Choice of Non-Veg Curry: Murgh Rara; Choice of Breads: 2 Missi Roti; Dessert: 2Pc Hot Gulab Jamun",
          displayCost: "₹365.00",
          dishUnitCost: 365,
          dishTotalCost: 365,
          details: [
            "{grey-700|<regular-300|Choice of Non-Veg Curry: >}{grey-700|<semibold-300| Murgh Rara>}",
            "{blue-500|<semibold-300|Choice of Breads: >}{grey-900|<semibold-300| 2 Missi Roti>}",
            "{blue-500|<semibold-300|Dessert: >}{grey-900|<semibold-300| 2Pc Hot Gulab Jamun>}",
          ],
        },
      ],
    },
    charges: [
      {
        amountDetails: {
          id: "11",
          itemName: "Taxes",
          quantity: 1,
          type: "tax",
          unitCost: 16.4300003,
          displayCost: "₹0.00",
          amountTotalCost: 16.43,
          amountUnitCost: 16.43,
        },
        amountBreakup: {
          title: "Taxes",
          body: {
            keyValues: [
              {
                key: {
                  message: "Net tax on order (paid by customer)",
                },
                value: {
                  message: "₹16.43",
                },
              },
              {
                key: {
                  message: "GST on restaurant services under section 9(5)",
                },
                value: {
                  message: "-₹16.43",
                },
              },
            ],
            footer: {
              key: {
                message: "Net tax transferrable to restaurant",
              },
              value: {
                message: "₹0.00",
              },
            },
          },
        },
      },
    ],
    subtotal: {
      amountDetails: {
        id: "13",
        itemName: "Item total",
        totalCost: 365,
        type: "subtotal2",
        displayCost: "₹365.00",
        amountTotalCost: 365,
      },
    },
    total: {
      amountDetails: {
        id: "26354341764",
        itemName: "Total Bill",
        quantity: 1,
        totalCost: 328.51001,
        type: "total_merchant",
        unitCost: 328.51001,
        displayCost: "₹328.51",
        amountTotalCost: 328.51,
        amountUnitCost: 328.51,
      },
    },
    discountApplied: {
      discounts: [
        {
          discount: {
            id: "-1",
            name: "Promo",
            type: "total_merchant_voucher_and_salt_discount",
            offers: [
              {
                type: "PERCENTAGE_DISCOUNT",
                amount: -36.5,
                offerAmount: 36.5,
              },
            ],
            totalDiscountAmount: -36.5,
            displayCost: "-₹36.50",
          },
          amountBreakup: {
            title: "Promo",
            body: {
              keyValues: [
                {
                  key: {
                    message: "Zomato Promo",
                  },
                  value: {
                    message: "-₹36.50",
                  },
                },
              ],
              footer: {
                key: {
                  message: "Promo",
                },
                value: {
                  message: "-₹36.50",
                },
              },
            },
          },
        },
      ],
    },
  },
  supportingRiderDetails: [
    {
      riderStatus: "REQUESTED",
      title: {
        message: "4 riders nearby, assigning one soon",
        type: "INFO",
        icon: "e99c",
        iconType: "INFO",
      },
    },
  ],
  displayId: "6615",
  shouldShowKptWidget: true,
};
let swiggyOrder = [
  {
    isBulkOrder: false,
    last_updated_time: "2022-11-07T14:58:03",
    order_id: "150888405998",
    prep_time_predicted: 18,
    status: {
      order_status: "ordered",
      placed_status: "unplaced",
      placingState: "WITH_RELAYER",
      delivery_status: "unassigned",
      placed_time: null,
      call_partner_time: null,
      ordered_time: "2022-11-07T14:56:46",
      edited_status: "unedited",
      edited_time: null,
      food_prep_time: null,
      cancelled_time: null,
      order_handover_window: 180,
      early_mfr_time: 216,
      hand_over_delayed: false,
    },
    current_order_action: "nothing",
    delivery_boy: {},
    customer_comment: "",
    customer_area: "Khanna",
    customer_distance: 2.3,
    restaurant_details: {
      restaurant_lat: "30.6898149",
      restaurant_lng: "76.2430069",
    },
    cart: {
      charges: {
        packing_charge: 10,
      },
      items: [
        {
          item_id: "104389576",
          quantity: 1,
          name: "Make Your Own Veg Meal",
          restaurant_discount_hit: 0,
          final_sub_total: 400,
          sub_total: 400,
          total: 410,
          category: "Combos & Thali",
          sub_category: "nota",
          charges: {
            "Service Charges": "0.00",
            GST: "20.0",
            Vat: "0",
            "Service Tax": "0",
          },
          tax_expressions: {
            GST_inclusive: false,
            "Service Charges": "0.00",
            Vat: "0",
            "Service Tax": "0",
          },
          addons: [
            {
              choice_id: "55347536",
              group_id: "69429380",
              name: "2pc Hot Gulab Jamun",
              price: 50,
            },
            {
              choice_id: "55347574",
              group_id: "69429381",
              name: "2 Tandoori Butter Roti",
              price: 50,
            },
            {
              name: "Paner Lababdar",
              price: 50,
            },
            {
              name: "1 Butter Naan",
              price: 0,
            },
          ],
          variants: "",
          newAddons: [
            {
              choice_id: "55347536",
              group_id: "69429380",
              name: "2pc Hot Gulab Jamun",
              price: 50,
            },
            {
              choice_id: "55347574",
              group_id: "69429381",
              name: "2 Tandoori Butter Roti",
              price: 50,
            },
          ],
          newVariants: [
            {
              variation_id: 72116016,
              group_id: 21988740,
              name: "Paner Lababdar",
              price: 50,
            },
            {
              variation_id: 72116019,
              group_id: 21988741,
              name: "1 Butter Naan",
              price: 0,
            },
          ],
          is_oos: false,
          is_veg: "1",
          reward_type: null,
          free_quantity: 0,
        },
      ],
    },
    restaurant_taxation_type: "GST",
    GST_details: {
      cartCGST: 10.25,
      cartIGST: 0,
      cartSGST: 10.25,
      itemCGST: 10,
      itemIGST: 0,
      packagingCGST: 0.25,
      packagingSGST: 0.25,
      restaurant_liable_gst: 0,
      swiggy_liable_gst: 20.5,
    },
    gst: 0,
    serviceCharge: 0,
    spending: 0,
    tax: 0,
    discount: 0,
    bill: 431,
    restaurant_trade_discount: null,
    total_restaurant_discount: 0,
    type: "regular",
    cafe_data: {
      restaurant_type: null,
    },
    is_assured: false,
    discount_descriptions: [],
    final_gp_price: 0,
    customer: {
      customer_id: "120673697",
      customer_lat: "30.689814913202948",
      customer_lng: "76.24519564211369",
      customer_name: "Harman",
    },
    isMFRAccuracyCalculated: false,
    rest_extra_prep_time: null,
    promise_prep_time: null,
    foodHandoverTimeSec: 180,
  },
];
const getAllOrderList = (onlineOrder) => {
  return async (dispatch) => {
    try {
      let allOrderList = [];
      //zomato dummy order
      // let orderdetails = zomatoOrder;
      // console.log("orderdetails.cartDetails.dishes", orderdetails.cartDetails);
      // let productList = orderdetails.cartDetails.items.dishes.map((val) => {
      //   let productNameArray = [val.name];
      //   if (val.customisations && val.customisations.length > 0) {
      //     val.customisations.map((i) => {
      //       productNameArray.push(" / " + i.name);
      //     });
      //   }
      //   return {
      //     item_id: val.id,
      //     name: productNameArray.toString().replace(/,/gi, ""),
      //     price: val.unitCost,
      //     calculatedprice: val.totalCost,
      //     quantity: val.quantity,
      //     category: val.subCategoryId,
      //   };
      // });

      // let obj = {
      //   id: orderdetails.id,
      //   tax: 0,
      //   Source: "Zomato",
      //   order_id: orderdetails.id,
      //   sub_total:
      //     orderdetails?.cartDetails?.subtotal?.amountDetails.amountTotalCost,
      //   Value: orderdetails?.cartDetails?.total?.amountDetails.amountTotalCost,
      //   Time: moment(orderdetails.createdAt).format("MMM DD, Y, h:mm A"),
      //   Items: productList,
      //   Customer: orderdetails?.creator?.name ? orderdetails.creator.name : "",
      //   comment: orderdetails.instruction?.text
      //     ? orderdetails.instruction?.text
      //     : "",
      //   disconut: "",
      //   clickRow: false,
      // };
      // if (orderdetails?.cartDetails.discountApplied?.discounts) {
      //   let totaldiscount = 0;
      //   orderdetails?.cartDetails.discountApplied?.discounts.map((val) => {
      //     let discountValue = -1 * Number(val.discount.totalDiscountAmount);
      //     totaldiscount = totaldiscount + discountValue;
      //   });
      //   console.log("totaldiscount", totaldiscount);
      //   if (totaldiscount > 0) {
      //     obj.disconut = totaldiscount;
      //   }
      // }
      // console.log("objjbnjjjhh", obj);

      // allOrderList.push(obj);
      // //swiggy dummy order

      // swiggyOrder.map((val) => {
      //   console.log("val212121111111", val);
      //   if (
      //     val.status.order_status == "ordered" &&
      //     val.status.placed_status == "unplaced"
      //   ) {
      //     const { order_id, bill, customer, status, customer_comment } = val;
      //     const { items } = val.cart;
      //     let productList = items.map((val) => {
      //       console.log("productName90900l", val);
      //       let productNameArray = [val.name];

      //       if (val.newVariants && val.newVariants.length > 0) {
      //         val.newVariants.map((i) => {
      //           productNameArray.push(" / " + i.name);
      //         });
      //       }
      //       if (val.newAddons && val.newAddons.length > 0) {
      //         val.newAddons.map((i) => {
      //           productNameArray.push(" + " + i.name);
      //         });
      //       }

      //       return {
      //         item_id: val.item_id,
      //         name: productNameArray.toString().replace(/,/gi, ""),
      //         price: val.final_sub_total,
      //         calculatedprice: val.total,
      //         quantity: val.quantity,
      //         category: val.category,
      //         comment: customer_comment ? customer_comment : "",
      //       };
      //     });

      //     let obj = {
      //       id: order_id,
      //       tax: val.GST_details.swiggy_liable_gst
      //         ? val.GST_details.swiggy_liable_gst
      //         : 0,
      //       Source: "Swiggy",
      //       order_id: order_id,
      //       sub_total: 0,
      //       Value: bill,
      //       Time: moment(status.ordered_time).format("MMM DD, Y, h:mm A"),
      //       Items: productList,
      //       Customer: customer.customer_name ? customer.customer_name : "",
      //       CommentsDetails: "",
      //       disconut: val.discount ? val.discount : 0,
      //       clickRow: false,
      //     };
      //     if (val?.cart?.charges?.packing_charge) {
      //       obj.packingCharge = val.cart.charges.packing_charge;
      //     }
      //     allOrderList.push(obj);
      //   }
      // });
      // console.log("lastOrderListlastOrderList1", allOrderList);
      // return dispatch(kitchenUserList(allOrderList));
      if (onlineOrder && onlineOrder.length > 0) {
        let zomatoUrl = onlineOrder.find((val) => val.orderType == "zomato")
          ?.url;
        let swiggyUrl = onlineOrder.find((val) => val.orderType == "swiggy")
          ?.url;

        if (swiggyUrl) {
          const getAllList = await axios.get(`${swiggyUrl}/orders`);

          if (getAllList?.data?.statusMessage == "Success") {
            getAllList.data.restaurantData[0].orders.map((val) => {
              if (
                val.status.order_status == "ordered" &&
                val.status.placed_status == "unplaced"
              ) {
                const {
                  order_id,
                  bill,
                  customer,
                  status,
                  customer_comment,
                } = val;
                const { items } = val.cart;
                let productList = items.map((val) => {
                  let productNameArray = [val.name];

                  if (val.newVariants && val.newVariants.length > 0) {
                    val.newVariants.map((i) => {
                      productNameArray.push(" / " + i.name);
                    });
                  }
                  if (val.newAddons && val.newAddons.length > 0) {
                    val.newAddons.map((i) => {
                      productNameArray.push(" + " + i.name);
                    });
                  }

                  return {
                    item_id: val.item_id,
                    name: productNameArray.toString().replace(/,/gi, ""),
                    price: val.final_sub_total,
                    calculatedprice: val.total,
                    quantity: val.quantity,
                    category: val.category,
                    comment: customer_comment ? customer_comment : "",
                  };
                });

                let obj = {
                  id: order_id,
                  tax: val.GST_details.swiggy_liable_gst
                    ? val.GST_details.swiggy_liable_gst
                    : 0,
                  Source: "Swiggy",
                  order_id: order_id,
                  sub_total: 0,
                  Value: bill,
                  Time: moment(status.ordered_time).format("MMM DD, Y, h:mm A"),
                  Items: productList,
                  Customer: customer.customer_name
                    ? customer.customer_name
                    : "",
                  CommentsDetails: "",
                  disconut: val.discount ? val.discount : 0,
                  clickRow: false,
                };
                if (val?.cart?.charges?.packing_charge) {
                  obj.packingCharge = val.cart.charges.packing_charge;
                }
                allOrderList.push(obj);
              }
            });
          }
        }
        if (zomatoUrl) {
          const getAllList = await axios.get(`${zomatoUrl}/orders/current`);

          if (getAllList?.data[0]?.new_orders?.entities) {
            let newOrders = getAllList.data[0].new_orders.entities;

            for (let i = 0; i < newOrders.length; i++) {
              if (newOrders[i].tab_id) {
                const getZamatoOrdersDetails = await axios.get(
                  `${zomatoUrl}/order/details?order_id=${newOrders[i].tab_id}`
                );

                if (getZamatoOrdersDetails?.data?.order?.state == "NEW") {
                  let orderdetails = getZamatoOrdersDetails?.data?.order;

                  let productList = orderdetails.cartDetails.items.dishes.map(
                    (val) => {
                      let productNameArray = [val.name];
                      if (val.customisations && val.customisations.length > 0) {
                        val.customisations.map((i) => {
                          productNameArray.push(" / " + i.name);
                        });
                      }
                      return {
                        item_id: val.id,
                        name: productNameArray.toString().replace(/,/gi, ""),
                        price: val.unitCost,
                        calculatedprice: val.totalCost,
                        quantity: val.quantity,
                        category: val.subCategoryId,
                      };
                    }
                  );

                  let obj = {
                    id: orderdetails.id,
                    tax: 0,
                    Source: "Zomato",
                    order_id: orderdetails.id,
                    sub_total:
                      orderdetails?.cartDetails?.subtotal?.amountDetails
                        .amountTotalCost,
                    Value:
                      orderdetails?.cartDetails?.total?.amountDetails
                        .amountTotalCost,
                    Time: moment(orderdetails.createdAt).format(
                      "MMM DD, Y, h:mm A"
                    ),
                    Items: productList,
                    Customer: orderdetails?.creator?.name
                      ? orderdetails.creator.name
                      : "",
                    comment: orderdetails.instruction?.text
                      ? orderdetails.instruction?.text
                      : "",
                    disconut: "",
                    clickRow: false,
                  };
                  if (orderdetails?.cartDetails.discountApplied?.discounts) {
                    let totaldiscount = 0;
                    orderdetails?.cartDetails.discountApplied?.discounts.map(
                      (val) => {
                        let discountValue =
                          -1 * Number(val.discount.totalDiscountAmount);
                        totaldiscount = totaldiscount + discountValue;
                      }
                    );

                    if (totaldiscount > 0) {
                      obj.disconut = totaldiscount;
                    }
                  }
                  allOrderList.push(obj);
                }
              }
            }
          }
        }

        return dispatch(kitchenUserList(allOrderList));

        // return allOrderList
      }
    } catch (err) {
      let zomatoUrl = onlineOrder.find((val) => val.orderType == "zomato")?.url;
      let swiggyUrl = onlineOrder.find((val) => val.orderType == "swiggy")?.url;
      if (zomatoUrl) {
        const getZamatoOrdersDetails = await axios.post(`${zomatoUrl}/login`);
      }
      if (swiggyUrl) {
        const getZamatoOrdersDetails = await axios.post(`${swiggyUrl}/login`);
      }
      dispatch(kitchenUserIdErr(err));
    }
  };
};
const getZometoDetail = (url, orderId) => {
  return async (dispatch) => {
    try {
      const getZamatoOrdersDetails = await axios.get(
        `${url}/order/details?order_id=${orderId}`
      );

      if (getZamatoOrdersDetails && getZamatoOrdersDetails?.data?.order) {
        return getZamatoOrdersDetails?.data.order;
      }
      // if (getZamatoOrdersDetails && getZamatoOrdersDetails?.data?.order?.supportingRiderDetails[0]) {
      //   return {
      //     name: getZamatoOrdersDetails?.data?.order.supportingRiderDetails[0].name,
      //     phone: getZamatoOrdersDetails?.data?.order.supportingRiderDetails[0].phone
      //   }
      // }
    } catch (err) {
      dispatch(kitchenUserIdErr(err));
    }
  };
};
const getSwiggyDetail = (url, orderId) => {
  return async (dispatch) => {
    try {
      const getAllList = await axios.get(`${url}/orders`);

      if (
        getAllList?.data?.statusMessage == "Success" &&
        getAllList.data.restaurantData[0].orders
      ) {
        let orderdetails = getAllList.data.restaurantData[0].orders.find(
          (val) => val.order_id == orderId
        );
        return orderdetails;
      }
    } catch (err) {
      dispatch(kitchenUserIdErr(err));
    }
  };
};
const getkitchenUserById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let kitchenUserDetails;
      if (allSetupcache != null && allSetupcache.userList.kitchenUserList) {
        kitchenUserDetails = allSetupcache.userList.kitchenUserList.find(
          (val) => val._id == id
        );
      }
      if (kitchenUserDetails) {
        return dispatch(
          kitchenUserId({
            ...kitchenUserDetails,
            register_assigned_to: kitchenUserDetails.register_assigned_to._id,
          })
        );
      } else {
        const kitchenUserByIdData = await DataService.get(
          `${API.onlineOrder.getKitchenUserById}/${id}`
        );
        if (!kitchenUserByIdData.data.error) {
          return dispatch(kitchenUserId(kitchenUserByIdData.data.data));
        } else {
          return dispatch(kitchenUserIdErr(kitchenUserByIdData.data));
        }
      }
    } catch (err) {
      dispatch(kitchenUserIdErr(err));
    }
  };
};

const deleteDynos = (ids) => {
  return async (dispatch) => {
    try {
      const getDeletedkitchenUser = await DataService.post(
        API.onlineOrder.deleteAllDyno,
        ids
      );
      if (!getDeletedkitchenUser.data.error) {
        return dispatch(kitchenUserDelete(getDeletedkitchenUser.data));
      } else {
        return dispatch(kitchenUserDeleteErr(getDeletedkitchenUser.data));
      }
    } catch (err) {
      dispatch(kitchenUserDeleteErr(err));
    }
  };
};

export {
  addOrUpdateDyno,
  onlineOrderProductList,
  getkitchenUserById,
  markInOutOfStock,
  getAlldynoList,
  getAllOrderList,
  accetOrders,
  redayOrders,
  deleteDynos,
  getZometoDetail,
  getSwiggyDetail,
};
