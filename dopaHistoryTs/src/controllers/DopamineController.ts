
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { Ref } from 'vue';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Dopamine } from '@/models/Dopamine';

class DopamineController {
    _db: Ref<SQLiteDBConnection | null>
    constructor(db: Ref<SQLiteDBConnection | null>) {
        this._db = db;
    }
    async addDopamines(dopamine: Dopamine) {
        const stmt = `INSERT INTO dopamine (id,name,startDate) VALUES ("${dopamine.id}","${dopamine.name}","${dopamine.startDate}");`;
        console.log(stmt)
        this._db.value!.query(stmt);
    }
    async getDopamines() {
        const stmt = 'SELECT * FROM dopamine WHERE sql_deleted == 0';
        const values: any[] = [];
        const fetchData = await useQuerySQLite(this._db, stmt, values);
        console.log(fetchData)
        return fetchData;
    }
}
export default DopamineController;
