redirects();
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById('password').value;
    const url= globurl+"/someendpoint";
    const {content,status} = await requestHandler(url,"POST",btoa(username)+","+btoa(password));
    if(status===200){
        // TODO : set the token in session storage 
        window.location.replace("menu.html")
    }else{
        alert("Authentification Failed");
    }
})