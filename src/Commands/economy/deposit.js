const fs = require("fs");
const fx = require("../../Functions/load_fx");
let currency = "$";

module.exports = function deposit(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let depositAmount = parseInt(args[0]);

    if (!obj[message.author.id]) {
        fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
    } 
    else if (obj[message.author.id].cash <= 0) {
        fx.economy.econActionEmbed("Error", "You have no cash right now.", message, "#FF0000");
    }
    else if (!args[0]) {
        fx.economy.econActionEmbed("Error", "No amount specified.", message, "#FF0000");
    }
    else if (args[0] === "all") {
        obj[message.author.id].bank += obj[message.author.id].cash;
        fx.economy.econActionEmbed("Deposit successful!", `You deposited ${currency}${obj[message.author.id].cash} into your bank account.`, message, "#333333");
        obj[message.author.id].cash = 0;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} deposited ${currency}${obj[message.author.id].cash}`)} );
    } 
    else if (isNaN(args[0])) {
        fx.economy.econActionEmbed("Error", "Invalid input.", message, "#FF0000");
    } 
    else if (depositAmount > obj[message.author.id].cash) {
        fx.economy.econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
    } 
    else if (depositAmount <= 0) {
        fx.economy.econActionEmbed("Error", "You can't deposit nothing.", message, "#FF0000");
    } 
    else {
        obj[message.author.id].bank += depositAmount;
        fx.economy.econActionEmbed("Deposit successful!", `You deposited ${currency}${depositAmount} into your bank account.`, message, "#333333");
        obj[message.author.id].cash -= depositAmount;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} deposited ${currency}${depositAmount}`)} );
    }
}