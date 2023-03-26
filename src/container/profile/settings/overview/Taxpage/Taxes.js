import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
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
import { LoadingOutlined } from "@ant-design/icons";
const Taxes = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [TaxesList, setTaxesList] = useState([]);
  const [selectionType] = useState("checkbox");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTaxesList() {
      const getTaxesList = await dispatch(getAllTaxesList("sell"));
      if (isMounted.current && getTaxesList && getTaxesList.taxesList)
        setTaxesList(getTaxesList.taxesList);
    }
    if (isMounted.current) {
      fetchTaxesList();
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
      if (getTaxesList.taxesList) {
        setTaxesList(getTaxesList.taxesList);
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
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  let searchArrTaxes = item.filter((value) =>
    value.tax_name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchArrTaxes.length)
    searchArrTaxes.map((value) => {
      const { _id, tax_name, tax_percentage, is_linked_to_tax_group } = value;
      return dataSource.push({
        id: _id,
        tax_name: tax_name,
        tax_percent: tax_percentage,
        is_linked: is_linked_to_tax_group,
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
    },
    {
      title: "Tax Name",
      dataIndex: "tax_name",
      key: "tax_name",
      fixed: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Tax Percent",
      dataIndex: "tax_percent",
      key: "tax_percent",
      className: "center-col",
    },
    {
      title: "Is Linked To A Tax Group?",
      dataIndex: "is_linked",
      key: "is_linked",
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

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", marginLeft: "10px" }}>
            <Input
              suffix={<SearchOutlined />}
              autoFocus
              className="set_serbt"
              placeholder="Search by Tax Name"
              style={{
                borderRadius: "30px",
                width: "250px",
              }}
              onChange={(e) => setsearch(e.target.value)}
              value={search}
            />
          </div>
        }
        isbutton={
          <NavLink
            to={offLineMode ? "#" : "/settings/taxes/add/tax"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Tax
          </NavLink>
        }
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
        <p style={{ display: "none" }}>{loading}</p>
        <Modal
          title="Confirm Delete"
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
              "Delete"
            )
          }
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
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`/settings/taxes/add/tax`, {
                    taxes_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Taxes;
