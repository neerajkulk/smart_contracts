const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "HELLO HOW ARE YOU THIS IS MY SECRET 12 WORLD MNEMONIC",
  "https://rinkeby.infura.io/v3/https://rinkeby.infura.io/v3/78775d265b48481fa6704751ae27b39b"
);

const web3 = new Web3(provider);

async function deploy() {
  try {
    console.log("Hi didly");
    const myAccount = "0x3782069BA4Ea8D399860266F7ad7AD8Fb9DCbdcC";
    const inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: ["Hello world"],
      })
      .send({
        from: myAccount,
        gas: "1000000",
      });

    console.log(inbox);
    console.log(inbox._address);
  } catch (error) {
    console.log(error);
  }
}

deploy()
  .then((x) => {
    x += 1;
  })
  .catch((err) => {
    console.log(err);
  });
