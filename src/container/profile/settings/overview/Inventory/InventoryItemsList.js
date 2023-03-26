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
import { useHistory } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import {
  CaretDownOutlined,
  MenuUnfoldOutlined,
  RestOutlined,
} from "@ant-design/icons";
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
  getAllPosProductsList,
} from "../../../../../redux/inventory/actionCreator";
import moment from "moment";
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import { CardToolbox } from "../../../../Customer/Style";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import { UserTableStyleWrapper } from "../../../../pages/style";
// import { TopToolBox } from "../Style";
const InventoryItemsList = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();
  const { TabPane } = Tabs;
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [activeTab, changeTab] = useState("1");
  const [loader, setloader] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [TaxesList, setTaxesList] = useState([]);
  const [selectionType] = useState("checkbox");
  const [itemList, setItemList] = useState([]);
  const [track, setTrack] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [availabilityModal, setAvailabilityModal] = useState({
    visible: false,
    available: false,
    item: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  async function fetchProductsList() {
    if (location?.state?.inventoryData) {
      setloader(true);
      const getProductlist = await dispatch(
        getAllItemList(location.state.inventoryData._id)
      );
      // category: "General";
      // isNotTracked: true;
      // isSellable: true;
      // product_id: "63ecd4c12784118e31c8477e";
      // product_name: "Pizza";
      let posibleIems = JSON.parse(
        JSON.stringify(location.state.inventoryData.posProductsList)
      );
      getProductlist.map((j) => {
        let index = posibleIems.findIndex((s) => s.product_id == j.product_id);
        if (j.orderType && index == -1) {
          let obj = {
            category: j.product_category,
            isNotTracked: j.isTracked,
            isSellable: true,
            product_id: j.product_id,
            product_name: j.product_name,
          };
          posibleIems.push(obj);
        }
      });

      console.log("ddasdaddsaxxasxax", location.state.inventoryData);
      if (getProductlist) {
        setloader(false);
        setInventoryId({
          ...location.state.inventoryData,
          posProductsList: posibleIems,
          productList: getProductlist,
        });
        setItemList(getProductlist);
      }
    }
    return true;
  }

  useEffect(() => {
    if (isMounted.current) {
      fetchProductsList();
    }
    return () => {
      isMounted.current = false;
    };
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
        allTaxesIdsForDelete.push({
          product_name: item.itemName,
          product_id: item.id,
          isTracked: track == "track" ? true : false,
        });
      });

      const getDeletedTaxes = await dispatch(
        trackUpdate(inventoryId._id, allTaxesIdsForDelete)
      );
      console.log("kokokkkokokkoko", getDeletedTaxes);
      if (
        getDeletedTaxes &&
        getDeletedTaxes.TaxesDeletedData &&
        !getDeletedTaxes.TaxesDeletedData.error
      ) {
        setItemList(
          getDeletedTaxes?.TaxesDeletedData?.data?.products
            ? getDeletedTaxes.TaxesDeletedData.data.products
            : [...itemList]
        );
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
      {activeTab == "2" ? (
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
      ) : (
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
      )}
    </>
  );

  const dataSource = [];
  let searchItemList = itemList?.filter((value) =>
    value?.product_name
      ?.toString()
      .toLowerCase()
      .includes(search?.toLowerCase())
  );

  if (searchItemList.length)
    searchItemList.map((value) => {
      const {
        product_id,
        name,
        price,
        in_stock,
        updated_on,
        recommended,
        product_category,
        quantity,
        product_name,
        isTracked,
        unit_of_measure,
      } = value;

      if (activeTab == "1" && (isTracked == true || isTracked == undefined)) {
        return dataSource.push({
          id: product_id,
          itemName: product_name.toString().replace(/,/g, ""),
          price: price,
          category: product_category ? product_category : "-",
          in_stock: in_stock,
          update_date: moment(new Date(updated_on)).format("MMM DD, Y, h:mm A"),
          recommend: recommended ? "yes" : "-",
          quantity: quantity,
          unit_of_measure: unit_of_measure ? unit_of_measure : "",
          isTracked: isTracked,
        });
      } else if (activeTab == "2" && isTracked == false) {
        return dataSource.push({
          id: product_id,
          itemName: product_name.toString().replace(/,/g, ""),
          price: price,
          category: product_category,
          in_stock: in_stock,
          update_date: moment(new Date(updated_on)).format("MMM DD, Y, h:mm A"),
          recommend: recommended ? "yes" : "-",
          quantity: quantity,
          isTracked: isTracked,
        });
      }
    });
  console.log("ssasgfgfgfgfff", dataSource);
  const columns = [
    // {
    //   title: (
    //     <>
    //       <Popover
    //         placement="bottomLeft"
    //         content={contentforaction}
    //         trigger="click"
    //       >
    //         <CaretDownOutlined style={{ marginLeft: "12px" }} />
    //       </Popover>
    //     </>
    //   ),
    //   key: "action",
    //   dataIndex: "action",
    // },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      fixed: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Item Category",
      dataIndex: "category",
      key: "category",
      className: "center-col",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: (
            <div>
              {text} {record.unit_of_measure}
            </div>
          ),
        };
      },
    },
    // {
    //   title: "Reorder Level",
    //   dataIndex: "recommend",
    //   key: "recommend",
    //   align: "left",
    //   className: "center-col",
    //   render(text, record) {
    //     return {
    //       children: <div>{text}</div>,
    //     };
    //   },
    // },

    {
      title: "Status",
      dataIndex: "update_date",
      key: "update_date",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: (
            <div>
              {record.quantity > 0 ? (
                <span>
                  <Badge color="green" size="large" />
                  Surplus
                </span>
              ) : (
                <span>
                  <Badge color="red" size="large" />
                  Critical
                </span>
              )}
            </div>
          ),
        };
      },
    },
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
  const handleCancel = (e) => {
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
  let locale = {
    emptyText: (
      <Spin
        style={{
          marginTop: "20px",
        }}
      />
    ),
  };
  return (
    <Main className="inventory-items">
      <CardToolbox>
        <PageHeader
          ghost
          className="comman-other-custom-pageheader receipts-top0"
          subTitle={
            <>
              <div className="table_titles">
                <h2>Available Items</h2>
                <span className="title-counter">
                  <span>{dataSource?.length} </span>
                </span>
              </div>
              <div
                style={{ boxShadow: "none", marginLeft: "10px" }}
                className="search_lrm"
              >
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
            </>
          }
          buttons={[
            <div>
              <Button
                className="ant-btn ant-btn-md btn-cancel btn"
                style={{ marginRight: "2px" }}
                onClick={() => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    history.push(`/inventory`);
                    setOfflineModeCheck(false);
                  }
                }}
              >
                {/* <FeatherIcon
                  icon="arrow-left"
                  size={14}
                  style={{ color: "#BD025D" }}
                /> */}
                <ArrowLeftOutlined />
                Go back
              </Button>

              <Button
                className="ant-btn ant-btn-md btn-cancel btn"
                style={{ marginRight: "2px" }}
                disabled={loader ? true : false}
                onClick={() => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    history.push(`/inventory/inward`, {
                      inventory_Id: inventoryId,
                      type: "Inward",
                    });
                    setOfflineModeCheck(false);
                  }
                }}
              >
                <FeatherIcon icon="download" size={14} />
                Inward
              </Button>
              <Button
                className="ant-btn ant-btn-md btn-cancel btn"
                style={{ marginRight: "2px" }}
                disabled={loader ? true : false}
                onClick={() => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    history.push(`/inventory/inward`, {
                      inventory_Id: inventoryId,
                      type: "Adjustment",
                    });
                    setOfflineModeCheck(false);
                  }
                }}
              >
                <MenuUnfoldOutlined />
                Adjustment
              </Button>
              <Button
                className="ant-btn ant-btn-md btn-cancel btn"
                style={{ marginRight: "2px" }}
                disabled={loader ? true : false}
                onClick={() => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    history.push(`/inventory/inward`, {
                      inventory_Id: inventoryId,
                      type: "Wastage",
                    });
                    setOfflineModeCheck(false);
                  }
                }}
              >
                <RestOutlined />
                Wastage
              </Button>
              <Button
                className="ant-btn ant-btn-primary ant-btn-md"
                style={{ color: "#FFF" }}
                disabled={loader ? true : false}
                onClick={() => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    history.push(`/inventory/recipe`, {
                      inventoryData: inventoryId,
                    });
                    setOfflineModeCheck(false);
                  }
                }}
              >
                Manage items
              </Button>
            </div>,
          ]}
        />
      </CardToolbox>

      <Row gutter={15}>
        <Col md={24}>
          <Cards headless>
            {/* <TopToolBox> */}
            {/* <Row
              gutter={15}
              style={{ marginBottom: "0.5% ", marginLeft: "14px" }}
            >
              <Col lg={9} xs={24}></Col>
              <Col xxl={1} lg={1} xs={1}></Col>

              <div className="table-toolbox-menu">
                <Tabs
                  defaultActiveKey="1"
                  activeKey={activeTab}
                  onChange={changeTab}
                  size="small"
                  type="card"
                >
                  <TabPane
                    tab={<div className="drft_counno">Track products</div>}
                    key="1"
                    style={{ marginRight: "20px" }}
                  >
                    {" "}
                  </TabPane>
                  <TabPane
                    tab={<div className="drft_counno">Untrack products</div>}
                    key="2"
                    style={{ marginRight: "20px" }}
                  ></TabPane>
                
                </Tabs>
              </div>
            </Row> */}
            {/* </TopToolBox> */}
            <UserTableStyleWrapper>
              <div className="contact-table">
                <TableWrapper className="table-responsive">
                  {loader ? (
                    <Table
                      rowKey="id"
                      locale={locale}
                      dataSource={[]}
                      columns={columns}
                      size="small"
                      style={{ marginTop: "8px" }}
                    />
                  ) : (
                    <Table
                      rowKey="id"
                      dataSource={dataSource}
                      // rowSelection={{
                      //   type: selectionType,
                      //   ...rowSelection,
                      // }}
                      columns={columns}
                      size="small"
                      style={{ marginTop: "8px" }}
                    />
                  )}
                </TableWrapper>
              </div>
            </UserTableStyleWrapper>
          </Cards>
        </Col>
      </Row>
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
        ) : (
          <p>Are you sure want to stop tracking the selected items?</p>
        )}
      </Modal>
    </Main>
  );
};

export { InventoryItemsList };
