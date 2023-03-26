import React, { lazy, Suspense } from "react";
import { Row, Col, Skeleton } from "antd";
import { Cards } from "../../components/cards/frame/cards-frame";

import { Main } from "../styled";

const TradeOverview = lazy(() =>
  import("./overview/leaderboard/TradeOverview")
);

const RestaurantSubscribers = lazy(() =>
  import("./overview/leaderboard/RestaurantSubscribers")
);

const AdminDashboard = () => {
  return (
    <>
      <Main className="padding-top-form">
        <Row gutter={25}>
          <Col xxl={24} xl={24} lg={24} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              trad
              {/* <TradeOverview /> */}
            </Suspense>
          </Col>
        </Row>
        {/* <Row gutter={25}>
          <Col xxl={24} xl={24} lg={24} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <RestaurantSubscribers />
            </Suspense>
          </Col>
        </Row> */}
      </Main>
    </>
  );
};

export default AdminDashboard;
