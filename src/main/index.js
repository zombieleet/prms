
require("./util.js").handleSquirrel();
require("electron-squirrel-startup");

const { dialog, app, BrowserWindow, globalShortcut, nativeImage } = require("electron");

const appRoot = app.getAppPath();
const path = require("path");

if ( process.env.NODE_ENV === "development" )
    require("electron-reload")(appRoot, {
        electron: path.join(appRoot, "node_modules", ".bin", "electron")
    });


const cellCollection = new(require("nedb"))({
    filename: path.join(app.getPath("userData"), "cell.db"),
    autoload: true
});

cellCollection.count({}, ( err, count ) => {
    if ( err ) {
        dialog.showErrorBox("unexpected error", "cannot initiaize database");
        return ;
    }
    if ( count !== 0 )
        return ;
    for ( let i = 1; i < 300 ; i++ ) {
        cellCollection.insert( { cellNumber: i, filledUp: false, maxCellMate: 4 } , ( err, doc ) => {
            if ( err ) {
                dialog.showErrorBox("unexpected error", "cannot initiaize database");
                return ;
            }
        });
    }
});

app.on("ready", () => {

    require("./menu.js")();

    let win = new BrowserWindow({
        center: true,
        title: "Prison Management System",
        backgroundColor: "#2e2c29",
        icon: nativeImage.createFromPath(`${appRoot}/src/main/images/logo.png`),
        webPreferences: {
            nodeIntegrationInWorker: true
        }
    });

    win.loadURL(`file://${appRoot}/src/renderer/html/loading.html`);

    win.on("close", () => {
        win = undefined;
        app.quit();
    });

    if ( process.env.NODE_ENV === "development" ) {
        win.webContents.openDevTools({
            mode: "bottom"
        });
    }
    
    win.maximize();

    app.setName("Prison Management System");
    app.setVersion("1.0");
    
});

app.on("will-quit", () => {
    app.quit();
});