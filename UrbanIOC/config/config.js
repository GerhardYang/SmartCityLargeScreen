/**
 * @author GAO JIE@ESRI 2015
 */
var http = "http://";
var https = "https://";

var configOptions = {
  "proxyUrl": "proxy/proxy.jsp",
  "portalUrl": "http://smart.arcgisonline.cn/arcgis",
  "homeExtent": {
    "center": [-118.254, 34.04],
    "zoom": 16,
    "heading": 20,
    "tilt": 60
  },
  "oprationLayers": {
    "complexLayers": [{
      "groupName": "城市交通",
      "layers": [{
        "name": "交通事故",
        "layerId": "trafficAccidents",
        /*"itemId": "3ef0f4b821884b2fbc266c41ff323e81",*/
		    "itemId": "ed2734c510304a51ad64bd3b7db1a59e",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_6.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "交通事故",
          "content": "<p>事故发生时间：{time}</p><p>事故发生地点：{location}</p><p>事故详细描述：{descp}</p><p>事故严重程度：{degree}</p>"
        }
      }, {
        "name": "占道施工",
        "layerId": "jeevesConstruction",
        // "itemId": "3c4437dc25f242078cd255ad9b8fa890",
        "itemId": "23ea990230374db4b2d8849741290e03",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_2.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "占道施工",
          "content": "<p>施工时间：{time}</p><p>施工描述：{descp}</p>"
        }
      }]
    }, {
      "groupName": "城市排水",
      "layers": [{
        "name": "溢水点",
        "layerId": "coverOverFlow",
        // "itemId": "f5f75ddc72e14d36a7c246b21c6b5897",
        "itemId": "c27021c827774215944fbbb45f0051f9",//井盖溢水点
        "visibility": true,
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_6jg3.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "溢水点-{MHOFPName}",
          "content": "<p>当前位置发生井盖溢水事故，传感器数据：</p><ul><li><b>流速:</b>{FlowSpeed}m/s</li><li><b>液位:</b>{OverFlowVa}cm</li></ul>"
        }
      }, {
        "name": "积水点",
        "layerId": "culvertWithWaterPoint",
        // "itemId": "c8084a0e75a345b3bbde535745d13ca3",
        "itemId": "b9315d0dc81f496990e0797a1cbfd10b",//涵洞积水点
        "visibility": false,
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_7qd3.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "积水点-{CulvertNam}",
          "content": "<p>当前位置发生积水事故，传感器数据：</p><ul><li><b>积水深度:</b>{WaterDepth}cm</li></ul>"
        }
      }]
    }, {
      "groupName": "城市事件",
      "layers": [{
        "name": "事件",
        "layerId": "events",
        // "itemId": "9722c934a6e047c7adcb7024248b32d9",
        "itemId": "80a4878ba1454750bb4200a4b6608576", //事件
        "visibility": true,
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon2.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      }]
    }, {
      "groupName": "基础设施",
      "layers": [{
        "name": "建筑物",
        "layerId": "buildings",
        // "itemId": "8c1eb3e2875e4cb5889e958294bec648",
        "itemId": "20577277942444dcbababc044e6525a6",
        "visibility": true,
        "symbol": {
          "type": "meshSymbol3D",
          "url": "images/building.png",
          "color": "rgba(19, 250, 10, 0.6)"
        }
      }]
    }, {
      "groupName": "基础底图",
      "layers": [{
        "name": "梦幻蓝底图",
        "layerId": "basemap",
        //"url": "https://api.mapbox.com/styles/v1/www871030/ciu3iqksi00l52itb78mkvioz/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1Ijoid3d3ODcxMDMwIiwiYSI6ImNpdTNpbXAwNjAwMWMyeW55MG1jZ3ZuNXEifQ.maUK8oSO6v41Qe1PLEH6Ww",
        "url":"https://api.mapbox.com/styles/v1/curie007/cj4t8h8rq03nh2sultpyymvb5/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiY3VyaWUwMDciLCJhIjoiY2oxZGNzNzNsMDA2ZzJ4cDVteDhsdGV6aCJ9.ceWDQ38QiXpw4LCnrqNcew",
        "copyright": "Map tiles by MapBox Design",
        "server": "api.mapbox.com",
        "symbol": {
          "type": "tiledBaseMap",
          "url": "images/buleBaseMap.png"
        }
      }]
    }],
    	"drainLayers": [{
			"groupName": "城市排水事故",
			"layers": [{
				"name": "溢水点",
				"layerId": "coverOverFlow",
				// "itemId": "f5f75ddc72e14d36a7c246b21c6b5897",
        "itemId": "c27021c827774215944fbbb45f0051f9",//井盖溢水点
				"visibility": true,
				"symbol": {
					"type": "picturePoint",
					"url": "images/icons/icon_6jg3.png",
					"size": 32
				},
				"popupTemplate": {
					"title": "溢水点-{MHOFPName}",
					"content": "<p>当前位置发生井盖溢水事故，传感器数据：</p><ul><li><b>流速:</b>{FlowSpeed}m/s</li><li><b>液位:</b>{OverFlowVa}cm</li></ul>"
				}
			}, {
				"name": "积水点",
				"layerId": "culvertWithWaterPoint",
				// "itemId": "c8084a0e75a345b3bbde535745d13ca3",
        "itemId": "b9315d0dc81f496990e0797a1cbfd10b",//涵洞积水点
				"visibility": false,
				"symbol": {
					"type": "picturePoint",
					"url": "images/icons/icon_7qd3.png",
					"size": 32
				},
				"popupTemplate": {
					"title": "积水点-{CulvertNam}",
					"content": "<p>当前位置发生积水事故，传感器数据：</p><ul><li><b>积水深度:</b>{WaterDepth}cm</li></ul>"
				}
			}]
		}, {
			"groupName": "应急设施",
			"layers": [{
				"name": "排水巡检车",
				"layerId": "RainPatrolCar",
				// "itemId": "73703fc4dbaa421085b3c8f98f207997",
        "itemId": "66c17d54e2ba4a0980ffeb053c3d667b",//EmergencyFacilityCar
				"visibility": true,
				"symbol": {
					"type": "picturePoint",
					"url": "images/icons/icon5.png",
					"size": 32
				},
				"popupTemplate": {
					"title": "排水巡检车-{no}",
					"content": "<ul><li><b>编号:</b>{no}</li><li><b>车牌号:</b>{carno}</li><li><b>所属单位:</b>{owndept}</li></ul>"
				}
			}, {
				"name": "警车",
				"layerId": "PatrolPoliceCar",
				// "itemId": "a97c9dde557c4264a1ef6428326f7157",
        "itemId": "848579054d3b47af92c7b4c929522ab7",//PatrolCar
				"visibility": true,
				"symbol": {
					"type": "picturePoint",
					"url": "images/icons/icon61.png",
					"size": 32
				},
				"popupTemplate": {
					"title": "巡逻警车-{NO}",
					"content": "<ul><li><b>编号:</b>{NO}</li><li><b>车牌号:</b>{CarNo}</li><li><b>所属单位:</b>{OwnDept}</li></ul>"
				}
			}, {
				"name": "市政单位",
				"layerId": "Dept",
				// "itemId": "95df0109177e445c8649e7be9c6fb12f",
        "itemId": "667a19ec472046b892ed3fdd6759d879",  //depart      
				"visibility": true,
				"symbol": {
					"type": "picturePoint",
					"url": "images/icons/icon3.png",
					"size": 32
				},
				"popupTemplate": {
					"title": "{DeptName}",
					"content": ""
				}
			}]
		}, {
			"groupName": "城市排水设施",
			"layers": [{
				"name": "井盖",
				"layerId": "maintenanceHole",
				// "itemId": "55cc79134707471faee3d190aa21d255",
        "itemId": "bfbcb631218c4a47a1f2562442eebbaf",//MaintenanceHole
				"visibility": false,
				"symbol": {
					"type": "simplePoint",
					"color": "rgba(248, 128, 89, 0.7)",
					"size": 4
				}
			}, {
				"name": "主线",
				"layerId": "gravityMain",
				// "itemId": "8030cb9c56534b829aa71419505f7a44",
        "itemId": "2744ded1101d4f8494d96bc1583187fa",//gravityMain
				"visibility": false,
				"symbol": {
					"type": "line",
					"color": "rgba(165, 213, 116, 0.7)",
					"width": 2
				}
			}, {
				"name": "侧线",
				"layerId": "lateralLine",
				// "itemId": "97b36f97bdae49aa98200814568f6464",
        "itemId": "9c35c814a8fd433daacbce87009be48f",//lateralLine
				"visibility": false,
				"symbol": {
					"type": "line",
					"color": "rgba(113, 194, 173, 0.7)",
					"width": 1
				}
			}]
		}, {
			"groupName": "基础设施",
			"layers": [{
				"name": "建筑物",
				"layerId": "buildings",
				//"itemId": "8c1eb3e2875e4cb5889e958294bec648",
        "itemId": "20577277942444dcbababc044e6525a6",
        "visibility": true,
				"symbol": {
					"type": "meshSymbol3D",
					"url": "images/building.png",
					"color": "rgba(19, 250, 10, 0.6)"
				}
			}]
		}, {
			"groupName": "基础底图",
			"layers": [{
				"name": "梦幻蓝底图",
				"layerId": "basemap",
				// "url": "https://api.mapbox.com/styles/v1/www871030/ciu3iqksi00l52itb78mkvioz/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1Ijoid3d3ODcxMDMwIiwiYSI6ImNpdTNpbXAwNjAwMWMyeW55MG1jZ3ZuNXEifQ.maUK8oSO6v41Qe1PLEH6Ww",
				"url":"https://api.mapbox.com/styles/v1/curie007/cj4t8h8rq03nh2sultpyymvb5/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiY3VyaWUwMDciLCJhIjoiY2oxZGNzNzNsMDA2ZzJ4cDVteDhsdGV6aCJ9.ceWDQ38QiXpw4LCnrqNcew",
        "copyright": "Map tiles by MapBox Design",
				"server": "api.mapbox.com",
				"symbol": {
					"type": "tiledBaseMap",
					"url": "images/buleBaseMap.png"
				}
			}]
		}],
    "trafficLayers": [{
      "groupName": "交通事件",
      "layers": [{
        "name": "交通事故",
        "layerId": "trafficAccidents",
        //"itemId": "3ef0f4b821884b2fbc266c41ff323e81",
        "itemId": "ed2734c510304a51ad64bd3b7db1a59e",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_6.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "交通事故",
          "content": "<p>事故发生时间：{time}</p><p>事故发生地点：{location}</p><p>事故详细描述：{descp}</p><p>事故严重程度：{degree}</p>"
        }
      }, {
        "name": "交通拥堵",
        "layerId": "trafficCongestions",
        // "itemId": "0d58be2babdc452083bc90db2bbd9aff",
        "itemId": "88547133cc9043e0914a18c24eabe865",        
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon61.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "交通拥堵",
          "content": "<p>拥堵时间：{time}</p><p>拥堵描述：{descp}</p>"
        }
      }, {
        "name": "占道施工",
        "layerId": "jeevesConstruction",
        // "itemId": "bf914f2c398b4bcdb40ca0227318e447",
        "itemId": "23ea990230374db4b2d8849741290e03",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_2.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "占道施工",
          "content": "<p>施工时间：{time}</p><p>施工描述：{descp}</p>"
        }
      }]
    }, {
      "groupName": "交通设施",
      "layers": [{
        "name": "道路摄像头",
        "layerId": "camera",
        // "itemId": "63e50911311f4089a7abcd383557bb6e",
        "itemId": "36548b012ad0446094745b855c4ca10b",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/camera.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "道路摄像头",
          "content": "<div class='col-sm-12'><div class='col-sm-7  popup-left'><p>类型：{type}</p><p>设备编号：{identi_id}</p><p>视角：{visual_ang}</p><p>位置：{location}</p></div><div class='col-sm-5 popup' id='{OBJECTID}'></div></div>"
        }
      }]
    },
    //  {
    //   "groupName": "交通状态",
    //   "layers": [{
    //     "name": "交通汇聚",
    //     "layerId": "traffic",
    //     "itemId": "9e95f4a69bdc4dee8df0cdf453f9e595",
    //     "symbol": {
    //       "type": "webImage",
    //       "url": "images/webimage.png"
    //     }
    //   }]
    // }, 
    {
      "groupName": "基础设施",
      "layers": [{
        "name": "建筑物",
        "layerId": "buildings",
        "itemId": "20577277942444dcbababc044e6525a6",
        "visibility": true,        
        "symbol": {
          "type": "meshSymbol3D",
          "url": "images/building.png",
          "color": "rgba(19, 250, 10, 0.6)"
        }
      }]
    }, {
      "groupName": "基础底图",
      "layers": [{
        "name": "梦幻蓝底图",
        "layerId": "basemap",
        // "url": "https://api.mapbox.com/styles/v1/www871030/ciu3iqksi00l52itb78mkvioz/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1Ijoid3d3ODcxMDMwIiwiYSI6ImNpdTNpbXAwNjAwMWMyeW55MG1jZ3ZuNXEifQ.maUK8oSO6v41Qe1PLEH6Ww",
        "url":"https://api.mapbox.com/styles/v1/curie007/cj4t8h8rq03nh2sultpyymvb5/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiY3VyaWUwMDciLCJhIjoiY2oxZGNzNzNsMDA2ZzJ4cDVteDhsdGV6aCJ9.ceWDQ38QiXpw4LCnrqNcew",
        "copyright": "Map tiles by MapBox Design",
        "server": "api.mapbox.com",
        "symbol": {
          "type": "tiledBaseMap",
          "url": "images/buleBaseMap.png"
        }
      }]
    }],
    "incidentLayers": [{
      "groupName": "施工管理类",
      "layers": [
      // {
      //   "name": "施工废弃料",
      //   "layerId": "sgfl",
      //   // "itemId": "2956282185f04dd8bf210a9c6c4228af",
      //   "itemId": "2956282185f04dd8bf210a9c6c4228af",//noitem
      //   "symbol": {
      //     "type": "picturePoint",
      //     "url": "images/icons/icon_9.png",
      //     "size": 32
      //   },
      //   "popupTemplate": {
      //     "title": "{ProblemSta}",
      //     "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
      //   }
      // },
       {
        "name": " 工地扬尘",
        "layerId": "gdyc",
        // "itemId": "cc095344ad3b4a81a21cf25d358cd430",
        "itemId": "e33f8caf06614ce08bed18c463a1e2c1",
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_3.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      }, {
        "name": " 施工占道",
        "layerId": "sgzd",
        // "itemId": "91fbe85138fe4d03bb6cf16edaa7d636",
        "itemId": "4ad78d547ed34b1d95473a88250e443d",        
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_10.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      }]
    }, {
      "groupName": "社会管理类",
      "layers": [{
        "name": "流动人口",
        "layerId": "lmjs",
        // "itemId": "a4fb192256d2465fa401f239d0453e2c",
        //"itemId": "edc9891375034aada260710882371faf",//道路积水 
        "itemId": "eb8249f4e8e04b08bb63011aa9ade7b6",//道路积水       
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_1.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      },
      // , {
      //   "name": "重点人口",
      //   "layerId": "lmtt",
      //   "itemId": "2b11fa329f034460954f239f7f1d64d7",//noitem
      //   "symbol": {
      //     "type": "picturePoint",
      //     "url": "images/icons/icon10.png",
      //     "size": 32
      //   },
      //   "popupTemplate": {
      //     "title": "{ProblemSta}",
      //     "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
      //   }
      // },
      //  {
      //   "name": "矛盾纠纷",
      //   "layerId": "hklc",
      //   "itemId": "283405bd56f844cd9e72968240d20fe6",//noitem
      //   "symbol": {
      //     "type": "picturePoint",
      //     "url": "images/icons/icon8.png",
      //     "size": 32
      //   },
      //   "popupTemplate": {
      //     "title": "{ProblemSta}",
      //     "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
      //   }
      // },
       {
        "name": "网络舆情",
        "layerId": "xsddshps",
        // "itemId": "9b3f7766700e4f0e92d1f7f7fc748875",
        "itemId": "a4b1912ac512433c8ef0e9349275f7ae",// 下水道破损       
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon7.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      }]
    }, {
      "groupName": "街面秩序类",
      "layers": [{
        "name": "乱堆物堆料",
        "layerId": "ldwdl",
        // "itemId": "c7d86df6cd3c40ccaa96026499954a73",
        "itemId": "36aa9483d59448e2bdcc1eb3bdd0f34d",//duowuduiliao
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/icon_8.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      },
      //  {
      //   "name": "无照经营",
      //   "layerId": "wzjj",
      //   // "itemId": "95981b449fde411a9b904d438bf0b65b",
      //   "itemId": "95981b449fde411a9b904d438bf0b65b",//noitem
      //   "symbol": {
      //     "type": "picturePoint",
      //     "url": "images/icons/case5.png",
      //     "size": 32
      //   },
      //   "popupTemplate": {
      //     "title": "{ProblemSta}",
      //     "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
      //   }
      // },
       {
        "name": "机动车乱停放",
        "layerId": "jdcltf",
        // "itemId": "10c814605c144ecda37ad64acd5330c4",
        "itemId": "65f9e9be5aec4c3bbaa809785c911e86",//  机动车乱停放      
        "symbol": {
          "type": "picturePoint",
          "url": "images/icons/case5.png",
          "size": 32
        },
        "popupTemplate": {
          "title": "{ProblemSta}",
          "content": "<p>案件编号：{TaskNum}</p><p>城市案件：{ProblemDes}</p><p>案件类型：{MinorClass}</p><p>案件监管单位：{Sector}</p><p>案件监管人：{ProblemSrc}</p>"
        }
      }]
    }, {
      "groupName": "基础设施",
      "layers": [{
        "name": "建筑物",
        "layerId": "buildings",
        "itemId": "20577277942444dcbababc044e6525a6",        
        "symbol": {
          "type": "meshSymbol3D",
          "url": "images/building.png",
          "color": "rgba(19, 250, 10, 0.6)"
        }
      }]
    }, {
      "groupName": "基础底图",
      "layers": [{
        "name": "梦幻蓝底图",
        "layerId": "basemap",
        //"url": "https://api.mapbox.com/styles/v1/www871030/ciu3iqksi00l52itb78mkvioz/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1Ijoid3d3ODcxMDMwIiwiYSI6ImNpdTNpbXAwNjAwMWMyeW55MG1jZ3ZuNXEifQ.maUK8oSO6v41Qe1PLEH6Ww",
        "url":"https://api.mapbox.com/styles/v1/curie007/cj4t8h8rq03nh2sultpyymvb5/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiY3VyaWUwMDciLCJhIjoiY2oxZGNzNzNsMDA2ZzJ4cDVteDhsdGV6aCJ9.ceWDQ38QiXpw4LCnrqNcew",
        "copyright": "Map tiles by MapBox Design",
        "server": "api.mapbox.com",
        "symbol": {
          "type": "tiledBaseMap",
          "url": "images/buleBaseMap.png"
        }
      }]
    }]
  }

};