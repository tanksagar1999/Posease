import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Modal, Button, Form } from "antd";
import {
  SearchOutlined,
  ImportOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { TableWrapper } from "../../styled";
import { Popover } from "../../../components/popup/popup";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { TopToolBox } from "../Style";
import {
  getAllAddonGroupList,
  deleteAddonGroup,
  ExportAddonGroup,
} from "../../../redux/AddonGroup/actionCreator";
import "../option.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const AddonListGroup = (props) => {
  const [loading, setLoading] = useState(false);
  const { path } = useRouteMatch();
  let [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();
  const {
    addonGroupList,
    mainAddonGroupList,
    statusSetupApiCall,
  } = useSelector(
    (state) => ({
      searchText: state.addonGroup.searchText,
      mainAddonGroupList: state.addonGroup.mainAddonGroupList,
      addonGroupList: state.addonGroup.addonGroupList,
      statusSetupApiCall: state.sellData.setUpCacheApiStatus,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: addonGroupList,
    searchText: "",
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  const [ExportType, SetExportType] = useState("");
  const { selectedRowKeys } = state;

  useEffect(() => {
    dispatch(getAllAddonGroupList("sell"));
  }, [statusSetupApiCall]);

  useEffect(() => {
    if (addonGroupList) {
      setState({
        item: addonGroupList,
        selectedRowKeys,
      });
    }
  }, [addonGroupList, selectedRowKeys]);

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
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  const onSubmit = (values) => {
    values.type = ExportType;
    dispatch(ExportAddonGroup(values));
    setModelVisible(false);
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelDeleteVisible(false);
  };

  const deleteSelectedaddonGroup = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let alladdonGroupidsForDelete = [];
    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      allSelectedRowsForDelete.map((item) => {
        alladdonGroupidsForDelete.push(item.id);
      });

      const getDeletedAddonGroup = await dispatch(
        deleteAddonGroup({ ids: alladdonGroupidsForDelete })
      );
      if (
        getDeletedAddonGroup &&
        getDeletedAddonGroup.deletedItem &&
        !getDeletedAddonGroup.deletedItem.error
      ) {
        setModelDeleteVisible(false);
        dispatch(getAllAddonGroupList());
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  let email = localStorage.getItem("email_id");

  let searchArr = mainAddonGroupList.filter((value) =>
    value.addon_group_name.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];
  if (addonGroupList.length > 0)
    searchArr.map((value, i) => {
      const { _id, addon_group_name, product_addons, sort_order } = value;
      return dataSource.push({
        id: _id,
        key: i,
        addon_group_name: addon_group_name,
        product_addons: product_addons,
        sort_order: sort_order,
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
      title: "Addon Group Name",
      dataIndex: "addon_group_name",
      key: "addon_group_name",
      align: "left",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Addons",
      dataIndex: "product_addons",
      key: "product_addons",
      align: "left",
      onFilter: (value, record) => record.product_addons.indexOf(value) === 0,
      sorter: (a, b) => a.product_addons.length - b.product_addons.length,
      sortDirections: ["descend", "ascend"],
      render: (product_addons, record) => record.product_addons.length,
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
      align: "left",
    },
  ];

  return (
    <>
      <Row gutter={25}>
        <Col md={24} xs={24}>
          <Cards headless>
            <TopToolBox>
              <Row gutter={15} className="list-row">
                <Col lg={12} xs={24}>
                  <div className="table_titles">
                    <h2> Addon Group</h2>
                    <span className="title-counter center_txcs">
                      {addonGroupList.length} Addon Groups{" "}
                    </span>
                    <div className="sercTable">
                      <Input
                        suffix={<SearchOutlined />}
                        placeholder="Search by Name"
                        style={{
                          borderRadius: "30px",
                          width: "250px",
                        }}
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                      />
                    </div>
                  </div>
                </Col>

                <Col lg={12} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right" }}
                  >
                    <div key="1" className="page-header-actions">
                      <NavLink
                        to="product-options/addongroup/import"
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
                        to="product-options/addongroup/add"
                        className="ant-btn ant-btn-primary ant-btn-md"
                      >
                        <FeatherIcon
                          icon="plus"
                          size={16}
                          className="pls_iconcs"
                        />
                        Add Addon Group
                      </NavLink>
                    </div>
                  </div>
                </Col>
              </Row>
            </TopToolBox>
            <TableWrapper className="table-responsive">
              <Table
                rowKey="id"
                className="products_lsttable"
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                onRow={(row) => ({
                  onClick: () =>
                    history.push(`${path}/addongroup/edit/` + row.id),
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
            onOk={deleteSelectedaddonGroup}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected addon Groups?</p>
          </Modal>
          <Modal
            title="Export Addon Group"
            visible={modalVisible}
            onOk={form.submit}
            onCancel={handleCancel}
            width={600}
          >
            <Form form={form} name="export_addon_group" onFinish={onSubmit}>
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
export { AddonListGroup };
