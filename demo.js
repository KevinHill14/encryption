const crypto = require("crypto");

// Generate a salt
// const salt = crypto.randomBytes(16) - Mthod for random salt
const salt = Buffer.from("b09d2f3df658766d334281e03832f157", "hex");

// Define variables
const iterations = 250000
const key_length = 32
const digest = "sha256"
const password = "helloWorld123"
const plain_text = "Hello world, this is a secret!"
const algorithm = "aes-256-gcm"

// Generate a 256 bit key
const derived_key = crypto.pbkdf2Sync(password, salt, iterations, key_length, digest)

// Generate a IV
//const iv = crypto.randomBytes(12) - Method for random iv
const iv = Buffer.from("ecb50bfefc3352c987eff433", "hex");

// Generate a cipher
const cipher = crypto.createCipheriv(algorithm, derived_key, iv)

const encrypt_one = cipher.update(plain_text, 'utf8', 'hex')
const encrypt_two = cipher.final('hex') 
// const tag = cipher.getAuthTag() - Method for a random tag
const tag = Buffer.from("c5214070403edcdb9356ef40ad7d4db2", "hex")

const cipher_text = encrypt_one + encrypt_two
console.log(iv.toString('hex'))
console.log(cipher_text)
console.log(tag.toString('hex'))

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, derived_key, iv)
decipher.setAuthTag(tag)
const decipher_text_one = decipher.update(cipher_text, "hex", "utf8")
const decipher_text_two = decipher.final("utf8")
const returned_msg = decipher_text_one + decipher_text_two
console.log(returned_msg)

// NOTE - will need to go back to random IV + tag once I am done testing decryption, and I start working in files 
// and can actually find the data there