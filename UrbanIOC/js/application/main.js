define(
	["dojo/_base/declare",
    "esri/config",
    "esri/Map",
    "esri/layers/WebTileLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/views/SceneView",
    "esri/core/watchUtils",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/ExtrudeSymbol3DLayer",
    "esri/symbols/PolygonSymbol3D",
    "esri/symbols/MeshSymbol3D",
    "esri/symbols/FillSymbol3DLayer",
    "esri/symbols/LineSymbol3DLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/PopupTemplate",
    "modules/dataVisualization/dataVisualization",
    "widgets/layerList", 
    "dojo/domReady!"
    ]

, function(u, r, h, b, a, s, p, l, i, v, n, c, q, j, f, g, e, o, m, k, t) {

    var d = u("application.main", null, 
    {

        constructor: function(x) {
            var w = this;
            w.options = x;
            w._init()
        },
        _init: function() {
            var w = this;
            w._setDefaultOptions();
            w._showWelcome()
        },
        _setDefaultOptions: function() {
            var w = this;
            r.request.proxyUrl = w.options.proxyUrl;
            r.portalUrl = w.options.portalUrl;
            r.request.forceProxy = false
        },
        _initMap: function() {
            var x = this;
            var w = [],
                z = [];
            var y;
            $.each(x.options.oprationLayers.complexLayers, function(A, B) {
                $.each(B.layers, function(C, D) {
                    if (D.symbol.type == "tiledBaseMap") {
                        y = D
                    } else { w.push(D) }
                })
            });
            if (!y) {
                console.error("Cannot find BaseMap in config.");
                return
            }
            x.map = new h({ layers: [x._creatLayer(y)] });
            x.view = new l({ container: "map", map: x.map, qualityProfile: "high" });
            x.view.ui.empty("top-left");
            setTimeout(function() {
                x.view.then(function() {
                    x.view.goTo(x.options.homeExtent).then(function() {
                        x._showLoader2();
                        setTimeout(function() {
                            $.each(w, function(A, B) { z.push(x._creatLayer(B)) });
                            x.map.addMany(z);
                            setTimeout(function() {
                                x._showRightBar();
                                x._showLeftBar();
                                x._showBottomBar();
                                setTimeout(function() {
                                    x.dataVisualization = new k("leftContent",
                                        "rightContent",
                                        "bottomContent",
                                        x.view,
                                        x.options.oprationLayers.complexLayers);
                                    x._hideLoader2()
                                }, 1000)
                            }, 5000)
                        }, 1800)
                    })
                })
            }, 2800)
        },
        _creatSceneLayer: function(y) {
            var x = this;
            var w = new p({ id: y.layerId, portalItem: { id: y.itemId }, renderer: x._getBuildingMeshRender(y.symbol) });
            return w
        },
        _creatWebImageLayer: function(y) { var w = this; var x = new a({ id: y.layerId, portalItem: { id: y.itemId }, opacity: 0.6 }); return x },
        _creatLayer: function(y) {
            var w = this;
            var x;
            y.symbol.type == "tiledBaseMap" && (x = w._creatBaseMap(y));
            y.symbol.type == "webImage" && (x = w._creatWebImageLayer(y));
            y.symbol.type == "meshSymbol3D" && (x = w._creatSceneLayer(y));
            y.symbol.type != "webImage" && y.symbol.type != "meshSymbol3D" && y.symbol.type != "tiledBaseMap" && (x = w._creatRenderFeatureLayer(y));
            y.popupTemplate && (x.popupTemplate = new m({ title: y.popupTemplate.title, content: y.popupTemplate.content }));
            return x
        },
        _creatBaseMap: function(x) {
            var w = this;
            r.request.corsEnabledServers.push(x.server);
            return new b({ id: x.layerId, urlTemplate: x.url, copyright: x.copyright })
        },
        _creatFeatureLayer: function(y) {
            var w = this;
            var x = new s({ portalItem: { id: y }, renderer: w._getSimpleBuildingRender() });
            return x
        },
        _creatRenderFeatureLayer: function(x) { 
        	var w = this; var y = new s({ 
        		id: x.layerId, 
        		portalItem: { id: x.itemId }, 
        		outFields: ["*"], 
        		renderer: w._getRender(x.symbol), 
        		elevationInfo: { mode: x.symbol.type == "picturePoint" ? "relative-to-ground" : "on-the-ground", offset: 200 } 
        	}); 
        	return y 
        },
        _getRender: function(z) {
            var w = this;
            var y, x;
            z.type == "picturePoint" && (y = new g({ url: z.url, width: z.size + "px", height: z.size + "px" }));
            z.type == "simplePoint" && (y = new o({ color: z.color, size: z.size + "px", style: "circle", outline: { color: z.color, width: "0.1px" } }));
            z.type == "line" && (y = new e({ color: z.color, width: z.width + "px", style: "solid" }));
            z.type == "polygon3D" && (x = w._getSimpleBuildingRender(z));
            z.type != "polygon3D" && (x = new v({ symbol: y }));
            return x
        },
        _getSimpleBuildingRender: function(z) {
            var w = this;
            var y = new c({ symbolLayers: [new n({ material: { color: z.color } })] });
            var x = new v({ symbol: y, visualVariables: [{ type: "size", field: z.field, valueUnit: "meters" }] });
            return x
        },
        _getBuildingMeshRender: function(x) {
            var w = new q({ symbolLayers: [new j({ material: { color: x.color } })] });
            return new v({ symbol: w })
        },
        _showWelcome: function() {
            var w = this;
            var y = '<h3 class="animated_text">Intelligent Operation Center</h3>';
            y += '<h2 class="title opacity0">智慧城市综合运营管理中心</h2>';
            y += '<ul class="list-inline logo-list opacity0"><li><a href="http://www.esrichina-bj.cn/" target="_blank"><img src="images/esri.png"/></a></li><li><a href="http://www.huawei.com/cn/" target="_blank"><img src="images/huawei.png"/></a></li></ul>';
            var x = { size: 120, weight: 8, color: ["#E77826", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#E77826", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#E77826", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8"], duration: 0.35, delay: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4], fade: 0.35, individualDelays: true, easing: d3_ease.easeSinInOut.ease };
            $(".page-overlay").html(y);
            var z = new Letters($(".animated_text")[0], x);
            z.show();
            setTimeout(function() {
                $(".title").addClass("animated bounceIn");
                $(".logo-list").addClass("animated fadeInUp")
            }, 2800);
            setTimeout(function() {
                w._initMap();
                w._hideWelcome();
                w._showClock();
                w._initTOC();
                w._initWeatherPart()
            }, 4500)
        },
        _showClock: function() {
            setInterval(function() {
                var w = new Date();
                var H = w.getFullYear();
                var G = w.getMonth() + 1;
                var z = w.getDate();
                var I = w.getDay();
                var C = w.getHours();
                var B = w.getMinutes();
                var x = w.getSeconds();
                var L = (G < 10) ? "0" + G : G;
                var J = (z < 10) ? "0" + z : z;
                var K = (C < 10) ? "0" + C : C;
                var D = (B < 10) ? "0" + B : B;
                var A = (x < 10) ? "0" + x : x;
                var F = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                var y = K + " : " + D + " : " + A;
                var z = H + " " + L + " " + J + " " + F[I];
                $("#date").text(z);
                var E = "";
                E = E + '<span style="float:left">' + K + "</span>";
                E = E + '<span id="online" style="width:16px; display:block; float:left">' + ": " + "</span>";
                E = E + '<span style="float:left">' + D + "</span>";
                E = E + '<span id="online2" style="width:16px; display:block; float:left">' + ": " + "</span>";
                E = E + '<span style="float:left">' + A + "</span>";
                $("#clock").html(E)
            }, 1000)
        },
        _hideWelcome: function() {
            !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass("loaded")
        },
        _showLeftBar: function() {
            $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
        },
        _hideLeftBar: function() {
            $(".sideBar.left").removeClass("fadeInLeft").addClass("fadeOutLeft")
        },
        _showRightBar: function() {
            $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
        },
        _hideRightBar: function() {
            $(".sideBar.right").removeClass("fadeInLeft").addClass("fadeOutRight")
        },
        _showBottomBar: function() {
            $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
        },
        _hideBottomBar: function() {
            $(".bottomBar").removeClass("fadeInLeft").addClass("fadeOutDown")
        },
        _showLoader: function() {
            $(".page-overlay").html('<div class="loader"></div>');
            $(".page-overlay").hasClass("loaded") && $(".page-overlay").removeClass("loaded")
        },
        _hideLoader: function() {
            !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass("loaded")
        },
        _showLoader2: function() {
            $(".page-overlay").html('<div class="loader-2"><div class="loading-container"><div class="img-div"><img src="images/loading.gif"></div></div></div>');
            !$(".page-overlay").hasClass("clear") && $(".page-overlay").addClass("clear");
            $(".page-overlay").hasClass("loaded") && $(".page-overlay").removeClass("loaded")
        },
        _hideLoader2: function() {
            !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass("loaded");
            $(".page-overlay").hasClass("clear") && $(".page-overlay").removeClass("clear")
        },
        _initTOC: function() {
            var w = this;
            html = "";
            html += '<div class="dropdown-toggle" data-toggle="dropdown">';
            html += '<div class="tocdiv">';
            html += '<div class="weatherdetail col-sm-12" style="font-size:25px;">';
            html += '<img style="width:34px;margin-left:18px;margin-top:9px" src="images/icon.png">';
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += '<ul class="dropdown-menu tocul" style="margin:0px">';
            html += "<li>";
            html += '<div id="mapcontent">';
            html += "</div>";
            html += "</li>";
            html += "</ul>";
            $("#TOC").html(html);
            var x = new t({ id: "mapcontent", 
            	view: w.view, 
            	layers: w.options.oprationLayers.complexLayers })
        },
        _initWeatherPart: function() {
            html = "";
            html += '<div class="dropdown-toggle" data-toggle="dropdown">';
            html += '<div class="weatherdiv">';
            html += '<div class="weatherdetail col-sm-5">';
            html += '<p style="font-size: 22px; margin-bottom:3px" id="todayweather">中雨</p>';
            html += '<p style="font-size:14px" id="todaytemper">22~26°C</p>';
            html += "</div>";
            html += '<div class="weathersvg col-sm-5">';
            html += '<svg    version="1.1"   id="cloudRain"  class="climacon climacon_cloudRain weathersun" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += '<ul class="dropdown-menu weatherul" style="margin:0px">';
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期一</span>  <span style=" margin-right: 60px;">22~24°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期二</span>  <span style=" margin-right: 60px;">20~23°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期三</span>  <span style=" margin-right: 60px;">21~25°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期四</span>  <span style=" margin-right: 60px;">21~24°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期五</span>  <span style=" margin-right: 60px;">21~23°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期六</span>  <span style=" margin-right: 60px;">23~25°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg    version="1.1"  style="height:35px;" id="cloudRain"  class="climacon climacon_cloudRain" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink"   x="0px"  y="0px" viewBox="15 15 70 70"  enable-background="new 15 15 70 70"  xml:space="preserve">';
            html += '<clipPath id="cloudFillClip">';
            html += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-cloudRain">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-rain">';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- left"    d="M41.946,53.641c1.104,0,1.999,0.896,1.999,2v15.998c0,1.105-0.895,2-1.999,2s-2-0.895-2-2V55.641C39.946,54.537,40.842,53.641,41.946,53.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- middle"  d="M49.945,57.641c1.104,0,2,0.896,2,2v15.998c0,1.104-0.896,2-2,2s-2-0.896-2-2V59.641C47.945,58.535,48.841,57.641,49.945,57.641z"/>';
            html += '<path  class="climacon_component climacon_component-stroke climacon_component-stroke_rain climacon_component-stroke_rain- right"   d="M57.943,53.641c1.104,0,2,0.896,2,2v15.998c0,1.105-0.896,2-2,2c-1.104,0-2-0.895-2-2V55.641C55.943,54.537,56.84,53.641,57.943,53.641z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
            html += '<path   class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.943,64.941v-4.381c2.389-1.384,4-3.961,4-6.92c0-4.417-3.582-8-8-8c-1.601,0-3.082,0.48-4.334,1.291c-1.23-5.317-5.973-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.551,6.728,4,8.924v4.916c-4.777-2.768-8-7.922-8-13.84c0-8.835,7.163-15.997,15.998-15.997c6.004,0,11.229,3.311,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.372,11.998,12C71.941,58.863,68.602,63.293,63.943,64.941z"/>';
            html += " </g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += '<li class="weatherli"><a><span style=" margin-right: 60px;">星期日</span>  <span style=" margin-right: 60px;">21~27°C</span>';
            html += '<div class="cuteweather">';
            html += '<svg version="1.1" style="height:35px;" id="sun" class="climacon climacon_sun" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70"xml:space="preserve">';
            html += '<clipPath id="sunFillClip">';
            html += '<path d="M0,0v100h100V0H0z M50.001,57.999c-4.417,0-8-3.582-8-7.999c0-4.418,3.582-7.999,8-7.999s7.998,3.581,7.998,7.999C57.999,54.417,54.418,57.999,50.001,57.999z"/>';
            html += "</clipPath>";
            html += '<g class="climacon_iconWrap climacon_iconWrap-sun">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-sun">';
            html += '<g class="climacon_componentWrap climacon_componentWrap-sunSpoke">';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-east" d="M72.03,51.999h-3.998c-1.105,0-2-0.896-2-1.999s0.895-2,2-2h3.998c1.104,0,2,0.896,2,2S73.136,51.999,72.03,51.999z"/>';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-northEast" d="M64.175,38.688c-0.781,0.781-2.049,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l2.828-2.828c0.779-0.781,2.047-0.781,2.828,0c0.779,0.781,0.779,2.047,0,2.828L64.175,38.688z"/>';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north"    d="M50.034,34.002c-1.105,0-2-0.896-2-2v-3.999c0-1.104,0.895-2,2-2c1.104,0,2,0.896,2,2v3.999C52.034,33.106,51.136,34.002,50.034,34.002z"/>';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-northWest" d="M35.893,38.688l-2.827-2.828c-0.781-0.781-0.781-2.047,0-2.828c0.78-0.781,2.047-0.781,2.827,0l2.827,2.828c0.781,0.781,0.781,2.047,0,2.828C37.94,39.469,36.674,39.469,35.893,38.688z" />';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-west" d="M34.034,50c0,1.104-0.896,1.999-2,1.999h-4c-1.104,0-1.998-0.896-1.998-1.999s0.896-2,1.998-2h4C33.14,48,34.034,48.896,34.034,50z" />';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-southWest"  d="M35.893,61.312c0.781-0.78,2.048-0.78,2.827,0c0.781,0.78,0.781,2.047,0,2.828l-2.827,2.827c-0.78,0.781-2.047,0.781-2.827,0c-0.781-0.78-0.781-2.047,0-2.827L35.893,61.312z" />';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-south"   d="M50.034,65.998c1.104,0,2,0.895,2,1.999v4c0,1.104-0.896,2-2,2c-1.105,0-2-0.896-2-2v-4C48.034,66.893,48.929,65.998,50.034,65.998z"   />';
            html += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-southEast"  d="M64.175,61.312l2.828,2.828c0.779,0.78,0.779,2.047,0,2.827c-0.781,0.781-2.049,0.781-2.828,0l-2.828-2.827c-0.781-0.781-0.781-2.048,0-2.828C62.126,60.531,63.392,60.531,64.175,61.312z"/>';
            html += "</g>";
            html += '<g class="climacon_componentWrap climacon_componentWrap_sunBody" clip-path="url(#sunFillClip)">';
            html += '<circle class="climacon_component climacon_component-stroke climacon_component-stroke_sunBody" cx="50.034" cy="50" r="11.999"/>';
            html += "</g>";
            html += "</g>";
            html += "</g>";
            html += "</svg>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            html += "</ul>";
            $("#weather").html(html)
        }
    });

    return d
});