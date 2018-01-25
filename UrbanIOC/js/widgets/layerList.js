define([
	'dojo/_base/declare',
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/dom',
    'dojo/on',
    'dojo/query',
	'esri/Map',
	'esri/views/SceneView',
	'dojo/domReady!'
], function(declare, esriConfig, Map, SceneView) {
	var clazz = declare('widgets.layerList', null, {
		constructor: function(options) {
			var _self = this;
			_self.options = options;
			if($('#' + _self.options.id).length < 1){
				console.error('LayerList: Cannot find DOM by id of ' + _self.options.id);
				return;
			}
			if(_self.options.layers.length < 1){
				console.error('LayerList: No Layer find.');
				return;
			}
			_self._init();
		},
		_init: function() {
			var _self = this;
			$('#' + _self.options.id).empty();
			_self._constructLayerList();
		},
		_constructLayerList: function(){
			var _self = this;
			var html = '';
			html += '<dl class="layer-list">';
			$.each(_self.options.layers, function(index, group){
				html += _self._constructLayerGroup(group);
			});
			html += '</dl>';
			$('#' + _self.options.id).html(html);
			_self._hitchZoomToEvent();
			_self._hitchSwitchVisablityEvent();
			_self._initTableScrollBar('#' + _self.options.id, 'outside');
			$(window).on('resize', function(){_self._updateTableScrollBar('#' + _self.options.id);});
		},
		_constructLayerGroup: function(group){
			var _self = this;
			var html = '';
			html += '<dt>' + group.groupName + ' <input type="checkbox" checked class="pull-right iswitch iswitch-orange" title="打开/关闭图层" name="' + group.groupName + '"></dt>';
			$.each(group.layers, function(index, layer){
				html += _self._constructLayerItem(layer);
			});
			return html;
		},
		_constructLayerItem: function(layer){
			var _self = this;
			var html = '';
			if(layer.symbol.type == 'picturePoint'){
				html = '<dd class="picturePoint" layerID="' + layer.layerId + '">' + layer.name + '<span class="pull-right zoomto" title="缩放至图层"></span><div class="symbol" style="background: url('
					+ layer.symbol.url + ') no-repeat center center;"></div></dd>';
			} else if(layer.symbol.type == 'simplePoint'){
				html = '<dd class="simplePoint" layerID="' + layer.layerId + '">' + layer.name + '<span class="pull-right zoomto" title="缩放至图层"></span><div class="symbol" style="background: '
					+ layer.symbol.color + ';"></div></dd>';
			} else if(layer.symbol.type == 'line' || layer.symbol.type == 'UniqueValueLine'){
				html = '<dd class="polyline" layerID="' + layer.layerId + '">' + layer.name + '<span class="pull-right zoomto" title="缩放至图层"></span><div class="symbol" style="background: '
					+ layer.symbol.color + ';"></div></dd>';
			} else if(layer.symbol.type == 'polygon'){
				html = '<dd class="polygon" layerID="' + layer.layerId + '">' + layer.name + '<span class="pull-right zoomto" title="缩放至图层"></span><div class="symbol" style="background: '
					+ layer.symbol.color + ';"></div></dd>';
			} else if(layer.symbol.type == 'tiledBaseMap'){
				html = '<dd class="tiled" layerID="' + layer.layerId + '">' + layer.name + '<div class="symbol" style="background: url('
					+ layer.symbol.url + ') no-repeat center center;"></div></dd>';
			} else if(layer.symbol.type == 'meshSymbol3D' || layer.symbol.type == 'polygon3D'||layer.symbol.type == 'ObjectSymbol3DLayer'){
				html = '<dd class="mesh3d" layerID="' + layer.layerId + '">' + layer.name + '<span class="pull-right zoomto" title="缩放至图层"></span><div class="symbol" style="background: url('
					+ layer.symbol.url + ') no-repeat center center;"></div></dd>';
			} else if(layer.symbol.type == 'webImage'){
				html = '<dd class="tiled" layerID="' + layer.layerId + '">' + layer.name + '<div class="symbol" style="background: url('
					+ layer.symbol.url + ') no-repeat center center;"></div></dd>';
			}
			return html;
		},
		_hitchZoomToEvent: function(){
			var _self = this;
			//for touch device
			$('.layer-list > dd').on('tap', function(e){_self._zoomToLayer($(this).attr('layerID'));});
			//for mouse operation device
			$('.zoomto').on('click', function(e){_self._zoomToLayer($(this).parent('dd').attr('layerID'));});
		},
		_hitchSwitchVisablityEvent: function(){
			var _self = this;
			//for both touch device & mouse operation device
			$('.iswitch').on('tap click', function(e){
				var groupName = $(this).attr('name');
				if(!$(this).attr('checked')){
					$(this).attr('checked', true);
					var group = $.grep(_self.options.layers, function(val, key){return val.groupName == groupName;});
					group && group.length && $.each(group[0].layers, function(index, layer){setTimeout(_self._toggleLayerVisiblity(layer.layerId, true), 1000);});
				}
				else{
					$(this).attr('checked', false);
					var group = $.grep(_self.options.layers, function(val, key){return val.groupName == groupName;});
					group && group.length && $.each(group[0].layers, function(index, layer){setTimeout(_self._toggleLayerVisiblity(layer.layerId, false), 1000);});
				}
			});
		},
		_toggleLayerVisiblity: function(layerID, visible){
			var _self = this;
			var layer = _self.options.view.map.findLayerById(layerID);
			layer && (layer.visible = visible);
		},
		_zoomToLayer: function(layerID){
			var _self = this;
			var layer = _self.options.view.map.findLayerById(layerID);
			layer && _self.options.view.goTo({
				target: layer.fullExtent,
				heading: 0,
				tilt: 0,
				zoom: 15
			});
		},
		_initTableScrollBar: function(id, position) {
			$.mCustomScrollbar.defaults.theme = "light-thin";
			$(id).mCustomScrollbar({ scrollbarPosition: position == null ? 'inside' : position, autoHideScrollbar: true });
			$(id).mCustomScrollbar('update');
		},
		_updateTableScrollBar: function(id) {
			$(id).mCustomScrollbar('update');
		},
		_destroyTableScrollBar: function(id) {
			$(id).mCustomScrollbar('destroy');
		}
	});

	return clazz;
});