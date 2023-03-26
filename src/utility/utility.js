/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
import { getItem, setItem } from "./localStorageControl";
import moment from "moment";
const ellipsis = (text, size) => {
  return `${text
    .split(" ")
    .slice(0, size)
    .join(" ")}...`;
};

function generate_random_string(string_length) {
  let random_string = "";
  let random_ascii;
  let ascii_low = 65;
  let ascii_high = 90;
  for (let i = 0; i < string_length; i++) {
    random_ascii = Math.floor(
      Math.random() * (ascii_high - ascii_low) + ascii_low
    );
    random_string += String.fromCharCode(random_ascii);
  }
  return random_string;
}

function generate_random_number(size) {
  let num = 10;
  for (let i = 0; i < size - 2; i++) {
    num = num * 10;
  }

  let val = Math.floor(num + Math.random() * 9000);
  return val;
}

const getReceiptNumber = (registerData, OrderTicketsData) => {
  if (registerData) {
    let findCurrentReceiptNumber = getItem(
      `Bill-${registerData.receipt_number_prefix}`
    );
    let receipt_number;
    if (findCurrentReceiptNumber) {
      receipt_number = `${findCurrentReceiptNumber.receipt}-${
        OrderTicketsData.length == 0
          ? findCurrentReceiptNumber.sn + 1
          : findCurrentReceiptNumber.sn
      }`;

      if (OrderTicketsData.length == 0) {
        setItem(`Bill-${registerData.receipt_number_prefix}`, {
          receipt: findCurrentReceiptNumber.receipt,
          sn: findCurrentReceiptNumber.sn + 1,
        });
      }
    } else {
      let receipt_top = `${
        registerData.receipt_number_prefix
      }-${generate_random_string(3)}-${moment().format("YYDD")}`;
      setItem(`Bill-${registerData.receipt_number_prefix}`, {
        receipt: receipt_top,
        sn: 1,
      });
      receipt_number = `${receipt_top}-1`;
    }

    return receipt_number;
  } else {
    alert("notfindregisterdatainreceiptNumber");
  }
};
const getBookingNumber = (registerData, OrderTicketsData) => {
  let findCurrentReceiptNumber = getItem(
    `Booking-${registerData.receipt_number_prefix}`
  );
  let receipt_number;
  if (findCurrentReceiptNumber) {
    receipt_number = `${findCurrentReceiptNumber.receipt}-${
      OrderTicketsData.length == 0
        ? findCurrentReceiptNumber.sn + 1
        : findCurrentReceiptNumber.sn
    }`;

    if (OrderTicketsData.length == 0) {
      setItem(`Booking-${registerData.receipt_number_prefix}`, {
        receipt: findCurrentReceiptNumber.receipt,
        sn: findCurrentReceiptNumber.sn + 1,
      });
    }
  } else {
    let receipt_top = `${
      registerData.receipt_number_prefix
    }-${generate_random_string(3)}-BK`;
    setItem(`Booking-${registerData.receipt_number_prefix}`, {
      receipt: receipt_top,
      sn: 1,
    });
    receipt_number = `${receipt_top}-1`;
  }

  return receipt_number;
};
const dateCompare = (time1, time2) => {
  var t1 = new Date();
  var parts = time1.split(":");
  t1.setHours(parts[0], parts[1], parts[2], 0);
  var t2 = new Date();
  parts = time2.split(":");
  t2.setHours(parts[0], parts[1], parts[2], 0);

  // returns 1 if greater, -1 if less and 0 if the same
  if (t1.getTime() > t2.getTime()) return 1;
  if (t1.getTime() < t2.getTime()) return -1;
  return 0;
};
export {
  ellipsis,
  generate_random_string,
  generate_random_number,
  getReceiptNumber,
  getBookingNumber,
  dateCompare,
};
