fetch('/data').then(res => res.json()).then(data => {
    const Kategorije = data.categories;
    window.sessionData = data.session;

    async function updateList() {
        const response = await fetch('/cart/getInfo', {
            method: 'GET'
        });
        const kosarica = await response.json();
        window.sessionData.cart = kosarica;
        document.querySelectorAll(".cart-wrapped .list").forEach(el => el.remove());
            
        const wrap = document.querySelector(".cart-wrapped");
        kosarica.products.forEach(item => {
            const { cid, pid, count } = item;
            const product = Kategorije[cid].products[pid];
                
            const listDio = document.createElement("div");
            const lijeviDio = document.createElement("div");
            const desniDio = document.createElement("div");
                
            listDio.className = "list";
            lijeviDio.className = "dio";
            lijeviDio.id = "L";
            lijeviDio.textContent = product.name;
            desniDio.className = "dio";
            desniDio.id = "R";

            const minus = document.createElement("button");
            const kolicina = document.createElement("p");
            const plus = document.createElement("button");
                
            minus.className = "krug";
            minus.textContent = "-";
            kolicina.textContent = count;
            kolicina.className = "quantity";
            plus.className = "krug";
            plus.textContent = "+";
                
            plus.addEventListener("click", async () => {
                const path = `/cart/add/${cid}${pid}`;
                const response = await fetch(path, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                kolicina.textContent = result.count;
                            
                window.sessionData.cart.cart_count = result.cart_count;
                            
                const cartItem = window.sessionData.cart.products.find(p => p.cid === cid && p.pid === pid);
                if (cartItem) {
                    cartItem.count = result.count;
                }
                displayCart();
                        
            });

            minus.addEventListener("click", async () => {
                const path = `/cart/remove/${cid}${pid}`;
                const response = await fetch(path, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                window.sessionData.cart.cart_count = result.cart_count;
                            
                if (result.count > 0) {
                    kolicina.textContent = result.count;
                    const cartItem = window.sessionData.cart.products.find(p => p.cid === cid && p.pid === pid);
                    if (cartItem) {
                        cartItem.count = result.count;
                    }
                    displayCart();
                } else {
                    await updateList();
                    return;
                }
            });
            desniDio.appendChild(minus);
            desniDio.appendChild(kolicina);
            desniDio.appendChild(plus);
            listDio.appendChild(lijeviDio);
            listDio.appendChild(desniDio);

            const footer = document.querySelector(".cart-wrapped .footer");
            wrap.insertBefore(listDio, footer);
        });
        displayCart();
    }

    function displayCart() {
        const cartElement = document.getElementById("n");
        const cartCount = document.getElementById("n0");
        if (window.sessionData.cart.cart_count > 0) {
            cartElement.textContent = window.sessionData.cart.cart_count;
            cartCount.style.visibility = "visible";
        } else {
            cartCount.style.visibility = "hidden";
        }
    }
    displayCart();
    updateList();
});