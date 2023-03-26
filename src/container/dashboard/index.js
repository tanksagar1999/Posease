import React from "react";
import { Row, Col } from "antd";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";

const AdminDashboard = () => {
  return (
    <>
      <Main className="padding-top-form">
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                <h2>Welcome to Poster</h2>
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default AdminDashboard;
