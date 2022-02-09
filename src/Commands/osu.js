const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const fs = require("fs");

let API_URL = "https://osu.ppy.sh/api/v2/";
// json SUCKS!!!!!!!!!

//move2fx
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

//move2fx
function numberWithCommas(num) { // add commas to any big number
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//move2fx
async function assignUser(discordid, osuname) {
    let obj = {};
    obj = JSON.parse(fs.readFileSync("src/Data/osu_users.json"));
    obj[discordid] = osuname;
    fs.writeFile("src/Data/osu_users.json", JSON.stringify(obj), () => {console.log(`osu! user ${osuname} assigned to ${discordid} in osu_users.json`)} );
}

//move2fx
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


async function osuset(osu_key, message, ...args) {
    if (args[0]) {
        try {
            let username = args.join(" "); // join the words together if a name with spaces is entered
            let params = { "key": "username" }
            let endpoint = `users/${username}/osu`;
            let results = await superagent.get(`${API_URL}${encodeURI(endpoint)}`)
                .query(params)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${osu_key}`);
            let osuname = results.body.username;
            assignUser(message.author.id, osuname);
            message.channel.send(`Your osu! user has been set to ${osuname}!`);
        } catch (error) {
            message.channel.send("That osu! user does not exist!");
        }
    } else {
        message.channel.send("No osu! username specified.");
    }
}

async function osu(osu_key, message, ...args) {
    let username = undefined;
    if (args[0]) {
        username = args.join(" ");
    } else {
        username = await findUser(message.author.id);
    }

    try {
        let params = { "key": "username" }
        let endpoint = `users/${username}/osu`;
        let results = await superagent.get(`${API_URL}${encodeURI(endpoint)}`)
            .query(params)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${osu_key}`);
        let user = results.body;
        let info = new MessageEmbed()
            .setThumbnail(`${user.avatar_url}`)
            .setAuthor(`osu! info for ${user.username}`, `${user.avatar_url}`, `https://osu.ppy.sh/users/${user.id}`)
            .setDescription(
                `**Level:** ${user.statistics.level.current} + ${user.statistics.level.progress}%` +
                `\r\n **Bancho Rank:** #${user.statistics.global_rank} (${user.country.code} #${user.statistics.rank.country})` +
                `\r\n **PP:** ${user.statistics.pp} **Acc:** ${Math.round((user.statistics.hit_accuracy * 100)) / 100}%` +
                `\r\n **Play Count:** ${user.statistics.play_count} (${Math.round((parseInt(user.statistics.play_time) / 60 )/ 60)} hours)`
            );
        message.channel.send({embeds: [info]});
    } catch (error) {
        message.channel.send("That user does not exist!");
    }
}

async function recent(osu_key, message, ...args) {
    async function recentEmbed(userid) {
        // request user's most recent score
        let results = await superagent.get(`${API_URL}${encodeURI(`users/${userid}/scores/recent`)}`)
            .query({
                "limit": "1"
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${osu_key}`);
        let score = results.body[0];
        if (!score) {
            message.channel.send(`No recent scores found.`);
            return;
        }

        // request beatmap
        let results2 = await superagent.get(API_URL + encodeURI(`beatmaps/${score.beatmap.id}`))
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${osu_key}`);
        let beatmap = results2.body;

        // date for footer
        let now = new Date(); 
        let date = Date.parse(score.created_at);

        // mods/letter rank
        let mods = score.mods;
        if (mods[0]) {
            mods = mods.join();
        } else { mods = "Nomod"}
        let letterRank = message.client.emojis.cache.find(emoji => emoji.name === "garbot_" + score.rank.toLowerCase());

        // sr
        let sr = score.beatmap.difficulty_rating;
        if (mods.includes("DT") || mods.includes("HR") || mods.includes("FL")) {
            sr = "???"; // still need to add mod difficulty scaling
        }

        // embed for the recent score
        let info = new MessageEmbed() // 
            .setColor("#FFFFFF")
            .setAuthor(
                `Recent ${score.mode} score for ${score.user.username}: `, //text
                score.user.avatar_url, //pic
                `https://osu.ppy.sh/users/${score.user.id}` //url
            )
            .setThumbnail(`${score.beatmapset.covers.list}`)
            .setTitle(`${score.beatmapset.artist} - ${score.beatmapset.title} [${score.beatmap.version}] (${sr}*)`)
            .setURL(score.beatmap.url)
            .setDescription(// add pp prediction if fc / if not best play
                `🢝 ${letterRank} 🢝 **+${mods}** 🢝 **${Math.round(score.pp*100)/100}pp** 🢝 **${Math.round((score.accuracy*100)*100)/100}%** \r\n` +
                `🢝   x${score.max_combo}/${beatmap.max_combo} 🢝 ${numberWithCommas(score.score)} 🢝 [${score.statistics.count_300}/${score.statistics.count_100}/${score.statistics.count_50}/${score.statistics.count_miss}]`
            )
            .setFooter(`score set ${(secondsToHms(Math.round((now-date)/1000)))} ago`);
        message.channel.send({embeds: [info]});
    }

    let username = undefined;
    if (args[0]) {
        username = args.join(" ");
    } else {
        username = await findUser(message.author.id);
    }

    let params = { "key": "username" };
    let endpoint = `users/${username}/`;
    // retrieve user id for the embed
    let results = await superagent.get(`${API_URL}${encodeURI(endpoint)}`)
        .query(params)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${osu_key}`);
    recentEmbed(results.body.id);
}

module.exports = {
    osuset,
    osu,
    recent
}