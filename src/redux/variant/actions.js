
const actions = {
  VARIANT_LIST: "VARIANT_LIST",
  VARIANT_LIST_ERR: "PRODUCT_CATEGORY_LIST_ERR",
  VARIANT_BY_ID: "VARIANT_BY_ID",
  VARIANT_BY_ID_ERR: "VARIANT_BY_ID_ERR",
  VARIANT_DELETE: "VARIANT_DELETE",
  VARIANT_DELETE_ERR: "VARIANT_DELETE_ERR",
  VARIANT_ADD: "VARIANT_ADD",
  VARIANT_ADD_ERR: "VARIANT_ADD_ERR",
  VARIANT_IMPORT_PREVIEW_LIST: "VARIANT_IMPORT_PREVIEW_LIST",
  VARIANT_IMPORT_PREVIEW_ERR: "VARIANT_IMPORT_PREVIEW_ERR",
  VARIANT_IMPORT_DATA: "VARIANT_IMPORT_DATA",
  VARIANT_IMPORT_DATA_ERR: "VARIANT_IMPORT_DATA_ERR",

  VariantList: (variantList) => {
    return {
      type: actions.VARIANT_LIST,
      payload: variantList,
    };
  },
  VariantDelete: (deletedItem) => {
    return {
      type: actions.VARIANT_DELETE,
      deletedItem,
    };
  },

  VariantDeleteErr: (err) => {
    return {
      type: actions.ORDER_TICKET_GROUPED_DELETE_ERR,
      err,
    };
  },

  VariantListErr: (err) => {
    return {
      type: actions.VARIANT_LIST_ERR,
      err,
    };
  },

  VarinatAdd: (variantData) => {
    return {
      type: actions.VARIANT_ADD,
      variantData,
    };
  },

  VariantAddErr: (err) => {
    return {
      type: actions.VARIANT_ADD_ERR,
      err,
    };
  },
  Variant: (variantData) => {
    return {
      type: actions.VARIANT_BY_ID,
      variantData,
    };
  },

  VariantErr: (err) => {
    return {
      type: actions.VARIANT_BY_ID_ERR,
      err,
    };
  },


  VariantImportPreview: (PreviewList) => {
    return {
      type: actions.VARIANT_IMPORT_PREVIEW_ERR,
      PreviewList,
    };
  },
  VariantImportPreviewErr: (err) => {
    return {
      type: actions.VARIANT_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  VariantImportData: (PreviewData) => {
    return {
      type: actions.VARIANT_IMPORT_DATA,
      PreviewData,
    };
  },

  VariantImportDataErr: (err) => {
    return {
      type: actions.VARIANT_IMPORT_DATA_ERR,
      err,
    };
  },






};


export default actions;
