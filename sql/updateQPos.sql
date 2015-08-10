



/*
 * CREATE TABLE "Daily_20140327"
 *(
 *	 changesid INTEGER,
 *	       dob DATE,
 *	       pos INTEGER,
 *	 seniority INTEGER,
 *	    caseid INTEGER
 *);
 */

INSERT INTO QPos (qpos_pid, qpos_rqid, qpos_date, qpos_num)
SELECT changesid, caseid, '14324000' as pos_date, position
FROM Daily_20141120 ;
