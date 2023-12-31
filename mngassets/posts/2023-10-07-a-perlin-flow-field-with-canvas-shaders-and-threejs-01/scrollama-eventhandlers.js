
//REMEMBER we are using d3.js to handle the DOM

//TODO:
//- make this an exportable object so it can be updated in scrollama-setup or any other script as required

//function updateSizeStepElements(){
//}

//function updateSizeCanvas(){
//}

// function update() {
// }

// scrollama event handlers
// function handleStepEnter(response) {
// }

//E: RELEVANT - it is a different library to stick the menu; scrollama doesn't handle this!
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        //Stickyfill.add(this);
    });
};

function setupCharts(){
    return svg, chart, item = d3setup.chart("figure");
};

export let eventHandlers = {
    step : null,
    container: null,
    updateSizeStepElements : function(){
        //1. update height of step elements
        let stepH = Math.floor(window.innerHeight * 0.75);
        this.step.style('height', stepH + 'px');
        let figureHeight = window.innerHeight / 2;       
        let figureMarginTop = (window.innerHeight - figureHeight) / 2;  
        this.container
            .style('top', figureMarginTop + 'px');
        },
    width: null,
    height : null,
    baseCanvas: null,
    baseContext: null,
    hairs: null,
    passed: false,
    updateSizeCanvas : function(){
            /*TODO:
            - perlinCanvas to be added
            - also Three.js renderer
            */
            let containerNode = this.container.node();
            let width = this.baseCanvas.width = containerNode.offsetWidth;
            let height =  200;
            this.baseContext.fillRect(0, 0, width, height); 
            this.baseContext.fill();
        },
    updateCanvasBackground : function(){
        //this.baseContext.rect(0,0,500,200);
        //this.baseContext.fillStyle = "#f3f3f3";
        //this.baseContext.fill();
    },
    handleStepEnter01 : function(response){
        // response = { element, direction, index }

        /*
        ~~~~~~~~~~~~ OBSERVATION ~~~~~~~~~~~~~~
        E: baseContext and updateCanvasBackground had to be brought to scope
        they both will be called by a super-function that doesn't have those two in their inheritance hierarchy
        while they are called from a global-scope functionality (Tweenlite) that is called from a local function (this one, handleStepEnter01)
        which is then called from the event handler of the scrollama (!!!!)
        The worst placed is updateCanvasBackground
        So before calling it, I had to bind the scope of this object, eventHandlers
        
        If not asserting to capture the right scope, the variables/arguments of the functions (eg. step, baseContext) come as null

        It is working. However, I am passing copies to tweenToRamdomColor instead. 
        
        Is there a better solution? Probably bringing out the tweenToRamdomColor function to an upper scope?
        Another way to define the variables?
        */

        this.step.classed('is-active', function (d, i) { return i === response.index; });

        const baseContext = this.baseContext;
        const updateCanvasBackground = this.updateCanvasBackground.bind(this, this.baseContext);
        
        
        
        //E - from https://codepen.io/GreenSock/pen/bGbQwo
        //baseContext.fillStyle = `#${response.index}${response.index}${response.index}`;
        if(response.index === 0){
            this.baseContext.clearRect(0,0,this.width,this.height);
            function tweenToRandomColor() {
                TweenLite.to(
                        baseContext, 
                        1, 
                        {
                            colorProps:{
                                //fillStyle: `#${response.index}0${response.index*2}0${response.index*2}0`,
                                fillStyle: "#404040",
                                strokeStyle: "#404040"
                            }, 
                            onUpdate: updateCanvasBackground, 
                        //onComplete:tweenToRandomColor
                        });
            }        
            tweenToRandomColor();

        }
        if(response.index === 1){
            //this.baseContext.rect(0,0,500,200);
            //this.baseContext.fillStyle = "#404040";
            //this.baseContext.fill();
            //this.baseContext.strokeStyle = "#0000aa";
            function tweenToRandomColor02() {
                TweenLite.to(
                        baseContext, 
                        1, 
                        {
                            colorProps:{
                                //fillStyle: `#${response.index}0${response.index*2}0${response.index*2}0`,
                                //strokeStyle: "#AAAAFF",
                            }, 
                            onUpdate: updateCanvasBackground, 
                        //onComplete:tweenToRandomColor
                        });
            }
            this.baseContext.strokeStyle = "#fff";
            tweenToRandomColor02(); 
        }
        if(response.index === 2){
            this.baseContext.beginPath();
            //console.log("hair", this.hairs[0].draw());
            //this.hairs.map(hair => hair.draw());
            let first10Hairs = this.hairs.slice(0, 10);
            first10Hairs.map(hair => hair.draw());
            this.baseContext.strokeStyle = "#AAAAFF";
            //this.baseContext.stroke();
        }
        if(response.index === 4){
            let remainingHairs = this.hairs.slice(9);
            //remainingHairs.map(hair => hair.draw());
            function delay(i){
                setTimeout(()=>{remainingHairs[i].draw()}, i/2.);
            }
            this.passed = true;
            for(let i = 0; i < remainingHairs.length; i++){
                delay(i);
            }
            this.baseContext.strokeStyle = "#AAAAFF";
        }
    }
}