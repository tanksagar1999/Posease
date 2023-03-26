import React from "react";
import { getItem } from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
import "../sell.css";
import { Row, Col, Table } from "antd";

const TestPrinter = (props) => {
  return (
    <div>
      <>
        <h4
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "12px",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          Test Title
        </h4>
        <Row gutter={[16, 16]}>
          <Col lg={24} md={24} sm={24} xs={24} style={{ background: "#fff" }} s>
            <div className="billing_det">
              <div>
                <h5 style={{ textAlign: "right" }}>Table 1</h5>

                <h6>RegisterName</h6>

                <table style={{ width: "100%" }}>
                  <tr>
                    <th
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        lineHeight: "16px",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "center",
                      }}
                    >
                      ShoopName
                    </th>
                  </tr>
                </table>
              </div>

              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  lineHeight: "16px",
                  padding: "0",
                  margin: "0",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Recepit:PS-HWX-8618-438
              </p>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "16px",
                  padding: "0",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                {commonFunction.convertToDate(new Date(), "MMM DD, Y, h:mm A")}
              </p>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  padding: "0",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                Customer: Test
              </p>

              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  padding: "0",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                Customer Mobile: 12345
              </p>
            </div>
            <Row gutter={[16, 16]}>
              <Col lg={24} md={24} sm={24} xs={24}>
                <hr style={{ margin: "4px 0" }} />
              </Col>
            </Row>
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
                  <tr>
                    <th
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textAlign: "left",
                      }}
                    >
                      Product1
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      1
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      10
                    </th>

                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "right",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      100.00
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
                      Product2
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      1
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      10
                    </th>

                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "right",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      100.00
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
                      Product3
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      1
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      10
                    </th>

                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "right",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      100.00
                    </th>
                  </tr>
                </table>
              </div>
              <Row gutter={[16, 16]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <hr style={{ margin: "4px 0" }} />
                </Col>
              </Row>
              <Row gutter={[0, 0]}>
                <div>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "left",
                          fontWeight: "700",
                          lineHeight: "14px",
                          margin: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          padding: "0",
                        }}
                      >
                        Subtotal
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "14px",
                          margin: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "right",
                          padding: "0",
                        }}
                      >
                        300.00
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "left",
                          fontWeight: "700",
                          lineHeight: "14px",
                          margin: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          padding: "0",
                        }}
                      >
                        Paid
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "14px",
                          margin: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          padding: "0",
                          textAlign: "left",
                        }}
                      >
                        300.00
                      </th>
                    </tr>
                  </table>
                </div>
              </Row>

              <Row gutter={[0, 0]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <div>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <th
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            lineHeight: "14px",
                            margin: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            padding: "0",
                            textAlign: "left",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            lineHeight: "14px",
                            margin: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "right",
                            padding: "0",
                          }}
                        >
                          300.00
                        </th>
                      </tr>

                      <tr>
                        <th
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            lineHeight: "14px",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "left",
                          }}
                        >
                          Paid
                        </th>
                        <th
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            lineHeight: "14px",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "right",
                          }}
                        >
                          300.00
                        </th>
                      </tr>
                    </table>
                  </div>
                </Col>
              </Row>

              <>
                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <hr style={{ margin: "4px 0" }} />
                  </Col>
                </Row>
                <>
                  <Row gutter={[16, 16]}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                      <hr style={{ margin: "4px 0" }} />
                    </Col>
                  </Row>
                </>
                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "center",
                          padding: "0",
                          margin: "0",
                        }}
                      >
                        Thank you. Visit again
                      </p>
                    </div>
                  </Col>
                </Row>
              </>
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
};
export default TestPrinter;
