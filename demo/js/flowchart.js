// This project was done as a PoC for the WSO2 PC. This content is shared only for the learning purpose of the users.
var endpointList = [];
var sourcepointList = [];
var _saveFlowchart, _loadFlowChart, elementCount = 0;
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
        helper: function () {
    	   return createElement("");
        },
        stack: ".custom",
        revert: false
	});

	//make the editor canvas droppable
    $("#canvas").droppable({
        accept: ".window",
        drop: function (event, ui) {
            if (clicked) {
    	        clicked = false;
    	        elementCount++;
    	        var name = "Window" + elementCount;
    	        var id = "flowchartWindow" + elementCount;
    	        element = createElement(id, name);
    	        drawElement(element, "#canvas", name);
    	        element = "";
	        }
        }
    });

    //take the x, y coordinates of the current mouse position
    var x, y;
    $(document).on("mousemove", function (event) {
        x = event.pageX;
        y = event.pageY;
        if (clicked) {
            properties[0].top = y - 308;
            properties[0].left = x - 308;
        }
    });

    var properties;
    var clicked = false;
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

    //load properties of a end element once the end element in the palette is clicked
    $('#endEv').mousedown(function () {
        loadProperties("window end custom jtk-node jsplumb-connected-end", "5em", "5em", "end",
            [], ["TopCenter"], false);
        clicked = true;
    });

    //create an element to be drawn on the canvas
    function createElement(id, name) {
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id).attr('name', name);
        if (properties[0].clsName.indexOf("diamond") > -1) {
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

    function getEndpoints(elementType) {
        switch(elementType) {
            case "start": return [["BottomCenter"], []];
            case "step": return [["BottomCenter"], ["TopCenter"]];
            case "decision": return [["LeftMiddle", "RightMiddle", "BottomCenter"], ["TopCenter"]];
            case "end": return [[], ["TopCenter"]];
        }
    }

    function drawElement(element, canvasId, name) {
        $(canvasId).append(element);
        _addEndpoints(name, properties[0].startpoints, properties[0].endpoints);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });
    }

    _loadFlowChart = function(flowchart) {
        var fcJson  = JSON.parse($('#fcJsonText').val());
        for(var i = 0; i < fcJson.numberOfElements; i++) {
            var node = fcJson.nodes[i];
            var endpoints = getEndpoints(node.nodeType);
            loadProperties(node.clsName, node.positionX, node.positionY, node.label, endpoints[0], endpoints[1], false);
            var element = createElement(node.elementId);
            drawElement(element, '#canvas', node.elementName);
        }

        for(var i = 0; i < fcJson.connections.length; i++) {
            var connection = fcJson.connections[i];
            jsPlumb.connect({source: connection.sourceId, target: connection.targetId});
        }
    }

    _saveFlowchart = function () {
        var totalCount = 0;
        if (elementCount > 0) {
            var nodes = [];
     
            //check whether the diagram has a start element
            var elm = $(".start.jtk-node");
            if (elm.length == 0) {
                alertify.error("The flowchart diagram should have a start element");
            } else {
                $(".jtk-node").each(function (index, element) {
                    totalCount++;
                    var $element = $(element);
                    var type = $element.attr('class').toString().split(" ")[1];
                    if (type == "step" || type == "diamond" || type == "parallelogram") {
                        nodes.push({
                            elementId: $element.attr('id'),
                            elementName: $element.attr('name'),
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
                            elementName: $element.attr('name'),
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
                        sourceId: connection.sourceId,
                        targetId: connection.targetId
                    });
                });
     
                var flowchart = {};
                flowchart.nodes = nodes;
                flowchart.connections = connections;
                flowchart.numberOfElements = totalCount;
                alert(JSON.stringify(flowchart));
                console.log(JSON.stringify(flowchart));
            }
        }
    }
});