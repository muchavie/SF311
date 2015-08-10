var     sqlite3 = require('sqlite3'),
         dbfile = "/home/pogilvie/Dropbox/Projects/311/db/311.db",
             db = new sqlite3.Database(dbfile);



// search for value v in array a
function binarySearch (a, v, i0, i1) {
    var im = Math.floor((i0 + i1) / 2),
         p = a[im];
    // console.log("v: " + v + " i0: " + i0 + " i1: " + i1); 
    if (p.person_id === v)
	   return p;
    else if (i0 === i1 || (i0 + 1) == i1)
	   return null;
    else if (p.person_id < v)
	   return binarySearch(a, v, im, i1);
    else
	   return binarySearch(a, v, i0, im);
}

//sqlite> .tables
//Daily           Daily_20140429  Daily_20140516  Daily_20140609  Daily_20140625
//Daily_20140327  Daily_20140430  Daily_20140520  Daily_20140610  Daily_20140626
//Daily_20140414  Daily_20140501  Daily_20140521  Daily_20140611  Delta_20140414
//Daily_20140415  Daily_20140502  Daily_20140522  Daily_20140612  Delta_20140415
//Daily_20140416  Daily_20140505  Daily_20140527  Daily_20140613  Delta_20140417
//Daily_20140417  Daily_20140506  Daily_20140528  Daily_20140614  Delta_20140418
//Daily_20140418  Daily_20140507  Daily_20140529  Daily_20140616  Delta_20140421
//Daily_20140421  Daily_20140508  Daily_20140530  Daily_20140617  Person        
//Daily_20140422  Daily_20140509  Daily_20140602  Daily_20140618  Pos           
//Daily_20140423  Daily_20140512  Daily_20140603  Daily_20140619  Request       
//Daily_20140424  Daily_20140513  Daily_20140604  Daily_20140620  deltaStats    
//Daily_20140425  Daily_20140514  Daily_20140605  Daily_20140622  newPeople     
//Daily_20140428  Daily_20140515  Daily_20140606  Daily_20140624  oldPeople    

db.serialize(function () {
    var people = [], stats = {};

    stats.processed = 0;
    stats.newid = 0;
    stats.update = 0;

    // Fetch People
    db.all("SELECT * FROM Person order by person_id", function (personErr, personRows) {

	if (personErr)
	    throw (personErr);

	db.serialize().all("SELECT changesid, dob from Daily_" + process.argv[2], function (dailyErr, dailyRows) {
	    var p;

	    if (dailyErr)
		throw (dailyErr);

	    dailyRows.forEach(function (row) {
		stats.processed++;
		p = binarySearch(personRows, row.changesid, 0, personRows.length);

		if (p === null)
		{
		    p = {};
		    p.person_id = row.changesid; p.person_dob = row.dob;
		    stats.newid++;
		    console.log("new id: " + p.person_id);
		    db.run("INSERT INTO Person (person_id, person_dob) VALUES (?, ?)", p.person_id, p.person_dob); 
		}
		else if (p.person_dob !== row.dob)
		{
		    console.log("update id: " + p.person_id + " old dob: " + p.person_dob + " new dob: " + row.dob);
		    stats.update++;
		    db.run("UPDATE Person SET person_dob = ? WHERE person_id = ?", row.dob, p.person_id);
		}
	    });
	    console.log("Processed: " + stats.processed + " New: " + stats.newid + " Updated: " + stats.update); 	    
	});
    });
});

