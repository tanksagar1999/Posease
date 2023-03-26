import actions from "./actions";

const initialState = {
  shopData: {},
};

const shopReducer = (state = initialState, action = {}) => {
  const { err } = actions;
  switch (action.type) {
    case "SHOP_DETAIL":
      return { ...state, shopData: action.payload };
    case "SHOP_DETAIL_ERR":
      return {
        ...state,
        err,
      };

    default:
      return state;
  }
};

export { shopReducer };
