import React, { useState, useRef } from "react";
import { Row, Col, Modal } from "antd";
import "../sell.css";
import Variantform from "./Variantform";

const MenuItemList = (props) => {
  let [allProductData, setAllProductData] = useState(props.productData);
  let searchArr = allProductData.filter((value) =>
    value.product_name.toLowerCase().includes(props.search.toLowerCase())
  );
  const [modalVisible, setModelVisible] = useState(false);

  return (
    <>
      <Row>
        {searchArr.length > 0
          ? searchArr.map((value, index) => {
              return (
                <Col
                  xs={12}
                  xl={6}
                  className="sell-table-col"
                  key={index}
                  onClick={() => setModelVisible(true)}
                >
                  <div className="sell-main">
                    <div className="sell-table-title">{value.product_name}</div>
                  </div>
                </Col>
              );
            })
          : ""}
      </Row>
      <Modal
        title="Select Option"
        visible={modalVisible}
        onOk={() => setModelVisible(false)}
        onCancel={() => setModelVisible(false)}
        width={600}
      >
        <Variantform />
      </Modal>
    </>
  );
};

export { MenuItemList };
