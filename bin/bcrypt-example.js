const bcrypt = require("bcrypt");

// bcrypt.hash()
// --------------------
// ENCRYPT or HASH a string
// 1. Encrypt password for sign-up feature
// 2. Encrypt password for seed file that insert users
// 3. Encrypt password for update password feature

// second argument is the amount of encryption cycles (takes time!!!)
const encryptedCoucou = bcrypt.hashSync("coucou", 10);
console.log(encryptedCoucou);

const encryptedEmpty = bcrypt.hashSync("", 10);
console.log(encryptedEmpty);

const encryptedLong = bcrypt.hashSync("zezqlfkjenflk{rslgn|^ùc;e'", 10);
console.log(encryptedLong);

// bcrypt.compare()
// --------------------
// Comapre a string to an encrypted string to see if they match
// 1. Compare strings for log-in feature
// 2. Compare strings for password cofirmation
// bcrypt.compareSync();
// console.log(bcrypt.compareSync("coucou", encryptedCoucou)); // true
// console.log(bcrypt.compareSync("Coucou", encryptedCoucou)); // false
// console.log(bcrypt.compareSync("password", encryptedCoucou)); // false
