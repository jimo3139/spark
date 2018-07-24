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


function loadUrl(ctrl) {
    let myWindowId = 0;
    if (ctrl == CTRL_HDMI) {
        myWindowId = getIdByPortNumber(destHdmiArrayIdx);
    }
    else if (ctrl == CTRL_WEB) {
        myWindowId = getIdByPosition(destWebArrayTag);
    }

	let layoutId = loadedLayoutId;

	console.log("Send PUT = " + myWindowId);
    syncPut(myWindowId, SET_LAYOUT_FIELD, CTRL_HDMI); // change field for hdml_properties, ot web_properties
    windowToLoad = ""; // This window is loaded now, so clear out the variable.
    syncPut(layoutId, SET_LAYOUT_CURRENT, CTRL_NONE); // Send the change to the currently loaded layout.
    syncPut(layoutId, SET_LAYOUT_LOAD, CTRL_NONE); // send a load layout for this ID.
}

function syncPut(myToken, ext, ctrl) {
    let myString = "";
    let myPath = "";
    let part1 = "";
    let kaiServer = srcServer();
    let myUrl = urlHome.concat(kaiServer);
    switch (ext) {
        case SET_LAYOUT_FIELD: {
            myPath = myUrl.concat("/1/windows/");
            myPath = myPath.concat(myToken);
            if (ctrl == CTRL_HDMI) {
                part1 = '{"hdmi_properties": {"tuner_channel_name":"';
            }
            else if (ctrl == CTRL_WEB) {
                part1 = '{"web_properties": {"url":"';
            }
            myString = part1.concat(windowToLoad);
            myString = myString.concat('"}}');

            if (dbgMessage == true) {
                console.log("MSG024: syncPut() Sending change FIELD request, Body = " + myString);
            }
            break;
        }
        case SET_LAYOUT_LOAD:
        {
            myPath = myUrl.concat("/1/window-manager/layout");
            part1 = '{"id":';
            myString = part1.concat(myToken);
            myString = myString.concat('}');
            if (dbgMessage == true)
                console.log("MSG022: syncPut() Sending change layout request, Body = " + myString);
            break;
        }
        case SET_LAYOUT_CURRENT: {
            myPath = myUrl.concat("/1/window-manager/layout/current");
            part1 = '{"id":';
            myString = part1.concat(myToken);
            myString = myString.concat('}');
            if (dbgMessage == true)
                console.log("MSG023: syncPut() Sending change CURRENT layout request, Body = " + myString);
            break;
        }
    }
    if (dbgMessage == true)
        console.log("MSG021: syncPut() URL Path just loaded = " + myPath);
    let myObject = new XMLHttpRequest();
    // Check the state and status before starting the PUT.
    myObject.onreadystatechange = function () {
        if (myObject.readyState == 4) {
            switch (myObject.status) {
                case 200: {
                    break; // Good status, no need to check anything else.
                }
                case 400: {
                    console.log("ERR400: Bad Response = " + myObject.responseText);
                    return;
                }
                case 404: {
                    console.log("ERR404: File not found = " + myObject.responseText);
                    return;
                }
                case 500: {
                    console.log("ERR500: Internal server error = " + myObject.responseText);
                    return;
                }
                default: {
                    if (dbgMessage == true) {
                        console.log("MSG223: Response ext = " + ext);
                        console.log("WRN123: Status = " + myObject.status + ", State = " + myObject.state);
                        console.log("MSG123: Response message = " + myObject.responseText);
                    }
                    break;
                }
            }
        }
    };
    myObject.open("PUT", myPath, false); // false indicates synchronous mode.
    myObject.setRequestHeader("Accept", "application-json");
    myObject.setRequestHeader("Content-Type", "application-json");
    myObject.send(myString);
}

function getIdByName(name) {
	let response = 0;
	for (let i = 0; i < layoutCnt; i++) {
		let gotIt = layoutName[i].search(name);
		if(gotIt != -1) {

			loadedLayoutName = layoutName[i];
			loadedLayoutId = layoutId[i];
			response = Number(layoutId[i]);
			break;
		}
    }
	return response;
}

function getIdByPortNumber(port) {
    //if (dbgMessage == true)
        console.log("MSG100: getIdByPortNumber() Port number Passed = " + port);
    //if (dbgMessage == true)
        console.log("MSG099: getIdByPortNumber() Number of HDMI IDs to check = " + hdmiWindowCount);
    for (let i = 0; i < hdmiWindowCount; i++) {
        if (loadedHdmiPort[i] == port) {
            //if (dbgMessage == true)
                console.log("MSG101: getIdByPortNumber() HDMI Port returned  = " + loadedHdmiPort[i] + " WID = " + loadedHdmiWinId[i]);
            return loadedHdmiWinId[i];
        }
        else {
            //if (dbgMessage == true)
                console.log("MSG102: getIdByPortNumber() HDMI Port continue  = " + loadedHdmiPort[i] + " WID = " + loadedHdmiWinId[i]);
        }
    }
    console.log("ERR102: HDMI getIdByPortNumber() port " + port + " were not found.");
    return 0;
}

function deviceInfo(allText)
{
	let newObj = JSON.parse(allText);
	layoutCnt = newObj.length; 

	if(newObj.length != 0)
	{
		for(let i=0; i < newObj.length; i++) 
		{
			layoutName[i] = newObj[i].name;
			layoutId[i] = newObj[i].id;
			layoutWindows[i] = newObj[i].windows.length; 
		}
	}
}

function urlGet(key)
{
	let myPath = "";
	let allText = "Empty";
	myUrl = urlHome.concat(optAddr1);

	switch(key)
	{
		case 1: myPath = myUrl.concat("/1/device/name");break;
		case 2: myPath = myUrl.concat("/1/audio-config");break;
		case 3: myPath = myUrl.concat("/1/window-manager/layout");break;
		case 4: myPath = myUrl.concat("/1/layouts");break;
		case 5: myPath = myUrl.concat("/1/layouts/default");break;
		case 6: myPath = myUrl.concat("/1/windows");break;
	}
	let myObject = new XMLHttpRequest();

	myObject.open("GET", myPath, true);
	myObject.setRequestHeader("Accept","application-json");
	myObject.setRequestHeader("Content-Type","application-json");
	myObject.send(null); // Do a GET.
	myObject.onreadystatechange = function ()
	{
		// check for request finished.
		if(myObject.readyState == 4)
		{
			// Check for request state to be OK.
			if(myObject.status == 200)
			{
				allText = myObject.responseText;
				
				if(key == 4) deviceInfo(allText);

				let messElements = 0;
				for (let i = 0; i < allText.length; i++) 
				{
					if (allText[i] == ",") messElements++;
				}

				// For the cases where we have a single line response, we will not have a comma.
				if((allText.length != 0) && (messElements == 0))
				{
					messElements = 1;
					messLines = allText.split(",", messElements);
					allText = allText.replace(/"/g,"");
					messLines[0] = allText;
				}
				else
				{
					messLines = allText.split(",", messElements);
				}
			}
			else if (myObject.status == 404) 
			{
				alert("Error404: File not found = " + myPath);
			}
			else if (myObject.status == 403) 
			{
				alert("Error403: Forbidden access, or file type not supported by the server.");
			}
		}
	};
}

function matrixInfo()
{
	let sttHTML = "<div style='position:absolute; overflow-y:scroll; height:650px; top:125px; left:550px; width:600px;'>";
	sttHTML += "<fieldset><legend><b>Raw JSON Packet Content</b></legend>";

//	sttHTML += "<table>";
	sttHTML += "<table border='1' width=100% cellspacing='1'>";
	sttHTML += "<tr>";
        
	if(completeCount != 0)
	{
		for(let i=0; i < completeCount; i++) 
		{		
			sttHTML += "<tr>";
			sttHTML += "<td><input  type='text' id='ekey";
			sttHTML += i;
			sttHTML += "' style='width:200px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";
			sttHTML += "<td><input type='text' id='evalue";
			sttHTML += i;
			sttHTML += "' style='width:375px; font-size:16px; height:20px; color:#ffffff; background-color:#536e7d'></td>";
			sttHTML += "</tr>";
		}
	}
			
	sttHTML += "</table></fieldset></div>";	
	document.getElementById('aInfo').innerHTML = sttHTML;

	if(completeCount != 0)
	{
		let eOne = 'ekey';
		let eTwo = 'evalue';

		for(let i=0; i < completeCount; i++) 
		{		
			document.getElementById(eOne+i).value = completeKey[i];
			document.getElementById(eTwo+i).value = completeValue[i];
		}
	}
}
