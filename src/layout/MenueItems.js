import React, { useEffect, useState } from "react";
import { Menu, Modal, Button } from "antd";
import { useDispatch } from "react-redux";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { getItem } from "../utility/localStorageControl";
import { logOut, LockRegister } from "../redux/authentication/actionCreator";
import { DarkModeAvailable } from "../redux/preference/actionCreator";

const { SubMenu } = Menu;

const MenuItems = ({ darkMode, toggleCollapsed, topMenu, events }) => {
  const userDetails = getItem("userDetails");
  const dispatch = useDispatch();
  const history = useHistory();
  const { path } = useRouteMatch();
  const pathName = window.location.pathname;
  const pathArray = pathName.split(path);
  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split("/");

  const [openKeys, setOpenKeys] = React.useState(
    !topMenu
      ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`]
      : []
  );

  useEffect(() => {
    dispatch(DarkModeAvailable(getItem("dark_mode")));
  }, []);

  const onOpenChange = (keys) => {
    setOpenKeys([keys.length && keys[keys.length - 1]]);
  };
  const onClick = (item) => {
    if (window.outerWidth <= 990) {
      toggleCollapsed(true);
    }
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  const style = {
    position: "absolute",
    bottom: 0,
    borderTop: "2px solid #f5f5f5",
  };

  const [modalVisibleLock, setModelVisibleLock] = useState(false);

  const handleLock = () => {
    dispatch(LockRegister(history));
  };

  const SignOut = (e) => {
    e.preventDefault();
    dispatch(logOut(history));
  };

  const handleCancel = (e) => {
    setModelVisibleLock(false);
  };

  return (
    <>
      <Modal
        title="Sign out"
        destroyOnClose={true}
        visible={modalVisibleLock}
        footer={
          userDetails && userDetails.role !== "admin"
            ? [
                <Button key="1" onClick={handleCancel} type="default">
                  Cancel
                </Button>,
                <Button key="2" onClick={handleLock} type="default">
                  Lock
                </Button>,
                <Button key="3" onClick={SignOut} type="danger">
                  Sign Out
                </Button>,
              ]
            : [
                <Button key="1" onClick={handleCancel} type="default">
                  Cancel
                </Button>,
                <Button key="3" onClick={SignOut} type="danger">
                  Sign Out
                </Button>,
              ]
        }
        width={600}
      >
        <p>Are you sure you want to sign out of posEase?</p>
      </Modal>
      <Menu
        onOpenChange={onOpenChange}
        onClick={onClick}
        mode={!topMenu || window.outerWidth <= 991 ? "inline" : "horizontal"}
        theme={darkMode && "dark"}
        // selectedKeys={!topMenu ? [`${"pricebook"}`] : []}
        defaultOpenKeys={!topMenu ? [`sell`] : []}
        defaultSelectedKeys={[
          userDetails && userDetails.role === "admin" ? "dashboard" : "sell",
        ]}
        // overflowedIndicator={<FeatherIcon icon="more-vertical" />}
        openKeys={openKeys}
      >
        {/*When user logged in with restaurant role */}
        {userDetails &&
        userDetails.is_shop &&
        userDetails.role === "restaurant" ? (
          <>
            <Menu.Item
              key="dashboard"
              onClick={() => history.push(`${path}dashboard`)}
              icon={!topMenu && <FeatherIcon icon="home" />}
            >
              <NavLink to={`${path}dashboard`}>Dashboard</NavLink>
            </Menu.Item>
            <Menu.Item
              key="sell"
              onClick={() => history.push(`${path}sell`)}
              icon={!topMenu && <FeatherIcon icon="shopping-cart" />}
            >
              <NavLink to={`${path}sell`}>Sell</NavLink>
            </Menu.Item>
            <Menu.Item
              key="receipts"
              onClick={() => history.push(`${path}receipts`)}
              icon={!topMenu && <FeatherIcon icon="file-text" />}
            >
              <NavLink to={`${path}receipts`}>Receipts</NavLink>
            </Menu.Item>

            <SubMenu
              key="products"
              icon={!topMenu && <FeatherIcon icon="tag" />}
              title="Manage Product"
            >
              <Menu.Item
                key="products"
                style={{ paddingLeft: 48 + "!important" }}
                className="child-menu"
              >
                <NavLink to={`${path}products`}>Products</NavLink>
              </Menu.Item>
              <Menu.Item key="pricebook">
                <NavLink to={`${path}products/pricebook`}>Price Book</NavLink>
              </Menu.Item>
              <Menu.Item key="product-categories">
                <NavLink to={`${path}product-categories`}>Categories</NavLink>
              </Menu.Item>
              <Menu.Item key="product-options">
                <NavLink to={`${path}product-options`}>Options</NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="customers"
              onClick={() => history.push(`${path}customers`)}
              icon={!topMenu && <FeatherIcon icon="users" />}
            >
              <NavLink to={`${path}customers`}>Customers</NavLink>
            </Menu.Item>
            <Menu.Item
              key="petty"
              onClick={() => history.push(`${path}pettycash`)}
              icon={!topMenu && <FeatherIcon icon="briefcase" />}
            >
              <NavLink to={`${path}pettycash`}>Petty Cash</NavLink>
            </Menu.Item>
            {getItem("inventrory_app_enable") && (
              <Menu.Item
                key="inventory"
                onClick={() => history.push(`${path}inventory`)}
                icon={!topMenu && <FeatherIcon icon="shopping-bag" />}
              >
                <NavLink to={`${path}inventory`}>Inventory</NavLink>
              </Menu.Item>
            )}

            <Menu.Item
              key="all"
              onClick={() => history.push(`${path}appstore`)}
              icon={!topMenu && <FeatherIcon icon="list" />}
            >
              <NavLink to={`${path}appstore`}>App Store</NavLink>
            </Menu.Item>
          </>
        ) : (
          ""
        )}
        {/*When user logged in with admin role */}
        {userDetails && userDetails.role === "admin" ? (
          <>
            {/* <Menu.Item
              key="dashboard"
              onClick={() => history.push(`${path}`)}
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="home"
                    onClick={() => history.push(`${path}`)}
                  />
                )
              }
            >
              <NavLink to={`${path}`}>Dashboard</NavLink>
            </Menu.Item>
            <Menu.Item
              key="enquiry"
              onClick={() => history.push(`${path}/enquiry-management`)}
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="file-text"
                    onClick={() => history.push(`${path}/enquiry-management`)}
                  />
                )
              }
            >
              <NavLink to={`${path}/enquiry-management`}>
                Enquiry Management
              </NavLink>
            </Menu.Item> */}
            <Menu.Item
              key="user-management"
              onClick={() => history.push(`${path}/user-management`)}
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="briefcase"
                    onClick={() => history.push(`${path}/user-management`)}
                  />
                )
              }
            >
              <NavLink to={`${path}/user-management`}>User Management</NavLink>
            </Menu.Item>
            <Menu.Item
              style={style}
              key="signout"
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="log-out"
                    onClick={() => setModelVisibleLock(true)}
                  />
                )
              }
            >
              <NavLink to="#" onClick={() => setModelVisibleLock(true)}>
                {getItem("username")} |{" "}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    marginLeft: "-16px",
                  }}
                >
                  Sign Out
                </span>
              </NavLink>
            </Menu.Item>
          </>
        ) : (
          ""
        )}
        {/*When user logged in with cashier role */}
        {userDetails && userDetails.role === "cashier" ? (
          <>
            {userDetails.has_manager_permission && (
              <Menu.Item
                key="dashboard"
                icon={
                  !topMenu && (
                    <FeatherIcon
                      icon="home"
                      onClick={() => history.push(`${path}dashboard`)}
                    />
                  )
                }
              >
                <NavLink to={`${path}dashboard`}>Dashboard</NavLink>
              </Menu.Item>
            )}
            <Menu.Item
              key="sell"
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="shopping-cart"
                    onClick={() => history.push(`${path}sell`)}
                  />
                )
              }
            >
              <NavLink to={`${path}sell`}>Sell</NavLink>
            </Menu.Item>

            <Menu.Item
              key="receipts"
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="file-text"
                    onClick={() => history.push(`${path}receipts`)}
                  />
                )
              }
            >
              <NavLink to={`${path}receipts`}>Receipts</NavLink>
            </Menu.Item>
            <Menu.Item
              key="petty"
              icon={
                !topMenu && (
                  <FeatherIcon
                    icon="briefcase"
                    onClick={() => history.push(`${path}petty`)}
                  />
                )
              }
            >
              <NavLink to={`${path}petty`}>Petty Cash</NavLink>
            </Menu.Item>
            {userDetails.has_manager_permission && (
              <Menu.Item
                key="customers"
                icon={
                  !topMenu && (
                    <FeatherIcon
                      icon="users"
                      onClick={() => history.push(`${path}customers`)}
                    />
                  )
                }
              >
                <NavLink to={`${path}customers`}>Customers</NavLink>
              </Menu.Item>
            )}
          </>
        ) : (
          ""
        )}
        {/*When user logged in with App user role */}
        {userDetails && userDetails.role === "app_user" ? (
          <>
            <Menu.Item
              key="sell"
              icon={!topMenu && <FeatherIcon icon="list" />}
            >
              <NavLink to={`${path}appstore`}>App Store</NavLink>
            </Menu.Item>
            <Menu.Item
              key="receipts"
              icon={!topMenu && <FeatherIcon icon="message-circle" />}
            >
              <NavLink to={`${path}app/sms-receipts`}>SMS Receipts</NavLink>
            </Menu.Item>
            <Menu.Item
              key="petty"
              icon={!topMenu && <FeatherIcon icon="briefcase" />}
            >
              <NavLink to={`${path}app/analytics`}>Analytics</NavLink>
            </Menu.Item>
          </>
        ) : (
          ""
        )}
      </Menu>
    </>
  );
};

MenuItems.propTypes = {
  darkMode: propTypes.bool,
  topMenu: propTypes.bool,
  toggleCollapsed: propTypes.func,
  events: propTypes.object,
};

export default React.memo(MenuItems);
