import actions from "./actions";

const { searchHeaderBegin, searchHeaderSuccess, searchHeaderErr } = actions;

const headerSearchAction = (searchData) => {
  return async (dispatch) => {
    try {
      dispatch(searchHeaderBegin());
      const data = [].filter((item) => {
        return item.title.startsWith(searchData);
      });
      dispatch(searchHeaderSuccess(data));
    } catch (err) {
      dispatch(searchHeaderErr(err));
    }
  };
};

export { headerSearchAction };
