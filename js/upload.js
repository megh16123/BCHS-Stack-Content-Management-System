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
			const url = "http://192.168.199.56:7980/cgi-bin/something";
		        const method = "POST";
			const response = await requestHandler(url,method,event.target.result);

		}
	}
	act.addEventListener('submit',handleSubmit);

//function 1handleSubmit(event)
//{
//	event.preventDefault();
//	console.log("in event handler\n");
//	uploadFiles();
//}
//
//function uploadFiles()
//{
//	const url = "http://192.168.199.56:7980/cgi-bin/example";
//	const method = 'post';
//	reader.readAsArrayBuffer(iv.files[0])
//	const xhr = new XMLHttpRequest();
//	var data = "";
//	
//	xhr.open(method,url);
//	reader.onload = function(e) {
//		console.log("here");
//		const str = new TextDecoder().decode(reader.result);
//		xhr.send(btoa(unescape(encodeURIComponent(str))));
//		console.log(btoa(unescape(encodeURIComponent(str))));
//	};
//
//
//	console.log('hello world');
//	console.log(data);
//}
