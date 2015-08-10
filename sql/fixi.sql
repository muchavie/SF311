

CREATE TABLE d
(
	changesid INTEGER,
	      dob TEXT,
         position INTEGER,
	seniority INTEGER,
	   caseid INTEGER,
	   ready  INTEGER
);

INSERT INTO d select * from Daily_20140703;