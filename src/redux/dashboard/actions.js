const actions = {
  DASHBOARD_DATA: "DASHBOARD_DATA",
  DASHBOARD_DATA_ERR: "DASHBOARD_DATA_ERR",
  DASHBOARD_DATE_WISE_DATA: "DASHBOARD_DATE_WISE_DATA",
  DASHBOARD_DATE_WISE_DATA_ERR: "DASHBOARD_DATE_WISE_DATA_ERR",
  SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA:
    "SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA",
  SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA_ERR:
    "SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA_ERR",

  dashboardData: (dashboardDetails) => {
    return {
      type: actions.DASHBOARD_DATA,
      dashboardDetails,
    };
  },

  dashboardDataErr: (err) => {
    return {
      type: actions.DASHBOARD_DATA_ERR,
      err,
    };
  },
  datewiseChangeData: (dashboardDateWiseDetails) => {
    return {
      type: actions.DASHBOARD_DATE_WISE_DATA,
      dashboardDateWiseDetails,
    };
  },

  datewiseChangeDataErr: (err) => {
    return {
      type: actions.DASHBOARD_DATE_WISE_DATA_ERR,
      err,
    };
  },
  
  saleSummarydatewiseChangeData: (saleSummaruydashboardDateWiseDetails) => {
    return {
      type: actions.SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA,
      saleSummaruydashboardDateWiseDetails,
    };
  },

  saleSummarydatewiseChangeDataErr: (err) => {
    return {
      type: actions.SALE_SUMMARY_DASHBOARD_DATE_WISE_DATA_ERR,
      err,
    };
  },
};

export default actions;
