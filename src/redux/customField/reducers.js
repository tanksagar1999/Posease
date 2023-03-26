import actions from "./actions";
const {
  CUSTOMFIELD_ADD,
  CUSTOMFIELD_ADD_ERR,
  CUSTOMFIELD_ID,
  CUSTOMFIELD_ID_ERR,
  CUSTOMFIELD_DELETED,
  CUSTOMFIELD_DELETED_ERR,
  PATTY_CASH_LIST,
  PATTY_CASH_LIST_ERR,
  PAYMENT_TYPE_LIST,
  PAYMENT_TYPE_LIST_ERR,
  AADTIONAL_LIST,
  AADTIONAL_LIST_ERR,
  TAG_LIST,
  TAG_LIST_ERR,
} = actions;

const initialState = {
  CustomFieldList: [],
  searchCustomField: "",
  CustomFieldIdData: {},
};

const customFieldReducer = (state = initialState, action) => {
  const {
    type,
    err,
    CustomFieldData,
    CustomFieldIdData,
    CustomFieldDeletedData,
    PattyCashList,
    PaymentTypeList,
    TagList,
    AddtionalList,
  } = action;
  switch (type) {
    case CUSTOMFIELD_ADD:
      return {
        ...state,
        CustomFieldData,
      };
    case CUSTOMFIELD_ADD_ERR:
      return {
        ...state,
        err,
      };

    case CUSTOMFIELD_ID:
      return {
        ...state,
        CustomFieldIdData,
      };
    case CUSTOMFIELD_ID_ERR:
      return {
        ...state,
        err,
      };
    case CUSTOMFIELD_DELETED:
      return {
        ...state,
        CustomFieldDeletedData,
      };
    case CUSTOMFIELD_DELETED_ERR:
      return {
        ...state,
        err,
      };
    case PATTY_CASH_LIST:
      return {
        ...state,
        PattyCashList,
      };
    case PATTY_CASH_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PAYMENT_TYPE_LIST:
      return {
        ...state,
        PaymentTypeList,
      };
    case PAYMENT_TYPE_LIST_ERR:
      return {
        ...state,
        err,
      };
    case AADTIONAL_LIST:
      return {
        ...state,
        AddtionalList,
      };
    case AADTIONAL_LIST_ERR:
      return {
        ...state,
        err,
      };
    case TAG_LIST:
      return {
        ...state,
        TagList,
      };
    case TAG_LIST_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { customFieldReducer };
