<>
  <div className={`mob-cart list-open-${listViewOnOff}`}>
    <ul className="items-view">
      <li>
        <NavLink
          to="#"
          onClick={() => setListViewOnOff(!listViewOnOff)}
          style={{
            color: "#008cba",
          }}
        >
          View Items
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <DeleteOutlined
            style={{
              color: "#008cba",
            }}
            onClick={() => {
              setLocalDetails();
              setBulckDisountDetails({
                ...buclkDiscontDetails,
                type: "FLAT",
                value: 0,
              });
              setBulckDiscontButtonText({
                text: "Bulk discount",
                color: "#008cba",
                discountValue: 0,
              });
              let data = getCartInfoFromLocalKey(
                localCartInfo?.cartKey,
                registerData
              );
              if (
                data?.orderTicketsData?.length ||
                data?.type == "booking_cart"
              ) {
                cancelReceipts(data);
              } else {
                removeItem("active_cart");
                setSelectedProduct([]);
                setDiscountMoreThanTotal("Bulk Discount");
                setColorBulk("#bd025d");

                emptyCart();
              }
            }}
          />
        </NavLink>
      </li>
    </ul>
    <Input
      type="number"
      min={0}
      placeholder="Customer mobile number"
      onKeyDown={(e) => onSearch(e)}
      value={customer === "Add Customer" ? "" : customer}
      onChange={(e) => {
        setNotChange(true);
        setCustomer(e.target.value === "" ? "Add Customer" : e.target.value);
        setCustomerData(false);
      }}
      onKeyPress={(event) => {
        if (event.key.match("[0-9]+")) {
          return true;
        } else {
          return event.preventDefault();
        }
      }}
    />
    <br />
    <br />

    <Input
      suffix={suffix}
      onChange={(e) => {
        setsearchItems(e.target.value);
        setOnClickList(false);
      }}
      value={searchItems}
      placeholder="Search Items"
    />
    {searchItemsList.length > 0 ? (
      <List
        className="mobile_serlist"
        bordered
        dataSource={searchItemsList}
        renderItem={(value, index) => {
          return (
            <div>
              {index == 0 ? (
                <List.Item
                  className="select_frst"
                  onClick={() => {
                    productDetails(value);
                    setsearchItems(
                      value.Newproduct_name
                        ? value.Newproduct_name
                        : value.product_name
                    );
                    setOnClickList(true);
                  }}
                >
                  <CheckCircleOutlined />
                  <tr>
                    <td>
                      <p className="sp-product-name">
                        {value.Newproduct_name
                          ? value.Newproduct_name
                          : value.product_name}{" "}
                        <em className="text-muted">
                          in {value.product_category.category_name}
                        </em>
                      </p>
                    </td>
                    <td>
                      {calQty(value)}₹{value.newPrice}
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
                </List.Item>
              ) : (
                <List.Item
                  onClick={() => {
                    productDetails(value);
                    setsearchItems(
                      value.Newproduct_name
                        ? value.Newproduct_name
                        : value.product_name
                    );
                    setOnClickList(true);
                  }}
                >
                  <tr>
                    <td>
                      <p className="sp-product-name">
                        {value.Newproduct_name
                          ? value.Newproduct_name
                          : value.product_name}{" "}
                        <em className="text-muted">
                          in {value.product_category.category_name}
                        </em>
                      </p>
                    </td>
                    <td>
                      {calQty(value)}₹{value.newPrice}
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
                </List.Item>
              )}
            </div>
          );
        }}
      />
    ) : null}

    <br />
    <br />
    <div
      style={{
        display: "none",
      }}
    >
      {discountValue.length}
    </div>

    {selectedProduct.length > 0 && window.screen.width <= 776 ? (
      <>
        <div className="discount-section">
          <Popover
            content={renderBulkDiscountContent()}
            trigger="click"
            visible={PopoverVisible}
            onVisibleChange={(visible) => setPopoverVisible(visible)}
          >
            <Button
              type="link"
              className="onhover"
              style={{
                color: colorBulk,
                fontSize: "13px",
                background: "#F4F5F7",
                border: "none",
              }}
              onClick={() => {
                if (localCartInfo && localCartInfo.Status == "Unpaid") {
                  setNotUpdate(true);
                } else {
                  setPopoverVisible(!PopoverVisible);
                }
              }}
            >
              {finalCoupanCodeValue > 0
                ? `Bulk Discount ₹${Number(finalCoupanCodeValue).toFixed(2)}`
                : `${DiscountMoreThanTotal} ${
                    bulkValue > 0 ? "₹" + bulkValue : ""
                  }`}
            </Button>
          </Popover>

          {AddtionalChargeList.length > 0 && window.screen.width <= 776 ? (
            <div>
              <Popover
                content={AddAdditionalCharge()}
                trigger="click"
                visible={PopoverVisibleAdditional}
                onVisibleChange={(visible) =>
                  setPopoverVisibleAdditional(visible)
                }
              >
                <Button
                  type="link"
                  className="onhover"
                  style={{
                    color: "#008cba",
                    fontSize: "13px",
                    background: "#F4F5F7",
                    border: "none",
                  }}
                  onClick={() => {
                    if (localCartInfo && localCartInfo.Status == "Unpaid") {
                    } else {
                      setPopoverVisibleAdditional(!PopoverVisibleAdditional);
                    }
                  }}
                >
                  {TotalAddtionalChargeValue > 0 &&
                  tickAdditionalList.length > 0
                    ? `Addtional Charge ₹${TotalAddtionalChargeValue}`
                    : `Addtional Charge`}
                </Button>
              </Popover>
            </div>
          ) : (
            ""
          )}
        </div>
        {getItem("enable_quick_billing") ? (
          <Radio.Group
            onChange={(e) => setPaymentType(e.target.value)}
            value={PaymentType}
            className="tick-radio"
          >
            <Radio.Button
              value="cash"
              style={{
                marginRight: "10px",
                marginBottom: "10px",
              }}
            >
              {PaymentType === "cash" ? (
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
              Cash
            </Radio.Button>
            <Radio.Button
              value="card"
              style={{
                marginRight: "10px",
                marginBottom: "10px",
              }}
            >
              {PaymentType === "card" ? (
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
              Credit / Debit Card
            </Radio.Button>
            {PaymentTypeList.map((val, index) => {
              return (
                <Radio.Button
                  value={val.name}
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {PaymentType === val.name ? (
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
                  {val.name}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        ) : (
          ""
        )}
      </>
    ) : (
      ""
    )}

    <div className="discount-section upper-btns">
      {getItem("orderTicketButton") ? (
        <>
          <Button
            type="primary"
            size="large"
            style={{
              marginRight: "5px",
              borderRadius: "inherit",
              opacity: selectedProduct.length > 0 ? "" : 0.65,
              cursor: selectedProduct.length > 0 ? "pointer" : "no-drop",
              width: "50%",
              height: "40px",
            }}
            onClick={() => {
              orderTicketRef.current.showModal();
            }}
          >
            Order Ticket (F9)
          </Button>
          <Button
            type="success"
            size="large"
            style={{
              borderRadius: "inherit",
              width: "50%",
              opacity: selectedProduct.length > 0 ? "" : 0.65,
              cursor: selectedProduct.length > 0 ? "pointer" : "no-drop",
              height: "40px",
              background: "#BD025D",
            }}
            onClick={() => chargeOnClick()}
          >
            Charge ₹{totalcalculatedPrice} (F2)
          </Button>
        </>
      ) : (
        <Button
          type="success"
          size="large"
          style={{
            borderRadius: "inherit",
            width: "100%",
            opacity: selectedProduct.length > 0 ? "" : 0.65,
            cursor: selectedProduct.length > 0 ? "pointer" : "no-drop",
            height: "40px",

            background: "#BD025D",
          }}
          onClick={() => chargeOnClick()}
        >
          Charge ₹{totalcalculatedPrice} (F2)
        </Button>
      )}
    </div>
  </div>
  <div className={`mob-cart list-view-${listViewOnOff}`}>
    <NavLink
      to="#"
      onClick={() => setListViewOnOff(!listViewOnOff)}
      className="view-bill"
    >
      View Bill
    </NavLink>
    {filterArray.map((item) => {
      return (
        <>
          <div className="container">
            <div className="table-srd">
              <span className="title">{item.title}</span>
              <table className="table">
                <tbody>
                  {item.data.map((value) => {
                    return (
                      <>
                        <tr onClick={() => productDetails(value)}>
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
                            {calQty(value)}₹{value.newPrice}
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    })}
  </div>
</>;
