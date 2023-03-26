import React, { useState } from "react";

import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Input,
  Space,
  Popover,
  Layout,
  Button,
  Typography,
} from "antd";
import { SellModuleNav } from "../Style";
import { NavLink } from "react-router-dom";
import { TakeAway } from "../Orders/TakeAway";
import { CustomTable } from "../Orders/customTable";
import { Delivery } from "../Orders/Delivery";
import { All } from "../Tables/All";
import { Free } from "../Tables/Free";
import { Occupied } from "../Tables/Occupied";
import { useEffect } from "react";
// import "./dummy.css";
const { ipcRenderer, remote } = window.require("electron");
const Dummy = ({ category, table, product }) => {
  const [form] = Form.useForm();
  const { Header, Footer, Sider, Content } = Layout;
  const { Text } = Typography;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];
  const [windowWidth, setWindowWidth] = useState(
    remote.getCurrentWindow().getSize()[1]
  );
  const [scrollheight, setScrollheight] = useState({ y: "62vh" });
  useEffect(() => {
    setWindowWidth(remote.getCurrentWindow().getSize()[1]);
    let findheight = remote.getCurrentWindow().getSize()[1] * 0.068;
    setScrollheight({
      y: findheight + "vh",
    });
  }, [remote.getCurrentWindow().getSize()[0]]);
  return (
    <div
      style={{
        borderStyle: "solid",
        borderColor: "green",
        height: "calc(100% - 10%)",
      }}
    >
      <Row>
        <Col xxl={3} lg={3} sm={3} md={3} xl={3} className="category-col">
          <Card headless className="order-card">
            <div
              // className="all-parent list-boxmain"
              style={{ background: "#f4f5f7" }}
            >
              <SellModuleNav>
                <ul className="currentbuild-ul">
                  {category.map((val, index) => {
                    return (
                      <li style={{ fontSize: 13 }}>
                        <NavLink to="#">
                          <span className="nav-text">
                            <span>
                              {val.name} {index}
                            </span>
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </SellModuleNav>
            </div>
          </Card>
        </Col>
        <Col xxl={12} lg={12} sm={12} md={12} xl={11}>
          <Card
            headless
            size="large"
            className="order-card"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="sell-table-parent all-parent list-boxmain">
              <Row gutter={[2, 2]} className="all-row list-box-row">
                {product.length > 0 &&
                  product.map((val, index) => {
                    return (
                      <Col
                        key={index}
                        xs={12}
                        xl={6}
                        md={6}
                        sm={8}
                        className="sell-table-col"
                      >
                        <div className={"sell-main " + ""}>
                          <div className="product-title">{val.name}</div>
                          <div className="product-price inlineDIv">
                            {index}
                          </div>{" "}
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Card>
        </Col>
        <Col xxl={9} lg={9} sm={9} md={9} xl={9} className="padding">
          <p className="order-summry-header">
            <span className="sp-hide-if-sm-screen">
              <small>
                <div className="tabel_namecurnt">{"Current Sale"}</div>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  |
                </span>
                <NavLink
                  to="#"
                  style={{
                    marginLeft: "10px",
                    fontSize: 13,
                    color: "#008cba",
                  }}
                  className="customer-data-btn"
                >
                  9904301543
                </NavLink>
              </small>
            </span>
          </p>
          <Form.Item name="mobile" className="w-100">
            <Input placeholder="Customer mobile number(F8)" type="number" />
          </Form.Item>
          <Space size="medium" />
          <Table
            dataSource={table}
            columns={columns}
            pagination={false}
            scroll={scrollheight}
            footer={() => (
              <div className="discount-section upper-btns orderfntbtn">
                <>
                  <Button
                    type="primary"
                    size="large"
                    id="orderTicketId"
                    style={{
                      marginRight: "5px",
                      borderRadius: "inherit",
                      opacity: table.length > 0 ? "" : 0.65,
                      cursor: table.length > 0 ? "pointer" : "no-drop",
                      width: "50%",
                      height: "40px",
                    }}
                  >
                    Order Ticket (F9)
                  </Button>
                  <Button
                    type="success"
                    size="large"
                    style={{
                      borderRadius: "inherit",
                      width: "50%",
                      opacity: table.length > 0 ? "" : 0.65,
                      cursor: table.length > 0 ? "pointer" : "no-drop",
                      height: "40px",
                      background: "#BD025D",
                    }}
                  >
                    Charge ₹{223} (F2)
                  </Button>
                </>
              </div>
            )}
          />
          {/* <Layout>
            <Header className="h2">
              <table>
                <tr>
                  <td>itm</td>
                  <td>qty</td>
                  <td>price</td>
                </tr>
              </table>
            </Header>
            <Content className="sagarbhai">
              {table.map((val, index) => (
                <table>
                  <tr>
                    <td>pizaa</td>
                    <td>{index}</td>
                    <td>550</td>
                  </tr>
                </table>
              ))}
            </Content>
            <Footer className="f2">
              {" "}
              <div className="discount-section">
                <Popover content={<p>saa</p>}>
                  <Button type="link" className="onhover">
                    buckDiscount
                  </Button>
                </Popover>
                <Popover
                  content={<p>coupan</p>}
                  trigger="click"
                  overlayClassName="coupon_popup"
                >
                  <Button
                    type="link"
                    // className=""
                    style={{
                      color: "#008cba",
                      fontSize: "13px",
                      background: "#F4F5F7",
                      border: "none",
                    }}
                    className="onhover customer-data-btn"
                  ></Button>
                </Popover>
              </div>
              <div className="discount-section upper-btns orderfntbtn">
                <>
                  <Button
                    type="primary"
                    size="large"
                    id="orderTicketId"
                    style={{
                      marginRight: "5px",
                      borderRadius: "inherit",
                      opacity: table.length > 0 ? "" : 0.65,
                      cursor: table.length > 0 ? "pointer" : "no-drop",
                      width: "50%",
                      height: "40px",
                    }}
                  >
                    Order Ticket (F9)
                  </Button>
                  <Button
                    type="success"
                    size="large"
                    style={{
                      borderRadius: "inherit",
                      width: "50%",
                      opacity: table.length > 0 ? "" : 0.65,
                      cursor: table.length > 0 ? "pointer" : "no-drop",
                      height: "40px",
                      background: "#BD025D",
                    }}
                  >
                    Charge ₹{223} (F2)
                  </Button>
                </>
              </div>
            </Footer>
          </Layout> */}
          {/* </Card> */}
          {/* <Card headless className="order-card">
            <div style={{ background: "#f4f5f7" }}>
              <div>
                <p className="order-summry-header">
                  <span className="sp-hide-if-sm-screen">
                    <small>
                      <div className="tabel_namecurnt">{"Current Sale"}</div>
                      <span
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        |
                      </span>
                      <NavLink
                        to="#"
                        style={{
                          marginLeft: "10px",
                          fontSize: 13,
                          color: "#008cba",
                        }}
                        className="customer-data-btn"
                      >
                        9904301543
                      </NavLink>
                    </small>
                  </span>
                </p>
                <Form form={form}>
                  <Form.Item name="mobile" className="w-100">
                    <Input
                      placeholder="Customer mobile number(F8)"
                      type="number"
                    />
                  </Form.Item>
                  <Space size="medium" />

                  <Table
                    className="tbl_data addscroll"
                    dataSource={table}
                    columns={columns}
                    size="small"
                    scroll={{ y: 450 }}
                    pagination={false}
                    summary={(pageData) => {
                      return (
                        <>
                          {table.length > 0 ? (
                            <Table.Summary.Row>
                              <>
                                <Table.Summary.Cell>Taxes</Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="center-tax">
                                  <Text>₹{Number(20).toFixed(2)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>
                              </>
                            </Table.Summary.Row>
                          ) : (
                            ""
                          )}
                          <Table.Summary.Row>
                            <>
                              <Table.Summary.Cell>Roundoff</Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text></Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell className="center-tax">
                                <Text>₹{Number(7).toFixed(2)}</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text></Text>
                              </Table.Summary.Cell>
                            </>
                          </Table.Summary.Row>
                        </>
                      );
                    }}
                  />
                  {table.length > 0 && window.screen.width <= 776 == false ? (
                    <>
                      <div className="discount-section">
                        <Popover content={<p>saa</p>}>
                          <Button type="link" className="onhover">
                            buckDiscount
                          </Button>
                        </Popover>
                        <Popover
                          content={<p>coupan</p>}
                          trigger="click"
                          overlayClassName="coupon_popup"
                        >
                          <Button
                            type="link"
                            // className=""
                            style={{
                              color: "#008cba",
                              fontSize: "13px",
                              background: "#F4F5F7",
                              border: "none",
                            }}
                            className="onhover customer-data-btn"
                          ></Button>
                        </Popover>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="discount-section upper-btns orderfntbtn">
                    <>
                      <Button
                        type="primary"
                        size="large"
                        id="orderTicketId"
                        style={{
                          marginRight: "5px",
                          borderRadius: "inherit",
                          opacity: table.length > 0 ? "" : 0.65,
                          cursor: table.length > 0 ? "pointer" : "no-drop",
                          width: "50%",
                          height: "40px",
                        }}
                      >
                        Order Ticket (F9)
                      </Button>
                      <Button
                        type="success"
                        size="large"
                        style={{
                          borderRadius: "inherit",
                          width: "50%",
                          opacity: table.length > 0 ? "" : 0.65,
                          cursor: table.length > 0 ? "pointer" : "no-drop",
                          height: "40px",
                          background: "#BD025D",
                        }}
                      >
                        Charge ₹{223} (F2)
                      </Button>
                    </>
                  </div>
                </Form>
              </div>
            </div>
          </Card> */}
        </Col>
      </Row>
    </div>
  );
};

export { Dummy };
