const ethers =require("ethers")


// XDAI
const providerUrl = "https://rpc.xdaichain.com/"
const unlockAddress = "0x14bb3586Ce2946E71B95Fe00Fc73dd30ed830863"
const maxBlocks = 10000000
const startBlock = Math.floor(14521201/maxBlocks) * maxBlocks
const endBlock = 17866254 // Last transaction of August 31st 2021

// MAINNET
// const providerUrl = "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100"
// const unlockAddress = "0x3d5409cce1d45233de1d4ebdee74b8e004abdd13"
// const maxBlocks = 100000000 // No block limit!
// const startBlock = Math.floor(7120796/maxBlocks) * maxBlocks
// const endBlock = 13136426 // Last transaction of August 31st 2021


const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const unlockAbi = [{
  "anonymous": false,
  "inputs": [
      {
          "indexed": true,
          "internalType": "address",
          "name": "lockOwner",
          "type": "address"
      },
      {
          "indexed": true,
          "internalType": "address",
          "name": "newLockAddress",
          "type": "address"
      }
  ],
  "name": "NewLock",
  "type": "event"
}]

const lockAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
]

const unlockContract = new ethers.Contract(unlockAddress, unlockAbi, provider);
const unlockInterface = new ethers.utils.Interface(unlockAbi);


const pindrop = {}

/**
 *
 */
const findNewPurchasesForLock = async (startBlock, lockAddress) => {
  if (startBlock === endBlock) {
    return
  }
   console.log(`START LOOKIN FOR KEY PUCHASES AT BLOCK ${startBlock} for ${lockAddress} `)

    // Let's also get the lock address and then get all the key purchases for that lock!
    const lockContract = new ethers.Contract(lockAddress, lockAbi, provider);

    // We need to look at all the Transfer events coming from 0, and look at who sent te tx
    const filter = lockContract.filters.Transfer('0x0000000000000000000000000000000000000000')
    filter.fromBlock = startBlock;
    filter.toBlock = startBlock + maxBlocks; // WARNING STOP WHEN THIS IS LARGER THAN LAST BLOCK!
    if (filter.toBlock > endBlock) {
      filter.toBlock = endBlock
    }

    const transferEvents = await provider.getLogs(filter)

    for await (transferEvent of transferEvents) {
      const keyPurchaseTransaction = await provider.getTransaction(transferEvent.transactionHash);
      const recipient = transferEvent.topics[2].replace('000000000000000000000000', '')
      if (!pindrop[recipient]) {
        pindrop[recipient] = {
          locks: 0,
          keys: 0
        }
      }
      pindrop[recipient].keys += 1
    }
    return findNewPurchasesForLock(filter.toBlock, lockAddress)
}

/**
 *
 */
const findNewLocks = async (startBlock) => {
  if (startBlock === endBlock) {
    return
  }
  console.log(`START LOOKIN FOR NEW LOCKS AT BLOCK ${startBlock}`)
  const filter = unlockContract.filters.NewLock()
  filter.fromBlock = startBlock;
  filter.toBlock = startBlock + maxBlocks; // TODO: STOP! But how?
  if (filter.toBlock > endBlock) {
    filter.toBlock = endBlock
  }

  const createLockEvents = await provider.getLogs(filter)

  // For each event, get the transaction from `transactionHash`
  for await (createLockEvent of createLockEvents) {
    const lockAddress = unlockInterface.parseLog(createLockEvent).args.newLockAddress
    const createLockTransaction = await provider.getTransaction(createLockEvent.transactionHash);
    if (!pindrop[createLockTransaction.from]) {
      pindrop[createLockTransaction.from] = {
        locks: 0,
        keys: 0
      }
    }
    pindrop[createLockTransaction.from].locks += 1
    await findNewPurchasesForLock(createLockTransaction.blockNumber, lockAddress)
  }
  await findNewLocks(filter.toBlock)
}


const run = async () => {
  console.log('START')
  await findNewLocks(startBlock)
  console.log('END')
  console.log(pindrop)
}
run()