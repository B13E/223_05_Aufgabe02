import mariadb from 'mariadb';
import { Pool } from 'mariadb';

export class Database {
  // Properties
  private _pool: Pool
  // Constructor
  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }
  // Methods
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(TWEET_TABLE)
  }

  public executeSQL = async (query: string) => {
    try {
      const conn = await this._pool.getConnection()
      const res = await conn.query(query)
      conn.end()
      return res
    } catch (err) {
      console.log(err)
    }
  }
}

class BankAccount {
    private kontostand: number;
    private kontonummer: string;
    private pincode: number;
    private db: Pool;

    constructor(kontostand: number, kontonummer: string, pincode: number, db: Database) {
        this.kontostand = kontostand;
        this.kontonummer = kontonummer;
        this.pincode = pincode;
        this.db = db; 
    }


    async einzahlen(betrag: number): Promise<void> {
        const query = `UPDATE accounts SET kontostand = kontostand + ${betrag} WHERE kontonummer = '${this.kontonummer}'`; 
        await this.db.executeSQL(query);
        this.kontostand += betrag;
    }

   async abheben(betrag: number, pin: number): Promise<void> {
        if (pin === this.pincode) {
            if (betrag <= this.kontostand) {
                this.kontostand -= betrag;
            } else {
              throw Error("Betrag zu gross");
            }
        } else {
            throw Error("Pin nicht korrekt");
        }
    }

    getKontostand(pin: number): number {
        if (pin === this.pincode) {
            return this.kontostand;
        } else {
            throw Error("Pin nicht korrekt");
        }
    }
}

const meinKonto = new BankAccount(1000, "CH234 456 789", 1111, db);

meinKonto.einzahlen(500);
console.log("Neuer Kontostand nach Einzahlung", meinKonto.getKontostand(1111)); // 1500

meinKonto.abheben(200, 1111);
console.log("Neuer Kontostand nach Abhebung", meinKonto.getKontostand(1111)); // 1300

try {
    meinKonto.abheben(5000, 1111);
} catch (error) {
    console.error("Fehler wen der Betrag zu hoch ist", error);
}

try {
    meinKonto.getKontostand(1234);
} catch (error) {
    console.error("Fehler bei falschem Pincode", error);
}
