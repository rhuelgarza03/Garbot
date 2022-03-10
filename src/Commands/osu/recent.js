const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const oj = require("ojsama");
const fx = require("../../Functions/load_fx");

let API_URL = "https://osu.ppy.sh/api/v2/";

// assume only mode is standard for now, add mania/ctb/taiko after 
async function standard_pp({ parser, mods, }) {
    await superagent.get(API_URL + encodeURI(`beatmaps/${score.beatmap.id}`))
}

module.exports = async function recent(osu_key, message, ...args) {
    async function recentEmbed(userid) {
        // get recent score
        let results = await superagent.get(API_URL + encodeURI(`users/${userid}/scores/recent`))
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

        // get beatmap
        let results2 = await superagent.get(API_URL + encodeURI(`beatmaps/${score.beatmap.id}`))
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${osu_key}`);
        let beatmap = results2.body;

        let parser = new oj.parser();
        await superagent.get("https://osu.ppy.sh/osu/" + beatmap.id)
            .then(res => {
                parser.feed(res.text);
                let map = parser.map;

                // score stats
                let m = score.mods;
                if (m[0]) {
                    m = m.join();
                } else { 
                    m = "";
                }
                let mods = oj.modbits.none;
                mods = oj.modbits.from_string(m || "");
                let acc = parseFloat((score.accuracy*100) + "%");
                let combo = parseInt(score.max_combo + "x");
                let miss = parseInt(score.statistics.count_miss + "m");

                let stars = new oj.diff().calc({map: map, mods: mods});
                let pp = oj.ppv2({
                    stars: stars,
                    combo: combo,
                    nmiss: miss,
                    acc_percent: acc
                });
                let max_combo = map.max_combo();
                combo = combo || max_combo;

                // fc calculation
                fcacc = Number((300 * score.statistics.count_300 + 100 * score.statistics.count_100 + 50 * score.statistics.count_50) / (300 * (score.statistics.count_300 + score.statistics.count_100 + score.statistics.count_50)) * 100).toFixed(2);
                let ppiffc = oj.ppv2({
                    stars: stars,
                    combo: max_combo,
                    nmiss: 0,
                    acc_percent: fcacc
                });
                //

                let now = new Date();
                let date = Date.parse(score.created_at);
                let letterRank = message.client.emojis.cache.find(emoji => emoji.name === "garbot_" + score.rank.toLowerCase());
                if (m == "") m = "Nomod";

                // embed for the recent score
                let info = new MessageEmbed() //
                    .setColor("#FFFFFF")
                    .setAuthor({
                        name: `Recent ${score.mode} score for ${score.user.username}: `, //text
                        iconURL: score.user.avatar_url, //pic
                        url: `https://osu.ppy.sh/users/${score.user.id}` //url
                    })
                    .setThumbnail(`${score.beatmapset.covers.list}`)
                    .setTitle(`${score.beatmapset.artist} - ${score.beatmapset.title} [${score.beatmap.version}] (${stars.toString().split(" ")[0]}*)`)
                    .setURL(score.beatmap.url)
                    .setDescription(// add pp prediction if fc / if not best play
                        `🢝 ${letterRank} 🢝 **+${m}** 🢝 **${pp.toString().split(" ").slice(0, 2).join(" ")}** (${ppiffc.toString().split(" ").slice(0, 2).join(" ")} for ${ppiffc.computed_accuracy.toString().split(" ").slice(0, 1).join("")} fc) 🢝 **${pp.computed_accuracy.toString().split(" ").slice(0, 1).join("")}** \r\n` +
                        `🢝 ${combo}/${max_combo}x 🢝 ${fx.general.numberWithCommas(score.score)} 🢝 [${score.statistics.count_300}/${score.statistics.count_100}/${score.statistics.count_50}/${score.statistics.count_miss}] 🢝 ${beatmap.status}`
                    )
                    .setFooter(`score set ${(fx.general.secondsToHms(Math.round((now-date)/1000)))} ago`);
                message.channel.send({embeds: [info]});
            })
            .catch(err => {
                message.channel.send("error during pp calculation");
                console.log(err);
            });
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