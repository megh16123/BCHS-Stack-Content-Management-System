redirects();
document.getElementById("myform").addEventListener('submit',async(event)=>{
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById('password').value;
    const url= globurl+"/auth";
    console.log(btoa(username+password)); 
    const {content,status} = await requestHandler(url,"POST",btoa(username+password));
    console.log(content+" "+status);
    if(status==200){
             sessionStorage.setItem('token',btoa(username+password)+","+content);
             window.location.replace("menu.html")
	}else{
		alert("Authentification failed!");
	}
    }
)
