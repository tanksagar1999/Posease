import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Form, Input, Button, message } from "antd";

import { AuthWrapper } from "./style";
import Heading from "../../../../components/heading/heading";
import { forgotPassword } from "../../../../redux/authentication/actionCreator";

const ForgotPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const sentResetLinkToUser = await dispatch(forgotPassword(formData));
    if (sentResetLinkToUser && sentResetLinkToUser.data) {
      message.success({
        content: "send verification link your email add",
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
      history.push("/login");

      // history.push(
      //   `/resetPassword?token=${sentResetLinkToUser.data.data.token}`
      // );
    }
  };

  return (
    <AuthWrapper>
      <div className="auth-contents forgot-screeen">
        <Form name="forgotPass" onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">Forgot Password?</Heading>
          <p className="forgot-text">
            Enter the email address you used when you joined and we’ll send you
            instructions to reset your password.
          </p>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email address",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Email" style={{ marginBottom: 10 }} />
          </Form.Item>

          <div className="auth-form-action blong_clr">
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
              Send Reset Instructions
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export { ForgotPassword };
