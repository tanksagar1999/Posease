import React, { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import withAdminLayout from "../../layout/withAdminLayout";
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

/*----- PriceBook ----------*/

import PriceBookImportProduct from "../../container/Product/PriceBook/Items/importProducts";
import PriceBookImportVariants from "../../container/Product/PriceBook/Items/importVariants";
import PriceBookImportAddons from "../../container/Product/PriceBook/Items/ImportAddons";

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
import PreviewVariant from "../../container/ProductOption/Variant/PreviewVariant";
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

//------------ Application -----------//

import Application from "../../container/Application/Application";

//------- Dummy  --------//

import IncomingOrderBuilder from "../../container/Sell/Incoming/IncomingOrderBuilder";
import SellBuilder from "../../container/Sell/SellBuilder";

import Settings from "../../container/profile/settings/Settings";
import PricingTable from "../../container/Subscription/PricingTable";

import Patty from "../../container/PattyCash/Patty";

// --Inventory --//
import { InventoryBuilder } from "../../container/profile/settings/overview/InventoryBuilder";
import { addInventory } from "../../container/profile/settings/overview/Inventory/addInventory";
import { ManageProductsBuilder } from "../../container/profile/settings/overview/Inventory/ManageProductsBuilder";
import { InventoryItemsList } from "../../container/profile/settings/overview/Inventory/InventoryItemsList";
import { Recipe } from "../../container/profile/settings/overview/Inventory/Recipe";
import { InwardInventory } from "../../container/profile/settings/overview/Inventory/InwardInventory";
import { addInventoryRecipe } from "../../container/profile/settings/overview/Inventory/addInventoryRecipe";
import { Addproductrecipe } from "../../container/profile/settings/overview/Inventory/Addproductrecipe";
import { AddRecipe } from "../../container/profile/settings/overview/Inventory/AddRecipe";
import { EditRecipe } from "../../container/profile/settings/overview/Inventory/EditRecipe";
const Restaurant = () => {
  const { path } = useRouteMatch();
  console.log("dddjdjsdjsdjsjs", path);
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route exact path={`${path}dashboard`} component={Ecommerce} />
        <Route exact path={`${path}`} component={SellBuilder} />
        <Route exact path={`${path}receipts`} component={Receipts} />
        <Route exact path={`${path}pettycash`} component={Patty} />
        <Route exact path={`${path}products`} component={Products} />
        <Route exact path={`${path}products/add`} component={AddProduct} />
        <Route
          exact
          path={`${path}products/edit/:product_id`}
          component={EditProduct}
        />
        <Route exact path={`${path}products/pricebook`} component={Pricebook} />
        <Route
          exact
          path={`${path}products/pricebook/add`}
          component={AddPriceBook}
        />
        <Route
          exact
          path={`${path}products/pricebook/items/:pricebook_id`}
          component={PriceBookItemBuilder}
        />
        <Route
          exact
          path={`${path}products/pricebook/import`}
          component={ImportPriceBook}
        />
        <Route
          exact
          path={`${path}pricebook-items/produt/import/:pricebook_id`}
          component={PriceBookImportProduct}
        />
        <Route
          exact
          path={`${path}pricebook-items/variant/import`}
          component={PriceBookImportVariants}
        />
        <Route
          exact
          path={`${path}pricebook-items/addon/import/:pricebook_id`}
          component={PriceBookImportAddons}
        />
        <Route
          exact
          path={`${path}products/import`}
          component={ImportProduct}
        />
        <Route
          exact
          path={`${path}product-categories`}
          component={CategoryBuilder}
        />
        <Route
          exact
          path={`${path}product-categories/add`}
          component={AddProductCategory}
        />
        <Route
          exact
          path={`${path}product-categories/add-new-order-ticket-group`}
          component={AddOrderTicketGroup}
        />
        <Route exact path={`${path}receipts/:id`} component={Invoice} />
        <Route
          exact
          path={`${path}product-options`}
          component={ProductOptionBuild}
        />
        <Route
          exact
          path={`${path}product-options/variant/import`}
          component={ImportVariant}
        />
        <Route
          exact
          path={`${path}product-options/variant/preview`}
          component={PreviewVariant}
        />
        <Route
          exact
          path={`${path}product-options/variant/add`}
          component={AddVariant}
        />
        <Route
          exact
          path={`${path}product-options/variant/edit/:id`}
          component={EditVariant}
        />
        <Route
          exact
          path={`${path}product-options/variantgroup/add`}
          component={AddVariantGroup}
        />
        <Route
          exact
          path={`${path}product-options/variantgroup/edit/:id`}
          component={EditVariantGroup}
        />
        <Route
          exact
          path={`${path}product-options/variantgroup/import`}
          component={ImportVariantGroup}
        />
        <Route
          exact
          path={`${path}product-options/addon/import`}
          component={ImportAddon}
        />
        <Route
          exact
          path={`${path}product-options/addon/add`}
          component={AddAddon}
        />
        <Route
          exact
          path={`${path}product-options/addon/edit/:id`}
          component={EditAddon}
        />
        <Route
          exact
          path={`${path}product-options/itemgroup/add`}
          component={AddItemGroup}
        />
        <Route
          exact
          path={`${path}product-options/itemgroup/edit/:id`}
          component={EditItemGroup}
        />
        <Route
          exact
          path={`${path}product-options/itemgroup/import`}
          component={ImportItemGroup}
        />
        <Route
          exact
          path={`${path}product-options/addongroup/add`}
          component={AddAddonGroup}
        />
        <Route
          exact
          path={`${path}product-options/addongroup/edit/:id`}
          component={EditAddonGroup}
        />
        <Route
          exact
          path={`${path}product-options/addongroup/import`}
          component={ImportAddonGroup}
        />
        <Route exact path={`${path}sell`} component={SellBuilder} />
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
        <Route exact path={`${path}customers/add`} component={AddCustomer} />
        <Route exact path={`${path}inventory`} component={InventoryBuilder} />
        <Route exact path={`${path}inventory/add`} component={addInventory} />
        <Route
          exact
          path={`${path}inventory/POSitems`}
          component={ManageProductsBuilder}
        />
        <Route
          exact
          path={`${path}inventory/itemList`}
          component={InventoryItemsList}
        />
        <Route exact path={`${path}inventory/recipe`} component={Recipe} />
        <Route
          exact
          path={`${path}inventory/inward`}
          component={InwardInventory}
        />
        <Route
          exact
          path={`${path}inventory/add-inventory-recipe`}
          component={addInventoryRecipe}
        />

        <Route
          exact
          path={`${path}inventory/add-product-receipe`}
          component={Addproductrecipe}
        />
        <Route
          exact
          path={`${path}inventory/add-recipe`}
          component={AddRecipe}
        />
        <Route
          exact
          path={`${path}inventory/edit-recipe`}
          component={EditRecipe}
        />
        <Route path={`${path}settings`} component={Settings} />
        <Route path={`${path}shop/subscription`} component={PricingTable} />
        <Route path={`${path}appstore`} component={Application} />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(Restaurant);
