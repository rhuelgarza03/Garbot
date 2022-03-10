const fs = require("fs");
module.exports = function checkFiles() {
    let folderPaths = [
        "./src/Data",
        "./src/Data/economy"
    ];
    let filePaths = [
        folderPaths[1] + "/workresponses.json",
        folderPaths[1] + "/shop.json",
        folderPaths[0] + "/todo.json",
        folderPaths[1] + "/users.json",
        folderPaths[0] + "/osu_users.json",
        folderPaths[0] + "/serverPrefs.json"
    ];

    for (let i = 0; i < folderPaths.length; i++) {
        try {
            if (fs.existsSync(folderPaths[i])) {
                console.log(`  ${folderPaths[i]} exists`);
            } else {
                console.log(`  ${folderPaths[i]} does not exist, creating...`);
                fs.mkdirSync(folderPaths[i], { recursive: true });
                console.log(`  ${folderPaths[i]} created.`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    for (let i = 0; i < filePaths.length; i++) {
        try {
            if (fs.existsSync(filePaths[i])) {
                console.log(`  ${filePaths[i]} exists`);
            } else {
                console.log(`  ${filePaths[i]} does not exist, creating...`);
                let content = {};
                if (i == 0 || i == 1 || i == 2) { content = [] } //this is here solely because I stored some data as arrays instead of objects
                fs.writeFile(filePaths[i].substring(2), JSON.stringify(content), () => {console.log(`  ${filePaths[i]} created.`)});
            }
        } catch (error) {
            console.log(error);
        }
    }
}