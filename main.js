$(function(){ // On document ready

    PG.fillInputs();
    PG.registerListeners();
    PG.initBoard();
    PG.pullStoredElements();

    $(".smallInput").attr('size', 10);

    $("#saveConstruction").on('click', function(){
        PG.saveVars();
    });
    // Bind key events
    $(window).on('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                PG.saveVars();
                console.log('saved');
                break;
            }
        }
    });

});

// Variable to namespace prettyGraph functions
var PG = {
    tmp: {},
    // CHeck for stored variables, otherwise set some defaults
    vars: localStorage['PGvars'] ? JSON.parse(localStorage['PGvars']) : {
        'boardWidth': 350,
        'boardHeight': 350,
        'bounds': [-5, 5, -5, 5],
        'xLabel' : '$x$',
        'yLabel' : '$y$',
        'ticksDistance' : [2, 2],
        'minorTicks' : [1, 1],
        'globalFontSize': 18
    },
    board: "",
    els: localStorage['PGels'] ? JSON.parse(localStorage['PGels']) : {}
};

// Function to fill in input boxes based on PG.vars
// TODO: Fill in the rest of these
PG.fillInputs = function(){
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
    // Axis Labels
    $("#graphxLabel").val(PG.vars.xLabel);
    $("#graphyLabel").val(PG.vars.yLabel);
    $("#verticalyLabel").attr('checked', PG.vars.yLabelVertical);
    // Global FontSize
    $("#graphFontSize").val(PG.vars.globalFontSize);
}


// Function that registers event listeners to input boxes
PG.registerListeners = function(){
    // Graphing Window Change Events
    $(".graphSize").on('change', PG.changeGraphSize);
    $(".graphBounds").on('change', PG.changeGraphBounds);
    $(".ticksDistance").on('change', PG.changeTicksDistance);
    $(".axisLabel").on("change", PG.changeAxesLabels);
    $("#verticalyLabel").on("change", PG.changeyLabelOrient);
    $("#graphFontSize").on("change", PG.changeGlobalFontSize);

    // Add new element
    $("#addElement").on('click', PG.addNewElement);

    // Remove element when X is clicked next to item details
    $(document).on('click', ".deleteItem", function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.removeElement(id);
    });
}


/* ---------------------------------------
-- Functions to change graphing Window
--------------------------------------- */
// Graph Size
PG.changeGraphSize = function(){
    PG.vars.boardWidth = parseFloat($("#graphWidth").val());
    PG.vars.boardHeight = parseFloat($("#graphHeight").val());
    try {
        $("#box").css({
            'width': PG.vars.boardWidth,
            'height': PG.vars.boardHeight
        });
        PG.board.resizeContainer(PG.vars.boardWidth, PG.vars.boardHeight);
    }
    catch (err){
        console.log(err);
    }
}

// Graph Bounds
PG.changeGraphBounds = function(){
    var xmin = parseFloat($("#graphxMin").val()),
        xmax = parseFloat($("#graphxMax").val()),
        ymin = parseFloat($("#graphyMin").val()),
        ymax = parseFloat($("#graphyMax").val());
    PG.vars.bounds = [xmin, xmax, ymin, ymax];
    try {
        // Second parameter below (false) determines whether axes will scale to keep ratios
        PG.board.setBoundingBox([xmin, ymax, xmax, ymin], false);
    } catch(err){
        console.log(err);
    }
}

// Change TicksDistance
PG.changeTicksDistance = function(){
    var xTicksDistance = parseFloat($("#graphXTicksDistance").val()),
        yTicksDistance = parseFloat($("#graphYTicksDistance").val());
    PG.vars.ticksDistance = [xTicksDistance, yTicksDistance];
    try {
        PG.tmp.xAxisTicks.setAttribute({
            ticksDistance: PG.vars.ticksDistance[0]
        });
        PG.tmp.yAxisTicks.setAttribute({
            ticksDistance: PG.vars.ticksDistance[1]
        });

    } catch (err){
        console.log(err);
    }
}

// Change Axes Labels
PG.changeAxesLabels = function(){
    var xLabel = $("#graphxLabel").val(),
        yLabel = $("#graphyLabel").val();

    PG.vars.xLabel = xLabel;
    PG.vars.yLabel = yLabel;

    try {
        // Change labels, vertical rotation if need be on y-label
        PG.tmp.xaxis.setAttribute({name:PG.vars.xLabel});
        PG.tmp.yaxis.setAttribute({name:PG.vars.yLabel});
    } catch (err){
        console.log(err);
    }
}
PG.changeyLabelOrient = function(){
    PG.vars.yLabelVertical = $("#verticalyLabel").is(":checked");
    location.reload();
}

// Change Global FontSize
PG.changeGlobalFontSize = function(){
    PG.vars.globalFontSize = parseFloat($("#graphFontSize").val());
    location.reload();
}

// Save to localStorage
PG.saveVars = function(){
    localStorage['PGvars'] = JSON.stringify(PG.vars);
    localStorage['PGels'] = JSON.stringify(PG.els);
}
PG.dropVars = function(){
    localStorage['PGvars'] = "";
    localStorage['PGels'] = "";
}















/* ------------------------
    Functions for adding/creating Elements
------------------------ */

// Pull stored elements, general the HTML and plot them
PG.pullStoredElements = function(){
    for (var i in PG.els){
        var type = PG.els[i].type;
        PG.buildElementHtml(PG.els[i]);
        PG.buildBoardElement(PG.els[i]);
    }
}

// Add new element
PG.addNewElement = function(){
    var type = $("#newElementType").val();
    var id = Math.random().toString(36).substring(2,8);
    // Start building element object
    PG.els[id] = {
        id: id,
        type: type
    }
    // Set some defaults based on type
    switch (type){
        case "functiongraph":
            PG.els[id].funcdef = "x^2";
            PG.els[id].lowerBound = "";
            PG.els[id].upperBound = "";
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = "black";
            PG.els[id].dash = 1;
        break;
        case "point":
            PG.els[id].x = 1;
            PG.els[id].y = 2;
            PG.els[id].size = 3;
            PG.els[id].name = '';
            PG.els[id].color = 'black';
        break;
    }

    PG.buildElementHtml(PG.els[id]);
    PG.buildBoardElement(PG.els[id]);
};

// Remove element. Pull from RP.els, board and HTML list
PG.removeElement = function(id){
    PG.board.removeObject(PG.tmp[id]);
    delete PG.tmp[id];
    delete PG.els[id];
    $(`#${id}`).remove();
}


// BUILD ELEMENT HTML
PG.buildElementHtml = function(ops){
    // Build HTML based on type
    switch (ops.type) {
        case "functiongraph":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p>
                        <span class='deleteItem'>X</span> Function Definition: <input type='text' class='element_funcDef' value='${ops.funcdef}'> <br/>
                        Lower Bound: <input type='text' class='element_funcLB' value='${ops.lowerBound}' size=5/>,
                        Upper Bound: <input type='text' class='element_funcUB' value='${ops.upperBound}' size=5/>
                    </p>

                    <div class='elementProperties'>
                        <ul>
                            <li>${PG.buildAestheticComponent('strokeWidth', {strokeWidth: ops.strokeWidth})}</li>
                            <li>${PG.buildAestheticComponent('strokeColor', {strokeColor: ops.strokeColor})}</li>
                            <li>${PG.buildAestheticComponent('dash', {dash: ops.dash})}</li>
                        </ul>
                    </div>

                </li>
            `;
            $("ul#elementList").append(os);
        break;

        case "point":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p>
                        <span class='deleteItem'>X</span> Point: (
                            <input type='text' class='element_pointX' size=8 value='${ops.x}'>,
                            <input type='text' class='element_pointY' size=8 value='${ops.y}'>
                        )
                    </p>

                    <div class='elementProperties'>
                        <ul>
                            <li>${PG.buildAestheticComponent('size', {size: ops.size})}</li>
                            <li>${PG.buildAestheticComponent('name', {name: ops.name})}</li>
                            <li>${PG.buildAestheticComponent('color', {color: ops.color})}</li>
                        </ul>
                    </div>

                </li>
            `;
            $("ul#elementList").append(os);
        break;
    }

}

// BUILD BOARD element
PG.buildBoardElement = function(ops){
    var id = ops.id;
    // Build based on element type
    switch (ops.type){
        case "functiongraph":
            var ats = {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                strokeColor: ops.strokeColor ? ops.strokeColor : 'black',
                dash: ops.dash ? ops.dash : 1
            };
            PG.tmp[id] = PG.board.create('functiongraph', [
                (x) => {
                    return math.eval(ops.funcdef, {x:x});
                    // with (Math) return = mathjs(ops.funcdef, {x:x});
                },
                ops.lowerBound ? math.eval(ops.lowerBound) : null,
                ops.upperBound ? math.eval(ops.upperBound) : null
            ], ats)

        break;

        case "point":
            PG.tmp[ops.id] = PG.board.create('point', [
                math.eval(PG.els[id].x),
                math.eval(PG.els[id].y)
            ], {
                fixed: true,
                name: ops.name ? ops.name : '',
                highlight: false,
                color: ops.color ? ops.color : 'black',
                showInfobox: false,
                size: ops.size ? ops.size : 3
            });
        break;
    }
}








PG.buildAestheticComponent = function(type, ops){
    switch (type) {
        case "size":
            return `
                Size: <input class='element_sizeRange' type='range' min='1' max='9' step='1' value='${ops.size ? ops.size : 3}'>
            `;
            break;
        case "name":
            return `
                Name: <input class='element_nameInput' type='text' size=9 value='${ops.name ? ops.name : ''}' />
            `;
            break;
        case "color":
            return `
                Color: <input class='element_colorInput' type='text' size=9 value='${ops.color ? ops.color : ''}'/>
            `;
            break;
        case "strokeColor":
            return `
                Color: <input class='element_strokeColorInput' type='text' size=9 value='${ops.strokeColor ? ops.strokeColor : ''}'/>
            `;
            break;

        case "strokeWidth":
            return `
                Stroke Width: <input class='element_strokeWidth' type='range' min='1' max='7' step='1' value='${ops.strokeWidth ? ops.strokeWidth : 3}'
            `;
            break;

        case "dash":
            return `
                Dash: <input class='element_dash' type='range' min='1' max='6' step='1' value='${ops.dash ? ops.dash : 1}'
            `;
            break;
    }
}

/* ------------------------
    Functions for changing elements:
        - register these after document is ready
        - bind to ul#elementList, delegate accordingly
------------------------ */
$(function(){

    // WHEN POINT COORDINATES ARE CHANGEd
    $("#elementList").on('change', '.element_pointX, .element_pointY', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var x = $(`li#${id}`).find('.element_pointX').val(),
            y = $(`li#${id}`).find('.element_pointY').val();

        PG.els[id].x = x;
        PG.els[id].y = y;
        // Try to parse these
        try {
            x = math.eval(x),
            y = math.eval(y);
        }
        catch (err){
            x = 0, y = 0;
        }
        // Change coords and update board
        PG.tmp[id].setPosition(JXG.COORDS_BY_USER, [x, y]);
        PG.board.update();
    });

    // WHEN FUNCTION DEFINITION IS CHANGEd
    $("#elementList").on('change', '.element_funcDef', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var fd = $(this).val();
        PG.els[id].funcdef = fd;
        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });
    // WHEN FUNCTION LOWER BOUND IS CHANGEd
    $("#elementList").on('change', '.element_funcLB', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.els[id].lowerBound = $(this).val();
        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });
    // WHEN FUNCTION LOWER BOUND IS CHANGEd
    $("#elementList").on('change', '.element_funcUB', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.els[id].upperBound = $(this).val();
        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });










    // WHEN SIZE INPUT IS CHANGEd
    $("#elementList").on('input', '.element_sizeRange', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var size = $(this).val();
        PG.els[id].size = size;
        PG.tmp[id].setAttribute({size: size});
    });

    // WHEN NAME INPUT IS CHANGEd
    $("#elementList").on('change', '.element_nameInput', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var name = $(this).val();
        PG.els[id].name = name;
        PG.tmp[id].setAttribute({name: name});
    });

    // WHEN COLOR INPUT IS CHANGEd
    $("#elementList").on('change', '.element_colorInput', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var color = $(this).val();
        PG.els[id].color = color;
        PG.tmp[id].setAttribute({color: color});
    });

    // WHEN STROKE COLOR INPUT IS CHANGEd
    $("#elementList").on('change', '.element_strokeColorInput', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var color = $(this).val();
        PG.els[id].strokeColor = color;
        PG.tmp[id].setAttribute({strokeColor: color});
    });

    // WHEN STROKE WIDTH IS CHANGEd
    $("#elementList").on('input', '.element_strokeWidth', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var strokeWidth = $(this).val();
        PG.els[id].strokeWidth = strokeWidth;
        PG.tmp[id].setAttribute({strokeWidth: strokeWidth});
    });

    // WHEN DASH IS CHANGEd
    $("#elementList").on('input', '.element_dash', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var dash = $(this).val();
        PG.els[id].dash = dash;
        PG.tmp[id].setAttribute({dash: dash});
    });

});










/* ------------------------
    Initialize Board
------------------------ */
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
        label: {
            position:'rt',
            offset:[5,5],
            highlight:false,
            useMathJax:true,
            anchorX:'right',
            anchorY: 'bottom'
        }
    });
    PG.tmp.xaxis.removeAllTicks();
    PG.tmp.xAxisTicks = PG.board.create('ticks', [PG.tmp.xaxis], {
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
        label: {
            display: PG.vars.yLabelVertical ? 'internal' : 'html',
            rotate: PG.vars.yLabelVertical ? 90 : 0,
            position:'rt',
            offset: [5,5],
            highlight:false,
            useMathJax:true,
            anchorX: PG.vars.yLabelVertical ? 'right' : 'left',
            anchorY: 'top'
        }
    });
    PG.tmp.yaxis.removeAllTicks();
    PG.tmp.yAxisTicks = PG.board.create('ticks', [PG.tmp.yaxis], {
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
JXG.Options.text.fontSize = PG.vars.globalFontSize;