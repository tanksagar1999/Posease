import actions from "./actions";

const initialState = {
  mainAddonGroupList: [],
  addonGroupList: [],
  searchText: "",
  addonGroupData: {},
  deletedItem: {},
  PreviewList: [],
  PreviewData: {},
};

const addonGroupReducer = (state = initialState, action = {}) => {
  const {
    addonGroupData,
    deletedItem,
    err,
    PreviewList,
    PreviewData,
  } = actions;

  switch (action.type) {
    case "ADDON_GROUP_LIST":
      return {
        ...state,
        mainAddonGroupList: [...action.payload],
        addonGroupList: [...action.payload],
      };
    case "ADDON_GROUP_LIST_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_GROUP_ADD":
      return {
        ...state,
        addonGroupData,
      };
    case "ADDON_GROUP_ADD_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_GROUP_DELETE":
      return {
        ...state,
        deletedItem,
      };
    case "ADDON_GROUP_DELETE_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_GROUP_BY_ID":
      return {
        ...state,
        addonGroupData,
      };
    case "ADDON_GROUP_BY_ID_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_GROUP_IMPORT_PREVIEW_LIST":
      return {
        ...state,
        PreviewList,
      };
    case "ADDON_GROUP_IMPORT_PREVIEW_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_GROUP_IMPORT_DATA":
      return {
        ...state,
        PreviewData,
      };
    case "ADDON_GROUP_IMPORT_DATA_ERR":
      return {
        ...state,
        err,
      };

    default:
      return state;
  }
};

export { addonGroupReducer };
