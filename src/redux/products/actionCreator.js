import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  productAdd,
  productAddErr,
  productList,
  productListErr,
  productDelete,
  productDeleteErr,
  product,
  productErr,
  productUpdate,
  productUpdateErr,
  productCategoryAdd,
  productCategoryAddErr,
  productCategoryList,
  productCategoryListErr,
  orderTicketGroupedAdd,
  orderTicketGroupedAddErr,
  orderTicketGroupedDelete,
  orderTicketGroupedDeleteErr,
  productCategoryDelete,
  productCategoryDeleteErr,
  orderTicketGroupedList,
  orderTicketGroupedListErr,
  orderTicketGrouped,
  orderTicketGroupedErr,
  productCategory,
  productCategoryErr,
  ProductImportPreview,
  ProductImportPreviewErr,
  ProductImportData,
  ProductImportDataErr,
  newItemSet,
  productTopSellList,
  productTopSellListErr,
} = actions;

const addProduct = (formData) => {
  return async (dispatch) => {
    try {
      let getAddedProduct = {};
      getAddedProduct = await DataService.post(
        API.products.addProduct,
        formData
      );
      if (!getAddedProduct.data.error) {
        return dispatch(productAdd(getAddedProduct.data));
      } else {
        return dispatch(productAddErr(getAddedProduct.data));
      }
    } catch (err) {
      dispatch(productAddErr(err));
    }
  };
};

const getAllProductList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("productList");
      if (allSetupcache && checksell == "sell") {
        return productList(allSetupcache, allSetupcache.length);
      } else {
        const getProductList = await DataService.get(
          `${API.products.getProducts}`
        );
        if (!getProductList.data.error) {
          setItem("productList", getProductList.data.data);

          return dispatch(
            productList(
              getProductList.data.data,
              getProductList.data.pagination.total_counts
            )
          );
        } else {
          return dispatch(productListErr(getProductList.data));
        }
      }
    } catch (err) {
      let localList = getItem("productList");
      if (localList != null && localList.length > 0) {
        return dispatch(productList(localList));
      } else {
        return dispatch(productListErr(err));
      }
    }
  };
};

const searchDataProductList = (Value) => {
  return async (dispatch) => {
    try {
      const getProductList = await DataService.post(
        API.products.searchProductList,
        Value
      );
      if (!getProductList.data.error) {
        return dispatch(
          productList(
            getProductList.data.data,
            getProductList.data.pagination.total_counts
          )
        );
      } else {
        return dispatch(productListErr(getProductList.data));
      }
    } catch (err) {
      dispatch(productListErr(err));
    }
  };
};

const getCategoryWiseAllProductList = (categoryId, registerId) => {
  return async (dispatch) => {
    try {
      let localList = {
        products: getItem("productList"),
      };
      let getProductList = [];
      if (localList != null && localList.products.length > 0) {
        getProductList = localList.products;
        if (categoryId) {
          let finalProductList = [];
          getProductList.filter((val) => {
            if (val.product_category._id == categoryId) {
              finalProductList.push(val);
            } else if (
              val.product_category._id == categoryId &&
              val.limit_to_register.length == 0
            ) {
              finalProductList.push(val);
            }
          });
          return dispatch(productList(finalProductList));
        } else {
          return dispatch(productList(getProductList));
        }
      }
    } catch (err) {
      let localList = getItem("productList");
      if (localList != null && localList.length > 0) {
        return dispatch(productList(localList));
      } else {
        return dispatch(productListErr(err));
      }
    }
  };
};

const getAllCategoriesList = (checksellCall) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache &&
        allSetupcache.productCategory != undefined &&
        allSetupcache.productCategory.length &&
        checksellCall == "sell"
      ) {
        if (allSetupcache.productCategory) {
          return dispatch(productCategoryList(allSetupcache.productCategory));
        }
      } else {
        const categoryList = await DataService.get(
          API.products.getCategoryList
        );
        if (!categoryList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.productCategory = categoryList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(productCategoryList(categoryList.data.data));
        } else {
          return dispatch(productCategoryListErr(categoryList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productCategory) {
        return dispatch(productCategoryList(allSetupcache.productCategory));
      } else {
        return dispatch(productCategoryListErr(err));
      }
    }
  };
};

const getAllOrderTicketGroupedList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache &&
        allSetupcache.orderTicketGroups &&
        checkSell == "sell"
      ) {
        return dispatch(
          orderTicketGroupedList(allSetupcache.orderTicketGroups)
        );
      } else {
        const orderTicketGroupList = await DataService.get(
          API.products.getAllOrderTicketGroupList
        );
        if (!orderTicketGroupList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.orderTicketGroups = orderTicketGroupList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(
            orderTicketGroupedList(orderTicketGroupList.data.data)
          );
        } else {
          return dispatch(orderTicketGroupedListErr(orderTicketGroupList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.orderTicketGroups) {
        return dispatch(
          orderTicketGroupedList(allSetupcache.orderTicketGroups)
        );
      } else {
        return dispatch(orderTicketGroupedListErr(err));
      }
    }
  };
};

const addOrUpdateProductCategory = (formData, product_category_id) => {
  return async (dispatch) => {
    try {
      let getAddedCategory = {};
      if (product_category_id) {
        getAddedCategory = await DataService.put(
          `${API.products.addProductCategory}` + "/" + `${product_category_id}`,
          formData
        );

        let getallSetUpcacheData = getItem("productList");
        if (getallSetUpcacheData?.length > 0) {
          getallSetUpcacheData.map((val) => {
            if (
              val &&
              val.product_category &&
              val.product_category._id == getAddedCategory.data.data._id
            ) {
              val.product_category.category_name =
                getAddedCategory.data.data.category_name;
            }
          });

          setItem("productList", getallSetUpcacheData);
        }
      } else {
        getAddedCategory = await DataService.post(
          API.products.addProductCategory,
          formData
        );
      }
      if (!getAddedCategory.data.error) {
        return dispatch(productCategoryAdd(getAddedCategory.data));
      } else {
        return dispatch(productCategoryAddErr(getAddedCategory.data));
      }
    } catch (err) {
      dispatch(productCategoryAddErr(err));
    }
  };
};

const deleteOrderTicketGrouped = (orderTicketGroupedIds) => {
  return async (dispatch) => {
    try {
      const getDeletedTicketGrouped = await DataService.post(
        API.products.deleteAllOrderTicketGrouped,
        orderTicketGroupedIds
      );
      if (!getDeletedTicketGrouped.data.error) {
        return dispatch(orderTicketGroupedDelete(getDeletedTicketGrouped.data));
      } else {
        return dispatch(
          orderTicketGroupedDeleteErr(getDeletedTicketGrouped.data)
        );
      }
    } catch (err) {
      dispatch(productCategoryAddErr(err));
    }
  };
};

const deleteProductCategory = (orderProductCategoryIds) => {
  return async (dispatch) => {
    try {
      const getDeletedProductCategory = await DataService.post(
        API.products.deleteAllProductCategory,
        orderProductCategoryIds
      );
      if (!getDeletedProductCategory.data.error) {
        return dispatch(productCategoryDelete(getDeletedProductCategory.data));
      } else {
        return dispatch(
          productCategoryDeleteErr(getDeletedProductCategory.data)
        );
      }
    } catch (err) {
      dispatch(productCategoryAddErr(err));
    }
  };
};

const deleteProduct = (orderProductIds) => {
  return async (dispatch) => {
    try {
      const getDeletedProduct = await DataService.post(
        API.products.deleteAllProduct,
        orderProductIds
      );
      if (!getDeletedProduct.data.error) {
        return dispatch(productDelete(getDeletedProduct.data));
      } else {
        return dispatch(productDeleteErr(getDeletedProduct.data));
      }
    } catch (err) {
      dispatch(productDeleteErr(err));
    }
  };
};

const addOrUpdateOrderTicketGroup = (formData, ticket_grouped_id) => {
  return async (dispatch) => {
    try {
      let getAddedOrderTicketGroup = {};
      if (ticket_grouped_id) {
        getAddedOrderTicketGroup = await DataService.put(
          `${API.products.addOrderTicketGroup}` + "/" + `${ticket_grouped_id}`,
          formData
        );
      } else {
        getAddedOrderTicketGroup = await DataService.post(
          API.products.addOrderTicketGroup,
          formData
        );
      }
      if (!getAddedOrderTicketGroup.data.error) {
        return dispatch(orderTicketGroupedAdd(getAddedOrderTicketGroup.data));
      } else {
        return dispatch(
          orderTicketGroupedAddErr(getAddedOrderTicketGroup.data)
        );
      }
    } catch (err) {
      dispatch(orderTicketGroupedAddErr(err));
    }
  };
};

const updateProductById = (formData, product_id) => {
  return async (dispatch) => {
    try {
      let getUpdatedProduct = {};
      getUpdatedProduct = await DataService.put(
        `${API.products.updateProducts}` + "/" + `${product_id}`,
        formData
      );
      if (!getUpdatedProduct.data.error) {
        return dispatch(productUpdate(getUpdatedProduct.data));
      } else {
        return dispatch(productUpdateErr(getUpdatedProduct.data));
      }
    } catch (err) {
      dispatch(productUpdateErr(err));
    }
  };
};

const getOrderTicketGroupedById = (grouped_id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let orderTiketsDetails;
      if (allSetupcache && allSetupcache.orderTicketGroups) {
        orderTiketsDetails = allSetupcache.orderTicketGroups.find(
          (k) => k._id == grouped_id
        );
      }
      if (orderTiketsDetails) {
        return dispatch(orderTicketGrouped(orderTiketsDetails));
      } else {
        const orderTicketGroupById = await DataService.get(
          `${API.products.getAllOrderTicketGroupList}` + "/" + `${grouped_id}`
        );
        if (!orderTicketGroupById.data.error) {
          return dispatch(orderTicketGrouped(orderTicketGroupById.data.data));
        } else {
          return dispatch(orderTicketGroupedErr(orderTicketGroupById.data));
        }
      }
    } catch (err) {
      dispatch(orderTicketGroupedErr(err));
    }
  };
};

const getProductCategoryById = (product_category_id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let productCategoryDetials;
      if (allSetupcache != null && allSetupcache.productCategory) {
        productCategoryDetials = allSetupcache.productCategory.find(
          (val) => val._id == product_category_id
        );
      }
      if (productCategoryDetials) {
        return dispatch(productCategory(productCategoryDetials));
      } else {
        const productCategoryById = await DataService.get(
          `${API.products.getCategoryList}` + "/" + `${product_category_id}`
        );
        if (!productCategoryById.data.error) {
          return dispatch(productCategory(productCategoryById.data.data));
        } else {
          return dispatch(productCategoryErr(productCategoryById.data));
        }
      }
    } catch (err) {
      dispatch(productCategoryErr(err));
    }
  };
};

const getProductById = (product_id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let allProductList = getItem("productList");
      let productDetails;

      if (allSetupcache && allProductList?.length) {
        productDetails = allProductList.find((val) => val._id == product_id);
        if (
          productDetails.option_item_group &&
          productDetails.option_item_group.length > 0
        ) {
          productDetails.option_item_group = productDetails.option_item_group.map(
            (val) => val._id
          );
        }
        if (
          productDetails.option_addon_group &&
          productDetails.option_addon_group.length > 0
        ) {
          productDetails.option_addon_group = productDetails.option_addon_group.map(
            (val) => val._id
          );
        }
        if (
          productDetails.option_variant_group &&
          productDetails.option_variant_group.length > 0
        ) {
          productDetails.option_variant_group = productDetails.option_variant_group.map(
            (val) => val._id
          );
        }
        if (productDetails.product_category) {
          productDetails.product_category = productDetails.product_category._id;
        }
        if (productDetails.tax_group) {
          productDetails.tax_group = productDetails.tax_group._id;
        }
        if (productDetails.register_id) {
          productDetails.register_id = productDetails.register_id._id;
        }
        productDetails.having_on_item_group = false;
        let combolist = { addon_groups: [], items_groups: [] };
        if (
          allSetupcache?.productAddonGroups &&
          allSetupcache.productAddonGroups.length > 0
        ) {
          combolist.addon_groups = allSetupcache.productAddonGroups;
        }
        if (allSetupcache?.itemGroups && allSetupcache.itemGroups.length > 0) {
          combolist.items_groups = allSetupcache.itemGroups;
        }
        productDetails.combo_list = combolist;
      }
      if (productDetails) {
        return dispatch(product(productDetails));
      } else {
        const productById = await DataService.get(
          `${API.products.getProducts}` + "/" + `${product_id}`
        );
        if (!productById.data.error) {
          return dispatch(product(productById.data.data));
        } else {
          return dispatch(productErr(productById.data));
        }
      }
    } catch (err) {
      dispatch(productErr(err));
    }
  };
};

const ImportProductInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getProduct = {};
      getProduct = await DataService.post(
        API.products.importProductGroup,
        payloads
      );
      if (!getProduct.data.error) {
        return dispatch(ProductImportPreview(getProduct.data));
      } else {
        return dispatch(ProductImportPreviewErr(getProduct.data));
      }
    } catch (err) {
      dispatch(ProductImportPreviewErr(err));
    }
  };
};

const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.products.importPreview, payloads);
      if (!getPreview.data.error) {
        return dispatch(ProductImportData(getPreview.data));
      } else {
        return dispatch(ProductImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(ProductImportDataErr(err));
    }
  };
};
const ExportProduct = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.products.exportProduct, payloads);
    return resp.data
  };
};
const newItemAvailable = (value) => {
  return async (dispatch) => {
    return dispatch(newItemSet(value));
  };
};

const getTopSellList = (value) => {
  return async (dispatch) => {
    try {
      const topList = await DataService.get(API.products.topSell);

      if (!topList.data.error) {
        return dispatch(productTopSellList(topList.data.data));
      } else {
        return dispatch(productTopSellListErr(topList.data));
      }
    } catch (err) {
      dispatch(productTopSellListErr(err));
    }
  };
};

export {
  addProduct,
  getAllProductList,
  deleteProduct,
  getProductById,
  updateProductById,
  getAllCategoriesList,
  addOrUpdateProductCategory,
  deleteOrderTicketGrouped,
  deleteProductCategory,
  getAllOrderTicketGroupedList,
  addOrUpdateOrderTicketGroup,
  getOrderTicketGroupedById,
  getProductCategoryById,
  ImportProductInBulk,
  ConfirmImport,
  getCategoryWiseAllProductList,
  ExportProduct,
  searchDataProductList,
  newItemAvailable,
  getTopSellList,
};
