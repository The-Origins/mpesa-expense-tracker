const crypto = require("crypto")
const fs = require("fs")

const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength:4096,
    publicKeyEncoding:{
        type:"pkcs1",
        format:"pem"
    },
    privateKeyEncoding:{
        type:"pkcs1",
        format:"pem"
    }
})

fs.writeFileSync("private_key.pem", keyPair.privateKey)
fs.writeFileSync("public_key.pem", keyPair.publicKey)