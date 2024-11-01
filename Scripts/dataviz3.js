console.log('loaded');

const getData = async () => {
    const url = 'https://sofascore.p.rapidapi.com/teams/get-statistics?teamId=2692&tournamentId=23&seasonId=52760&type=overall';    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6ed0a534c9mshb4ce6150cf50aa4p1b036bjsnf2a0146c6be0',
		'x-rapidapi-host': 'sofascore.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}
}

getData();