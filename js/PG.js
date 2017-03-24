// Variable to namespace prettyGraph functions
var PG = {
    tmp: {},
    // CHeck for stored variables, otherwise set some defaults
    vars: localStorage['PGvars'] ? JSON.parse(localStorage['PGvars']) : {
        'boardWidth': 400,
        'boardHeight': 400,
        'bounds': [-5, 5, -5, 5],
        'xLabel' : '$x$',
        'yLabel' : '$y$',
        'ticksDistance' : [1, 1],
        'minorTicks' : [1, 1],
        'globalFontSize': 20,
        'showAxes' : 1
    },
    board: "",
    els: localStorage['PGels'] ? JSON.parse(localStorage['PGels']) : {}
};

/* ---------------------------------------
 ----- Some Worker Functions ---------
 ------------------------------------ */

// Save to localStorage
PG.saveVars = function(){
    localStorage['PGvars'] = JSON.stringify(PG.vars);
    localStorage['PGels'] = JSON.stringify(PG.els);
}
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
    var id = $("#newElementId").val();
    id = id === "" ? Math.random().toString(36).substring(2,8) : id;

    // Check to see if ID is already in use
    if (PG.tmp[id]) {
        PG.modalMessage("Woah there, Captain!", "This element ID is already in use. Choose another one, please.");
        return false;
    }


    $("#newElementType").val(0);
    $("#newElementId").val('');
    // var id = Math.random().toString(36).substring(2,8);
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
            PG.els[id].dash = 0;
            // PG.els[id].fillColor = 'white';
            // PG.els[id].fillOpacity = 0;
            break;
        case "point":
            // PG.els[id].x = 1;
            // PG.els[id].y = 2;
            PG.els[id].loc = "(1, 2)";
            PG.els[id].size = 3;
            PG.els[id].name = '';
            PG.els[id].color = 'black';
            break;
        case "line":
            PG.els[id].startLoc = "(0,0)";
            PG.els[id].endLoc = "(2*cos(1), 2*sin(1))";
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = "blue";
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
            PG.els[id].color = 'blue';
            break;
        case "circle":
            PG.els[id].loc = "(1,1)";
            PG.els[id].r = 2;
            PG.els[id].strokeWidth = 3;
            PG.els[id].strokeColor = 'black';
            PG.els[id].fillColor = 'white';
            PG.els[id].fillOpacity = 0;
            PG.els[id].dash = 0;
            break;
        case "inequality":
            PG.els[id].line = "";
            PG.els[id].inverse = false;
            PG.els[id].fillColor = "red";
            PG.els[id].fillOpacity = 0.3;
            break;
    }

    PG.buildElementHtml(PG.els[id]);
    PG.buildBoardElement(PG.els[id]);
};



// BUILD ELEMENT HTML
PG.buildElementHtml = function(ops){
    // Build HTML based on type
    switch (ops.type) {
        case "functiongraph":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Function Graph: <span class='elId'>${ops.id}</span></p>
                    <ul>
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

        case "point":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Point: <span class='elId'>${ops.id}</span></p>
                    <ul>
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
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Line (Segment): <span class='elId'>${ops.id}</span></p>
                    <ul>
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
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Text: <span class='elId'>${ops.id}</span></p>
                    <ul>
                        <li>Text: <input type='text' class='element_text' size=15 value='${ops.text}'/></li>
                        <li>Location: <input type='text' class='element_textLoc' size='12' value='${ops.loc}'/></li>
                        <li>${PG.buildAestheticComponent('fontSize', {fontSize: ops.fontSize})}</li>
                        <li>${PG.buildAestheticComponent('color', {color: ops.color})}</li>
                        <li>${PG.buildAestheticComponent('visible', {visible: ops.visible})}</li>
                    </ul>
                </li>
            `;
            break;

        case "circle":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Circle: <span class='elId'>${ops.id}</span></p>
                    <ul>
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

        case "inequality":
            var os = `
                <li class='elementItem' id='${ops.id ? ops.id : 'needid'}'>
                    <p class='elementItemTitle'><i class="fa fa-times deleteItem" aria-hidden="true"></i> Inequality: <span class='elId'>${ops.id}</span></p>
                    <ul>
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
}



// BUILD BOARD element
PG.buildBoardElement = function(ops){
    var id = ops.id;
    try {
    // Build based on element type
    switch (ops.type){
        case "functiongraph":
            var ats = {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                strokeColor: ops.strokeColor ? ops.strokeColor : 'black',
                dash: ops.dash ? ops.dash : 0,
                // fillColor: ops.fillColor ? ops.fillColor : 'white',
                // fillOpacity: ops.fillOpacity ? ops.fillOpacity : 0
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
            var loc = PG.pointToArray(PG.els[id].loc);

            PG.tmp[ops.id] = PG.board.create('point', [
                math.eval(loc[0]),
                math.eval(loc[1])
            ], {
                fixed: false,
                name: ops.name ? ops.name : '',
                highlight: false,
                color: ops.color ? ops.color : 'black',
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
                strokeColor: ops.strokeColor ? ops.strokeColor : 'black',
                dash: ops.dash ? ops.dash : 0,
                straightFirst: (ops.end == 2 || ops.end == 3),
                straightLast: (ops.end == 1 || ops.end == 3),
                firstArrow: (ops.arrow == 2 || ops.arrow == 3),
                lastArrow: (ops.arrow == 1 || ops.arrow == 3)
            };


            if (ops.startLoc.indexOf("(") > -1){
                var s = PG.pointToArray(ops.startLoc);
                var start = [math.eval(s[0]), math.eval(s[1])];
            } else {
                var start = PG.tmp[ops.startLoc];
            }
            if (ops.endLoc.indexOf("(") > -1){
                var e = PG.pointToArray(ops.endLoc);
                var end = [math.eval(e[0]), math.eval(e[1])];
            } else {
                var end = PG.tmp[ops.endLoc];
            }
            //
            PG.tmp[id] = PG.board.create('line', [start, end], ats);
            // Rig up event listener
            PG.tmp[id].on('drag', function(){
                var startX = PG.board.objects[this.parents[0]].X(),
                    startY = PG.board.objects[this.parents[0]].Y(),
                    endX = PG.board.objects[this.parents[1]].X(),
                    endY = PG.board.objects[this.parents[1]].Y();
                var startLoc = `(${startX.toFixed(2)}, ${startY.toFixed(2)})`,
                    endLoc = `(${endX.toFixed(2)}, ${endY.toFixed(2)})`;

                PG.els[id].startLoc = startLoc;
                PG.els[id].endLoc = endLoc;
                $(`li#${id}`).find(".element_segmentStartLoc").val(startLoc);
                $(`li#${id}`).find(".element_segmentEndLoc").val(endLoc);
            });
            break;

        case "text":
            var ats = {
                highlight: false,
                anchorX: ops.anchorX == -1 ? 'right' : (ops.anchorX == 0 ? 'middle' : 'left'),
                anchorY: ops.anchorY == -1 ? 'top' : (ops.anchorY == 0 ? 'middle' : 'bottom'),
                fontSize: ops.fontSize,
                color: ops.color,
                useMathJax: true
            };

            if (ops.loc.indexOf("(") > -1){
                var loc = PG.pointToArray(ops.loc);
                PG.tmp[id] = PG.board.create('text', [
                    math.eval(loc[0]),
                    math.eval(loc[1]),
                    () => {return ops.text;}
                ], ats);
            } else {
                PG.tmp[id] = PG.board.create('text', [
                    ()=>{return PG.tmp[ops.loc].X()},
                    ()=>{return PG.tmp[ops.loc].Y()},
                    () => {return ops.text;}
                ], ats);
            }
            // Rig up event listener
            PG.tmp[id].on('drag', function(){
                var x = this.X(),
                    y = this.Y();
                var loc = `(${x}, ${y})`;
                $(`li#${id}`).find(".element_textLoc").val(loc);
                PG.els[id].loc = loc;
            });
            break;

        case "circle":
            var ats = {
                fixed: true,
                highlight: false,
                strokeWidth: ops.strokeWidth,
                strokeColor: ops.strokeColor,
                fillColor: ops.fillColor,
                fillOpacity: ops.fillOpacity,
                dash: ops.dash
            };

            if (ops.loc.indexOf("(") > -1){
                var s = PG.pointToArray(ops.loc);
                var start = [math.eval(s[0]), math.eval(s[1])];
            } else {
                var start = PG.tmp[ops.loc]
            }


            PG.tmp[id] = PG.board.create('circle', [start, math.eval(ops.r)], ats);
            break;

        case "inequality":
            var ats = {
                fixed: true,
                highlight: false,
                fillColor: ops.fillColor,
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
                Color: <input class='element_colorInput' type='text' size=9 value='${ops.color ? ops.color : ''}'/>
            `;
            break;
        case "strokeColor":
            return `
                Stroke Color: <input class='element_strokeColorInput' type='text' size=9 value='${ops.strokeColor ? ops.strokeColor : ''}'/>
            `;
            break;

        case "fillColor":
            return `
                Fill Color: <input class='element_fillColorInput' type='text' size=9 value='${ops.fillColor ? ops.fillColor : ''}'/>
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

        case "visible":
            return `
                Visible: <input type='range' class='element_visible short-range' min='0' max='1' step='1' value='${ops.visible ? ops.visible : 1}'/>
            `;
            break;
    }
}
