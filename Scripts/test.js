const fetchStandings = async () => {
    const url = 'https://sofascore.p.rapidapi.com/tournaments/get-standings?tournamentId=23&seasonId=37475&type=total';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '6ed0a534c9mshb4ce6150cf50aa4p1b036bjsnf2a0146c6be0',
            'x-rapidapi-host': 'sofascore.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON
        const result = await response.json();

        // Output the entire result object to the console
        console.log(result);

        // Optionally, output specific data, for example standings
        if (result && result.standings) {
            console.log('Standings:', result.standings);
        } else {
            console.log('No standings data found.');
        }
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
};

// Call the function to execute it
fetchStandings();
