// Function to make a GET request to fetch data from a URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to populate the regions select element
async function populateRegions() {
    const regionSelect = document.getElementById("region-select");
    const regions = await fetchData("https://servicodados.ibge.gov.br/api/v1/localidades/regioes");

    if (regions) {
        regions.forEach(region => {
            const option = document.createElement("option");
            option.value = region.sigla;
            option.textContent = region.nome;
            regionSelect.appendChild(option);
        });
    }
}

// Function to populate the states select element based on the selected region
async function populateStates(selectedRegion) {
    const stateSelect = document.getElementById("state-select");
    stateSelect.innerHTML = ""; 

    const states = await fetchData(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`);

    if (states) {
        const filteredStates = states.filter(state => state.regiao.sigla === selectedRegion);
        filteredStates.forEach(state => {
            const option = document.createElement("option");
            option.value = state.sigla;
            option.textContent = `${state.nome} (${state.sigla})`;
            stateSelect.appendChild(option);
        });
    }
}

// Function to populate the list of cities for a selected state
async function populateCities(selectedState) {
    const cityList = document.getElementById("city-list");
    cityList.innerHTML = ""; 

    const cities = await fetchData(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`);

    if (cities) {
        const cityUL = document.createElement("ul");
        cities.forEach(city => {
            const listItem = document.createElement("li");
            listItem.textContent = city.nome;
            cityUL.appendChild(listItem);
        });
        cityList.appendChild(cityUL);
    }
}

// Event listener for the region select element
const regionSelect = document.getElementById("region-select");
regionSelect.addEventListener("change", () => {
    const selectedRegion = regionSelect.value;
    populateStates(selectedRegion); 
});

// Event listener for the state select element
const stateSelect = document.getElementById("state-select");
stateSelect.addEventListener("change", () => {
    const selectedState = stateSelect.value;
    populateCities(selectedState); 
});


const citySearchInput = document.getElementById("city-search");
const cityList = document.getElementById("city-list");

// Event listener for input changes in the city search field
citySearchInput.addEventListener("input", () => {
    const searchTerm = citySearchInput.value.toLowerCase();
    const cityItems = cityList.querySelectorAll("li");

  
    cityItems.forEach((cityItem) => {
        const cityName = cityItem.textContent.toLowerCase();

      
        if (cityName.includes(searchTerm)) {
            cityItem.style.display = "block"; 
        } else {
            cityItem.style.display = "none"; 
        }
    });
});


cityList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        event.target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
});


populateRegions();
