import React, { useState, useRef, useEffect } from "react";
import { Checkbox, Row, Col, Input, Form, Select, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import "../../setting.css";
import TextArea from "antd/lib/input/TextArea";
import { InfoCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { setItem } from "../../../../../utility/localStorageControl";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import {
  addOrUpdateBingage,
  getAllBingageList,
} from "../../../../../redux/bingage/actionCreator";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const AddIntegration = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [checkedprint, setprint] = useState(false);
  const [checkedlogo, setlogo] = useState(false);
  const [bingageErr, setBingageErr] = useState(false);
  const [bingageAPIKeyErr, setBingageAPIKeyErr] = useState(false);
  const [RegisterList, setRegisterList] = useState([]);
  const [bingageList, setBingageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabledSave, setDisabledSave] = useState(false);
  const [apiData, setApiData] = useState();
  useEffect(() => {
    fetchBingagesList();
    async function fetchRegisterList() {
      const getRegisterList = await dispatch(getAllRegisterList("sell"));
      if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
        setRegisterList(getRegisterList.RegisterList);
      if (location && location.state && location.state.data) {
        let FIlteredRegisterID = getRegisterList.RegisterList.find(
          (val) => val?.register_name == location?.state?.data?.register_name
        );
        setDisabledSave(true);
        setApiData({
          bingageKey: location?.state?.data?.receipt_number_prefix,
          registerId: FIlteredRegisterID?._id,
        });
        form.setFieldsValue({
          bingageKey: location?.state?.data?.receipt_number_prefix,
          registerId: FIlteredRegisterID?._id,
        });
      }
    }

    if (isMounted.current) {
      fetchRegisterList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchBingagesList = async () => {
    const getBinagesList = await dispatch(getAllBingageList());
    setBingageList(getBinagesList);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    let getBingageResponse = "";
    if (location && location.state && location.state.data) {
      let FIlteredRegisterData = bingageList.find(
        (val) => val?.registerId?._id == formData?.registerId
      );
      if (
        (location &&
          location.state &&
          location.state.data &&
          location.state.data.register_name ==
            FIlteredRegisterData?.registerId?.register_name) ||
        formData?.registerId !== FIlteredRegisterData?.registerId?._id
      ) {
        getBingageResponse = await dispatch(
          addOrUpdateBingage(formData, location?.state?.data?.id)
        );
      } else {
        setLoading(false);
        setBingageAPIKeyErr(
          "Integration already exists for the selected register."
        );
      }
    } else {
      getBingageResponse = await dispatch(addOrUpdateBingage(formData, ""));
    }
    if (
      getBingageResponse &&
      getBingageResponse.error &&
      getBingageResponse.error == "Unauthorized"
    ) {
      setLoading(false);
      setBingageErr(
        "Bingage API Key is invalid, make sure you've entered the right key."
      );
      return 1;
    } else if (getBingageResponse) {
      const getRegisterList = await dispatch(getAllRegisterList());

      if (!getRegisterList.error) {
        setLoading(false);
        history.push(`/settings/bingages`);
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
          currentFormData[findData.name[0]] =
            findData.name[0] == "tax_percentage"
              ? Number(findData.value)
              : findData.value;
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
            <Heading as="h4">Add Integration</Heading>
            <span>Contact posease support team for CRM integration.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              name="add Register"
              onFinish={handleSubmit}
              onChange={() => setBingageErr(false)}
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
            >
              <Form.Item name="bingageKey" label="CRM API Key">
                <Input style={{ marginBottom: 10 }} placeholder="CRM API Key" />
              </Form.Item>

              <Form.Item name="registerId" label="Linked Register">
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  placeholder="Select a Register"
                >
                  {RegisterList.map((val) => {
                    return <Option value={val._id}>{val.register_name}</Option>;
                  })}
                </Select>
              </Form.Item>
              {bingageAPIKeyErr && (
                <p style={{ color: "red" }}>{bingageAPIKeyErr}</p>
              )}
              {bingageErr && <p style={{ color: "red" }}>{bingageErr}</p>}
              <Form.Item style={{ float: "right" }}>
                <Button
                  onClick={() => history.push("/settings/bingages")}
                  className="go-back-button"
                  size="medium"
                  type="white"
                  style={{ marginRight: "10px" }}
                >
                  Go Back
                </Button>
                <Button
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
    </>
  );
};

export { AddIntegration };
