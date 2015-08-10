CREATE TABLE Daily_20140414
(
	 changesid INTEGER,
	       dob DATE,
	       pos INTEGER,
	 seniority INTEGER,
	    caseid INTEGER
);

/*  changesid   dob         pos         seniority   caseid    
 *  ----------  ----------  ----------  ----------  ----------
 *  340696      1963-11-03  14057002    1           3402556   
 *  273728      1968-07-21  14057032    5           3402142   
 *  10063       1967-08-06  14057033    6           3400202   
 */



INSERT INTO Daily_20140414 (changesid, dob, pos, seniority, caseid)
SELECT                      changesid, dob, seniority, pos, caseid
FROM d1;