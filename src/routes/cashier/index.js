import React, { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import withAdminLayout from "../../layout/withAdminLayout";
import { getItem } from "../../utility/localStorageControl";
import Ecommerce from "../../container/dashboard/Ecommerce";
import Receipts from "../../container/Receipts/Receipts";
import Invoice from "../../container/Receipts/Invoice";
import Products from "../../container/Product/Products";
import AddProduct from "../../container/Product/AddProduct";
import ImportProduct from "../../container/Product/Importform";
import Pricebook from "../../container/Product/PriceBook/Pricebook-list";
import AddPriceBook from "../../container/Product/PriceBook/AddPriceBook";
import EditProduct from "../../container/Product/EditProduct";
import PriceBookItemBuilder from "../../container/Product/PriceBook/PriceBookItemBuilder";
import CategoryBuilder from "../../container/ProductCategory/CategoryBuilder";
import ImportPriceBook from "../../container/Product/PriceBook/Importform";

/*----- Customer ----------*/

import Customer from "../../container/Customer/Customers";
import EditCustomer from "../../container/Customer/EditCustomer";
import AddCustomer from "../../container/Customer/AddCustomer";
import ImportCustomer from "../../container/Customer/Importform";

/*---- Product Category -------------*/

import AddProductCategory from "../../container/ProductCategory/Add/AddProductCategory";
import AddOrderTicketGroup from "../../container/ProductCategory/Add/AddOrderTicketGroup";

/*---- Product Options -----*/

import ProductOptionBuild from "../../container/ProductOption/ProductOptionBuild";
import ImportVariant from "../../container/ProductOption/Variant/Importform";
import AddVariant from "../../container/ProductOption/Variant/AddVariant";
import EditVariant from "../../container/ProductOption/Variant/EditVariant";

//--- Variat group -----//

import AddVariantGroup from "../../container/ProductOption/VariantGroup/AddVariantGroup";
import EditVariantGroup from "../../container/ProductOption/VariantGroup/EditVariantGroup";
import ImportVariantGroup from "../../container/ProductOption/VariantGroup/Importform";

//---- Addon-----------//

import ImportAddon from "../../container/ProductOption/Addons/Importform";
import AddAddon from "../../container/ProductOption/Addons/AddAddons";
import EditAddon from "../../container/ProductOption/Addons/EditAddons";

// Addon group ---------//
import AddAddonGroup from "../../container/ProductOption/AddonsGroup/AddAddonGroup";
import EditAddonGroup from "../../container/ProductOption/AddonsGroup/EditAddonGroup";
import ImportAddonGroup from "../../container/ProductOption/AddonsGroup/Importform";

//----------- Item group ----------//

import AddItemGroup from "../../container/ProductOption/ItemGroup/AddItemGroup";
import EditItemGroup from "../../container/ProductOption/ItemGroup/EditItemGroup";
import ImportItemGroup from "../../container/ProductOption/ItemGroup/Importform";

//------- Dummy  --------//
import SellBuilder from "../../container/Sell/SellBuilder";

import Settings from "../../container/profile/settings/Settings";
import PricingTable from "../../container/Subscription/PricingTable";

import Patty from "../../container/PattyCash/Patty";

const Cashier = () => {
  const { path } = useRouteMatch();
  const userDetails =
    getItem("userDetails") != null ? getItem("userDetails") : false;
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route exact path={`${path}`} component={SellBuilder} />
        <Route exact path={`${path}receipts`} component={Receipts} />
        <Route exact path={`${path}petty`} component={Patty} />
        <Route exact path={`${path}sell`} component={SellBuilder} />

        {userDetails && userDetails.has_manager_permission && (
          <>
            <Route exact path={`${path}dashboard`} component={Ecommerce} />
            <Route exact path={`${path}customers`} component={Customer} />

            <Route
              exact
              path={`${path}customers/import`}
              component={ImportCustomer}
            />
            <Route
              exact
              path={`${path}customers/edit/:id`}
              component={EditCustomer}
            />
            <Route
              exact
              path={`${path}customers/add`}
              component={AddCustomer}
            />
          </>
        )}

        <Route path={`${path}settings`} component={Settings} />
        <Route exact path={`${path}receipts/:id`} component={Invoice} />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(Cashier);
