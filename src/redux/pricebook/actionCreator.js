import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  priceBookAdd,
  priceBookAddErr,
  registerName,
  registerNameErr,
  priceBookList,
  priceBookListErr,
  PriceBookId,
  PriceBookIdErr,
  priceBookDelete,
  priceBookDeleteErr,
  updateProductPricebook,
  updateProductPricebookErr,
  pricebookProductList,
  pricebookProductListErr,
  pricebookAddonList,
  pricebookAddonListErr,
  pricebookVariantList,
  pricebookVariantListErr,
  ProductImportPreview,
  ProductImportPreviewErr,
  ProductImportData,
  ProductImportDataErr,
  AddonImportPreview,
  AddonImportPreviewErr,
  AddonImportData,
  AddonImportDataErr,
} = actions;

const addOrUpdatePriceBook = (formData, pricebook_id) => {
  return async (dispatch) => {
    try {
      let getAddedPriceBook = {};
      if (pricebook_id) {
        getAddedPriceBook = await DataService.put(
          `${API.pricebook.addPriceBook}/${pricebook_id}`,
          formData
        );
      } else {
        getAddedPriceBook = await DataService.post(
          API.pricebook.addPriceBook,
          formData
        );
      }
      if (!getAddedPriceBook.data.error) {
        return dispatch(priceBookAdd(getAddedPriceBook.data.data));
      } else {
        return dispatch(priceBookAddErr(getAddedPriceBook.data.data));
      }
    } catch (err) {
      dispatch(priceBookAddErr(err));
    }
  };
};

const UpdateProductPriceBook = (formData, pricebook_id) => {
  return async (dispatch) => {
    try {
      let getAddedPriceBook = {};
      getAddedPriceBook = await DataService.put(
        `${API.pricebook.updateProductPricebook}/${pricebook_id}`,
        formData
      );
      if (!getAddedPriceBook.data.error) {
        return dispatch(updateProductPricebook(getAddedPriceBook.data.data));
      } else {
        return dispatch(updateProductPricebookErr(getAddedPriceBook.data.data));
      }
    } catch (err) {
      dispatch(updateProductPricebookErr(err));
    }
  };
};
const getAllRegisterNameList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.register != undefined &&
        allSetupcache.register.length &&
        checkSell == "sell"
      ) {
        return dispatch(registerName(allSetupcache.register));
      } else {
        const getregisterName = await DataService.get(
          API.pricebook.getAllRegisters
        );
        if (!getregisterName.data.error) {
          return dispatch(registerName(getregisterName.data.data));
        } else {
          return dispatch(registerNameErr(getregisterName.data));
        }
      }
    } catch (err) {
      dispatch(registerNameErr(err));
    }
  };
};

const getAllPriceBookList = () => {
  return async (dispatch) => {
    try {
      const getPriceBookList = await DataService.get(
        API.pricebook.getAllPriceBook
      );
      if (!getPriceBookList.data.error) {
        let allSetupcache = getItem("setupCache");
        allSetupcache.productPriceBooks = getPriceBookList.data.data;
        setItem("setupCache", allSetupcache);
        return dispatch(priceBookList(getPriceBookList.data.data));
      } else {
        return dispatch(priceBookListErr(getPriceBookList.data));
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productPriceBooks) {
        return dispatch(priceBookList(allSetupcache.productPriceBooks));
      } else {
        return dispatch(priceBookListErr(err));
      }
    }
  };
};

const getpriceBookById = (id) => {
  return async (dispatch) => {
    try {
      const PriceBookByIdData = await DataService.get(
        `${API.pricebook.getPriceBookById}/${id}`
      );
      if (!PriceBookByIdData.data.error) {
        return dispatch(PriceBookId(PriceBookByIdData.data.data));
      } else {
        return dispatch(PriceBookIdErr(PriceBookByIdData.data));
      }
    } catch (err) {
      dispatch(PriceBookIdErr(err));
    }
  };
};

const deletePriceBook = (PriceBookIds) => {
  return async (dispatch) => {
    try {
      const getDeletedPricebook = await DataService.post(
        API.pricebook.deleteAllPriceBook,
        PriceBookIds
      );

      if (!getDeletedPricebook.data.error) {
        return dispatch(priceBookDelete(getDeletedPricebook.data));
      } else {
        return dispatch(priceBookDeleteErr(getDeletedPricebook.data));
      }
    } catch (err) {
      dispatch(priceBookDeleteErr(err));
    }
  };
};

const getAllPricebookProductList = (id, currentPage) => {
  let limit = 10;
  return async (dispatch) => {
    try {
      const getpricebookProductList = await DataService.get(
        `${API.pricebook.getAllPricebookProducts}/${id}`
      );

      if (!getpricebookProductList.data.error) {
        return dispatch(
          pricebookProductList(getpricebookProductList.data.data)
        );
      } else {
        return dispatch(pricebookProductListErr(getpricebookProductList.data));
      }
    } catch (err) {
      dispatch(pricebookProductListErr(err));
    }
  };
};
const getAllPricebookAddonList = (id) => {
  return async (dispatch) => {
    try {
      const getPricebookAddonList = await DataService.get(
        `${API.pricebook.getAllPricebookAddons}/${id}`
      );
      if (!getPricebookAddonList.data.error) {
        return dispatch(pricebookAddonList(getPricebookAddonList.data.data));
      } else {
        return dispatch(pricebookAddonListErr(getPricebookAddonList.data));
      }
    } catch (err) {
      dispatch(pricebookAddonListErr(err));
    }
  };
};
const getAllPricebookVariantList = (id) => {
  return async (dispatch) => {
    try {
      const getPricebookVariantList = await DataService.get(
        `${API.pricebook.getAllPricebookVariants}/${id}`
      );
      if (!getPricebookVariantList.data.error) {
        return dispatch(
          pricebookVariantList(getPricebookVariantList.data.data)
        );
      } else {
        return dispatch(pricebookVariantListErr(getPricebookVariantList.data));
      }
    } catch (err) {
      dispatch(pricebookVariantListErr(err));
    }
  };
};

const exportPricebookProduct = (payloads, id) => {
  return async (dispatch) => {
    const resp = await DataService.post(
      `${API.pricebook.exportPricebookProducts}/${id}`,
      payloads
    );
  };
};
const exportPricebookAddons = (payloads, id) => {
  return async (dispatch) => {
    const resp = await DataService.post(
      `${API.pricebook.exportPricebookAddons}/${id}`,
      payloads
    );
  };
};

const exportPricebookVarints = (payloads, id) => {
  return async (dispatch) => {
    const resp = await DataService.post(
      `${API.pricebook.exportPricebookVariants}/${id}`,
      payloads
    );
  };
};

// import product //
const ImportProductInBulk = (payloads, id) => {
  return async (dispatch) => {
    try {
      let getProduct = {};
      getProduct = await DataService.post(
        `${API.pricebook.importProductList}/${id}`,
        payloads
      );
      if (!getProduct.data.error) {
        return dispatch(ProductImportPreview(getProduct.data));
      } else {
        return dispatch(ProductImportPreviewErr(getProduct.data));
      }
    } catch (err) {
      dispatch(ProductImportPreviewErr(err));
    }
  };
};

const ConfirmImport = (payloads, id) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        `${API.pricebook.importProductData}/${id}`,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(ProductImportData(getPreview.data));
      } else {
        return dispatch(ProductImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(ProductImportDataErr(err));
    }
  };
};

// import addons //
const ImportAddonInBulk = (payloads, id) => {
  return async (dispatch) => {
    try {
      let getAddon = {};
      getAddon = await DataService.post(
        `${API.pricebook.importAddonsList}/${id}`,
        payloads
      );
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

const ConfirmAddonsImport = (payloads, id) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        `${API.pricebook.importAddonsData}/${id}`,
        payloads
      );
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

export {
  addOrUpdatePriceBook,
  getAllRegisterNameList,
  getAllPriceBookList,
  getpriceBookById,
  deletePriceBook,
  UpdateProductPriceBook,
  getAllPricebookProductList,
  getAllPricebookAddonList,
  getAllPricebookVariantList,
  exportPricebookProduct,
  exportPricebookAddons,
  exportPricebookVarints,
  ImportProductInBulk,
  ConfirmImport,
  ImportAddonInBulk,
  ConfirmAddonsImport,
};
