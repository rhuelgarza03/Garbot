const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const fx = require("../../Functions/load_fx");

let API_URL = "https://osu.ppy.sh/api/v2/";

// check osu profile stats
module.exports = async function osu(osu_key, message, ...args) {
    let username = undefined;
    if (args[0]) {
        if (message.content.includes("\"")) {
            let array = args.join(" ").match(/[^\s"]+|"([^"]*)"/gi);
            let noquotes = array.map(element => { return element.replace(/['"]+/g, '') });
            username = noquotes[0];
        } else {
            username = args[0];
        }
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