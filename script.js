import * as local from './quotes.js';

const MAX_QUOTES_LENGTH = 120;

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const switchSourceBtn = document.getElementById('switch-source');
const loader = document.getElementById('loader');

let UsingAPI = true;
let apiQuotes = [];

/* ================================  LOADING =======================================*/

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    loader.hidden = true;
    quoteContainer.hidden = false;
}

/* ================================  QUOTES =======================================*/

//Get a quote randomly using either a local source or the API
async function getQuote() {
    showLoadingSpinner();

    let arrQuotes = [];
    let quote;

    if (UsingAPI) {
        if (apiQuotes.length == 0) {
            apiQuotes = await getQuotesAPI();
        }
        arrQuotes = apiQuotes;
    } else {
        arrQuotes = await getQuotesLocal();
    }

    //Get the quote ramdoly in the array of quotes
    quote = arrQuotes[Math.floor(Math.random() * arrQuotes.length)];
    putQuoteInDOM(quote);
    removeLoadingSpinner();
}

// Get Quotes from API
async function getQuotesAPI() {
    const apiUrl = 'https://type.fit/api/quotes'
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        //Catch Error Here
        //Try 10 times and stop to inform user
    }
}

// Get Quotes from API
async function getQuotesLocal() {
    return new Promise((resolve, reject) => {
        resolve(local.localQuotes);
    });
    //add reject
}

/* ===========  DOM ===============================================================*/

function putQuoteInDOM(quote) {
    authorText.textContent = !quote.author ? 'Anonymous' : quote.author;
    if (quote.text.length > MAX_QUOTES_LENGTH) {
        quoteText.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }
    quoteText.textContent = quote.text;
}

/* ===========  SOURCE ============================================================*/

function switchSource() {
    UsingAPI = !UsingAPI
}

/* ===========  TWITTER ===========================================================*/

// Tweet a quote
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, '_blank');
}

/* ===========  EVENT LISTENERS ===================================================*/

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
switchSourceBtn.addEventListener('click', switchSource);

/* ===========  ON LOAD ===========================================================*/
getQuote();