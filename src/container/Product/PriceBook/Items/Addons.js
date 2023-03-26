import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  NavLink,
  useRouteMatch,
  useLocation,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Checkbox, InputNumber } from "antd";
import "../../product.css";
import { getAllPricebookAddonList } from "../../../../redux/pricebook/actionCreator";

const AddonPrice = forwardRef((props, ref) => {
  let { passFun } = props;
  const dispatch = useDispatch();
  const [AddonsListData, setAddonsListData] = useState([]);
  let isMounted = useRef(true);
  const [editPrice, setEditPrice] = useState(false);
  let [editItemList, setEditItemList] = useState([]);
  const location = useLocation();
  const queryParams = useParams();

  useEffect(() => {
    async function fetchAddonsList() {
      const getAddonsList = await dispatch(
        getAllPricebookAddonList(queryParams.pricebook_id)
      );
      if (
        isMounted.current &&
        getAddonsList &&
        getAddonsList.PricebookAddonList
      )
        setAddonsListData(getAddonsList.PricebookAddonList);
    }
    if (isMounted.current) {
      fetchAddonsList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: "",
  });

  useImperativeHandle(ref, () => ({
    async Addonslist() {
      const getAddonsList = await dispatch(
        getAllPricebookAddonList(queryParams.pricebook_id)
      );
      if (getAddonsList && getAddonsList.PricebookAddonList)
        setAddonsListData(getAddonsList.PricebookAddonList);
    },
  }));

  const { selectedRowKeys, item } = state;

  passFun(editItemList);

  useEffect(() => {
    if (AddonsListData) {
      setState({
        item: AddonsListData,
        selectedRowKeys,
      });
    }
  }, [AddonsListData, selectedRowKeys]);
  function pushToArray(editItemList, obj) {
    const index = editItemList.findIndex((e) => e.addon_id === obj.addon_id);
    if (index === -1) {
      setEditItemList([...editItemList, obj]);
    } else {
      editItemList[index].addon_id = obj.addon_id;
      obj.price && (editItemList[index].price = obj.price);
      obj.disable && (editItemList[index].disable = obj.disable);
    }
  }

  function onChange(value, editPrice) {
    const findIndex = item.findIndex((product) => product._id === editPrice);
    pushToArray(editItemList, { addon_id: editPrice, price: value });
    item[findIndex].price = value;
  }

  function checkboxChange(e, id) {
    const findIndex = item.findIndex((product) => product._id === id);
    pushToArray(editItemList, { addon_id: id, disable: e.target.checked });
    item[findIndex].disabled = e.target.checked;
  }
  const dataSource = [];

  if (AddonsListData.length)
    item.map((value) => {
      const {
        _id,
        addon_name,
        addon_groups,
        price,
        is_disabled,
        is_price_overridden,
      } = value;

      return dataSource.push({
        id: _id,
        addon_name: addon_name,
        is_disabled: is_disabled,
        addon_group: addon_groups,
        addon_price: price,
        is_price_overridden: is_price_overridden ? is_price_overridden : "-",
      });
    });

  const columns = [
    {
      title: "Addon Name",
      dataIndex: "addon_name",
      key: "addon_name",
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
      title: "Addon Groups",
      dataIndex: "addon_group",
      key: "addon_group",
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
                      <span>{value + " ,"}</span>
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
      title: "Addon Price",
      dataIndex: "addon_price",
      key: "addon_price",
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
          pageSize: 10,
          showSizeChanger: true,
          total: dataSource.length,
        }}
      />
    </div>
  );
});

export { AddonPrice };
