import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal, Spin, Row, Col, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import "../../../setting.css";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "../../../../../../components/buttons/buttons";
import {
  getAllTaxesList,
  deleteTaxes,
} from "../../../../../../redux/taxes/actionCreator";
import {
  getAllPosProductsList,
  trackUpdate,
} from "../../../../../../redux/inventory/actionCreator";
import {
  getItem,
  setItem,
} from "../../../../../../utility/localStorageControl";
import { LoadingOutlined } from "@ant-design/icons";
import { TopToolBox } from "../../../../../ProductOption/Style";
import { UserTableStyleWrapper } from "../../../../../pages/style";
import { TableWrapper, Main } from "../../../../../styled";
const PosProducts = ({ PosListCount, inventoryId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [TaxesList, setTaxesList] = useState([]);
  const [selectionType] = useState("checkbox");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inventoryData, setInventoryData] = useState();

  async function fetchTaxesList() {
    const getTaxesList = await dispatch(getAllPosProductsList());
    console.log("dadadsadadsadasdadad", inventoryId);
    if (isMounted.current && getTaxesList && getTaxesList.taxesList) {
      PosListCount(getTaxesList.taxesList.length);
      setTaxesList(getTaxesList.taxesList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      // fetchTaxesList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    console.log("kkpkkpk66p", inventoryId);
    setInventoryData(inventoryId);
    if (inventoryId && inventoryId.posProductsList) {
      PosListCount(inventoryId.posProductsList.length);
      setTaxesList(inventoryId.posProductsList);
    }
  }, [inventoryId]);

  const [state, setState] = useState({
    item: TaxesList,
  });
  const { item } = state;
  useEffect(() => {
    if (TaxesList) {
      setState({
        item: TaxesList,
      });
    }
  }, [TaxesList]);

  const deleteSelectedTaxes = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allTaxesIdsForDelete = [];

    allSelectedRowsForDelete.map((item) => {
      allTaxesIdsForDelete.push({
        product_name: item.product_name,
        product_id: item.id,
        isTracked: track == "track" ? true : false,
        product_category: item.category,
      });
    });
    console.log("checkuntrackproduct", allTaxesIdsForDelete, inventoryData);
    if (inventoryData) {
      const getDeletedTaxes = await dispatch(
        trackUpdate(inventoryData._id, allTaxesIdsForDelete)
      );
      if (
        getDeletedTaxes &&
        getDeletedTaxes.TaxesDeletedData &&
        !getDeletedTaxes.TaxesDeletedData.error
      ) {
        setInventoryData({
          ...inventoryData,
          productList: getDeletedTaxes.TaxesDeletedData.data.products,
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
    </>
  );

  const dataSource = [];

  let searchArrTaxes = item.filter((value) =>
    value.product_name.toLowerCase().includes(search.toLowerCase())
  );
  console.log("searchArrTaxes56", inventoryData);
  if (searchArrTaxes.length && inventoryData && inventoryData.productList) {
    searchArrTaxes.map((value) => {
      let trackproduct = inventoryData.productList.find(
        (l) => l.product_id == value.product_id
      );
      let recipelist = [];
      if (
        trackproduct &&
        trackproduct.linked_products &&
        trackproduct.linked_products.length
      ) {
        trackproduct.linked_products
          .map((val) => recipelist.push(val))
          .toString();
      }

      // inventoryData.productList.find((j) => {
      //   let findrecipe =
      //     j &&
      //     j.linked_products &&
      //     j.linked_products.find((e) => e.product_id == value.product_id);
      //   if (findrecipe) {
      //     recipelist.push(j);
      //   }
      // });

      const {
        product_id,
        product_name,
        tax_percentage,
        is_linked_to_tax_group,
        pos_id,
        category,
      } = value;
      return dataSource.push({
        pos_id: pos_id,
        id: product_id,
        product_name: product_name,
        isNotTracked: trackproduct
          ? trackproduct.isTracked == undefined ||
            trackproduct.isTracked == true
            ? "Yes"
            : "No"
          : "Yes",
        is_linked: is_linked_to_tax_group,
        category: category,
        recipe: recipelist,
      });
    });
  }

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
      width: "5%",
      // fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      fixed: "left",
      className: "products_list_fix",
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
      title: "Tracked",
      dataIndex: "isNotTracked",
      key: "isNotTracked",
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
    {
      title: "Add Recipe",
      dataIndex: "tax_percent",
      key: "tax_percent",
      className: "center-col",
      render(text, record) {
        return {
          children: (
            <div>
              <EditOutlined
                onClick={() => {
                  console.log("sasasasasasasasa", record);
                  history.push(`/inventory/add-inventory-recipe`, {
                    inventory_Id: inventoryData,
                    currentProduct: record,
                    posProductsList: TaxesList,
                  });
                }}
              />
            </div>
          ),
        };
      },
    },
    ,
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

  return (
    <>
      <Cards headless>
        <TopToolBox>
          <Row gutter={15} className="list-row">
            <Col lg={14} xs={24}>
              <div className="table_titles">
                <h2>POS Products</h2>
                <span className="title-counter center_txcs">
                  {dataSource?.length}{" "}
                </span>
                <div className="sercTable">
                  <Input
                    suffix={<SearchOutlined />}
                    autoFocus
                    className="set_serbt"
                    placeholder="Search by Name"
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
              <div className="table-toolbox-menu" style={{ float: "right" }}>
                <>
                  <Button
                    className="ant-btn ant-btn-md btn-cancel btn"
                    style={{
                      marginRight: "10px",
                      background: "#fff",
                      borderRadius: "2px",
                      boxShadow: "0 2px 0 rgb(0 0 0 / 2%)",
                      color: "rgba(0,0,0,.85)",
                      padding: "4px 15px",
                      border: "1px solid #d9d9d9",
                    }}
                    onClick={() => {
                      if (offLineMode) {
                        setOfflineModeCheck(true);
                      } else {
                        history.push(`/inventory/itemList`, {
                          inventoryData: inventoryData,
                        });
                        setOfflineModeCheck(false);
                      }
                    }}
                  >
                    <ArrowLeftOutlined />
                    Go back
                  </Button>
                </>
              </div>
            </Col>
          </Row>
        </TopToolBox>
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
        </Modal>

        <p style={{ display: "none" }}>{loading}</p>
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
        <UserTableStyleWrapper>
          <div className="contact-table">
            <TableWrapper className="table-responsive">
              <Table
                rowKey="id"
                dataSource={dataSource}
                className="products_lsttable"
                columns={columns}
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                // onRow={(row) => ({
                //   onClick: () =>
                //     offLineMode
                //       ? setOfflineModeCheck(true)
                //       : history.push(`/settings/taxes/add/tax`, {
                //           taxes_id: row.id,
                //         }),
                // })}
                size="small"
                style={{ marginTop: "8px" }}
              />
            </TableWrapper>
          </div>
        </UserTableStyleWrapper>
      </Cards>
    </>
  );
};

export default PosProducts;
