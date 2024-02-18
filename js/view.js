check_session();
redirects();


window.addEventListener("load",async(event)=>{
const token = sessionStorage.getItem('token');
    const url = globurl+"/getlist";
    const content = await requestHandler(url,"POST",token);
    if(response.status !==200){
    window.location.replace('index.html');
    }else{
        const arr = processarr(content);
        populate_table(arr);
    }
}    
);
