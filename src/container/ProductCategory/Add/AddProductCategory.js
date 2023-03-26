import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  Button,
} from "antd";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { InfoCircleFilled } from "@ant-design/icons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import { getItem } from "../../../utility/localStorageControl";
import "../category.css";
import {
  addOrUpdateProductCategory,
  getProductCategoryById,
  getAllOrderTicketGroupedList,
  getAllCategoriesList,
  getAllProductList,
} from "../../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const AddProductCategory = () => {
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    submitValues: {},
  });
  let [orderTicketGroupListData, setOrderTicketGroupListData] = useState([]);
  const dispatch = useDispatch();
  let [productCategoryData, setProductCategoryData] = useState({});
  const [disabledSave, setDisabledSave] = useState(false);
  const [apiData, setApiData] = useState();
  const [mainKitchenId, setMainKitchenId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProductCategory() {
      if (location.state) {
        const getProductCategory = await dispatch(
          getProductCategoryById(location.state.product_category_id)
        );

        if (isMounted.current) {
          setProductCategoryData(getProductCategory.categoryData);
        }
      }
    }
    async function fetchGroupedTicketOrder() {
      const getOrderedTicketGroupList = await dispatch(
        getAllOrderTicketGroupedList("sell")
      );
      if (isMounted.current)
        setOrderTicketGroupListData(
          getOrderedTicketGroupList.orderTicketGroupList
        );
      getOrderedTicketGroupList.orderTicketGroupList.map((value) => {
        if (value.order_ticket_group_name === "Main Kitchen") {
          setMainKitchenId(value._id);
          form.setFieldsValue({
            order_ticket_group: value._id,
          });
        }
      });
    }

    if (isMounted.current) {
      fetchGroupedTicketOrder();
      fetchProductCategory();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(productCategoryData).length) {
      setState({
        ...state,
        productCategoryData,
      });

      setDisabledSave(true);
      setApiData({
        category_name: productCategoryData.category_name,
        order_ticket_group:
          productCategoryData.order_ticket_group == null
            ? "noOrdertiket"
            : productCategoryData.order_ticket_group,
        sort_order: productCategoryData.sort_order
          ? productCategoryData.sort_order
          : "",
      });
      form.setFieldsValue({
        category_name: productCategoryData.category_name,
        order_ticket_group:
          productCategoryData.order_ticket_group == null
            ? "noOrdertiket"
            : productCategoryData.order_ticket_group,
        sort_order: productCategoryData.sort_order,
      });
    }
  }, [productCategoryData]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setState({
      ...state,
      submitValues: formData,
    });
    let submitData = {};

    if (getItem("orderTicketButton") != true) {
      formData.order_ticket_group = mainKitchenId;
    }
    submitData.category_name = formData.category_name;
    submitData.sort_order = formData.sort_order;

    let product_category_id =
      location && location.state && location.state.product_category_id
        ? location && location.state && location.state.product_category_id
        : null;

    const getAddedProductCategory = await dispatch(
      addOrUpdateProductCategory(formData, product_category_id)
    );
    if (
      getAddedProductCategory &&
      getAddedProductCategory.categoryData &&
      !getAddedProductCategory.error
    ) {
      const getCategoryList = await dispatch(getAllCategoriesList());
      const getAllProductListDetails = await dispatch(getAllProductList());
      if (
        getCategoryList.categoryList &&
        getAllProductListDetails.productList
      ) {
        setLoading(false);
        history.push("/product-categories?type=category");
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
  let allSetupcache = getItem("setupCache");
  return (
    <>
      <Main className="padding-top-form">
        <br></br>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Your Product Category Details</Heading>
              <Heading as="h5">
                <span>
                  Products will be grouped under these categories in the sales
                  register.{" "}
                </span>
              </Heading>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                name="addProductCategory"
                form={form}
                onFinish={handleSubmit}
                onFieldsChange={(val, allFileds) =>
                  handleFormChange(val, allFileds)
                }
              >
                <Form.Item
                  name="category_name"
                  label="Product Category Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Product Category name must be at least 3 characters long.",
                    },
                    {
                      max: 40,
                      message:
                        "Product Category name cannot be more than 40 characters long.",
                    },
                    {
                      required: true,
                      message: "Product Category name is required",
                    },
                    {
                      validator: (a, value) => {
                        if (allSetupcache && allSetupcache.productCategory) {
                          let productCategory = allSetupcache.productCategory.find(
                            (val) =>
                              val.category_name.toLowerCase() ==
                              value.toLowerCase()
                          );
                          if (
                            productCategory &&
                            productCategory.category_name !=
                              productCategoryData.category_name
                          ) {
                            return Promise.reject(
                              value + " already exist in productCategory"
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
                    style={{ marginBottom: 10 }}
                    placeholder="Product Category Name"
                    autoComplete="off"
                  />
                </Form.Item>
                {getItem("orderTicketButton") != null &&
                  getItem("orderTicketButton") && (
                    <Form.Item
                      name="order_ticket_group"
                      label="Order Ticket Group"
                    >
                      <Select
                        placeholder="Select ticket group"
                        style={{ marginBottom: 10 }}
                      >
                        {orderTicketGroupListData.map((groupedData) => (
                          <option key={groupedData._id} value={groupedData._id}>
                            {groupedData.order_ticket_group_name}
                          </option>
                        ))}
                        <option value="noOrdertiket">No Order ticket</option>
                      </Select>
                    </Form.Item>
                  )}

                <Form.Item
                  name="sort_order"
                  label={
                    <span>
                      Sort Order&nbsp;&nbsp;
                      <Tooltip
                        title="Enter an optional numeric value that allow sort the postion"
                        color="#FFFF"
                      >
                        <InfoCircleFilled style={{ color: "#AD005A" }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <InputNumber
                    min={0}
                    type="number"
                    initialValue={0}
                    style={{ marginBottom: 10, width: "100%" }}
                    placeholder="Sort order"
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
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      history.push("/product-categories");
                    }}
                  >
                    Go Back
                  </Button>
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

export default AddProductCategory;
