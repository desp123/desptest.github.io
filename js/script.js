function togglecheckbox(){
const checkbox = document.querySelectorAll('.filter-check_checkbox');

checkbox.forEach((item)=>{
item.addEventListener('change', function(){
     if(this.checked){
         this.nextElementSibling.classList.add('checked');
     }else{
        this.nextElementSibling.classList.remove('checked');
     }
});
});
}

function toggleCart(){
    const btnCart = document.getElementById('cart'),
    modalCart = document.querySelector('.cart'),
    closeBtn = document.querySelector('.cart-close');

    btnCart.addEventListener('click',()=>{
        modalCart.style.display = 'flex';
    });

    closeBtn.addEventListener('click',()=>{
        modalCart.style.display = '';
    });
}

function addCart(){
    const cards = document.querySelectorAll('.goods .card'),
         cartWrapper = document.querySelector('.cart-wrapper'),
         count = document.querySelector('.counter'),
         cartEmpty = document.querySelector('#cart-empty');

    cards.forEach((card)=>{
        const btn = card.querySelector('button');
        btn.addEventListener('click', ()=>{
        const cardClone = card.cloneNode(true);
        const cardTitle = card.querySelector('.card-title');
        const cloneTitle = cardClone.querySelector('card-title');
        cartWrapper.appendChild(cardClone);
        showData();

        const removeBtn = cardClone.querySelector('.btn');
        removeBtn.textContent = 'Удалить из корзины';
        removeBtn.addEventListener('click', ()=>{
            cardClone.remove();
            showData();
        });
    });
    });

    function showData(){
        const cardInCart = cartWrapper.querySelectorAll('.card');

        count.textContent = cardInCart.length;
        
        if(cardInCart.length != 0){
            cartEmpty.remove();
        }else{
            cartWrapper.appendChild(cartEmpty);
        }
    }
}

function actionPage(){
    const cards = document.querySelectorAll('.goods .card'),
          discountCheckbox = document.getElementById('discount-checkbox'),
          min = document.getElementById('min'),
          max = document.getElementById('max'),
          search = document.querySelector('.search-wrapper_input'),
          searchBtn = document.querySelector('.search-btn');
  
    discountCheckbox.addEventListener('click', function(){
        cards.forEach((card)=>{
            if(discountCheckbox.checked){
                if(!card.querySelector('.card-sale')){
                    card.parentNode.style.display = 'none';
                }
            }else{
                card.parentNode.style.display = '';
            }
        });
    });

    min.addEventListener('change', filterPrice);
    max.addEventListener('change', filterPrice);    
    
    function filterPrice(){
        cards.forEach((card)=>{
        const cardPrice = card.querySelector('.card-price'),
              price = parseFloat(cardPrice.textContent);
        if((min.value && price < min.value) || (max.value && price > max.value)){
            card.parentNode.style.display = 'none';
        }else{
            card.parentNode.style.display = '';
        }
        });
    }

    searchBtn.addEventListener('click', ()=>{
        const searchText = new RegExp(search.value.trim(), 'i');
        
        cards.forEach((card)=>{
           const title = card.querySelector('.card-title');

           if(!searchText.test(title.textContent)){
               card.parentNode.style.display = "none";
           }else{
            card.parentNode.style.display = "";
           }
        });
    
    });
}

function getData(){
    const goodsWrapper = document.querySelector('.goods');

    return fetch('https://desp123.github.io/desptest.github.io/db/db.json')
    .then((responce)=>{
        if(responce.ok){
            return responce.json();
        }else{
            throw new Error(responce.status)
        }
    })
    .then((data)=>{
        return data;
    })
    .catch((error)=>{
        console.log(error)
        goodsWrapper.innerHTML = '<div class="text-danger">Упс что-то пошло не так!</div>';
    });
}

function renderCards(data){
    const goodsWrapper = document.querySelector('.goods');
    
    data.goods.forEach((good)=>{
        const card = document.createElement('div');

        card.classList = 'col-12 col-md-6 col-lg-4 col-xl-3';
        card.innerHTML = `
                    
                        <div class="card">
                         ${good.sale ? '   <div class="card-sale">🔥Hot Sale🔥</div>' : ''}
                            <div class="card-img-wrapper">
                                <span class="card-img-top"
                                    style="background-image: url('${good.img}')"></span>
                            </div>
                            <div class="card-body justify-content-between">
                                <div class="card-price" style="${good.sale ? 'color:red;' : ''}">${good.price} ₽</div>
                                <h5 class="card-title">${good.title}</h5>
                                <button class="btn btn-primary">В корзину</button>
                            </div>
                        </div>
                    
                    `;
        goodsWrapper.appendChild(card);
    });
}

getData().then((data)=>{
    renderCards(data)
    togglecheckbox();
    toggleCart();
    addCart();
    actionPage();
});


