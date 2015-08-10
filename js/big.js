//   big.js: Create a JSON Object file with an array element for each request
//           each element contains: request #, request start day, # of days 
//   Author: Peter Ogilvie code@ogilvie.us.com
//  Created: July 13, 2014
//  Version: 1/20140713
//CREATE TABLE Request
//(
//	           request_id        INTEGER PRIMARY KEY NOT NULL,
//	           request_seniority INTEGER NOT NULL,
//	           request_pid       INTEGER NOT NULL REFERENCES Person (person_id)
//);
//CREATE TABLE QPos
//(
//	             qpos_pid        INTEGER NOT NULL REFERENCES People(person_id),
//	             qpos_rqid       INTEGER NOT NULL REFERENCES Request(request_id),
///* YYDDD000 */ qpos_date       INTEGER NOT NULL,   
//	             qpos_num        INTEGER NOT NULL
//);
var           d3 = require('d3'),
             t11 = require('./t11.js'),
  allRequestsSQL = 'SELECT request_id, request_seniority FROM Request',
latestRequestSQL = 'SELECT MAX(request_seniority) FROM Request',
  requestInfoSQL = 'SELECT * FROM QPos where qpos_rqid = ? ORDER BY qpos_date',
               r = [], e, n,
              r2 = [ { '1' : { start : 55 , end : 61, dayswaited : 0, waiters : 0}},
//                March 2014                      Marc, dayswaited : 0, waiters : 0h 2014
//         Su Mo Tu We Th Fr Sa      Su  Mo  Tu  We  Th  Fr  Sa, dayswaited : 0, waiters : 0   
//                            1                             , dayswaited : 0, waiters : 0 60
//          2  3  4  5  6  7  8      61  62  63  64  65  66  67 
//          9 10 11 12 13 14 15      68  69  70  71  72  73  74 
//         16 17 18 19 20 21 22      75  76  77  78  79  80  81
//         23 24 25 26 27 28 29      82  83  84  85  86  87  88 
//         30 31                     89  90
                     { '2' : { start : 62, end : 68, dayswaited : 0, waiters : 0}},
                     { '3' : { start : 69, end : 75, dayswaited : 0, waiters : 0}},
                     { '4' : { start : 76, end : 82, dayswaited : 0, waiters : 0}},
                     { '5' : { start : 83, end : 89, dayswaited : 0, waiters : 0}},
//                April 2014                   April 2014 
//          Su Mo Tu We Th Fr Sa     Su  Mo  Tu  We  Th  Fr  Sa
//                 1  2  3  4  5             91  92  93  94  95
//           6  7  8  9 10 11 12     96  97  98  99 100 101 102
//          13 14 15 16 17 18 19    103 104 105 106 107 108 109
//          20 21 22 23 24 25 26    110 111 112 113 114 115 116
//          27 28 29 30             117 118 119 120
                     { '6' : { start : 90,  end : 96,  dayswaited : 0, waiters : 0}},
                     { '7' : { start : 97,  end : 103, dayswaited : 0, waiters : 0}},
                     { '8' : { start : 104, end : 110, dayswaited : 0, waiters : 0}},
                     { '9' : { start : 111, end : 117, dayswaited : 0, waiters : 0}},
                     {'10' : { start : 118, end : 124, dayswaited : 0, waiters : 0}},
//                  May 2014               May 2014            
//          Su Mo Tu We Th Fr Sa     Su  Mo  Tu  We  Th  Fr  Sa  
//                       1  2  3                     121 122 123  
//           4  5  6  7  8  9 10     124 125 126 127 128 129 130   
//          11 12 13 14 15 16 17     131 132 133 134 135 136 137  
//          18 19 20 21 22 23 24     138 139 140 141 142 143 144   
//          25 26 27 28 29 30 31     145 146 147 148 149 150 151  
                     {'11' : { start : 125, end : 131, dayswaited : 0, waiters : 0}},
                     {'13' : { start : 132, end : 138, dayswaited : 0, waiters : 0}},
                     {'14' : { start : 139, end : 145, dayswaited : 0, waiters : 0}},
                     {'15' : { start : 146, end : 152, dayswaited : 0, waiters : 0}},
//               June 2014                 June 2014           
//          Su Mo Tu We Th Fr Sa     Su  Mo  Tu  We  Th  Fr  Sa  
//           1  2  3  4  5  6  7    152 153 154 155 156 157 158  
//           8  9 10 11 12 13 14    159 160 161 162 163 164 165  
//          15 16 17 18 19 20 21    166 167 168 169 170 171 172  
//          22 23 24 25 26 27 28    173 174 175 176 177 178 179  
//          29 30                   180 181                    
                     {'16' : { start : 153, end : 159, dayswaited : 0, waiters : 0}},
                     {'17' : { start : 160, end : 166, dayswaited : 0, waiters : 0}},
                     {'18' : { start : 167, end : 173, dayswaited : 0, waiters : 0}},
                     {'19' : { start : 174, end : 180, dayswaited : 0, waiters : 0}},
//          July 2014                   July 2014           
//      Su Mo Tu We Th Fr Sa          Su  Mo  Tu  We  Th  Fr  Sa  
//                2  3  4  5                 182 183 184 185 186  
//       6  7  8  9 10 11 12         187 188 189 190 191 192 193  
//      13 14 15 16 17 18 19         194 195 196 197 198 199 200  
//      20 21 22 23 24 25 26         201 202 203 204 205 206 207  
//      27 28 29 30 31               208 209 210 211 212      
                     {'20' : { start : 174, end : 180, dayswaited : 0, waiters : 0}},
                     {'21' : { start : 181, end : 187, dayswaited : 0, waiters : 0}},
                     {'22' : { start : 188, end : 194, dayswaited : 0, waiters : 0}},
                     {'23' : { start : 195, end : 201, dayswaited : 0, waiters : 0}},
                     {'24' : { start : 202, end : 208, dayswaited : 0, waiters : 0}},
                     {'25' : { start : 209, end : 215, dayswaited : 0, waiters : 0}},
                     {'26' : { start : 216, end : 222, dayswaited : 0, waiters : 0}} ];


t11.database().all(latestRequestSQL, function(errLatestRQ, max_seniority) {
    var maxRQJulian; // Jan 1 : 1 Dec 31 : 365
    
    if (errLatestRQ)
        throw (errLatestRQ);
    
    max_seniority.forEach(function(ms) {
        maxRQJulian = t11.julian(ms['MAX(request_seniority)']);
    });
    t11.database().all(allRequestsSQL, function(errAllRQs, requests) {
        var p = 0;
        
        if (errAllRQs)
            throw(errAllRQs);
        
        requests.forEach(function (rq) {
            t11.database().all(requestInfoSQL, rq.request_id, function(errQPos, info) {
                
                if (errQPos)
                    throw(errQPos);
                
                e = d3.extent(info, function(d) {
                    return t11.julian(d.qpos_date);
                });
                if (e[1] < maxRQJulian) {
                    // this is a completed request add its data to r[]
                    console.log(e);
                    r.push(e[1] - e[0])
                }
                p = p + 1;
                if (p === requests.length) {
                    console.log('Completed Request Count: ' + r.length);
                    console.log('mean wait time: ' + d3.mean(r));
                    console.log('median wait time: ' + d3.median(r));
                    r.forEach(function (re) {
                        for  (n in r2) {
                            if (r2[n].start >= re[0] && r2[n].end <= re[1]) {
                                r2[n].dayswaited += (re[1] - re[0])
                            }
                        }
                    });
                    for (n in r2) {
                        console.log('week: ' + n + 'days waited:  ' + r2[n].dayswaited);
                    }
                }
            });
         });
    });
});