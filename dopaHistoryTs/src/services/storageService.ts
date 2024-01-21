import { BehaviorSubject } from 'rxjs';
import { getCurrentInstance } from 'vue';
import { ISQLiteService } from '../services/sqliteService';
import { IDbVersionService } from '../services/dbVersionService';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserUpgradeStatements } from '../upgrades/user.upgrade.statements';
import { User } from '../models/User';
import { Dopamine } from '../models/Dopamine'
import { DopaHistory } from '../models/DopaHistory'

export interface IStorageService {
    initializeDatabase(): Promise<void>
    getUsers(): Promise<User[]>
    addUser(user: User): Promise<number>
    updateUserById(id: string, active: number): Promise<void>
    deleteUserById(id: string): Promise<void>
    getDatabaseName(): string
    getDatabaseVersion(): number
};
class StorageService implements IStorageService {
    versionUpgrades = UserUpgradeStatements;
    loadToVersion = UserUpgradeStatements[UserUpgradeStatements.length - 1].toVersion;
    db!: SQLiteDBConnection;
    database: string = 'myuserdb';
    sqliteServ!: ISQLiteService;
    dbVerServ!: IDbVersionService;
    isInitCompleted = new BehaviorSubject(false);
    appInstance = getCurrentInstance();
    platform!: string;

    constructor(sqliteService: ISQLiteService, dbVersionService: IDbVersionService) {
        this.sqliteServ = sqliteService;
        this.dbVerServ = dbVersionService;
        this.platform = this.appInstance?.appContext.config.globalProperties.$platform;
    }

    getDatabaseName(): string {
        return this.database;
    }
    getDatabaseVersion(): number {
        return this.loadToVersion;
    }
    async initializeDatabase(): Promise<void> {
        // create upgrade statements
        try {
            await this.sqliteServ.addUpgradeStatement({
                database: this.database,
                upgrade: this.versionUpgrades
            });
            this.db = await this.sqliteServ.openDatabase(this.database, this.loadToVersion, false);
            const isData = await this.db.query("select * from sqlite_sequence");
            if (isData.values!.length === 0) {
                // create database initial users if any

            }

            this.dbVerServ.setDbVersion(this.database, this.loadToVersion);
            if (this.platform === 'web') {
                await this.sqliteServ.saveToStore(this.database);
            }
            this.isInitCompleted.next(true);
        } catch (error: any) {
            const msg = error.message ? error.message : error;
            throw new Error(`storageService.initializeDatabase: ${msg}`);
        }
    }
    async getUsers(): Promise<User[]> {
        return (await this.db.query('SELECT * FROM users;')).values as User[];
    }
    async addUser(user: User): Promise<number> {
        const sql = `INSERT INTO users (name) VALUES (?);`;
        const res = await this.db.run(sql, [user.name]);
        if (res.changes !== undefined
            && res.changes.lastId !== undefined && res.changes.lastId > 0) {
            return res.changes.lastId;
        } else {
            throw new Error(`storageService.addUser: lastId not returned`);
        }
    }
    async updateUserById(id: string, active: number): Promise<void> {
        const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
        await this.db.run(sql);
    }
    async deleteUserById(id: string): Promise<void> {
        const sql = `DELETE FROM users WHERE id=${id}`;
        await this.db.run(sql);
    }
    //dopamine sql
    async getDopamine(): Promise<Dopamine[]> {
        return (await this.db.query('SELECT * FROM dopamine;')).values as Dopamine[];
    }
    async addDopamine(dopamine: Dopamine): Promise<number> {
        const sql = `INSERT INTO dopamine (name,startDate) VALUES (?,?);`;
        const res = await this.db.run(sql, [dopamine.name, dopamine.startDate]);
        if (res.changes !== undefined
            && res.changes.lastId !== undefined && res.changes.lastId > 0) {
            return res.changes.lastId;
        } else {
            throw new Error(`storageService.addUser: lastId not returned`);
        }
    }

    async updateDopamine(dopamine: Dopamine): Promise<void> {
        const sql = `UPDATE dopamine SET
        name="${dopamine.name}",
        recordBestThinkDay="${dopamine.recordBestThinkDay}",
        recordBestDoDay="${dopamine.recordBestThinkDay}",
        allDoDayCount="${dopamine.allDoDayCount}",
        allThinkDayCount="${dopamine.allThinkDayCount}",
        daysCount="${dopamine.daysCount}",
        startDate="${dopamine.startDate}" 
        WHERE id=${dopamine.id}`;
        //console.log(sql)
        await this.db.run(sql);
    }
    async deleteDopamineById(id: string): Promise<void> {
        const sql = `DELETE FROM dopamine WHERE id=${id}`;
        await this.db.run(sql);
    }

    //history sql
    async getHistoryByDopamineId(id: number): Promise<DopaHistory[]> {
        const sql = `SELECT * FROM history WHERE id_dopamine=${id} ORDER by date(datetime) DESC`;
        return (await this.db.query(sql)).values as DopaHistory[];
    }

    async addDopaHistory(newHistory: DopaHistory): Promise<number> {
        const sql = `INSERT INTO history (id_dopamine,datetime,doCount,thinkCount,lastDoDay,lastThinkDay) VALUES (${newHistory.id_dopamine},"${newHistory.dateTime}",${newHistory.doCount},${newHistory.thinkCount},${newHistory.lastDoDay},${newHistory.lastThinkDay});`;
        console.log(sql)
        const res = await this.db.run(sql/*, [
            newHistory.id_dopamine,``
            newHistory.dateTime,
            newHistory.doCount,
            newHistory.thinkCount,
            newHistory.lastDoDay,
            newHistory.lastThinkDay
        ]*/);
        if (res.changes !== undefined
            && res.changes.lastId !== undefined && res.changes.lastId > 0) {
            return res.changes.lastId;
        } else {
            throw new Error(`storageService.addUser: lastId not returned`);
        }
    }

    async updateHistoryById(history: DopaHistory): Promise<void> {
        const sql = `UPDATE history SET 
        dateTime="${history.dateTime}",
        doCount=${history.doCount},
        thinkCount=${history.thinkCount},
        lastDoDay=${history.lastDoDay},
        lastThinkDay=${history.lastThinkDay} 
        WHERE id=${history.id}`;
        //console.log(sql)
        await this.db.run(sql);
    }
    async deleteHistoryByDopamineId(id: string): Promise<void> {
        const sql = `DELETE FROM history WHERE id_dopamine=${id}`;
        await this.db.run(sql);
    }



}
export default StorageService;
