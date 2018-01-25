/**
 * @author GAO JIE@ESRI 2014
 */
var pathRegex = new RegExp(/\/[^\/]+$/);
var locationPath = location.pathname.replace(pathRegex, '');

//dojo config
var dojoConfig = {
	parseOnLad: true,
	packages: [{
		name: "config",
		location: locationPath + '/config'
	}, {
		name: "modules",
		location: locationPath + '/js/modules'
	}, {
		name: "application",
		location: locationPath + '/js/application'
	}, {
		name: "widgets",
		location: locationPath + '/js/widgets'
	}, {
		name: "renderers",
		location: locationPath + '/js/renderers'
	}, {
		name: "proxy",
		location: locationPath + '/proxy'
	}, {
		name: "utils",
		location: locationPath + '/utils'
	}]
};