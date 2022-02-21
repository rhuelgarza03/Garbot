const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

const fx = {
    gen: require("../Functions/gen"),
    osu: require("../Functions/osufx")
}

let API_URL = "https://osu.ppy.sh/api/v2/";

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
            fx.osu.assignUser(message.author.id, osuname);
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
        username = await fx.osu.findUser(message.author.id);
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
                `🢝   x${score.max_combo}/${beatmap.max_combo} 🢝 ${fx.gen.numberWithCommas(score.score)} 🢝 [${score.statistics.count_300}/${score.statistics.count_100}/${score.statistics.count_50}/${score.statistics.count_miss}]`
            )
            .setFooter(`score set ${(fx.gen.secondsToHms(Math.round((now-date)/1000)))} ago`);
        message.channel.send({embeds: [info]});
    }

    let username = undefined;
    if (args[0]) {
        username = args.join(" ");
    } else {
        username = await fx.osu.findUser(message.author.id);
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