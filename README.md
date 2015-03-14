# elastorm
Handy APIs for elastic search querying. Useful if you want to get rid of elasticsearch complicated json query.

#### Installation

```
$ npm install elastorm
```

#### How to use
```
var estorm = require('elastorm');
```
#### Create a builder object
```
var buider = estorm({
    index: //name of index,
    limit: //number of rows that returned,
    offset: //offset,
    elastic: {
        host: //IP address,
        sniffOnStart: //[true/false],
        sniffInterval: //[true/false],
    }
});
```
#### APIs
##### .query(string, fields, default_operator)
Used to build the query string.
```
buider.query('*firstname:Micheal lastname:Jackson*', ['firstname', 'lastname'], 'AND')
```