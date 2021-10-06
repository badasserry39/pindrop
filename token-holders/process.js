const ethers = require('ethers')
const combined = require('./combined.json')
const lp = require('./lp.json')

const recipients = {}

combined.forEach((holder) => {

  const balance = ethers.BigNumber.from(holder.balance)
  const balanceNumber = parseFloat(ethers.utils.formatUnits(balance, 18))
  if (balanceNumber > 3) {
    recipients[holder.address] = {
      tokens: true
    }
  }

})

lp.forEach((holder) => {

  const balance = ethers.BigNumber.from(holder.balance)
  const balanceNumber = parseFloat(ethers.utils.formatUnits(balance, 18))
  if (balanceNumber > 0.001) {
    recipients[holder.address] = {
      tokens: true
    }
  }

})


console.log(JSON.stringify(recipients, null, 2))
