redirects();

const populate_table = (arr) =>{
    const table = document.getElementById('items');
    arr.map((items)=>{
        table.innerHTML+=`<tr><td>${items['fname']}</td><td>${items['size']}</td></tr>`;
    });
}
const processarr=(content)=>{
console.log(content);
}
window.addEventListener("load",async(event)=>{
const token = sessionStorage.getItem('token');
if(token==null){
    window.location.replace('index.html');
}else{
    const url = globurl+"/getlist";
    const content = await requestHandler(url,"POST",token);
    if(response.status !==200){
    window.location.replace('index.html');
    }else{
        const arr = processarr(content);
        populate_table(arr);
    }
}    
});
