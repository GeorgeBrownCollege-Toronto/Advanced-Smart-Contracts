/* global web3 */
// put your metamask address here, so it will always have some ether on local network...
const myMetamaskAddr = '0xDa1d30af457b8386083C66c9Df7A86269bEbFDF8'

module.exports = async function (deployer, network) {
  if (network === 'development') {
    const accounts = await web3.eth.getAccounts()
    web3.eth.sendTransaction({ from: accounts[0], to: myMetamaskAddr, value: 2e18 }, (e, r) => {
      if (e) {
        console.log('Failed to fund metamask', e)
      } else {
        console.log('Funded metamask @', myMetamaskAddr)
      }
    })
  }
}
