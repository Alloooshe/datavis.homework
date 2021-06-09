const width = 1000;
const barWidth = 500;
const height = 500;
const margin = 30;

const yearLable = d3.select('#year');
const countryName = d3.select('#country-name');

const barChart = d3.select('#bar-chart')
            .attr('width', barWidth)
            .attr('height', height);

const scatterPlot  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

const lineChart = d3.select('#line-chart')
            .attr('width', width)
            .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let rParam = 'gdp';
let year = '2000';
let param = 'child-mortality';
let lineParam = 'gdp';
let highlighted = '';
let selected;

const x = d3.scaleLinear().range([margin*2, width-margin]);
const y = d3.scaleLinear().range([height-margin, margin]);


const xBar = d3.scaleBand().range([margin*2, barWidth-margin]).padding(0.1);
var yBar = d3.scaleLinear().range([height-margin, margin])

const xAxis = scatterPlot.append('g').attr('transform', `translate(0, ${height-margin})`);
const yAxis = scatterPlot.append('g').attr('transform', `translate(${margin*2}, 0)`);

const xLineAxis = lineChart.append('g').attr('transform', `translate(0, ${height-margin})`);
const yLineAxis = lineChart.append('g').attr('transform', `translate(${margin*2}, 0)`);

const xBarAxis = barChart.append('g').attr('transform', `translate(0, ${height-margin})`);
const yBarAxis = barChart.append('g').attr('transform', `translate(${margin*2}, 0)`);

const colorScale = d3.scaleOrdinal().range(['#DD4949', '#39CDA1', '#FD710C', '#A14BE5']);
const countryScale = d3.scaleOrdinal().range([2*margin,2*margin +barWidth/4  ,2*margin+ barWidth*2/4 ,2*margin+ barWidth*3/4 ]);

const radiusScale = d3.scaleSqrt().range([10, 30]);

loadData().then(data => {

    colorScale.domain(d3.set(data.map(d=>d.region)).values());
    countryScale.domain(d3.set(data.map(d=>d.region)).values());

    d3.select('#range').on('change', function(){ 
        year = d3.select(this).property('value');
        yearLable.html(year);
        updateScattePlot();
        updateBar();
    });

    d3.select('#radius').on('change', function(){ 
        rParam = d3.select(this).property('value');
        updateScattePlot();
    });

    d3.select('#x').on('change', function(){ 
        xParam = d3.select(this).property('value');
        
        updateScattePlot();
    });

    d3.select('#y').on('change', function(){ 
        yParam = d3.select(this).property('value');
        updateScattePlot();
    });

    d3.select('#param').on('change', function(){ 
        param = d3.select(this).property('value');
        
        updateBar();
    });
    d3.select('#p').on('change', function(){ 
        lineParam = d3.select(this).property('value');
        updateLineChart();
    });
  
  
    function updateBar(){
       
        lst_region = d3.set(data.map(d=>d.region)).values(); 
        
        xBarAxis.call(d3.axisBottom(countryScale) );
        yBarAxis.call(d3.axisLeft(yBar));


        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        var data_D = []
        lst_region.forEach(k => {
            data_k = data.filter(d=>d.region ===k ) ; 
            console.log(param);
            values_k = data_k.map(d => parseInt(d[param][year])||0);
            let D = {};
            D["region"] = k

            D["avg"] = average(values_k);
            data_D.push(D) ; 
        });
        // console.log(d3.extent(data_D.map(d=>d.avg)));
        yBar.domain(d3.extent(data_D.map(d=>d.avg)));
        // console.log(data_D);
        // console.log(d3.extent(data_D.map(d=>d.avg)));
        
        d3.selectAll('rect').remove();
        var bars = barChart.selectAll("bar").data(data_D);
        
     
        bars.enter().append("rect")
        .attr("class","mybar")
        .style("fill", d => colorScale(d.region))
        .attr("height", d=> height-yBar(d.avg)) 
        .attr("width", 75) 
        .attr("y",d=>yBar(d.avg)-margin)
        .attr("x",d=> countryScale(d.region))
        .attr("opacity", 0.5)
        .on('mouseover', function(d) {
           
            d3.select(this).attr("opacity", 1);
            })
        .on('mouseout', function(d) {
            d3.select(this).attr("opacity", 0.5);
            })
        .on('click', function(d) {
            d3.select(this).attr("opacity", 1);
            highlighted = d.region;
            console.log(highlighted);
            updateScattePlot();
                })
        .on("contextmenu", function (d) {
            d3.select(this).attr("opacity", 0.5);
            highlighted= "";
            updateScattePlot();
            d3.event.preventDefault();
                });

                iXbuABpiJT0kLP95SLre4Z7XmchGcouCmJlECda4b0LAKmNpcR
      
                G4ekUg9WXCQrpTskcESmvnDFq
        
        return;
    }
    const yearScale =d3.scaleLinear().domain([1800,2019]).range([margin*2, width-margin]);
    const yLine = d3.scaleLinear().range([height-margin, margin]);

    function updateLineChart() {
        d3.select('#line-selector').style("display","inline");
        countryName.html(selected.country)
        selected_data = selected[lineParam]; 
        
        var data_line = []
        Object.keys(selected_data).forEach(k => {
            let D = {};
            D["date"] = parseInt(k)||0;
            D["value"] = parseFloat(selected_data[k])||0 ;
            if(D["date"] >0){
                data_line.push(D) ;
            }
             
        });
        yLine.domain(d3.extent(data_line.map(d=>d.value)));

        xLineAxis.call(d3.axisBottom(yearScale));
        yLineAxis.call(d3.axisLeft(y)) ; 
        d3.selectAll('path').remove();

        console.log(data_line);

        var line =lineChart.append("path")
        .datum(data_line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d=> yearScale(d["date"]) )
          .y(d=>yLine(d["value"]) )
          )

    }

    function updateScattePlot(){
        x.domain(d3.extent(data.map(d=> parseFloat(d[xParam][year])||0 ) ) );
        y.domain(d3.extent(data.map(d=> parseFloat(d[yParam][year])||0 ) ) );
        radiusScale.domain(d3.extent(data.map(d=>parseFloat(d[rParam][year])||0 ) ) );
        
        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));
        data_reduced = data ; 
        if (highlighted) {
            console.log(highlighted)
            data_reduced =  data.filter(d=>d.region == highlighted );
            d3.selectAll('circle').remove();
        }

        
        var circles = scatterPlot.selectAll('circle').data(data_reduced) ;
        circles.enter().append('circle')
        .attr('cx', width * 0.5 )
        .attr('cy', height * 0.5)
        .attr('fill', d => colorScale(d.region))
        .attr('r',   d => radiusScale(d[rParam][year]) )
        .on('click', function(d){

            d3.selectAll("circle").style("stroke", "black").attr("stroke-width",1);

            d3.select(this).style("stroke", "black")
            .attr("stroke-width",5);
            selected = d;
            console.log(d);
            updateLineChart();
        });
        
        
        
        var circles = scatterPlot.selectAll('circle').data(data_reduced) ;
        circles.enter().append('circle')
        .attr('cx', width * 0.5 )
        .attr('cy', height * 0.5)
        .attr('fill', d => colorScale(d.region))
        .attr('r',   d => radiusScale(d[rParam][year]) )
        .on('click', function(d){
            d3.selectAll("circle").style("stroke", "black").attr("stroke-width",1);
            d3.select(this).style("stroke", "black")
            .attr("stroke-width",5);
            selected = d;
          
            updateLineChart();
            
        });
      

    
        circles.transition()
        .ease(d3.easeQuad)
        .duration(3000)
        .attr('r',  d => radiusScale(d[rParam][year]) )
        .attr('cx', d => x(parseInt(d[xParam][year])||0) )
        .attr('cy', d => y(parseInt(d[yParam][year])||0) );

        

        return;
    }

    updateBar();
    updateScattePlot();
});


async function loadData() {
    const data = { 
        'population': await d3.csv('https://alloooshe.github.io/datavis.homework/data/population.csv'),
        'gdp': await d3.csv('https://alloooshe.github.io/datavis.homework/data/gdp.csv'),
        'child-mortality': await d3.csv('https://alloooshe.github.io/datavis.homework/data/cmu5.csv'),
        'life-expectancy': await d3.csv('https://alloooshe.github.io/datavis.homework/data/life_expectancy.csv'),
        'fertility-rate': await d3.csv('https://alloooshe.github.io/datavis.homework/data/fertility-rate.csv')
    };
    
    return data.population.map(d=>{
        const index = data.gdp.findIndex(item => item.geo == d.geo);
        return  {
            country: d.country,
            geo: d.geo,
            region: d.region,
            population: d,
            'gdp': data['gdp'][index],
            'child-mortality': data['child-mortality'][index],
            'life-expectancy': data['life-expectancy'][index],
            'fertility-rate': data['fertility-rate'][index]
        }
    })
}