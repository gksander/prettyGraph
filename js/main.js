// PREPROS APPENDS
//@prepros-prepend PG.js
//@prepros-append listeners.js


$(function(){ // On document ready -- Use this to set up web app

    // Make sure localStorage Variables are set up.
    localStorage['PGconstructions'] = localStorage['PGconstructions'] ? localStorage['PGconstructions'] : "{}";
    localStorage['PGcurrentConstruction'] = localStorage['PGcurrentConstruction'] ? localStorage['PGcurrentConstruction'] : "0";

    // $("#sidebar").html(sb);
    jscolor.installByClassName("jscolor");

    PG.loadConstructionList(localStorage['PGcurrentConstruction']);
    PG.getConstruction(localStorage['PGcurrentConstruction']);
    PG.loadConstruction(localStorage['PGcurrentConstruction']);


}); // End of Document Ready

// Configuration Options for JSXGraph
JXG.Options.layer = {numlayers: 20, text: 9, point: 9, glider: 9, arc: 8, line: 9, circle: 6,
          curve: 7, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 8, ticks: 2, grid: 1, image: 0, trace: 0};
JXG.Options.text.fontSize = 20;
