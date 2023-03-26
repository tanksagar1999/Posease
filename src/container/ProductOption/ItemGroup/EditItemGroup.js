import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  TreeSelect,
  Button,
  Popover,
} from "antd";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import {
  getAllProductList,
  getAllCategoriesList,
} from "../../../redux/products/actionCreator";
import { FilterOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  UpdateItemGroup,
  getItemGroupById,
  getAllItemGroupList,
} from "../../../redux/ItemGroup/actionCreator";

const EditItemGroup = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [checkedValues, setcheckValue] = useState([]);
  const [variants, setVariants] = useState(null);
  let isMounted = useRef(true);
  const [ProductCategoriesList, setProductCategoriesList] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let [productListData, setProductListData] = useState([]);
  let [itemGroupData, setItemGroupData] = useState([]);
  const [values, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    async function fetchProductList() {
      const getProductList = await dispatch(getAllProductList("sell"));
      if (isMounted.current && getProductList && getProductList.productList)
        setProductListData(getProductList.productList);
    }
    async function fetchItemData() {
      const getItemGroup = await dispatch(
        getItemGroupById(props.match.params.id)
      );
      if (isMounted.current) {
        setItemGroupData(getItemGroup);

        setVariants({
          variants: getItemGroup.product_variants,
          products: getItemGroup.products,
        });
      }
    }
    if (isMounted.current) {
      fetchProductList();
      fetchItemData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  let { productList } = useSelector(
    (state) => ({
      productList: state.products.productData,
    }),
    shallowEqual
  );

  useEffect(() => {
    async function fetchProducCategories() {
      const getProductCategories = await dispatch(getAllCategoriesList("sell"));
      if (
        isMounted.current &&
        getProductCategories &&
        getProductCategories.categoryList
      )
        setProductCategoriesList(getProductCategories.categoryList);
    }

    if (isMounted.current) {
      fetchProducCategories();
    }
  }, []);
  useEffect(() => {
    const data = [];
    if (checkedValues.length > 0) {
      productList.map((product) => {
        if (product.product_category !== null) {
          if (checkedValues.includes(product.product_category._id)) {
            data.push(product);
          }
        }
      });
      setProductListData(data);
    } else {
      setProductListData(productList);
    }
  }, [checkedValues]);
  const onChange = (checkedValues) => {
    setcheckValue(checkedValues);
  };

  const text = <span>Categories Filter</span>;
  const content = (
    <div>
      <Checkbox.Group
        className="checkboxgroup"
        style={{ display: "grid", marginBottom: 10, marginTop: 10 }}
        options={ProductCategoriesList.map((value) => {
          return {
            label: value.category_name,
            value: value._id,
          };
        })}
        onChange={onChange}
      ></Checkbox.Group>
    </div>
  );

  useEffect(() => {
    let selectedArray = [];
    if (itemGroupData) {
      if (variants !== null) {
        variants.products.map((value) => {
          let se = variants.variants.find((x) => x.product_id == value);
          if (se) {
            selectedArray.push(`${se.product_id}_${se.variant_id}`);
          } else {
            selectedArray.push(value);
          }
        });
      }
      form.setFieldsValue({
        item_group_name: itemGroupData.item_group_name,
        products: selectedArray,
        product_variants: itemGroupData.product_variants,
      });
    }
    if (productListData) {
      const data = [];
      if (productListData.length)
        productListData.map((value) => {
          value.option_variant_group.length > 0
            ? value.option_variant_group.map((groupname) => {
                groupname.product_variants.map((variant) => {
                  let object = {};
                  object.title =
                    value.option_variant_group.length > 0
                      ? `${value.product_name} / ${variant.variant_name}`
                      : value.product_name;
                  object.value = value._id + "_" + variant._id;
                  object.key = value._id + "_" + variant._id;
                  data.push(object);
                });
              })
            : data.push({
                title: value.product_name,
                value: value._id,
                key: value._id,
              });
        });

      let filterdata = data.filter((product) =>
        selectedArray.includes(product.value)
      );

      setValues(filterdata);

      setTreeData(data);
    }
  }, [itemGroupData, productListData, variants]);

  const handleSubmit = async (postvalues) => {
    setLoading(true);

    let products = [];
    let product_variants = [];

    if (postvalues && postvalues.products && postvalues.products.length > 0) {
      postvalues.products.map((value) => {
        if (value.includes("_")) {
          let ids = value.split("_");
          let obj = {
            product_id: ids[0],
            variant_id: ids[1],
          };
          product_variants.push(obj);
          if (!products.includes(ids[0])) {
            products.push(ids[0]);
          }
        } else if (!products.includes(value)) {
          products.push(value);
        }
      });
    }
    postvalues.products = products;
    postvalues.product_variants = product_variants;
    const getItemGroupdata = await dispatch(
      UpdateItemGroup(postvalues, props.match.params.id)
    );
    if (!getItemGroupdata.ItemGroupData.error) {
      let list = await dispatch(getAllItemGroupList());
      if (list) {
        setLoading(false);
        history.push("/product-options?type=item_group");
      }
    }
  };

  return (
    <>
      <Main className="padding-top-form">
        <br></br>

        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Item Group</Heading>
              <span>
                Create an item group that can be attached to a combo..{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                autoComplete="off"
                form={form}
                size="large"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="item_group_name"
                  label="Item Group Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Item group name must be at least 3 characters long.",
                    },
                    {
                      max: 60,
                      message:
                        "Item group name cannot be more than 60 characters long.",
                    },
                    { required: true, message: "Item Group Name" },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} placeholder="Name" />
                </Form.Item>
                <Form.Item
                  name="products"
                  label="Select the products"
                  rules={[
                    {
                      message: "Select atleast one product",
                      required: true,
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch={true}
                    multiple
                    value={values}
                    treeData={treeData}
                    onChange={(value) => setValues(value)}
                    showArrow
                    treeCheckable={true}
                    // suffixIcon={
                    //   <Popover
                    //     placement="bottom"
                    //     title={text}
                    //     content={content}
                    //     trigger="click"
                    //   >
                    //     <FilterOutlined />
                    //   </Popover>
                    // }
                    placeholder="Select the products"
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
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options?type=item_group">
                    <Button size="medium" style={{ marginRight: 10 }}>
                      Go Back
                    </Button>
                  </NavLink>
                  <Button type="primary" size="medium" htmlType="submit">
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

export default EditItemGroup;
