//          file: daily.c
//       summary: sqlite driver for https://data.sfgov.org/api/views/w4sk-nq57/rows.json?accessType=DOWNLOAD
//        author: Peter Ogilvie code@ogilvie.us.com
// creation date: June 14, 2014
//       version: 4/20140625 Add Ready to assign column
//       requres: libcurl, libjansson,  GNU/linux, libsqlite3 version 3.2

#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1;
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <curl/curl.h>
#include <jansson.h>
#include <nup.h>
typedef struct daily_vtab_s {
    sqlite3_vtab          vtab;
    int                   rowc;
} daily_vtab;
typedef struct daily_cursor_s {
    sqlite3_vtab_cursor   cur;
    sqlite_int64          row;
    daily_vtab             *v;
} daily_cursor;

// Does not appear to be posible to key a primary key for a virtual table
const char *daily_sql = "CREATE TABLE Daily (changesid INTEGER, dob TEXT,  position INTEGER, seniority INTEGER,  caseid INTEGER, ready INTEGER); ";

#define TableElementCount (1 << 11)
#define DateCharacterCount 10

int changesid[TableElementCount];
char      dob[TableElementCount][DateCharacterCount];
int  position[TableElementCount];
int seniority[TableElementCount];
int    caseid[TableElementCount];
int     ready[TableElementCount];

typedef struct write_result
{
    char *data;
    int   pos;
} write_result;

// One meg to hold a single days worth of data (typically 130k or so)
 char remote_data[ 1 << 20 ]; 
 char *url = "https://data.sfgov.org/api/views/w4sk-nq57/rows.json?accessType=DOWNLOAD";
 write_result result;


// remote_data[] <--- data.sfgov.org
size_t write_data(void *buffer, size_t size, size_t nmemb, void *userp)
{
    write_result *r = &result;

    if(r->pos + size * nmemb >= (sizeof(remote_data) - 1))
    {  fprintf(stderr, "error: too small buffer\n");
	return 0;                                        }

    memcpy(r->data + r->pos, buffer, size * nmemb);
    r->pos += size * nmemb;

    return size * nmemb;
}

int fetch(void)
{
        CURL *c;
    CURLcode  e;
  
    if (e = curl_global_init(CURL_GLOBAL_DEFAULT))
    {   printf("curl_global_init(%d)\n", e);
	return 1;                                 }

    if (!(c = curl_easy_init()))
    {   printf("curl_easy_init(%p)\n", c);
	return 1;                                 }

    if (e = curl_easy_setopt(c, CURLOPT_URL, url))
    {   printf("curl_easy_setopt URL(%d)\n", e);
	return 1;                                 }

    result.data = remote_data; result.pos = 0;
    if (e = curl_easy_setopt(c, CURLOPT_WRITEDATA, result))
    {   printf("curl_easy_setopt WRITEDATA(%d)\n", e);
	return 1;                                 }

    if (e = curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, write_data))
    {   printf("curl_easy_setopt WRITEDATA(%d)\n", e);
	return 1;                                 }

    if (e = curl_easy_perform(c))
    {   printf("curl_easy_perform(%d)\n", e);
	return 1;                                 }

    curl_easy_cleanup(c);
 
    return 0;
}

// data.data[] columm key
//      [0]: sid
//      [1]: id
//      [2]: position
//      [3]: created_at
//      [4]: created_meta
//      [5]: updated_at
//      [6]: updated_meta
//      [7]: meta
//      [8]: position_number	(INTEGER)
//      [9]: seniority		(INTEGER)
//     [10]: Date of Birth	(DATE)
//     [11]: changesID		(INTEGER)
//     [12]: caseid		(INTEGER)
//     [13]: message		(BOOLEAN)
// changesid[], ..., caseid[] <-- JSON2C <--- write_data[] 
int parse(void)
{
    json_error_t  e;
    char bounce[DateCharacterCount], *format, hyphen = '-';
    unsigned int *year;
    int  i, *chp, *pp, *sp, *cp, *rd, rcnt = 0;
          json_t *r,*d, *o = json_loads(remote_data, 0, &e);
    if (o)
    {   printf("JSON parsed successfuly.\n");
	d = json_object_get(o, "data");
	if (d)
	{   if (json_is_array(d))
	    {	rcnt = (int)json_array_size(d) - 1;
		printf("Found Data Array: %d entries\n", rcnt);
		chp = changesid; pp = position; sp = seniority; cp = caseid; rd = ready;
		for (i = 0; i <  rcnt; i++)
		{   r = json_array_get(d,i);
		    if (r && json_is_array(r) &&
			json_is_string(json_array_get(r,11)) &&
			json_is_string(json_array_get(r, 10)))
		    {   *chp++ = atoi(json_string_value(json_array_get(r, 11)));
			 *pp++ = atoi(json_string_value(json_array_get(r, 8)));
			 *sp++ = atoi(json_string_value(json_array_get(r, 9)));
			 *cp++ = atoi(json_string_value(json_array_get(r, 12)));

			 // Date from JSON table to something that SQLite can use a d DATE type
			 //       0123456789
			 // From: MM-DD-YYYY 
			 //   To: YYYY-MM-DD
                         //       0123456789
			 // code below works on Intel not sure if it would work on ARM
			 memcpy(bounce, json_string_value(json_array_get(r, 10)), DateCharacterCount);
			 format = dob[i];

			 year = (unsigned int *) (bounce + 6);
			 (*(unsigned int *)format) = *year;

			 format[4] = hyphen;
			 format[7] = hyphen;
			 // Mounth
			 format[5] = bounce[0];
			 format[6] = bounce[1];
			 // Day
			 format[8] = bounce[3];
			 format[9] = bounce[4];

			 if (json_string_value(json_array_get(r, 13)))
			     *rd++ = 1;
			 else
			     *rd++ = 0;
		    }
		    else
		    {  printf("Error: no array object(%p) at index %d\n", r, i);
		    }
		}
	    }
	    else
		printf("Error Data Array not found\n");
	}
	else
	    printf("Error: data object not found\n");
    }
    else
	   printf("Failed to decode\n");

    return rcnt;
}

int daily_create(sqlite3  *db,
	            void  *udp,
	             int   argc, 
       const char *const  *argv,
            sqlite3_vtab **vtab,
                    char **errmsg)
{
              daily_vtab  *v;

    v = sqlite3_malloc(sizeof(daily_vtab));

    if (v == NULL)
	return SQLITE_NOMEM;

    v->vtab.zErrMsg = NULL;

    sqlite3_declare_vtab(db, daily_sql);
    *vtab = (sqlite3_vtab*)v;

    if (fetch() == SQLITE_OK)
    {	v->rowc = parse();
    	if (!v->rowc)
	{  *errmsg = "parse failed no rows";
	    return SQLITE_MISUSE;
	}
    }
    else
    {	*errmsg = "fetch failed";
        return SQLITE_MISUSE;
    }

    return SQLITE_OK;
}

int daily_connect(sqlite3  *db,
 		     void  *udp,
		      int   argc, 
        const char *const  *argv,
	     sqlite3_vtab **vtab,
	  	     char **errmsg )
{
               daily_vtab  *v;

    v = sqlite3_malloc(sizeof(daily_vtab));

    if (v == NULL)
	return SQLITE_NOMEM;
    v->vtab.zErrMsg = NULL;

    sqlite3_declare_vtab(db, daily_sql);
    *vtab = (sqlite3_vtab*)v;

    if (fetch() == SQLITE_OK)
    {	v->rowc = parse();
    	if (!v->rowc)
	{  *errmsg = "parse failed no rows";
	    return SQLITE_MISUSE;
	}
    }
    else
    {	*errmsg = "fetch failed";
	return SQLITE_MISUSE;
    }
    return SQLITE_OK;
}

int daily_disconnect(sqlite3_vtab *vtab)
{
    sqlite3_free(vtab);
    return SQLITE_OK;
}

static int daily_destroy(sqlite3_vtab *vtab)
{
    sqlite3_free(vtab);
    return SQLITE_OK;
}

char* op(unsigned char op)
{
    if ( op == SQLITE_INDEX_CONSTRAINT_EQ ) return "=";
    if ( op == SQLITE_INDEX_CONSTRAINT_GT ) return ">";
    if ( op == SQLITE_INDEX_CONSTRAINT_LE ) return "<=";
    if ( op == SQLITE_INDEX_CONSTRAINT_LT ) return "<";
    if ( op == SQLITE_INDEX_CONSTRAINT_GE ) return ">=";
    if ( op == SQLITE_INDEX_CONSTRAINT_MATCH ) return "MATCH";
    return "?";
}

int daily_bestindex(sqlite3_vtab *vtab,
	      sqlite3_index_info *info)
{
                             int  i;
    for (i = 0; i < info->nConstraint; i++) {
        printf("   CONST[%d]: %d %s %s\n", i,
                info->aConstraint[i].iColumn,
                 op(info->aConstraint[i].op), 
                 info->aConstraint[i].usable ? "Usable" : "Unusable");
    }
    for (i = 0; i < info->nOrderBy; i++) {
        printf("   ORDER[%d]: %d %s\n", i, info->aOrderBy[i].iColumn,
	            info->aOrderBy[i].desc ? "DESC" : "ASC");
    }

    return SQLITE_OK;
}

int daily_open(sqlite3_vtab   *vtab,
         sqlite3_vtab_cursor **cur)
{
                  daily_vtab  *v = (daily_vtab*)vtab;
                daily_cursor  *c;
    c = sqlite3_malloc(sizeof(daily_cursor));
    if (c == NULL)
	return SQLITE_NOMEM;
    *cur = (sqlite3_vtab_cursor*)c;
    c->row = 0;
    c->v = v;
    return SQLITE_OK;
}

int daily_close(sqlite3_vtab_cursor *cur)
{
    sqlite3_free(cur);
    return SQLITE_OK;
}

int daily_filter(sqlite3_vtab_cursor  *cur,
                               int   idxnum,
	                const char  *idxstr,
                               int   argc,
	             sqlite3_value **value)
{
    return SQLITE_OK;
}

int daily_next(sqlite3_vtab_cursor *cur)
{
    ((daily_cursor*)cur)->row++;
    return SQLITE_OK;
}

int daily_eof(sqlite3_vtab_cursor *cur)
{
    daily_cursor *c = (daily_cursor *)cur;
    
    return (c->row >= c->v->rowc);
}

int daily_rowid(sqlite3_vtab_cursor *cur,
	              sqlite3_int64 *rowid)
{
    *rowid = ((daily_cursor*)cur)->row;
    return SQLITE_OK;
}

static int daily_column(sqlite3_vtab_cursor *cur,
		            sqlite3_context *ctx,
		                         int cidx)
{
                               daily_cursor *cvtp = (daily_cursor*)cur;
			       char *p;
    switch (cidx)
    {  case 0: sqlite3_result_int(ctx, changesid[cvtp->row]); break;
       case 1:
	   p = sqlite3_malloc(DateCharacterCount);
	   memcpy(p, dob[cvtp->row], DateCharacterCount);
	   sqlite3_result_text(ctx, p, DateCharacterCount, sqlite3_free);
       break;
       case 2: sqlite3_result_int(ctx, position[cvtp->row]); break;
       case 3: sqlite3_result_int(ctx, seniority[cvtp->row]); break;;
       case 4: sqlite3_result_int(ctx, caseid[cvtp->row]); break;
       case 5: sqlite3_result_int(ctx, ready[cvtp->row]); break;
    }
    return SQLITE_OK;
}

int daily_rename(sqlite3_vtab *vtab,
	           const char *newname)
{
    return SQLITE_OK;
}

static sqlite3_module daily_mod = {
    4,                  /* iVersion        */
    daily_create,       /* xCreate()       */
    daily_connect,      /* xConnect()      */
    daily_bestindex,    /* xBestIndex()    */
    daily_disconnect,   /* xDisconnect()   */
    daily_destroy,      /* xDestroy()      */
    daily_open,         /* xOpen()         */
    daily_close,        /* xClose()        */
    daily_filter,       /* xFilter()       */
    daily_next,         /* xNext()         */
    daily_eof,          /* xEof()          */
    daily_column,       /* xColumn()       */
    daily_rowid,        /* xRowid()        */
    NULL,               /* xUpdate()       */
    NULL,               /* xBegin()        */
    NULL,               /* xSync()         */
    NULL,               /* xCommit()       */
    NULL,               /* xRollback()     */
    NULL,               /* xFindFunction() */
    daily_rename        /* xRename()       */
};

int daily_init(sqlite3 *db, char **error, const sqlite3_api_routines *api)
{
    SQLITE_EXTENSION_INIT2(api);

    if (nup())
	return sqlite3_create_module(db, "daily", &daily_mod, NULL);
    else
	return SQLITE_CANTOPEN;
}


