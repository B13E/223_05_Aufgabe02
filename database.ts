/*
import mariadb from 'mariadb';
import { Pool } from 'mariadb';

const pool = mariadb.createPool({
  database: process.env.DB_NAME || 'minitwitter',
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'minitwitter',
  password: process.env.DB_PASSWORD || 'supersecret123',
  connectionLimit: 5,
});

class Database {
  private _pool: Pool;

  constructor() {
    this._pool = pool;
    this.initializeDBSchema();
  }

  private async initializeDBSchema() {
    console.log('Initializing DB schema...');
    // Add code to create necessary database tables (e.g., accounts) if they don't exist.
  }

  public async executeSQL(query: string) {
    try {
      const conn = await this._pool.getConnection();
      const res = await conn.query(query);
      conn.end();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

class BankAccount {
  private kontostand: number;
  private kontonummer: string;
  private pincode: number;
  private db: Database;

  constructor(kontostand: number, kontonummer: string, pincode: number, db: Database) {
    this.kontostand = kontostand;
    this.kontonummer = kontonummer;
    this.pincode = pincode;
    this.db = db;
  }

  async einzahlen(betrag: number): Promise<void> {
    if (betrag < 0) {
      throw new Error("Negative Beträge sind nicht erlaubt.");
    }

    const query = `UPDATE accounts SET kontostand = kontostand + ${betrag} WHERE kontonummer = '${this.kontonummer}'`;
    await this.db.executeSQL(query);
    this.kontostand += betrag;
  }

  async ueberweisen(zielKonto: BankAccount, betrag: number, pin: number): Promise<void> {
    if (pin !== this.pincode) {
      throw new Error("Pin nicht korrekt");
    }

    if (betrag < 0) {
      throw new Error("Negative Beträge sind nicht erlaubt.");
    }

    if (betrag > this.kontostand) {
      throw new Error("Betrag zu gross");
    }

    const transferQuery = `
      START TRANSACTION;
      UPDATE accounts SET kontostand = kontostand - ${betrag} WHERE kontonummer = '${this.kontonummer}';
      UPDATE accounts SET kontostand = kontostand + ${betrag} WHERE kontonummer = '${zielKonto.kontonummer}';
      COMMIT;
    `;

    try {
      await this.db.executeSQL(transferQuery);
      this.kontostand -= betrag;
      await zielKonto.updateKontostandFromDB();
    } catch (error) {
      console.error("Transaktion fehlgeschlagen: ", error);
      throw error;
    }
  }

  private async updateKontostandFromDB(): Promise<void> {
    const query = `SELECT kontostand FROM accounts WHERE kontonummer = '${this.kontonummer}'`;
    const result = await this.db.executeSQL(query);

    if (result && result.length > 0) {
      this.kontostand = result[0].kontostand;
    }
  }

  getKontostand(pin: number): number {
    if (pin === this.pincode) {
      return this.kontostand;
    } else {
      throw new Error("Pin nicht korrekt");
    }
  }
}

const db = new Database();
const meinKonto = new BankAccount(1000, "CH234 456 789", 1111, db);
const zielKonto = new BankAccount(2000, "CH234 456 790", 2222, db);

meinKonto.einzahlen(500);
console.log("Neuer Kontostand nach Einzahlung", meinKonto.getKontostand(1111)); // 1500

meinKonto.ueberweisen(zielKonto, 300, 1111);
console.log("Neuer Kontostand nach Überweisung", meinKonto.getKontostand(1111)); // 1200
console.log("Neuer Kontostand des Zielkontos", zielKonto.getKontostand(2222)); // 2300

try {
    meinKonto.abheben(5000, 1111);
} catch (error) {
    console.error("Fehler wenn der Betrag zu hoch ist", error);
}

try {
    meinKonto.getKontostand(1234);
} catch (error) {
    console.error("Fehler bei falschem Pincode", error);
}

*/