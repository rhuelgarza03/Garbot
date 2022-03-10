const fs = require("fs");
const fx = require("../../Functions/load_fx");
let currency = "$";

module.exports = function withdraw(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let withAmount = parseInt(args[0]);

    if (!obj[message.author.id]) {
        fx.economy.econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
    } 
    else if (obj[message.author.id].bank <= 0) {
        fx.economy.econActionEmbed("Error", "You have no money to withdraw right now.", message, "#FF0000");
    }
    else if (!args[0]) {
        fx.economy.econActionEmbed("Error", "No amount specified.", message, "#FF0000");
    }
    else if (args[0].toLowerCase() === "all") {
        obj[message.author.id].cash += obj[message.author.id].bank;
        fx.economy.econActionEmbed("Withdraw successful!", `You withdrew ${currency}${obj[message.author.id].bank} from your bank account.`, message, "#333333");
        obj[message.author.id].bank = 0;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} withdrew ${currency}${obj[message.author.id].bank}`)} );
    } 
    else if (isNaN(args[0])) {
        fx.economy.econActionEmbed("Error", "Invalid input.", message, "#FF0000");
    } 
    else if (withAmount > obj[message.author.id].bank) {
        fx.economy.econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
    } 
    else if (withAmount <= 0) {
        fx.economy.econActionEmbed("Error", "You can't withdraw nothing.", message, "#FF0000");
    } 
    else {
        obj[message.author.id].cash += withAmount;
        fx.economy.econActionEmbed("Withdrawal successful!", `You withdrew ${currency}${withAmount} from your bank account.`, message, "#333333");
        obj[message.author.id].bank -= withAmount;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} withdrew ${currency}${withAmount}`)} );
    }
}