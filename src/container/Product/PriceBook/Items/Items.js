import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Row, Col, Table, Input, Checkbox, InputNumber } from "antd";
import { FolderViewOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../product.css";
import { getAllPricebookProductList } from "../../../../redux/pricebook/actionCreator";

const ItemsList = forwardRef((props, ref) => {
  let { passFun, updatedList } = props;
  const dispatch = useDispatch();
  const [editPrice, setEditPrice] = useState(false);
  let [ProductListData, setProductListData] = useState([]);
  let [editItemList, setEditItemList] = useState([]);
  let isMounted = useRef(true);
  const location = useLocation();
  const queryParams = useParams();

  useEffect(() => {
    async function fetchProductList() {
      const getProductList = await dispatch(
        getAllPricebookProductList(queryParams.pricebook_id, 1)
      );

      if (
        isMounted.current &&
        getProductList &&
        getProductList.PriceBookProductList
      )
        setProductListData(getProductList.PriceBookProductList);
    }
    if (isMounted.current) {
      fetchProductList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: "",
  });

  useImperativeHandle(ref, () => ({
    async Productlist() {
      const getProductList = await dispatch(
        getAllPricebookProductList(queryParams.pricebook_id)
      );
      if (getProductList && getProductList.PriceBookProductList) {
        setProductListData(getProductList.PriceBookProductList);
        return getProductList.PriceBookProductList;
      }
    },
  }));
  let { selectedRowKeys, item } = state;
  useEffect(() => {
    if (ProductListData) {
      setState({
        item: ProductListData,
        selectedRowKeys,
      });
    }
  }, [ProductListData, selectedRowKeys]);

  passFun(editItemList);

  function pushToArray(editItemList, obj) {
    const index = editItemList.findIndex(
      (e) => e.product_id === obj.product_id
    );
    if (index === -1) {
      setEditItemList([...editItemList, obj]);
    } else {
      editItemList[index].product_id = obj.product_id;
      obj.price && (editItemList[index].price = obj.price);
      obj.disable && (editItemList[index].disable = obj.disable);
    }
  }

  let changePageData = async (value) => {
    const getProductList = await dispatch(
      getAllPricebookProductList(queryParams.pricebook_id, value)
    );

    if (getProductList && getProductList.PriceBookProductList)
      setProductListData(getProductList.PriceBookProductList);
  };
  function onChange(value, editPrice) {
    const findIndex = item.findIndex((product) => product._id === editPrice);

    pushToArray(editItemList, {
      product_id: editPrice,
      price: value,
      disable: item[findIndex].is_disabled ? true : false,
    });
    item[findIndex].price = value;
  }
  function checkboxChange(e, id) {
    const findIndex = item.findIndex((product) => product._id === id);
    item[findIndex].is_disabled = e.target.checked;

    pushToArray(editItemList, {
      product_id: id,
      disable: e.target.checked,
      price: item[findIndex].price,
    });
  }
  const dataSource = [];
  if (ProductListData.length)
    item.map((value, inde) => {
      const {
        _id,
        product_name,
        product_category,
        price,
        is_disabled,
        is_price_overridden,
      } = value;
      return dataSource.push({
        id: _id,
        product_name: product_name,
        category: product_category.category_name,
        price: price,
        is_price_overridden: is_price_overridden ? is_price_overridden : "-",
        is_disabled: is_disabled ? is_disabled : false,
      });
    });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      className: "center-col-padding",
      render(text, record) {
        return {
          children: (
            <div
              style={{ color: "#008cba" }}
              onClick={() => setEditPrice(false)}
            >
              {text}
            </div>
          ),
        };
      },
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "category",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: <div onClick={() => setEditPrice(false)}>{text}</div>,
        };
      },
    },
    {
      title: "Product Price",
      dataIndex: "price",
      key: "price",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children:
            editPrice === record.id ? (
              <InputNumber
                onPressEnter={() => setEditPrice(false)}
                defaultValue={text}
                onChange={(value) => onChange(value, editPrice)}
              />
            ) : (
              <div
                style={{ borderBottom: "1px dashed #a8b9ce", width: "100px" }}
                onClick={() => setEditPrice(record.id)}
              >
                {text}
              </div>
            ),
        };
      },
    },
    {
      title: "Is Price Overridden?",
      dataIndex: "is_price_overridden",
      key: "is_price_overridden",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: <div onClick={() => setEditPrice(false)}>{text}</div>,
        };
      },
    },
    {
      title: "Is Disabled?",
      dataIndex: "is_disabled",
      key: "is_disabled",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "center" },
          },
          children: (
            <div onClick={() => setEditPrice(false)}>
              <Checkbox
                defaultChecked={text}
                onChange={(value) => checkboxChange(value, record.id)}
              />
            </div>
          ),
        };
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        size="small"
        dataSource={dataSource}
        columns={columns}
        fixed={true}
        scroll={{ x: 800 }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "50", "100", "500", "1000"],
          total: dataSource.length,
        }}
      />
    </div>
  );
});

export { ItemsList };
