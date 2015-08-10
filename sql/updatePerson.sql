



create table t as select changesid, dob from Daily_20140414 except select * from Person;