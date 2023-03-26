import moment from "moment";

const getDefaultHeader = (token = "") => {
  token = localStorage.getItem("token");
  if (token != "") {
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
  } else {
    return {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "app-key": "f1295da7-0b05-4e69-a846-59649bafcb6a",
      },
    };
  }
};

const getMultipartHeader = (token = "") => {
  token = localStorage.getItem("token");
  if (token != "") {
    return {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    };
  } else {
    return {
      headers: {
        "content-type": "multipart/form-data",
        "app-key": "f1295da7-0b05-4e69-a846-59649bafcb6a",
      },
    };
  }
};

const convertToDate = (date, format = null) => {
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format("YYYY-MM-DD");
};

const convertToTime = (date) => {
  return moment(date).format("h:mma");
};

const timeCurrentDifference = (startDate) => {
  let diff = moment(startDate).diff(moment());
  let duration = moment.duration(diff);
  if (duration.asHours() < 0) {
    return -1;
  }
  return Math.floor(duration.asHours()) + moment.utc(diff).format(":mm:ss");
};

const daysDifference = (startDate) => {
  let diff = moment(startDate).diff(moment());
  let duration = moment.duration(diff);
  let days = Math.floor(duration.asDays());
  return days;
};

const checkIsAccessAvailable = () => {
  if (localStorage.getItem("token") !== null) {
    return true;
  } else {
    return false;
  }
};

const methods = {
  convertToDate,
  convertToTime,
  daysDifference,
  timeCurrentDifference,
  getDefaultHeader,
  checkIsAccessAvailable,
  getMultipartHeader,
};

export default methods;
