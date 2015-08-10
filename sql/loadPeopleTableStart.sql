-- Load 311.People with first data set
-- Engine/SQL Language: sqlite3 / http://www.sqlite.org/lang.html
--            Creation: May 27, 2014
--              Author: Peter Ogilvie code@ogilvie.us.com
--             Version: 1/20140527
--              Useage: sqlite3 311.db < createDatabase.sql

-- PEOPLE
-- changesid id in the City of San Francisco Homeless Shelter Reservation System
-- dob person's Date of Birth

INSERT INTO People SELECT changesid, dob FROM Daily_20140327;