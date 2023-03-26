import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Input,
  Modal,
  Switch,
  message,
  Button,
  Badge,
  Row,
  Col,
  Tabs,
} from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import "../../setting.css";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllTaxesList,
  deleteTaxes,
} from "../../../../../redux/taxes/actionCreator";

import {
  onlineOrderProductList,
  markInOutOfStock,
} from "../../../../../redux/onlineOrder/actionCreator";
import {
  getAllInventoryList,
  deleteInventory,
  trackUpdate,
  getAllItemList,
} from "../../../../../redux/inventory/actionCreator";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import { CardToolbox } from "../../../../Customer/Style";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import { UserTableStyleWrapper } from "../../../../pages/style";
import PosProducts from "./ManageItems/PosProducts";
import { TopToolBox } from "../../../../ProductOption/Style";
import id from "date-fns/locale/id";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const Recipe = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();
  const { TabPane } = Tabs;
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [activeTab, changeTab] = useState("1");
  const [currentTab, setCurrentTab] = useState("2");
  const [loader, setloader] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [TaxesList, setTaxesList] = useState([]);
  const [selectionType] = useState("checkbox");
  const [itemList, setItemList] = useState([]);
  const [track, setTrack] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [posProductCount, setPosProductConut] = useState(0);
  const [availabilityModal, setAvailabilityModal] = useState({
    visible: false,
    available: false,
    item: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  async function fetchProductsList() {
    if (location?.state?.inventoryData) {
      if (location?.state?.inventoryPage) {
        setCurrentTab("1");
      }

      setInventoryId(location.state.inventoryData);
      if (location?.state?.inventoryData?.inventory_items) {
        setItemList(location.state.inventoryData.inventory_items);
      }
    }
    return true;
  }
  useEffect(() => {
    fetchProductsList();
  }, []);
  const [state, setState] = useState({});

  const deleteSelectedTaxes = async () => {
    if (inventoryId) {
      setLoading(true);
      console.log("jjdasjsdadadada", state);
      const { allSelectedRowsForDelete } = state;
      let allTaxesIdsForDelete = [];
      allSelectedRowsForDelete.map((item) => {
        console.log("fffaadadadadadaadadadadada", item);
        if (track == "remove") {
          allTaxesIdsForDelete.push({
            product_id: item.id,
          });
        }
        allTaxesIdsForDelete.push({
          product_name: item.itemName,
          product_id: item.id,
          isTracked: track == "track" ? true : false,
        });
      });

      const getDeletedTaxes = await dispatch(
        trackUpdate(inventoryId._id, allTaxesIdsForDelete, track)
      );
      console.log("kokokkkokokkoko", getDeletedTaxes, track);
      if (
        getDeletedTaxes &&
        getDeletedTaxes.TaxesDeletedData &&
        !getDeletedTaxes.TaxesDeletedData.error
      ) {
        setItemList(getDeletedTaxes.TaxesDeletedData.data.inventory_items);
        setInventoryId({
          ...inventoryId,
          productList: getDeletedTaxes.TaxesDeletedData.data.products,
          inventory_items:
            getDeletedTaxes.TaxesDeletedData.data.inventory_items,
        });
        setSelectedRowKeys([]);
        setState({
          ...state,
          selectedRows: [],
        });
        setModelDeleteVisible(false);
      }
    }
  };

  const contentforaction = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelDeleteVisible(true);
          setLoading(false);
          setTrack("track");
        }}
      >
        <span>Set as tracked</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelDeleteVisible(true);
          setLoading(false);
          setTrack("notTrack");
        }}
      >
        <span>Set as not tracked</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelDeleteVisible(true);
          setLoading(false);
          setTrack("remove");
        }}
      >
        <span>Remove selected items</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  let searchItemList = itemList?.filter((value) =>
    value?.inventory_item_name
      ?.toString()
      .toLowerCase()
      .includes(search?.toLowerCase())
  );

  if (searchItemList.length && inventoryId && inventoryId.productList)
    searchItemList.map((value) => {
      const {
        inventory_item_name,
        unit_of_measure,
        linked_products,
        _id,
        isTracked,
      } = value;
      console.log("lpsdsadasdafsf", value);
      let trackproduct = inventoryId.productList.find(
        (l) => l.product_id == _id
      );
      console.log("sagasrcheckknnsdsfds", trackproduct);
      let recipelist = [];
      inventoryId.productList.map((j) => {
        if (j && j.linked_products) {
          j.linked_products.map((e) => {
            if (e && e.product_id == _id) {
              recipelist.push(j);
            }
          });
        }
      });
      return dataSource.push({
        id: _id,
        inventory_item_name: inventory_item_name,
        unit_of_measure: unit_of_measure,
        linked_products: linked_products,
        isTracked: trackproduct
          ? trackproduct.isTracked == undefined ||
            trackproduct.isTracked == true
            ? "Yes"
            : "No"
          : "Yes",
        recipe: recipelist,
      });
    });
  const columns = [
    {
      title: (
        <>
          <Popover
            placement="bottomLeft"
            content={contentforaction}
            trigger="click"
          >
            <CaretDownOutlined style={{ marginLeft: "12px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      width: "2px",
    },
    {
      title: "Name",
      dataIndex: "inventory_item_name",
      key: "inventory_item_name",
      fixed: "left",
      className: "center-col",
      render(text) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Unit of measure",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      className: "center-col",
    },
    {
      title: "Tracked",
      dataIndex: "isTracked",
      key: "isTracked",
      className: "center-col",
    },
    {
      title: "Recipe",
      dataIndex: "recipe",
      key: "recipe",
      className: "center-col",
      render(text, record) {
        return {
          children: (
            <div>
              {text.length
                ? text
                    .map((val, index) => index < 2 && ` ${val.product_name} `)
                    .filter((val) => !val == false)
                    .toString()
                : "-"}
              {text.length > 2 && (
                <Tooltip
                  title={text.map((val, index) => ` ${val.product_name} , `)}
                >
                  <ExclamationCircleOutlined
                    style={{
                      cursor: "pointer",
                      marginLeft: "3px",
                    }}
                  />
                </Tooltip>
              )}
            </div>
          ),
        };
      },
    },
    // {
    //   title: "Add product",
    //   dataIndex: "inventory_item_name",
    //   key: "inventory_item_name",
    //   className: "center-col",
    //   render(text, record) {
    //     return {
    //       children: (
    //         <div>
    //           <EditOutlined
    //             onClick={() => {
    //               console.log("recorddadad56565", record);
    //               history.push(`/inventory/add-product-receipe`, {
    //                 inventory_Id: inventoryId,
    //                 currentInventoryData: record,
    //               });
    //             }}
    //           />
    //         </div>
    //       ),
    //     };
    //   },
    // },
  ];
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys([...selectedRowKeys]);
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };
  const handleCancel = () => {
    setModelDeleteVisible(false);
  };
  const changeAvalibilty = async () => {
    setloader(true);
    const response = await dispatch(markInOutOfStock(availabilityModal));

    if (response) {
      message.error({
        content: response?.data?.statusMessage,
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
      if (fetchProductsList()) {
        setloader(false);
        setAvailabilityModal({
          visible: false,
          available: false,
          itemId: "",
          url: location?.state?.urlName,
        });
      }
    }
  };

  const PosListCount = (count) => {
    setPosProductConut(count);
  };
  return (
    <Main className="inventory-items">
      <div className="table-toolbox-menu">
        <Tabs
          activeKey={currentTab}
          onChange={setCurrentTab}
          size="small"
          type="card"
        >
          <TabPane
            tab={<div className="drft_counno">POS Products</div>}
            key="2"
            style={{ marginRight: "20px" }}
          >
            {" "}
          </TabPane>
          <TabPane
            tab={
              <div className="drft_counno">
                Inventory Items
                {/* <span>{posProductCount}</span> */}
              </div>
            }
            key="1"
            style={{ marginRight: "20px" }}
          ></TabPane>
        </Tabs>
      </div>
      {currentTab == "1" ? (
        <div>
          <Row gutter={15}>
            <Col md={24}>
              <Cards headless>
                <TopToolBox>
                  <Row gutter={15} className="list-row">
                    <Col lg={14} xs={24}>
                      <div className="table_titles">
                        <h2>Inventory Items</h2>
                        <span className="title-counter center_txcs">
                          {searchItemList?.length}{" "}
                        </span>
                        <div className="sercTable">
                          <Input
                            suffix={<SearchOutlined />}
                            autoFocus
                            className="set_serbt"
                            placeholder="Search by Item Name"
                            style={{
                              borderRadius: "30px",
                              width: "250px",
                            }}
                            onChange={(e) => setsearch(e.target.value)}
                            value={search}
                          />
                        </div>
                      </div>
                    </Col>

                    <Col xxl={1} lg={1} xs={1}></Col>
                    <Col xxl={7} lg={9} xs={24}>
                      <div
                        className="table-toolbox-menu"
                        style={{ float: "right" }}
                      >
                        <>
                          <Button
                            className="ant-btn ant-btn-md btn-cancel btn"
                            style={{ marginRight: "10px" }}
                            onClick={() => {
                              if (offLineMode) {
                                setOfflineModeCheck(true);
                              } else {
                                history.push(`/inventory/itemList`, {
                                  inventoryData: inventoryId,
                                });
                                setOfflineModeCheck(false);
                              }
                            }}
                          >
                            <ArrowLeftOutlined />
                            Go back
                          </Button>

                          <Button
                            className="ant-btn ant-btn-primary ant-btn-md"
                            style={{ color: "#FFF" }}
                            onClick={() => {
                              if (offLineMode) {
                                setOfflineModeCheck(true);
                              } else {
                                history.push(`/inventory/add-recipe`, {
                                  inventory_Id: inventoryId,
                                });
                                setOfflineModeCheck(false);
                              }
                            }}
                          >
                            <FeatherIcon
                              icon="plus"
                              size={16}
                              className="pls_iconcs"
                            />
                            Add Inventory Items{" "}
                          </Button>
                        </>
                      </div>
                    </Col>
                  </Row>
                </TopToolBox>
                <UserTableStyleWrapper>
                  <div className="contact-table">
                    <TableWrapper className="table-responsive">
                      <Table
                        rowKey="id"
                        rowSelection={{
                          type: selectionType,
                          ...rowSelection,
                        }}
                        onRow={(row) => ({
                          // console.log("rowrowrow",row)
                          onClick: () =>
                            offLineMode
                              ? setOfflineModeCheck(true)
                              : history.push(`/inventory/edit-recipe`, {
                                  inventory_Id: inventoryId,
                                  inventoryData: row,
                                }),
                        })}
                        dataSource={dataSource}
                        columns={columns}
                        size="small"
                        style={{ marginTop: "8px" }}
                      />
                    </TableWrapper>
                  </div>
                </UserTableStyleWrapper>
              </Cards>
            </Col>
          </Row>
        </div>
      ) : (
        <PosProducts PosListCount={PosListCount} inventoryId={inventoryId} />
      )}

      <Modal
        title="You are Offline"
        visible={offLineModeCheck}
        onOk={() => setOfflineModeCheck(false)}
        onCancel={() => setOfflineModeCheck(false)}
        width={600}
      >
        <p>You are offline not add and update </p>
      </Modal>
      <Modal
        title={
          availabilityModal.available
            ? "Set as out of stock?"
            : "Set as available in stock?"
        }
        okText={
          loader
            ? "Loading.."
            : availabilityModal.available
            ? "Out Of Stock"
            : "In Stock"
        }
        visible={availabilityModal.visible}
        onOk={changeAvalibilty}
        onCancel={() =>
          setAvailabilityModal({
            visible: false,
            available: false,
            itemId: "",
            url: location?.state?.urlName,
          })
        }
        width={600}
      >
        <p>
          {availabilityModal.available
            ? "Are you sure you want to set the selected items as out of stock?"
            : "Are you sure you want to set the selected items as available in stock?"}
        </p>
      </Modal>
      <Modal
        title="Confirm Update"
        okText={
          loading ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 16, color: "white", margin: "0px 14px" }}
                  spin
                />
              }
            />
          ) : (
            "Update"
          )
        }
        visible={modalDeleteVisible}
        onOk={deleteSelectedTaxes}
        onCancel={handleCancel}
        width={600}
      >
        {track == "track" ? (
          <p>Are you sure want to track the selected items?</p>
        ) : track == "notTrack" ? (
          <p>Are you sure want to stop tracking the selected items?</p>
        ) : (
          <p>Are you sure you want to delete the selected items?</p>
        )}
      </Modal>
    </Main>
  );
};

export { Recipe };
