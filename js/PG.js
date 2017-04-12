// Variable to namespace prettyGraph functions
var PG = {
    tmp: {},
    board: "",
    els: {},
    currentConstruction: "",
    nInterval: null,
    getMathScope: function(){
        var bb = PG.board.getBoundingBox();
        return {n: PG.vars.n, xi: bb[0], xf: bb[2], yi: bb[3], yf: bb[1]};
    }
};
PG.setN = function(newval){
    PG.vars.n = newval;
    $("#parameterN").val(PG.vars.n);
    try {
        PG.board.update();
    } catch (err){console.log(err);}
}


PG.setDefaults = function(vars){
    return {
        'boardWidth': vars.boardWidth ? vars.boardWidth : 450,
        'boardHeight': vars.boardHeight ? vars.boardHeight : 450,
        'bounds': vars.bounds ? vars.bounds : [-5, 5, -5, 5],
        'xLabel' : vars.xLabel ? vars.xLabel : '$x$',
        'yLabel' : vars.yLabel ? vars.yLabel : '$y$',
        'ticksDistance' : vars.ticksDistance ? vars.ticksDistance : [1, 1],
        'piTicks': vars.piTicks ? vars.piTicks : false,
        'minorTicks' : vars.minorTicks ? vars.minorTicks : [1, 1],
        'globalFontSize': vars.globalFontSize ? vars.globalFontSize : 20,
        'axesThickness': vars.axesThickness ? vars.axesThickness : 2,
        'axesColor': vars.axesColor ? vars.axesColor : "000000",
        'showXAxis' : vars.showXAxis!==null ? vars.showXAxis : 1,
        'showYAxis': vars.showYAxis!==null ? vars.showYAxis : 1,
        'labelFontSize': vars.labelFontSize ? vars.labelFontSize : 20,
        'n': vars.n!==undefined ? vars.n : 1,
        'nMin': vars.nMin!==undefined ? vars.nMin : -5,
        'nMax': vars.nMax!==undefined ? vars.nMax : 5,
        'nStep': vars.nStep!==undefined ? vars.nStep : 0.1,
        'nDuration': vars.nDuration!==undefined ? vars.nDuration : 5,
    };
}

/* ---------------------------------------
 ----- Get Construction from Local Storage ---------
 ------------------------------------ */
PG.getConstruction = function(cons){
    try {
        var constructions = JSON.parse(localStorage['PGconstructions']);
        var c = constructions[cons];
        PG.vars = PG.setDefaults(c.vars);
        PG.els = c.els;
    } catch (err){
        PG.vars = PG.setDefaults({});
        PG.els = {};
    }

    PG.tmp = {};
    $("#elementList").empty();

}


/* ---------------------------------------
 ----- Start Construction ---------
 ------------------------------------ */
PG.loadConstruction = function(cons){

    // PG.getConstruction();


    $("#PGconstructionName").val(cons != 0 ? cons : '');

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
    // Pi Ticks
    $("#graphPiTicks").attr('checked', PG.vars.piTicks);
    // MinorTicks
    $("#graphXMinorTicks").val(PG.vars.minorTicks[0]);
    $("#graphYMinorTicks").val(PG.vars.minorTicks[1]);
    // Axis Labels
    $("#graphxLabel").val(PG.vars.xLabel);
    $("#graphyLabel").val(PG.vars.yLabel);
    $("#verticalyLabel").attr('checked', PG.vars.yLabelVertical);
    // Axis thickness and color
    $("#graphAxesThickness").val(PG.vars.axesThickness ? PG.vars.axesThickness : 2);
    $("#graphAxesColor").val(PG.vars.axesColor ? PG.vars.axesColor : "000000");
    // Hide/Show Axes
    $("#graphShowXAxis").val(PG.vars.showXAxis);
    $("#graphShowYAxis").val(PG.vars.showYAxis);
    // Global FontSize
    // $("#graphFontSize").val(PG.vars.globalFontSize);
    $("#graphLabelFontSize").val(PG.vars.labelFontSize);
    $("#parameterN").val(PG.vars.n);
    $("#parameterN_min").val(PG.vars.nMin);
    $("#parameterN_max").val(PG.vars.nMax);
    $("#parameterN_step").val(PG.vars.nStep);
    $("#parameterN_duration").val(PG.vars.nDuration);

    PG.initBoard();
}


/* ---------------------------------------
 ----- lOAD CONSTRUCTION LIST ---------
 ------------------------------------ */
PG.loadConstructionList = function(toLoad){
    var constructions = JSON.parse(localStorage['PGconstructions']);
    var os = "<option value='0'>New Construction</option>";
    for (var i in constructions) {
        os += `<option value='${i}' ${i==toLoad ? 'selected' : ''}>${i}</option>`;
    }
    $("#PGconstructionSelectList").html(os);
}



// REGISTER BOX EVENT LISTENERS, USED WHEN CONSTRUCTION IS CHANGED
PG.registerBoxEvents = function(){
    // When bounding box is changed.
    PG.board.on('boundingbox', function(){
        var bounds = PG.board.getBoundingBox();
        var xmin = bounds[0].toFixed(2),
            xmax = bounds[2].toFixed(2),
            ymin = bounds[3].toFixed(2),
            ymax = bounds[1].toFixed(2);

        PG.vars.bounds = [xmin, xmax, ymin, ymax];
        $("#graphxMin").val(xmin);
        $("#graphxMax").val(xmax);
        $("#graphyMin").val(ymin);
        $("#graphyMax").val(ymax);

    });
};



/* ---------------------------------------
 ----- Some Worker Functions ---------
 ------------------------------------ */

// Save to localStorage
PG.saveConstruction = function(){
    PG.currentConstruction = $("#PGconstructionName").val();
    // Make sure construction name is non-empty
    if (PG.currentConstruction == ""){
        PG.modalMessage("Whoops!", "Make sure you give your construction a name in the 'Save Construction As' section.");
        return false;
    }
    // Save current construction
    localStorage['PGcurrentConstruction'] = PG.currentConstruction;

    // Look for the construction name in PGconstructions
    var constructions = JSON.parse(localStorage['PGconstructions']);

    constructions[PG.currentConstruction] = {
        vars: PG.vars,
        els: PG.els
    };
    localStorage['PGconstructions'] = JSON.stringify(constructions);

    // Regenerate select list
    PG.loadConstructionList(PG.currentConstruction);
}

PG.deleteConstruction = function(){
    var conf = confirm("Are you sure you want to delete this construction?");
    if (conf){
        try {
            var constructions = JSON.parse(localStorage['PGconstructions']);
            delete constructions[$("#PGconstructionName").val()];
            localStorage['PGconstructions'] = JSON.stringify(constructions);
        } catch (err) {}

        PG.getConstruction('');
        PG.loadConstruction('');
        PG.loadConstructionList('');
    }
};

// Drop all local storage
PG.dropVars = function(){
    localStorage['PGvars'] = "";
    localStorage['PGels'] = "";
}

// Pull stored elements, generate the HTML and plot them
PG.pullStoredElements = function(){
    for (var i in PG.els){
        var type = PG.els[i].type;
        PG.buildElementHtml(PG.els[i]);
        PG.buildBoardElement(PG.els[i]);
    }
}

// Remove element. Pull from RP.els, board and HTML list
PG.removeElement = function(id){
    PG.board.removeObject(PG.tmp[id]);
    delete PG.tmp[id];
    delete PG.els[id];
    $(`#${id}`).remove();
}

// Change point string, like '(1, pi/2)' to array.
PG.pointToArray = function(point){
    var o = point.trim();
    o = o.substr(1);
    o = o.substring(0, o.length - 1);
    return o.split(",");
}

// Display a modal message
PG.modalMessage = function(head, message) {
    $("#modal-head").html(head);
    $("#modal-body").html(message);
    $("body").addClass("modal-shown");
}













/* ------------------------
    Initialize Board
------------------------ */
PG.initBoard = function(){
    // Clear board if possible
    try{
        $("#box").empty();
        JXG.JSXGraph.freeBoard(PG.board);
    } catch(err){}
    // PG.loadConstructionList();

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
        pan: {enabled: true, needshift: false},
        zoom: {
            factorX: 1.25,
            factorY: 1.25,
            needshift: true,
            wheel: true
        },
        showNavigation: false
    });

    // Build x-axis, strip ticks, re-define ticks
    // TODO: EVENTUALLY NEED TO BUILD PI-TICKS INTO THIS AS AN OPTION
    // console.llog(PG.vars.showAxes)

    PG.tmp.xaxis = PG.board.create('axis', [[0,0], [1,0]], {
        strokeColor: PG.vars.axesColor ? "#"+PG.vars.axesColor : "#000000",
        strokeWidth: PG.vars.axesThickness ? PG.vars.axesThickness : 2,
        highlight:false,
        name: PG.vars.xLabel,
        withLabel: true,
        label: {
            position:'rt',
            offset:[5,10],
            highlight:false,
            useMathJax:true,
            anchorX:'right',
            anchorY: 'bottom',
            fontSize: PG.vars.labelFontSize
        },

    });
    PG.tmp.xaxis.removeAllTicks();


    PG.tmp.xAxisTicks = PG.board.create('ticks', [PG.tmp.xaxis], {
      ticksDistance: PG.vars.ticksDistance[0],
      strokeColor: 'rgba(150,150,150,0.85)',
      majorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 15 : -1,
      minorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 10 : -1,
      highlight:false,
      drawLabels: true,
      label: {
          offset:[0,-5],
          anchorY:'top',
          anchorX:'middle',
          highlight:false,
          fontSize: PG.vars.labelFontSize
      },
      minorTicks: PG.vars.minorTicks[0],
    //   visible: PG.vars.showXAxis == 1 ? true : false,
      drawZero: PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1,
      scale: PG.vars.piTicks ? Math.PI : 1,
      scaleSymbol: PG.vars.piTicks ? "&pi;" : "",
    //   labels: ['hey', 'girl', 'hey']
    });
    if (PG.vars.showXAxis === 0){
        PG.tmp.xaxis.setAttribute({visible: false});
    }

    // Build y-axis, strip ticks, re-define ticks
    PG.tmp.yaxis = PG.board.create('axis', [[0,0], [0,1]], {
        strokeColor: PG.vars.axesColor ? "#"+PG.vars.axesColor : "#000000",
        strokeWidth: PG.vars.axesThickness ? PG.vars.axesThickness : 2,
        highlight:false,
        name: PG.vars.yLabel,
        withLabel: true,
        label: {
            display: PG.vars.yLabelVertical ? 'internal' : 'html',
            rotate: PG.vars.yLabelVertical ? 90 : 0,
            position:'rt',
            offset: [10,5],
            highlight:false,
            useMathJax:true,
            anchorX: PG.vars.yLabelVertical ? 'right' : 'left',
            anchorY: 'top',
            fontSize: PG.vars.labelFontSize
        },
        // visible: PG.vars.showYAxis == 1 ? true : false
    });
    PG.tmp.yaxis.removeAllTicks();
    PG.tmp.yAxisTicks = PG.board.create('ticks', [PG.tmp.yaxis], {
      ticksDistance: PG.vars.ticksDistance[1],
      strokeColor: 'rgba(150,150,150,0.85)',
      majorHeight: -1,
      minorHeight: -1,
      highlight:false,
      drawLabels: true,
      label: {
          offset:[-5,0],
          anchorY:'middle',
          anchorX:'right',
          highlight:false,
          fontSize: PG.vars.labelFontSize
      },
      minorTicks: PG.vars.minorTicks[1]
    });
    if (PG.vars.showYAxis === 0){
        PG.tmp.yaxis.setAttribute({visible: false});
    }

    PG.pullStoredElements();
    PG.registerBoxEvents();
}
















/* ---------------------------------------------
------ Creating New Objects --------------------
---------------------------------------------- */

// Method to add a new element
PG.addNewElement = function(){
    // Get type, break if no type selected
    var type = $("#newElementType").val();
    if (type == 0) {
        PG.modalMessage("Whoops!", "It looks like you forgot to choose an element type.");
        return false;
    }
    // Get ID, declare a random one if ID is empty
    var id = $("#newElementId").val().replace(/ /g,'');
    id = id === "" ? Math.random().toString(36).substring(2,8) : id;

    // Check to see if ID is already in use
    if (PG.tmp[id]) {
        PG.modalMessage("Woah there, Captain!", "This element ID is already in use. Choose another one, please.");
        return false;
    }


    $("#newElementType").val(0);
    $("#newElementId").val('');
    // Start building element object
    PG.els[id] = {
        id: id,
        type: type,
        panelShown: true
    }
    // Set some defaults based on type
    switch (type){
        case "functiongraph":
            PG.els[id].funcdef = "x^2";
            PG.els[id].lowerBound = "";
            PG.els[id].upperBound = "";
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = "000000";
            PG.els[id].dash = 0;
            break;
        case "curve":
            PG.els[id].x = "2*cos(t)";
            PG.els[id].y = "2*sin(t)";
            PG.els[id].lowerBound = "0";
            PG.els[id].upperBound = "1";
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = "FF0000";
            PG.els[id].dash = 0;
            break;
        case "point":
            PG.els[id].loc = "(1, 2)";
            PG.els[id].size = 3;
            PG.els[id].name = '';
            PG.els[id].color = '000000';
            break;
        case "line":
            PG.els[id].startLoc = "(0,0)";
            PG.els[id].endLoc = "(2*cos(1), 2*sin(1))";
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = "000000";
            PG.els[id].dash = 0;
            PG.els[id].arrow = 0;
            PG.els[id].ends = 0;
            PG.els[id].visible = 1;
            break;
        case "text":
            PG.els[id].loc = '(1, 1)';
            PG.els[id].text = "`Delta x`";
            PG.els[id].fontSize = PG.vars.globalFontSize;
            PG.els[id].anchorX = 0;
            PG.els[id].anchorY = 0;
            PG.els[id].color = '161DFF';
            break;
        case "circle":
            PG.els[id].loc = "(0,0)";
            PG.els[id].r = 2;
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = '000000';
            PG.els[id].fillColor = 'FFFFFF';
            PG.els[id].fillOpacity = 0;
            PG.els[id].dash = 0;
            break;
        case "polygon":
            PG.els[id].loc = ["(1,1)", "(xf, 1)", "(0, yf)"];
            PG.els[id].strokeWidth = 2;
            PG.els[id].strokeColor = "000000";
            PG.els[id].fillColor = "FFFFFF";
            PG.els[id].fillOpacity = 0;
            break;
        case "inequality":
            PG.els[id].line = "";
            PG.els[id].inverse = false;
            PG.els[id].fillColor = "FF0000";
            PG.els[id].fillOpacity = 0.3;
            break;
    }

    PG.buildElementHtml(PG.els[id]);
    PG.buildBoardElement(PG.els[id]);
};



// BUILD ELEMENT HTML
PG.buildElementHtml = function(ops){
    // ${PG.els[ops.id].panelShown ? '' : "style='display:none'"}
    // Build HTML based on type
    switch (ops.type) {
        case "functiongraph":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Function Graph', ops.id)}

                        <li>Func. Definition: <input type='text' class='element_funcDef' value='${ops.funcdef}' size='10'></li>
                        <li>Lower Bound: <input type='text' class='element_funcLB' value='${ops.lowerBound}' size=5/></li>
                        <li>Upper Bound: <input type='text' class='element_funcUB' value='${ops.upperBound}' size=5/></li>
                        <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                        <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                        <li>${PG.buildAestheticComponent('dash', {dash: ops.dash})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

        case "curve":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Curve', ops.id)}

                        <li>x(t): <input type='text' class='element_curveX' value='${ops.x}' size='12'></li>
                        <li>y(t): <input type='text' class='element_curveY' value='${ops.y}' size='12'></li>
                        <li>Lower Bound: <input type='text' class='element_funcLB' value='${ops.lowerBound}' size=5/></li>
                        <li>Upper Bound: <input type='text' class='element_funcUB' value='${ops.upperBound}' size=5/></li>
                        <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                        <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                        <li>${PG.buildAestheticComponent('dash', {dash: ops.dash})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

        case "point":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Point', ops.id)}

                        <li>Location: <input type='text' class='element_pointLoc' size='12' value='${ops.loc}'/></li>
                        <li>${PG.buildAestheticComponent('size', {size: ops.size})}</li>
                        <li>${PG.buildAestheticComponent('name', {name: ops.name})}</li>
                        <li>${PG.buildAestheticComponent('color', {color: ops.color})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

        case "line":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Line (Segment)', ops.id)}

                        <li>Start Location: <input type='text' class='element_segmentStartLoc' size=12 value='${ops.startLoc}'></li>
                        <li>Ending Location: <input type='text' class='element_segmentEndLoc' size=12 value='${ops.endLoc}'></li>
                        <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                        <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                        <li>${PG.buildAestheticComponent('dash', {dash: ops.dash})}</li>
                        <li>${PG.buildAestheticComponent('arrow', {arrow: ops.arrow})}</li>
                        <li>${PG.buildAestheticComponent('end', {arrow: ops.end})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

        case "text":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Text', ops.id)}

                        <li>Text: <input type='text' class='element_text' size=15 value='${ops.text}'/></li>
                        <li>Location: <input type='text' class='element_textLoc' size='12' value='${ops.loc}'/></li>
                        <li>${PG.buildAestheticComponent('fontSize', {fontSize: ops.fontSize})}</li>
                        <li>${PG.buildAestheticComponent('color', {color: ops.color})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                        <li>${PG.buildAestheticComponent('anchorX', {anchorX: ops.anchorX})}</li>
                        <li>${PG.buildAestheticComponent('anchorY', {anchorY: ops.anchorY})}</li>
                    </ul>
                </li>
            `;
            break;

        case "circle":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Circle', ops.id)}

                        <li>Center: <input type='text' class='element_circleLoc' size=8 value='${ops.loc}'></li>
                        <li>Radius: <input type='text' class='element_circleR' size='8' value='${ops.r}'/></li>
                        <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                        <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                        <li>${PG.buildAestheticComponent('fillColor', {fillColor: ops.fillColor})}</li>
                        <li>${PG.buildAestheticComponent('fillOpacity', {fillOpacity: ops.fillOpacity})}</li>
                        <li>${PG.buildAestheticComponent('dash', {dash: ops.dash})}</li>
                    </ul>
                </li>
            `;
            break;

        case "polygon":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Polygon', ops.id)}
                        <li>Points: <ul>
            `;

            for (var i in ops.loc){
                os += `
                <li>
                    <input type='text' size='8' value='${ops.loc[i]}' class='element_polygonPoint'/>
                    <i class='fa fa-times deletePolygonPoint' aria-hidden='true'></i>
                </li>
                `;
            }

            os += `
                    <li><button type='button' class='polygonAddPoint'>Add Point</button></li>
                </ul>
            </li>`;

            os += `
                        <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                        <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                        <li>${PG.buildAestheticComponent('fillColor', {fillColor: ops.fillColor})}</li>
                        <li>${PG.buildAestheticComponent('fillOpacity', {fillOpacity: ops.fillOpacity})}</li>
                    </ul>
                </li>
            `;
            break;

        case "inequality":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    ${PG.generateElementTitle('Inequality', ops.id)}

                        <li>Line: <input type='text' class='element_ineqLine' size=8 value='${ops.line}'></li>
                        <li>Inverse: <input class='element_ineqInvert' type='checkbox' ${ops.inverse ? 'checked' : ''} /></li>
                        <li>${PG.buildAestheticComponent('fillColor', {fillColor: ops.fillColor})}</li>
                        <li>${PG.buildAestheticComponent('fillOpacity', {fillOpacity: ops.fillOpacity})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

    }
    $("ul#elementList").prepend(os);
    jscolor.installByClassName("jscolor");
}

// This function generates the element list item title AND starting ul tag.
PG.generateElementTitle = function(type, id){
    var msg = "...";
    switch (type){
        case "Function Graph":
            msg = "Enter a function definition, such as x^2 or sin(x). You can change the lower and upper bound of the domain of the function. If you leave the lower/upper bound inputs empty, the domain of the function will be all possible values.";
            break;
        case "Curve":
            msg = `
            <p>
                This defines a parametric curve (x(t), y(t)) for a &le; t &le; b, where you can control a and b using the Lower Bound and Upper Bound properties. Here are a couple ways you might use the Curve element:
            </p>
            <ul>
                <li><u>If you want to create an arc</u> on a circle with a radius of r, centered at (0,0), from the 3-o'clock position to an angle of &alpha;, you could define x(t) = r*cos(&alpha;*t) and y(t) = r*sin(&alpha;*t), where 0 &le; t &le; 1.</li>
                <li>
                    <u>If you want to create a segment</u> from (a, b) to (c, d), define x(t) = t*a + (1-t)*c and y(t) = t*b + (1-t)*d where 0 &le; t &le; 1
                </li>
            </ul>
            `;
            break;
        case "Point":
            msg = `
            This defines a point at the location given. Use the form (X, Y) for the point location. You can also use expressions as the x and y coordinates, e.g. Location = (3*cos(1), 3*sin(1)).
            `;
            break;
        case "Line (Segment)":
            msg = `
            <p>This line passes through the Starting and Ending locations.</p>
            <p>By default, a line segment is formed. Use the &quot;Ending&quot; slider to turn the segment into a ray or a line.</p>
            `;
            break;
        case "Circle":
            msg = `
            This defines a circle with a specified center and radius.
            `;
            break;
        case "Polygon":
            msg = `
            <p>This defines a polygon. The order of the points in the list will be the order of the points when the polygon is drawn. You may use the following additional variables:</p>
            <ul>
                <li>n for the dynamic variable n</li>
                <li>xi for the x-value of the left-side of the board</li>
                <li>xf for the x-value of the right-side of the board</li>
                <li>yi for the y-value of the bottom of the board</li>
                <li>yf for the y-value of the top of the board</li>
            </ul>
            `;
            break;
        case "Inequality":
            msg = `
            This defines an &quot;inequality.&quot; Pass the ID of a previously defined line to the Line property, and the graph will be shaded below the line. Use the &quot;Inverse&quot; checkbox to shade above the line.
            `;
            break;
        case "Text":
            msg = `
            This creates text at the given location. You can use LaTeX notation using $'s, such as $-\\frac{b}{2a}$.
            `;
            break;

    }

    return `
    <p>
        <i class="fa fa-times deleteItem" aria-hidden="true"></i>
        ${type}: <span class='elId'>${id}</span>
        <i class="fa fa-question-circle" aria-hidden="true" data-message="${msg}"></i>

        <i class="fa ${PG.els[id].panelShown ? 'fa-folder-open' : "fa-folder"} attribute-folder" aria-hidden="true"></i>
    </p>
    <ul ${PG.els[id].panelShown ? '' : "style='display:none'"}>
    `;
}



// BUILD BOARD element
PG.buildBoardElement = function(ops){
    var id = ops.id;
    try {
        PG.board.removeObject(PG.tmp[id])
    } catch(err){};
    try {
    // Build based on element type
    switch (ops.type){
        case "functiongraph":
            var ats = {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                strokeColor: ops.strokeColor ? "#"+ops.strokeColor : '#000000',
                dash: ops.dash ? ops.dash : 0,
                // fillColor: ops.fillColor ? ops.fillColor : 'white',
                // fillOpacity: ops.fillOpacity ? ops.fillOpacity : 0
            };
            PG.tmp[id] = PG.board.create('functiongraph', [
                (x) => {
                    return math.eval(ops.funcdef, {x:x, n:PG.vars.n});
                    // with (Math) return = mathjs(ops.funcdef, {x:x});
                },
                ops.lowerBound ? function(){
                    return math.eval(ops.lowerBound, PG.getMathScope());
                } : null,
                ops.upperBound ? function(){
                    return math.eval(ops.upperBound, PG.getMathScope());
                } : null
            ], ats)

            break;

        case "curve":

            PG.tmp[id] = PG.board.create("curve", [
                (x) => {return math.eval(ops.x, {t:x, n: PG.vars.n});},
                (x) => {return math.eval(ops.y, {t:x, n: PG.vars.n});},
                function(){
                    return math.eval(ops.lowerBound, PG.getMathScope());
                },
                function(){
                    return math.eval(ops.upperBound, PG.getMathScope());
                }
            ], {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth,
                strokeColor: "#"+ops.strokeColor,
                dash: ops.dash
            });

            break;

        case "point":
            var loc = PG.pointToArray(PG.els[id].loc);

            PG.tmp[ops.id] = PG.board.create('point', [
                function(){return math.eval(loc[0], PG.getMathScope());},
                function(){return math.eval(loc[1], PG.getMathScope());}
            ], {
                fixed: false,
                name: ops.name ? ops.name : '',
                highlight: false,
                color: ops.color ? "#"+ops.color : '#000000',
                showInfobox: false,
                size: ops.size ? ops.size : 3
            });
            // Rig event listener to point
            PG.tmp[id].on('drag', function(){
                var x = this.X(),
                    y = this.Y();
                var loc = `(${x}, ${y})`;
                $(`li#${id}`).find(".element_pointLoc").val(loc);
                PG.els[id].loc = loc;
            })
            break;

        case "line":
            var ats = {
                fixed: false,
                highlight: false,
                strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                strokeColor: ops.strokeColor ? "#"+ops.strokeColor : '#000000',
                dash: ops.dash ? ops.dash : 0,
                straightFirst: (ops.end == 2 || ops.end == 3),
                straightLast: (ops.end == 1 || ops.end == 3),
                firstArrow: (ops.arrow == 2 || ops.arrow == 3),
                lastArrow: (ops.arrow == 1 || ops.arrow == 3)
            };

            var s = PG.pointToArray(ops.startLoc);
            var e = PG.pointToArray(ops.endLoc);
            //
            PG.tmp[id] = PG.board.create('line', [
                function(){return [math.eval(s[0], PG.getMathScope()), math.eval(s[1], PG.getMathScope())]},
                function(){return [math.eval(e[0], PG.getMathScope()), math.eval(e[1], PG.getMathScope())]},
            ], ats);
            // Rig up event listener
            // PG.tmp[id].on('drag', function(){
            //     var startX = PG.board.objects[this.parents[0]].X(),
            //         startY = PG.board.objects[this.parents[0]].Y(),
            //         endX = PG.board.objects[this.parents[1]].X(),
            //         endY = PG.board.objects[this.parents[1]].Y();
            //     var startLoc = `(${startX.toFixed(2)}, ${startY.toFixed(2)})`,
            //         endLoc = `(${endX.toFixed(2)}, ${endY.toFixed(2)})`;
            //
            //     PG.els[id].startLoc = startLoc;
            //     PG.els[id].endLoc = endLoc;
            //     $(`li#${id}`).find(".element_segmentStartLoc").val(startLoc);
            //     $(`li#${id}`).find(".element_segmentEndLoc").val(endLoc);
            // });
            break;

        case "text":
            var ats = {
                highlight: false,
                anchorX: ops.anchorX == -1 ? 'right' : (ops.anchorX == 0 ? 'middle' : 'left'),
                anchorY: ops.anchorY == -1 ? 'top' : (ops.anchorY == 0 ? 'middle' : 'bottom'),
                fontSize: ops.fontSize,
                color: "#" + ops.color,
                useMathJax: true
            };
            var loc = PG.pointToArray(ops.loc);
            if (ops.loc.indexOf("n") == -1 && ops.loc.indexOf("x") == -1){

                PG.tmp[id] = PG.board.create('text', [
                    math.eval(loc[0]),
                    math.eval(loc[1]),
                    () => {return ops.text;}
                ], ats);
                // Rig up event listener
                PG.tmp[id].on('drag', function(){
                    var x = this.X(),
                        y = this.Y();
                    var loc = `(${x}, ${y})`;
                    $(`li#${id}`).find(".element_textLoc").val(loc);
                    PG.els[id].loc = loc;
                });
            } else {
                PG.tmp[id] = PG.board.create('text', [
                    ()=>{return math.eval(loc[0], PG.getMathScope())},
                    ()=>{return math.eval(loc[1], PG.getMathScope())},
                    () => {return ops.text;}
                ], ats);
            }

            break;

        case "circle":
            var ats = {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth,
                strokeColor: "#"+ops.strokeColor,
                fillColor: "#"+ops.fillColor,
                fillOpacity: ops.fillOpacity,
                dash: ops.dash
            };


            var s = PG.pointToArray(ops.loc);
            PG.tmp[id] = PG.board.create('circle', [
                [function(){return math.eval(s[0], PG.getMathScope());},
                function(){return math.eval(s[1], PG.getMathScope())}],
                function(){return math.eval(ops.r, PG.getMathScope());}
            ], ats);
            break;

        case "polygon":

            var ps = [];
            for (let i=0; i < ops.loc.length; i++){
                let p = ops.loc[parseInt(i)].substr(0);
                p = PG.pointToArray(p);
                ps.push(function(){
                    return [math.eval(p[0], PG.getMathScope()), math.eval(p[1], PG.getMathScope())];
                });

            };

            PG.tmp[id] = PG.board.create('polygon', ps, {
                fixed: true,
                highlight:false,
                vertices: {visible: false}, // NEED TO ADJUST THIS
                borders: {
                    fixed: true,
                    highlight:false,
                    strokeWidth: ops.strokeWidth,
                    strokeColor: "#"+ops.strokeColor
                },
                fillColor: "#"+ops.fillColor,
                fillOpacity: ops.fillOpacity
            });

            break;

        case "inequality":
            var ats = {
                fixed: true,
                highlight: false,
                fillColor: "#"+ops.fillColor,
                fillOpacity: ops.fillOpacity,
                inverse: ops.inverse
            }
            PG.tmp[id] = PG.board.create('inequality', [PG.tmp[ops.line]], ats);

            break;

    }

    }catch (err){}
}


PG.buildAestheticComponent = function(type, ops){
    switch (type) {
        case "size":
            return `
                Size: <input class='element_sizeRange long-range' type='range' min='1' max='9' step='1' value='${ops.size ? ops.size : 3}'>
            `;
            break;
        case "name":
            return `
                Name: <input class='element_nameInput' type='text' size=9 value='${ops.name ? ops.name : ''}' />
            `;
            break;
        case "color":
            return `
                Color: <input class="jscolor element_colorInput" value="${ops.color ? ops.color : 'black'}" size='8'>
            `;
            break;
        case "strokeColor":
            return `
                Stroke Color: <input class="jscolor element_strokeColorInput" value="${ops.strokeColor ? ops.strokeColor : '000000'}" size='8'>
            `;
            break;

        case "fillColor":
            return `
                Fill Color: <input class="jscolor element_fillColorInput" value="${ops.fillColor ? ops.fillColor : 'FF0000'}" size='8'>
            `;
            break;

        case "fillOpacity":
            return `
                Fill Opacity: <input class='element_fillOpacity long-range' type='range' min='0' max='1' step='0.01' value='${ops.fillOpacity ? ops.fillOpacity : 0}' />
            `;
            break;

        case "strokeWidth":
            return `
                Stroke Width: <input class='element_strokeWidth long-range' type='range' min='1' max='7' step='1' value='${ops.strokeWidth ? ops.strokeWidth : 3}'/>
            `;
            break;

        case "dash":
            return `
                Dash: <input class='element_dash long-range' type='range' min='0' max='6' step='1' value='${ops.dash ? ops.dash : 0}'/>
            `;
            break;

        case "arrow":
            return `
                Arrow: <input class='element_arrow medium-range' type='range' min='0' max='3' step='1' value='${ops.arrow ? ops.arrow : 0}'/>
            `;
            break;

        case "end":
            return `
                Ending: <input class='element_end medium-range' type='range' min='0' max='3' step='1' value='${ops.end ? ops.end : 0}'/>
            `;
            break;

        case "fontSize":
            return `
                Font Size: <input class='element_fontSize' type='text' size='8' value='${ops.fontSize ? ops.fontSize : 18}'/>
            `;
            break;

        case "anchorX":
            return `
                Anchor (X): <input class='element_anchorX short-range' type='range' min='-1' max='1' step='1' value='${ops.anchorX!==undefined ? ops.anchorX : 0}'/>
            `;
            break;

        case "anchorY":
            return `
                Anchor (Y): <input class='element_anchorY short-range' type='range' min='-1' max='1' step='1' value='${ops.anchorY!==undefined ? ops.anchorY : 0}'/>
            `;
            break;

        case "visible":
            return `
                Visible: <input type='range' class='element_visible short-range' min='0' max='1' step='1' value='${ops.visible ? ops.visible : 1}'/>
            `;
            break;
    }
}
