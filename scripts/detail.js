var divCard = document.getElementsByClassName("main")[0];
var data = []


// the countryName will always be received through the navigator URL

function findCountry(countryName) {
  //checks if the data already are in the sessionStorage
    
  if (sessionStorage.length) {
    data = JSON.parse(sessionStorage.getItem("countries"));
    // calls the function that mounts the card of the country with the object that contains
    // the informations about the country
    assembleCardDetail(
      data.find((current) => {
        return current.name === countryName;
      })
    );
  } else {
    fetch(`https://restcountries.eu/rest/v2/all`)
      .then((response) => response.json())
      .then((jsondata) => {
        // fetch the data, put it in the sessionStorage and in the data variable
        // the data variable exists to be manipulated by the routines of the script
        // sessionStorage is used so you don't have to apply fetch everytime
        data = jsondata
        sessionStorage.setItem("countries",JSON.stringify(jsondata))
        let country = jsondata.find((current)=> current.name === countryName)
        assembleCardDetail(country);
      });
  }
}


// function that receives a country object and assemble the corresponding HTML
function assembleCardDetail(country) {
  // The object is destructured  
    let {
    name,
    capital,
    flag,
    population,
    region,
    subregion,
    nativeName,
    topLevelDomain,
    languages,
    currencies,
    borders,
  } = country;

  // the fields of the object are formatted
  population = population.toLocaleString("pt-BR");

  languages = languages.map((current) => current.name);
  currencies = currencies[0].name;
  topLevelDomain = topLevelDomain[0];

  // here we have to look in the data and find the corresponding border name countries - border alpha3Code pairs
  borders = borders
    .map(
      (current) =>{
        data.forEach((country)=>{
            if( country.alpha3Code === current)
                current = country.name
        })
        return `<a href="detail.html?=${current}"><div class="button">${current}</div></a>`
      }
        
    )
    .join("");

    // the HTML is mounted
  divCard.innerHTML = `
        <div class="detail-container">
            <img alt="${name} flag" src="${flag}"/>
            <div>
            <div class="detail-legend">
                <h1>${name}</h1>
                <ul>
                    <li>
                        <p>Native Name: </p>
                        <p> ${nativeName}</p>
                    </li>
                    <li>
                        <p>Population: </p>
                        <p>${population}</p>
                    </li>
                    <li>
                        <p>Region: </p>
                        <p> ${region}</p>
                    </li>
                    <li>
                        <p>Sub Region: </p>
                        <p> ${subregion}</p>
                    </li>
                    <li>
                        <p>Capital: </p>
                        <p> ${capital}</p>
                    </li>
                </ul>
                
                <ul>
                     <li>
                        <p>Top Level Domain: </p>
                        <p>${topLevelDomain}</p>
                    </li>
                    <li>
                        <p>Currencies: </p>
                        <p>${currencies}</p>
                    </li>
                    <li>
                        <p>Languages: </p>
                        <p> ${languages}</p>
                    </li>
                </ul>
            </div>
            
              <div class="border-countries">
                    <h3>Border Countries:</h3>
              <div class="grid-border-countries"> 
                    ${borders}
              </div>
            </div>
            </div>
        </div>
    `;
}

// the function that initialize the page with the country name received in the URL

findCountry(decodeURIComponent(window.location.href.split("=")[1]));


