const resultsNav = document.querySelector('#resultsNav');
const favouritesNav = document.querySelector('#favouritesNav');
const imageContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const apiKey = 'rVeh3yHAY75HimCsHyIMKHQsf1lkwlberGW9oZa5';
const count = 10;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Array for storing API data 
let resultsArray = [];

//Object for tracking favourites
let favourites = {};

//  show content by hidden loader after content has finish loading 
showContent = () => {
	window.scrollTo({top:0, behavior:'instant'});
	loader.classList.add('hidden');

}

// Show Nav specific to page
showNav = (page) => {
	if (page === 'favourites') {
		resultsNav.classList.add('hidden')
		favouritesNav.classList.remove('hidden')
	}
	else {
		resultsNav.classList.remove('hidden')
		favouritesNav.classList.add('hidden')

	}

}


// Create DOM elements 
createDOMNodes = (page) => {
	const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
	currentArray.forEach((result) => {
		// Card Container
		const card = document.createElement('div');
		card.classList.add('card');
		// Link
		const link = document.createElement('a');
		link.href = result.hdurl;
		link.title = 'View full image';
		link.target = '_blank';
		// Image
		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA Picture of the Day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');

		// Card Body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		//Title
		const cardTitle = document.createElement('h5');
		cardTitle.classList.add('card-title');
		cardTitle.textContent = result.title;

		//Add to Favourites
		const addToFavourites = document.createElement('p');
		addToFavourites.classList.add('clickable');

		if(page === 'results')	{
		addToFavourites.textContent = 'Add to favourites';
		addToFavourites.setAttribute('onclick', `saveFavourite('${result.url}')`)
		} 
		else {
			addToFavourites.textContent = 'Remove from favourites';
			addToFavourites.setAttribute('onclick', `removeFavourite('${result.url}')`)
		}
		//Card text
		const cardText = document.createElement('p');
		cardText.classList.add('card-text');
		cardText.textContent = result.explanation;

		//Footer container
		const footer = document.createElement('small');
		footer.classList.add('text-muted');

		//Date
		const date = document.createElement('strong');
		date.textContent = result.date;

		//Copyright
		const copyrightResult = result.copyright === undefined ? '' : result.copyright;
		const copyright = document.createElement('span');
		copyright.textContent = ` ${copyrightResult}`;

		// Appending
		footer.append(date, copyright);
		cardBody.append(cardTitle, addToFavourites, cardText, footer);
		link.appendChild(image);
		card.append(link, cardBody);

		imageContainer.append(card);
	});
}

// Populate DOM with info
updateDOM = (page) => {
	// Get favorites from localStorage
	if (localStorage.getItem('nasaFavourites')) {
		favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
	}
	imageContainer.textContent = '';
	createDOMNodes(page);
	showNav(page);
	showContent();
	
};

// Get 10 results from the NASA API
async function getNasaPictures() {
	// Show loader 
	loader.classList.remove('hidden');
	try {
		const response = await fetch(apiURL);
		resultsArray = await response.json();
		updateDOM("results");
	} catch (error) {
		// Catch error here
	}
}

// Add item to favourites 
saveFavourite = (itemURL) => {

	resultsArray.forEach((item)=>{
	// Loop through resultsArray to select favourites 
	// Checking the urls and also whether it has already added
		if(item.url.includes(itemURL) && !favourites[itemURL]){
			favourites[itemURL] = item;
			// Show save confirmed for two seconds
			// saveConfirmed.childNodes[1].textContent = "Added"
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
				// saveConfirmed.childNodes[1].textContent = "";
			}, 2000);
			// Store favourites in local storage
			localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
		} 
		// else {	
		// 	saveConfirmed.childNodes[1].textContent = "Already added"
		// 	saveConfirmed.hidden = false;
		// 	setTimeout(() => {
		// 		saveConfirmed.hidden = true;
		// 		saveConfirmed.childNodes[1].textContent = "";
		// 	}, 2000);
		// }
	});
	console.log(Object.keys(favourites).length);
}

// Remove item from favourites
removeFavourite = (itemURL)=> {
	if (favourites[itemURL]){
		delete favourites[itemURL];
	}
	// Store favourites in local storage
	localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
	updateDOM('favourites');

}

// on load
getNasaPictures();
