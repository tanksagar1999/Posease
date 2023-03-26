import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import {
  getTaxGroupList,
  deleteTaxGroup,
} from "../../../../../redux/taxGroup/actionCreator";
import { SearchOutlined } from "@ant-design/icons";

const Taxesgroup = () => {
  let [search, setsearch] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const [TaxGroupList, setTaxGroupList] = useState([]);
  let isMounted = useRef(true);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  useEffect(() => {
    async function fetchTaxGroupList() {
      const getAllTaxGroupList = await dispatch(getTaxGroupList("sell"));
      if (
        isMounted.current &&
        getAllTaxGroupList &&
        getAllTaxGroupList.taxGroupList
      )
        setTaxGroupList(getAllTaxGroupList.taxGroupList);
    }
    if (isMounted.current) {
      fetchTaxGroupList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [state, setState] = useState({
    item: TaxGroupList,
  });
  const { selectedRowKeys, item } = state;
  useEffect(() => {
    if (TaxGroupList) {
      setState({
        item: TaxGroupList,
        selectedRowKeys,
      });
    }
  }, [TaxGroupList, selectedRowKeys]);

  const deleteSelectedTaxGroup = async () => {
    const { allSelectedRowsForDelete } = state;
    const getDeletedTaxGroup = await dispatch(
      deleteTaxGroup({ ids: allSelectedRowsForDelete })
    );
    if (
      getDeletedTaxGroup &&
      getDeletedTaxGroup.taxGroupdeletedData &&
      !getDeletedTaxGroup.taxGroupdeletedData.error
    ) {
      const TaxGroupList = await dispatch(getTaxGroupList());
      setModelDeleteVisible(false);
      setTaxGroupList(TaxGroupList.taxGroupList);
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
  let searchArrTaxGroup = item.filter((value) =>
    value.tax_group_name.toLowerCase().includes(search.toLowerCase())
  );
  if (searchArrTaxGroup.length)
    searchArrTaxGroup.map((value) => {
      let sum = 0;
      value.taxes.map((data) => {
        sum += data.tax_percentage;
      });
      const {
        key,
        _id,
        tax_group_name,

        taxes_inclusive_in_product_price,
      } = value;
      return dataSource.push({
        key: key,
        id: _id,
        tax_group_name: tax_group_name,
        tex_percent: sum,
        taxes_inclusive_in_product_price:
          taxes_inclusive_in_product_price === true ? "Yes" : "No",
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
      title: "Tax Group Name",
      dataIndex: "tax_group_name",
      key: "tax_group_name",
      fixed: "left",
      className: "center-col",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Net tax percent",
      dataIndex: "tex_percent",
      key: "tex_percent",
      className: "center-col",
    },
    {
      title: "Is Tax Included In Product Price?",
      align: "left",
      dataIndex: "taxes_inclusive_in_product_price",
      key: "taxes_inclusive_in_product_price",
      className: "center-col",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRows) => {
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
              className="set_serbt"
              autoFocus
              placeholder="Search by Tax Group Name"
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
            to={offLineMode ? "#" : "/settings/taxgroup/add/taxes_group"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Tax Group
          </NavLink>
        }
      >
        <Modal
          title="Confirm Delete"
          okText="Delete"
          visible={modalDeleteVisible}
          onOk={deleteSelectedTaxGroup}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected taxes groups ?</p>
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
                : history.push(`/settings/taxgroup/add/taxes_group`, {
                    tax_group_id: row.id,
                  }),
          })}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Taxesgroup;
