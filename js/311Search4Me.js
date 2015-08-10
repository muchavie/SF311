#!/home/pogilvie/Library/node/bin/node

var  fs = require('fs'),
     me = '06-22-1962',
dataDir = '/home/pogilvie/Projects/311/data';


fs.readdir(dataDir, function (fileError, fileNames) {

    if (fileError)
	throw(fileError);

    fileNames.sort().forEach(function (fileName) {
        var filePath = dataDir + "/" + fileName;

	fs.readFile(filePath, function (fileReadError, fileData) {
	    var snapshot, results = [];
 
	    if (fileReadError)
		throw(fileReadError);
	    
	    snapshot = JSON.parse(fileData);

	    snapshot.data.forEach(function (waiter) {
		var day, month, year, seniority, changesID, position, dob;

		if (waiter[10] === me) {
		          dob = waiter[10];
		        month = dob.substring(0, 2);
		          day = dob.substring(3, 5);
		         year = dob.substring(6,10);
		     position = waiter[8];
		    changesID = waiter[11];
		    seniority = waiter[9];
		    results.push(fileName
				+ " changesID: " + changesID 
				+ " - "          + month + "/" + day + "/" + year
				+ " Position: "  + position
			        + " Seniority: " + seniority);
		    return;
		}

		
	    });
	    console.log(results);
	});

    });

    
});