const ethers = require('ethers')
const xdai = require('./xdai.json')
const polygon = require('./polygon.json')
const mainnet = require('./mainnet.json')
const holders = require('./token-holders/token-holders.json')

const PER_LOCK = 3
const PER_KEY = 1
const PER_UDT = 1

const CAP = 10

const final = {}

const networks = [xdai, polygon, mainnet, holders]


const team = [
'0xe5cd62ac8d2ca2a62a04958f07dd239c1ffe1a9e', '0x3ca206264762caf81a8f0a843bbb850987b41e16', '0x33ab07df7f09e793ddd1e9a25b079989a557119a', '0xdb92c096bc5efa8adb48f05cd601dddb75228203', '0xbf7f1bdb3a2d6c318603ffc8f39974e597b6af5e', '0x8de33d8204929ceb2f7aa6299d0643a7f6664c9b', '0x7d5d3554d3aa450e6c65ac4fda376aee13e1293e'
  ]


networks.forEach((network) => {
  Object.keys(network).forEach((x) => {
    const y = x.toLowerCase()
    if(!final[y]) {
      final[y] = 0
    }
    if (network[x].locks) {
      final[y] = final[y] + PER_LOCK * network[x].locks
    }
    if (network[x].keys) {
      final[y] = final[y] + PER_KEY * network[x].keys
    }
    if (network[x].tokens) {
      final[y] = final[y] + PER_UDT * network[x].tokens
    }

    if(final[y] > CAP) {
      final[y] = CAP
    }

    if (team.indexOf(final[y]) > -1) {
      delete final[y] // delete team members
    }
  })
})

const total = Object.values(final).reduce((x, y) => x + y);

const sortable = Object.fromEntries(
  Object.entries(final).sort(([,a],[,b]) => a-b)
);

const formatted = []
Object.keys(sortable).forEach((address) => {
  formatted.push({
    account: ethers.utils.getAddress(address),
    amount: sortable[address]
  })
})

console.log(JSON.stringify(formatted, undefined, 2))
// Total of 7314 tokens if everyone claims!
