
const actions = {
  ITEM_GROUP_LIST: "ITEM_GROUP_LIST",
  ITEM_GROUP_LIST_ERR: "ITEM_ROUP_LIST_ERR",
  ITEM_GROUP_BY_ID: "ITEM_GROUP_BY_ID",
  ITEM_GROUP_BY_ID_ERR: "ITEM_GROUP_BY_ID_ERR",
  ITEM_GROUP_DELETE: "ITEM_GROUP_DELETE",
  ITEM_GROUP_DELETE_ERR: "ITEM_GROUP_DELETE_ERR",
  ITEM_GROUP_ADD: "ITEM_GROUP_ADD",
  ITEM_GROUP_ADD_ERR: "ITEM_GROUP_ADD_ERR",

  ItemGroupList: (itemGroupList) => {
    return {
      type: actions.ITEM_GROUP_LIST,
      payload: itemGroupList,
    };
  },
  ItemGroupDelete: (deletedItem) => {
    return {
      type: actions.ITEM_GROUP_DELETE,
      deletedItem,
    };
  },

  ItemGroupDeleteErr: (err) => {
    return {
      type: actions.ITEM_GROUP_DELETE_ERR,
      err,
    };
  },

  ItemGroupListErr: (err) => {
    return {
      type: actions.ITEM_GROUP_LIST_ERR,
      err,
    };
  },

  ItemGroupAdd: (ItemGroupData) => {
    return {
      type: actions.ITEM_GROUP_ADD,
      ItemGroupData,
    };
  },

  ItemGroupAddErr: (err) => {
    return {
      type: actions.ITEM_GROUP_ADD_ERR,
      err,
    };
  },
  ItemGroup: (itemGroupData) => {
    return {
      type: actions.ITEM_GROUP_BY_ID,
      itemGroupData,
    };
  },

  ItemGroupErr: (err) => {
    return {
      type: actions.ITEM_GROUP_BY_ID_ERR,
      err,
    };
  },
};

export default actions;
