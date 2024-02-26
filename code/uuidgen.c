#include<stdio.h>
#include<stdlib.h>
#include<uuid.h>
int main()
{
	uuid_t *temp = malloc(sizeof(uuid_t));
	int status;
	uuid_create(temp,&status);
	char * str;
	if( status == uuid_s_ok)
	{
		uuid_to_string(temp,&str,&status);
		if(status==uuid_s_ok)
		printf("%s\n",str);
	}
}


