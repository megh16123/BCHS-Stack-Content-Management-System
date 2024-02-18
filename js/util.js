let globurl = "http://127.0.0.1:7980/cgi-bin"

const decode_response = async(response) =>{
	const reader = response.body.getReader();
 	const { done,value } = await reader.read();
    let output = null
    try {
    output = new TextDecoder("utf-8").decode(value)
        
    } catch (error) {
        output=null
    }
	return output;
}

const requestHandler = async(url,method,body)=>{
const response = await fetch(url,{
                                method:method,
                                mode:"cors",
                                body:body
});
let output = {content:null,status:response.status}
if(response.status===200){
    output = {content:await decode_response(response),status:response.status}
}
return output;

}
const check_session = ()=>{
const url = globurl+"/session";
const token = sessionStorage.getItem("token")
const {content,status} = requestHandler(url,"POST",token);
if(status!==200){
// window.location.replace("session.html");
}
}
const redirects = ()=>{
    try {
        
            document.getElementById('logout').addEventListener("click",(event)=>{
                console.log("hello")
                window.location.replace("index.html")});   
    } catch (error) {    }
    try {
         document.getElementById('back-to-menu').addEventListener("click",(event)=>{
            window.location.replace("menu.html");
            });
    } catch (error) {}
    
    
}
const processarr=(content)=>{
    let output = content;
    return content;
    }

    const populate_table = (arr) =>{
        const table = document.getElementById('items');
        arr.map((items)=>{
            table.innerHTML+=`<tr><td>${items['fname']}</td><td>${items['size']}</td></tr>`;
        });
    }
    