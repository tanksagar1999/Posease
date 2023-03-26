import React, { useState } from "react";
import { Form, Input, Select, Modal, DatePicker, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { exportSales } from "../../redux/receipts/actionCreator";
const Exportform = ({ modalVisible, setModelVisible, reportType }) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const { registerList } = useSelector(
    (state) => ({
      registerList: state.register.RegisterList,
    }),
    shallowEqual
  );
  let emailData = localStorage.getItem("email_id");
  const [form1] = Form.useForm();
  const [startdate, setstartdate] = useState();
  const [DateRanged, setDateRange] = useState("Today");
  const [mailsend, setmailSend] = useState(false);
  const [endDate, setenddate] = useState();
  const [loading, setLoading] = useState(false);
  const [noDataFound, setNodataFound] = useState(false);

  const submitExport = async (values) => {
    setLoading(true);
    values.reportType = reportType;
    if (DateRanged === "custom") {
      values.endDate = endDate;
      values.startDate = startdate;
      let response = await dispatch(exportSales(values));

      if (!response.error) {
        setLoading(false);
        setmailSend(true);
        if (response.messageCode == "NO_DATA_FOUND") {
          setNodataFound(true);
        }
      } else {
        setLoading(true);
        setModelVisible(false);
      }
    } else {
      let response = await dispatch(exportSales(values));

      if (!response.error) {
        setLoading(false);
        setmailSend(true);
        if (response.messageCode == "NO_DATA_FOUND") {
          setNodataFound(true);
        }
      } else {
        setLoading(true);
        setModelVisible(false);
      }
    }
  };
  return (
    <div>
      <Modal
        title="Request a Report"
        visible={modalVisible}
        // onOk={form1.submit}
        onCancel={() => setModelVisible(false)}
        footer={
          mailsend
            ? [
                <Button
                  type="primary"
                  onClick={() => {
                    setModelVisible(false);
                    setmailSend(false);
                    setDateRange("Today");
                    form1.resetFields();
                  }}
                >
                  Save
                </Button>,
              ]
            : [
                <Button
                  onClick={() => {
                    setModelVisible(false);
                    setLoading(false);
                  }}
                >
                  Cancel
                </Button>,
                <Button type="primary" onClick={form1.submit}>
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
                </Button>,
              ]
        }
        width={600}
      >
        <div>
          {mailsend ? (
            noDataFound ? (
              <p>no data</p>
            ) : (
              <p>
                The report will be emailed to you in about 5 to 10 minutes. You
                will be notified by email
              </p>
            )
          ) : (
            <Form
              style={{ width: "100%" }}
              name="Export"
              form={form1}
              onFinish={submitExport}
            >
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item
                    label="Choose Report Type"
                    name="category"
                    initialValue="sales"
                  >
                    <Select>
                      <Option value="sales">Sales report</Option>
                      <Option value="payment">Payment report</Option>
                      <Option value="daily">
                        Daily sales and payment report
                      </Option>
                      <Option value="product">Product wise sales report</Option>
                      {/* <Option value="shift">Shift open / close report</Option> */}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    initialValue="today"
                    label="Date Range"
                    name="dateRange"
                  >
                    <Select
                      name="report"
                      style={{ width: "100%" }}
                      onChange={(value) => setDateRange(value)}
                    >
                      <Option value="today">Today </Option>
                      <Option value="yesterday">Yesterday</Option>
                      <Option value="this_month">This Month</Option>
                      <Option value="last_month">Last Month</Option>
                      <Option value="custom">Custom selection</Option>
                    </Select>
                  </Form.Item>
                  {DateRanged === "custom" ? (
                    <div>
                      <Form.Item
                        label="start"
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 12px)",
                        }}
                      >
                        <DatePicker
                          style={{ height: "35px" }}
                          placeholder="dd-mm-yyyy"
                          format="DD/MM/YYYY"
                          onChange={(date, datestring) =>
                            setstartdate(datestring)
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label="end"
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 12px)",
                        }}
                      >
                        <DatePicker
                          onChange={(date, datestring) =>
                            setenddate(datestring)
                          }
                          style={{ height: "35px" }}
                          placeholder="dd-mm-yyyy"
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </div>
                  ) : (
                    ""
                  )}

                  <Form.Item
                    name="register"
                    label="Choose A Register"
                    initialValue="All"
                  >
                    <Select name="report" style={{ width: "100%" }}>
                      <Option value="All">All Registers </Option>
                      {registerList.map((data) => {
                        return (
                          <Option value={data._id}>{data.register_name}</Option>
                        );
                      })}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Send to Email Address"
                    initialValue={emailData}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email",
                      },
                      { type: "email", message: "A valid email is required" },
                    ]}
                  >
                    <Input placeholder="Report will be send to this email" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Exportform;
