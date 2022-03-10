const fs = require("fs");

const WorkedRecently = new Set();
let workCooldown = 3;
let currency = "$";

module.exports = function work(message, ...args) {
    if (WorkedRecently.has(message.author.id)) {
        message.reply(`Working is on a ${workCooldown} second cooldown!`);
    } else {
        let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

        // create bank account if user doesn't have one
        if (!obj[message.author.id]) {
            obj[message.author.id] = { "cash": 0, "bank": 0, "inv": {} };
            fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`economy account created for user ${message.author.id}`)} );
        }

        // work payout calculation
        let min = 5;
        let max = 15;
        let payout = Math.floor(Math.random()*(max-min+1)+min);

        obj[message.author.id].cash = obj[message.author.id].cash + payout;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} worked and was paid ${payout}`)} );

        // message response
        let list = JSON.parse(fs.readFileSync("src/Data/economy/workresponses.json"));
        let response = list[Math.floor(Math.random() * list.length)];
        message.channel.send(response.replace("{x}", `${currency}${payout}`));
        
        WorkedRecently.add(message.author.id);
        setTimeout(() => {
            WorkedRecently.delete(message.author.id);
        }, workCooldown*1000);
    }
}