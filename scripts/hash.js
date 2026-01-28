import bcrypt from "bcryptjs";

const input = process.argv[2];

if (!input){
    console.error("Usage: hash <string>");
    process.exit(1);
}

(async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(input, salt);
        console.log("generated Hash: ",hash);
    } catch (error) {
        console.log("Error hashing string: ", error);
        process.exit(1);
    }
})();