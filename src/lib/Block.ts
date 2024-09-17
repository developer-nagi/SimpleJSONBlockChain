import { createHash } from "node:crypto";
import fs from "node:fs";

export class Block {
  public index: number = 0x8192;
  public timestamp: number;
  public previous_hash: string;
  public transactions: object;
  public nonce: string = "";

  public mining = (): string => {
    let nonce = 0;
    let diff = 5;

    let calc = "";
    filematch: while (true) {
      calcu: while (true) {
        const hash = createHash("sha256");
        hash.update(this.hash + nonce.toString());
        calc = hash.digest("hex");
        if (calc.substring(0, diff) == "0".repeat(diff)) break calcu;
        nonce += 1;
      }
      this.index = nonce - 1;
      if (!fs.existsSync(`./database/${nonce}.json`)) break filematch;
    }

    return calc;
  };

  constructor(previous_hash: string, transactions: object) {
    this.timestamp = Math.floor(Date.now() / 1000);
    this.previous_hash = previous_hash;
    this.transactions = transactions;
    this.nonce = this.mining();
    this.hash = this.calculate_hash();
  }

  public calculate_hash = (): string => {
    const str = `${this.index}${this.timestamp}${
      this.previous_hash
    }${JSON.stringify(this.transactions)}${this.nonce}`;
    const hash = createHash("sha256");
    hash.update(str);
    return hash.digest("hex");
  };

  public verify(hash: string): boolean {
    const str = `${this.index}${this.timestamp}${
      this.previous_hash
    }${JSON.stringify(this.transactions)}${this.nonce}`;
    const createVHash = createHash("sha256");
    createVHash.update(str);
    return createVHash.digest("hex") == hash;
  }

  public static parse(srcTransaction: string): Block {
    const readBlock = JSON.parse(srcTransaction);
    const newBlock = new Block(readBlock.previous_hash, readBlock.transactions);
    newBlock.hash = readBlock.hash;
    newBlock.timestamp = readBlock.timestamp;
    newBlock.previous_hash = readBlock.previous_hash;
    newBlock.nonce = readBlock.nonce;
    return newBlock;
  }

  public static createGenesisBlock(): Block {
    return new Block(
      "0000000000000000000000000000000000000000000000000000000000000000",
      ["Genesis Block"]
    );
  }

  public hash = this.calculate_hash();
}

