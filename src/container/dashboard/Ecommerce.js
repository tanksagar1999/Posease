import React, { Suspense, useEffect, useState, useRef } from "react";
import { Row, Col, Skeleton, Empty, Divider, Button } from "antd";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import { getAlldashboradData } from "../../redux/dashboard/actionCreator";
import { useDispatch } from "react-redux";
import { ViewSummary } from "./ViewSummary";
import commonFunction from "../../utility/commonFunctions";
import "./ecommerce.css";
import { DailyOverview } from "./overview/performance/DailyOverview";
import { WebsitePerformance } from "./overview/performance/WebsitePerformance";
import { TopSellingProduct } from "./overview/ecommerce/TopSellingProduct";
import { getItem } from "../../utility/localStorageControl";
import { Figure7, BannerNormal } from "../Application/Style";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useHistory, NavLink } from "react-router-dom";
const Ecommerce = () => {
  const dispatch = useDispatch();
  const [dashBoardData, setDashBoardData] = useState();
  let isMounted = useRef(true);
  const viewSummaryHideAndShow = useRef();
  useEffect(() => {
    async function fetchDashboardDetails() {
      const getDashboardData = await dispatch(getAlldashboradData());
      if (
        isMounted.current &&
        getDashboardData &&
        getDashboardData.dashboardDetails
      )
        setDashBoardData(getDashboardData.dashboardDetails);
    }
    if (isMounted.current) {
      fetchDashboardDetails();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let [viewSummaryData, setViewSummaryData] = useState();

  return (
    <>
      <Main
        className="padding-top-form mobilepad_frm"
        style={{
          margin: "95px 0 0 0",
        }}
      >
        <Row justify="center" gutter={25} type="flex">
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <DailyOverview dashBoardDataDetails={dashBoardData} />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <WebsitePerformance />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <TopSellingProduct dashBoardDataDetails={dashBoardData} />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24} className="need-help">
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <div className="full-width-table to-sel-pad top_selltab">
                <Cards title="Recent Activity ">
                  {dashBoardData &&
                  dashBoardData.recent_activity &&
                  dashBoardData.recent_activity.length == 0 ? (
                    <div style={{ display: "table", margin: "54px auto" }}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  ) : (
                    dashBoardData &&
                    dashBoardData.recent_activity &&
                    dashBoardData.recent_activity.map((item, index) => {
                      return (
                        <>
                          <div key={index} className="recent_activity">
                            <Row className="recent_activity_title">
                              <Col xxl={12} lg={12} md={12} xs={12}>
                                <h3>
                                  {item.action == "close"
                                    ? "Shift Closed"
                                    : "Shift Open"}
                                </h3>
                              </Col>
                              <Col xxl={12} lg={12} md={12} xs={12}>
                                <div>
                                  <small style={{ float: "right" }}>
                                    {" "}
                                    {commonFunction.convertToDate(
                                      item.actual_time,
                                      "MMM DD, Y, h:mm A"
                                    )}
                                  </small>
                                </div>
                              </Col>
                            </Row>
                            <div>
                              <small>
                                {item.register_id?.register_name} | {rsSymbol}
                                {Number(
                                  item.closing_balance != undefined
                                    ? item.closing_balance
                                    : item.opening_balance
                                ).toFixed(2)}{" "}
                                by {item.userName}
                              </small>
                              {item.action == "close" && (
                                <small
                                  className="folat-right"
                                  onClick={() => {
                                    setViewSummaryData(item);
                                    viewSummaryHideAndShow.current.showModal();
                                  }}
                                >
                                  View Summary
                                </small>
                              )}
                            </div>
                            <Divider style={{ margin: "10px 0px" }} />
                          </div>
                        </>
                      );
                    })
                  )}
                </Cards>
              </div>
            </Suspense>
          </Col>
        </Row>
        <ViewSummary
          ref={viewSummaryHideAndShow}
          viewSummaryData={viewSummaryData}
        />
      </Main>
    </>
  );
};

export default Ecommerce;
