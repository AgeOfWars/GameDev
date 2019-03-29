"use strict";

//var MAP_OBJECTS_DATA_IMG = MAP_OBJECTS_DATA_FUNC();

var saveMapIcon 		= document.getElementById("save-map-icon"),
	loadMapIcon 		= document.getElementById("load-map-icon"),
	settingsMapIcon 	= document.getElementById("settings-map-icon"),
	addMapObjectIcon 	= document.getElementById("add-map-object-icon");
var loadDataTextArea	= document.getElementById("loadDataTextArea"),
	confirmDataMapLoad	= document.getElementById("confirmDataMapLoad");
var enterMapSettings 	= document.getElementById("enterData"),
	reDrawMapConfirm 	= document.getElementById("reDrawMap");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var wPressed 			= false, 
	sPressed 			= false, 
	spacePressed 		= false, 
	qPressed 			= false, 
	creatorMode 		= true, 
	scaleUpPressed 		= false, 
	scaleDownPressed 	= false,
	deletePressed		= false;
var camLeftPressed 		= false, 
	camDownPressed 		= false, 
	camUpPressed 		= false, 
	camRightPressed 	= false;
var addObjectMenuActive = false;

function keyDownHandler(e) 
{
    if ( e.keyCode == 87 ) 	{ wPressed 		= true; }
    if ( e.keyCode == 83 ) 	{ sPressed 		= true; }
    if ( e.keyCode == 81 ) 	{ qPressed 		= true; }
    if ( e.keyCode == 32 ) 	{ spacePressed 	= true; }

    if (e.keyCode == 37) 	{ camLeftPressed 	= true; }
    if (e.keyCode == 40) 	{ camDownPressed 	= true; }
    if (e.keyCode == 38) 	{ camUpPressed 		= true; }
    if (e.keyCode == 39) 	{ camRightPressed 	= true; }

    if (e.keyCode == 187) 	{ scaleUpPressed 	= true; }
    if (e.keyCode == 189) 	{ scaleDownPressed 	= true; }
    if (e.keyCode == 46)	{ deletePressed		= true; }

    /* Tab. Creators Mode Switch
     */
    if (e.keyCode == 9) 
    {
    	if ( creatorMode == false ) 
    	{
    		creatorMode 						= true;
    		spacePressed 						= true; // clear selected blocks
        	saveMapIcon.style.visibility 		= "visible";
        	loadMapIcon.style.visibility 		= "visible";
        	settingsMapIcon.style.visibility 	= "visible";
        	addMapObjectIcon.style.visibility 	= "visible";
        } 
        else {
        	creatorMode 						= false;
        	spacePressed 						= true;  // clear selected blocks
        	saveMapIcon.style.visibility 		= "hidden";
        	loadMapIcon.style.visibility 		= "hidden";
        	settingsMapIcon.style.visibility 	= "hidden";
        	addMapObjectIcon.style.visibility 	= "hidden";
        }
    }
}

function keyUpHandler(e) 
{
    if (e.keyCode == 87) { wPressed 	= false; }
    if (e.keyCode == 83) { sPressed 	= false; }
    if (e.keyCode == 32) { spacePressed = false; }

    if (e.keyCode == 37) { camLeftPressed 	= false; }
    if (e.keyCode == 40) { camDownPressed 	= false; }
    if (e.keyCode == 38) { camUpPressed 	= false; }
    if (e.keyCode == 39) { camRightPressed 	= false; }
}

function randomize(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function randChance() {
	return randomize(0, 100);
}

function cycleInc(a, maxv, inc, start) {
	var start = start || 0;

	if ( a + inc < maxv )
		return a + inc;
	else
		return start;
}

function returnInBounds(min, x, max) {
	return Math.max(min, Math.min(x, max));
}

function checkInBounds(min, x, max) {
	return ((min <= x) && (x <= max));
}

function getRest(a, div) {
	return a - getDiv(a, div) * div;
}

function getDiv(a, div) {
	return Math.floor(a / div);
}

function bind(f, context) {
	return function() {
		return f.apply(context, arguments);
	}
}

function inRectangle(x, y, rx, ry, rw, rh) {
	return ( rx <= x && x < rx + rw ) && ( ry <= y && y < ry + rh );
}

function module(x) {
	return x > 0 ? x : x * -1;
}

function isNumeric(x) {
	return !isNaN(parseFloat(x)) && isFinite(x);
}

function randomInteger(min, max) {
	return Math.floor(min + Math.random() * (max - min + 1));
}

function destroyFields(obj) {
	for (var key in obj) {
		delete obj[key];
	}
	return obj;
}

function addScript(src){
	var script = document.createElement('script');
	script.src = src;
	script.async = false; // чтобы гарантировать порядок
	document.head.appendChild(script);
}

function cloneObj(obj) {
	var newObj = {};
	for (var key in obj) {
		newObj[key] = obj[key];
	}
	return newObj;
} 

function FPSstat() {
	FPS_now = FPS_counter;
	FPS_counter = 0;
}

function drawFPS(wSet) {
	var ctx = wSet.animation.ctx;

	ctx.font = "25px Verdana";
	// Create gradient
	var gradient = ctx.createLinearGradient(0, 0, 100, 0);
	gradient.addColorStop("0"," magenta");
	gradient.addColorStop("0.5", "blue");
	gradient.addColorStop("1.0", "red");
	// Fill with gradient
	ctx.fillStyle = gradient;
	ctx.fillText("FPS: " + FPS_now + " ", 10, wSet.animation.canvas.height - 10);
}

function saveMapToFile() {
	var text 		= this.mapTextTransfer();
  	var filename 	= prompt("Save file name: ", "");

  	if ( filename !== null ) 
  	{
  		var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  		saveAs(blob, filename + ".txt");
  	}
}

function addMapObjByClick() {
	if (this.selectedObjectToAdd == "none")
		addObjectMenuActive = !addObjectMenuActive;

	this.selectedObjectToAdd 	= "none";
}

function drawObjectMenu(wSet) {
	var worldSets 	= wSet;
	var canvas 		= worldSets.animation.canvas;
	var context 	= worldSets.animation.ctx;

	var rowAmount 		= ADD_MAPOBJ_MENU_ROW_ITEM_AMOUNT;
	var menuItemSize 	= ADD_MAPOBJ_MENU_ITEM_SIZE;
	var rowLength		= rowAmount * menuItemSize;

	context.fillStyle = "grey";
	context.fillRect((canvas.width - rowLength) / 2, 0, rowLength, canvas.height);

	for (var i = 0; i < MAP_OBJECTS_DATA.length; i++) 
	{
		context.drawImage
		(	
			MAP_OBJECTS_DATA_IMG[i].img, 
			getRest(i, rowAmount) * menuItemSize + (canvas.width - rowLength) / 2, 	
			Math.floor(i / rowAmount) * menuItemSize, 				
			menuItemSize, 															
			menuItemSize
		);
		context.strokeStyle = "#659DBD";
		context.lineWidth	= 5;
		context.strokeRect
		(
			getRest(i, rowAmount) * menuItemSize + (canvas.width - rowLength) / 2, 	
			Math.floor(i / rowAmount) * menuItemSize, 				
			menuItemSize, 															
			menuItemSize
		);
	}

	context.lineWidth = 1;
}

function loadFromFile() {
	if (confirmDataMapLoad.style.visibility == "hidden") {
		confirmDataMapLoad.style.visibility = "visible";
		loadDataTextArea.style.visibility	= "visible";
	} else {
		confirmDataMapLoad.style.visibility = "hidden";
		loadDataTextArea.style.visibility	= "hidden";
	}
}

function reDrawMapNoBind() {
	this.stricts.maxMapWidth = document.getElementById("m_w_input").value || this.stricts.maxMapWidth;
	this.stricts.maxMapHeight = document.getElementById("m_h_input").value || this.stricts.maxMapHeight;

	if ( document.getElementById("m_w_input").value || document.getElementById("m_h_input").value )
		this.server.updateMap(this);

	var type = document.getElementById("c_t_input").value || 1;
	if ( document.getElementById("c_t_input").value ) 
	{
		var type = document.getElementById("c_t_input").value || 1;
		for (var i = 0; i < this.stricts.maxMapWidth; i++)
			for (var j = 0; j < this.stricts.maxMapHeight; j++) {
				this.localMap.requestCellbyIndex(i, j).setType( document.getElementById("c_t_input").value );
		}
	}

	this.camera.moveSpeed = document.getElementById("cam_speed_input").value || this.camera.moveSpeed;

	var type = document.getElementById("c_t_input").value || 1;

	GROWING_SPEED = document.getElementById("obj_h_s_input").value || GROWING_SPEED;
	if (FPS != document.getElementById("fps_input").value) {
		FPS = document.getElementById("fps_input").value || FPS;
		clearInterval(this.calcLoopTimer);
		this.calcLoopTimer = setInterval(this.calcLoop, 1000 / FPS);
	}

	enterMapSettings.style.visibility = "hidden";

	PERLIN_NOISE_MODE_ENABLED 		= document.getElementById("perlin-check").checked;
	PERLIN_DETALIZATION_DET 		= document.getElementById("perlin-det-det").value || PERLIN_DETALIZATION_DET;
	PERLIN_HEIGHT_DET 				= document.getElementById("perlin-h-det").value || PERLIN_HEIGHT_DET;
	PERLIN_SEED_ID 					= document.getElementById("perlin-seed-val").value || PERLIN_SEED_ID;

	if ( document.getElementById("perlin-seed-val") )
		noise.seed(PERLIN_SEED_ID);


	this.camera.spectatorsMode 	= document.getElementById("spec-check").checked;
	this.camera.viewDistance 	= document.getElementById("spec-view-dist").value || this.camera.viewDistance;
	this.camera.eyeHeight 		= document.getElementById("spec-eye-height").value || this.camera.eyeHeight;

	console.log(this.camera.spectatorsMode);

	if (PERLIN_NOISE_MODE_ENABLED)
		this.server.updateMap(this);
}

/////////////////////////////////////////////////////////////////////////////////////////////		  				/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  SETTINGS CONTAINER  	/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////         				/////////////////////////////////////////////////////////////////////////////////////////////

/*function SettingsContainer() {
	var _self = this;
	var privateSettings 	= {};
	var publicSettings 		= {};

	function getObjectsAccessMethod(fieldname) {
		for (var key in publicSettings) {
			if (fieldname == key)
				return "public";
		}
		for (var key in privateSettings) {
			if (fieldname == key)
				return "private";
		}
	}

	this.addNewSetting = function(obj, fieldname, accessMethod) {
		var container;
		switch(accessMethod) {
			case "private": container = privateSettings; 	break;
			case "public" : container = publicSettings; 	break;
			default: 		container = privateSettings;
		}

		container[fieldname] = obj;
	}

	this.getSettingsObject = function(fieldname) {
		var container;
		switch() {
			case "private": container = protectedSettings; 	break;
			case "public" : container = _self; 				break;
			default: 		container = protectedSettings;
		}

		container[fieldname] = obj;
	}
}
*/


/////////////////////////////////////////////////////////////////////////////////////////////		  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  WORLD  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////         /////////////////////////////////////////////////////////////////////////////////////////////


function World() {
	var _self 		= this;
	var worldSets 	= {};
	//var wSts 		= new SettingsContainer();

	var sb 				= bind(gameCanvasClick, worldSets);
	var st 				= bind(mouseMoveEvent, worldSets);
	worldSets.calcLoop 	= bind(calculatingLoop, worldSets);
	worldSets.animLoop 	= bind(animationLoop, worldSets);
	var saveMapFunc		= bind(saveMapToFile, worldSets);
	var loadMapFunc		= bind(loadFromFile, worldSets);
	var addMapObjFunc	= bind(addMapObjByClick, worldSets);
	var reDrawMapFunc 	= bind(reDrawMapNoBind, worldSets);
	var fpsFunc 		= bind(drawFPS, worldSets);

	worldInit();
	loadGame(worldSets);

	worldSets.calcLoopTimer = setInterval(worldSets.calcLoop, 10);
	worldSets.animLoopTimer = setInterval(worldSets.animLoop, 10);
	worldSets.fps_cycle = setInterval(FPSstat, 1000);

	enterMapSettings.style.visibility 	= "hidden";
	confirmDataMapLoad.style.visibility = "hidden";
	loadDataTextArea.style.visibility	= "hidden";

	saveMapIcon.addEventListener("click", saveMapFunc, false);
	loadMapIcon.addEventListener("click", loadMapFunc, false);
	settingsMapIcon.addEventListener("click", function() {
		if (enterMapSettings.style.visibility == "hidden") 
			enterMapSettings.style.visibility = "visible";
		else
			enterMapSettings.style.visibility = "hidden";
	}, false);
	addMapObjectIcon.addEventListener("click", addMapObjFunc, false);
	reDrawMapConfirm.addEventListener("click", reDrawMapFunc, false);

	worldSets.mapTextTransfer = function() 
	{
		var worldSets 		= this;
		var stricts 		= worldSets.stricts;
		var localMap		= worldSets.localMap;

		var cell;
		var result = "";
			result += stricts.maxMapCellSize + " ";
			result += stricts.maxMapWidth + " ";
			result += stricts.maxMapHeight + " ";

			for (var i = 0; i < stricts.maxMapHeight; i++)
				for (var j = 0; j < stricts.maxMapWidth; j++) 
				{
					cell = localMap.requestCellbyIndex(i, j);
					result += "[" + cell.getType() + ", " + cell.getHeight() + "] ";
				}

		return result;
	}

	function calculatingLoop() 
	{
		var worldSets 		= this;
		var localMap 		= worldSets.localMap;
		var selectedTiles 	= worldSets.selectedTiles;
		var tiles 			= worldSets.tiles;
		var camera 			= worldSets.camera;
		var stricts 		= worldSets.stricts;

		if ( creatorMode ) 
		{
			/* Selected blocks increase height
			*/
			if ( wPressed ) 
			{
				for ( var i = 0; i < selectedTiles.length; i++ ) 
				{
					var cell = localMap.requestCellbyIndex(selectedTiles[i].x, selectedTiles[i].y);

					cell.setHeight(returnInBounds(stricts.minCellHeight, cell.getHeight() + GROWING_SPEED, stricts.maxCellHeight));
				}
			} 

			/* Selected blocks decrease height
			 */
			else if ( sPressed ) 
			{
				for ( var i = 0; i < selectedTiles.length; i++ ) 
				{
					var cell = localMap.requestCellbyIndex(selectedTiles[i].x, selectedTiles[i].y);

					cell.setHeight(returnInBounds(stricts.minCellHeight, cell.getHeight() - GROWING_SPEED, stricts.maxCellHeight));
				}
			} 

			/* Clear blocks selection
			 */
			else if ( spacePressed ) 
			{
				selectedTiles.length = 0;
			} 

			/* Switch type of selected blocks
			 */
			else if ( qPressed ) 
			{
				for ( var i = 0; i < selectedTiles.length; i++ ) 
				{
					var cell = localMap.requestCellbyIndex( selectedTiles[i].x, selectedTiles[i].y );

					cell.setType( cycleInc( cell.getType( selectedTiles[i].h ), tiles.length, 1, 1 ), selectedTiles[i].h );
				}
				qPressed = false;
			}
			else if ( deletePressed ) 
			{
				for ( var i = 0; i < selectedTiles.length; i++ ) 
				{
					var cell = localMap.requestCellbyIndex( selectedTiles[i].x, selectedTiles[i].y );

					cell.setType( 0 );
				}
				deletePressed = false;
			}

			/* Decrease map scale view
			 */
			if ( scaleDownPressed ) 
			{
				camera.scale = Math.max( camera.scale >> 1, camera.MINCAMERASCALE );
				scaleDownPressed = false;
			}

			/* Increase map scale view
			 */
			if ( scaleUpPressed ) 
			{
				camera.scale = Math.min( camera.scale << 1, camera.MAXCAMERASCALE )
				scaleUpPressed = false;
			}

			/* Moving a camera with keyboard arrows
			 */
			var cameraStep = camera.moveSpeed * camera.scale;

			if (camDownPressed) 	camera.shiftY += cameraStep;
			if (camRightPressed) 	camera.shiftX += cameraStep;
			if (camUpPressed)		camera.shiftY -= cameraStep;
			if (camLeftPressed) 	camera.shiftX -= cameraStep;
		}

		/* acting
		 */
	}

	function animationLoop() {
		worldSets.drawMap();

		showActiveAddObject(worldSets);

		drawMapObjects(worldSets);

		if (addObjectMenuActive)
			drawObjectMenu(worldSets);

		if (worldSets.cursorL)
			worldSets.animation.ctx.drawImage(worldSets.cursor, worldSets.mouse.posX, worldSets.mouse.posY, 30, 30);

		FPS_counter++;
		drawFPS(worldSets);
	}

	function loadGame(wSet) {
		//wSet.loadingScreen();
		wSet.loadMap();
		//setTimeout(wSet.loadingScreen, 2000);
		setTimeout(wSet.drawMap, 2010);
	}

	function loadMap() {
		var _self 		= this;
		var map 		= new Map('create', _self);
		this.localMap 	= map;
		this.server.updateMap(this);
	}

	function loadMainPlayer() {

	}

	function loadingScreen() 
	{
		var _self = this;

		var activeScreen 				= false;
		var	screen_image_text_loaded 	= false;
		var	screen_image_loaded 		= false;

		var screen_image 		= new Image();
			screen_image.src 	= "images/ss_1.jpg";
			screen_image.onload = function() { screen_image_loaded = true; }

		var screen_image_text 			= new Image();
			screen_image_text.src 		= "images/loadingtext.png";
			screen_image_text.onload 	= function() { screen_image_text_loaded = true; }

		var draw = bind(function() {
			_self.animation.ctx.drawImage(screen_image, 0, 0, _self.animation.canvas.width, _self.animation.canvas.height);
			_self.animation.ctx.drawImage(screen_image_text, 100, _self.animation.canvas.height - 180, 400, 100);

		}, _self);

		return function() 
		{
			if ( !activeScreen ) {
				if ( !screen_image_loaded ) {
					var mt = setInterval( function() {
						if ( screen_image_loaded == true ) 
						{
							draw();
							clearInterval(mt);
						}
					}, 1000);
					activeScreen = !activeScreen;
					return activeScreen;
				} 
			} 
			else {
				_self.animation.ctx.clearRect(0, 0, _self.animation.canvas.width, _self.animation.canvas.height);
			}
		};
	}

	function worldInit() 
	{
		worldSets.animation 		= {};
		worldSets.animation.canvas 	= document.getElementById('canvas');
		worldSets.animation.ctx 	= canvas.getContext('2d');

		worldSets.loadingScreen 	= loadingScreen.call(worldSets);
		worldSets.selectedTiles 	= [];
		worldSets.selectedObjects 	= [];

		worldSets.loadMap 		= loadMap;
		worldSets.server 		= new Server();
		worldSets.tiles 		= worldSets.server.loadTiles();
		worldSets.mapObjects	= worldSets.server.getMapObjects();
		worldSets.drawMap 		= bind(drawMap, worldSets);
		worldSets.stricts 		= worldSets.server.getCurrentMapStricts();

		worldSets.selectedObjectToAdd = "none";

		worldSets.camera 				= {};
		worldSets.camera.scale 			= 2;
		worldSets.camera.shiftX 		= 0;
		worldSets.camera.shiftY 		= (worldSets.stricts.basicCellHeight / worldSets.camera.scale) * -1;
		worldSets.camera.moveSpeed 		= 2;
		worldSets.camera.MAXCAMERASCALE = 8;
		worldSets.camera.MINCAMERASCALE = 1;

		worldSets.camera.spectatorsMode = false;
		worldSets.camera.viewDistance 	= 5;
		worldSets.camera.eyeHeight		= 128;

		worldSets.mouse 				= {};
		worldSets.mouse.posX			= 0;
		worldSets.mouse.posY			= 0;
		worldSets.mouse.posH 			= 0;

		worldSets.animation.canvas.addEventListener("click", sb);
		worldSets.animation.canvas.addEventListener("mousemove", st);

		worldSets.cursor = new Image();
		worldSets.cursorL = false;
		worldSets.cursor.src = CURSOR_PATH;
		worldSets.cursor.onload = function() { worldSets.cursorL = true; };
	}

	function mouseMoveEvent(event) 
	{
		this.mouse.posX = event.clientX;
		this.mouse.posY = event.clientY;
	}

	function showActiveAddObject(wSet) 
	{
		var worldSets	= wSet;
		var mouse 		= worldSets.mouse;
		var objID 		= worldSets.selectedObjectToAdd
		var objCellSize = worldSets.stricts.maxObjCellSize / worldSets.camera.scale;

		if ( objID != "none" ) 
		{
			drawAddObjGrid(worldSets);

			var context = worldSets.animation.ctx;

			context.drawImage
			(	
				MAP_OBJECTS_DATA_IMG[objID].img, 
				mouse.posX - MAP_OBJECTS_DATA[objID].sizeX * objCellSize, 
				mouse.posY - MAP_OBJECTS_DATA[objID].sizeY * objCellSize, 
				MAP_OBJECTS_DATA[objID].sizeX * objCellSize, 
				MAP_OBJECTS_DATA[objID].sizeY * objCellSize
			);
		}
	}

	function gameCanvasClick(event) 
	{
		if (!addObjectMenuActive) 
		{
			if (this.selectedObjectToAdd == "none")
				selectMapCell(event, this);
			else
				setNewMapObject(this, "addObjMenu");
		}
		else 
		{
			var leftBound = (this.animation.canvas.width - 512) / 2;
			var rightBound = leftBound + 512;
			if ( checkInBounds( leftBound, event.clientX, rightBound ) ) 
			{
				var tryID = addObjectSelectedId( event, leftBound );
				if ( checkInBounds( 0, tryID, MAP_OBJECTS_DATA.length - 1 ) ) 
				{
					this.selectedObjectToAdd = tryID;
					addObjectMenuActive = false;
				}
				else {
					this.selectedObjectToAdd = "none";
				}
			}
		}
	}

	function addObjectSelectedId(event, leftBound) {
		return getDiv(event.clientY, 128) * 4 + getDiv(event.clientX - leftBound, 128);
	}

	function setNewMapObject(wSet, causedBy) 
	{
		if ( causedBy == "addObjMenu" ) 
		{	
			var worldSets 	= wSet;
			var mouse 		= worldSets.mouse;
			var location 	= getRawCordFoundObjCellClick( worldSets, {clientX: mouse.posX, clientY: mouse.posY} );
			var stricts 	= worldSets.stricts;
			var addObjectID = worldSets.selectedObjectToAdd;

			if (location.exists && !location.isVoid) 
			{
				var area = selectMapObjectArea
				( 
					worldSets, 
					location.i * stricts.worldCellsDetalization + location.objI * location.objArrSize + location.objArrSize - 1 - MAP_OBJECTS_DATA[addObjectID].sizeX + 1, 
					location.j * stricts.worldCellsDetalization + location.objJ * location.objArrSize + location.objArrSize - 1 - MAP_OBJECTS_DATA[addObjectID].sizeY + 1, 
					MAP_OBJECTS_DATA[addObjectID].sizeX, 
					MAP_OBJECTS_DATA[addObjectID].sizeY 
				);

				applyNewMapObjectOnArea(worldSets, area);
			}
		}
	}

	function selectMapCell(event, wSet) 
	{
		var worldSets			= wSet;
		var stricts 			= wSet.stricts;
		var mapCellSize 		= stricts.maxMapCellSize;
		var mapSelectLocation 	= getMapCellClickCoord( wSet );


		if (mapSelectLocation.exists) 
		{
			var select 		= {};
				select.x 		= mapSelectLocation.i;
				select.y 		= mapSelectLocation.j;
				select.h 		= mapSelectLocation.selectedHeight == -1 ? 0 : mapSelectLocation.selectedHeight;
			
			for ( var i = 0; i < worldSets.selectedTiles.length; i++ )
				if (worldSets.selectedTiles[i].x == select.x && worldSets.selectedTiles[i].y == select.y)
					return;
			wSet.selectedTiles.push(select);
		}
	}

	function selectMapObjectArea(wSet, x, y, sizeX, sizeY) 
	{
		var area = {};
			area.map = [];
			area.startX = x;
			area.startY = y;
			area.sizeX  = sizeX;
			area.sizeY 	= sizeY;

		var worldSets 	= wSet;
		var localMap 	= worldSets.localMap;
		var stricts 	= worldSets.stricts;
		var det 		= stricts.worldCellsDetalization

		for (var i = x; i < x + sizeX; i++)
			for (var j = y; j < y + sizeY; j++) 
			{
				area.map.push
				(
					localMap.requestCellbyIndex(getDiv(i, det), getDiv(j, det))
							.requestObjectCellbyIndex(getRest(i, det), getRest(j, det))
				);
			}

		return area;
	}

	function checkMapObjectArea(wSet, area) 
	{

	}

	function applyNewMapObjectOnArea(wSet, area) 
	{
		var worldSets 	= wSet;
		var obj 		= new MapObject(worldSets.selectedObjectToAdd, area);
		worldSets.mapObjects.push(obj);

		for ( var i = 0; i < area.map.length; i++ ) {
			area.map[i].push(obj);
		}

	}

	function selectMapObject(event) 
	{
		var stricts 			= this.stricts;
		var mapCellSize 		= stricts.maxMapCellSize;
		var mapSelectLocation 	= getRawCordFoundCellClick( this, {clientX: event.clientX, clientY: event.clientY} );


		if (mapSelectLocation.exists) 
		{
			var select 		= {};
				select.x 	= mapSelectLocation.i;
				select.y 	= mapSelectLocation.j;

			this.selectedObjects.push(select);
		}
	}

	/*On moderation========================================================================================================*/

	function getMapCellClickCoord(wSet) 
	{
		var worldSets 	= wSet;
		var stricts 	= worldSets.stricts;
		var mouse 		= worldSets.mouse;
		var camera 		= worldSets.camera;
		var localMap 	= worldSets.localMap;

		var result 		= {};

		var tile, cell, height, heightMap;

		var cellSize 	= stricts.maxMapCellSize / worldSets.camera.scale;

		var cSi 		= returnInBounds( 0, Math.floor( camera.shiftX / cellSize ), stricts.maxMapWidth );
		var cSj 		= returnInBounds( 0, Math.floor( ( camera.shiftY - stricts.maxCellHeight) / cellSize ), stricts.maxMapHeight );
		var cFj 		= returnInBounds( cSj, Math.ceil( ( camera.shiftY + canvas.height + stricts.maxCellHeight ) / cellSize ), stricts.maxMapHeight );

			result.x 		= mouse.posX + camera.shiftX;
			result.y 		= mouse.posY + camera.shiftY;
			result.i 		= returnInBounds( -1, getDiv( result.x, cellSize ), stricts.maxMapWidth );
			result.exists 	= checkInBounds( 0, result.i, stricts.maxMapWidth - 1 );

		var leftRest 	= camera.shiftX - cellSize * cSi;
		var topRest 	= camera.shiftY - cellSize * cSj;

		var last = {};

		if ( result.exists ) 
		{
			for ( var j = cSj; j < cFj; j++ ) 
			{
				cell = localMap.requestCellbyIndex(result.i, j);
				tile = tiles[ cell.getType() ];
				if ( tile.desc != "void" ) 
				{
					height 	= cell.getHeight() / camera.scale;
					heightMap = cell.getHeightMap();

					for ( var k = -1; k < Math.ceil(height / cellSize); k++ ) 
					{
						tile = tiles[cell.getHeightMap()[ k == -1 ? 0 : k ]];
	 					if ( tile.desc != "void" && inRectangle( mouse.posX, mouse.posY, (result.i - cSi) * cellSize - leftRest, (j - cSj) * cellSize - topRest - height + cellSize * (k + 1), cellSize, cellSize ) )
						{
							last.lastJ = j;
							last.lastHeight = k;
						} 
					}	
				}
			}
		}
		
		result.j 				= last.lastJ;
		result.selectedHeight 	= last.lastHeight;

		result.exists	= 	result.exists && checkInBounds( 0, result.j, stricts.maxMapHeight - 1 );

		return result;
	}

	function getRawCordFoundObjCellClick(wSet, event) 
	{
		var worldSets 	= wSet;
		var location 	= getRawCordFoundCellClick( worldSets, {clientX: event.clientX, clientY: event.clientY} );

		if (location.exists) 
		{
			var stricts 			= worldSets.stricts;
			var scale 				= worldSets.camera.scale;

			location.objArrSize			= Math.min( scale, stricts.worldCellsDetalization );
			location.objI 				= getDiv( location.restX, stricts.maxObjCellSize );
			location.objJ 				= getDiv( location.restY, stricts.maxObjCellSize );
		}
		
		return location;
	}

	function getRawCordFoundCellClick(wSet, event) 
	{
		var stricts 	= wSet.stricts;
		var cellSize 	= stricts.maxMapCellSize / wSet.camera.scale;

		var resultLocation 			= getClickLocation( wSet, event );
			resultLocation.i 		= returnInBounds( -1, getDiv( resultLocation.x, cellSize ), stricts.maxMapWidth );
			resultLocation.j 		= returnInBounds( -1, getDiv( resultLocation.y, cellSize ), stricts.maxMapHeight );
			resultLocation.restX 	= returnInBounds( 0, getRest( resultLocation.x, cellSize ), cellSize - 1 );
			resultLocation.restY 	= returnInBounds( 0, getRest( resultLocation.y, cellSize ), cellSize - 1 );

			resultLocation.exists	= 	checkInBounds( 0, resultLocation.i, stricts.maxMapWidth - 1 ) && 
										checkInBounds( 0, resultLocation.j, stricts.maxMapHeight - 1 );

			resultLocation.isVoid 	= wSet.tiles[wSet.localMap.requestCellbyIndex(resultLocation.i, resultLocation.j).getType()].desc == "void";

		return resultLocation;
	}

	function getClickLocation(wSet, event) 
	{
		var resultLocation 		= {};
			resultLocation.x 	= event.clientX + wSet.camera.shiftX;
			resultLocation.y 	= event.clientY + wSet.camera.shiftY + wSet.stricts.basicCellHeight / wSet.camera.scale;

		return resultLocation; 
	}

	function drawMapObjects(wSet) 
	{
		var worldSets 	= wSet;
		var context 	= worldSets.animation.ctx;
		var canvas 		= worldSets.animation.canvas;
		var stricts 	= worldSets.stricts;
		var camera 		= worldSets.camera;
		var tiles 		= worldSets.tiles;
		var localMap  	= worldSets.localMap;

		var obj;
		var objPxScale 	= stricts.maxObjCellSize / camera.scale;

		for ( var i = 0; i < worldSets.mapObjects.length; i++ ) 
		{
			obj = worldSets.mapObjects[i];

			context.drawImage
			(
				MAP_OBJECTS_DATA_IMG[obj._type].img, 
				obj._area.startX * objPxScale - camera.shiftX,
				obj._area.startY * objPxScale - camera.shiftY,
				obj._area.sizeX * objPxScale,
				obj._area.sizeY * objPxScale
			);
		}
	}

	function drawAddObjGrid(wSet) 
	{
		var worldSets 	= wSet;
		var context 	= worldSets.animation.ctx;
		var canvas 		= worldSets.animation.canvas;
		var stricts 	= worldSets.stricts;
		var camera 		= worldSets.camera;
		var tiles 		= worldSets.tiles;
		var localMap  	= worldSets.localMap;

		var gridDetalization 	= Math.max(1, stricts.worldCellsDetalization / camera.scale);
		var objCellSize 		= (stricts.maxMapCellSize / camera.scale) / gridDetalization;

		var tile, height, cell;

		var size 		= stricts.maxMapCellSize / camera.scale;
		var cSi 		= returnInBounds( 0, Math.floor( camera.shiftX / size ), stricts.maxMapWidth );
		var cSj 		= returnInBounds( 0, Math.floor( camera.shiftY / size ), stricts.maxMapHeight );
		var cFi 		= returnInBounds( cSi, Math.ceil( ( camera.shiftX + canvas.width ) / size ), stricts.maxMapWidth );
		var cFj 		= returnInBounds( cSj, Math.ceil( ( camera.shiftY + canvas.height ) / size ), stricts.maxMapHeight );
		var leftRest 	= camera.shiftX - size * cSi;
		var topRest 	= camera.shiftY - size * cSj;

		var mouse 		= worldSets.mouse;
		var location 	= getRawCordFoundObjCellClick( worldSets, {clientX: mouse.posX, clientY: mouse.posY} );
		var addObjectID = worldSets.selectedObjectToAdd;
			
		var startX = location.i * stricts.worldCellsDetalization + location.objI * location.objArrSize + location.objArrSize - 1 - MAP_OBJECTS_DATA[addObjectID].sizeX + 1, 
		 	startY = location.j * stricts.worldCellsDetalization + location.objJ * location.objArrSize + location.objArrSize - 1 - MAP_OBJECTS_DATA[addObjectID].sizeY + 1, 
		 	endX   = startX + MAP_OBJECTS_DATA[addObjectID].sizeX - 1, 
			endY   = startY + MAP_OBJECTS_DATA[addObjectID].sizeY - 1,
			lenX   = endX - startX + 1,
			lenY   = endY - startY + 1;

		context.strokeStyle = "#05386B";
		context.fillStyle = "rgba(255, 255, 255, 0.2)";

		for ( var i = cSi; i < cFi; i++ )
			for ( var j = cSj; j < cFj; j++ ) 
			{
				cell = localMap.requestCellbyIndex(i, j);
				tile = tiles[ cell.getType() ];
				if ( tile.desc != "void" ) 
				{
					height 	= cell.getHeight() / camera.scale;

					context.fillRect((i - cSi) * size - leftRest, (j - cSj) * size - topRest - height, size, size);

					for ( var k = 0; k < gridDetalization; k++ )
						for ( var l = 0; l < gridDetalization; l++ ) 
						{
							context.strokeRect
							(
								((i - cSi) * size - leftRest) 		  + k * objCellSize, 
								((j - cSj) * size - topRest - height) + l * objCellSize, 
								objCellSize, 
								objCellSize
							);
						}
				}
			}
		context.fillStyle = "rgba(11, 156, 49, 0.5)";

		objCellSize = stricts.maxObjCellSize / camera.scale;

		context.fillRect
		(
			((getDiv(startX, 4) - cSi) * size - leftRest) + getRest(startX, 4) * objCellSize, 
			((getDiv(startY, 4) - cSj) * size - topRest - height) + getRest(startY, 4) * objCellSize, 
			lenX * objCellSize, 
			lenY * objCellSize
		);

	}

	function drawMap() 
	{
		var worldSets 	= this;
		var context 	= worldSets.animation.ctx;
		var canvas 		= worldSets.animation.canvas;
		var stricts 	= worldSets.stricts;
		var camera 		= worldSets.camera;
		var tiles 		= worldSets.tiles;
		var localMap  	= worldSets.localMap;

		context.clearRect(					0, 0, canvas.width, canvas.height);							// Clear screen
		context.drawImage(tiles[0].imageF, 	0, 0, canvas.width, canvas.height);		// Draw void tile on canvas full screen

		var tile, height, cell, heightMap;

		var TILES;

		var size 		= stricts.maxMapCellSize / camera.scale;
		var cSi 		= returnInBounds( 0, Math.floor( camera.shiftX / size ), stricts.maxMapWidth );
		var cFi 		= returnInBounds( cSi, Math.ceil( ( camera.shiftX + canvas.width ) / size ), stricts.maxMapWidth );

		var cSj 		= returnInBounds( 0, Math.floor( ( camera.shiftY - stricts.maxCellHeight) / size ), stricts.maxMapHeight );
		var cFj 		= returnInBounds( cSj, Math.ceil( ( camera.shiftY + canvas.height + stricts.maxCellHeight ) / size ), stricts.maxMapHeight );

		if (PERLIN_NOISE_MODE_ENABLED)
		{
			cSj 		= returnInBounds( 0, cSj - 10, stricts.maxMapHeight );
			cFj 		= returnInBounds( cSj, cFj + 10, stricts.maxMapHeight );
		}

		var leftRest 	= camera.shiftX - size * cSi;
		var topRest 	= camera.shiftY - size * cSj;

		var clickCoord = getMapCellClickCoord(worldSets);
		var outOfView = false;

		/* Draw [][] map tiles
		 */
		for ( var i = cSi; i < cFi; i++ )
			for ( var j = cSj; j < cFj; j++ ) 
			{
				cell = localMap.requestCellbyIndex(i, j);

				if ( camera.spectatorsMode && clickCoord.exists ) 
				{
					if 	( 
							module( i - clickCoord.i ) < camera.viewDistance && 
						 	module( j - clickCoord.j ) < camera.viewDistance && 
						 	localMap.requestCellbyIndex(clickCoord.i, clickCoord.j).getHeight() + camera.eyeHeight > cell.getHeight()
						)
						TILES = tiles;
					else
						TILES = tilesOOS;
						  //TILES = opacityTiles;
				}
				else
					TILES = tiles;

				tile = TILES[ cell.getType() ];
				if ( tile.desc != "void" ) 
				{
					height 	= cell.getHeight() / camera.scale;
					heightMap = cell.getHeightMap();

					tile = TILES[cell.getHeightMap()[0]];
					context.drawImage
					(
						tile.imageH, 
						(i - cSi) * size - leftRest, 
						(j - cSj) * size - topRest - height, 
						size, 
						size
					); 

					for ( var k = 0; k < Math.ceil(height / size); k++ ) 
					{
						tile = TILES[cell.getHeightMap()[k]];
						context.drawImage
						(
							tile.imageF, 
							(i - cSi) * size - leftRest, 
							(j - cSj) * size - topRest - height + size * (k + 1),
							size, 
							size
						); 
					}
				}
			}
			if ( clickCoord.exists ) 
			{
				context.fillStyle = "rgba(30, 144, 255, 0.2)";
				height 	= localMap.requestCellbyIndex(clickCoord.i, clickCoord.j).getHeight() / camera.scale;
				context.fillRect
				(
					(clickCoord.i - cSi) * size - leftRest, 
					(clickCoord.j - cSj) * size - topRest - height + size * (clickCoord.selectedHeight + 1),
					size, 
					size
				);
			}
	}

	function inAreaToVision(cI, cJ, checkI, checkJ) {
		if (cI == checkI && cJ == checkJ)
			return 0;
		if (cI < checkI && cJ == checkJ)
			return 1;
		if (cI < checkI && cJ < checkJ)
			return 2;
		if (cI == checkI && cJ < checkJ)
			return 3;
		if (cI > checkI && cJ < checkJ)
			return 4;
		if (cI > checkI && cJ == checkJ)
			return 5;
		if (cI > checkI && cJ > checkJ)
			return 6;
		if (cI == checkI && cJ > checkJ)
			return 7;
		if (cI < checkI && cJ > checkJ)
			return 8;
	}

	function pushCollision(area, cellX, cellY, edgeLen, array) {
		switch (area) 
		{
			case 1: array.push( new Point2d(cellX, cellY) ); array.push( new Point2d(cellX, cellY + edgeLen) ); break;
			case 2: array.push( mapCell.getSide(3) ); array.push( mapCell.getSide(4) ); break;
			case 3: array.push( mapCell.getSide(4) ); break;
			case 4: array.push( mapCell.getSide(1) ); array.push( mapCell.getSide(4) ); break;
			case 5: array.push( mapCell.getSide(1) ); break;
			case 6: array.push( mapCell.getSide(1) ); array.push( mapCell.getSide(2) ); break;
			case 7: array.push( mapCell.getSide(2) ); break;
			case 8: array.push( mapCell.getSide(2) ); array.push( mapCell.getSide(3) ); break;
		}
	}

	function drawTestVision(wSet) {
		var worldSets 	= wSet;

		var context 	= worldSets.animation.ctx;
		var canvas 		= worldSets.animation.canvas;
		var stricts 	= worldSets.stricts;
		var camera 		= worldSets.camera;
		var tiles 		= worldSets.tiles;
		var localMap  	= worldSets.localMap;

		var central 	= getMapCellClickCoord(worldSets);
		var centralCell = localMap.requestCellbyIndex(central.i, central.j);

		var cSi 		= returnInBounds( 0, central.i - camera.viewDistance, stricts.maxMapWidth );
		var cFi 		= returnInBounds( cSi, central.i + camera.viewDistance + 1, stricts.maxMapWidth );
		var cSj 		= returnInBounds( 0, central.j - camera.viewDistance, stricts.maxMapHeight );
		var cFj 		= returnInBounds( cSj, central.j + camera.viewDistance + 1, stricts.maxMapHeight );

		var collisionLines = [];
		var cell;

		for (var i = cSi; i < cFi; i++)
			for (var j = cSj; j < cFj; j++) 
			{
				cell = localMap.requestCellbyIndex(i, j);
				if ( !cell.isVoid() && cell.getHeight() < centralCell + camera.eyeHeight )
					pushCollision( 
						inAreaToVision( central.i, central.j, i, j ), // area
						localMap.requestCellbyIndex( i, j ),
						collisionLines
					);
			}

	}

}

/////////////////////////////////////////////////////////////////////////////////////////////		   /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  SERVER  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////          /////////////////////////////////////////////////////////////////////////////////////////////


function Server(wSet) {
	var _self = this;
	var worldSets = wSet;
	var tileAmount = 5;

	this.loadTiles = function() {
		return tiles;
	};

	this.addNewTile = function(tile) {

	};

	this.updateMap = function(wSet) {
		for (var i = 0; i < currentMapStricts.maxMapWidth; i++)
			for (var j = 0; j < currentMapStricts.maxMapHeight; j++) {
				if (PERLIN_NOISE_MODE_ENABLED)
					wSet.localMap.requestCellbyIndex(i, j).createNew(
						1, 
						returnInBounds(currentMapStricts.minCellHeight, noise.perlin2(i / PERLIN_DETALIZATION_DET, j / PERLIN_DETALIZATION_DET) * 100 * PERLIN_HEIGHT_DET, currentMapStricts.maxCellHeight), 
						currentMapStricts.maxMapCellSize, 
						currentMapStricts.worldCellsDetalization
					);
				else 
					wSet.localMap.requestCellbyIndex(i, j).createNew(
						1, 
						wSet.stricts.basicCellHeight, 
						currentMapStricts.maxMapCellSize, 
						currentMapStricts.worldCellsDetalization
					);
			}
	}

	this.getCurrentMapStricts = function() {
		var obj = {};

  		obj.maxMapWidth 	= 150;
  		obj.maxMapHeight 	= 150;
  		obj.worldCellsDetalization = 4; // if 4 mean [4][4] array describes object dislocation
  		obj.maxMapCellSize 	= 128; //px
  		obj.maxObjCellSize	= obj.maxMapCellSize / obj.worldCellsDetalization;

		obj.maxCellHeight 	= 512;
		obj.minCellHeight 	= 0;

		obj.basicCellHeight = 100;
  		
  		return obj;
	}

	this.getGlobalStricts = function() {
  		var obj = {};

  		obj.maxMapWidth 	= 200;
  		obj.maxMapHeight 	= 200;
  		obj.maxMapCellSize 	= 64; //px

  		return obj;
	}

	this.getMapObjects = function() 
	{
		return [];
	}

	this.addMapObject = function(type, setCornerLeftCord, setCornerTopCord) 
	{

	}

	var globalStricts 		= _self.getGlobalStricts();
	var currentMapStricts 	= _self.getCurrentMapStricts();
}

/////////////////////////////////////////////////////////////////////////////////////////////		/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  MAP  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////       /////////////////////////////////////////////////////////////////////////////////////////////


function Map(action, wSet) {
	if (!(this instanceof Map))
		return new Map(action);

	var _self = this;
	action = action || 'create';

	var mapCells = executeAction();

	function checkAccess() {
		if (!(this instanceof Map))
			throw new ProtectedError();
		if (this.constructor === Map)
			throw new ProtectedError();
	}

	Object.defineProperty(_self, 'generateNewMap', {
        enumerable: false, // скроим метод из for-in циклов 
        configurable:false, // запретим переопределять это свойство
        value: function(maxWidth, maxHeight){
            // Раз мы здесь, значит, нас вызвали либо как публичный метод на экземпляре класса Base, либо из производных классов
            checkAccess.call(this); // Проверяем доступ.
            generateNewMap(maxWidth, maxHeight);
        }
  	});

  	function generateNewMap(maxWidth, maxHeight) {
  		var _mapServerStricts = wSet.stricts;
  		maxWidth = maxWidth || _mapServerStricts.maxMapWidth;
  		maxHeight = maxHeight || _mapServerStricts.maxMapHeight;

  		var map = [];

  		for (var i = 0; i < maxWidth; i++) {
  			map[i] = [];

  			for (var j = 0; j < maxHeight; j++) {
  				map[i][j] = new MapCell();
  			}
  		}
  		return map;
  	}

  	function loadCurrentMap() {
  		
  	}


  	function executeAction() {
  		if (action == 'create') {
  			return generateNewMap();
  		}
  		else if (action == 'load')
  			return loadCurrentMap();
  		else 
  			throw new IncorrectDataError("not create/load executed action");
  	}


  	this.requestCellCord = function() {

  	}

  	this.requestCellbyIndex = function(i, j) {
  		return mapCells[i][j];
  	}

}

/////////////////////////////////////////////////////////////////////////////////////////////			 /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  MAP CELL  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////            /////////////////////////////////////////////////////////////////////////////////////////////

function MapCell() {
	if (!(this instanceof MapCell))
		return new MapCell();

	var _self = this;


}

MapCell.prototype.createNew = function(type, height, len, objDetalization, heightMap) {
	this._type 		= 	type || 0;
	this._height 	= 	height || 0;
	this._edgeLen 	= 	len || 1;
	this.setHeightMap(0);
	
	this._objData	= [];
	for ( var i = 0; i < objDetalization; i++ ) {
		this._objData[i] = [];
		for ( var j = 0; j < objDetalization; j++ )
			this._objData[i][j] = [];
	}

	this.requestObjectCellbyIndex = function(x ,y) {
		return this._objData[x][y];
	}
}

/* returns refference to object
 */ 
MapCell.prototype.getObjectData = function(i, j) { // i = [0 .. worldDetalization], j = [0 .. worldDetalization]
	return this._objData[i][j];
}
MapCell.prototype.setObjectData = function(i, j, refference) {
	this._objData[i][j] = refference;
}

MapCell.prototype.getType = function(index) {
	index = index || 0;
	return this._heightMap[index];
}

MapCell.prototype.getHeight = function() {
	return this._height;
}

MapCell.prototype.setHeight = function(height) {
	this._height = height;
}

MapCell.prototype.setType = function(type, index) {
	index = index || 0;
	this._heightMap[index] = type;
}

MapCell.prototype.setHeightMap = function(heightMap) {
	this._heightMap = [];
	for (var i = 0; i < heightSetsContainer[heightMap].length - 1; i++)
		if ( heightSetsContainer[heightMap][i].chance * 100 < randChance() )
			this._heightMap.push(heightSetsContainer[heightMap][i + 1].type);
		else 
			this._heightMap.push(heightSetsContainer[heightMap][i].type);
	this._heightMap.push(heightSetsContainer[heightMap][heightSetsContainer[heightMap].length - 1].type);
}

MapCell.prototype.getHeightMap = function(type) {
	return this._heightMap;
}

MapCell.prototype.isVoid = function(index) {
	index = index || 0;
	if ( tiles[this._heightMap[index]].desc == "void" )
		return true;
	return false;
}


/////////////////////////////////////////////////////////////////////////////////////////////			 	/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  GAME OBJECT  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////            	/////////////////////////////////////////////////////////////////////////////////////////////


function GameObject() {
	if (!(this instanceof MapCell))
		return new MapCell();

	var _self = this;

	function checkAccess() {
		if (!(this instanceof Map))
			throw new ProtectedError();
		if (this.constructor === Map)
			throw new ProtectedError();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////			 	/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  MAP OBJECT  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////            	/////////////////////////////////////////////////////////////////////////////////////////////


function MapObject(objType, area) {
	var _self = this;

	this._type 	= objType;

	this._area = area; // array of objects like {sX: 30, sY: 30, fX: 50, fY: 50} WHERE coordinates of objects detail location
}

/////////////////////////////////////////////////////////////////////////////////////////////			 	   /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  INITIALIZATION  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////            	   /////////////////////////////////////////////////////////////////////////////////////////////


var gameWorld = new World();

































/////////////////////////////////////////////////////////////////////////////////////////////		   /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////  ERRORS  /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////          /////////////////////////////////////////////////////////////////////////////////////////////

function ProtectedError(){ 
     this.message = "Encapsulation error, the object member you are trying to address is protected."; 
}
ProtectedError.prototype = new Error();
ProtectedError.prototype.constructor = ProtectedError;

function IncorrectDataError(msg){ 
     this.message = msg || "IncorrectData error"; 
}
ProtectedError.prototype = new Error();
ProtectedError.prototype.constructor = IncorrectDataError;