/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.w   See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, elementCount = 0;
var jsPlumbInstance; //the jsPlumb jsPlumbInstance
var properties = []; //keeps the properties of each element
jsPlumb.ready(function () {
    var element = "";   //the element which will be appended to the canvas
    var clicked = false;    //check whether an element from the palette was clicked

    jsPlumbInstance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        //the arrow overlay for the connection
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                visible: true,
                id: "ARROW"
            }]
        ],
        Container: "canvas"
    });

    //define basic connection type
    var basicType = {
        connector: "StateMachine",
        paintStyle: {strokeStyle: "#216477", lineWidth: 4},
        hoverPaintStyle: {strokeStyle: "blue"}
    };
    jsPlumbInstance.registerConnectionType("basic", basicType);

    //style for the connector
    var connectorPaintStyle = {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },

    //style for the connector hover
        connectorHoverStyle = {
            lineWidth: 4,
            strokeStyle: "#216477",
            outlineWidth: 2,
            outlineColor: "white"
        },
        endpointHoverStyle = {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        },

    //the source endpoint definition from which a connection can be started
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "#7AB02C",
                fillStyle: "transparent",
                radius: 7,
                lineWidth: 3
            },
            isSource: true,
            connector: ["Flowchart", {stub: [40, 60], gap: 5, cornerRadius: 5, alwaysRespectStubs: true}],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            EndpointOverlays: [],
            maxConnections: -1,
            dragOptions: {},
            connectorOverlays: [
                ["Arrow", {
                    location: 1,
                    visible: true,
                    id: "ARROW",
                    direction: 1
                }]
            ]
        },

    //definition of the target endpoint the connector would end
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: {fillStyle: "#7AB02C", radius: 9},
            maxConnections: -1,
            dropOptions: {hoverClass: "hover", activeClass: "active"},
            hoverPaintStyle: endpointHoverStyle,
            isTarget: true
        };

    //set the label of the connector
    var initConn = function (connection) {
        connection.addOverlay(["Custom", {
            create:function(component) {
                return $("<input type=\"text\" value=\"\" autofocus style=\"position:absolute; width: 20px\"\/>");
            },
            location: 0.5,
            id: "label",
            cssClass: "aLabel"
        }]);

        connection.addOverlay(["Custom", {
            create:function(component) {
                return $("<button title=\"Delete the connection\"><i class=\"fa fa-trash\"><\/i><\/button>");
            },
            location: 0.2,
            id: "close",
            cssClass: "close-mark btn btn-danger",
            events:{
                click:function(){
                    jsPlumbInstance.detach(connection);
                    $(".start").css({'border': "2px solid green"})
                }
            }
        }]);

        $("input").css({
            'font-weight':'bold',
            'text-align':'center'
        });
    };

    jsPlumbInstance.bind("connection", function (connInfo, originalEvent) {
        initConn(connInfo.connection);

        connInfo.connection.bind("click", function(conn){
            $(".jtk-node").css({'outline': "none"});
            conn.showOverlay("close");
            var my = "abc";
        })
    });

    //add the endpoints for the elements
    var ep;
    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            ep = jsPlumbInstance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            sourcepointList.push(["flowchart" + toId, ep]);
            ep.canvas.setAttribute("title", "Drag a connection from here");
            ep = null;
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            ep = jsPlumbInstance.addEndpoint("flowchart" + toId, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID
            });
            endpointList.push(["flowchart" + toId, ep]);
            ep.canvas.setAttribute("title", "Drop a connection here");
            ep = null;
        }
    };

    //load properties of a given element
    function loadProperties(clsName, left, top, label, startpoints, endpoints, contenteditable) {
        properties = [];
        properties.push({
            left: left,
            top: top,
            clsName: clsName,
            label: label,
            startpoints: startpoints,
            endpoints: endpoints,
            contenteditable: contenteditable
        });
    }

    //take the x, y coordinates of the current mouse position
    var x, y;
    $( document ).on( "mousemove", function( event ) {
        x = event.pageX;
        y = event.pageY;
        if(clicked){
            properties[0].top = y - 358;
            properties[0].left = x - 308;
        }
    });

    //create an element to be drawn on the canvas
    function createElement(id) {
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id);
        if(properties[0].clsName.indexOf("diamond") > -1){
            elm.outerWidth("100px");
            elm.outerHeight("100px");
        }
        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });

        var strong = $('<strong>');
        if (properties[0].clsName == "window diamond custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none; margin-left: -5px; margin-top: -50px' " +
            "class=\"fa fa-trash fa-lg close-icon desc-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='desc-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        }
        else if (properties[0].clsName == "window parallelogram step custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon input-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='input-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label
                + "</p>";
            strong.append(p);
        }
        else if (properties[0].contenteditable) {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        } else {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = $('<p>').text(properties[0].label);
            strong.append(p);
        }
        elm.append(strong);
        return elm;
    }

    //draw elements on the canvas
    function drawElement(element, canvasId, name) {
        $(canvasId).append(element);
        _addEndpoints(name, properties[0].startpoints, properties[0].endpoints);
        makeResizable('.custom.step');
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20],
            filter: ".ui-resizable-handle"
        });
    }

    //make an element resizable
    function makeResizable(classname) {
        $(classname).resizable({
            resize: function(event, ui) {
                jsPlumbInstance.revalidate(ui.helper);
                var marginLeft = $(this).outerWidth() + 8;
                $(this).find("i").css({'margin-left': marginLeft + "px"});
            },
            handles: "all"
        });
    }

    //*********** make the elements on the palette draggable ***************
    function makeDraggable(id, className, text){
        $(id).draggable({
            helper: function(){
                return $("<div/>",{
                    text: text,
                    class:className
                });
            },
            stack: ".custom",
            revert: false
        });
    }

    makeDraggable("#startEv", "window start jsplumb-connected custom", "start");
    makeDraggable("#stepEv", "window step jsplumb-connected-step custom", "step");
    makeDraggable("#endEv", "window start jsplumb-connected-end custom", "end");

    $("#descEv").draggable({
        helper: function(){
            return createElement("");
        },
        stack: ".custom",
        revert: false
    });

    $("#inpEv").draggable({
        helper: function(){
            return createElement("");
        },
        stack: ".custom",
        revert: false
    });

    //*************************************************************************

    //make the editor canvas droppable
    $("#canvas").droppable({
        accept: ".window",
        drop: function(event, ui) {
            if (clicked) {
                clicked = false;
                elementCount++;
                var name = "Window" + elementCount;
                var id = "flowchartWindow" + elementCount;
                element = createElement(id);
                if (elementCount == 1 && element.attr("class").indexOf("start") == -1) {
                    alertify.error("The flowchart diagram should contain a start activity");
                    elementCount = 0;
                } else {
                    drawElement(element, "#canvas", name);
                }
                element = "";
            }
        }
    });

    //load properties of a start element once the start element in the palette is clicked
    $('#startEv').mousedown(function () {
        loadProperties("window start custom jtk-node jsplumb-connected", "5em", "5em", "start", ["BottomCenter"],
            [], false);
        clicked = true;
    });

    //load properties of a step element once the step element in the palette is clicked
    $('#stepEv').mousedown(function () {
        loadProperties("window step custom jtk-node jsplumb-connected-step", "5em", "5em", "step",
            ["BottomCenter"], ["TopCenter"], true);
        clicked = true;
    });

    //load properties of a decision element once the decision element in the palette is clicked
    $('#descEv').mousedown(function () {
        loadProperties("window diamond custom jtk-node jsplumb-connected-step", "5em", "5em", "decision",
            ["LeftMiddle", "RightMiddle", "BottomCenter"], ["TopCenter"], true, 100, 100);
        clicked = true;
    });

    //load properties of a decision element once the input/output element in the palette is clicked
    $('#inpEv').mousedown(function () {
        loadProperties("window parallelogram step custom jtk-node jsplumb-connected-step", "23em", "5em", "i/o",
            ["BottomCenter"], ["TopCenter"], true);
        clicked = true;
    });

    //load properties of a end element once the end element in the palette is clicked
    $('#endEv').mousedown(function () {
        loadProperties("window end custom jtk-node jsplumb-connected-end", "5em", "5em", "end",
            [], ["TopCenter"], false);
        clicked = true;
    });

    //de-select all the selected elements and hide the delete buttons and highlight the selected element
    $('#canvas').on('click', function (e) {
        $(".jtk-node").css({'outline':"none"});
        $(".close-icon").hide();
        if(e.target.getAttribute("class") != null && e.target.getAttribute("class").indexOf("jtk-demo-canvas") > -1){
            $.each(jsPlumbInstance.getConnections(), function (index, connection) {
                connection.hideOverlay("close");
            });
        }

        if(e.target.nodeName == "P") {
            e.target.parentElement.parentElement.style.outline = "4px solid red";
        }else if(e.target.nodeName == "STRONG"){
            e.target.parentElement.style.outline = "4px solid red";
        }else if(e.target.getAttribute("class") != null && e.target.getAttribute("class").indexOf("jtk-node") > -1){//when clicked the step, decision or i/o elements
            e.target.style.outline = "4px solid red";
        }
    });

    $('#canvas').on("click", '[id^="flowchartWindow"]', function(){
        $.each(jsPlumbInstance.getConnections(), function (index, connection) {
            connection.hideOverlay("close");
        });
    });

    //to make the text field resizable when typing the input text.
    $.fn.textWidth = function(text, font){//get width of text with font.  usage: $("div").textWidth();
        var temp = $('<span>').hide().appendTo(document.body).text(text || this.val() || this.text()).css('font', font || this.css('font')),
            width = temp.width();
        temp.remove();
        return width;
    };

    $.fn.autoresize = function(options){//resizes elements based on content size.  usage: $('input').autoresize({padding:10,minWidth:0,maxWidth:100});
        options = $.extend({padding:10,minWidth:0,maxWidth:10000}, options||{});
        $(this).on('input', function() {
            $(this).css('width', Math.min(options.maxWidth,Math.max(options.minWidth,$(this).textWidth() + options.padding)));
        }).trigger('input');
        return this;
    }

    //resize the label text field when typing
    $('#canvas').on('keyup', '.jsplumb-overlay.aLabel', function () {
        $(this).css('font-weight', 'bold');
        $(this).css('text-align', 'center');
        $(this).autoresize({padding:20,minWidth:20,maxWidth:100});
    });

    //when an item is selected, highlight it and show the delete icon
    $(document).on("click", ".custom", function(){
        if($(this).attr("class").indexOf("diamond") == -1) {
            var marginLeft = $(this).outerWidth() + 8 + "px";
            $(".close-icon").prop("title", "Delete the element");
            $(this).find("i").css({'margin-left': marginLeft, 'margin-top': "-10px"}).show();
        }else{
            $(this).find("i").css({'margin-left': "35px", 'margin-top': "-40px"}).show();
        }
    });

    //when the close-icon of an element is clicked, delete that element together with its endpoints
    $(document).on("click", ".close-icon", function() {
        jsPlumbInstance.remove($(this).parent().attr("id"));
        $(".start").css({'border-color': "green"});

        //if there are no elements in the canvas, ids start from 1
        if($(".jtk-node").length == 0){
            elementCount = 0;
        }

        for (var i = 0; i < endpointList.length; i++) {
            if (endpointList[i][0] == $(this).parent().attr("id")) {
                for (var j = 0; j < endpointList[i].length; j++) {
                    jsPlumbInstance.deleteEndpoint(endpointList[i][j]);
                    endpointList[i][j] = null;
                }
            }
        }

        for (var i = 0; i < sourcepointList.length; i++) {
            if (sourcepointList[i][0] == $(this).parent().attr("id")) {
                for (var j = 0; j < sourcepointList[i].length; j++) {
                    jsPlumbInstance.deleteEndpoint(sourcepointList[i][j]);
                    sourcepointList[i][j] = null;
                }
            }
        }
    });

    //save the edited flowchart to a json string
    _saveFlowchart = function () {
        var totalCount = 0;
        if (elementCount > 0) {
            var nodes = [];

            //check whether the diagram has a start element
            var elm = $(".start.jtk-node");
            if(elm.length == 0){
                alertify.error("The flowchart diagram should have a start element");
            }else{
                $(".jtk-node").each(function (index, element) {
                    totalCount++;
                    var $element = $(element);
                    var type = $element.attr('class').toString().split(" ")[1];
                    if (type == "step" || type == "diamond" || type == "parallelogram") {
                        nodes.push({
                            elementId: $element.attr('id'),
                            nodeType: type,
                            positionX: parseInt($element.css("left"), 10),
                            positionY: parseInt($element.css("top"), 10),
                            clsName: $element.attr('class').toString(),
                            label: $element.text(),
                            width: $element.outerWidth(),
                            height: $element.outerHeight()
                        });
                    } else {
                        nodes.push({
                            elementId: $element.attr('id'),
                            nodeType: $element.attr('class').toString().split(" ")[1],
                            positionX: parseInt($element.css("left"), 10),
                            positionY: parseInt($element.css("top"), 10),
                            clsName: $element.attr('class').toString(),
                            label: $element.text()
                        });
                    }
                });

                var connections = [];
                $.each(jsPlumbInstance.getConnections(), function (index, connection) {
                    connections.push({
                        connectionId: connection.id,
                        sourceUUId: connection.endpoints[0].getUuid(),
                        targetUUId: connection.endpoints[1].getUuid(),
                        label: connection.getOverlay("label").getElement().value,
                        labelWidth: connection.getOverlay("label").getElement().style.width
                    });
                });

                var flowchart = {};
                flowchart.nodes = nodes;
                flowchart.connections = connections;
                flowchart.numberOfElements = totalCount;
                flowchart.lastElementId = elementCount;

                $.ajax({
                    url: '/publisher/assets/process/apis/upload_flowchart',
                    type: 'POST',
                    data: {
                        'processName': $("#pName").val(),
                        'processVersion': $("#pVersion").val(),
                        'flowchartJson': JSON.stringify(flowchart)
                    },
                    success: function (response) {
                        alertify.success("Successfully saved the flowchart.");
                        $("#flowchartOverviewLink").attr("href", "../process/details/" + response);
                    },
                    error: function () {
                        alertify.error('Flowchart saving error');
                    }
                });
            }

        } else {
            alertify.error('Flowchart content is empty.');
        }
    }
});