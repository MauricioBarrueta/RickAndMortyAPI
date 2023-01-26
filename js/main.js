const charactersContainer = document.getElementById('characters-container');

const previousButton = document.getElementById('prev');
previousButton.style.visibility = 'hidden';
const nextButton = document.getElementById('next');
let pageCounter = 1;
/* Valida si la página corresponde a la 1 oculta el botón de página anterior */
const pageValidation = () => {
    pageCounter != 1 ? previousButton.style.visibility = 'visible' : previousButton.style.visibility = 'hidden';
}

/* Función que obtiene los primeros datos de la API */
const getAllCharacters = () => {
    pageCounter = 1;
    pageValidation();
    fetch(`https://rickandmortyapi.com/api/character/`)
        .then(res => { return res.status == 404 ? alert('Error de conexión') : res.json(); })
        .then(data => {
            data.results.forEach(element => {
                renderCharacterCard(element)
            })            
        })
        .catch(error => console.log(error))
}
getAllCharacters()

/* Permite resetear la página y volver al inicio */
const resetList = document.querySelector('.pageOne');
resetList.addEventListener('click', () => {    
    charactersContainer.innerHTML = '';
    getAllCharacters();
})

/* Función que filtra los personajes por su nombre */
const characterNameValue = document.querySelector('.characterName');
const getCharacterByName = () => {  
    fetch(`https://rickandmortyapi.com/api/character/?name=${characterNameValue.value}`)        
        .then(res => { return res.status == 404 ? dataNotFound() : res.json()})        
        .then(data => {
            charactersContainer.innerHTML = '';
            console.log(data.results)
            data.results.forEach(element => {                
                renderCharacterCard(element);
            });
        })
        .catch(error => console.log(error))    
}
const btnFilterCharacters = document.querySelector('.btnFilterList');
btnFilterCharacters.addEventListener('click', () => { 
    characterNameValue.value != "" ?  getCharacterByName() : showAlertSpan(), alertText.innerHTML = 'No has ingresado ningún personaje';
})

/* Función que renderiza los datos obtenidos de los fetch */
function renderCharacterCard(data) {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card');
    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card-inner');
    characterCard.appendChild(flipCard);

    const characterImage = document.createElement('img');
    characterImage.classList.add('character-image-front');
    characterImage.src = `${data.image}`;
    flipCard.appendChild(characterImage);

    const characterInfo = document.createElement('div');
    characterInfo.classList.add('character-info-back');
    const characterName = document.createElement('p');
    characterName.classList.add('character-name');
    characterName.textContent = ` : ${data.name}`;
    characterInfo.appendChild(characterName);

    /* Character Info */
    const characterGender = document.createElement('p');
    characterGender.classList.add('character-gender');
    characterGender.textContent = ` : ${data.gender}`;
    characterInfo.appendChild(characterGender);

    const characterSpecie = document.createElement('p');
    characterSpecie.classList.add('character-specie');
    characterSpecie.textContent = ` : ${data.species}`;
    characterInfo.appendChild(characterSpecie);

    const characterLocation = document.createElement('p');
    characterLocation.classList.add('character-location');
    characterLocation.textContent = ` : ${data.location.name}`;
    characterInfo.appendChild(characterLocation);

    const characterDimension = document.createElement('p');
    characterDimension.classList.add('character-dimension');
    /* Obtiene el nombre de la dimension correspondiente al url de cada ubicación */     
    fetch(`${data.location.url}`)
        .then(res => { return res.status == 404 ? alert('Error al obtener la dimensión') : res.json(); })
        .then(data => {                         
            characterDimension.textContent = ` : ${data.dimension}`;
        })
        .catch(error => console.clear(error))
    characterInfo.appendChild(characterDimension);
   
    const characterStatus = document.createElement('p');
    characterStatus.classList.add('character-status');
    characterStatus.textContent = ` : ${data.status}`;
    characterInfo.appendChild(characterStatus);

    flipCard.appendChild(characterInfo);
    charactersContainer.appendChild(characterCard);
}

/* Función que obtiene los datos correspondientes a la página siguiente */
const getCharactersByNextPage = (event) => {
    event.preventDefault();
    fetch(`https://rickandmortyapi.com/api/character/?page=${++pageCounter}`)
        .then(res => { return res.status == 404 ? alert('Error, no existen más páginas') : res.json(); })
        .then(data => {
            pageValidation();
            charactersContainer.innerHTML = '';
            data.results.forEach(element => {
                renderCharacterCard(element);
            });
        })
        .catch(error => console.log(error))
}
nextButton.addEventListener('click', getCharactersByNextPage);

/* Función que obtiene los datos correspondientes a la página anterior */
const getCharactersByPrevPage = (event) => {
    event.preventDefault();
    fetch(`https://rickandmortyapi.com/api/character/?page=${--pageCounter}`)
        .then(res => { return res.status == 404 ? alert('Error inesperado') : res.json(); })
        .then(data => {
            pageValidation();
            charactersContainer.innerHTML = '';
            data.results.forEach(element => {
                renderCharacterCard(element);
            });
        })
        .catch(error => console.log(error))
}
previousButton.addEventListener('click', getCharactersByPrevPage);

/* Muestra un Alert dependiendo la acción que lo requiera */
const alertDialog = document.getElementById('alertSpan');
const alertText = document.getElementById('alert-text');
const closeAlert = document.querySelector('.close-alert');

const showAlertSpan = () => {      
    alertDialog.classList.remove('hide');
    alertDialog.classList.add('show');
    setTimeout(() => { closeAlertSpan(); }, 5000);
}
const dataNotFound = () => {
    alertDialog.classList.remove('hide');
    alertDialog.classList.add('show');    
    alertText.innerHTML = 'El personaje no existe';
    getAllCharacters();
    setTimeout(() => { closeAlertSpan(); }, 5000);
}
/* Función para ocultar el Alert Span */
const closeAlertSpan = () => {
    alertDialog.classList.remove('show');
    alertDialog.classList.add('hide');     
}
closeAlert.addEventListener('click', closeAlertSpan)