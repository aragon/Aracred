const sc = require('sourcecred').sourcecred;
const fs = require("fs-extra");

const Ledger = sc.ledger.ledger.Ledger;
const G = sc.ledger.grain;

const LEDGER_PATH = 'data/ledger.json';
const MINT_AMOUNTS_PATH = './scripts/toMint01Merkle.json';

const addresses = require("./addresses.json");

(async function () {
  const ledgerJSON = (await fs.readFile(LEDGER_PATH)).toString();
  const ledger = Ledger.parse(ledgerJSON);
  const accounts = ledger.accounts();

  const newMintAmounts = {};
  let total = 0;
  accounts.forEach(acc => {
    const amountToMint = G.format(acc.balance, 9, '');
    if (amountToMint > 0.0) {

      name = acc.identity.name
      if (name in addresses) {
        newMintAmounts[addresses[acc.identity.name]] = amountToMint;
        total += parseFloat(amountToMint);
      } else
        throw `Name "${name}" not found in addresses list.`;
    }
  });

  console.log(Object.entries(newMintAmounts).map(([name, amount]) => {

    return `${name},${amount}`
  }).join('\n'));
  console.log({ total });
  
  fs.writeFile(MINT_AMOUNTS_PATH, JSON.stringify(newMintAmounts));
})();