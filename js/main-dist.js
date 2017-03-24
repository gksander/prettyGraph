"use strict";$(function(){PG.fillInputs(),PG.registerListeners(),PG.initBoard(),PG.pullStoredElements(),$("#saveConstruction").on("click",function(){PG.saveVars()}),$(window).on("keydown",function(event){if(event.ctrlKey||event.metaKey)switch(String.fromCharCode(event.which).toLowerCase()){case"s":event.preventDefault(),PG.saveVars(),console.log("saved")}}),$(".panel-large-head").on("click",function(){$(this).closest(".panel-large").find(".panel-large-body").slideToggle()}),$("#menubutton").on("click",function(){$("body").toggleClass("sidebar-shown")}),$("#content-overlay").on("click",function(){$("body").toggleClass("sidebar-shown")})});var PG={tmp:{},vars:localStorage.PGvars?JSON.parse(localStorage.PGvars):{boardWidth:400,boardHeight:400,bounds:[-5,5,-5,5],xLabel:"$x$",yLabel:"$y$",ticksDistance:[1,1],minorTicks:[1,1],globalFontSize:20,showAxes:1},board:"",els:localStorage.PGels?JSON.parse(localStorage.PGels):{}};PG.fillInputs=function(){$("#graphWidth").val(PG.vars.boardWidth),$("#graphHeight").val(PG.vars.boardHeight),$("#graphxMin").val(PG.vars.bounds[0]),$("#graphxMax").val(PG.vars.bounds[1]),$("#graphyMin").val(PG.vars.bounds[2]),$("#graphyMax").val(PG.vars.bounds[3]),$("#graphXTicksDistance").val(PG.vars.ticksDistance[0]),$("#graphYTicksDistance").val(PG.vars.ticksDistance[1]),$("#graphXMinorTicks").val(PG.vars.minorTicks[0]),$("#graphYMinorTicks").val(PG.vars.minorTicks[1]),$("#graphxLabel").val(PG.vars.xLabel),$("#graphyLabel").val(PG.vars.yLabel),$("#verticalyLabel").attr("checked",PG.vars.yLabelVertical),$("#graphShowAxes").val(PG.vars.showAxes),$("#graphFontSize").val(PG.vars.globalFontSize)},PG.registerListeners=function(){$(".graphSize").on("change",PG.changeGraphSize),$(".graphBounds").on("change",PG.changeGraphBounds),$(".ticksDistance").on("change",PG.changeTicksDistance),$(".graphMinorTicks").on("change",PG.changeMinorTicks),$(".axisLabel").on("change",PG.changeAxesLabels),$("#verticalyLabel").on("change",PG.changeyLabelOrient),$("#graphFontSize").on("change",PG.changeGlobalFontSize),$("#graphShowAxes").on("input",PG.changeShowAxes),$("#newElementType").on("change",PG.addNewElement),$(document).on("click",".deleteItem",function(){var id=$(this).closest("li.elementItem").attr("id");PG.removeElement(id)})},PG.changeGraphSize=function(){PG.vars.boardWidth=parseFloat($("#graphWidth").val()),PG.vars.boardHeight=parseFloat($("#graphHeight").val());try{$("#box").css({width:PG.vars.boardWidth,height:PG.vars.boardHeight}),PG.board.resizeContainer(PG.vars.boardWidth,PG.vars.boardHeight)}catch(err){console.log(err)}},PG.changeGraphBounds=function(){var xmin=parseFloat($("#graphxMin").val()),xmax=parseFloat($("#graphxMax").val()),ymin=parseFloat($("#graphyMin").val()),ymax=parseFloat($("#graphyMax").val());PG.vars.bounds=[xmin,xmax,ymin,ymax];try{PG.board.setBoundingBox([xmin,ymax,xmax,ymin],!1)}catch(err){console.log(err)}},PG.changeTicksDistance=function(){var xTicksDistance=parseFloat($("#graphXTicksDistance").val()),yTicksDistance=parseFloat($("#graphYTicksDistance").val());PG.vars.ticksDistance=[xTicksDistance,yTicksDistance];try{PG.tmp.xAxisTicks.setAttribute({ticksDistance:PG.vars.ticksDistance[0]}),PG.tmp.yAxisTicks.setAttribute({ticksDistance:PG.vars.ticksDistance[1]})}catch(err){console.log(err)}},PG.changeMinorTicks=function(){var xMinorTicks=parseFloat($("#graphXMinorTicks").val()),yMinorTicks=parseFloat($("#graphYMinorTicks").val());PG.vars.minorTicks=[xMinorTicks,yMinorTicks];try{PG.tmp.xAxisTicks.setAttribute({minorTicks:xMinorTicks}),PG.tmp.yAxisTicks.setAttribute({minorTicks:yMinorTicks})}catch(err){}},PG.changeAxesLabels=function(){var xLabel=$("#graphxLabel").val(),yLabel=$("#graphyLabel").val();PG.vars.xLabel=xLabel,PG.vars.yLabel=yLabel;try{PG.tmp.xaxis.setAttribute({name:PG.vars.xLabel}),PG.tmp.yaxis.setAttribute({name:PG.vars.yLabel})}catch(err){console.log(err)}},PG.changeyLabelOrient=function(){PG.vars.yLabelVertical=$("#verticalyLabel").is(":checked"),PG.saveVars(),location.reload()},PG.changeShowAxes=function(){var show=parseInt($(this).val());PG.vars.showAxes=show,PG.tmp.xaxis.setAttribute({visible:1==show}),PG.tmp.yaxis.setAttribute({visible:1==show})},PG.changeGlobalFontSize=function(){PG.vars.globalFontSize=parseFloat($("#graphFontSize").val()),PG.saveVars(),location.reload()},PG.saveVars=function(){localStorage.PGvars=JSON.stringify(PG.vars),localStorage.PGels=JSON.stringify(PG.els)},PG.dropVars=function(){localStorage.PGvars="",localStorage.PGels=""},PG.pullStoredElements=function(){for(var i in PG.els){PG.els[i].type;PG.buildElementHtml(PG.els[i]),PG.buildBoardElement(PG.els[i])}},PG.addNewElement=function(){var type=$("#newElementType").val();if(0==type)return!1;$("#newElementType").val(0);var id=Math.random().toString(36).substring(2,8);switch(PG.els[id]={id:id,type:type},type){case"functiongraph":PG.els[id].funcdef="x^2",PG.els[id].lowerBound="",PG.els[id].upperBound="",PG.els[id].strokeWidth=3,PG.els[id].strokeColor="black",PG.els[id].dash=0;break;case"point":PG.els[id].loc="(1, 2)",PG.els[id].size=3,PG.els[id].name="",PG.els[id].color="black";break;case"line":PG.els[id].startLoc="(0,0)",PG.els[id].endLoc="(2*cos(1), 2*sin(1))",PG.els[id].strokeWidth=3,PG.els[id].strokeColor="blue",PG.els[id].dash=0,PG.els[id].arrow=0,PG.els[id].ends=0,PG.els[id].visible=1;break;case"text":PG.els[id].loc="(1, 1)",PG.els[id].text="`Delta x`",PG.els[id].fontSize=PG.vars.globalFontSize,PG.els[id].anchorX=0,PG.els[id].anchorY=0,PG.els[id].color="blue";break;case"circle":PG.els[id].loc="(1,1)",PG.els[id].r=2,PG.els[id].strokeWidth=3,PG.els[id].strokeColor="black",PG.els[id].fillColor="white",PG.els[id].fillOpacity=0,PG.els[id].dash=0;break;case"inequality":PG.els[id].line="",PG.els[id].inverse=!1,PG.els[id].fillColor="red",PG.els[id].fillOpacity=.3}PG.buildElementHtml(PG.els[id]),PG.buildBoardElement(PG.els[id])},PG.removeElement=function(id){PG.board.removeObject(PG.tmp[id]),delete PG.tmp[id],delete PG.els[id],$("#"+id).remove()},PG.buildElementHtml=function(ops){switch(ops.type){case"functiongraph":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Function Graph: <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Func. Definition: <input type='text' class='element_funcDef' value='"+ops.funcdef+"' size='10'></li>\n                        <li>Lower Bound: <input type='text' class='element_funcLB' value='"+ops.lowerBound+"' size=5/></li>\n                        <li>Upper Bound: <input type='text' class='element_funcUB' value='"+ops.upperBound+"' size=5/></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"point":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Point: <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Location: <input type='text' class='element_pointLoc' size='12' value='"+ops.loc+"'/></li>\n                        <li>"+PG.buildAestheticComponent("size",{size:ops.size})+"</li>\n                        <li>"+PG.buildAestheticComponent("name",{name:ops.name})+"</li>\n                        <li>"+PG.buildAestheticComponent("color",{color:ops.color})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"line":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Line (Segment): <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Start Location: <input type='text' class='element_segmentStartLoc' size=12 value='"+ops.startLoc+"'></li>\n                        <li>Ending Location: <input type='text' class='element_segmentEndLoc' size=12 value='"+ops.endLoc+"'></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                        <li>"+PG.buildAestheticComponent("arrow",{arrow:ops.arrow})+"</li>\n                        <li>"+PG.buildAestheticComponent("end",{arrow:ops.end})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"text":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Text: <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Text: <input type='text' class='element_text' size=15 value='"+ops.text+"'/></li>\n                        <li>Location: <input type='text' class='element_textLoc' size='12' value='"+ops.loc+"'/></li>\n                        <li>"+PG.buildAestheticComponent("fontSize",{fontSize:ops.fontSize})+"</li>\n                        <li>"+PG.buildAestheticComponent("color",{color:ops.color})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            ";break;case"circle":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Circle: <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Center: <input type='text' class='element_circleLoc' size=8 value='"+ops.loc+"'></li>\n                        <li>Radius: <input type='text' class='element_circleR' size='8' value='"+ops.r+"'/></li>\n                        <li>"+PG.buildAestheticComponent("strokeWidth",{strokeWidth:ops.strokeWidth})+"</li>\n                        <li>"+PG.buildAestheticComponent("strokeColor",{strokeColor:ops.strokeColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillColor",{fillColor:ops.fillColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillOpacity",{fillOpacity:ops.fillOpacity})+"</li>\n                        <li>"+PG.buildAestheticComponent("dash",{dash:ops.dash})+"</li>\n                    </ul>\n                </li>\n            ";break;case"inequality":var os="\n                <li class='elementItem' id='"+(ops.id?ops.id:"needid")+"'>\n                    <p class='elementItemTitle'><i class=\"fa fa-times deleteItem\" aria-hidden=\"true\"></i> Inequality: <span class='elId'>"+ops.id+"</span></p>\n                    <ul>\n                        <li>Line: <input type='text' class='element_ineqLine' size=8 value='"+ops.line+"'></li>\n                        <li>Inverse: <input class='element_ineqInvert' type='checkbox' "+(ops.inverse?"checked":"")+" /></li>\n                        <li>"+PG.buildAestheticComponent("fillColor",{fillColor:ops.fillColor})+"</li>\n                        <li>"+PG.buildAestheticComponent("fillOpacity",{fillOpacity:ops.fillOpacity})+"</li>\n                        <li>"+PG.buildAestheticComponent("visible",{visible:ops.visible})+"</li>\n                    </ul>\n                </li>\n            "}$("ul#elementList").append(os)},PG.buildBoardElement=function(ops){var id=ops.id;try{switch(ops.type){case"functiongraph":var ats={fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth?ops.strokeWidth:3,strokeColor:ops.strokeColor?ops.strokeColor:"black",dash:ops.dash?ops.dash:0};PG.tmp[id]=PG.board.create("functiongraph",[function(x){return math.eval(ops.funcdef,{x:x})},ops.lowerBound?math.eval(ops.lowerBound):null,ops.upperBound?math.eval(ops.upperBound):null],ats);break;case"point":var ats={fixed:!0,name:ops.name?ops.name:"",highlight:!1,color:ops.color?ops.color:"black",showInfobox:!1,size:ops.size?ops.size:3},loc=PG.pointToArray(PG.els[id].loc);PG.tmp[ops.id]=PG.board.create("point",[math.eval(loc[0]),math.eval(loc[1])],ats);break;case"line":var ats={fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth?ops.strokeWidth:3,strokeColor:ops.strokeColor?ops.strokeColor:"black",dash:ops.dash?ops.dash:0,straightFirst:2==ops.end||3==ops.end,straightLast:1==ops.end||3==ops.end,firstArrow:2==ops.arrow||3==ops.arrow,lastArrow:1==ops.arrow||3==ops.arrow};if(ops.startLoc.indexOf("(")>-1)var s=PG.pointToArray(ops.startLoc),start=[math.eval(s[0]),math.eval(s[1])];else var start=PG.tmp[ops.startLoc];if(ops.endLoc.indexOf("(")>-1)var e=PG.pointToArray(ops.endLoc),end=[math.eval(e[0]),math.eval(e[1])];else var end=PG.tmp[ops.endLoc];PG.tmp[id]=PG.board.create("line",[start,end],ats);break;case"text":var ats={highlight:!1,anchorX:ops.anchorX==-1?"right":0==ops.anchorX?"middle":"left",anchorY:ops.anchorY==-1?"top":0==ops.anchorY?"middle":"bottom",fontSize:ops.fontSize,color:ops.color,useMathJax:!0};if(ops.loc.indexOf("(")>-1){var loc=PG.pointToArray(ops.loc);PG.tmp[id]=PG.board.create("text",[math.eval(loc[0]),math.eval(loc[1]),function(){return ops.text}],ats)}else PG.tmp[id]=PG.board.create("text",[function(){return PG.tmp[ops.loc].X()},function(){return PG.tmp[ops.loc].Y()},function(){return ops.text}],ats);break;case"circle":var ats={fixed:!0,highlight:!1,strokeWidth:ops.strokeWidth,strokeColor:ops.strokeColor,fillColor:ops.fillColor,fillOpacity:ops.fillOpacity,dash:ops.dash};if(ops.loc.indexOf("(")>-1)var s=PG.pointToArray(ops.loc),start=[math.eval(s[0]),math.eval(s[1])];else var start=PG.tmp[ops.loc];PG.tmp[id]=PG.board.create("circle",[start,math.eval(ops.r)],ats);break;case"inequality":var ats={fixed:!0,highlight:!1,fillColor:ops.fillColor,fillOpacity:ops.fillOpacity,inverse:ops.inverse};PG.tmp[id]=PG.board.create("inequality",[PG.tmp[ops.line]],ats)}}catch(err){}},PG.buildAestheticComponent=function(type,ops){switch(type){case"size":return"\n                Size: <input class='element_sizeRange long-range' type='range' min='1' max='9' step='1' value='"+(ops.size?ops.size:3)+"'>\n            ";case"name":return"\n                Name: <input class='element_nameInput' type='text' size=9 value='"+(ops.name?ops.name:"")+"' />\n            ";case"color":return"\n                Color: <input class='element_colorInput' type='text' size=9 value='"+(ops.color?ops.color:"")+"'/>\n            ";case"strokeColor":return"\n                Stroke Color: <input class='element_strokeColorInput' type='text' size=9 value='"+(ops.strokeColor?ops.strokeColor:"")+"'/>\n            ";case"fillColor":return"\n                Fill Color: <input class='element_fillColorInput' type='text' size=9 value='"+(ops.fillColor?ops.fillColor:"")+"'/>\n            ";case"fillOpacity":return"\n                Fill Opacity: <input class='element_fillOpacity long-range' type='range' min='0' max='1' step='0.01' value='"+(ops.fillOpacity?ops.fillOpacity:0)+"' />\n            ";case"strokeWidth":return"\n                Stroke Width: <input class='element_strokeWidth long-range' type='range' min='1' max='7' step='1' value='"+(ops.strokeWidth?ops.strokeWidth:3)+"'/>\n            ";case"dash":return"\n                Dash: <input class='element_dash long-range' type='range' min='0' max='6' step='1' value='"+(ops.dash?ops.dash:0)+"'/>\n            ";case"arrow":return"\n                Arrow: <input class='element_arrow medium-range' type='range' min='0' max='3' step='1' value='"+(ops.arrow?ops.arrow:0)+"'/>\n            ";case"end":return"\n                Ending: <input class='element_end medium-range' type='range' min='0' max='3' step='1' value='"+(ops.end?ops.end:0)+"'/>\n            ";case"fontSize":return"\n                Font Size: <input class='element_fontSize' type='text' size='8' value='"+(ops.fontSize?ops.fontSize:18)+"'/>\n            ";case"visible":return"\n                Visible: <input type='range' class='element_visible short-range' min='0' max='1' step='1' value='"+(ops.visible?ops.visible:1)+"'/>\n            "}},$(function(){$("#elementList").on("change",".element_pointLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val();var locA=PG.pointToArray($(this).val());PG.tmp[id].setPosition(JXG.COORDS_BY_USER,[math.eval(locA[0]),math.eval(locA[1])]),PG.board.update()}),$("#elementList").on("change",".element_segmentStartLoc, .element_segmentEndLoc",function(){var id=$(this).closest("li.elementItem").attr("id"),li=$("li#"+id),startLoc=li.find(".element_segmentStartLoc").val(),endLoc=li.find(".element_segmentEndLoc").val();PG.els[id].startLoc=startLoc,PG.els[id].endLoc=endLoc,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id])}),$("#elementList").on("change",".element_funcDef",function(){var id=$(this).closest("li.elementItem").attr("id"),fd=$(this).val();PG.els[id].funcdef=fd,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_funcLB",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].lowerBound=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_funcUB",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].upperBound=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_textLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_text",function(){var id=$(this).closest("li.elementItem").attr("id"),text=$("li#"+id).find(".element_text").val();PG.els[id].text=text,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_circleLoc",function(){var id=$(this).closest("li.elementItem").attr("id");PG.els[id].loc=$(this).val(),PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_circleR",function(){var id=$(this).closest("li.elementItem").attr("id"),r=$(this).val();PG.els[id].r=r,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_ineqLine",function(){var id=$(this).closest("li.elementItem").attr("id"),line=$(this).val();PG.els[id].line=line,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("change",".element_ineqInvert",function(){var id=$(this).closest("li.elementItem").attr("id"),inverse=$(this).is(":checked");PG.els[id].inverse=inverse,PG.board.removeObject(PG.tmp[id]),PG.buildBoardElement(PG.els[id]),PG.board.update()}),$("#elementList").on("input",".element_sizeRange",function(){var id=$(this).closest("li.elementItem").attr("id"),size=$(this).val();PG.els[id].size=size,PG.tmp[id].setAttribute({size:size})}),$("#elementList").on("change",".element_nameInput",function(){var id=$(this).closest("li.elementItem").attr("id"),name=$(this).val();PG.els[id].name=name,PG.tmp[id].setAttribute({name:name})}),$("#elementList").on("change",".element_colorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].color=color,PG.tmp[id].setAttribute({color:color})}),$("#elementList").on("change",".element_strokeColorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].strokeColor=color,PG.tmp[id].setAttribute({strokeColor:color})}),$("#elementList").on("change",".element_fillColorInput",function(){var id=$(this).closest("li.elementItem").attr("id"),color=$(this).val();PG.els[id].fillColor=color,PG.tmp[id].setAttribute({fillColor:color})}),$("#elementList").on("input",".element_fillOpacity",function(){var id=$(this).closest("li.elementItem").attr("id"),opac=$(this).val();PG.els[id].fillOpacity=opac,PG.tmp[id].setAttribute({fillOpacity:parseFloat(opac)}),PG.board.update()}),$("#elementList").on("input",".element_strokeWidth",function(){var id=$(this).closest("li.elementItem").attr("id"),strokeWidth=$(this).val();PG.els[id].strokeWidth=strokeWidth,PG.tmp[id].setAttribute({strokeWidth:strokeWidth})}),$("#elementList").on("input",".element_dash",function(){var id=$(this).closest("li.elementItem").attr("id"),dash=$(this).val();PG.els[id].dash=dash,PG.tmp[id].setAttribute({dash:dash})}),$("#elementList").on("input",".element_arrow",function(){var id=$(this).closest("li.elementItem").attr("id"),arrow=$(this).val();PG.els[id].arrow=arrow,PG.tmp[id].setAttribute({firstArrow:2==arrow||3==arrow,lastArrow:1==arrow||3==arrow})}),$("#elementList").on("input",".element_end",function(){var id=$(this).closest("li.elementItem").attr("id"),end=$(this).val();PG.els[id].end=end,PG.tmp[id].setAttribute({straightFirst:2==end||3==end,straightLast:1==end||3==end})}),$("#elementList").on("change",".element_fontSize",function(){var id=$(this).closest("li.elementItem").attr("id"),fontSize=parseInt($(this).val());PG.els[id].fontSize=fontSize,PG.tmp[id].setAttribute({fontSize:fontSize})}),$("#elementList").on("input",".element_visible",function(){var id=$(this).closest("li.elementItem").attr("id"),visible=$(this).val();PG.els[id].visible=visible,PG.tmp[id].setAttribute({visible:0!=visible})})}),PG.initBoard=function(){$("#box").css({width:PG.vars.boardWidth,height:PG.vars.boardHeight}),PG.board=JXG.JSXGraph.initBoard("box",{boundingBox:[PG.vars.bounds[0],PG.vars.bounds[3],PG.vars.bounds[1],PG.vars.bounds[2]],axis:!1,showCopyright:!1,pan:{enabled:!0,needshift:!0},zoom:{factorX:1.25,factorY:1.25,needshift:!0,wheel:!0},showNavigation:!1}),PG.tmp.xaxis=PG.board.create("axis",[[0,0],[1,0]],{strokeColor:"black",strokeWidth:2,highlight:!1,name:PG.vars.xLabel,withLabel:!0,label:{position:"rt",offset:[5,5],highlight:!1,useMathJax:!0,anchorX:"right",anchorY:"bottom"}}),PG.tmp.xaxis.removeAllTicks(),PG.tmp.xAxisTicks=PG.board.create("ticks",[PG.tmp.xaxis],{ticksDistance:PG.vars.ticksDistance[0],strokeColor:"rgba(150,150,150,0.85)",majorHeight:-1,minorHeight:-1,highlight:!1,drawLabels:!0,label:{offset:[0,-5],anchorY:"top",anchorX:"middle",highlight:!1},minorTicks:PG.vars.minorTicks[0]}),PG.tmp.yaxis=PG.board.create("axis",[[0,0],[0,1]],{strokeColor:"black",strokeWidth:2,highlight:!1,name:PG.vars.yLabel,withLabel:!0,label:{display:PG.vars.yLabelVertical?"internal":"html",rotate:PG.vars.yLabelVertical?90:0,position:"rt",offset:[5,5],highlight:!1,useMathJax:!0,anchorX:PG.vars.yLabelVertical?"right":"left",anchorY:"top"}}),PG.tmp.yaxis.removeAllTicks(),PG.tmp.yAxisTicks=PG.board.create("ticks",[PG.tmp.yaxis],{ticksDistance:PG.vars.ticksDistance[1],strokeColor:"rgba(150,150,150,0.85)",majorHeight:-1,minorHeight:-1,highlight:!1,drawLabels:!0,label:{offset:[-5,0],anchorY:"middle",anchorX:"right",highlight:!1},minorTicks:PG.vars.minorTicks[1]})},JXG.Options.layer={numlayers:20,text:9,point:9,glider:9,arc:8,line:7,circle:6,curve:5,turtle:5,polygon:3,sector:3,angle:3,integral:3,axis:8,ticks:2,grid:1,image:0,trace:0},JXG.Options.text.fontSize=PG.vars.globalFontSize,PG.pointToArray=function(point){var o=point.trim();return o=o.substr(1),o=o.substring(0,o.length-1),o.split(",")};