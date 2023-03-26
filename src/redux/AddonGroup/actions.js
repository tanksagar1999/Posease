
const actions = {
  ADDON_GROUP_LIST: "ADDON_GROUP_LIST",
  ADDON_GROUP_LIST_ERR: "ADDON_ROUP_LIST_ERR",
  ADDON_GROUP_BY_ID: "ADDON_GROUP_BY_ID",
  ADDON_GROUP_BY_ID_ERR: "ADDON_GROUP_BY_ID_ERR",
  ADDON_GROUP_DELETE: "ADDON_GROUP_DELETE",
  ADDON_GROUP_DELETE_ERR: "ADDON_GROUP_DELETE_ERR",
  ADDON_GROUP_ADD: "ADDON_GROUP_ADD",
  ADDON_GROUP_ADD_ERR: "ADDON_GROUP_ADD_ERR",
  ADDON_GROUP_IMPORT_PREVIEW_LIST: "ADDON_GROUP_IMPORT_PREVIEW_LIST",
  ADDON_GROUP_IMPORT_PREVIEW_ERR: "ADDON_GROUP_IMPORT_PREVIEW_ERR",
  ADDON_GROUP_IMPORT_DATA: "ADDON_GROUP_IMPORT_DATA",
  ADDON_GROUP_IMPORT_DATA_ERR: "ADDON_GROUP_IMPORT_DATA_ERR",



  AddonGroupList: (addonGroupList) => {
    return {
      type: actions.ADDON_GROUP_LIST,
      payload: addonGroupList,
    };
  },
  AddonGroupDelete: (deletedItem) => {
    return {
      type: actions.ADDON_GROUP_DELETE,
      deletedItem,
    };
  },

  AddonGroupDeleteErr: (err) => {
    return {
      type: actions.ADDON_GROUP_DELETE_ERR,
      err,
    };
  },

  AddonGroupListErr: (err) => {
    return {
      type: actions.ADDON_GROUP_LIST_ERR,
      err,
    };
  },

  AddonGroupAdd: (AddonGroupData) => {
    return {
      type: actions.ADDON_GROUP_ADD,
      AddonGroupData,
    };
  },

  AddonGroupAddErr: (err) => {
    return {
      type: actions.ADDON_GROUP_ADD_ERR,
      err,
    };
  },
  AddonGroup: (addonGroupData) => {
    return {
      type: actions.ADDON_GROUP_BY_ID,
      addonGroupData,
    };
  },
  AddonGroupErr: (err) => {
    return {
      type: actions.ADDON_GROUP_BY_ID_ERR,
      err,
    };
  },
  AddonGroupImportPreview: (PreviewList) => {
    return {
      type: actions.ADDON_GROUP_IMPORT_PREVIEW_ERR,
      PreviewList,
    };
  },
  AddonGroupImportPreviewErr: (err) => {
    return {
      type: actions.ADDON_GROUP_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  AddonGroupImportData: (PreviewData) => {
    return {
      type: actions.ADDON_GROUP_IMPORT_DATA,
      PreviewData,
    };
  },

  AddonGroupImportDataErr: (err) => {
    return {
      type: actions.ADDON_GROUP_IMPORT_DATA_ERR,
      err,
    };
  },



};

export default actions;
