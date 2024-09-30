const fetchStandings = async () => {
    const url = 'https://sofascore.p.rapidapi.com/teams/get-player-statistics?teamId=2692&tournamentId=23&seasonId=67959&type=overall';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '6ed0a534c9mshb4ce6150cf50aa4p1b036bjsnf2a0146c6be0',
            'x-rapidapi-host': 'sofascore.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result); // Check the fetched data

        // Extract player data from the response
        const playerData = result.statistics.topPlayers.rating.map(player => ({
            name: player.player.name,
            rating: player.statistics.rating
        }));

        createHeatmap(playerData);
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
};