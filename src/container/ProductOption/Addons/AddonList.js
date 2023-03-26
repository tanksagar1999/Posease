import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Modal, Button, Form } from "antd";
import {
  SearchOutlined,
  ImportOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { TableWrapper } from "../../styled";
import { Popover } from "../../../components/popup/popup";
import { Cards } from "../../../components/cards/frame/cards-frame";
import "../option.css";
import { TopToolBox } from "../Style";
import { useHistory } from "react-router-dom";
import { getItem } from "../../../utility/localStorageControl";
import { AutoCompleteStyled } from "../../../components/autoComplete/style";
import {
  getAllAddonList,
  deleteAddon,
  ExportAddon,
} from "../../../redux/addon/actionCreator";

const AddonListData = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const [loading, setLoading] = useState(false);
  const { path } = useRouteMatch();
  let searchInput = useRef(null);
  const [searchVal, setSearchVal] = useState(null);
  const dispatch = useDispatch();
  let [search, setSearch] = useState("");
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();

  const {
    addonList,
    searchText,
    mainAddonList,
    statusSetupApiCall,
  } = useSelector(
    (state) => ({
      searchText: state.addon.searchText,
      mainAddonList: state.addon.mainAddonList,
      addonList: state.addon.addonList,
      statusSetupApiCall: state.sellData.setUpCacheApiStatus,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: addonList,
    searchText: "",
    searchProduct: "",
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  const [ExportType, SetExportType] = useState("");

  const { selectedRowKeys, item } = state;

  useEffect(() => {
    dispatch(getAllAddonList("sell"));
  }, [statusSetupApiCall]);

  useEffect(() => {
    if (addonList) {
      setState({
        item: addonList,
        selectedRowKeys,
      });
    }
  }, [addonList, selectedRowKeys]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#bd025d" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    // searchText: selectedKeys[0];
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };
  let email = localStorage.getItem("email_id");

  const onSubmit = (values) => {
    values.type = ExportType;
    dispatch(ExportAddon(values));
    setModelVisible(false);
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelDeleteVisible(false);
  };

  const deleteSelectedaddon = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let alladdondsForDelete = [];
    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      allSelectedRowsForDelete.map((item) => {
        alladdondsForDelete.push(item.id);
      });

      const getDeletedAddon = await dispatch(
        deleteAddon({ ids: alladdondsForDelete })
      );
      if (
        getDeletedAddon &&
        getDeletedAddon.deletedItem &&
        !getDeletedAddon.deletedItem.error
      ) {
        const getAddonList = await dispatch(getAllAddonList());
        setModelDeleteVisible(false);
        dispatch(getAllAddonList());
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  let searchArr = mainAddonList.filter((value) =>
    value.addon_name.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];

  if (addonList.length)
    searchArr.map((value, i) => {
      const {
        _id,
        addon_name,
        price,
        sort_order,
        is_linked_to_addon_group,
      } = value;
      return dataSource.push({
        id: _id,
        key: i,
        addon_name: addon_name,
        price: price,
        sort_order: sort_order,
        is_linked_to_addon_group: is_linked_to_addon_group,
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
      title: "Addon Name",
      dataIndex: "addon_name",
      key: "addon_name",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Addon Price",
      dataIndex: "price",
      key: "price",
      align: "left",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${rsSymbol}${price}`,
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
    },

    {
      title: "Is Linked To A Addon Group?",
      dataIndex: "is_linked_to_addon_group",
      align: "left",
      key: "is_linked_to_addon_group",
    },
  ];

  return (
    <>
      <Row gutter={25}>
        <Col md={24} xs={24}>
          <Cards headless>
            <TopToolBox>
              <Row gutter={15} className="list-row">
                <Col lg={14} xs={24}>
                  <div className="table_titles">
                    <h2>Addon</h2>
                    <span className="title-counter center_txcs">
                      {addonList.length} Addons{" "}
                    </span>
                    <div className="sercTable">
                      <Input
                        suffix={<SearchOutlined />}
                        placeholder="Search by Name"
                        style={{
                          borderRadius: "30px",
                          width: "250px",
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        autoFocus
                      />
                    </div>
                  </div>
                </Col>

                <Col lg={10} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right" }}
                  >
                    <div key="1" className="page-header-actions">
                      <NavLink
                        to="product-options/addon/import"
                        className="ant-btn ant-btn-white ant-btn-md"
                      >
                        <ImportOutlined /> Import
                      </NavLink>
                      <Popover
                        placement="bottomLeft"
                        content={content}
                        trigger="click"
                      >
                        <Button size="small" type="white">
                          <FeatherIcon icon="download" size={14} />
                          Export
                        </Button>
                      </Popover>
                      <NavLink
                        to="product-options/addon/add"
                        className="ant-btn ant-btn-primary ant-btn-md"
                      >
                        <FeatherIcon
                          icon="plus"
                          size={16}
                          className="pls_iconcs"
                        />
                        Add Addon
                      </NavLink>
                    </div>
                  </div>
                </Col>
              </Row>
            </TopToolBox>
            <TableWrapper className="table-responsive">
              <Table
                className="products_lsttable"
                rowKey="id"
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                onRow={(row) => ({
                  onClick: () =>
                    history.push(`product-options/addon/edit/` + row.id),
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
            onOk={deleteSelectedaddon}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected addons ?</p>
          </Modal>
          <Modal
            title="Export Addons"
            visible={modalVisible}
            onOk={form.submit}
            onCancel={handleCancel}
            width={600}
          >
            <Form form={form} name="export_addon" onFinish={onSubmit}>
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item
                    name="email"
                    label="Send to Email Address"
                    initialValue={email}
                    rules={[
                      { message: "Email address is required", required: true },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export { AddonListData };
