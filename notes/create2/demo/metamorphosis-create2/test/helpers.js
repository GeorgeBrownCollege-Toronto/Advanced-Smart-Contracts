// returns true if contract is deployed on-chain
async function isContract(address) {
  const code = await web3.eth.getCode(address)
  return code.slice(2).length > 0
}

module.exports = {
  isContract
}