import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

import "../sell.css";
import { Modal, Button, Form, Input } from "antd";
import { getItem } from "../../../utility/localStorageControl";
const SplitBookingAdvance = forwardRef((props, ref) => {
  const {
    paymnetsList,
    bookingAdvance,
    bookingAdvancePaymnetType,
    SubmitSplitBookingAdvancePaymentType,
  } = props;
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let [pyamnetTypeArrayList, setPaymnetTypeArrayList] = useState([
    {
      name: "Cash",
      value: 0,
    },
    { name: "Credit / Debit Card", value: 0 },
    { name: "Other", value: 0 },
    ...paymnetsList,
  ]);
  const [spiltForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [excess, setExcess] = useState(0);
  const [pending, setPending] = useState(0);
  useEffect(() => {
    setPending(bookingAdvance);
  }, [bookingAdvance]);

  const [splitUpdateButoonDisbled, setSplitUpdateButtonDisbled] = useState(
    true
  );
  useImperativeHandle(ref, () => ({
    showModal() {
      setIsModalVisible(true);
    },
    hideModal() {
      setIsModalVisible(false);
    },
  }));

  const handleCancelBookingSplit = (e) => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    let paymnetType;
    if (bookingAdvancePaymnetType == "cash") {
      paymnetType = "Cash";
    } else if (bookingAdvancePaymnetType == "card") {
      paymnetType = "Credit / Debit Card";
    } else if (bookingAdvancePaymnetType == "other") {
      paymnetType = "Other";
    } else {
      paymnetType = bookingAdvancePaymnetType;
    }
    pyamnetTypeArrayList.map((data) => {
      if (data.name == paymnetType) {
        data.value = bookingAdvance;
      } else {
        data.value = 0;
      }
    });
    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
      return acc + Number(obj.value);
    }, 0);

    if (sum == bookingAdvance) {
      setSplitUpdateButtonDisbled(false);
    }
  }, [bookingAdvancePaymnetType, bookingAdvance]);
  return (
    <>
      <Modal
        title="Split Payments"
        okText="Save & Close"
        visible={isModalVisible}
        onCancel={handleCancelBookingSplit}
        footer={[
          <Button onClick={() => handleCancelBookingSplit()}>Cancel</Button>,
          <Button
            type="primary"
            disabled={splitUpdateButoonDisbled}
            onClick={() =>
              SubmitSplitBookingAdvancePaymentType(pyamnetTypeArrayList)
            }
          >
            Update
          </Button>,
        ]}
        width={600}
      >
        {splitUpdateButoonDisbled && (
          <small style={{ paddingBottom: "10px" }}>
            {pending > 0 && excess == 0 && (
              <span className="span-center">
                {rsSymbol}
                {pending} pending
              </span>
            )}
            {excess > 0 && pending == 0 && (
              <span className="span-center">
                {rsSymbol}
                {excess} excess
              </span>
            )}
          </small>
        )}
        <Form
          style={{ width: "100%" }}
          name="export"
          form={spiltForm}
          labelCol={{ span: 10 }}
        >
          {pyamnetTypeArrayList.map((val, index) => {
            return (
              <Form.Item label={val.name} name={val.name}>
                <div style={{ display: "none" }}>{val.value}</div>
                <Input
                  placeholder="0"
                  type="number"
                  value={val.value}
                  style={{ marginBottom: 6 }}
                  a-key={index}
                  onChange={(e) => {
                    pyamnetTypeArrayList[e.target.getAttribute("a-key")] = {
                      name: val.name,
                      value: e.target.value,
                    };
                    setPaymnetTypeArrayList([...pyamnetTypeArrayList]);
                    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
                      return acc + Number(obj.value);
                    }, 0);

                    if (sum == bookingAdvance) {
                      setSplitUpdateButtonDisbled(false);
                      setPending(0);
                      setExcess(0);
                    } else if (sum > bookingAdvance) {
                      setSplitUpdateButtonDisbled(true);
                      setPending(0);
                      setExcess(sum - bookingAdvance);
                    } else if (bookingAdvance > sum) {
                      setSplitUpdateButtonDisbled(true);
                      setExcess(0);
                      setPending(bookingAdvance - sum);
                    } else {
                      setSplitUpdateButtonDisbled(true);
                    }
                  }}
                />
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </>
  );
});

export { SplitBookingAdvance };
