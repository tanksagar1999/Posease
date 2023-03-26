import React, { useState, useEffect, useRef } from "react";
import { Input, Menu, Dropdown, Button } from "antd";
import "../sell.css";
import { useDispatch } from "react-redux";
import { getItem } from "../../../utility/localStorageControl";
import "./GridView.css";
import { DownOutlined } from "@ant-design/icons";

const GridViewCurrent = (props) => {
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let {
    addToCart,
    productListOfdata,
    calculationQty,
    categoryList,
    topSellList,
    registerData,
    localCartInfo,
    allLocalData,
    searchText,
  } = props;

  let [productList, setProductList] = useState(
    productListOfdata ? productListOfdata : []
  );

  const [filterArray, setFilterArray] = useState([]);

  let [allCategoryList, setAllCategoryList] = useState(
    categoryList ? categoryList : []
  );
  const [currentCategory, setCurrentCategory] = useState(
    getItem("hideAllAndTop") ? categoryList[0]?.category_name : "All"
  );
  let [CategoryID, setCategoryId] = useState(
    getItem("hideAllAndTop") ? allLocalData.productCategory[0]._id : "All"
  );
  // const [searchText, setSearchText] = useState("");

  // //

  // const SearchHandle = (data) => {
  //   setSearchText(data);
  // };
  useEffect(() => {
    if (productList.length > 0) {
      console.log("productList", productList.length);
      const getSections = () => {
        if (productList.length === 0) {
          return [];
        }
        let filterdArray = productList.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        return Object.values(
          filterdArray.reduce((acc, word) => {
            let firstLetter = word.product_name[0].toLocaleUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = {
                title: firstLetter,
                data: [word],
              };
            } else {
              acc[firstLetter].data.push(word);
            }
            return acc;
          }, {})
        );
      };
      setFilterArray(getSections());
    }
  }, [productList]);

  const menu = (
    <Menu
      style={{
        height: "400px",
        overflowY: "scroll",
      }}
    >
      {getItem("hideAllAndTop") > 0 ? (
        ""
      ) : (
        <Menu.Item
          key="1"
          className="menu-item"
          onClick={() => {
            setCategoryId("All");
            setCurrentCategory("All");
          }}
        >
          All
        </Menu.Item>
      )}

      {allCategoryList.map((value, key) => {
        return (
          <>
            <Menu.Item
              key={key}
              className="menu-item"
              onClick={() => {
                setCategoryId(value._id);
                setCurrentCategory(value.category_name);
              }}
            >
              {value.category_name}
            </Menu.Item>
          </>
        );
      })}
    </Menu>
  );

  // new productList //
  const [productInclusive, setProductInclusive] = useState(true);
  const productObjectCreate = (product, index) => {
    let value = JSON.parse(JSON.stringify(product));
    let productShow = true;
    if (value && value._id) {
      if (value.priceBook?.length > 0) {
        let tabletype =
          localCartInfo && Object.keys(localCartInfo).length > 0
            ? localCartInfo.type == "delivery-local"
              ? "delivery"
              : localCartInfo.type == "custom-table-local"
              ? "dine_in"
              : localCartInfo.type == "take-away-local"
              ? "take_away"
              : "all_orders"
            : "all_orders";
        let pricebookDetails = value.priceBook.find((val) => {
          if (
            (val.orderType == tabletype || val.orderType == "all_orders") &&
            registerData._id == val.registerAssignedTo
          ) {
            return val;
          }
        });
        if (pricebookDetails) {
          value.price = pricebookDetails.priceBookPrice;

          if (pricebookDetails.disable) {
            productShow = false;
          }
        }
      }

      let orignalPrice = value.price;
      let totalTax = 0;
      value.price = Number(value.price.toFixed(2));
      let itemPrice = 0;
      if (value.option_status === "combo") {
        if (value.option_item_group.length > 0) {
          value.option_item_group.map((item) => {
            let minimumArray = [];

            item.products.map((value) => {
              let FilterVarints = item.product_variants.filter(
                (data) => data.product_id._id === value._id
              );
              if (FilterVarints.length > 0) {
                FilterVarints.map((variant) => {
                  minimumArray.push(
                    variant.product_id.price + variant.variant_id.price
                  );
                });
              } else {
                minimumArray.push(value.price);
              }
            });
            let itemMinPrice = Math.min.apply(Math, minimumArray);
            itemPrice += itemMinPrice;
          });
          value.newPrice = Number(value.price + itemPrice).toFixed(2);
        } else {
          value.newPrice = Number(value.price).toFixed(2);
        }
      } else {
        if (value.option_variant_group.length > 0) {
          let varintsPrice = 0;
          value.option_variant_group.map((varints) => {
            let minimumArray = [];

            varints.product_variants.map((variant) => {
              minimumArray.push(variant.price);
            });
            let variantMinPrice = Math.min.apply(Math, minimumArray);
            varintsPrice += variantMinPrice;
          });
          value.newPrice = Number(value.price + varintsPrice).toFixed(2);
        } else {
          value.newPrice = Number(value.price).toFixed(2);
        }
      }

      if (value.product_name.length > 30) {
        let divideArray = value.product_name.match(/.{1,30}/g);
        value.Newproduct_name = value.product_name.replace(
          divideArray[1],
          ".."
        );
      }

      value &&
        value.tax_group &&
        value.tax_group.taxes &&
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));

      if (value?.tax_group) {
        value.tax_group.Totaltax = totalTax;
      }

      if (
        value.tax_group !== null &&
        value.tax_group.taxes_inclusive_in_product_price
      ) {
        value.productInclusivePrice = Number(orignalPrice.toFixed(2));

        if (value?.option_variant_group?.length > 0) {
          value?.option_variant_group.map((val) => {
            val.product_variants.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price.toFixed(2));
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2).toFixed(2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value?.option_addon_group?.length > 0) {
          value?.option_addon_group.map((val) => {
            val.product_addons.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price.toFixed(2));
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2).toFixed(2);
                j.price = Number(price3);
              }
            });
          });
        }
        if (value.price === 0) {
          value.price = value.price;
        } else {
          let price1;
          if (totalTax === 0) {
            value.price = Number(value.price.toFixed(2));
          } else {
            let total2;
            let price2;
            let price3;
            price1 = value.price * totalTax;
            total2 = 100 + totalTax;
            price2 = price1 / total2;
            price3 = Number(value.price - price2).toFixed(2);
            value.price = Number(price3);
          }
        }
      }

      if (productShow) {
        return (
          <>
            <tr onClick={() => addToCart(value)}>
              <td>
                <a className="sp-product-name">
                  {value.Newproduct_name
                    ? value.Newproduct_name
                    : value.product_name}{" "}
                </a>
                <span className="text-muted">
                  {" "}
                  in {value.product_category.category_name}
                </span>
              </td>
              <td>
                {calculationQty(value._id)}
                {`${rsSymbol}${
                  value.productInclusivePrice
                    ? value.productInclusivePrice
                    : value.newPrice
                    ? value.newPrice
                    : value.price
                } `}
                {value.option_addon_group?.length > 0 ||
                value.option_item_group?.length > 0 ||
                value.option_variant_group?.length > 0 ? (
                  <div className="inlineDIv">
                    <div className="sp-price-plus">+</div>
                  </div>
                ) : (
                  ""
                )}
              </td>
            </tr>
          </>
        );
      }
    }
  };

  const didMount = useRef(false);
  let filterProductList = (product) => {
    return (
      product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
      (product.product_code !== undefined &&
        product.product_code.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  let filterCategoryId = (value) => {
    return value.product_category._id == CategoryID;
  };
  useEffect(() => {
    if (CategoryID != "") {
      if (CategoryID == "All") {
        setProductList(productListOfdata);
      } else if (CategoryID == "Top") {
        setProductList(topSellList);
      } else {
        setProductList(productListOfdata.filter(filterCategoryId));
      }
    } else {
      setProductList(productListOfdata);
    }
  }, [registerData._id, CategoryID, productListOfdata]);

  useEffect(() => {
    console.log("kkpkpk", productListOfdata.length);
    if (didMount.current) {
      if (searchText == "") {
        if (CategoryID == "All") {
          setProductList(productListOfdata);
        } else if (CategoryID == "Top") {
          setProductList(topSellList);
        } else {
          setProductList(productListOfdata.filter(filterCategoryId));
        }
      } else {
        setProductList(productListOfdata.filter(filterProductList));
      }
    } else {
      didMount.current = true;
    }
  }, [searchText]);

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{ marginLeft: 10 }}
        >
          {currentCategory}
          <DownOutlined />
        </Button>
      </Dropdown>
      {/* <Input
        placeholder="Search item (F7) Clear (Esc)"
        onChange={(e) => SearchHandle(e.target.value)}
        style={{ margin: 10 }}
      /> */}
      <div className="view-items">
        <ul>
          <li>view items</li>
        </ul>
      </div>
      <div className="item-list gridl_lstscrl">
        <div
          style={{
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          {filterArray.map((item) => {
            return (
              <>
                <div className="container">
                  <div className="table-srd">
                    <span className="title">{item.title}</span>
                    <table className="table">
                      <tbody>{item.data.map(productObjectCreate)}</tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default React.memo(GridViewCurrent);
