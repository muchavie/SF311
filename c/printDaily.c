#include <stdio.h>
#include <jansson.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

// {parent = 0x0,         type = json_object, 
//                u = {boolean = 2, 
//                     integer = 2,
//                         dbl = 9.8813129168249309e-324,
//                      string = {length = 2, ptr = 0x406767a0 "\320gg@"}, 
//                      object = {length = 2, values = 0x406767a0}, 
//                       array = {length = 2, values = 0x406767a0}}, 
//
//  _reserved = {next_alloc = 0x406767da, object_mem = 0x406767da}}


#define ONEMEG 1024*1024*1024
char databuffer[ONEMEG];

char *usage = "./printDaily YYYYMMDD.json";

int main (int argc, const char* argv[])
{
  int datafd, bytesread, bytesremaining = ONEMEG, i, j;
  char *p;
  json_t *o, *d, *r;
  json_error_t e;
  
  if (argc < 1 || argc > 2)
    { puts(usage);
      return 1;
    }
  else
    { if ((datafd = open(argv[1], O_RDONLY)) < 0)
	{ perror("Check suppied argument");
	  return 1;
	}
      else
	{ p = databuffer;
	  while ((bytesread = read(datafd, p, bytesremaining)) > 0)
	    { bytesremaining -= bytesread;
	      p += bytesread;
	    }
	  if (bytesread < 0)
	    { perror("read failed");
	      return 1;
	    }
	  bytesread = ONEMEG - bytesremaining;
	  p = databuffer;
	}
    }
  o = json_loads(p, 0, &e);
  if (o)
    { (void) printf("JSON Loaded successfuly filesize of %s is %d bytes\n", argv[1], bytesread);
      d = json_object_get(o, "data");
      if (d)
	{ if (json_is_array(d))
	    { (void) printf("Found Data Array: %d entries\n", (int)json_array_size(d));
	      for (i = 0; i < (int)json_array_size(d); i++)
		{ r = json_array_get(d,i);
		  if (r && json_is_array(r) && json_is_string(json_array_get(r,11)) && json_is_string(json_array_get(r, 10)))
		    { 
		      printf("(8)%s (11)%s (12)%s\n", json_string_value(json_array_get(r, 8)),
						      json_string_value(json_array_get(r, 11)),
			                              json_string_value(json_array_get(r, 10)));
		    }
		  else
		    { (void) printf("Error: no array object(%p) at index %d\n",r,i);
		      return 1;
		    }
		}
	    }
	  else
	    (void) printf("Error Data Array not found\n");
	}
      else
	(void) printf("Error: data object not found\n");
    }
  else
    { (void) printf("File %s failed to decode\n", argv[1]); }
  return 0;
}
