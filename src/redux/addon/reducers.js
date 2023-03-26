import actions from "./actions";

const initialState = {
  mainAddonList: [],
  addonList: [],
  PreviewList: [],
  PreviewData: {},
  searchText: "",
  addonData: {},
  deletedItem: {},
};

const addonReducer = (state = initialState, action = {}) => {
  const { mainAddonList } = state;
  const { addonData, deletedItem, err, PreviewList, PreviewData } = actions;

  switch (action.type) {
    case "ADDON_LIST":
      return {
        ...state,
        mainAddonList: [...action.payload],
        addonList: [...action.payload],
      };
    case "ADDON_LIST_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_ADD":
      return {
        ...state,
        addonData,
      };
    case "ADDON_ADD_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_DELETE":
      return {
        ...state,
        deletedItem,
      };
    case "ADDON_DELETE_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_BY_ID":
      return {
        ...state,
        addonData,
      };
    case "ADDON_BY_ID_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_IMPORT_PREVIEW_LIST":
      return {
        ...state,
        PreviewList,
      };
    case "ADDON_IMPORT_PREVIEW_ERR":
      return {
        ...state,
        err,
      };
    case "ADDON_IMPORT_DATA":
      return {
        ...state,
        PreviewData,
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

export { addonReducer };
