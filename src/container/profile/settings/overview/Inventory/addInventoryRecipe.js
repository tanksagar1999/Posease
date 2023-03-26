import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal, Row, Col, Form, Select, Button } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "../../setting.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  getAllPosProductsList,
  deleteInventory,
  addInevntoryItems,
} from "../../../../../redux/inventory/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import "./inventory.css";
const addInventoryRecipe = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [DynoList, setDynoList] = useState([]);
  const [RegisterList, setRegisterList] = useState([]);
  let location = useLocation();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [currunetProduct, setCurrentProduct] = useState();
  const [deleteFirstProduct, setDeleteFirstProduct] = useState(false);
  async function fetchInventoryList() {
    if (location.state.inventory_Id) {
      let posProductsList = JSON.parse(
        JSON.stringify(location.state.posProductsList)
      );

      if (location.state.currentProduct) {
        let formList = location.state.currentProduct.recipe.map((j) => {
          return { ...j, product_name: j.product_id };
        });

        if (formList && formList.length) {
          form.setFieldsValue({
            product_name: formList[0].product_id,
            quantity: formList[0].quantity,
            products: formList.filter((val, index) => index > 0),
          });
        }

        setCurrentProduct(location.state.currentProduct);
      }
      if (location?.state?.inventory_Id?.inventory_items?.length > 0) {
        location.state.inventory_Id.inventory_items.map((val) => {
          let findInventoryItems = location.state.inventory_Id?.productList.find(
            (a) => a.product_id == val._id
          );
          posProductsList.push({
            type: "inventory",
            category: "",
            isNotTracked: val.isTracked,
            isSellable: true,
            product_id: val._id,
            product_name: val.inventory_item_name,
            unit_of_measure: val.unit_of_measure,
            linked_products: findInventoryItems?.linked_products
              ? findInventoryItems.linked_products
              : val.linked_products,
          });
        });
      }
      setDynoList(posProductsList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      fetchInventoryList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: DynoList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (DynoList) {
      setState({
        item: DynoList,
        selectedRowKeys,
      });
    }
  }, [DynoList, selectedRowKeys]);

  const dataSource = [];
  console.log("sagartankcheckncsdcdscs", DynoList);

  if (DynoList.length)
    DynoList.map((value) => {
      const { product_id, product_name, category } = value;

      if (currunetProduct && currunetProduct.id != product_id) {
        return dataSource.push({
          value: product_id,
          label: product_name,
          id: product_id,
          product_name: product_name,
          category: category,
          purchased: "No",
          ...value,
        });
      }
    });

  const handleSubmit = async (formData) => {
    console.log("howcancheckbhaufasst", formData, currunetProduct);
    setLoading(true);
    const Obj = {};
    if (currunetProduct) {
      let originalProduct = DynoList.find(
        (val) => val.product_id == formData.product_name
      );
      console.log("sagartankcheckmdm", originalProduct);
      Obj.product_name = currunetProduct.product_name;
      Obj.product_id = currunetProduct.id;
      Obj.product_category = currunetProduct.category;
      Obj.quantity = 0;
      Obj.linked_products = deleteFirstProduct
        ? []
        : [
            {
              product_id: originalProduct.product_id,
              product_name: originalProduct.product_name,
              quantity: Number(formData.quantity),
              isTracked: originalProduct.isNotTracked ? true : false,
              unit_of_measure: originalProduct.unit_of_measure
                ? originalProduct.unit_of_measure
                : "",
            },
          ];

      if (formData.products && formData.products.length > 0) {
        formData.products.map((j) => {
          let originalProductDetails = DynoList.find(
            (val) => val.product_id == j.product_name
          );
          let productDetails = {
            product_name: originalProductDetails?.product_name,
            product_category: originalProductDetails?.category,
            quantity: Number(j.quantity),
            product_id: j.product_name,
            isTracked: originalProductDetails.isNotTracked ? true : false,
            unit_of_measure: originalProductDetails.unit_of_measure
              ? originalProductDetails.unit_of_measure
              : "",
          };
          if (Obj.linked_products) {
            Obj.linked_products.push(productDetails);
          }
        });
      }
      console.log("Objfstanksabdfsfsfsfsf", Obj);
      const getAddedProduct = await dispatch(
        addInevntoryItems(location.state.inventory_Id._id, Obj)
      );
      console.log("getsdsdsdsdAddedProductadasdadsads", getAddedProduct);
      if (!getAddedProduct?.TaxesDeletedData?.error) {
        setLoading(false);
        history.push("/inventory/recipe", {
          inventoryData: {
            ...location.state.inventory_Id,
            productList: getAddedProduct?.TaxesDeletedData.data.products,
          },
        });
      }
    }
  };
  let [isDisabled, setDisabled] = useState(true);
  const [placeholderArray, setPlaceholderArray] = useState([]);
  let [allProduct, setAllProducts] = useState([]);
  const handleFormChange = (item, allFileds) => {
    console.log("2deedeffrgfrfr", allFileds);
    allFileds.splice(-1);
    // setAllProducts([
    //   ...allFileds
    //     .map((val) => {
    //       if (val.value && val.name.includes("product_name")) {
    //         return val.value;
    //       }
    //     })
    //     .filter((val) => val != undefined),
    // ]);
    console.log("njsfsdfsdf45444", item);
    if (
      allFileds.find((val, index) => val.value == undefined || val.value == "")
    ) {
      setDisabled(true);
      return true;
    } else {
      setDisabled(false);
      return true;
    }
  };
  const [errValid, setErrValid] = useState(false);

  const checkvalid = (value, allProduct) => {
    allProduct.splice(-1);
    if (allProduct.length > 0) {
      if (allProduct.find((val) => val == value)) {
        setErrValid("This ingredient Name name is already in use");
        return true;
      } else {
        setErrValid(false);
        return true;
      }
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Main className="inventory-items">
      <Row gutter={16}>
        {console.log("vhvhvhvadadads", location.state.inventory_Id)}
        <Cards
          title={
            <div style={{ boxShadow: "none", marginLeft: "10px" }}>
              1 Unit of {currunetProduct?.product_name} has ingredients
            </div>
          }
        >
          <Form
            autoComplete="off"
            size="large"
            form={form}
            onFinish={(value) => handleSubmit(value)}
            onFieldsChange={(item, allFileds) =>
              handleFormChange(item, allFileds)
            }
            onValuesChange={(item, allFileds) => {
              if (item?.product_name) {
                let allFiledsArray = [allFileds.product_name];
                checkvalid(item?.product_name, allFiledsArray);
              } else if (
                item?.products &&
                item?.products.length &&
                item?.products[item?.products.length - 1] &&
                item?.products[item?.products.length - 1].product_name
              ) {
                let allFiledsArray = [allFileds.product_name];

                allFileds.products.map((l) =>
                  allFiledsArray.push(l.product_name)
                );
                checkvalid(
                  item?.products[item?.products.length - 1].product_name,
                  allFiledsArray
                );
              }
            }}
          >
            {deleteFirstProduct == false && (
              <Row>
                <Col xs={24} xl={12} className="gutter-box">
                  <Form.Item
                    label="Ingredient Name"
                    name="product_name"
                    rules={[
                      {
                        required: true,
                        message: "Product name is Required.",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      className="custom_select4545"
                      placeholder={
                        <span style={{ fontSize: "15px" }}>Search items</span>
                      }
                      // placeholder="Search items"
                      optionFilterProp="children"
                      onChange={(val, option) => {
                        placeholderArray[0] = option.unit_of_measure;
                        setPlaceholderArray([...placeholderArray]);
                      }}
                      filterOption={(input, option) =>
                        (option?.product_name.toLowerCase() ?? "").includes(
                          input.toLowerCase()
                        )
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.product_name ?? "")
                          .toLowerCase()
                          .localeCompare(
                            (optionB?.product_name ?? "").toLowerCase()
                          )
                      }
                      options={dataSource}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} xl={8} className="gutter-box">
                  <Form.Item
                    label={"Ingredient Quantity"}
                    name="quantity"
                    rules={[
                      {
                        required: true,
                        message: "Quantity is Required.",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={0}
                      style={{ margin: "8px 0 0" }}
                      step="any"
                      initialValue={0}
                      className="input-text"
                      placeholder={
                        placeholderArray[0] ? placeholderArray[0] : "Units"
                      }
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

                <Col xs={24} xl={4} className="gutter-box">
                  <Form.Item
                    label="Action"
                    style={{ marginLeft: "10px" }}
                    className="action-class"
                  >
                    <DeleteOutlined
                      onClick={() => {
                        setDeleteFirstProduct(true);
                      }}
                    />
                  </Form.Item>
                  {/* <Form.Item
                  className="action-class"
                  style={{ marginLeft: "10px" }}
                ></Form.Item> */}
                </Col>
              </Row>
            )}

            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row
                      className="sub_prod"
                      key={field.key}
                      // style={{ margin: "8px 0 0" }}
                    >
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.area !== curValues.area ||
                          prevValues.sights !== curValues.sights
                        }
                      >
                        {() => (
                          <>
                            <Col xs={24} xl={12} className="gutter-box">
                              <Form.Item
                                {...field}
                                label={
                                  deleteFirstProduct && index == 0
                                    ? "Ingredient Name"
                                    : ""
                                }
                                name={[field.name, "product_name"]}
                                fieldKey={[field.fieldKey, "product_name"]}
                                validateStatus={
                                  fields.length - 1 == index && errValid
                                    ? "error"
                                    : undefined
                                }
                                help={fields.length - 1 == index && errValid}
                                rules={[
                                  {
                                    required: true,
                                    message: "Product name is Required.",
                                  },
                                  // {
                                  //   validator: (v, value) => {
                                  //     allProduct.splice(-1);
                                  //     if (allProduct.length > 0) {
                                  //       if (
                                  //         allProduct.find((val) => val == value)
                                  //       ) {
                                  //         return Promise.reject(
                                  //           "This ingredient Name name is already in use"
                                  //         );
                                  //       } else {
                                  //         return Promise.resolve();
                                  //       }
                                  //     } else {
                                  //       return Promise.resolve();
                                  //     }
                                  //   },
                                  // },
                                ]}
                              >
                                <Select
                                  showSearch
                                  className="custom_select4545"
                                  placeholder="Search items"
                                  optionFilterProp="children"
                                  onChange={(val, option) => {
                                    placeholderArray[index + 1] =
                                      option.unit_of_measure;
                                    setPlaceholderArray([...placeholderArray]);
                                  }}
                                  filterOption={(input, option) =>
                                    (
                                      option?.product_name.toLowerCase() ?? ""
                                    ).includes(input.toLowerCase())
                                  }
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.product_name ?? "")
                                      .toLowerCase()
                                      .localeCompare(
                                        (
                                          optionB?.product_name ?? ""
                                        ).toLowerCase()
                                      )
                                  }
                                  options={dataSource}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} xl={8} className="gutter-box">
                              <Form.Item
                                {...field}
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                                label={
                                  deleteFirstProduct && index == 0
                                    ? "Ingredient Quantity"
                                    : ""
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: "Quantity is Required.",
                                  },
                                ]}
                              >
                                <Input
                                  type="number"
                                  min={0}
                                  className="input-text"
                                  placeholder={
                                    placeholderArray[index + 1]
                                      ? placeholderArray[index + 1]
                                      : "Units"
                                  }
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
                            <Col xs={24} xl={4} className="gutter-box">
                              <Form.Item
                                {...field}
                                className="action-class"
                                style={{ marginLeft: "10px" }}
                              >
                                <DeleteOutlined
                                  onClick={() => {
                                    placeholderArray.splice(index + 1, 1);
                                    setPlaceholderArray([...placeholderArray]);
                                    remove(field.name);
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </>
                        )}
                      </Form.Item>
                    </Row>
                  ))}
                  <div style={{ marginLeft: 9 }}>
                    <Form.Item>
                      <Button
                        type="primary"
                        info
                        // disabled={isDisabled}
                        style={{ marginBottom: 10 }}
                        size="medium"
                        onClick={() => {
                          add();
                          setDisabled(true);
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add Product
                      </Button>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        size="medium"
                        onClick={() =>
                          history.push("/inventory/itemList", {
                            inventoryData: location.state.inventory_Id,
                          })
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
          </Form>
        </Cards>
      </Row>
    </Main>
  );
};

export { addInventoryRecipe };
