
const actions = {
  ADDON_LIST: "ADDON_LIST",
  ADDON_LIST_ERR: "ADDON_LIST_ERR",
  ADDON_BY_ID: "ADDON_BY_ID",
  ADDON_BY_ID_ERR: "ADDON_BY_ID_ERR",
  ADDON_DELETE: "ADDON_DELETE",
  ADDON_DELETE_ERR: "ADDON_DELETE_ERR",
  ADDON_ADD: "ADDON_ADD",
  ADDON_ADD_ERR: "ADDON_ADD_ERR",
  ADDON_IMPORT_PREVIEW: "ADDON_IMPORT_PREVIEW",
  ADDON_IMPORT_PREVIEW_ERR: "ADDON_IMPORT_PREVIEW_ERR",
  ADDON_IMPORT_DATA: "ADDON_IMPORT_DATA",
  ADDON_IMPORT_DATA_ERR: "ADDON_IMPORT_DATA_ERR",


  AddonList: (AddonList) => {
    return {
      type: actions.ADDON_LIST,
      payload: AddonList,
    };
  },
  AddonDelete: (deletedItem) => {
    return {
      type: actions.ADDON_DELETE,
      deletedItem,
    };
  },

  AddonDeleteErr: (err) => {
    return {
      type: actions.ADDON_DELETE_ERR,
      err,
    };
  },

  AddonListErr: (err) => {
    return {
      type: actions.ADDON_DELETE_ERR,
      err,
    };
  },

  AddonAdd: (AddonData) => {
    return {
      type: actions.ADDON_ADD,
      error: false,
      AddonData,
    };
  },

  AddonAddErr: (err) => {
    return {
      type: actions.ADDON_ADD_ERR,
      error: true,
      err,
    };
  },
  Addon: (AddonData) => {
    return {
      type: actions.ADDON_BY_ID,
      AddonData,
    };
  },

  AddonErr: (err) => {
    return {
      type: actions.ADDON_BY_ID_ERR,
      err,
    };
  },
  AddonImportPreview: (PreviewList) => {
    return {
      type: actions.ADDON_IMPORT_PREVIEW,
      PreviewList,
    };
  },
  AddonImportPreviewErr: (err) => {
    return {
      type: actions.ADDON_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  AddonImportData: (PreviewData) => {
    return {
      type: actions.ADDON_IMPORT_DATA,
      PreviewData,
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
