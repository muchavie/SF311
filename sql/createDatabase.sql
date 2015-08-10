

-- Create Database 311.db
-- Engine/SQL Language: sqlite3 / http://www.sqlite.org/lang.html
--            Creation: May 21, 2014
--              Author: Peter Ogilvie code@ogilvie.us.com
--             Version: 2/20140621
--              Useage: sqlite3 311.db < createDatabase.sql

-- PEOPLE
-- changesid id in the City of San Francisco Homeless Shelter Reservation System
-- dob person's Date of Birth
CREATE TABLE Person
(
                   person_id        INTEGER PRIMARY KEY NOT NULL,
                   person_dob       DATE    NOT NULL
); 

CREATE TABLE Request
(
	          request_id        INTEGER PRIMARY KEY NOT NULL,
	          request_seniority INTEGER NOT NULL,
	          request_pid       INTEGER NOT NULL REFERENCES Person (person_id)
);

CREATE TABLE Pos
(
	             pos_pid        INTEGER NOT NULL REFERENCES People(person_id),
	             pos_rqid       INTEGER NOT NULL REFERENCES Request(request_id),
	             pos_date       DATE    NOT NULL,
	             pos_num        INTEGER NOT NULL,
                                    PRIMARY KEY (pos_pid, pos_rqid) 
);
	     
