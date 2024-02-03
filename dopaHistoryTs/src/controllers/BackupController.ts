import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Dopamine } from '../models/Dopamine'
import { DopaHistory } from '@/models/DopaHistory';
import { HistoryComment } from '@/models/HistoryComment';
export interface IBackupController {
    getDopamine(): Promise<Dopamine[]>
};
type NumericallyKeyedObject<T> = {
    [key: number]: T;
};
class BackupController {
    _db!: SQLiteDBConnection | null;
    db(db: SQLiteDBConnection | null) {
        this._db = db
    }
    async getDopamine(msg: string): Promise<Dopamine[]> {
        let result = (await this._db!.query('SELECT * FROM dopamine WHERE sql_deleted == 0;')).values as Dopamine[];
        console.log(result, 'msg')
        return result
    }

    async restoreDopamine(dopamines: Dopamine[]) {
        dopamines.forEach(async (dopamine: any) => {
            let dataString = Object.values(dopamine).map(item => {
                if (typeof item == 'string')
                    return `'${item}'`
                return item
            });
            dataString.join(", ");
            const sql = `INSERT INTO dopamine VALUES (${dataString});`;
            //console.log(sql)
            await this._db!.query(sql);
        })
    }
    async restoreHistory(history: DopaHistory[]) {
        history.forEach(async (history) => {
            let dataString = Object.values(history).map(item => {
                if (typeof item == 'string')
                    return `'${item}'`
                return item
            });
            dataString.join(", ");
            const sql = `INSERT INTO history VALUES (${dataString});`;
            //console.log(sql)
            await this._db!.query(sql);
        })
    }
    async restoreComment(comment: HistoryComment[]) {
        comment.forEach(async (comment) => {
            let dataString = Object.values(comment).map(item => {
                if (typeof item == 'string')
                    return `'${item}'`
                return item
            });
            dataString.join(", ");
            const sql = `INSERT INTO comment VALUES (${dataString});`;
            //console.log(sql)
            await this._db!.query(sql);
        })
    }

}
export default BackupController;
