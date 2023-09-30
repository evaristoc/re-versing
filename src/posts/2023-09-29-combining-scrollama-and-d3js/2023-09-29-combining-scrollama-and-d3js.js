import d3setup from './d3-setup.js';
import {steps} from './d3-steps.js';

window.onload = (event) => {
    // using d3 for convenience
    // E: could have been something like jQuery, etc...
    var main = d3.select('main')
    var scrolly = main.select('#scrolly');
    var figure = scrolly.select('figure');
    var article = scrolly.select('div .articlepost');
    var step = article.selectAll('.step');
    
    // initialize the scrollama
    var scroller = scrollama();

    var svg, chart, item;


    // generic window resize listener event
    function handleResize() {
        
    // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style('height', stepH + 'px');
        var figureHeight = window.innerHeight / 2
        var figureMarginTop = (window.innerHeight - figureHeight) / 2  
        figure
            .style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
        
    // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) { return i === response.index; });
            //console.log('response', response);
            //response.element.querySelector('.explain').style.display = 'inline';
    // update graphic based on step
    let currentIndex = response.index;
    switch(currentIndex){
    case 0:
        steps.step01();
        break;
    case 1:
        steps.step02();
        break;
    case 2:
        steps.step03();
        break;
    default:
        break;
    }
        
    // update graphic based on step
        figure.select('p').text(response.index + 1);
    }

    //E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
    function setupStickyfill() {
        d3.selectAll('.sticky').each(function () {
            //Stickyfill.add(this);
        });
    }

    function setupCharts(){
        return svg, chart, item = d3setup.chart("figure");
    }

    function init() {
        setupStickyfill();
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        let [svg, chart, item] = setupCharts();
        steps.chart = chart;
        steps.minR = d3setup.minR;
        steps.chartSize = d3setup.chartSize;
        steps.scaleR = d3setup.scaleR;
        steps.scaleX = d3setup.scaleX;

        console.log('scaleR' , steps.scaleR);
        console.log('scaleX', steps.scaleX);
    // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        
    // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            step: '#scrolly div.articlepost .step',
            offset: .33,
            //debug: true,
        })
            .onStepEnter(handleStepEnter);
        
    // setup resize event
        window.addEventListener('resize', handleResize);
    
    
    }
    
    // kick things off
    init();
}