const Factory = artifacts.require('Factory')
const Test1 = artifacts.require('Test1')
const Test2 = artifacts.require('Test2')

const {
  isContract
} = require('./helpers.js')

const {bytecode:test1ByteCode} = require('../build/contracts/Test1.json')
const {bytecode:test2ByteCode} = require('../build/contracts/Test2.json')

let salt

contract('Factory', (accounts) => {
  let factory
  before('setup', async () => {
    // deploy factory
    factory = await Factory.new()
    factoryInstance = await Factory.at(factory.address)
    
    // constructor arguments are appended to contract bytecode
    salt = 1
  })

  describe('test deploy', () => {
    it('should deploy Factory', async () => {
      const contract = await isContract(factory.address)
      assert.isTrue(contract)
    })

    it('should deploy a different bytecode at the same address', async () => {
      const test1tx = await factoryInstance.deploy(salt,test1ByteCode);
      const test1MetamorphicAddr = test1tx.receipt.logs[0].args.addr;
      const test1Instance = await Test1.at(test1MetamorphicAddr);

      await test1Instance.setUint(23)
      console.log("Test1 myUint : ",(await test1Instance.myUint()).toString())

      await test1Instance.killme();

      const test2tx = await factoryInstance.deploy(salt,test2ByteCode);
      const test2MetamorphicAddr = test2tx.receipt.logs[0].args.addr;
      const test2Instance = await Test2.at(test2MetamorphicAddr);

      await test2Instance.setUint(23)
      console.log("Test2 myUint : ",(await test2Instance.myUint()).toString())

      console.log("test1 -> ",test1MetamorphicAddr)
      console.log("test2 -> ",test2MetamorphicAddr)
    })
  })
})