"use strict"

var TEXTURE_DEF_LOC 	= "textures\\";
var TEXTURE_OP_DEF_LOC 	= "textures\\opacity\\";
var MAP_OBJECTS_DEF_LOC = "objects\\";
var CURSOR_PATH 		= "objects\\cursor\\cursor_sans.png";

var PERLIN_HEIGHT_DET 				= 10;
var PERLIN_DETALIZATION_DET 		= 30;
var PERLIN_NOISE_MODE_ENABLED 		= false;
var PERLIN_SEED_ID 					= 0;

var GROWING_SPEED 					= 1;		//px
var ADD_MAPOBJ_MENU_ITEM_SIZE 		= 128; 		//px
var ADD_MAPOBJ_MENU_ROW_ITEM_AMOUNT	= 4;
var FPS 							= 100;
var FPS_counter 					= 0;
var FPS_now 						= 0;


var tiles = [
	new Tile( TEXTURE_DEF_LOC + "EmptyBlock.png", 	TEXTURE_DEF_LOC + "EmptyBlock.png",			"void"		), // impossible to draw. Means empty
	new Tile( TEXTURE_DEF_LOC + "DirtEntire.png", 	TEXTURE_DEF_LOC + "DirtFoundation.png",		"dirt"		),
	new Tile( TEXTURE_DEF_LOC + "BrickEntire.png", 	TEXTURE_DEF_LOC + "BrickFoundation.png",	"brick"		),
	new Tile( TEXTURE_DEF_LOC + "StoneEntire.png", 	TEXTURE_DEF_LOC + "StoneFoundation.png",	"stone"		),
	new Tile( TEXTURE_DEF_LOC + "FlowerEntire.png",	TEXTURE_DEF_LOC + "GrassFoundation.png", 	"flower"	),
	new Tile( TEXTURE_DEF_LOC + "GrassEntire.png", 	TEXTURE_DEF_LOC + "GrassFoundation.png",	"grass"		)
];

var opacityTiles = [
	new Tile( TEXTURE_DEF_LOC 	+ "EmptyBlock.png", 	TEXTURE_DEF_LOC 	+ "EmptyBlock.png", 		"void"		), // impossible to draw. Means empty
	new Tile( TEXTURE_OP_DEF_LOC + "DirtHeadOp.png", 	TEXTURE_OP_DEF_LOC 	+ "DirtFoundOp.png", 		"dirtOp"	),
	new Tile( TEXTURE_OP_DEF_LOC + "BrickHeadOp.png", 	TEXTURE_OP_DEF_LOC 	+ "BrickFoundOp.png", 		"brickOp"	),
	new Tile( TEXTURE_OP_DEF_LOC + "StoneHeadOp.png", 	TEXTURE_OP_DEF_LOC 	+ "StoneFoundOp.png", 		"stoneOp"	),
	new Tile( TEXTURE_OP_DEF_LOC + "FlowerHeadOp.png", 	TEXTURE_OP_DEF_LOC 	+ "GrassFoundOp.png",		"flowerOp"	),
	new Tile( TEXTURE_OP_DEF_LOC + "GrassHeadOp.png", 	TEXTURE_OP_DEF_LOC 	+ "GrassFoundOp.png", 		"grassOp"	)
];

var tilesOOS = [
	new Tile( TEXTURE_DEF_LOC 	+ "EmptyBlock.png", 		TEXTURE_DEF_LOC 	+ "EmptyBlock.png",			"void"	), // impossible to draw. Means empty
	new Tile( TEXTURE_OP_DEF_LOC + "DirtHeadOOS.png", 		TEXTURE_OP_DEF_LOC 	+ "DirtFoundOOS.png", 		"dirtOOS"	),
	new Tile( TEXTURE_OP_DEF_LOC + "BrickHeadOOS.png", 		TEXTURE_OP_DEF_LOC 	+ "BrickFoundOOS.png", 		"brickOOS"	),
	new Tile( TEXTURE_OP_DEF_LOC + "StoneHeadOOS.png", 		TEXTURE_OP_DEF_LOC 	+ "StoneFoundOOS.png", 		"stoneOOS"	),
	new Tile( TEXTURE_OP_DEF_LOC + "FlowerHeadOOS.png", 	TEXTURE_OP_DEF_LOC 	+ "GrassFoundOOS.png",		"flowerOOS"	),
	new Tile( TEXTURE_OP_DEF_LOC + "GrassHeadOOS.png", 		TEXTURE_OP_DEF_LOC 	+ "GrassFoundOOS.png", 		"grassOOS"	)
];

var MAP_OBJECTS_DATA = [
	{ path: MAP_OBJECTS_DEF_LOC + "Bush.png",		desc: "bush",			imgW: 64,	imgH: 64, 		sizeX: 2, sizeY: 2, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Bridge.png",		desc: "bridge",			imgW: 128,	imgH: 64, 		sizeX: 4, sizeY: 2, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Flower.png",		desc: "flower",			imgW: 32,	imgH: 64, 		sizeX: 1, sizeY: 2, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Log.png",		desc: "treelog",		imgW: 32,	imgH: 64, 		sizeX: 1, sizeY: 2, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Log2.png",		desc: "log2",			imgW: 64,	imgH: 32, 		sizeX: 2, sizeY: 1, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Log3.png",		desc: "log3",			imgW: 64,	imgH: 64, 		sizeX: 2, sizeY: 2, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Mushrooms.png",	desc: "mushrooms",		imgW: 32,	imgH: 32, 		sizeX: 1, sizeY: 1, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "Rock.png",		desc: "rock",			imgW: 32,	imgH: 32, 		sizeX: 1, sizeY: 1, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "LeafTree.png",	desc: "treeleaf",		imgW: 64,	imgH: 128, 		sizeX: 2, sizeY: 4, loaded: false },
	{ path: MAP_OBJECTS_DEF_LOC + "NeedleTree.png",	desc: "treeneedle",		imgW: 64,	imgH: 128, 		sizeX: 2, sizeY: 4, loaded: false }
];

var heightSetsContainer = [
	[ 
		{type: 1, chance: 0.7}, {type: 4, chance: 0.7}, {type: 3, chance: 0.7}, {type: 3, chance: 0.7}, {type: 4, chance: 0.7}, 
	  	{type: 3, chance: 0.7}, {type: 3, chance: 0.7}, {type: 4, chance: 0.7}, {type: 3, chance: 0.7}, {type: 3} 
	],
	[ 
		{type: 1, chance: 0.7}, {type: 1, chance: 0.7}, {type: 1, chance: 0.7}, {type: 1} 
	],
	[ 
		{type: 1, chance: 0.7}, {type: 1, chance: 0.7}, {type: 1, chance: 0.7}, {type: 1} 
	]
];




var MAP_OBJECTS_DATA_IMG = (function() {
	var img_array = [];
	for (var i = 0; i < MAP_OBJECTS_DATA.length; i++) {
		img_array[i] = {};
		img_array[i].img = new Image();
		img_array[i].img.src = MAP_OBJECTS_DATA[i].path;
	}
	return img_array;
})();