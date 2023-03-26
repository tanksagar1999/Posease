import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  InputNumber,
  Tooltip,
  TreeSelect,
} from "antd";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import { getAllAddonList } from "../../../redux/addon/actionCreator";
import _ from "lodash";
import {
  getAddonGroupById,
  UpdateAddonGroup,
  getAllAddonGroupList,
} from "../../../redux/AddonGroup/actionCreator";
import { InfoCircleFilled } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { getItem } from "../../../utility/localStorageControl";

const EditAddonGroup = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const history = useHistory();
  const [MinValue, setMinValue] = useState();
  const [MaxValue, setMaxValue] = useState();
  let [addonGroupdetail, setAddonGroupData] = useState([]);
  const [addondata, setAddonData] = useState([]);
  const [values, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [disabledSave, setDisabledSave] = useState(false);
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAddonData() {
      const getAddonGroup = await dispatch(
        getAddonGroupById(props.match.params.id)
      );
      if (isMounted.current) setAddonGroupData(getAddonGroup);
    }

    async function fetchAddon() {
      const getAddon = await dispatch(getAllAddonList("sell"));
      if (isMounted.current)
        if (getAddon.payload) {
          setAddonData(getAddon.payload);
        }
    }
    if (isMounted.current) {
      fetchAddonData();
      fetchAddon();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (addonGroupdetail) {
      setValues(addonGroupdetail.product_addons);

      setDisabledSave(true);
      setApiData({
        addon_group_name: addonGroupdetail.addon_group_name,
        sort_order: addonGroupdetail.sort_order
          ? addonGroupdetail.sort_order
          : "",
        product_addons: addonGroupdetail.product_addons,
        minimum_selectable: addonGroupdetail.minimum_selectable,
        maximum_selectable: addonGroupdetail.maximum_selectable,
      });
      form.setFieldsValue({
        addon_group_name: addonGroupdetail.addon_group_name,
        sort_order: addonGroupdetail.sort_order,
        product_addons: addonGroupdetail.product_addons,
        minimum_selectable: addonGroupdetail.minimum_selectable,
        maximum_selectable: addonGroupdetail.maximum_selectable,
      });
    }
    if (addondata) {
      const data = [];
      if (addondata.length)
        addondata.map((value) => {
          let object = {};
          object.title = value.addon_name;
          object.value = value._id;
          object.key = value._id;
          data.push(object);
        });
      setTreeData(data);
    }
  }, [addonGroupdetail, addondata]);

  const handleSubmit = async (postvalues) => {
    setLoading(true);
    const getAddonGroupdata = await dispatch(
      UpdateAddonGroup(postvalues, props.match.params.id)
    );

    if (!getAddonGroupdata.AddonGroupData.error) {
      let list = await dispatch(getAllAddonGroupList());
      if (list) {
        setLoading(false);
        history.push("/product-options?type=addon_group");
      }
    }
  };

  const handleFormChange = (item, allFileds) => {
    setLoading(false);
    if (apiData) {
      let currentFormData = {};
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          if (findData.name[0] == "sort_order") {
            currentFormData[findData.name[0]] = findData.value
              ? findData.value
              : "";
          } else if (
            findData.name[0] == ("maximum_selectable" || "minimum_selectable")
          ) {
            currentFormData[findData.name[0]] = Number(findData.value);
          } else {
            currentFormData[findData.name[0]] = findData.value;
          }
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
      <Main style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Addon Group</Heading>
              <span>
                Addon groups are used to bunch a set of addons and attach to a
                product. Multiple addons can be chosen from an addon group.{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                autoComplete="off"
                form={form}
                onFinish={handleSubmit}
                onFieldsChange={(val, allFileds) =>
                  handleFormChange(val, allFileds)
                }
              >
                <Form.Item
                  name="addon_group_name"
                  label="Addon Group Name"
                  rules={[
                    {
                      required: true,
                      message: "Addon group name is required.",
                    },
                    {
                      validator: (v, value) => {
                        let allSetupcache = getItem("setupCache");
                        if (allSetupcache && allSetupcache.productAddonGroups) {
                          let addinGroupName = allSetupcache.productAddonGroups.find(
                            (val) =>
                              val.addon_group_name.toLowerCase() ==
                              value.toLowerCase()
                          );
                          if (
                            addinGroupName &&
                            addinGroupName.addon_group_name !=
                              addonGroupdetail.addon_group_name
                          ) {
                            return Promise.reject(
                              value + " already exist in addon Group"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input style={{ marginBottom: 10, width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="product_addons"
                  label="Select Addons"
                  rules={[
                    {
                      message: "Select atleast one addon",
                      required: true,
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch={true}
                    multiple
                    treeData={treeData}
                    value={values}
                    className="minHeight"
                    onChange={setValues}
                    treeCheckable={true}
                    filterTreeNode={(search, item) => {
                      return (
                        item.title
                          .toLowerCase()
                          .indexOf(search.toLowerCase()) >= 0
                      );
                    }}
                    style={{
                      width: "100%",
                      marginBottom: 5,
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="minimum_selectable"
                  rules={[
                    {
                      pattern: new RegExp("^[0-9]{1,10}$"),
                      message: "Please eneter the whole number",
                    },
                  ]}
                  label={
                    <span>
                      Min Selectable &nbsp;&nbsp;
                      <Tooltip
                        title="Minimum selectable item during billing from the addon group"
                        color="#FFFF"
                      >
                        <InfoCircleFilled
                          style={{
                            color: "#AD005A",
                            paddingLeft: "12px !important",
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                    marginRight: 10,
                  }}
                >
                  <Input
                    type="number"
                    min={0}
                    max={MaxValue}
                    initialValue={0}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    style={{ marginBottom: 6 }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="maximum_selectable"
                  rules={[
                    {
                      pattern: new RegExp("^[0-9]{1,10}$"),
                      message: "Please eneter the whole number",
                    },
                  ]}
                  label={
                    <span>
                      Max Selectable &nbsp;&nbsp;
                      <Tooltip
                        title="Maximum selectable items during billing from the addon group"
                        color="#FFFF"
                      >
                        <InfoCircleFilled
                          style={{
                            color: "#AD005A",
                            paddingLeft: "12px !important",
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                >
                  <Input
                    min={MinValue}
                    type="number"
                    initialValue={0}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    style={{ marginBottom: 6 }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="sort_order"
                  label={
                    <span>
                      Sort Order&nbsp;&nbsp;
                      <Tooltip
                        title="Enter an optional numeric value that allow sort the postion"
                        color="#FFFF"
                      >
                        <InfoCircleFilled style={{ color: "#AD005A" }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Variant enter sort order in numeric value",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    style={{ marginBottom: 10 }}
                    min={0}
                    initialValue={0}
                    placeholder="Sort order(optional)"
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                  {/* <InputNumber
                    className="sord_ordf"
                    min={0}
                    initialValue={0}
                    style={{ marginBottom: 10, width: "100%", height: "46px" }}
                    placeholder="Sort order(optional)"
                  /> */}
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options?type=addon_group">
                    <Button size="medium" style={{ marginRight: 10 }}>
                      Go Back
                    </Button>
                  </NavLink>
                  <Button
                    size="medium"
                    type="primary"
                    htmlType="submit"
                    disabled={disabledSave}
                  >
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
              </Form>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default EditAddonGroup;
