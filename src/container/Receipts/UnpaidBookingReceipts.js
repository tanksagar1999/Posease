import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Modal, Form, Input, Radio, Button } from "antd";
import { AddAndUpdateBooking } from "../../redux/sell/actionCreator";
import { useDispatch } from "react-redux";
import commonFunction from "../../utility/commonFunctions";
import { EditBookingReceipts } from "./EditBookingReceipts";
import { getItem } from "../../utility/localStorageControl";
function UnpaidBookingReceipts(props) {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const { RecepitsDataDetails, PaymentTypeList, updateFetch } = props;
  const editRef = useRef();
  const [form] = Form.useForm();
  const [spiltForm] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [PaymentType, setPaymentType] = useState(false);
  const [modalSpiltVisible, setModelSpiltVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState("");
  const [notes, setNotes] = useState("");
  let [pyamnetTypeArrayList, setPaymnetTypeArrayList] = useState([
    {
      name: "Cash",
      value: 0,
    },
    { name: "Credit / Debit Card", value: 0 },

    { name: "Other", value: 0 },
  ]);

  const [splitUpdateButoonDisbled, setSplitUpdateButtonDisbled] = useState(
    true
  );

  const [excess, setExcess] = useState(0);
  const [pending, setPending] = useState(
    RecepitsDataDetails?.order_id.details.bookingDetails.pending_payments
  );
  const [filterSplitArray, setFilterSplitArray] = useState([]);
  const [compaltePaymnetsList, setComplatePaymnetsList] = useState();

  useEffect(() => {
    setComplatePaymnetsList(
      RecepitsDataDetails?.order_id.details.bookingDetails
        .booking_advance_payment_type
    );
  }, [RecepitsDataDetails]);
  useEffect(() => {
    PaymentTypeList.map((val) => {
      val.value = 0;
    });
    setPaymnetTypeArrayList([...pyamnetTypeArrayList, ...PaymentTypeList]);
  }, [PaymentTypeList]);
  useEffect(() => {
    let paymnetType;
    if (PaymentType == "cash") {
      paymnetType = "Cash";
    } else if (PaymentType == "card") {
      paymnetType = "Credit / Debit Card";
    } else if (PaymentType == "other") {
      paymnetType = "Other";
    } else {
      paymnetType = PaymentType;
    }
    pyamnetTypeArrayList.map((data) => {
      if (data.name == paymnetType) {
        data.value =
          RecepitsDataDetails?.order_id.details.bookingDetails.pending_payments;
      } else {
        data.value = 0;
      }
    });
    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
      return acc + Number(obj.value);
    }, 0);

    if (
      sum ==
      RecepitsDataDetails?.order_id.details.bookingDetails.pending_payments
    ) {
      setSplitUpdateButtonDisbled(false);
    }
  }, [PaymentType]);

  const SubmitSplitPaymentType = () => {
    let filterSplitArray = pyamnetTypeArrayList.filter(
      (item) => item.value > 0 && item.value != ""
    );

    setFilterSplitArray(filterSplitArray);
    setModelSpiltVisible(false);
  };

  const handleCancel = (e) => {
    setModelSpiltVisible(false);
    setFilterSplitArray([]);
  };

  const updateOrder = async () => {
    let paymnetType;
    if (PaymentType == "Cash") {
      paymnetType = "cash";
    } else if (PaymentType == "Credit / Debit Card") {
      paymnetType = "card";
    } else if (PaymentType == "Other") {
      paymnetType = "other";
    } else {
      paymnetType = PaymentType;
    }
    RecepitsDataDetails.order_id.details.paymentStatus = "paid";
    filterSplitArray.length > 1
      ? (RecepitsDataDetails.order_id.details.bookingDetails.booking_advance_payment_type = [
          ...compaltePaymnetsList,
          ...filterSplitArray,
        ])
      : (RecepitsDataDetails.order_id.details.bookingDetails.booking_advance_payment_type = [
          ...compaltePaymnetsList,
          {
            name: paymnetType,
            value:
              RecepitsDataDetails.order_id.details.bookingDetails
                .pending_payments,
          },
        ]);
    RecepitsDataDetails.order_id.details.bookingDetails.booking_advance_payment_type.map(
      (i) => {
        if (i.name == "Cash") {
          i.name = "cash";
          i.bookingDate == null && (i.paymentDate = new Date());
        } else if (i.name == "Credit / Debit Card") {
          i.name = "card";
          i.bookingDate == null && (i.paymentDate = new Date());
        } else if (i.name == "Other") {
          i.name = "other";
          i.bookingDate == null && (i.paymentDate = new Date());
        } else {
          i.name = i.name;
          i.bookingDate == null && (i.paymentDate = new Date());
        }
      }
    );
    if (cardDetails != "") {
      RecepitsDataDetails.order_id.details.bookingDetails.card_Details = cardDetails;
    } else if (notes != "") {
      RecepitsDataDetails.order_id.details.bookingDetails.payment_notes = notes;
    }
    RecepitsDataDetails.order_id.details.bookingDetails.pending_payments = 0;
    RecepitsDataDetails.order_id.details.fulfillmentStatus = "Fulfilled";

    let ordederUpdatedata = { details: RecepitsDataDetails.order_id.details };
    ordederUpdatedata.updatePaymentDate = new Date();
    const getUpdateReceiptsData = await dispatch(
      AddAndUpdateBooking(ordederUpdatedata, RecepitsDataDetails.order_id._id)
    );

    if (getUpdateReceiptsData) {
      updateFetch(RecepitsDataDetails._id);
    }
  };

  return (
    <div>
      <div className="border-top">
        <Row>
          <Col lg={22} md={18} sm={24} offset={0}>
            {RecepitsDataDetails &&
            RecepitsDataDetails.order_id.details.bookingDetails ? (
              <>
                <span>
                  <span className="other-details">Booking Details</span>
                  {`${RecepitsDataDetails.order_id.details.bookingDetails.delivery_date} , ${RecepitsDataDetails.order_id.details.bookingDetails.delivery_time}`}
                  {RecepitsDataDetails.order_id.details.bookingDetails
                    .is_door_delivery
                    ? " | Door Delivery"
                    : null}
                </span>
              </>
            ) : null}
          </Col>
          {RecepitsDataDetails &&
            RecepitsDataDetails.order_id.details.fulfillmentStatus ==
              "Unfulfilled" && (
              <Col lg={2} md={18} sm={24} offset={0}>
                <span
                  style={{
                    paddingTop: "15px",
                    color: "#008cba",
                    cursor: "pointer",
                  }}
                  onClick={() => editRef.current.showModal()}
                >
                  Edit
                </span>
              </Col>
            )}
        </Row>
        <Row>
          <Col lg={12} md={18} sm={24} offset={0}>
            {RecepitsDataDetails &&
            RecepitsDataDetails.order_id.details.bookingDetails
              .booking_notes ? (
              <>
                <span>
                  <span className="other-details">Booking Notes</span>
                  {`${RecepitsDataDetails.order_id.details.bookingDetails.booking_notes}`}
                </span>
              </>
            ) : null}
          </Col>
        </Row>
      </div>
      <div className="border-top">
        <Row style={{ padding: "10px" }}>
          <Col lg={12} md={18} sm={24} offset={0}>
            {RecepitsDataDetails &&
            RecepitsDataDetails.order_id.details.fulfillmentStatus !=
              "cancelled" ? (
              <>
                <span>
                  <span className="other-details">Payment Details1</span>
                  Pending Payment {rsSymbol}
                  {
                    RecepitsDataDetails?.order_id.details.bookingDetails
                      .pending_payments
                  }
                </span>
              </>
            ) : null}
          </Col>
        </Row>
        {compaltePaymnetsList && compaltePaymnetsList[0].name != false && (
          <Row>
            {compaltePaymnetsList.map((val) => {
              return (
                <>
                  <Col lg={4} md={18} sm={24} offset={0}>
                    <div className="receipt-payment-transactions">
                      <p>{`${rsSymbol}${val.value} on Card`}</p>
                      <p className="text-muted">
                        {commonFunction.convertToDate(
                          RecepitsDataDetails.bookingDate,
                          "MMM DD, Y h:mm A"
                        )}
                      </p>
                    </div>
                  </Col>
                </>
              );
            })}

            {RecepitsDataDetails &&
              RecepitsDataDetails.order_id.cancellation &&
              RecepitsDataDetails.order_id.cancellation.refund_amount > 0 && (
                <Col lg={4} md={18} sm={24} offset={0}>
                  <div className="receipt-payment-transactions">
                    <p>{`${rsSymbol}${RecepitsDataDetails.order_id.cancellation.refund_amount} ${RecepitsDataDetails.order_id.cancellation.refund_pay_type} refund`}</p>
                    <p className="text-muted">
                      {commonFunction.convertToDate(
                        RecepitsDataDetails.created_at,
                        "MMM DD, Y h:mm A"
                      )}
                    </p>
                  </div>
                </Col>
              )}
          </Row>
        )}
      </div>

      {RecepitsDataDetails &&
        RecepitsDataDetails.order_id.details.fulfillmentStatus ==
          "Unfulfilled" && (
          <div>
            <div className="border-top">
              <Row style={{ padding: "10px" }}>
                <Col lg={24} md={24} sm={24} offset={0}>
                  <Form form={form}>
                    {filterSplitArray.length > 1 ? (
                      <Form.Item name="filterSplit" label="Payment Type1">
                        <Radio.Group className="tick-radio">
                          {filterSplitArray.map((item) => {
                            return (
                              <Radio.Button
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
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
                                {item.name} -{item.value}
                              </Radio.Button>
                            );
                          })}

                          <Button
                            onClick={() => setModelSpiltVisible(true)}
                            className="splits-button"
                          >
                            Splits
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <Form.Item name="Payment Type" label="Payment Type">
                        <Radio.Group
                          onChange={(e) => setPaymentType(e.target.value)}
                          value={PaymentType}
                          className="tick-radio"
                        >
                          {pyamnetTypeArrayList.map((val) => {
                            return (
                              <>
                                <Radio.Button
                                  value={val.name}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {PaymentType === val.name ? (
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
                                  ) : (
                                    ""
                                  )}
                                  {val.name}
                                </Radio.Button>
                              </>
                            );
                          })}

                          <Button
                            onClick={() => setModelSpiltVisible(true)}
                            className="splits-button"
                          >
                            Splits
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    <Modal
                      title="Split Payments / Bill"
                      okText="Spilt"
                      visible={modalSpiltVisible}
                      onCancel={handleCancel}
                      footer={[
                        <Button onClick={() => handleCancel()}>Cancel</Button>,
                        <Button
                          type="primary"
                          onClick={() => SubmitSplitPaymentType()}
                          disabled={splitUpdateButoonDisbled}
                        >
                          Update
                        </Button>,
                      ]}
                      width={600}
                    >
                      {splitUpdateButoonDisbled && (
                        <small style={{ paddingBottom: "10px" }}>
                          {pending > 0 && excess == 0 && (
                            <span>
                              {rsSymbol}
                              {pending} pending
                            </span>
                          )}
                          {excess > 0 && pending == 0 && (
                            <span>
                              {rsSymbol}
                              {excess} excess
                            </span>
                          )}
                        </small>
                      )}
                      <Form
                        style={{ width: "100%" }}
                        name="export"
                        form={spiltForm}
                        labelCol={{ span: 10 }}
                      >
                        {pyamnetTypeArrayList.map((val, index) => {
                          return (
                            <Form.Item label={val.name} name={val.name}>
                              <div style={{ display: "none" }}>{val.value}</div>
                              <Input
                                placeholder="0"
                                type="number"
                                value={val.value}
                                style={{ marginBottom: 6 }}
                                a-key={index}
                                onChange={(e) => {
                                  pyamnetTypeArrayList[
                                    e.target.getAttribute("a-key")
                                  ] = {
                                    name: val.name,
                                    value: e.target.value,
                                  };
                                  setPaymnetTypeArrayList([
                                    ...pyamnetTypeArrayList,
                                  ]);
                                  var sum = pyamnetTypeArrayList.reduce(
                                    function(acc, obj) {
                                      return acc + Number(obj.value);
                                    },
                                    0
                                  );

                                  if (
                                    sum ==
                                    RecepitsDataDetails?.order_id.details
                                      .bookingDetails.pending_payments
                                  ) {
                                    setSplitUpdateButtonDisbled(false);
                                    setPending(0);
                                    setExcess(0);
                                  } else if (
                                    sum >
                                    RecepitsDataDetails?.order_id.details
                                      .bookingDetails.pending_payments
                                  ) {
                                    setSplitUpdateButtonDisbled(true);
                                    setPending(0);
                                    setExcess(
                                      sum -
                                        RecepitsDataDetails?.order_id.details
                                          .bookingDetails.pending_payments
                                    );
                                  } else if (
                                    RecepitsDataDetails?.order_id.details
                                      .bookingDetails.pending_payments > sum
                                  ) {
                                    setSplitUpdateButtonDisbled(true);
                                    setExcess(0);
                                    setPending(
                                      RecepitsDataDetails?.order_id.details
                                        .bookingDetails.pending_payments - sum
                                    );
                                  } else {
                                    setSplitUpdateButtonDisbled(true);
                                  }
                                }}
                              />
                            </Form.Item>
                          );
                        })}
                      </Form>
                    </Modal>

                    {PaymentType === "Credit / Debit Card" ? (
                      <>
                        <Form.Item label="Card Details" name="card_details">
                          <Input
                            placeholder="Card details (optional)"
                            onChange={(e) => {
                              if (e.target.value != "") {
                                setCardDetails(e.target.value);
                              }
                            }}
                          ></Input>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                    {/*   */}
                    {PaymentType === "Other" ||
                    PaymentType === "Cash" ||
                    (PaymentType ===
                      pyamnetTypeArrayList.find(
                        (data) => data.name === PaymentType
                      )?.name &&
                      PaymentType != "Credit / Debit Card") ? (
                      <>
                        <Form.Item label="Notes" name="payment_notes">
                          <TextArea
                            placeholder="Notes (optional)"
                            onChange={(e) => {
                              if (e.target.value != "") {
                                setNotes(e.target.value);
                              }
                            }}
                          ></TextArea>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Form>
                </Col>
              </Row>
            </div>
            <div className="border-top">
              <Row style={{ padding: "10px" }}>
                <Col lg={12} md={18} sm={24} offset={0}>
                  <div style={{ display: "none" }}>
                    {filterSplitArray.length}
                  </div>
                  <Button
                    disabled={
                      PaymentType || filterSplitArray.length > 1 ? false : true
                    }
                    type="primary"
                    onClick={() => updateOrder()}
                  >
                    Fulfil, Received {rsSymbol}
                    {
                      RecepitsDataDetails?.order_id.details.bookingDetails
                        .pending_payments
                    }
                  </Button>

                  {PaymentType == false && (
                    <p>
                      {" "}
                      <small>Choose a payment type to proceed.1</small>
                    </p>
                  )}
                </Col>
              </Row>

              <EditBookingReceipts
                ref={editRef}
                RecepitsDataDetails={RecepitsDataDetails}
                updateFetch={updateFetch}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export { UnpaidBookingReceipts };
