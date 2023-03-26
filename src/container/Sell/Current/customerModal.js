import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
import { Modal, Tabs, Form, Input, Tag, Row, Radio, Button, Col } from "antd";
import commonFunction from "../../../utility/commonFunctions";
import {
  getItem,
  tableStatusChange,
} from "../../../utility/localStorageControl";
import {
  bingageSendOtp,
  bingageVarifyOtp,
} from "../../../redux/customer/actionCreator";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const { TabPane } = Tabs;
const CustomerModal = (props, ref) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let {
    localCartInfo,
    titleCheck,
    setCustomerDetials,
    customerModalVisible,
    setCustomerModalVisible,
    setNotUpdate,
    bulkDiscountDetails,
    bulckdiscuntButtonText,
    setBulckDiscontButtonText,
    setBulckDisountDetails,
    setBingageBalance,
    setlocalCartInfo,
  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const inputRef = useRef();
  const streetAddreddRef = useRef();
  const [allFiledDisbled, setAllFiledDisabled] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid" ? true : false
  );
  let registerList = getItem("setupCache")?.register;
  const [otpShow, setOtp] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(false);
  const [bingageDetails, setBingageDetails] = useState(false);
  const [otpData, setOtpData] = useState(false);
  const [loadingButton, setLoading] = useState(false);
  const [walletBalance, setaWalletBalance] = useState(false);
  const [bingageMsg, setBingageMsg] = useState(
    localCartInfo?.bingageDetails
      ? {
          msg: "Wallet redeemed and discount applied.",
          color: "#d0e9c6",
        }
      : {
          msg: "You cannot make changes after redeeming.",
          color: "#c4e3f3",
        }
  );
  useEffect(() => {
    if (props.customer_Data) {
      console.log("props.customer_Data", props.customer_Data);
      if (props.customer_Data && props.customer_Data.bingageDetails) {
        // setaWalletBalance(props.customer_Data.bingageDetails.balance);

        setBingageDetails({
          ...props.customer_Data.bingageDetails,
          beforeRedeemBalance: localCartInfo?.bingageDetails
            ?.beforeRedeemBalance
            ? localCartInfo?.bingageDetails?.beforeRedeemBalance
            : props.customer_Data.bingageDetails.balance,
        });
      }
      props.customer_Data.mobile
        ? form.setFieldsValue({
            mobile:
              props.customer_Data.mobile == "Add Customer"
                ? ""
                : props.customer_Data.mobile,
          })
        : titleCheck == "Add Customer"
        ? form.setFieldsValue({
            mobile: "",
          })
        : form.setFieldsValue({
            mobile: titleCheck,
          });

      props.customer_Data.name
        ? form.setFieldsValue({
            name: props.customer_Data.name,
          })
        : form.setFieldsValue({
            name: "",
          });
      props.customer_Data.city
        ? form.setFieldsValue({
            city: props.customer_Data.city,
          })
        : form.setFieldsValue({
            city: "",
          });
      props.customer_Data.shipping_address
        ? form.setFieldsValue({
            shipping_address: props.customer_Data.shipping_address,
          })
        : form.setFieldsValue({
            shipping_address: "",
          });
      props.customer_Data.zipcode
        ? form.setFieldsValue({
            zipcode: props.customer_Data.zipcode,
          })
        : form.setFieldsValue({
            zipcode: "",
          });
    }
  }, [props, customerModalVisible, titleCheck]);

  function callback(key) {}

  const onSubmit = async (formdata) => {
    setCustomerModalVisible(false);
    if (props.customer_Data?._id) {
      props.currentData({
        name: formdata.name,
        mobile: formdata.mobile,
        id: props.customer_Data._id,
        shipping_address: formdata.shipping_address,
        city: formdata.city,
        zipcode: formdata.zipcode,
      });
      form.resetFields();
    } else {
      props.currentData({
        name: formdata.name,
        mobile: formdata.mobile,
        shipping_address: formdata.shipping_address,
        city: formdata.city,
        zipcode: formdata.zipcode,
      });

      form.resetFields();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (streetAddreddRef.current) {
      streetAddreddRef.current.focus();
    }
  });

  const handleCancel = () => {
    setCustomerModalVisible(false);
  };
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const redeemSendOtp = async () => {
    setLoading(true);
    console.log("checlllpp");
    if (
      otpShow &&
      otpData &&
      transactionDetails &&
      transactionDetails.transactionIdOtp &&
      !loadingButton
    ) {
      let payload = {
        OTP: otpData,
        transactionId: transactionDetails.transactionIdOtp,
        transactionDetails: transactionDetails,
      };
      const getresponseValue = await dispatch(
        bingageVarifyOtp(payload, props.customer_Data)
      );
      console.log("hjkjjkhkjkhj", getresponseValue);
      if (getresponseValue && getresponseValue.err) {
        setLoading(false);
        setBingageMsg({
          msg: "This otp is not correct",
          color: "red",
        });
      } else if (getresponseValue) {
        setLoading(false);
        setaWalletBalance(getresponseValue.balance);
        setBingageBalance(getresponseValue.balance);
        setBingageMsg({
          msg: "Wallet redeemed and discount applied.",
          color: "#d0e9c6",
        });
        console.log("bingagedetails33", bingageDetails);
        let local_cart_data = tableStatusChange(
          localCartInfo?.cartKey,
          "Unpaid",
          "",
          bingageDetails
        );
        // setNotUpdate(true);
        setlocalCartInfo(local_cart_data);
        setBulckDiscontButtonText({
          ...bulckdiscuntButtonText,
          text: `Bulk discount ${rsSymbol}${Number(
            bingageDetails.beforeRedeemBalance
          ).toFixed(2)}`,
          color: "#008cba",
          discountValue: Number(bingageDetails.beforeRedeemBalance).toFixed(2),
        });
        setBulckDisountDetails({
          ...bulkDiscountDetails,
          type: "FLAT",
          value: Number(bingageDetails.beforeRedeemBalance).toFixed(2),
          click: true,
          check: "bulck",
          bingageDetails: bingageDetails,
        });
      }
    } else if (!loadingButton) {
      const getresponse = await dispatch(
        bingageSendOtp(props.customer_Data, bingageDetails)
      );
      console.log("rfmfmferfmefmerfierfer", getresponse);
      if (getresponse && getresponse.err) {
        setLoading(false);
        setBingageMsg({
          msg: "Invoice amount can't be less then redeem amount",
          color: "red",
        });
        return true;
      }
      if (getresponse && getresponse.OtpSent) {
        setLoading(false);
        setTransactionDetails(getresponse);
        if (getresponse && getresponse.OtpSent) {
          setOtp(true);
        }
      } else if (getresponse && Number(getresponse.balance) > -1) {
        setLoading(false);
        setaWalletBalance(getresponse.updateBalance);
        setBingageBalance(getresponse.updateBalance);
        setBingageMsg({
          msg: "Wallet redeemed and discount applied.",
          color: "#d0e9c6",
        });
        let local_cart_data = tableStatusChange(
          localCartInfo?.cartKey,
          "Unpaid",
          "",
          bingageDetails
        );
        setlocalCartInfo(local_cart_data);
        // setNotUpdate(true);
        setBulckDiscontButtonText({
          ...bulckdiscuntButtonText,
          text: `Bulk discount ${rsSymbol}${Number(
            bingageDetails.beforeRedeemBalance
          ).toFixed(2)}`,
          color: "#008cba",
          discountValue: Number(bingageDetails.beforeRedeemBalance).toFixed(2),
        });
        setBulckDisountDetails({
          ...bulkDiscountDetails,
          type: "FLAT",
          value: Number(bingageDetails.beforeRedeemBalance).toFixed(2),
          click: true,
          check: "bulck",
          bingageDetails: bingageDetails,
        });
      }
    }
  };
  const redeemRef = useRef();
  const handleKeyDown = (event, current) => {
    console.log("sagartank212121", event);
    if (event.keyCode == 13) {
      redeemSendOtp();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div>
      <Modal
        title={
          props.titleCheck === "Add Customer"
            ? "Add Customer"
            : "Update Customer"
        }
        visible={customerModalVisible}
        onOk={form.submit}
        bodyStyle={{ paddingTop: 0 }}
        onCancel={handleCancel}
      >
        <Tabs defaultActiveKey="General" onChange={callback}>
          <TabPane tab="General" key="General">
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              onFinish={onSubmit}
              name="editProduct"
            >
              <Form.Item
                name="mobile"
                style={{ margin: "4px" }}
                label="Customer Phone"
                rules={[
                  {
                    message: "Please enter customer mobile number",
                    required: true,
                  },
                ]}
              >
                <Input
                  type="number"
                  ref={inputRef}
                  style={{
                    marginBottom: 6,
                  }}
                  disabled={allFiledDisbled}
                  placeholder="Customer Number"
                  onKeyDown={(e) => props.onEnter(e)}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value == null) {
                      props.setCustomerData("Add Customer");
                    } else {
                      setCustomerDetials({
                        ...props.customer_Data,
                        mobile: e.target.value,
                      });
                      props.setCustomerData(e.target.value);
                    }
                  }}
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
                style={{ margin: "4px" }}
              >
                <Input
                  style={{
                    marginBottom: 6,
                  }}
                  placeholder="Customer Name"
                  disabled={allFiledDisbled}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Delivery" key="Delivery">
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              name="editProduct"
              onFinish={onSubmit}
            >
              <Form.Item name="shipping_address" label="Shipping Address">
                <Input
                  ref={streetAddreddRef}
                  style={{
                    marginBottom: 6,
                  }}
                  placeholder="Street Address"
                  disabled={allFiledDisbled}
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
                <Input
                  style={{
                    marginBottom: 6,
                  }}
                  placeholder="City"
                  disabled={allFiledDisbled}
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
                <Input
                  type="number"
                  style={{
                    marginBottom: 6,
                  }}
                  placeholder="Zipcode"
                  disabled={allFiledDisbled}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          {getItem("bingage_enable") && (
            <TabPane tab="CRM" key="Bingage">
              <p>
                Wallet Balance is {rsSymbol}
                {walletBalance
                  ? Number(walletBalance).toFixed(2)
                  : bingageDetails?.balance
                  ? Number(bingageDetails.balance).toFixed(2)
                  : "0.00"}
              </p>
              <Row gutter={[16, 16]}>
                <Col span={16}>
                  {value == 1 ? (
                    otpShow ? (
                      <Input
                        placeholder={"OTP"}
                        style={{
                          marginBottom: 10,
                          color: "black",
                          height: "34px",
                        }}
                        onChange={(e) => {
                          if (e.target.value != "") {
                            setOtpData(e.target.value);
                          }
                        }}
                      />
                    ) : (
                      <Input
                        placeholder={"Redeem amount"}
                        style={{
                          marginBottom: 10,
                          color: "black",
                          height: "34px",
                        }}
                        value={
                          bingageDetails?.balance
                            ? Number(bingageDetails.beforeRedeemBalance)
                            : "0.00"
                        }
                        disabled={true}
                      />
                    )
                  ) : (
                    <Input
                      placeholder={"Coupan code"}
                      style={{
                        marginBottom: 10,
                        height: "34px",
                      }}
                    />
                  )}
                </Col>
                <Col span={6}>
                  {" "}
                  {bingageMsg.color != "#d0e9c6" && (
                    <Button
                      type="primary"
                      ref={redeemRef} // onKeyPress={handleKeyDown}
                      style={{
                        marginBottom: 10,
                      }}
                      onClick={() => redeemSendOtp()}
                    >
                      {loadingButton ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 16,
                                color: "white",
                                margin: "0px 18px",
                              }}
                              spin
                            />
                          }
                        />
                      ) : (
                        "Redeem"
                      )}
                    </Button>
                  )}
                </Col>
              </Row>

              <p>
                <span
                  style={{
                    backgroundColor: bingageMsg.color,
                    padding: "9px",
                    color: bingageMsg.color == "red" ? "white" : "black",
                  }}
                >
                  {bingageMsg.msg}
                </span>
              </p>
            </TabPane>
          )}
        </Tabs>

        {props.customer_Data?.order_value &&
        props.customer_Data?.order_value > 0 ? (
          <>
            <Row>
              <Form.Item
                className="tvisit-n l-h0"
                name="totalounts"
                label={"Total Visits " + props.customer_Data.order_value}
              ></Form.Item>
              <Form.Item
                className="l-h0"
                name="totalounts"
                label={`Last Purchase at ${commonFunction.convertToDate(
                  props.customer_Data.last_purchase_items.created_at,
                  "MMM DD, Y, h:mm A"
                )}`}
              ></Form.Item>

              <Form.Item
                name="last_purchase"
                label="Last Purchase"
                className="lh0"
              >
                {props.customer_Data.last_purchase_items.details.itemsSold.map(
                  (val) => (
                    <Tag
                      className="custome-tag"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      {val.item}
                    </Tag>
                  )
                )}
              </Form.Item>
              <Form.Item
                name="registerName"
                label={"Associated Registers"}
                className="lh0"
              >
                {props?.customer_Data?.associated_registers
                  .filter((value, index, self) => {
                    return self.indexOf(value) === index;
                  })
                  .map((val) => {
                    let findregister = registerList.find(
                      (register) => register._id == val
                    );
                    if (findregister) {
                      return (
                        <Tag className="custome-tag">
                          {findregister.register_name}
                        </Tag>
                      );
                    }
                  })}
              </Form.Item>
            </Row>
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default React.memo(CustomerModal);
