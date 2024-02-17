redirects();
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById('password').value;
    const url= globurl+"/someendpoint";
    const response = await requestHandler(url,"POST",btoa(username)+","+btoa(password));
    if(response.status===200){
        // TODO : set the token in session storage 
        window.location.replace("menu.html")
    }else{
        alert("Authentification Failed");
    }
})