const fx = require("../../Functions/load_fx");
module.exports = function avatar(message, ...args) {
    let member = message.member;
    if (message.mentions.members.first()) member = message.mentions.members.first();

    if (member) {
        message.channel.send(member.displayAvatarURL({size: 1024, format: "png", dynamic: "true"}));
    } else {
        fx.general.generalEmbed("Error", "Member not found", message, "#FF0000");
    }
}