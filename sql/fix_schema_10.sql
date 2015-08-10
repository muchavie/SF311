

CREATE TABLE d1
(
  changesid INTEGER,
        dob DATE,
   position INTEGER,
  seniority INTEGER,
     caseid INTEGER
);

INSERT INTO d1 (changesid, dob, position, seniority, caseid) select changesid, dob, position, seniority, INTEGER from Daily_20140613;


CREATE TABLE d3
(
  changesid INTEGER,
        dob DATE,
   position INTEGER,
  seniority INTEGER,
     caseid INTEGER
);

INSERT INTO d3 (changesid, dob, position, seniority, caseid) select changesid, dob, position, seniority, INTEGER from Daily_20140616;






