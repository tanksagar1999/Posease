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

const addOrUpdateTaxes = (formData, taxes_id) => {
  return async (dispatch) => {
    try {
      let getAddedtaxes = {};
      if (taxes_id) {
        getAddedtaxes = await DataService.put(
          `${API.taxes.addTaxes}/${taxes_id}`,
          formData
        );
        if (getAddedtaxes.data.data) {
          let allSetupcache = getItem("setupCache");
          let allProductList = getItem("productList");

          allProductList &&
            allProductList.length > 0 &&
            allProductList.map((val) => {
              if (val?.tax_group?.taxes && val.tax_group.taxes.length > 0) {
                val.tax_group.taxes.map((i) => {
                  if (i._id == getAddedtaxes.data.data._id) {
                    i.tax_name = getAddedtaxes.data.data.tax_name;
                    i.tax_percentage = getAddedtaxes.data.data.tax_percentage;
                  }
                });
              }
            });

          allSetupcache.taxGroups &&
            allSetupcache.taxGroups.length > 0 &&
            allSetupcache.taxGroups.map((k) => {
              if (k && k.taxes && k.taxes.length > 0) {
                k.taxes.map((j) => {
                  if (j._id == getAddedtaxes.data.data._id) {
                    j.tax_name = getAddedtaxes.data.data.tax_name;
                    j.tax_percentage = getAddedtaxes.data.data.tax_percentage;
                  }
                });
              }
            });
          setItem("setupCache", allSetupcache);
          setItem("productList", allProductList);
          return dispatch(taxesAdd(getAddedtaxes.data.data));
        }
      } else {
        getAddedtaxes = await DataService.post(API.taxes.addTaxes, formData);
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

const getAllTaxesList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (checksell == "sell" && allSetupcache?.taxes) {
        return dispatch(taxesList(allSetupcache.taxes));
      } else {
        const getTaxesList = await DataService.get(API.taxes.getAllTaxes);
        if (!getTaxesList.data.error) {
          allSetupcache.taxes = getTaxesList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(taxesList(getTaxesList.data.data));
        } else {
          return dispatch(taxesListErr(getTaxesList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      return dispatch(taxesList(allSetupcache.taxes));
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

const deleteTaxes = (TaxesIds) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxes = await DataService.post(
        API.taxes.deleteAllTaxes,
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
export { addOrUpdateTaxes, getAllTaxesList, getTaxesById, deleteTaxes };
