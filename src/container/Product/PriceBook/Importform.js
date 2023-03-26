import React, { useState } from "react";
import { Row, Col, Form, Select, Upload, message } from "antd";
import { NavLink } from "react-router-dom";
import { StepBackwardOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main, BasicFormWrapper } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import Heading from "../../../components/heading/heading";
import { CSVLink } from "react-csv";
import "../product.css";

const { Dragger } = Upload;

const ImportPriceBook = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });

  const csvData = [
    ["Name", "Price", "Disabled"],
    ["test", "20", "no"],
  ];

  const fileList = [];

  const fileUploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      //  if(info.type == )
      const { status } = info.file;
      if (status !== "uploading") {
        setState({ ...state, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileList,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  const handleSubmit = (values) => {
    setState({ ...state, submitValues: values });
  };

  return (
    <>
      <Main>
        <PageHeader
          ghost
          title="Import Price Book"
          buttons={[
            <div key="1" className="page-header-actions">
              <CSVLink
                data={csvData}
                className="ant-btn ant-btn-white ant-btn-md"
              >
                Download CSV template
              </CSVLink>
              <NavLink
                to="/admin/products/pricebook"
                className="ant-btn ant-btn-primary ant-btn-md"
              >
                <StepBackwardOutlined />
                Back
              </NavLink>
            </div>,
          ]}
        />
        <Row gutter={15}>
          <Col xs={24}>
            <Cards headless>
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
                              <Cards title="">
                                <Dragger {...fileUploadProps}>
                                  <p className="ant-upload-drag-icon">
                                    <FeatherIcon icon="upload" size={50} />
                                  </p>
                                  <Heading as="h4" className="ant-upload-text">
                                    Drag and drop a CSV here
                                  </Heading>
                                  <p className="ant-upload-hint">
                                    or <span>Browse</span> to choose a file
                                  </p>
                                </Dragger>
                              </Cards>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="add-form-action">
                        <Form.Item style={{ float: "right" }}>
                          <Button
                            className="btn-cancel"
                            size="large"
                            onClick={() => {
                              return form.resetFields();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="md"
                            htmlType="submit"
                            type="primary"
                            raised
                          >
                            Save
                          </Button>
                        </Form.Item>
                      </div>
                    </BasicFormWrapper>
                  </Form>
                </Col>
              </Row>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default ImportPriceBook;
