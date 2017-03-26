// PREPROS APPENDS
//@prepros-prepend PG.js
//@prepros-append listeners.js

$(function(){ // On document ready -- Use this to set up web app

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

            <p>Construction options to come... (Save/Delete constructions)</p>

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
                    <h4>Graph Width/Height (in pixels)</h4>
                    <input type="text" id="graphWidth" class="graphSize" size='8'> px /
                    <input type="text" id="graphHeight" class="graphSize" size='8'> px
                </li>
                <li>
                    <h4>Graph Bounds</h4>
                    x from <input type="text" id="graphxMin" class="graphBounds" size='8'> to <input type="text" id="graphxMax" class="graphBounds" size='8'> <br/>
                    y from <input type="text" id="graphyMin" class="graphBounds" size='8'> to <input type="text" id="graphyMax" class="graphBounds" size='8'>
                </li>
                <li>
                    <h4>Distance Between Ticks (X/Y)</h4>
                    <input type="text" id="graphXTicksDistance" class="ticksDistance" size='8'> / <input type="text" id="graphYTicksDistance" class="ticksDistance" size='8'>
                </li>
                <li>
                    <h4>Number of Minor Ticks (X/Y)</h4>
                    <input type="text" id="graphXMinorTicks" class="graphMinorTicks" size='8'> / <input type="text" id="graphYMinorTicks" class="graphMinorTicks" size='8'>
                </li>
                <li>
                    <h4>Axis Labels</h4>
                    x-axis: <input type="text" id="graphxLabel" class="axisLabel" size='8'> <br>
                    y-axis: <input type="text" id="graphyLabel" class="axisLabel" size='8'> Vertical? <input type="checkbox" id="verticalyLabel">
                </li>
                <li>
                    <h4>Show Axes</h4>
                    <input type="range" id="graphShowAxes" min='0' max='1' value='1' class='short-range'>
                </li>
                <li>
                    <h4>Global Font Size</h4>
                    <input type="text" id="graphFontSize" size='8'> px
                </li>
                <li>
                    <h4>Save/Reset Board</h4>
                    <button type='button' id='graphSaveBoard'>Save Construction in Browser</button>
                    <button type='button' id='graphResetBoard'>Clear Entire Board</button>
                </li>
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
                        <option value="text">Text</option>
                        <option value='point'>Point</option>
                        <option value="line">Line</option>
                        <option value="circle">Circle</option>
                        <option value="inequality">Inequality</option>
                    </select>
                    with ID: <input type='text' id='newElementId' size='8'/>
                </p>
                <p>
                    <button type='button' id='newElementAddButton'>Create the Element</button>
                </p>
            </div>

            <ul id='elementList'>

            </ul>
        </div>
    </div>
    `;

    $("#sidebar").html(sb);



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
        Check for which option windows are open/closed
    --------------------------------------- */
    // console.log(localStorage['PGgraphingWindowPanelShown']);
    // if (localStorage['PGgraphingWindowPanelShown'] == 0) {
    //     console.log('closed');
    //     $("#PGgraphingWindowPanel").find('.panel-large-body').addClass("hidden");
    // }


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
