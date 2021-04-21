const assert = require("assert");
const { truncateSync } = require("fs");
const ganache = require("ganache-cli");
const { request } = require("http");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const compiledCampaign = require("../ethereum/build/Campaign.json");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "4712388" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "4712388",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaign", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(campaign.options.address);
    assert.ok(factory.options.address);
  });
  it("allows a user to contribute", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const contributers = await campaign.methods.numFunders().call();
    assert.strictEqual(contributers, "1");
  });
  it("same user cannot contribute twice", async () => {
    let repeatTransaction = true;
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "200",
      });
    } catch (err) {
      repeatTransaction = false;
    }
    assert(repeatTransaction === false);
    const contributers = await campaign.methods.numFunders().call();
    assert.strictEqual(contributers, "1");
  });
  it("many users can contribute", async () => {
    let repeatTransaction = true;
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: "2000",
    });
    await campaign.methods.contribute().send({
      from: accounts[3],
      value: "1000000",
    });

    const contributers = await campaign.methods.numFunders().call();
    assert.strictEqual(contributers, "3");
  });
  it("can create a request", async () => {
    await campaign.methods
      .createRequest("test request", 1000, accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const requests = await campaign.methods.requests(0).call();
    assert.ok(requests);
  });
  it("only manager can create request", async () => {
    requestFailed = false;
    try {
      await campaign.methods
        .createRequest("test request", 1000, accounts[3])
        .send({
          from: accounts[1],
          gas: "1000000",
        });
    } catch (err) {
      requestFailed = true;
    }
    assert(requestFailed === true);
  });
  it("funder can approve request", async () => {
    // create request
    await campaign.methods
      .createRequest("test request", 1000, accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    // contribute to request
    await campaign.methods.contribute().send({
      from: accounts[3],
      value: "10000",
    });

    // Approve request
    await campaign.methods.approveRequest(0).send({
      from: accounts[3],
    });

    const requests = await campaign.methods.requests(0).call();
    assert.strictEqual(requests.approvalCount, "1");
  });
  it("only funders can approve request", async () => {
    // create request
    await campaign.methods
      .createRequest("test request", 1000, accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    // Approve request
    try {
      await campaign.methods.approveRequest(0).send({
        from: accounts[3],
      });
    } catch (error) {}

    const requests = await campaign.methods.requests(0).call();
    assert.strictEqual(requests.approvalCount, "0");
  });
  it("User cannot approve request twice", async () => {
    // create request
    await campaign.methods
      .createRequest("test request", 1000, accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    // contribute to request
    await campaign.methods.contribute().send({
      from: accounts[3],
      value: "10000",
    });

    // Approve request
    await campaign.methods.approveRequest(0).send({
      from: accounts[3],
    });

    // Approve request again
    try {
      await campaign.methods.approveRequest(0).send({
        from: accounts[3],
      });
    } catch (err) {}

    const requests = await campaign.methods.requests(0).call();
    assert.strictEqual(requests.approvalCount, "1");
  });
  // the request hasn't beeen completed
  //  request has approves
  //  transferring to correct recipient.
});
