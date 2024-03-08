import { Ref, getCurrentInstance, watch } from 'vue';
import { Toast } from '@capacitor/toast';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

class SqliteController {
    isInitComplete: Boolean = false;
    appInstance = getCurrentInstance();
    //const dbInitialized = computed(() => !!db.value);
    dbNameRef = '';
    isDatabase = false;
    db: Ref<SQLiteDBConnection | null>
    sqliteServ = this.appInstance?.appContext.config.globalProperties.$sqliteServ;
    storageServ = this.appInstance?.appContext.config.globalProperties.$storageServ;
    platform = this.sqliteServ.getPlatform();

    async openDatabase() {
        try {
            const dbUsersName = this.storageServ.getDatabaseName();
            this.dbNameRef = dbUsersName;
            const version = this.storageServ.getDatabaseVersion();

            const database = await this.sqliteServ.openDatabase(dbUsersName, version, false);
            this.db = database;
            this.isDatabase = true;
        } catch (error) {
            const msg = `Error open database: ${error}`;
            console.error(msg);
            Toast.show({
                text: msg,
                duration: 'long'
            });
        }
    };
    async initConnection() {
        const initSubscription = await this.storageServ.isInitCompleted.subscribe(async (value: boolean) => {
            this.isInitComplete = value;
            if (this.isInitComplete === true) {
                const dbUsersName = this.storageServ.getDatabaseName();
                if (this.platform === "web") {
                    customElements.whenDefined('jeep-sqlite').then(async () => {
                        await this.openDatabase();
                    }).catch((error) => {
                        const msg = `Error open database: ${error}`;
                        console.log(msg);
                        Toast.show({
                            text: msg,
                            duration: 'long'
                        });
                    });
                } else {
                    await this.openDatabase();
                }
            }
        });
    }
    ClearConnection = () => {
        this.sqliteServ.closeDatabase(this.dbNameRef, false)
            .then(() => {
                this.isDatabase = false;
            }).catch((error: any) => {
                const msg = `Error close database:
                              ${error.message ? error.message : error}`;
                console.error(msg);
                Toast.show({
                    text: msg,
                    duration: 'long'
                });
            });
    }


}
export default SqliteController;
