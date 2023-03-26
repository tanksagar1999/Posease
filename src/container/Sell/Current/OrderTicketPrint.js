import React from "react";
import "../sell.css";
import { getItem } from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
const OrderTicketPrint = React.forwardRef((props, ref) => {
  const {
    categoryDetails,
    PreviousTikets,
    ReceiptNumber,
    title,
    TableName,
    onlineOrder,
    customerComment,
    waiterName,
    deliceryDateAndTime,
  } = props;

  return (
    <div>
      {categoryDetails && (
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
          {deliceryDateAndTime && (
            <p
              style={{
                fontSize: "12px",
                fontWeight: "700",
                textAlign: "center",
                fontFamily: "Arial, Helvetica, sans-serif",
                margin: 0,
              }}
            >
              {deliceryDateAndTime}
            </p>
          )}
          <h1
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "20px",
              fontWeight: "12px",
              padding: "0",
              textAlign: "center",
              marginBottom: "0px",
            }}
          >
            #{categoryDetails.tiketNumber}
          </h1>

          <div
            style={{
              paddingLeft: "3px",
              paddingRight: "3px",
              paddingBottom: "5px",
              paddingTop: "0px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Arial, Helvetica, sans-serif",
                textAlign: "center",
                marginTop: "0px",
                marginLeft: "0px",
                marginRight: "0px",
                marginBottom: "4px",
              }}
            >
              ({onlineOrder ? "Main Kitchen" : categoryDetails.categoryName})
            </p>
          </div>

          <tr>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "3px",
                paddingRight: "3px",
                paddingBottom: "2px",
                paddingTop: "0px",
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
                Time
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
                {commonFunction.convertToDate(
                  categoryDetails.enterDate,
                  "MMM DD, Y h:mm A"
                )}
              </p>
            </div>
          </tr>
          {onlineOrder ? (
            <tr>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "3px",
                  paddingRight: "3px",
                  paddingBottom: "2px",
                  paddingTop: "0px",
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
                  {onlineOrder.source}
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
                  {onlineOrder.orderId}
                </p>
              </div>
            </tr>
          ) : null}
          <tr>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "3px",
                paddingRight: "3px",
                paddingBottom: "2px",
                paddingTop: "0px",
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
                {title == "Booking" ? "Booking" : "Receipt"} number
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
                {ReceiptNumber}
              </p>
            </div>
          </tr>

          <tr>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "3px",
                paddingRight: "3px",
                paddingBottom: "2px",
                paddingTop: "0px",
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
                Created by
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
                {waiterName ? waiterName : getItem("userDetails").username}
              </p>
            </div>
          </tr>
          {TableName != "" && (
            <tr>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "3px",
                  paddingRight: "3px",
                  paddingBottom: "2px",
                  paddingTop: "0px",
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
                  Table name
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
                  {TableName}
                </p>
              </div>
            </tr>
          )}

          {categoryDetails.add_remove == "both" ? (
            <>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr
                    style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                  />
                </tr>
              </table>
              <table style={{ width: "100%" }}>
                <tr></tr>
                <th
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "14px",
                    fontWeight: "700",
                    padding: "0",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  ADDED ITEMS
                </th>
              </table>

              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}
                  >
                    ITEM
                  </th>

                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}
                  >
                    QTY
                  </th>
                </tr>

                {categoryDetails.itemList.reverse().map((i) => {
                  if (i.add_or_remove == "Added Items") {
                    let text2 = i.display_name.toString();
                    let newSpilitArray = text2.split(/[+]/);
                    let newSpilitArray1 = text2.split(/[,]/);
                    let finalArray = [];
                    newSpilitArray.map((value) => {
                      finalArray.push(value.replace(/,/gi, ""));
                    });
                    return (
                      <>
                        <tr>
                          <th
                            style={{
                              fontFamily: "Arial, Helvetica, sans-serif",
                              fontSize: "12px",
                              fontWeight: "700",
                              padding: "0",
                              margin: "0",
                              textAlign: "left",
                            }}
                          >
                            <div>
                              <>
                                {text2.includes("-") ? (
                                  newSpilitArray1.map((val) => <div>{val}</div>)
                                ) : (
                                  <div>
                                    {" "}
                                    {finalArray.length > 1 ? (
                                      <div>
                                        {finalArray.map((value, index) => {
                                          return (
                                            <div>
                                              {index == 0
                                                ? `${
                                                    i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                  } x `
                                                : null}
                                              {index > 0 ? "+" : null}
                                              {value}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div> {i.display_name}</div>
                                    )}
                                  </div>
                                )}
                              </>
                              {i.orderTiketsNotes && (
                                <div style={{ fontSize: "10px" }}>
                                  Notes - {i.orderTiketsNotes}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              fontFamily: "Arial, Helvetica, sans-serif",
                              fontSize: "12px",
                              fontWeight: "700",
                              padding: "0",
                              margin: "0",
                              textAlign: "right",
                            }}
                          >
                            +{i.newqty ? i.newqty : i.quantity}
                          </th>
                        </tr>
                      </>
                    );
                  }
                })}
              </table>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr
                    style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                  />
                </tr>
              </table>
              <table style={{ width: "100%" }}>
                <tr>
                  {" "}
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "0",
                      textAlign: "center",
                      marginBottom: "2px",
                    }}
                  >
                    CANCELLED ITEMS
                  </th>
                </tr>
              </table>

              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}
                  >
                    ITEM
                  </th>

                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}
                  >
                    QTY
                  </th>
                </tr>

                {categoryDetails.itemList.reverse().map((i) => {
                  if (i.add_or_remove == "Removed Items") {
                    let text2 = i.display_name.toString();
                    let newSpilitArray = text2.split(/[+]/);
                    let newSpilitArray1 = text2.split(/[,]/);
                    let finalArray = [];
                    newSpilitArray.map((value) => {
                      finalArray.push(value.replace(/,/gi, ""));
                    });
                    return (
                      <>
                        <tr>
                          <th
                            style={{
                              fontFamily: "Arial, Helvetica, sans-serif",
                              fontSize: "12px",
                              fontWeight: "700",
                              padding: "0",
                              margin: "0",
                              textAlign: "left",
                            }}
                          >
                            <div>
                              <>
                                {text2.includes("-") ? (
                                  newSpilitArray1.map((val) => <div>{val}</div>)
                                ) : (
                                  <div>
                                    {" "}
                                    {finalArray.length > 1 ? (
                                      <div>
                                        {finalArray.map((value, index) => {
                                          return (
                                            <div>
                                              -
                                              {index == 0
                                                ? `${
                                                    i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                  } x `
                                                : null}
                                              {index > 0 ? "+" : null}
                                              {value}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div> {i.display_name}</div>
                                    )}
                                  </div>
                                )}
                              </>
                              {i.orderTiketsNotes && (
                                <div style={{ fontSize: "10px" }}>
                                  Notes - {i.orderTiketsNotes}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              fontFamily: "Arial, Helvetica, sans-serif",
                              fontSize: "12px",
                              fontWeight: "700",
                              padding: "0",
                              margin: "0",
                              textAlign: "right",
                            }}
                          >
                            -{i.newqty ? i.newqty : i.quantity}[C]
                          </th>
                        </tr>
                      </>
                    );
                  }
                })}
              </table>
            </>
          ) : (
            <>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr
                    style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                  />
                </tr>
              </table>
              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      textAlign: "center",
                      marginBottom: "2px",
                    }}
                  >
                    {categoryDetails.add_remove == "Added Items"
                      ? "ADDED ITEMS"
                      : "CANCELLED ITEMS"}
                  </th>
                </tr>
              </table>

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
                      fontWeight: "700",
                      textAlign: "right",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    QTY
                  </th>
                </tr>

                {categoryDetails.itemList.reverse().map((i) => {
                  let text2 = i.display_name.toString();
                  let newSpilitArray = text2.split(/[+]/);
                  let newSpilitArray1 = text2.split(/[,]/);
                  let finalArray = [];
                  newSpilitArray.map((value) => {
                    finalArray.push(value.replace(/,/gi, ""));
                  });
                  return (
                    <tr>
                      <th
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                        }}
                      >
                        <>
                          <div>
                            <>
                              {text2.includes("-") ? (
                                newSpilitArray1.map((val) => <div>{val}</div>)
                              ) : (
                                <div>
                                  {" "}
                                  {finalArray.length > 1 ? (
                                    <div>
                                      {finalArray.map((value, index) => {
                                        return (
                                          <div>
                                            {index == 0
                                              ? `${
                                                  i.newqty
                                                    ? i.newqty
                                                    : i.quantity
                                                } x `
                                              : null}
                                            {index > 0 ? "+" : null}
                                            {value}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div> {i.display_name}</div>
                                  )}
                                </div>
                              )}
                            </>
                            {i.orderTiketsNotes && (
                              <div style={{ fontSize: "10px" }}>
                                Notes - {i.orderTiketsNotes}
                              </div>
                            )}
                          </div>
                        </>
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "right",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        {" "}
                        {categoryDetails.add_remove == "Removed Items" && `-`}
                        {categoryDetails.add_remove != "Removed Items" &&
                          `+`}{" "}
                        {i.newqty ? i.newqty : i.quantity}
                        {categoryDetails.add_remove == "Removed Items" && `[C]`}
                      </th>
                    </tr>
                  );
                })}
              </table>
            </>
          )}
          <table style={{ width: "100%" }}>
            <tr>
              <hr
                style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
              />
            </tr>
          </table>

          {PreviousTikets.length > 0 && (
            <table style={{ width: "100%" }}>
              <tr>
                <th
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "left",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  Previous Order Tickets:{" "}
                  {PreviousTikets.sort(function(a, b) {
                    return a - b;
                  }).map((i, index) => {
                    return (
                      <span>
                        {index == PreviousTikets.length - 1 ? `${i}` : `${i},`}
                      </span>
                    );
                  })}
                </th>
              </tr>
            </table>
          )}
          {PreviousTikets.length > 0 && (
            <table style={{ width: "100%" }}>
              <tr>
                <hr
                  style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                />
              </tr>
            </table>
          )}
          {customerComment && (
            <table style={{ width: "100%" }}>
              <tr>
                <th
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "left",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  Instruction: {customerComment}
                </th>
              </tr>
            </table>
          )}

          {customerComment && (
            <table style={{ width: "100%" }}>
              <tr>
                <hr
                  style={{ margin: "4px 0 0", borderTop: "2px dotted black" }}
                />
              </tr>
            </table>
          )}
        </>
      )}
    </div>
  );
});
export default React.memo(OrderTicketPrint);
