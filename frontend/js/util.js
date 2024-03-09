
const decode_response = async(response) =>{
	const reader = response.body.getReader();
 	const { done,value } = await reader.read();
    	let output = null
    	try {
    	output = new TextDecoder("utf-8").decode(value)
       	output = output.replace("\n",""); 
    } catch (error) {
        output=null
    }
	return output;
}

const requestHandler = async(url,method,body)=>{
        const response = await fetch(url,{
                                method:method,
                                body:body
        });
	console.log(response);

	const cont = await decode_response(response);
	console.log(response);
        const output = {content:cont,status:response.status}
	console.log(output);
        return output;

}

const check_session = async()=>{
        const url = globurl+"/chk";
	console.log(url);
        const token = sessionStorage.getItem("token")
        const {content,status} = await requestHandler(url,"POST",token);
        if(status!==200){
        window.location.replace("session.html");
        }
    }


const redirects = ()=>{
    try {
        
        document.getElementById('logout').addEventListener("click",(event)=>{
	sessionStorage.removeItem('token');
        window.location.replace("index.html")});   
    } catch (error) {    }
    try {
        document.getElementById('back-to-menu').addEventListener("click",(event)=>{
        window.location.replace("menu.html");
        });
    } catch (error) {}    
}
const processarr=(content)=>{
	content= content.split(",");
	content.pop()
	let output = []
	content.map((item)=>{
	 let row = item.split("|");
	 output.push({fname:row[0],size:row[1]});
	});
    return output;
    }

    const populate_table = (arr) =>{
        const table = document.getElementById('items');
        const filesize = document.getElementById('filesize');
        let total_size = 0;
        arr.map((items)=>{
            total_size += Number(items['size'])
            table.innerHTML+=`<tr><td>${items['fname']}</td><td>${items['size']}</td></tr>`;
        });
        filesize.innerText = `Total Size : ${total_size}`
    }
const fetch_files = async(e)=>{
        const url = globurl+"/view";
        const token = sessionStorage.getItem("token")
                const {content,status} = await requestHandler(url,"POST",token);
		console.log(content);
                if(status !==200){
                //window.location.replace('index.html');
                }else{
                    const arr = processarr(content);
					console.log(arr);
                    populate_table(arr);
                }
    }    
