const crypto = require("crypto")

module.exports.generateHash = (password) => {
    const salt = crypto.randomBytes(32).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    return {
        salt,
        hash
    }
}

module.exports.isValid = (password, hash, salt) =>
{
    const passwordHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
    return hash === passwordHash
}