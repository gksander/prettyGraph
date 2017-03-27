// PREPROS APPENDS
//@prepros-prepend PG.js
//@prepros-append listeners.js

$(function(){ // On document ready -- Use this to set up web app

    // Make sure localStorage Variables are set up.
    localStorage['PGconstructions'] = localStorage['PGconstructions'] ? localStorage['PGconstructions'] : "{}";
    localStorage['PGcurrentConstruction'] = localStorage['PGcurrentConstruction'] ? localStorage['PGcurrentConstruction'] : "0";


    /* ---------------------------------------
        First, BUILD SIDE WINDOW
    --------------------------------------- */
    var sb = `
    <div class="panel-large" id="PGconstructionPanel">
        <div class="panel-large-head">
            <i class='fa ${localStorage['PGconstructionPanelShown'] === "0" ? 'fa-folder' : 'fa-folder-open'}' aria-hidden='false'></i>
            Construction Options
        </div>
        <div class="panel-large-body ${localStorage['PGconstructionPanelShown'] === "0" ? 'hidden' : ''}">

            <ul id='constructionList'>
                <li>
                    <h4>
                        Load Construction
                        <i class="fa fa-question-circle" aria-hidden="true" data-message='Load a previously saved construction. Select "New Construction" to start a fresh construction.'></i>
                    </h4>
                    Load: <select id='PGconstructionSelectList'></select> <br/>
                </li>
                <li>
                    <h4>
                        Save Construction
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="Save your construction. Make sure to name it first. If you give it a name that already exists, it will overwrite that construction."></i>
                    </h4>
                    <p>Save Construction as: <input type='text' id='PGconstructionName'/> </p>
                    <p><button class='btn btn-block' id='PGsaveConstruction' type='button'>Save Construction</button></p>
                </li>
                <li>
                    <h4>
                        Delete Construction
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="This will delete the current construction. Be careful."></i>
                    </h4>
                    <p>
                        <button class='btn btn-block btn-danger' type='button' id='PGdeleteConstruction'>Delete Construction</button>
                    </p>
                </li>
            </ul>

        </div>
    </div>

    <br/>

    <div class="panel-large" id="PGgraphingWindowPanel">
        <div class="panel-large-head">
            <i class='fa ${localStorage['PGgraphingWindowPanelShown'] === "0" ? 'fa-folder' : 'fa-folder-open'}' aria-hidden='false'></i>
            Graphing Window
        </div>
        <div class="panel-large-body ${localStorage['PGgraphingWindowPanelShown'] === "0" ? 'hidden' : ''}">
            <ul id='windowList'>
                <li>
                    <h4>
                        Graph Width/Height (in pixels)
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="This will change the width and height of the graphing window (in pixels)."></i>
                    </h4>
                    <input type="text" id="graphWidth" class="graphSize" size='8'> px /
                    <input type="text" id="graphHeight" class="graphSize" size='8'> px
                </li>
                <li>
                    <h4>
                        Graph Bounds
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="Here you can manually change the bounds of the graph. Notice that if you drag the graph, the bounds will be updated here."></i>
                    </h4>
                    x from <input type="text" id="graphxMin" class="graphBounds" size='8'> to <input type="text" id="graphxMax" class="graphBounds" size='8'> <br/>
                    y from <input type="text" id="graphyMin" class="graphBounds" size='8'> to <input type="text" id="graphyMax" class="graphBounds" size='8'>
                </li>
                <li>
                    <h4>
                        Distance Between Ticks (X/Y)
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="Choose the distance between tick marks. If you set this to 2/2 there will be a major tick mark (and numerical label) every 2 units. The number of ticks in the X and Y direction do not have to match. Set these to 0 if you do not want <em>any</em> tick marks."></i>
                    </h4>
                    <input type="text" id="graphXTicksDistance" class="ticksDistance" size='8'> / <input type="text" id="graphYTicksDistance" class="ticksDistance" size='8'>
                </li>
                <li>
                    <h4>
                        Number of Minor Ticks (X/Y)
                        <i class="fa fa-question-circle" aria-hidden="true" data-message='"Minor Ticks" are the tick marks between the numbered tick marks. Set these to 0 if you do not want any minor tick marks.'></i>
                    </h4>
                    <input type="text" id="graphXMinorTicks" class="graphMinorTicks" size='8'> / <input type="text" id="graphYMinorTicks" class="graphMinorTicks" size='8'>
                </li>
                <li>
                    <h4>
                        Axis Labels
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="These will set the labels for the axes. You can use $'s to use standard LaTeX notation (like $\\frac{x}{2}$), or use \` to use ASCIIMath input (such as \`x/2\`)."></i>
                    </h4>
                    x-axis: <input type="text" id="graphxLabel" class="axisLabel" size='8'> <br>
                    y-axis: <input type="text" id="graphyLabel" class="axisLabel" size='8'> Vertical? <input type="checkbox" id="verticalyLabel">
                </li>
                <li>
                    <h4>
                        Axis Styles
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="Here you can do additional styling on the axes, such as change the thickness or the color."></i>
                    </h4>
                    <ul>
                        <li>
                            Axis Thickness: <input type='range' class='long-range' id='graphAxesThickness' min='1' max='9' value='2' >
                        </li>
                        <li>
                            Axis Color: <input class='jscolor' id='graphAxesColor' value='000000'>
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>
                        Visibility
                        <i class="fa fa-question-circle" aria-hidden="true" data-message="Here you can hide either (or both) of the axes. If you hide the y-axis and keep the x-axis shown, the ticks will adjust to create a number line."></i>
                    </h4>
                    <ul>
                        <li>Show x-axes: <input type="range" id="graphShowXAxis" min='0' max='1' value='1' class='short-range'></li>
                        <li>Show y-axes: <input type="range" id="graphShowYAxis" min='0' max='1' value='1' class='short-range'></li>
                    </ul>
                </li>
                <!-- <li>
                    <h4>
                        Global Font Size
                    </h4>
                    <input type="text" id="graphFontSize" size='8'> px
                </li> -->
            </ul>
        </div>
    </div>

    <br>

    <div class="panel-large" id="PGelementPanel">
        <div class="panel-large-head">
            <i class='fa ${localStorage['PGelementPanelShown'] === "0" ? 'fa-folder' : 'fa-folder-open'}' aria-hidden='false'></i>
            Add Elements
        </div>
        <div class="panel-large-body ${localStorage['PGelementPanelShown'] === "0" ? 'hidden' : ''}">
            <div id="addNew">
                <p id='newElementTypeContainer'>
                    <select name="newElementType" id="newElementType">
                        <option value="0">Choose one...</option>
                        <option value='functiongraph'>Function Graph</option>
                        <option value='curve'>Curve</option>
                        <option value="text">Text</option>
                        <option value='point'>Point</option>
                        <option value="line">Line</option>
                        <option value="circle">Circle</option>
                        <option value="inequality">Inequality</option>
                    </select>
                    with ID: <input type='text' id='newElementId' size='8'/>
                </p>
                <p>
                    <button type='button' id='newElementAddButton' class='btn'>Create the Element</button>
                </p>
            </div>

            <ul id='elementList'>

            </ul>
        </div>
    </div>
    `;

    $("#sidebar").html(sb);
    jscolor.installByClassName("jscolor");

    PG.loadConstructionList(localStorage['PGcurrentConstruction']);
    PG.getConstruction(localStorage['PGcurrentConstruction']);
    PG.loadConstruction(localStorage['PGcurrentConstruction']);


}); // End of Document Ready

// Configuration Options for JSXGraph
JXG.Options.layer = {numlayers: 20, text: 9, point: 9, glider: 9, arc: 8, line: 9, circle: 6,
          curve: 7, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 8, ticks: 2, grid: 1, image: 0, trace: 0};
JXG.Options.text.fontSize = 20;
