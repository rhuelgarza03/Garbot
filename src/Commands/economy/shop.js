const { MessageEmbed } = require("discord.js");
const fs = require("fs");
let currency = "$";

module.exports = function shop(message, ...args) { // shop items should NEVER have a number in them
    let itemArray = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));
    let itemsPerPage = 5;

    let pages = Math.ceil(itemArray.length / itemsPerPage);
    let pageIndex = 1;
    if (!isNaN(args[0]) && Math.floor(args[0]) >= 1 && Math.floor(args[0]) <= pages) pageIndex = Math.floor(args[0]);

    let arrayIndex = 0;
    if (pageIndex > 1) arrayIndex = (pageIndex-1)*itemsPerPage;

    let shopEmbed = new MessageEmbed()
        .setAuthor(name=message.content, iconURL=message.member.displayAvatarURL())
        .setTitle(`The Shop (page ${pageIndex} of ${pages})`)
        .setDescription("a pretty epic shop where you buy stuff \r\n-----------------------------------------------------")
        .setThumbnail(message.client.user.avatarURL({size: 1024, format: "png", dynamic: "true"}))
        .setColor("#333333");
    for (let i = arrayIndex; i < arrayIndex+itemsPerPage; i++) {
        if (!itemArray[i]) continue;
        shopEmbed.addField(`${itemArray[i].name} : ${currency}${itemArray[i].price}`, itemArray[i].desc);
    }
    message.channel.send({ embeds: [shopEmbed] });
}