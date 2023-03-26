import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Modal, Progress } from "antd";
import { ArrowRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import { UserTableStyleWrapper } from "../../pages/style";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "../Style";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Popover } from "../../../components/popup/popup";
import "../product.css";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllPriceBookList,
  deletePriceBook,
} from "../../../redux/pricebook/actionCreator";
import { getAllProductList } from "../../../redux/products/actionCreator";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Pricebook = () => {
  const [loading, setLoading] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  let [search, setsearch] = useState("");
  const [selectionType] = useState("checkbox");
  const { Search } = Input;
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  let isMounted = useRef(true);
  const [PriceBookList, setPriceBookList] = useState([]);

  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         return 0;
  //       }
  //       const diff = Math.random() * 10;
  //       return Math.min(oldProgress + diff, 100);
  //     });
  //   }, 100);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    async function fetchPriceBookList() {
      const getPriceBookList = await dispatch(getAllPriceBookList());
      if (
        isMounted.current &&
        getPriceBookList &&
        getPriceBookList.PriceBookList
      )
        setPriceBookList(getPriceBookList.PriceBookList);
    }
    if (isMounted.current) {
      fetchPriceBookList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: PriceBookList,
  });

  const { selectedRowKeys, item } = state;

  useEffect(() => {
    if (PriceBookList) {
      setState({
        item: PriceBookList,
        selectedRowKeys,
      });
    }
  }, [PriceBookList, selectedRowKeys]);

  let searchArr = item.filter((value) =>
    value.price_book_name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteSelectedPricecBook = async () => {
    setLoading(true);
    const { allSelectedRowsForDelete } = state;
    let allPriceBookIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allPriceBookIdsForDelete.push(item.id);
    });
    const getDeletedPriceBook = await dispatch(
      deletePriceBook({ ids: allPriceBookIdsForDelete })
    );
    if (
      getDeletedPriceBook &&
      getDeletedPriceBook.PriceBookDeletedData &&
      !getDeletedPriceBook.PriceBookDeletedData.error
    ) {
      const getPriceBookList = await dispatch(getAllPriceBookList());

      if (getPriceBookList) {
        setPriceBookList(getPriceBookList.PriceBookList);
        let response = await dispatch(getAllProductList());
        if (response && response.productList) {
          setModelDeleteVisible(false);
        }
      }
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };

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
  if (PriceBookList.length)
    searchArr.map((value) => {
      const { _id, price_book_name, register_assigned_to, order_type } = value;

      return dataSource.push({
        id: _id,
        price_book_name: price_book_name,
        register_name: register_assigned_to?.register_name,
        order_type:
          order_type === "all_orders"
            ? "All Orders"
            : order_type === "take_away"
            ? "Take Away"
            : order_type === "dive_in"
            ? "Dine In"
            : "Delivery",
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
      width: "3%",
    },
    {
      title: "Price Book Name",
      dataIndex: "price_book_name",
      key: "price_book_name",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Register Name",
      dataIndex: "register_name",
      key: "register_name",
      editable: true,
    },
    {
      title: "Order Type",
      dataIndex: "order_type",
      key: "order_type",
    },
    {
      title: "Manage Items",
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
                    history.push(`/products/pricebook/items/${record.id}`);
                  }
                }}
              />
            </div>
          ),
        };
      },
    },
  ];

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
      {!dataSource ? (
        <Progress
          style={{ marginTop: "60px" }}
          strokeColor={"red"}
          size="small"
          showInfo={false}
          percent={progress}
        />
      ) : (
        <Main>
          <CardToolbox>
            <PageHeader
              ghost
              subTitle={
                <>
                  <div className="table_titles">
                    <h2>Price Books</h2>
                    <span className="title-counter">
                      {item.length} Price Books
                    </span>
                  </div>

                  {/* <div className="table-search-box">
                  <Search
                    className="custom-search"
                    placeholder="Search by Name"
                    autoFocus
                    onChange={(e) => setsearch(e.target.value)}
                  />
                </div> */}
                  <div
                    style={{ boxShadow: "none", marginLeft: "10px" }}
                    className="search_lrm"
                  >
                    <Input
                      suffix={<SearchOutlined />}
                      autoFocus
                      placeholder="Search by Name"
                      style={{
                        borderRadius: "30px",
                        width: "250px",
                      }}
                      onChange={(e) => setsearch(e.target.value)}
                    />
                  </div>
                </>
              }
              buttons={[
                <div key="1" className="page-header-actions">
                  <NavLink
                    to={offLineMode ? "#" : "/products/pricebook/add"}
                    className="ant-btn ant-btn-primary ant-btn-md"
                    style={{ color: "#FFF" }}
                    onClick={() =>
                      offLineMode
                        ? setOfflineModeCheck(true)
                        : setOfflineModeCheck(false)
                    }
                  >
                    <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
                    Add Price Book
                  </NavLink>
                </div>,
              ]}
            />
          </CardToolbox>
          <Modal
            title="You are Offline"
            visible={offLineModeCheck}
            onOk={() => setOfflineModeCheck(false)}
            onCancel={() => setOfflineModeCheck(false)}
            width={600}
          >
            <p>You are offline not add and update </p>
          </Modal>
          <Row gutter={15}>
            <Col md={24}>
              <Cards headless>
                <UserTableStyleWrapper>
                  <div className="contact-table">
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
                                  margin: "0px 23px",
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
                      onOk={deleteSelectedPricecBook}
                      onCancel={handleCancel}
                      width={600}
                    >
                      <p>
                        Are you sure you want to delete selected pricebooks ?
                      </p>
                    </Modal>
                    <TableWrapper className="table-responsive">
                      <Table
                        className="products_lsttable"
                        rowKey="id"
                        size="small"
                        dataSource={dataSource}
                        columns={columns}
                        rowSelection={{
                          type: selectionType,
                          ...rowSelection,
                        }}
                        onRow={(row) => ({
                          onClick: () =>
                            history.push(`/products/pricebook/add`, {
                              price_book_id: row.id,
                            }),
                        })}
                        fixed={true}
                        scroll={{ x: 800 }}
                        pagination={{
                          pageSize: 10,
                          showSizeChanger: true,
                          total: dataSource.length,
                        }}
                      />
                    </TableWrapper>
                  </div>
                </UserTableStyleWrapper>
              </Cards>
            </Col>
          </Row>
        </Main>
      )}
    </>
  );
};

export default Pricebook;
