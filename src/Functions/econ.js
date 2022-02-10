const { MessageEmbed } = require("discord.js");

// balance(), send(), inventory()
function parseMentions(message) {
    if (message.mentions.members.first()) {
        return message.mentions.members;
    } else {
        return null;
    }
}

// balance(), deposit(), withdraw(), send(), buy()
function econActionEmbed(title, value, prevmessage, color) {
    let embed = new MessageEmbed()
        .setAuthor(name=prevmessage.content, iconURL=prevmessage.member.displayAvatarURL())
        .addField(title, value)
        .setColor(color);
    prevmessage.channel.send({ embeds: [embed] });
}

module.exports = {
    parseMentions,
    econActionEmbed
}