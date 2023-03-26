import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Tabs,
  Input,
  Form,
  Card,
  Button,
  Modal,
  Tooltip,
} from "antd";
import { PageHeaderCurrent } from "../../components/page-headers-current/page-headers-current";
import { Main } from "../styled";
import { OrderBuilder } from "./Orders/OrderBuilder";
import { DraftBuilder } from "./Orders/DraftBuilder";
import { IncomingOrderBuilder } from "./Incoming/IncomingOrderBuilder";
import { Dummy } from "./Incoming/Dummy";

import CurrentBuilder from "./Current/CurrentBuilder";
import { TopToolBox } from "./Style";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { BookingList } from "./Booking/BookingList";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewCartwithKeyandPush,
  getLocalCartCount,
  getCartInfoFromLocalKey,
  getItem,
  setItem,
  setCartInfoFromLocalKey,
  getCartInfoLocalListsData,
} from "../../utility/localStorageControl";

import {
  getLastDevice,
  getLastReceipt,
  saveCurrentDevice,
} from "../../redux/sell/actionCreator";
import { InfoCircleFilled } from "@ant-design/icons";

import sellmsg from "../../static/img/sell/sellmsg.svg";
import Lock from "./Lock";

import {
  generate_random_number,
  generate_random_string,
} from "../../utility/utility";
import "./sell.css";
import { SocketContext } from "../../socket/socketContext";
import {
  CreateOrder,
  AddAndUpdateBooking,
} from "../../redux/sell/actionCreator";
const SellBuilder = () => {
  const { currentRegisterData, offLineMode, newOrderCount } = useSelector(
    (state) => {
      return {
        currentRegisterData:
          state.register.RegisterList?.length > 0 &&
          state.register.RegisterList?.find((val) => val.active),
        offLineMode: state.auth.offlineMode,
        newOrderCount: state.kitchenUser.kitchenUserList.length,
      };
    }
  );

  const socket = getItem("waiter_app_enable") && useContext(SocketContext);

  const { TabPane } = Tabs;
  const [tableStatus, settableStatus] = useState("");
  const [loadAysn, setloadAsyn] = useState(false);
  let [activeTab, changeTab] = useState(
    currentRegisterData?.table_numbers == "" || getItem("active_cart")
      ? "CURRENT"
      : "ORDER"
  );
  const [searchItems, setSeacrhItems] = useState("");
  const [searchtables, setSearhTables] = useState("");
  const [orderCartData, setOrderCartData] = useState({});
  const [localCartInfo, setlocalCartInfo] = useState({});
  const [LocalCartCount, setLocalCartCount] = useState(0);
  const [cusrrentTabDisbled, setCurrentTabDisbled] = useState();
  const [tableIsCustome, setTableIsCustome] = useState(false);
  const [swapTableNameList, setSwapTableNameList] = useState([]);
  const [customeTableList, setCustomeTableList] = useState([]);

  const [tableName, setTableName] = useState();
  const [lastReceiptData, setLastReceiptData] = useState({});
  const [lastDeviceData, setLastDeviceData] = useState({});
  const [deviceName, setDeviceName] = useState();
  let localData = getItem("setupCache");

  const dispatch = useDispatch();
  let isMounted = useRef(true);

  let suffix =
    searchItems != "" ? (
      <CloseCircleFilled onClick={() => setSeacrhItems("")} />
    ) : (
      <SearchOutlined />
    );
  let suffixTables =
    searchtables != "" ? (
      <CloseCircleFilled onClick={() => setSearhTables("")} />
    ) : (
      <SearchOutlined />
    );

  const regiterWiseFilterList = (val) => {
    if (val?.limit_to_register.length > 0 && currentRegisterData) {
      if (val.limit_to_register.includes(currentRegisterData?._id)) {
        return val;
      }
    } else {
      return val;
    }
  };
  let [productListOfdata, setProductListOfdata] = useState([]);
  useEffect(() => {
    let productList = getItem("productList")?.filter(regiterWiseFilterList);
    setProductListOfdata(productList);
  }, [currentRegisterData]);
  const [isRregister, setIsRregister] = useState(false);
  const [startSellingButton, setStartSellingButton] = useState(
    "Start Selling here"
  );
  const showModal = () => {
    setStartSellingButton("Loading..");
    async function fetchLastReceipt() {
      const lastReceipt = await dispatch(getLastReceipt());
      if (lastReceipt) {
        setStartSellingButton("Start Selling here");
        setLastReceiptData(lastReceipt.receiptData);
        setIsRregister(true);
      }
    }
    async function fetchLastDevice() {
      const lastDevice = await dispatch(getLastDevice());
      if (lastDevice) {
        setLastDeviceData(lastDevice.deviceData);
      }
    }
    fetchLastReceipt();
    // fetchLastDevice();
  };

  const registerCancel = () => {
    setIsRregister(false);
  };

  useEffect(() => {
    let registerData = localData?.register.find((val) => val.active);

    if (getItem("active_cart") && registerData) {
      let localCartInFoData = getCartInfoFromLocalKey(
        getItem("active_cart"),
        registerData
      );

      if (localCartInFoData) {
        setlocalCartInfo(localCartInFoData);
        setTableName(localCartInFoData?.tableName);
        changeTab("CURRENT");
      }
    } else if (registerData) {
      if (
        registerData?.table_numbers == "" ||
        getItem("active_cart")?.table_numbers == "" ||
        getItem("active_cart")
      ) {
        changeTab("CURRENT");
      } else {
        changeTab("ORDER");
      }
    }
  }, [currentRegisterData]);
  const escKeyDown = (event, current) => {
    if (event.key == "Escape") {
      setSeacrhItems("");
      setSearhTables("");
      return;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", escKeyDown);
    return () => {
      window.removeEventListener("keydown", escKeyDown);
    };
  }, []);

  useEffect(() => {
    setLocalCartCount(getLocalCartCount(currentRegisterData));
  }, []);

  const tabChangeToCurrentFunction = (tab, BookingDetils) => {
    changeTab(tab);
  };

  function searchNull(value) {
    setSeacrhItems(value);
  }

  const createNewTakeawayInLocalAndNavigateFunction = (
    type,
    navigateTo,
    data,
    SwapList,
    customTablesInfo,
    splitName,
    splitIndex
  ) => {
    changeTab(navigateTo);
    type == "custom-table-local"
      ? setTableIsCustome(true)
      : setTableIsCustome(false);
    setSwapTableNameList(SwapList);
    setCustomeTableList(customTablesInfo);

    let localCartInFoData = createNewCartwithKeyandPush(
      type,
      data,
      currentRegisterData,
      {},
      splitName,
      splitIndex
    );
    if (localCartInFoData) {
      let localTableData = getCartInfoLocalListsData(currentRegisterData);
      getItem("waiter_app_enable") &&
        socket?.emit("send_local_table_data", localTableData);
      setSeacrhItems("");
      setlocalCartInfo(localCartInFoData);
      setTableName(data.tableName);
      setLocalCartCount(getLocalCartCount(currentRegisterData));
    }
  };

  const getTakeawayInLocalAndNavigateFunction = (type, navigateTo, key) => {
    let localCartInFoData = getCartInfoFromLocalKey(key, currentRegisterData);
    setlocalCartInfo(localCartInFoData);
    setTableName(localCartInFoData.tableName);
    changeTab(navigateTo);
  };

  const editCartProductDetailsFunction = (data) => {
    let returnObj = setCartInfoFromLocalKey(
      data.cartKey,
      data.data,
      "darftupdate"
    );
    let localCartInFoData = returnObj.default_cart_object;
    localCartInFoData["update"] = true;
    setlocalCartInfo(localCartInFoData);

    setTableName(localCartInFoData.tableName);
    changeTab("CURRENT");
  };

  const setCustomerAndCartDataFunction = (data) => {
    setOrderCartData(data);
  };

  const updateCartCountFunction = () => {
    setLocalCartCount(getLocalCartCount(currentRegisterData));
  };

  const getTableStatusFunction = (tablevalue) => {
    settableStatus(tablevalue);
  };

  const chargePageIsShow = (value) => {
    setChargePageIs(value);
  };

  const [draftCount, setDarftCount] = useState(0);

  let registerData = localData?.register?.find((val) => val.active);
  let receiptModalTitle =
    registerData?.register_name !== null
      ? "Activate " + registerData?.register_name + " in this device"
      : "";
  const didMount = useRef(false);
  let filterProductList = (product) => {
    return (
      product.product_name.toLowerCase().includes(searchItems.toLowerCase()) ||
      (product.product_code !== undefined &&
        product.product_code.toLowerCase().includes(searchItems.toLowerCase()))
    );
  };
  // useEffect(() => {
  //   if (didMount.current) {
  //     if (registerData.table_numbers == "") {
  //       changeTab("CURRENT");
  //       setlocalCartInfo({});
  //       setTableName();
  //     } else {
  //
  //       alert("hi");
  //       setlocalCartInfo({});
  //       changeTab("ORDER");
  //       setTableName();
  //     }
  //   } else {
  //     didMount.current = true;
  //   }
  // }, [currentRegisterData._id]);
  let [category, setCategory] = useState([{ name: "Rice" }]);
  let [product, setProduct] = useState([{ name: "pizza" }]);
  let [table, setTable] = useState([
    { key: "2", name: "John", age: 42, address: "10 Downing Street" },
  ]);
  const handleLastDeviceSubmit = () => {
    const objData = {
      device_name: deviceName,
      last_receipt_number: lastReceiptData.receipt_number,
      register_id: registerData.register_id,
    };
    dispatch(saveCurrentDevice(objData));
    setItem("isStartSellingFromThisDevice", false);
    registerCancel();

    if (lastReceiptData && lastReceiptData.receipt_number !== null) {
      let receiptSlashPartRemove = lastReceiptData.receipt_number.split("/");
      let receiptpart = receiptSlashPartRemove[1].split("-");
      if (getItem(`Bill-${receiptpart[0].trim()}`) !== null) {
        setItem(`Bill-${receiptpart[0].trim()}`, {
          receipt: `${receiptpart[0].trim() +
            "-" +
            receiptpart[1].trim()}-${receiptpart[2].trim()}`,
          sn: Number(receiptpart[3].trim()),
        });
      } else {
        setItem(`Bill-${receiptpart[0].trim()}`, {
          receipt: `${receiptpart[0].trim() +
            "-" +
            receiptpart[1].trim()}-${receiptpart[2].trim()}`,
          sn: Number(receiptpart[3].trim()),
        });
      }
    } else {
      setItem(`Bill-${registerData.receipt_number_prefix}`, {
        receipt: `${
          registerData.receipt_number_prefix
        }-${generate_random_string(3)}-${generate_random_number(4)}`,
        sn: 1,
      });
    }
  };
  const [onlineOrderCount, setOnlineOrderCount] = useState(0);

  let tabCalCalCulation = 2;
  if (getItem("dyno_api_enable")) {
    tabCalCalCulation += 1;
  }
  if (getItem("create_receipt_while_fullfilling_booking")) {
    tabCalCalCulation += 1;
  }
  const handleAsyncReceipts = async () => {
    if (loadAysn == false) {
      setloadAsyn(true);
      let pendingReceiptsList = getItem("pendingReceipts")?.reverse();
      console.log("kpkpkpkpkp90909", pendingReceiptsList);
      if (
        pendingReceiptsList != null &&
        pendingReceiptsList &&
        pendingReceiptsList.length > 0
      ) {
        let pendinglist = [];
        let totalCount = pendingReceiptsList.length;
        let pending = [];
        pendingReceiptsList.map(async (val, index) => {
          if (val.draftList) {
            let data = await dispatch(AddAndUpdateBooking(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          } else {
            let data = await dispatch(CreateOrder(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          }
        });
        setloadAsyn(false);
        setItem("pendingReceipts", pendinglist);
      }
    }
  };

  useEffect(() => {
    if (
      didMount.current &&
      !offLineMode &&
      getItem("pendingReceipts")?.length
    ) {
      handleAsyncReceipts();
    } else {
      didMount.current = true;
    }
  }, [getItem("pendingReceipts")?.length]);

  return (
    <>
      {currentRegisterData && (
        <div>
          <Main className="sellscroll">
            {getItem("enable_billing_only_when_shift_is_opened") != null &&
            getItem("enable_billing_only_when_shift_is_opened") == true &&
            getItem("shfitOpenedTS") != null &&
            getItem("shfitOpenedTS") == "close" ? (
              <Lock />
            ) : getItem("localReceipt") != null &&
              getItem("localReceipt") === true &&
              getItem("isStartSellingFromThisDevice") === true ? (
              <Card>
                <div className="start_selling">
                  <img src={sellmsg} alt="" width={200} />
                  <h3>Start selling from this device?</h3>
                  <p>
                    To start selling here, you have to <span>sign out</span> of
                    other devices that use {currentRegisterData.register_name}
                    <br></br> and ensure that there are{" "}
                    <span>no receipts pending sync.</span>
                  </p>
                  <Button
                    size="small"
                    className="btn-custom"
                    type="primary"
                    onClick={showModal}
                  >
                    {startSellingButton}
                  </Button>
                  <em>
                    You are seeing this because you have enforced sequential
                    local receipt numbers in your preferences setup.
                  </em>
                  <Modal
                    title={receiptModalTitle}
                    visible={isRregister}
                    onOk={handleLastDeviceSubmit}
                    onCancel={registerCancel}
                  >
                    <Form.Item
                      name="sort_order"
                      label={
                        <span>
                          Device Name&nbsp;&nbsp;
                          <Tooltip
                            title="Give a name like My Shop Desktop will help you to recollect this device when you switch device later."
                            color="#FFFF"
                          >
                            <InfoCircleFilled style={{ color: "#AD005A" }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        type="txt"
                        style={{ width: "100%" }}
                        onBlur={(e) => setDeviceName(e.target.value)}
                      />
                    </Form.Item>
                    <div className="previous_pop">
                      {lastDeviceData && lastDeviceData.device_name !== null ? (
                        <p>
                          Your previous device was {lastDeviceData.device_name}.
                        </p>
                      ) : (
                        ""
                      )}
                      {lastReceiptData && lastReceiptData.receipt_number ? (
                        <p>
                          Your previous local receipt number was{" "}
                          {lastReceiptData.receipt_number}.{" "}
                          <Tooltip
                            title="Contact support in case you want to reset your local receipt number."
                            color="#FFFF"
                          >
                            <InfoCircleFilled style={{ color: "#AD005A" }} />
                          </Tooltip>
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </Modal>
                </div>
              </Card>
            ) : (
              <>
                {/* <PageHeaderCurrent
                  style={{ width: "60%" }}
                  className="sell-current-pageheader hidetabsrc seacrh-item"
                  size="large"
                  ghost
                  title={
                    <>
                      <Tabs
                        className="sell-tabs"
                        type="card"
                        activeKey={activeTab}
                        size="small"
                        onChange={(val) => {
                          changeTab(val);
                          setSeacrhItems("");
                        }}
                      >
                        {getItem("dyno_api_enable") && (
                          <TabPane
                            tab={
                              <div className="drft_counno">
                                Incoming
                                <span>{newOrderCount}</span>
                              </div>
                            }
                            key="INCOMING"
                            style={{ outline: "none" }}
                          ></TabPane>
                        )}

                        {currentRegisterData?.table_numbers != "" && (
                          <TabPane
                            tab={
                              <div className="drft_counno">
                                Orders
                                <span>{LocalCartCount}</span>
                              </div>
                            }
                            key="ORDER"
                            style={{ outline: "none" }}
                          ></TabPane>
                        )}

                        <TabPane
                          tab="Current"
                          key="CURRENT"
                          disabled={
                            getItem("active_cart") == null &&
                            currentRegisterData?.table_numbers != ""
                              ? true
                              : false
                          }
                          style={{ outline: "none" }}
                        ></TabPane>
                        {currentRegisterData?.table_numbers == "" && (
                          <TabPane
                            tab={
                              <div className="drft_counno">
                                Drafts <span>{draftCount}</span>
                              </div>
                            }
                            key="DRAFTS"
                            style={{ outline: "none" }}
                          ></TabPane>
                        )}

                        {getItem("create_receipt_while_fullfilling_booking") &&
                          (getItem("enable_quick_billing") == false ||
                            getItem("enable_quick_billing") == null) && (
                            <TabPane
                              tab="Bookings"
                              key="BOOKING"
                              style={{ outline: "none" }}
                            ></TabPane>
                          )}
                      </Tabs>
                    </>
                  }
                  subTitle={
                    <TopToolBox>
                      <div
                        style={{ boxShadow: "none", marginLeft: "10px" }}
                        className="search_lrm"
                      >
                        {activeTab == "ORDER" ? (
                          <Input
                            suffix={suffixTables}
                            autoFocus
                            placeholder="Search Tables"
                            style={{
                              borderRadius: "30px",
                              width: "250px",
                            }}
                            onChange={(e) => setSearhTables(e.target.value)}
                            value={searchtables}
                            className={`cre_avf - ${activeTab}`}
                          />
                        ) : (activeTab == "CURRENT" &&
                            getItem("listView") == null) ||
                          getItem("listView") == false ? (
                          <Input
                            suffix={suffix}
                            autoFocus
                            placeholder="Search items"
                            style={{
                              borderRadius: "30px",
                              width:
                                tabCalCalCulation == 2
                                  ? "calc(42vw - 100px)"
                                  : tabCalCalCulation == 3
                                  ? "calc(32vw - 100px)"
                                  : "calc(22vw - 100px)",
                            }}
                            onChange={(e) => setSeacrhItems(e.target.value)}
                            value={searchItems}
                            className={`cre_avf - ${activeTab}`}
                          />
                        ) : null}

                        <span
                          className="offlineMod-line"
                          style={{ marginLeft: "12px" }}
                        >
                          {newOrderCount > 0 &&
                            `${newOrderCount}  New Incoming Order`}

                          {getItem("pendingReceipts") != null &&
                          getItem("pendingReceipts").length > 0
                            ? `You are offline, but can continue billing. ${
                                getItem("pendingReceipts").length
                              } receipts to async`
                            : offLineMode &&
                              "You are offline, but can continue billing"}
                        </span>
                      </div>
                    </TopToolBox>
                  }
                /> */}
                <Row>
                  <Col md={12}>
                    <Tabs
                      className="sell-tabs"
                      type="card"
                      activeKey={activeTab}
                      size="small"
                      onChange={(val) => {
                        changeTab(val);
                        setSeacrhItems("");
                      }}
                    >
                      {getItem("dyno_api_enable") && (
                        <TabPane
                          tab={
                            <span className="drft_counno">
                              Incoming
                              <span>{newOrderCount}</span>
                            </span>
                          }
                          key="INCOMING"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}

                      {currentRegisterData?.table_numbers != "" && (
                        <TabPane
                          tab={
                            <span className="drft_counno">
                              Orders
                              <span>{LocalCartCount}</span>
                            </span>
                          }
                          key="ORDER"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}

                      <TabPane
                        tab="Current"
                        key="CURRENT"
                        disabled={
                          getItem("active_cart") == null &&
                          currentRegisterData?.table_numbers != ""
                            ? true
                            : false
                        }
                        style={{ outline: "none" }}
                      ></TabPane>
                      {currentRegisterData?.table_numbers == "" && (
                        <TabPane
                          tab={
                            <span className="drft_counno">
                              Drafts <span>{draftCount ? draftCount : 0}</span>
                            </span>
                          }
                          key="DRAFTS"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}

                      {getItem("create_receipt_while_fullfilling_booking") &&
                        (getItem("enable_quick_billing") == false ||
                          getItem("enable_quick_billing") == null) && (
                          <TabPane
                            tab="Bookings"
                            key="BOOKING"
                            style={{ outline: "none" }}
                          ></TabPane>
                        )}
                    </Tabs>
                  </Col>
                  <Col
                    style={{ paddingTop: "5px" }}
                    className="offlineMod-line"
                  >
                    {newOrderCount > 0 &&
                      `${newOrderCount}  New Incoming Order`}
                    <span
                      onClick={() => handleAsyncReceipts()}
                      style={{ cursor: "pointer" }}
                    >
                      {getItem("pendingReceipts") != null &&
                      getItem("pendingReceipts").length > 0
                        ? `You are offline, but can continue billing. ${
                            getItem("pendingReceipts").length
                          } receipts to async`
                        : offLineMode &&
                          "You are offline, but can continue billing"}
                    </span>
                  </Col>
                </Row>

                {/* {activeTab == "ORDER" ? (
                  <Input
                    suffix={suffixTables}
                    autoFocus
                    placeholder="Search Tables"
                    style={{
                      height: "40px",
                      marginTop: "-11px",
                      marginBottom: "4px",
                    }}
                    onChange={(e) => setSearhTables(e.target.value)}
                    value={searchtables}
                    className={`cre_avf - ${activeTab}`}
                  />
                ) : (activeTab == "CURRENT" && getItem("listView") == null) ||
                  getItem("listView") == false ? (
                  <Input
                    suffix={suffix}
                    autoFocus
                    placeholder="Search items"
                    style={{
                      height: "40px",
                      width: activeTab == "ORDER" ? "100%" : "58%",
                      marginTop: "-11px",
                      marginBottom: "4px",
                    }}
                    // style={{
                    //   borderRadius: "30px",
                    //   width:
                    //     tabCalCalCulation == 2
                    //       ? "calc(42vw - 100px)"
                    //       : tabCalCalCulation == 3
                    //       ? "calc(32vw - 100px)"
                    //       : "calc(22vw - 100px)",
                    // }}
                    onChange={(e) => setSeacrhItems(e.target.value)}
                    value={searchItems}
                    className={`cre_avf - ${activeTab}`}
                  />
                ) : null} */}

                <Row gutter={25}>
                  <Col md={24} xs={24}>
                    {activeTab === "ORDER" ? (
                      <OrderBuilder
                        search={searchtables}
                        setSearhTables={setSearhTables}
                        suffixTables={suffixTables}
                        tabChangeToCurrent={tabChangeToCurrentFunction}
                        createNewTakeawayInLocalAndNavigate={
                          createNewTakeawayInLocalAndNavigateFunction
                        }
                        getTakeawayInLocalAndNavigate={
                          getTakeawayInLocalAndNavigateFunction
                        }
                        setCurrentTabDisbled={setCurrentTabDisbled}
                        localCartInfo={localCartInfo}
                        currentRegisterData={currentRegisterData}
                      />
                    ) : (
                      ""
                    )}

                    {activeTab === "INCOMING" ? (
                      <IncomingOrderBuilder
                        currentRegisterData={currentRegisterData}
                        orderTabChange={changeTab}
                      />
                    ) : (
                      ""
                    )}
                    {activeTab === "DRAFTS" ? (
                      <DraftBuilder
                        setLocalCartCount={setLocalCartCount}
                        tabChangeToCurrent={tabChangeToCurrentFunction}
                        createNewTakeawayInLocalAndNavigate={
                          createNewTakeawayInLocalAndNavigateFunction
                        }
                        getTakeawayInLocalAndNavigate={
                          getTakeawayInLocalAndNavigateFunction
                        }
                        editCartProductDetails={editCartProductDetailsFunction}
                        currentRegisterData={currentRegisterData}
                        setlocalCartInfo={setlocalCartInfo}
                        setTableName={setTableName}
                      />
                    ) : (
                      ""
                    )}
                    {activeTab === "BOOKING" && (
                      <BookingList
                        tabChangeToCurrent={tabChangeToCurrentFunction}
                      />
                    )}

                    {activeTab === "CURRENT" && (
                      <CurrentBuilder
                        search={searchItems}
                        suffix1={suffix}
                        setSeacrhItems1={setSeacrhItems}
                        nullSearch={searchNull}
                        tabChangeToCurrent={tabChangeToCurrentFunction}
                        setCustomerAndCartData={setCustomerAndCartDataFunction}
                        localCartInfo={localCartInfo}
                        tableName={tableName}
                        updateCartCount={updateCartCountFunction}
                        tableIsCustome={tableIsCustome}
                        swapTableNameList={swapTableNameList}
                        setlocalCartInfo={setlocalCartInfo}
                        setTableName={setTableName}
                        customeTableList={customeTableList}
                        chargePageIsShow={chargePageIsShow}
                        registerData={currentRegisterData}
                        setDarftCount={setDarftCount}
                        productListOfdata={productListOfdata.filter(
                          filterProductList
                        )}
                        allLocalData={localData}
                      />
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Main>
        </div>
      )}
    </>
  );
};

export default SellBuilder;
