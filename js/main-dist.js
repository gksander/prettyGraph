"use strict";var PG={tmp:{},default_vars:{boardWidth:450,boardHeight:450,bounds:[-5,5,-5,5],xLabel:"$x$",yLabel:"$y$",ticksDistance:[1,1],minorTicks:[1,1],globalFontSize:20,showAxes:!0},board:"",els:{},currentConstruction:""};PG.getConstruction=function(cons){try{var constructions=JSON.parse(localStorage.PGconstructions),c=constructions[cons];PG.vars=c.vars,PG.els=c.els}catch(err){PG.vars=PG.default_vars,PG.els={}}PG.tmp={},$("#elementList").empty()},PG.loadConstruction=function(cons){try{JXG.JSXGraph.freeBoard(PG.board)}catch(err){}$("#PGconstructionName").val(cons?cons:""),$("#graphWidth").val(PG.vars.boardWidth),$("#graphHeight").val(PG.vars.boardHeight),$("#graphxMin").val(PG.vars.bounds[0]),$("#graphxMax").val(PG.vars.bounds[1]),$("#graphyMin").val(PG.vars.bounds[2]),$("#graphyMax").val(PG.vars.bounds[3]),$("#graphXTicksDistance").val(PG.vars.ticksDistance[0]),$("#graphYTicksDistance").val(PG.vars.ticksDistance[1]),$("#graphXMinorTicks").val(PG.vars.minorTicks[0]),$("#graphYMinorTicks").val(PG.vars.minorTicks[1]),$("#graphxLabel").val(PG.vars.xLabel),$("#graphyLabel").val(PG.vars.yLabel),$("#verticalyLabel").attr("checked",PG.vars.yLabelVertical),$("#graphShowAxes").val(PG.vars.showAxes),$("#graphFontSize").val(PG.vars.globalFontSize),PG.initBoard(),PG.pullStoredElements(),PG.registerBoxEvents()},PG.loadConstructionList=function(toLoad){var constructions=JSON.parse(localStorage.PGconstructions),os="<option>New Construction</option>";for(var i in constructions)os+="<option value='"+i+"' "+(i==toLoad?"selected":"")+">"+i+"</option>";$("#PGconstructionSelectList").html(os)},PG.registerBoxEvents=function(){PG.board.on("boundingbox",function(){var bounds=PG.board.getBoundingBox(),xmin=bounds[0],xmax=bounds[2],ymin=bounds[3],ymax=bounds[1];PG.vars.bounds=[xmin,xmax,ymin,ymax],$("#graphxMin").val(xmin),$("#graphxMax").val(xmax),$("#graphyMin").val(ymin),$("#graphyMax").val(ymax)})},PG.saveConstruction=function(){if(PG.currentConstruction=$("#PGconstructionName").val(),""==PG.currentConstruction)return PG.modalMessage("Whoops!","Make sure you give your construction a name in the 'Save Construction As' section."),!1;localStorage.PGcurrentConstruction=PG.currentConstruction;var constructions=JSON.parse(localStorage.PGconstructions);constructions[PG.currentConstruction]={vars:PG.vars,els:PG.els},localStorage.PGconstructions=JSON.stringify(constructions),PG.loadConstructionList(PG.currentConstruction)},PG.deleteConstruction=function(){if(confirm("Are you sure you want to delete this construction?")){try{var constructions=JSON.parse(localStorage.PGconstructions);delete constructions[$("#PGconstructionName").val()],localStorage.PGconstructions=JSON.stringify(constructions)}catch(err){}PG.getConstruction(""),PG.loadConstruction(""),PG.loadConstructionList("")}},PG.dropVars=function(){localStorage.PGvars="",localStorage.PGels=""},PG.pullStoredElements=function(){for(var i in PG.els){PG.els[i].type;PG.buildElementHtml(PG.els[i]),PG.buildBoardElement(PG.els[i])}},PG.removeElement=function(id){PG.board.removeObject(PG.tmp[id]),delete PG.tmp[id],delete PG.els[id],$("#"+id).remove()},PG.pointToArray=function(point){var o=point.trim();return o=o.substr(1),o=o.substring(0,o.length-1),o.split(",")},PG.modalMessage=function(head,message){$("#modal-head").html(head),$("#modal-body").html(message),$("body").addClass("modal-shown")},PG.initBoard=function(){$("#box").css({width:PG.vars.boardWidth,height:PG.vars.boardHeight}),PG.board=JXG.JSXGraph.initBoard("box",{boundingBox:[PG.vars.bounds[0],PG.vars.bounds[3],PG.vars.bounds[1],PG.vars.bounds[2]],axis:!1,showCopyright:!1,pan:{enabled:!0,needshift:!1},zoom:{factorX:1.25,factorY:1.25,needshift:!0,wheel:!0},showNavigation:!1}),PG.tmp.xaxis=PG.board.create("axis",[[0,0],[1,0]],{strokeColor:"black",strokeWidth:2,highlight:!1,name:PG.vars.xLabel,withLabel:!0,label:{position:"rt",offset:[5,5],highlight:!1,useMathJax:!0,anchorX:"right",anchorY:"bottom"},visible:PG.vars.showAxes}),PG.tmp.xaxis.removeAllTicks(),PG.tmp.xAxisTicks=PG.board.create("ticks",[PG.tmp.xaxis],{ticksDistance:PG.vars.ticksDistance[0],strokeColor:"rgba(150,150,150,0.85)",majorHeight:-1,minorHeight:-1,highlight:!1,drawLabels:!0,label:{offset:[0,-5],anchorY:"top",anchorX:"middle",highlight:!1},minorTicks:PG.vars.minorTicks[0]}),PG.tmp.yaxis=PG.board.create("axis",[[0,0],[0,1]],{strokeColor:"black",strokeWidth:2,highlight:!1,name:PG.vars.yLabel,withLabel:!0,label:{display:PG.vars.yLabelVertical?"internal":"html",rotate:PG.vars.yLabelVertical?90:0,position:"rt",offset:[5,5],highlight:!1,useMathJax:!0,anchorX:PG.vars.yLabelVertical?"right":"left",anchorY:"top"},visible:PG.vars.showAxes}),PG.tmp.yaxis.removeAllTicks(),PG.tmp.yAxisTicks=PG.board.create("ticks",[PG.tmp.yaxis],{ticksDistance:PG.vars.ticksDistance[1],strokeColor:"rgba(150,150,150,0.85)",majorHeight:-1,minorHeight:-1,highlight:!1,drawLabels:!0,label:{offset:[-5,0],anchorY:"middle",anchorX:"right",highlight:!1},minorTicks:PG.vars.minorTicks[1]})},PG.addNewElement=function(){var type=$("#newElementType").val();if(0==type)return PG.modalMessage("Whoops!","It looks like you forgot to choose an element type."),!1;var id=$("#newElementId").val();if(id=""===id?Math.random().toString(36).substring(2,8):id,PG.tmp[id])return PG.modalMessage("Woah there, Captain!","This element ID is already in use. Choose another one, please."),!1;switch($("#newElementType").val(0),$("#newElementId").val(""),PG.els[id]={id:id,type:type,panelShown:!0},type){case"functiongraph":PG.els[id].funcdef="x^2",PG.els[id].lowerBound="",PG.els[id].upperBound="",PG.els[id].strokeWidth=3,PG.els[id].strokeColor="000000",PG.els[id].dash=0;break;case"curve":PG.els[id].x="2*cos(t)",PG.els[id].y="2*sin(t)",PG.els[id].lowerBound="0",PG.els[id].upperBound="1",PG.els[id].strokeWidth=3,PG.els[id].strokeColor="FF0000",PG.els[id].dash=0;break;case"point":PG.els[id].loc="(1, 2)",PG.els[id].size=3,PG.els[id].name="",PG.els[id].color="000000";break;case"line":PG.els[id].startLoc="(0,0)",PG.els[id].endLoc="(2*cos(1), 2*sin(1))",PG.els[id].strokeWidth=3,PG.els[id].strokeColor="000000",PG.els[id].dash=0,PG.els[id].arrow=0,PG.els[id].ends=0,PG.els[id].visible=1;break;case"text":PG.els[id].loc="(1, 1)",PG.els[id].text="`Delta x`",PG.els[id].fontSize=PG.vars.globalFontSize,PG.els[id].anchorX=0,PG.els[id].anchorY=0,PG.els[id].color="161DFF";break;case"circle":PG.els[id].loc="(0,0)",PG.els[id].r=2,PG.els[id].strokeWidth=3,PG.els[id].strokeColor="000000",PG.els[id].fillColor="FFFFFF",PG.els[id].fillOpacity=0,PG.els[id].dash=0;break;case"inequality":PG.els[id].line="",PG.els[id].inverse=!1,PG.els[id].fillColor="FF0000",PG.els[id].fillOpacity=.3}PG.buildElementHtml(PG.els[id]),PG.buildBoardElement(PG.els[id])},PG.buildElementHtml=function(ops){switch(ops.type){case"functiongraph":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Function Graph",ops.id)+"\n\n                        <li>Func. Definition: <input type='text' class='element_funcDef' value='"+ops.funcdef+"' size='10'></li>\n                        <li>Lower Bound: <input type='text' class='element_funcLB' value='"+ops.lowerBound+"' size=5/></li>\n                        <li>Upper Bound: <input type='text' class='element_funcUB' value='"+ops.upperBound+"' size=5/></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"curve":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Curve",ops.id)+"\n\n                        <li>x(t): <input type='text' class='element_curveX' value='"+ops.x+"' size='12'></li>\n                        <li>y(t): <input type='text' class='element_curveY' value='"+ops.y+"' size='12'></li>\n                        <li>Lower Bound: <input type='text' class='element_funcLB' value='"+ops.lowerBound+"' size=5/></li>\n                        <li>Upper Bound: <input type='text' class='element_funcUB' value='"+ops.upperBound+"' size=5/></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"point":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Point",ops.id)+"\n\n                        <li>Location: <input type='text' class='element_pointLoc' size='12' value='"+ops.loc+"'/></li>\n                        <li>"+PG.buildAestheticComponent("size",{size:ops.size})+"</li>\n                        <li>"+PG.buildAestheticComponent("name",{name:ops.name})+"</li>\n                        <li>"+PG.buildAestheticComponent("color",{color:ops.color})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"line":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Line (Segment)",ops.id)+"\n\n                        <li>Start Location: <input type='text' class='element_segmentStartLoc' size=12 value='"+ops.startLoc+"'></li>\n                        <li>Ending Location: <input type='text' class='element_segmentEndLoc' size=12 value='"+ops.endLoc+"'></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                        <li>"+PG.buildAestheticComponent("arrow",{arrow:ops.arrow})+"</li>\n                        <li>"+PG.buildAestheticComponent("end",{arrow:ops.end})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"text":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Text",ops.id)+"\n\n                        <li>Text: <input type='text' class='element_text' size=15 value='"+ops.text+"'/></li>\n                        <li>Location: <input type='text' class='element_textLoc' size='12' value='"+ops.loc+"'/></li>\n                        <li>"+PG.buildAestheticComponent("fontSize",{fontSize:ops.fontSize})+"</li>\n                        <li>"+PG.buildAestheticComponent("color",{color:ops.color})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"circle":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Circle",ops.id)+"\n\n                        <li>Center: <input type='text' class='element_circleLoc' size=8 value='"+ops.loc+"'></li>\n                        <li>Radius: <input type='text' class='element_circleR' size='8' value='"+ops.r+"'/></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillColor",{fillColor:ops.fillColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillOpacity",{fillOpacity:ops.fillOpacity})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                    </ul>\n                </li>\n            ";break;case"inequality":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    "+PG.generateElementTitle("Inequality",ops.id)+"\n\n                        <li>Line: <input type='text' class='element_ineqLine' size=8 value='"+ops.line+"'></li>\n                        <li>Inverse: <input class='element_ineqInvert' type='checkbox' "+(ops.inverse?"checked":"")+" /></li>\n                        <li>"+PG.buildAestheticComponent("fillColor",{fillColor:ops.fillColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillOpacity",{fillOpacity:ops.fillOpacity})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            "}$("ul#elementList").prepend(os),jscolor.installByClassName("jscolor")},PG.generateElementTitle=function(type,id){return'\n    <p>\n        <i class="fa fa-times deleteItem" aria-hidden="true"></i>\n        '+type+": <span class='elId'>"+id+'</span>\n        <i class="fa '+(PG.els[id].panelShown?"fa-folder-open":"fa-folder")+' attribute-folder" aria-hidden="true"></i>\n    </p>\n    <ul '+(PG.els[id].panelShown?"":"style='display:none'")+">\n    "},PG.buildBoardElement=function(ops){var id=ops.id;try{switch(ops.type){case"functiongraph":var ats={fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth?ops.strokeWidth:3,strokeColor:ops.strokeColor?"#"+ops.strokeColor:"#000000",dash:ops.dash?ops.dash:0};PG.tmp[id]=PG.board.create("functiongraph",[function(x){return math.eval(ops.funcdef,{x:x})},ops.lowerBound?math.eval(ops.lowerBound):null,ops.upperBound?math.eval(ops.upperBound):null],ats);break;case"curve":PG.tmp[id]=PG.board.create("curve",[function(x){return math.eval(ops.x,{t:x})},function(x){return math.eval(ops.y,{t:x})},math.eval(ops.lowerBound),math.eval(ops.upperBound)],{fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth,strokeColor:"#"+ops.strokeColor,dash:ops.dash});break;case"point":var loc=PG.pointToArray(PG.els[id].loc);PG.tmp[ops.id]=PG.board.create("point",[math.eval(loc[0]),math.eval(loc[1])],{fixed:!1,name:ops.name?ops.name:"",highlight:!1,color:ops.color?"#"+ops.color:"#000000",showInfobox:!1,size:ops.size?ops.size:3}),PG.tmp[id].on("drag",function(){var x=this.X(),y=this.Y(),loc="("+x+", "+y+")";$("li#"+id).find(".element_pointLoc").val(loc),PG.els[id].loc=loc});break;case"line":var ats={fixed:!1,highlight:!1,strokeWidth:ops.strokeWidth?ops.strokeWidth:3,strokeColor:ops.strokeColor?"#"+ops.strokeColor:"#000000",dash:ops.dash?ops.dash:0,straightFirst:2==ops.end||3==ops.end,straightLast:1==ops.end||3==ops.end,firstArrow:2==ops.arrow||3==ops.arrow,lastArrow:1==ops.arrow||3==ops.arrow};if(ops.startLoc.indexOf("(")>-1)var s=PG.pointToArray(ops.startLoc),start=[math.eval(s[0]),math.eval(s[1])];else var start=PG.tmp[ops.startLoc];if(ops.endLoc.indexOf("(")>-1)var e=PG.pointToArray(ops.endLoc),end=[math.eval(e[0]),math.eval(e[1])];else var end=PG.tmp[ops.endLoc];PG.tmp[id]=PG.board.create("line",[start,end],ats),PG.tmp[id].on("drag",function(){var startX=PG.board.objects[this.parents[0]].X(),startY=PG.board.objects[this.parents[0]].Y(),endX=PG.board.objects[this.parents[1]].X(),endY=PG.board.objects[this.parents[1]].Y(),startLoc="("+startX.toFixed(2)+", "+startY.toFixed(2)+")",endLoc="("+endX.toFixed(2)+", "+endY.toFixed(2)+")";PG.els[id].startLoc=startLoc,PG.els[id].endLoc=endLoc,$("li#"+id).find(".element_segmentStartLoc").val(startLoc),$("li#"+id).find(".element_segmentEndLoc").val(endLoc)});break;case"text":var ats={highlight:!1,anchorX:ops.anchorX==-1?"right":0==ops.anchorX?"middle":"left",anchorY:ops.anchorY==-1?"top":0==ops.anchorY?"middle":"bottom",fontSize:ops.fontSize,color:"#"+ops.color,useMathJax:!0};if(ops.loc.indexOf("(")>-1){var loc=PG.pointToArray(ops.loc);PG.tmp[id]=PG.board.create("text",[math.eval(loc[0]),math.eval(loc[1]),function(){return ops.text}],ats)}else PG.tmp[id]=PG.board.create("text",[function(){return PG.tmp[ops.loc].X()},function(){return PG.tmp[ops.loc].Y()},function(){return ops.text}],ats);PG.tmp[id].on("drag",function(){var x=this.X(),y=this.Y(),loc="("+x+", "+y+")";$("li#"+id).find(".element_textLoc").val(loc),PG.els[id].loc=loc});break;case"circle":var ats={fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth,strokeColor:"#"+ops.strokeColor,fillColor:"#"+ops.fillColor,fillOpacity:ops.fillOpacity,dash:ops.dash};if(ops.loc.indexOf("(")>-1)var s=PG.pointToArray(ops.loc),start=[math.eval(s[0]),math.eval(s[1])];else var start=PG.tmp[ops.loc];PG.tmp[id]=PG.board.create("circle",[start,math.eval(ops.r)],ats);break;case"inequality":var ats={fixed:!0,highlight:!1,fillColor:"#"+ops.fillColor,fillOpacity:ops.fillOpacity,inverse:ops.inverse};PG.tmp[id]=PG.board.create("inequality",[PG.tmp[ops.line]],ats)}}catch(err){}},PG.buildAestheticComponent=function(type,ops){switch(type){case"size":return"\n                Size: <input class='element_sizeRange long-range' type='range' min='1' max='9' step='1' value='"+(ops.size?ops.size:3)+"'>\n            ";case"name":return"\n                Name: <input class='element_nameInput' type='text' size=9 value='"+(ops.name?ops.name:"")+"' />\n            ";case"color":return'\n                Color: <input class="jscolor element_colorInput" value="'+(ops.color?ops.color:"black")+"\" size='8'>\n            ";case"strokeColor":return'\n                Stroke Color: <input class="jscolor element_strokeColorInput" value="'+(ops.strokeColor?ops.strokeColor:"000000")+"\" size='8'>\n            ";case"fillColor":return'\n                Fill Color: <input class="jscolor element_fillColorInput" value="'+(ops.fillColor?ops.fillColor:"FF0000")+"\" size='8'>\n            ";case"fillOpacity":return"\n                Fill Opacity: <input class='element_fillOpacity long-range' type='range' min='0' max='1' step='0.01' value='"+(ops.fillOpacity?ops.fillOpacity:0)+"' />\n            ";case"strokeWidth":return"\n                Stroke Width: <input class='element_strokeWidth long-range' type='range' min='1' max='7' step='1' value='"+(ops.strokeWidth?ops.strokeWidth:3)+"'/>\n            ";case"dash":return"\n                Dash: <input class='element_dash long-range' type='range' min='0' max='6' step='1' value='"+(ops.dash?ops.dash:0)+"'/>\n            ";case"arrow":return"\n                Arrow: <input class='element_arrow medium-range' type='range' min='0' max='3' step='1' value='"+(ops.arrow?ops.arrow:0)+"'/>\n            ";case"end":return"\n                Ending: <input class='element_end medium-range' type='range' min='0' max='3' step='1' value='"+(ops.end?ops.end:0)+"'/>\n            ";case"fontSize":return"\n                Font Size: <input class='element_fontSize' type='text' size='8' value='"+(ops.fontSize?ops.fontSize:18)+"'/>\n            ";case"visible":return"\n                Visible: <input type='range' class='element_visible short-range' min='0' max='1' step='1' value='"+(ops.visible?ops.visible:1)+"'/>\n            "}},$(function(){localStorage.PGconstructions=localStorage.PGconstructions?localStorage.PGconstructions:"{}",localStorage.PGcurrentConstruction=localStorage.PGcurrentConstruction?localStorage.PGcurrentConstruction:"0";var sb='\n    <div class="panel-large" id="PGconstructionPanel">\n        <div class="panel-large-head">\n            <i class=\'fa '+("0"===localStorage.PGconstructionPanelShown?"fa-folder":"fa-folder-open")+"' aria-hidden='false'></i>\n            Construction Options\n        </div>\n        <div class=\"panel-large-body "+("0"===localStorage.PGconstructionPanelShown?"hidden":"")+"\">\n\n            <ul id='constructionList'>\n                <li>\n                    <h4>Load Construction</h4>\n                    Load: <select id='PGconstructionSelectList'></select> <br/>\n                </li>\n                <li>\n                    <h4>Save Construction</h4>\n                    <p>Save Construction as: <input type='text' id='PGconstructionName'/> </p>\n                    <p><button class='btn btn-block' id='PGsaveConstruction' type='button'>Save Construction</button></p>\n                </li>\n                <li>\n                    <h4>Delete Construction</h4>\n                    <p>\n                        <button class='btn btn-block btn-danger' type='button' id='PGdeleteConstruction'>Delete Construction</button>\n                    </p>\n                </li>\n            </ul>\n\n        </div>\n    </div>\n\n    <br/>\n\n    <div class=\"panel-large\" id=\"PGgraphingWindowPanel\">\n        <div class=\"panel-large-head\">\n            <i class='fa "+("0"===localStorage.PGgraphingWindowPanelShown?"fa-folder":"fa-folder-open")+"' aria-hidden='false'></i>\n            Graphing Window\n        </div>\n        <div class=\"panel-large-body "+("0"===localStorage.PGgraphingWindowPanelShown?"hidden":"")+'">\n            <ul id=\'windowList\'>\n                <li>\n                    <h4>Graph Width/Height (in pixels)</h4>\n                    <input type="text" id="graphWidth" class="graphSize" size=\'8\'> px /\n                    <input type="text" id="graphHeight" class="graphSize" size=\'8\'> px\n                </li>\n                <li>\n                    <h4>Graph Bounds</h4>\n                    x from <input type="text" id="graphxMin" class="graphBounds" size=\'8\'> to <input type="text" id="graphxMax" class="graphBounds" size=\'8\'> <br/>\n                    y from <input type="text" id="graphyMin" class="graphBounds" size=\'8\'> to <input type="text" id="graphyMax" class="graphBounds" size=\'8\'>\n                </li>\n                <li>\n                    <h4>Distance Between Ticks (X/Y)</h4>\n                    <input type="text" id="graphXTicksDistance" class="ticksDistance" size=\'8\'> / <input type="text" id="graphYTicksDistance" class="ticksDistance" size=\'8\'>\n                </li>\n                <li>\n                    <h4>Number of Minor Ticks (X/Y)</h4>\n                    <input type="text" id="graphXMinorTicks" class="graphMinorTicks" size=\'8\'> / <input type="text" id="graphYMinorTicks" class="graphMinorTicks" size=\'8\'>\n                </li>\n                <li>\n                    <h4>Axis Labels</h4>\n                    x-axis: <input type="text" id="graphxLabel" class="axisLabel" size=\'8\'> <br>\n                    y-axis: <input type="text" id="graphyLabel" class="axisLabel" size=\'8\'> Vertical? <input type="checkbox" id="verticalyLabel">\n                </li>\n                <li>\n                    <h4>Show Axes</h4>\n                    <input type="range" id="graphShowAxes" min=\'0\' max=\'1\' value=\'1\' class=\'short-range\'>\n                </li>\n                <li>\n                    <h4>Global Font Size</h4>\n                    <input type="text" id="graphFontSize" size=\'8\'> px\n                </li>\n            </ul>\n        </div>\n    </div>\n\n    <br>\n\n    <div class="panel-large" id="PGelementPanel">\n        <div class="panel-large-head">\n            <i class=\'fa '+("0"===localStorage.PGelementPanelShown?"fa-folder":"fa-folder-open")+"' aria-hidden='false'></i>\n            Add Elements\n        </div>\n        <div class=\"panel-large-body "+("0"===localStorage.PGelementPanelShown?"hidden":"")+"\">\n            <div id=\"addNew\">\n                <p id='newElementTypeContainer'>\n                    <select name=\"newElementType\" id=\"newElementType\">\n                        <option value=\"0\">Choose one...</option>\n                        <option value='functiongraph'>Function Graph</option>\n                        <option value='curve'>Curve</option>\n                        <option value=\"text\">Text</option>\n                        <option value='point'>Point</option>\n                        <option value=\"line\">Line</option>\n                        <option value=\"circle\">Circle</option>\n                        <option value=\"inequality\">Inequality</option>\n                    </select>\n                    with ID: <input type='text' id='newElementId' size='8'/>\n                </p>\n                <p>\n                    <button type='button' id='newElementAddButton' class='btn'>Create the Element</button>\n                </p>\n            </div>\n\n            <ul id='elementList'>\n\n            </ul>\n        </div>\n    </div>\n    ";$("#sidebar").html(sb),PG.loadConstructionList(localStorage.PGcurrentConstruction),PG.getConstruction(localStorage.PGcurrentConstruction),PG.loadConstruction(localStorage.PGcurrentConstruction)}),JXG.Options.layer={numlayers:20,text:9,point:9,glider:9,arc:8,line:7,circle:6,curve:7,turtle:5,polygon:3,sector:3,angle:3,integral:3,axis:8,ticks:2,grid:1,image:0,trace:0},JXG.Options.text.fontSize=20,$(function(){$(window).on("keydown",function(event){if(event.ctrlKey||event.metaKey)switch(String.fromCharCode(event.which).toLowerCase()){case"s":event.preventDefault(),PG.saveConstruction(),console.log("saved");break;case"d":event.preventDefault(),PG.deleteConstruction()}}),$(".panel-large-head").on("click",function(){$(this).closest(".panel-large").find(".panel-large-body").toggleClass("hidden"),$(this).closest(".panel-large").find(".panel-large-head .fa").toggleClass("fa-folder fa-folder-open");var vis=!$(this).closest(".panel-large").find(".panel-large-body").hasClass("hidden");switch($(this).closest(".panel-large").attr("id")){case"PGgraphingWindowPanel":localStorage.PGgraphingWindowPanelShown=vis?1:0;break;case"PGelementPanel":localStorage.PGelementPanelShown=vis?1:0;break;case"PGconstructionPanel":localStorage.PGconstructionPanelShown=vis?1:0}}),$("#menubutton").on("click",function(){$("body").toggleClass("sidebar-shown")}),$("#content-overlay").on("click",function(){$("body").hasClass("modal-shown")?$("body").removeClass("modal-shown"):$("body").removeClass("sidebar-shown")}),$("#closeModal").on("click",function(){$("body").removeClass("modal-shown")}),$("#PGsaveConstruction").on("click",PG.saveConstruction),$("#PGdeleteConstruction").on("click",function(){PG.deleteConstruction()}),$("#PGconstructionSelectList").on("change",function(){$(this).val();localStorage.PGcurrentConstruction=$(this).val();try{PG.getConstruction($(this).val()),PG.loadConstruction($(this).val())}catch(err){}}),$(".graphSize").on("change",function(){PG.vars.boardWidth=parseFloat($("#graphWidth").val()),PG.vars.boardHeight=parseFloat($("#graphHeight").val());try{$("#box").css({width:PG.vars.boardWidth,height:PG.vars.boardHeight}),PG.board.resizeContainer(PG.vars.boardWidth,PG.vars.boardHeight)}catch(err){console.log(err)}}),$(".graphBounds").on("change",function(){var xmin=parseFloat($("#graphxMin").val()),xmax=parseFloat($("#graphxMax").val()),ymin=parseFloat($("#graphyMin").val()),ymax=parseFloat($("#graphyMax").val());PG.vars.bounds=[xmin,xmax,ymin,ymax];try{PG.board.setBoundingBox([xmin,ymax,xmax,ymin],!1)}catch(err){console.log(err)}}),$(".ticksDistance").on("change",function(){var xTicksDistance=parseFloat($("#graphXTicksDistance").val()),yTicksDistance=parseFloat($("#graphYTicksDistance").val());PG.vars.ticksDistance=[xTicksDistance,yTicksDistance];try{PG.tmp.xAxisTicks.setAttribute({ticksDistance:PG.vars.ticksDistance[0]}),PG.tmp.yAxisTicks.setAttribute({ticksDistance:PG.vars.ticksDistance[1]})}catch(err){console.log(err)}}),$(".graphMinorTicks").on("change",function(){var xMinorTicks=parseFloat($("#graphXMinorTicks").val()),yMinorTicks=parseFloat($("#graphYMinorTicks").val());PG.vars.minorTicks=[xMinorTicks,yMinorTicks];try{PG.tmp.xAxisTicks.setAttribute({minorTicks:xMinorTicks}),PG.tmp.yAxisTicks.setAttribute({minorTicks:yMinorTicks})}catch(err){}}),$(".axisLabel").on("change",function(){var xLabel=$("#graphxLabel").val(),yLabel=$("#graphyLabel").val();PG.vars.xLabel=xLabel,PG.vars.yLabel=yLabel;try{PG.tmp.xaxis.setAttribute({name:PG.vars.xLabel}),PG.tmp.yaxis.setAttribute({name:PG.vars.yLabel})}catch(err){console.log(err)}}),$("#verticalyLabel").on("change",function(){PG.vars.yLabelVertical=$("#verticalyLabel").is(":checked"),PG.saveConstruction(),location.reload()}),$("#graphShowAxes").on("input",function(){var show=parseInt($(this).val());PG.vars.showAxes=show,PG.tmp.xaxis.setAttribute({visible:1==show}),PG.tmp.yaxis.setAttribute({visible:1==show})}),$("#graphFontSize").on("change",function(){PG.vars.globalFontSize=parseFloat($("#graphFontSize").val()),PG.saveConstruction(),location.reload()}),$("#newElementAddButton").on("click",PG.addNewElement),$(document).on("click",".deleteItem",function(){var id=$(this).closest("li.elementItem").attr("id");PG.removeElement(id)}),$("#graphResetBoard").on("click",function(){confirm("Are you sure you want to reset all of the board settings and remove all elements?")&&(PG.dropVars(),location.reload())}),$("#graphSaveBoard").on("click",function(){PG.saveConstruction()}),$("#elementList").on("click",".attribute-folder",function(){var id=$(this).closest("li.elementItem").attr("id");$(this).toggleClass("fa-folder fa-folder-open"),PG.els[id].panelShown=$(this).hasClass("fa-folder-open"),$(this).closest("li.elementItem").find("ul").slideToggle()}),$("#elementList").on("change",".element_pointLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val();var locA=PG.pointToArray($(this).val());PG.tmp[id].setPosition(JXG.COORDS_BY_USER,[math.eval(locA[0]),math.eval(locA[1])]),PG.board.update()}),$("#elementList").on("change",".element_segmentStartLoc, .element_segmentEndLoc",function(){var id=$(this).closest("li.elementItem").attr("id"),li=$("li#"+id),startLoc=li.find(".element_segmentStartLoc").val(),endLoc=li.find(".element_segmentEndLoc").val();PG.els[id].startLoc=startLoc,PG.els[id].endLoc=endLoc,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id])}),$("#elementList").on("change",".element_funcDef",function(){var id=$(this).closest("li.elementItem").attr("id"),fd=$(this).val();PG.els[id].funcdef=fd,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_funcLB",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].lowerBound=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_funcUB",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].upperBound=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_curveX, .element_curveY",function(){var id=$(this).closest("li.elementItem").attr("id");$(this).hasClass("element_curveX")?PG.els[id].x=$(this).val():PG.els[id].y=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_textLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_text",function(){var id=$(this).closest("li.elementItem").attr("id"),text=$("li#"+id).find(".element_text").val();PG.els[id].text=text,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_circleLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_circleR",function(){var id=$(this).closest("li.elementItem").attr("id"),r=$(this).val();PG.els[id].r=r,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_ineqLine",function(){var id=$(this).closest("li.elementItem").attr("id"),line=$(this).val();PG.els[id].line=line,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_ineqInvert",function(){var id=$(this).closest("li.elementItem").attr("id"),inverse=$(this).is(":checked");PG.els[id].inverse=inverse,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("input",".element_sizeRange",function(){var id=$(this).closest("li.elementItem").attr("id"),size=$(this).val();PG.els[id].size=size,PG.tmp[id].setAttribute({size:size})}),$("#elementList").on("change",".element_nameInput",function(){var id=$(this).closest("li.elementItem").attr("id"),name=$(this).val();PG.els[id].name=name,PG.tmp[id].setAttribute({name:name})}),$("#elementList").on("change",".element_colorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].color=color,PG.tmp[id].setAttribute({color:"#"+color})}),$("#elementList").on("change",".element_strokeColorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].strokeColor=color,PG.tmp[id].setAttribute({strokeColor:"#"+color})}),$("#elementList").on("change",".element_fillColorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].fillColor=color,PG.tmp[id].setAttribute({fillColor:"#"+color})}),$("#elementList").on("input",".element_fillOpacity",function(){var id=$(this).closest("li.elementItem").attr("id"),opac=$(this).val();PG.els[id].fillOpacity=opac,PG.tmp[id].setAttribute({fillOpacity:parseFloat(opac)}),PG.board.update()}),$("#elementList").on("input",".element_strokeWidth",function(){var id=$(this).closest("li.elementItem").attr("id"),strokeWidth=$(this).val();PG.els[id].strokeWidth=strokeWidth,PG.tmp[id].setAttribute({strokeWidth:strokeWidth})}),$("#elementList").on("input",".element_dash",function(){var id=$(this).closest("li.elementItem").attr("id"),dash=$(this).val();PG.els[id].dash=dash,PG.tmp[id].setAttribute({dash:dash})}),$("#elementList").on("input",".element_arrow",function(){var id=$(this).closest("li.elementItem").attr("id"),arrow=$(this).val();PG.els[id].arrow=arrow,PG.tmp[id].setAttribute({firstArrow:2==arrow||3==arrow,lastArrow:1==arrow||3==arrow})}),$("#elementList").on("input",".element_end",function(){var id=$(this).closest("li.elementItem").attr("id"),end=$(this).val();PG.els[id].end=end,PG.tmp[id].setAttribute({straightFirst:2==end||3==end,straightLast:1==end||3==end})}),$("#elementList").on("change",".element_fontSize",function(){var id=$(this).closest("li.elementItem").attr("id"),fontSize=parseInt($(this).val());PG.els[id].fontSize=fontSize,PG.tmp[id].setAttribute({fontSize:fontSize})}),$("#elementList").on("input",".element_visible",function(){var id=$(this).closest("li.elementItem").attr("id"),visible=$(this).val();PG.els[id].visible=visible,PG.tmp[id].setAttribute({visible:0!=visible})})});
//# sourceMappingURL=main-dist.js.map