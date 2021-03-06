const superagent = require("superagent");
const fx = require("../../Functions/load_fx");
let API_URL = "https://osu.ppy.sh/api/v2/";

module.exports = async function osuset(osu_key, message, ...args) {
    if (args[0]) {
        try {
            let username = args.join(" ");
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
        fx.general.generalEmbed("Error", "No osu! username specified.", message, "#FF0000");
    }
}