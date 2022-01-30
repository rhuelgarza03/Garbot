const fs = require("fs");

function todo(message, ...args) {
    let list = JSON.parse(fs.readFileSync("src/Data/todo.json"));
    if (args[0] == "add") { // add to list
        list.push(args.join(" "));
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log("written to todo.json")} );
        message.channel.send("Added to todo list.");
    } else if (args[0] == "delete" && args[1]) { // delete item from list
        let num = parseInt(args[1]);
        list.splice(num-1, 1);
        fs.writeFile("src/Data/todo.json", JSON.stringify(list), () => {console.log("removed to todo.json")} );
        message.channel.send("Removed from todo list.");
    } else { // display list
        message.channel.send("**Garbot todo list:** \r\n" + "``" + `${list.join(" \r\n")}` + "``");
    }
}

module.exports = {
    todo
}