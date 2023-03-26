import axios from "axios";
import { setItem, getItem } from "../../utility/localStorageControl";

const { API } = require("../../config/api/index");

const userDetail = getItem("userDetails");

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

const getAllSetUpList = (checkSell) => {
  return async (dispatch) => {
    try {
      if (
        (getItem("role") === "restaurant" || getItem("role") === "cashier") &&
        userDetail
      ) {
        let res = await axios({
          method: "GET",
          url: `https://api.posease.com/api/localStorage/setup/${userDetail._id}`,
          headers: {
            Authorization: `Bearer ${getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (res?.data?.data) {
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
          if (res.data.data.recent_activity.length > 0) {
            setItem("shfitOpenedTS", res.data.data.recent_activity[0].action);
          } else {
            setItem("shfitOpenedTS", "close");
          }

          res.data.data.register = getItem("setupCache")?.register;

          res.data.data.setUpPrinter = getItem("setupCache")?.setUpPrinter
            ? getItem("setupCache").setUpPrinter
            : [];
          setItem("productList", res.data.data.products);
          delete res.data.data.products;
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

          res.data.data.shopDetails.shop_logo != "false" &&
            res.data.data.shopDetails.shop_logo &&
            (await toDataURL(res.data.data.shopDetails.shop_logo).then(
              (dataUrl) => {
                res.data.data.shopDetails.shop_logo = dataUrl;
              }
            ));

          setItem("setupCache", res.data.data);
          if (
            res.data.data.preferences[0].hasOwnProperty("selling_preferences")
          ) {
            let preferences =
              res.data.data.preferences?.length > 0
                ? res.data.data.preferences[0].selling_preferences
                : {};

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
            if (
              preferences.hasOwnProperty(
                "enable_billing_only_when_shift_is_opened"
              )
            ) {
              setItem(
                "enable_billing_only_when_shift_is_opened",
                preferences.enable_billing_only_when_shift_is_opened
              );
            }
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
        }
      }
    } catch (err) {
      // return dispatch(RegisterListErr(AllRegisterListData.data));
    }
  };
};

export { getAllSetUpList };
