import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Checkbox, InputNumber } from "antd";
import { FolderViewOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllPricebookVariantList } from "../../../../redux/pricebook/actionCreator";
import "../../product.css";

const VariantPrice = forwardRef((props, ref) => {
  let { passFun } = props;
  const dispatch = useDispatch();
  const [editPrice, setEditPrice] = useState(false);
  let [editItemList, setEditItemList] = useState([]);
  const [VariantListData, setVariantListData] = useState([]);
  let isMounted = useRef(true);
  const location = useLocation();

  const queryParams = useParams();

  useEffect(() => {
    async function fetchVariantList() {
      const getVariantList = await dispatch(
        getAllPricebookVariantList(queryParams.pricebook_id)
      );
      if (
        isMounted.current &&
        getVariantList &&
        getVariantList.PricebookVariantList
      )
        setVariantListData(getVariantList.PricebookVariantList);
    }
    if (isMounted.current) {
      fetchVariantList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: "",
  });

  let { selectedRowKeys, item } = state;
  useEffect(() => {
    if (VariantListData) {
      setState({
        item: VariantListData,
        selectedRowKeys,
      });
    }
  }, [VariantListData, selectedRowKeys]);

  useImperativeHandle(ref, () => ({
    async Variantlist() {
      const getVariantList = await dispatch(
        getAllPricebookVariantList(queryParams.pricebook_id)
      );
      if (getVariantList && getVariantList.PricebookVariantList)
        setVariantListData(getVariantList.PricebookVariantList);
    },
  }));

  passFun(editItemList);

  function pushToArray(editItemList, obj) {
    const index = editItemList.findIndex(
      (e) => e.variant_id === obj.variant_id
    );
    if (index === -1) {
      setEditItemList([...editItemList, obj]);
    } else {
      editItemList[index].variant_id = obj.variant_id;
      obj.price && (editItemList[index].price = obj.price);
      obj.disable && (editItemList[index].disable = obj.disable);
    }
  }

  function onChange(value, editPrice) {
    const findIndex = item.findIndex((product) => product._id === editPrice);
    pushToArray(editItemList, { variant_id: editPrice, price: value });
    item[findIndex].price = value;
  }
  function checkboxChange(e, id) {
    const findIndex = item.findIndex((product) => product._id === id);
    pushToArray(editItemList, { variant_id: id, disable: e.target.checked });
    item[findIndex].disabled = e.target.checked;
  }

  const dataSource = [];
  if (VariantListData.length)
    item.map((value) => {
      const {
        _id,
        variant_name,
        variant_groups,
        price,
        is_disabled,
        is_price_overridden,
      } = value;
      return dataSource.push({
        id: _id,
        variant_name: variant_name,
        varian_group: variant_groups,
        varian_price: price,
        is_price_overridden: is_price_overridden ? is_price_overridden : "-",
        is_disabled: is_disabled ? is_disabled : false,
      });
    });

  const columns = [
    {
      title: "Name",
      dataIndex: "variant_name",
      key: "variant_name",
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
      title: "Variant Groups",
      dataIndex: "varian_group",
      key: "varian_group",
      render(text, record) {
        return {
          children: (
            <div
              style={{ color: "#008cba" }}
              onClick={() => setEditPrice(false)}
            >
              {text.map((value, index) => {
                return (
                  <>
                    {index > 0 ? (
                      <span>{value + " , "}</span>
                    ) : (
                      <span>{value}</span>
                    )}
                  </>
                );
              })}
            </div>
          ),
        };
      },
    },
    {
      title: "Price",
      dataIndex: "varian_price",
      key: "varian_price",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children:
            editPrice === record.id ? (
              <InputNumber
                defaultValue={text}
                onPressEnter={() => setEditPrice(false)}
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
      title: "Is price Overridden?",
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
          pageSize: 10,
          showSizeChanger: true,
          total: dataSource.length,
        }}
      />
    </div>
  );
});

export { VariantPrice };
