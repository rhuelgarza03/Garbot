const fs = require("fs");
const fx = require("../../Functions/load_fx");
module.exports = function todo(message, ...args) {
    let actions = args.map(element => {
        return element.toLowerCase();
    });
    let list = JSON.parse(fs.readFileSync("src/Data/todo.json"));

    if (actions[0] === "add" && args[1]) {
        list.push(args.slice(1).join(" "));
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log(`index ${list.length} added to todo.json`)} );
        message.channel.send(`Index ${list.length} added to todo list.`);
    }
    else if (actions[0] === "delete" && !isNaN(args[1])) {
        let num = parseInt(args[1]);
        list.splice(num-1, 1);
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log(`index ${num} removed from todo.json`)} );
        message.channel.send(`Index ${num} removed from todo list.`);
    } 
    else {
        for (let i = 0; i < list.length; i++) {
            list[i] = (i+1) + ". " + list[i];
        }
        fx.general.generalEmbed("Todo list:", list.join(" \r\n"), message, "#333333");
    }
}