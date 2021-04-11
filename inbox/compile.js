const solc = require("solc");
const path = require("path");
const fs = require("fs");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
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

module.exports = {
  abi: output.contracts["Inbox.sol"].Inbox.abi,
  bytecode: output.contracts["Inbox.sol"].Inbox.evm.bytecode.object,
};
