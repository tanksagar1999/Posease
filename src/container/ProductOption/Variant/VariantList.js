import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
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
import "../option.css";
import { TopToolBox } from "../Style";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  getAllVariantList,
  deleteVariant,
  ExportVariant,
} from "../../../redux/variant/actionCreator";
import { UserTableStyleWrapper } from "../../pages/style";
import { getItem } from "../../../utility/localStorageControl";

const VariantListData = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  const dispatch = useDispatch();
  let [search, setSearch] = useState("");
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();

  const { variantList, mainVariantList, statusSetupApiCall } = useSelector(
    (state) => ({
      searchText: state.variant.searchText,
      mainVariantList: state.variant.mainVariantList,
      variantList: state.variant.variantList,
      statusSetupApiCall: state.sellData.setUpCacheApiStatus,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: variantList,
    searchText: "",
    searchProduct: "",
  });
  const [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ExportType, SetExportType] = useState("");
  const { selectedRowKeys } = state;

  useEffect(() => {
    dispatch(getAllVariantList("sell"));
  }, [statusSetupApiCall]);

  useEffect(() => {
    if (variantList) {
      setState({
        item: variantList,
        selectedRowKeys,
      });
    }
  }, [variantList, selectedRowKeys]);

  const onSubmit = async (values) => {
    setLoading(true);
    values.type = ExportType;
    let ExportVariantAPI = await dispatch(ExportVariant(values));
    if (!ExportVariantAPI.error) {
      setLoading(false);
      setModelVisible(false);
    }
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelDeleteVisible(false);
  };

  const deleteSelectedvariant = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allvariantdsForDelete = [];
    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      allSelectedRowsForDelete.map((item) => {
        allvariantdsForDelete.push(item.id);
      });

      const getDeletedVariant = await dispatch(
        deleteVariant({ ids: allvariantdsForDelete })
      );
      if (
        getDeletedVariant &&
        getDeletedVariant.deletedItem &&
        !getDeletedVariant.deletedItem.error
      ) {
        await dispatch(getAllVariantList());
        setModelDeleteVisible(false);
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };
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

  let searchArr = mainVariantList.filter(
    (value) =>
      value.variant_name.toLowerCase().includes(search.toLowerCase()) ||
      value.comment.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];

  if (variantList.length)
    searchArr.map((value, i) => {
      const {
        _id,
        variant_name,
        comment,
        price,
        sort_order,
        is_linked_to_variant_group,
      } = value;
      return dataSource.push({
        id: _id,
        key: i,
        variant_name: variant_name,
        comment: comment,
        price: price,
        sort_order: sort_order,
        is_linked_to_variant_group: is_linked_to_variant_group,
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
      align: "center",
      width: "4%",
    },
    {
      title: "Variant Name",
      dataIndex: "variant_name",
      key: "variant_name",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Variant Price",
      dataIndex: "price",
      key: "price",
      align: "left",
      sorter: (a, b) => a.price - b.price,
      render: (data, record) => `${rsSymbol}${record.price}`,
    },
    {
      title: "Variant Comment",
      dataIndex: "comment",
      key: "comment",
      align: "left",
    },
    {
      title: "Is Linked To A Variant Group?",
      dataIndex: "is_linked_to_variant_group",
      key: "is_linked_to_variant_group",
      align: "left",
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
                    <h2>Variant</h2>
                    <span className="title-counter center_txcs">
                      {variantList.length} Variants{" "}
                    </span>
                    <div className="sercTable">
                      <Input
                        suffix={<SearchOutlined />}
                        placeholder="Search by Name"
                        autoFocus
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

                <Col xxl={1} lg={1} xs={1}></Col>
                <Col xxl={7} lg={9} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right" }}
                  >
                    <div key="1" className="page-header-actions">
                      <NavLink
                        to="product-options/variant/import"
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
                        to="product-options/variant/add"
                        className="ant-btn ant-btn-primary ant-btn-md"
                      >
                        <FeatherIcon
                          icon="plus"
                          size={16}
                          className="pls_iconcs"
                        />
                        Add Variant
                      </NavLink>
                    </div>
                  </div>
                </Col>
              </Row>
            </TopToolBox>
            <UserTableStyleWrapper>
              <div className="contact-table">
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
                        history.push(`product-options/variant/edit/` + row.id),
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
              </div>
            </UserTableStyleWrapper>
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
            onOk={deleteSelectedvariant}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected variants ?</p>
          </Modal>
          <Modal
            title="Export Variants"
            visible={modalVisible}
            onOk={form.submit}
            okText={
              loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 16,
                        color: "white",
                        margin: "0px 2px",
                      }}
                      spin
                    />
                  }
                />
              ) : (
                "OK"
              )
            }
            onCancel={handleCancel}
            width={600}
          >
            <Form form={form} name="export_variant" onFinish={onSubmit}>
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item
                    name="email"
                    label="Send to Email Address"
                    initialValue={email}
                    rules={[
                      {
                        message: "Email address is required",
                        required: true,
                      },
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

export { VariantListData };
