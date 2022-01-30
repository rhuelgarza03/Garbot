const { MessageEmbed } = require("discord.js");

//move2fx
function generalEmbed(title, value, prevmessage, color) {
    let embed = new MessageEmbed()
        .setAuthor(name=prevmessage.content, iconURL=prevmessage.member.displayAvatarURL())
        .addField(title, value)
        .setColor(color);
    prevmessage.channel.send({ embeds: [embed] });
}

// need to manually add stuff for new commands
let helpCommands = [
    { cmd: ">>help {page}", desc: "Display a helpful list of commands." },
    { cmd: ">>userinfo {@member}", desc: "Display some basic info on a member." },
    { cmd: ">>avatar {@member}", desc: "Display a server member's avatar." },
    { cmd: ">>nickname [@member] [nickname]", desc: "Set a member's nickname." },
    { cmd: ">>annoy [message]", desc: "annoy the dev by sending them a direct message." },

    { cmd: ">>osu {osu username}", desc: "Get stats for an osu! standard user profile. You can also tie a profile to your account with >>osuset" },
    { cmd: ">>osuset [osu username]", desc: "Adds an osu profile to your discord account for command convenience." },
    { cmd: ">>recent [osu username/@member]", desc: "Display a user's most recent play. (failed scores not included yet)" },

    { cmd: ">>roll {max number} ", desc: "Roll a random number from 1 to 100, or the number specified." },
    { cmd: ">>work", desc: "Work to earn money in Garbot's economy! Doing this automatically creates a profile for you." },
    { cmd: ">>balance {@member}", desc: "Display a member's economy balance. Requires an economy profile." },
    { cmd: ">>deposit [funds]", desc: "Deposit cash into your bank account. Requires an economy profile." },
    { cmd: ">>withdraw [funds]", desc: "Withdraw cash from your bank account. Requires an economy profile." },
    { cmd: ">>send [@member] [funds]", desc: "Send cash to another user. Requires an economy profile." },
    { cmd: ">>buy [item] {quantity}", desc: "Buy an item from the economy store! Requires an economy profile." },
    { cmd: ">>inventory {@member}", desc: "Display a member's inventory. Requires an economy profile." },
    { cmd: ">>store {page}", desc: "Browse through the economy store! Requires an economy profile." },
    { cmd: ">>additem [name] [price] [item description]", desc: "Add an item to the economy store." },
    { cmd: ">>addresponse [response]", desc: "Add a work response for the >>work command." },

    { cmd: ">>todo [message]", desc: "Display my todo list. optional parameters are ``add`` and ``delete``." }
];


//
function help(message, ...args) {
    let cmdsPerPage = 5;
    
    let pages = Math.ceil(helpCommands.length / cmdsPerPage);
    let pageIndex = 1;
    if (!isNaN(args[0]) && Math.floor(args[0]) >= 1 && Math.floor(args[0]) <= pages) pageIndex = Math.floor(args[0]);

    let arrayIndex = 0;
    if (pageIndex > 1) arrayIndex = (pageIndex-1)*cmdsPerPage;

    let embed = new MessageEmbed()
        .setTitle("Garbot 0.7!")
        .setThumbnail(message.client.user.avatarURL({size: 2048, format: "png", dynamic: "true"}))
        .addField( 
            `Commands for Garbot (page ${pageIndex} of ${pages})`, "[brackets] mean **required**" +
            "\r\n {curly brackets} mean **optional**" +
            "\r\n -----------------------------------------------------"
        )
        .setFooter("Garbot is an open source discord.js project by garhu. You can check the GitHub repository at https://github.com/rhuelgarza03/Garbot");
    for (let i = arrayIndex; i < arrayIndex+cmdsPerPage; i++) {
        embed.addField(helpCommands[i].cmd, helpCommands[i].desc);
        if (i >= pages) break;
    }
    message.channel.send({embeds: [embed]});
}

function avatar(message, ...args) {
    let member = message.member;
    if (args[0]) member = message.mentions.members.first();

    if (member) {
        let avatar = member.displayAvatarURL({size: 1024, format: "png", dynamic: "true"});
        message.channel.send(avatar);
    } else {
        generalEmbed("Error", "Member not found", message, "#FF0000");
    }
}

function annoy(client, message, ...args) {
    if (!args[0]) {
        generalEmbed("Error", "You have to send *something*...", message, "#FF0000");
    } else {
        client.users.fetch("474660775105921056").then((user) => { user.send(message.content) });
    }
}

function nickname(message, ...args) {
    if (message.mentions.members.first()) {
        let member = message.mentions.members.first();
        let msg = message.content.split(" ").slice(2);
        console.log(msg)
        let nickname = msg.join(" ");

        member.setNickname(nickname)
        .then((member) => message.channel.send(`${member.user.username}'s nickname has been changed to ${nickname}!`))
        .catch((error) => message.channel.send("I cannot perform that action. D:"));
    } else {
        generalEmbed("Error", "Please specify a @user and nickname.", message, "#FF0000");
    }
}

function userinfo(message, ...args) {
    let member = message.member;
    if (args[0]) member = message.mentions.members.first();

    if (member) {
        let embed = new MessageEmbed()
        .setThumbnail(member.displayAvatarURL({size: 2048, format: "png", dynamic: "true"}))
        .addFields(
            { name: `User info for ${member.user.tag}`, value: `Account created on ${member.user.createdAt.toString()}`},
            { name: "Status", value: `${member.presence.status}`, inline: true},
            { name: "Server Join Date", value: `${member.joinedAt.toString()}`, inline: true }
        )
        .setFooter(`User ID: ${member.id}`);
        message.channel.send({embeds: [embed]});
    } else {
        generalEmbed("Error", "Member not found", message, "#FF0000");
    }
}

module.exports = {
    help,
    avatar,
    annoy,
    nickname,
    userinfo
}