const fx = require("../../Functions/load_fx");
module.exports = function annoy(client, message, ...args) {
    if (args[0]) {
        client.users.fetch("474660775105921056").then((user) => { user.send(message.content) });
        message.channel.send("Message sent!");
    } else {
        fx.general.generalEmbed("Error", "You have to send *something*...", message, "#FF0000");
    }
}