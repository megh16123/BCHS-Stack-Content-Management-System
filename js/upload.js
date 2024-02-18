check_session();
redirects();


const file = document.getElementById("myinput");
	const act = document.getElementById("myform");
	const  handleSubmit = (event) =>{
		event.preventDefault();
		reader = new FileReader();
		reader.readAsDataURL( file.files[0] );
		reader.onloadend = async( event ) =>{
			if( event.target.readyState !== FileReader.DONE )
			{
				return;
			}
			const url = globurl+"/something";
		        const method = "POST";
			const {content,status} = await requestHandler(url,method,event.target.result);
            if(status===200){
				console.log(content);
				alert("file uploaded successfully");
				window.location.replace("menu.html");
			}else{
				alert(content)
				window.location.replace("menu.html");
			}


		}
	}
act.addEventListener('submit',handleSubmit);