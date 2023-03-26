import actions from "./actions";
const {
  PRODUCT_ADD,
  PRODUCT_ADD_ERR,
  PRODUCT_UPDATE,
  PRODUCT_UPDATE_ERR,
  PRODUCT_LIST,
  PRODUCT_LIST_ERR,
  PRODUCT_DATA,
  PRODUCT_DATA_ERR,
  PRODUCT_DELETE,
  PRODUCT_DELETE_ERR,
  PRODUCT_CATEGORY_LIST,
  PRODUCT_CATEGORY_LIST_ERR,
  ORDER_TICKET_GROUPED_LIST,
  ORDER_TICKET_GROUPED_LIST_ERR,
  PRODUCT_CATEGORY_ADD,
  PRODUCT_CATEGORY_ADD_ERR,
  ORDER_TICKET_GROUPED_ADD,
  ORDER_TICKET_GROUPED_ADD_ERR,
  ORDER_TICKET_GROUPED_DELETE,
  ORDER_TICKET_GROUPED_DELETE_ERR,
  PRODUCT_CATEGORY_DELETE,
  PRODUCT_CATEGORY_DELETE_ERR,
  ORDER_TICKET_GROUPED_BY_ID,
  ORDER_TICKET_GROUPED_BY_ID_ERR,
  PRODUCT_CATEGORY_BY_ID,
  PRODUCT_CATEGORY_BY_ID_ERR,
  PRODUCT_IMPORT_PREVIEW_LIST,
  PRODUCT_IMPORT_PREVIEW_ERR,
  PRODUCT_IMPORT_DATA,
  PRODUCT_IMPORT_DATA_ERR,
  IS_NEW_ITEM,
  PRODUCT_TOP_SELL_DATA,
  PRODUCT_TOP_SELL_DATA_ERR,
} = actions;

const initialState = {
  productData: [],
  categoryList: [],
  categoryData: {},
  PreviewList: [],
  PreviewData: {},
  product: {},
  orderTicketGroupList: [],
  orderTicketGroupedData: {},
  deletedItem: {},
  newItem: [],
  top_products: [],
};

const productReducer = (state = initialState, action) => {
  const {
    type,
    product,
    categoryList,
    categoryData,
    orderTicketGroupList,
    orderTicketGroupedData,
    deletedItem,
    productList,
    totalProduct,
    err,
    PreviewData,
    PreviewList,
    newItem,
    topProductList,
  } = action;

  const { productData } = state;

  switch (type) {
    case PRODUCT_TOP_SELL_DATA:
      return {
        ...state,
        topProductList,
      };
    case PRODUCT_TOP_SELL_DATA_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_CATEGORY_LIST:
      return {
        ...state,
        categoryList,
      };
    case PRODUCT_CATEGORY_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_ADD:
      return {
        ...state,
        product,
      };
    case PRODUCT_ADD_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_UPDATE:
      return {
        ...state,
        product,
      };
    case PRODUCT_UPDATE_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_LIST:
      return {
        ...state,
        productData: productList,
        totalProduct,
      };
    case PRODUCT_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_DATA:
      return {
        ...state,
        product,
      };
    case PRODUCT_DATA_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_CATEGORY_ADD:
      return {
        ...state,
        categoryData,
      };
    case PRODUCT_CATEGORY_ADD_ERR:
      return {
        ...state,
        err,
      };
    case ORDER_TICKET_GROUPED_LIST:
      return {
        ...state,
        orderTicketGroupList,
      };
    case ORDER_TICKET_GROUPED_LIST_ERR:
      return {
        ...state,
        err,
      };
    case ORDER_TICKET_GROUPED_ADD:
      return {
        ...state,
        orderTicketGroupedData,
      };
    case ORDER_TICKET_GROUPED_ADD_ERR:
      return {
        ...state,
        err,
      };
    case ORDER_TICKET_GROUPED_DELETE:
      return {
        ...state,
        deletedItem,
      };
    case ORDER_TICKET_GROUPED_DELETE_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_CATEGORY_DELETE:
      return {
        ...state,
        deletedItem,
      };
    case PRODUCT_CATEGORY_DELETE_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_DELETE:
      return {
        ...state,
        deletedItem,
      };
    case PRODUCT_DELETE_ERR:
      return {
        ...state,
        err,
      };
    case ORDER_TICKET_GROUPED_BY_ID:
      return {
        ...state,
        orderTicketGroupedData,
      };
    case ORDER_TICKET_GROUPED_BY_ID_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_CATEGORY_BY_ID:
      return {
        ...state,
        categoryData,
      };
    case PRODUCT_CATEGORY_BY_ID_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_IMPORT_PREVIEW_LIST:
      return {
        ...state,
        PreviewList,
      };
    case PRODUCT_IMPORT_PREVIEW_ERR:
      return {
        ...state,
        err,
      };
    case PRODUCT_IMPORT_DATA:
      return {
        ...state,
        PreviewData,
      };
    case PRODUCT_IMPORT_DATA_ERR:
      return {
        ...state,
        err,
      };
    case IS_NEW_ITEM:
      return {
        ...state,
        newItem,
      };

    default:
      return state;
  }
};
export { productReducer };
