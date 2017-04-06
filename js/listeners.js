$(function(){
    /* ---------------------------------------------
    ------ GENERAL EVENTS -------------------------
    ---------------------------------------------- */

    // Bind key events
    $(window).on('keydown', function(event) {
        if (event.keyCode == 27){
            $("body").removeClass("modal-shown")
        }
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                PG.saveConstruction();
                console.log('saved');
                break;
            case 'd':
                event.preventDefault();
                PG.deleteConstruction();
                break;
            case 'p':
                event.preventDefault();
                $("#playN").trigger('click');

            }
        }
    });


    // Unfold panels
    $(".panel-large-head").on('click', function(){
        $(this).closest('.panel-large').find('.panel-large-body').toggleClass('hidden');
        $(this).closest('.panel-large').find('.panel-large-head .fa').toggleClass('fa-folder fa-folder-open');
        var vis = !$(this).closest('.panel-large').find('.panel-large-body').hasClass("hidden");
        var id = $(this).closest('.panel-large').attr('id');


        switch (id){
            case "PGgraphingWindowPanel":
                localStorage['PGgraphingWindowPanelShown'] = vis ? 1 : 0;
                break;
            case "PGelementPanel":
                localStorage['PGelementPanelShown'] = vis ? 1 : 0;
                break;
            case "PGconstructionPanel":
                localStorage['PGconstructionPanelShown'] = vis ? 1 : 0;
                break;
        }

    });


    // Open/Close sidebar
    $("#menubutton").on('click', function(){
		$("body").toggleClass("sidebar-shown");
	});
    // Close Overlay
    $("#content-overlay").on('click', function(){
        if ($("body").hasClass("modal-shown")) {
            $("body").removeClass("modal-shown");
        } else {
            $("body").removeClass("sidebar-shown");
        }
	});
    // Close MODAL
    $("#closeModal").on("click", function(){
        $("body").removeClass("modal-shown");
    });

    // Save/Delete Construction
    $("#PGsaveConstruction").on("click", PG.saveConstruction);

    $("#PGdeleteConstruction").on("click", function(){
        PG.deleteConstruction();
    });

    // Help buttons
    $("#sidebar").on("click", ".fa-question-circle", function(){
        PG.modalMessage("Here, have some info!", $(this).attr('data-message') ? $(this).attr('data-message') : "Looks like someone goofed and forgot to put info here...");
    });


    /* ---------------------------------------------
    ------ Current Construction Change -----------
    ---------------------------------------------- */
    $("#PGconstructionSelectList").on("change", function(){
        var cons = $(this).val();

        localStorage['PGcurrentConstruction'] = $(this).val();
        try {
            PG.getConstruction($(this).val());
            PG.loadConstruction($(this).val());
        } catch(err){
            // PG.getConstruction("0");
            // PG.loadConstruction("0");
        }

    });



    /* ---------------------------------------------
    ------ Graphing Window Change Events -----------
    ---------------------------------------------- */

    // Change Graph Size
    $(".graphSize").on('change', function(){
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
    });

    // Change Graph Bounds
    $(".graphBounds").on('change', function(){
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
    });

    // Change TicksDistance
    $(".ticksDistance").on('change', function(){
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
    });

    $("#graphPiTicks").on('change', function(){
        var v = $(this).is(':checked');
        PG.vars.piTicks = v;
        // Rebuild board using pi ticks
        PG.initBoard();
    });

    // Change MinorTicks
    $(".graphMinorTicks").on('change', function(){
        var xMinorTicks = parseFloat($("#graphXMinorTicks").val()),
            yMinorTicks = parseFloat($("#graphYMinorTicks").val());
        PG.vars.minorTicks = [xMinorTicks, yMinorTicks];
        try {
            PG.tmp.xAxisTicks.setAttribute({minorTicks: xMinorTicks});
            PG.tmp.yAxisTicks.setAttribute({minorTicks: yMinorTicks});
        } catch(err){}
    });

    // Change Axes Labels
    $(".axisLabel").on("change", function(){
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
    });
    $("#verticalyLabel").on("change", function(){
        PG.vars.yLabelVertical = $("#verticalyLabel").is(":checked");
        PG.saveConstruction();
        location.reload();
    });

    // CHange Axes Thickness
    $("#graphAxesThickness").on('input', function(){
        PG.vars.axesThickness = $(this).val();
        PG.tmp.xaxis.setAttribute({strokeWidth: PG.vars.axesThickness});
        PG.tmp.yaxis.setAttribute({strokeWidth: PG.vars.axesThickness});
    });

    // CHange Axes Color
    $("#graphAxesColor").on('change', function(){
        PG.vars.axesColor = $(this).val();
        PG.tmp.xaxis.setAttribute({strokeColor: "#"+PG.vars.axesColor});
        PG.tmp.yaxis.setAttribute({strokeColor: "#"+PG.vars.axesColor});
    });

    // Toggle Axes
    $("#graphShowXAxis").on("input", function(){
        var show = parseInt($(this).val());
        PG.vars.showXAxis = show;
        PG.tmp.xaxis.setAttribute({visible: show==1 ? true : false});
        PG.tmp.xAxisTicks.setAttribute({
            drawZero: PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1,
            majorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 15 : -1,
            minorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 10 : -1
        });
    });
    $("#graphShowYAxis").on("input", function(){
        var show = parseInt($(this).val());
        PG.vars.showYAxis = show;
        PG.tmp.yaxis.setAttribute({visible: show==1 ? true : false});
        PG.tmp.xAxisTicks.setAttribute({
            drawZero: PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1,
            majorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 15 : -1,
            minorHeight: (PG.vars.showYAxis == 0 && PG.vars.showXAxis == 1) ? 10 : -1
        });
    });

    // Change Global FontSize
    $("#graphFontSize").on("change", function(){
        PG.vars.globalFontSize = parseFloat($("#graphFontSize").val());
        PG.saveConstruction();
        location.reload();
    });

    $("#graphLabelFontSize").on("change", function(){
        var size = parseInt($(this).val());
        PG.vars.labelFontSize = size;
        // xAxis
        PG.tmp.xaxis.label.setAttribute({fontSize: size});
        var xatl = PG.tmp.xAxisTicks.getAttribute('label');
        xatl['fontSize'] = size;
        PG.tmp.xAxisTicks.setAttribute({label: xatl});
        // yAxis
        PG.tmp.yaxis.label.setAttribute({fontSize: size});
        var yatl = PG.tmp.yAxisTicks.getAttribute('label');
        yatl['fontSize'] = size;
        PG.tmp.yAxisTicks.setAttribute({label: yatl});
    });

    /* ---------------------------------------------
    ------ Parameter N   --------------------
    ---------------------------------------------- */

    // Change Listeners
    $("#parameterN").on('change', function(){
        PG.setN(math.eval($(this).val()));
    });
    $("#parameterN_min").on('change', function(){
        PG.vars.nMin = math.eval($(this).val());
    });
    $("#parameterN_max").on('change', function(){
        PG.vars.nMax = math.eval($(this).val());
    });
    $("#parameterN_step").on('change', function(){
        PG.vars.nStep = math.eval($(this).val());
    });
    $("#parameterN_duration").on('change', function(){
        PG.vars.nDuration = math.eval($(this).val());
    });

    // When play button is pressed
    $("#playN").on('click', function(){
        // Clear timeout if need be
        try{clearInterval(PG.nInterval)}catch(err){};
        var min = math.eval(PG.vars.nMin),
            max = math.eval(PG.vars.nMax),
            dur = 1000*parseFloat(PG.vars.nDuration),
            step = parseFloat(PG.vars.nStep);

        // Set cuurent n to min value
        PG.setN(PG.vars.nMin);
        PG.nInterval = setInterval(function(){
            PG.setN(parseFloat(PG.vars.n) + step);
            if (parseFloat(PG.vars.n) > max - step){
                clearInterval(PG.nInterval);
                PG.setN(max);
            }
        }, dur/((max-min)/step));
    });


    /* ---------------------------------------------
    ------ Adding/Dropping/Saving --------------------
    ---------------------------------------------- */

    // Adding a new element
    $("#newElementAddButton").on("click", PG.addNewElement);
    $("#newElementId").on("keyup", function(e){
        // if (e.which == 13) PG.addNewElement;
        if (e.which == 13){
            PG.addNewElement();
            $(this).blur();
        }
    });
    $("#newElementType").on("change", function(){
        if ($(this).val() != 0) $("#newElementId").focus();
    })

    // Remove element when X is clicked next to item details
    $(document).on('click', ".deleteItem", function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.removeElement(id);
    });

    // Reset board
    $("#graphResetBoard").on("click", function(){
        var conf = confirm("Are you sure you want to reset all of the board settings and remove all elements?");
        if (conf){
            PG.dropVars();
            location.reload();
        }
    });

    // Save Board
    $("#graphSaveBoard").on("click", function(){
        PG.saveConstruction();
    });

    // Open/Close Attribute Folder
    $("#elementList").on("click", ".attribute-folder", function(){
        // Get the id, toggle folder icon, save the state in PG.els[id], toggle view
        var id = $(this).closest("li.elementItem").attr('id');
        $(this).toggleClass("fa-folder fa-folder-open");

        PG.els[id].panelShown = $(this).hasClass("fa-folder-open");
        $(this).closest("li.elementItem").find("ul").slideToggle();
    });




    /* ------------------------
        Functions for changing elements:
            - register these after document is ready
            - bind to ul#elementList, delegate accordingly
    ------------------------ */

    // WHEN POINT COORDINATES ARE CHANGEd
    $("#elementList").on('change', '.element_pointLoc', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.els[id].loc = $(this).val();
        var locA = PG.pointToArray($(this).val());

        // PG.tmp[id].setPosition(JXG.COORDS_BY_USER, [math.eval(locA[0]), math.eval(locA[1])]);
        PG.buildBoardElement(PG.els[id]);
        // PG.board.update();
    });

    // When Segment Coordinates are changed
    $("#elementList").on('change', '.element_segmentStartLoc, .element_segmentEndLoc', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var li = $(`li#${id}`);
        var startLoc = li.find('.element_segmentStartLoc').val(),
            endLoc = li.find('.element_segmentEndLoc').val();

        PG.els[id].startLoc = startLoc;
        PG.els[id].endLoc = endLoc;

        // TODO: change this from rebuild to setPosition.
        // PG.tmp[id].setPosition(JXG.COORDS_BY_USER, [math.eval(startX), math.eval(startY)]);
        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
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

    // When curve x(t) is changed
    $("#elementList").on('change', '.element_curveX, .element_curveY', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        if ($(this).hasClass('element_curveX')) {
            PG.els[id].x = $(this).val();
        } else {
            PG.els[id].y = $(this).val();
        }

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });

    // When Text position is changed
    $("#elementList").on("change", '.element_textLoc', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.els[id].loc = $(this).val();

        // PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });
    // When Text value is changed
    $("#elementList").on("change", '.element_text', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var text = $(`li#${id}`).find('.element_text').val();
        PG.els[id].text = text;

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });

    // When Circle position is changed
    $("#elementList").on("change", '.element_circleLoc', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        PG.els[id].loc = $(this).val();

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });
    // When Circle radius is changed
    $("#elementList").on("change", '.element_circleR', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var r = $(this).val();
        PG.els[id].r = r;

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });

    // WHEN INEQUALITY LINE IS CHANGED
    $("#elementList").on("change", ".element_ineqLine", function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var line = $(this).val();
        PG.els[id].line = line;

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
    });
    // WHEN INEQUALITY IS INVERTED
    $("#elementList").on("change", ".element_ineqInvert", function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var inverse = $(this).is(":checked");
        PG.els[id].inverse = inverse;

        PG.board.removeObject(PG.tmp[id]);
        PG.buildBoardElement(PG.els[id]);
        PG.board.update();
        // PG.tmp[id].setAttribute({inverse: true});
        // PG.board.fullUpdate();
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
        PG.tmp[id].setAttribute({color: `#${color}`});
    });

    // WHEN STROKE COLOR INPUT IS CHANGEd
    $("#elementList").on('change', '.element_strokeColorInput', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var color = $(this).val();
        PG.els[id].strokeColor = color;
        PG.tmp[id].setAttribute({strokeColor: `#${color}`});
    });

    // WHEN FILL COLOR INPUT IS CHANGEd
    $("#elementList").on('change', '.element_fillColorInput', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var color = $(this).val();
        PG.els[id].fillColor = color;
        PG.tmp[id].setAttribute({fillColor: `#${color}`});
    });

    // WHEN FILL OPACITY INPUT IS CHANGEd
    $("#elementList").on('input', '.element_fillOpacity', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var opac = $(this).val();
        PG.els[id].fillOpacity = opac;
        PG.tmp[id].setAttribute({fillOpacity: parseFloat(opac)});
        PG.board.update();
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

    // WHEN ARROW IS CHANGEd
    $("#elementList").on('input', '.element_arrow', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var arrow = $(this).val();
        PG.els[id].arrow = arrow;
        PG.tmp[id].setAttribute({
            firstArrow: (arrow == 2 || arrow == 3),
            lastArrow: (arrow == 1 || arrow == 3)
        });
    });

    // WHEN END IS CHANGEd
    $("#elementList").on('input', '.element_end', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var end = $(this).val();
        PG.els[id].end = end;
        PG.tmp[id].setAttribute({
            straightFirst: (end == 2 || end == 3),
            straightLast: (end == 1 || end == 3)
        });
    });

    // WHEN FONTSIZE IS CHANGEd
    $("#elementList").on('change', '.element_fontSize', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var fontSize = parseInt($(this).val());
        PG.els[id].fontSize = fontSize;
        PG.tmp[id].setAttribute({fontSize: fontSize});
    });

    // WHEN VISIBLE IS CHANGEd
    $("#elementList").on('input', '.element_visible', function(){
        var id = $(this).closest('li.elementItem').attr('id');
        var visible = $(this).val();
        PG.els[id].visible = visible;
        PG.tmp[id].setAttribute({visible: visible==0 ? false : true});
    });


    // element_sliderMin





}); // END DOCUMENT READY
