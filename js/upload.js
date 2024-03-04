check_session();
redirects();
const file_size_validator = (file) =>{
if(file.size/1000000>4){
	return true;
}else{
	return false;
}
}

const file_extension_validato =(file_name)=>{
	const file =  file_name.split(".");
	const ban = ["doc","docm","docx","docx","dot","dotm","dotx","mht","mhtml","zip","rtf","wps","xps","pptx"]
	console.log(file)
	if(file.length>2){
		alert("File Name not Correct");
	}else{
		let res = /^[A-Za-z0-9]+$|_|-/.test(file[0]);
		if(!res){
			alert("Filename not valid (Special Characters and Spaces are not allowed)!");
			return false;
		}

		if(ban.includes(file[1])){
			alert("Not a valid File extension")
			return false;
		}

	}
}

const validate_file_name = (file_name) =>{
	const url = globurl + "/chkupld";
	const payload = sessionStorage.getItem("token") + btoa(file_name);
	const {content,status} = requestHandler(url,"POST",payload);
	if(status === 200){
		return true;
	}else{
		return false;
	}
	 
}

const file = document.getElementById("myinput");
const act = document.getElementById("myform");

const  handleSubmit = (event) =>{
	event.preventDefault();
	if(file_size_validator(file.files[0])){
			alert("File too Large");
	}else{
		file_extension_validato(file.files[0].name)
		if(validate_file_name(file.files[0].name)){
		reader = new FileReader();
		reader.readAsDataURL( file.files[0] );
		reader.onloadend = async( event ) =>{
		if( event.target.readyState !== FileReader.DONE ){
				return;
		}
		const url = globurl+"/upload";
		const method = "POST";
		const payload = sessionStorage.getItem("token")+","+hex_md5(event.target.result.split(",")[1])+","+file.files[0].name+","+event.target.result.split(",")[1];
		console.log(payload);
		const {content,status} = await requestHandler(url,method,payload);
		console.log(content);
        if(status===200){
			console.log(content);
			alert("file uploaded successfully");
			//window.location.replace("menu.html");
		}else{
			alert(content)
			//window.location.replace("menu.html");
			}
		}
	}else{
		alert("Something went wrong!")
	}
}
}

act.addEventListener('submit',handleSubmit);
