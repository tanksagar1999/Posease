import actions from "./actions";

const { SEARCH_HEADER_SUCCESS, SEARCH_HEADER_ERR } = actions;

const headerSearchReducer = (state = {}, action) => {
  const { type, data, err } = action;
  switch (type) {
    case SEARCH_HEADER_SUCCESS:
      return data;
    case SEARCH_HEADER_ERR:
      return err;
    default:
      return state;
  }
};

export { headerSearchReducer };
