import React, { useState, useEffect } from "react";
import { Row, Col, Input, Form } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import { BasicFormWrapper } from "../../../../styled";
import {
  getUserDetail,
  SaveAccountDetail,
} from "../../../../../redux/users/actionCreator";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import _ from "lodash";

const AddAccount = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let [selectedCity, setSelectedCity] = useState("");
  const [userDetailData, setuserDetailData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchUserDetail() {
      const data = await dispatch(getUserDetail("sell"));
      if (data && data.userData) {
        setuserDetailData(data.userData);
      }
    }
    if (isMounted) {
      fetchUserDetail();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);
  useEffect(() => {
    if (userDetailData) {
      setDisabledSave(true);
      setApiData({
        username: userDetailData.username,
        number: userDetailData.number,
        email: userDetailData.email,
      });
      form.setFieldsValue({
        username: userDetailData.username,
        number: userDetailData.number,
        email: userDetailData.email,
      });
    }
  }, [userDetailData]);

  const handleSubmit = async (values) => {
    setLoading(true)
    const savedUserDetails = await dispatch(SaveAccountDetail(values));
    if (!savedUserDetails.error) {
      const data = await dispatch(getUserDetail());
      if (!data.error) {
        setLoading(false)
        setuserDetailData(data.userData);
      }
    }
  };

  const handleFormChange = (item, allFileds) => {
    setLoading(false)
    if (apiData) {
      let currentFormData = {};
      allFileds.map((val) => {
        if (val.name[0] == "city") {
          val.value = item[0].name[0] == "city" ? item[0].value : selectedCity;
        }
      });
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          currentFormData[findData.name[0]] = findData.value;
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
  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Your Account Details</Heading>
            <span>Your details help us serve you better.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form
              form={form}
              name="editAccount"
              onFinish={handleSubmit}
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
            >
              <BasicFormWrapper>
                <Form.Item
                  name="username"
                  label="Your Name"
                  rules={[
                    {
                      message: "Your name must be at least 3 characters long.",
                      min: 3,
                    },
                    {
                      max: 40,
                      message:
                        "Your name cannot be more than 40 characters long.",
                    },
                    { message: "Your name is required", required: true },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} placeholder="your name" />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input disabled style={{ marginBottom: 10, color: '#5A5F7D', backgroundColor: "white" }} />
                </Form.Item>
                <Form.Item
                  name="number"
                  label="Mobile Phone Number"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Mobile phone number must be at least 3 characters long",
                    },
                    { message: "Mobile number is required", required: true },
                  ]}
                >
                  <Input placeholder="Mobile phone number" type="number" />
                </Form.Item>
              </BasicFormWrapper>

              <Form.Item style={{ float: "right", marginTop: "10px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabledSave}
                >
                  {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: "white", margin: "0px 8px" }} spin />} /> : "Save"}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export default AddAccount;
