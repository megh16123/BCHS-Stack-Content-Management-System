check_session();
redirects();


window.addEventListener("load",fetch_files);
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const fileId = document.getElementById("fileid").value;
    const url= globurl+"/deletefile";
    const {content,status} = await requestHandler(url,"POST",btoa(fileId));
    if(status===200){
    alert("File Deleted Successfully")
    fetch_files("just text");
    }else{
        alert(content);
    }
})