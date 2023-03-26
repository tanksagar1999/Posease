import React, { useState } from "react";
import { Row, Col, Tabs, Breadcrumb } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { NavLink } from "react-router-dom";
import { Main } from "../../styled";
import { Button } from "../../../components/buttons/buttons";
import { New } from "../Incoming/New";
import { Accepted } from "../Incoming/Accepted";
import { Ready } from "../Incoming/Ready";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { SettingOutlined } from "@ant-design/icons";
import { TopToolBox } from "../Style";
import { useEffect } from "react";
import {
  createOnlineTakeAway,
  setOrderTickets,
  setItem,
  getItem,
  acceptOnlineOrderList,
} from "../../../utility/localStorageControl";
import { useDispatch, useSelector } from "react-redux";
const IncomingOrderBuilder = (props) => {
  const { currentRegisterData, orderTabChange } = props;
  const { TabPane } = Tabs;
  const [activeTab, changeTab] = useState();
  const [modalVisible, setModelVisible] = useState(false);
  const [orderList, setOrderList] = useState([]);
  // const [onlineOrderCount, setOnlineOrderCount] = useState(0)
  const { onlineOrderCount } = useSelector((state) => {
    return {
      onlineOrderCount: state.kitchenUser.kitchenUserList?.length,
    };
  });

  const [acceptOrdersCount, setAcceptOrderCount] = useState(0);
  useEffect(() => {
    setAcceptOrderCount(acceptOnlineOrderList()?.length);
  }, [acceptOnlineOrderList()?.length]);

  return (
    <>
      <Cards headless>
        <TopToolBox>
          <Row
            gutter={15}
            style={{ marginBottom: "0.5% ", marginLeft: "14px" }}
          >
            <Col lg={9} xs={24}></Col>
            <Col xxl={1} lg={1} xs={1}></Col>

            <div className="table-toolbox-menu">
              <Tabs
                defaultActiveKey="1"
                activeKey={activeTab}
                onChange={changeTab}
                size="small"
                type="card"
              >
                <TabPane
                  tab={
                    <div className="drft_counno">
                      New Orders
                      <span>{onlineOrderCount}</span>
                    </div>
                  }
                  key="first"
                  style={{ marginRight: "20px" }}
                >
                  {" "}
                </TabPane>
                <TabPane
                  tab={
                    <div className="drft_counno">
                      Accepted Orders
                      <span>{acceptOrdersCount}</span>
                    </div>
                  }
                  key="second"
                  style={{ marginRight: "20px" }}
                ></TabPane>
                {/* <TabPane tab="Ready" key="third"></TabPane> */}
              </Tabs>
            </div>
          </Row>
        </TopToolBox>
        {activeTab != "second" && activeTab !== "third" ? (
          <New
            currentRegisterData={currentRegisterData}
            changeTab={changeTab}
          />
        ) : (
          ""
        )}
        {activeTab == "second" &&
        activeTab != "one" &&
        activeTab !== "third" ? (
          <Accepted
            currentRegisterData={currentRegisterData}
            changeTab={changeTab}
          />
        ) : (
          ""
        )}
        {activeTab == "third" && activeTab != "two" && activeTab != "one" ? (
          <Ready
            currentRegisterData={currentRegisterData}
            changeTab={changeTab}
            orderTabChange={orderTabChange}
          />
        ) : (
          ""
        )}
      </Cards>
    </>
  );
};

export { IncomingOrderBuilder };
