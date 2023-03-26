import React, { useState, useRef, useEffect } from "react";
import "./productEditModal.css";
import { Modal, Button, Form, Input, Radio, Checkbox } from "antd";
import { getItem } from "../../../utility/localStorageControl";

const ProductDetailModal = (props, ref) => {
  let {
    productDetailsUpdate,
    removeSelectedItems,
    saveFromEditModal,
    SetProductList,
    setadddiscountFlag,
    setEditProductModalVisible,
    editProductModalVisible,
  } = props;
  const exampleInput = useRef();
  const [form2] = Form.useForm();
  const [quantity, setQuantity] = useState(0);
  const [checkedVariant1, setCheckedVariant1] = useState(false);
  const [checkedVariant2, setCheckedVariant2] = useState(false);
  const [checkedVariant3, setCheckedVariant3] = useState(false);
  const [checkedVariant4, setCheckedVariant4] = useState(false);
  const [checkedVariant5, setCheckedVariant5] = useState(false);
  const [addonsChanges, setAddonsChanges] = useState(false);
  let [discountData, setDiscountData] = useState(0);
  const [rsSymbol, setRsSymbol] = useState(
    getItem("setupCache")?.shopDetails?.rs_symbol
      ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)
          ?.length > 0
        ? /\(([^)]+)\)/.exec(getItem("setupCache").shopDetails.rs_symbol)[1]
        : getItem("setupCache").shopDetails.rs_symbol
      : "₹"
  );
  let [discountType, setDiscountType] = useState("cash");
  const [checkedItem1, setCheckedItem1] = useState(false);
  const [checkedItem2, setCheckedItem2] = useState(false);
  const [checkedItem3, setCheckedItem3] = useState(false);
  const [checkedItem4, setCheckedItem4] = useState(false);
  const [checkedItem5, setCheckedItem5] = useState(false);
  useEffect(() => {
    if (productDetailsUpdate.discountData) {
      productDetailsUpdate.discountType == "cash"
        ? setDiscountData(productDetailsUpdate.customDiscountedValue)
        : setDiscountData(productDetailsUpdate.discountData);

      setDiscountType(productDetailsUpdate.discountType);
    } else {
      setDiscountData(0);
      setDiscountType("cash");
    }
  }, [productDetailsUpdate]);

  const discountRef = useRef();
  useEffect(() => {
    if (exampleInput.current) {
      exampleInput.current.focus();
    }
    if (discountRef.current) {
      discountRef.current.focus();
    }
  }, [discountData]);

  useEffect(() => {
    // form.resetFields();
    if (editProductModalVisible) {
      if (
        productDetailsUpdate.isVarience == false &&
        productDetailsUpdate.option_item_group[0] != undefined
      ) {
        productDetailsUpdate.option_item_group[0].products.map((item) => {
          if (item.isSelected) {
            setCheckedItem1(item._id);
          }
          productDetailsUpdate.option_item_group[0].product_variants.map(
            (item) => {
              if (item.isSelected) {
                setCheckedItem1(item.variant_id._id);
              }
            }
          );
        });
      }
      if (
        productDetailsUpdate.isVarience == false &&
        productDetailsUpdate.option_item_group[1] != undefined
      ) {
        productDetailsUpdate.option_item_group[1].products.map((item) => {
          if (item.isSelected) {
            setCheckedItem2(item._id);
          }
          productDetailsUpdate.option_item_group[1].product_variants.map(
            (item) => {
              if (item.isSelected) {
                setCheckedItem2(item.variant_id._id);
              }
            }
          );
        });
      }
      if (
        productDetailsUpdate.isVarience == false &&
        productDetailsUpdate.option_item_group[2] != undefined
      ) {
        productDetailsUpdate.option_item_group[2].products.map((item) => {
          if (item.isSelected) {
            setCheckedItem3(item._id);
          }
          productDetailsUpdate.option_item_group[2].product_variants.map(
            (item) => {
              if (item.isSelected) {
                setCheckedItem3(item.variant_id._id);
              }
            }
          );
        });
      }
      if (
        productDetailsUpdate.isVarience == false &&
        productDetailsUpdate.option_item_group[3] != undefined
      ) {
        productDetailsUpdate.option_item_group[3].products.map((item) => {
          if (item.isSelected) {
            setCheckedItem4(item._id);
          }
          productDetailsUpdate.option_item_group[3].product_variants.map(
            (item) => {
              if (item.isSelected) {
                setCheckedItem4(item.variant_id._id);
              }
            }
          );
        });
      }
      if (
        productDetailsUpdate.isVarience == false &&
        productDetailsUpdate.option_item_group[4] != undefined
      ) {
        productDetailsUpdate.option_item_group[4].products.map((item) => {
          if (item.isSelected) {
            setCheckedItem5(item._id);
          }
          productDetailsUpdate.option_item_group[4].product_variants.map(
            (item) => {
              if (item.isSelected) {
                setCheckedItem5(item.variant_id._id);
              }
            }
          );
        });
      }
    }
    setCheckedVariant1(false);
    setCheckedVariant2(false);
    setCheckedVariant3(false);
    setCheckedVariant4(false);
  }, [editProductModalVisible]);

  var variant_id;
  var variant_id1;
  var variant_id2;
  var variant_id3;
  var variant_id4;

  let addon_ids = [];
  let addon_ids1 = [];
  let addon_ids2 = [];
  let addon_ids3 = [];
  let addon_ids4 = [];

  function setProductItem1(e) {
    const id = e.target.value.split(" ");
    setCheckedItem1(id[0]);

    if (id[1] === "product") {
      productDetailsUpdate.option_item_group[0].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetailsUpdate.option_item_group[0].products[
            index
          ].isSelected = true;
          productDetailsUpdate.option_item_group[0].selecet = "product";
        }
      });
    } else {
      productDetailsUpdate.option_item_group[0].product_variants.forEach(
        function(item, index) {
          if (item.variant_id._id == id[0]) {
            productDetailsUpdate.option_item_group[0].product_variants[
              index
            ].isSelected = true;
            productDetailsUpdate.option_item_group[0].selecet = "variant";
          }
        }
      );
    }

    setProductKeyAndCalculateTotalAndDisplayName(
      productDetailsUpdate,
      productDetailsUpdate.option_item_group
    );
  }

  function setProductItem2(e) {
    const id = e.target.value.split(" ");
    setCheckedItem2(id[0]);

    if (id[1] === "product") {
      productDetailsUpdate.option_item_group[1].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetailsUpdate.option_item_group[1].products[
            index
          ].isSelected = true;
          productDetailsUpdate.option_item_group[1].selecet = "product";
        }
      });
    } else {
      productDetailsUpdate.option_item_group[1].product_variants.forEach(
        function(item, index) {
          if (item.variant_id._id == id[0]) {
            productDetailsUpdate.option_item_group[1].product_variants[
              index
            ].isSelected = true;
            productDetailsUpdate.option_item_group[1].selecet = "variant";
          } else {
            productDetailsUpdate.option_item_group[1].product_variants[
              index
            ].isSelected = false;
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductItem3(e) {
    const id = e.target.value.split(" ");
    setCheckedItem3(id[0]);
    if (id[1] === "product") {
      productDetailsUpdate.option_item_group[2].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetailsUpdate.option_item_group[2].products[
            index
          ].isSelected = true;
          productDetailsUpdate.option_item_group[2].selecet = "product";
        }
      });
    } else {
      productDetailsUpdate.option_item_group[2].product_variants.forEach(
        function(item, index) {
          if (item.variant_id._id == id[0]) {
            productDetailsUpdate.option_item_group[2].product_variants[
              index
            ].isSelected = true;
            productDetailsUpdate.option_item_group[2].selecet = "variant";
          } else {
            productDetailsUpdate.option_item_group[2].product_variants[
              index
            ].isSelected = false;
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductItem4(e) {
    const id = e.target.value.split(" ");
    setCheckedItem4(id[0]);
    if (id[1] === "product") {
      productDetailsUpdate.option_item_group[3].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetailsUpdate.option_item_group[3].products[
            index
          ].isSelected = true;
          productDetailsUpdate.option_item_group[3].selecet = "product";
        }
      });
    } else {
      productDetailsUpdate.option_item_group[3].product_variants.forEach(
        function(item, index) {
          if (item.variant_id._id == id[0]) {
            productDetailsUpdate.option_item_group[3].product_variants[
              index
            ].isSelected = true;
            productDetailsUpdate.option_item_group[3].selecet = "variant";
          } else {
            productDetailsUpdate.option_item_group[3].product_variants[
              index
            ].isSelected = false;
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductItem5(e) {
    const id = e.target.value.split(" ");
    setCheckedItem5(id[0]);
    if (id[1] === "product") {
      productDetailsUpdate.option_item_group[4].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetailsUpdate.option_item_group[4].products[
            index
          ].isSelected = true;
          productDetailsUpdate.option_item_group[4].selecet = "product";
        }
      });
    } else {
      productDetailsUpdate.option_item_group[4].product_variants.forEach(
        function(item, index) {
          if (item.variant_id._id == id[0]) {
            productDetailsUpdate.option_item_group[4].product_variants[
              index
            ].isSelected = true;
            productDetailsUpdate.option_item_group[4].selecet = "variant";
          } else {
            productDetailsUpdate.option_item_group[4].product_variants[
              index
            ].isSelected = false;
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  if (
    productDetailsUpdate.isVarience &&
    productDetailsUpdate.option_variant_group[0] !== undefined
  ) {
    productDetailsUpdate.isVarience &&
      productDetailsUpdate.option_variant_group[0].product_variants.map(
        (item, index) => {
          if (item.isSelected == true) {
            variant_id = item?._id;
          }
        }
      );
  }
  if (
    productDetailsUpdate.isAddon1st &&
    productDetailsUpdate.option_addon_group[0] !== undefined
  ) {
    productDetailsUpdate.isAddon1st &&
      productDetailsUpdate.option_addon_group[0].product_addons.map(
        (item, index) => {
          if (item.isSelected == true) {
            addon_ids.push(item._id);
          }
        }
      );
  }

  if (
    productDetailsUpdate.isAddon2nd &&
    productDetailsUpdate.option_addon_group[1] !== undefined
  ) {
    productDetailsUpdate.isAddon2nd &&
      productDetailsUpdate.option_addon_group[1].product_addons.map(
        (item, index) => {
          if (item.isSelected) {
            addon_ids1.push(item._id);
          }
        }
      );
  }

  if (
    productDetailsUpdate.isAddon3rd &&
    productDetailsUpdate.option_addon_group[2] !== undefined
  ) {
    productDetailsUpdate.isAddon3rd &&
      productDetailsUpdate.option_addon_group[2].product_addons.map(
        (item, index) => {
          if (item.isSelected) {
            addon_ids2.push(item._id);
          }
        }
      );
  }
  if (
    productDetailsUpdate.option_addon_group &&
    productDetailsUpdate.option_addon_group[3] !== undefined
  ) {
    productDetailsUpdate.option_addon_group[3] &&
      productDetailsUpdate.option_addon_group[3].product_addons.map(
        (item, index) => {
          if (item.isSelected) {
            addon_ids3.push(item._id);
          }
        }
      );
  }

  if (
    productDetailsUpdate.option_addon_group &&
    productDetailsUpdate.option_addon_group[4] !== undefined
  ) {
    productDetailsUpdate.option_addon_group[4] &&
      productDetailsUpdate.option_addon_group[4].product_addons.map(
        (item, index) => {
          if (item.isSelected) {
            addon_ids4.push(item._id);
          }
        }
      );
  }

  if (
    productDetailsUpdate.isVarience &&
    productDetailsUpdate.option_variant_group[1] !== undefined
  ) {
    productDetailsUpdate.isVarience &&
      productDetailsUpdate.option_variant_group[1].product_variants.map(
        (item, index) => {
          if (item.isSelected == true) {
            variant_id1 = item._id;
          }
        }
      );
  }

  if (
    productDetailsUpdate.isVarience &&
    productDetailsUpdate.option_variant_group[2] !== undefined
  ) {
    productDetailsUpdate.isVarience &&
      productDetailsUpdate.option_variant_group[2].product_variants.map(
        (item, index) => {
          if (item.isSelected == true) {
            variant_id2 = item._id;
          }
        }
      );
  }

  if (
    productDetailsUpdate.isVarience &&
    productDetailsUpdate.option_variant_group[3] !== undefined
  ) {
    productDetailsUpdate.isVarience &&
      productDetailsUpdate.option_variant_group[3].product_variants.map(
        (item, index) => {
          if (item.isSelected == true) {
            variant_id3 = item._id;
          }
        }
      );
  }

  if (
    productDetailsUpdate.isVarience &&
    productDetailsUpdate.option_variant_group[4] !== undefined
  ) {
    productDetailsUpdate.isVarience &&
      productDetailsUpdate.option_variant_group[4].product_variants.map(
        (item, index) => {
          if (item.isSelected == true) {
            variant_id4 = item._id;
          }
        }
      );
  }

  productDetailsUpdate &&
    form2.setFieldsValue({
      quantity: productDetailsUpdate.quantity
        ? productDetailsUpdate.quantity
        : "",
    });

  const showModal = () => {
    setEditProductModalVisible(true);
  };

  const handleOk = () => {
    setEditProductModalVisible(false);
    // form2.resetFields();
  };

  const handleCancel = () => {
    SetProductList(getItem("product_Details"));
    setCheckedItem1(false);
    setCheckedItem2(false);
    setCheckedItem3(false);
    setCheckedItem4(false);
    setCheckedItem5(false);
    setEditProductModalVisible(false);
    form2.resetFields();
  };

  const onChangeDiscoynttype = (e) => {
    setDiscountType(e.target.value);
  };

  const onSubmit = (formData) => {
    setEditProductModalVisible(false);
    var discountDataPrice;
    if (Number(discountData)) {
      setadddiscountFlag(true);
      discountDataPrice = +Number(discountData);
    }
    productDetailsUpdate.discountType = discountType;
    productDetailsUpdate.discountData = Number(discountData);
    if (discountType === "cash") {
      productDetailsUpdate.customDiscountedValue = Number(discountData);
    } else if (discountType === "percentage") {
      productDetailsUpdate.customDiscountedValue = (
        (productDetailsUpdate?.calculatedprice / 100) *
        Number(discountData)
      ).toFixed(2);
    } else {
      if (productDetailsUpdate.isVarience) {
        productDetailsUpdate.customDiscountedValue =
          productDetailsUpdate?.key_price * Number(discountData);
      } else {
        productDetailsUpdate.customDiscountedValue =
          productDetailsUpdate?.price * Number(discountData);
      }
    }

    saveFromEditModal(formData, productDetailsUpdate, null);
  };

  function addOneQuantityInDetails(ops) {
    if (ops === "ADD") {
      productDetailsUpdate.quantity += 1;
    } else {
      productDetailsUpdate.quantity -= 1;

      if (productDetailsUpdate.quantity < 1) {
        productDetailsUpdate.quantity = 1;
      }
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
    setQuantity(productDetailsUpdate.quantity);
  }

  function setProductVarience(e) {
    const filteredObject = productDetailsUpdate.option_variant_group[0].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetailsUpdate.variance_price = filteredObject.price;

    productDetailsUpdate.option_variant_group[0].product_variants.forEach(
      function(item, index) {
        if (item._id == e.target.value) {
          productDetailsUpdate.option_variant_group[0].product_variants[
            index
          ].isSelected = true;
        } else {
          productDetailsUpdate.option_variant_group[0].product_variants[
            index
          ].isSelected = false;
        }
      }
    );

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductVarience1(e) {
    const filteredObject = productDetailsUpdate.option_variant_group[1].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetailsUpdate.variance_price = filteredObject.price;

    //productDetailsUpdate.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetailsUpdate.option_variant_group[1].product_variants.forEach(
      function(item, index) {
        if (item._id == e.target.value) {
          productDetailsUpdate.option_variant_group[1].product_variants[
            index
          ].isSelected = true;
        } else {
          productDetailsUpdate.option_variant_group[1].product_variants[
            index
          ].isSelected = false;
        }
      }
    );

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductVarience2(e) {
    const filteredObject = productDetailsUpdate.option_variant_group[2].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetailsUpdate.variance_price = filteredObject.price;

    //productDetailsUpdate.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetailsUpdate.option_variant_group[2].product_variants.forEach(
      function(item, index) {
        if (item._id == e.target.value) {
          productDetailsUpdate.option_variant_group[2].product_variants[
            index
          ].isSelected = true;
        } else {
          productDetailsUpdate.option_variant_group[2].product_variants[
            index
          ].isSelected = false;
        }
      }
    );

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductVarience3(e) {
    const filteredObject = productDetailsUpdate.option_variant_group[3].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetailsUpdate.variance_price = filteredObject.price;

    //productDetailsUpdate.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetailsUpdate.option_variant_group[3].product_variants.forEach(
      function(item, index) {
        if (item._id == e.target.value) {
          productDetailsUpdate.option_variant_group[3].product_variants[
            index
          ].isSelected = true;
        } else {
          productDetailsUpdate.option_variant_group[3].product_variants[
            index
          ].isSelected = false;
        }
      }
    );

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductVarience4(e) {
    const filteredObject = productDetailsUpdate.option_variant_group[4].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetailsUpdate.variance_price = filteredObject.price;

    //productDetailsUpdate.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetailsUpdate.option_variant_group[4].product_variants.forEach(
      function(item, index) {
        if (item._id == e.target.value) {
          productDetailsUpdate.option_variant_group[4].product_variants[
            index
          ].isSelected = true;
        } else {
          productDetailsUpdate.option_variant_group[4].product_variants[
            index
          ].isSelected = false;
        }
      }
    );

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }
  function setProductKeyAndCalculateTotalAndDisplayName(productDetails) {
    let keyNames = [productDetails.item];
    let KeyIds = [productDetails.id];

    let selecetdItem1 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[0] != undefined) {
        if (productDetails.option_item_group[0].selecet == "product") {
          selecetdItem1 = productDetails.option_item_group[0].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem1 = productDetails.option_item_group[0].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem2 = [];

    if (productDetails.option_item_group !== undefined) {
      if (productDetails.option_item_group[1] !== undefined) {
        if (productDetails.option_item_group[1].selecet == "product") {
          selecetdItem2 = productDetails.option_item_group[1].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem2 = productDetails.option_item_group[1].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem3 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[2] != undefined) {
        if (productDetails.option_item_group[2].selecet == "product") {
          selecetdItem3 = productDetails.option_item_group[2].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem3 = productDetails.option_item_group[2].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem4 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[3] != undefined) {
        if (productDetails.option_item_group[3].selecet == "product") {
          selecetdItem4 = productDetails.option_item_group[3].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem4 = productDetails.option_item_group[3].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem5 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[4] != undefined) {
        if (productDetails.option_item_group[4].selecet == "product") {
          selecetdItem5 = productDetails.option_item_group[4].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem5 = productDetails.option_item_group[4].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selectedVarient = [];
    if (productDetails.option_variant_group[0] !== undefined) {
      selectedVarient = productDetails.option_variant_group[0].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient1 = [];

    if (productDetails.option_variant_group[1] !== undefined) {
      selectedVarient1 = productDetails.option_variant_group[1].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient2 = [];

    if (productDetails.option_variant_group[2] !== undefined) {
      selectedVarient2 = productDetails.option_variant_group[2].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient3 = [];

    if (productDetails.option_variant_group[3] !== undefined) {
      selectedVarient3 = productDetails.option_variant_group[3].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient4 = [];
    if (productDetails.option_variant_group[4] !== undefined) {
      selectedVarient4 = productDetails.option_variant_group[4].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    // step 2 set final price in case of product is varient or not
    if (selectedVarient.length > 0) {
      productDetails.key_price =
        productDetails.price + selectedVarient[0].price;

      if (
        productDetails.productInclusivePrice != undefined &&
        selectedVarient[0].productInclusivePrice != undefined
      ) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice +
          selectedVarient[0].productInclusivePrice;
      }

      selectedVarient.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    } else {
      productDetails.key_price = productDetails.price;
      if (productDetails.productInclusivePrice != undefined) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice;
      }
    }
    // step 2.1
    if (selectedVarient1.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient1[0].price;
      if (
        productDetails.productInclusivePrice != undefined &&
        selectedVarient1[0].productInclusivePrice != undefined
      ) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice +
          selectedVarient1[0].productInclusivePrice;
      }
      selectedVarient1.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 2.2
    if (selectedVarient2.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient2[0].price;
      if (
        productDetails.productInclusivePrice != undefined &&
        selectedVarient2[0].productInclusivePrice != undefined
      ) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice +
          selectedVarient2[0].productInclusivePrice;
      }
      selectedVarient2.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 2.3
    if (selectedVarient3.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient3[0].price;
      if (
        productDetails.productInclusivePrice != undefined &&
        selectedVarient3[0].productInclusivePrice != undefined
      ) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice +
          selectedVarient3[0].productInclusivePrice;
      }
      selectedVarient3.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }
    // step 2.4
    if (selectedVarient4.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient4[0].price;
      if (
        productDetails.productInclusivePrice != undefined &&
        selectedVarient4[0].productInclusivePrice != undefined
      ) {
        productDetails.productInclusivePriceKeyPrice =
          productDetails.productInclusivePrice +
          selectedVarient4[0].productInclusivePrice;
      }
      selectedVarient4.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 3.1 item
    if (selecetdItem1.length > 0) {
      // if (selecetdItem1[0].variant_id) {
      //   productDetails.key_price =
      //     productDetails.key_price +
      //     selecetdItem1[0].product_id.price +
      //     selecetdItem1[0].variant_id.price;
      // } else {
      //   productDetails.key_price =
      //     productDetails.key_price + selecetdItem1[0].price;
      // }

      // productDetails.key_price =
      //   productDetails.key_price + productDetails.price;
      selecetdItem1.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }
    if (selecetdItem2.length > 0) {
      // if (selecetdItem2[0].variant_id) {
      //   productDetails.key_price =
      //     productDetails.key_price +
      //     selecetdItem2[0].product_id.price +
      //     selecetdItem2[0].variant_id.price;
      // } else {
      //   productDetails.key_price =
      //     productDetails.key_price + selecetdItem2[0].price;
      // }
      // productDetails.key_price =
      //   productDetails.key_price + productDetails.price;
      selecetdItem2.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem3.length > 0) {
      // if (selecetdItem3[0].variant_id) {
      //   productDetails.key_price =
      //     productDetails.key_price +
      //     selecetdItem3[0].product_id.price +
      //     selecetdItem3[0].variant_id.price;
      // } else {
      //   productDetails.key_price =
      //     productDetails.key_price + selecetdItem3[0].price;
      // }
      selecetdItem3.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem4.length > 0) {
      // if (selecetdItem4[0].variant_id) {
      //   productDetails.key_price =
      //     productDetails.key_price +
      //     selecetdItem4[0].product_id.price +
      //     selecetdItem4[0].variant_id.price;
      // } else {
      //   productDetails.key_price =
      //     productDetails.key_price + selecetdItem4[0].price;
      // }
      selecetdItem4.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` / ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem5.length > 0) {
      // if (selecetdItem5[0].variant_id) {
      //   productDetails.key_price =
      //     productDetails.key_price +
      //     selecetdItem5[0].product_id.price +
      //     selecetdItem5[0].variant_id.price;
      // } else {
      //   productDetails.key_price =
      //     productDetails.key_price + selecetdItem5[0].price;
      // }
      selecetdItem5.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[0] !== undefined
    ) {
      productDetails.option_addon_group[0].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          if (productDetails.productInclusivePrice != undefined) {
            productDetails.productInclusivePriceKeyPrice =
              productDetails.productInclusivePriceKeyPrice +
              item.productInclusivePrice;
          }
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[1] !== undefined
    ) {
      productDetails.option_addon_group[1].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          if (productDetails.productInclusivePrice != undefined) {
            productDetails.productInclusivePriceKeyPrice =
              productDetails.productInclusivePriceKeyPrice +
              item.productInclusivePrice;
          }
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }
    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[2] !== undefined
    ) {
      productDetails.option_addon_group[2].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          if (productDetails.productInclusivePrice != undefined) {
            productDetails.productInclusivePriceKeyPrice =
              productDetails.productInclusivePriceKeyPrice +
              item.productInclusivePrice;
          }
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[3] !== undefined
    ) {
      productDetails.option_addon_group[3].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          if (productDetails.productInclusivePrice != undefined) {
            productDetails.productInclusivePriceKeyPrice =
              productDetails.productInclusivePriceKeyPrice +
              item.productInclusivePrice;
          }
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }
    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[4] !== undefined
    ) {
      productDetails.option_addon_group[4].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          if (productDetails.productInclusivePrice != undefined) {
            productDetails.productInclusivePriceKeyPrice =
              productDetails.productInclusivePriceKeyPrice +
              item.productInclusivePrice;
          }
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }

    productDetails.calculatedprice =
      productDetails.quantity * productDetails.key_price;

    if (productDetails.productInclusivePrice != undefined) {
      productDetails.productInclusivePricecalculatedprice =
        productDetails.quantity * productDetails.productInclusivePriceKeyPrice;
    }
    productDetails.display_name = keyNames;
    productDetails.key = KeyIds.join("-");
    return productDetails;
  }

  function setProductAddons(e) {
    if (
      productDetailsUpdate.option_addon_group &&
      productDetailsUpdate.option_addon_group[0] !== undefined
    ) {
      productDetailsUpdate.option_addon_group[0].product_addons.forEach(
        function(item, index) {
          if (item._id == e.target.value) {
            item.isSelected = e.target.checked;
            setAddonsChanges(!addonsChanges);
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductAddons1(e) {
    let AddonOptions = productDetailsUpdate.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetailsUpdate.option_addon_group &&
      productDetailsUpdate.option_addon_group[1] !== undefined
    ) {
      productDetailsUpdate.option_addon_group[1].product_addons.forEach(
        function(item, index) {
          if (item._id == e.target.value) {
            item.isSelected = e.target.checked;
            setAddonsChanges(!addonsChanges);
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductAddons2(e) {
    let AddonOptions = productDetailsUpdate.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetailsUpdate.option_addon_group &&
      productDetailsUpdate.option_addon_group[2] !== undefined
    ) {
      productDetailsUpdate.option_addon_group[2].product_addons.forEach(
        function(item, index) {
          if (item._id == e.target.value) {
            item.isSelected = e.target.checked;
            setAddonsChanges(!addonsChanges);
          }
        }
      );
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductAddons3(e) {
    let AddonOptions = productDetailsUpdate.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetailsUpdate.option_addon_group &&
      productDetailsUpdate.option_addon_group[3] !== undefined
    ) {
      productDetailsUpdate.option_addon_group[3].product_addons.forEach(
        function(item, index) {
          if (item._id == e.target.value) {
            item.isSelected = e.target.checked;
            setAddonsChanges(!addonsChanges);
          }
        }
      );
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  function setProductAddons4(e) {
    let AddonOptions = productDetailsUpdate.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetailsUpdate.option_addon_group &&
      productDetailsUpdate.option_addon_group[4] !== undefined
    ) {
      productDetailsUpdate.option_addon_group[4].product_addons.forEach(
        function(item, index) {
          if (item._id == e.target.value) {
            item.isSelected = e.target.checked;
            setAddonsChanges(!addonsChanges);
          }
        }
      );
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  }

  const getChangedQuantity = (event) => {
    productDetailsUpdate.quantity = Number(event.target.value);
    setQuantity(productDetailsUpdate.quantity);
    setProductKeyAndCalculateTotalAndDisplayName(productDetailsUpdate);
  };

  // discount reules
  const handleChangeDiscountData = (e, productDetailUpdate) => {
    if (discountType == "cash") {
      if (e.target.value > productDetailUpdate?.calculatedprice) {
        setDiscountData(e.target.value);
      } else {
        setDiscountData(e.target.value);
      }
    } else if (discountType === "percentage") {
      if (Number(e.target.value) > 100) {
        setDiscountData(e.target.value);
      } else {
        setDiscountData(e.target.value);
      }
    } else if (discountType === "free_item") {
      if (Number(e.target.value) > productDetailUpdate?.quantity) {
        setDiscountData(e.target.value);
      } else {
        setDiscountData(e.target.value);
      }
    }
  };

  const handleRadioClick = (e) => {
    if (e.target.value == "cash") {
      if (discountData > productDetailsUpdate?.calculatedprice) {
      } else {
        // setDiscountData(e.target.value);
      }
    } else if (e.target.value === "percentage") {
      if (Number(discountData) > 100) {
      } else {
      }
    } else if (e.target.value === "free_item") {
      if (Number(discountData) > productDetailsUpdate?.quantity) {
      } else {
      }
    }
    setDiscountType(e.target.value);
  };
  const addOrderTikitsNotes = (e) => {
    if (e.target.value != "") {
      productDetailsUpdate.orderTiketsNotes = e.target.value;
    }
  };

  const discountErr = () => {
    if (
      discountType == "cash" &&
      discountData > productDetailsUpdate?.calculatedprice
    ) {
      return "Discount cannot be greater than item price.";
    } else if (discountType == "percentage" && Number(discountData) > 100) {
      return "Discount cannot be more than 100%.";
    } else if (
      discountType == "free_item" &&
      Number(discountData) > productDetailsUpdate?.quantity
    ) {
      return "Discount cannot be more than quantity.";
    } else {
      return "noErr";
    }
  };
  return (
    <>
      <Modal
        title={`Update ${productDetailsUpdate.item}`}
        visible={editProductModalVisible}
        bodyStyle={{ paddingTop: 0 }}
        onCancel={() => handleCancel()}
        footer={[
          <Button key="back" onClick={() => handleCancel()}>
            Cancel
          </Button>,
          <Button
            key="cancel"
            onClick={() => removeSelectedItems(productDetailsUpdate)}
          >
            Remove item
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={form2.submit}
            disabled={discountErr() != "noErr" ? true : false}
          >
            Save
          </Button>,
        ]}
      >
        <p style={{ display: "none" }}>{addonsChanges}</p>
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form2}
          onFinish={onSubmit}
          name="editProduct"
        >
          {productDetailsUpdate.option_item_group != undefined &&
            productDetailsUpdate.option_item_group.length >= 1 &&
            productDetailsUpdate.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetailsUpdate.option_item_group[0].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_1"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
                initialValue={checkedItem1}
              >
                <p style={{ display: "none" }}>{checkedItem1}</p>

                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem1}
                  onChange={(e) => setProductItem1(e)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_item_group[0].products.map(
                    (item, index) => {
                      let FilterVarints = productDetailsUpdate.option_item_group[0].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    className="sagar15"
                                  >
                                    {checkedItem1 === data1.variant_id._id ? (
                                      <svg
                                        width="13px"
                                        style={{ marginRight: "2px" }}
                                        viewBox="0 0 123 102"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                          fill="#BE3D5D"
                                        />
                                      </svg>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem1 === item._id ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.option_item_group != undefined &&
            productDetailsUpdate.option_item_group.length >= 2 &&
            productDetailsUpdate.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetailsUpdate.option_item_group[1].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_2"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
                initialValue={checkedItem2}
              >
                <p style={{ display: "none" }}>{checkedItem2}</p>
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem2}
                  onChange={(e) => setProductItem2(e)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_item_group[1].products.map(
                    (item, index) => {
                      let FilterVarints = productDetailsUpdate.option_item_group[1].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem2 === data1.variant_id._id ? (
                                      <svg
                                        width="13px"
                                        style={{ marginRight: "2px" }}
                                        viewBox="0 0 123 102"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                          fill="#BE3D5D"
                                        />
                                      </svg>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem2 === item._id ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.option_item_group != undefined &&
            productDetailsUpdate.option_item_group.length >= 3 &&
            productDetailsUpdate.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetailsUpdate.option_item_group[2].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_3"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
                initialValue={checkedItem3}
              >
                <p style={{ display: "none" }}>{checkedItem3}</p>
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem3}
                  onChange={(e) => setProductItem3(e)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_item_group[2].products.map(
                    (item, index) => {
                      let FilterVarints = productDetailsUpdate.option_item_group[2].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem3 === data1.variant_id._id ? (
                                      <svg
                                        width="13px"
                                        style={{ marginRight: "2px" }}
                                        viewBox="0 0 123 102"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                          fill="#BE3D5D"
                                        />
                                      </svg>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem3 === item._id ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.option_item_group != undefined &&
            productDetailsUpdate.option_item_group.length >= 4 &&
            productDetailsUpdate.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetailsUpdate.option_item_group[3].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_4"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
                initialValue={checkedItem4}
              >
                <p style={{ display: "none" }}>{checkedItem4}</p>
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem4}
                  onChange={(e) => setProductItem4(e)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_item_group[3].products.map(
                    (item, index) => {
                      let FilterVarints = productDetailsUpdate.option_item_group[3].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem4 === data1.variant_id._id ? (
                                      <svg
                                        width="13px"
                                        style={{ marginRight: "2px" }}
                                        viewBox="0 0 123 102"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                          fill="#BE3D5D"
                                        />
                                      </svg>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem4 === item._id ? (
                                  <svg
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                    viewBox="0 0 123 102"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                      fill="#BE3D5D"
                                    />
                                  </svg>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          <p style={{ display: "none" }}>{checkedItem5}</p>
          {productDetailsUpdate.option_item_group != undefined &&
            productDetailsUpdate.option_item_group.length >= 5 &&
            productDetailsUpdate.option_status == "combo" && (
              <Radio.Group
                style={{ marginBottom: "10px" }}
                buttonStyle="solid"
                value={checkedItem5}
                onChange={(e) => setProductItem5(e)}
                className="tick-radio"
              >
                {productDetailsUpdate.option_item_group[4].products.map(
                  (item, index) => {
                    let FilterVarints = productDetailsUpdate.option_item_group[4].product_variants.filter(
                      (data) => data.product_id._id === item._id
                    );

                    return (
                      <>
                        {FilterVarints.length > 0 ? (
                          FilterVarints.map((data1, index1) => {
                            return (
                              <>
                                <Radio.Button
                                  value={`${data1.variant_id._id} varint`}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {checkedItem5 === data1.variant_id._id ? (
                                    <svg
                                      width="13px"
                                      style={{ marginRight: "2px" }}
                                      viewBox="0 0 123 102"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                        fill="#BE3D5D"
                                      />
                                    </svg>
                                  ) : (
                                    ""
                                  )}
                                  {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                </Radio.Button>
                              </>
                            );
                          })
                        ) : (
                          <>
                            <Radio.Button value={`${item._id} product`}>
                              {checkedItem5 === item._id ? (
                                <svg
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                  viewBox="0 0 123 102"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                    fill="#BE3D5D"
                                  />
                                </svg>
                              ) : (
                                ""
                              )}{" "}
                              {item.product_name}
                            </Radio.Button>
                          </>
                        )}
                      </>
                    );
                  }
                )}
              </Radio.Group>
            )}
          {productDetailsUpdate.isVarience == true && (
            <Form.Item
              onChange={(e) => setProductVarience(e)}
              initialValue={variant_id}
              label={
                <div className="varints-Addon-name">
                  {
                    productDetailsUpdate.option_variant_group[0]
                      .variant_group_name
                  }
                  <span className="text-muted"> Choose 1</span>
                </div>
              }
              name="varient_id"
              rules={[
                {
                  required: true,
                  message: "Select a variant1",
                },
              ]}
            >
              <p style={{ display: "none" }}>{checkedVariant1}</p>
              <Radio.Group
                style={{ marginBottom: "10px" }}
                defaultValue={variant_id}
                value={checkedVariant1 ? checkedVariant1 : false}
                buttonStyle="solid"
                onChange={(e) => {
                  setCheckedVariant1(e.target.value);
                }}
                className="tick-radio"
              >
                {productDetailsUpdate.option_variant_group[0].product_variants.map(
                  (item, index) => {
                    return (
                      <Radio.Button
                        value={item._id}
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {variant_id == item._id && (
                          <>
                            <svg
                              width="13px"
                              style={{ marginRight: "2px" }}
                              viewBox="0 0 123 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                fill="#BE3D5D"
                              />
                            </svg>
                            &nbsp;
                          </>
                        )}
                        {item.variant_name}
                      </Radio.Button>
                    );
                  }
                )}
              </Radio.Group>
            </Form.Item>
          )}
          {productDetailsUpdate.isVarience == true &&
            productDetailsUpdate.option_variant_group.length >= 2 && (
              <Form.Item
                onChange={(e) => setProductVarience1(e)}
                initialValue={variant_id1}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_variant_group[1]
                        .variant_group_name
                    }
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id1"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <p style={{ display: "none" }}>{checkedVariant2}</p>

                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  defaultValue={variant_id1}
                  value={checkedVariant2 ? checkedVariant2 : false}
                  buttonStyle="solid"
                  onChange={(e) => setCheckedVariant2(e.target.value)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_variant_group[1].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {variant_id1 == item._id && (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.isVarience == true &&
            productDetailsUpdate.option_variant_group.length >= 3 && (
              <Form.Item
                onChange={(e) => setProductVarience2(e)}
                initialValue={variant_id2}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_variant_group[2]
                        .variant_group_name
                    }
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id2"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <p style={{ display: "none" }}>{checkedVariant3}</p>

                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  defaultValue={variant_id2}
                  value={checkedVariant3 ? checkedVariant3 : false}
                  buttonStyle="solid"
                  onChange={(e) => setCheckedVariant3(e.target.value)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_variant_group[2].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {variant_id2 == item._id && (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.isVarience == true &&
            productDetailsUpdate.option_variant_group.length >= 4 && (
              <Form.Item
                onChange={(e) => setProductVarience3(e)}
                initialValue={variant_id3}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_variant_group[3]
                        .variant_group_name
                    }
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id3"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <p style={{ display: "none" }}>{checkedVariant4}</p>

                <Radio.Group
                  buttonStyle="solid"
                  style={{ marginBottom: "10px" }}
                  defaultValue={variant_id3}
                  value={checkedVariant4 ? checkedVariant4 : false}
                  onChange={(e) => setCheckedVariant4(e.target.value)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_variant_group[3].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {variant_id3 === item._id ? (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          ) : (
                            ""
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.isVarience == true &&
            productDetailsUpdate.option_variant_group.length >= 5 && (
              <Form.Item
                onChange={(e) => setProductVarience4(e)}
                initialValue={variant_id4}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_variant_group[4]
                        .variant_group_name
                    }
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id4"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <p style={{ display: "none" }}>{checkedVariant5}</p>

                <Radio.Group
                  buttonStyle="solid"
                  style={{ marginBottom: "10px" }}
                  defaultValue={variant_id4}
                  value={checkedVariant5 ? checkedVariant5 : false}
                  onChange={(e) => setCheckedVariant5(e.target.value)}
                  className="tick-radio"
                >
                  {productDetailsUpdate.option_variant_group[4].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {variant_id4 === item._id ? (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          ) : (
                            ""
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.isAddon1st == true && (
            <Form.Item
              onChange={(e) => setProductAddons(e)}
              name="addon_id"
              label={
                <div className="varints-Addon-name">
                  {productDetailsUpdate.option_addon_group[0].addon_group_name}
                  <span className="text-muted">
                    {productDetailsUpdate.option_addon_group[0]
                      .minimum_selectable === 0
                      ? null
                      : ` (Addons) Choose atleast ${productDetailsUpdate.option_addon_group[0].minimum_selectable}`}
                    {productDetailsUpdate.option_addon_group[0]
                      .maximum_selectable === 0
                      ? ""
                      : ` Max ${productDetailsUpdate.option_addon_group[0].maximum_selectable}`}
                  </span>
                </div>
              }
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      productDetailsUpdate.option_addon_group[0]
                        .minimum_selectable === 0 &&
                      productDetailsUpdate.option_addon_group[0]
                        .maximum_selectable === 0
                    ) {
                      return Promise.resolve();
                    } else {
                      if (
                        productDetailsUpdate.option_addon_group[0]
                          .minimum_selectable > 0 &&
                        value.length <
                          productDetailsUpdate.option_addon_group[0]
                            .minimum_selectable
                      ) {
                        return Promise.reject(
                          "Less than the min selectable limit."
                        );
                      } else if (
                        value.length >
                        productDetailsUpdate.option_addon_group[0]
                          .maximum_selectable
                      ) {
                        return Promise.reject(
                          "Exceeds the max selectable limit"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                },
              ]}
              initialValue={addon_ids}
            >
              <Checkbox.Group>
                {productDetailsUpdate.option_addon_group[0].product_addons.map(
                  (item, index) => {
                    return (
                      <Checkbox
                        checked={item.isSelected}
                        value={item._id}
                        className="varints-Addon-name tick-checkbox"
                      >
                        {item.isSelected ? (
                          <>
                            <svg
                              width="13px"
                              style={{ marginRight: "2px" }}
                              viewBox="0 0 123 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                fill="#BE3D5D"
                              />
                            </svg>
                            &nbsp;
                          </>
                        ) : null}{" "}
                        {item.addon_name}
                      </Checkbox>
                    );
                  }
                )}
              </Checkbox.Group>
            </Form.Item>
          )}
          {productDetailsUpdate.isAddon2nd == true && (
            <Form.Item
              onChange={(e) => setProductAddons1(e)}
              name="addon_id1"
              initialValue={addon_ids1}
              label={
                <div className="varints-Addon-name">
                  {productDetailsUpdate.option_addon_group[1].addon_group_name}
                  <span className="text-muted">
                    {productDetailsUpdate.option_addon_group[1]
                      .minimum_selectable === 0
                      ? null
                      : ` (Addons) Choose atleast ${productDetailsUpdate.option_addon_group[1].minimum_selectable}`}
                    {productDetailsUpdate.option_addon_group[1]
                      .maximum_selectable === 0
                      ? ""
                      : ` Max ${productDetailsUpdate.option_addon_group[1].maximum_selectable}`}
                  </span>
                </div>
              }
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      productDetailsUpdate.option_addon_group[1]
                        .minimum_selectable === 0 &&
                      productDetailsUpdate.option_addon_group[1]
                        .maximum_selectable === 0
                    ) {
                      return Promise.resolve();
                    } else {
                      if (
                        productDetailsUpdate.option_addon_group[1]
                          .minimum_selectable > 0 &&
                        value.length <
                          productDetailsUpdate.option_addon_group[1]
                            .minimum_selectable
                      ) {
                        return Promise.reject(
                          "Less than the min selectable limit."
                        );
                      } else if (
                        value.length >
                        productDetailsUpdate.option_addon_group[1]
                          .maximum_selectable
                      ) {
                        return Promise.reject(
                          "Exceeds the max selectable limit"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                },
              ]}
            >
              <Checkbox.Group>
                {productDetailsUpdate.option_addon_group[1].product_addons.map(
                  (item, index) => {
                    return (
                      <Checkbox
                        checked={item.isSelected}
                        value={item._id}
                        className="varints-Addon-name tick-checkbox"
                      >
                        {item.isSelected ? (
                          <>
                            <svg
                              width="13px"
                              style={{ marginRight: "2px" }}
                              viewBox="0 0 123 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                fill="#BE3D5D"
                              />
                            </svg>
                            &nbsp;
                          </>
                        ) : null}{" "}
                        {item.addon_name}
                      </Checkbox>
                    );
                  }
                )}
              </Checkbox.Group>
            </Form.Item>
          )}
          {productDetailsUpdate.isAddon3rd == true && (
            <Form.Item
              onChange={(e) => setProductAddons2(e)}
              label={
                <div className="varints-Addon-name">
                  {productDetailsUpdate.option_addon_group[2].addon_group_name}
                  <span className="text-muted">
                    {productDetailsUpdate.option_addon_group[2]
                      .minimum_selectable === 0
                      ? null
                      : ` (Addons) Choose atleast ${productDetailsUpdate.option_addon_group[2].minimum_selectable}`}
                    {productDetailsUpdate.option_addon_group[2]
                      .maximum_selectable === 0
                      ? ""
                      : ` Max ${productDetailsUpdate.option_addon_group[2].maximum_selectable}`}
                  </span>
                </div>
              }
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      productDetailsUpdate.option_addon_group[2]
                        .minimum_selectable === 0 &&
                      productDetailsUpdate.option_addon_group[2]
                        .maximum_selectable === 0
                    ) {
                      return Promise.resolve();
                    } else {
                      if (
                        value.length <
                        productDetailsUpdate.option_addon_group[2]
                          .minimum_selectable
                      ) {
                        return Promise.reject(
                          "Less than the min selectable limit."
                        );
                      } else if (
                        value.length >
                        productDetailsUpdate.option_addon_group[2]
                          .maximum_selectable
                      ) {
                        return Promise.reject(
                          "Exceeds the max selectable limit"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                },
              ]}
              name="addon_id2"
              initialValue={addon_ids2}
            >
              <Checkbox.Group>
                {productDetailsUpdate.option_addon_group[2].product_addons.map(
                  (item, index) => {
                    return (
                      <Checkbox
                        defaultChecked={item.isSelected}
                        value={item._id}
                        className="varints-Addon-name tick-checkbox"
                      >
                        {item.isSelected ? (
                          <>
                            <svg
                              width="13px"
                              style={{ marginRight: "2px" }}
                              viewBox="0 0 123 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                fill="#BE3D5D"
                              />
                            </svg>
                            &nbsp;
                          </>
                        ) : null}{" "}
                        {item.addon_name}
                      </Checkbox>
                    );
                  }
                )}
              </Checkbox.Group>
            </Form.Item>
          )}
          {productDetailsUpdate.option_addon_group &&
            productDetailsUpdate.option_addon_group[3] !== undefined && (
              <Form.Item
                onChange={(e) => setProductAddons3(e)}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_addon_group[3]
                        .addon_group_name
                    }
                    <span className="text-muted">
                      {productDetailsUpdate.option_addon_group[3]
                        .minimum_selectable === 0
                        ? null
                        : ` (Addons) Choose atleast ${productDetailsUpdate.option_addon_group[3].minimum_selectable}`}
                      {productDetailsUpdate.option_addon_group[3]
                        .maximum_selectable === 0
                        ? ""
                        : ` Max ${productDetailsUpdate.option_addon_group[3].maximum_selectable}`}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        productDetailsUpdate.option_addon_group[3]
                          .minimum_selectable === 0 &&
                        productDetailsUpdate.option_addon_group[3]
                          .maximum_selectable === 0
                      ) {
                        return Promise.resolve();
                      } else {
                        if (
                          value.length <
                          productDetailsUpdate.option_addon_group[3]
                            .minimum_selectable
                        ) {
                          return Promise.reject(
                            "Less than the min selectable limit."
                          );
                        } else if (
                          value.length >
                          productDetailsUpdate.option_addon_group[3]
                            .maximum_selectable
                        ) {
                          return Promise.reject(
                            "Exceeds the max selectable limit"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                name="addon_id3"
                initialValue={addon_ids3}
              >
                <Checkbox.Group>
                  {productDetailsUpdate.option_addon_group[3].product_addons.map(
                    (item, index) => {
                      return (
                        <Checkbox
                          defaultChecked={item.isSelected}
                          value={item._id}
                          className="varints-Addon-name tick-checkbox"
                        >
                          {item.isSelected ? (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          ) : null}{" "}
                          {item.addon_name}
                        </Checkbox>
                      );
                    }
                  )}
                </Checkbox.Group>
              </Form.Item>
            )}
          {productDetailsUpdate.option_addon_group &&
            productDetailsUpdate.option_addon_group[4] !== undefined && (
              <Form.Item
                onChange={(e) => setProductAddons4(e)}
                label={
                  <div className="varints-Addon-name">
                    {
                      productDetailsUpdate.option_addon_group[4]
                        .addon_group_name
                    }
                    <span className="text-muted">
                      {productDetailsUpdate.option_addon_group[4]
                        .minimum_selectable === 0
                        ? null
                        : ` (Addons) Choose atleast ${productDetailsUpdate.option_addon_group[4].minimum_selectable}`}
                      {productDetailsUpdate.option_addon_group[4]
                        .maximum_selectable === 0
                        ? ""
                        : ` Max ${productDetailsUpdate.option_addon_group[4].maximum_selectable}`}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        productDetailsUpdate.option_addon_group[4]
                          .minimum_selectable === 0 &&
                        productDetailsUpdate.option_addon_group[4]
                          .maximum_selectable === 0
                      ) {
                        return Promise.resolve();
                      } else {
                        if (
                          value.length <
                          productDetailsUpdate.option_addon_group[4]
                            .minimum_selectable
                        ) {
                          return Promise.reject(
                            "Less than the min selectable limit."
                          );
                        } else if (
                          value.length >
                          productDetailsUpdate.option_addon_group[4]
                            .maximum_selectable
                        ) {
                          return Promise.reject(
                            "Exceeds the max selectable limit"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                name="addon_id3"
                initialValue={addon_ids4}
              >
                <Checkbox.Group>
                  {productDetailsUpdate.option_addon_group[4].product_addons.map(
                    (item, index) => {
                      return (
                        <Checkbox
                          defaultChecked={item.isSelected}
                          value={item._id}
                          className="varints-Addon-name tick-checkbox"
                        >
                          {item.isSelected ? (
                            <>
                              <svg
                                width="13px"
                                style={{ marginRight: "2px" }}
                                viewBox="0 0 123 102"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.42991 63.6294C1.56091 60.8744 0.0779147 57.2094 0.00291465 53.5194C-0.0710853 49.8304 1.26391 46.1074 4.01791 43.2384C6.76991 40.3714 10.4349 38.8874 14.1239 38.8134C17.8149 38.7374 21.5359 40.0684 24.4069 42.8254L49.1939 66.6764L98.5429 3.98842L100.311 5.33742L98.5409 3.98242C98.6819 3.79942 98.8419 3.64342 99.0199 3.51642C101.956 0.973418 105.641 -0.174582 109.243 0.0214178V0.0174178L109.419 0.0334178C113.042 0.273418 116.581 1.88342 119.194 4.79942C121.852 7.76442 123.057 11.5304 122.856 15.2114H122.86L122.844 15.3874C122.608 18.9454 121.053 22.4224 118.235 25.0194L59.0109 97.1094L59.0149 97.1134C58.9039 97.2544 58.7789 97.3754 58.6429 97.4814C55.8699 99.9164 52.3679 101.11 48.8859 101.05C45.3749 100.989 41.8709 99.6544 39.1449 97.0344L4.42991 63.6294Z"
                                  fill="#BE3D5D"
                                />
                              </svg>
                              &nbsp;
                            </>
                          ) : null}{" "}
                          {item.addon_name}
                        </Checkbox>
                      );
                    }
                  )}
                </Checkbox.Group>
              </Form.Item>
            )}
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                validator: (_, value) => {
                  if (value == 0 || value == "") {
                    return Promise.reject("qty not 0 and empty");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              type="number"
              style={{ marginBottom: 6 }}
              placeholder="Enter item quantity"
              ref={exampleInput}
              value={quantity}
              onChange={getChangedQuantity}
              onKeyPress={(event) => {
                if (event.key.match("[0-9,.]+")) {
                  return true;
                } else {
                  return event.preventDefault();
                }
              }}
            />
          </Form.Item>
          {getItem("hide_quantity_increase_decrease_buttons") ? (
            ""
          ) : (
            <Form.Item>
              <div className="quantityies">
                <>
                  <span
                    class="qunatity-adjust"
                    onClick={() => addOneQuantityInDetails("SUBTRACT")}
                  >
                    −
                  </span>
                </>

                <>
                  <span
                    class="qunatity-adjust"
                    onClick={() => addOneQuantityInDetails("ADD")}
                  >
                    +
                  </span>
                </>
              </div>
            </Form.Item>
          )}
          <Form.Item>
            <div>
              Total Price {rsSymbol}
              {`${Number(
                productDetailsUpdate.productInclusivePricecalculatedprice
                  ? productDetailsUpdate.productInclusivePricecalculatedprice
                  : productDetailsUpdate.calculatedprice
              ).toFixed(2)}`}
            </div>
          </Form.Item>
          {getItem("userDetails") != null &&
          getItem("userDetails").role == "cashier" &&
          (getItem("allow_cashier_to_discount") == null ||
            getItem("allow_cashier_to_discount") == false) ? null : (
            <div>
              <Form.Item initialValue={discountType} name="discounttype">
                <Radio
                  value="cash"
                  checked={discountType === "cash"}
                  onClick={handleRadioClick}
                >
                  Cash Discount
                </Radio>
                <Radio
                  checked={discountType === "percentage"}
                  onClick={handleRadioClick}
                  value="percentage"
                >
                  Percentage Discount
                </Radio>
                <Radio
                  value="free_item"
                  checked={discountType === "free_item"}
                  onClick={handleRadioClick}
                >
                  Free item
                </Radio>
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Discount value"
                  ref={discountRef}
                  type="number"
                  value={discountData}
                  style={{ marginBottom: "6px" }}
                  onChange={(e) => {
                    handleChangeDiscountData(e, productDetailsUpdate);
                  }}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9,.]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              {discountErr() != "noErr" && (
                <p style={{ color: "red" }}>{discountErr()}</p>
              )}
            </div>
          )}{" "}
          {getItem("orderTicketButton") != null &&
            getItem("orderTicketButton") && (
              <Form.Item name="order" label="Order Ticket Notes">
                <Input
                  style={{ marginBottom: 6 }}
                  placeholder="Order ticket notes (optional)"
                  onChange={addOrderTikitsNotes}
                />
              </Form.Item>
            )}
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ProductDetailModal);
