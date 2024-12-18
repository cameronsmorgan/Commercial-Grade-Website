
let percent = document.querySelector('.percent');
let progress = document.querySelector('.progress');
let count = 4;
let per = 16;    //width of progress bar
let loadingInterval;


/*-->sets an interval to execute the function every 50 milliseconds */
const startLoading = () => {
    loadingInterval = setInterval(() => {
        if (count < 100) {
            per += 3;   //increase the width of progress bar
            count += 1; //increment percentage
            progress.style.width = `${per}px`;
            percent.textContent = `${count}%`;
        } else {
            clearInterval(loadingInterval);
            
            percent.classList.add('text-blink');
        }
    }, 50); 
};


const stopLoading = () => {
    clearInterval(loadingInterval);

    progress.style.width = '400px';
    percent.textContent = '100%';
    percent.classList.add('text-blink');
   
    setTimeout(() => {
        document.querySelector('.loading').style.display = 'none';
    }, 500);
};

const fetchStandings = async () => {
    const url = 'https://sofascore.p.rapidapi.com/teams/get-player-statistics?teamId=2692&tournamentId=23&seasonId=52760&type=overall';
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
        console.log(result); 

        /*--> find methods searches for a matching player in the different arrays
          --> for each player a new object is created containng name, rating, goals, assists, red cards or 0 */
        
        let playerData = result.topPlayers.rating.map(player => {
        
        let playerGoalsData = result.topPlayers.goals.find(g => g.player.name === player.player.name) || {};
        let playerAssistsData = result.topPlayers.assists.find(a => a.player.name === player.player.name) || {};
        let playerRedCardsData = result.topPlayers.redCards.find(r => r.player.name === player.player.name) || {};

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
        stopLoading();

    } catch (error) {
        console.error('Error getting  data:', error);
        stopLoading();

    }
};

const createHeatmap = (playerData) => {
   

    //CREATE SVG
    let margin = { top: 50, right: 50, bottom: 50, left: 50 };
    let width = 800 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;


    let svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    

    //CREATE SCALES
    //scaleThreshold maps input vlaues to a range 
    let colorScale = d3.scaleThreshold()
        .domain([6.00, 6.50, 7.00, 8.00])
        .range(["#FF7F0E", "#FFBB78", "#FFD700", "#28A745"]);  // orange, yellow, green

//CREATE FILTER
    let updateHeatmap = (sortedData, selectedStat = "rating") => {

        let rects = svg.selectAll("rect")
        .data(sortedData, d => d.name);

        rects.enter()
        .append("rect")
        .merge(rects)     //combines new rectangles with existing ones if needed
        .attr("x", (d, i) => i * (width / playerData.length)) //horizontal position is based on players index
        .attr("y", 0)
        .attr("width", width / playerData.length - 2)  // Set width and spacing
        .attr("height", height)
        .attr("fill", d => colorScale(d.rating))

        /*-->swtich statement selects the chosen statistic  */
        .on("mouseover", function (event, d) {
            let statValue;
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

    rects.exit().remove(); 
    };

    //TOOLTIP
    let tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");


    updateHeatmap(playerData);

/*-->functionality for the filter
  -->sorts the data and updates the map according to the data */
    d3.select("#stat-filter").on("change", function () {
        let selectedStat = this.value;
        let sortedData = playerData.sort((a, b) => b[selectedStat] - a[selectedStat]); //sorts playerData array based on chosen stat in descending order
        updateHeatmap(sortedData, selectedStat); 
        })
}

startLoading();

fetchStandings();