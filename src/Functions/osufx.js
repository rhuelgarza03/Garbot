async function assignUser(discordid, osuname) {
    let obj = {};
    obj = JSON.parse(fs.readFileSync("src/Data/osu_users.json"));
    obj[discordid] = osuname;
    fs.writeFile("src/Data/osu_users.json", JSON.stringify(obj), () => {console.log(`osu! user ${osuname} assigned to ${discordid} in osu_users.json`)} );
}

async function findUser(discordid) {
    let obj = {};
    obj = JSON.parse(fs.readFileSync("src/Data/osu_users.json"));
    let osu = obj[discordid];
    if (osu === undefined) {
        return;
    } else {
        return osu;
    }
}

module.exports = {
    assignUser,
    findUser
}