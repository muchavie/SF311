var   sqlite3 = require('sqlite3'),
           fs = require('fs');
      dbfile  = '/home/pogilvie/Dropbox/Projects/311/db/311.db',
     datafile = '/home/pogilvie/Dropbox/Projects/311/data/dailyCount.json',
    tablesSQL = "select name from sqlite_master where name like 'Daily_%' order by name",
     countSQL = 'select count(*) from ',
           db = new sqlite3.Database(dbfile, sqlite3.OPEN_READONLY);

db.all(tablesSQL, function (err, dailyTableNames) {
    
    var dailys = [], index = 0;
    
    if (err)
        throw(err);
    
    dailyTableNames.forEach(function (name) {
        
        var cSQL = countSQL + name.name;
        
        db.each(cSQL, function (err, result) {
            
            var p = 'count(*)', o = {};
            
            if (err)
                throw(err);
            
            o.table = name.name;
            o.count = result[p];
            dailys[index++] = o;
        }, function(err, rowCount) {
            if (dailys.length == dailyTableNames.length) {
                fs.writeFile(datafile, JSON.stringify(dailys, false, true), function (err) {
                    if (err)
                        throw(err);
                    
                    console.log('write is complete');
                });
            }
        });
    });
});

console.log('dailyCount.js done');
