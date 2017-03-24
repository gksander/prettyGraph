// PREPROS APPENDS
//@prepros-prepend PG.js
//@prepros-append listeners.js

$(function(){ // On document ready -- Use this to set up web app

    /* ---------------------------------------
        First, Fill in input boxes
    --------------------------------------- */
    // Box sizes
    $("#graphWidth").val(PG.vars.boardWidth);
    $("#graphHeight").val(PG.vars.boardHeight);
    // Bounds
    $("#graphxMin").val(PG.vars.bounds[0]);
    $("#graphxMax").val(PG.vars.bounds[1]);
    $("#graphyMin").val(PG.vars.bounds[2]);
    $("#graphyMax").val(PG.vars.bounds[3]);
    // Ticks Distance
    $("#graphXTicksDistance").val(PG.vars.ticksDistance[0]);
    $("#graphYTicksDistance").val(PG.vars.ticksDistance[1]);
    // MinorTicks
    $("#graphXMinorTicks").val(PG.vars.minorTicks[0]);
    $("#graphYMinorTicks").val(PG.vars.minorTicks[1]);
    // Axis Labels
    $("#graphxLabel").val(PG.vars.xLabel);
    $("#graphyLabel").val(PG.vars.yLabel);
    $("#verticalyLabel").attr('checked', PG.vars.yLabelVertical);
    // Hide/Show Graph
    $("#graphShowAxes").val(PG.vars.showAxes);
    // Global FontSize
    $("#graphFontSize").val(PG.vars.globalFontSize);

    /* ---------------------------------------
        Then, initialize board and pull stored elements
    --------------------------------------- */

    PG.initBoard();
    PG.pullStoredElements();

}); // End of Document Ready

// Configuration Options for JSXGraph
JXG.Options.layer = {numlayers: 20, text: 9, point: 9, glider: 9, arc: 8, line: 7, circle: 6,
          curve: 5, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 8, ticks: 2, grid: 1, image: 0, trace: 0};
JXG.Options.text.fontSize = PG.vars.globalFontSize;
