const sc = require('sourcecred').sourcecred;
const fs = require("fs");

const LEDGER_PATH = './../data/ledger.json';
const Ledger = sc.ledger.ledger.Ledger;
const ledger = Ledger.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));

const ANT_TOKEN_ADDRESS = "0xa117000000f279d81a1d3cc75430faa017fa5a2e";
const DISPERSE_CONTRACT_ADDRESS = "0xD152f549545093347A162Dce210e7293f1452150";
const PAYMENT_ID = "02";


function writePaymentsFile(total, recipients, values, sourcecredIds, paymentId) {
    const filename = `./../payments/payment_${paymentId}.json`

    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename,
            JSON.stringify({
                "title": `Ambassador SourceCred Payment #${Number(paymentId)}`,
                "justification":
                    "Payment of SourceCred rewards to the ambassadors for their activities in the AN DAO " +
                    `amounting to ${Number(total) / 10 ** 18} ANT for the weeks 38 to 51.`,
                "externalContract": DISPERSE_CONTRACT_ADDRESS,
                "token": ANT_TOKEN_ADDRESS,
                "recipients": recipients,
                "values": values,
                "_sourcecredIds": sourcecredIds,
                "_balancesUpdated": false
            }, null, 2)
        );
    } else {
        throw Error('File exists already');
    }
}

function calculatePayments() {
    const accounts = ledger.accounts();
    const recipients = [];
    const values = [];
    const sourcecredIds = [];

    let total = BigInt(0);

    activeAccounts = accounts.filter(acc => acc.active === true)

    activeAccounts.forEach(acc => {

        const amountToPay = BigInt(acc.balance)

        if (amountToPay > 0.0) {
            if (acc.payoutAddresses.size === 0) {
                console.log(`MISSING PAYOUT ADDRESS for account ${acc.identity.id} (${acc.identity.name})...skipping`)
            } else {
                addr = acc.payoutAddresses.values().next().value

                recipients.push(addr)
                values.push(amountToPay.toString())
                sourcecredIds.push(acc.identity.id)

                total += amountToPay;

                console.log(addr, amountToPay.toString());
            }
        }
    });

    writePaymentsFile(total, recipients, values, sourcecredIds, PAYMENT_ID);
    console.log(`Total: ${total} (${Number(total) / 10 ** 18} ANT)`);
};

calculatePayments();
