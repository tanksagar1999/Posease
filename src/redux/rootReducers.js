import { combineReducers } from "redux";
import authReducer from "./authentication/reducers";
import ChangeLayoutMode from "./themeLayout/reducers";
import { activeUsersReducer } from "./users/reducers";
import { headerSearchReducer } from "./headerSearch/reducers";
import chartContentReducer from "./chartContent/reducers";
import { receiptsReducer } from "./receipts/reducers";
import { pattycashReducer } from "./pattyCash/reducers";
import { pricebookReducer } from "./pricebook/reducers";
import { customerReducer } from "./customer/reducers";
import { sellReducer } from "./sell/reducers";
import { dashboardReducer } from "./dashboard/reducers";
import { productReducer } from "./products/reducers";
import { shopReducer } from "./shop/reducers";
import { variantReducer } from "./variant/reducers";
import { variantGroupReducer } from "./variantGroup/reducers";
import { addonReducer } from "./addon/reducers";
import { addonGroupReducer } from "./AddonGroup/reducers";
import { itemGroupReducer } from "./ItemGroup/reducers";
import { enquiryReducer } from "./enquiryManagement/reducers";
import { taxGroupReducer } from "./taxGroup/reducers";
import { taxesReducer } from "./taxes/reducers";
import { cashierReducer } from "./cashiers/reducers";
import { waiterUserReducer } from "./waiterUser/reducers";
import { kitchenUserReducer } from "./kitchenUser/reducers";
import { appUserReducer } from "./appUser/reducers";
import { addtionalChargeReducer } from "./AddtionalCharge/reducers";
import { customFieldReducer } from "./customField/reducers";
import { registerReducer } from "./register/reducers";
import { discountRulesReducer } from "./discountRules/reducers";
import { preferenceReducer } from "./preference/reducers";

const rootReducers = combineReducers({
  headerSearchData: headerSearchReducer,
  users: activeUsersReducer,
  shop: shopReducer,
  auth: authReducer,
  receipts: receiptsReducer,
  pattycash: pattycashReducer,
  products: productReducer,
  pricebooks: pricebookReducer,
  customer: customerReducer,
  variant: variantReducer,
  variantGroup: variantGroupReducer,
  addon: addonReducer,
  addonGroup: addonGroupReducer,
  itemGroup: itemGroupReducer,
  ChangeLayoutMode,
  chartContent: chartContentReducer,
  enquiry: enquiryReducer,
  taxGroups: taxGroupReducer,
  taxes: taxesReducer,
  cashier: cashierReducer,
  appUser: appUserReducer,
  addtionalCharge: addtionalChargeReducer,
  customField: customFieldReducer,
  register: registerReducer,
  discountRules: discountRulesReducer,
  preference: preferenceReducer,
  waiterUser: waiterUserReducer,
  kitchenUser: kitchenUserReducer,
  sellData: sellReducer,
  dashboard: dashboardReducer,
});

export default rootReducers;
