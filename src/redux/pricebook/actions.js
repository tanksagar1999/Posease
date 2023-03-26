const actions = {
  SEARCH_HEADER_BEGIN: "SEARCH_HEADER_BEGIN",
  SEARCH_HEADER_SUCCESS: "SEARCH_HEADER_SUCCESS",
  SEARCH_HEADER_ERR: "SEARCH_HEADER_ERR",
  PRICE_BOOK_ADD: "PRICE_BOOK_ADD",
  PRICE_BOOK_ADD_ERR: "PRICE_BOOK_ADD_ERR",
  REGISTER_NAME_LIST: "REGISTER_NAME_LIST",
  REGISTER_NAME_LIST_ERR: "REGISTER_NAME_LIST_ERR",
  PRICE_BOOK_LIST: "PRICE_BOOK_LIST",
  PRICE_BOOK_LIST_ERR: "PRICE_BOOK_LIST_ERR",
  PRICE_BOOK_ID: "PRICE_BOOK_ID",
  PRICE_BOOK_ID_ERR: "PRICE_BOOK_ID_ERR",
  PRICE_BOOK_DELETED: "PRICE_BOOK_DELETED",
  PRICE_BOOK_DELETED_ERR: "PRICE_BOOK_DELETED_ERR",
  PRICE_BOOK_PRODUCT_UPDATE: "PRICE_BOOK_PRODUCT_UPDATE",
  PRICE_BOOK_PRODUCT_UPDATE_ERR: "PRICE_BOOK_PRODUCT_UPDATE_ERR",
  PRICEBOOK_PRODUCT_LIST: "PRICEBOOK_PRODUCT_LIST",
  PRICEBOOK_PRODUCT_LIST_ERR: "PRICEBOOK_PRODUCT_LIST_ERR",
  PRICEBOOK_ADDON_LIST: "PRICEBOOK_ADDON_LIST",
  PRICEBOOK_ADDON_LIST_ERR: "PRICEBOOK_ADDON_LIST_ERR",
  PRICEBOOK_VARIANT_LIST: "PRICEBOOK_VARIANT_LIST",
  PRICEBOOK_VARIANT_LIST_ERR: "PRICEBOOK_VARIANT_LIST_ERR",
  PRODUCT_IMPORT_PREVIEW: "PRODUCT_IMPORT_PREVIEW",
  PRODUCT_IMPORT_PREVIEW_ERR: "PRODUCT_IMPORT_PREVIEW_ERR",
  PRODUCT_IMPORT_DATA: "PRODUCT_IMPORT_DATA",
  PRODUCT_IMPORT_DATA_ERR: "PRODUCT_IMPORT_DATA_ERR",
  ADDON_IMPORT_PREVIEW: "ADDON_IMPORT_PREVIEW",
  ADDON_IMPORT_PREVIEW_ERR: "ADDON_IMPORT_PREVIEW_ERR",
  ADDON_IMPORT_DATA: "ADDON_IMPORT_DATA",
  ADDON_IMPORT_DATA_ERR: "ADDON_IMPORT_DATA_ERR",
  priceBookAdd: (PriceBookData) => {
    return {
      type: actions.PRICE_BOOK_ADD,
      error: false,
      PriceBookData,
    };
  },

  priceBookAddErr: (err) => {
    return {
      type: actions.PRICE_BOOK_ADD_ERR,
      error: true,
      err,
    };
  },
  updateProductPricebook: (UpdateProductData) => {
    return {
      type: actions.PRICE_BOOK_PRODUCT_UPDATE,
      UpdateProductData,
    };
  },

  updateProductPricebookErr: (err) => {
    return {
      type: actions.PRICE_BOOK_PRODUCT_UPDATE_ERR,
      err,
    };
  },
  registerName: (registerNameList) => {
    return {
      type: actions.REGISTER_NAME_LIST,
      registerNameList,
    };
  },
  registerNameErr: (RegisterErr) => {
    return {
      type: actions.REGISTER_NAME_LIST_ERR,
      RegisterErr,
    };
  },
  priceBookList: (PriceBookList) => {
    return {
      type: actions.PRICE_BOOK_LIST,
      PriceBookList,
    };
  },
  priceBookListErr: (err) => {
    return {
      type: actions.PRICE_BOOK_LIST_ERR,
      err,
    };
  },
  PriceBookId: (PriceBookIdData) => {
    return {
      type: actions.PRICE_BOOK_ID,
      PriceBookIdData,
    };
  },
  PriceBookIdErr: (err) => {
    return {
      type: actions.PRICE_BOOK_ID_ERR,
      err,
    };
  },
  priceBookDelete: (PriceBookDeletedData) => {
    return {
      type: actions.PRICE_BOOK_DELETED,
      PriceBookDeletedData,
    };
  },
  priceBookDeleteErr: (err) => {
    return {
      type: actions.PRICE_BOOK_DELETED_ERR,
      err,
    };
  },
  pricebookProductList: (PriceBookProductList) => {
    return {
      type: actions.PRICEBOOK_PRODUCT_LIST,
      PriceBookProductList,
    };
  },
  pricebookProductListErr: (err) => {
    return {
      type: actions.PRICEBOOK_PRODUCT_LIST_ERR,
      err,
    };
  },
  pricebookAddonList: (PricebookAddonList) => {
    return {
      type: actions.PRICEBOOK_ADDON_LIST,
      PricebookAddonList,
    };
  },
  pricebookAddonListErr: (err) => {
    return {
      type: actions.PRICEBOOK_ADDON_LIST_ERR,
      err,
    };
  },
  pricebookVariantList: (PricebookVariantList) => {
    return {
      type: actions.PRICEBOOK_VARIANT_LIST,
      PricebookVariantList,
    };
  },
  pricebookVariantListErr: (err) => {
    return {
      type: actions.PRICEBOOK_VARIANT_LIST_ERR,
      err,
    };
  },
  ProductImportPreview: (PreviewList) => {
    return {
      type: actions.PRODUCT_IMPORT_PREVIEW,
      PreviewList,
    };
  },
  ProductImportPreviewErr: (err) => {
    return {
      type: actions.PRODUCT_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  ProductImportData: (PreviewData) => {
    return {
      type: actions.PRODUCT_IMPORT_DATA,
      PreviewData,
    };
  },

  ProductImportDataErr: (err) => {
    return {
      type: actions.PRODUCT_IMPORT_DATA_ERR,
      err,
    };
  },
  AddonImportPreview: (AddonsPreviewList) => {
    return {
      type: actions.ADDON_IMPORT_PREVIEW,
      AddonsPreviewList,
    };
  },
  AddonImportPreviewErr: (err) => {
    return {
      type: actions.ADDON_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  AddonImportData: (AddonsPreviewData) => {
    return {
      type: actions.ADDON_IMPORT_DATA,
      AddonsPreviewData,
    };
  },

  AddonImportDataErr: (err) => {
    return {
      type: actions.ADDON_IMPORT_DATA_ERR,
      err,
    };
  },
};

export default actions;
