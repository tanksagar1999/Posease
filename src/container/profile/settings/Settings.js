import React, { lazy, Suspense } from "react";
import { Row, Col, Skeleton } from "antd";
import { Switch, Route } from "react-router-dom";
import propTypes from "prop-types";
import { SettingWrapper } from "./overview/style";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { UserBuilder } from "./overview/UserBuilder";
import { AddCashier } from "./overview/Userpage/AddCashier";
import { EditCashier } from "./overview/Userpage/EditCashier";
import { AddApp } from "./overview/Userpage/AddApp";
import { EditApp } from "./overview/Userpage/EditApp";
import { AddKitchen } from "./overview/Userpage/AddKitchen";
import { EditKitchen } from "./overview/Userpage/EditKitchen";
import { AddWaiter } from "./overview/Userpage/AddWaiter";
import { EditWaiter } from "./overview/Userpage/EditWaiter";
import { ShopBuilder } from "./overview/ShopBuilder";
import { PreferencesBuilder } from "./overview/PreferencesBuilder";
import { DiscountRuleBuilder } from "./overview/DiscountRuleBuilder";
import { AddDiscount } from "./overview/Discountrulepage/AddDiscount";
import { EditDiscount } from "./overview/Discountrulepage/EditDiscount";
import { AdditionalBuilder } from "./overview/AdditionalBuilder";
import { AddAdditional } from "./overview/Additionalpage/AddAdditional";
import { RegisterBuilder } from "./overview/RegisterBuilder";
import { PrinterBuilder } from "./overview/PrinterBuilder";
import { BingageBuilder } from "./overview/BingageBuilder";
import { Daynobuilder } from "./overview/Daynobuilder";
import { AddIntegration } from "./overview/BingagePage/AddIntegration";
import { addDyno } from "./overview/DynoPage/addDyno"
import { AddPrinter } from "./overview/Printerpage/AddPrinter";
import { SetUp } from "./overview/Printerpage/SetUp";
import { AddRegister } from "./overview/Registerpage/AddRegister";
import { EditRegister } from "./overview/Registerpage/EditRegister";
import { CustomFieldBuilder } from "./overview/CustomFieldBuilder";
import { AddCustomField } from "./overview/Customfield/AddCustomField";
import { TaxBuilder } from "./overview/TaxBuilder";
import { DynoProduct } from "./overview/DynoProduct";
import { AddTax } from "./overview/Taxpage/AddTax";
import { AddTaxGroup } from "./overview/Taxpage/AddTaxGroup";
import { Password } from "./overview/Passwoard";
import { SocialProfile } from "./overview/SocialProfile";
import { Notification } from "./overview/Notification";
import { AuthorBox } from "./overview/ProfileAuthorBox";

const Settings = ({ match }) => {
  const { path } = match;

  return (
    <>
      <Main className="padding-top-form">
        <Row gutter={25}>
          <Col xxl={4} lg={6} md={8} xs={24} className="settings-top">
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar />
                </Cards>
              }
            >
              <AuthorBox />
            </Suspense>
          </Col>
          <Col xxl={20} lg={18} md={16} xs={24}>
            <SettingWrapper>
              <Switch>
                <Suspense
                  fallback={
                    <Cards headless>
                      <Skeleton paragraph={{ rows: 20 }} />
                    </Cards>
                  }
                >
                  <Route exact path={`${path}/users`} component={UserBuilder} />
                  <Route
                    exact
                    path={`${path}/preferences`}
                    component={PreferencesBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/registers`}
                    component={RegisterBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/printers/add`}
                    component={AddPrinter}
                  />
                  <Route
                    exact
                    path={`${path}/printers/setup`}
                    component={SetUp}
                  />
                  <Route
                    exact
                    path={`${path}/bingages`}
                    component={BingageBuilder}
                  />
                  <Route exact path={`${path}/dyno`} component={Daynobuilder} />
                  <Route
                    exact
                    path={`${path}/bingage/add`}
                    component={AddIntegration}
                  />
                  <Route
                    exact
                    path={`${path}/dyno/add`}
                    component={addDyno}
                  />

                  <Route
                    exact
                    path={`${path}/printers`}
                    component={PrinterBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/registers/add`}
                    component={AddRegister}
                  />
                  <Route
                    exact
                    path={`${path}/registers/edit`}
                    component={EditRegister}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/cashier`}
                    component={AddCashier}
                  />
                  <Route
                    exact
                    path={`${path}/users/cashiers/edit`}
                    component={EditCashier}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/app-user`}
                    component={AddApp}
                  />
                  <Route
                    exact
                    path={`${path}/users/app-user/edit`}
                    component={EditApp}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/waiter`}
                    component={AddWaiter}
                  />
                  <Route
                    exact
                    path={`${path}/users/waiter/edit`}
                    component={EditWaiter}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/kitchen`}
                    component={AddKitchen}
                  />
                  <Route
                    exact
                    path={`${path}/users/kitchen/edit`}
                    component={EditKitchen}
                  />
                  <Route
                    exact
                    path={`${path}/discount-rules`}
                    component={DiscountRuleBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/discount-rules/add`}
                    component={AddDiscount}
                  />
                  <Route
                    exact
                    path={`${path}/discount-rules/edit/:_id`}
                    component={EditDiscount}
                  />
                  <Route
                    exact
                    path={`${path}/additional-charges`}
                    component={AdditionalBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/additional-charges/add`}
                    component={AddAdditional}
                  />
                  <Route
                    exact
                    path={`${path}/custom-fields/`}
                    component={CustomFieldBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/custom-fields/add/:type`}
                    component={AddCustomField}
                  />
                  <Route exact path={`${path}/shop`} component={ShopBuilder} />
                  <Route exact path={`${path}/taxes`} component={TaxBuilder} />
                  <Route
                    exact
                    path={`${path}/dyno/products`}
                    component={DynoProduct}
                  />
                  <Route
                    exact
                    path={`${path}/taxes/add/:type`}
                    component={AddTax}
                  />
                  <Route
                    exact
                    path={`${path}/taxgroup/add/:type`}
                    component={AddTaxGroup}
                  />
                  <Route exact path={`${path}/password`} component={Password} />
                  <Route
                    exact
                    path={`${path}/social`}
                    component={SocialProfile}
                  />
                  <Route
                    exact
                    path={`${path}/notification`}
                    component={Notification}
                  />
                </Suspense>
              </Switch>
            </SettingWrapper>
          </Col>
        </Row>
      </Main>
    </>
  );
};

Settings.propTypes = {
  match: propTypes.object,
};

export default Settings;
