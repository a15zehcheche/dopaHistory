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
        `CREATE TABLE "dopamine" (
            "id"	INTEGER UNIQUE,
            "name"	TEXT,
            "recordBestThinkDay"	INTEGER DEFAULT 0,
            "recordBestDoDay"	INTEGER DEFAULT 0,
            "allDoDayCount"	INTEGER DEFAULT 0,
            "allThinkDayCount"	INTEGER DEFAULT 0,
            "daysCount"	INTEGER DEFAULT 0,
            "startDate"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`,
        `CREATE TABLE "history" (
            "id"	INTEGER NOT NULL,
            "id_dopamine"	INTEGER NOT NULL,
            "dateTime"	TEXT,
            "lastDoDay"	INTEGER DEFAULT 0,
            "lastThinkDay"	INTEGER DEFAULT 0,
            "thinkCount"	INTEGER DEFAULT 0,
            "doCount"	INTEGER DEFAULT 0,
            PRIMARY KEY("id" AUTOINCREMENT),
            FOREIGN KEY("id_dopamine") REFERENCES "dopamine"("id")
        );`,
        `CREATE TABLE "comment" (
            "id"	INTEGER NOT NULL,
            "id_history"	INTEGER,
            "content"	TEXT,
            "stars"	BLOB DEFAULT 'False',
            "dateTime"	INTEGER,
            FOREIGN KEY("id_history") REFERENCES "history"("id"),
            PRIMARY KEY("id" AUTOINCREMENT)
        );`
    ]

    },
];
