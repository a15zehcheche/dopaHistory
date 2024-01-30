export const UserUpgradeStatements = [
    {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        "sql_deleted" BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        "last_modified" INTEGER DEFAULT 0
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
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" TEXT,
            "recordBestThinkDay" INTEGER DEFAULT 0,
            "recordBestDoDay" INTEGER DEFAULT 0,
            "allDoDayCount" INTEGER DEFAULT 0,
            "allThinkDayCount" INTEGER DEFAULT 0,
            "daysCount" INTEGER DEFAULT 0,
            "startDate" TEXT,
            "sql_deleted" BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
            "last_modified" INTEGER DEFAULT 0
        );`,
        `CREATE TABLE "history" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "id_dopamine" INTEGER NOT NULL,
            "dateTime" TEXT,
            "lastDoDay" INTEGER DEFAULT 0,
            "lastThinkDay" INTEGER DEFAULT 0,
            "thinkCount" INTEGER DEFAULT 0,
            "doCount" INTEGER DEFAULT 0,
            "sql_deleted" BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
            "last_modified" INTEGER DEFAULT 0,
            FOREIGN KEY("id_dopamine") REFERENCES "dopamine"("id")
        );`,
        `CREATE TABLE "comment" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "id_history" INTEGER,
            "content" TEXT,
            "stars" BOOLEAN DEFAULT false,
            "dateTime" INTEGER,
            "sql_deleted" BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
            "last_modified" INTEGER DEFAULT 0,
            FOREIGN KEY("id_history") REFERENCES "history"("id")
        );`,
        `CREATE TRIGGER dopamine_trigger_last_modified
        AFTER UPDATE ON dopamine
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE dopamine SET last_modified = strftime('%s', 'now') WHERE id = NEW.id;
        END;`,
        `CREATE TRIGGER history_trigger_last_modified
        AFTER UPDATE ON history
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE history SET last_modified = strftime('%s', 'now') WHERE id = NEW.id;
        END;`,
        `CREATE TRIGGER comment_trigger_last_modified
        AFTER UPDATE ON comment
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE comment SET last_modified = strftime('%s', 'now') WHERE id = NEW.id;
        END;`,
        `CREATE TRIGGER users_trigger_last_modified
        AFTER UPDATE ON users
        FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
        BEGIN
            UPDATE users SET last_modified = strftime('%s', 'now') WHERE id = NEW.id;
        END;`
    ]

    },
];
