const sc = require('sourcecred').sourcecred;
const fs = require("fs-extra");

const Ledger = sc.ledger.ledger.Ledger;
const G = sc.ledger.grain;


const MINT_TX_HASH = "https://etherscan.io/tx/0x70b99bd0e456af39865b7b441f05da53a14aeaf8692d15896acda55d0fcae420";
const MINT_DATE = "Nov 12 2021";

const LEDGER_PATH = 'data/ledger.json';
const MINT_AMOUNTS_PATH = './scripts/toMint01Merkle.json';
const ETH_MAIN_NET_IDENTITY_ID = "igdEDIOoos50r4YUKKRQxg";

(async function () {
  const ledgerJSON = (await fs.readFile(LEDGER_PATH)).toString();
  
  const ledger = Ledger.parse(ledgerJSON);
  const accounts = ledger.accounts();
  

  // Uncomment these two lines below and rerun script after distribution is on chain and MINT_TX_HASH + MINT_DATE is updated.
  // await deductSeedsAlreadyMinted([...accountsWithAddress], ledger);
  // await fs.writeFile(LEDGER_PATH, ledger.serialize())
  
  const newMintAmounts = {};
  let total = 0;
  accounts.forEach(acc => {
    const amountToMint = G.format(acc.balance, 9, '');
    newMintAmounts[acc.identity.name] = amountToMint;
  
    total += parseFloat(amountToMint);
  });

  console.log(Object.entries(newMintAmounts).map(([name, amount]) => {

    return `${name},${amount}`
  }).join('\n'));
  console.log({ total });
  
  fs.writeFile(MINT_AMOUNTS_PATH, JSON.stringify(newMintAmounts));
})();