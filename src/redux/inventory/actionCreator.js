import { getItem, setItem } from "../../utility/localStorageControl";
import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
const {
  taxesAdd,
  taxesAddErr,
  taxesList,
  taxesListErr,
  taxesId,
  taxesIdErr,
  taxesDelete,
  taxesDeleteErr,
} = actions;

const addOrUpdateInventory = (formData, taxes_id) => {
  return async (dispatch) => {
    try {
      let getAddedtaxes = {};
      if (taxes_id) {
        getAddedtaxes = await DataService.put(
          `${API.inventory.addInventory}/${taxes_id}`,
          formData
        );
        if (getAddedtaxes.data.data) {
          return dispatch(taxesAdd(getAddedtaxes.data.data));
        }
      } else {
        getAddedtaxes = await DataService.post(
          API.inventory.addInventory,
          formData
        );
      }
      if (!getAddedtaxes.data.error) {
        return dispatch(taxesAdd(getAddedtaxes.data.data));
      } else {
        return dispatch(taxesAddErr(getAddedtaxes.data.data));
      }
    } catch (err) {
      dispatch(taxesAddErr(err));
    }
  };
};

const getAllInventoryList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (checksell == "sell" && allSetupcache?.taxes) {
        return dispatch(taxesList(allSetupcache.inventorys));
      } else {
        const getTaxesList = await DataService.get(
          API.inventory.getAllInventory
        );

        if (!getTaxesList.data.error) {
          allSetupcache.inventorys = getTaxesList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(taxesList(getTaxesList.data.data));
        } else {
          return dispatch(taxesListErr(getTaxesList.data));
        }
      }
    } catch (err) {
      return dispatch(taxesListErr(err));
    }
  };
};
const getAllItemList = (inventoryId) => {
  return async (dispatch) => {
    try {
      const getTaxesList = await DataService.get(
        `${API.inventory.getAllItemList}/${inventoryId}`
      );
      console.log("habhaicheckcalthaychekenyi");
      if (!getTaxesList.data.error) {
        return getTaxesList.data.data;
      } else {
        return dispatch(taxesListErr(getTaxesList.data));
      }
    } catch (err) {
      return dispatch(taxesListErr(err));
    }
  };
};
const getTaxesById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let taxesDetails;
      if (allSetupcache != null && allSetupcache.taxes) {
        taxesDetails = allSetupcache.taxes.find((val) => val._id == id);
      }
      if (taxesDetails) {
        return dispatch(taxesId(taxesDetails));
      } else {
        const taxesByIdData = await DataService.get(
          `${API.taxes.getTaxesById}/${id}`
        );
        if (!taxesByIdData.data.error) {
          return dispatch(taxesId(taxesByIdData.data.data));
        } else {
          return dispatch(taxesIdErr(taxesByIdData.data));
        }
      }
    } catch (err) {
      dispatch(taxesIdErr(err));
    }
  };
};

const deleteInventory = (TaxesIds) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.post(
        API.inventory.deleteAllInventory,
        TaxesIds
      );

      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
const getAllPosProductsList = (checksell) => {
  return async (dispatch) => {
    try {
      const getTaxesList = await DataService.get(
        API.inventory.getAllPosproducts
      );
      if (!getTaxesList.data.error) {
        return dispatch(taxesList(getTaxesList.data.data));
      } else {
        return dispatch(taxesListErr(getTaxesList.data));
      }
    } catch (err) {
      return dispatch(taxesListErr(err));
    }
  };
};
const addProductInInvenory = (id, payload) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.put(
        `${API.inventory.addProduct}/${id}`,
        payload
      );

      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
const addProductInInvenoryItems = (id, payload) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.put(
        `${API.inventory.addProductInventoryItems}/${id}`,
        payload
      );

      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
const addUpdateInevntoryItems = (id, payload) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.put(
        `${API.inventory.addUpdateInventoryProducts}/${id}`,
        payload
      );
      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
const addInevntoryItems = (id, payload) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.put(
        `${API.inventory.addPosProductsLinkInventoryItems}/${id}`,
        payload
      );
      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};

const updateAllPosProducts = (payload) => {
  return async (dispatch) => {
    try {
      console.log("payload44342424", payload);
      const getDeletedTaxes = await DataService.post(
        API.inventory.updatePosProducts,
        payload
      );
      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
const trackUpdate = (id, payload, track) => {
  return async (dispatch) => {
    try {
      console.log("payload44342424", payload);
      const getDeletedTaxes = await DataService.put(
        `${API.inventory.trackUpdate}/${id}`,
        { products: payload, remove: track == "remove" ? true : false }
      );
      if (!getDeletedTaxes.data.error) {
        return dispatch(taxesDelete(getDeletedTaxes.data));
      } else {
        return dispatch(taxesDeleteErr(getDeletedTaxes.data));
      }
    } catch (err) {
      dispatch(taxesDeleteErr(err));
    }
  };
};
export {
  addOrUpdateInventory,
  getAllInventoryList,
  getTaxesById,
  deleteInventory,
  getAllPosProductsList,
  getAllItemList,
  addProductInInvenory,
  updateAllPosProducts,
  trackUpdate,
  addUpdateInevntoryItems,
  addProductInInvenoryItems,
  addInevntoryItems,
};
