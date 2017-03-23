$(function(){ // On document ready

    PG.fillInputs();
    PG.registerListeners();
    PG.initBoard();

});

// Variable to namespace prettyGraph functions
var PG = {
    tmp: {},
    // CHeck for stored variables, otherwise set some defaults
    vars: localStorage['PGvars'] ? localStorage['PGvars'] : {
        'boardWidth': 350,
        'boardHeight': 350,
        'bounds': [-5, 5, -5, 5],
        'xLabel' : '$x$',
        'yLabel' : '$y$',
        'ticksDistance' : [2, 2],
        'minorTicks' : [1, 1]
    },
    board: ""
};

// Function to fill in input boxes based on PG.vars
// TODO: Fill in the rest of these
PG.fillInputs = function(){
    // Box sizes
    $("#graphWidth").val(PG.vars.boardWidth);
    $("#graphHeight").val(PG.vars.boardHeight);
}


// Function that registers event listeners to input boxes
PG.registerListeners = function(){
    $(".graphSize").on('change', PG.changeGraphSize);
}


/* ---------------------------------------
------- Functions to change graph -------
--------------------------------------- */
PG.changeGraphSize = function(){
    console.log('changed size');
    PG.vars.boardWidth = parseFloat($("#graphWidth").val());
    PG.vars.boardHeight = parseFloat($("#graphHeight").val());
    $("#box").css({
        'width': PG.vars.boardWidth,
        'height': PG.vars.boardHeight
    });
    PG.board.resizeContainer(PG.vars.boardWidth, PG.vars.boardHeight);
}




PG.initBoard = function(){
    // Get some variables

    // Set width/height of box
    $("#box").css({
        'width': PG.vars.boardWidth,
        'height': PG.vars.boardHeight
    });

    // Construct Board
    PG.board = JXG.JSXGraph.initBoard('box', {
        boundingBox: [PG.vars.bounds[0], PG.vars.bounds[3], PG.vars.bounds[1], PG.vars.bounds[2]],
        axis: false,
        showCopyright: false,
        pan: {enabled: true},
        showNavigation: false
    });

    // Build x-axis, strip ticks, re-define ticks
    // TODO: EVENTUALLY NEED TO BUILD PI-TICKS INTO THIS AS AN OPTION
    PG.tmp.xaxis = PG.board.create('axis', [[0,0], [1,0]], {
        strokeColor: 'black',
        strokeWidth: 2,
        highlight:false,
        name: PG.vars.xLabel,
        withLabel: true,
        label: {position:'rt', offset:[-10,15], highlight:false, useMathJax:true}
    });
    PG.tmp.xaxis.removeAllTicks();
    PG.board.create('ticks', [PG.tmp.xaxis], {
      ticksDistance: PG.vars.ticksDistance[0],
      strokeColor: 'rgba(150,150,150,0.85)',
      majorHeight: -1,
      minorHeight: -1,
      highlight:false,
      drawLabels: true,
      label: {offset:[0,-5], anchorY:'top', anchorX:'middle', highlight:false},
      minorTicks: PG.vars.minorTicks[0]
    });

    // Build y-axis, strip ticks, re-define ticks
    PG.tmp.yaxis = PG.board.create('axis', [[0,0], [0,1]], {
        strokeColor: 'black',
        strokeWidth: 2,
        highlight:false,
        name: PG.vars.yLabel,
        withLabel: true,
        label: {position:'rt', offset:[10,-10], highlight:false, useMathJax:true}
    });
    PG.tmp.yaxis.removeAllTicks();
    PG.board.create('ticks', [PG.tmp.yaxis], {
      ticksDistance: PG.vars.ticksDistance[1],
      strokeColor: 'rgba(150,150,150,0.85)',
      majorHeight: -1,
      minorHeight: -1,
      highlight:false,
      drawLabels: true,
      label: {offset:[-5,0], anchorY:'middle', anchorX:'right', highlight:false},
      minorTicks: PG.vars.minorTicks[1]
    });
}


// Configuration Options for JSXGraph
JXG.Options.layer = {numlayers: 20, text: 9, point: 9, glider: 9, arc: 8, line: 7, circle: 6,
          curve: 5, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 3, ticks: 2, grid: 1, image: 0, trace: 0};
JXG.Options.text.fontSize = 18;
