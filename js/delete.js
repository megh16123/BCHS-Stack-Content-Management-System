check_session();
redirects();


window.addEventListener("load",fetch_files);
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const fileId = document.getElementById("fileid").value;
    const url= globurl+"/rem";
    const {content,status} = await requestHandler(url,"POST",sessionStorage.getItem('token')+","+btoa(fileId));
    if(status===200){
    alert("File Deleted Successfully")
    fetch_files("just text");
    }else{
        console.log(content);
    }
})