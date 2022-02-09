const { MessageEmbed } = require("discord.js");
const fs = require("fs");

function checkPrefix(guildId) {
    let prefs = JSON.parse(fs.readFileSync("src/Data/serverPrefs.json"));
    return prefs[guildId].prefix;
}

function generalEmbed(title, value, prevmessage, color) {
    let embed = new MessageEmbed()
        .setAuthor(name=prevmessage.content, iconURL=prevmessage.member.displayAvatarURL())
        .addField(title, value)
        .setColor(color);
    prevmessage.channel.send({ embeds: [embed] });
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

function numberWithCommas(num) { // add commas to any big number
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
    checkPrefix,
    generalEmbed,
    secondsToHms,
    numberWithCommas,
    assignUser,
    findUser
}