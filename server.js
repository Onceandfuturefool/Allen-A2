var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = serviceCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
  var checks = query['checks'];
  var savingsBal = query['savingsBal'];
  var checkBal = query['checkBal'];
  var checkCharge = .15;
  var charge = 0;
  var result ={};
  if(isNaN(checkBal))
  {
    throw Error("Invalid Value for checkBal");
  }
  else if(isNaN(savingsBal))
  {
    throw Error("Invalid Value for savingsBal");
  }
  else if(checks < 0)
  {
    throw Error("Invalid Value for checks");
  }
  else if(isNaN(checks))
  {
    throw Error("Invalid Value for checks");
  }
  else if(checkBal < 1000 && savingsBal < 1500)
  {
    charge = checks*checkCharge;
  }
    
  result = {'charge' : charge}; 
  return result;
}