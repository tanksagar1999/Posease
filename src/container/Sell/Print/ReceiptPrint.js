import React from "react";
import { getItem } from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
import "../sell.css";
import { Row, Col } from "antd";

const ReceiptPrint = (props) => {
  let {
    receiptsDetails,
    shopDetails,
    registerData,
    title,
    partnerData,
    price,
    ReceiptNumber,
    onlineOrder,
  } = props;

  let fullAddress = registerData?.bill_header.split("\n");
  let paidPaymnet = 0;
  let advancePayment = 0;

  let Taxesdata = [];
  let subTotalPrice = 0;
  let itemDiscunts = 0;
  if (receiptsDetails) {
    if (receiptsDetails.details.saleType == "immediate") {
      receiptsDetails.details.immediate_sale.multiple_payments_type.map(
        (val) => {
          if (val.name == "pending" || val.name == "Credit Sales (Pending)") {
          } else {
            paidPaymnet = paidPaymnet + Number(val.value);
          }
        }
      );
    } else {
      receiptsDetails.details.bookingDetails.booking_advance_payment_type.map(
        (val) => {
          paidPaymnet += Number(val.value);
          advancePayment += Number(val.value);
        }
      );
    }
    receiptsDetails.details.itemsSold.map((product) => {
      subTotalPrice += product.calculatedprice;
      product.customDiscountedValue &&
        (itemDiscunts += product.customDiscountedValue);

      if (receiptsDetails?.details?.AddtionChargeValue?.length > 0) {
        receiptsDetails.details.AddtionChargeValue.map((j) => {
          if (j.is_automatically_added) {
            j.tax_group &&
              j.tax_group.taxes.map((data) => {
                let totalTaxPrice = data.totalTaxPrice;
                Taxesdata.push({
                  name: data.tax_name,
                  value: totalTaxPrice,
                });
              });
          }
        });
      }
      product.taxGroup &&
        product.taxGroup.taxes?.map((data) => {
          let totalTaxPrice = data.totalTaxPrice;
          Taxesdata.push({
            name: data.tax_name,
            value: totalTaxPrice,
          });
        });
    });
  }
  var holder = {};
  Taxesdata.forEach(function(d) {
    if (holder.hasOwnProperty(d.name)) {
      holder[d.name] = holder[d.name] + d.value;
    } else {
      holder[d.name] = d.value;
    }
  });
  var FinalTaxesArray = [];
  for (var prop in holder) {
    FinalTaxesArray.push({ name: prop, value: holder[prop] });
  }
  if (onlineOrder && receiptsDetails?.details?.priceSummery?.totalTaxes) {
    FinalTaxesArray.push({
      name: "Tax",
      value: receiptsDetails.details.priceSummery.totalTaxes,
    });
  }
  console.warn("receiptsDetails", receiptsDetails);
  return (
    <div>
      {receiptsDetails && shopDetails && registerData && (
        <>
          {title && (
            <h4
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "20px",
                fontWeight: "12px",
                padding: "0",
                textAlign: "center",
                marginBottom: "0px",
              }}
            >
              {title}
            </h4>
          )}
          <Row gutter={[16, 16]}>
            <Col lg={24} md={24} sm={24} xs={24} style={{ background: "#fff" }}>
              <div className="billing_det">
                <div>
                  {receiptsDetails.details.tableName && (
                    <h5
                      style={{
                        textAlign: "center",
                        marginBottom: "2px",
                        marginLeft: "0px",
                        marginRight: "0px",
                        marginTop: "0px",
                      }}
                    >
                      {receiptsDetails.details.tableName}
                    </h5>
                  )}
                  {getItem("print_register_name") != null &&
                    getItem("print_register_name") == true && (
                      <>
                        <h5
                          style={{
                            textAlign: "center",
                            marginBottom: "2px",
                            marginLeft: "0px",
                            marginRight: "0px",
                            marginTop: "0px",
                          }}
                        >
                          {registerData.register_name}
                        </h5>
                      </>
                    )}

                  {registerData.include_shop_logo &&
                    shopDetails.shop_logo != "false" &&
                    shopDetails.shop_logo != "" && (
                      <p
                        style={{
                          fontFamily: "Arial, Helvetica, sans-serif",
                          lineHeight: "16px",
                          padding: "0",
                          margin: "0",
                          textAlign: "center",
                          marginBottom: "2px",
                        }}
                      >
                        <img
                          src={shopDetails.shop_logo}
                          alt=""
                          style={{
                            width: "120px",
                            height: "120px",
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        />
                      </p>
                    )}
                  <div
                    style={{
                      padding: "0px 3px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      {shopDetails.shop_name}
                    </p>{" "}
                  </div>
                </div>
                {fullAddress?.map((data) => (
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    {data}
                  </p>
                ))}
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  Receipt: {ReceiptNumber}
                </p>
                {onlineOrder ? (
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    {onlineOrder.source}: {onlineOrder.orderId}
                  </p>
                ) : null}

                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {commonFunction.convertToDate(
                    receiptsDetails.details.date,
                    "MMM DD, Y, h:mm A"
                  )}
                </p>
                {receiptsDetails.customer.name && (
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Customer: {receiptsDetails.customer.name}
                  </p>
                )}

                {receiptsDetails.customer.mobile &&
                receiptsDetails.customer.mobile != 0 &&
                receiptsDetails.customer.mobile != NaN &&
                receiptsDetails.customer.mobile != "" &&
                !isNaN(receiptsDetails.customer.mobile) ? (
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Customer Mobile: {receiptsDetails.customer.mobile}
                  </p>
                ) : (
                  ""
                )}

                {(receiptsDetails.customer?.shipping_address != "" ||
                  receiptsDetails.customer?.city != "" ||
                  receiptsDetails.customer?.zipcode != "") &&
                  (receiptsDetails.customer?.shipping_address != null ||
                    receiptsDetails.customer?.city != null ||
                    receiptsDetails.customer?.zipcode != null) && (
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      Address: {receiptsDetails.customer.shipping_address}{" "}
                      {receiptsDetails.customer.city}{" "}
                      {receiptsDetails.customer.zipcode}
                    </p>
                  )}
                {getItem("print_order_tiket_number") != null &&
                  getItem("print_order_tiket_number") == true &&
                  receiptsDetails.details.orderTiketsDetails &&
                  receiptsDetails.details.orderTiketsDetails
                    .orderTicketsData && (
                    <>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        Order :
                        {receiptsDetails.details.orderTiketsDetails.orderTicketsData.map(
                          (i, index) => {
                            return (
                              <>
                                {index ==
                                receiptsDetails.details.orderTiketsDetails
                                  .orderTicketsData.length -
                                  1
                                  ? `#${i.tiketNumber}`
                                  : `#${i.tiketNumber},`}
                              </>
                            );
                          }
                        )}
                      </span>
                    </>
                  )}
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr
                    style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                  />
                </tr>
              </table>
              <div>
                <div>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                        }}
                      >
                        ITEM
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          textAlign: "center",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        QTY
                      </th>
                      {getItem("do_not_each_tax") != null &&
                      getItem("do_not_each_tax") == true ? null : (
                        <th
                          style={{
                            fontSize: "14px",
                            textAlign: "center",
                            fontWeight: "700",
                            fontFamily: "Arial, Helvetica, sans-serif",
                          }}
                        >
                          TAX%{" "}
                        </th>
                      )}

                      <th
                        style={{
                          fontSize: "14px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        PRICE{" "}
                      </th>
                    </tr>

                    {receiptsDetails.details.itemsSold
                      .reverse()
                      .map((item, index) => {
                        let text2 = item?.display_name?.toString();
                        let newSpilitArray = text2?.split(/[+]/);
                        let newSpilitArray1 = text2?.split(/[,]/);
                        let finalArray = [];
                        newSpilitArray &&
                          newSpilitArray.map((value) => {
                            finalArray.push(value.replace(/,/gi, ""));
                          });

                        return (
                          <>
                            <tr>
                              <th
                                style={{
                                  fontSize: "12px",
                                  padding: "0",
                                  margin: 0,
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                  textAlign: "left",
                                  fontWeight: "700",
                                }}
                              >
                                {text2?.includes("-") ? (
                                  newSpilitArray1?.map((val) => (
                                    <div>{val}</div>
                                  ))
                                ) : (
                                  <div>
                                    {finalArray?.length > 1 ? (
                                      <div>
                                        {finalArray?.map((value, index) => {
                                          return (
                                            <div>
                                              {index > 0 ? "+" : null}
                                              {value}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div>{item.display_name}</div>
                                    )}
                                  </div>
                                )}

                                {getItem("print_receipt_product_notes") !=
                                  null &&
                                  getItem("print_receipt_product_notes") ==
                                    true &&
                                  item.notes &&
                                  item.notes != "" && <>{`- ${item.notes}`}</>}
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "0",
                                  margin: 0,
                                  fontWeight: "700",
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                }}
                              >
                                {item.quantity}
                              </th>
                              {getItem("do_not_each_tax") != null &&
                              getItem("do_not_each_tax") == true ? null : (
                                <th
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "0",
                                    margin: 0,
                                    fontWeight: "700",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                >
                                  {item.productTaxes}
                                  {item.productInclusivePricecalculatedprice
                                    ? " (Inc.)"
                                    : ""}
                                </th>
                              )}

                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "right",
                                  padding: "0",
                                  marginBottom: 0,
                                  fontWeight: "700",
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                }}
                              >
                                {Number(
                                  item.productInclusivePricecalculatedprice
                                    ? item.productInclusivePricecalculatedprice
                                    : item.calculatedprice
                                ).toFixed(2)}
                              </th>
                            </tr>
                          </>
                        );
                      })}
                  </table>
                </div>
                <table style={{ width: "100%" }}>
                  <tr>
                    <hr
                      style={{
                        margin: "4px 0 0",
                        borderTop: "2px dotted black",
                      }}
                    />
                  </tr>
                </table>

                <tr>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "2px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "left",
                        margin: 0,
                      }}
                    >
                      Subtotal
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        textAlign: "left",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        margin: 0,
                      }}
                    >
                      {Number(subTotalPrice).toFixed(2)}
                    </p>
                  </div>
                </tr>
                {receiptsDetails?.details?.onlineOrder?.packingCharge && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Packing Charges
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(
                          receiptsDetails.details.onlineOrder.packingCharge
                        ).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )}
                {receiptsDetails?.details?.onlineOrder?.tax > 0 && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Tax
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(
                          receiptsDetails.details.onlineOrder.tax
                        ).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )}

                {itemDiscunts > 0 && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Item Discounts
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {`-${Number(itemDiscunts).toFixed(2)}`}
                      </p>
                    </div>
                  </tr>
                )}

                {receiptsDetails?.details?.bulckDiscountValue && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Bulk Discount
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {`-${Number(
                          receiptsDetails?.details?.bulckDiscountValue
                        ).toFixed(2)}`}
                      </p>
                    </div>
                  </tr>
                )}

                {receiptsDetails?.details?.AddtionChargeValue &&
                  receiptsDetails?.details?.AddtionChargeValue.map(
                    (charge) =>
                      charge.is_automatically_added && (
                        <tr>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              paddingBottom: "2px",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "left",
                                margin: 0,
                              }}
                            >
                              {charge.charge_name}{" "}
                              {charge.tax_group &&
                                charge.tax_group.Totaltax &&
                                `(Tax ${charge.tax_group.Totaltax}%)`}
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                margin: 0,
                              }}
                            >
                              {Number(charge.AddtionalCalculatedValue).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </tr>
                      )
                  )}
                {FinalTaxesArray.length > 0 &&
                  FinalTaxesArray.map((val) => {
                    return (
                      <tr>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "2px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "left",
                              margin: 0,
                            }}
                          >
                            {val.name}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              textAlign: "left",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              margin: 0,
                            }}
                          >
                            {Number(val.value ? val.value : 0).toFixed(2)}
                          </p>
                        </div>
                      </tr>
                    );
                  })}
                {receiptsDetails.details.priceSummery.round_off_value && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Roundoff
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(
                          receiptsDetails.details.priceSummery.round_off_value
                        ).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )}

                <tr>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "2px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "left",
                        margin: 0,
                      }}
                    >
                      Total
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        textAlign: "left",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        margin: 0,
                      }}
                    >
                      {Number(
                        receiptsDetails.details.priceSummery.total
                      ).toFixed(2) > 0
                        ? Number(
                            receiptsDetails.details.priceSummery.total
                          ).toFixed(2)
                        : Number(getItem("total")).toFixed(2)}
                    </p>
                  </div>
                </tr>
                {advancePayment > 0 && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Advance
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(advancePayment).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )}
                {/* {(paidPaymnet > 0 || getItem("total")) && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        Paid
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(paidPaymnet).toFixed(2) > 0
                          ? Number(
                              receiptsDetails.details.priceSummery.total
                            ).toFixed(2)
                          : Number(getItem("total")).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )} */}
                {partnerData && price && (
                  <tr>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                          margin: 0,
                        }}
                      >
                        For {partnerData.name}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "left",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          margin: 0,
                        }}
                      >
                        {Number(price).toFixed(2)}
                      </p>
                    </div>
                  </tr>
                )}

                {receiptsDetails.details.immediate_sale &&
                  Number(
                    receiptsDetails.details.immediate_sale.balance_to_customer
                  ) > 0 && (
                    <div>
                      <tr>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "2px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "left",
                              margin: 0,
                            }}
                          >
                            Cash Received
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              textAlign: "left",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              margin: 0,
                            }}
                          >
                            {Number(
                              receiptsDetails.details.immediate_sale.cash_tender
                            ).toFixed(2)}
                          </p>
                        </div>
                      </tr>
                      <tr>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "2px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "left",
                              margin: 0,
                            }}
                          >
                            Cash Returned
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              textAlign: "left",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              margin: 0,
                            }}
                          >
                            {Number(
                              receiptsDetails.details.immediate_sale
                                .balance_to_customer
                            ).toFixed(2)}
                          </p>
                        </div>
                      </tr>
                    </div>
                  )}
                {receiptsDetails.details.saleType == "booking" && (
                  <div>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <hr
                          style={{
                            margin: "4px 0 0",
                            borderTop: "2px dotted black",
                          }}
                        />
                      </tr>
                    </table>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      BOOKING
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      BB-875-oB-1
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      Notes:{" "}
                      {receiptsDetails.details.bookingDetails.booking_notes}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      {receiptsDetails.details.bookingDetails.delivery_date} at{" "}
                      {receiptsDetails.details.bookingDetails.delivery_time}
                    </p>
                  </div>
                )}

                {registerData.bill_footer && registerData.bill_footer != "" && (
                  <>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <hr
                          style={{
                            margin: "4px 0 0",
                            borderTop: "2px dotted black",
                          }}
                        />
                      </tr>
                    </table>
                    {partnerData && !price && (
                      <>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "center",
                            margin: 0,
                          }}
                        >
                          For {partnerData.name}
                        </p>

                        <table style={{ width: "100%" }}>
                          <tr>
                            <hr
                              style={{
                                margin: "4px 0 0",
                                borderTop: "2px dotted black",
                              }}
                            />
                          </tr>
                        </table>
                      </>
                    )}
                    {registerData.bill_footer.split("\n").map((val) => {
                      return (
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "center",
                            margin: 0,
                          }}
                        >
                          {val}
                        </p>
                      );
                    })}
                  </>
                )}
              </div>
              <div></div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
export default React.memo(ReceiptPrint);
