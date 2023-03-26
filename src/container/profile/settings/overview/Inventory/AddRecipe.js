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
  addUpdateInevntoryItems,
} from "../../../../../redux/inventory/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import "./inventory.css";
const AddRecipe = () => {
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
  async function fetchRegisterList() {
    const getRegisterList = await dispatch(getAllRegisterList("sell"));
    if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
      setRegisterList(getRegisterList.RegisterList);
  }

  async function fetchInventoryList() {
    const getInventoryList = await dispatch(getAllPosProductsList());
    console.log("checkadadadad", getInventoryList);
    if (isMounted.current && getInventoryList && getInventoryList.taxesList) {
      setDynoList(getInventoryList.taxesList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      if (location.state.inventory_Id) {
        setInventoryData(location.state.inventory_Id);
      }
      fetchInventoryList();
      //   fetchRegisterList();
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
      title: "Name",
      dataIndex: "product_name",
    },
    {
      title: "Unit of measure",
      dataIndex: "quantity",
    },
  ];

  const handleSubmit = async (formData) => {
    console.log("formSubmitnbvssds", formData);
    setLoading(true);
    const Obj = {};
    Obj.inventory_item_name = formData?.product_name;
    Obj.unit_of_measure = formData.quantity;
    Obj._id =
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substr(2);

    Obj.isTracked = true;
    console.log("sagarcreatenfdfdfd9393", formData);
    const dataSource = [Obj];
    if (formData.products && formData.products.length > 0) {
      formData.products.map((j) => {
        dataSource.push({
          _id:
            Date.now().toString(36) +
            Math.random()
              .toString(36)
              .substr(2),
          inventory_item_name: j.product_name,
          unit_of_measure: j.quantity,
          isTracked: true,
        });
      });
    }

    let payload = {
      inventory_items: dataSource,
    };
    const getAddedProduct = await dispatch(
      addUpdateInevntoryItems(inventoryData._id, payload)
    );
    console.log(
      "getAddedProductsagartanknk",
      getAddedProduct?.TaxesDeletedData?.data,
      inventoryData
    );

    if (!getAddedProduct?.TaxesDeletedData?.error) {
      setLoading(false);
      history.push("/inventory/recipe", {
        inventoryData: {
          ...inventoryData,
          inventory_items:
            getAddedProduct?.TaxesDeletedData?.data?.inventory_items,
        },
        inventoryPage: true,
      });
    }
  };
  return (
    <Main className="inventory-items">
      <Row gutter={16}>
        <Cards headless>
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
                  label="Name"
                  name="product_name"
                  rules={[
                    {
                      required: true,
                      message: "Name is Required.",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    style={{ margin: "8px 0 0" }}
                    className="input-text"
                    placeholder="Name"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} xl={8} className="gutter-box">
                <Form.Item label="Unit Of Measure" name="quantity">
                  <Input
                    type="text"
                    min={0}
                    style={{ margin: "8px 0 0" }}
                    step="any"
                    initialValue={0}
                    className="input-text"
                    placeholder="Unit Of Measure (optional)"
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
                                    message: "Name is Required.",
                                  },
                                ]}
                              >
                                <Input
                                  type="text"
                                  min={0}
                                  style={{ margin: "8px 0 0" }}
                                  className="input-text"
                                  placeholder="Name"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} xl={8} className="gutter-box">
                              <Form.Item
                                {...field}
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                              >
                                <Input
                                  type="text"
                                  className="input-text"
                                  placeholder="Unit Of Measure (optional)"
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

export { AddRecipe };
