const electron = require('electron')
const url = require("url")
const path = require("path")
const fs = require("fs")
const {app, BrowserWindow, Menu, ipcMain} = electron;

var user_info = {}

fs.readFile("database/login.json", "utf8", function (err, content) {
  if (!err) {
    user_info = JSON.parse(content)
  } else {
    process.exit()
  }
})

let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    title: "Electro Pass Reminder",
    width: 800,
    height: 600,
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
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on("login:check", function(e, get_user_info){

  if(JSON.stringify(get_user_info) === JSON.stringify(user_info)){
    console.log("dogru");
  }else{
    mainWindow.webContents.send("login:error");
  }

});