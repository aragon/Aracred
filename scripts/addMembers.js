const sc = require('sourcecred').sourcecred;
const fs = require("fs");

const LEDGER_PATH = './../data/ledger.json';
const Ledger = sc.ledger.ledger.Ledger;
const ledger = Ledger.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));

function addPayoutAddresses(accountName, payoutAddress) {

    const account = ledger.accountByName(accountName)
    if (account.payoutAddresses.size === 0) {
        ledger.setPayoutAddress(
            account.identity.id, // id
            payoutAddress, // payoutAddress
            "1", // chainId
            "0xa117000000f279D81A1D3cc75430fAA017FA5A2e" // ANT tokenAddress
        )

        console.log(`Payout address ${payoutAddress} added to account ${account.identity.id} (${accountName})`)
    } else if (account.payoutAddresses.values().next().value === payoutAddress) {
        console.log(`Payout address ${payoutAddress} is already added to account ${account.identity.id} (${accountName})`)
    } else {
        console.log(
            "CONFLICTING PAYOUT ADDRESS\n",
            `   ${payoutAddress} diverges from address\n`,
            `   ${account.payoutAddresses.values().next().value} being already added to account ${account.identity.id} (${accountName})\n`,
            "   Use the replace address method if this was intentional."
        )
    }
}

addresses = {
    "freedomfighter": "0x14A2A72226f51bA42F359e12933F7259E5852813"
}

Object.entries(addresses).forEach(
    ([key, value]) => addPayoutAddresses(key, value)
)

fs.writeFileSync(LEDGER_PATH, ledger.serialize())

