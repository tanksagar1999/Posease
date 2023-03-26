import React, { useState, useRef } from "react";
import { Row, Col, Form, Switch, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { NotificationWrapper } from "../style";
import "../../setting.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { addOrUpdatePrefernce } from "../../../../../redux/preference/actionCreator";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { getItem, setItem } from "../../../../../utility/localStorageControl";

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: 0,
  padding: 0,
};

const Permission = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [permissionPreference, setPermissionPreference] = useState({
    allow_cashiers_to_offer_discounts: getItem("allow_cashier_to_discount")
      ? true
      : false,
    allow_managers_to_change_email_address_while_requesting_reports: getItem(
      "allow_manager_to_change_email"
    )
      ? true
      : false,
    hide_the_shift_summary_link_in_lock_screen: getItem(
      "hide_the_shift_summary_link_in_lock_screen"
    )
      ? true
      : false,
  });

  const setOnSubmitToLocal = (PrefrenceData) => {
    setItem(
      "allow_cashier_to_discount",
      PrefrenceData.allow_cashiers_to_offer_discounts
    );
    setItem(
      "allow_manager_to_change_email",
      PrefrenceData.allow_managers_to_change_email_address_while_requesting_reports
    );
    setItem(
      "hide_the_shift_summary_link_in_lock_screen",
      PrefrenceData.hide_the_shift_summary_link_in_lock_screen
    );

    return true;
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    let formData = {
      permission_preferences: permissionPreference,
    };
    setOnSubmitToLocal(permissionPreference);
    const getAddedPrefernce = await dispatch(
      addOrUpdatePrefernce(formData, getItem("prefernce_id"))
    );
    if (!getAddedPrefernce.error && getAddedPrefernce.PreferenceData) {
      setSaveButtonDisabled(true);
      setLoading(false);
      setItem("prefernce_id", getAddedPrefernce.PreferenceData._id);
    }
  };
  const checkValueIsUpdateOrNot = (sellPrefrnceValue) => {
    if (getItem("prefernce_id")) {
      if (
        _.isEqual(
          {
            allow_cashiers_to_offer_discounts: getItem(
              "allow_cashier_to_discount"
            )
              ? true
              : false,
            allow_managers_to_change_email_address_while_requesting_reports: getItem(
              "allow_manager_to_change_email"
            )
              ? true
              : false,
            hide_the_shift_summary_link_in_lock_screen: getItem(
              "hide_the_shift_summary_link_in_lock_screen"
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
            allow_cashiers_to_offer_discounts: getItem(
              "allow_cashier_to_discount"
            )
              ? true
              : false,
            allow_managers_to_change_email_address_while_requesting_reports: getItem(
              "allow_manager_to_change_email"
            )
              ? true
              : false,
            hide_the_shift_summary_link_in_lock_screen: getItem(
              "hide_the_shift_summary_link_in_lock_screen"
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
            <Heading as="h4">Permission Preferences</Heading>
            <span>Customize permissions for your Cahiers and Managers.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <NotificationWrapper>
              <Form form={form} onFinish={handleSubmit}>
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
                            Allow cashiers to offer discounts{" "}
                            <Tooltip title="Enables this option if you want to allow cashiers to offer discounts while selling.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            permissionPreference.allow_cashiers_to_offer_discounts
                          }
                          onChange={(value) => {
                            setPermissionPreference({
                              ...permissionPreference,
                              allow_cashiers_to_offer_discounts: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...permissionPreference,
                              allow_cashiers_to_offer_discounts: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Allow managers to change email address while
                            requesting reports{" "}
                            <Tooltip title="Enable this option if you don't want your managers to change the notification email address when requesting reports.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            permissionPreference.allow_managers_to_change_email_address_while_requesting_reports
                          }
                          onChange={(value) => {
                            setPermissionPreference({
                              ...permissionPreference,
                              allow_managers_to_change_email_address_while_requesting_reports: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...permissionPreference,
                              allow_managers_to_change_email_address_while_requesting_reports: value,
                            });
                          }}
                        />
                      </li>
                      {/* <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide the shift summary link in lock screen{" "}
                            <Tooltip title="The shift summary link is used to generate a report for the previously ended shift.Enable this option if you don't want your cashiers and managers to view the report. ">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          checked={
                            permissionPreference.hide_the_shift_summary_link_in_lock_screen
                          }
                          onChange={(value) => {
                            setPermissionPreference({
                              ...permissionPreference,
                              hide_the_shift_summary_link_in_lock_screen: value,
                            });
                            checkValueIsUpdateOrNot({
                              ...permissionPreference,
                              hide_the_shift_summary_link_in_lock_screen: value,
                            });
                          }}
                        />
                      </li> */}
                    </ul>
                  </nav>
                </div>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      setPermissionPreference({
                        allow_cashiers_to_offer_discounts: getItem(
                          "allow_cashier_to_discount"
                        )
                          ? true
                          : false,
                        allow_managers_to_change_email_address_while_requesting_reports: getItem(
                          "allow_manager_to_change_email"
                        )
                          ? true
                          : false,
                        hide_the_shift_summary_link_in_lock_screen: getItem(
                          "hide_the_shift_summary_link_in_lock_screen"
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
                  >
                    {loading ? (
                      <Spin
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 16,
                              color: "white",
                              margin: "0px 8px",
                            }}
                            spin
                          />
                        }
                      />
                    ) : (
                      "Save"
                    )}
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

export default Permission;
