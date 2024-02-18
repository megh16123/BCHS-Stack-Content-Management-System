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
const check_session = () => {
const url = globurl+"/session";
const token = sessionStorage.getItem("token")
if(token==null){
    window.location.replace("session.html");    
}
const {content,status} = requestHandler(url,"POST",token);
if(status!==200){
window.location.replace("session.html");
}
}
const redirects = ()=>{
    try {
    document.getElementById('logout').addEventListener("click",(event)=>{
        sessionStorage.removeItem('token');
        window.location.replace("index.html");
    });   
    } catch (error) {    }
    try {
        document.getElementById('back-to-menu').addEventListener("click",(event)=>{
        window.location.replace("menu.html");
    });
    } catch (error) {}
    
    
}
const processarr=(content)=>{
    content = content.split("\n");
    const output = []
    content.map((item)=>{
        const temp=item.split(",");
        output.push({fname:temp[0],size:temp[1]})
    })
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
        const url = globurl+"/lst";
        const token = sessionStorage.getItem("token")
                const {content,status} = await requestHandler(url,"POST",token);
                if(status !==200){
                win
                dow.location.replace('index.html');
                }else{
                    const arr = processarr(content);
                    populate_table(arr);
                }
    }    