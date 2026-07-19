const crypto = require("crypto");

// Determine input
const args = process.argv.slice(2)
const mode = args[0]
const password = args[1]
const plain_text = args[2]

const fs = require("fs");

// Define variables
const iterations = 250000
const key_length = 32
const digest = "sha256"
const algorithm = "aes-256-gcm"

if (mode === "encrypt") {
    // Generate Salt and iv
    const salt = crypto.randomBytes(16)
    const iv = crypto.randomBytes(12)

    // Generate a 256 bit key
    const derived_key = crypto.pbkdf2Sync(password, salt, iterations, key_length, digest)

    // Generate a cipher
    const cipher = crypto.createCipheriv(algorithm, derived_key, iv)

    const encrypt_one = cipher.update(plain_text, "utf8", "hex")
    const encrypt_two = cipher.final("hex")
    const tag = cipher.getAuthTag()

    const cipher_text = encrypt_one + encrypt_two
    const cipher_text_buffer = Buffer.from(cipher_text, "hex")
    const list = Buffer.concat([salt, iv, cipher_text_buffer, tag])
    const data = list.toString("base64")
    fs.writeFileSync("secret.vault", data)
} 
else if (mode === "decrypt") 
{
    const content = fs.readFileSync("secret.vault", "utf8")
    const combined = Buffer.from(content, "base64")
    const salt = combined.subarray(0, 16)
    const iv = combined.subarray(16, 28)
    const cipher_text = combined.subarray(28, combined.length - 16)
    const tag = combined.subarray(combined.length - 16, combined.length)

    // Generate a 256 bit key
    const derived_key = crypto.pbkdf2Sync(password, salt, iterations, key_length, digest)

    const decipher = crypto.createDecipheriv(algorithm, derived_key, iv)
    decipher.setAuthTag(tag)

    const decipher_text_one = decipher.update(cipher_text, undefined, "utf8")
    const decipher_text_two = decipher.final("utf8")
    const returned_msg = decipher_text_one + decipher_text_two
    console.log(returned_msg)
}
else
{
    console.log("Error in your format, try again!")
}

   // Decrypt
    // const decipher = crypto.createDecipheriv(algorithm, derived_key, iv)
    // decipher.setAuthTag(tag)
