export const UserUpgradeStatements = [
    {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        active INTEGER DEFAULT 1
        );`
    ]
    },
    /* add new statements below for next database version when required*/
    /*
    {
    toVersion: 2,
    statements: [
        `ALTER TABLE users ADD COLUMN email TEXT;`,
    ]
    },
    
    */
   {
    toVersion: 2,
    statements: [
        `CREATE TABLE "dopamine" ( "id" INTEGER UNIQUE, "name" TEXT, "recordBestThinkDay" INTEGER DEFAULT 0, "recordBestDoDay" INTEGER DEFAULT 0, "allDoDayCount" INTEGER DEFAULT 0, "allThinkDayCount" INTEGER DEFAULT 0, "daysCount" INTEGER DEFAULT 0, "startDate" TEXT, PRIMARY KEY("id" AUTOINCREMENT) )`,
        `CREATE TABLE "history" ( "id" INTEGER NOT NULL, "id_dopamine" INTEGER NOT NULL, "dateTime" TEXT, "lastDoDay" INTEGER, "lastThinkDay" INTEGER, "thinkCount" INTEGER, "doCount" INTEGER, FOREIGN KEY("id_dopamine") REFERENCES "dopamine"("id"), PRIMARY KEY("id" AUTOINCREMENT) )`
    ]

    },
];
