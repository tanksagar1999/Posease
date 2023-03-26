var http = require("http");

const startNodeServer = (data) => {
  var app = http.createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("HellorunBuild");
  });

  var io = require("socket.io")(app);

  io.on("connection", function(socket) {
    socket.on("send_local_table_data", (data, socketId) => {
      console.log("send_local_table_data");
      socket.broadcast.emit("receive_local_table_data", data, socketId);
    });
    socket.on("send_succuses_msg", (data, socketId) => {
      console.log("send_local_table_data", data, socketId);

      io.to(socketId).emit("receive_succuses_msg", data, socketId);
    });
    socket.on("send_req_for_local_data", (deviceId) => {
      console.log("checkconnect89889989");
      //io.to(socket.id).emit("localStorage", deviceId);
      socket.broadcast.emit("localStorage", socket.id);
    });
    socket.on("localStorageData", (data, socketId) => {
      console.log("localStorage => ", socketId);
      io.to(socketId).emit("receive_localstorage", data, socketId);
      // socket.emit("receive_localstorage", data, deviceId);
    });
    socket.on("send_mobile_to_local_table_data", (data, tableData) => {
      console.log("send_mobile_to_local_table_data", tableData);
      socket.broadcast.emit("receive_mobile_local_table_data", data, tableData);
    });
    socket.on("send_mobile_to_confirm_order", (data, deviceId) => {
      console.log("send_mobile_to_confirm_order");
      socket.broadcast.emit("receive_mobile_to_confirm_order", data, deviceId);
    });
  });

  app.listen(8000);
  return true;
};

module.exports = {
  startNodeServer,
};
