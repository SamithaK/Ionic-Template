import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { BehaviorSubject } from 'rxjs';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class OfflineDBService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform,
    private sqlite: SQLite, private dbCopy: SqliteDbCopy, private androidPermissions: AndroidPermissions) {
    console.log("offline service called")
    this.plt.ready().then(() => {
      if (this.plt.is('android')) {
        this.sqlite.create({
          name: 'test.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.loadTables()
            this.dbReady.next(true);
            this.copyDB();
            //this.testDataBase(); // to test all offline DB functionalities
            // this.setupIntialDatabase(); // if need to intialize tables and values from sql file
          });
      } else {
        this.dbReady.next(false);
      }
    });
  }

  // check the dabase status
  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  // to create new table name
  createTable(tableNameWithVariables: string, data?: any[]): Promise<any> {
    // ex: CREATE TABLE contacts( contact_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL ), data;
    return this.database.executeSql(`create table IF NOT EXISTS ${tableNameWithVariables}`, data ? data : [])
  }

  // to insert new data into table 
  insertData(tableName: string, tableVariablesAndValues: string, data?: any[]): Promise<any> {
    // ex: 'INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)', data
    return this.database.executeSql(`INSERT INTO ${tableName} ${tableVariablesAndValues}`, data ? data : [])
  }

  // get data item from table
  getTableData(tableName: string, requiredData: string, fromValueWithEqual: string, data?: any[]) {
    // ex: 'SELECT name,skill FROM developer WHERE id = ?', [id]
    return this.database.executeSql(`SELECT ${requiredData} FROM ${tableName} WHERE ${fromValueWithEqual}`, data ? data : []).then(value => {
      return value.rows.item(0) ? value.rows.item(0) : {}
    })
  }

  //Update data from table
  updateTableData(tableName: string, updatedData: string, fromValueWithEqual: string, data?: any[]): Promise<any> {
    // ex: `UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data
    return this.database.executeSql(`UPDATE ${tableName} SET ${updatedData} WHERE ${fromValueWithEqual}`, data ? data : [])
  }

  // delete data from from table
  deleteTableData(tableName: string, fromValueWithEqual: string, data?: any[]): Promise<any> {
    // ex: 'DELETE FROM developer WHERE id = ?', [id]
    return this.database.executeSql(`DELETE FROM ${tableName} WHERE ${fromValueWithEqual}`, data ? data : [])
  }

  // delete all rows
  deleteAllrows(tableName: string) {
    console.log("delete all rows")
    return this.database.executeSql(`DELETE FROM ${tableName}`)
  }

  //get all data from table
  getAllFromTable(tableName: string, selectedValues: string, data?: any[]) {
    // ex: 'SELECT name,skill FROM developer
    return this.database.executeSql(`Select ${selectedValues} from ${tableName}`, data ? data : []).then(value => {
      if (value.rows.length > 0) {
        let reponseValue = []
        for (var i = 0; i < value.rows.length; i++) {
          reponseValue.push(value.rows.item(i));
        }
        return reponseValue
      }
    })
  }

  // Custom Query for other operations 
  customQuery(customQuery: string, data?: any[]): Promise<any> {
    return this.database.executeSql(customQuery, data ? data : [])
  }

  // copying offline DB backup into SD cards
  copyDB() {
    console.log("DB Copy called")
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((permission) => {
      console.log("Extanal permisions ", permission)
      if (permission.hasPermission) {
        document.addEventListener('pause', () => {
          console.log("DB Copy called with pause event")
          this.copyToStorage()
        })
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((val) => {
          this.copyDB()
        })
      }

    }).catch((error) => {
      console.log("error while checking permsions ", error)
    })
  }

  copyToStorage() {
    console.log("DB Copy called with pause event")
    this.dbCopy.copyDbToStorage('test.db', 0, 'sdcard/', true).then((value) => {
      console.log("DB Succesfully Copied into Storage ", value)
      // this.removeLocalElmisDB()
    }).catch((error) => { console.log("Error while copying DB into storage ", error) })
  }


  // initial setup for from sql file.
  setupIntialDatabase() {
    return new Promise<any>((resolve, reject) => {
      this.dbCopy.checkDbOnStorage('test.db', "sdcard/")
        .then((res: any) => {
          console.log("db check ")
          this.dbCopy.copyDbFromStorage('test.db', 0, '/sdcard/test.db', false).then((res: any) => {
            resolve(true)
            console.log("db resotore success ", res)
          }
          ).catch((error: Error) => {
            console.log("something went wrong with restore ", error)
            reject(error.message)

          })


        }).catch((error: Error) => {
          console.log("some thing went wrong with db check ", error)
          //reject(error.message)
        })
    });

  }

  async removeUserFromDb() {
    return new Promise<any>((resolve, reject) => {
      this.deleteAllrows("user").then((val) => {
        console.log("successfully deleted ", val)
        resolve(val)
      }).catch((error) => {
        console.log("error while deleting ", error)
        reject(error)
      })
    })
  }


  async removeLocalElmisDB() {
    return new Promise<any>((resolve, reject) => {
      this.dbCopy.remove('test.db', 0)
        .then((res: any) => {
          localStorage.setItem("lastSyncManufacture", null);
          resolve(true)
          console.log("successfully removed ", res)
        }).catch((error: Error) => {
          reject(error.message)
          console.log("error while removing db ", error)
        })
    });
  }


  async loadTables() {
    console.log("*******Creating inital Tables********")
 
    // creating user profile table
    await this.createTable(`userProfile(Title TEXT, FullName TEXT, ProfileEmail TEXT, ContactNo TEXT,
         Designation TEXT, Gender INTEGER, CitizenshipNo TEXT, PersonalAddress TEXT, DateOfEmployment TEXT, DateOfBirth TEXT, 
         synced TEXT)`).then((value) => {
      console.log("created table user profile ", value)
    }).catch((error) => { console.log("Something went wrongw with while creating user profile table ", error) })

  }

  async testDataBase() {

    console.log("*******Start testing********")

    await this.createTable("user(id INTEGER, name TEXT)").then((value) => {
      console.log("created table user ", value)
    }).catch((error) => { console.log("Something went wrong while create table ", error) })

    await this.insertData("user", "(id, name ) VALUES (?, ?)", [12, "Snow"]).then((value) => {
      console.log("insert value into table ", value)
    }).catch((error) => { console.log("error while inserting data ", error) })

    await this.insertData("user", "(id, name ) VALUES (?, ?)", [15, "Jon"]).then((value) => {
      console.log("insert value into table ", value)
    }).catch((error) => { console.log("error while inserting data ", error) })

    await this.getTableData("user", "*", "id = ?", [15]).then((value) => {
      console.log("got data from product before update ", value)
    }).catch((error) => { console.log("Something went wrong while loading data from table ", error) })

    await this.updateTableData("user", "name = ?", "id = 15", ["Tony"]).then((value) => {
      console.log("data succesfully updated ", value)
    }).catch((error) => {
      console.log("error while updating data ", error)
    })

    await this.getTableData("user", "*", "id = ?", [15]).then((value) => {
      console.log("got data from product after update ", value)
    }).catch((error) => { console.log("Something went wrong while loading data from table ", error) })

    await this.deleteTableData("user", " id = ?", [14]).then((value) => { console.log("Successfully Deleted ", value) }).catch((error) => { console.log("error while deleting from the offline DB ", error) })

    await this.getAllFromTable("user", "*").then((value) => {
      console.log("got data from getAllFromTable ", value)
    }).catch((error) => {
      console.log("Error while getting data from getAllFromTable query ", error)
    })

  }


}
