
const actions = {
  VARIANT_GROUP_LIST: "VARIANT_GROUP_LIST",
  VARIANT_GROUP_LIST_ERR: "VARIANT_GROUP_LIST_ERR",
  VARIANT_GROUP_BY_ID: "VARIANT_GROUP_BY_ID",
  VARIANT_GROUP_BY_ID_ERR: "VARIANT_GROUP_BY_ID_ERR",
  VARIANT_GROUP_DELETE: "VARIANT_GROUP_DELETE",
  VARIANT_GROUP_DELETE_ERR: "VARIANT_GROUP_DELETE_ERR",
  VARIANT_GROUP_ADD: "VARIANT_GROUP_ADD",
  VARIANT_GROUP_ADD_ERR: "VARIANT_GROUP_ADD_ERR",
  VARIANT_GROUP_IMPORT_PREVIEW_LIST: "VARIANT_GROUP_IMPORT_PREVIEW_LIST",
  VARIANT_GROUP_IMPORT_PREVIEW_ERR: "VARIANT_GROUP_IMPORT_PREVIEW_ERR",
  VARIANT_GROUP_IMPORT_DATA: "VARIANT_GROUP_IMPORT_DATA",
  VARIANT_GROUP_IMPORT_DATA_ERR: "VARIANT_GROUP_IMPORT_DATA_ERR",


  VariantGroupList: (variantGroupList) => {
    return {
      type: actions.VARIANT_GROUP_LIST,
      payload: variantGroupList,
    };
  },
  VariantGroupDelete: (deletedItem) => {
    return {
      type: actions.VARIANT_GROUP_DELETE,
      deletedItem,
    };
  },

  VariantGroupDeleteErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_DELETE_ERR,
      err,
    };
  },

  VariantGroupListErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_LIST_ERR,
      err,
    };
  },

  VarinatGroupAdd: (variantGroupData) => {
    return {
      type: actions.VARIANT_GROUP_ADD,
      error: false,
      variantGroupData,
    };
  },

  VariantGroupAddErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_ADD_ERR,
      error: true,
      err,
    };
  },
  VariantGroup: (variantGroupData) => {
    return {
      type: actions.VARIANT_GROUP_BY_ID,
      variantGroupData,
    };
  },

  VariantGroupErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_BY_ID_ERR,
      err,
    };
  },
  VariantGroupImportPreview: (PreviewList) => {
    return {
      type: actions.VARIANT_GROUP_IMPORT_PREVIEW_ERR,
      PreviewList,
    };
  },
  VariantGroupImportPreviewErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  VariantGroupImportData: (PreviewData) => {
    return {
      type: actions.VARIANT_GROUP_IMPORT_DATA,
      PreviewData,
    };
  },

  VariantGroupImportDataErr: (err) => {
    return {
      type: actions.VARIANT_GROUP_IMPORT_DATA_ERR,
      err,
    };
  },
};

export default actions;
