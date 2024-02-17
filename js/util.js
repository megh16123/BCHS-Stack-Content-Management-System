let globurl = "http://192.168.199.56:7980/cgi-bin"
const requestHandler = async(url,method,body)=>{
const response = await fetch(url,{
                                method:method,
                                mode:"cors",
                                body:body
});
return response;
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
