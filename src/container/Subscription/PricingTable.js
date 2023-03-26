import React from "react";
import { Row, Col, Divider } from "antd";
import { PricingCard, ListGroup, Badge } from "./style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main } from "../styled";
import Heading from "../../components/heading/heading";
import { List } from "../../components/pricing/pricing";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import "./subscription.css";

const PricingTable = () => {
  return (
    <>
      <Main>
        <PageHeader
          ghost
          title="Your free trial has expired. Upgrade to a paid plan now."
          style={{ color: "red" }}
        />

        <Row gutter={25} justify="center">
          <Col xxl={6} lg={8} sm={12} xs={24}>
            <PricingCard style={{ marginBottom: 30 }} size="small">
              <Badge className="pricing-badge" type="info">
                Free Forever
              </Badge>
              <Heading className="pricing-title" as="h3">
                Free
              </Heading>
              <ListGroup>
                <List text="1 register (outlet)" />
                <List text="In-store billing" />
                <List text="Unlimited receipts" />
                <List text="Unlimited sales history" />
                <List text="Reports & Analytics app" />
                <List text="Inventory & Recipe" />
                <List text="On-boarding assistance" />
                <List text="Priority support" />
              </ListGroup>
              <Button size="default" type="info">
                Start Now
              </Button>
            </PricingCard>
          </Col>
          <Col xxl={6} lg={8} sm={12} xs={24}>
            <PricingCard style={{ marginBottom: 30 }}>
              <Badge className="pricing-badge" type="primary">
                Start easily
              </Badge>
              <Heading className="price-amount" as="h3">
                <sup className="currency">$</sup>999{" "}
                <sub className="pricing-validity">+GST Per month</sub>
              </Heading>
              <ListGroup size="small">
                <List text="1 register (outlet)" />
                <List text="In-store billing" />
                <List text="Unlimited receipts" />
                <List text="Unlimited sales history" />
                <List text="Reports & Analytics app" />
                <List text="Inventory & Recipe" />
                <List text="On-boarding assistance" />
                <List text="Priority support" />
              </ListGroup>
              <Button size="default" type="primary">
                Buy Now
              </Button>
            </PricingCard>
          </Col>
          <Col xxl={6} lg={8} sm={12} xs={24}>
            <PricingCard style={{ marginBottom: 30 }}>
              <Badge className="pricing-badge" type="info">
                Offer! Get two months extra
              </Badge>
              <Heading className="price-amount" as="h3">
                <sup className="currency">$</sup>9,999{" "}
                <sub className="pricing-validity">+GST Per year</sub>
              </Heading>
              <span className="package-user-type">Renewals at ₹7500/year</span>

              <ListGroup>
                <List text="1 register (outlet)" />
                <List text="In-store billing" />
                <List text="Unlimited receipts" />
                <List text="Unlimited sales history" />
                <List text="Reports & Analytics app" />
                <List text="Inventory & Recipe" />
                <List text="On-boarding assistance" />
                <List text="Priority support" />
              </ListGroup>
              <Button size="default" type="info">
                Buy Now
              </Button>
            </PricingCard>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default PricingTable;
