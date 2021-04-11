import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
function App() {
  console.log(web3);
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3.eth.getAccounts().then(console.log);
  async function loadContract() {
    const abi = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "enter",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getPlayers",
        outputs: [
          {
            internalType: "address payable[]",
            name: "",
            type: "address[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "manager",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "pickWinner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "players",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const address = "0x81DEda94804Fda3646A6C847d7FdBDD54c88cB94";
    return await new window.web3.eth.Contract(abi, address);
  }

  loadContract().then((contract) => {
    contract.methods
      .enter()
      .send({
        from: "0x3782069BA4Ea8D399860266F7ad7AD8Fb9DCbdcC",
        value: 20000000000000000,
      })
      .then(console.log);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
