#!/home/pogilvie/Library/node/bin/node

fs = require('fs');


fs.readFile('/home/pogilvie/Documents/20140417.json', function (err, data) {

    var
    snapshot, dob_string, dob_month, dob_day, dob_year, dob, now,
    position_index = 8, personCount = 0,    
      oneYearInMsec = 365.25 * 24 * 60 * 60 * 1000,         // Constant: number of milleseconds in one year
    ageDistribution = {       invalid_dob : 0,
	                     under_twenty : 0,
                         twenty_to_thirty : 0,
                          thirty_to_forty : 0,
                           forty_to_fifty : 0,
                           fifty_to_sixty : 0,
                         sixty_to_seventy : 0,
                        seventy_to_eighty : 0,
                         eighty_to_ninety : 0  };   
    if (err)
	throw(err);

    snapshot = JSON.parse(data)

    snapshot.data.forEach(function (person) {
	var ageInYears;

	//                         0123456789
	// DOB is string of format MM-DD-YYYY at dob_index of 'data' array of JSON object
	dob_string = person[10];

	try {
	    dob_month = dob_string.substring(0, 2);
	    dob_day = dob_string.substring(3, 5);
	    dob_year = dob_string.substring(6,10);
	}
	catch(error) {
	    console.log("invalid DOB string :" + dob_string);
	    ageDistribution.invalid_dob++;
	}
	
	
	
	dob = new Date(dob_year, dob_month, dob_day);
	now = new Date();

	ageInYears = (now - dob)/oneYearInMsec;
	console.log(++personCount + " DOB: " + dob_string + " Age: " + ageInYears);
	if (ageInYears < 0) {
	    console.log("invalid age: " + ageInYears);
	    ageDistribution.invalid_dob++;
	}
	else if (ageInYears < 20) {
	    console.log("under twenty");
	    ageDistribution.under_twenty++;
	}
	else if (ageInYears < 30) {
	    console.log("under thirty");
	    ageDistribution.twenty_to_thirty++;
	}
	else if (ageInYears < 40) {
	    console.log("under forty");
	    ageDistribution.thirty_to_forty++;
	}
	else if (ageInYears < 50) {
	    console.log("under 50");
	    ageDistribution.forty_to_fifty++;
	}
	else if (ageInYears < 60) {
	    console.log("under 60");
	    ageDistribution.fifty_to_sixty++;
	}
	else if (ageInYears < 70) {
	    console.log("under seventy");
	    ageDistribution.sixty_to_seventy++;
	}
	else if (ageInYears < 80) {
	    console.log("under eighty");
	    ageDistribution.seventy_to_eighty++;
	}
	else
	    ageDistribution.eighty_to_ninety++;

    });
    console.log("Number of persons on wait list: " + snapshot.data.length);
    console.log("unknown age :  " + ageDistribution.invalid_dob);
    console.log("Under twenty:  " + ageDistribution. under_twenty);
    console.log("20 - 30     :  " + ageDistribution.twenty_to_thirty);
    console.log("30 - 40     :  " + ageDistribution.thirty_to_forty);
    console.log("40 - 50     :  " + ageDistribution.forty_to_fifty);
    console.log("50 - 60     :  " + ageDistribution.fifty_to_sixty);
    console.log("60 - 70     :  " + ageDistribution.sixty_to_seventy);
    console.log("70 - 80     :  " + ageDistribution.seventy_to_eighty);
    console.log("80 - 90     :  " + ageDistribution.eighty_to_ninty);
 
});
    

