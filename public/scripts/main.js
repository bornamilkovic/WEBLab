fetch('/data').then(res => res.json()).then(categories => {
    const Kategorije = categories.categories;
    window.sessionData = categories.session;
    let tren_kat = Kategorije.findIndex(cat => cat.cid === window.sessionData.current_page);
    if (tren_kat === -1) tren_kat = 0;

    function displayCart() { 
        const cartElement = document.getElementById("n");
        const cartCount = document.getElementById("n0");
        
        if(window.sessionData.cart.cart_count > 0){
            cartElement.textContent = window.sessionData.cart.cart_count;
            cartCount.style.visibility = "visible";
        } else {
            cartCount.style.visibility = "hidden";
        }
    }

    function displayItem() { 
        let currentCat = window.sessionData.current_page;
        for (let pid = 0; pid <= 4; pid++) {
            let count = 0;
            for (let i = 0; i < window.sessionData.cart.products.length; i++) {
                const product = window.sessionData.cart.products[i];
                if (product.cid === currentCat && product.pid === pid) {
                    count = product.count;
                    break;
                }
            }
            const displayPid = pid + 1;
            const idClass = document.getElementById(`n${displayPid}`);
            const idP = document.getElementById(`n1${displayPid}`);
            if (count > 0) {
                idClass.textContent = count;
                idP.style.visibility = "visible";
            } else {
                idP.style.visibility = "hidden";
            }
        }
    }

    function promijeniK(k) { 
        for(let i = 1; i <= 5; i++) {
            const catId = document.getElementById(`c1${i}`);
            catId.textContent = Kategorije[k].name;
        }
        for(let i = 1; i <= 5; i++) {
            const proId = document.getElementById(`t${i}`);
            proId.textContent = Kategorije[k].products[i-1].name;
        }
        for(let i = 1; i <= 5; i++) {
            const imageId = document.getElementById(`s${i}`);
            imageId.src = Kategorije[k].products[i-1].image;
        }
        const headerNatpis = document.getElementById("k");
        headerNatpis.textContent = Kategorije[k].name;
        for(let i = 1; i <= 10; i++) {
            const categories = document.getElementById(i.toString());
            categories.style.fontWeight = "normal";
        }
        const currentCategory = document.getElementById((k+1).toString());
        currentCategory.style.fontWeight = "bold";
        displayCart();
        displayItem();
    }

    async function addToCart(pid) {
        const path = `/cart/add/${tren_kat}${pid}`;
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        window.sessionData.cart.cart_count = result.cart_count;
        const existing = window.sessionData.cart.products.find(p => p.cid === tren_kat && p.pid === pid);
        if (existing) {
                existing.count = result.count;
        } else {
            window.sessionData.cart.products.push({
                cid: tren_kat,
                pid: pid,
                count: result.count
            });
        }
        displayCart();
        displayItem();
    }
    async function changeCategory(cid) {
        const response = await fetch(`/home/getProducts/${cid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        window.sessionData.current_page = cid;
        tren_kat = cid;
        promijeniK(cid);
    }

    promijeniK(tren_kat);
    displayCart();
    displayItem();

    for (let i = 1; i <= 5; i++) {
        const buttonId = "b" + i;
        const pid = i - 1;
        const button = document.getElementById(buttonId);
        button.onclick = function() {
            addToCart(pid);
        };
    }

    for (let i = 1; i <= 10; i++) {
        const buttonId = i.toString();
        const cid = i - 1;
        const button = document.getElementById(buttonId);
        button.onclick = function() {
            changeCategory(cid);
        };
    }

    for (let i = 1; i <= 5; i++) {
        const cartAdd = document.getElementById(`s${i}`);
        const cartAddButton = document.getElementById(`b${i}`);
        
        cartAdd.addEventListener("mouseover", () => {
            cartAddButton.style.display = "block";
        });
        cartAdd.addEventListener("mouseleave", () => {
            cartAddButton.style.display = "none";
        });    
        cartAddButton.addEventListener("mouseover", () => {
            cartAddButton.style.display = "block";
        });
        cartAddButton.addEventListener("mouseleave", () => {
            cartAddButton.style.display = "none";
        });
    }
});