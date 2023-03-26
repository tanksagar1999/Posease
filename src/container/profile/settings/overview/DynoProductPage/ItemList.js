import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal, Switch, message } from "antd";
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
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const ItemList = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [loader, setloader] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [TaxesList, setTaxesList] = useState([]);
  const [selectionType] = useState("checkbox");
  const [itemList, setItemList] = useState([]);
  const [availabilityModal, setAvailabilityModal] = useState({
    visible: false,
    available: false,
    itemId: "",
    url: location?.state?.urlName,
  });
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  async function fetchProductsList() {
    if (location?.state?.urlName) {
      const getProductlist = await dispatch(
        onlineOrderProductList(`${location?.state?.urlName}/items`)
      );
      if (getProductlist?.items_vo) {
        setItemList(getProductlist.items_vo);
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
  const [state, setState] = useState({
    item: TaxesList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (TaxesList) {
      setState({
        item: TaxesList,
        selectedRowKeys,
      });
    }
  }, [TaxesList, selectedRowKeys]);

  const deleteSelectedTaxes = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allTaxesIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allTaxesIdsForDelete.push(item.id);
    });
    const getDeletedTaxes = await dispatch(
      deleteTaxes({ ids: allTaxesIdsForDelete })
    );
    if (
      getDeletedTaxes &&
      getDeletedTaxes.TaxesDeletedData &&
      !getDeletedTaxes.TaxesDeletedData.error
    ) {
      const getTaxesList = await dispatch(getAllTaxesList());
      setModelDeleteVisible(false);
      setTaxesList(getTaxesList.taxesList);
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };

  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  let searchItemList = itemList.filter((value) =>
    value.item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchItemList.length)
    searchItemList.map((value) => {
      const { id, name, price, in_stock, updated_on, recommended } = value.item;

      return dataSource.push({
        id: id,
        itemName: name,
        price: price,
        category: value.main_category_name ? value.main_category_name : "",
        in_stock: in_stock,
        update_date: moment(new Date(updated_on)).format("MMM DD, Y, h:mm A"),
        recommend: recommended ? "yes" : "-",
      });
    });
  const columns = [
    {
      title: "Name",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "center-col",
    },
    {
      title: "Online Category",
      dataIndex: "category",
      key: "category",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "Recommended",
      dataIndex: "recommend",
      key: "recommend",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "Availability",
      dataIndex: "in_stock",
      key: "in_stock",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: (
            <div>
              {" "}
              <Switch
                checked={text}
                onChange={(value) => {
                  if (value) {
                    setAvailabilityModal({
                      visible: true,
                      available: text,
                      itemId: record.id,
                      url: location?.state?.urlName,
                    });
                  } else {
                    setAvailabilityModal({
                      visible: true,
                      available: text,
                      itemId: record.id,
                      url: location?.state?.urlName,
                    });
                  }
                }}
              />
            </div>
          ),
        };
      },
    },
    {
      title: "Last Synced At",
      dataIndex: "update_date",
      key: "update_date",
      align: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
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
  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", marginLeft: "10px" }}>
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
        }
        // isbutton={
        //   <NavLink
        //     to={offLineMode ? "#" : "/settings/taxes/add/tax"}
        //     className="ant-btn ant-btn-primary ant-btn-md"
        //     style={{ color: "#FFF" }}
        //     onClick={() =>
        //       offLineMode
        //         ? setOfflineModeCheck(true)
        //         : setOfflineModeCheck(false)
        //     }
        //   >
        //     <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
        //     Add Tax
        //   </NavLink>
        // }
      >
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
          title="Confirm Delete"
          okText="Delete"
          visible={modalDeleteVisible}
          onOk={deleteSelectedTaxes}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected taxes ?</p>
        </Modal>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          // rowSelection={{
          //   type: selectionType,
          //   ...rowSelection,
          // }}
          // onRow={(row) => ({
          //   onClick: () =>
          //     offLineMode
          //       ? setOfflineModeCheck(true)
          //       : history.push(`/settings/taxes/add/tax`, {
          //         taxes_id: row.id,
          //       }),
          // })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default ItemList;
