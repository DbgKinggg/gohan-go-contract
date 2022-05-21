const hre = require("hardhat");
const fs = require("fs");
const csv = require("fast-csv");

const action = true;
const addressesCsv = __dirname + "/../addresses.csv";
const contractAddress = "0x6677E1193098F6085Ec1d4f7F5986242846B61EF"; // prod

async function connectContract() {
  const gohanGo = await hre.ethers.getContractAt("GohanGo", contractAddress);

  return gohanGo;
}

/**
 * We need to read from csv and pass that into the function
 */
async function seedWhitelist(gohanGo) {
  console.log("Start reading csv");

  if (!fs.existsSync(addressesCsv)) {
    console.log("file not existed");
    return;
  }

  let addresses = [];
  fs.createReadStream(addressesCsv)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (data) => {
      addresses.push(data);
    })
    .on("end", (rowCount) => {
      console.log(`Finished reading csv (Total: ${rowCount}):`);
      formatData(addresses, gohanGo);
    });
}

function formatData(data, gohanGo) {
  // this should be an object of array separated by the number to be minted
  const mainAddresses = data.reduce((obj, v, i) => {
    obj[v.amount] = obj[v.amount] || [];
    obj[v.amount].push(v.address);
    return obj;
  }, {});

  seedToContract(mainAddresses, gohanGo);
}

async function seedToContract(data, gohanGo) {
  for (const amount in data) {
    if (action) {
      const transaction = await gohanGo.addToWhitelist(data[amount], amount);
      const receipt = await transaction.wait();
      const gasUsed = receipt.gasUsed;
      const ethers = hre.ethers.utils.formatEther(
        gasUsed.mul(receipt.effectiveGasPrice)
      );

      console.log(
        `Seeding mint amount: ${amount}, there are ${data[amount].length} addresses, gas used: ${gasUsed}, ethers used: ${ethers}`
      );
    } else {
      const gas = await gohanGo.estimateGas.addToWhitelist(
        data[amount],
        amount.toString()
      );

      const gasPrice = await hre.ethers.provider.getGasPrice();
      const ethers = hre.ethers.utils.formatEther(gas.mul(gasPrice));

      console.log(
        `Seeding mint amount: ${amount}, there are ${data[amount].length} addresses, estimated gas: ${gas}, estimated ethers used: ${ethers}`
      );
    }
  }
}

connectContract()
  .then((gohanGo) => seedWhitelist(gohanGo))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
