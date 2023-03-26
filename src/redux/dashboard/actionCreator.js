import actions from "./actions";
import { getItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import moment from "moment";
const {
  dashboardData,
  dashboardDataErr,
  datewiseChangeData,
  datewiseChangeDataErr,
  saleSummarydatewiseChangeData,
  saleSummarydatewiseChangeDataErr,
} = actions;

export const getAlldashboradData = () => {
  return async (dispatch) => {
    try {
      let Data = getItem("setupCache").register.find((val) => val.active);
      let startDate = moment().format("YYYY-MM-DD");
      let endDate = moment().format("YYYY-MM-DD");
      let url =
        getItem("userDetails").role == "cashier"
          ? `${
              API.dashboard.getAllData
            }?&startDate=${startDate}&endDate=${endDate}&register_id=${
              Data._id
            }&timeZon=${Intl.DateTimeFormat().resolvedOptions().timeZone}`
          : `${
              API.dashboard.getAllData
            }?&startDate=${startDate}&endDate=${endDate}&register_id=${"allRegister"}&timeZon=${
              Intl.DateTimeFormat().resolvedOptions().timeZone
            }`;
      console.log("opoopoooopopopo", url);
      const dashboradDetails = await DataService.get(url);
      if (!dashboradDetails.data.error) {
        return dispatch(dashboardData(dashboradDetails.data.data));
      } else {
        return dispatch(dashboardDataErr(dashboradDetails.data));
      }
    } catch (err) {
      dispatch(dashboardDataErr(err));
    }
  };
};

export const getAlldashboradDatwiseChangeData = (startDate, endDate, id) => {
  return async (dispatch) => {
    try {
      const dashboradDetails = await DataService.get(
        `${API.dashboard.getAllData}?register_id=${id}&timeZon=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }`
      );
      if (!dashboradDetails.data.error) {
        return dispatch(datewiseChangeData(dashboradDetails.data.data));
      } else {
        return dispatch(datewiseChangeDataErr(dashboradDetails.data));
      }
    } catch (err) {
      dispatch(datewiseChangeDataErr(err));
    }
  };
};

export const getSaleSummaryDatwiseChangeData = (ab, cd, type, id) => {
  return async (dispatch) => {
    try {
      let startDate;
      let endDate;
      if (type == "today") {
        startDate = moment().format("YYYY-MM-DD");
        endDate = moment().format("YYYY-MM-DD");
      } else if (type == "yesterday") {
        console.log("yesterday");
        startDate = moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD");
      } else if (type == "this_month") {
        startDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .endOf("month")
          .format("YYYY-MM-DD");
      } else if (type == "last_month") {
        startDate = moment()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
      } else {
        startDate = moment().format("YYYY-MM-DD");
        endDate = moment().format("YYYY-MM-DD");
      }

      const dashboradDetails = await DataService.get(
        `${
          API.dashboard.getAllData
        }?startDate=${startDate}&endDate=${endDate}&dateRange=${type}&register_id=${id}&timeZon=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }`
      );
      if (!dashboradDetails.data.error) {
        return dispatch(
          saleSummarydatewiseChangeData(dashboradDetails.data.data)
        );
      } else {
        return dispatch(
          saleSummarydatewiseChangeDataErr(dashboradDetails.data)
        );
      }
    } catch (err) {
      dispatch(datewiseChangeDataErr(err));
    }
  };
};
