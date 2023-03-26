import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Checkbox, Row, Col, Input, Form, TreeSelect } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { AccountWrapper } from "../style";
import "../../setting.css";
import {
  addOrUpdateTaxesGroup,
  getTaxGroupById,
  getTaxGroupList,
} from "../../../../../redux/taxGroup/actionCreator";
import { getAllTaxesList } from "../../../../../redux/taxes/actionCreator";
import _ from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const AddTaxGroup = ({ match }) => {
  const [form] = Form.useForm();
  const [TaxNameList, setTaxNameList] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  let isMounted = useRef(true);
  const [TaxGroupData, setTaxGroupData] = useState();
  const [treeData, setTreeData] = useState([]);
  const [treevalues, setValues] = useState([]);
  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTaxGroupData() {
      if (location.state) {
        const getTaxGroupData = await dispatch(
          getTaxGroupById(location.state.tax_group_id)
        );
        if (isMounted.current) setTaxGroupData(getTaxGroupData.taxGroupIdData);
      }
    }
    async function fetchTaxName() {
      const getTaxNameList = await dispatch(getAllTaxesList("sell"));
      if (isMounted.current) setTaxNameList(getTaxNameList.taxesList);
    }
    if (isMounted.current) {
      fetchTaxName();
      fetchTaxGroupData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (TaxGroupData) {
      setValues(TaxGroupData.taxes);
      setDisabledSave(true);
      setApiData({
        tax_group_name: TaxGroupData.tax_group_name,
        taxes: TaxGroupData.taxes,
        taxes_inclusive_in_product_price: TaxGroupData.taxes_inclusive_in_product_price
          ? true
          : false,
      });
      form.setFieldsValue({
        tax_group_name: TaxGroupData.tax_group_name,
        taxes: TaxGroupData.taxes,
        taxes_inclusive_in_product_price: TaxGroupData.taxes_inclusive_in_product_price
          ? true
          : false,
      });
    }
    if (TaxNameList) {
      const data = [];
      if (TaxNameList.length)
        TaxNameList.map((value) => {
          let object = {};
          object.title = value.tax_name;
          object.value = value._id;
          object.key = value._id;
          data.push(object);
        });

      setTreeData(data);
    }
  }, [TaxGroupData, TaxNameList]);
  const handleSubmit = async (values) => {
    setLoading(true);
    let formData = {
      tax_group_name: values.tax_group_name,
      taxes: values.taxes,
      taxes_inclusive_in_product_price: values.taxes_inclusive_in_product_price,
    };
    let TaxesGroup_id =
      location && location.state ? location.state.tax_group_id : null;
    const getAddedTaxGroup = await dispatch(
      addOrUpdateTaxesGroup(formData, TaxesGroup_id)
    );
    if (
      getAddedTaxGroup &&
      getAddedTaxGroup.taxGroupData &&
      !getAddedTaxGroup.error
    ) {
      setLoading(false);
      const getAllTaxGroupList = await dispatch(getTaxGroupList());
      if (
        isMounted.current &&
        getAllTaxGroupList &&
        getAllTaxGroupList.taxGroupList
      ) {
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
          currentFormData[findData.name[0]] = findData.value;
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
                  name="tax_group_name"
                  label="Tax Group Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Tax group name must be at least 3 characters long",
                    },
                    {
                      max: 40,
                      message:
                        "Tax group name cannot be more than 40 characters long.",
                    },
                    {
                      message: "Tax group name is required",
                      required: true,
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 10 }}
                    placeholder="Tax group name"
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item
                  name="taxes"
                  rules={[
                    {
                      message:
                        "Atleast one tax should be added to the tax group.",
                      required: true,
                    },
                  ]}
                  label="Select one or more taxes to add to this tax group"
                >
                  <TreeSelect
                    showSearch={true}
                    multiple
                    treeData={treeData}
                    value={treevalues}
                    onChange={setValues}
                    treeCheckable={true}
                    placeholder="Please select Tax"
                    filterTreeNode={(search, item) => {
                      return (
                        item.title
                          .toLowerCase()
                          .indexOf(search.toLowerCase()) >= 0
                      );
                    }}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="taxes_inclusive_in_product_price"
                  valuePropName="checked"
                >
                  <Checkbox className="add-form-check">
                    Taxes inclusive in product price
                  </Checkbox>
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() =>
                      history.push(`/settings/taxes?type=${match.params.type}`)
                    }
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
      </AccountWrapper>
    </>
  );
};

export { AddTaxGroup };
