const apiKey = '3';
const apiUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4332&s=2021-2022`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Filter for AC Milan matches
        const acMilanMatches = data.events.filter(match => 
            match.strHomeTeam === 'Milan' || match.strAwayTeam === 'Milan'
        );
        console.log(data);
        console.log(acMilanMatches);
        // You can now visualize or further process this data
    })
    .catch(error => console.error('Error fetching match data:', error));