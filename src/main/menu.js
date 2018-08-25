"use strict";

const { Menu, nativeImage, app, dialog } = require("electron");
const appRoot = app.getAppPath();

const fileSubmenu = () => [
    {
        label: "Home",
        click(mItem, { webContents } ) {
            webContents.send("prms::home");
        }
    },
    { type: "separator" },
    {
        label: "Prisoner",
        submenu: [
            {
                label: "Add",
                click(mItem, { webContents } ) {
                    webContents.send("prms::add:prisoner");
                }
            },
            {
                label: "View",
                click(mItem, { webContents } ) {
                    webContents.send("prms::view:prisoner");
                }
            },
            {
                label: "Delete",
                click(mItem, { webContents } ) {
                    webContents.send("prms::delete:prisoner");
                }
            }
        ]
    },
    { type: "separator" },
    {
        label: "Warder",
        submenu: [
            {
                label: "Add",
                click(mItem, { webContents } ) {
                    webContents.send("prms::add:warder");
                }
            },
            {
                label: "View",
                click(mItem, { webContents } ) {
                    webContents.send("prms::view:warder");
                }
            },
            {
                label: "Delete",
                click(mItem, { webContents } ) {
                    webContents.send("prms::delete:warder");
                }
            }
        ]
    },
    { type: "separator" },
    {
        label: "Visitors",
        submenu: [
            {
                label: "Add",
                click(mItem, { webContents } ) {
                    webContents.send("prms::add:visitor");
                }
            },
            {
                label: "View",
                click(mItem, { webContents } ) {
                    webContents.send("prms::view:visitor");
                }
            },
            {
                label: "Delete",
                click(mItem, { webContents } ) {
                    webContents.send("prms::delete:visitor");
                }
            }
        ]
    },
    { type: "separator" },
    {
        label: "Quit",
        click() {
            app.quit();
        }
    }
];

const viewSubMenu = () => [
    {
        label: "Prisoners",
        click( mItem , { webContents } ) {
            webContents.send("prms::view:prisoner");
        }
    },
    {
        label: "Warders",
        click( mItem, { webContents } ) {
            webContents.send("prms::view:warder");
        }
    },
    {
        label: "Visitors",
        click( mItem , { webContents } ) {
            webContents.send("prms::view:visitor");
        }
    },
    { type: "separator" },
    {
        label: "Fullscreen",
        accelerator: "f11",
        click(mItem, BrowserWindow ) {
            BrowserWindow.setFullScreen(!BrowserWindow.isFullScreen());
        }
    },
    { type: "separator" },
    {
        label: "Kiosk",
        click(mItem, BrowserWindow ) {
            BrowserWindow.setKiosk(!BrowserWindow.isKiosk());
        }
    },
    // {
    //     label: "Zoom In",
    //     click() {
    //     }
    // },
    // {
    //     label: "Zoom Out",
    //     click() {
    //     }
    // }
];

// const editSubMenu = () => [
//     {
//         label: "Undo operation",
//         click() {
//         }
//     },
//     {
//         label: "Redo Operation",
//         click() {
//         }
//     },
//     { type: "separator" },
//     {
//         label: "settings",
//         click() {
//         }
//     }
// ];

const helpSubMenu = () => [
    {
        label: "About",
        submenu: [
            {
                label: "Electron",
                click() {
                    dialog.showMessageBox({
                        type: "info",
                        title: "About Electron",
                        message: "Electron is a framework which allows webdevelopers to leverage their current skills in web development in building desktop applications. See more https://electron.com",
                        buttons: [ "Ok" ]
                    });
                }
            },
            {
                label: "Prison Management System",
                click() {
                    dialog.showMessageBox({
                        type: "info",
                        title: "About Prision Management System",
                        message: "Prison Management System is a desktop application built as part of the completion of the four (4) years program in computer science",
                        buttons: [ "Ok" ]
                    });
                }
            }
        ]
    },
    {
        label: "Docmentation",
        click() {
        }
    }
];

module.exports = () => {
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: "File",
            submenu: fileSubmenu()
        },
        {
            label: "View",
            submenu: viewSubMenu()
        },
        // {
        //     label: "Edit",
        //     submenu: editSubMenu()
        // },
        {
            label: "Help",
            submenu: helpSubMenu()
        }
    ]));
};

