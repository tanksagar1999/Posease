import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { AuthWrapper } from "./style";
import Heading from "../../../../components/heading/heading";
import {
  register,
  login,
} from "../../../../redux/authentication/actionCreator";
import { Checkbox } from "../../../../components/checkbox/checkbox";

const SignUp = () => {
  const [errMsg, setErrmsg] = useState();
  const [loading, setLoader] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    checked: null,
  });

  const handleSubmit = async (formData) => {
    setLoader(true);
    const getResponseUserRegistered = await dispatch(
      register(formData, history)
    );
    if (
      getResponseUserRegistered &&
      getResponseUserRegistered.data &&
      !getResponseUserRegistered.data.error
    ) {
      // history.push("/login");

      let response = await dispatch(login(formData, history));

      if (response?.data?.error) {
        setErr(true);
        setErrMsg(response.data.message);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } else {
      if (getResponseUserRegistered?.err?.error) {
        setLoader(false);
        setErrmsg(getResponseUserRegistered.err.message);
      }
    }
  };

  const onChange = (checked) => {
    setState({ ...state, checked });
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Already have an account?{" "}
        <NavLink to="/login" style={{ color: "#008cba" }}>
          Sign In
        </NavLink>
      </p>
      <div className="auth-contents">
        <Form name="register" onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign Up to <span className="color-secondary">PosEase</span>
          </Heading>
          <Form.Item
            label="Organization Name"
            name="shop_name"
            rules={[
              {
                required: true,
                message: "Please enter your organization name",
              },
            ]}
          >
            <Input
              placeholder="Organization name"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <p style={{ display: "none" }}>{errMsg}</p>
          <Form.Item
            name="email"
            label="Email Address"
            validateStatus={
              errMsg == "Email is already exist." ? "error" : false
            }
            help={errMsg == "Email is already exist." ? errMsg : null}
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Invalid Email Address",
              },
            ]}
          >
            <Input
              placeholder="Email"
              style={{ marginBottom: 10 }}
              onChange={() => setErrmsg()}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <Form.Item
            name="number"
            label="Mobile No"
            validateStatus={
              errMsg == "Mobile Number is already exist." ? "error" : false
            }
            help={errMsg == "Mobile Number is already exist." ? errMsg : null}
          >
            <Input
              placeholder="Mobile Number"
              style={{ marginBottom: 10 }}
              onChange={() => setErrmsg()}
            />
          </Form.Item>
          <Form.Item
            name="checkbox"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "You must agree to Terms & Conditions and Privacy Policy"
                        )
                      ),
              },
            ]}
          >
            <div className="auth-form-action">
              <Checkbox onChange={onChange}>
                Creating an account means you’re okay with our Terms of Service
                and Privacy Policy
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              className="btn-create"
              htmlType="submit"
              type="primary"
              size="large"
            >
              {loading ? "Loading..." : "Create Account"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export { SignUp };
