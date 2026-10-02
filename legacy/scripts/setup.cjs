const { constants, copyFileSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

try {
  copyFileSync(path.join(root, ".env.example"), path.join(root, ".env"), constants.COPYFILE_EXCL);
  console.log("Created .env. Leave OPENAI_API_KEY empty for local collection-note replies.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("Existing .env kept unchanged.");
}

console.log("No third-party dependencies to install. Run npm run dev to start.");
