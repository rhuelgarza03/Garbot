const superagent = require("superagent");
require("dotenv").config();
module.exports = async function get_access_token() {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    let body = {
        "client_id": process.env.GARBOT_OSU_CLIENT_ID,
        "client_secret": process.env.GARBOT_OSU_CLIENT_SECRET,
        "grant_type": "client_credentials",
        "scope": "public"
    }
    let thingy = await superagent.post("https://osu.ppy.sh/oauth/token/").send(body).set(headers);
    process.env.OSU_ACCESS_TOKEN = thingy.body.access_token;
    process.env.OSU_ACCESS_TOKEN_EXPIRATION = thingy.body.expires_in;
}
// // // // // // // // // // // WYSI