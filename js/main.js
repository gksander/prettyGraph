// Configuration Options for JSXGraph
JXG.Options.layer = {numlayers: 20, text: 9, point: 9, glider: 9, arc: 8, line: 9, circle: 6,
            curve: 7, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 7, ticks: 2, grid: 1, image: 0, trace: 0};
JXG.Options.text.fontSize = 20;




// VUE APPLICATION
var app = new Vue({
    el: '#app',

    // DATA OBJECT
    data: {
        sidebarShown: false,
        currentTab: 0,

        modalHead: '',
        modalBody: '',

        board: null,
        tmp: {},
        parser: math.parser(),

        constructions: localStorage['PGconstructions'] ? JSON.parse(localStorage["PGconstructions"]) : [],
        CC: null,
        currEl: null,

        nInterval: null,
        nOptions: false,

        elementTypes: [
        ['none', 'Choose one...'],
        ['functiongraph', 'Function Graph'],
        ['curve', 'Curve'],
        ['text', 'Text'],
        ['point', 'Point'],
        ['line', 'Line'],
        ['circle', 'Circle'],
        ['polygon', 'Polygon']
        ],

        elementTypeSelected: 'none',
        newElementId: '',



    },
    // END DATA OBJECT

    // METHODS OBJECT
    methods: {
        // SET SOME CONSTRUCTION DEFAULTS
        constructionDefaults: function(c) {
            return {
                name: c.name!==undefined ? c.name : 'Need a name',
                els: c.els!==undefined ? c.els : [],
                declarations: c.declarations!==undefined ? c.declarations : '',
                graphSize: c.graphSize!==undefined ? c.graphSize : [500, 500],
                // graphSize: [400,400],
                graphBounds: c.graphBounds!==undefined ? c.graphBounds : [-5,5,-5,5],
                fontSize: c.fontSize!==undefined ? c.fontSize : 22,
                axesColor: c.axesColor!==undefined ? c.axesColor : 'black',
                axesThickness: c.axesThickness!==undefined ? c.axesThickness : 2,
                axisLabel: c.axisLabel!==undefined ? c.axisLabel : ['$x$', '$y$'],
                ticksDistance: c.ticksDistance!==undefined ? c.ticksDistance : [1,1],
                minorTicks: c.minorTicks!==undefined ? c.minorTicks : [1,1],
                showXAxis: c.showXAxis!==undefined ? c.showXAxis : 1,
                showYAxis: c.showYAxis!==undefined ? c.showYAxis : 1,
                piTicks: c.piTicks!==undefined ? c.piTicks : 0,

                n: c.n!==undefined ? c.n : 1,
                nBounds: c.nBounds!==undefined ? c.nBounds : [-5,5,0.1,5]
            }
        },

        // BOX CONSTRUCTION
        initBoard: function() {
            try {
                this.runDeclarations(this.CC.declarations);
                JXG.JSXGraph.freeBoard(this.board);
                document.getElementById('box').innerHTML = '';
            } catch (err) {}

            // Initialize the board
            var bounds = this.CC.graphBounds;
            this.board = JXG.JSXGraph.initBoard('box', {
                boundingBox: [bounds[0], bounds[3], bounds[1], bounds[2]],
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

            // Register board events
            var that = this;
            this.board.on('boundingbox', function(){
                var bounds = this.getBoundingBox();
                var xmin = bounds[0].toFixed(2),
                    xmax = bounds[2].toFixed(2),
                    ymin = bounds[3].toFixed(2),
                    ymax = bounds[1].toFixed(2);
                that.CC.graphBounds = [xmin, xmax, ymin, ymax];
            });
            this.board.on('update', function(){
                that.renderBoardMath();
            });

            // Make prettier axes.
            this.tmp['xaxis'] = this.board.create('axis', [[0,0], [1,0]], {
                strokeColor: this.CC.axesColor ? this.CC.axesColor : "black",
                strokeWidth: this.CC.axesThickness ? this.CC.axesThickness : 2,
                highlight:false,
                name: this.stringToDisplay(this.CC.axisLabel[0]),
                withLabel: true,
                label: {
                    position:'rt',
                    offset:[5,10],
                    highlight:false,
                    // useMathJax:true,
                    anchorX:'right',
                    anchorY: 'bottom',
                    fontSize: this.CC.fontSize,
                    parse: false
                },

            });
            this.tmp['xaxis'].removeAllTicks();


            this.tmp['xAxisTicks'] = this.board.create('ticks', [this.tmp['xaxis']], {
            ticksDistance: this.CC.ticksDistance[0],
            strokeColor: 'rgba(150,150,150,0.85)',
            majorHeight: (this.CC.showYAxis == 0 && this.CC.showXAxis == 1) ? 15 : -1,
            minorHeight: (this.CC.showYAxis == 0 && this.CC.showXAxis == 1) ? 10 : -1,
            highlight:false,
            drawLabels: true,
            label: {
                offset:[0,-5],
                anchorY:'top',
                anchorX:'middle',
                highlight:false,
                fontSize: this.CC.fontSize
            },
            minorTicks: this.CC.minorTicks[0],
            //   visible: PG.vars.showXAxis == 1 ? true : false,
            drawZero: this.CC.showYAxis == 0 && this.CC.showXAxis == 1,
            scale: this.CC.piTicks ? Math.PI : 1,
            scaleSymbol: this.CC.piTicks ? "&pi;" : "",
            //   labels: ['hey', 'girl', 'hey']
            });
            if (this.CC.showXAxis === 0){
                this.tmp['xaxis'].setAttribute({visible: false});
            }

            // Build y-axis, strip ticks, re-define ticks
            this.tmp['yaxis'] = this.board.create('axis', [[0,0], [0,1]], {
                strokeColor: this.CC.axesColor ? this.CC.axesColor : "black",
                strokeWidth: this.CC.axesThickness ? this.CC.axesThickness : 2,
                highlight:false,
                name: this.stringToDisplay(this.CC.axisLabel[1]),
                withLabel: true,
                label: {
                    // display: PG.vars.yLabelVertical ? 'internal' : 'html',
                    // rotate: PG.vars.yLabelVertical ? 90 : 0,
                    position:'rt',
                    offset: [10,5],
                    highlight:false,
                    // useMathJax:true,
                    anchorX: 'left',
                    anchorY: 'top',
                    fontSize: this.CC.fontSize,
                    parse: false
                },
                // visible: PG.vars.showYAxis == 1 ? true : false
            });
            this.tmp['yaxis'].removeAllTicks();
            this.tmp['yAxisTicks'] = this.board.create('ticks', [this.tmp['yaxis']], {
            ticksDistance: this.CC.ticksDistance[1],
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
                fontSize: this.CC.fontSize
            },
            minorTicks: this.CC.minorTicks[1]
            });
            if (this.CC.showYAxis === 0){
                this.tmp['yaxis'].setAttribute({visible: false});
            }

            // Resize container for good measure
            this.board.resizeContainer(this.CC.graphSize[0], this.CC.graphSize[1]);
            // Render elements
            for (var el in this.CC.els) {
                this.buildBoardElement(this.CC.els[el]);
            }
            this.currEl = this.CC.els[0] || null;
        },

        
        // ADD A NEW ELEMENT
        addNewElement: function() {
            // Get type and break if none is selected
            var type = this.elementTypeSelected;
            if (type == 'none') {
                // TODO: Modal message
                console.log("Whoops! It looks like you forgot to choose an element");
                return false;
            }
            // Get ID, declare a random one if needed
            var id = this.newElementId;
            id = id==="" ? Math.random().toString(36).substring(2,8) : id;

            // Reset to defaults
            this.newElementId = '';
            this.elementTypeSelected = this.elementTypes[0][0];

            var newEl = {
                id: id,
                type: type,
                visible: 1
            };

            // Set some defaults based on type
            switch (type){
                case "functiongraph":
                    newEl['funcdef'] = "x^2";
                    newEl['lowerBound'] = "";
                    newEl['upperBound'] = "";
                    newEl['strokeWidth'] = 3;
                    newEl['strokeColor'] = "black";
                    newEl['dash'] = 0;
                    break;
                case "curve":
                    newEl['x'] = "2*cos(t)";
                    newEl['y'] = "2*sin(t)";
                    newEl['lowerBound'] = "0";
                    newEl['upperBound'] = "1";
                    newEl['strokeWidth'] = 3;
                    newEl['strokeColor'] = "red";
                    newEl['dash'] = 0;
                    break;
                case "point":
                    newEl['loc'] = "(1, 2)";
                    newEl['size'] = 3;
                    newEl['name'] = '';
                    newEl['color'] = 'black';
                    break;
                case "line":
                    newEl['startLoc'] = "(0,0)";
                    newEl['endLoc'] = "(2*cos(1), 2*sin(1))";
                    newEl['strokeWidth'] = 3;
                    newEl['strokeColor'] = "black";
                    newEl['dash'] = 0;
                    newEl['arrow'] = 0;
                    newEl['end'] = 0;
                    break;
                case "text":
                    newEl['loc'] = '(1, 1)';
                    newEl['text'] = "$\\Delta x$";
                    newEl['fontSize'] = this.CC.fontSize;
                    newEl['anchorX'] = 0;
                    newEl['anchorY'] = 0;
                    newEl['color'] = 'black';
                    break;
                case "circle":
                    newEl['loc'] = "(0,0)";
                    newEl['r'] = 2;
                    newEl['strokeWidth'] = 3;
                    newEl['strokeColor'] = 'black';
                    newEl['fillColor'] = 'white';
                    newEl['fillOpacity'] = 0;
                    newEl['dash'] = 0;
                    break;
                case "polygon":
                    newEl['loc'] = ["(1,1)", "(xf, 1)", "(0, yf)"];
                    newEl['strokeWidth'] = 2;
                    newEl['strokeColor'] = "black";
                    newEl['fillColor'] = "white";
                    newEl['fillOpacity'] = 0;
                    break;
                case "inequality":
                    newEl['line'] = "";
                    newEl['inverse'] = false;
                    newEl['fillColor'] = "red";
                    newEl['fillOpacity'] = 0.3;
                    break;
            }

            this.CC.els.unshift(newEl);
            this.buildBoardElement(newEl);
            this.currEl = this.CC.els[0];
        },

        // Build a board element
        buildBoardElement: function(ops) {
            var id = ops.id;
            try {
                this.board.removeObject(this.tmp[id]);
            } catch(err){}

            var that = this;
            var ats = {};
            try {
                switch (ops.type) {
                    case "functiongraph":
                        ats = {
                            fixed: true,
                            highlight: false,
                            strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                            strokeColor: ops.strokeColor ? ops.strokeColor : 'black',
                            dash: ops.dash ? ops.dash : 0
                        };
                        this.tmp[id] = this.board.create('functiongraph', [
                            (x) => {
                                var s = this.getMathScope();
                                s['x'] = x;
                                try {
                                    return math.eval(ops.funcdef, s);
                                } catch (err){
                                    return 0;
                                }
                            },
                            ops.lowerBound ? function(){
                                try {
                                    return math.eval(ops.lowerBound, that.getMathScope());
                                } catch (err){
                                    return that.getMathScope()['xi'];
                                }
                            } : null,
                            ops.upperBound ? function(){
                                try {
                                    return math.eval(ops.upperBound, that.getMathScope());
                                } catch (err){
                                    return that.getMathScope().xf;
                                }
                            } : null
                        ], ats);
                        break;
                    // CURVES
                    case "curve":
                        this.tmp[id] = this.board.create("curve", [
                            (t) => {
                                var s = that.getMathScope();
                                s['t'] = t;
                                try {
                                    return math.eval(ops.x, s);
                                } catch (err){
                                    return 0;
                                }
                            },
                            (t) => {
                                var s = that.getMathScope();
                                s['t'] = t;
                                try {
                                    return math.eval(ops.y, s);
                                } catch (err){
                                    return 0;
                                }
                            },
                            function(){
                                try {
                                    return math.eval(ops.lowerBound, that.getMathScope());
                                } catch (err){
                                    return 0;
                                }
                            },
                            function(){
                                try {
                                    return math.eval(ops.upperBound, that.getMathScope());
                                } catch (err){
                                    return 1;
                                }
                            }
                        ], {
                            fixed: true,
                            highlight: false,
                            strokeWidth: ops.strokeWidth,
                            strokeColor: ops.strokeColor,
                            dash: ops.dash
                        });
                        break;

                    case "text":
                        ats = {
                            highlight: false,
                            anchorX: ops.anchorX == -1 ? 'right' : (ops.anchorX == 0 ? 'middle' : 'left'),
                            anchorY: ops.anchorY == -1 ? 'top' : (ops.anchorY == 0 ? 'middle' : 'bottom'),
                            fontSize: ops.fontSize,
                            color: ops.color,
                            parse: false
                        };
                        var textF = function(){
                            return that.stringToDisplay(ops.text);
                            // var o = ops.text;
                            // o = o.replace(/\$\{[^{}]+\}\d/g, function(x){
                            //     // return math.eval("round("+x.substring(2, x.length - 2)+","+x.charAt(x.length-1)+")", PG.getMathScope());
                            //     return math.eval(x.substring(2, x.length - 2), that.getMathScope()).toFixed(x.charAt(x.length-1));
                            // });
                            // return o;
                        }
                        var loc = this.pointToArray(ops.loc);
                        if (ops.loc.indexOf("n") == -1 && ops.loc.indexOf("x") == -1){

                            this.tmp[id] = this.board.create('text', [
                                math.eval(loc[0]),
                                math.eval(loc[1]),
                                textF
                            ], ats);
                            // Rig up event listener
                            this.tmp[id].on('drag', function(){
                                var x = this.X(),
                                    y = this.Y();
                                var loc = `(${x}, ${y})`;
                                // TODO: HANDLE POINT DRAGGING
                                var theEl = that.getElById(id);
                                theEl['loc'] = loc;
                                // $(`li#${id}`).find(".element_textLoc").val(loc);
                                // that.els[id].loc = loc;
                            });
                        } else {
                            this.tmp[id] =	this.board.create('text', [
                                ()=>{
                                    try {
                                        return math.eval(loc[0], that.getMathScope());
                                    } catch (err){
                                        return 0;
                                    }
                                },
                                ()=>{
                                    try {
                                        return math.eval(loc[1], that.getMathScope())
                                    } catch (err) {
                                        return 0;
                                    }
                                },
                                textF
                            ], ats);
                        }
                        break;

                    case "point":
                        var loc = this.pointToArray(ops.loc);

                        this.tmp[ops.id] =this.board.create('point', [
                            function(){
                                try {
                                    return math.eval(loc[0], that.getMathScope());
                                } catch (err){
                                    return 0;
                                }
                            },
                            function(){
                                try {
                                    return math.eval(loc[1], that.getMathScope());
                                } catch (err){
                                    return 0;
                                }
                            }
                        ], {
                            fixed: false,
                            name: ops.name ? ops.name : '',
                            highlight: false,
                            color: ops.color ? ops.color : 'black',
                            showInfobox: false,
                            size: ops.size ? ops.size : 3
                        });
                        // Rig event listener to point
                        this.tmp[id].on('drag', function(){
                            var x = this.X(),
                                y = this.Y();
                            var loc = `(${x}, ${y})`;
                            var theEl = that.getElById(id);
                            theEl['loc'] = loc;
                        });
                        break;

                    case "line": 
                        var s = this.pointToArray(ops.startLoc);
                        var e = this.pointToArray(ops.endLoc);
                        //
                        this.tmp[id] = this.board.create('line', [
                            function(){
                                try {
                                    return [math.eval(s[0], that.getMathScope()), math.eval(s[1], that.getMathScope())];
                                } catch (err){
                                    return [0,0];
                                }
                            },
                            function(){
                                try {
                                    return [math.eval(e[0], that.getMathScope()), math.eval(e[1], that.getMathScope())];
                                } catch (err){
                                    return [1,1];
                                }
                            },
                        ], {
                            fixed: false,
                            highlight: false,
                            strokeWidth: ops.strokeWidth ? ops.strokeWidth : 3,
                            strokeColor: ops.strokeColor ? ops.strokeColor : 'black',
                            dash: ops.dash ? ops.dash : 0,
                            straightFirst: (ops.end == 2 || ops.end == 3),
                            straightLast: (ops.end == 1 || ops.end == 3),
                            firstArrow: (ops.arrow == 2 || ops.arrow == 3),
                            lastArrow: (ops.arrow == 1 || ops.arrow == 3)
                        });
                    break;

                case "circle":
                    var s = this.pointToArray(ops.loc);
                    this.tmp[id] = this.board.create('circle', [
                        [function(){ try{return math.eval(s[0], that.getMathScope());}catch(err){return 0;} },
                        function(){ try{return math.eval(s[1], that.getMathScope());}catch(err){return 0;} }],
                        function(){ try{return math.eval(ops.r, that.getMathScope());}catch(err){return 1;} }
                    ], {
                        fixed: true,
                        highlight: false,
                        strokeWidth: ops.strokeWidth,
                        strokeColor: ops.strokeColor,
                        fillColor: ops.fillColor,
                        fillOpacity: ops.fillOpacity,
                        dash: ops.dash
                    });
                    break;

                case "polygon": 
                    var ps = [];
                    for (let i=0; i < ops.loc.length; i++){
                        let p = ops.loc[i];
                        p = that.pointToArray(p);
                        ps.push(function(){
                            try {
                                return [math.eval(p[0], that.getMathScope()), math.eval(p[1], that.getMathScope())];
                            } catch (err){
                                return [0,0];
                            }
                        });

                    };

                    this.tmp[id] = this.board.create('polygon', ps, {
                        fixed: true,
                        highlight:false,
                        vertices: {visible: false}, // NEED TO ADJUST THIS
                        borders: {
                            fixed: true,
                            highlight:false,
                            strokeWidth: ops.strokeWidth,
                            strokeColor: ops.strokeColor
                        },
                        fillColor: ops.fillColor,
                        fillOpacity: ops.fillOpacity
                    });
                    break;
                }
                // Register event listener to new element
                this.tmp[id].on('down', function(){
                    var id = null;
                    for (var i in that.tmp) {
                        if (that.tmp[i] === this) {
                            id = i;
                            break;
                        }
                    }
                    // If we find an id
                    if (id!==null){
                        that.currEl = that.getElById(id);
                    }
                });
                // Render board math
                this.renderBoardMath();
            } catch (err) {}
        },


        // Run declarations
        runDeclarations: function(val) {
            this.parser.clear();
            this.CC.declarations = val;
            var decs = val.split('\n');
            for (var i in decs) {
                try {
                    this.parser.eval(decs[i]);
                }catch(err){}
            }
            this.board.update();
            this.renderBoardMath();
        },


        // String to Display
        stringToDisplay: function(text) {
            var o = text,
                that = this;
            // First, replace xi,xf,yi,yf,n and others
            o = o.replace(/\$\{[^{}]+\}\d/g, function(x){
                return math.eval(x.substring(2, x.length - 2), that.getMathScope()).toFixed(x.charAt(x.length-1));
            });
            // Then try to use mathjs to handle calc-input wrapped in ``
            o = o.replace(/`.*`/g, function(x){
                try {
                    return ("$"+math.parse(x.substring(1,x.length-1)).toTex({parentheses:'auto', implicit:true})+"$").replace(/:=/g,'=');
                } catch (err) {
                    return x;
                }
            });
            return o;
        },

        // Function to render board math
        renderBoardMath: function() {
            renderMathInElement(document.getElementById('box'), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\[", right: "\\]", display: true},
                    {left: "\\(", right: "\\)", display: false}
                ]
            });
        },

        // Get math scope
        getMathScope: function() {
            var bb = this.board.getBoundingBox();
            var o = {n:this.CC.n, xi: bb[0], xf:bb[2], yi:bb[3], yf:bb[1]};
            var parserObj = this.parser.getAll();
            for (var p in parserObj) {
                if (o[p] === undefined) {
                    o[p] = parserObj[p];
                }
            }
            return o;
        },

        // Get an element by its id
        getElById: function(id) {
            var theEl = null;
            for (var i in this.CC.els){
                if (this.CC.els[i].id == id) {
                    theEl = this.CC.els[i];
                    break;
                }
            }
            return theEl;
        },

        
        // Function to split point string to JS array
        pointToArray: function(point) {
            var o = point.trim();
            o = o.substr(1);
            o = o.substring(0, o.length - 1);
            return o.split(",");
        }
        


    },
    // END METHODS OBJECT



    // VUE FILTERS
    filters: {
        number: function(value) {
            return value.toFixed(3);
        }
    },


    // WHEN VUE IS READY 
    created: function() {
        // // If no constructions present, we will push one to it.
        try {
            if (this.constructions.length == 0){
                this.constructions.push(this.constructionDefaults({}));
            } else {
                this.constructions[0] = this.constructionDefaults(this.constructions[0]);
            }
            this.CC = this.constructions[0];
        } catch (err) {
            this.constructions = [this.constructionDefaults({})];
            this.CC = this.constructions[0];
        }

        // this.initBoard();
    },

    mounted: function() {
        this.initBoard();
    }

});




/* CHANGE EVENTS */
// Change dimensions
app.graphSizeChange = function(w, h) {
    var x = 300, y = 300;
    try {
        x = math.eval(w);
        y = math.eval(h);
    } catch (err){}
    this.CC.graphSize = [x, y];
    this.board.resizeContainer(x,y);
}
// Change Bounds
app.graphBoundsChange = function(val, n) {
    try {
        var v = math.eval(val);
        this.CC.graphBounds[n] = v;
        this.board.setBoundingBox([this.CC.graphBounds[0], this.CC.graphBounds[3], this.CC.graphBounds[1], this.CC.graphBounds[2]])
    } catch (err) {
        return false;
    }
}
// Change TicksDistance
app.changeTicksDistance = function(dx, xy) {
    try {
        var dx = math.eval(dx);
        this.tmp[(xy==0?'x':'y')+'AxisTicks'].setAttribute({
            ticksDistance: dx
        });
        this.CC.ticksDistance[xy] = dx;
    } catch (err) {}
}
// Change minor ticks
app.changeMinorTicks = function(n, xy) {
    try {
        var n = math.eval(n);
        this.tmp[(xy==0?'x':'y')+'AxisTicks'].setAttribute({minorTicks: n});
        this.CC.minorTicks[xy] = n;
    } catch(err){return false;}
}
// Change axis label
app.changeAxisLabel = function(lab, xy){
    try {
        this.tmp[(xy==0?'x':'y')+'axis'].setAttribute({name: this.stringToDisplay(lab)});
        this.CC.axisLabel[xy] = lab;
    } catch(err) { return false; }
}
// Change axes thickness
app.changeAxesThickness = function(val) {
    try {
        this.tmp['xaxis'].setAttribute({strokeWidth: val});
        this.tmp['yaxis'].setAttribute({strokeWidth: val});
        this.CC.axesThickness = val;
    } catch(err){return false;}
}
// Change axes color
app.changeAxesColor = function(val) {
    try {
        this.tmp['xaxis'].setAttribute({strokeColor: val});
        this.tmp['yaxis'].setAttribute({strokeColor: val});
        this.CC.axesColor = val;
    } catch (err) {return false;}
}
// When font size is changed
app.fontSizeChange = function(val) {
    try {
        var size = math.eval(val);
        // xaxis
        this.tmp['xaxis']['label'].setAttribute({fontSize:size});
        var xatl = this.tmp['xAxisTicks'].getAttribute('label');
        xatl['fontSize'] = size;
        this.tmp['xAxisTicks'].setAttribute({label: xatl});
        // yaxis
        this.tmp['yaxis']['label'].setAttribute({fontSize:size});
        var yatl = this.tmp['yAxisTicks'].getAttribute('label');
        yatl['fontSize'] = size;
        this.tmp['yAxisTicks'].setAttribute({label: yatl});

        this.CC.fontSize = size;
    } catch(err){return false;}
}
// Toggle axis visibility
app.changeAxisVisibility = function(v, xy2){
    try {
        var show = parseInt(v);
        var xy = (xy2==0?'x':'y');
        if (xy == 'x') {
            this.CC.showXAxis = show;
        } else {
            this.CC.showYAxis = show;
        }

        this.tmp[xy+'axis'].setAttribute({visible: (show==1?true:false)});
        this.tmp['xAxisTicks'].setAttribute({
        drawZero: this.CC.showYAxis == 0 && this.CC.showXAxis == 1,
        majorHeight: (this.CC.showYAxis == 0 && this.CC.showXAxis == 1) ? 15 : -1,
        minorHeight: (this.CC.showYAxis == 0 && this.CC.showXAxis == 1) ? 10 : -1
    });
    } catch(err) {return false;}
}


/* HANDLE DYNAMIC PARAMETER N */
app.setN = function(val) {
    this.CC.n = val;
    this.board.update();
}
app.changeN = function(val, o) {
    // o == 1 means we use math.eval
    this.CC.n = o==1 ? math.eval(val) : parseFloat(val);
    this.board.update();
}
app.playN = function() {
    try{clearInterval(this.nInterval)}catch(err){};

    var min = this.CC.nBounds[0],
        max = this.CC.nBounds[1],
        step = this.CC.nBounds[2],
        dur = 1000*this.CC.nBounds[3];

    this.changeN(min,0);
    var that = this;
    this.nInterval = setInterval(function(){
        that.changeN(that.CC.n + step, 0);	
        if (that.CC.n > max - step) {
            clearInterval(that.nInterval);
            that.changeN(max,0);
        }
    }, dur/((max-min)/step));

}
app.nOptionsToggle = function() {
    this.nOptions = !this.nOptions;
}
app.changeNBounds = function(val, o) {
    try {
        this.CC.nBounds[o] = math.eval(val);
    } catch(err) {return false;}
}
app.modalMessage = function(head, body) {
    this.modalHead = head;
    this.modalBody = body;
}


/* HANDLE CHANGING OF BOARD ELEMENTS */
// Function definition change
app.changeFuncDef = function(val, id){
    // Get the element
    var theEl = this.getElById(id);
    theEl['funcdef'] = val;
    this.board.removeObject(this.tmp[id]);
    this.buildBoardElement(theEl);
    this.board.update();
}
// Function bound change
app.changeFuncBound = function(val, id, n) {
    var theEl = this.getElById(id);
    theEl[n==0?'lowerBound':'upperBound'] = val;
    this.board.removeObject(this.tmp[id]);
    this.buildBoardElement(theEl);
    this.board.update();
}
// Change curve functions and bounds
app.changeCurveFunc = function(val, id, n) {
    var theEl = this.getElById(id);
    theEl[n==0?'x':'y'] = val;
    this.board.removeObject(this.tmp[id]);
    this.buildBoardElement(theEl);
    this.board.update();
}
app.changeCurveBounds = function(val, id, n) {
    var theEl = this.getElById(id);
    theEl[n==0?'lowerBound':'upperBound'] = val;
    this.board.removeObject(this.tmp[id]);
    this.buildBoardElement(theEl);
    this.board.update();
}
// Changing text
app.changeText = function(val, id, n) {
    var theEl = this.getElById(id);
    if (n==0){ // Change text value
        theEl['text'] = val;
        this.buildBoardElement(theEl);
    } else { // Change text location
        theEl['loc'] = val;
        this.buildBoardElement(theEl);
    }
}
// Changing point
app.changePointLoc = function(val, id) {
    var theEl = this.getElById(id);
    theEl['loc'] = val;
    this.buildBoardElement(theEl);
}
// Changing Line
app.changeLineLoc = function(val, id, n) {
    var theEl = this.getElById(id);
    theEl[(n==0?'start':'end')+'Loc'] = val;
    this.buildBoardElement(theEl);
}
// Changing circle
app.changeCircle = function(val, id, n) {
    // n==0 means change center point, n==1 radius
    var theEl = this.getElById(id);
    if (n==0) {
        theEl['loc'] = val;
    } else {
        theEl['r'] = val;
    }
    this.buildBoardElement(theEl);
}
// Changing polygon point
app.changePolygonPoint = function(val, id, i) {
    var theEl = this.getElById(id);
    theEl['loc'][i] = val;
    this.buildBoardElement(theEl);
}
app.addPolygonPoint = function(id) {
    var theEl = this.getElById(id);
    theEl['loc'].push('(0,0)');
    this.buildBoardElement(theEl);
}
app.deletePolygonPoint = function(id, i) {
    var theEl = this.getElById(id);
    theEl['loc'].splice(i, 1);
    this.buildBoardElement(theEl);
}


/* Deleting and styling changes */
app.deleteItem = function(id, i) {
    try {
        this.board.removeObject(this.tmp[id]);
        delete this.tmp[id];
        this.CC.els.splice(i, 1);
    } catch(err) {}
}
app.changeStyle = function(prop, val) {
    switch (prop) {
        case "size": 
            this.currEl['size'] = val;
            this.tmp[this.currEl.id].setAttribute({size: val});
            break;
        case "name":
            this.currEl['name'] = val;
            this.tmp[this.currEl.id].setAttribute({name: val});
            break;
        case "color":
            this.currEl['color'] = val;
            this.tmp[this.currEl.id].setAttribute({color: val});
            break;
        case "strokeColor":
            this.currEl['strokeColor'] = val;
            this.tmp[this.currEl.id].setAttribute({strokeColor: val});
            break;
        case "strokeWidth":
            this.currEl['strokeWidth'] = val;
            this.tmp[this.currEl.id].setAttribute({strokeWidth: val});
            break;
        case "dash":
            this.currEl['dash'] = val;
            this.tmp[this.currEl.id].setAttribute({dash: val});
            break;
        case "arrow":
            this.currEl['arrow'] = val;
            this.tmp[this.currEl.id].setAttribute({
                firstArrow: (val==2 || val==3),
                lastArrow: (val==1 || val==3)
            });
            break;
        case "end":
            this.currEl['end'] = val;
            this.tmp[this.currEl.id].setAttribute({
                straightFirst: (val==2||val==3),
                straightLast: (val==1||val==3)
            });
            break;
        case "fillColor":
            this.currEl['fillColor'] = val;
            this.tmp[this.currEl.id].setAttribute({fillColor: val});
            break;
        case "fillOpacity":
            this.currEl['fillOpacity'] = val;
            this.tmp[this.currEl.id].setAttribute({fillOpacity: parseFloat(val)});
            break;
        case "fontSize":
            this.currEl['fontSize'] = val;
            this.tmp[this.currEl.id].setAttribute({fontSize: val});
            break;
        case "anchorX":
            this.currEl['anchorX'] = val;
            this.tmp[this.currEl.id].setAttribute({
                anchorX: val == -1 ? 'right' : (val == 0 ? 'middle' : 'left')
            });
            break;
        case "anchorY":
            this.currEl['anchorY'] = val;
            this.tmp[this.currEl.id].setAttribute({
                anchorY: val == -1 ? 'top' : (val == 0 ? 'middle' : 'bottom')
            });
            break;
        case "visible":
            this.currEl['visible'] = val;
            this.tmp[this.currEl.id].setAttribute({
                visible: val==0 ? false : true
            });
            break;
    }
}
// Change current element
app.changeCurrEl = function(n) {
    var i = this.CC.els.indexOf(this.currEl);
    // If we can't access an element, return false
    if (i==-1 || !this.CC.els[i + n]) {
        return false;
    }
    this.currEl = this.CC.els[i+n];
}



// HANDLE SAVE/LOAD
app.changeConstruction = function(val) {
    try {
        if (val == -1) {
            this.constructions.push(this.constructionDefaults({}));
            this.CC = this.constructions[this.constructions.length - 1];
        } else {
            this.CC = this.constructions[val];
        }
        this.initBoard();
    }
    catch (err) {console.log(err);}
}
app.saveConstructions = function() {
    try {
        localStorage['PGconstructions'] = JSON.stringify(this.constructions);
        console.log('saved');
    } catch (err) {
        console.log('save failed');
    }
}
app.deleteConstruction = function() {
    var i = this.constructions.indexOf(this.CC);
    this.constructions.splice(i, 1);
    // If we cleared the constructions array, add an element
    if (this.constructions.length == 0){
        this.constructions.push(this.constructionDefaults({}));
        this.CC = this.constructions[0];
    } else { // If we have elements left
        if (i == 0) {
            this.CC = this.constructions[0];
        } else {
            this.CC = this.constructions[i - 1];
        }
    }
    this.initBoard();
    this.saveConstructions();
}
// Save construction on Ctrl + s
// window.addEventListener('keyup', function(event) {
//     if (event.ctrlKey && event.key == "s") {
//         app.saveConstructions();
//         event.preventDefault();
//         return false;
//     }
// });