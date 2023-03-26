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
import { addOrUpdateDyno } from "../../../../../redux/onlineOrder/actionCreator";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const addDyno = () => {
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
          dynoUrl: location?.state?.data?.url,
          registerId: FIlteredRegisterID?._id,
        });
        form.setFieldsValue({
          dynoUrl: location?.state?.data?.url,
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
    let response;
    if (location?.state?.data?.id) {
      response = await dispatch(
        addOrUpdateDyno(formData, location?.state?.data?.id)
      );
    } else {
      response = await dispatch(addOrUpdateDyno(formData));
    }

    if (response) {
      const getRegisterList = await dispatch(getAllRegisterList());
      if (!getRegisterList.error && getRegisterList.RegisterList) {
        setLoading(false);
        history.push(`/settings/dyno`);
      }
    } else {
      setLoading(false);
    }
  };

  function checkBrecketIsClose(expr) {
    const holder = [];
    const openBrackets = ["("];
    const closedBrackets = [")"];
    for (let letter of expr) {
      if (openBrackets.includes(letter)) {
        holder.push(letter);
      } else if (closedBrackets.includes(letter)) {
        const openPair = openBrackets[closedBrackets.indexOf(letter)];
        if (holder[holder.length - 1] === openPair) {
          holder.splice(-1, 1);
        } else {
          holder.push(letter);
          break;
        }
      }
    }
    return holder.length === 0;
  }
  function containsEmpty(a) {
    return (
      []
        .concat(a)
        .sort()
        .reverse()
        .pop() === ""
    );
  }
  function checkBracketisBlank(value) {
    if (value.match(/\(.*?\)/g) != null) {
      let arry = value.match(/\(.*?\)/g).map((x) => x.replace(/[()]/g, ""));
      return containsEmpty(arry);
    }
  }
  function checkMinusSign(value) {
    let checkArray = value.split("),");
    if (checkArray.length > 0) {
      let FilterData = checkArray.filter(
        (val) =>
          val.charAt(val.indexOf("(") + 1) == "-" ||
          val.charAt(val.indexOf(")") - 1) == "-"
      );
      return FilterData.length > 0 ? true : false;
    } else {
      return false;
    }
  }
  const checkIsNumber = (value) => {
    if (value != "") {
      let tableNosArray = value.split("),");
      let finalTableArray = [];
      let tableNosName;
      let tableNosRange;
      let splitedTbs;
      let roomArray = [];
      let i;
      tableNosArray.forEach((items) => {
        let inputNumberItem = items[0];
        if (items[0] == 1) {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            tableNosRange = items.split(",");
            tableNosRange.forEach((items) => {
              roomArray.push("Table" + " " + items);
            });
          }

          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
          if (i == 1) {
            finalTableArray.push({
              name: "Table",
              status: "Empty",
              rows: roomArray,
            });
          }
        } else if (isNaN(inputNumberItem) && items && items.indexOf("-") > -1) {
          splitedTbs = items.split("(");

          tableNosName = splitedTbs[0];
          tableNosRange = splitedTbs[1];
          let roomCharArray = [];

          tableNosRange = tableNosRange.replace(")", "");

          tableNosRange = tableNosRange.split("-");
          tableNosRange[0] = parseInt(tableNosRange[0]);
          tableNosRange[1] = parseInt(tableNosRange[1]);

          if (tableNosRange[0] > tableNosRange[1]) {
            for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
              roomCharArray.push("Table" + " " + i);
            }
          } else {
            for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
              roomCharArray.push(tableNosName + " " + i);
            }
          }

          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else if (items && items.indexOf(",") > -1) {
          let tempTables = items.split("(");
          tableNosName = tempTables[0];
          tableNosRange = tempTables[1];
          tableNosRange = tableNosRange.replace(")", "");
          tableNosRange = tableNosRange.split(",");
          let roomCharArray = [];
          tableNosRange.forEach((items) => {
            roomCharArray.push(tableNosName + " " + items);
          });
          finalTableArray.push({
            name: tableNosName,
            status: "Empty",
            rows: roomCharArray,
          });
        } else {
          if (items.indexOf("-") > -1) {
            tableNosRange = items.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomArray.push("Table" + " " + i);
              }
            }
          } else {
            let tempTables = items.split("(");
            tableNosName = tempTables[0];
            tableNosRange = items.split(",");

            tableNosRange.forEach((items) => {
              tempTables[1].indexOf(")") > -1
                ? finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1].slice(0, -1)],
                  })
                : finalTableArray.push({
                    name: tableNosName,
                    status: "Empty",
                    rows: [tableNosName + tempTables[1]],
                  });
            });
          }
          i = 1;
          finalTableArray.forEach((item) => {
            if (item.name == "Table") {
              i = 2;
              item.rows = roomArray;
            }
          });
        }
      });

      let filterA = finalTableArray.filter((val) => val.rows.length == 0);

      if (filterA.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const checkFirstNumber = (value) => {
    let array = value.split("),");

    if (array.length > 0) {
      let A;
      let B;
      array.map((k) => {
        if (k.indexOf("-") > -1) {
          let splitArray = k.split("-");
          splitArray.map((j) => {
            if (j.indexOf(")") > -1) {
              if (j.split(")")[0]) {
                B = parseInt(j.split(")")[0]);
              }
            } else {
              if (j.split("(")[1]) {
                A = parseInt(j.split("(")[1]);
              }
            }
          });
        }
      });

      if (A && B && A >= B) {
        return true;
      } else if (A && B && A < B) {
        return false;
      }
    }
  };

  const onChangeprint = (e) => {
    setprint(e.target.checked);
  };

  const onChangelogo = (e) => {
    setlogo(e.target.checked);
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
            <span>
              Accept and manage zomato,swiggy order inside Posease. Contact our
              support for Integration
            </span>
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
              onFieldsChange={(val, allFileds) =>
                handleFormChange(val, allFileds)
              }
              onChange={() => setBingageErr(false)}
            >
              <Form.Item name="dynoUrl" label="Dyno URL">
                <Input style={{ marginBottom: 10 }} placeholder="Dyno URL" />
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
                  onClick={() => history.push("/settings/dyno")}
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

export { addDyno };
