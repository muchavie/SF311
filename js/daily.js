#!/home/pogilvie/Library/node/bin/node
// daily.js: load data from daily snapshot in JSON format to 
//           sqlite3/311.db schema
//
//   Author: Peter Ogilvie code@ogilvie.us.com
//  Created: May 21, 2014
//  Version: 2/20140703
//     todo: slow, slow and more slow?  Did I mention that it's slow?

var          fs = require('fs'),
        sqlite3 = require('sqlite3'),
           home = '/home/pogilvie/Dropbox/Projects/311',
        dataDir = home + '/' + 'data',
          dbDir = home + '/' + 'db',
         dbFile = dbDir + '/' + '311.db',
                  db, filePath, sqlCreateTable, sqlInsertRow;
 
   
// Aynch form of open is not useful as value of db may not be
// used within the frame of the Database() call.
db = new sqlite3.Database(dbFile);

// daily.js YYYYMMDD YYYYMMDD ... 
process.argv.forEach(function(value, index, array) {
  
    if (index === 0 || index === 1)
	return;
    else {
	
	      filePath = dataDir + '/' + value + '.json';
	sqlCreateTable = "CREATE TABLE Daily_" + value + " (changesid INTEGER, dob DATE, position INTEGER, seniority INTEGER, caseid INTEGER)";
	  sqlInsertRow = "INSERT INTO Daily_"  + value + " VALUES(?,DATE(?),?,?,?)";

	fs.readFile(filePath, function (fileReadError, fileData) {
	    var data;

	    if (fileReadError)
		throw(fileReadError);

	    data = JSON.parse(fileData);

	    db.run(sqlCreateTable, function (createTableError) {

		if (createTableError) {
		    console.log(sqlCreateTable);
		    throw(createTableError);
		}
	    
		// read data from YYYYMMDD.json write to 311.db.Daily_YYYYMMDD
		data.data.forEach(function(waiter) {
		    // data.data[] columm key
		    //      [0]: sid
		    //      [1]: id
		    //      [2]: position
		    //      [3]: created_at
		    //      [4]: created_meta
		    //      [5]: updated_at
		    //      [6]: updated_meta
		    //      [7]: meta
		    //      [8]: position_number	(INTEGER)
		    //      [9]: seniority		(INTEGER)
		    //     [10]: Date of Birth		(DATE)
		    //     [11]: changesID		(INTEGER)
		    //     [12]: caseid			(INTEGER)
		    //     [13]: message		(BOOLEAN)

		    var day, month, year, dobIN, dobOUT;
	    
		    dobIN = waiter[10];
		    if (dobIN && waiter[11]) {

			//  Rearrange DOB string to be compatible with sqlite3
			//  date() function.  IN (MM-DD-YYYY) -> OUT (YYYY-MM-DD)
			 month = dobIN.substring(0, 2);
			   day = dobIN.substring(3, 5);
          		  year = dobIN.substring(6,10);
			dobOUT = year + "-" + month + "-" + day; 
			db.run(sqlInsertRow, waiter[11], dobOUT, waiter[8], waiter[9], waiter[12], function (insertRowError) {

			    if (insertRowError)
				throw (insertRowError);

			    console.log("insert cid: " + waiter[11] + " DOB: " + dobOUT);

			}); // INSERT 
		    } // if JSON row data is reasonable.  Last row is 0's as sentinel
		}); // data.forEach()
	    }); // CREATE TABLE
	}); // readFile()
    } // else script argument
}); // process.forEach()
		     
    