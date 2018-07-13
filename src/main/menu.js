"use strict";

const { Menu, nativeImage, app } = require("electron");
const appRoot = app.getAppPath();

const fileSubmenu = () => [
    {
        label: "Prisoner",
        submenu: [
            {
                label: "Add",
                click() {
                }
            },
            {
                label: "View",
                click() {
                }
            },
            {
                label: "Delete",
                click() {
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
                click() {
                }
            },
            {
                label: "View",
                click() {
                }
            },
            {
                label: "Delete",
                click() {
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
                click() {
                }
            },
            {
                label: "View",
                click() {
                }
            },
            {
                label: "Delete",
                click() {
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
        //icon: nativeImage.createFromPath(`${appRoot}/src/main/images/handcuff.jpeg`),
        click() {
            
        }
    },
    {
        label: "Warders",
        click() {
        }
    },
    { type: "separator" },
    {
        label: "Fullscreen",
        click() {
        }
    },
    { type: "separator" },
    {
        label: "Kiosk",
        click() {
        }
    },
    {
        label: "Zoom In",
        click() {
        }
    },
    {
        label: "Zoom Out",
        click() {
        }
    }
];

const editSubMenu = () => [
    {
        label: "Undo operation",
        click() {
        }
    },
    {
        label: "Redo Operation",
        click() {
        }
    },
    { type: "separator" },
    {
        label: "settings",
        click() {
        }
    }
];

const helpSubMenu = () => [
    {
        label: "About",
        click() {
        }
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
        {
            label: "Edit",
            submenu: editSubMenu()
        },
        {
            label: "Help",
            submenu: helpSubMenu()
        }
    ]));
};

