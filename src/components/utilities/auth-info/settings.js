import React from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { SettingDropdwon } from "./auth-info-style";
import { Popover } from "../../popup/popup";
import Heading from "../../heading/heading";
import { NavLink } from "react-router-dom";

const Settings = () => {
  const content = (
    <SettingDropdwon>
      <div className="setting-dropdwon">
        <Row gutter="10" className="top-settings">
          <Col sm={12}>
            <NavLink to="/admin/settings/users/">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="users"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Users</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/shop/">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="shopping-cart"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Shop</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/registers/">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="users"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Registers</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/taxes">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="file"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Taxes</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/custom-fields">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="folder-plus"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Custom Fields</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/additional-charges">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="tag"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Additional Charge</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/preferences">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="stop-circle"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Preferences</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
          <Col sm={12}>
            <NavLink to="/admin/settings/discount-rules">
              <figure className="setting-dropdwon__single d-flex">
                <FeatherIcon
                  icon="target"
                  size="24"
                  color="#BD025D"
                  style={{ marginRight: "10px" }}
                />
                <figcaption>
                  <Heading as="h5">Discount Rules</Heading>
                  <p>Third party themes that are compatible </p>
                </figcaption>
              </figure>
            </NavLink>
          </Col>
        </Row>
      </div>
    </SettingDropdwon>
  );

  return (
    <div className="settings">
      <Popover placement="bottomRight" content={content} action="click">
        <Link to="#" className="head-example">
          <FeatherIcon icon="settings" size={20} />
        </Link>
      </Popover>
    </div>
  );
};

export default Settings;
