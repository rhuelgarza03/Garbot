const { MessageEmbed } = require("discord.js");
const fx = require("../../Functions/load_fx");
module.exports = function userinfo(message, ...args) {
    let member = message.member;
    if (message.mentions.members.first()) member = message.mentions.members.first();

    if (member) {
        let status;
        try {
            switch (member.presence.status) {
                case "online":
                    status = "online";
                    break;
                case "idle":
                    status = "idle";
                    break;
                case "dnd":
                    status = "do not disturb";
                    break;
                default:
                    status = "offline";
                    break;
            }
        } catch (error) {
            console.log(error);
            status = "offline";
        }
        let embed = new MessageEmbed()
        .setThumbnail(member.displayAvatarURL({size: 1024, format: "png", dynamic: "true"}))
        .addFields(
            { name: `User info for ${member.user.tag}`, value: `Account created on ${member.user.createdAt.toString()}`},
            { name: "Status", value: status, inline: true},
            { name: "Server Join Date", value: member.joinedAt.toString(), inline: true }
        )
        .setFooter(`User ID: ${member.id}`);
        message.channel.send({embeds: [embed]});
    } else {
        fx.general.generalEmbed("Error", "Member not found", message, "#FF0000");
    }
}