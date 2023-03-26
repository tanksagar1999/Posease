import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
import { Alert } from "antd";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  VarinatGroupAdd,
  VariantGroupAddErr,
  VariantGroupList,
  VariantGroupListErr,
  VariantGroupDelete,
  VariantGroupDeleteErr,
  VariantGroup,
  VariantGroupErr,
  VariantGroupImportPreview,
  VariantGroupImportPreviewErr,
  VariantGroupImportData,
  VariantGroupImportDataErr,
} = actions;

export const getAllVariantGroupList = (checkSell) => {
  return async (dispatch) => {
    try {
      let localdata = getItem("setupCache");
      if (localdata && localdata.productVariantGroups && checkSell == "sell") {
        return dispatch(VariantGroupList(localdata.productVariantGroups));
      } else {
        const VariatGroupDataList = await DataService.get(
          API.variantsGroup.getVariantGroupList
        );
        if (!VariatGroupDataList.data.error) {
          let allSetupcache = getItem("setupCache");

          allSetupcache.productVariantGroups = VariatGroupDataList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(VariantGroupList(VariatGroupDataList.data.data));
        } else {
          return dispatch(VariantGroupListErr(VariatGroupDataList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productVariantGroups) {
        return dispatch(VariantGroupList(allSetupcache.productVariantGroups));
      } else {
        return dispatch(VariantGroupListErr(err));
      }
    }
  };
};

export const ExportVariantGroup = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(
      API.variantsGroup.exportVariantGroup,
      payloads
    );
  };
};

export const UpdateVariantGroup = (payloads, variant_group_id) => {
  return async (dispatch) => {
    try {
      let getVariantGroup = {};
      getVariantGroup = await DataService.put(
        API.variantsGroup.addVariantGroup + "/" + variant_group_id,
        payloads
      );
      if (!getVariantGroup.data.error) {
        let getallSetUpcacheData = getItem("setupCache");
        let allProductList = getItem("productList");
        if (
          getallSetUpcacheData &&
          getallSetUpcacheData.productVariantGroups?.length > 0
        ) {
          allProductList.map((val) => {
            let latestVarintGroupList = [];
            if (val.product_option?.option_variant_group?.length > 0) {
              val.product_option &&
                val.product_option.option_variant_group.map((j) => {
                  if (j._id == getVariantGroup.data.data._id) {
                    latestVarintGroupList.push(getVariantGroup.data.data);
                  } else {
                    latestVarintGroupList.push(j);
                  }
                });
            }
            val.product_option.option_variant_group = latestVarintGroupList;
            let latestOptionVarintGroup = [];
            latestVarintGroupList.map((i) => {
              latestOptionVarintGroup.push({
                ...i,
                product_variants: i.product_variants.map((l) =>
                  getallSetUpcacheData.productVariants.find((m) => {
                    if (l._id && m._id == l._id) {
                      return m;
                    } else if (m._id == l) {
                      return m;
                    }
                  })
                ),
              });
            });
            val.option_variant_group = latestOptionVarintGroup;
          });
          setItem("setupCache", getallSetUpcacheData);
          setItem("productList", allProductList);
        }
        return dispatch(VarinatGroupAdd(getVariantGroup.data.data));
      } else {
        return dispatch(VariantGroupAddErr(getVariantGroup.data));
      }
    } catch (err) {
      dispatch(VariantGroupAddErr(err));
    }
  };
};
export const AddVariantGroupData = (payloads) => {
  return async (dispatch) => {
    try {
      let getVariantGroup = {};
      getVariantGroup = await DataService.post(
        API.variantsGroup.addVariantGroup,
        payloads
      );
      if (!getVariantGroup.data.error) {
        return dispatch(VarinatGroupAdd(getVariantGroup.data));
      } else {
        return dispatch(VariantGroupAddErr(getVariantGroup.data));
      }
    } catch (err) {
      dispatch(VariantGroupAddErr(err));
    }
  };
};

export const ImportVariantGroupInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.variantsGroup.importVariantGroup,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(VariantGroupImportPreview(getPreview.data));
      } else {
        return dispatch(VariantGroupImportPreviewErr(getPreview.data));
      }
    } catch (err) {
      dispatch(VariantGroupImportPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.variantsGroup.importPreview,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(VariantGroupImportData(getPreview.data));
      } else {
        return dispatch(VariantGroupImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(VariantGroupImportDataErr(err));
    }
  };
};

export const getVariantGroupById = (id) => {
  return async (dispatch) => {
    try {
      let localdata = getItem("setupCache");
      let varintGroupDetails;
      if (localdata && localdata.productVariantGroups) {
        varintGroupDetails = localdata.productVariantGroups.find(
          (val) => val._id == id
        );
      }
      if (varintGroupDetails && varintGroupDetails.product_variants) {
        let data = varintGroupDetails.product_variants.map((l) => l._id);
        varintGroupDetails.product_variants = data;

        return varintGroupDetails;
      } else {
        const Detail = await DataService.get(
          API.variantsGroup.getVariantGroupList + "/" + id
        );
        if (!Detail.data.error) {
          return Detail.data.data;
        } else {
          return dispatch(VariantGroup(Detail.data));
        }
      }
    } catch (err) {
      dispatch(VariantGroupErr(err));
    }
  };
};

export const deleteVariantGroup = (variantGroupIds) => {
  return async (dispatch) => {
    try {
      const getDeletedVariantGroup = await DataService.post(
        API.variantsGroup.deleteAllVariantGroup,
        variantGroupIds
      );
      if (!getDeletedVariantGroup.data.error) {
        return dispatch(VariantGroupDelete(getDeletedVariantGroup.data));
      } else {
        return dispatch(VariantGroupDeleteErr(getDeletedVariantGroup.data));
      }
    } catch (err) {
      dispatch(VariantGroupAddErr(err));
    }
  };
};
