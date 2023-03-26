import actions from "./actions";
const {
  DISCOUNTRULES_ADD,
  DISCOUNTRULES_ADD_ERR,
  DISCOUNTRULES_LIST,
  DISCOUNTRULES_LIST_ERR,
  DISCOUNTRULES_ID,
  DISCOUNTRULES_ID_ERR,
  DISCOUNTRULES_DELETED,
  DISCOUNTRULES_DELETED_ERR,
} = actions;

const initialState = {
  DiscountRulesData: {},
  DiscountRulesList: [],
  DiscountRulesIdData: {},
  DiscountRulesDeletedData: {},
};

const discountRulesReducer = (state = initialState, action) => {
  const {
    type,
    err,
    DiscountRulesData,
    DiscountRulesList,
    DiscountRulesIdData,
    DiscountRulesDeletedData,
  } = action;
  switch (type) {
    case DISCOUNTRULES_ADD:
      return {
        ...state,
        DiscountRulesData,
      };
    case DISCOUNTRULES_ADD_ERR:
      return {
        ...state,
        err,
      };
    case DISCOUNTRULES_LIST:
      return {
        ...state,
        DiscountRulesList,
      };
    case DISCOUNTRULES_LIST_ERR:
      return {
        ...state,
        err,
      };
    case DISCOUNTRULES_ID:
      return {
        ...state,
        DiscountRulesIdData,
      };
    case DISCOUNTRULES_ID_ERR:
      return {
        ...state,
        err,
      };
    case DISCOUNTRULES_DELETED:
      return {
        ...state,
        DiscountRulesDeletedData,
      };
    case DISCOUNTRULES_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { discountRulesReducer };
