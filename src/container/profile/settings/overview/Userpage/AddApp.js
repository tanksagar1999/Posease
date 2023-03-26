import React, { useState, useRef, useEffect } from "react";
import { Table, Checkbox, Row, Col, Input, Divider, Form, Select } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { useHistory, useLocation } from "react-router-dom";
import {
  addOrUpdateappUser,
  getappUserById,
  getAllappUserList,
} from "../../../../../redux/appUser/actionCreator";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "../../setting.css";

const AddApp = () => {
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
  const [appUserData, setAppUserData] = useState({});
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch register name
  useEffect(() => {
    async function fetchAppUserData() {
      if (location.state) {
        const getappUserData = await dispatch(
          getappUserById(location.state.appUser_id)
        );
        if (isMounted.current) setAppUserData(getappUserData.appUserIdData);
      }
    }
    async function fetchRegisterName() {
      const getRgisterNameList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current)
        setRegisterNameList(getRgisterNameList.RegisterList);
    }
    if (isMounted.current) {
      fetchRegisterName();
      fetchAppUserData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleSubmit = async (formData) => {
    setLoading(true);
    formData.role = "app_user";
    let appUser_id =
      location && location.state ? location.state.appUser_id : null;
    const getAddedappUser = await dispatch(
      addOrUpdateappUser(formData, appUser_id)
    );
    if (
      getAddedappUser &&
      getAddedappUser.appUserData &&
      !getAddedappUser.error
    ) {
      const getAllUserList = await dispatch(
        getAllappUserList(formData, appUser_id)
      );
      if (getAllUserList.appUserList) {
        setLoading(false);
        history.push("/settings/users?type=app_user");
      }
    }
  };

  useEffect(() => {
    if (appUserData) {
      form.setFieldsValue({
        pin: appUserData.pin,
        username: appUserData.username,
      });
    }
  }, [appUserData]);
  const handleFormChange = (item, allFileds) => {
    setLoading(false);
  };
  return (
    <>
      <Cards
        marginTop={true}
        title={
          <div className="setting-card-title">
            <Heading as="h4">App User Details</Heading>
            <span>App users have access only to Poster Apps. </span>
            <span>
              An app user will require a PIN to lock and unlock the application.
            </span>
          </div>
        }
      >
        {" "}
        <Form
          form={form}
          onFinish={handleSubmit}
          onFieldsChange={(val, allFileds) => handleFormChange(val, allFileds)}
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form.Item
                name="username"
                label="App User Name"
                rules={[
                  {
                    required: true,
                    message: "App UserName required",
                  },
                  {
                    max: 40,
                    message:
                      "App username cannot be more than 40 characters long.",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="App user name"
                />
              </Form.Item>
              <Form.Item
                name="pin"
                label="App User PIN"
                rules={[
                  {
                    pattern: new RegExp("^[0-9]{4,6}$"),
                    required: true,
                    message: "PIN should be a 4 to 6 digit number",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="4 to 6 digit app user PIN Eg:1234"
                />
              </Form.Item>

              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => history.push("/settings/users?type=app_user")}
                >
                  Go Back
                </Button>
                <Button type="primary" htmlType="submit">
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
            </Col>
          </Row>
        </Form>
      </Cards>
    </>
  );
};

export { AddApp };
