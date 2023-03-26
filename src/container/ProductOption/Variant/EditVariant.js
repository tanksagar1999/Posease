import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Button } from "antd";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import {
  getVariantById,
  UpdateVariant,
  getAllVariantList,
} from "../../../redux/variant/actionCreator";
import _ from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { getItem } from "../../../utility/localStorageControl";

const EditVariant = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  let [variantdetail, setVariantData] = useState([]);
  const [disabledSave, setDisabledSave] = useState(false);
  const [errForDupalicate, setErrForDupaicate] = useState();
  const [apiData, setApiData] = useState();
  let [name, setname] = useState("");
  const [loading, setLoading] = useState(false);
  const [productVaraints, setProductVarnits] = useState(
    getItem("setupCache")?.productVariants
  );
  const handleErr = (formData) => {
    if (productVaraints && productVaraints.length > 0) {
      let findProductVarniat = productVaraints.find((val) => {
        if (
          variantdetail.variant_name.toLowerCase() ==
            formData.variant_name.toLowerCase() &&
          variantdetail.comment.toLowerCase() == formData.comment.toLowerCase()
        ) {
          return false;
        } else if (
          val.variant_name.toLowerCase() ==
            formData.variant_name.toLowerCase() &&
          val.comment.toLowerCase() == formData.comment.toLowerCase()
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (findProductVarniat) {
        setErrForDupaicate("This variant name is already in use");
        return true;
      } else {
        setErrForDupaicate();
        return false;
      }
    } else {
      return false;
    }
  };
  useEffect(() => {
    async function fetchVariant() {
      const getVariant = await dispatch(getVariantById(props.match.params.id));
      if (isMounted.current) setVariantData(getVariant);
    }
    if (isMounted.current) {
      fetchVariant();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (variantdetail) {
      setDisabledSave(true);
      setApiData({
        variant_name: variantdetail.variant_name,
        price: variantdetail.price,
        comment: variantdetail.comment,
        sort_order: variantdetail.sort_order ? variantdetail.sort_order : "",
      });
      form.setFieldsValue({
        variant_name: variantdetail.variant_name,
        price: variantdetail.price,
        comment: variantdetail.comment,
        sort_order: variantdetail.sort_order,
      });
    }
  }, [variantdetail]);

  const handleSubmit = async (values) => {
    setLoading(true);
    if (handleErr(values) == false) {
      const savedVariantDetails = await dispatch(
        UpdateVariant(values, props.match.params.id)
      );
      if (!savedVariantDetails.variantData.error) {
        let list = await dispatch(getAllVariantList());
        if (list) {
          setLoading(false);
          history.push("/product-options?type=variant");
        }
      }
    }
  };
  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    setErrForDupaicate();
    if (apiData) {
      let currentFormData = {};
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          if (findData.name[0] == "sort_order") {
            currentFormData[findData.name[0]] = findData.value
              ? findData.value
              : "";
          } else {
            currentFormData[findData.name[0]] = findData.value;
          }
        }
      });
      if (_.isEqual(apiData, currentFormData)) {
        setDisabledSave(true);
      } else {
        setDisabledSave(false);
      }
      return true;
    }
  };
  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Setup Variant</Heading>
              <span>Create product variants for sizes, flavours etc.</span>
              <span>
                For example, create variants Small, Medium & Large and group
                them under a variant group called Size.
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                autoComplete="off"
                form={form}
                onFinish={handleSubmit}
                onFieldsChange={(val, allFileds) =>
                  handleFormChange(val, allFileds)
                }
              >
                <Form.Item
                  name="variant_name"
                  label="Variant Name"
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
                    style={{ marginBottom: 10 }}
                    placeholder="Name"
                    onChange={(e) => setname(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Comment"
                  name="comment"
                  rules={[
                    {
                      validator: (v, value) => {
                        let allSetupcache = getItem("setupCache");
                        if (allSetupcache && allSetupcache.productVariants) {
                          let variantName = allSetupcache.productVariants.find(
                            (val) =>
                              val.variant_name.toLowerCase() ==
                                name.toLowerCase() &&
                              val.comment.toLowerCase() == value.toLowerCase()
                          );

                          if (
                            variantName &&
                            variantName.variant_name !=
                              variantdetail.variant_name
                            //    &&
                            // variantdetail.comment != variantName.comment
                          ) {
                            return Promise.reject(
                              value + " already exist in variant"
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
                  <Input placeholder="Comment" style={{ marginBottom: 10 }} />
                </Form.Item>
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
                    style={{ marginBottom: 10 }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9,.]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item name="sort_order" label="Sort Order">
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    style={{ marginBottom: 10 }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                {errForDupalicate && (
                  <p style={{ color: "red" }}>{errForDupalicate}</p>
                )}
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options">
                    <Button size="medium" style={{ marginRight: 10 }}>
                      Go Back
                    </Button>
                  </NavLink>
                  <Button
                    size="medium"
                    type="primary"
                    htmlType="submit"
                    disabled={disabledSave}
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
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default EditVariant;
