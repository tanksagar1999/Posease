import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  AddonAdd,
  AddonAddErr,
  AddonList,
  AddonListErr,
  AddonDelete,
  AddonDeleteErr,
  Addon,
  AddonErr,
  AddonImportPreview,
  AddonImportPreviewErr,
  AddonImportData,
  AddonImportDataErr,
} = actions;

export const getAllAddonList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productAddon && checkSell == "sell") {
        return dispatch(AddonList(allSetupcache.productAddon));
      } else {
        const AddonDataList = await DataService.get(API.addons.getAddonList);
        if (!AddonDataList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.productAddon = AddonDataList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(AddonList(AddonDataList.data.data));
        } else {
          return dispatch(AddonListErr(AddonDataList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productAddon) {
        return dispatch(AddonList(allSetupcache.productAddon));
      } else {
        return dispatch(AddonListErr(err));
      }
    }
  };
};

export const ExportAddon = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.addons.exportAddon, payloads);
  };
};

export const UpdateAddon = (payloads, addon_id) => {
  return async (dispatch) => {
    try {
      let getAddon = {};
      getAddon = await DataService.put(
        API.addons.addAddon + "/" + addon_id,
        payloads
      );
      if (!getAddon.data.error) {
        let getallSetUpcacheData = getItem("productList");
        let localData = getItem("setupCache");
        if (getallSetUpcacheData && localData.productAddonGroups?.length > 0) {
          getallSetUpcacheData.map((val) => {
            if (val.option_addon_group?.length > 0) {
              val.option_addon_group.map((j) => {
                if (j && j.product_addons?.length > 0) {
                  let updateaddonlist = [];
                  j.product_addons.map((k) => {
                    if (k._id === getAddon.data.data._id) {
                      updateaddonlist.push(getAddon.data.data);
                      return getAddon.data.data;
                    } else {
                      updateaddonlist.push(k);
                      return k;
                    }
                  });
                  j.product_addons = updateaddonlist;
                }
              });
            }
          });
          setItem("productList", getallSetUpcacheData);
        }
        return dispatch(AddonAdd(getAddon.data.data));
      } else {
        return dispatch(AddonAddErr(getAddon.data));
      }
    } catch (err) {
      dispatch(AddonAddErr(err));
    }
  };
};

export const AddAddonBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getAddon = {};
      getAddon = await DataService.post(API.addons.addAddon, payloads);
      if (!getAddon.data.error) {
        return dispatch(AddonAdd(getAddon.data));
      } else {
        return dispatch(AddonAddErr(getAddon.data));
      }
    } catch (err) {
      dispatch(AddonAddErr(err));
    }
  };
};

export const ImportAddonInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getAddon = {};
      getAddon = await DataService.post(API.addons.importAddon, payloads);
      if (!getAddon.data.error) {
        return dispatch(AddonImportPreview(getAddon.data));
      } else {
        return dispatch(AddonImportPreviewErr(getAddon.data));
      }
    } catch (err) {
      dispatch(AddonImportPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.addons.importPreview, payloads);
      if (!getPreview.data.error) {
        return dispatch(AddonImportData(getPreview.data));
      } else {
        return dispatch(AddonImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(AddonImportDataErr(err));
    }
  };
};

export const geAddonById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let addondetails;
      if (allSetupcache && allSetupcache.productAddon) {
        addondetails = allSetupcache.productAddon.find((k) => k._id == id);
      }
      if (addondetails) {
        return addondetails;
      } else {
        const Detail = await DataService.get(
          API.addons.getAddonList + "/" + id
        );
        if (!Detail.data.error) {
          return Detail.data.data;
        } else {
          return dispatch(Addon(Detail.data));
        }
      }
    } catch (err) {
      dispatch(AddonErr(err));
    }
  };
};

export const deleteAddon = (addonIds) => {
  return async (dispatch) => {
    try {
      const getDeletedAddon = await DataService.post(
        API.addons.deleteAllAddon,
        addonIds
      );
      if (!getDeletedAddon.data.error) {
        return dispatch(AddonDelete(getDeletedAddon.data));
      } else {
        return dispatch(AddonDeleteErr(getDeletedAddon.data));
      }
    } catch (err) {
      dispatch(AddonAddErr(err));
    }
  };
};
