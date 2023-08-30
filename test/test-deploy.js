const {ethers} = require('hardhat')
const {expect,assert} = require('chai')

describe("SimpleStorage", function(){
  let simpleStorageFactory, simpleStorage;
  beforeEach( async function(){
    simpleStorageFactory =  await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy()
  })

  // checking if favorite number started with 0
  it("show start with a favorite number of 0", async function(){
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = '0'
    assert.equal(currentValue.toString(),expectedValue)
  })

  // Making sure the store function works well
  it("show show the stored number",async function(){
    await simpleStorage.store(7);
    const updatedValue = await simpleStorage.retrieve()
    const expectedValue = '7'
    assert.equal(updatedValue.toString(),expectedValue)
  })
})