

CREATE TABLE d
(
  changesid INTEGER,
        dob DATE,
   position INTEGER,
  seniority INTEGER,
     caseid INTEGER
);


INSERT INTO d (changesid, dob, position, seniority, caseid) select changesid, dob, position, seniority, INTEGER from Daily_20140428;






