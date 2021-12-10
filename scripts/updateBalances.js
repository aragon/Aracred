const sc = require('sourcecred').sourcecred;
const fs = require("fs");


function updateBalance() {
    const ETH_MAIN_NET_IDENTITY_ID = "oPpvHmbAH4xVhZd92KR1Xg";

    const MINT_TX_HASH =
        "https://etherscan.io/tx/0x6ce929fde214bfe23d0506be7b50fc646a34586e9ac0c5ed3178fa15d1979585 and " +
        "https://etherscan.io/tx/0x8631995af2368cfab849453cb4aeb56ec56297bba5b18aff625d50d362f35fab";
    const MINT_DATE = "2021-12-08";
    const PAYMENT_ID = "01";

    const LEDGER_PATH = './../data/ledger.json';
    const Ledger = sc.ledger.ledger.Ledger;
    const ledger = Ledger.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));

    const PAYMENT_FILE_PATH = `./../payments/payment_${PAYMENT_ID}.json`;
    let payment = JSON.parse(fs.readFileSync(PAYMENT_FILE_PATH))

    for (let [index, id] of payment["_sourcecredIds"].entries()) {
        const paid = payment["values"][index]
        console.log(index, id, ledger.account(id).identity.name, paid)

        ledger.transferGrain({
            from: id,
            to: ETH_MAIN_NET_IDENTITY_ID,
            amount: paid,
            memo: `Paid ANT to ${payment["recipients"][index]} on ${MINT_DATE} (${MINT_TX_HASH})`,
        });

    }

    payment["_balancesUpdated"] = true

    fs.copyFile(LEDGER_PATH, LEDGER_PATH + '.bkp', (err) => {
        if (err) throw err;
        else fs.writeFileSync(LEDGER_PATH, ledger.serialize());
    })

    fs.copyFile(PAYMENT_FILE_PATH, PAYMENT_FILE_PATH + '.bkp', (err) => {
        if (err) throw err;
        else fs.writeFileSync(PAYMENT_FILE_PATH, JSON.stringify(payment, null, 2));
    })

};

updateBalance();






