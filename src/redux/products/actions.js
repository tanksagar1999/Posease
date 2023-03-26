const actions = {
  PRODUCT_ADD: "PRODUCT_ADD",
  PRODUCT_ADD_ERR: "PRODUCT_ADD_ERR",
  PRODUCT_DATA: "PRODUCT_DATA",
  PRODUCT_DATA_ERR: "PRODUCT_DATA_ERR",
  PRODUCT_UPDATE: "PRODUCT_UPDATE",
  PRODUCT_UPDATE_ERR: "PRODUCT_UPDATE_ERR",
  PRODUCT_LIST: "PRODUCT_LIST",
  PRODUCT_LIST_ERR: "PRODUCT_LIST_ERR",
  PRODUCT_DELETE: "PRODUCT_DELETE",
  PRODUCT_DELETE_ERR: "PRODUCT_DELETE_ERR",
  PRODUCT_CATEGORY_LIST: "PRODUCT_CATEGORY_LIST",
  PRODUCT_CATEGORY_LIST_ERR: "PRODUCT_CATEGORY_LIST_ERR",
  ORDER_TICKET_GROUPED_LIST: "ORDER_TICKET_GROUPED_LIST",
  ORDER_TICKET_GROUPED_LIST_ERR: "ORDER_TICKET_GROUPED_LIST_ERR",
  ORDER_TICKET_GROUPED_BY_ID: "ORDER_TICKET_GROUPED_BY_ID",
  ORDER_TICKET_GROUPED_BY_ID_ERR: "ORDER_TICKET_GROUPED_BY_ID_ERR",
  PRODUCT_CATEGORY_BY_ID: "PRODUCT_CATEGORY_BY_ID",
  PRODUCT_CATEGORY_BY_ID_ERR: "PRODUCT_CATEGORY_BY_ID_ERR",
  ORDER_TICKET_GROUPED_DELETE: "ORDER_TICKET_GROUPED_DELETE",
  ORDER_TICKET_GROUPED_DELETE_ERR: "ORDER_TICKET_GROUPED_DELETE_ERR",
  PRODUCT_CATEGORY_DELETE: "PRODUCT_CATEGORY_DELETE",
  PRODUCT_CATEGORY_DELETE_ERR: "PRODUCT_CATEGORY_DELETE_ERR",
  PRODUCT_CATEGORY_ADD: "PRODUCT_CATEGORY_ADD",
  PRODUCT_CATEGORY_ADD_ERR: "PRODUCT_CATEGORY_ADD_ERR",
  ORDER_TICKET_GROUPED_ADD: "ORDER_TICKET_GROUPED_ADD",
  ORDER_TICKET_GROUPED_ADD_ERR: "ORDER_TICKET_GROUPED_ADD_ERR",
  PRODUCT_IMPORT_PREVIEW: "PRODUCT_IMPORT_PREVIEW",
  PRODUCT_IMPORT_PREVIEW_ERR: "PRODUCT_IMPORT_PREVIEW_ERR",
  PRODUCT_IMPORT_DATA: "PRODUCT_IMPORT_DATA",
  PRODUCT_IMPORT_DATA_ERR: "PRODUCT_IMPORT_DATA_ERR",
  IS_NEW_ITEM: "IS_NEW_ITEM",
  PRODUCT_TOP_SELL_DATA: "PRODUCT_TOP_SELL_DATA",
  PRODUCT_TOP_SELL_DATA_ERR: "PRODUCT_TOP_SELL_DATA_ERR",

  productList: (productList, totalProduct) => {
    return {
      type: actions.PRODUCT_LIST,
      error: false,
      productList,
      totalProduct,
    };
  },

  productListErr: (err) => {
    return {
      type: actions.PRODUCT_LIST_ERR,
      error: true,
      err,
    };
  },
  newItemSet: (newItem) => {
    return {
      type: actions.IS_NEW_ITEM,
      newItem,
    };
  },

  productUpdate: (product) => {
    return {
      type: actions.PRODUCT_UPDATE,
      product,
    };
  },

  productUpdateErr: (err) => {
    return {
      type: actions.PRODUCT_UPDATE_ERR,
      err,
    };
  },

  productCategoryList: (categoryList) => {
    return {
      type: actions.PRODUCT_CATEGORY_LIST,
      categoryList,
    };
  },

  orderTicketGroupedList: (orderTicketGroupList) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_LIST,
      orderTicketGroupList,
    };
  },

  orderTicketGroupedListErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_LIST_ERR,
      err,
    };
  },

  orderTicketGroupedDelete: (deletedItem) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_DELETE,
      deletedItem,
    };
  },

  orderTicketGroupedDeleteErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_DELETE_ERR,
      err,
    };
  },

  productCategoryDelete: (deletedItem) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_DELETE,
      deletedItem,
    };
  },

  productCategoryDeleteErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_DELETE_ERR,
      err,
    };
  },

  productDelete: (deletedItem) => {
    return {
      type: actions.PRODUCT_DELETE,
      deletedItem,
    };
  },

  productDeleteErr: (err) => {
    return {
      type: actions.PRODUCT_DELETE_ERR,
      err,
    };
  },

  productCategoryListErr: (err) => {
    return {
      type: actions.PRODUCT_CATEGORY_LIST_ERR,
      err,
    };
  },

  productCategoryAdd: (categoryData) => {
    return {
      type: actions.PRODUCT_CATEGORY_ADD,
      error: false,
      categoryData,
    };
  },

  productCategoryAddErr: (err) => {
    return {
      type: actions.PRODUCT_CATEGORY_ADD_ERR,
      error: true,
      err,
    };
  },

  productAdd: (product) => {
    return {
      type: actions.PRODUCT_ADD,
      product,
    };
  },

  productAddErr: (err) => {
    return {
      type: actions.PRODUCT_ADD_ERR,
      err,
    };
  },

  orderTicketGroupedAdd: (orderTicketGroupedData) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_ADD,
      orderTicketGroupedData,
    };
  },

  orderTicketGroupedAddErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_ADD_ERR,
      err,
    };
  },

  orderTicketGrouped: (orderTicketGroupedData) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_BY_ID,
      orderTicketGroupedData,
    };
  },

  orderTicketGroupedErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_BY_ID_ERR,
      err,
    };
  },

  productCategory: (categoryData) => {
    return {
      type: actions.PRODUCT_CATEGORY_BY_ID,
      categoryData,
    };
  },

  productCategoryErr: (err) => {
    return {
      type: actions.PRODUCT_CATEGORY_BY_ID_ERR,
      err,
    };
  },

  product: (product) => {
    return {
      type: actions.PRODUCT_DATA,
      product,
    };
  },

  productErr: (err) => {
    return {
      type: actions.PRODUCT_DATA_ERR,
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

  productTopSellList: (topProductList) => {
    return {
      type: actions.PRODUCT_TOP_SELL_DATA,
      topProductList,
    };
  },

  productTopSellListErr: (err) => {
    return {
      type: actions.PRODUCT_TOP_SELL_DATA_ERR,
      err,
    };
  },
};

export default actions;
