# Pindrop

Unlock Inc. wants to airdrop UDT tokens to anyone who has contributed to the protocol before September 1st 2021.
However we are building a claim mechanism that will require users to delegate their tokens if they want to claim them.

Rules are the following:
* every token holder at block `13136426` who owns more than 3 UDT will receive 1 UDT
* every user who has deployed 1 lock will receive 3 UDT per lock they deployed
* every user who has purchased 1 key will receive 1 UDT per key purchased

## Extracting recipient addresses

### Mainnet:

Use the `index.js` script with the following params:

```javascript
const providerUrl = "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100"
const unlockAddress = "0x3d5409cce1d45233de1d4ebdee74b8e004abdd13"
const maxBlocks = 100000000 // No block limit!
const startBlock = Math.floor(7120796/maxBlocks) * maxBlocks
const endBlock = 13136426 // Last transaction of August 31st 2021
```

See results in `mainnet.js`.

### xDAI:

```javascript
const providerUrl = "https://rpc.xdaichain.com/"
const unlockAddress = "0x14bb3586Ce2946E71B95Fe00Fc73dd30ed830863"
const maxBlocks = 10000000
const startBlock = Math.floor(14521201/maxBlocks) * maxBlocks
const endBlock = 17866254 // Last transaction of August 31st 2021
```

See results in `xdai.js`.

### Polygon

We have not found a polygon provider which lets use un the same script as above in a reasonable time.
As a consequence, we used Dune.

This request lists all key purchasers:

```sql
SELECT "to", "evt_tx_hash" FROM unlock."PublicLock_evt_Transfer"
        WHERE evt_block_number < 18605916
        ORDER BY "evt_block_time" ASC
```

And this one lists all lock deployers:

```sql
SELECT "lockOwner", "evt_tx_hash" FROM unlock."Unlock_evt_NewLock"
        WHERE evt_block_number < 18605916
        ORDER BY "evt_block_time" ASC
```

We then combined the outcome to build a `json` file of the same format as above.


## Token holders:

We use the covalent API

```bash
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x90de74265a416e1393a450752175aed98fe11517/token_holders/?block-height=13136426&page-number=0&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x90de74265a416e1393a450752175aed98fe11517/token_holders/?block-height=13136426&page-number=1&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x90de74265a416e1393a450752175aed98fe11517/token_holders/?block-height=13136426&page-number=2&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x90de74265a416e1393a450752175aed98fe11517/token_holders/?block-height=13136426&page-number=3&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x90de74265a416e1393a450752175aed98fe11517/token_holders/?block-height=13136426&page-number=4&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"

And combined the result, and then restricted to all token holders with 3 UDT or more.

We are also adding any user who has been providing liquidity to the Uniswap v2 pool used by the protocol as of the same date.

```bash
curl -X GET "https://api.covalenthq.com/v1/1/tokens/0x9ca8aef2372c705d6848fdda3c1267a7f51267c1/token_holders/?block-height=13136426&page-number=0&page-size=1000&key=ckey_44739eb00dd649e182e708ba705" -H "Accept: application/json"
```

```

## Create a claimAndDelegate fork of the Uniswap merkle-dristribution repo!

[See repo](https://github.com/unlock-protocol/merkle-distributor)