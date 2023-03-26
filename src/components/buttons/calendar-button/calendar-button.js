import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { DateRangePickerOne } from "../../datePicker/datePicker";
import { Button } from "../buttons";
import { Popover } from "antd";

const CalendarButtonPageHeader = (props) => {
  const [onClickCalenderOff, setOnClickCalenderOff] = useState(false);

  function handlePopover(Value) {
    setOnClickCalenderOff(Value);
  }
  const content = (
    <>
      <DateRangePickerOne type={props.type} handlePopover={handlePopover} />
    </>
  );

  return (
    <Popover
      placement="bottomRight"
      title="Search by Calendar"
      content={content}
      visible={onClickCalenderOff}
    >
      <Button
        size="small"
        type="white"
        onClick={() => setOnClickCalenderOff(!onClickCalenderOff)}
      >
        <FeatherIcon icon="calendar" size={14} />
        Calendar
      </Button>
    </Popover>
  );
};

export { CalendarButtonPageHeader };
