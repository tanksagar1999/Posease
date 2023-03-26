import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import "../option.css";
import Heading from "../../../components/heading/heading";
import {
  geAddonById,
  UpdateAddon,
  getAllAddonList,
} from "../../../redux/addon/actionCreator";
import _ from "lodash";
import { getItem } from "../../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const EditAddon = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  let [addondetail, setAddonData] = useState([]);
  const [disabledSave, setDisabledSave] = useState(false);
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchAddon() {
      const getAddon = await dispatch(geAddonById(props.match.params.id));
      if (isMounted.current) setAddonData(getAddon);
    }
    if (isMounted.current) {
      fetchAddon();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (addondetail) {
      setDisabledSave(true);
      setApiData({
        addon_name: addondetail.addon_name,
        price: addondetail.price,
        sort_order: addondetail.sort_order ? addondetail.sort_order : "",
      });
      form.setFieldsValue({
        addon_name: addondetail.addon_name,
        price: addondetail.price,
        sort_order: addondetail.sort_order,
      });
    }
  }, [addondetail]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const savedAddonDetails = await dispatch(
      UpdateAddon(values, props.match.params.id)
    );

    if (savedAddonDetails) {
      let list = await dispatch(getAllAddonList());
      if (list) {
        setLoading(false);
        history.push("/product-options?type=addon");
      }
    }
  };
  const handleFormChange = (allFileds) => {
    setLoading(false);
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
              <Heading as="h4">Addon Details</Heading>
              <span>
                Create product addons like toppings, group using addon groups
                and attach to products.{" "}
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
                  name="addon_name"
                  label="Addon Name"
                  rules={[
                    {
                      min: 3,
                      message: "Addon name must be at least 3 characters long.",
                    },
                    { required: true, message: "Addon name required" },
                    {
                      validator: (v, value) => {
                        let allSetupcache = getItem("setupCache");
                        if (allSetupcache && allSetupcache.productAddon) {
                          let addonName = allSetupcache.productAddon.find(
                            (val) =>
                              val.addon_name.toLowerCase() ==
                              value.toLowerCase()
                          );
                          if (
                            addonName &&
                            addonName.addon_name != addondetail.addon_name
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
                  <Input style={{ marginBottom: 10 }} />
                </Form.Item>
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
                    style={{ marginBottom: 10 }}
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

                <Form.Item name="sort_order" label="Sort Order">
                  <Input
                    type="number"
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
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options?type=addon">
                    <Button
                      type="default"
                      info
                      size="medium"
                      style={{ marginRight: 10 }}
                    >
                      Go Back
                    </Button>
                  </NavLink>
                  <Button
                    type="primary"
                    size="medium"
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

export default EditAddon;
