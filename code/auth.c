#include "sqlite3.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <uuid.h>

char udb[37];


int check_valid_user(char *string)
{
	char query[1000];
	int retval=-1;
	sqlite3 * userdb;
	udb[0]=0;
	sprintf(query,"select dbd from upass where encid like '%s';",string);
	uint32_t userdb_status = sqlite3_open_v2("db/userdb",&userdb,SQLITE_OPEN_READONLY,NULL);
	if( userdb_status == SQLITE_OK )
	{
		sqlite3_stmt *st;
		int sret=sqlite3_prepare_v2(userdb,query,-1,&st,NULL);
		int stret = sqlite3_step(st);
		if( sret == SQLITE_OK && stret == SQLITE_ROW)
		{
			memcpy(udb,sqlite3_column_text(st,0),37);
			retval = 1;
			sqlite3_finalize(st);
			sqlite3_close(userdb);
		}

	}
	return retval;
}

int main()
{
	sqlite3 *curdb;
	int ret_status_code = -1;
	char * len = getenv("CONTENT_LENGTH");
	if( len != NULL )
	{
		long ll = atoi(len);


		uint32_t status;
		uuid_t pp[sizeof(uuid_t)];
		uuid_create(pp,&status);
		char *ss;
		uuid_to_string(pp,&ss,&status);
		int i=0;
		char  userstring[1024]; 
		while( i<ll && i<1024)
		{
			userstring[i] = getchar();
			i++;
		}
		userstring[i]='\0';
		if( i==ll &&  check_valid_user(userstring) == 1 && udb[0]!=0 )
		{

			char db_name[200];
			sprintf(db_name,"db/%s.db",udb);
			// 1 in active means not active 0 means acitve;
			uint32_t db_status = sqlite3_open_v2(db_name,&curdb,SQLITE_OPEN_READWRITE,NULL);
			if( db_status == SQLITE_OK )
			{
				//set all previous sessions to inactive.
				int del_status = sqlite3_exec(curdb,"update session set active=0 where active=1",NULL,NULL,NULL);
				char ins[100];
				sprintf(ins,"insert into session values('%s',UNIXEPOCH(),0,1);",ss);
				int ins_status = sqlite3_exec(curdb,ins,NULL,NULL,NULL);
				if( status == uuid_s_ok && del_status== SQLITE_OK && ins_status == SQLITE_OK )
				{
					puts("Status: 200 OK\r");
					puts("Content-Type: text/html\r");
					puts("\r");
					puts(ss);

					ret_status_code=1;
				}
			}
			sqlite3_close(curdb);
		}
	}
	if( ret_status_code==-1){
	
		puts("Status: 503 OK\r");
                puts("Content-Type: text/html\r");
	        puts("\r");
	        puts("Invalid");
	}
}

/*
   sqlite3 *mydb;
   int sqlRet=sqlite3_open_v2("test.db",&mydb,SQLITE_OPEN_READWRITE,NULL);
   if( sqlRet == SQLITE_OK )
   {
   char stmt[] = "insert into sample values('i',1);";
   printf("connection established succesfully\n");
   sqlite3_close(mydb);
   }
   printf("sqlRet:%d\n",sqlRet);
 */
