

var sqlite3 = require('sqlite3'),
         d3 = require('d3'),

db = new sqlite3.Database('/home/pogilvie/Dropbox/Projects/311/db/311.db');

db.all('SELECT * from Person order by person_id', function (err, people) {
    var          ages = [], msec_per_year = 1000 * 60 * 60 * 24 * 365.25,
        t11dateformat = d3.time.format('%Y-%m-%d');
                today = new Date();
    if (err)
	throw(err);

    people.forEach(function(person) {
	ages.push(Math.round((today - t11dateformat.parse(person.person_dob)) / msec_per_year));
    });

    console.log('Age Range: ' + d3.extent(ages) + ' Median age: ' + d3.median(ages) + ' Average Age: ' + Math.round(d3.mean(ages)));
});

