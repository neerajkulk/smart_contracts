const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { MNEMONIC, RINKEBY_URL } = require("../../secrets");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: MNEMONIC,
  },
  providerOrUrl: RINKEBY_URL,
});

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
  const factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "4712388" });

  console.log("Contract deployed to", factory.options.address);
};
deploy();
