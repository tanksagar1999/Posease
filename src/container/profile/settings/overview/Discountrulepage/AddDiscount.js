import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Checkbox,
  Row,
  Col,
  Input,
  Form,
  Select,
  Tabs,
  DatePicker,
  Tooltip,
  TreeSelect,
  message,
  TimePicker,
} from "antd";
import moment from "moment";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import { AccountWrapper } from "../style";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "../../setting.css";
import { getAllRegisterNameList } from "../../../../../redux/pricebook/actionCreator";
import { useDispatch } from "react-redux";
import {
  addOrUpdateDiscountRules,
  getAllDiscountRulesList,
} from "../../../../../redux/discountRules/actionCreator";
import {
  getAllProductList,
  getAllCategoriesList,
} from "../../../../../redux/products/actionCreator";
import _ from "lodash";
import { useHistory } from "react-router-dom";
const { TabPane } = Tabs;

const AddDiscount = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [ProductListData, setProductListData] = useState([]);
  const [CategoryListData, setCategoryListData] = useState([]);
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [treeData, setTreeData] = useState([]);
  const [treevalues, setValues] = useState([]);
  const [EndDateCheckbox, setEndDateCheckbox] = useState();
  const [Hours, setHours] = useState();
  const [Day, setDay] = useState([]);
  const [DiscountType, setDiscountType] = useState();
  const [Level, setLevel] = useState();
  const [DateString, setDateString] = useState(new Date());
  const [EndDate, setEndDate] = useState();
  const [time, setTime] = useState();
  const [DaysTreeData, setDaysTreeData] = useState([]);
  const [TreeProduct, setTreeProduct] = useState([]);
  const [treevaluesProduct, setValuesProduct] = useState([]);
  const [TreeProductCategory, setTreeProductCategory] = useState([]);
  const [treevaluesProductCategory, setValuesProductCategory] = useState([]);
  const [PerCheckbox, setPerCheckbox] = useState(false);
  const [Automatically, setAutomatically] = useState(false);
  let [activeTab, changeTab] = useState("DETAIL");
  const [discountId, setDiscountId] = useState(null);
  const history = useHistory();
  const { SHOW_PARENT } = TreeSelect;
  const { Option } = Select;
  const [AllFormData, setFormData] = useState({});
  let days = [
    { value: "Sunday" },
    { value: "Monday" },
    { value: "Tuesday" },
    { value: "Wednesday" },
    { value: "Thursday" },
    { value: "Friday" },
    { value: "Saturday" },
  ];

  useEffect(() => {
    if (days && Object.keys(days).length > 0) {
      const data = [];
      const initialValues = [];
      let object1 = {
        title: "All Days",
        value: "0-0",
        key: "0-0",
        children: [],
      };

      days.map((data) => {
        let obj2 = {};
        obj2.title = data.value;
        obj2.value = data.value;
        obj2.key = data.value;
        object1["children"].push(obj2);
        initialValues.push(data.value);
      });
      object1.value = [...initialValues];
      data.push(object1);
      setDaysTreeData(data);
    }
  }, [RegisterNameList]);

  const initialValues = [];
  useEffect(() => {
    if (RegisterNameList && Object.keys(RegisterNameList).length > 0) {
      const data = [];

      let object1 = {
        title: "All Register",
        value: "0-0",
        key: "0-0",
        children: [],
      };

      RegisterNameList.map((value) => {
        let obj2 = {};
        obj2.title = value.register_name;
        obj2.value = value._id;
        obj2.key = value._id;
        object1["children"].push(obj2);
        initialValues.push(value._id);
      });
      object1.value = [...initialValues];
      data.push(object1);
      setTreeData(data);
    }
  }, [RegisterNameList]);
  useEffect(() => {
    if (ProductListData && Object.keys(ProductListData).length > 0) {
      const data = [];
      const initialValues = [];
      let object1 = {
        title: "All Products",
        value: "0-0",
        key: "0-0",
        children: [],
      };
      ProductListData.map((value) => {
        let obj2 = {};
        obj2.title = value.product_name;
        obj2.value = value._id;
        obj2.key = value._id;
        object1["children"].push(obj2);
        initialValues.push(value._id);
      });
      object1.value = [...initialValues];
      data.push(object1);
      setTreeProduct(data);
    }
  }, [ProductListData]);
  useEffect(() => {
    form1.setFieldsValue({
      days_of_week: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    });
  }, []);

  useEffect(() => {
    if (CategoryListData && Object.keys(CategoryListData).length > 0) {
      const data = [];
      const initialValues = [];
      let object1 = {
        title: "All Categories",
        value: "0-0",
        key: "0-0",
        children: [],
      };
      CategoryListData.map((value) => {
        let obj2 = {};
        obj2.title = value.category_name;
        obj2.value = value._id;
        obj2.key = value._id;
        object1["children"].push(obj2);
        initialValues.push(value._id);
      });
      object1.value = [...initialValues];
      data.push(object1);
      setTreeProductCategory(data);
    }
  }, [CategoryListData]);

  useEffect(() => {
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterNameList());
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.registerNameList);
    }
    async function fetchProductList() {
      const getProductList = await dispatch(getAllProductList());
      if (isMounted.current && getProductList && getProductList.productList)
        setProductListData(getProductList.productList);
    }
    async function fetchCategoryList() {
      const getCategoryList = await dispatch(getAllCategoriesList());
      if (isMounted.current && getCategoryList && getCategoryList.categoryList)
        setCategoryListData(getCategoryList.categoryList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchProductList();
      fetchCategoryList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmitDiscount = async (formData) => {
    if (formData.registers) {
      var first = _.first(formData.registers);
      if (Array.isArray(first)) {
        formData.registers = first;
      }
    }
    setFormData({ ...AllFormData, ...formData });

    setDiscountId(true);

    changeTab("VISIBILITY");
  };

  const handleSubmitDiscountVisibility = async (formData) => {
    if (discountId === null) {
      message.success({
        content: "Please Enter Discount Rule Details",
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
    } else {
      if (formData.days_of_week) {
        var first = _.first(formData.days_of_week);
        if (Array.isArray(first)) {
          formData.days_of_week = first;
        }
      }
      formData.apply_automatically = Automatically;
      Hours && (formData.happy_hours_time = time);
      formData.start_date = DateString ? DateString : new Date();
      formData.end_date = EndDate;
      setFormData({ ...AllFormData, ...formData });
      changeTab("ADDITIONAL");
      // }
    }
  };

  const handleSubmitDiscountAdditional = async (formData) => {
    formData.apply_discount_only_once_per_order = PerCheckbox;
    if (formData.buy_products) {
      var first = _.first(formData.buy_products);
      if (Array.isArray(first)) {
        formData.buy_products = first;
      }
    }
    if (formData.buy_categories) {
      var first = _.first(formData.buy_categories);
      if (Array.isArray(first)) {
        formData.buy_categories = first;
      }
    }
    if (formData.get_categories) {
      var first = _.first(formData.get_categories);
      if (Array.isArray(first)) {
        formData.get_categories = first;
      }
    }

    if (formData.get_products) {
      var first = _.first(formData.get_products);
      if (Array.isArray(first)) {
        formData.get_products = first;
      }
    }

    let FinalFormData = {
      ...AllFormData,
      ...formData,
    };

    const getAddedDiscountRules = await dispatch(
      addOrUpdateDiscountRules(FinalFormData)
    );
    if (
      getAddedDiscountRules &&
      getAddedDiscountRules.DiscountRulesData &&
      !getAddedDiscountRules.DiscountRulesData.error
    ) {
      const getDiscountRulesList = await dispatch(getAllDiscountRulesList());
      if (getDiscountRulesList && getDiscountRulesList.DiscountRulesList) {
        history.push("/settings/discount-rules");
      }
    }
  };
  return (
    <>
      <AccountWrapper>
        <PageHeader
          ghost
          title={
            <Tabs
              type="card"
              activeKey={activeTab}
              size="small"
              onChange={changeTab}
            >
              <TabPane
                tab="Discount Rule Details"
                key="DETAIL"
                className="ant-tabs-tab-active"
              ></TabPane>
              <TabPane tab="Discount Visibility" key="VISIBILITY"></TabPane>
              {DiscountType ? (
                <TabPane tab="Discount Conditions" key="ADDITIONAL"></TabPane>
              ) : (
                ""
              )}
            </Tabs>
          }
        />
        {activeTab === "DETAIL" ? (
          <Form onFinish={handleSubmitDiscount} form={form} name="addDiscount">
            <Cards
              title={
                <div className="setting-card-title">
                  <Heading as="h4">Discount Rule Details</Heading>
                  <span>
                    Choose the type of discount rule you want to create.
                    Discount rules are identified by a unique coupon code.
                  </span>
                </div>
              }
            >
              <Row gutter={25} justify="center">
                <Col xxl={12} md={14} sm={18} xs={24}>
                  <Form.Item
                    name="coupon_code"
                    label="Coupon Code"
                    rules={[
                      {
                        required: true,
                        message: "Coupon code is required.",
                      },
                    ]}
                    tooltip={{
                      title:
                        "A coupon code is a unique identifier for a discount rule,eg FLAT50",
                      icon: (
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                      ),
                    }}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Discount coupon code"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="discount_type"
                    label="Discount Type"
                    className="plac_set"
                    rules={[
                      {
                        required: true,
                        message: "Discount rule type is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder={
                        <div style={{ marginTop: "5px", height: "1px" }}>
                          Select Type
                        </div>
                      }
                      onChange={(values) => {
                        setDiscountType(values);
                      }}
                    >
                      <Option value="fixed_amount">Fixed Amount</Option>
                      <Option value="percentage">Percentage</Option>
                      <Option value="buy_x_get_y">Buy X get Y</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="level"
                    label="Level"
                    className="plac_set"
                    rules={[
                      {
                        required: true,
                        message: "Level is required is required.",
                      },
                    ]}
                    tooltip={{
                      title:
                        "Order level discount is applied as a bulk discount on the whole order. Product level discounts are applied only to applicable products.",
                      icon: (
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                      ),
                    }}
                  >
                    {DiscountType == "buy_x_get_y" ? (
                      <Select
                        style={{ width: "100%" }}
                        placeholder={
                          <div style={{ marginTop: "5px", height: "1px" }}>
                            Select a level
                          </div>
                        }
                        onChange={(values) => {
                          setLevel(values);
                        }}
                      >
                        <Option value="product">Product</Option>
                      </Select>
                    ) : (
                      <Select
                        style={{ width: "100%" }}
                        placeholder={
                          <div style={{ marginTop: "5px", height: "1px" }}>
                            Select a level
                          </div>
                        }
                        onChange={(values) => {
                          setLevel(values);
                        }}
                      >
                        <Option value="order">Order</Option>
                        <Option value="product">Product</Option>
                      </Select>
                    )}
                  </Form.Item>
                  {RegisterNameList.length ? (
                    <Form.Item
                      name="registers"
                      label="Please select no of register"
                      initialValue={initialValues}
                    >
                      <TreeSelect
                        showSearch={true}
                        multiple
                        treeData={treeData}
                        treeDefaultExpandAll
                        value={treevalues}
                        onChange={setValues}
                        showCheckedStrategy={SHOW_PARENT}
                        treeCheckable={true}
                        placeholder="Please select Register"
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
                  ) : (
                    ""
                  )}

                  <Form.Item style={{ float: "right" }}>
                    <NavLink to="/settings/discount-rules">
                      <Button
                        className="go-back-button"
                        size="medium"
                        type="white"
                        style={{ marginRight: "10px" }}
                      >
                        Go Back
                      </Button>
                    </NavLink>
                    <Button type="primary" htmlType="submit">
                      Next
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Cards>
          </Form>
        ) : (
          ""
        )}
        {activeTab === "VISIBILITY" ? (
          <Form
            onFinish={handleSubmitDiscountVisibility}
            form={form1}
            name="addDiscount_visibility"
          >
            <Cards
              title={
                <div className="setting-card-title">
                  <Heading as="h4">Discount Visibility</Heading>
                  <span>
                    Set the time period when the discount rule is active. Two
                    column layout for start and end date.
                  </span>
                </div>
              }
            >
              <Row gutter={25} justify="center">
                <Col xxl={12} md={14} sm={18} xs={24}>
                  <Form.Item label="Start Date">
                    <DatePicker
                      style={{ height: "35px", marginBottom: "10px" }}
                      value={moment(DateString, "LL")}
                      placeholder=""
                      onChange={(date, string) => setDateString(date)}
                      format="LL"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Checkbox
                      className="add-form-check"
                      onChange={(e) => setEndDateCheckbox(e.target.checked)}
                    >
                      Set End Date{" "}
                    </Checkbox>

                    {EndDateCheckbox === true ? (
                      <div>
                        <br></br>
                        <DatePicker
                          style={{ height: "35px" }}
                          placeholder="End date"
                          onChange={(date, string) => setEndDate(date)}
                          format="LL"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <br></br>
                    <Checkbox
                      className="add-form-check"
                      onChange={(e) => setHours(e.target.checked)}
                    >
                      Set Happy Hours Time{" "}
                      <Tooltip title="Limi the discount rule to a particular time of the day">
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </Checkbox>
                    {Hours === true ? (
                      <div>
                        <br></br>
                        <Form.Item>
                          <TimePicker.RangePicker
                            use12Hours
                            format="h:mmA"
                            size="large"
                            onChange={(value, string) => {
                              setTime(`${string[0]}-${string[1]}`);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      ""
                    )}
                    <br></br>
                    <Form.Item
                      name="days_of_week"
                      label="Set Days Of Week"
                      tooltip={{
                        title:
                          "Limit the discount rule to particular days.When not set rule applies for all days.",
                        icon: (
                          <QuestionCircleOutlined
                            style={{ cursor: "pointer" }}
                          />
                        ),
                      }}
                    >
                      <TreeSelect
                        showSearch={true}
                        multiple
                        treeData={DaysTreeData}
                        treeDefaultExpandAll
                        value={Day}
                        showCheckedStrategy={SHOW_PARENT}
                        onChange={setDay}
                        treeCheckable={true}
                        filterTreeNode={(search, item) => {
                          return (
                            item.title
                              .toLowerCase()
                              .indexOf(search.toLowerCase()) >= 0
                          );
                        }}
                        placeholder="Set Days Of Week"
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <br></br>

                    <Checkbox
                      className="add-form-check"
                      checked={Automatically}
                      onChange={(e) => setAutomatically(e.target.checked)}
                    >
                      Apply the discount automatically{" "}
                      <Tooltip title="When enabled discounts will be automatically applied while billing . You can disable this if you want your customers to tell the coupon code and have the cashier enter it.">
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item style={{ float: "right", marginTop: "10px" }}>
                    <NavLink to="/settings/discount-rules">
                      <Button
                        className="go-back-button"
                        size="medium"
                        type="white"
                        style={{ marginRight: "10px" }}
                      >
                        Go Back
                      </Button>
                    </NavLink>

                    <Button type="primary" raised htmlType="submit">
                      Next
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Cards>
          </Form>
        ) : (
          ""
        )}
        {activeTab === "ADDITIONAL" ? (
          <Form
            onFinish={handleSubmitDiscountAdditional}
            form={form2}
            name="addDiscount_visibility"
          >
            <Cards
              title={
                <div className="setting-card-title">
                  <Heading as="h4">Discount Conditions</Heading>
                  <span>
                    Select the conditions required for the discount rule to be
                    applied
                  </span>
                </div>
              }
            >
              {DiscountType == "fixed_amount" ? (
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={14} sm={18} xs={24}>
                    <Form.Item
                      name="discount"
                      label="Discount Amount"
                      rules={[
                        {
                          pattern: new RegExp(
                            /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                          ),
                          message: "Discount amount be a positive number.",
                        },
                      ]}
                    >
                      <Input
                        style={{ marginBottom: 10 }}
                        type="number"
                        min={0}
                        step="any"
                        placeholder="Discount Amount"
                        autoComplete="off"
                        onKeyPress={(event) => {
                          if (event.key.match("[0-9]+")) {
                            return true;
                          } else {
                            return event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                    {Level == "order" ? (
                      <Form.Item
                        name="minimum_order"
                        label="Minimum Order Value"
                        rules={[
                          {
                            pattern: new RegExp(
                              /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                            ),
                            message:
                              "Minimum order value be a positive number.",
                          },
                          {},
                        ]}
                        tooltip={{
                          title:
                            "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                          icon: (
                            <QuestionCircleOutlined
                              style={{ cursor: "pointer" }}
                            />
                          ),
                        }}
                      >
                        <Input
                          style={{ marginBottom: 10 }}
                          type="number"
                          step="any"
                          min={0}
                          placeholder="Minimum Order Value (Option)"
                          autoComplete="off"
                          onKeyPress={(event) => {
                            if (event.key.match("[0-9]+")) {
                              return true;
                            } else {
                              return event.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    ) : (
                      ""
                    )}
                    {Level == "product" ? (
                      <>
                        {ProductListData.length ? (
                          <Form.Item
                            name="buy_products"
                            rules={[
                              {
                                required:
                                  treevaluesProductCategory.length > 0
                                    ? false
                                    : true,
                                message: "Please select no of products",
                              },
                            ]}
                            label="Selected Product"
                            tooltip={{
                              title:
                                "Discount will be applied only to these products.",
                              icon: (
                                <QuestionCircleOutlined
                                  style={{ cursor: "pointer" }}
                                />
                              ),
                            }}
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProduct}
                              treeDefaultExpandAll
                              value={treevaluesProduct}
                              onChange={setValuesProduct}
                              showCheckedStrategy={SHOW_PARENT}
                              treeCheckable={true}
                              filterTreeNode={(search, item) => {
                                return (
                                  item.title
                                    .toLowerCase()
                                    .indexOf(search.toLowerCase()) >= 0
                                );
                              }}
                              placeholder="Please select product"
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>
                        ) : (
                          ""
                        )}
                        {CategoryListData.length ? (
                          <Form.Item
                            name="buy_categories"
                            rules={[
                              {
                                required:
                                  treevaluesProduct.length > 0 ? false : true,
                                message: "Please select no of Categories",
                              },
                            ]}
                            label="Selected Categories"
                            tooltip={{
                              title:
                                "Discount will be applied only to these categories.",
                              icon: (
                                <QuestionCircleOutlined
                                  style={{ cursor: "pointer" }}
                                />
                              ),
                            }}
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProductCategory}
                              treeDefaultExpandAll
                              showCheckedStrategy={SHOW_PARENT}
                              value={treevaluesProductCategory}
                              onChange={setValuesProductCategory}
                              treeCheckable={true}
                              placeholder="Please select product categories"
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
                        ) : (
                          ""
                        )}
                        <Form.Item
                          name="minimum_order"
                          label="Minimum Product Quantity"
                          rules={[
                            {
                              pattern: new RegExp(
                                /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                              ),
                              message:
                                "Minimum product quantity be a positive number.",
                            },
                          ]}
                          tooltip={{
                            title:
                              "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                            icon: (
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            ),
                          }}
                        >
                          <Input
                            style={{ marginBottom: 10 }}
                            type="number"
                            step="any"
                            placeholder="Minimum Order Value"
                            autoComplete="off"
                            min={0}
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              ) : (
                ""
              )}
              {DiscountType == "percentage" ? (
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={14} sm={18} xs={24}>
                    <Form.Item
                      name="discount"
                      label="Discount Percentage"
                      required
                      rules={[
                        {
                          pattern: new RegExp(
                            /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                          ),
                          message: "Discount percentage be a positive number.",
                        },
                      ]}
                    >
                      <Input
                        style={{ marginBottom: 10 }}
                        min={0}
                        max={100}
                        type="number"
                        step="any"
                        placeholder="Discount Percentage"
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
                    {Level == "order" ? (
                      <Form.Item
                        name="minimum_order"
                        label="Minimum Order Value"
                        required
                        rules={[
                          {
                            pattern: new RegExp(
                              /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                            ),
                            message:
                              "Minimum order value be a positive number.",
                          },
                        ]}
                        tooltip={{
                          title:
                            "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                          icon: (
                            <QuestionCircleOutlined
                              style={{ cursor: "pointer" }}
                            />
                          ),
                        }}
                      >
                        <Input
                          style={{ marginBottom: 10 }}
                          type="number"
                          step="any"
                          placeholder="Minimum Order Value"
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
                    ) : (
                      ""
                    )}
                    {Level == "product" ? (
                      <>
                        {ProductListData.length ? (
                          <Form.Item
                            name="buy_products"
                            rules={[
                              {
                                required:
                                  treevaluesProductCategory.length > 0
                                    ? false
                                    : true,
                                message: "Please select no of produscts",
                              },
                            ]}
                            label="Selected Product"
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProduct}
                              treeDefaultExpandAll
                              showCheckedStrategy={SHOW_PARENT}
                              value={treevaluesProduct}
                              onChange={setValuesProduct}
                              treeCheckable={true}
                              placeholder="Please select product"
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
                        ) : (
                          ""
                        )}
                        {CategoryListData.length ? (
                          <Form.Item
                            name="buy_categories"
                            rules={[
                              {
                                required:
                                  treevaluesProduct.length > 0 ? false : true,
                                message: "Please select no of Categories",
                              },
                            ]}
                            label="Selected Categories"
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProductCategory}
                              treeDefaultExpandAll
                              showCheckedStrategy={SHOW_PARENT}
                              value={treevaluesProductCategory}
                              onChange={setValuesProductCategory}
                              treeCheckable={true}
                              placeholder="Please select categories"
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
                        ) : (
                          ""
                        )}
                        <Form.Item
                          name="minimum_order"
                          label="Minimum Product Quantity"
                          rules={[
                            {
                              pattern: new RegExp(
                                /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                              ),
                              message:
                                "Minimum order value be a positive number.",
                            },
                          ]}
                          tooltip={{
                            title:
                              "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                            icon: (
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            ),
                          }}
                        >
                          <Input
                            style={{ marginBottom: 10 }}
                            type="number"
                            step="any"
                            placeholder="Minimum Order Value"
                            autoComplete="off"
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9,.]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                            min={0}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              ) : (
                ""
              )}
              {DiscountType == "buy_x_get_y" ? (
                <Row gutter={25} justify="center">
                  <Col xxl={12} md={14} sm={18} xs={24}>
                    {Level == "product" ? (
                      <>
                        <h1>Buy Conditions</h1>
                        <Form.Item
                          name="buy_quantity"
                          label="Buy Quantity"
                          required
                          tooltip={{
                            title:
                              "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                            icon: (
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            ),
                          }}
                        >
                          <Input
                            style={{ marginBottom: 10 }}
                            type="number"
                            placeholder="Buy Quantity"
                            autoComplete="off"
                            min={0}
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9,.]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                        {ProductListData.length ? (
                          <Form.Item
                            name="buy_products"
                            rules={[
                              {
                                required:
                                  treevaluesProductCategory.length > 0
                                    ? false
                                    : true,
                                message: "Please select no of products",
                              },
                            ]}
                            label="Selected Product"
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProduct}
                              treeDefaultExpandAll
                              showCheckedStrategy={SHOW_PARENT}
                              value={treevaluesProduct}
                              onChange={setValuesProduct}
                              treeCheckable={true}
                              filterTreeNode={(search, item) => {
                                return (
                                  item.title
                                    .toLowerCase()
                                    .indexOf(search.toLowerCase()) >= 0
                                );
                              }}
                              placeholder="Please select product"
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>
                        ) : (
                          ""
                        )}
                        {CategoryListData.length ? (
                          <Form.Item
                            name="buy_categories"
                            rules={[
                              {
                                required:
                                  treevaluesProduct.length > 0 ? false : true,
                                message: "Please select no of categories",
                              },
                            ]}
                            label="Selected Categories"
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProductCategory}
                              treeDefaultExpandAll
                              value={treevaluesProductCategory}
                              onChange={setValuesProductCategory}
                              treeCheckable={true}
                              showCheckedStrategy={SHOW_PARENT}
                              placeholder="Please select categories"
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
                        ) : (
                          ""
                        )}
                        <br></br>
                        <h1>Get Conditions</h1>
                        <Form.Item
                          name="get_quantity"
                          label="Get Quantity"
                          required
                          rules={[
                            {
                              pattern: new RegExp(
                                /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                              ),
                              message: "Get quantity be a positive number.",
                            },
                          ]}
                          tooltip={{
                            title:
                              "Discount will be applied when the sale vlue is equal to or more than the specified minimum order value.",
                            icon: (
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            ),
                          }}
                        >
                          <Input
                            style={{ marginBottom: 10 }}
                            type="number"
                            step="any"
                            placeholder="Minimum Order Value"
                            autoComplete="off"
                            min={0}
                            onKeyPress={(event) => {
                              if (event.key.match("[0-9,.]+")) {
                                return true;
                              } else {
                                return event.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                        {ProductListData.length ? (
                          <Form.Item
                            name="get_products"
                            rules={[
                              {
                                required:
                                  treevaluesProductCategory.length > 0
                                    ? false
                                    : true,
                                message: "Please select no of products",
                              },
                            ]}
                            label="Selected Product"
                          >
                            <TreeSelect
                              showSearch={true}
                              multiple
                              treeData={TreeProduct}
                              treeDefaultExpandAll
                              showCheckedStrategy={SHOW_PARENT}
                              value={treevaluesProduct}
                              onChange={setValuesProduct}
                              treeCheckable={true}
                              placeholder="Please select products"
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
                        ) : (
                          ""
                        )}
                        {CategoryListData.length ? (
                          <div>
                            <Form.Item
                              name="get_categories"
                              rules={[
                                {
                                  required:
                                    treevaluesProduct.length > 0 ? false : true,
                                  message: "Please select no of categories",
                                },
                              ]}
                              label="Selected Categories"
                            >
                              <TreeSelect
                                showSearch={true}
                                multiple
                                treeData={TreeProductCategory}
                                treeDefaultExpandAll
                                showCheckedStrategy={SHOW_PARENT}
                                value={treevaluesProductCategory}
                                onChange={setValuesProductCategory}
                                treeCheckable={true}
                                placeholder="Please select categories"
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
                            <Form.Item name="apply_discount_only_once_per_order">
                              <Checkbox
                                checked={PerCheckbox}
                                onChange={(e) =>
                                  setPerCheckbox(e.target.checked)
                                }
                              >
                                Apply discount only once per order
                              </Checkbox>
                            </Form.Item>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              ) : (
                ""
              )}
              <Form.Item style={{ float: "right" }}>
                <NavLink to="/settings/discount-rules">
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                  >
                    Go Back
                  </Button>
                </NavLink>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Cards>
          </Form>
        ) : (
          ""
        )}
        .
      </AccountWrapper>
    </>
  );
};

export { AddDiscount };
