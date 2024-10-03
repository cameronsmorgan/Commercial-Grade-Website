const fetchStandings = async () => {
    const url = 'https://sofascore.p.rapidapi.com/teams/get-player-statistics?teamId=2692&tournamentId=23&seasonId=52760&type=overall';
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
        const playerData = result.topPlayers.rating.map(player => {
        // Find the corresponding statistics object in the goals array
        const playerGoalsData = result.topPlayers.goals.find(g => g.player.name === player.player.name) || {};
        const playerAssistsData = result.topPlayers.assists.find(a => a.player.name === player.player.name) || {};
        const playerRedCardsData = result.topPlayers.redCards.find(r => r.player.name === player.player.name) || {};

        return {
            name: player.player.name,
            rating: player.statistics.rating,
            goals: playerGoalsData.statistics ? playerGoalsData.statistics.goals : 0,
            assists: playerAssistsData.statistics ? playerAssistsData.statistics.assists : 0,
            redCards: playerRedCardsData.statistics ? playerRedCardsData.statistics.redCards : 0,
        };
    });

        console.log(playerData);

        createHeatmap(playerData);
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
};

const createHeatmap = (playerData) => {
    // Set dimensions and margins for the heatmap
    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the div
    const svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip div
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // Define a color scale based on rating ranges
    const colorScale = d3.scaleThreshold()
        .domain([6.00, 6.50, 7.00, 8.00])
        .range(["#FF7F0E", "#FFBB78", "#FFD700", "#28A745"]);  // orange, yellow, green

    // Function to update the heatmap based on selected sorting
    const updateHeatmap = (sortedData, selectedStat = "rating") => {
// Bind new data and update rectangles
const rects = svg.selectAll("rect")
.data(sortedData, d => d.name);

rects.enter()
.append("rect")
.merge(rects)
.attr("x", (d, i) => i * (width / playerData.length))
.attr("y", 0)
.attr("width", width / playerData.length - 2)  // Set width and spacing
.attr("height", height)
.attr("fill", d => colorScale(d.rating))
.on("mouseover", function (event, d) {
    let statValue;

    // Dynamically set the statistic to display in the tooltip
    switch (selectedStat) {
        case "goals":
            statValue = `Goals: ${d.goals}`;
            break;
        case "assists":
            statValue = `Assists: ${d.assists}`;
            break;
        case "redCards":
            statValue = `Red Cards: ${d.redCards}`;
            break;
        default:
            statValue = `Rating: ${d.rating}`;
            break;
    }

    tooltip
        .style("opacity", 1)
        .html(`<strong>${d.name}</strong><br>${statValue}`)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 30}px`);
})
.on("mousemove", function (event) {
    tooltip
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 30}px`);
})
.on("mouseout", function () {
    tooltip.style("opacity", 0);
});

rects.exit().remove();  // Remove any old rectangles
};

// Initial render with default sorting by rating
updateHeatmap(playerData);

// Dropdown change event for sorting by selected statistic
d3.select("#stat-filter").on("change", function () {
const selectedStat = this.value;
const sortedData = playerData.sort((a, b) => b[selectedStat] - a[selectedStat]);
updateHeatmap(sortedData, selectedStat); // Pass the selected stat to updateHeatmap
})
};

// Call the function to fetch player data and render the heatmap
fetchStandings();