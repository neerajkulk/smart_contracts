const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require("../compile");

let accounts;
let lottery;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  const manager = accounts[0];
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({ from: manager, gas: "1000000" });
});
describe("Lottery contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows an account to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getPlayers().call();
    assert.deepStrictEqual(players, [accounts[0]]);
  });

  it("allows many account to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.12", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.23", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.45", "ether"),
    });

    const players = await lottery.methods.getPlayers().call();
    assert.deepStrictEqual(players, [accounts[0], accounts[1], accounts[2]]);
  });

  it(" should not add player if he dont send enough ether", async () => {
    let txSuccess = false;
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.000001", "ether"),
      });
      txSuccess = true;
    } catch (error) {}
    assert(txSuccess === false);
  });

  it("only manager can pick winner", async () => {
    const manager = await lottery.methods.manager().call();
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    let winnerPicked = false;
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[2],
      });
      winnerPicked = true;
    } catch (error) {
      winnerPicked = false;
    }
    assert(winnerPicked === false);
  });
});
