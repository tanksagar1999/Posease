import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Button } from "antd";
import FeatherIcon from "feather-icons-react";
import { getItem } from "../../../utility/localStorageControl";

const ProductShow = ({
  productListOfdata,
  setProductClassFromCategoryIndex,
  calQty,
  productDetails,
  searchText,
  CategoryID,
  topSellList,
  registerData,
  localCartInfo,
  windowWidth,
}) => {
  const [productInclusive, setProductInclusive] = useState(true);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
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
      value.price = Number(value.price);
      let itemPrice = 0;
      if (value.option_status === "combo") {
        value.newPrice = Number(value.price);
        // if (value.option_item_group.length > 0) {
        //   value.option_item_group.map((item) => {
        //     let minimumArray = [];
        //     item.products.map((value) => {
        //       let FilterVarints = item.product_variants.filter(
        //         (data) => data.product_id._id === value._id
        //       );
        //       if (FilterVarints.length > 0) {
        //         FilterVarints.map((variant) => {
        //           minimumArray.push(
        //             variant.product_id.price + variant.variant_id.price
        //           );
        //         });
        //       } else {
        //         minimumArray.push(value.price);
        //       }
        //     });
        //     let itemMinPrice = Math.min.apply(Math, minimumArray);
        //     itemPrice += itemMinPrice;
        //   });
        //   value.newPrice = Number(value.price + itemPrice);
        // } else {
        //   value.newPrice = Number(value.price);
        // }
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
          value.newPrice = Number(value.price + varintsPrice);
        } else {
          value.newPrice = Number(value.price);
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
        value.productInclusivePrice = Number(orignalPrice);

        if (value?.option_variant_group?.length > 0) {
          value?.option_variant_group.map((val) => {
            val.product_variants.map((j) => {
              j.productInclusivePrice = j.price;
              let price1;
              if (totalTax === 0) {
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
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
                j.price = Number(j.price);
              } else {
                let total2;
                let price2;
                let price3;
                price1 = j.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(j.price - price2);
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
            value.price = Number(value.price);
          } else {
            let total2;
            let price2;
            let price3;
            price1 = value.price * totalTax;
            total2 = 100 + totalTax;
            price2 = price1 / total2;
            price3 = Number(value.price - price2);
            value.price = Number(price3);
          }
        }
      }

      if (productShow) {
        return (
          <Col
            key={index}
            xs={12}
            xl={6}
            md={windowWidth <= 1110 ? 8 : 6}
            sm={8}
            className="sell-table-col"
            onClick={() => productDetails(value)}
          >
            <div
              className={
                "sell-main " +
                (value.product_category._id
                  ? setProductClassFromCategoryIndex(value.product_category._id)
                  : "")
              }
            >
              <div className="product-title">
                {value.Newproduct_name
                  ? value.Newproduct_name
                  : value.product_name}
              </div>
              <div className="product-price inlineDIv">
                {calQty(value._id)}

                {`${rsSymbol}${value.newPrice ? value.newPrice : value.price} `}
                {value.option_addon_group?.length > 0 ||
                value.option_item_group?.length > 0 ||
                value.option_variant_group?.length > 0 ? (
                  <div className="inlineDIv">
                    <div className="sp-price-plus">+</div>
                  </div>
                ) : (
                  ""
                )}
              </div>{" "}
            </div>
          </Col>
        );
      }
    }
  };

  let [productList, setProductList] = useState(
    productListOfdata ? productListOfdata : []
  );

  const [currentNumber, setCurrentNumber] = useState({
    left: 0,
    right: 32,
  });

  let filterCategoryId = (value) => {
    return value.product_category._id == CategoryID;
  };

  useEffect(() => {
    if (CategoryID != "" && searchText == "") {
      setCurrentNumber({
        left: 0,
        right: 32,
      });
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

  const rightClick = () => {
    setCurrentNumber({
      left: currentNumber.right,
      right: currentNumber.right + 32,
    });
  };

  const leftClick = () => {
    setCurrentNumber({
      left: currentNumber.left - 32,
      right: currentNumber.left,
    });
  };
  const regiterWiseFilterList = (val) => {
    if (val?.limit_to_register.length > 0) {
      if (val.limit_to_register.includes(registerData._id)) {
        return val;
      }
    } else {
      return val;
    }
  };
  return (
    <>
      <div className="shell_productScroll">
        <Row>
          {productList.length > 0 ? (
            productList
              .slice(currentNumber.left, currentNumber.right)
              .filter(regiterWiseFilterList)
              .map(productObjectCreate)
          ) : (
            <p>No Products</p>
          )}
        </Row>
        {currentNumber.left == 0 &&
        currentNumber.right > productList.length ? null : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Button
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50px",
              }}
              onClick={() => leftClick()}
              disabled={currentNumber.left == 0 ? true : false}
            >
              <FeatherIcon
                size={20}
                icon="chevron-left"
                style={{ position: "relative", left: "-10px", top: "1px" }}
              />
            </Button>
            <Button
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50px",
                marginLeft: "40px",
              }}
              onClick={() => rightClick()}
              disabled={currentNumber.right > productList.length ? true : false}
            >
              <FeatherIcon
                size={20}
                icon="chevron-right"
                style={{ position: "relative", left: "-10px", top: "1px" }}
              />
            </Button>
          </p>
        )}
      </div>
    </>
  );
};

export default React.memo(ProductShow);
