const sc = require('sourcecred').sourcecred;
const fs = require("fs-extra");
const Ledger = sc.ledger.ledger.Ledger;

const MINT_TX_HASH = "https://etherscan.io/tx/0x...";
const MINT_DATE = "2021-12-08";
const PAYMENT_ID = "01";


const ETH_MAIN_NET_IDENTITY_ID = "oPpvHmbAH4xVhZd92KR1Xg";
const LEDGER_PATH = './../data/ledger.json';
const PAYMENT_FILE_PATH = `./../payments/payment_${PAYMENT_ID}.json`;

(async function () {
    const ledger = Ledger.parse((await fs.readFile(LEDGER_PATH)).toString());
    accounts = ledger.accounts();
    var payment = JSON.parse(await fs.readFile(PAYMENT_FILE_PATH))

    console.log(payment["_sourcecredIds"])


    for (let [index, id] of payment["_sourcecredIds"].entries()) {
        console.log(index, id, payment["values"][index])
        ledger.transferGrain({
            from: id,
            to: ETH_MAIN_NET_IDENTITY_ID,
            amount: payment["values"][index],
            memo: `Sent ANT on-chain to ${payment["recipients"][index]} on ${MINT_DATE} (${MINT_TX_HASH})`,
        });
    }

    payment["_balancesUpdated"] = true

    fs.copyFile(LEDGER_PATH, LEDGER_PATH + '.bkp', (err) => {
        if (err) throw err;
        else fs.writeFileSync(LEDGER_PATH, ledger.serialize());
    })

    fs.copyFile(PAYMENT_FILE_PATH, PAYMENT_FILE_PATH + '.bkp', (err) => {
        if (err) throw err;
        else fs.writeFile(PAYMENT_FILE_PATH, JSON.stringify(payment, null, 2));
    })
    
})();






