import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthWrapper } from "./style";
import { login } from "../../../../redux/authentication/actionCreator";
import Heading from "../../../../components/heading/heading";

const SignIn = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loading);
  const [form] = Form.useForm();

  const handleSubmit = async (formData) => {
    let response = await dispatch(login(formData, history));
    if (response?.data?.error) {
      setErr(true);
      setErrMsg(response.data.message);
    }
  };

  return (
    <AuthWrapper>
      <p className="auth-notice blong_clr">
        Don&rsquo;t have an account?{" "}
        <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form
          name="login"
          form={form}
          onFinish={(value) => handleSubmit(value)}
          layout="vertical"
          className="comman-input"
        >
          <Heading as="h3">
            Sign in to <span className="color-secondary">PosEase</span>
          </Heading>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
              {
                type: "email",
                message: "Invalid Email Address",
              },
            ]}
            validateStatus={
              errMsg == "Invalid Email Address" && err ? "error" : false
            }
            help={errMsg == "Invalid Email Address" && err ? errMsg : null}
          >
            <Input
              placeholder="Email"
              style={{ marginBottom: 10 }}
              onChange={() => {
                setErrMsg("");
              }}
            />
          </Form.Item>
          <div style={{ display: "none" }}>
            <p>{errMsg}</p>
          </div>
          <Form.Item
            name="password"
            label="Password"
            validateStatus={
              errMsg == "Please enter valid password" ? "error" : false
            }
            help={errMsg == "Please enter valid password" ? errMsg : null}
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              className="password_hgt"
              style={{ marginBottom: "10px" }}
              onChange={() => {
                setErrMsg("");
              }}
            />
          </Form.Item>
          <div className="auth-form-action blong_clr">
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button
              className="btn-signin"
              htmlType="submit"
              type="primary"
              size="large"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export { SignIn };
