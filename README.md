# elastorm
Handy APIs for elastic search querying. Useful if you want to get rid of elasticsearch complicated json query (will be added more APIs soon).

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
##### .range(key, from, to)
Used to filter the results by a specific key.
```
buider.range('createdAt', '12/20/1985', '12/20/2015')
```
##### .view(array, viewRaw)
Used to set the fields that will return. Set viewRaw = true if you want to get the original returned from Elasticsearch.
```
buider.view([
            "firstname",
            "lastname",
            "email",
            "title",
            "group",
            "company",
            "permissions"
        ], true)
```
##### .sort(key, order, mode, ignore_unmapped)
Used to sort the results by a specific key.
```
buider.sort('createdAt', 'desc', null, true)
```
##### .group(groupname, field, output)
Used to group the results by a specific key. Output is the array of returned fields (similar to view api)
```
buider.group('company', 'company.raw', view)
```
##### .results(fn)
Used to get the results.
```
buider.results(function(res){
	//Do something with the results
})
```