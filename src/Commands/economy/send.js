const fs = require("fs");
const fx = require("../../Functions/load_fx");
let currency = "$";

module.exports = function send(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let recipient = fx.economy.parseMentions(message);

    if (recipient) {
        recipient = recipient.first();
        let sendAmount = parseInt(args[1]);

        if (!obj[message.author.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } 
        if (!obj[recipient.user.id]) {
            fx.economy.econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } 
        else if (recipient.user.id === message.author.id) {
            fx.economy.econActionEmbed("Error", "You can't send money to yourself.", message, "#FF0000");
        }
        else if (obj[message.author.id].cash <= 0) {
            fx.economy.econActionEmbed("Error", "You have no cash on hand to send right now.", message, "#FF0000");
        }
        else if (!args[1]) {
            fx.economy.econActionEmbed("Error", "No amount specified.", message, "#FF0000");
        }
        else if (args[1].toLowerCase() === "all") {
            obj[recipient.user.id].bank += obj[message.author.id].cash;
            fx.economy.econActionEmbed("Sent successfully!", `You sent ${currency}${obj[message.author.id].cash} to <@!${recipient.user.id}>'s bank account.`, message, "#333333");
            obj[message.author.id].cash = 0;
            fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} sent ${currency}${obj[message.author.id].cash} to user ${recipient.user.id}`)} );
        } 
        else if (isNaN(args[1])) {
            fx.economy.econActionEmbed("Error", "Invalid input.", message, "#FF0000");
        } 
        else if (sendAmount > obj[message.author.id].cash) {
            fx.economy.econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
        } 
        else if (sendAmount <= 0) {
            fx.economy.econActionEmbed("Error", "You can't send nothing.", message, "#FF0000");
        } 
        else {
            obj[recipient.user.id].bank += sendAmount;
            fx.economy.econActionEmbed("Sent successfully!", `You sent ${currency}${sendAmount} to <@!${recipient.user.id}>'s bank account.`, message, "#333333");
            obj[message.author.id].cash -= sendAmount;
            fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} sent ${currency}${sendAmount} to user ${recipient.user.id}`)} );
        }
    } else {
        fx.economy.econActionEmbed("Error", "No user specified to send money to.", message, "#FF0000");
    }
}