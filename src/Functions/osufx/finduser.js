const fs = require("fs");
module.exports = async function findUser(discordid) {
    let obj = {};
    obj = JSON.parse(fs.readFileSync("src/Data/osu_users.json"));
    let osu = obj[discordid];
    if (osu === undefined) {
        return;
    } else {
        return osu;
    }
}