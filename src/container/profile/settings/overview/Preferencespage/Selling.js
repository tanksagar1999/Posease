import React, { useState } from "react";
import { Row, Col, Form, Switch, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { NotificationWrapper } from "../style";
import propTypes from "prop-types";
import "../../setting.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  addOrUpdatePrefernce,
  DarkModeAvailable,
} from "../../../../../redux/preference/actionCreator";
import { useDispatch } from "react-redux";
import { getItem, setItem } from "../../../../../utility/localStorageControl";
import _ from "lodash";
const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: 0,
  padding: 0,
};
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Selling = ({ darkMode, events }) => {
  const dispatch = useDispatch();
  const [enforceReceiptChanges, setEnforcReceiptChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellingPreference, setSellingPreference] = useState({
    create_receipt_while_fullfilling_booking: getItem(
      "create_receipt_while_fullfilling_booking"
    )
      ? true
      : false,
    dark_mode: getItem("dark_mode") ? true : false,
    display_items_in_sell_screen_as_a_list_instead_of_grid: getItem("listView")
      ? true
      : false,
    do_not_round_off_sale_total: getItem("doNotRoundOff") ? true : false,
    enable_billing_only_when_shift_is_opened: getItem(
      "enable_billing_only_when_shift_is_opened"
    )
      ? true
      : false,
    enable_order_ticket_kot_genration: getItem("orderTicketButton")
      ? true
      : false,
    enable_quick_billing: getItem("enable_quick_billing") ? true : false,
    enforce_customer_mobile_number: getItem("enforce_customer_mobile_number")
      ? true
      : false,
    enforce_sequential_local_receipt_numbers: getItem("localReceipt")
      ? true
      : false,
    hide_all_and_top_categories: getItem("hideAllAndTop") ? true : false,
    hide_quantity_increase_decrease_buttons: getItem(
      "hide_quantity_increase_decrease_buttons"
    )
      ? true
      : false,
  });

  const [form] = Form.useForm();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  const setOnSubmitToLocal = (PrefrenceData) => {
    setItem("doNotRoundOff", PrefrenceData.do_not_round_off_sale_total);
    setItem(
      "listView",
      PrefrenceData.display_items_in_sell_screen_as_a_list_instead_of_grid
    );
    setItem(
      "localReceipt",
      PrefrenceData.enforce_sequential_local_receipt_numbers
    );
    setItem(
      "orderTicketButton",
      PrefrenceData.enable_order_ticket_kot_genration
    );
    setItem("enable_quick_billing", PrefrenceData.enable_quick_billing);
    setItem(
      "hide_quantity_increase_decrease_buttons",
      PrefrenceData.hide_quantity_increase_decrease_buttons
    );
    setItem("hideAllAndTop", PrefrenceData.hide_all_and_top_categories);
    setItem(
      "enforce_customer_mobile_number",
      PrefrenceData.enforce_customer_mobile_number
    );
    setItem(
      "enable_billing_only_when_shift_is_opened",
      PrefrenceData.enable_billing_only_when_shift_is_opened
    );
    setItem(
      "create_receipt_while_fullfilling_booking",
      PrefrenceData.create_receipt_while_fullfilling_booking
    );
    setItem("dark_mode", PrefrenceData.dark_mode);
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true)
    if (
      sellingPreference.hasOwnProperty(
        "enforce_sequential_local_receipt_numbers"
      )
    ) {
      if (
        sellingPreference.enforce_sequential_local_receipt_numbers &&
        enforceReceiptChanges
      ) {
        setItem("isStartSellingFromThisDevice", true);
      } else {
        setItem(
          "isStartSellingFromThisDevice",
          getItem("isStartSellingFromThisDevice")
        );
      }
    }
    let formData = {
      selling_preferences: sellingPreference,
    };
    setOnSubmitToLocal(sellingPreference);
    dispatch(DarkModeAvailable(sellingPreference.dark_mode));
    const getAddedPrefernce = await dispatch(addOrUpdatePrefernce(formData));
    if (!getAddedPrefernce.error && getAddedPrefernce?.PreferenceData?.selling_preferences) {
      setLoading(false)
      setItem("prefernce_id", getAddedPrefernce.PreferenceData._id);
      setSaveButtonDisabled(true);
    }
  };

  const checkValueIsUpdateOrNot = (sellPrefrnceValue) => {
    if (getItem("prefernce_id")) {
      if (
        _.isEqual(
          {
            create_receipt_while_fullfilling_booking: getItem(
              "create_receipt_while_fullfilling_booking"
            )
              ? true
              : false,
            dark_mode: getItem("dark_mode") ? true : false,
            display_items_in_sell_screen_as_a_list_instead_of_grid: getItem(
              "listView"
            )
              ? true
              : false,
            do_not_round_off_sale_total: getItem("doNotRoundOff")
              ? true
              : false,
            enable_billing_only_when_shift_is_opened: getItem(
              "enable_billing_only_when_shift_is_opened"
            )
              ? true
              : false,
            enable_order_ticket_kot_genration: getItem("orderTicketButton")
              ? true
              : false,
            enable_quick_billing: getItem("enable_quick_billing")
              ? true
              : false,
            enforce_customer_mobile_number: getItem(
              "enforce_customer_mobile_number"
            )
              ? true
              : false,
            enforce_sequential_local_receipt_numbers: getItem("localReceipt")
              ? true
              : false,
            hide_all_and_top_categories: getItem("hideAllAndTop")
              ? true
              : false,
            hide_quantity_increase_decrease_buttons: getItem(
              "hide_quantity_increase_decrease_buttons"
            )
              ? true
              : false,
          },
          sellPrefrnceValue
        )
      ) {
        setSaveButtonDisabled(true);
      } else {
        setSaveButtonDisabled(false);
      }
    } else if (sellPrefrnceValue && getItem("prefernce_id") == null) {
      if (
        _.isEqual(
          {
            create_receipt_while_fullfilling_booking: getItem(
              "create_receipt_while_fullfilling_booking"
            )
              ? true
              : false,
            dark_mode: getItem("dark_mode") ? true : false,
            display_items_in_sell_screen_as_a_list_instead_of_grid: getItem(
              "listView"
            )
              ? true
              : false,
            do_not_round_off_sale_total: getItem("doNotRoundOff")
              ? true
              : false,
            enable_billing_only_when_shift_is_opened: getItem(
              "enable_billing_only_when_shift_is_opened"
            )
              ? true
              : false,
            enable_order_ticket_kot_genration: getItem("orderTicketButton")
              ? true
              : false,
            enable_quick_billing: getItem("enable_quick_billing")
              ? true
              : false,
            enforce_customer_mobile_number: getItem(
              "enforce_customer_mobile_number"
            )
              ? true
              : false,
            enforce_sequential_local_receipt_numbers: getItem("localReceipt")
              ? true
              : false,
            hide_all_and_top_categories: getItem("hideAllAndTop")
              ? true
              : false,
            hide_quantity_increase_decrease_buttons: getItem(
              "hide_quantity_increase_decrease_buttons"
            )
              ? true
              : false,
          },
          sellPrefrnceValue
        )
      ) {
        setSaveButtonDisabled(true);
      } else {
        setSaveButtonDisabled(false);
      }
    }
  };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Selling Preferences</Heading>
            <span>Customize how you sell, enable order tickets / KOTs.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <NotificationWrapper>
              <Form form={form}>
                <div className="notification-body">
                  <nav>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Do not roundoff sale total{" "}
                            <Tooltip title="When this option is disabled, the sale total will be rounded off. Eg:100.50 bill will be rounded off to 100.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.do_not_round_off_sale_total
                          }
                          onChange={(value) => {
                            setSaveButtonDisabled(false);
                            // setItem("doNotRoundOff", value);
                            setSellingPreference({
                              ...sellingPreference,
                              do_not_round_off_sale_total: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              do_not_round_off_sale_total: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Display items in sell screen as a list instead of
                            grid{" "}
                            <Tooltip title="Enabling this option displays item in sell screen as a list insted of grid, useful for faster keyboard inputs.This prefernce is applicable only for the web portal.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.display_items_in_sell_screen_as_a_list_instead_of_grid
                          }
                          onChange={(value) => {
                            // setItem("listView", value);
                            setSellingPreference({
                              ...sellingPreference,
                              display_items_in_sell_screen_as_a_list_instead_of_grid: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              display_items_in_sell_screen_as_a_list_instead_of_grid: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enforce sequential local receipt numbers{" "}
                            <Tooltip title="When you enable this option, your local receipt numbers will be sequential Also, you will be able to sell from only one device per register.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>

                        <Switch
                          checked={
                            sellingPreference.enforce_sequential_local_receipt_numbers
                          }
                          onChange={(value) => {
                            // setItem("localReceipt", value);
                            setEnforcReceiptChanges(value);
                            setSellingPreference({
                              ...sellingPreference,
                              enforce_sequential_local_receipt_numbers: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              enforce_sequential_local_receipt_numbers: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable order ticket / KOT generation{" "}
                            <Tooltip title="An order ticket / KOT(kichen order ticket) will be generated along with the sale.To print order tickets, make sure the register is setup to allow printing.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.enable_order_ticket_kot_genration
                          }
                          onChange={(value) => {
                            // setItem("orderTicketButton", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enable_order_ticket_kot_genration: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              enable_order_ticket_kot_genration: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable quick billing{" "}
                            <Tooltip title="This enables faster billing by using default payment mode as cash and limiting only to do immediate sales.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={sellingPreference.enable_quick_billing}
                          onChange={(value) => {
                            // setItem("enable_quick_billing", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enable_quick_billing: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              enable_quick_billing: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide quantity increase / decrease buttons{" "}
                            <Tooltip title="Enables this option to hide the quantity increase / decrease buttons and show an input box instead.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>

                        <Switch
                          checked={
                            sellingPreference.hide_quantity_increase_decrease_buttons
                          }
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              hide_quantity_increase_decrease_buttons: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              hide_quantity_increase_decrease_buttons: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide All and Top categories{" "}
                            <Tooltip title="Enables this option to hide all and Top categories in sell screen. improves performance when you have large number of products.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.hide_all_and_top_categories
                          }
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              hide_all_and_top_categories: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              hide_all_and_top_categories: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enforce customer mobile number{" "}
                            <Tooltip title="Enables this option to enforce customer mobile number.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.enforce_customer_mobile_number
                          }
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              enforce_customer_mobile_number: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              enforce_customer_mobile_number: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable billing only when shift is opened{" "}
                            <Tooltip title="Enable this option to enable billing only when shift is opened">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.enable_billing_only_when_shift_is_opened
                          }
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              enable_billing_only_when_shift_is_opened: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              enable_billing_only_when_shift_is_opened: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single  ">
                          <p>
                            Create receipt while fulfilling booking{" "}
                            <Tooltip title="When you enble this option, booking orders will be saved as draft and receipt will be created only while fulfilling.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            sellingPreference.create_receipt_while_fullfilling_booking
                          }
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              create_receipt_while_fullfilling_booking: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              create_receipt_while_fullfilling_booking: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single  ">
                          <p>
                            Dark Mode{" "}
                            <Tooltip title="">
                              {" "}
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <p style={{ display: "none" }}>
                          {sellingPreference?.dark_mode}
                        </p>
                        <Switch
                          checked={sellingPreference.dark_mode}
                          onChange={(value) => {
                            setSellingPreference({
                              ...sellingPreference,
                              dark_mode: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...sellingPreference,
                              dark_mode: value,
                            });
                          }}
                        />
                      </li>
                    </ul>
                  </nav>
                </div>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      setSellingPreference({
                        create_receipt_while_fullfilling_booking: getItem(
                          "create_receipt_while_fullfilling_booking"
                        )
                          ? true
                          : false,
                        dark_mode: getItem("dark_mode") ? true : false,
                        display_items_in_sell_screen_as_a_list_instead_of_grid: getItem(
                          "listView"
                        )
                          ? true
                          : false,
                        do_not_round_off_sale_total: getItem("doNotRoundOff")
                          ? true
                          : false,
                        enable_billing_only_when_shift_is_opened: getItem(
                          "enable_billing_only_when_shift_is_opened"
                        )
                          ? true
                          : false,
                        enable_order_ticket_kot_genration: getItem(
                          "orderTicketButton"
                        )
                          ? true
                          : false,
                        enable_quick_billing: getItem("enable_quick_billing")
                          ? true
                          : false,
                        enforce_customer_mobile_number: getItem(
                          "enforce_customer_mobile_number"
                        )
                          ? true
                          : false,
                        enforce_sequential_local_receipt_numbers: getItem(
                          "localReceipt"
                        )
                          ? true
                          : false,
                        hide_all_and_top_categories: getItem("hideAllAndTop")
                          ? true
                          : false,
                        hide_quantity_increase_decrease_buttons: getItem(
                          "hide_quantity_increase_decrease_buttons"
                        )
                          ? true
                          : false,
                      });
                      setSaveButtonDisabled(true);
                    }}
                  >
                    Reset
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={saveButtonDisabled}
                    onClick={() => handleSubmit()}
                  >
                    {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: "white", margin: "0px 8px" }} spin />} /> : "Save"}
                  </Button>
                </Form.Item>
              </Form>
            </NotificationWrapper>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

Selling.propTypes = {
  darkMode: propTypes.bool,
  events: propTypes.object,
};

export default Selling;
