Check out
=========

http://www.ogilvie.us.com:/AgeDistribution.html

SQLite3 Daily Virtual Table
===========================
The Daily Virtual table uses libcurl to fetch a JSON feed from the
San Francisco 311 public feed and displays this data as a sqlite3 table.

Build
-----
Only Linux is supported by the Makefile right now.   The virtual table implementation is packaged as a dynamic shared library.   Dynamic shared libraries are different enought on OS X / Windows / Linux the separate build paths would be required for each.   I only have linux on my laptop so that's only one I did.  

Libcurl (to fetch a url from C) and libjanson (to parse
    and decode JSON from C) are required.    A C compiler is required of course.  :)

    % cd 311/c
    % make --version  # <- make sure have have the right make program
    GNU Make 3.81
    % make
    gcc -g -c printDaily.c -I/usr/local/include -L/usr/local/lib printDaily.c
    gcc -o printDaily printDaily.o  -ljansson -lm
    gcc -c -fPIC -I/usr/local/include -g daily.c
    ld -shared -o libdaily.so daily.o -lcurl -ljansson -lnup -lsqlite3 -lm


How to use it
-------------
Add a line to your ~/.sqliterc file to load the shared object dynamically when the sqlite3 command line shell is
started.


    .load /home/pogilvie/Dropbox/Projects/311/c/libdaily daily_init

The simple check below should run.

    sqlite> .schema Daily
    CREATE VIRTUAL TABLE Daily using daily;

Then run some SQL against the live web data

    sqlite> select * from Daily limit 10;
    JSON parsed successfuly.
    Found Data Array: 712 entries
    changesid   dob         position    seniority   caseid      ready
    ----------  ----------  ----------  ----------  ----------  ----------
    373420      1967-03-05  1           15202032    4922937     1
    280805      1967-04-07  2           15202033    4922637     1
    43624       1966-06-01  3           15202036    4924735     1
    55027       1978-02-04  4           15203007    4927942     1
    376664      1969-05-22  5           15203016    4928219     1
    385477      1968-12-09  6           15203020    4926625     1
    385425      1976-12-15  7           15203022    4926297     1
    291565      1969-07-12  8           15203023    4926898     1
    336628      1966-12-13  9           15203026    4928206     1
    384956      1963-04-05  10          15203029    4926808     1
