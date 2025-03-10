function fetchCountryInfo() {
    // Get the input value entered by the user
    const countryInput = document.getElementById('countryInput').value;
    const countryInfoSection = document.getElementById('countryInfo');
    const borderingCountriesSection = document.getElementById('borderingCountries');
    const errorMessageSection = document.getElementById('errorMessage');

    // Clear previous content before making a new request
    countryInfoSection.innerHTML = '';
    borderingCountriesSection.innerHTML = '';
    errorMessageSection.textContent = '';

    // Validate user input (ensure it's not empty)
    if (countryInput.trim() === '') {
        displayError('Please enter a country name.');
        return;
    }

    // Fetch country data from the API based on user input
    fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
        .then(response => response.json()) // Convert response to JSON format
        .then(data => {
            if (data.status === 404) {
                // Display an error message if the country is not found
                displayError('Country not found. Please enter a valid country name.');
            } else {
                // Display country information
                displayCountryInfo(data[0]);
                
                // Fetch bordering countries if they exist
                fetchBorderingCountries(data[0].borders);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the API request
            displayError('Error fetching data from the API. Please try again.');
            console.error(error);
        });
}

function fetchBorderingCountries(borders) {
    const borderingCountriesSection = document.getElementById('borderingCountries');
    borderingCountriesSection.innerHTML = '<strong>Bordering Countries:</strong>';

    if (!borders || borders.length === 0) {
        // If no bordering countries exist, display a message
        borderingCountriesSection.innerHTML += '<p>No bordering countries found.</p>';
        return;
    }

    // Fetch details of each bordering country using its country code
    borders.forEach(border => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then(response => response.json()) // Convert response to JSON
            .then(data => {
                const countryName = data[0].name.common; // Get the country's name
                const flag = data[0].flags.png; // Get the country's flag image URL

                // Create an image element for the flag
                const imgElement = document.createElement('img');
                imgElement.src = flag;
                imgElement.alt = countryName;

                // Append country name and flag inside a section
                borderingCountriesSection.innerHTML += `<section>${countryName} ${imgElement.outerHTML}</section>`;
            })
            .catch(error => {
                console.error(error); // Log any errors encountered
            });
    });
}

function displayCountryInfo(country) {
    // Get the section element where country info should be displayed
    const countryInfoSection = document.getElementById('countryInfo');

    // Populate the section with country details
    countryInfoSection.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.png}" alt="${country.name.common} Flag">
    `;
}

function displayError(message) {
    // Get the section element for displaying error messages
    const errorMessageSection = document.getElementById('errorMessage');

    // Display the error message
    errorMessageSection.textContent = message;
}
