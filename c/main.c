
#include <sqlite3.h>
#include <stdio.h>
#include "stub.h"

const char *dbfile = "/home/pogilvie/Dropbox/Projects/311/311.db";
extern int dblist_init( sqlite3 *db, char **error, const sqlite3_api_routines *api );
int main(int argc, char *argv[])
{
  int e;
  sqlite3 *db;

   if ( ( e = sqlite3_initialize() ) != SQLITE_OK )
   {
      printf("Error: sqlite_initialize(%d)\n", e);
      return 1;
   }
   if ( ( e = sqlite3_open(dbfile, &db) ) != SQLITE_OK )
   {
      printf("Error: sqlite3_open(%d)\n", e);
      return 1;
   }
   if ( ( e = stub_init( db ) ) != SQLITE_OK )
   {
      printf("Error: current_init(%d)\n", e);
      return 1;
   }
   if ( ( e = sqlite3_shutdown() ) != SQLITE_OK )
   {
      printf("Error: sql_shutdown(%d)\n", e);
      return 1;
   }

  return 0;
}
