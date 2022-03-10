module.exports = function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let hour = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let min = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sec = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hour + min + sec;
}