
document.addEventListener('DOMContentLoaded', () => {

    const promoBox = document.getElementById('promo-box');
    const closePromo = document.getElementById('close-promo');

    const likeYes = document.getElementById('like-yes');
    const likeNo = document.getElementById('like-no');

    likeYes.addEventListener('change', () => {
        if (likeYes.checked) {
            likeNo.checked = false;
        }
    });

    likeNo.addEventListener('change', () => {
        if (likeNo.checked) {
            likeYes.checked = false;
        }
    });

    const submitButton = document.getElementById('submit-feedback');

    function culoareAleatorie() {
        // Generăm valorile RGB aleatorii între 0 și 255
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        // Construim șirul de culoare în format RGB
        var culoare = "rgb(" + r + ", " + g + ", " + b + ")";
        return culoare;
    }
    
    // Funcția care va schimba culoarea butonului
    function schimbaCuloare() {
        // Obținem elementul butonului
        var buton = document.querySelector('.buton');
        // Generăm o culoare aleatorie
        var culoareRandom = culoareAleatorie();
        // Schimbăm culoarea butonului
        buton.style.backgroundColor = culoareRandom;
    }

    schimbaCuloare();
    setInterval(schimbaCuloare, 2000);



    // Obține elementele din DOM
    const targetDiv = document.getElementById('adauga-bautura');
    const changeColorButton = document.getElementById('add-drink');

    // Adaugă un eveniment de clic pe buton
    changeColorButton.addEventListener('click', function() {
        // event.preventDefault();
        // Verifică dacă div-ul are deja clasa 'highlight'
        if (targetDiv.classList.contains('highlight')) {
            // Dacă are, elimină clasa pentru a reveni la culoarea originală
            targetDiv.classList.remove('highlight');
        } else {
            // Dacă nu are, adaugă clasa pentru a schimba culoarea fundalului
            targetDiv.classList.add('highlight');
        }
    });




    submitButton.addEventListener('click', () => {
        const likeYes = document.getElementById('like-yes').checked;
        const likeNo = document.getElementById('like-no').checked;
        let likeResponse = '';

        if (likeYes) {
            likeResponse = 'Da';
        } else if (likeNo) {
            likeResponse = 'Nu';
        }

        const rating = document.querySelector('input[name="rating"]:checked');

        if (rating) {
            const ratingValue = rating.value;


            console.log('Datele trimise către server:', {
                likeResponse: likeResponse,
                rating: ratingValue
            });
            
            

            // Trimite datele folosind fetch
            fetch('http://localhost:3222', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    likeResponse: likeResponse,
                    rating: ratingValue
                })
            })
            .then(response => {
                return response.json(); // Returnează răspunsul ca JSON
            })
            .then(data => {
                console.log('Răspuns de la server:', data);
                alert('Mulțumim pentru feedback!');
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('A apărut o eroare. Te rugăm să încerci din nou mai târziu.');
            });

        } 

        else {
            alert('Te rugăm să selectezi un rating.');
        }
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 's' || event.key === 'S') {
            promoBox.style.display = 'block';
        }
    });
    
    closePromo.addEventListener('click', () => {
        promoBox.style.display = 'none';
    });
    promoBox.classList.add('double-size'); 
    
    const drinkForm = document.getElementById('drink-form');
    const drinkName = document.getElementById('drink-name');
    const drinkSize = document.getElementById('drink-size');
    const milkQuantity = document.getElementById('milk-quantity');
    const sugarQuantity = document.getElementById('sugar-quantity');
    const siropElement = document.getElementById('sirop'); 
    const description = document.getElementById('description');
    const drinkList = document.getElementById('drink-list');
    const addDrinkButton = document.getElementById('add-drink');

    addDrinkButton.addEventListener('click', (event) => {
        event.preventDefault();
        const name = drinkName.value.trim();
        const size = drinkSize.value;
        const milkquantity = milkQuantity.value;
        const sugarquantity = sugarQuantity.value;
        const sirops = Array.from(siropElement.selectedOptions).map(option => option.value);
        const desc = description.value.trim();

        if (!validateInput(name, desc)) {
            alert('Please enter valid data.');
            return;
        }

        const price = calculatePrice(size, milkquantity, sirops.length);

        const drink = {
            name,
            size,
            milkquantity,
            sugarquantity,
            sirops,
            description: desc,
            price,  // Add calculated price
            id: Math.random().toString(36).substr(2, 9)
        };
        addDrinkToDOM(drink);
        saveDrink(drink);
    });

    const addDrinkToDOM = (drink) => {
        const drinkItem = document.createElement('div');
        drinkItem.classList.add('drink-item');
        drinkItem.dataset.id = drink.id;

        const drinkName = document.createElement('h3');
        drinkName.textContent = drink.name;

        const drinkDetails = document.createElement('p');
        drinkDetails.textContent = `Mărimea: ${drink.size}, Lapte: ${drink.milkquantity}, Zahăr: ${drink.sugarquantity}, Siropuri: ${drink.sirops ? drink.sirops.join(', ') : 'Niciun sirop' }, Preț: ${drink.price} lei`;


        // const drinkDetails = document.createElement('p');
        // drinkDetails.textContent = `Mărimea: ${drink.size}, Lapte: ${drink.milkquantity}, Zahăr: ${drink.sugarquantity}, Siropuri: ${drink.sirops.join(', ')}, Preț: ${drink.price} lei`;

        const drinkDescription = document.createElement('p');
        drinkDescription.textContent = `Descriere: ${drink.description}`;

        const promotie = document.createElement('h5');
        promotie.textContent = 'Fiindcă ai ajuns atât de departe și esti un iubitor al cafelei cel puțin la fel de devotat ca și noi, avem o surpriză pentru tine: APASĂ TASTA S de la...SURPRIZĂĂĂ :)';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-drink');
        deleteButton.textContent = 'Șterge';
        deleteButton.addEventListener('click', (event) => {
            const id = event.currentTarget.parentElement.dataset.id;
            deleteDrink(id);
            event.currentTarget.parentElement.remove();
        });

        drinkItem.append(drinkName, drinkDetails, drinkDescription, deleteButton, promotie);
        drinkList.appendChild(drinkItem);
    };

    const saveDrink = (drink) => {
        let drinks = JSON.parse(localStorage.getItem('drinks')) || [];
        drinks.push(drink);
        localStorage.setItem('drinks', JSON.stringify(drinks));
    };

    const loadDrinks = () => {
        const drinks = JSON.parse(localStorage.getItem('drinks')) || [];
        drinks.forEach(drink => addDrinkToDOM(drink));
    };

    const deleteDrink = (id) => {
        let drinks = JSON.parse(localStorage.getItem('drinks')) || [];
        drinks = drinks.filter(drink => drink.id !== id);
        localStorage.setItem('drinks', JSON.stringify(drinks));
    };

    const validateInput = (name, description) => {
        const nameRegex = /^[a-zA-Z0-9 ]{3,20}$/;
        const descriptionRegex = /^[a-zA-Z0-9 ,.!?]{0,200}$/;
        return nameRegex.test(name) && descriptionRegex.test(description);
    };

    const calculatePrice = (size, milkquantity, siropCount) => {
        let price = 5;
        if(size.includes("mediu")){
            price+=1;
        } else if (size.includes("mare")){
            price+=2;
        }
        if (milkquantity.includes("30ml")) {
            price += 1.5;
        } else if (milkquantity.includes("90ml")) {
            price += 3;
        }
        price += siropCount * 2;
        return price;
    };

    loadDrinks();

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const commentSection = document.getElementById('comment-section');
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment');
    const submitCommentButton = document.getElementById('submit-comment');
    const commentsDiv = document.getElementById('comments');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function loadComments() {
        fetch('http://localhost:3222/comments')
            .then(response => response.json())
            .then(data => {
                commentsDiv.innerHTML = '';
                data.comments.forEach(comment => {
                    const newComment = document.createElement('div');
                    newComment.innerHTML = `<strong>${comment.user}</strong>: ${comment.comment}`;
                    commentsDiv.appendChild(newComment);
                });
            })
            .catch(error => console.error('Eroare la preluarea comentariilor:', error));
    }
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!emailRegex.test(email)) {
                alert('Email-ul nu este valid.');
                return;
            }

            fetch('http://localhost:3222/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Autentificare reușită!');
                    loginForm.classList.add('hidden');
                    logoutButton.classList.remove('hidden');
                    commentSection.classList.remove('hidden');
                    loadComments();
                } else {
                    alert(data.message || 'Autentificare eșuată!');
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('A apărut o eroare. Te rugăm să încerci din nou mai târziu.');
            });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('http://localhost:3222/logout', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Deconectare reușită!');
                    loginForm.classList.remove('hidden');
                    logoutButton.classList.add('hidden');
                    commentSection.classList.add('hidden');
                } else {
                    alert(data.message || 'Deconectare eșuată!');
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('A apărut o eroare. Te rugăm să încerci din nou mai târziu.');
            });
        });
    }

    if (submitCommentButton) {
        submitCommentButton.addEventListener('click', (e) => {
            e.preventDefault();
            const comment = commentInput.value;

            fetch('http://localhost:3222/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const newComment = document.createElement('div');
                    newComment.textContent = comment;
                    commentsDiv.appendChild(newComment);
                    commentInput.value = '';
                } else {
                    alert(data.message || 'Trimiterea comentariului a eșuat!');
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('A apărut o eroare. Te rugăm să încerci din nou mai târziu.');
            });
        });
    }

    document.getElementById("meniuid").addEventListener("click", function(event) {
        event.preventDefault(); 
        var section = document.getElementById("meniu");
        var sectionPosition = section.offsetTop;
        window.scrollTo({
            top: sectionPosition,
            behavior: "smooth" 
        });
    });
    
   
    const contactSection = document.getElementById('e_t');

    contactSection.addEventListener('click', (event) => {
        event.stopPropagation();
        alert('Ai apăsat pe secțiunea de contact!');
    });




    document.getElementById('notfound').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '404.html';
       });
});

