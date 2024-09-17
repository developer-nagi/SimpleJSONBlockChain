import { MyLogger } from "./Logger";
const Logger = new MyLogger();

import { Block } from "./Block";
import fs from "node:fs";

export class BlockChain {
  public addBlock(transactions: object) {
    const latestIndex = fs.readFileSync("./database/_.json");
    const latestTransaction = JSON.parse(
      fs.readFileSync(`./database/${latestIndex}.json`, "utf8")
    );
    const previous_hash = latestTransaction.hash;

    let new_block: Block;

    while (true) {
      new_block = new Block(previous_hash, transactions);
      if (!fs.existsSync(`./database/${new_block.hash}.json`)) break;
    }

    fs.writeFileSync(
      `./database/${new_block.hash}.json`,
      JSON.stringify(new_block)
    );
    Logger.debug("Block Write - ADD JSON");

    fs.writeFileSync("./database/_.json", new_block.hash);
  }

  public verify = () => {
    let latestIndex = fs.readFileSync("./database/_.json", "utf8");
    let latestTransactionPrevHash = latestIndex;

    while (
      latestTransactionPrevHash !=
      "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      const latestTransaction = Block.parse(
        fs.readFileSync(`./database/${latestTransactionPrevHash}.json`, "utf8")
      );

      if (latestTransaction.verify(latestTransaction.hash)) {
        Logger.debug("Hash Pass");
      } else {
        Logger.debug("Hash NG");
        process.exit(0);
      }

      latestTransactionPrevHash = latestTransaction.previous_hash;
    }
  };

  constructor() {
    if (!fs.existsSync("./database/_.json")) {
      Logger.debug("Genesis Block Not Found - Create JSON");
      const genesis = Block.createGenesisBlock();
      fs.writeFileSync(
        `./database/${genesis.hash}.json`,
        JSON.stringify(genesis)
      );
      Logger.debug("Genesis Block Not Found - Write JSON");
      fs.writeFileSync("./database/_.json", genesis.hash);
      Logger.debug("Genesis Block Count Not Found - Write Count");
    }
  }
}

