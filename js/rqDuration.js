//rqDuration.js Fill in new columns request_end and request_duration in Request table   
//CREATE TABLE Request
//(
//	          request_id        INTEGER PRIMARY KEY NOT NULL,
//	          request_seniority INTEGER NOT NULL,
//	          request_pid       INTEGER NOT NULL REFERENCES Person (person_id)
//, request_end INTEGER, request_duration INTEGER);
// For each request R in Request
//      Lookup all records q[] corresponding to R and find end date (if any) and 
//      request duration (if completed)
//CREATE TABLE QPos
//(
//	             qpos_pid        INTEGER NOT NULL REFERENCES People(person_id),
//	             qpos_rqid       INTEGER NOT NULL REFERENCES Request(request_id),
///* YYDDD000 */       qpos_date       INTEGER NOT NULL,   
//	             qpos_num        INTEGER NOT NULL
//);

var          t11 = require('./t11.js'),
              d3 = require('d3'),
  allRequestsSQL = 'SELECT request_id, request_seniority FROM Request ORDER BY request_seniority',
updateRequestSQL = 'UPDATE Request SET request_end = ?, request_duration = ? WHERE request_id = ?',
  requestInfoSQL = 'SELECT * FROM QPos where qpos_rqid = ? ORDER BY qpos_date';


t11.database().all(allRequestsSQL, function(e, R) {
    var m;  // MAX Julian Date.  RQ's started on this date are assumed OPEN
    
    if (e)
        throw(e);
    
    m = d3.max(R, function(d) {
        return t11.julian(d.request_seniority);
    });

    R.forEach(function(r) {
        t11.database().all(requestInfoSQL, r.request_id, function(e, Q) {
            var x,  // eXtent of julian request dates [startDate, EndDate]
                d;  // duraTion which completed request is open
            
            if (e)
                throw(e);
            
            x = d3.extent(Q, function (d) {
               return t11.julian(d.qpos_date);
            });
            console.log(x);
            if (x[1] > 0 && x[1] < m) {
                // this is a completed request
                d = x[1] - x[0]; 
                t11.database().all(updateRequestSQL, t11.tdate(14, x[1]), d, r.request_id, function(e, u) {
                    
                    if (e)
                        throw (e);
                    
                    console.log('updated request id: ' + r.request_id + ' duration: ' + d);
                });
            }
            Q.forEach(function (q) {
                console.log(q);         
            });
        });
    });
});
