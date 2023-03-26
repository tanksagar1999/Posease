import actions from './actions';

const initialState = {
  mainVariantGroupList: [],
  variantGroupList: [],
  PreviewList: [],
  PreviewData: {},
  searchText: '',
  variantGroupData: {},
  deletedItem: {},
};

const {

  VARIANT_GROUP_LIST,
  VARIANT_GROUP_LIST_ERR,
  VARIANT_GROUP_BY_ID,
  VARIANT_GROUP_BY_ID_ERR,
  VARIANT_GROUP_DELETE,
  VARIANT_GROUP_DELETE_ERR,
  VARIANT_GROUP_ADD,
  VARIANT_GROUP_ADD_ERR,
  VARIANT_GROUP_IMPORT_PREVIEW_LIST,
  VARIANT_GROUP_IMPORT_PREVIEW_ERR,
  VARIANT_GROUP_IMPORT_DATA,
  VARIANT_GROUP_IMPORT_DATA_ERR,
} = actions;

const variantGroupReducer = (state = initialState, action = {}) => {
  const { mainVariantGroupList } = state;
  const {
    variantGroupData,
    err,
    deletedItem,
    PreviewList,
    PreviewData
  } = actions;

  switch (action.type) {
    case 'VARIANT_GROUP_LIST':
      return { ...state, mainVariantGroupList: [...action.payload], variantGroupList: [...action.payload] };
    case 'VARIANT_GROUP_LIST_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_GROUP_ADD':
      return {
        ...state, variantGroupData,
      };
    case 'VARIANT_GROUP_ADD_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_GROUP_DELETE':
      return {
        ...state,
        deletedItem,
      };
    case 'VARIANT_GROUP_DELETE_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_GROUP_BY_ID':
      return {
        ...state,
        variantGroupData,
      };
    case 'VARIANT_GROUP_BY_ID_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_GROUP_IMPORT_PREVIEW_LIST':
      return {
        ...state, PreviewList,
      };
    case 'VARIANT_GROUP_IMPORT_PREVIEW_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_GROUP_IMPORT_DATA':
      return {
        ...state, PreviewData,
      };
    case 'VARIANT_GROUP_IMPORT_DATA_ERR':
      return {
        ...state,
        err,
      };

    default: return state;
  }
};

export { variantGroupReducer }