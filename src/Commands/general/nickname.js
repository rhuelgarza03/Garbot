const fx = require("../../Functions/load_fx");
module.exports = function nickname(message, ...args) {
    if (message.mentions.members.first()) {
        let member = message.mentions.members.first();
        let nick = args.slice(1).join(" ");
        member.setNickname(nick)
        .then((member) => message.channel.send(`${member.user.username}'s nickname has been changed to ${nick}!`))
        .catch((error) => fx.general.generalEmbed("Error", "I cannot perform that action D:", message, "#FF0000"));
    } else {
        fx.general.generalEmbed("Error", "Please specify a @user and nickname.", message, "#FF0000");
    }
}