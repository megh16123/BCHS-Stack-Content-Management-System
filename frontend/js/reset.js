document.getElementById('myform').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const username = e.target['username'].value;
    const old_password = e.target['opassword'].value;
    const new_password = e.target['npassword'].value;
    const s1 = btoa(username+old_password);
    const s2 = btoa(username+new_password);
    const url= globurl+"/reset";
    console.log(s1+" "+s2)
    const {content,status} = await requestHandler(url,"POST",s1+" "+s2);
    if(status==200){
        alert("Password Reset Successfully")
        window.location.replace("index.html")
    }else{
        alert(content);
    }

})
