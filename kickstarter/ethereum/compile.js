const solc = require("solc");
const path = require("path");
const fs = require("fs-extra");

const buildPath = path.join(__dirname, "build");
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

const contractPath = path.join(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const a = output.contracts["Campaign.sol"].CampaignFactory;

for (const contract in output.contracts["Campaign.sol"]) {
  fs.outputJSONSync(
    path.join(buildPath, `${contract}.json`),
    output.contracts["Campaign.sol"][contract]
  );
}
