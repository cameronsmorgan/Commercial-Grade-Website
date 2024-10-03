console.log('js loaded');

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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();

        if (result && result.standings && result.standings[0] && result.standings[0].rows) {
            const teamsData = result.standings[0].rows.map((team, index) => ({
                name: team.team.name,
                points: team.points,
                rank: index + 1
            }));

            // Create the bubble chart with the fetched data
            createBubbleChart(teamsData);
        } else {
            console.log('No standings data found.');
        }
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
};


// Create a heatmap using D3.js
const createBubbleChart = (data) => {
    const width = 800;
    const height = 600;
    const sectionWidth = width / 2;
    const sectionHeight = height / 2;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add section labels
    svg.append("text")
        .attr("x", sectionWidth / 2)
        .attr("y", 20)
        .attr("class", "section-title")
        .text("Top 4 Teams");

    svg.append("text")
        .attr("x", 3 * sectionWidth / 2)
        .attr("y", 20)
        .attr("class", "section-title")
        .text("5th - 7th Place");

    svg.append("text")
        .attr("x", sectionWidth / 2)
        .attr("y", height - 20)
        .attr("class", "section-title")
        .text("Mid-table Teams");

    svg.append("text")
        .attr("x", 3 * sectionWidth / 2)
        .attr("y", height - 20)
        .attr("class", "section-title")
        .text("Bottom 3 Teams");

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.points)])
        .range([10, 50]);

    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("collision", d3.forceCollide(d => radiusScale(d.points) + 2))
        .on("tick", ticked);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const bubbles = svg.selectAll(".bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => radiusScale(d.points))
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.name + "<br/>Points: " + d.points)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    function ticked() {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    // Function to split bubbles into four sections based on rank
    const splitBubbles = () => {
        simulation
            .force("x", d3.forceX(d => {
                if (d.rank <= 4) {
                    return sectionWidth / 2; // Top 4 teams (Left Top)
                } else if (d.rank >= 5 && d.rank <= 7) {
                    return 3 * sectionWidth / 2; // 5th - 7th placed teams (Right Top)
                } else if (d.rank >= 18) {
                    return 3 * sectionWidth / 2; // Bottom 3 teams (Right Bottom)
                } else {
                    return sectionWidth / 2; // Mid-table teams (Left Bottom)
                }
            }).strength(0.1))
            .force("y", d3.forceY(d => {
                if (d.rank <= 4) {
                    return sectionHeight / 2; // Top 4 teams (Top Section)
                } else if (d.rank >= 5 && d.rank <= 7) {
                    return sectionHeight / 2; // 5th - 7th placed teams (Top Section)
                } else if (d.rank >= 18) {
                    return 3 * sectionHeight / 2; // Bottom 3 teams (Bottom Section)
                } else {
                    return 3 * sectionHeight / 2; // Mid-table teams (Bottom Section)
                }
            }).strength(0.1))
            .alpha(0.5) // Reheat the simulation
            .restart();
    };

    // Function to reset bubbles back to combined in the center
    const resetBubbles = () => {
        simulation
            .force("x", d3.forceX(width / 2).strength(0.05)) // Reset to center
            .force("y", d3.forceY(height / 2).strength(0.05)) // Reset to center
            .alpha(0.5) // Reheat the simulation
            .restart();
    };

    // Attach the splitBubbles function to the "Split Bubbles" button
    d3.select("#splitButton").on("click", splitBubbles);

    // Attach the resetBubbles function to the "Reset/Combine Bubbles" button
    d3.select("#resetButton").on("click", resetBubbles);
};

// Fetch the standings and create the chart
fetchStandings();