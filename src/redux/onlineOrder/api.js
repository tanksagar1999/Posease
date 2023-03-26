let allApi = [
  {
    name: "Loginapi",
    method: "post",
    url: "http://localhost:32567/api/v1/swiggy/login",
  },
  {
    name: "GetOrders",
    method: "get",
    url: "http://localhost:32567/api/v1/swiggy/orders",
  },
  {
    name: "Accept New Order",
    method: "post",
    url: "http://localhost:32567/api/v1/swiggy/orders/accept",
    data: {
      order_id: "string",
      prep_time: "integer",
    },
  },
  {
    name: "Mark Order Ready",
    method: "post",
    url: "http://localhost:32567/api/v1/swiggy/orders/ready",
    data: {
      order_id: "string",
    },
  },
  {
    name: "get All Items",
    method: "get",
    url: "http://localhost:32567/api/v1/swiggy/items",
  },
  {
    name: "Mark items in stock",
    method: "post",
    url: "http://localhost:32567/api/v1/swiggy/items/instock",
    data: {
      item_id: "string",
    },
  },
  {
    name: "Mark items out of stock",
    method: "post",
    url: "http://localhost:32567/api/v1/swiggy/items/outofstock",
    data: {
      item_id: "string",
    },
  },
];
