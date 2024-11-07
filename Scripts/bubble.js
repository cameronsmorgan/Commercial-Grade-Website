console.log('js loaded');

let percent = document.querySelector('.percent');
let progress = document.querySelector('.progress');
let count = 4;
let per = 16;
let loadingInterval;

const startLoading = () => {
    loadingInterval = setInterval(() => {
        if (count < 100) {
            per += 7; // Increment width by 4px
            count += 2; // Increment percentage by 1%
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


//asynchronous functions can use await to handle promises
const fetchStandings = async () => {
    const url = 'https://sofascore.p.rapidapi.com/tournaments/get-standings?tournamentId=23&seasonId=37475&type=total';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '954e29bdcfmshd0c282e26d0038dp14dccfjsne4ee2b04831f',
            'x-rapidapi-host': 'sofascore.p.rapidapi.com'
        }
    };

    /* -->try statement allows a block of code to run and be tested for errors during execution
       -->catch statement allows code to run IF an error occurs in the try statement*/
    try {  
        const response = await fetch(url, options);  //await pauses the code execution until the promise returned by fetch is accepted or rejected
        if (!response.ok) throw new Error(`http error status: ${response.status}`);
        const result = await response.json();  //parses json data

        /*--> the if statement checks if the result objectand the standings property within exists.
          --> result.standings[0] checks if the first element in the array exists to safeguard against missing data
          --> function extracts required information and places into a new array*/
        if (result && result.standings && result.standings[0]) {
            const teamsData = result.standings[0].rows.map((team, index) => ({
                name: team.team.name,
                points: team.points,
                rank: index + 1
            }));
            console.log(teamsData);

            // Create the bubble chart with the fetched data
            createBubbleChart(teamsData);

            stopLoading();

        } else {
            console.log('No data.');
            stopLoading();

        }
    } catch (error) {
        console.error('Error fetching data:', error);
        stopLoading();

    }
};



const createBubbleChart = (data) => {
    let width = 800;
    let height = 600;
    let sectionWidth = width / 2;
    let sectionHeight = height / 2;

    /*--> CREATE SVG
      --> adds text inside the svg for each section */
    const svg = d3.select("#chart")    
        .append("svg")
        .attr("width", width)
        .attr("height", height);

   
    svg.append("text")
        .attr("x", sectionWidth / 2)     //places it left side and centre
        .attr("y", 20)
        .attr("class", "section-title")
        .text("Top 4 Teams");

    svg.append("text")
        .attr("x", 3 * sectionWidth / 2) //places it on the right
        .attr("y", 20)
        .attr("class", "section-title")
        .text("5th - 7th Place");

    svg.append("text")
        .attr("x", sectionWidth / 2)    //places it left below
        .attr("y", height - 20)
        .attr("class", "section-title")
        .text("Mid-table Teams");

    svg.append("text")
        .attr("x", 3 * sectionWidth / 2)  //places it right below
        .attr("y", height - 20)
        .attr("class", "section-title")
        .text("Bottom 3 Teams");

        /*--> CREATE SCALES 
          --> scale square root useful for sizing circles by area proportionally to the data*/
    let radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(data, d => d.points)])
        .range([5, 50]);

        /* */
    let simulation = d3.forceSimulation(data) //inits force simulation on the data set
        .force("x", d3.forceX(width / 2).strength(0.05)) //horizontal force pulls towards centre of chart according to the strenght
        .force("y", d3.forceY(height / 2).strength(0.05))

        .force("charge", d3.forceManyBody().strength(-50)) //adds a replusive(negative) force between the bubbles to prevent overlap
        .force("collision", d3.forceCollide(d => radiusScale(d.points) + 2)) //the function sets a radius for each bubble based on the points in the data set
        .on("tick", ticked); //updates visual positions of bubbles based on forces applied


        
    const tooltip = d3.select("body").append("div") //adds tooltip + styling
        .attr("class", "tooltip")
        .style("opacity", 0);

        /*--> CREATE BUBBLES
           */
    let bubbles = svg.selectAll(".bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => radiusScale(d.points))
        .attr("fill", "red")
        .attr("stroke", "white")
        .attr("stroke-width","3px")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.name + "<br/>Points: " + d.points)  //tooltip shows team and points
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

    /*--> Sets out the rules to divide the bubbles according to team rank
      --> force applied place bubbles into sections created above */
    const splitBubbles = () => {
        simulation
            .force("x", d3.forceX(d => {
                if (d.rank <= 4) {
                    return sectionWidth / 2; 
                } else if (d.rank >= 5 && d.rank <= 7) {
                    return 3 * sectionWidth / 2;
                } else if (d.rank >= 18) {
                    return 3 * sectionWidth / 2; 
                } else {
                    return sectionWidth / 2;
                }
            }).strength(0.1))
            .force("y", d3.forceY(d => {
                if (d.rank <= 4) {
                    return sectionHeight / 2; 
                } else if (d.rank >= 5 && d.rank <= 7) {
                    return sectionHeight / 2; 
                } else if (d.rank >= 18) {
                    return 3 * sectionHeight / 2;
                } else {
                    return 3 * sectionHeight / 2; 
                }
            }).strength(0.1))
            .alpha(0.5) 
            .restart();
    };

    
    const resetBubbles = () => {
        simulation
            .force("x", d3.forceX(width / 2).strength(0.05)) 
            .force("y", d3.forceY(height / 2).strength(0.05)) 
            .alpha(0.5) 
            .restart();
    };

    
    d3.select("#splitButton").on("click", splitBubbles);

  
    d3.select("#resetButton").on("click", resetBubbles);
};

startLoading();

fetchStandings();