import Web3 from "web3";
let web3;
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  web3 = window.web3;
}
export default web3;
