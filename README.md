# node-PRTG
A Node.js module for interacting with the PRTG API. 

## Requirements

- PRTG 14.x+, earlier versions may work but have not been tested. 
- Node.js v0.10+

## Usage

```javascript

    var PRTG = require('node-PRTG');
    
    var api = new PRTG({
            url: 'http://your.prtg.install.com',
            username: 'username',
            passhash: '123456789'
    });
    
    api.getSensor(1234).then( /*do something with result*/ ).fail( /* handle errors */ );
    
```