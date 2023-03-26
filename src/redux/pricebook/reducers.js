import actions from "./actions";
const {
  PRICE_BOOK_ADD,
  PRICE_BOOK_ADD_ERR,
  REGISTER_NAME_LIST,
  REGISTER_NAME_LIST_ERR,
  PRICE_BOOK_LIST,
  PRICE_BOOK_LIST_ERR,
  PRICE_BOOK_ID,
  PRICE_BOOK_ID_ERR,
  PRICE_BOOK_DELETED,
  PRICE_BOOK_DELETED_ERR,
  PRICE_BOOK_PRODUCT_UPDATE,
  PRICE_BOOK_PRODUCT_UPDATE_ERR,
  PRICEBOOK_PRODUCT_LIST,
  PRICEBOOK_PRODUCT_LIST_ERR,
  PRICEBOOK_ADDON_LIST,
  PRICEBOOK_ADDON_LIST_ERR,
  PRICEBOOK_VARIANT_LIST,
  PRICEBOOK_VARIANT_LIST_ERR,
  PRODUCT_IMPORT_PREVIEW_LIST,
  PRODUCT_IMPORT_PREVIEW_ERR,
  PRODUCT_IMPORT_DATA,
  PRODUCT_IMPORT_DATA_ERR,
} = actions;

const initialState = {
  PriceBookList: [],
  searchPriceBook: "",
  PriceBookIdData: {},
  ProductPreviewList: [],
  ProductPreviewData: {},
  AddonsPreviewList: [],
  AddonsPreviewData: {},
};

const pricebookReducer = (state = initialState, action) => {
  const {
    type,
    err,
    PriceBookData,
    registerNameList,
    RegisterErr,
    PriceBookList,
    PriceBookIdData,
    PriceBookDeletedData,
    UpdateProductData,
    PriceBookProductList,
    PricebookAddonList,
    PricebookVariantList,
    PreviewData,
    PreviewList,
    AddonsPreviewList,
    AddonsPreviewData,
  } = action;
  switch (type) {
    case PRICE_BOOK_ADD:
      return {
        ...state,
        PriceBookData,
      };
    case PRICE_BOOK_ADD_ERR:
      return {
        ...state,
        err,
      };
    case PRICEBOOK_ADDON_LIST:
      return {
        ...state,
        PricebookAddonList,
      };
    case PRICEBOOK_ADDON_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRICE_BOOK_PRODUCT_UPDATE:
      return {
        ...state,
        UpdateProductData,
      };
    case PRICE_BOOK_PRODUCT_UPDATE_ERR:
      return {
        ...state,
        err,
      };
    case REGISTER_NAME_LIST:
      return {
        ...state,
        registerNameList,
      };
    case REGISTER_NAME_LIST_ERR:
      return {
        ...state,
        RegisterErr,
      };
    case PRICE_BOOK_LIST:
      return {
        ...state,
        PriceBookList,
      };
    case PRICE_BOOK_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRICE_BOOK_ID:
      return {
        ...state,
        PriceBookIdData,
      };
    case PRICE_BOOK_ID_ERR:
      return {
        ...state,
        err,
      };
    case PRICE_BOOK_DELETED:
      return {
        ...state,
        PriceBookDeletedData,
      };
    case PRICE_BOOK_DELETED_ERR:
      return {
        ...state,
        err,
      };
    case PRICEBOOK_PRODUCT_LIST:
      return {
        ...state,
        PriceBookProductList,
      };
    case PRICEBOOK_PRODUCT_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRICEBOOK_VARIANT_LIST:
      return {
        ...state,
        PricebookVariantList,
      };
    case PRICEBOOK_VARIANT_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_IMPORT_PREVIEW_LIST:
      return {
        ...state,
        ProductPreviewList: PreviewList,
      };
    case PRODUCT_IMPORT_PREVIEW_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_IMPORT_DATA:
      return {
        ...state,
        ProductPreviewData: PreviewData,
      };
    case PRODUCT_IMPORT_DATA_ERR:
      return {
        ...state,
        err,
      };
    case "ADDON_IMPORT_PREVIEW_LIST":
      return {
        ...state,
        AddonsPreviewList,
      };
    case "ADDON_IMPORT_PREVIEW_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_IMPORT_DATA":
      return {
        ...state,
        AddonsPreviewData,
      };
    case "ADDON_IMPORT_DATA_ERR":
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { pricebookReducer };
