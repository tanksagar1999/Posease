import React, { useState } from "react";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { DatePicker } from "antd";
import { ItemWraper, ButtonGroup } from "./style";
import { Button } from "../buttons/buttons";
import commonFunction from "../../utility/commonFunctions";
import { useDispatch } from "react-redux";
import {
  getDateList,
  getAllPattyList,
} from "../../redux/pattyCash/actionCreator";
import {
  getDateWiseReceptsList,
  getAllReceiptsList,
} from "../../redux/receipts/actionCreator";
import {
  getDateWiseBookingList,
  getAllBookingList,
} from "../../redux/sell/actionCreator";
import { el } from "date-fns/locale";
const DateRangePickerOne = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    datePickerInternational: null,
    dateRangePicker: {
      selection: {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: "selection",
      },
    },
  });

  const handleRangeChange = (which) => {
    setState({
      ...state,
      dateRangePicker: {
        ...state.dateRangePicker,
        ...which,
      },
    });
  };

  const { dateRangePicker } = state;
  const start_date = dateRangePicker.selection.startDate.toString().split(" ");

  const startDate = commonFunction.convertToDate(
    dateRangePicker.selection.startDate,
    "LL"
  );
  const endDate = commonFunction.convertToDate(
    dateRangePicker.selection.endDate,
    "LL"
  );
  const start = commonFunction.convertToDate(
    dateRangePicker.selection.startDate,
    "YYYY-MM-DD"
  );
  const end = commonFunction.convertToDate(
    dateRangePicker.selection.endDate,
    "YYYY-MM-DD"
  );

  const handleSubmit = () => {
    if (props.type === "patty") {
      dispatch(getDateList(start, end));
    } else if (props.type === "receipts") {
      dispatch(getDateWiseReceptsList(start, end));
    } else if (props.type === "booking") {
      dispatch(getDateWiseBookingList(start, end));
    }
    props.handlePopover(false);
  };

  const handleCancle = () => {
    if (props.type === "patty") {
      dispatch(getAllPattyList());
    } else if (props.type === "receipts") {
      dispatch(getAllReceiptsList());
    } else if (props.type === "booking") {
      dispatch(getAllBookingList());
    }
    props.handlePopover(false);
  };

  return (
    <ItemWraper>
      <DateRangePicker
        onChange={handleRangeChange}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        className="PreviewArea"
        months={2}
        ranges={[dateRangePicker.selection]}
        direction="horizontal"
      />

      <ButtonGroup>
        <p>{`${startDate} - ${endDate}`}</p>
        <Button size="small" type="primary" onClick={handleSubmit}>
          Apply
        </Button>
        <Button size="small" type="white" outlined onClick={handleCancle}>
          Cancel
        </Button>
      </ButtonGroup>
    </ItemWraper>
  );
};

export { DateRangePickerOne };
