// * ****************************************************************************
// *  Copyright (c) 2012-2018 Skreens Entertainment Technologies Incorporated - http://skreens.com
// *
// *  Redistribution and use in source and binary forms, with or without  modification, are
// *  permitted provided that the following conditions are met:
// *
// *  Redistributions of source code must retain the above copyright notice, this list of
// *  conditions and the following disclaimer.
// *
// *  Redistributions in binary form must reproduce the above copyright  notice, this list of
// *  conditions and the following disclaimer in the documentation and/or other materials
// *  provided with the distribution.
// *
// *  Neither the name of Skreens Entertainment Technologies Incorporated  nor the names of its
// *  contributors may be used to endorse or promote products derived from this software without
// *  specific prior written permission.
// *
// *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
// *  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
// *  AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// *  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// *  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// *  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// * ******************************************************************************
'use strict';
var tokenRed = "113";
var myJson;
var dbgMessage = false;
var debugToggle = true;
var passCount = 0;
var server;

var	tokenFaceCnt=0;
var	tokenFaceName = [];
var	tokenFaceValue = [];
var	tokenVehicleCnt=0;
var	tokenVehicleName = [];
var	tokenVehicleValue = [];

var completeCount;
var completeKey = [];
var	completeValue = [];

var trg1KindPtr = 0; 
var trg1Kind = [];
var trg1SexPtr = 0; 
var trg1Sex = [];
var trg1EmotionPtr = 0; 
var trg1Emotion = [];
var trg1AgePtr = 0; 
var trg1Age = [];
var trg1FirePtr = 0; 
var trg1Fire = [];

var trg2KindPtr = 0; 
var trg2Kind = [];
var trg2SpeedPtr = 0; 
var trg2Speed = [];
var trg2ZonePtr = 0; 
var trg2Zone = [];
var trg2FirePtr = 0; 
var trg2Fire = [];

var buf1Total = 22;
var buf1ArrayValue = [];

var skreensResp = [];
var websocket;
var socket = io.connect();
var socketBase = null;
var testMessage = "Waiting";
var glbRefresh = 3000; // 3 seconds
var refCount = 0;
var myUrl;
var myTimer;
var myTimerTest;
var loopToggle1 = true;
var loopToggle2 = true;
var loopToggle3 = true;
var loopToggle4 = true;
var	loopsFlag = 0;
var urlHome = "http://";
var wsHome = "ws://";
var DISPLAY_ON = 0;
var DISPLAY_OFF = 1;
var remoteLayout = 0;
var imageSeg = 0;
var glbImage;

// Unit options.
var swtAddr1 = "0"; 
var optAddr1 = "192.168.0.0"; 
var optPort1 = "9997" ;
var optPort2 = "5556" ;
var optKind1 = 0 ;
var optSex1 = 0 ;
var optEmotion1 = 0 ;
var optAge1 = 0 ;
var optFire1 = 0 ;
var optSpeed2 = 0;
var optZone2 = 0;
var optFire2 = 0;

var optMessage = "Invalid"; 
var nextInput = 1;

var messLines = [];
var messElements = 0;

var layoutLoaded = 0;
var layoutCnt = 0;
var layoutPos = 0;
var layoutBuffer = [];
var layoutWindows = [];
var loadedLayoutName = "NONE";
var loadedLayoutId = 0;

var layoutName = [];
var layoutTime = [];
var layoutState = [];
var layoutId = [];
var audioPort = 1;
                       
var	hdmiWindowCount=0;
var	hdmiLocation_x = [];
var	hdmiLocation_y = [];
var	hdmiLocation_h = [];
var	hdmiLocation_w = [];
var	hdmiLocation_id = [];

var	hdmiManagerCount;
var	hdmiManagerPort = [];
var	hdmiManagerNumber = [];
var	hdmiManagerName = [];
var	hdmiManagerPri = [];
var hdmiDevicesCount;
var hdmiDevicesFile = [];
var	hdmiDevicesId = [];
var	hdmiDevicesName = [];
var	hdmiChannelsCount;
var	hdmiChannelsPort = [];
var	hdmiChannelsNumber = [];
var	hdmiChannelsName = [];
var	hdmiChannelsPri = [];
var completeCount;
var completeKey = [];
var	completeValue = [];

var testTimer = 1000;
var testActiveState = false;
var testSampleCount = 0;
var testCycleCount = 0;

var faceDataCnt = 0;

class StreamingSession {
    constructor(server, vid) {
        this.server = server;
        this.id = 0;
        this.handleId = 0;
        this.video = vid;
        this.transactionMap = new Map();
        this.hasConnected = false;
        this.iceCandidateCount = 0;
    }
}



trg1KindPtr = 3;
trg1Kind[0] = "Don't Care";
trg1Kind[1] = "Faces";
trg1Kind[2] = "vehicle";

trg1SexPtr = 3;
trg1Sex[0] = "Don't Care";
trg1Sex[1] = "male";
trg1Sex[2] = "female";

trg1EmotionPtr = 6;
trg1Emotion[0] = "Don't Care";
trg1Emotion[1] = "happy";
trg1Emotion[2] = "sad";
trg1Emotion[3] = "calm";
trg1Emotion[4] = "confused";
trg1Emotion[5] = "neutral";

trg1AgePtr = 10;
trg1Age[0] = "Don't Care";
trg1Age[1] = "teens";
trg1Age[2] = "20s";
trg1Age[3] = "30s";
trg1Age[4] = "40s";
trg1Age[5] = "50s";
trg1Age[6] = "60s";
trg1Age[7] = "70s";
trg1Age[8] = "80s";
trg1Age[9] = "90s";

trg1FirePtr = 7;
trg1Fire[0] = "Do Nothing";
trg1Fire[1] = "Load Media 1";
trg1Fire[2] = "Load Media 2";
trg1Fire[3] = "Load Media 3";
trg1Fire[4] = "Load Media 4";
trg1Fire[5] = "Load 4 up";
trg1Fire[6] = "1 big 3 side";


trg2KindPtr = 3;
trg2Kind[0] = "Don't Care";
trg2Kind[1] = "Faces";
trg2Kind[2] = "vehicle";

trg2ZonePtr = 5;
trg2Zone[0] = "Don't Care";
trg2Zone[1] = "car";
trg2Zone[2] = "truck";
trg2Zone[3] = "train";
trg2Zone[4] = "plane";

trg2SpeedPtr = 10;
trg2Speed[0] = "Don't Care";
trg2Speed[1] = "10mph";
trg2Speed[2] = "20mph";
trg2Speed[3] = "30mph";
trg2Speed[4] = "40mph";
trg2Speed[5] = "50mph";
trg2Speed[6] = "60mph";
trg2Speed[7] = "70mph";
trg2Speed[8] = "80mph";
trg2Speed[9] = "90mph";

trg2FirePtr = 7;
trg2Fire[0] = "Do Nothing";
trg2Fire[1] = "Load Media 1";
trg2Fire[2] = "Load Media 2";
trg2Fire[3] = "Load Media 3";
trg2Fire[4] = "Load Media 4";
trg2Fire[5] = "Load 4 up";
trg2Fire[6] = "1 big 3 side";


function optionSetup()
{
	let optHTML = "<div id='optionsId' style='position:absolute; top:125px; left:10px; width:500px;'>";
	optHTML += "<fieldset><legend align='center'><b>Device Configuration</b></legend>";
	optHTML += "<table border='1' width=100% cellspacing='1' style='text-align:left; overflow:hidden; font-family:Times New Roman; font-size:16px; color:#ffffff; background-color:#536e7d;'>";
//****************************************************************
	optHTML += "<tr>"; 
   	optHTML += "<td>Skreens IP Address</td>";
   	optHTML += "<td><input type='text' id='cfgAddr1' style='text-align:left; width:275px; font-size:16px;'></td>";
	optHTML += "</tr>";
//****************************************************************
	optHTML += "<tr>"; 
   	optHTML += "<td>Skreens Socket Port</td>";
   	optHTML += "<td><input type='text' id='cfgPort1' style='text-align:left; width:275px; font-size:16px;'></td>";
	optHTML += "</tr>";
//*****************************************************************
	optHTML += "<tr>"; 
   	optHTML += "<td>Matrix TCP Port</td>";
   	optHTML += "<td><input type='text' id='cfgPort2' style='text-align:left; width:275px; font-size:16px;'></td>";
	optHTML += "</tr>";
//*****************************************************************
   	optHTML += "<td td align='center'>";
   	optHTML += "<button onclick='sendOptions(1)' style='border-radius: 10px; text-align:left; overflow:hidden; color:#000000; background-color:#ffff66;' id='ALMAction1' name'ALM'>Submit</button>";
   	optHTML += "</td>";
   	optHTML += "<td td align='left'>";
   	optHTML += "<button onclick='sendOptions(0)' style='border-radius: 10px; text-align:left; overflow:hidden; color:#000000; background-color:#ffff66;' id='ALMAction0' name'ALM'>Cancel</button>";
   	optHTML += "</td>";
   	optHTML += "<td td align='right'>";
   	optHTML += "<button onclick='sendOptions(2)' style='border-radius: 10px; text-align:left; overflow:hidden; color:#000000; background-color:#ffff66;' id='ALMAction0' name'ALM'>json</button>";
   	optHTML += "</td>";

   	optHTML += "</tr>";

	optHTML += "</table></fieldset></div>";
	document.getElementById('aOptions').innerHTML = optHTML;

	let myAddr1 = document.getElementById('cfgAddr1');
	myAddr1.value = optAddr1;

	let myPort1 = document.getElementById('cfgPort1');
	myPort1.value = optPort1;

	let myPort2 = document.getElementById('cfgPort2');
	myPort2.value = optPort2;
}

function sendOptions(ctrl)
{

	if(ctrl == 1)
	{
		optAddr1 = document.getElementById('cfgAddr1').value;
		localStorage.setItem('storeIp1',optAddr1);

		optPort1 = document.getElementById('cfgPort1').value;
		localStorage.setItem('storePort1',optPort1);

		optPort2 = document.getElementById('cfgPort2').value;
		localStorage.setItem('storePort2',optPort2);

		// Tell Nodejs which port web page is using.
		let myPort = "sockPort ".concat(optPort1);
		myPort = myPort.concat(" write");
		sendToken(myPort);

		// Tell Nodejs which port matrix is using.
		myPort = "tcpPort ".concat(optPort2);
		myPort = myPort.concat(" append");
		sendToken(myPort);
	}
	else if(ctrl == 2)
	{
		if(debugToggle == false)
		{
			debugToggle = true;
			let dbgSection = document.getElementById('aInfo');
			dbgSection.style.display = 'none';
		}
		else
		{
			debugToggle = false;
			let dbgSection = document.getElementById('aInfo');
			dbgSection.style.display = 'block';
			matrixInfo(); // Display raw JSON data
		}
	}
}

function config_unit(display)
{
	let localIp = localStorage.getItem('storeIp1');
	if(localIp == null) localIp = "192.168.0.0";
	let allText = ("IP1 " + localIp);
	configOptions(allText, display); 

	let localPort = localStorage.getItem('storePort1');
	if(localPort == null) localPort = "9997";
	allText = ("PORT1 " + localPort);
	configOptions(allText, display); 

	localPort = localStorage.getItem('storePort2');
	if(localPort == null) localPort = "5556";
	allText = ("PORT2 " + localPort);
	configOptions(allText, display); 
}

function configOptions(text, display) 
{
	let i;
	let cnt;
	let count = text.split(/\r\n|\r|\n/); 

	// Check for no data.
	if(count.length > 0)
	{
		// Split up the config file parameters and init our option array.
		for(i = 0;i < count.length; i++)
		{
			cnt = count[i].split(" "); 
			let option = cnt[0].split(" ", cnt.length);

			switch(cnt[0])
			{
				case 'IP1' :
				{
					optAddr1 = cnt[1];
					break;
				}
				case 'PORT1' :
				{
					optPort1 = cnt[1];
					break;
				}
				case 'PORT2' :
				{
					optPort2 = cnt[1];
					break;
				}
			}
		
		}
	}
}

function startStop(ctrl){
	switch(ctrl) {
		case 0: {
			testStateCtl = testStateRun;
			loopToggle1 = !loopToggle1;
			let state = document.getElementById("loopToggle1").value = loopToggle1 ? "Test Stopped" : "Test Running";
			changeState(state,ctrl);
			changeToggle();
			socket.emit('clientResponse', {'myToken': "cryingBugs"});
			break;
		}
		case 1: {
			testStateCtl = testStateRun;
			loopToggle2 = !loopToggle2;
			let state = document.getElementById("loopToggle2").value = loopToggle2 ? "Test Stopped" : "Test Running";
			changeState(state,ctrl);
			changeToggle();
			socket.emit('clientResponse', {'myToken': "cryingBugs"});
			break;
		}
		case 2: {
			testStateCtl = testStateRun;
			loopToggle3 = !loopToggle3;
			let state = document.getElementById("loopToggle3").value = loopToggle3 ? "Test Stopped" : "Test Running";
			changeState(state,ctrl);
			changeToggle();
			socket.emit('clientResponse', {'myToken': "cryingBugs"});
			break;
		}
		case 3: {
			testStateCtl = testStateRun;
			loopToggle4 = !loopToggle4;
			let state = document.getElementById("loopToggle4").value = loopToggle4 ? "Test Stopped" : "Test Running";
			changeState(state,ctrl);
			changeToggle();
			socket.emit('clientResponse', {'myToken': "cryingBugs"});
			break;
		}
	}
}

function changeToggle(){
    if(!loopToggle1) return;
}

function changeState(state,ctrl) {

	switch(ctrl) {
		case 0: {
			if(state == "Test Stopped") {
				document.getElementById("loopToggle1").style.backgroundColor="red"; 
				clearTimeout(myTimer);
				console.log("Timer Off");
				testActiveState = false;
			}
			else {
				document.getElementById("loopToggle1").style.backgroundColor="green";
				console.log("Timer On");
				initTimeout();
			}
			break;
		}
		case 1: {
			if(state == "Test Stopped") {
				document.getElementById("loopToggle2").style.backgroundColor="red"; 
				clearTimeout(myTimer);
				console.log("Timer Off");
				testActiveState = false;
			}
			else {
				document.getElementById("loopToggle2").style.backgroundColor="green";
				console.log("Timer On");
				initTimeout();
			}
			break;
		}
		case 2: {
			if(state == "Test Stopped") {
				document.getElementById("loopToggle3").style.backgroundColor="red"; 
				clearTimeout(myTimer);
				console.log("Timer Off");
				testActiveState = false;
			}
			else {
				document.getElementById("loopToggle3").style.backgroundColor="green";
				console.log("Timer On");
				initTimeout();
			}
			break;
		}
		case 3: {
			if(state == "Test Stopped") {
				document.getElementById("loopToggle4").style.backgroundColor="red"; 
				clearTimeout(myTimer);
				console.log("Timer Off");
				testActiveState = false;
			}
			else {
				document.getElementById("loopToggle4").style.backgroundColor="green";
				console.log("Timer On");
				initTimeout();
			}
			break;
		}
	}
}

function showMyDevices()
{
	let myTimer = 0;

	console.log("Refreshing Windows....");


	// If first starting, refresh fast "shows blank data :-( ", then slow it down.
	if(refCount++ == 0)
	{
		// Turn off the json decode window.
		let dbgSection = document.getElementById('aInfo');
		dbgSection.style.display = 'none';

		alert("Use a screen resolution 1400x1050 or greater.");

		getTrigger1();
		getTrigger2();

		config_unit(DISPLAY_ON);

		// Get the layout ID's
		//urlGet(4);	

		optionSetup();
		triggerSetup1();
		triggerSetup2();

		let	vidSize = document.getElementById("video-container"); 
		vidSize.style.width="800px";
		vidSize.style.height="600px";
		vidSize.style.top="200px";
		vidSize.style.left="550px";
		vidSize = document.getElementById("kic-video"); 
		vidSize.style.width="800px";

		let video = document.getElementById("kic-video");
		if (video == null) {
			console.error("Where is the 'kic-video' element?");
			return;
		}

		server = optAddr1;

		// Start a streaming session and run it.
		let sess = new StreamingSession(server, video);
		runSession(sess);

		// Turn on the video window because this is a cloud tester.
		let testerWindows = document.getElementById('kic-video');
		testerWindows.style.display = 'block';

		// Tell Nodejs which port web page is using.
		let myPort = "sockPort ".concat(optPort1);
		myPort = myPort.concat(" write");
		sendToken(myPort);

		// Tell Nodejs which port matrix is using.
		myPort = "tcpPort ".concat(optPort2);
		myPort = myPort.concat(" append");
		sendToken(myPort);

	}

	// Get the layout ID's
	urlGet(4);	

	nodesInfo(); 

	myTimer = window.setTimeout(showMyDevices,glbRefresh);
}

function httpApi(data, callback, errback) {
	let json = "";
    const req = new XMLHttpRequest();
    req.timeout = data.timeout || 20000;
	req.ontimeout = function () {
		console.log("ERR433: API request for " + data.uri + " timed out, Kai must be hung?");
		document.getElementById("textArg1").value="API1 Request timed out. Kai must be hung?";
    };
    req.open(data.method, 'http://' + optAddr1 + data.uri, true);
    req.setRequestHeader('Accept', 'application-json');
    req.setRequestHeader('Content-Type', 'application-json');
    req.send(data.payload ? JSON.stringify(data.payload) : null);
    req.onreadystatechange = () => {
        // check for request DONE.
        if (req.readyState === 4) {
            // Check for request state to be OK.
            if (req.status === 200) {
				if(data.method == "GET") {

					if(dbgMessage)
						console.log("httpApi Response " + req.responseText);
					
					json = JSON.parse(req.responseText);
				}
                if (callback) {
                    return callback(json);
                }
            } else if (req.status === 400) {
                console.warn('ERR829: Status 400: Bad Request URI = ' + data.uri + ", Payload = " + data.payload);
                return callback("ERR400");
            } else if (req.status === 404) {
                console.warn('ERR830: Status 404: File not found = ' + data.uri);
                return callback("ERR404");
            } else if (req.status === 403) {
                console.warn('ERR831: Status 403: Forbidden access by the server.');
                return callback("ERR403");
            } else if (req.status === 500) {
                console.warn('ERR832: Status 500: internal server error.');
                return callback("ERR500");
            }
            if (errback) {
                return errback();
            }
        }
    };
}

function changeicon(x){
    document.head.innerHTML = "<link href='" + x + "' rel='shortcut icon'><title>" + document.title;
}
const changeFavicon = link => {
	let $favicon = document.querySelector('link[rel="icon"]');
  	// If a <link rel="icon"> element already exists,
  	// change its href to the given link.
  	if ($favicon !== null) {
    		$favicon.href = link;
  		// Otherwise, create a new element and append it to <head>.
  	} else {
    		$favicon = document.createElement("link");
    		$favicon.rel = "icon";
    		$favicon.href = link;
    		document.head.appendChild($favicon);
  	}
}

function sendMessageLAYOUT(myToken,pos)
{
	let realLayout = (Number(myToken));

	let myString="";
	myUrl = urlHome.concat(optAddr1);
	let myPath = myUrl.concat("/1/window-manager/layout");

	let myObject = new XMLHttpRequest();
	myObject.onreadystatechange = function() 
	{//Call a function when the state changes.
		if(myObject.readyState == 0)
		{
			alert("Request not initalized");
		}
		else if(myObject.readyState == 4)
		{
			//alert("Ready State from client = "+myObject.statusText);
		}
	};

	let part1 = '{\"id\":'; 
	myString = part1.concat(realLayout);
	myString = myString.concat('}');

	myObject.open("PUT", myPath, true);
	myObject.setRequestHeader("Accept","application-json");
	myObject.setRequestHeader("Content-Type","application-json");
	myObject.send(myString); 

	// Check for request state to be OK.
	if(myObject.status == 200)
	{
		let recText = myObject.responseText;
		alert("Response from client = " + recText);
	}
	else if (myObject.status == 404) 
	{
		alert("Error404: File not found.");
	}
	else if (myObject.status == 403) 
	{
		alert("Error403: Forbidden access.");
	}
	else
	{
		//alert("Unknown status Response from client = "+myObject.status); 
	}
}

function sendToken(key)
{
	// If the port is stuck in use, kill it first.
	//netstat -ano | findstr :5556
	//tskill typeyourPIDhere // Far right number.

	$(document).ready(function()
	{
		socket.emit('clientResponse', {'myToken': key});
		console.log("SendToken() = ");

	});
}

function isEmpty(arg) {
  for (let item in arg) {
    return false; // Not Empty or null
  }
  return true; // Empty.
}

socket.on('responseDetails', function(data)
{

	if(data.State == "empty") {
		console.log("JSON STructure is empty!");
		document.getElementById("textArg1").value=("Camera JSON structure is empty. Count = " + passCount);
	}
	else {
		console.log("Detected new structure from Matrix.");
		myJson = JSON.parse(data);

		let structTypeFace = true;
		let structTypeVehicle = true;

		if((structTypeFace = isEmpty(myJson.results[0].data[0].emotion)) == false) {
			console.log("Detected FACES structure.");
			document.getElementById("textArg1").value=("Monitoring Face Data. Count = " + passCount);

			let i = 0;
			let j = 0;
			let resultsCnt = myJson.results.length;
			tokenFaceCnt = 0;

			// How many results objects do we have?
			for(i = 0; i < resultsCnt; i++) {

				let myTime = myJson.results[i].meta.timestamp;

				// How many data objects do we have?
				faceDataCnt = myJson.results[i].data.length;
				for(j = 0; j < faceDataCnt; j++) {

					tokenFaceName[tokenFaceCnt] = "Kind Group ".concat(i+j+1);
					tokenFaceValue[tokenFaceCnt++] = myJson.results[i].data[j].kind;

					tokenFaceName[tokenFaceCnt] = "Sex Group ".concat(i+j+1);
					tokenFaceValue[tokenFaceCnt++] = myJson.results[i].data[j].sex;

					tokenFaceName[tokenFaceCnt] = "Emotion Group ".concat(i+j+1); 
					tokenFaceValue[tokenFaceCnt++] = myJson.results[i].data[j].emotion;

					tokenFaceName[tokenFaceCnt] = "Age Group ".concat(i+j+1);
					tokenFaceValue[tokenFaceCnt++] = myJson.results[i].data[j].age;

					console.log("TS:" + myTime + " sex: " + myJson.results[i].data[j].sex + " age: " + myJson.results[i].data[j].age);

				}
			}
			faceResults();
			faceResultsCheck();

			// Collect the complete JSON upload data and format it.
			completeCount = 0;
			JSON.parse(data, (key, value) => {
				completeKey[completeCount] = key;

				let valType = getType(value);
				if( (valType != 'string') && (valType != 'other') ) value = valType;
				completeValue[completeCount++] = value;
			});
		} 
		else if((structTypeVehicle = isEmpty(myJson.results[0].data[0].zoneId)) == false) {
			console.log("Detected VEHICLE structure.");
			document.getElementById("textArg1").value=("Monitoring Vehicle Data. Count = " + passCount);

			let i = 0;
			let j = 0;
			let resultsCnt = myJson.results.length;
			let dataCnt = 0;
			tokenVehicleCnt = 0;

			// How many results objects do we have?
			for(i = 0; i < resultsCnt; i++) {

				// How many data objects do we have?
				dataCnt = myJson.results[i].data.length;
				for(j = 0; j < dataCnt; j++) {
					tokenVehicleName[tokenVehicleCnt] = "Kind Group ".concat(i+j+1);
					tokenVehicleValue[tokenVehicleCnt++] = myJson.results[i].data[j].kind;
					tokenVehicleName[tokenVehicleCnt] = "Speed Group ".concat(i+j+1);
					tokenVehicleValue[tokenVehicleCnt++] = myJson.results[i].data[j].speed;
					tokenVehicleName[tokenVehicleCnt] = "Zone ID Group ".concat(i+j+1);
					tokenVehicleValue[tokenVehicleCnt++] = myJson.results[i].data[j].zoneId;
				}
			}
			vehicleResults();
			vehicleResultsCheck();
		}
		else {
			console.log("This is not a KNOWN structure!");
			let mySpeed = myJson.results[0].data[0].speed;
		}
	}
});

function getType(p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
}

function faceResults()
{ 
	let i = 0;
	let sttHTML = "<div style='border-radius: 10px; position:absolute; top:300px; left:10px; width:500px'>";
	sttHTML += "<fieldset><legend align='center'><b>Face Results</b></legend>";

	sttHTML += "<table border='1' width=100% cellspacing='1' style='border-radius: 10px; text-align:left; overflow:hidden; font-family:Times New Roman; font-size:16px; color:#000000; background-color:#536e7d;'>";
	sttHTML += "<tr>";
	sttHTML += "<td style='text-align:center; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'>Name</td>";
	sttHTML += "<td style='text-align:center; width:250px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'>Value</td>";
	sttHTML += "</tr>";
        
	if(tokenFaceCnt != 0)
	{
		sttHTML += "<tr style='border-radius: 10px; text-align:center; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'>";
		sttHTML += "<td>Number of Persons</td>";
		sttHTML += "<td><input  type='text'  id='dFld0";
		sttHTML += "' style='border-radius: 10px; text-align:center; width:250px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";
		sttHTML += "</tr>";

		for(let i=0; i < tokenFaceCnt; i++) 
		{		
			sttHTML += "<tr>";
			sttHTML += "<td><input  type='text'  id='dFld1";
			sttHTML += i;
			sttHTML += "' style='border-radius: 10px; text-align:center; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";
			sttHTML += "<td><input  type='text'  id='dFld2";
			sttHTML += i;
			sttHTML += "' style='border-radius: 10px; text-align:center; width:250px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";
			sttHTML += "</tr>";
		}
	}
			
	sttHTML += "</table>";
	sttHTML += "</fieldset></div>";
	document.getElementById('mInfo').innerHTML = sttHTML;

	if(tokenFaceCnt != 0)
	{
		let eZero = 'dFld0';
		let eOne = 'dFld1';
		let eTwo = 'dFld2';

		document.getElementById(eZero).value = faceDataCnt;

		for(let i=0; i < tokenFaceCnt; i++) 
		{		
			let fname = document.getElementById(eOne+i);
			let fvalue = document.getElementById(eTwo+i);

			document.getElementById(eOne+i).value = tokenFaceName[i];
			document.getElementById(eTwo+i).value = tokenFaceValue[i];
		}
	}
}

function faceResultsCheck()
{
	let sexTrig = false;
	let emotionTrig = false;
	let ageTrig = false;
	let groupNum = -1;

	// This function is based on 4 entries in a group.
	if(tokenFaceCnt != 0)
	{
		for(let i=0; i < tokenFaceCnt; i++) 
		{
			if((i == 0) ||(i == 4) ||(i == 8) ||(i == 12) ||(i == 16)) {
				sexTrig = false;
				emotionTrig = false;
				ageTrig = false;
			}

			if(tokenFaceName[i].search("Kind Group") != -1) {
				groupNum = i;
			} 
			else if(tokenFaceName[i].search("Sex Group") != -1) {
				if(tokenFaceValue[i] == trg1Sex[optSex1]) {
					console.log("sex Match = " + tokenFaceValue[i] + " trigger " + trg1Sex[optSex1]);
					sexTrig = true;
				}
			} 
			else if(tokenFaceName[i].search("Emotion Group") != -1) {
				if(tokenFaceValue[i] == trg1Emotion[optEmotion1]) {
					console.log("Emotion Match = " + tokenFaceValue[i] + " trigger " + trg1Emotion[optEmotion1]);
					emotionTrig = true;
				}
			}
			else if(tokenFaceName[i].search("Age Group") != -1) {
				switch(optAge1) {
					case '0': {
						ageTrig = false;
						break;
					}
					case '1': {
						if((tokenFaceValue[i] >= 10) && (tokenFaceValue[i] <= 19)) {
							console.log("age teens Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '2': {
						if((tokenFaceValue[i] >= 20) && (tokenFaceValue[i] <= 29)) {
							console.log("age 20s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '3': {
						if((tokenFaceValue[i] >= 30) && (tokenFaceValue[i] <= 39)) {
							console.log("age 30s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '4': {
						if((tokenFaceValue[i] >= 40) && (tokenFaceValue[i] <= 49)) {
							console.log("age 40s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '5': {
						if((tokenFaceValue[i] >= 50) && (tokenFaceValue[i] <= 59)) {
							console.log("age 50s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '6': {
						if((tokenFaceValue[i] >= 60) && (tokenFaceValue[i] <= 69)) {
							console.log("age 60s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '7': {
						if((tokenFaceValue[i] >= 70) && (tokenFaceValue[i] <= 79)) {
							console.log("age 70s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '8': {
						if((tokenFaceValue[i] >= 80) && (tokenFaceValue[i] <= 89)) {
							console.log("age 80s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
					case '9': {
						if((tokenFaceValue[i] >= 90) && (tokenFaceValue[i] <= 99)) {
							console.log("age 90s Match = " + tokenFaceValue[i] + " trigger " + trg1Age[optAge1]);
							ageTrig = true;
						}
						break;
					}
				}
			}
			if((sexTrig == true) || (optSex1 == 0)) 
			{
				if((emotionTrig == true) || (optEmotion1 == 0)) 
				{
					if((ageTrig == true) || (optAge1 == 0)) 
					{

						let eOne = 'dFld1';
						let eTwo = 'dFld2';
						document.getElementById(eOne+groupNum).style.color = "blue";
						document.getElementById(eTwo+groupNum).style.color = "blue";

						console.log("Got Trigger, Group = " + groupNum);
						if(optFire1 != 0) 
						{
							console.log("Change the layout! = " + optFire1);

							let myId = 0;
							switch(optFire1) 
							{
								case "1":	myId = getIdByName("HDMI 1"); break;
								case "2":	myId = getIdByName("HDMI 2"); break;
								case "3":	myId = getIdByName("HDMI 3"); break;
								case "4":	myId = getIdByName("HDMI 4"); break;
								case "5":	myId = getIdByName("4 Up"); break;
								case "6":	myId = getIdByName("1 big 3 side"); break;
							}
							if(myId != 0) 
							{
								httpApi({ method: 'PUT', uri: '/1/window-manager/layout', payload: {"id": myId} });
							}
							break;
						}
					}
				}
			}
		}
	}
}

function triggerSetup1()
{
	let optHTML = "<div id='trigger1Id' style='border-radius: 10px; position:absolute; top:20px; left:550px; width:900px'>";
	optHTML += "<tr>"; 
//****************************************************************
	optHTML += "<td align='center'><span style='color: #0000ff'> [Face]</span></td>";
   	optHTML += "<td align='center'> If Age = </td>";
   	optHTML += "<td align='center'>";   	
	optHTML += ("<select id='cfgAge1' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg1AgePtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg1Age[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//****************************************************************
   	optHTML += "<td align='center'> and Sex = </td>";
   	optHTML += "<td>";   	
	optHTML += ("<select id='cfgSex1' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg1SexPtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg1Sex[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//****************************************************************
   	optHTML += "<td align='center'> And Emotion = </td>";
   	optHTML += "<td>";   	
	optHTML += ("<select id='cfgEmotion1' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg1EmotionPtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg1Emotion[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//****************************************************************
   	optHTML += "<td align='center'> Then do </td>";
   	optHTML += "<td>";   	 
	optHTML += ("<select id='cfgFire1' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg1FirePtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg1Fire[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//*****************************************************************
   	optHTML += "<td align='center'>    </td>";
   	optHTML += "<td>";
   	optHTML += "<button id='cfgButton1' onclick='storeTrigger1(1)' style='border-radius: 10px; width:100px; height:20px; text-align:center; color:#000000; background-color:#ffff66;' id='ALMAction1' name'ALM'>Submit</button>";
 
  	optHTML += "</td>";
	optHTML += "</tr>";

	optHTML += "</div>";
	document.getElementById('zInfo').innerHTML = optHTML;

	let myOpt = document.getElementById('cfgAge1');
	myOpt.value = optAge1;

	myOpt = document.getElementById('cfgSex1');
	myOpt.value = optSex1;

	myOpt = document.getElementById('cfgEmotion1');
	myOpt.value = optEmotion1;

	myOpt = document.getElementById('cfgFire1');
	myOpt.value = optFire1;

}

function storeTrigger1(ctrl)
{

	if(ctrl == 1)
	{
		optAge1 = document.getElementById('cfgAge1').value;
		localStorage.setItem('storeAge1',optAge1);

		optSex1 = document.getElementById('cfgSex1').value;
		localStorage.setItem('storeSex1',optSex1);

		optEmotion1 = document.getElementById('cfgEmotion1').value;
		localStorage.setItem('storeEmotion1',optEmotion1);

		optFire1 = document.getElementById('cfgFire1').value;
		localStorage.setItem('storeFire1',optFire1);
	}
}

function getTrigger1()
{
	optAge1 = localStorage.getItem('storeAge1');
	if(optAge1 == null) optAge1 = 0;
	optSex1 = localStorage.getItem('storeSex1');
	if(optSex1 == null) optSex1 = 0;
	optEmotion1 = localStorage.getItem('storeEmotion1');
	if(optEmotion1 == null) optEmotion1 = 0;
	optFire1 = localStorage.getItem('storeFire1');
	if(optFire1 == null) optFire1 = 0;
}

function triggerSetup2()
{
	let optHTML = "<div id='trigger1Id' style='border-radius: 10px; position:absolute; top:75px; left:550px; width:900px'>";
	optHTML += "<tr>"; 
//****************************************************************
	optHTML += "<td align='center'><span style='color: #0000ff'> [Vehicle]</span></td>";
   	optHTML += "<td align='center'> If Speed = </td>";
   	optHTML += "<td align='center'>";   	
	optHTML += ("<select id='cfgSpeed2' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg2SpeedPtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg2Speed[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//****************************************************************
   	optHTML += "<td align='center'> and Zone = </td>";
   	optHTML += "<td>";   	
	optHTML += ("<select id='cfgZone2' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg2ZonePtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg2Zone[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//****************************************************************
   	optHTML += "<td align='center'> Then do </td>";
   	optHTML += "<td>";   	 
	optHTML += ("<select id='cfgFire2' style='border-radius: 10px; text-align:center; font-size:16px; color:#000000'>");
	for(let j=0; j < trg2FirePtr; j++) 
	{		
		optHTML += ("<option style='border-radius: 10px; text-align:center; font-size:16px; color:#000000;' value='" + (j) + "'>" + " " + trg2Fire[j] + "</option>");
	}
	optHTML += ("</select>");
	optHTML += "</td>";
//*****************************************************************
   	optHTML += "<td align='center'>    </td>";
   	optHTML += "<td>";
   	optHTML += "<button id='cfgButton1' onclick='storeTrigger2(1)' style='border-radius: 10px; width:100px; height:20px; text-align:center; color:#000000; background-color:#ffff66;' id='ALMAction1' name'ALM'>Submit</button>";
 
  	optHTML += "</td>";
	optHTML += "</tr>";

	optHTML += "</div>";
	document.getElementById('tInfo').innerHTML = optHTML;

	let myOpt = document.getElementById('cfgSpeed2');
	myOpt.value = optSpeed2;

	myOpt = document.getElementById('cfgZone2');
	myOpt.value = optZone2;

	myOpt = document.getElementById('cfgFire2');
	myOpt.value = optFire2;

}

function storeTrigger2(ctrl)
{

	if(ctrl == 1)
	{
		optSpeed2 = document.getElementById('cfgSpeed2').value;
		localStorage.setItem('storeSpeed2',optSpeed2);

		optZone2 = document.getElementById('cfgZone2').value;
		localStorage.setItem('storeZone2',optZone2);

		optFire2 = document.getElementById('cfgFire2').value;
		localStorage.setItem('storeFire2',optFire2);
	}
}

function getTrigger2()
{
	optSpeed2 = localStorage.getItem('storeSpeed2');
	if(optSpeed2 == null) optSpeed2 = 0;
	optZone2 = localStorage.getItem('storeZone2');
	if(optZone2 == null) optZone2 = 0;
	optFire2 = localStorage.getItem('storeFire2');
	if(optFire2 == null) optFire2 = 0;
}

function vehicleResults()
{ 
	let sttHTML = "<div style='border-radius: 10px; position:absolute; top:700px; left:10px; width:500px'>";
	sttHTML += "<fieldset><legend align='center'><b>Vehicle Results</b></legend>";

	sttHTML += "<table border='1' width=100% cellspacing='1' style='border-radius: 10px; text-align:left; overflow:hidden; font-family:Times New Roman; font-size:16px; color:#000000; background-color:#536e7d;'>";
	sttHTML += "<tr>";
	sttHTML += "<td style='text-align:center; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'>Name</td>";
	sttHTML += "<td style='text-align:center; width:250px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'>Value</td>";
	sttHTML += "</tr>";
        
	if(tokenVehicleCnt != 0)
	{
		for(let i=0; i < tokenVehicleCnt; i++) 
		{		
			sttHTML += "<tr>";

			sttHTML += "<td><input  type='text'  id='vFld1";
			sttHTML += i;
			sttHTML += "' style='border-radius:10px; text-align:center; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";

			sttHTML += "<td><input  type='text'  id='vFld2";
			sttHTML += i;
			sttHTML += "' style='border-radius:10px; text-align:center; width:250px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";

			sttHTML += "</tr>";
		}
	}
			
	sttHTML += "</table></fieldset></div>";
	document.getElementById('vInfo').innerHTML = sttHTML;

	if(tokenVehicleCnt != 0)
	{
		let eOne = 'vFld1';
		let eTwo = 'vFld2';

		for(let i=0; i < tokenVehicleCnt; i++) 
		{		
			document.getElementById(eOne+i).value = tokenVehicleName[i];
			document.getElementById(eTwo+i).value = tokenVehicleValue[i];
		}
	}
}

function vehicleResultsCheck()
{
	let zoneTrig = false;
	let speedTrig = false;
	let groupNum = -1;

	// This function is based on 3 entries in a group.
	if(tokenVehicleCnt != 0)
	{
		for(let i=0; i < tokenVehicleCnt; i++) 
		{
			if((i == 0) ||(i == 3) ||(i == 6) ||(i == 9) ||(i == 12)) {
				zoneTrig = false;
				speedTrig = false;
			}

			if(tokenVehicleName[i].search("Kind Group") != -1) {
				groupNum = i;
			} 
			else if(tokenVehicleName[i].search("Zone ID Group") != -1) {
				if(tokenVehicleValue[i] == trg2Zone[optZone2]) {
					console.log("zone Match = " + tokenVehicleValue[i] + " trigger " + trg2Zone[optZone2]);
					zoneTrig = true;
				}
			} 
			else if(tokenVehicleName[i].search("Speed Group") != -1) {
				switch(optSpeed2) {
					case '0': {
						speedTrig = false;
						break;
					}
					case '1': {
						if((tokenVehicleValue[i] >= 10) && (tokenVehicleValue[i] <= 19)) {
							console.log("speed 10mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '2': {
						if((tokenVehicleValue[i] >= 20) && (tokenVehicleValue[i] <= 29)) {
							console.log("speed 20mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '3': {
						if((tokenVehicleValue[i] >= 30) && (tokenVehicleValue[i] <= 39)) {
							console.log("speed 30mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '4': {
						if((tokenVehicleValue[i] >= 40) && (tokenVehicleValue[i] <= 49)) {
							console.log("speed 40mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '5': {
						if((tokenVehicleValue[i] >= 50) && (tokenVehicleValue[i] <= 59)) {
							console.log("speed 50mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '6': {
						if((tokenVehicleValue[i] >= 60) && (tokenVehicleValue[i] <= 69)) {
							console.log("speed 60mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '7': {
						if((tokenVehicleValue[i] >= 70) && (tokenVehicleValue[i] <= 79)) {
							console.log("speed 70mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '8': {
						if((tokenVehicleValue[i] >= 80) && (tokenVehicleValue[i] <= 89)) {
							console.log("speed 80mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
					case '9': {
						if((tokenVehicleValue[i] >= 90) && (tokenVehicleValue[i] <= 99)) {
							console.log("speed 90mph Match = " + tokenVehicleValue[i] + " trigger " + trg2Speed[optSpeed2]);
							speedTrig = true;
						}
						break;
					}
				}
			}
			if((zoneTrig == true) || (optZone2 == 0)) 
			{
				if((speedTrig == true) || (optSpeed2 == 0)) 
				{

					let eOne = 'vFld1';
					let eTwo = 'vFld2';
					document.getElementById(eOne+groupNum).style.color = "blue";
					document.getElementById(eTwo+groupNum).style.color = "blue";

					console.log("Got Trigger, Group = " + groupNum);
					if(optFire2 != 0) 
					{
						console.log("Change the layout! = " + optFire2);

						let myId = 0;
						switch(optFire2) 
						{
							case "1":	myId = getIdByName("HDMI 1"); break;
							case "2":	myId = getIdByName("HDMI 2"); break;
							case "3":	myId = getIdByName("HDMI 3"); break;
							case "4":	myId = getIdByName("HDMI 4"); break;
							case "5":	myId = getIdByName("4 Up"); break;
							case "6":	myId = getIdByName("1 big 3 side"); break;
						}
						if(myId != 0) 
						{
							httpApi({ method: 'PUT', uri: '/1/window-manspeedr/layout', payload: {"id": myId} });
						}
						break;
					}
				}
			}
		}
	}
}

function nodesInfo() 
{
	socket.emit('clientResponse', {'myToken': "optionsRequest captures"});
}

socket.on('responseOptions', function(data)
{
	let option = data.split(" ", 2);

	// If passcount has changed, update the matrix json data.
	if(passCount != Number(option[1])) { 
		matrixInfo(); // Display raw JSON data
	}

	if(option[0] == "captures") passCount = Number(option[1]); 
});

socket.on('response', function(data)
{
	let option = data.split(" ", 2);
});
