import React, { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
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
  TimePicker,
  Modal,
  Switch,
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
  getDiscountRulesById,
  getAllDiscountRulesList,
} from "../../../../../redux/discountRules/actionCreator";
import {
  getAllProductList,
  getAllCategoriesList,
} from "../../../../../redux/products/actionCreator";

import { useHistory } from "react-router-dom";
import commonFunction from "../../../../../utility/commonFunctions";
import _ from "lodash";

const EditDiscount = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { TabPane } = Tabs;
  const { Option } = Select;
  const [form2] = Form.useForm();
  const queryParams = useParams();
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [ProductListData, setProductListData] = useState([]);
  const [CategoryListData, setCategoryListData] = useState([]);
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [modalVisibleCancle, setModelVisibleCancle] = useState(false);

  const [treeData, setTreeData] = useState([]);
  const [treevalues, setValues] = useState([]);
  const [EndDateCheckbox, setEndDateCheckbox] = useState();
  const [Hours, setHours] = useState();
  const [Day, setDay] = useState();
  const [DiscountType, setDiscountType] = useState();
  const [Level, setLevel] = useState();
  const [DiscountRulesData, setDiscountRulesData] = useState();
  const [DateString, setDateString] = useState();
  const [EndDate, setEndDate] = useState();
  const [time, setTime] = useState();
  const [TreeProduct, setTreeProduct] = useState([]);
  const [treevaluesProduct, setValuesProduct] = useState([]);
  const [TreeProductCategory, setTreeProductCategory] = useState([]);
  const [treevaluesProductCategory, setValuesProductCategory] = useState([]);
  const [PerCheckbox, setPerCheckbox] = useState(false);
  const [Automatically, setAutomatically] = useState(false);
  let [activeTab, changeTab] = useState("DETAIL");
  const [Switchdata, setSwitchdata] = useState();
  const [status, setstatus] = useState();
  const { SHOW_PARENT } = TreeSelect;
  const [showstartdate, setshowstartdate] = useState();
  const [showsEndDate, setshowEndDate] = useState();
  const [DaysTreeData, setDaysTreeData] = useState([]);
  const [showTime, setShowTime] = useState([]);
  const [AllFormData, setFormData] = useState({});

  const history = useHistory();
  const DisableEntry = async () => {
    if (queryParams._id) {
      let Obj = { status: status === "disable" ? "enable" : "disable" };

      const getDisable = await dispatch(
        addOrUpdateDiscountRules(Obj, queryParams._id)
      );
      if (
        getDisable &&
        getDisable.DiscountRulesData &&
        !getDisable.DiscountRulesData.error
      ) {
        getDisable.DiscountRulesData.status === "enable"
          ? setSwitchdata(true)
          : setSwitchdata(false);
        setstatus(getDisable.DiscountRulesData.status);
        setModelVisibleCancle(false);
      }
    }
  };

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

  useEffect(() => {
    if (RegisterNameList && Object.keys(RegisterNameList).length > 0) {
      const data = [];
      const initialValues = [];
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
    if (DiscountRulesData) {
      let time = DiscountRulesData.happy_hours_time
        ? DiscountRulesData.happy_hours_time
        : "";
      setShowTime(time.split("-"));
      setDiscountType(DiscountRulesData.discount_type);
      setshowstartdate(
        commonFunction.convertToDate(DiscountRulesData.start_date, "LL")
      );
      setshowEndDate(
        commonFunction.convertToDate(DiscountRulesData.end_date, "LL")
      );
      setLevel(DiscountRulesData.level);

      form.setFieldsValue({
        coupon_code: DiscountRulesData.coupon_code,
        discount_type: DiscountRulesData.discount_type,
        level: DiscountRulesData.level,
        registers: DiscountRulesData.registers,
        days_of_week: DiscountRulesData.days_of_week,
        buy_products: DiscountRulesData.buy_products
          ? DiscountRulesData.buy_products
          : "",
        buy_categories: DiscountRulesData.buy_categories
          ? DiscountRulesData.buy_categories
          : "",
        get_products: DiscountRulesData.get_products
          ? DiscountRulesData.get_products
          : "",
        get_categories: DiscountRulesData.get_categories
          ? DiscountRulesData.get_categories
          : "",
        discount: DiscountRulesData.discount,
        minimum_order: DiscountRulesData.minimum_order,
        buy_quantity: DiscountRulesData.buy_quantity,
        get_quantity: DiscountRulesData.get_quantity,
        happy_hours_time: DiscountRulesData.happy_hours_time
          ? setHours(true)
          : "",
        end_date: DiscountRulesData.end_date ? setEndDateCheckbox(true) : "",
        apply_discount_only_once_per_order: DiscountRulesData.apply_discount_only_once_per_order
          ? setPerCheckbox(true)
          : setPerCheckbox(false),
        apply_automatically: DiscountRulesData.apply_automatically
          ? setAutomatically(true)
          : "",
      });
      form1.setFieldsValue({
        days_of_week: DiscountRulesData.days_of_week,

        happy_hours_time: DiscountRulesData.happy_hours_time
          ? setHours(true)
          : "",
        end_date: DiscountRulesData.end_date ? setEndDateCheckbox(true) : "",

        apply_automatically: DiscountRulesData.apply_automatically
          ? setAutomatically(true)
          : "",
      });
      form2.setFieldsValue({
        buy_products: DiscountRulesData.buy_products
          ? DiscountRulesData.buy_products
          : "",
        buy_categories: DiscountRulesData.buy_categories
          ? DiscountRulesData.buy_categories
          : "",
        get_products: DiscountRulesData.get_products
          ? DiscountRulesData.get_products
          : "",
        get_categories: DiscountRulesData.get_categories
          ? DiscountRulesData.get_categories
          : "",
        discount: DiscountRulesData.discount,
        minimum_order: DiscountRulesData.minimum_order,
        buy_quantity: DiscountRulesData.buy_quantity,
        get_quantity: DiscountRulesData.get_quantity,

        apply_discount_only_once_per_order: DiscountRulesData.apply_discount_only_once_per_order
          ? setPerCheckbox(true)
          : setPerCheckbox(false),
      });
    }
  }, [DiscountRulesData]);

  useEffect(() => {
    async function fetchDiscountRulesData() {
      if (queryParams._id) {
        const getDiscountRulesData = await dispatch(
          getDiscountRulesById(queryParams._id)
        );
        if (isMounted.current)
          getDiscountRulesData.DiscountRulesIdData.status === "disable"
            ? setSwitchdata(false)
            : setSwitchdata(true);
        setstatus(getDiscountRulesData.DiscountRulesIdData.status);
        setDiscountRulesData(getDiscountRulesData.DiscountRulesIdData);
      }
    }
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
      fetchDiscountRulesData();
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
    changeTab("VISIBILITY");
  };

  const handleSubmitDiscountVisibility = async (formData) => {
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

    // const getAddedDiscountRules = await dispatch(
    //   addOrUpdateDiscountRules(formData, queryParams._id)
    // );
    // if (
    //   getAddedDiscountRules &&
    //   getAddedDiscountRules.DiscountRulesData &&
    //   !getAddedDiscountRules.DiscountRulesData.error
    // ) {
    changeTab("ADDITIONAL");
    // }
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
      addOrUpdateDiscountRules(FinalFormData, queryParams._id)
    );
    if (
      getAddedDiscountRules &&
      getAddedDiscountRules.DiscountRulesData &&
      !getAddedDiscountRules.DiscountRulesData.error
    ) {
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
                    rules={[
                      {
                        required: true,
                        message: "Discount rule type is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Type"
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
                        placeholder="Select a level"
                        onChange={(values) => {
                          setLevel(values);
                        }}
                      >
                        <Option value="product">Product</Option>
                      </Select>
                    ) : (
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select a level"
                        onChange={(values) => {
                          setLevel(values);
                        }}
                      >
                        <Option value="order">Order</Option>
                        <Option value="product">Product</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Modal
                    title={
                      status === "enable"
                        ? "Disable Discount Rule"
                        : "Enable Discount Rule"
                    }
                    okText={status === "enable" ? "Disable" : "Enable"}
                    visible={modalVisibleCancle}
                    onOk={DisableEntry}
                    onCancel={() => setModelVisibleCancle(false)}
                    width={600}
                  >
                    <p>
                      Are you sure you want to{" "}
                      {status === "enable" ? "disable" : "enable"} this discount
                      rule?
                    </p>
                  </Modal>
                  {RegisterNameList.length ? (
                    <Form.Item
                      name="registers"
                      label="Please select no of register"
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
                  <p style={{ marginTop: "10px" }}>
                    Is discount rules {"   "}
                    <Switch
                      style={{ marginLeft: "10px" }}
                      checked={Switchdata}
                      onClick={() => setModelVisibleCancle(true)}
                    ></Switch>
                  </p>

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
                      defaultValue={moment(showstartdate, "LL")}
                      placeholder=""
                      onChange={(date, string) => setDateString(date)}
                      format="LL"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Checkbox
                      className="add-form-check"
                      checked={EndDateCheckbox}
                      onChange={(e) => setEndDateCheckbox(e.target.checked)}
                    >
                      Set End Date{" "}
                    </Checkbox>

                    {EndDateCheckbox === true ? (
                      <div>
                        <br></br>
                        <DatePicker
                          style={{ height: "35px" }}
                          placeholder=""
                          defaultValue={moment(showsEndDate, "LL")}
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
                      checked={Hours}
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
                            defaultValue={
                              showTime.length > 1
                                ? [
                                    moment(showTime[0], "h:mmA"),
                                    moment(showTime[1], "h:mmA"),
                                  ]
                                : ""
                            }
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
                  </Form.Item>{" "}
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
                          min={0}
                          placeholder="Minimum Order Value (Option)"
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
                              if (event.key.match("[0-9,.]+")) {
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
                        placeholder="Discount Amount"
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
                              if (event.key.match("[0-9]+")) {
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
      </AccountWrapper>
    </>
  );
};

export { EditDiscount };
