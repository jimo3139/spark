var net = require('net');
var http = require("http");
var url = require('url');
var fs = require('fs');
readline = require('readline');
var express = require('express');
var bodyParser = require('body-parser');

var dbgmessage = false;

var app = express();
app.use(bodyParser.json());

var server;
var myKeyValue = "0";
var myAck = "nack";
var glbPath="";

var snapshot = {"State":"empty"};
var glbResponse;
var localHost = '127.0.0.1';
var tcpPort = 5556;
var sockPort = 9997;
var passCount = 0;
const UUID = 'J9TPP08IIJHREM03P22IZXKSBYZM91FH22L1';
//*********************************************************************************
// createServer method creates a server on your computer
//*********************************************************************************
server = http.createServer(function(req, res)
{
	var path = url.parse(req.url).pathname;
	glbResponse = res;

	glbPath = (__dirname);
	console.log("SRV001: createServer() with URL directory path [%s]", glbPath );

	switch (path)
	{
        	case '/':
				console.log("SRV002: Client web page has been configured, adding page spark.html");
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write('<h1>Press here to start the SPARK <a href="/spark.html">Tester</a></h1>');
				res.end();
        		break;
        	case '/spark.html':
				console.log("SRV003: Client web page has accessed our server, with page = %s",__dirname + path);
	       		fs.readFile(__dirname + path, function(err, data)
				{
                	if (err)
					{ 
						return send404(res);
                	}
                	res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                	res.write(data, 'utf8');
                	res.end();
				});
            	break;
        	case '/webrtc.js':
        	case '/utils.js':
        	case '/spark.js':
				console.log("SRV013: Client web page has accessed our server, with page = %s",__dirname + path);
	       		fs.readFile(__dirname + path, function(err, data)
				{
                	if (err)
					{ 
						return send404(res);
                	}
                	res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                	res.write(data, 'utf8');
                	res.end();
            	});
            	break;
        	case '/favicon.ico':
				console.log("SRV004: Client web page has accessed our server looking for image, with path = %s",__dirname + '/images' + path);
	       		fs.readFile(__dirname + '/images' + path, function(err, data) {
                	if (err)
					{ 
						return send404(res);
                	}
                	res.writeHead(200, {'Content-Type': 'image/jpg'});
                	//res.write(data, 'utf8');
                	res.end(data);
            	});
            	break;
        	case '/facehelp.png':
				console.log("SRV024: Client web page has accessed our server looking for image, with path = %s",__dirname + '/images' + path);
	       		var fileToLoad = fs.readFile(__dirname + '/images' + path, function(err, data) {
                	if (err)
					{ 
						return send404(res);
                	}
                	res.writeHead(200, {'Content-Type': 'image/jpg'});
					res.end(fileToLoad, 'binary');
            	});
            	break;
        	case '/facehelp.jpg':
        	case '/galaxy.jpg':
				console.log("SRV014: Client web page has accessed our server looking for image, with path = %s",__dirname + '/images' + path);
	       		fs.readFile(__dirname + '/images' + path, function(err, data) {
                	if (err)
					{ 
						return send404(res);
                	}
					res.writeHead(200, {'Content-Type': 'image/jpg'});
					res.write(data, 'utf8');
					res.end(data,'binary');
				});	
            	break;
        	default: 
			console.log("SRV005: Client web page has an error 404 for path [%s]",path);
			send404(res);
    	}
}),
//*********************************************************************************
//
//*********************************************************************************
send404 = function(res)
{
	console.log("ERR404: Client web page file or path not found.");
	res.writeHead(404);
	res.write('ERROR 404, File or path is not found.');
	res.end();
};

// use socket.io on port sockPort
server.listen(sockPort);
var io = require('socket.io').listen(server);
	console.log("The server is running on port " + sockPort);

//turn off debug
io.set('log level', 1);

//*********************************************************************************
// define interactions with client
//*********************************************************************************
io.sockets.on('connection', function(socket)
{
	//*********************************************************************************
	//send data to client
	//*********************************************************************************
	setInterval(function()
	{ 			
		if(dbgmessage == true)
			console.log("SDC001: Check: TCP port = %s",tcpPort);
//**********************
		var rd = readline.createInterface(
		{
    		input: fs.createReadStream(__dirname + '/info.txt'),
   	 		output: process.stdout,
    		terminal: false
		});

		rd.on('line', function(line) 
		{
			if(dbgmessage == true)
				console.log("Part1 = " + line);

			let message = ("timer " + passCount);
			socket.emit('response', message);
		});	
//**********************
		var details = readline.createInterface(
		{
    		input: fs.createReadStream(__dirname + '/info.txt'),
   	 		output: process.stdout,
    		terminal: false
		});

		details.on('line', function(line) 
		{
			if(dbgmessage == true)
				console.log("Part2 = " + line);
			socket.emit('responseDetails',snapshot);
			if(dbgmessage == true)
				console.log("SDC003: " + JSON.stringify(snapshot, null, 3));
		});	

	}, 3000); // every 3 seonds.
	//*********************************************************************************
	//recieve client response
	//*********************************************************************************
	socket.on('clientResponse', function(data)
	{
		myKeyValue = data.myToken;
		if(dbgmessage == true)
			console.log("SOC007: Received a request from ther client = %s",myKeyValue);
		
		var option = data.myToken.split(" ", 5);
		var cmd1  = option[0];
		var cmd2  = option[1];
		var cmd3  = option[2];

		if(dbgmessage == true)
			console.log("SOC077: Received token 1 = %s, 2 = %s",cmd1,cmd2);

		// See if our tester is changing the port numbers.
		if(cmd1 == "sockPort" ) { 
			sockPort = cmd2;
			console.log("SOC200: Setting server port = %s",sockPort);
		}
		else if(cmd1 == "tcpPort" ){ 
			tcpPort = cmd2;
			console.log("SOC201: Setting TCP port = %s",tcpPort);
		}
		else if(cmd1 == "images/facehelp.png")
		{	
			fs.readFile(glbPath, function(err, data) {
				if (err)
				{ 
					return send404(glbResponse);
				}
				glbResponse.writeHead(200, {'Content-Type': 'image/jpg'});
				glbResponse.write(data, 1000, 'binary');
				glbResponse.end();
			});
			console.log("SOC189: Sent %s",cmd1);
		}
		else if(cmd1 == "/images/facehelp.jpg")
		{	
			fs.readFile(glbPath+cmd1, function(err, data) {
				if (err) 
				{ 
					return send404(glbResponse);
				}

				http.createServer(function(request, response) {  
					response.writeHead(200, {'Content-Type': 'image/jpg'});
					response.write(data, 'utf8');
					response.end();
				}); //.listen(9997);
			});
			console.log("SOC199: Sent %s",glbPath+cmd1);
		}
		else if(cmd1 == "/images/galaxy.jpg")
		{	
			var image = readline.createInterface(
			{
    			input: fs.createReadStream(__dirname + cmd1),
   		 		output: process.stdout,
				terminal: false
			});

			// Loop here sending the image.
			image.on('line', function(line) 
			{
				socket.emit('responseImage', { 'responseImage': line });
			});	
			console.log("SOC200: Sent %s",cmd1);
		}
		else if(cmd1 == "favoriteRequest")
		{	
			var favor = readline.createInterface(
			{
    			input: fs.createReadStream(__dirname + '/info.txt'),
   		 		output: process.stdout,
    			terminal: false
			});

			favor.on('line', function(line) 
			{
   				//console.log(line);
				socket.emit('responseFavor', { 'responseFavor': line });
			});	
			console.log("SOC201: Sent %s",cmd1);
		}
		else if(cmd1 == "log:")
		{	
 			process.stdout.write(data.myToken);
			fs.appendFile(__dirname + '/info.log', myKeyValue + "\n", function(err, data)
			{
   				if (err)
				{ 
       		      			return send404(res);
    			}
				console.log(" has been sent to file %s/info.log ",__dirname);
    		});
			console.log("SOC202: Sent %s",cmd1);
		}
		else if(cmd1 == "optionsRequest")
		{	
			if(cmd2 == "captures") {
				var options = readline.createInterface(
				{
					input: fs.createReadStream(__dirname + '/info.txt'),
					output: process.stdout,
    				terminal: false
				});

				options.on('line', function(line) 
				{
					if(dbgmessage == true)
						console.log("Part3 = " + line);
					let message = ("captures " + passCount);
					socket.emit('responseOptions', message);
				});
			}	
		}
		else // The default command is a info command.
		{
 			process.stdout.write("INFO: " + data.myToken);
			if(cmd3 == "write") {
				fs.writeFile(__dirname + '/info.txt', "INFO: " + myKeyValue + "\n", function(err, data)
				{
					if (err)
					{ 
						return send404(res);
					}
					console.log(" has been written to file %s/info.txt ",__dirname);
				});
			}
			if(cmd3 == "append") {
				fs.appendFile(__dirname + '/info.txt', "INFO: " + myKeyValue + "\n", function(err, data)
				{
					if (err)
					{ 
						return send404(res);
					}
					console.log(" has been appended to file %s/info.txt ",__dirname);
				});
			}
		}
	});

});


var zmq = require('zeromq')
var subscriber = zmq.socket('sub')

subscriber.on("message", function(reply) {
	snapshot = reply.toString();
	console.log('REQ001: Received message: ', reply.toString());
	passCount++;
})

subscriber.connect("tcp://localhost:5556")
subscriber.subscribe("")

process.on('SIGINT', function() {
  subscriber.close()
  console.log('\nClosed')
})
