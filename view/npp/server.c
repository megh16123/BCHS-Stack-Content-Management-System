#include<stdio.h>
#include<sys/socket.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<string.h>
#include<unistd.h>
#include"sqlite3.h"
#include<stdlib.h>
#include<uuid.h>

#define MAX_TOKEN_SIZE 42
#define MAX_WORD_SIZE 50
#define MAX_SYSTEMS 100

sqlite3 *db,*md;
sqlite3_stmt *res;
//int id=0;
int extractMeaning(char* reqid,char *meaning)
{
	int ret=0;
	char *stmt = "select * from meaning;";
	char error = 0;
	while(error==0)
	{
		int a = sqlite3_prepare_v2(md,stmt,-1,&res,NULL);
		if(a!=SQLITE_OK)
		{
			printf("82\n");
			perror(sqlite3_errmsg(md));
		}
		else
			error=1;
	}
	while(sqlite3_step(res)==SQLITE_ROW && ret==0)
	{
		if(strcmp(reqid,(char*)sqlite3_column_text(res,0))==0)
		{
			strcpy(meaning,(char*)sqlite3_column_text(res,1));
			ret = 1;
		}
	}
	sqlite3_finalize(res);
	return ret;
}

void deleteRequest()
{
	char stmt[100] = "select * from meaning";
	char error = 0;
	while(error==0)
	{
		int a = sqlite3_prepare_v2(md,stmt,-1,&res,NULL);
		if(a!=SQLITE_OK)
		{
			printf("109\n");
			perror(sqlite3_errmsg(md));
		}
		else
			error=1;
	}
	while(sqlite3_step(res)!=SQLITE_DONE)
	{
		//printf("temp %s\n",sqlite3_column_text(res,0));
		sprintf(stmt,"insert into temp values(%s);",sqlite3_column_text(res,0));
		error = 0;
		while(error==0)
		{
			int a = sqlite3_exec(db,stmt,NULL,NULL,NULL);
			if(a!=SQLITE_OK)
			{
				printf("124\n");
				perror(sqlite3_errmsg(db));
			}
			else
				error = 1;
		}
	}
	sqlite3_finalize(res);
	sprintf(stmt,"delete from word where reqid not in temp and done=1;");
	error = 0;
	while(error==0)
	{
		int a = sqlite3_exec(db,stmt,NULL,NULL,NULL);
		if(a!=SQLITE_OK)
		{
			printf("140\n");
			perror(sqlite3_errmsg(db));
		}
		else
			error=1;
	}
	stmt[0] = '\0';
	sprintf(stmt,"delete from temp;");
	error = 0;
	while(error==0)
	{
		int a = sqlite3_exec(db,stmt,NULL,NULL,NULL);
		if(a!=SQLITE_OK)
		{	
			printf("176\n");
			perror(sqlite3_errmsg(db));	
		}
		else
			error=1;
	}
}
char isValidid(char *token)
{
	//puts(token);
	char ret = 0;
	char query[40+MAX_TOKEN_SIZE];
	sprintf(query,"select reqid from word where reqid like '%s';",token);
	puts(query);
	char error = 0;
	while(error==0)
	{
		int a = sqlite3_prepare_v2(db,query,-1,&res,NULL);
		if(a!=SQLITE_OK)
		{
			perror(sqlite3_errmsg(db));
		}
		else
			error=1;
	}
	if(sqlite3_step(res)==SQLITE_ROW)
	{
		ret=1;
	}
	sqlite3_finalize(res);
	//printf("%d\n",ret);
	return ret;
}

void readyforConnection(char tt,char *req)
{
	//putchar(tt);
	putchar(tt);
	if(tt=='1')
	{
		puts("hello again");
		//printf("hello\n");
			if(isValidid(req)==1)
		{
			char meaning[200];
			int ret = extractMeaning(req,meaning);
			//printf("%d\n",ret);
			if(ret==1)
			{
				//char type = '2';
				//putchar(type);
				puts(meaning);
				char up_query[38+MAX_TOKEN_SIZE];
				sprintf(up_query,"update word set done = 1 where reqid = %s;",req);
				char error = 0;
				while(error==0)
				{
					int a = sqlite3_exec(db,up_query,NULL,NULL,NULL);
					if(a!=SQLITE_OK)
					{
						perror(sqlite3_errmsg(db));
					}
					else
						error=1;
				}
			}
			else
			{
				//char type = '1';
				puts("please wait");
			}
		}
		else
			puts("invalid id");
	}
	else if(tt=='0')
	{		
		//printf("word\n");
		//fgets(req,MAX_WORD_SIZE,stdin);
		char *token;
		//putchar(tt);
		uuid_t out;
		uint32_t status;
		uuid_create(&out,&status);
		if(status!= uuid_s_ok)
			perror("uuid error");
		else
		{
			uuid_to_string(&out,&token,&status);
			if(status!=uuid_s_ok)
				perror("uuid to string error");
			else
				puts(token);
		}
		char stmt[50+MAX_TOKEN_SIZE];
		sprintf(stmt,"insert into word values(\"%s\",\"%s\",%d);",token,req,0);
		char error = 0;
		while(error==0)
		{
			int a = sqlite3_exec(db,stmt,NULL,NULL,NULL);
			if(a!=SQLITE_OK)
			{
				printf("294%d\n",a);
				perror(sqlite3_errmsg(db));
			}
			else
				error=1;
		}
	}	
}

int main()
{
	puts("Status: 200 OK\r");
    puts("Content-Type: text/html\r");
    puts("\r");
 	char* len = getenv("CONTENT_LENGTH");
 	puts(len);
	char c = getchar();
	char type = c;
	char s[MAX_WORD_SIZE+MAX_TOKEN_SIZE];
	if(c=='0')
	{
		int i=0;
			while((c=getchar())!='\n' && i<MAX_WORD_SIZE)
		{
			s[i] = c;
			i++;
		}
		if(i==MAX_WORD_SIZE)
		{
			printf("maximum word size limit exceeded\n");
			return 0;
		}
		s[i]='\0';

	}
	else if(c=='1')
	{
		int i=0;
			while((c=getchar())!='\n' && i<=MAX_TOKEN_SIZE)
		{
			s[i] = c;
			i++;
		}
		if(i>MAX_TOKEN_SIZE)
		{
			printf("maximum token size limit exceeded\n");
			return 0;
		}
		s[i]='\0';
		puts(s);
	}
	char error=0;
	while(error==0)
	{
		int a = sqlite3_open_v2("serverdb.db",&db,SQLITE_OPEN_READWRITE,NULL);
		if(a!= SQLITE_OK)
		{	
			printf("%d\n",a);
			perror(sqlite3_errmsg(db));
		}
		else
			error=1;
	}
	error=0;
	while(error==0)
	{
		int a = sqlite3_open_v2("dictdb.db",&md,SQLITE_OPEN_READONLY,NULL);
		if(a!=SQLITE_OK)
		{
			printf("339\n");
			perror(sqlite3_errmsg(md));
		}
		else
			error=1;
	}
	readyforConnection(type,s);
	sqlite3_close(md);
	sqlite3_close(db);
	return(EXIT_SUCCESS);
}
