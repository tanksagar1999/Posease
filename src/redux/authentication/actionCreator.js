import Cookies from "js-cookie";
import actions from "./actions";
import axios from "axios";
import {
  setItem,
  removeItem,
  getItem,
} from "../../utility/localStorageControl";

import { DarkModeAvailable } from "../preference/actionCreator";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  loginBegin,
  loginSuccess,
  loginErr,
  logoutBegin,
  logoutSuccess,
  logoutErr,
  resetPasswordSuccess,
  registerBegin,
  registerErr,
  registerSuccess,
  ForgotpinAdd,
  ForgotpinAddErr,
  offlineModeValue,
  LocalTableArray,
} = actions;

const getDeviceId = () => {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";
  return uid;
};

const checkLocalDataStore = async (userId) => {
  let userDeviceId = `${userId}_${getDeviceId()}`;
  let localData = await DataService.get(
    `${API.auth.localStorageStore}?device_id=${userDeviceId}`
  );
  if (localData && localData.data.data[0]) {
    setItem("userDeviceId", localData.data.data[0]._id);
    localData.data.data[0].allLocalData.map((val) => {
      setItem(val.key, val.value);
    });
  }
};

const storePrintingPrefrence = (printingPrefrnce) => {
  if (
    printingPrefrnce.hasOwnProperty(
      "print_order_ticket_KOT_number_in_the_receipt"
    )
  ) {
    setItem(
      "print_order_tiket_number",
      printingPrefrnce.print_order_ticket_KOT_number_in_the_receipt
    );
  }
  if (
    printingPrefrnce.hasOwnProperty("print_receipt_first_then_accept_payment")
  ) {
    setItem(
      "print_receipt_first",
      printingPrefrnce.print_receipt_first_then_accept_payment
    );
  }
  if (
    printingPrefrnce.hasOwnProperty(
      "do_not_print_tax_rates_against_each_product"
    )
  ) {
    setItem(
      "do_not_each_tax",
      printingPrefrnce.do_not_print_tax_rates_against_each_product
    );
  }

  if (printingPrefrnce.hasOwnProperty("print_product_notes_in_the_receipt")) {
    setItem(
      "print_receipt_product_notes",
      printingPrefrnce.print_product_notes_in_the_receipt
    );
  }
  if (
    printingPrefrnce.hasOwnProperty("print_receipt_first_then_accept_payment")
  ) {
    setItem(
      "print_receipt_first_then_accept_payment",
      printingPrefrnce.print_receipt_first_then_accept_payment
    );
  }
  if (printingPrefrnce.hasOwnProperty("print_register_name_on_receipt")) {
    setItem(
      "print_register_name",
      printingPrefrnce.print_register_name_on_receipt
    );
  }

  if (
    printingPrefrnce.hasOwnProperty("print_server_copy_of_order_ticket_KOT")
  ) {
    setItem(
      "print_server_copy",
      printingPrefrnce.print_server_copy_of_order_ticket_KOT
    );
  }
  if (
    printingPrefrnce.hasOwnProperty(
      "print_settlement_bill_after_accepting_payment"
    )
  ) {
    setItem(
      "print_settlement_paymnet",
      printingPrefrnce.print_settlement_bill_after_accepting_payment
    );
  }
  if (
    printingPrefrnce.hasOwnProperty(
      "do_not_print_copy_of_receipt_and_order_tickets"
    )
  ) {
    setItem(
      "print_copy_of_receipt_order_ticket",
      printingPrefrnce.do_not_print_copy_of_receipt_and_order_tickets
    );
  }
};

const storePermissionPrefrence = (permissionPrefrence) => {
  if (permissionPrefrence.hasOwnProperty("allow_cashiers_to_offer_discounts")) {
    setItem(
      "allow_cashier_to_discount",
      permissionPrefrence.allow_cashiers_to_offer_discounts
    );
  }
  if (
    permissionPrefrence.hasOwnProperty(
      "allow_managers_to_change_email_address_while_requesting_reports"
    )
  ) {
    setItem(
      "allow_manager_to_change_email",
      permissionPrefrence.allow_managers_to_change_email_address_while_requesting_reports
    );
  }
  if (
    permissionPrefrence.hasOwnProperty(
      "hide_the_shift_summary_link_in_lock_screen"
    )
  ) {
    setItem(
      "hide_the_shift_summary_link_in_lock_screen",
      permissionPrefrence.hide_the_shift_summary_link_in_lock_screen
    );
  }
};
const login = (payloads, history) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const loggedIn = await DataService.post(API.auth.login, payloads);

      if (!loggedIn.data.error) {
        if (loggedIn.data.data.role === "restaurant") {
          setItem("active_cart", null);
          const res = await axios({
            method: "GET",
            url: `https://api.posease.com/api/localStorage/setup/${loggedIn.data.data._id}`,
            headers: {
              Authorization: `Bearer ${loggedIn.data.data.token}`,
              "Content-Type": "application/json",
            },
          });

          if (res.data.data.recent_activity.length > 0) {
            setItem("shfitOpenedTS", res.data.data.recent_activity[0].action);
          } else {
            setItem("shfitOpenedTS", "close");
          }

          if (
            res.data.data.preferences?.length > 0 &&
            res.data.data.preferences[0].permission_preferences
          ) {
            storePermissionPrefrence(
              res.data.data.preferences[0].permission_preferences
            );
          }
          if (
            res.data.data.preferences?.length > 0 &&
            res.data.data.preferences[0].printing_preferences
          ) {
            storePrintingPrefrence(
              res.data.data.preferences[0].printing_preferences
            );
          }
          if (
            res.data.data.preferences?.length > 0 &&
            res.data.data.preferences[0].hasOwnProperty("selling_preferences")
          ) {
            let preferences =
              res.data.data.preferences?.length > 0
                ? res.data.data.preferences[0].selling_preferences
                : {};
            if (
              preferences.hasOwnProperty(
                "enforce_sequential_local_receipt_numbers"
              )
            ) {
              setItem(
                "localReceipt",
                preferences.enforce_sequential_local_receipt_numbers
              );
              if (preferences.enforce_sequential_local_receipt_numbers) {
                setItem("isStartSellingFromThisDevice", true);
              }
            }
            if (preferences.hasOwnProperty("do_not_round_off_sale_total")) {
              setItem("doNotRoundOff", preferences.do_not_round_off_sale_total);
            }
            if (
              preferences.hasOwnProperty(
                "display_items_in_sell_screen_as_a_list_instead_of_grid"
              )
            ) {
              setItem(
                "listView",
                preferences.display_items_in_sell_screen_as_a_list_instead_of_grid
              );
            }
            if (
              preferences.hasOwnProperty("enable_order_ticket_kot_genration")
            ) {
              setItem(
                "orderTicketButton",
                preferences.enable_order_ticket_kot_genration
              );
            }
            if (preferences.hasOwnProperty("enable_quick_billing")) {
              setItem("enable_quick_billing", preferences.enable_quick_billing);
            }
            if (
              preferences.hasOwnProperty(
                "hide_quantity_increase_decrease_buttons"
              )
            ) {
              setItem(
                "hide_quantity_increase_decrease_buttons",
                preferences.hide_quantity_increase_decrease_buttons
              );
            }
            if (preferences.hasOwnProperty("hide_all_and_top_categories")) {
              setItem("hideAllAndTop", preferences.hide_all_and_top_categories);
            }
            if (preferences.hasOwnProperty("enforce_customer_mobile_number")) {
              setItem(
                "enforce_customer_mobile_number",
                preferences.enforce_customer_mobile_number
              );
            }

            setItem(
              "enable_billing_only_when_shift_is_opened",
              preferences.enable_billing_only_when_shift_is_opened
            );

            if (
              preferences.hasOwnProperty(
                "create_receipt_while_fullfilling_booking"
              )
            ) {
              setItem(
                "create_receipt_while_fullfilling_booking",
                preferences.create_receipt_while_fullfilling_booking
              );
            }
            setItem("dark_mode", preferences.dark_mode);
            dispatch(DarkModeAvailable(preferences.dark_mode));
          }

          if (
            res.data.data.preferences &&
            res.data.data.preferences[0] &&
            res.data.data.preferences[0]._id
          ) {
            setItem("prefernce_id", res.data.data.preferences[0]._id);
          }

          let totalUserlist = res.data.data.userList;
          let app_userList = [];
          let waiterList = [];
          let kitchen_user = [];
          let cashierList = [];
          if (totalUserlist && totalUserlist.length > 0) {
            app_userList = totalUserlist.filter(
              (val) => val.role == "app_user"
            );
            waiterList = totalUserlist.filter((val) => val.role == "waiter");
            kitchen_user = totalUserlist.filter(
              (val) => val.role == "kitchen_user"
            );
            cashierList = totalUserlist.filter((val) => val.role == "cashier");
          }

          let customFieldList = res.data.data.customFields;
          let pattycashCustomFiled = [];
          let addtionCustomFiled = [];
          let paymentTypeCustomFiled = [];
          let tagCustomeFiled = [];
          if (customFieldList && customFieldList.length > 0) {
            pattycashCustomFiled = customFieldList.filter(
              (val) => val.type == "petty_cash_category"
            );
            addtionCustomFiled = customFieldList.filter(
              (val) => val.type == "additional_detail"
            );
            tagCustomeFiled = customFieldList.filter(
              (val) => val.type == "tag"
            );
            paymentTypeCustomFiled = customFieldList.filter(
              (val) => val.type == "payment_type"
            );
          }
          res.data.data.userList = {
            appUserList: app_userList,
            kitchenUserList: kitchen_user,
            waiterUserList: waiterList,
            cashierUserList: cashierList,
          };
          res.data.data.customFields = {
            patty_cash: pattycashCustomFiled,
            addtional: addtionCustomFiled,
            tag: tagCustomeFiled,
            paymnetType: paymentTypeCustomFiled,
          };
          res.data.data.register = res.data.data.register.reverse();
          res.data.data.setUpPrinter = res.data.data.printerSetupList;

          if (
            res.data.data.shopDetails.shop_logo == "" ||
            res.data.data.shopDetails.shop_logo == "false"
          ) {
            if (!res.data.error) {
              setItem("productList", res.data.data.products);
              delete res.data.data.products;

              setItem("setupCache", res.data.data);

              setItem("profile-imge", "");
              setItem("pendingShiftList", []);
              setItem("pendingPattyCashEntries", []);

              if (getItem("LOCAL_STORAGE_CART_KEY_NAME") != null) {
                setItem(
                  "LOCAL_STORAGE_CART_KEY_NAME",
                  getItem("LOCAL_STORAGE_CART_KEY_NAME")
                );
                setItem("localUpdate", !getItem("localUpdate"));
              } else {
                setItem("LOCAL_STORAGE_CART_KEY_NAME", []);
                setItem("localUpdate", true);
              }
            }

            if (
              loggedIn.data.data.role === "restaurant" &&
              loggedIn.data.data.is_shop
            ) {
              setItem("access_token", loggedIn.data.data.token);
              setItem("totalOnlineOrder", []);
              setItem("email_id", loggedIn.data.data.email);
              // checkLocalDataStore(loggedIn.data.data._id);
              history.push("/pin-auth");
              dispatch(loginSuccess(false));
            } else {
              history.push("/settings/shop");
              setItem("access_token", loggedIn.data.data.token);
              setItem("totalOnlineOrder", []);
              setItem("userDetails", loggedIn.data.data);
              setItem("username", loggedIn.data.data.username);
              setItem("role", loggedIn.data.data.role);

              Cookies.set("logedIn", true);
              dispatch(loginSuccess(true));
              // window.location.reload();
            }
          } else {
            const toDataURL = (url) =>
              fetch(url)
                .then((response) => response.blob())
                .then(
                  (blob) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    })
                );
            toDataURL(res.data.data.shopDetails.shop_logo).then((dataUrl) => {
              res.data.data.shopDetails.shop_logo = dataUrl;
              if (!res.data.error) {
                setItem("productList", res.data.data.products);
                delete res.data.data.products;
                setItem("setupCache", res.data.data);
                setItem("profile-imge", "");
                setItem("pendingShiftList", []);
                setItem("pendingPattyCashEntries", []);
              }

              if (
                loggedIn.data.data.role === "restaurant" &&
                loggedIn.data.data.is_shop
              ) {
                setItem("access_token", loggedIn.data.data.token);
                setItem("totalOnlineOrder", []);
                setItem("email_id", loggedIn.data.data.email);
                // checkLocalDataStore(loggedIn.data.data._id);
                history.push("/pin-auth");
                dispatch(loginSuccess(false));
              } else {
                setItem("access_token", loggedIn.data.data.token);
                setItem("totalOnlineOrder", []);
                setItem("userDetails", loggedIn.data.data);
                setItem("username", loggedIn.data.data.username);
                setItem("role", loggedIn.data.data.role);
                Cookies.set("logedIn", true);
                dispatch(loginSuccess(loggedIn.data.data));

                window.location.reload();
              }
            });
          }
        } else if (loggedIn.data.data.role === "admin") {
          setItem("access_token", loggedIn.data.data.token);
          setItem("totalOnlineOrder", []);
          setItem("userDetails", loggedIn.data.data);
          setItem("username", loggedIn.data.data.username);
          setItem("role", loggedIn.data.data.role);
          Cookies.set("logedIn", true);
          dispatch(loginSuccess(true));
          history.push("/admin/user-management");
          // window.location.reload();
        }
      } else {
        dispatch(loginErr(loggedIn));
        return loggedIn;
      }
    } catch (err) {
      dispatch(loginErr(err));
    }
  };
};

const secretPinAuth = (payloads, openBalance, history) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const loggedInViaSecretPin = await DataService.post(
        API.auth.secretPinAuth,
        payloads
      );
      console.log("gfssdfsdfsdfshfhs", openBalance);
      if (
        loggedInViaSecretPin.data &&
        openBalance != undefined &&
        !loggedInViaSecretPin.data.error
      ) {
        let openBalanceData = await DataService.post(API.shift.UpdateShift, {
          action: "open",
          opening_balance: openBalance,
          userName: loggedInViaSecretPin.data.data.username,
          register_id: getItem("setupCache").register.find((val) => val.active)
            ._id,
          actual_time: new Date(),
        });

        if (getItem("shfitOpenedTS") != null) {
          setItem("shfitOpenedTS", "open");
        }
      }

      if (!loggedInViaSecretPin.data.error) {
        removeItem("access_token");
        setItem("access_token", loggedInViaSecretPin.data.data.token);
        if (getItem("localReceipt") === true) {
          setItem("isStartSellingFromThisDevice", true);
        }
        setItem("username", loggedInViaSecretPin.data.data.username);
        setItem("role", loggedInViaSecretPin.data.data.role);
        setItem("userDetails", loggedInViaSecretPin.data.data);
        Cookies.set("logedIn", true);

        dispatch(loginSuccess(true));
        // window.location.reload();
        // history.push("/sell");
        return true;
      } else {
        return dispatch(loginErr(loggedInViaSecretPin));
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      let data = allSetupcache.userList.cashierUserList.find(
        (val) => val.pin == payloads.pin
      );

      if (
        data == undefined &&
        allSetupcache.shopDetails.shop_owner_pin == payloads.pin
      ) {
        data = allSetupcache.account;
      }

      if (data) {
        if (openBalance) {
          let openShiftPending = getItem("pendingShiftList");

          setItem("pendingShiftList", [
            ...openShiftPending,
            {
              openbalance: openBalance,
              userName: data.username,
              register_id: getItem("setupCache").register.find(
                (val) => val.active
              )._id,
              actual_time: new Date(),
            },
          ]);
        }
        setItem("username", data.username);
        setItem("role", data.role);
        setItem("userDetails", data);

        Cookies.set("logedIn", true);
        // window.location.reload();
        // history.push("/sell");

        return dispatch(loginSuccess(true));
      } else {
        return dispatch(
          loginErr({
            data: {
              data: {},
              error: true,
              message:
                "Make sure PIN / name does not already exist for another user",
              messageCode: "INVALID_PIN",
              statusCode: 400,
            },
          })
        );
      }
    }
  };
};

const onlineToOpenSihft = async (openBalance, user_name) => {
  return await DataService.post(API.shift.UpdateShift, {
    action: "open",
    opening_balance: openBalance,
    userName: user_name,
    register_id: getItem("setupCache").register.find((val) => val.active)._id,
    actual_time: new Date(),
  });
};
const onlineToClosedShift = async (closedbalance, user_name) => {
  await DataService.post(API.auth.lockRegister, {});
  if (!(closedbalance == "notClose")) {
    return await DataService.post(API.shift.UpdateShift, {
      action: "close",
      closing_balance: closedbalance,
      userName: user_name,
      register_id: getItem("setupCache").register.find((val) => val.active)._id,
      actual_time: new Date(),
    });
  }
};

const getLocalData = () => {
  let allLocalArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    if (
      localStorage.key(i).toString() === "LOCAL_STORAGE_CART_KEY_NAME" ||
      localStorage
        .key(i)
        .toString()
        .search("previous") == 0 ||
      localStorage
        .key(i)
        .toString()
        .search("Bill") == 0 ||
      localStorage
        .key(i)
        .toString()
        .search("Booking") == 0 ||
      localStorage
        .key(i)
        .toString()
        .search("bingage_enable")
    ) {
      allLocalArray.push({
        key: localStorage.key(i),
        value: getItem(localStorage.key(i)),
      });
    }
  }
  return allLocalArray;
};
const logOut = (history) => {
  return async (dispatch) => {
    try {
      getItem("userDetails");
      let userDetails = getItem("userDetails");
      history.push("/login");
      dispatch(logoutBegin());
      dispatch(loginSuccess(false));
      dispatch(logoutSuccess(null));
      Cookies.remove("logedIn");
      removeItem("userDetails");
      removeItem("email_id");
      removeItem("setupCache");
      // removeItem("pendingShiftList");
      // removeItem("pendingPattyCashEntries");
      console.log("userDetails", userDetails);
      // let userDeviceId = `${userDetails?._id}_${getDeviceId()}`;
      // let payload = {
      //   allLocalData: getLocalData(),
      //   device_id: userDeviceId,
      // };
      // let getAddLocalData;
      // let checkId = getItem("userDeviceId");
      // if (checkId) {
      //   getAddLocalData = await DataService.put(
      //     `${API.auth.localStorageStore}/${checkId}`,
      //     payload
      //   );
      // } else {
      //   getAddLocalData = await DataService.post(
      //     API.auth.localStorageStore,
      //     payload
      //   );
      // }

      removeItem("access_token");

      // removeItem("LOCAL_STORAGE_CART_KEY_NAME");

      // localStorage.clear();

      // window.location.reload();
    } catch (err) {
      dispatch(logoutErr(err));
    }
  };
};

const LockRegister = (history, finalTotal, user_name) => {
  return async (dispatch) => {
    try {
      const lockRegisterInViaRegister = await DataService.post(
        API.auth.lockRegister,
        {}
      );

      if (!lockRegisterInViaRegister.data.error) {
        if (finalTotal !== "") {
          const CloseShift = await DataService.post(API.shift.UpdateShift, {
            action: "close",
            closing_balance: finalTotal,
            userName: user_name,
            register_id: getItem("setupCache").register.find(
              (val) => val.active
            )._id,
            actual_time: new Date(),
          });

          if (!CloseShift.data.error) {
            setItem("shfitOpenedTS", "close");
          }
        }

        Cookies.set("logedIn", false);
        history.push("/pin-auth");
        dispatch(loginSuccess(false));
      } else {
        // dispatch(loginErr(loggedInViaSecretPin));
      }
    } catch (err) {
      let getPendingLock = getItem("pendingShiftList");
      setItem("pendingShiftList", [
        ...getPendingLock,
        {
          closebalance: finalTotal != "" ? finalTotal : "notClose",
          userName: user_name,
        },
      ]);
      Cookies.set("logedIn", false);
      history.push("/pin-auth");
      return dispatch(loginSuccess(false));
    }
  };
};

const register = (payloads) => {
  return async (dispatch) => {
    try {
      dispatch(registerBegin());
      const registered = await DataService.post(API.auth.register, payloads);

      if (!registered.data.error) {
        return dispatch(registerSuccess(registered.data));
      } else {
        return dispatch(registerErr(registered.data));
      }
    } catch (err) {
      dispatch(registerErr(err));
    }
  };
};

const forgotPassword = (payloads) => {
  return async (dispatch) => {
    try {
      const resetLinkSent = await DataService.post(
        API.auth.forgotPassword,
        payloads
      );
      if (!resetLinkSent.data.error) {
        return dispatch(resetPasswordSuccess(resetLinkSent.data));
      }
    } catch (err) {}
  };
};
const forgotPin = (payloads, Forgotpin_id) => {
  return async (dispatch) => {
    try {
      let getAddedForgotpin = await DataService.post(
        `${API.auth.forgotPin}`,
        payloads
      );
      if (!getAddedForgotpin.data.error) {
        return dispatch(ForgotpinAdd(getAddedForgotpin.data.data));
      } else {
        return dispatch(ForgotpinAddErr(getAddedForgotpin.data.data));
      }
    } catch (err) {
      dispatch(ForgotpinAddErr(err));
    }
  };
};
const waiterTableUpdate = (payloads) => {
  return async (dispatch) => {
    return dispatch(LocalTableArray(payloads));
  };
};

const resetPassword = (payloads, token) => {
  return async (dispatch) => {
    try {
      const resetPassword = await DataService.post(
        `${API.auth.resetPassword}?token=${token}`,
        payloads
      );
      return resetPassword;
    } catch (err) {}
  };
};
const offLineMode = (value) => {
  return offlineModeValue(value);
};

export {
  login,
  logOut,
  forgotPassword,
  resetPassword,
  register,
  LockRegister,
  secretPinAuth,
  forgotPin,
  offLineMode,
  onlineToOpenSihft,
  onlineToClosedShift,
  waiterTableUpdate,
};
