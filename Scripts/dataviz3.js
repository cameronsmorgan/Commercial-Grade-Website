console.log('loaded');
let percent = document.querySelector('.percent');
let progress = document.querySelector('.progress');
let count = 4;
let per = 16;
let loadingInterval;

const startLoading = () => {
    loadingInterval = setInterval(() => {
        if (count < 100) {
            per += 3.5; // Increment width by 4px
            count += 1; // Increment percentage by 1%
            progress.style.width = `${per}px`;
            percent.textContent = `${count}%`;
        } else {
            clearInterval(loadingInterval);
            // Optionally add blink effect when loading completes
            percent.classList.add('text-blink');
        }
    }, 50); // Adjust the interval as needed
};


const stopLoading = () => {
    clearInterval(loadingInterval);
    // Ensure progress bar is full
    progress.style.width = '400px';
    percent.textContent = '100%';
    percent.classList.add('text-blink');
    // Hide the loading screen after a short delay for visual effect
    setTimeout(() => {
        document.querySelector('.loading').style.display = 'none';
    }, 500);
};

let teamStats = {};

const getTeamData = async (teamId, teamKey) => {
    const url = `https://sofascore.p.rapidapi.com/teams/get-statistics?teamId=${teamId}&tournamentId=23&seasonId=52760&type=overall`;    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '954e29bdcfmshd0c282e26d0038dp14dccfjsne4ee2b04831f',
            'x-rapidapi-host': 'sofascore.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        /*-> After we get the result, we save the stats we want in the teamStats object and the key organises it according to the different teams */
        teamStats[teamKey] = {
            attacking: {
                accuratePassPercentage: result.statistics.accuratePassesPercentage,
                goalsScored: result.statistics.goalsScored,
                averageBallPossession: result.statistics.averageBallPossession
            },
            defensive: {
                groundDuelsWonPercentage: result.statistics.groundDuelsWonPercentage,
                aerialDuelsWonPercentage: result.statistics.aerialDuelsWonPercentage,
                cleanSheets: result.statistics.cleanSheets
            }
        };
    } catch (error) {
        console.error(error);
        stopLoading();

    }
};

/*Call getTeamData function for each team and pass the teamid and teamKey */
const fetchTeamsData = async () => {
    await getTeamData(2692, 'acMilan');       
    await getTeamData(2697, 'interMilan');    
    await getTeamData(2687, 'juventus');      
    await getTeamData(2686, 'atalanta');      

    formatDataAndCreateChart();
    stopLoading();

};

/* ->Creates an array of objects for each statistic in a way for radar chart to be created.
   -> Each axis is a chart label and each value is a data point on that label
   -> The same is done for the optional team
   -> This structure is important for radar charts because each statistic is displayed on its own axis*/

const formatDataAndCreateChart = (compareTeam = null) => {
    const acMilanData = [
        { axis: 'Accurate Pass Percentage', value: teamStats.acMilan.attacking.accuratePassPercentage },
        { axis: 'Goals Scored', value: teamStats.acMilan.attacking.goalsScored },
        { axis: 'Average Ball Possession', value: teamStats.acMilan.attacking.averageBallPossession },
        { axis: 'Ground Duels Won Percentage', value: teamStats.acMilan.defensive.groundDuelsWonPercentage },
        { axis: 'Aerial Duels Won Percentage', value: teamStats.acMilan.defensive.aerialDuelsWonPercentage },
        { axis: 'Clean Sheets', value: teamStats.acMilan.defensive.cleanSheets }
    ];

    let compareData = null;
    if (compareTeam && teamStats[compareTeam]) {
        compareData = [
            { axis: 'Accurate Pass Percentage', value: teamStats[compareTeam].attacking.accuratePassPercentage },
            { axis: 'Goals Scored', value: teamStats[compareTeam].attacking.goalsScored },
            { axis: 'Average Ball Possession', value: teamStats[compareTeam].attacking.averageBallPossession },
            { axis: 'Ground Duels Won Percentage', value: teamStats[compareTeam].defensive.groundDuelsWonPercentage },
            { axis: 'Aerial Duels Won Percentage', value: teamStats[compareTeam].defensive.aerialDuelsWonPercentage },
            { axis: 'Clean Sheets', value: teamStats[compareTeam].defensive.cleanSheets }
        ];
    }

    createRadarChart(acMilanData, compareData);
};

// Radar chart creation function with tooltip
const createRadarChart = (acMilanData, compareData) => {
    d3.select("#milanRadarChart").selectAll("*").remove();  // Clear any existing chart

    const width = 650, height = 500, margin = 50;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;   //how many circles are drawn in the chart
    const maxValue = 100;

    const svg = d3.select("#milanRadarChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`); //centres the svg

    const angleSlice = (Math.PI * 2) / acMilanData.length;  //calculates the angle between each axis based on the number of data points

    const radialScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, radius]);

    for (let level = 1; level <= levels; level++) {   //for loop draws the levels of circles within the chart 
        svg.append("circle")
            .attr("r", (radius / levels) * level)
            .style("fill", "none")
            .style("stroke", "#CDCDCD")
            .style("stroke-opacity", 0.5);
    }

    const axis = svg.selectAll(".axis")
        .data(acMilanData)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")                //Creates an axis line for each data point in AC Milan Data
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radialScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))  //each line extends from the centre and rotates based on angleslice
        .attr("y2", (d, i) => radialScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "white")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("x", (d, i) => radialScale(maxValue * 1.2) * Math.cos(angleSlice * i - Math.PI / 2))  //lables are positioned at the end of each axis point
        .attr("y", (d, i) => radialScale(maxValue * 1.2) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("dy", "0.35em")
        .style("fill", "white") 
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .text(d => d.axis);

    const line = d3.lineRadial()   //defines a radial line that maps each data point to a point on the radar chart
        .radius(d => radialScale(d.value))
        .angle((d, i) => i * angleSlice);

    svg.append("path")
        .datum(acMilanData)
        .attr("d", line)
        .style("fill", "rgba(255, 0, 0, 0.3)")   //color needs to be a bit transparent to see the concentric levels
        .style("stroke", "rgba(255, 0, 0, 1)")
        .style("stroke-width", 2);

    if (compareData) {
        svg.append("path")
            .datum(compareData)
            .attr("d", line)
            .style("fill", "rgba(0, 0, 255, 0.3)")  //drawn in blue to create contrast
            .style("stroke", "rgba(0, 0, 255, 1)")
            .style("stroke-width", 2);
    }

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    // Add data points and tooltip event listeners for AC Milan data
    svg.selectAll(".milan-circle")
        .data(acMilanData)
        .enter()
        .append("circle")
        .attr("class", "milan-circle")
        .attr("r", 5)
        .attr("cx", (d, i) => radialScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => radialScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", "red")
        .on("mouseover", (event, d) => {
            tooltip.transition().style("opacity", 1);
            tooltip.html(`${d.axis}: ${d.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY}px`);
        })
        .on("mouseout", () => tooltip.transition().style("opacity", 0));

    // Add data points and tooltip event listeners for compared data, if present
    if (compareData) {
        svg.selectAll(".compare-circle")
            .data(compareData)
            .enter()
            .append("circle")
            .attr("class", "compare-circle")
            .attr("r", 5)
            .attr("cx", (d, i) => radialScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d, i) => radialScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("fill", "blue")
            .on("mouseover", (event, d) => {
                tooltip.transition().style("opacity", 1);
                tooltip.html(`${d.axis}: ${d.value}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY}px`);
            })
            .on("mouseout", () => tooltip.transition().style("opacity", 0));
    }
};


/*-> this retrieves the team selection option and creates a new chart accordingly */
document.getElementById("teamSelect").addEventListener("change", (e) => {
    formatDataAndCreateChart(e.target.value);
});

startLoading();

fetchTeamsData();