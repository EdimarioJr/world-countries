var menu = document.getElementById("menu");
var dropdown = document.getElementsByClassName("dropdown")[0];
var options = document.getElementsByClassName("option");

var search = document.getElementsByClassName("section__input")[0];
// the destiny div that the cards from the countries will be placed
var cardsDiv = document.getElementsByTagName("main")[0];

// the variable that will hold the data from the API
var data = [];

var pageButtonsDiv = document.getElementsByTagName("footer")[0];
var searchResults = [];
var pageButtons = [];
const ITEMS_PER_PAGE = 8;

// ----------------- menu dropdown definition --------------------------------
// the dropdown shows up when the user click on the menu
menu.addEventListener("click", () => {
  dropdown.classList.add("fadeIn");
  dropdown.classList.toggle("dropdown");
});

// the animation will only be executed one time
dropdown.addEventListener("animationiteration", () => {
  dropdown.classList.remove("fadeIn");
});

function paginateData(data) {
  let paginatedArray = [];
  data.forEach((current, index) => {
    let posicao = Math.ceil((index + 1) / ITEMS_PER_PAGE) - 1;
    paginatedArray[posicao]
      ? paginatedArray[posicao].push(current)
      : (paginatedArray[posicao] = [current]);
  });
  return paginatedArray;
}

// executing the filter everytime the user clicks in one of the options of the dropdown
// the options return a HTMLCollection, the Array from transforms into an Array to apply the forEach
Array.from(options).forEach((current) =>
  current.addEventListener("click", (event) => {
    // hides the dropdown and put it the content in the menu DIV
    dropdown.classList.add("dropdown");
    menu.innerHTML = `
      <p>${event.target.innerText}</p>
    `;
    searchResults = [];
    pageButtonsDiv.innerHTML = "";
    pageButtons = [];

    // call the function that will mount the cards with the results of the filter in the HTML
    assembleCards(
      data.filter((current) => current.region === event.target.innerText)
    );
  })
);

// -------------------- Search mechanism --------------------------------------
// waits until the user press "Enter" to capture the input value

search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchResults = [];
    pageButtons = [];
    event.preventDefault();
    // mounting the RegExp search, any country that has
    let search = new RegExp(event.target.value, "i");
    // the results will be a array that will receive the data.filter return
    let results = data.filter((current) => {
      //sees if the country name matchs with the search variable
      if (current.name.search(search) != -1) return current;
    });
    if (results.length > 0) {
      // apply the math ceil to round the number up and paginate the cards
      searchResults = paginateData(results);
      // call the function that mounts the buttons and the function that assembles the cards
      assemblePageButtons(searchResults.length);
      assembleCards(searchResults[0]);
    } else cardsDiv.innerHTML = "<h1>No Results!</h1>";
  }
});

// function that mounts the buttons responsible for the pagination of the results
function assemblePageButtons(num) {
  pageButtonsDiv.innerHTML = "";
  let i = 0;
  // the number of buttons =  searchResults.length
  while (i < num) {
    let element = `<div class="button button--page">${i + 1}</div>`;
    // stores all the actual buttons on a array
    pageButtons.push(element);
    i++;
  }
  if (num > 4)
    // if there more than 4 pages, calls the function that organizes the buttons
    buttonSlider(1, num);
  if (num <= 4 && num > 1) {
    // if not, transform the array of buttons in a string and put it in the HTML
    pageButtonsDiv.innerHTML = pageButtons.join("");
    addEventButton();
  }
}

// This function adds the Event Listeners to the buttons that are in the page
function addEventButton() {
  // when the user clicks on the button, the cards shown in the page will be the
  // searchResults[index]. index = button number
  // Array from is necessary because we have to transform the HTMLCollection in a Array to apply
  // the forEach loop
  Array.from(document.getElementsByClassName("button--page")).forEach(
    (current) => {
      current.addEventListener("click", (event) => {
        assembleCards(searchResults[parseInt(event.target.innerText) - 1]);
        buttonSlider(parseInt(event.target.innerText), searchResults.length);
      });
    }
  );
}

// organizes the buttons in a responsive way
function buttonSlider(begin, end) {
  let i = 0;
  pageButtonsDiv.innerHTML = "";
  // if the user is close to the last button, will show only the 4 last buttons and
  // the first button
  if (end - begin <= 3) {
    pageButtonsDiv.innerHTML = `${pageButtons[0]} <p>...</p> `;
    i = end - 4;
    while (i < end) {
      pageButtonsDiv.innerHTML += pageButtons[i];
      i++;
    }
  } else {
    // always will show the 4 subsequent buttons and the last button
    while (i < 4) {
      pageButtonsDiv.innerHTML += pageButtons[begin - 1];
      i++;
      begin++;
    }
    pageButtonsDiv.innerHTML += `<p>...</p>${pageButtons[end - 1]}`;
  }
  // always add the event listeners
  addEventButton();
}

// ----------------- initializing the page with the data from the API or the sessionStorage ---------

function initCards() {
  // if sessionStorage has anything, mount the card with the data in there, if not, fetch the API
  if (sessionStorage.length) {
    data = JSON.parse(sessionStorage.getItem("countries"));
    assembleCards(data);
  } else {
    fetch("https://restcountries.eu/rest/v2/all")
      .then((response) => response.json())
      .then((jsondata) => {
        sessionStorage.setItem("countries", JSON.stringify(jsondata));
        data = jsondata;
        assembleCards(data);
      });
  }
}

// function that mounts cards in the HTML.If min and max are not specified, will transform the entire
// array data in cards
function assembleCards(cards, min = 0, max = data.length) {
  // empty the div before put something
  cardsDiv.innerHTML = "";
  cards.slice(min, max).forEach((current) => {
    let { name, capital, region, flag, population } = current;
    // separate the number in thousands
    population = population.toLocaleString("pt-BR");
    cardsDiv.innerHTML += `
        <div class="main__card">
          <a href="detail.html?=${name}">
          <img alt="country ${name}" src="${flag}"/>
          <div class="main__legend">
            <h3>${name}</h3>
            <ul>
              <li><p>Population:</p><p>${population}</p></li>
              <li><p>Region:</p><p>${region}</p> </li>
              <li><p>Capital:</p><p>${capital}</p> </li>
            </ul>
          </div>
          </a>
        </div>
      `;
  });
}

// call the function that will initialize the page with the data.
initCards();
