check_session();
redirects();


window.addEventListener("load",async(event)=>{
            const url = globurl+"/lst";
            const {content,status} = await requestHandler(url,"POST",token);
            if(status !==200){
            window.location.replace('index.html');
            }else{
                const arr = processarr(content);
                populate_table(arr);
            }
        }    
);
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const fileId = document.getElementById("fileid").value;
    const url= globurl+"/deletefile";
    const {content,status} = await requestHandler(url,"POST",btoa(fileId));
    if(status===200){

    }else{
        
    }
})