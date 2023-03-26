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
  addProductInInvenoryItems,
} from "../../../../../redux/inventory/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import "./inventory.css";
const Addproductrecipe = () => {
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
  const [inventoryData, setInventoryData] = useState();
  const [currentInventoryItems, setCurrentInventoryItems] = useState();
  async function fetchInventoryList() {
    const getInventoryList = await dispatch(getAllPosProductsList());
    console.log("checkadadadad", getInventoryList);
    if (isMounted.current && getInventoryList && getInventoryList.taxesList) {
      setDynoList(getInventoryList.taxesList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      if (location?.state?.inventory_Id) {
        setInventoryData(location.state.inventory_Id);
        setCurrentInventoryItems(location.state.currentInventoryData);
      }
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

  const deleteSelectedRegister = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allRegisterIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allRegisterIdsForDelete.push(item.id);
    });
    const getDeletedBingages = await dispatch(
      deleteInventory({ ids: allRegisterIdsForDelete })
    );
    if (getDeletedBingages && !getDeletedBingages.error) {
      fetchInventoryList();
      setModelDeleteVisible(false);
    }
  };
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);

  const contentforaction = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setLoading(false);
          setModelDeleteVisible(true);
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

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
    console.log("habhshdbtamarivatbsadd", originalProduct);
    if (originalProduct.category) {
      Obj.product_category = originalProduct.category;
    }
    Obj.product_name = originalProduct?.product_name;
    Obj.quantity = Number(formData.quantity);
    Obj.product_id = formData.product_name;

    console.log("sagarcreatenfdfdfd9393", formData);
    const dataSource = [Obj];
    if (formData.products && formData.products.length > 0) {
      formData.products.map((j) => {
        let originalProductDetails = DynoList.find(
          (val) => val.product_id == j.product_name
        );
        dataSource.push({
          product_name: originalProductDetails?.product_name,
          product_category: originalProductDetails?.category,
          quantity: Number(j.quantity),
          product_id: j.product_name,
        });
      });
    }
    console.log("sasassssasssassss787878788", currentInventoryItems);
    let payload = {
      inventory_items_id: currentInventoryItems.id,
      linked_products: dataSource,
    };
    const getAddedProduct = await dispatch(
      addProductInInvenoryItems(inventoryData._id, payload)
    );
    console.log("inventoryData5566666666", inventoryData, getAddedProduct);
    // if (getAddedProduct) {
    //   const getProductList = await dispatch(getAllProductList());
    if (!getAddedProduct?.TaxesDeletedData?.error) {
      inventoryData?.inventory_items?.map((val) => {
        if (val._id == currentInventoryItems.id) {
          val.linked_products = dataSource;
        }
      });
      console.log("sagarcheckadddd6656565", inventoryData);
      setLoading(false);
      history.push(`/inventory/recipe`, {
        inventoryData: inventoryData,
      });
    }
  };
  return (
    <Main className="inventory-items">
      <Row gutter={16}>
        {/* <Col xs={24} xl={16} md={16} sm={24}> */}
        {console.log("vhvhvhvadadads", location.state.inventory_Id)}
        <Cards headless>
          <span>
            1 {currentInventoryItems?.unit_of_measure} of{" "}
            {currentInventoryItems?.inventory_item_name} has ingredients
          </span>
          <Form
            autoComplete="off"
            size="large"
            onFinish={handleSubmit}
            //   onFieldsChange={(val, allFileds) =>
            //     handleFormChange(val, allFileds)
            //   }
          >
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
                      <span style={{ fontSize: "15px" }}>
                        Type to choose ingredient from list
                      </span>
                    }
                    // placeholder="Search items"
                    optionFilterProp="children"
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
                  label="Ingredient Quantity"
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
                    placeholder="Units"
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
                                  placeholder="Type to choose ingredient from list"
                                  optionFilterProp="children"
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
                                  placeholder="Units"
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
                            inventoryData: inventoryData,
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

export { Addproductrecipe };
