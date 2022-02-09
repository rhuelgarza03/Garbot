const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const WorkedRecently = new Set();
let workCooldown = 3;
let currency = "$";

// move2fx
// for balance(), send(), inventory()
function parseMentions(message) {
    if (message.mentions.members.first()) {
        return message.mentions.members;
    } else {
        return null;
    }
}
// move2fx
// for balance(), deposit(), withdraw(), send(), buy()
function econActionEmbed(title, value, prevmessage, color) {
    let embed = new MessageEmbed()
        .setAuthor(name=prevmessage.content, iconURL=prevmessage.member.displayAvatarURL())
        .addField(title, value)
        .setColor(color);
    prevmessage.channel.send({ embeds: [embed] });
}


function work(message, ...args) {
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

function balance(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let mention = parseMentions(message);
    if (mention) { // user mentioned
        mention = mention.first();
        if (!obj[mention.user.id]) {
            econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            econActionEmbed(`${mention.displayName}'s balance`, 
                `**Cash:** ${currency}${obj[mention.user.id].cash} \r\n **Bank:** ${currency}${obj[mention.user.id].bank}`,
                message,
                "#333333"
            );
        }
    } else { // no user mentioned
        if (!obj[message.author.id]) {
            econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            econActionEmbed(`${message.member.displayName}'s balance`, 
                `**Cash:** ${currency}${obj[message.author.id].cash} \r\n **Bank:** ${currency}${obj[message.author.id].bank}`,
                message,
                "#333333"
            );
        }
    }
}

function deposit(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let depositAmount = parseInt(args[0]);

    if (!obj[message.author.id]) {
        econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
    } 
    else if (obj[message.author.id].cash <= 0) {
        econActionEmbed("Error", "You have no cash right now.", message, "#FF0000");
    }
    else if (!args[0]) {
        econActionEmbed("Error", "No amount specified.", message, "#FF0000");
    }
    else if (args[0] === "all") {
        obj[message.author.id].bank += obj[message.author.id].cash;
        econActionEmbed("Deposit successful!", `You deposited ${currency}${obj[message.author.id].cash} into your bank account.`, message, "#333333");
        obj[message.author.id].cash = 0;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} deposited ${currency}${obj[message.author.id].cash}`)} );
    } 
    else if (isNaN(args[0])) {
        econActionEmbed("Error", "Invalid input.", message, "#FF0000");
    } 
    else if (depositAmount > obj[message.author.id].cash) {
        econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
    } 
    else if (depositAmount <= 0) {
        econActionEmbed("Error", "You can't deposit nothing.", message, "#FF0000");
    } 
    else {
        obj[message.author.id].bank += depositAmount;
        econActionEmbed("Deposit successful!", `You deposited ${currency}${depositAmount} into your bank account.`, message, "#333333");
        obj[message.author.id].cash -= depositAmount;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} deposited ${currency}${depositAmount}`)} );
    }
}

function withdraw(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let withAmount = parseInt(args[0]);

    if (!obj[message.author.id]) {
        econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
    } 
    else if (obj[message.author.id].bank <= 0) {
        econActionEmbed("Error", "You have no money to withdraw right now.", message, "#FF0000");
    }
    else if (!args[0]) {
        econActionEmbed("Error", "No amount specified.", message, "#FF0000");
    }
    else if (args[0].toLowerCase() === "all") {
        obj[message.author.id].cash += obj[message.author.id].bank;
        econActionEmbed("Withdraw successful!", `You withdrew ${currency}${obj[message.author.id].bank} from your bank account.`, message, "#333333");
        obj[message.author.id].bank = 0;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} withdrew ${currency}${obj[message.author.id].bank}`)} );
    } 
    else if (isNaN(args[0])) {
        econActionEmbed("Error", "Invalid input.", message, "#FF0000");
    } 
    else if (withAmount > obj[message.author.id].bank) {
        econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
    } 
    else if (withAmount <= 0) {
        econActionEmbed("Error", "You can't withdraw nothing.", message, "#FF0000");
    } 
    else {
        obj[message.author.id].cash += withAmount;
        econActionEmbed("Withdrawal successful!", `You withdrew ${currency}${withAmount} from your bank account.`, message, "#333333");
        obj[message.author.id].bank -= withAmount;
        fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} withdrew ${currency}${withAmount}`)} );
    }
}

function send(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));

    let recipient = parseMentions(message);

    if (recipient) {
        recipient = recipient.first();
        let sendAmount = parseInt(args[1]);

        if (!obj[message.author.id]) {
            econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } 
        if (!obj[recipient.user.id]) {
            econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } 
        else if (recipient.user.id === message.author.id) {
            econActionEmbed("Error", "You can't send money to yourself.", message, "#FF0000");
        }
        else if (obj[message.author.id].cash <= 0) {
            econActionEmbed("Error", "You have no cash on hand to send right now.", message, "#FF0000");
        }
        else if (!args[1]) {
            econActionEmbed("Error", "No amount specified.", message, "#FF0000");
        }
        else if (args[1].toLowerCase() === "all") {
            obj[recipient.user.id].bank += obj[message.author.id].cash;
            econActionEmbed("Sent successfully!", `You sent ${currency}${obj[message.author.id].cash} to <@!${recipient.user.id}>'s bank account.`, message, "#333333");
            obj[message.author.id].cash = 0;
            fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} sent ${currency}${obj[message.author.id].cash} to user ${recipient.user.id}`)} );
        } 
        else if (isNaN(args[1])) {
            econActionEmbed("Error", "Invalid input.", message, "#FF0000");
        } 
        else if (sendAmount > obj[message.author.id].cash) {
            econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
        } 
        else if (sendAmount <= 0) {
            econActionEmbed("Error", "You can't send nothing.", message, "#FF0000");
        } 
        else {
            obj[recipient.user.id].bank += sendAmount;
            econActionEmbed("Sent successfully!", `You sent ${currency}${sendAmount} to <@!${recipient.user.id}>'s bank account.`, message, "#333333");
            obj[message.author.id].cash -= sendAmount;
            fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => {console.log(`user ${message.author.id} sent ${currency}${sendAmount} to user ${recipient.user.id}`)} );
        }
    } else {
        econActionEmbed("Error", "No user specified to send money to.", message, "#FF0000");
    }
}

function buy(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    if (args[0]) {
        // dumb code to get item name and amount of items
        let item = message.content.split(/\s+/);
        item.shift();
        let amount = 1; // default amount is 1 if not specified
        if (!isNaN(args[args.length - 1])) {
            item.pop();
            amount = Math.floor(args[args.length - 1]);
        }
        item = item.join(" ");

        let isItem = false;
        let itemIndex;
        for (let i = 0; i < shop.length; i++) {
            if (item.toLowerCase() == shop[i].name.toLowerCase()) { 
                isItem = true;
                itemIndex = i;
            }
        }

        if (isItem) {
            let cost = Math.floor(amount*parseInt(shop[itemIndex].price));

            if (!obj[message.author.id]) {
                econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
            } 
            else if (cost > obj[message.author.id].cash) {
                econActionEmbed("Error", "Insufficient funds.", message, "#FF0000");
            } // maybe add a "max" else if
            else {
                obj[message.author.id].inv[item] = amount;
                econActionEmbed("Purchase successful!", `You bought ${amount} ${item}(s)! You can check them in your inventory.`, message, "#333333");
                fs.writeFile("src/Data/economy/users.json", JSON.stringify(obj), () => { console.log(`user ${message.author.id} purchased ${amount} ${item}(s)`)} );
            }
        } else {
            econActionEmbed("Error", "That item does not exist!", message, "#FF0000");
        }
    } else {
        econActionEmbed("Error", "No item specified.", message, "#FF0000");
    }
}

function inventory(message, ...args) {
    let obj = JSON.parse(fs.readFileSync("src/Data/economy/users.json"));
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    let mention = parseMentions(message);
    
    if (mention) { // user mentioned
        mention = mention.first();
        if (!obj[mention.user.id]) {
            econActionEmbed("Error", "No economy account made for this user, they can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            let index;
            let keys = Object.keys(obj[mention.user.id].inv);
            let values = Object.values(obj[mention.user.id].inv);
            let embed = new MessageEmbed()
                .setAuthor(name=message.content, iconURL=mention.displayAvatarURL())
                .setTitle(`${mention.displayName}'s Inventory`)
                .setColor("#333333");
            for (let i = 0; i < keys.length; i++) {
                index = shop.findIndex(x => x.name === keys[i]);
                embed.addField(`${values[i]} ${keys[i]}(s)`, `${shop[index].desc}`);
            }
            message.channel.send({ embeds: [embed] });
        }
    } else { // no user mentioned
        if (!obj[message.author.id]) {
            econActionEmbed("Error", "No economy account made, you can create one automatically by doing >>work.", message, "#FF0000");
        } else {
            let index;
            let keys = Object.keys(obj[message.author.id].inv);
            let values = Object.values(obj[message.author.id].inv);
            let embed = new MessageEmbed()
                .setAuthor(name=message.content, iconURL=message.member.displayAvatarURL())
                .setTitle(`${message.member.displayName}'s Inventory`)
                .setColor("#333333");
            for (let i = 0; i < keys.length; i++) {
                index = shop.findIndex(x => x.name === keys[i]);
                embed.addField(`${values[i]} ${keys[i]}(s)`, `${shop[index].desc}`);
            }
            message.channel.send({ embeds: [embed] });
        }
    }
}

function shop(message, ...args) { // shop items should NEVER have a number in them
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

function additem(message, ...args) {
    let shop = JSON.parse(fs.readFileSync("src/Data/economy/shop.json"));

    let array = args.join(" ").match(/[^\s"]+|"([^"]*)"/gi);
    let noquotes = array.map(element => {
        return element.replace(/['"]+/g, '');
    })

    if (isNaN(noquotes[1])) {
        message.channel.send("price must be a number.");
    }
    else if (noquotes.length >= 3) {
        for (let i = 0; i < shop.length; i++) {
            if (noquotes[0].toLowerCase() == shop[i].name.toLowerCase()) {
                return message.channel.send("that item already exists in the shop.");
            }
        }
        shop.push({
            name: noquotes[0],
            price: parseInt(noquotes[1]),
            desc: noquotes[2]
        });
        fs.writeFile("src/Data/economy/shop.json", JSON.stringify(shop), () => { console.log("item added to shop.json") });
        message.channel.send("Item added to shop!");
    } 
    else {
        message.channel.send("not enough arguments.");
    }
}

function addresponse(message, ...args) {
    let list = JSON.parse(fs.readFileSync("src/Data/economy/workresponses.json"));

    let response = message.content.split(/\s+/);
    response.shift();
    response = response.join(" ");

    if (!response.includes("{x}")) {
        econActionEmbed("Error", "Work response missing ``{x}``", message, "#FF0000");
    } else {
        list.push(response);
        fs.writeFile("src/Data/economy/workresponses.json", JSON.stringify(list), () => { console.log("response added to workresponses.json") });
        econActionEmbed("Success!", "Work response added!", message, "#333333");
    }
}

module.exports = {
    work,
    balance,
    deposit,
    withdraw,
    send,
    buy,
    inventory,
    shop,
    additem,
    addresponse
}