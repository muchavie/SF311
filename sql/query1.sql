


CREATE VIEW Delta_20140414 as
       	    SELECT changesid, dob
       	    FROM Daily_20140414
      EXCEPT
	   SELECT *
	   FROM  People ;