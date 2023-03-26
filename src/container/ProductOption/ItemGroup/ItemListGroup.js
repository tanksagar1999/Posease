import React, { useState, useEffect } from "react";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Modal } from "antd";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { TableWrapper } from "../../styled";
import { Popover } from "../../../components/popup/popup";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { TopToolBox } from "../Style";
import {
  getAllItemGroupList,
  deleteItemGroup,
} from "../../../redux/ItemGroup/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const ItemListGroup = (props) => {
  const [loading, setLoading] = useState(false);
  const { path } = useRouteMatch();
  let [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectionType] = useState("checkbox");

  let { itemGroupList, mainItemGroupList } = useSelector(
    (state) => ({
      searchText: state.itemGroup.searchText,
      mainItemGroupList: state.itemGroup.mainItemGroupList,
      itemGroupList: state.itemGroup.itemGroupList,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: itemGroupList,
    searchText: "",
  });

  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const { selectedRowKeys, item } = state;

  useEffect(() => {
    dispatch(getAllItemGroupList("sell"));
  }, []);

  useEffect(() => {
    if (itemGroupList) {
      setState({
        item: itemGroupList,
        selectedRowKeys,
      });
    }
  }, [itemGroupList, selectedRowKeys]);

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

  const deleteSelecteditemGroup = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;

    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      const getDeletedItemGroup = await dispatch(
        deleteItemGroup({ ids: allSelectedRowsForDelete })
      );
      if (
        getDeletedItemGroup &&
        getDeletedItemGroup.deletedItem &&
        !getDeletedItemGroup.deletedItem.error
      ) {
        await dispatch(getAllItemGroupList());
        setModelDeleteVisible(false);
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  let searchArr = mainItemGroupList.filter((value) =>
    value.item_group_name.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];
  if (itemGroupList.length > 0)
    searchArr.map((value, i) => {
      const { _id, item_group_name, products } = value;
      return dataSource.push({
        id: _id,
        key: i,
        item_group_name: item_group_name,
        products: products,
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
      width: "4%",
    },
    {
      title: "Item Group Name",
      dataIndex: "item_group_name",
      key: "item_group_name",
      align: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Items",
      dataIndex: "products",
      key: "products",
      align: "left",
      onFilter: (value, record) => record.products.indexOf(value) === 0,
      sorter: (a, b) => a.products.length - b.products.length,
      sortDirections: ["descend", "ascend"],
      render: (products, record) => record.products.length,
    },
  ];

  return (
    <>
      <Row gutter={25}>
        <Col md={24} xs={24}>
          <Cards headless>
            <TopToolBox>
              <Row gutter={15} className="list-row">
                <Col lg={13} xs={24}>
                  <div className="table_titles">
                    <h2> Item Group</h2>
                    <span className="title-counter center_txcs">
                      {itemGroupList.length} Items Groups{" "}
                    </span>
                    <div className="sercTable">
                      <Input
                        suffix={<SearchOutlined />}
                        autoFocus
                        placeholder="Search by Name"
                        style={{
                          borderRadius: "30px",
                          width: "250px",
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                      />
                    </div>
                  </div>
                </Col>

                <Col lg={11} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right" }}
                  >
                    <div key="1" className="page-header-actions">
                      <NavLink
                        to="product-options/itemgroup/add"
                        className="ant-btn ant-btn-primary ant-btn-md"
                      >
                        <FeatherIcon
                          icon="plus"
                          size={16}
                          className="pls_iconcs"
                        />
                        Add Item Group
                      </NavLink>
                    </div>
                  </div>
                </Col>
              </Row>
            </TopToolBox>
            <TableWrapper className="table-responsive">
              <Table
                rowKey="id"
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                onRow={(row) => ({
                  onClick: () =>
                    history.push(`${path}/itemgroup/edit/` + row.id),
                })}
                size="small"
                dataSource={dataSource.reverse()}
                columns={columns}
                fixed={true}
                scroll={{ x: 800 }}
                pagination={{
                  pageSizeOptions: ["10", "50", "100", "500", "1000"],
                  showSizeChanger: true,
                  total: dataSource.length,
                }}
              />
            </TableWrapper>
          </Cards>
          <p style={{ display: "none" }}>{loading}</p>
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
            onOk={deleteSelecteditemGroup}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected item Groups?</p>
          </Modal>
        </Col>
      </Row>
    </>
  );
};
export { ItemListGroup };
