const electron = require('electron')
const url = require("url")
const path = require("path")
const fs = require("fs")
const {app, BrowserWindow, Menu, ipcMain} = electron;

let user_info = {}

fs.readFile("database/login.json", "utf8", function (err, content) {
  if (!err) {
    user_info = JSON.parse(content)
  } else {
    process.exit()
  }
})

let loginWindow
let mainWindow

function createLoginWindow() {

  loginWindow = new BrowserWindow({
    title: "Electro Pass Reminder",
    width: 800,
    height: 550,
    icon: path.join(__dirname, "assets/images/icon.png"),
    webPreferences: {
      nodeIntegration: true
    }
  })

  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, "template/loginWindow.html"),
    protocol: "file:",
    slashes: true
  }));

  loginWindow.on('closed', function () {
    loginWindow = null
  })

}

function createMainWindow() {

  mainWindow = new BrowserWindow({
    title: "Electro Pass Reminder",
    width: 800,
    height: 550,
    icon: path.join(__dirname, "assets/images/icon.png"),
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "template/mainWindow.html"),
    protocol: "file:",
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })

}

app.on('ready', createLoginWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (loginWindow === null) {
    createWindow()
  }
})


ipcMain.on("login:check", function(e, get_user_info){

  if(JSON.stringify(get_user_info) === JSON.stringify(user_info)){
    createMainWindow();
    loginWindow.hide();
  }else{
    loginWindow.webContents.send("login:error");
  }

});