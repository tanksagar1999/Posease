import React, { useState, useEffect } from "react";
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
  getAllVariantGroupList,
  deleteVariantGroup,
  ExportVariantGroup,
} from "../../../redux/variantGroup/actionCreator";
import "../option.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const VariantListGroup = (props) => {
  const [loading, setLoading] = useState(false);
  const { path } = useRouteMatch();
  let [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();

  const {
    variantGroupList,
    mainVariantGroupList,
    statusSetupApiCall,
  } = useSelector(
    (state) => ({
      searchText: state.variantGroup.searchText,
      mainVariantGroupList: state.variantGroup.mainVariantGroupList,
      variantGroupList: state.variantGroup.variantGroupList,
      statusSetupApiCall: state.sellData.setUpCacheApiStatus,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: variantGroupList,
    searchText: "",
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [ExportType, SetExportType] = useState("");
  const { selectedRowKeys, item } = state;

  useEffect(() => {
    dispatch(getAllVariantGroupList("sell"));
  }, [statusSetupApiCall]);

  useEffect(() => {
    if (variantGroupList) {
      setState({
        item: variantGroupList,
        selectedRowKeys,
      });
    }
  }, [variantGroupList, selectedRowKeys]);

  let email = localStorage.getItem("email_id");
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
    dispatch(ExportVariantGroup(values));
    setModelVisible(false);
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelDeleteVisible(false);
  };

  const deleteSelectedvariantGroup = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allvariantGroupidsForDelete = [];
    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      allSelectedRowsForDelete.map((item) => {
        allvariantGroupidsForDelete.push(item.id);
      });

      const getDeletedVariantGroup = await dispatch(
        deleteVariantGroup({ ids: allvariantGroupidsForDelete })
      );
      if (
        getDeletedVariantGroup &&
        getDeletedVariantGroup.deletedItem &&
        !getDeletedVariantGroup.deletedItem.error
      ) {
        const getVariantGroupList = await dispatch(getAllVariantGroupList());
        await dispatch(getAllVariantGroupList());
        setModelDeleteVisible(false);
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  let searchArr = mainVariantGroupList.filter((value) =>
    value.variant_group_name.toLowerCase().includes(search.toLowerCase())
  );
  const dataSource = [];

  if (variantGroupList.length)
    searchArr.map((value, i) => {
      const { _id, variant_group_name, product_variants, sort_order } = value;

      return dataSource.push({
        id: _id,
        key: i,
        variant_group_name: variant_group_name,
        product_variants: product_variants,
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
      title: "Variant Group Name",
      dataIndex: "variant_group_name",
      key: "variant_group_name",
      fixed: "left",
      className: "products_list_fix",
      align: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Variants",
      dataIndex: "product_variants",
      key: "product_variants",
      align: "left",
      onFilter: (value, record) => record.product_variants.indexOf(value) === 0,
      sorter: (a, b) => a.product_variants.length - b.product_variants.length,
      sortDirections: ["descend", "ascend"],
      render: (product_variants, record) => (
        <div>{record.product_variants.length}</div>
      ),
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
                <Col lg={14} xs={24}>
                  <div className="table_titles">
                    <h2> Variant Group</h2>
                    <span className="title-counter center_txcs">
                      {variantGroupList.length} Variants Groups{" "}
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

                <Col lg={10} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right" }}
                  >
                    <div key="1" className="page-header-actions">
                      <NavLink
                        to="product-options/variantGroup/import"
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
                        to="product-options/variantGroup/add"
                        className="ant-btn ant-btn-primary ant-btn-md"
                      >
                        <FeatherIcon
                          icon="plus"
                          size={16}
                          className="pls_iconcs"
                        />
                        Add Variant Group
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
                    history.push(`${path}/variantgroup/edit/` + row.id),
                })}
                size="small"
                dataSource={dataSource.reverse()}
                columns={columns}
                fixed={true}
                scroll={{ x: 800 }}
                pagination={{
                  showSizeChanger: true,
                  total: dataSource.length,
                  pageSizeOptions: ["10", "50", "100", "500", "1000"],
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
            onOk={deleteSelectedvariantGroup}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected variant Groups?</p>
          </Modal>
          <Modal
            title="Export Variant Group"
            visible={modalVisible}
            onOk={form.submit}
            onCancel={handleCancel}
            width={600}
          >
            <Form form={form} name="export_variant_group" onFinish={onSubmit}>
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
export { VariantListGroup };
