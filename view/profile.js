        window.onload = (event) =>{
            let filename = window.location.pathname.split("/").pop().split(".")[0];
            const name = document.getElementById("fname");
            const description = document.getElementById('fdesc');
            const linktomypage = document.getElementById('link');
            const image = document.getElementById('fprofile'); 
            fetch("pinfo.json").then(data=>{
                data.json().then(d=>{
                    let res = d.filter((item)=>item.label===filename)[0];
                    name.innerText = res.name;
                    description.innerText = res.description;
                    linktomypage.href = `./faculty/${res.label}/index.html`;
                    image.src = `res/${res.image}`;
                });
            });
        }
