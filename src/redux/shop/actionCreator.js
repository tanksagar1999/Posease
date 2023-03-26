import { getItem, setItem } from "../../utility/localStorageControl";
import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const { shopDetailErr, shopDetail } = actions;

export const SaveBasicDetail = (payloads, userID) => {
  return async (dispatch) => {
    const Detail = await DataService.put(API.shop.add + "/" + userID, payloads);
    if (!Detail.data.error) {
      return dispatch(shopDetail(Detail.data.data));
    }
  };
};

export const getShopDetail = (checkSell, userID) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (checkSell == "sell") {
        return dispatch(shopDetail(allSetupcache.shopDetails));
      } else {
        const Detail = await DataService.get(API.shop.add + "/" + userID);
        if (!Detail.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.shopDetails = Detail.data.data;
          allSetupcache.shopDetails.shop_logo =
            allSetupcache.shopDetails.shop_logo;
          setItem("setupCache", allSetupcache);
          return dispatch(shopDetail(Detail.data.data));
        } else {
          return dispatch(shopDetailErr(Detail.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");

      // allSetupcache.shopDetails.shop_logo = getItem("profile-imge");
      if (allSetupcache && allSetupcache.shopDetails) {
        return dispatch(shopDetail(allSetupcache.shopDetails));
      } else {
        return dispatch(shopDetailErr(err));
      }
    }
  };
};
