import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Upload,
  Button,
  Badge,
  Table,
  Tabs,
  Card,
} from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  Main,
  BasicFormWrapper,
  UserTableStyleWrapper,
  TableWrapper,
} from "../styled";
import Heading from "../../components/heading/heading";
import { CSVLink } from "react-csv";
import {
  ImportCustomerInBulk,
  ConfirmImport,
} from "../../redux/customer/actionCreator";

const { Dragger } = Upload;

const ImportCustomer = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();

  const { TabPane } = Tabs;
  const [selectedFile, setFile] = useState();
  const [showPreview, setPreview] = React.useState(false);
  const [showMessage, setMessage] = React.useState(false);
  const [PreviewData, setPreviewData] = React.useState();
  const [importData, setImportData] = React.useState();

  const [isDisabled, setDisabled] = useState(true);

  const csvData = [
    ["Mobile Number", "Name", "Email", "Street Address", "City", "Zipcode"],
  ];

  const handleupload = async (info) => {
    if (info.file.status === "uploading") {
      setDisabled(false);
      setFile(info.file.originFileObj);
      return true;
    }
  };

  const handleSubmit = async (formData) => {
    let formdata = new FormData();
    formdata.append("csvfile", selectedFile);
    let savedimportfile = await dispatch(ImportCustomerInBulk(formdata));
    if (savedimportfile && !savedimportfile.error) {
      setPreviewData(savedimportfile.PreviewList.data.preview);
      setImportData(savedimportfile.PreviewList.data);
      setPreview(true);
    }
  };

  const handleImport = async (formData) => {
    setMessage(true);
    let obj = {};
    obj.email = formData.email;
    obj.previewData = PreviewData;
    await dispatch(ConfirmImport(obj));
  };

  const dataSource = [];
  if (showPreview === true) {
    if (PreviewData.length) {
      PreviewData.map((value) => {
        const { name, mobile, email, address, city, zipcode } = value.record;
        const { isValid, errors, isExisting } = value;
        return dataSource.push({
          name: name,
          mobile: mobile,
          email: email,
          address: address,
          city: city,
          zipcode: zipcode,
          isValid: isValid,
          isExisting: isExisting,
          errors: errors,
        });
      });
    }
  }

  const columns = [
    {
      title: "Customer Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (data, record) => <p>{record.mobile}</p>,
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (data, record) => <p>{record.name}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (data, record) => (
        <p>{record.isShow === true ? record.email : ""}</p>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (data, record) => <p>{record.city}</p>,
    },
    {
      title: "Street Address",
      dataIndex: "address",
      key: "address",
      render: (data, record) => <p>{record.address}</p>,
    },
    {
      title: "Zipcode",
      dataIndex: "zipcode",
      key: "zipcode",
      render: (data, record) => <p>{record.zipcode}</p>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (data, record) => (
        <>
          {record.isValid === true && record.isExisting === true ? (
            <Badge status="processing" text="Update" />
          ) : (
            ""
          )}

          {record.isValid === true && record.isExisting === false ? (
            <Badge status="success" text="Create" />
          ) : (
            ""
          )}
          {record.isValid === false ? (
            <Badge
              status="error"
              text={
                record["errors"].length
                  ? record["errors"].map((value) => (
                      <>
                        <span key={value}>{value}</span>
                        <br></br>
                      </>
                    ))
                  : ""
              }
            />
          ) : (
            ""
          )}
        </>
      ),
    },
  ];
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  return (
    <>
      <Main>
        {showMessage === false ? (
          showPreview === false ? (
            <PageHeader
              className="comman-other-custom-pageheader"
              ghost
              title="Import Customer"
              buttons={[
                <div key="1" className="page-header-actions">
                  <CSVLink
                    filename="Import-customer-Template.csv"
                    data={csvData}
                    className="ant-btn ant-btn-white ant-btn-md"
                  >
                    Download CSV template
                  </CSVLink>
                </div>,
              ]}
            />
          ) : (
            <PageHeader
              className="preview-header"
              ghost
              title={
                <Tabs type="card" size="small" className="tab-custom-import">
                  <TabPane
                    tab="preview"
                    key="PREVIEW"
                    className="ant-tabs-tab-active"
                  ></TabPane>
                </Tabs>
              }
              buttons={[
                <>
                  <span style={{ marginRight: 10 }}>
                    <Badge status="success" text="Create" />
                    <span style={{ fontSize: 14 }}>
                      ({importData.total_create})
                    </span>
                  </span>
                  <span style={{ marginRight: 10 }}>
                    <Badge status="processing" text="Update" />
                    <span style={{ fontSize: 14 }}>
                      ({importData.total_update})
                    </span>
                  </span>
                  <span style={{ marginRight: 10 }}>
                    <Badge status="error" text="Ignore" />
                    <span style={{ fontSize: 14 }}>
                      ({importData.total_errors})
                    </span>
                  </span>
                </>,
              ]}
            />
          )
        ) : (
          <PageHeader className="comman-other-custom-pageheader" ghost />
        )}
        <Row gutter={15}>
          <Col xs={24}>
            {showMessage === false ? (
              showPreview === false ? (
                <Card headless>
                  <Row gutter={25} justify="center">
                    <Col xxl={24} md={24} sm={24} xs={24}>
                      <Form
                        style={{ width: "100%" }}
                        form={form}
                        name="importProduct"
                        onFinish={handleSubmit}
                      >
                        <BasicFormWrapper>
                          <div className="add-product-block">
                            <Row gutter={15}>
                              <Col xs={24}>
                                <div className="add-product-content">
                                  <Card title="" headless>
                                    <Dragger
                                      name="file"
                                      multiple={true}
                                      customRequest={dummyRequest}
                                      // headers={{
                                      //   authorization: "authorization-text",
                                      // }}
                                      showUploadList={true}
                                      onChange={handleupload}
                                    >
                                      <p className="ant-upload-drag-icon">
                                        <FeatherIcon icon="upload" size={50} />
                                      </p>
                                      <Heading
                                        as="h4"
                                        className="ant-upload-text"
                                      >
                                        Drag and drop a CSV here
                                      </Heading>
                                      <p className="ant-upload-hint">
                                        or <span>Browse</span> to choose a file
                                      </p>
                                    </Dragger>
                                  </Card>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div
                            className="add-form-action"
                            style={{ float: "left", marginLeft: 24 }}
                          >
                            <Form.Item>
                              <Button
                                style={{ marginRight: 10 }}
                                className="btn-cancel"
                                size="large"
                                onClick={() => history.push("/customers")}
                              >
                                Go Back
                              </Button>
                              <Button
                                size="large"
                                disabled={isDisabled}
                                htmlType="submit"
                                type="primary"
                                raised
                              >
                                Preview Import
                              </Button>
                            </Form.Item>
                          </div>
                        </BasicFormWrapper>
                      </Form>
                    </Col>
                  </Row>
                </Card>
              ) : (
                <Card headless className="import-table-card">
                  <UserTableStyleWrapper>
                    <div className="contact-table">
                      <TableWrapper className="table-responsive">
                        <Table
                          rowKey="id"
                          size="small"
                          dataSource={dataSource}
                          columns={columns}
                          fixed={true}
                          scroll={{ x: 800 }}
                          pagination={true}
                        />
                      </TableWrapper>
                    </div>
                  </UserTableStyleWrapper>
                  <Form form={form} name="importData" onFinish={handleImport}>
                    <Form.Item
                      label="Send Email Notification To"
                      name="email"
                      initialValue={localStorage.getItem("email_id")}
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 12px)",
                      }}
                      rules={[
                        {
                          message: "Email is required!",
                          required: true,
                          type: "email",
                        },
                        {
                          message: "Please enter valid email address.",
                          type: "email",
                        },
                      ]}
                    >
                      <Input
                        placeholder="name@example.com"
                        autoComplete="off"
                        style={{ marginBottom: 10 }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        style={{ marginRight: 10 }}
                        className="btn-cancel"
                        size="large"
                        onClick={() => {
                          setPreview(false);
                        }}
                      >
                        Go Back
                      </Button>
                      <Button
                        size="large"
                        htmlType="submit"
                        type="primary"
                        raised
                      >
                        Confirm Import
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              )
            ) : (
              ""
            )}
            {showMessage === true ? (
              <Card headless className="message-class">
                <div>
                  <p>
                    {" "}
                    It would take about 5 to 10 minutes to import and you will
                    be notified by email. Reload your browser after the import
                    completes.
                  </p>
                </div>
              </Card>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default ImportCustomer;
