import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Input, Form } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import { AccountWrapper } from "../style";
import "../../setting.css";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import {
  addOrUpdateTaxes,
  getTaxesById,
  getAllTaxesList,
} from "../../../../../redux/taxes/actionCreator";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import _ from "lodash";
const AddTax = ({ match }) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState();
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [TaxesData, setTaxesData] = useState();
  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTaxesData() {
      if (location.state) {
        const getTaxesData = await dispatch(
          getTaxesById(location.state.taxes_id)
        );
        if (isMounted.current) setTaxesData(getTaxesData.taxesIdData);
      }
    }
    if (isMounted.current) {
      fetchTaxesData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (TaxesData) {
      setState({
        ...state,
        TaxesData,
      });
      setDisabledSave(true);
      setApiData({
        tax_name: TaxesData.tax_name,
        tax_percentage: TaxesData.tax_percentage,
      });
      form.setFieldsValue({
        tax_name: TaxesData.tax_name,
        tax_percentage: TaxesData.tax_percentage,
      });
    }
  }, [TaxesData]);
  const handleSubmit = async (formData) => {
    <Spin />;
    setLoading(true);
    setState({ ...state, submitValues: formData });
    let Taxes_id = location && location.state ? location.state.taxes_id : null;
    const getAddTaxes = await dispatch(addOrUpdateTaxes(formData, Taxes_id));
    if (getAddTaxes && getAddTaxes.taxesData && !getAddTaxes.taxesData.error) {
      let getallTax = await dispatch(getAllTaxesList());
      if (!getallTax.error) {
        setLoading(false);
        history.push(`/settings/taxes?type=${match.params.type}`);
      }
    }
  };
  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    if (apiData) {
      let currentFormData = {};
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          currentFormData[findData.name[0]] =
            findData.name[0] == "tax_percentage"
              ? Number(findData.value)
              : findData.value;
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
      <AccountWrapper>
        <PageHeader ghost />
        <>
          <Cards
            marginTop={true}
            title={
              <div className="setting-card-title">
                <Heading as="h4">Setup Taxes and Tax Groups</Heading>
                <span>
                  Create separate taxes for different tax rates and types.
                </span>
                <span>
                  One or more taxes can be grouped under a tax group and applied
                  to products.
                </span>
              </div>
            }
          >
            <Form
              form={form}
              onFinish={handleSubmit}
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
            >
              <Row gutter={25} justify="center">
                <Col xxl={12} md={14} sm={18} xs={24}>
                  <Form.Item
                    name="tax_name"
                    label="Tax Name"
                    rules={[
                      {
                        min: 3,
                        message: "Tax name must be at least 3 characters long",
                      },
                      {
                        max: 40,
                        message:
                          "Tax name cannot be more than 40 characters long.",
                      },
                      {
                        required: true,
                        message: "Tax name is required.",
                      },
                    ]}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Tax name"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="tax_percentage"
                    label="Tax Percent"
                    rules={[
                      {
                        pattern: new RegExp(
                          /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                        ),
                        message: "Tax pecentage cannot be negative",
                      },
                      {
                        required: true,
                        message: "Tax percentage is required.",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      style={{ marginBottom: 10 }}
                      placeholder="Tax percentage"
                      autoComplete="off"
                      onKeyPress={(event) => {
                        if (event.key.match("[0-9,.]+")) {
                          return true;
                        } else {
                          return event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item style={{ float: "right" }}>
                    <Button
                      className="go-back-button"
                      size="medium"
                      type="white"
                      style={{ marginRight: "10px" }}
                      onClick={() => history.push("/settings/taxes")}
                    >
                      Go Back
                    </Button>
                    <Button
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
                </Col>
              </Row>
            </Form>
          </Cards>
        </>
      </AccountWrapper>
    </>
  );
};

export { AddTax };
