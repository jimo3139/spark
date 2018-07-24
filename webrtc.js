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

function runSession(session) {
    console.log("runSession()");
    session.socket = new WebSocket("ws://" + session.server + ":8188", "janus-protocol");
    session.socket.onclose = function (evt) {
        onSocketClosed(session, evt);
    };
    session.socket.onerror = function (evt) {
        onSocketError(session, evt);
    };
    session.socket.onmessage = function (evt) {
        onSocketMessage(session, evt);
    };
    session.socket.onopen = function (evt) {
        onSocketOpened(session, evt);
    };
}

function onSessionCreated(session, msg) {
    console.log("onSessionCreated");
    session.id = msg.data.id;
    sendSocketKeepAlive(session);
    let tx = randAlphaNum(12);
    session.transactionMap.set(tx, onAttachedPlugin);
    let body = {
        janus: "attach",
        session_id: session.id,
        transaction: tx,
        "force-bundle": true,
        "force-rtcp-mux": true,
        plugin: "janus.plugin.streaming"
    };
    session.socket.send(JSON.stringify(body));
}

function onSocketClosed(session, evt) {
    console.warn("socket closed");
}

function onSocketError(session, evt) {
    console.error("socket error", evt);
    if (!session.hasConnected) {
        cleanUp("Your Skreens instance isn't there anymore (or you're having network problems)", session);
    }
    else {
        cleanUp("Your instance may have just shut down, or you're experiencing network problems", session);
    }
}

function onSocketMessage(session, evt) {
    let msg = JSON.parse(evt.data);
    if (msg.transaction !== undefined && msg.transaction != null && msg.transaction != "") {
        let fn = session.transactionMap.get(msg.transaction);
        if (fn != null) {
            fn(session, msg);
            // transactionMap.delete(msg.transaction);
        }
        else {
            console.log("unhandled message", msg);
        }
    }
    else {
        if (msg.janus == "webrtcup") {
            onWebRTCUp(session, msg);
        }
        else {
            console.log("server side event", msg);
        }
    }
}

function onSocketOpened(session, evt) {
    console.log("socket opened");
    // create session
    let tx = randAlphaNum(12);
    session.transactionMap.set(tx, onSessionCreated);
    let body = {
        janus: "create",
        transaction: tx
    };
    session.socket.send(JSON.stringify(body));
}

function randAlphaNum(len) {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < len; i++) {
        let pos = Math.floor(Math.random() * charSet.length);
        str += charSet.substring(pos, pos + 1);
    }
    return str;
}

function sendSocketKeepAlive(session) {
    let tx = randAlphaNum(12);
    session.transactionMap.set(tx, () => { });
    let body = {
        janus: "keepalive",
        session_id: session.id,
        transaction: tx
    };
    session.socket.send(JSON.stringify(body));
    setTimeout(() => {
        // delete the previous transaction handler, so we don't leak memory
        session.transactionMap.delete(tx);
        sendSocketKeepAlive(session);
    }, 45000);
}

function onAttachedPlugin(session, msg) {
    console.log("onAttachedPlugin");
    session.handleId = msg.data.id;
    // let's get a list of the streams on the server
    let tx = randAlphaNum(12);
    session.transactionMap.set(tx, onReceivedStreamList);
    let body = {
        janus: "message",
        transaction: tx,
        session_id: session.id,
        handle_id: session.handleId,
        body: {
            request: "list"
        }
    };
    session.socket.send(JSON.stringify(body));
}

function onReceivedStreamList(session, msg) {
    console.log("onReceivedStreamList");
    if (msg.plugindata.data.list.length == 0) {
        cleanUp("Hmmm… there is no video stream on the server", session);
        return;
    }
    let stream = msg.plugindata.data.list[0];
    // let's watch the first stream. Setup an RTCPeerConnection.
    let turnURL = "turn:" + session.server + ":80";
    let iceServers = [
        // {urls: "stun:stun.l.google.com:19302"},
        // {urls: turnURL, username: "webrtc", credential:"joejoejoe", credentialType: "password"},
        { urls: "turn:turn.skreens.tv:80?transport=tcp", username: "webrtc", credential: "joejoejoe", credentialType: "password" },
        { urls: "turn:turn.skreens.tv:443", username: "webrtc", credential: "joejoejoe", credentialType: "password" },
    ];
    session.peerConn = new RTCPeerConnection({
		//getTracks()[0].enabled = false;
        iceServers: iceServers
    });
    session.peerConn.onicecandidate = (evt) => {
        onICECandidateReceived(session, evt);
    };
    session.peerConn.ontrack = (evt) => {
        console.log("ontrack", evt);
        session.video.srcObject = evt.streams[0];
    };
    // send the watch command to Janus
    let tx = randAlphaNum(12);
    session.transactionMap.set(tx, onWatchCommandResponse);
    let body = {
        janus: "message",
        transaction: tx,
        session_id: session.id,
        handle_id: session.handleId,
        body: {
            id: stream.id,
            request: "watch"
        }
    };
    session.socket.send(JSON.stringify(body));
}

function onWatchCommandResponse(session, message) {
    console.log("onWatchCommandResponse", message);
    if (message.janus == "ack") {
        // we want to wait for the first 'event' message, which will contain the sdp info
        return;
    }
    let msg = message;
    if (session.peerConn == null) {
        cleanUp("Error: onWatchCommandResponse null peerConn", session);
        return;
    }
    console.log("remote sdp", msg.jsep.sdp);
    session.peerConn.setRemoteDescription(msg.jsep).then(() => {
        console.log("Successfully set the remote description");
    }).catch((err) => {
        console.error("Failed to set the remote description", err);
        cleanUp("Error: failed to set remote description: " + err, session);
    });
    session.peerConn.createAnswer().then((sdp) => {
        onAnswerCreated(session, sdp);
    }).catch((err) => {
        console.error("Failed to create answer", err);
        cleanUp("Error: failed to create answer: " + err, session);
    });
}

function onAnswerCreated(session, sdp) {
    console.log("onAnswerCreated");
    if (session.peerConn == null) {
        cleanUp("This should never happen. Contact support. (onAnswerCreated null peerConn)", session);
        return;
    }
    console.log("local sdp", sdp.sdp);
    session.peerConn.setLocalDescription(sdp).then(() => {
        onSetLocalDescriptionCompleted(session);
    }).catch((err) => {
        console.error("Failed to set local description", err);
        cleanUp("Error: failed to set local description: " + err, session);
    });
}

function cleanUp(msg, session) {
    // TODO
    let video = document.getElementById("kic-video");
    video.style.display = "none";
    let p = document.getElementById("error-text");
    p.style.display = "block";
    p.innerText = msg;
    if (session != null) {
        if (session.peerConn != null) {
            session.peerConn.close();
            session.peerConn = null;
        }
        if (session.socket != null) {
            session.socket.onclose = () => { };
            session.socket.onerror = () => { };
            session.socket.onmessage = () => { };
            session.socket.onopen = () => { };
            session.socket.close();
        }
    }
}

function onSetLocalDescriptionCompleted(session) {
    console.log("onSetLocalDescriptionCompleted");
    if (session.peerConn == null) {
        cleanUp("This shouldn't happen. (onSetLocalDescriptionCompleted null peerConn)", session);
        return;
    }
    if (session.peerConn.localDescription == null) {
        cleanUp("We hit an unexpected error. Contact support. (localDescription null)", session);
        return;
    }
    let tx = randAlphaNum(12);
    let body = {
        janus: "message",
        transaction: tx,
        session_id: session.id,
        handle_id: session.handleId,
        body: {
            request: "start"
        },
        jsep: {
            sdp: session.peerConn.localDescription.sdp,
            type: session.peerConn.localDescription.type
        }
    };
    session.transactionMap.set(tx, (s, msg) => {
        console.log("start response", msg);
    });
    session.socket.send(JSON.stringify(body));
}

function onICECandidateReceived(session, evt) {
    console.log("onIceCandidate", evt.candidate);
    // TODO: Do we need to do something special for Edge?
    if (evt.candidate === undefined || evt.candidate == null) {
        // No more candidates coming in, so let Janus know we're done
        console.log("No more candidates");
        if (session.iceCandidateCount < 1) {
            console.error("No ICE candidates received!");
            cleanUp("❗ We couldn't find a network route to the server ❗", session);
        }
        let tx = randAlphaNum(12);
        let body = {
            janus: "trickle",
            transaction: tx,
            session_id: session.id,
            handle_id: session.handleId,
            candidate: {
                completed: true
            }
        };
        session.transactionMap.set(tx, (msg) => {
            console.log("no more candidates response", msg);
        });
        return;
    }
    session.iceCandidateCount++;
    // send it to Janus
    let tx = randAlphaNum(12);
    let body = {
        janus: "trickle",
        transaction: tx,
        session_id: session.id,
        handle_id: session.handleId,
        candidate: {
            candidate: evt.candidate.candidate,
            sdpMid: evt.candidate.sdpMid,
            sdpMLineIndex: evt.candidate.sdpMLineIndex
        }
    };
    session.transactionMap.set(tx, (s, msg) => {
        console.log("trickle response", msg);
        s.transactionMap.delete(tx);
    });
    session.socket.send(JSON.stringify(body));
}

function onWebRTCUp(session, message) {
    console.log("onwebrtcup");
    session.hasConnected = true;
}
