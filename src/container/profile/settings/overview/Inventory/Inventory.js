import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal, Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import "../../setting.css";
import { UserTableStyleWrapper } from "../../../../pages/style";
import {
  SearchOutlined,
  ArrowRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";

import {
  getAllInventoryList,
  deleteInventory,
  getAllPosProductsList,
} from "../../../../../redux/inventory/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllRegisterList } from "../../../../../redux/register/actionCreator";
import { Spin } from "antd";
import { TableWrapper, Main } from "../../../../styled";
import { CardToolbox } from "../../../../Customer/Style";

const Inventory = () => {
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [DynoList, setDynoList] = useState([]);
  const [RegisterList, setRegisterList] = useState([]);

  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  async function fetchRegisterList() {
    const getRegisterList = await dispatch(getAllRegisterList("sell"));
    if (isMounted.current && getRegisterList && getRegisterList.RegisterList)
      setRegisterList(getRegisterList.RegisterList);
  }

  async function fetchInventoryList(val) {
    setLoader(true);
    const getInventoryList = await dispatch(getAllInventoryList(val));
    console.log("checkadadadad", getInventoryList);

    if (isMounted.current && getInventoryList && getInventoryList.taxesList) {
      setLoader(false);
      setDynoList(getInventoryList.taxesList);
    }
  }
  const [posProductList, setPosProductList] = useState([]);
  async function fetchPosProductList() {
    const getTaxesList = await dispatch(getAllPosProductsList());
    if (isMounted.current && getTaxesList && getTaxesList.taxesList) {
      setPosProductList(getTaxesList.taxesList);
    }
  }
  useEffect(() => {
    if (isMounted.current) {
      fetchPosProductList();
      fetchInventoryList();
      fetchRegisterList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: DynoList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (DynoList) {
      setState({
        item: DynoList,
        selectedRowKeys,
      });
    }
  }, [DynoList, selectedRowKeys]);

  const deleteSelectedRegister = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allRegisterIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allRegisterIdsForDelete.push(item.id);
    });
    const getDeletedBingages = await dispatch(
      deleteInventory({ ids: allRegisterIdsForDelete })
    );
    if (getDeletedBingages && !getDeletedBingages.error) {
      fetchInventoryList(undefined);
      setModelDeleteVisible(false);
    }
  };
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);

  const contentforaction = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setLoading(false);
          setModelDeleteVisible(true);
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  console.log("DynoList2323232232323232", DynoList);
  let searchArrTaxes = DynoList?.filter((value) =>
    value.inventory_name?.toLowerCase().includes(search.toLowerCase())
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };
  console.log("searchArrTaxessearchArrTaxes", searchArrTaxes);
  if (DynoList.length)
    searchArrTaxes.map((value) => {
      const { _id, inventory_name, description, linked_registers } = value;

      return dataSource.push({
        id: _id,
        inventory_name: inventory_name,
        description: description,
        linked_registersName: linked_registers.map((j) => {
          return RegisterList.find((val) => val._id == j)?.register_name;
        }),
        ...value,
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
            <CaretDownOutlined />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "inventory_name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Linked Registers",
      dataIndex: "linked_registersName",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: <div>{text.toString()}</div>,
        };
      },
    },

    {
      title: "View Inventory",
      dataIndex: "Items",
      key: "Items",
      align: "left",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: (
            <div>
              <ArrowRightOutlined
                onClick={(e) => {
                  if (offLineMode) {
                    setOfflineModeCheck(true);
                  } else {
                    e.stopPropagation();

                    history.push(`/inventory/itemList`, {
                      inventoryData: {
                        ...record,
                        posProductsList: posProductList,
                      },
                    });
                  }
                }}
              />
            </div>
          ),
        };
      },
    },
  ];
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
    <div>
      <CardToolbox>
        <PageHeader
          ghost
          className="comman-other-custom-pageheader receipts-top0"
          subTitle={
            <>
              <div className="table_titles">
                <h2>Inventory</h2>
                <span className="title-counter">
                  {DynoList?.length} Inventory
                </span>
              </div>
              <div
                style={{ boxShadow: "none", marginLeft: "10px" }}
                className="search_lrm"
              >
                <Input
                  suffix={<SearchOutlined />}
                  className="set_serbt"
                  autoFocus
                  placeholder="Search by inventory name"
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
            <>
              {/* <NavLink
                to={offLineMode ? "#" : "inventory/POSitems"}
                className="ant-btn ant-btn-primary ant-btn-md"
                style={{ marginRight: "8px" }}
                onClick={() =>
                  offLineMode
                    ? setOfflineModeCheck(true)
                    : setOfflineModeCheck(false)
                }
              >
                Manage Items
              </NavLink> */}
              <NavLink
                to={offLineMode ? "#" : "inventory/add"}
                className="ant-btn ant-btn-primary ant-btn-md"
                style={{ color: "#FFF" }}
                onClick={() =>
                  offLineMode
                    ? setOfflineModeCheck(true)
                    : setOfflineModeCheck(false)
                }
              >
                <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
                Add Inventory
              </NavLink>
            </>,
          ]}
        />
      </CardToolbox>
      <Row gutter={15}>
        <Col md={24}>
          <Cards headless>
            <UserTableStyleWrapper>
              <div className="contact-table">
                <TableWrapper className="table-responsive">
                  {loader ? (
                    <Table
                      locale={locale}
                      rowKey="id"
                      dataSource={[]}
                      columns={columns}
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      onRow={(row) => ({
                        onClick: () =>
                          offLineMode
                            ? setOfflineModeCheck(true)
                            : history.push(`inventory/add`, {
                                data: row,
                              }),
                      })}
                      size="small"
                      style={{ marginTop: "8px" }}
                    />
                  ) : (
                    <Table
                      rowKey="id"
                      dataSource={dataSource}
                      columns={columns}
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      onRow={(row) => ({
                        onClick: () =>
                          offLineMode
                            ? setOfflineModeCheck(true)
                            : history.push(`inventory/add`, {
                                data: row,
                              }),
                      })}
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
        title="Confirm Delete"
        okText={
          loading ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 16,
                    color: "white",
                    margin: "0px 14px",
                  }}
                  spin
                />
              }
            />
          ) : (
            "Delete"
          )
        }
        visible={modalDeleteVisible}
        onOk={deleteSelectedRegister}
        onCancel={handleCancel}
        width={600}
      >
        <p>Are you sure you want to delete Inventory ?</p>
      </Modal>
      <Modal
        title="You are Offline"
        visible={offLineModeCheck}
        onOk={() => setOfflineModeCheck(false)}
        onCancel={() => setOfflineModeCheck(false)}
        width={600}
      >
        <p>You are offline not add and update </p>
      </Modal>
    </div>
  );
};

export default Inventory;
