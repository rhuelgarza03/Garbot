module.exports = function ping(client, message) {
    message.channel.send(`${client.ws.ping}ms`);
}