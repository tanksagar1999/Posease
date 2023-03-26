import React, { useState } from "react";
import "./ecommerce.css";
import commonFunction from "../../utility/commonFunctions";
import { getItem } from "../../utility/localStorageControl";
const ViewPrint = React.forwardRef((props, ref) => {
  let { viewSummaryData } = props;
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  return (
    <div ref={ref} className="print-source">
      <h1
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "16px",
          lineHeight: "12px",
          padding: "0",
          marginBottom: "15px",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        SHIFT SUMMARY
      </h1>

      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Register
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {viewSummaryData.register_id.register_name}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Start Time
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {commonFunction.convertToDate(
              viewSummaryData.view_summary.startTime.actual_time,
              "MMM DD, Y, h:mm A"
            )}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Shift Opened by
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {viewSummaryData.view_summary.startTime.userName}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            End Time
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {commonFunction.convertToDate(
              viewSummaryData.actual_time,
              "MMM DD, Y, h:mm A"
            )}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Shift Closed by
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {viewSummaryData.userName}
          </th>
        </tr>
      </table>
      <table style={{ width: "100%" }}>
        <tr>
          <hr style={{ margin: "4px 0" }} />
        </tr>
      </table>
      <h1
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "16px",
          lineHeight: "12px",
          padding: "0",
          marginBottom: "15px",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        SALES SUMMARY
      </h1>

      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Sales Total
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {Number(
              viewSummaryData.view_summary.salesSummary.totalSales
            ).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Active Receipts
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {viewSummaryData.view_summary.salesSummary.activeReceipts}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Cancelled Receipts
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {viewSummaryData.view_summary.salesSummary.cancelReceipts}
          </th>
        </tr>
      </table>
      <table style={{ width: "100%" }}>
        <tr>
          <hr style={{ margin: "4px 0" }} />
        </tr>
      </table>

      <h1
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "16px",
          lineHeight: "12px",
          padding: "0",
          marginBottom: "15px",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        PAYMENTS SUMMARY
      </h1>
      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Payments Total
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {Number(
              viewSummaryData.view_summary.salesSummary.totalSales
            ).toFixed(2)}
          </th>
        </tr>
        {viewSummaryData.view_summary.paymentTotal.map((value) => {
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
                {value._id
                  .toString()
                  .charAt(0)
                  .toUpperCase() + value._id.toString().slice(1)}
              </th>
              <th
                style={{
                  fontSize: "12px",
                  textAlign: "right",
                  fontWeight: "700",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {Number(value.sum).toFixed(2)}
              </th>
            </tr>
          );
        })}
      </table>
      <table style={{ width: "100%" }}>
        <tr>
          <hr style={{ margin: "4px 0" }} />
        </tr>
      </table>
      {viewSummaryData?.view_summary?.paymentCount?.receipts.length > 0 && (
        <>
          <h1
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "16px",
              lineHeight: "12px",
              padding: "0",
              marginBottom: "15px",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            RECEIPT COUNT
          </h1>
          <table style={{ width: "100%" }}>
            {viewSummaryData?.view_summary?.paymentCount?.receipts &&
              viewSummaryData?.view_summary?.paymentCount?.receipts.map(
                (value) => {
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
                        {value._id
                          .toString()
                          .charAt(0)
                          .toUpperCase() + value._id.toString().slice(1)}
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        {Number(value.count)}
                      </th>
                    </tr>
                  );
                }
              )}
          </table>
          <table style={{ width: "100%" }}>
            <tr>
              <hr style={{ margin: "4px 0" }} />
            </tr>
          </table>
        </>
      )}

      {viewSummaryData?.view_summary?.paymentCount?.refunds.length > 0 && (
        <>
          <h1
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "16px",
              lineHeight: "12px",
              padding: "0",
              marginBottom: "15px",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            REFUND COUNT
          </h1>
          <table style={{ width: "100%" }}>
            {viewSummaryData?.view_summary?.paymentCount?.refunds &&
              viewSummaryData?.view_summary?.paymentCount?.refunds.map(
                (value) => {
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
                        {value._id
                          .toString()
                          .charAt(0)
                          .toUpperCase() + value._id.toString().slice(1)}
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        {Number(value.count)}
                      </th>
                    </tr>
                  );
                }
              )}
          </table>
          <table style={{ width: "100%" }}>
            <tr>
              <hr style={{ margin: "4px 0" }} />
            </tr>
          </table>
        </>
      )}
      <h1
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "16px",
          lineHeight: "12px",
          padding: "0",
          marginBottom: "15px",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        CASH SUMMARY
      </h1>
      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Opening Cash
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {viewSummaryData.view_summary.startTime &&
            viewSummaryData.view_summary.startTime.action == "open"
              ? viewSummaryData.view_summary.startTime.opening_balance
              : viewSummaryData.view_summary.startTime.closing_balance}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Cash In (Sales)
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.cashIn
                ? viewSummaryData.view_summary.cashSummary.cashIn
                : 0
            ).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Cash Out (Refunds)
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.cashOutRefunds == 0
                ? 0
                : viewSummaryData.view_summary.cashSummary.cashOutRefunds[0].sum
            ).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Petty Cash In
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.pettyCashIn == 0
                ? 0
                : viewSummaryData.view_summary.cashSummary.pettyCashIn.sum
            ).toFixed(2)}
          </th>
        </tr>

        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Petty Cash Out
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.pettyCashOut == 0
                ? 0
                : viewSummaryData.view_summary.cashSummary.pettyCashOut.sum
            ).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Expected Closing Cash
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.expectedClosingBalance
            ).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th
            style={{
              fontSize: "12px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
              textAlign: "left",
            }}
          >
            Actual Closing Cash
          </th>
          <th
            style={{
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {rsSymbol}
            {Number(
              viewSummaryData.view_summary.cashSummary.actualClosingBalance
            ).toFixed(2)}
          </th>
        </tr>
        {viewSummaryData.view_summary.cashSummary.excess < 0 ? (
          <tr>
            <th
              style={{
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: "Arial, Helvetica, sans-serif",
                textAlign: "left",
              }}
            >
              Shortage
            </th>
            <th
              style={{
                fontSize: "12px",
                textAlign: "right",
                fontWeight: "700",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              -{rsSymbol}
              {Number(
                viewSummaryData.view_summary.cashSummary.excess * -1
              ).toFixed(2)}
            </th>
          </tr>
        ) : (
          <tr>
            <th
              style={{
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: "Arial, Helvetica, sans-serif",
                textAlign: "left",
              }}
            >
              Excess
            </th>
            <th
              style={{
                fontSize: "12px",
                textAlign: "right",
                fontWeight: "700",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {rsSymbol}
              {Number(viewSummaryData.view_summary.cashSummary.excess).toFixed(
                2
              )}
            </th>
          </tr>
        )}
      </table>
      <table style={{ width: "100%" }}>
        <tr>
          <hr style={{ margin: "4px 0" }} />
        </tr>
      </table>
    </div>
  );
});
export { ViewPrint };
