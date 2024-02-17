let globurl = "http://127.0.0.1:7980/cgi-bin"

const decode_response = async(response) =>{
	const reader = response.body.getReader();
 	const { done,value } = await reader.read();
	return (new TextDecoder("utf-8").decode(value));
}

const requestHandler = async(url,method,body)=>{
const response = await fetch(url,{
                                method:method,
                                mode:"cors",
                                body:body
});

return await decode_response(response);
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
