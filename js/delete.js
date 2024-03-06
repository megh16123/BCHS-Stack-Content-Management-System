check_session();
redirects();


window.addEventListener("load",fetch_files);
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const fileId = document.getElementById("fileid").value;
    const url= globurl+"/rem";
    const {content,status} = await requestHandler(url,"POST",sessionStorage.getItem('token')+","+fileId);
	console.log(content);
    if(status===200){
    alert("File Deleted Successfully");
	window.location.replace("delete.html");
    }else{
        console.log(content);
    }
})
