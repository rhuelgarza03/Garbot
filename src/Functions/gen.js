const { MessageEmbed } = require("discord.js");
const fs = require("fs");

function checkFiles() {
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

function checkPrefix(defaultPrefix, guildId) {
    let prefs = JSON.parse(fs.readFileSync("src/Data/serverPrefs.json"));
    if (prefs[guildId].prefix) {
        return prefs[guildId].prefix;
    } else {
        return defaultPrefix;
    }
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
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let hour = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let min = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sec = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hour + min + sec;
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    checkFiles,
    checkPrefix,
    generalEmbed,
    secondsToHms,
    numberWithCommas
}