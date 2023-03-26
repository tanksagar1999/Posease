import actions from "./actions";

const {
  DASHBOARD_DATA,
  DASHBOARD_DATA_ERR,
  DASHBOARD_DATE_WISE_DATA,
  DASHBOARD_DATE_WISE_DATA_ERR,
  SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA,
  SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA_ERR,
} = actions;

const initialState = {
  dashboardDetails: {},
  dashboardDateWiseDetails: {},
};

const dashboardReducer = (state = initialState, action = {}) => {
  const {
    dashboardDetails,
    err,
    dashboardDateWiseDetails,
    saleSummaruydashboardDateWiseDetails,
  } = actions;
  switch (action.type) {
    case DASHBOARD_DATA:
      return {
        ...state,
        dashboardDetails,
      };
    case DASHBOARD_DATA_ERR:
      return {
        ...state,
        err,
      };
    case DASHBOARD_DATE_WISE_DATA:
      return {
        ...state,
        dashboardDateWiseDetails,
      };
    case DASHBOARD_DATE_WISE_DATA_ERR:
      return {
        ...state,
        err,
      };
    case SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA:
      return {
        ...state,
        saleSummaruydashboardDateWiseDetails,
      };
    case SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};

export { dashboardReducer };
