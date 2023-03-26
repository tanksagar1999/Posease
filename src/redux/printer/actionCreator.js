import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const getAllPrinterList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");

      if (
        checkSell == "sell" &&
        allSetupcache &&
        allSetupcache.printerList != undefined
      ) {
        return allSetupcache.printerList;
      } else {
        const AllPrinterListData = await DataService.get(
          API.printer.addPrinter
        );

        if (!AllPrinterListData.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.printerList = AllPrinterListData.data.data;
          setItem("setupCache", allSetupcache);

          return AllPrinterListData.data.data;
        } else {
          return AllPrinterListData;
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache != null && allSetupcache.printerList) {
        return allSetupcache.printerList;
      } else {
        return allSetupcache.printerList;
      }
    }
  };
};

const getPrinterById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let PrinterDetails;
      if (allSetupcache != null && allSetupcache.printerList) {
        PrinterDetails = allSetupcache.printerList.find((val) => val._id == id);
      }
      if (PrinterDetails) {
        return PrinterDetails;
      } else {
        const PrinterByIdData = await DataService.get(
          `${API.printer.addPrinter}/${id}`
        );
        if (!PrinterByIdData.data.error) {
          return dispatch(PrinterId(PrinterByIdData.data.data));
        } else {
          return dispatch(PrinterIdErr(PrinterByIdData.data));
        }
      }
    } catch (err) {
      dispatch(PrinterIdErr(err));
    }
  };
};

const addOrUpdatePrinter = (formData, Printer_id) => {
  return async (dispatch) => {
    try {
      let getAddedPrinter;
      if (Printer_id) {
        getAddedPrinter = await DataService.put(
          `${API.printer.addPrinter}/${Printer_id}`,
          formData
        );
        if (getAddedPrinter) {
          let allSetupcache = getItem("setupCache");
          if (allSetupcache.setUpPrinter.length > 0) {
            let updateSetUpList = [];

            allSetupcache.setUpPrinter.map((val) => {
              if (val.add_printer_id == getAddedPrinter.data.data._id) {
                let updateObj = {
                  ...val,
                  connected_printer_name:
                    getAddedPrinter.data.data.connect_printer,
                  left: getAddedPrinter.data.data.left
                    ? getAddedPrinter.data.data.left
                    : undefined,
                  top: getAddedPrinter.data.data.top
                    ? getAddedPrinter.data.data.top
                    : undefined,
                  content_size: getAddedPrinter.data.data.content_size
                    ? getAddedPrinter.data.data.content_size
                    : undefined,
                  printer_name: getAddedPrinter.data.data.printer_name
                    ? getAddedPrinter.data.data.printer_name
                    : undefined,
                };
                updateSetUpList.push(updateObj);
              } else {
                updateSetUpList.push(val);
              }
            });
            allSetupcache.setUpPrinter = updateSetUpList;

            setItem("setupCache", allSetupcache);
          }
        }
      } else {
        getAddedPrinter = await DataService.post(
          API.printer.addPrinter,
          formData
        );
      }

      if (!getAddedPrinter.data.error) {
        return getAddedPrinter;
      } else {
        return getAddedPrinter;
      }
    } catch (err) {
      err;
    }
  };
};

const setUpAdd = (formData, Printer_id) => {
  return async (dispatch) => {
    try {
      let getAddedPrinter;
      let submitData = {
        printer_type: formData.printer_type,
        printer_name: formData.printer_name,
      };

      submitData.connected_printer_name = formData.connected_printer_name
        ? formData.connected_printer_name
        : "";

      if (formData.top) {
        submitData.top = formData.top;
      }
      if (formData.left) {
        submitData.left = formData.left;
      }
      if (formData.content_size) {
        submitData.content_size = formData.content_size;
      }
      if (formData.add_printer_id) {
        submitData.add_printer_id = formData.add_printer_id;
      }
      if (formData.printer_id == "") {
        getAddedPrinter = await DataService.post(API.printer.setUp, submitData);
        return getAddedPrinter;
      } else {
        getAddedPrinter = await DataService.put(
          `${API.printer.setUpEdit}/${formData.printer_id}`,
          submitData
        );
        getAddedPrinter.error = false;
        return getAddedPrinter;
      }
    } catch (err) {
      err;
    }
  };
};
const SwitchPrinter = (payload) => {
  return async (dispatch) => {
    try {
      let getSwitchPrinter = {};
      getSwitchPrinter = await DataService.post(
        API.Printer.SwitchCurrentPrinter,
        payload
      );
      if (!getSwitchPrinter.data.error) {
        setItem("access_token", getSwitchPrinter.data.data.token);
        return dispatch(changePrinterSuccess(getSwitchPrinter.data.data));
      } else {
        return dispatch(changePrinterErr(getSwitchPrinter.data.error));
      }
    } catch (err) {
      dispatch(changePrinterErr(err));
    }
  };
};

const deletePrinter = (PrinterIds) => {
  return async (dispatch) => {
    try {
      const getDeletedPrinter = await DataService.post(
        API.printer.deleteAllPrinter,
        PrinterIds
      );

      if (!getDeletedPrinter.data.error) {
        return getDeletedPrinter;
      } else {
        return getDeletedPrinter;
      }
    } catch (err) {
      return err;
    }
  };
};

const getAllSetUpPrinterList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        checkSell == "sell" &&
        allSetupcache &&
        allSetupcache.setUpPrinter != undefined
      ) {
        return allSetupcache.setUpPrinter;
      } else {
        const AllPrinterListData = await DataService.get(API.printer.setUpList);

        if (!AllPrinterListData.data.error) {
          let allSetupcache = getItem("setupCache");

          allSetupcache.setUpPrinter = AllPrinterListData.data.data;
          setItem("setupCache", allSetupcache);

          return AllPrinterListData.data.data;
        } else {
          return AllPrinterListData;
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache != null && allSetupcache.setUpPrinter) {
        return allSetupcache.setUpPrinter;
      } else {
        return allSetupcache.setUpPrinter;
      }
    }
  };
};
export {
  getAllPrinterList,
  SwitchPrinter,
  getPrinterById,
  deletePrinter,
  addOrUpdatePrinter,
  setUpAdd,
  getAllSetUpPrinterList,
};
