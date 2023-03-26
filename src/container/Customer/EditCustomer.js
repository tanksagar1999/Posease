import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Form, Input, Tabs, Tag, Table, Button, Spin } from "antd";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import Heading from "../../components/heading/heading";
import {
  getCustomerDetail,
  UpdateCustomer,
} from "../../redux/customer/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import "./customer.css";
import { getItem } from "../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

const EditCustomer = (props) => {
  const [activeTab, changeTab] = useState("DETAIL");
  const [selectedTags, setselectedTags] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const history = useHistory();
  const [CustomerDetail, setCustomer] = useState("");
  const [isTag, setIsTag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  useEffect(() => {
    async function fetchCustomerDetail() {
      let detail = await dispatch(getCustomerDetail(props.match.params.id));
      let allLocalData = getItem("setupCache");
      let addtionalList = [];
      let tagList = [];
      let totalList = [];
      if (detail) {
        if (allLocalData && allLocalData.customFields?.addtional) {
          addtionalList = allLocalData.customFields.addtional.filter(
            (val) => val.sub_type == "customer"
          );
        }
        if (allLocalData && allLocalData.customFields?.tag) {
          tagList = allLocalData.customFields.tag.filter(
            (val) => val.sub_type == "customer"
          );
        }
        totalList = [...addtionalList, ...tagList];
        let result = totalList.filter(function(o1) {
          return !detail.custom_fields.some(function(o2) {
            return o1._id === o2._id;
          });
        });

        if (result?.length > 0) {
          let totalArray = [...detail.custom_fields, ...result];

          var resArr = [];
          totalArray.filter(function(item) {
            var i = resArr.findIndex((x) => x.name == item.name);
            if (i <= -1) {
              resArr.push(item);
            }
            return null;
          });
          detail.custom_fields = resArr;
        }

        detail.recent_receipts = detail.recent_receipts.filter(
          (val) => val.receipt_number.length
        );
        setCustomer(detail);
      }
    }

    if (isMounted.current) {
      fetchCustomerDetail();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (CustomerDetail) {
      const array = [];
      CustomerDetail.custom_fields.map((field, index) => {
        if (field.type === "tag") {
          setIsTag(true);
          return field.value === true
            ? array.push(field.name)
            : selectedTags.filter((t) => t !== field.name);
        }
      });
      setselectedTags(array);
    }
  }, [CustomerDetail]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const edit = await dispatch(UpdateCustomer(values, props.match.params.id));

    if (!edit.CustomerData.error && location.state) {
      setLoading(false);
      history.push("/customers", {
        currentPage_data: location.state.current_page,
        sizeOf_data: location.state.size_data,
      });
    }
  };

  const handleSubmitAdditional = async (value) => {
    setLoading(true);
    var keyCount = Object.keys(value).length;
    var arr = [];

    for (const c in value) {
      let object = {};
      object.name = c;
      object.type = "additional_detail";
      object.value = value[c];
      arr.push(object);
    }

    if (selectedTags.length > 0) {
      selectedTags.map((value) => {
        let findObject = CustomerDetail.custom_fields.find(
          (val) => val.name == value
        );
        let object1 = { ...findObject };
        object1.name = value;
        object1.value = true;
        object1.type = "tag";

        arr.push(object1);
      });
    }
    let obj = {
      custom_fields: arr,
    };
    const edit = await dispatch(UpdateCustomer(obj, props.match.params.id));
    if (edit) {
      setLoading(false);
      history.push("/customers");
    }
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setselectedTags(nextSelectedTags);
  };

  const dataSource = [];
  let associatedRegisterName = [];
  if (Object.keys(CustomerDetail).length !== 0) {
    let registerList = getItem("setupCache")?.register
      ? getItem("setupCache")?.register
      : [];
    CustomerDetail.recent_receipts.map((value) => {
      let allredyPush = associatedRegisterName.find(
        (val) => val._id == value.register_id
      );

      let registerInfo = registerList.find(
        (val) => val._id == value.register_id
      );
      if (registerInfo && allredyPush == undefined) {
        associatedRegisterName.push(registerInfo);
      }
      const { _id, receipt_number, created_at } = value;

      return dataSource.push({
        created_at: created_at,
        receipt_number: (
          <NavLink to={"/receipts/" + _id[0]}>
            <span className="receipt-color">{receipt_number}</span>
          </NavLink>
        ),
      });
    });
  }

  const columns = [
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at, record) => (
        <span>
          {commonFunction.convertToDate(record.created_at, "MMM DD, Y, h:mm A")}
        </span>
      ),
    },
    {
      title: "Receipts",
      dataIndex: "receipt_number",
      key: "receipt_number",
    },
  ];

  return (
    <>
      <Main>
        {CustomerDetail != "" ? (
          <>
            <PageHeader
              ghost
              className="comman-custom-pageheader"
              title={
                <Tabs
                  type="card"
                  activeKey={activeTab}
                  size="small"
                  onChange={changeTab}
                >
                  <TabPane
                    tab="Customer Details"
                    key="DETAIL"
                    className="ant-tabs-tab-active"
                  ></TabPane>
                  <TabPane tab="Customer Orders" key="ORDER_DETAIL"></TabPane>

                  {Object.keys(CustomerDetail).length !== 0 &&
                  CustomerDetail.custom_fields.length !== 0 ? (
                    <TabPane
                      tab="Additional Detail"
                      key="ADDITIONAL_DETAIL"
                    ></TabPane>
                  ) : (
                    ""
                  )}
                </Tabs>
              }
            />
            {activeTab === "DETAIL" ? (
              <Cards
                title={
                  <div className="setting-card-title">
                    <Heading as="h4">Customer Details</Heading>
                    {Object.keys(CustomerDetail).length !== 0 ? (
                      <span>
                        Created At{" "}
                        {commonFunction.convertToDate(
                          CustomerDetail.created_at,
                          "MMM DD, Y h:mm A"
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                }
              >
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={14} sm={18} xs={24}>
                    {Object.keys(CustomerDetail).length !== 0 ? (
                      <Form
                        autoComplete="off"
                        style={{ width: "100%" }}
                        form={form}
                        name="editProduct"
                        onFinish={handleSubmit}
                        className="comman-input"
                      >
                        <Form.Item
                          name="name"
                          label="Cutomer Name"
                          initialValue={CustomerDetail.name}
                          rules={[
                            {
                              max: 50,
                              message:
                                "Customer Name cannot be more than 50 characters long.",
                            },
                          ]}
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            placeholder="Customer Name"
                          />
                        </Form.Item>
                        <Form.Item
                          name="mobile"
                          label="Customer Mobile"
                          initialValue={CustomerDetail.mobile}
                          rules={[
                            {
                              message: "Please enter customer mobile number",
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            disabled={true}
                            placeholder="Customer Number"
                          />
                        </Form.Item>

                        <Form.Item
                          name="email"
                          label="Customer Email"
                          initialValue={CustomerDetail.email}
                          rules={[
                            {
                              message: "Please enter valid email",
                              type: "email",
                            },
                          ]}
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            placeholder="Customer Email"
                          />
                        </Form.Item>
                        <Form.Item
                          name="shipping_address"
                          label="Shipping Address"
                          initialValue={CustomerDetail.shipping_address}
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            placeholder="Street Address"
                          />
                        </Form.Item>

                        <Form.Item
                          name="city"
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 12px)",
                          }}
                          label="City"
                          initialValue={CustomerDetail.city}
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            placeholder="City"
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
                          initialValue={CustomerDetail.zipcode}
                        >
                          <Input
                            type="number"
                            style={{ marginBottom: 6 }}
                            placeholder="Zipcode"
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                        <div
                          className="add-form-action"
                          style={{ float: "right", marginTop: 15 }}
                        >
                          <Button
                            className="btn-cancel btn-custom"
                            size="medium"
                            style={{ marginRight: 10 }}
                            onClick={() =>
                              history.push("/customers", {
                                currentPage_data: location.state.current_page,
                                sizeOf_data: location.state.size_data,
                              })
                            }
                          >
                            Go Back
                          </Button>
                          <Button
                            size="medium"
                            className="btn-custom"
                            htmlType="submit"
                            type="primary"
                            raised
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
                        </div>
                      </Form>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Cards>
            ) : (
              ""
            )}

            {activeTab === "ORDER_DETAIL" ? (
              <Cards
                title={
                  <div className="setting-card-title">
                    <Heading as="h4"> Order Details</Heading>

                    <span>
                      Last Seen At{" "}
                      {CustomerDetail.last_seen == ""
                        ? "-"
                        : commonFunction.convertToDate(
                            CustomerDetail.last_seen,
                            "MMM DD, Y, h:mm A"
                          )}
                    </span>
                  </div>
                }
              >
                <Row>
                  <Col xxl={12} md={12} sm={12} xs={24}>
                    {Object.keys(CustomerDetail).length !== 0 ? (
                      <Form
                        style={{ width: "100%" }}
                        form={form}
                        name="editProduct"
                        onFinish={handleSubmit}
                        className="comman-input"
                      >
                        <Form.Item
                          name="name"
                          className="custome-label"
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 12px)",
                          }}
                          label="Order Count"
                        >
                          <Tag className="custome-tag">
                            {" "}
                            {CustomerDetail.order_value}
                          </Tag>
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
                          name="name"
                          className="custome-label"
                          label="Order Value"
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 12px)",
                          }}
                        >
                          <Tag className="custome-tag">
                            {rsSymbol}
                            {Number(CustomerDetail.order_count).toFixed(2)}
                          </Tag>
                        </Form.Item>

                        <Form.Item
                          name="associated_name"
                          className="custome-label"
                          label="Associated Registers"
                        >
                          {associatedRegisterName?.length > 0
                            ? associatedRegisterName.map((val) => {
                                return (
                                  <Tag className="custome-tag">
                                    {val.register_name}
                                  </Tag>
                                );
                              })
                            : "-"}
                        </Form.Item>

                        <Form.Item
                          name="last_purchase"
                          label="Last Purchase"
                          className="custome-label"
                        >
                          {CustomerDetail.last_purchase
                            ? CustomerDetail.last_purchase.map((val) => (
                                <Tag
                                  className="custome-tag"
                                  style={{ marginBottom: "10px" }}
                                >
                                  {val.item}
                                </Tag>
                              ))
                            : "-"}
                        </Form.Item>
                        <label></label>
                      </Form>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col xxl={12} md={12} sm={12} xs={24}>
                    <Form.Item
                      name="name"
                      className="custome-table"
                      label="Recent Receipts"
                    >
                      <Table
                        dataSource={dataSource}
                        columns={columns}
                        size="small"
                        style={{ marginTop: "8px" }}
                        pagination={{
                          pageSize: 5,
                          total: dataSource.length,
                        }}
                        rowClassName="invoice-table"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Cards>
            ) : (
              ""
            )}

            {activeTab === "ADDITIONAL_DETAIL" ? (
              <Cards
                title={
                  <div className="setting-card-title">
                    <Heading as="h4">Addional Details</Heading>
                    <span>Update addditional details and custom tags.</span>
                  </div>
                }
              >
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={14} sm={18} xs={24}>
                    {Object.keys(CustomerDetail).length !== 0 ? (
                      <Form
                        style={{ width: "100%" }}
                        form={form}
                        name="editProduct"
                        onFinish={handleSubmitAdditional}
                      >
                        {CustomerDetail.custom_fields.map((field, index, i) =>
                          field.type === "additional_detail" ? (
                            <Form.Item
                              name={field.name}
                              label={field.name}
                              initialValue={field.value}
                              className="comman-input"
                            >
                              <Input
                                style={{ marginBottom: 6 }}
                                placeholder={field.name}
                              />
                            </Form.Item>
                          ) : (
                            ""
                          )
                        )}

                        {isTag && (
                          <>
                            <h3 style={{ marginTop: 20 }}>Customer Tags</h3>
                          </>
                        )}
                        <div style={{ display: "flex" }}>
                          {CustomerDetail.custom_fields.map((field, index, i) =>
                            field.type === "tag" ? (
                              <>
                                <Form.Item>
                                  <CheckableTag
                                    className={field.tag_color}
                                    style={{
                                      border: "1px solid " + field.tag_color,
                                      color: field.tag_color,
                                    }}
                                    key={field.name}
                                    checked={
                                      selectedTags.indexOf(field.name) > -1
                                    }
                                    onChange={(checked) =>
                                      handleChange(field.name, checked)
                                    }
                                  >
                                    {field.name}
                                  </CheckableTag>
                                </Form.Item>
                              </>
                            ) : (
                              ""
                            )
                          )}
                        </div>
                        <div
                          className="add-form-action"
                          style={{ float: "right", marginTop: "10px" }}
                        >
                          <Button
                            className="btn-cancel btn-custom"
                            size="medium"
                            style={{ marginRight: 10 }}
                            onClick={() =>
                              history.push("/customers", {
                                currentPage_data: location.state.current_page,
                                sizeOf_data: location.state.size_data,
                              })
                            }
                          >
                            Go Back
                          </Button>
                          <Button
                            size="medium"
                            className="btn-custom"
                            htmlType="submit"
                            type="primary"
                            raised
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
                        </div>
                      </Form>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Cards>
            ) : (
              ""
            )}
          </>
        ) : (
          <Spin
            style={{
              color: "#BD025D",
              position: "absolute",
              marginLeft: "48%",
              marginTop: "21%",
              transform: "translate(-50%,-50%)",
            }}
          />
        )}
      </Main>
    </>
  );
};

export default EditCustomer;
