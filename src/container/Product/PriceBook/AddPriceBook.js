import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Select, Upload, message, Modal } from "antd";
import { NavLink } from "react-router-dom";
import { StepBackwardOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { AddProductForm } from "../../Product/Style";
import Heading from "../../../components/heading/heading";
import { useDispatch } from "react-redux";
import "../product.css";
import {
  addOrUpdatePriceBook,
  getAllRegisterNameList,
  getpriceBookById,
} from "../../../redux/pricebook/actionCreator";
import {
  getItem,
  setItem,
  removeItem,
} from "../../../utility/localStorageControl";
import { useHistory, useLocation } from "react-router-dom";
import { getAllProductList } from "../../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const { Option } = Select;
const { Dragger } = Upload;

const AddPriceBook = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  let isMounted = useRef(true);
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  const [RegisterNameList, setRegisterNameList] = useState([]);
  const [PriceBookData, setPriceBookData] = useState({});
  const [loading, setLoading] = useState(false);

  // fetch register name
  useEffect(() => {
    async function fetchPriceBookData() {
      if (location.state) {
        const getpriceBookData = await dispatch(
          getpriceBookById(location.state.price_book_id)
        );
        if (isMounted.current)
          setPriceBookData(getpriceBookData.PriceBookIdData);
      }
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterNameList());
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.registerNameList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchPriceBookData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  let localData = getItem("setupCache");
  const checkPriceBookAllreadyExit = (formData) => {
    return localData.productPriceBooks?.find(
      (val) =>
        val.register_assigned_to._id == formData.register_assigned_to &&
        val.order_type == formData.order_type
    );
  };
  const handleSubmit = async (formData) => {
    setLoading(true);
    if (checkPriceBookAllreadyExit(formData)) {
      Modal.error({
        title: "Unable to create price book. This price book already exists.",
      });
      return;
    } else {
      setState({
        ...state,
        submitValues: formData,
      });

      let price_book_id =
        location && location.state ? location.state.price_book_id : null;

      const getAddedPricebook = await dispatch(
        addOrUpdatePriceBook(formData, price_book_id)
      );

      if (
        getAddedPricebook &&
        getAddedPricebook.PriceBookData &&
        !getAddedPricebook.error
      ) {
        if (price_book_id) {
          let productResponse = await dispatch(getAllProductList());
          if (productResponse && productResponse.productList) {
            setLoading(false);
            history.push("/products/pricebook");
          } else {
            setLoading(false);
            history.push("/products/pricebook");
          }
        } else {
          setLoading(false);
          history.push("/products/pricebook");
        }
      }
    }
  };
  useEffect(() => {
    if (PriceBookData) {
      setState({
        ...state,
        PriceBookData,
      });
      form.setFieldsValue({
        price_book_name: PriceBookData.price_book_name,
        register_assigned_to: PriceBookData.register_assigned_to,
        order_type: PriceBookData.order_type,
      });
    }
  }, [PriceBookData]);

  const fileList = [
    {
      uid: "1",
      name: "1.png",
      status: "done",
      url: "",
      thumbUrl: "",
    },
  ];
  return (
    <Main className="padding-top-form">
      <br></br>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Price Book Details</Heading>
            <span>
              A Price Book is used to override the product’s base price or a
              particular register or order type.{" "}
            </span>
            <span>
              Eg: You can have different prices for take away and dine in
              orders.{" "}
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="price_book_name"
                label="Price Book Name"
                rules={[
                  {
                    min: 3,
                    message:
                      "Price book name must be at least 3 characters long",
                  },
                  {
                    max: 40,
                    message:
                      "APrice book name cannot be more than 60 characters long.",
                  },
                  { required: true, message: "Price book name required" },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Price book name"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                name="register_assigned_to"
                initialValue="Wine"
                label="Register"
                rules={[{ required: true, message: "Register type required" }]}
              >
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  placeholder="Select a Register"
                >
                  {RegisterNameList.map((groupedData) => (
                    <Option key={groupedData._id} value={groupedData._id}>
                      {groupedData.register_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="order_type"
                initialValue="Wine"
                label="Order Type"
                rules={[{ required: true, message: "Order type required" }]}
              >
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  placeholder="Select a type"
                >
                  <Option value="all_orders">All Orders</Option>
                  <Option value="take_away">Take Away</Option>
                  <Option value="delivery">Delivery</Option>
                  <Option value="dive_in">Dine In</Option>
                </Select>
              </Form.Item>
              <div className="add-form-action" style={{ float: "right" }}>
                <Form.Item>
                  <NavLink to="/products/pricebook" style={{ marginRight: 10 }}>
                    <Button
                      size="medium"
                      style={{
                        border: "1px solid #d9d9d9",
                      }}
                    >
                      Go Back
                    </Button>
                  </NavLink>
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
                              paddingBottom: "1px",
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
            </Form>
          </Col>
        </Row>
      </Cards>
    </Main>
  );
};

export default AddPriceBook;
