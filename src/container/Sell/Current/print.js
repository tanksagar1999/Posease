import React from "react";
import commonFunction from "../../../utility/commonFunctions";
import { getItem } from "../../../utility/localStorageControl";
import { Row, Col } from "antd";

const print = React.forwardRef((props, ref) => {
  const { title, ReceiptNumber } = props;
  return (
    <div ref={ref} className="print-source">
      {props?.categoryDetails?.orderTicketsData?.map((i, idx) => {
        return (
          <Row gutter={[16, 16]}>
            <Col lg={24} md={24} sm={24} xs={24} style={{ background: "#fff" }}>
              <div className="billing_det">
                <div>
                  {title && (
                    <h4
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center",
                      }}
                    >
                      {title}
                    </h4>
                  )}
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          lineHeight: "16px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "center",
                          // color: "red",
                        }}
                      >
                        {i.tiketNumber}
                      </th>
                    </tr>
                  </table>
                </div>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    textAlign: "center",
                  }}
                >
                  {i.categoryName}
                </p>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    textAlign: "center",
                  }}
                  className="red-color"
                >
                  {ReceiptNumber}
                </p>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    textAlign: "center",
                  }}
                >
                  Time -
                  {commonFunction.convertToDate(
                    i.enterDate,
                    "MMM DD, Y h:mm A"
                  )}
                </p>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    textAlign: "center",
                  }}
                >
                  Created by -{getItem("userDetails").username}
                </p>
              </div>

              <Row gutter={[16, 16]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <hr style={{ margin: "4px 0" }} />
                </Col>
              </Row>

              <div
                className="billing_det"
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "16px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  textAlign: "center",
                }}
              >
                {props.label}
              </div>

              <div>
                <div>
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
                        Item
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Qty
                      </th>
                    </tr>

                    {i.itemList.map((j, idx) => {
                      return (
                        <tr key={idx}>
                          <td
                            style={{
                              fontSize: "12px",
                              padding: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "left",
                            }}
                          >
                            {j.display_name}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              textAlign: "right",
                              padding: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                            }}
                          >
                            {j.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        );
      })}
    </div>
  );
});

export default print;
