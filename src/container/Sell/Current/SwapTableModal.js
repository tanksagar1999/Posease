import React, { useState, useContext } from "react";
import "./productEditModal.css";
import { Modal, Form, Select } from "antd";

import {
  createNewCartwithKeyandPush,
  setCartInfoFromLocalKey,
  getTableStatusFromId,
  swaptable,
  getItem,
} from "../../../utility/localStorageControl";
import { SocketContext } from "../../../socket/socketContext";

const SwapTableModal = (props, ref) => {
  const socket = getItem("waiter_app_enable") && useContext(SocketContext);

  let {
    table_name,
    swapTableNameList,
    selectedProduct,
    setlocalCartInfo,
    setTableName,
    localCartInfo,
    registerData,
    setSwapModalVisible,
    swapModalVisible,
  } = props;
  const { Option } = Select;
  const [form] = Form.useForm();

  const handleCancel = () => {
    setSwapModalVisible(false);
  };
  const onSubmit = (values) => {
    setSwapModalVisible(false);

    let tableDetails = swapTableNameList.find(
      (i) => i.swapTableName == values.table_name
    );
    // let localCartInFoData = createNewCartwithKeyandPush(
    //   "custom-table-local",
    //   {
    //     ...localCartInfo,
    //     tableName: values.table_name,
    //     tablekey: values.table_name.replace(/\s+/g, "-").toLowerCase(),
    //     swapTableCustum: tableDetails.swapCustum,
    //     index: tableDetails.this_index,
    //   },
    //   registerData
    // );
    let obj = {
      ...localCartInfo,
      tableName: values.table_name,
      tablekey: values.table_name.replace(/\s+/g, "-").toLowerCase(),
      swapTableCustum: tableDetails.swapCustum,
      index: tableDetails.this_index,
    };
    let { default_cart_object, allLocalData } = swaptable(
      localCartInfo.cartKey,
      obj,
      registerData
    );
    setlocalCartInfo(default_cart_object);
    setTableName(values.table_name);
    getItem("waiter_app_enable") &&
      socket?.emit("send_local_table_data", allLocalData);
  };

  return (
    <>
      <Modal
        title={`Swap ${table_name}`}
        visible={swapModalVisible}
        bodyStyle={{ paddingTop: 0 }}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Swap Table"
      >
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form}
          onFinish={onSubmit}
          name="editProduct"
        >
          <Form.Item name="table_name" label="Swap to">
            <Select placeholder="Select a table to swap">
              {swapTableNameList != undefined &&
                swapTableNameList.map((val) => {
                  let status = getTableStatusFromId(
                    val.swapTableName.replace(/\s+/g, "-").toLowerCase(),
                    registerData
                  );
                  return (
                    <>
                      {status == "" && (
                        <Option value={val.swapTableName}>
                          {val.swapTableName}
                        </Option>
                      )}
                    </>
                  );
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(SwapTableModal);
