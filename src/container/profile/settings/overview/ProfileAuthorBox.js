import React, { useState, useEffect } from "react";
import { Upload, Form } from "antd";
import FeatherIcon from "feather-icons-react";
import { Link, NavLink, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import propTypes from "prop-types";
import { ProfileAuthorBox } from "./style";
import Heading from "../../../../components/heading/heading";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import { getItem, setItem } from "../../../../utility/localStorageControl";
import {
  SaveBasicDetail,
  getShopDetail,
} from "../../../../redux/shop/actionCreator";
import "../setting.css";
import { DeleteOutlined } from "@ant-design/icons";

const AuthorBox = () => {
  const { path } = useRouteMatch();
  const [form] = Form.useForm();
  const userDetail = getItem("userDetails");
  const dispatch = useDispatch();
  const [state, setState] = useState({
    profileDetail: {},
  });

  const { shopData } = useSelector(
    (state) => ({
      shopData: state.shop.shopData,
    }),
    shallowEqual
  );
  const [selectedFile, setImage] = useState("");
  const [selectedName, setName] = useState("");

  useEffect(() => {
    setImage(shopData.shop_logo);
    setName(shopData.shop_name);
  }, [shopData]);

  useEffect(() => {
    dispatch(getShopDetail("sell", userDetail._id));
  }, []);
  const handleSubmit = async (values) => {
    let formdata = new FormData();
    formdata.append("shop_logo", selectedFile);
    const details = await dispatch(SaveBasicDetail(values, userDetail._id));
    if (details) {
      setImage(details.shop_logo);
    }
  };

  const handleupload = async (info) => {
    if (info.file.status === "uploading") {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        let allSetupcache = getItem("setupCache");
        allSetupcache.shopDetails.shop_logo = reader.result;
        setItem("setupCache", allSetupcache);
      });
      reader.readAsDataURL(info.file.originFileObj);

      let formdata = new FormData();
      formdata.append("shop_logo", info.file.originFileObj);

      const savedBasicDetails = await dispatch(
        SaveBasicDetail(formdata, userDetail._id)
      );

      if (savedBasicDetails.payload) {
        const profileDetail = await dispatch(getShopDetail("", userDetail._id));
        setImage(savedBasicDetails.payload.shop_logo);
        setState({ profileDetail });
      }
    }
  };

  const RemoveImg = async () => {
    let formdata = new FormData();
    formdata.append("shop_logo", false);

    const savedBasicDetails = await dispatch(
      SaveBasicDetail(formdata, userDetail._id)
    );

    if (savedBasicDetails.payload) {
      if (savedBasicDetails.payload) {
        const profileDetail = await dispatch(getShopDetail("", userDetail._id));
        setImage(savedBasicDetails.payload.shop_logo);
        let allSetupcache = getItem("setupCache");
        allSetupcache.shopDetails.shop_logo = "false";
        setItem("setupCache", allSetupcache);
        setState({ profileDetail });
      }
    }
  };

  return (
    <ProfileAuthorBox>
      <Cards headless>
        <div className="author-info">
          <Form form={form} name="editAccount" onFinish={handleSubmit}>
            <figure>
              {selectedFile == "false" ||
              selectedFile == undefined ||
              selectedFile == "" ? (
                <img
                  src={require("../../../../static/img/users/1.png")}
                  alt=""
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <div className="profile_icons">
                  <img
                    src={selectedFile}
                    alt=""
                    className="hoverImg"
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                    }}
                  />
                  <DeleteOutlined
                    className="delete_hover"
                    size="25px"
                    onClick={() => RemoveImg()}
                  />
                </div>
              )}

              <Upload showUploadList={false} onChange={handleupload}>
                <Link to="#">
                  <FeatherIcon icon="camera" size={16} />
                </Link>
              </Upload>
            </figure>
          </Form>
          <figcaption>
            <div className="info">
              <Heading as="h4">{selectedName}</Heading>
            </div>
          </figcaption>
        </div>
        <nav className="settings-menmulist">
          <ul>
            {userDetail.is_shop ? (
              <>
                <li>
                  <NavLink to={`${path}/shop`}>
                    <FeatherIcon icon="shopping-bag" size={14} />
                    Shop
                  </NavLink>
                </li>
                {getItem("bingage_enable") && (
                  <li>
                    <NavLink to={`${path}/bingages`}>
                      <FeatherIcon icon="target" size={14} />
                      CRM
                    </NavLink>
                  </li>
                )}
                {getItem("dyno_api_enable") && (
                  <li>
                    <NavLink to={`${path}/dyno`}>
                      <FeatherIcon icon="shopping-cart" size={14} />
                      Online Orders
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to={`${path}/registers`}>
                    <FeatherIcon icon="settings" size={14} />
                    Registers
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${path}/taxes`}>
                    <FeatherIcon icon="file" size={14} />
                    Taxes
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${path}/users`}>
                    <FeatherIcon icon="users" size={14} />
                    Users
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to={`${path}/discount-rules`}>
                    <FeatherIcon icon="target" size={14} />
                    Discount Rules
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to={`${path}/additional-charges`}>
                    <FeatherIcon icon="tag" size={14} />
                    Additional Charge
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${path}/custom-fields`}>
                    <FeatherIcon icon="folder-plus" size={14} />
                    Custom Fields
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${path}/preferences`}>
                    <FeatherIcon icon="stop-circle" size={14} />
                    Preferences
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${path}/printers`}>
                    <FeatherIcon icon="printer" size={14} />
                    Printers
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to={`${path}/shop`}>
                    <FeatherIcon icon="shopping-bag" size={14} />
                    Shop
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Cards>
    </ProfileAuthorBox>
  );
};

AuthorBox.propTypes = {
  match: propTypes.object,
};

export { AuthorBox };
