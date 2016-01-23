
all: printDaily libdaily.so

printDaily: printDaily.o 
	gcc -o printDaily printDaily.o  -ljansson -lm

printDaily.o:	printDaily.c
	gcc -g -c printDaily.c -I/usr/local/include -L/usr/local/lib printDaily.c

libdaily.so: daily.o
	ld -shared -o libdaily.so daily.o -lcurl -ljansson -lnup -lsqlite3 -lm

daily.o: daily.c
	gcc -c -fPIC -I/usr/local/include -g daily.c 

main.o: main.c
	gcc -g -c main.c

clean:
	rm -f printDaily daily.o libdaily.so printDaily.o main.o *~
