import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  Tag,
  Button,
  Tabs,
  DatePicker,
  TimePicker,
  Checkbox,
} from "antd";
import moment from "moment";
import { AddAndUpdateBooking } from "../../redux/sell/actionCreator";
import { useDispatch } from "react-redux";
import {
  getAllAddtionalList,
  getAllTagList,
} from "../../redux/customField/actionCreator";

const EditBookingReceipts = forwardRef((props, ref) => {
  let isMounted = useRef(true);
  const { RecepitsDataDetails, updateFetch } = props;
  const [selectedTags, setselectedTags] = useState([]);
  const { TabPane } = Tabs;
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [TagList, setTagList] = useState([]);
  const [modalEditVisible, setModelEditVisible] = useState(false);
  const [customerMobialNumber, setCustomerMobaialNumer] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerEmail, setCustomerEmail] = useState();
  const [zipCode, setZipCode] = useState();
  const [city, setCity] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [DeliveryDoor, setDeliveryDoor] = useState(false);
  const { CheckableTag } = Tag;
  const [DateString, setDateString] = useState(moment().format("LL"));
  const [DeliveryTime, setDeliveryTime] = useState(moment().format("LT"));
  const [bookingNotes, setBookingNotes] = useState("");
  let [AddtionalList, setAddtionalList] = useState([]);

  useEffect(() => {
    if (RecepitsDataDetails?.order_id.details.custom_fields) {
      const array = [];
      RecepitsDataDetails.order_id.details.custom_fields.map((field, index) => {
        if (field.type === "tag") {
          array.push(field.name);
        }
      });
      setselectedTags(array);
    }
  }, [RecepitsDataDetails]);

  useEffect(() => {
    async function fetchAddtionalList() {
      let CustomArray = [];
      const getAddtionalList = await dispatch(getAllAddtionalList());
      if (
        isMounted.current &&
        getAddtionalList &&
        getAddtionalList.AddtionalList
      )
        getAddtionalList.AddtionalList.map((val) => {
          if (val.sub_type === "customer") {
            CustomArray.push(val);
          }
        });

      if (RecepitsDataDetails?.order_id.details.customer_custom_fields) {
        RecepitsDataDetails.order_id.details.customer_custom_fields.map(
          (val) => {
            if (val.type == "additional_detail") {
              CustomArray.map((data) => {
                if (data.name == val.name) {
                  data.value = val.value;
                }
              });
            }
          }
        );
      }

      setAddtionalList(CustomArray);
    }
    fetchAddtionalList();
  }, [RecepitsDataDetails]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    setselectedTags(nextSelectedTags);
  };

  useEffect(() => {
    setCustomerMobaialNumer(RecepitsDataDetails.order_id.customer.mobile);
    setCustomerName(RecepitsDataDetails.order_id.customer.name);
    setCustomerEmail(RecepitsDataDetails.order_id.customer.email);
    setCity(RecepitsDataDetails.order_id.customer.city);
    setZipCode(RecepitsDataDetails.order_id.customer.zipcode);
    setShippingAddress(RecepitsDataDetails.order_id.customer.shipping_address);
    setDateString(
      RecepitsDataDetails.order_id.details.bookingDetails.delivery_date
    );
    setDeliveryTime(
      RecepitsDataDetails.order_id.details.bookingDetails.delivery_time
    );
    setDeliveryDoor(
      RecepitsDataDetails.order_id.details.bookingDetails.is_door_delivery
    );
    setBookingNotes(
      RecepitsDataDetails.order_id.details.bookingDetails.booking_notes
        ? RecepitsDataDetails.order_id.details.bookingDetails.booking_notes
        : ""
    );
  }, [RecepitsDataDetails]);

  useImperativeHandle(ref, () => ({
    showModal() {
      setModelEditVisible(true);
    },
  }));

  useEffect(() => {
    async function fetchTagList() {
      const getTagList = await dispatch(getAllTagList());
      if (isMounted.current && getTagList && getTagList.TagList) {
        setTagList(getTagList.TagList);
      }
    }
    if (isMounted.current) {
      fetchTagList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const updateOrder = async () => {
    let ordederUpdatedata = { details: RecepitsDataDetails.order_id.details };
    ordederUpdatedata.customer = {
      mobile: customerMobialNumber,
      email: customerEmail,
      name: customerName,
      shipping_address: shippingAddress,
      zipcode: zipCode,
      city: city,
    };
    var arr = [];
    if (selectedTags.length > 0) {
      TagList.map((field) => {
        if (selectedTags.indexOf(field.name) > -1) {
          arr.push(field);
        }
      });
    }
    ordederUpdatedata.details.custom_fields = arr;
    let checkValueIsOrNot = AddtionalList.find((val) => {
      if (val.value) {
        return true;
      }
    });
    if (checkValueIsOrNot != undefined) {
      ordederUpdatedata.details.customer_custom_fields = AddtionalList;
    }
    ordederUpdatedata.details.bookingDetails = {
      ...RecepitsDataDetails.order_id.details.bookingDetails,
      delivery_date: DateString,
      delivery_time: DeliveryTime,
      is_door_delivery: DeliveryDoor,
      booking_notes: bookingNotes,
    };
    ordederUpdatedata.updatePaymentDate = new Date();
    const getUpdateReceiptsData = await dispatch(
      AddAndUpdateBooking(ordederUpdatedata, RecepitsDataDetails.order_id._id)
    );

    if (getUpdateReceiptsData) {
      setModelEditVisible(false);
      updateFetch(RecepitsDataDetails._id);
    }
  };
  function disabledDate(current) {
    return current && current < moment().subtract(1, "days");
  }

  return (
    <div>
      <Modal
        title="Update Details"
        visible={modalEditVisible}
        onCancel={() => setModelEditVisible(false)}
        footer={[
          <Button onClick={() => setModelEditVisible(false)}>Cancel</Button>,
          <Button type="primary" onClick={() => updateOrder()}>
            Update
          </Button>,
        ]}
        width={600}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="General" key="1">
            <Form.Item name="mobile" label="Customer Mobile">
              <div style={{ display: "none" }}>{customerMobialNumber}</div>
              <Input
                type="number"
                style={{ marginBottom: 6 }}
                placeholder="Customer Number"
                value={customerMobialNumber}
                onChange={(e) => {
                  setCustomerMobaialNumer(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="name" label="Cutomer Name">
              <div style={{ display: "none" }}>{customerName}</div>
              <Input
                style={{ marginBottom: 6 }}
                placeholder="Customer Name "
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Customer Email"
              rules={[
                {
                  message: "Please enter valid email",
                  type: "email",
                },
              ]}
            >
              <div className="hide-customerdata">{customerEmail}</div>
              <Input
                style={{ marginBottom: 6 }}
                placeholder="Customer Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </Form.Item>

            <div style={{ display: "flex" }}>
              {TagList.map((field, index, i) =>
                field.sub_type === "customer" ? (
                  <>
                    <Form.Item>
                      <CheckableTag
                        className={field.tag_color}
                        style={{
                          border: "1px solid " + field.tag_color,
                          color: field.tag_color,
                        }}
                        key={field.name}
                        checked={selectedTags.indexOf(field.name) > -1}
                        onChange={(checked) =>
                          handleChange(field.name, checked)
                        }
                      >
                        {field.name}
                      </CheckableTag>
                    </Form.Item>
                  </>
                ) : (
                  ""
                )
              )}
            </div>
          </TabPane>
          <TabPane tab="Booking" key="2">
            <Row>
              <Col xxl={12} md={12} sm={24} xs={24}>
                <div></div>
                <Form.Item label="Delivery Date & Time">
                  <DatePicker
                    className="book_picker"
                    defaultValue={moment(DateString, "LL")}
                    size="large"
                    disabledDate={disabledDate}
                    onChange={(date, string) => {
                      setDateString(string);
                    }}
                    format="LL"
                  />
                </Form.Item>
              </Col>{" "}
              <Col xxl={12} md={12} sm={24} xs={24}>
                <Form.Item label={`${DateString},${DeliveryTime}`}>
                  <TimePicker
                    className="book_picker"
                    use12Hours
                    format="h:mm A"
                    defaultValue={moment(DeliveryTime, "h:mm A")}
                    size="large"
                    onChange={(time, timeString) => setDeliveryTime(timeString)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="is_door">
              <Checkbox
                defaultChecked={DeliveryDoor}
                onChange={(e) => setDeliveryDoor(e.target.checked)}
                className="is_debvs"
              >
                Is Door Delivery?
              </Checkbox>
            </Form.Item>

            <Form.Item label="Booking Notes" name="booking_notes">
              <div style={{ display: "none" }}>{bookingNotes}</div>
              <TextArea
                rows={1}
                placeholder=" Type instructions or notes here (optional)"
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
              >
                {" "}
              </TextArea>
            </Form.Item>
          </TabPane>
          <TabPane tab="Delivery" key="3">
            <Form.Item name="shipping_address" label="Shipping Address">
              <div style={{ display: "none" }}>{shippingAddress}</div>
              <Input
                style={{ marginBottom: 6 }}
                placeholder="Street Address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="city"
              style={{
                display: "inline-block",
                width: "calc(50% - 12px)",
              }}
              label="City"
            >
              <div style={{ display: "none" }}>{city}</div>
              <Input
                style={{ marginBottom: 6 }}
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "24px",
                lineHeight: "32px",
                textAlign: "center",
              }}
            ></span>

            <Form.Item
              name="zipcode"
              style={{
                display: "inline-block",
                width: "calc(50% - 12px)",
              }}
              label="Zipcode"
            >
              <div style={{ display: "none" }}>{zipCode}</div>
              <Input
                type="number"
                style={{ marginBottom: 6 }}
                placeholder="Zipcode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyPress={(event) => {
                  if (event.key.match("[0-9]+")) {
                    return true;
                  } else {
                    return event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </TabPane>

          {AddtionalList.length > 0 && (
            <TabPane tab="Custom" key="4">
              {AddtionalList.map((field, index, i) => (
                <>
                  <Form.Item name={field.name} label={field.name}>
                    <div className="hide-customerdata">{field.value}</div>
                    <Input
                      value={field.value ? field.value : ""}
                      style={{ marginBottom: 6 }}
                      placeholder={field.name}
                      a-key={index}
                      onChange={(e) => {
                        AddtionalList[e.target.getAttribute("a-key")] = {
                          name: field.name,
                          value: e.target.value,
                        };
                        setAddtionalList([...AddtionalList]);
                      }}
                    />
                  </Form.Item>
                </>
              ))}
            </TabPane>
          )}
        </Tabs>
      </Modal>
    </div>
  );
});

export { EditBookingReceipts };
