import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import * as QueryString from "query-string";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Form, Input, Button } from "antd";
import { AuthWrapper } from "./style";
import Heading from "../../../../components/heading/heading";
import { resetPassword } from "../../../../redux/authentication/actionCreator";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const queryString = QueryString.parse(location.search);
  const handleSubmit = async (formData) => {
    await dispatch(resetPassword(formData, queryString.token));
    history.push(`/login`);
  };

  return (
    <AuthWrapper>
      <div className="auth-contents">
        <Form name="forgotPass" onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">Reset Password</Heading>
          <Form.Item
            label="Password"
            name="new_password"
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Please enter confirm password",
              },
            ]}
          >
            <Input.Password
              placeholder="Confirm password"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <div className="auth-form-action">
            <NavLink className="forgot-pass-link" to="/login">
              Sign In
            </NavLink>
          </div>
          <Form.Item>
            <Button
              className="btn-reset"
              htmlType="submit"
              type="primary"
              size="large"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export { ResetPassword };
