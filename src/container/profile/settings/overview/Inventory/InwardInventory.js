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
  addProductInInvenory,
} from "../../../../../redux/inventory/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import "./inventory.css";
const InwardInventory = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [DynoList, setDynoList] = useState([]);
  const [RegisterList, setRegisterList] = useState([]);
  let location = useLocation();
  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  async function fetchRegisterList() {
    const getRegisterList = await dispatch(getAllRegisterList("sell"));
    if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
      setRegisterList(getRegisterList.RegisterList);
  }

  async function fetchInventoryList() {
    let getInventoryList = {};
    console.log("checkadadadad", getInventoryList);
    if (
      isMounted.current &&
      getInventoryList &&
      location.state.inventory_Id.posProductsList
    ) {
      getInventoryList["taxesList"] = JSON.parse(
        JSON.stringify(location.state.inventory_Id.posProductsList)
      );

      if (location?.state?.inventory_Id?.inventory_items?.length > 0) {
        location.state.inventory_Id.inventory_items.map((val) => {
          getInventoryList.taxesList.push({
            type: "inventory",
            category: "",
            isNotTracked: val.isTracked,
            isSellable: true,
            product_id: val._id,
            product_name: val.inventory_item_name,
            unit_of_measure: val.unit_of_measure,
            linked_products: val.linked_products,
          });
        });
      }
      setDynoList(getInventoryList.taxesList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      fetchInventoryList();
      // fetchRegisterList();
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
  // let searchArrTaxes = DynoList?.filter((value) =>
  //   value.inventory_name?.toLowerCase().includes(search.toLowerCase())
  // );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  if (DynoList.length)
    DynoList.map((value) => {
      const { product_id, product_name, category } = value;

      return dataSource.push({
        value: product_id,
        label: product_name,
        id: product_id,
        product_name: product_name,
        category: category,
        purchased: "No",
        ...value,
      });
    });

  const columns = [
    {
      title: "Item Name",
      dataIndex: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Purchased",
      dataIndex: "purchased",
    },
  ];

  const handleSubmit = async (formData) => {
    console.log("formSubmitnbvssds", location.state);
    setLoading(true);
    const Obj = {};
    let originalProduct = DynoList.find(
      (val) => val.product_id == formData.product_name
    );
    console.log("3424242scscscscscsc", originalProduct);
    if (originalProduct.category) {
      Obj.product_category = originalProduct.category;
    }
    Obj.product_name = originalProduct?.product_name;
    Obj.quantity = Number(formData.quantity);
    Obj.product_id = formData.product_name;
    if (originalProduct.linked_products) {
      Obj.linked_products = originalProduct.linked_products;
    }
    if (originalProduct.type) {
      Obj.type = originalProduct.type;
    }
    if (originalProduct.unit_of_measure) {
      Obj.unit_of_measure = originalProduct.unit_of_measure;
    }
    console.log("sagarcreatenfdfdfd9393", formData);
    const dataSource = [Obj];
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
        };
        if (originalProductDetails.linked_products) {
          productDetails.linked_products =
            originalProductDetails.linked_products;
        }
        if (originalProductDetails.type) {
          productDetails.type = originalProductDetails.type;
        }
        if (originalProductDetails.unit_of_measure) {
          productDetails.unit_of_measure =
            originalProductDetails.unit_of_measure;
        }
        dataSource.push(productDetails);
      });
    }
    console.log("sagarchecceseededdedwd", dataSource);
    let payload = {
      type: location.state.type,
      products: dataSource,
    };
    const getAddedProduct = await dispatch(
      addProductInInvenory(location.state.inventory_Id._id, payload)
    );
    console.log("getAddedProduct", getAddedProduct);

    if (!getAddedProduct?.TaxesDeletedData?.error) {
      setLoading(false);
      history.push("/inventory/itemList", {
        inventoryData: location.state.inventory_Id,
      });
    }
  };
  const [errValid, setErrValid] = useState(false);
  const [placeholderArray, setPlaceholderArray] = useState([]);
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
        {/* <Col xs={24} xl={16} md={16} sm={24}> */}
        {console.log("vhvhvhvadadads", location.state.inventory_Id)}
        <Cards headless>
          <Form
            autoComplete="off"
            size="large"
            onFinish={handleSubmit}
            //   onFieldsChange={(val, allFileds) =>
            //     handleFormChange(val, allFileds)
            //   }
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
            <Row>
              <Col xs={24} xl={12} className="gutter-box">
                <Form.Item
                  label="Item Name"
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
                    onChange={(val, option) => {
                      placeholderArray[0] = option.unit_of_measure;
                      setPlaceholderArray([...placeholderArray]);
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.product_name?.toLowerCase() ?? "").includes(
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
                  label={
                    location.state.type == "Inward"
                      ? "Quantity to Add"
                      : location.state.type == "Wastage"
                      ? "Quantity to Reduce"
                      : "New Quantity"
                  }
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
                ></Form.Item>
              </Col>
            </Row>
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
                                  initialValue={0}
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
                                    remove(field.name);
                                    handleDelete();
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
                        //   disabled={isDisabled}
                        style={{ marginBottom: 10 }}
                        size="medium"
                        onClick={() => {
                          add();
                          // setDisabled(true);
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
        {/* </Col> */}
        {/* <Col xs={24} xl={8} md={8} sm={24}>
          <Cards
            title={
              <div style={{ boxShadow: "none", marginLeft: "10px" }}>
                Available Items
              </div>
            }
          >
            <p style={{ display: "none" }}>{loading}</p>
            <Modal
              title="Confirm Delete"
              okText={
                loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 16,
                          color: "white",
                          margin: "0px 14px",
                        }}
                        spin
                      />
                    }
                  />
                ) : (
                  "Delete"
                )
              }
              visible={modalDeleteVisible}
              onOk={deleteSelectedRegister}
              onCancel={handleCancel}
              width={600}
            >
              <p>Are you sure you want to delete Inventory ?</p>
            </Modal>
            <Modal
              title="You are Offline"
              visible={offLineModeCheck}
              onOk={() => setOfflineModeCheck(false)}
              onCancel={() => setOfflineModeCheck(false)}
              width={600}
            >
              <p>You are offline not add and update </p>
            </Modal>

            <Table
              rowKey="id"
              dataSource={dataSource}
              columns={columns}
              onRow={(row) => ({
                onClick: () =>
                  offLineMode
                    ? setOfflineModeCheck(true)
                    : history.push(`inventory/add`, {
                        data: row,
                      }),
              })}
              size="small"
              style={{ marginTop: "8px" }}
            />
          </Cards>
        </Col> */}
      </Row>
    </Main>
  );
};

export { InwardInventory };
