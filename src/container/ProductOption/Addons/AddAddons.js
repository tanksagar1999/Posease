import React, { useState } from "react";
import { Row, Col, Form, Input, message, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import { AddProductForm } from "../../Product/Style";
import "../option.css";
import {
  AddAddonBulk,
  getAllAddonList,
} from "../../../redux/addon/actionCreator";
import { getItem } from "../../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const AddAddon = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  let [isDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData) => {
    setLoading(true);
    setDisabled(true);
    const Obj = {};
    Obj.addon_name = formData.addon_name;
    Obj.sort_order = formData.sort_order;
    Obj.price = formData.price;

    const dataSource = [Obj];
    if (formData.addon && formData.addon.length > 0) {
      dataSource.push(...formData.addon);
    }
    const getAddons = await dispatch(AddAddonBulk(dataSource));
    if (!getAddons.AddonData.error) {
      let list = await dispatch(getAllAddonList());
      if (list) {
        setLoading(false);
        history.push("/product-options?type=addon");
      }
    }
  };

  const fileList = [
    {
      uid: "1",
      name: "1.png",
      status: "done",
      url: "",
      thumbUrl: "",
    },
  ];

  const fileUploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
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

  let checkValidFiledorNot = (allFileds) => {
    return allFileds.find((val, index) => {
      if (
        val.name[val.name.length - 1] == "addon_name" &&
        (val.value == undefined || val.value == "" || val.errors.length > 0)
      ) {
        return true;
      } else if (
        val.name[val.name.length - 1] == "price" &&
        (val.value == undefined || val.value == "" || val.errors.length > 0)
      ) {
        return true;
      } else {
        return false;
      }
    });
  };
  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    let filedsList = allFileds;
    if (item[0].name.length == 1 && item[0].name[0] == "addon") {
      filedsList = filedsList.slice(0, filedsList.length - 4);
    }
    filedsList.splice(-1);

    if (checkValidFiledorNot(filedsList)) {
      setDisabled(true);
      return true;
    } else {
      setDisabled(false);
      return true;
    }
  };
  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards headless>
          <Form
            autoComplete="off"
            size="large"
            onFinish={handleSubmit}
            onFieldsChange={(val, allFileds) =>
              handleFormChange(val, allFileds)
            }
          >
            <AddProductForm style={{ margin: 0 }}>
              <Row>
                <Col xs={24} xl={8} className="gutter-box">
                  <Form.Item
                    label="Addon Name"
                    name="addon_name"
                    rules={[
                      {
                        min: 3,
                        message:
                          "Addon name must be at least 3 characters long.",
                      },
                      {
                        max: 60,
                        message:
                          "Addon name cannot be more than 60 characters long.",
                      },
                      { required: true, message: "Addon Name Required" },
                      {
                        validator: (v, value) => {
                          let allSetupcache = getItem("setupCache");
                          if (allSetupcache && allSetupcache.productAddon) {
                            if (
                              allSetupcache.productAddon.find(
                                (val) =>
                                  val.addon_name.toLowerCase() ==
                                  value.toLowerCase()
                              )
                            ) {
                              return Promise.reject(
                                value + " already exist in product addon"
                              );
                            } else {
                              return Promise.resolve();
                            }
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Addon Name" className="input-text" />
                  </Form.Item>
                </Col>
                <Space></Space>

                <Col xs={24} xl={7} className="gutter-box">
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      {
                        pattern: new RegExp(
                          /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                        ),
                        message: "Addon price should be a positive number.",
                      },
                      {
                        required: true,
                        message: "Addon price should be a positive number.",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      initialValue={0}
                      className="input-text"
                      placeholder="Price"
                      onKeyPress={(event) => {
                        if (event.key.match("[0-9,.]+")) {
                          return true;
                        } else {
                          return event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={7} className="gutter-box">
                  <Form.Item label="Sort order" name="sort_order">
                    <Input
                      placeholder="Sort Order (Optional)"
                      type="number"
                      className="input-text"
                      onKeyPress={(event) => {
                        if (event.key.match("[0-9]+")) {
                          return true;
                        } else {
                          return event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={2} className="gutter-box"></Col>
              </Row>
              <Form.List name="addon">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row key={field.key}>
                        <Col xs={24} xl={8} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "addon_name"]}
                            fieldKey={[field.fieldKey, "addon_name"]}
                            rules={[
                              {
                                min: 3,
                                message:
                                  "Addon name must be at least 3 characters long.",
                              },
                              {
                                required: true,
                                message: "Addon Name Required",
                              },
                              {
                                validator: (v, value) => {
                                  let allSetupcache = getItem("setupCache");
                                  if (
                                    allSetupcache &&
                                    allSetupcache.productAddon
                                  ) {
                                    if (
                                      allSetupcache.productAddon.find(
                                        (val) =>
                                          val.addon_name.toLowerCase() ==
                                          value.toLowerCase()
                                      )
                                    ) {
                                      return Promise.reject(
                                        value +
                                          " already exist in product addon"
                                      );
                                    } else {
                                      return Promise.resolve();
                                    }
                                  } else {
                                    return Promise.resolve();
                                  }
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="Addon Name"
                              className="input-text"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={7} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "price"]}
                            fieldKey={[field.fieldKey, "price"]}
                            rules={[
                              {
                                pattern: new RegExp(
                                  /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                                ),
                                message:
                                  "Addon price should be a positive number.",
                              },
                              { required: true, message: "Price Required" },
                            ]}
                          >
                            <Input
                              min={0}
                              step="any"
                              type="number"
                              initialValue={0}
                              placeholder="Price"
                              className="input-text"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={7} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "sort_order"]}
                            fieldKey={[field.fieldKey, "sort_order"]}
                          >
                            <Input
                              placeholder="Sort Order (Optional)"
                              min={0}
                              initialValue={0}
                              type="number"
                              className="input-text"
                              // style={{ width: "90px" }}
                              onKeyPress={(event) => {
                                if (event.key.match("[0-9]+")) {
                                  return true;
                                } else {
                                  return event.preventDefault();
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={2} className="gutter-box">
                          <Form.Item {...field} className="action-class">
                            <DeleteOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                    <div style={{ marginLeft: 9 }}>
                      <Form.Item>
                        <Button
                          type="primary"
                          info
                          disabled={isDisabled}
                          style={{ marginBottom: 10 }}
                          size="medium"
                          onClick={() => {
                            add();
                            setDisabled(true);
                          }}
                          icon={<PlusOutlined />}
                        >
                          Add Addon
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <NavLink to="/product-options?type=addon">
                          <Button size="medium" style={{ marginRight: 10 }}>
                            Go Back
                          </Button>
                        </NavLink>

                        <Button
                          type="primary"
                          info
                          htmlType="submit"
                          size="medium"
                        >
                          {loading ? (
                            <Spin
                              indicator={
                                <LoadingOutlined
                                  style={{
                                    fontSize: 16,
                                    color: "white",
                                    margin: "0px 15px",
                                  }}
                                  spin
                                />
                              }
                            />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>
            </AddProductForm>
          </Form>
        </Cards>
      </Main>
    </>
  );
};

export default AddAddon;
