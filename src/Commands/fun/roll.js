module.exports = function roll(message, ...args) {
    let max = 100;
    if (!isNaN(parseFloat(args[0])) && isFinite(args[0]) && args[0] > 0) {
        max = args[0];
    }
    let random = Math.floor(Math.random() * (max - 1 + 1) + 1);
    message.channel.send(`${message.member.displayName} rolled a ${random}!`);
}