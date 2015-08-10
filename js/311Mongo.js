#!/home/pogilvie/Library/node/bin/node

var          fs = require('fs'),
    mongoClient = require('mongodb').MongoClient,
         format = require('util').format,
           host = 'localhost',
           port = 27017;


fs.readFile('/home/pogilvie/Documents/20140417.json', function (err, data) {

    console.log("Connecting to host: " + host + " port: " + port);

    mongoClient.connect(format("mongodb://%s:%s/311Snapshot?w=1", host, port), function (err, db) {

	var snapshot, queue,
	         position = 1, dobString, personAgeInYears,
	    oneYearInMsec = 365.25 * 24 * 60 * 60 * 1000;         // Constant: number of milleseconds in one year

	if (err)
	    throw(err);

	snapshot = db.collection('snapshot');

	queue = JSON.parse(data);

	queue.data.forEach(function (person) {
	    var record = {};

	    // person[] ...
	    // [ 53264,                                    0
	    // "9BB687B4-FAA3-4C01-B08F-B3038C13EB3F",     1
	    // 53264,                                      2
	    // 1397754313,                                 3
	    // "392873",                                   4
	    // 1397754313,                                 5
	    // "392873",                                   6
	    // null,                                       7
	    // "2",                                        8 <- waitListPosition
	    // "14059004",                                 9 <- listSenority
	    // "06-06-1990",                              10 <- dob (MM-DD-YYYY)
	    // "339233",                                  11 <- changesID
	    // "3408381",                                 12 <- serviceID
	    // "null" ]                                   13 <- serviceMsg
	    record.changesID = person[11];
	    record.serviceID = person[12];

	    dobString        = person[10];

	    try {
		dobMonth = dobString.substring(0, 2);
		  dobDay = dobString.substring(3, 5);
	  	 dobYear = dobString.substring(6,10);
	    }
	    catch (dobStringError) {
		console.log("dobString cannot be parsed as a date: " + dobString);
	    }
	    record.dob   = new Date(dobYear, dobMonth, dobDay);
	    now          = new Date();
	    record.listSenority = person[9];

	    personAgeInYears = (now - record.dob) / oneYearInMsec;

	    console.log("read person, changesID: " + record.changesID +
		                           "age: " + personAgeInYears +
	   	                " List Senority: " + record.listSenority +
			        "311 Service ID: " + record.serviceID +
		                "array position: " + position++);

	    snapshot.insert({   'changesID' : record.changesid,
			     'listSenority' : record.listSenority,
				'serviceID' : record.serviceID,
				      'DOB' : record.dob },
			                { w : 0 });        // Write Concern level one report write errors

	    snapshot.count(function (countError, count) {
		console.log("Colection snapshot has: " + count + " documents.");
	    });
	});
    });
});
    

