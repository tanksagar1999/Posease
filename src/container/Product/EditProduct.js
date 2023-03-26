import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  Tooltip,
  Tabs,
  TreeSelect,
  Button,
} from "antd";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main, BasicFormWrapper } from "../styled";
import { AddProductForm } from "../Product/Style";
import { InfoCircleFilled } from "@ant-design/icons";
import {
  getProductById,
  getAllCategoriesList,
  updateProductById,
  getAllProductList,
} from "../../redux/products/actionCreator";
import { getTaxGroupList } from "../../redux/taxGroup/actionCreator";
import { getAllVariantGroupList } from "../../redux/variantGroup/actionCreator";
import { getAllAddonGroupList } from "../../redux/AddonGroup/actionCreator";
import { getAllRegisterNameList } from "../../redux/pricebook/actionCreator";
import { getAllItemGroupList } from "../../redux/ItemGroup/actionCreator";
import "./product.css";
import { getItem } from "../../utility/localStorageControl";
const { TabPane } = Tabs;
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const EditProduct = () => {
  const [form] = Form.useForm();
  const queryParams = useParams();
  const dispatch = useDispatch();
  const { SHOW_PARENT } = TreeSelect;
  const history = useHistory();
  let isMounted = useRef(true);
  let [productData, setProductData] = useState({});
  let [productCategoryList, setProductCategoryList] = useState([]);
  let [taxGroupList, setTaxGroupList] = useState([]);
  let [variantGroupList, setVariantGroupList] = useState([]);
  let [addonGroupList, setAddonGroupList] = useState([]);
  let [registerListData, setRegisterList] = useState([]);
  let [showRegular, setRegular] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [treevalues, setValues] = useState([]);
  let [activeTab, changeTab] = useState("1");
  const [loading, setLoading] = useState(false);

  let { itemGroupList } = useSelector(
    (state) => ({
      itemGroupList: state.itemGroup.itemGroupList,
    }),
    shallowEqual
  );
  const [totalIds, setTotalId] = useState([]);
  useEffect(() => {
    dispatch(getAllItemGroupList("sell"));
  }, []);

  useEffect(() => {
    let titledata = [];
    if (registerListData && Object.keys(registerListData).length > 0) {
      const data = [];
      const initialValues = [];
      let object1 = {
        title: "All Register",
        value: "0-0",
        key: "0-0",
        children: [],
      };

      registerListData.map((value) => {
        titledata.push({
          title: value.register_name,
          value: value._id,
        });
        let obj2 = {};
        obj2.title = value.register_name;
        obj2.value = value._id;
        obj2.key = value._id;
        object1["children"].push(obj2);
        initialValues.push(value._id);
      });
      object1.value = [...initialValues];
      data.push(object1);
      setTotalId(initialValues);
      setTreeData(titledata);
    }

    if (Object.keys(productData).length) {
      let register = "";
      if (productData.limit_to_register.length > 0) {
        let ids = [];
        productData.limit_to_register.map((val) => {
          let register = registerListData.find((value) => value._id == val);
          if (register) {
            ids.push(register._id);
          }
        });
        if (ids.length > 0) {
          register = ids;
        } else {
          const data = [];
          registerListData.map((value) => {
            data.push(value._id);
          });
          register = data;
        }
      } else {
        const data = [];
        registerListData.map((value) => {
          data.push(value._id);
        });
        register = data;
      }

      setValues(register);
      productData.option_status === "combo"
        ? setRegular(false)
        : setRegular(true);
      form.setFieldsValue({
        product_name: productData.product_name,
        product_category: productData.product_category,
        tax_group: productData.tax_group,
        price: productData.price,
        sort_order: productData.sort_order,
        option_status: productData.option_status,
        option_variant_group: productData.option_variant_group,
        option_addon_group: productData.option_addon_group,
        option_item_group: productData.option_item_group,
        unit_of_measure: productData.unit_of_measure,
        product_code: productData.product_code,
        notes: productData.notes,
        limit_to_register: register,
      });
    }
  }, [productData, registerListData]);

  async function fetchProduct() {
    const getProduct = await dispatch(getProductById(queryParams.product_id));
    if (isMounted.current && getProduct && getProduct.product)
      setProductData(getProduct.product);
  }
  async function fetchProductCategoryList() {
    const getProductCategoryList = await dispatch(getAllCategoriesList("sell"));
    if (isMounted.current) {
      setProductCategoryList(getProductCategoryList.categoryList);
    }
  }

  async function fetchTaxGroupList() {
    const taxGroupList = await dispatch(getTaxGroupList("sell"));
    if (isMounted.current) {
      setTaxGroupList(taxGroupList.taxGroupList);
    }
  }

  async function fetchVariantGroupList() {
    const variantGroupList = await dispatch(getAllVariantGroupList("sell"));
    if (isMounted.current) {
      setVariantGroupList(variantGroupList.payload);
    }
  }

  async function fetchAddonGroupList() {
    const addonGroupList = await dispatch(getAllAddonGroupList("sell"));
    if (isMounted.current) {
      setAddonGroupList(addonGroupList.payload);
    }
  }

  async function fetchRegistersList() {
    const registerList = await dispatch(getAllRegisterNameList("sell"));
    if (isMounted.current) {
      setRegisterList(registerList.registerNameList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      if (queryParams && queryParams.product_id) {
        fetchProduct();
        fetchProductCategoryList();
        fetchTaxGroupList();
        fetchVariantGroupList();
        fetchAddonGroupList();
        fetchRegistersList();
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmitBasicDetails = async (formData) => {
    setLoading(true);
    let {
      product_name,
      product_category,
      tax_group,
      price,
      sort_order,
      option_status,
      option_variant_group,
      option_addon_group,
      option_item_group,
      unit_of_measure,
      product_code,
      notes,
      limit_to_register,
    } = formData;

    limit_to_register = treevalues;
    if (queryParams && queryParams.product_id) {
      let productData = await dispatch(
        updateProductById(
          {
            product_name,
            product_category,
            tax_group,
            price,
            sort_order,
            option_status,
            option_variant_group,
            option_addon_group,
            option_item_group,
            unit_of_measure,
            product_code,
            notes,
            limit_to_register,
          },
          queryParams.product_id
        )
      );

      if (!productData.product.error) {
        const getProductList = await dispatch(getAllProductList());
        if (getProductList && getProductList.productList) {
          setLoading(false);
          history.push("/products");
        }
      }
    }
  };

  const handleChangeForFilter = (e) => {
    if (e.target.value === "regular") {
      setRegular(true);
    } else {
      setRegular(false);
    }
  };

  let allSetupcache = {
    products: getItem("productList"),
  };
  return (
    <>
      <Main className="padding-top-form">
        <Row gutter={15}>
          <Col xs={24}>
            <Cards headless>
              <Row gutter={25} justify="center">
                <Col xxl={12} md={14} sm={18} xs={24}>
                  <AddProductForm>
                    <Form
                      style={{ width: "100%" }}
                      form={form}
                      name="editProduct"
                      onFinish={handleSubmitBasicDetails}
                      className="comman-input"
                    >
                      <BasicFormWrapper>
                        <Tabs
                          activeKey={activeTab}
                          onChange={changeTab}
                          onTabClick={(tab, index) => {
                            if (tab === "2") {
                            }
                          }}
                        >
                          <TabPane tab="Details" key="1">
                            <div className="add-product-block">
                              <Row gutter={15}>
                                <Col xs={24}>
                                  <div className="add-product-content">
                                    <Form.Item
                                      name="product_name"
                                      label={
                                        <span>
                                          Product Name&nbsp;&nbsp;
                                          <Tooltip
                                            title="Edit your product details here. Product name should be unique."
                                            color="#FFFF"
                                          >
                                            <InfoCircleFilled
                                              style={{ color: "#AD005A" }}
                                            />
                                          </Tooltip>
                                        </span>
                                      }
                                      rules={[
                                        {
                                          min: 3,
                                          message:
                                            "Product name must be at least 3 characters long",
                                        },
                                        {
                                          max: 50,
                                          message:
                                            "Product name cannot be more than 50 characters long.",
                                        },
                                        {
                                          required: true,
                                          message: "Product name is required",
                                        },
                                        {
                                          validator: (_, value) => {
                                            if (
                                              allSetupcache &&
                                              allSetupcache.products
                                            ) {
                                              let productName = allSetupcache.products.find(
                                                (val) =>
                                                  val.product_name.toLowerCase() ==
                                                  value.toLowerCase()
                                              );

                                              if (
                                                productName &&
                                                productName.product_name !=
                                                  productData.product_name
                                              ) {
                                                return Promise.reject(
                                                  value +
                                                    " already exist in products"
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
                                      name="product_category"
                                      label="Product Category"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please select product category",
                                        },
                                      ]}
                                    >
                                      <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                      >
                                        {productCategoryList.map((category) => (
                                          <option
                                            key={category._id}
                                            value={category._id}
                                          >
                                            {category.category_name}
                                          </option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      className="det_btspce"
                                      name="tax_group"
                                      label="Tax Group"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select tax group",
                                        },
                                      ]}
                                    >
                                      <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                      >
                                        {taxGroupList.map((taxGrp) => (
                                          <option
                                            key={taxGrp._id}
                                            value={taxGrp._id}
                                          >
                                            {taxGrp.tax_group_name}
                                          </option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      name="price"
                                      label="Product Price"
                                      rules={[
                                        {
                                          pattern: new RegExp(
                                            /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                                          ),
                                          message: "Price cannot be negative",
                                        },
                                        {
                                          required: true,
                                          message: "Please enter product price",
                                        },
                                      ]}
                                    >
                                      <Input
                                        min={0}
                                        type="number"
                                        step="any"
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
                                    <Form.Item
                                      name="sort_order"
                                      label={
                                        <span>
                                          Sort Order&nbsp;&nbsp;
                                          <Tooltip
                                            title="Enter an optional numeric value that allow sort the postion"
                                            color="#FFFF"
                                          >
                                            <InfoCircleFilled
                                              style={{ color: "#AD005A" }}
                                            />
                                          </Tooltip>
                                        </span>
                                      }
                                    >
                                      <Input
                                        type="number"
                                        min={0}
                                        initialValue={0}
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
                                    <div
                                      className="add-form-action"
                                      style={{ marginTop: 10 }}
                                    >
                                      <Form.Item>
                                        <NavLink to="/products">
                                          <Button
                                            className="btn-cancel btn-custom"
                                            style={{ background: "white" }}
                                          >
                                            Go Back
                                          </Button>
                                        </NavLink>
                                        <Button
                                          size="small"
                                          className="btn-custom"
                                          type="primary"
                                          raised
                                          onClick={() => changeTab("2")}
                                        >
                                          Next
                                        </Button>
                                      </Form.Item>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tab="Options" key="2">
                            <div className="add-product-block">
                              <Row gutter={15}>
                                <Col xs={24}>
                                  <div className="add-product-content">
                                    {productData.having_on_item_group ? (
                                      <Form.Item
                                        name="option_addon_group"
                                        label="Add Addon group"
                                        rules={[
                                          {
                                            validator: (_, value) => {
                                              if (value.length > 5) {
                                                return Promise.reject(
                                                  "Exceeds the max selectable limit"
                                                );
                                              } else {
                                                return Promise.resolve();
                                              }
                                            },
                                          },
                                        ]}
                                      >
                                        <Select
                                          className="custom_select"
                                          mode="multiple"
                                          style={{
                                            width: "100%",
                                            marginBottom: 10,
                                          }}
                                          placeholder="Please select Addon group"
                                          showSearch
                                          filterOption={(input, option) =>
                                            option.children
                                              .toLowerCase()
                                              .indexOf(input.toLowerCase()) >= 0
                                          }
                                        >
                                          {productData.combo_list.hasOwnProperty(
                                            "addon_groups"
                                          )
                                            ? productData.combo_list.addon_groups.map(
                                                (adngroup) => (
                                                  <Select.Option
                                                    key={adngroup._id}
                                                    value={adngroup._id}
                                                  >
                                                    {adngroup.addon_group_name}
                                                  </Select.Option>
                                                )
                                              )
                                            : ""}
                                        </Select>
                                      </Form.Item>
                                    ) : (
                                      <div>
                                        <Form.Item
                                          name="option_status"
                                          label="Status"
                                          initialValue="regular"
                                        >
                                          <Radio.Group
                                            style={{ marginBottom: 10 }}
                                            onChange={handleChangeForFilter}
                                          >
                                            <Radio value="regular">
                                              Regular
                                            </Radio>
                                            <Radio value="combo">Combo</Radio>
                                          </Radio.Group>
                                        </Form.Item>
                                        {showRegular === true ? (
                                          <>
                                            <Form.Item
                                              name="option_variant_group"
                                              label="Add variant group"
                                              rules={[
                                                {
                                                  validator: (_, value) => {
                                                    if (value.length > 5) {
                                                      return Promise.reject(
                                                        "Exceeds the max selectable limit"
                                                      );
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Select
                                                mode="multiple"
                                                style={{
                                                  width: "100%",
                                                  marginBottom: 10,
                                                }}
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                                placeholder="Please select variant group"
                                              >
                                                {variantGroupList.map(
                                                  (variantGroup) => (
                                                    <Select.Option
                                                      key={variantGroup._id}
                                                      value={variantGroup._id}
                                                    >
                                                      {
                                                        variantGroup.variant_group_name
                                                      }
                                                    </Select.Option>
                                                  )
                                                )}
                                              </Select>
                                            </Form.Item>

                                            <Form.Item
                                              name="option_addon_group"
                                              label="Add Addon group"
                                              rules={[
                                                {
                                                  validator: (_, value) => {
                                                    if (value.length > 5) {
                                                      return Promise.reject(
                                                        "Exceeds the max selectable limit"
                                                      );
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Select
                                                mode="multiple"
                                                style={{
                                                  width: "100%",
                                                  marginBottom: 10,
                                                }}
                                                placeholder="Please select addon group"
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                              >
                                                {addonGroupList.map(
                                                  (addonGroup) => (
                                                    <Select.Option
                                                      key={addonGroup._id}
                                                      value={addonGroup._id}
                                                    >
                                                      {
                                                        addonGroup.addon_group_name
                                                      }
                                                    </Select.Option>
                                                  )
                                                )}
                                              </Select>
                                            </Form.Item>
                                          </>
                                        ) : Object.keys(productData).length >
                                          0 ? (
                                          <>
                                            <Form.Item
                                              name="option_item_group"
                                              label="Add Item group"
                                              rules={[
                                                {
                                                  validator: (_, value) => {
                                                    if (value.length > 5) {
                                                      return Promise.reject(
                                                        "Exceeds the max selectable limit"
                                                      );
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Select
                                                className="custom_select"
                                                mode="multiple"
                                                style={{
                                                  width: "100%",
                                                  marginBottom: 10,
                                                }}
                                                placeholder="Please select Item group"
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                              >
                                                {itemGroupList.map(
                                                  (itemgroup) => {
                                                    return (
                                                      <Select.Option
                                                        key={itemgroup._id}
                                                        value={itemgroup._id}
                                                      >
                                                        {
                                                          itemgroup.item_group_name
                                                        }
                                                      </Select.Option>
                                                    );
                                                  }
                                                )}
                                              </Select>
                                            </Form.Item>

                                            <Form.Item
                                              name="option_addon_group"
                                              label="Add Addon group"
                                              rules={[
                                                {
                                                  validator: (_, value) => {
                                                    if (value.length > 5) {
                                                      return Promise.reject(
                                                        "Exceeds the max selectable limit"
                                                      );
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Select
                                                className="custom_select"
                                                mode="multiple"
                                                style={{
                                                  width: "100%",
                                                  marginBottom: 10,
                                                }}
                                                placeholder="Please select Addon group"
                                                showSearch
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                              >
                                                {productData.combo_list.hasOwnProperty(
                                                  "addon_groups"
                                                )
                                                  ? productData.combo_list.addon_groups.map(
                                                      (adngroup) => (
                                                        <Select.Option
                                                          key={adngroup._id}
                                                          value={adngroup._id}
                                                        >
                                                          {
                                                            adngroup.addon_group_name
                                                          }
                                                        </Select.Option>
                                                      )
                                                    )
                                                  : ""}
                                              </Select>
                                            </Form.Item>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    )}

                                    <div
                                      className="add-form-action"
                                      style={{ marginTop: 10 }}
                                    >
                                      <Form.Item>
                                        <NavLink to="/products">
                                          <Button
                                            className="btn-cancel btn-custom"
                                            style={{ background: "white" }}
                                          >
                                            Go Back
                                          </Button>
                                        </NavLink>

                                        <Button
                                          size="small"
                                          className="btn-custom"
                                          type="primary"
                                          raised
                                          onClick={() => changeTab("3")}
                                        >
                                          Next
                                        </Button>
                                      </Form.Item>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tab="Additional Details" key="3">
                            <div className="add-product-block">
                              <Row gutter={15}>
                                <Col xs={24}>
                                  <div className="add-product-content">
                                    <Form.Item
                                      name="unit_of_measure"
                                      label="Unit of Measure"
                                    >
                                      <Input
                                        style={{ marginBottom: 10 }}
                                        placeholder="Unit of Measure (Optional)"
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      name="product_code"
                                      label={
                                        <span>
                                          Product Code&nbsp;&nbsp;
                                          <Tooltip
                                            title="Product code can be used to search products easily while billing"
                                            color="#FFFF"
                                          >
                                            <InfoCircleFilled
                                              style={{ color: "#AD005A" }}
                                            />
                                          </Tooltip>
                                        </span>
                                      }
                                    >
                                      <Input
                                        style={{ marginBottom: 10 }}
                                        placeholder="Product Code (Optional)"
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      name="notes"
                                      label={
                                        <span>
                                          Notes&nbsp;&nbsp;
                                          <Tooltip
                                            title="Use this fields for product addtional information"
                                            color="#FFFF"
                                          >
                                            <InfoCircleFilled
                                              style={{ color: "#AD005A" }}
                                            />
                                          </Tooltip>
                                        </span>
                                      }
                                    >
                                      <Input
                                        style={{ marginBottom: 10 }}
                                        placeholder="Notes (Optional)"
                                      />
                                    </Form.Item>

                                    {Object.keys(registerListData).length ? (
                                      <>
                                        <Form.Item
                                          name="limit_to_register"
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please select limit of register",
                                            },
                                          ]}
                                          validateStatus={
                                            treevalues?.length == 0
                                              ? "error"
                                              : false
                                          }
                                          help={
                                            treevalues?.length == 0
                                              ? "Please select limit of register"
                                              : null
                                          }
                                          label="Please select limit of register"
                                        >
                                          <p style={{ display: "none" }}>
                                            {treevalues?.length}
                                          </p>
                                          <TreeSelect
                                            showSearch={true}
                                            multiple
                                            value={treevalues}
                                            treeData={[
                                              {
                                                title:
                                                  treevalues.length > 0 ? (
                                                    <span
                                                      onClick={() => {
                                                        setValues([]);
                                                      }}
                                                      style={{
                                                        display: "inline-block",
                                                        color: "#286FBE",
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      Unselect all
                                                    </span>
                                                  ) : (
                                                    <span
                                                      onClick={() => {
                                                        setValues(totalIds);
                                                      }}
                                                      style={{
                                                        display: "inline-block",
                                                        color: "#286FBE",
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      Select all
                                                    </span>
                                                  ),
                                                value: "xxx",
                                                disableCheckbox: true,
                                                disabled: true,
                                              },
                                              ...treeData,
                                            ]}
                                            treeDefaultExpandAll
                                            onChange={(val) => setValues(val)}
                                            treeCheckable={true}
                                            showCheckedStrategy={SHOW_PARENT}
                                            placeholder="Please select Register"
                                            filterTreeNode={(search, item) => {
                                              return (
                                                item.title
                                                  .toLowerCase()
                                                  .indexOf(
                                                    search.toLowerCase()
                                                  ) >= 0
                                              );
                                            }}
                                            style={{
                                              width: "100%",
                                            }}
                                          />
                                        </Form.Item>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      className="add-form-action"
                                      style={{ marginTop: 10 }}
                                    >
                                      <Form.Item>
                                        <NavLink to="/products">
                                          <Button
                                            className="btn-cancel btn-custom"
                                            style={{
                                              background: "white",
                                            }}
                                          >
                                            Go Back
                                          </Button>
                                        </NavLink>

                                        <Button
                                          size="small"
                                          className="btn-custom"
                                          htmlType="submit"
                                          type="primary"
                                          raised
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
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                        </Tabs>
                      </BasicFormWrapper>
                    </Form>
                  </AddProductForm>
                </Col>
              </Row>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default EditProduct;
