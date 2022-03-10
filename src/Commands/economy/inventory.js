const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const fx = require("../../Functions/load_fx");

module.exports = function inventory(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    let mention = fx.economy.parseMentions(message);
    
    if (mention) { // user mentioned
        mention = mention.first();
        if (!obj[mention.user.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            let index;
            let keys = Object.keys(obj[mention.user.id].inv);
            let values = Object.values(obj[mention.user.id].inv);
            let embed = new MessageEmbed()
                .setAuthor(name=message.content, iconURL=mention.displayAvatarURL())
                .setTitle(`${mention.displayName}'s Inventory`)
                .setColor("#333333");
            for (let i = 0; i < keys.length; i++) {
                index = shop.findIndex(x => x.name === keys[i]);
                embed.addField(`${values[i]} ${keys[i]}(s)`, `${shop[index].desc}`);
            }
            message.channel.send({ embeds: [embed] });
        }
    } else { // no user mentioned
        if (!obj[message.author.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            let index;
            let keys = Object.keys(obj[message.author.id].inv);
            let values = Object.values(obj[message.author.id].inv);
            let embed = new MessageEmbed()
                .setAuthor(name=message.content, iconURL=message.member.displayAvatarURL())
                .setTitle(`${message.member.displayName}'s Inventory`)
                .setColor("#333333");
            for (let i = 0; i < keys.length; i++) {
                index = shop.findIndex(x => x.name === keys[i]);
                embed.addField(`${values[i]} ${keys[i]}(s)`, `${shop[index].desc}`);
            }
            message.channel.send({ embeds: [embed] });
        }
    }
}