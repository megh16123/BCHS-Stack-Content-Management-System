/*
	Upload utility    
	input :- usersrting,session token,md5#,filename,filedatab64
YWtyQHB1Y3NkMTIzNHA=,824d1507-82d6-40e3-8e83-b24cb5f2e56a,b87bac80d2ea9b4ec735d9a7327f6e2f,filename.c,aGVsbG90aGlzaXNhbmltcG9ydGFudG1lc3NhZ2U=
	please dont forget the last ',' 
	md5 hash will be of the file only.
*/



#include "sqlite3.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <uuid.h>


#define BODY 1024*1024*6

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
	char * u_name = getenv("U_NAME");
	long ll=0;
	if( len != NULL && u_name != NULL &&  (ll = atoi(len))>0 )
	{

		int i=0;
		char  userstring[BODY]; 
		while( i<ll && i<BODY )
		{
			userstring[i] = getchar();
			i++;
		}
		userstring[i]='\0';
		char userID[100];
		char token[37];
		char fileName[100];
		char filehash[33];
		int ui=0;
		while( userstring[ui] != ',' && ui<ll )
		{
			userID[ui]=userstring[ui];
			ui++;

		}
		userID[ui]=0;
		ui++;
		int ut;
		for(  ut=0; userstring[ui]!=',' && ui<ll && ut<37 ;ut++ )
		{
			token[ut]=userstring[ui];
			ui++;
		}
		token[36]=0;
		ui++;
		int ud5;
		for( ud5=0;userstring[ui]!=',' && ui<ll && ud5<32;ud5++ )
		{
			filehash[ud5]=userstring[ui];
			ui++;
		}
		ui++;
		filehash[ud5]=0;
		int ufn;
		for( ufn=0;userstring[ui]!=',' && ui<ll && ufn<50;ufn++ )
		{
			fileName[ufn]=userstring[ui];
			ui++;
		}
		ui++;
		char ff_name[200];
		if( ud5 <= 32 && ut<=37 && ufn<=50 &&  i==ll && ui<ll &&  check_valid_user(userID) == 1 && udb[0]!=0 )
		{
			char db_name[200];
			char hash_file_str[200];
			sprintf(hash_file_str,"hash.%s.%s",u_name,fileName);
			sprintf(db_name,"db/%s.db",udb);
			sprintf(ff_name,"%s.%s",u_name,fileName);
			FILE * write_file = fopen(ff_name,"w+");
			FILE * hash_file = fopen(hash_file_str,"w+");
			FILE * udb_file = fopen(u_name,"w+");
			// 1 in active means not active 0 means acitve;
			uint32_t db_status = sqlite3_open_v2(db_name,&curdb,SQLITE_OPEN_READWRITE,NULL);
			if( write_file != NULL && hash_file!=NULL && udb_file!=NULL  && db_status == SQLITE_OK )
			{
				//set all previous sessions to inactive.
				char del_query[150];
				sprintf(del_query,"select sestkn from session where sestkn like '%s' and active=1 and (select UNIXEPOCH()) -time <= 60*60 ;" ,token);
				sqlite3_stmt *st;
				int sret=sqlite3_prepare_v2(curdb,del_query,-1,&st,NULL);
				int stret = sqlite3_step(st);
				if( sret == SQLITE_OK && stret == SQLITE_ROW && strcmp(token,sqlite3_column_text(st,0))==0 )
				{
					sqlite3_finalize(st);
					char env_str[100];
					sprintf(env_str,"U_NAME=%s",db_name);
					int write_status = fwrite(&userstring[ui],1,ll-ui,write_file);
					int hash_write_status = fprintf(hash_file,"%s %s",filehash,ff_name);
					int udb_write_status = fprintf(udb_file,"%s",udb);
					fclose(write_file);
					fclose(hash_file);
					fclose(udb_file);
					if( write_status != 0 && hash_write_status != 0 && udb_write_status!=0 )
					{
						puts("Status: 200 OK\r");
						puts("Content-Type: text/html\r");
						puts("\r");
						ret_status_code=1;
					}
				}
				sqlite3_close(curdb);
			}
		}
	}	
	if( ret_status_code==-1)
	{
		puts("Status: 503 ERROR\r");
		puts("Content-Type: text/html\r");
		puts("\rfailed");
	}
	return EXIT_SUCCESS;
}
