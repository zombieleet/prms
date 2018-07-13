const { app, BrowserWindow, nativeImage } = require("electron");

const electronCompile = require("electron-compile");
const { enableLiveReload } = electronCompile;

const appRoot = app.getAppPath();

const jade = require("jade");
const path = require("path");

require("electron-reload")(appRoot, {
    electron: path.join(appRoot, "node_modules", ".bin", "electron")
});

app.on("ready", () => {

    require("./menu.js")();
    
    electronCompile.init(appRoot, require.resolve("./index.js"));
    
    let win = new BrowserWindow({
        center: true,
        title: "Prison Management System",
        icon: nativeImage.createFromPath(`${appRoot}/src/main/images/logo.png`)
    });
    
    win.loadURL( "data:text/html," + encodeURIComponent(jade.renderFile(`${appRoot}/src/renderer/pug/index.jade`)));

    win.on("close", () => {
        win = undefined;
    });

    win.webContents.openDevTools({
        mode: "bottom"
    });
    
    win.maximize();
    
    app.setName("Prison Management System");
    app.setVersion("1.0");
    
});
