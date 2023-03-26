import React, { useState } from "react";
import { Row, Col, Form, Input, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import { AddProductForm } from "../../Product/Style";
import "../option.css";
import {
  AddVariantBulk,
  getAllVariantList,
} from "../../../redux/variant/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { getItem } from "../../../utility/localStorageControl";

const AddVariant = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let [isDisabled, setDisabled] = useState(true);
  const [errForDupalicate, setErrForDupaicate] = useState();
  const [commit, setCommit] = useState("");
  let [name, setname] = useState(false);
  const [productVaraints, setProductVarnits] = useState(
    getItem("setupCache")?.productVariants
  );
  const [loading, setLoading] = useState(false);

  const handleErr = (varnitslength) => {
    if (productVaraints && productVaraints.length > 0) {
      let findProductVarniat = productVaraints.find(
        (val) =>
          val.variant_name.toLowerCase() == name.toLowerCase() &&
          val.comment.toLowerCase() == commit.toLowerCase()
      );

      if (findProductVarniat) {
        setErrForDupaicate("This variant name is already in use");
        return true;
      } else {
        setCommit("");
        setErrForDupaicate();
        // setProductVarnits([
        //   ...productVaraints,
        //   {
        //     variant_name: name,
        //     comment: commit,
        //   },
        // ]);
        return false;
      }
    } else {
      return false;
    }
  };
  const handleSubmit = async (formData) => {
    setLoading(true);
    setDisabled(true);
    const Obj = {};
    Obj.variant_name = formData.variant_name;
    Obj.comment = formData.comment;
    Obj.sort_order = formData.sort_order;
    Obj.price = formData.price;

    const dataSource = [Obj];
    if (formData.variants && formData.variants.length > 0) {
      dataSource.push(...formData.variants);
    }

    if (handleErr() == false) {
      const getVariants = await dispatch(AddVariantBulk(dataSource));

      if (!getVariants.variantData.error) {
        const list = await dispatch(getAllVariantList());
        if (list) {
          setLoading(false);
          history.push("/product-options?type=variant_list");
        }
      }
    }
  };

  let checkValidFiledorNot = (allFileds) => {
    return allFileds.find((val, index) => {
      if (
        val.name[val.name.length - 1] == "variant_name" &&
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
    setErrForDupaicate();
    let filedsList = allFileds;
    if (item[0].name.length == 1 && item[0].name[0] == "variants") {
      filedsList = filedsList.slice(0, filedsList.length - 5);
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
                <Col xs={24} xl={6} className="gutter-box">
                  <Form.Item
                    className="ant-form-item-no-colon"
                    label="Variant Name"
                    name="variant_name"
                    rules={[
                      {
                        min: 3,
                        message:
                          "Variant name must be at least 3 characters long.",
                      },
                      {
                        max: 60,
                        message:
                          "Variant name cannot be more than 60 characters long",
                      },
                      { required: true, message: "Variant name is required" },
                    ]}
                  >
                    <Input
                      placeholder="Variant Name"
                      className="input-text"
                      onChange={(e) => setname(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Space></Space>
                <Col xs={24} xl={6} className="gutter-box">
                  <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[
                      {
                        validator: (v, value) => {
                          if (productVaraints.length > 0) {
                            if (
                              productVaraints.find(
                                (val) =>
                                  val.variant_name.toLowerCase() ==
                                    name.toLowerCase() && val.comment == value
                              )
                            ) {
                              return Promise.reject(
                                "This variant name is already in use"
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
                      placeholder="Comment (Optional)"
                      className="input-text"
                      onChange={(e) => setCommit(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={4} className="gutter-box">
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      {
                        pattern: new RegExp(
                          /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                        ),
                        message: "Price should be a positive number.",
                      },
                      { required: true, message: "Variant price is required" },
                    ]}
                  >
                    <Input
                      type="number"
                      step="any"
                      min={0}
                      initialValue={0}
                      placeholder="Price"
                      className="input-text"
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
                <Col xs={24} xl={5} className="gutter-box">
                  <Form.Item label="Sort order" name="sort_order">
                    <Input
                      type="number"
                      min={0}
                      initialValue={0}
                      placeholder="Sort Order (Optional)"
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
                <Col xs={24} xl={2} className="gutter-box">
                  <Form.Item
                    label="Action"
                    className="action-class"
                  ></Form.Item>
                </Col>
              </Row>
              <Form.List name="variants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row key={field.key}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area ||
                            prevValues.sights !== curValues.sights
                          }
                        >
                          {() => (
                            <>
                              <Col xs={24} xl={6} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "variant_name"]}
                                  fieldKey={[field.fieldKey, "variant_name"]}
                                >
                                  <Input
                                    placeholder="Variant Name"
                                    className="input-text"
                                    onChange={(e) => setname(e.target.value)}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={6} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "comment"]}
                                  fieldKey={[field.fieldKey, "comment_name"]}
                                  rules={[
                                    {
                                      validator: (v, value) => {
                                        if (productVaraints.length > 0) {
                                          if (
                                            productVaraints.find(
                                              (val) =>
                                                val.variant_name.toLowerCase() ==
                                                  name.toLowerCase() &&
                                                val.comment == value
                                            )
                                          ) {
                                            return Promise.reject(
                                              "This variant name is already in use"
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
                                    placeholder="Comment (Optional)"
                                    className="input-text"
                                    onChange={(e) => setCommit(e.target.value)}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={4} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "price"]}
                                  fieldKey={[field.fieldKey, "price"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Price Required",
                                    },
                                  ]}
                                >
                                  <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    initialValue={0}
                                    placeholder="Price"
                                    className="input-text"
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
                              <Col xs={24} xl={5} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "sort_order"]}
                                  fieldKey={[field.fieldKey, "sort_order"]}
                                >
                                  <Input
                                    type="number"
                                    min={0}
                                    initialValue={0}
                                    placeholder="Sort Order (Optional)"
                                    className="input-text"
                                    style={{ width: "100%" }}
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
                                <Form.Item
                                  {...field}
                                  className="action-class"
                                  name="deleteIcon"
                                >
                                  <DeleteOutlined
                                    onClick={() => remove(field.name)}
                                  />
                                </Form.Item>
                              </Col>
                            </>
                          )}
                        </Form.Item>
                      </Row>
                    ))}

                    {errForDupalicate && (
                      <p style={{ color: "red" }}>{errForDupalicate}</p>
                    )}
                    <div style={{ marginLeft: 9 }}>
                      <Form.Item>
                        <Button
                          type="primary"
                          info
                          disabled={isDisabled}
                          style={{ marginBottom: 10 }}
                          size="medium"
                          onClick={() => {
                            if (handleErr() == false) {
                              add();
                              setDisabled(true);
                            }
                          }}
                          icon={<PlusOutlined />}
                        >
                          Add Variant
                        </Button>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          size="medium"
                          onClick={() =>
                            history.push("/product-options?type=variant_list")
                          }
                          style={{ marginRight: 10 }}
                        >
                          Go Back
                        </Button>
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

export default AddVariant;
