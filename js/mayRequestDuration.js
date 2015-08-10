var d3 = require('d3'),
    fs = require('fs');
fs.readFile('../data/Mcsv', 'utf8', function(e,data) {
    
    var a = [0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0]
    if (e)
        throw(e);
    
    d3.csv.parseRows(data).forEach(function (r) {
        
            a[r[4]]++;
    });
    
    console.log(a);
});