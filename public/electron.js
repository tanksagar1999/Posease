const path = require("path");
const fs = require("fs");
const nodeSever = require("./server");
var os = require("os");
const detect = require("detect-port");
const { autoUpdater, AppUpdater } = require("electron-updater");
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  ipcRenderer,
  globalShortcut,
  Menu,
} = require("electron");
const isDev = require("electron-is-dev");

require("@electron/remote/main");

let win;
let win1;

const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        click: async () => {
          win.loadURL(
            isDev
              ? "http://localhost:3000"
              : `file://${path.join(__dirname, "../build/index.html")}`
          );
        },
      },
      {
        label: "ForceReload",
        click: async () => {
          win.loadURL(
            isDev
              ? "http://localhost:3000"
              : `file://${path.join(__dirname, "../build/index.html")}`
          );
        },
      },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.posease.com");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
function createWindow() {
  // Create the browser window.
  // let factor = screen.getPrimaryDisplay().scaleFactor;
  // console.log("fefactorbhbhbhbbh", factor);
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
      preload: "http://localhost:3000" + "/preload.js",
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.

  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  if (address && addresses.length > 0) {
    detect((port = 8000))
      .then((_port) => {
        if (port == _port) {
          nodeSever.startNodeServer();
        } else {
          console.log(`port: ${port} was occupied, try port: ${_port}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  ipcMain.on("sendReqForConnectIpAddress", (e, arg) => {
    e.reply("getIpAddress", addresses);
  });
  ipcMain.on("sendReqForNodeServerStart", (e, allLocalData) => {
    detect((port = 8000))
      .then((_port) => {
        if (port == _port) {
          nodeSever.startNodeServer();
        } else {
          console.log(`port: ${port} was occupied, try port: ${_port}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    e.reply("successCreateNodeServer", "done");
  });

  if (isDev) {
    win.webContents.openDevTools();
  }
  // else {
  //   win.webContents.openDevTools();
  // }
  let allconnectPrinter = [];
  ipcMain.on("sendReqForConnectPrinterList", (e, arg) => {
    allconnectPrinter = win.webContents.getPrinters();
    e.reply("getPrinterList", allconnectPrinter);
  });

  ipcMain.on("reloadPage", (e, arg) => {
    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  });

  win1 = new BrowserWindow({
    parent: win,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win1.loadURL(
    isDev
      ? `file://${path.join(__dirname, "print.html")}`
      : `file://${path.join(__dirname, "../build/print.html")}`
  );
  autoUpdater.checkForUpdates();
  win1.webContents.on("did-finish-load", function() {
    // try {
    ipcMain.on("PrintReceipt", (e, receiptDetails) => {
      let allconnectPrinterList = win.webContents.getPrinters();
      let totalprint = receiptDetails.length;
      let cont = 1;
      console.log("omkmmmmmcdcscsdcds", receiptDetails);
      function test(index, length) {
        let orignalConnect = allconnectPrinterList.find(
          (k) => k?.name == receiptDetails[index]?.printerName
        );

        if (
          receiptDetails[index] &&
          (receiptDetails[index].printerName == undefined ||
            receiptDetails[index].printerName == "do_not_print" ||
            receiptDetails[index].printerName == "browser_print" ||
            orignalConnect == undefined)
        ) {
          test(index + 1, length);
        } else if (
          receiptDetails[index] &&
          receiptDetails[index].printDiv &&
          receiptDetails[index].printerName
        ) {
          const options = {
            silent: true,
            pageSize: "A5",
            deviceName: receiptDetails[index].printerName,
            copies: 1,
            margin: {
              left: 0,
              top: 0,
            },
          };

          win1.webContents
            .executeJavaScript(
              `document.getElementById("demo").innerHTML='${
                receiptDetails[index].printDiv
              }';
              document.getElementById("demo").style='margin-left: ${Number(
                receiptDetails[index].left
              ) + 8}mm; width: ${
                receiptDetails[index].content_size
              }; margin-top: ${receiptDetails[index].top}mm'`
            )
            .then((ans) => {})
            .catch((err) => err);
          win1.webContents.print(options, (sucues, err) => {
            console.log("xccscsccs", sucues);
            if (sucues) {
              if (index < length) {
                test(index + 1, length);
              }
            } else {
              if (index < length) {
                test(index, length);
              }
            }
          });
        } else {
          console.log("doneeeee");
        }
      }
      receiptDetails.length > 0 && test(0, receiptDetails.length - 1);

      console.log("howwwwwww", totalprint, cont);
    });
  });
}

app.on("ready", createWindow);
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
  }
);
app.on("browser-window-focus", function() {
  globalShortcut.register("CommandOrControl+R", () => {
    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  });
  globalShortcut.register("F5", () => {
    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  });
});
app.on("browser-window-blur", function() {
  globalShortcut.unregister("CommandOrControl+R");
  globalShortcut.unregister("F5");
});
autoUpdater.on("update-available", (info) => {
  let elemE = document.getElementById("message");
  elemE.innerHTML = `Update available. Current version ${app.getVersion()}`;
  let pth = autoUpdater.downloadUpdate();
  elemE.innerHTML = pth;
});

autoUpdater.on("update-not-available", (info) => {
  let elemE = document.getElementById("message");
  elemE.innerHTML = `No update available. Current version ${app.getVersion()}`;
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  let elemE = document.getElementById("message");
  elemE.innerHTML = `Update downloaded. Current version ${app.getVersion()}`;
});

autoUpdater.on("error", (info) => {
  let elemE = document.getElementById("message");
  elemE.innerHTML = info;
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
