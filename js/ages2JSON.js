

var                 sqlite3 = require('sqlite3'),
                         d3 = require('d3'),
 age_distribution_file_name = '/home/pogilvie/Dropbox/Projects/311/data/age_distribution.json',
                         fs = require('fs'),
                         db = new sqlite3.Database('/home/pogilvie/Dropbox/Projects/311/db/311.db');

db.all('SELECT * from Person order by person_id', function (err, people) {
    var                ages = [], msec_per_year = 1000 * 60 * 60 * 24 * 365.25,
           age_distribution = [], age_count,
              t11dateformat = d3.time.format('%Y-%m-%d');
                      today = new Date();
    if (err)
	throw(err);

    people.forEach(function(person) {
	ages.push(Math.round((today - t11dateformat.parse(person.person_dob)) / msec_per_year));
    });

    console.log('Age Range: ' + d3.extent(ages) + ' Median age: ' + d3.median(ages) + ' Average Age: ' + Math.round(d3.mean(ages)));

    ages.forEach(function(age) {
	age_count = age_distribution[age];
	if (age_count === undefined)
	    age_count = 1;
	else
	    age_count = age_count + 1;

	age_distribution[age] = age_count;
    });

    fs.writeFile(age_distribution_file_name, JSON.stringify(age_distribution), function (writeErr) {

	if (writeErr)
	    throw (writeErr);

	console.log("wrote: " + age_distribution_file_name);
    });
});

