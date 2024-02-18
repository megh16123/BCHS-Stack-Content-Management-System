redirects();
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById('password').value;
    const url= globurl+"/auth";
    const {content,status} = await requestHandler(url,"POST",btoa(username+password+"\n"));
    if(status===200){
        sessionStorage.setItem('token',btoa(username)+btoa(password)+content); 
        window.location.replace("menu.html")
    }else{
        alert("Authentification Failed");
    }
})
