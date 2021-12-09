const sc = require('sourcecred').sourcecred;
const fs = require("fs-extra");

const Ledger = sc.ledger.ledger.Ledger;
const G = sc.ledger.grain;

const LEDGER_PATH = './../data/ledger.json';
const addresses = require("./../payments/addresses.json");

const PAYMENT_ID = "01";

(async function () {
    const ledgerJSON = (await fs.readFile(LEDGER_PATH)).toString();
    const ledger = Ledger.parse(ledgerJSON);
    const accounts = ledger.accounts();

    const payments = {};
    let total = BigInt(0);
    accounts.forEach(acc => {

        const amountToMint = BigInt(acc.balance)
        if (amountToMint > 0.0) {
            console.log(BigInt(acc.balance))
            name = acc.identity.name
            if (name in addresses) {
                payments[addresses[acc.identity.name]] = amountToMint.toString();
                total += amountToMint;
            } else
                throw `Name "${name}" not found in addresses list.`;
        }
    });

    console.log(`Total: ${total} (${total / BigInt(10 ** 18)} ANT)`);

    fs.writeFile(`./../payments/payment_${PAYMENT_ID}.json`,
        JSON.stringify({
            "title": `Ambassador SourceCred Payment #${Number(PAYMENT_ID)}`,
            "justification":
                `Payment of SourceCred rewards to the ambassadors for their activities in the AN DAO amounting to ${total / BigInt(10 ** 18)} ANT for the weeks 38 to 47.`,
            "externalContract" : "0xD152f549545093347A162Dce210e7293f1452150", // Disperse.app on mainnet
            "token": "0xa117000000f279d81a1d3cc75430faa017fa5a2e", // ANT token
            "recipients": Object.keys(payments),
            "values": Object.values(payments)
        }, null, 2));
})();