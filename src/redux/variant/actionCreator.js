import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  VarinatAdd,
  VariantAddErr,
  VariantList,
  VariantListErr,
  VariantDelete,
  VariantDeleteErr,
  Variant,
  VariantErr,
  VariantImportPreview,
  VariantImportPreviewErr,
  VariantImportData,
  VariantImportDataErr,
} = actions;

export const getAllVariantList = (checkSell) => {
  return async (dispatch) => {
    try {
      let localdata = getItem("setupCache");
      if (localdata && localdata.productVariants && checkSell == "sell") {
        return dispatch(VariantList(localdata.productVariants));
      } else {
        const VariatDataList = await DataService.get(
          API.variants.getVariantList
        );
        if (!VariatDataList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.productVariants = VariatDataList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(VariantList(VariatDataList.data.data));
        } else {
          return dispatch(VariantListErr(VariatDataList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productVariants) {
        return dispatch(VariantList(allSetupcache.productVariants));
      } else {
        return dispatch(VariantListErr(err));
      }
    }
  };
};

export const ExportVariant = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.variants.exportVariant, payloads);
    return resp.data
  };
};

export const UpdateVariant = (payloads, variant_id) => {
  return async (dispatch) => {
    try {
      let getVariant = {};
      getVariant = await DataService.put(
        API.variants.addVariant + "/" + variant_id,
        payloads
      );
      if (!getVariant.data.error) {
        let getallSetUpcacheData = getItem("setupCache");
        let allProductList = getItem("productList");
        if (
          getallSetUpcacheData &&
          getallSetUpcacheData.productVariantGroups?.length > 0
        ) {
          allProductList.map((val) => {
            if (val.option_variant_group?.length > 0) {
              val.option_variant_group.map((j) => {
                if (j && j.product_variants?.length > 0) {
                  let updatevarintlist = [];
                  j.product_variants.map((k) => {
                    if (k._id === getVariant.data.data._id) {
                      updatevarintlist.push(getVariant.data.data);
                      return getVariant.data.data;
                    } else {
                      updatevarintlist.push(k);
                      return k;
                    }
                  });
                  j.product_variants = updatevarintlist;
                }
              });
            }
          });
          setItem("setupCache", getallSetUpcacheData);

          setItem("productList", allProductList);
        }
        return dispatch(VarinatAdd(getVariant.data));
      } else {
        return dispatch(VariantAddErr(getVariant.data));
      }
    } catch (err) {
      dispatch(VariantAddErr(err));
    }
  };
};
export const AddVariantBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getVariant = {};
      getVariant = await DataService.post(API.variants.addVariant, payloads);
      if (!getVariant.data.error) {
        return dispatch(VarinatAdd(getVariant.data));
      } else {
        return dispatch(VariantAddErr(getVariant.data));
      }
    } catch (err) {
      dispatch(VariantAddErr(err));
    }
  };
};

export const ImportVariantInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.variants.importVariant, payloads);
      if (!getPreview.data.error) {
        return dispatch(VariantImportPreview(getPreview.data));
      } else {
        return dispatch(VariantImportPreviewErr(getPreview.data));
      }
    } catch (err) {
      dispatch(VariantImportPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.variants.importPreview, payloads);
      if (!getPreview.data.error) {
        return dispatch(VariantImportData(getPreview.data));
      } else {
        return dispatch(VariantImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(VariantImportDataErr(err));
    }
  };
};

export const getVariantById = (id) => {
  return async (dispatch) => {
    try {
      let localdata = getItem("setupCache");
      let variantDetails;
      if (localdata && localdata.productVariants) {
        variantDetails = localdata.productVariants.find((j) => j._id == id);
      }
      if (variantDetails) {
        return variantDetails;
      } else {
        const Detail = await DataService.get(
          API.variants.getVariantList + "/" + id
        );
        if (!Detail.data.error) {
          return Detail.data.data;
        } else {
          return dispatch(Variant(Detail.data));
        }
      }
    } catch (err) {
      dispatch(VariantErr(err));
    }
  };
};

export const deleteVariant = (variantIds) => {
  return async (dispatch) => {
    try {
      const getDeletedVariant = await DataService.post(
        API.variants.deleteAllVariant,
        variantIds
      );
      if (!getDeletedVariant.data.error) {
        return dispatch(VariantDelete(getDeletedVariant.data));
      } else {
        return dispatch(VariantDeleteErr(getDeletedVariant.data));
      }
    } catch (err) {
      dispatch(VariantAddErr(err));
    }
  };
};
