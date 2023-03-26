import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Input,
  Modal,
  Row,
  Col,
  Form,
  Select,
  Button,
  Checkbox,
  Tag,
} from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "../../setting.css";
import Heading from "../../../../../components/heading/heading";
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
const EditRecipe = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [DynoList, setDynoList] = useState([]);
  const [RegisterList, setRegisterList] = useState([]);
  let location = useLocation();
  const [form] = Form.useForm();
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
      if (location.state.inventoryData) {
        console.log("inventoryData4445454545", location.state.inventoryData);
        form.setFieldsValue({
          inventory_item_name: location.state.inventoryData.inventory_item_name,
          unit_of_measure: location.state.inventoryData.unit_of_measure,
          isTracked:
            location.state.inventoryData.isTracked == "Yes" ? true : false,
        });
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

  const dataSource = [];

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

  const handleSubmit = async (formData) => {
    console.log("sasasasasasassa", formData, location.state.inventoryData);
    if (location.state.inventoryData) {
      setLoading(true);
      formData["_id"] = location.state.inventoryData.id;
      const getAddedProduct = await dispatch(
        addUpdateInevntoryItems(inventoryData._id, formData)
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
    }
  };
  return (
    <Main className="inventory-items">
      <Row gutter={16}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Your Item Details</Heading>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                autoComplete="off"
                size="large"
                className="comman-input"
                onFinish={handleSubmit}
                form={form}
                //   onFieldsChange={(val, allFileds) =>
                //     handleFormChange(val, allFileds)
                //   }
              >
                <Form.Item
                  label="Name"
                  name="inventory_item_name"
                  rules={[
                    {
                      required: true,
                      message: "Name is Required.",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    style={{ marginBottom: 10 }}
                    className="input-text"
                    placeholder="Name"
                  />
                </Form.Item>
                <Form.Item label="Unit Of Measure" name="unit_of_measure">
                  <Input
                    type="text"
                    min={0}
                    style={{ marginBottom: 10 }}
                    step="any"
                    initialValue={0}
                    className="input-text"
                    placeholder="Unit Of Measure (optional)"
                  />
                </Form.Item>
                {location.state.inventoryData.recipe?.length ? (
                  <Form.Item
                    label={"Associated Products"}
                    // className="lh0"
                  >
                    {location.state.inventoryData.recipe.map((j) => (
                      <Tag className="custome-tag">{j.product_name}</Tag>
                    ))}
                  </Form.Item>
                ) : (
                  ""
                )}

                <Form.Item name="isTracked" valuePropName="checked">
                  <Checkbox
                    className="add-form-check"
                    style={{ marginTop: 0, marginBottom: 0 }}
                  >
                    Tracked
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="btn-cancel btn-custom"
                    size="medium"
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      history.push("/inventory/recipe", {
                        inventoryData: inventoryData,
                        inventoryPage: true,
                      });
                    }}
                  >
                    Go Back
                  </Button>

                  <Button
                    size="medium"
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
              </Form>
            </Col>
          </Row>
        </Cards>
      </Row>
    </Main>
  );
};

export { EditRecipe };
