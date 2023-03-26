import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Badge,
  Table,
  Tabs,
  Card,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import {
  Main,
  BasicFormWrapper,
  UserTableStyleWrapper,
  TableWrapper,
} from "../../../styled";
import Heading from "../../../../components/heading/heading";
import { CSVLink, CSVDownload } from "react-csv";
import "../../../ProductOption/option.css";
import {
  ImportAddonInBulk,
  ConfirmAddonsImport,
} from "../../../../redux/pricebook/actionCreator";
import { getItem } from "../../../../utility/localStorageControl";
const { Option } = Select;
const { Dragger } = Upload;

const PriceBookImportAddons = () => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = useParams();

  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });

  const { TabPane } = Tabs;
  const [selectedFile, setFile] = useState();
  const [showPreview, setPreview] = React.useState(false);
  const [showMessage, setMessage] = React.useState(false);
  const [PreviewData, setPreviewData] = React.useState();
  const [importData, setImportData] = React.useState();
  const [PreviewHeader, setPreviewHeader] = React.useState();
  const [isDisabled, setDisabled] = useState(true);

  const csvData = [["Addon Name", "Price", "Sort Order"]];

  const handleupload = async (info) => {
    if (info.file.status === "uploading") {
      setDisabled(false);
      setFile(info.file.originFileObj);
    }
  };

  const handleSubmit = async (formData) => {
    let formdata = new FormData();
    formdata.append("csvfile", selectedFile);

    let savedimportfile = await dispatch(
      ImportAddonInBulk(formdata, queryParams.pricebook_id)
    );
    if (!savedimportfile.error) {
      setPreviewHeader(savedimportfile.PreviewList.data.headers);
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
    let savedconfirmImport = await dispatch(
      ConfirmAddonsImport(obj, queryParams.pricebook_id)
    );
    // if (!savedconfirmImport.error) {
    //   ;
    // }
  };

  const dataSource = [];
  if (showPreview === true) {
    if (PreviewData.length) {
      PreviewData.map((value) => {
        const { addon_name, price, sort_order } = value.record;
        const { isValid, errors, isExisting, isShow } = value;
        return dataSource.push({
          addon_name: addon_name,
          price: (
            <span>
              {rsSymbol}
              {price}
            </span>
          ),
          sort_order: sort_order,
          isValid: isValid,
          isExisting: isExisting,
          errors: errors,
          isShow: isShow,
        });
      });
    }
  }

  const columns = [
    {
      title: "Addon Name",
      dataIndex: "addon_name",
      key: "addon_name",
      render: (data, record) => (
        <p>{record.isShow === true ? record.addon_name : ""}</p>
      ),
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
      align: "center",
      render: (data, record) => (
        <p>{record.isShow === true ? record.sort_order : ""}</p>
      ),
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
              title="Import Addon"
              buttons={[
                <div key="1" className="page-header-actions">
                  <CSVLink
                    filename="Import-Addon-Template.csv"
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
                                      showUploadList={true}
                                      onChange={handleupload}
                                      customRequest={dummyRequest}
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
                                onClick={history.goBack}
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

export default PriceBookImportAddons;
