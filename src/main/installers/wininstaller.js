const { createWindowsInstaller } = require("electron-winstaller");
const path = require("path");

const setupConfig = () => {
    const output = path.join("./", "dist");
    return Promise.resolve({
        appDirectory: path.join(output, "Prison Management System-win32-ia32/"),
        authors: "zombieleet",
        description: "prison management system, is a software created in partial completion of the 4 years programmed required by law for every computer science student in Nigera. This software eases the pain in keeping prison records",
        noMsi: true,
        outputDirectory: path.join(output, "windows-installer"),
        exe: 'prms.exe',
        setupExe: 'prms.exe',
        setupIcon: path.join("./", "src", "main", "images", 'logo.ico')
    })
};

setupConfig().then( createWindowsInstaller ).catch( err => {
    console.error(err.message || err);
    process.exit(1);
});