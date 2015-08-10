//t11.js   configuations and utilites for using the sqlite driver with the 311.db

var      sqlite3 = require('sqlite3'),
              db = new sqlite3.Database('/home/pogilvie/Dropbox/Projects/311/db/311.db');

exports.database = function() {
    return db;
}

exports.julian   = function(seniority) {
    // A 311 seniority # has the form YYDDDppp where
    // YY is the two digit year DDD julian calendar date starting at 1
    // on Jan 1 and ppp is the requests random position on the list for
    // that day.
    return Number(String(seniority).slice(2,5));
}

exports.tdate    = function(twoDigitYear, julianDate) {
    // Givin a Julian Date (Jan 1 = 1 <-> Dec 31 = 365 or 366 on leap years)
    // return a string of the formaat YYDDD000.  This is the date part of a 
    // 311 seniority integer
    var yy, ddd;

    yy = twoDigitYear.toString();
    ddd = julianDate.toString();
    
    // a Julian Date is [1..365]
    if (typeof julianDate !== 'number')
        throw ( {name : 'TypeError', message : 't11.tdate parameter with number type expected'} );
    else if (julianDate !== Math.floor(julianDate))
        throw ( {name : 'TypeError', message : 't11.tdate Julian dates are a proper subset of the cardinal numbers'} );
    else if (julianDate < 1 || julianDate > 366)
        throw ( {name : 'RangeError', message :'t11.tdate Julian dates [1..366]' + julianDate} );
    else if (julianDate < 10)
        ddd = '00'+ddd;
    else if (julianDate < 100)
        ddd = '0'+ddd;
    
    return yy+ddd+'000';
}