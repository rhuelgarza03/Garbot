const fs = require("fs");
const fx = require("../../Functions/load_fx");
let currency = "$";

module.exports = function balance(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let mention = fx.economy.parseMentions(message);
    if (mention) { // user mentioned
        mention = mention.first();
        if (!obj[mention.user.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            fx.economy.econActionEmbed(`${mention.displayName}'s balance`, 
                `**Cash:** ${currency}${obj[mention.user.id].cash} \r\n **Bank:** ${currency}${obj[mention.user.id].bank}`,
                message,
                "#333333"
            );
        }
    } else { // no user mentioned
        if (!obj[message.author.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            fx.economy.econActionEmbed(`${message.member.displayName}'s balance`, 
                `**Cash:** ${currency}${obj[message.author.id].cash} \r\n **Bank:** ${currency}${obj[message.author.id].bank}`,
                message,
                "#333333"
            );
        }
    }
}