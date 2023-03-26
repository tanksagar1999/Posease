const actions = {
  SHOP_DETAIL_ERR: "SHOP_DETAIL_ERR",
  SHOP_DETAIL: "SHOP_DETAIL",

  shopDetailErr: (err) => {
    return {
      type: actions.SHOP_DETAIL_ERR,
      err,
    };
  },
  shopDetail: (shopData) => {
    return {
      type: actions.SHOP_DETAIL,
      error: false,
      payload: { ...shopData },
    };
  },
};

export default actions;
