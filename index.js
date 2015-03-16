var util = require('util'),
    elasticsearch = require('elasticsearch');

module.exports = function (config) {
    this._index = config.index || '';
    this._limit = config.limit || 100;
    this._offset = config.offset || 0;
    this._es = elasticsearch.Client({
        host: config.elastic.host,
        sniffOnStart: config.elastic.sniffOnStart,
        sniffInterval: config.elastic.sniffInterval,
    });
    this._body = {
        query: {},
        sort: {},
        aggs: {}
    };
    this._view = false;
    this._viewRaw = false;

    this.query = function (string, fields, default_operator) {
        if (string) {
            this._body.query = {
                query_string: {
                    query: string || '',
                    fields: fields || ['_all'],
                    default_operator: default_operator || 'AND'
                }
            }
        }
        return this;
    };

    this.range = function (key, from, to) {
        if (from && to) {
            var range = util.format(" %s:{%s TO %s}", key, from, to);
            if (!this._body.query.query_string) {
                console.warn('You have not define the query string, please use .query() to define it first.')
            } else {
                this._body.query.query_string.query += range;
            }
        }
        return this;
    };

    this.view = function (array, viewRaw) {
        this._view = array;
        this._viewRaw = viewRaw;
        return this;
    };

    this.sort = function (key, order, mode, ignore_unmapped) {
        if (key) {
            this._body.sort[key] = {
                order: order,
                mode: mode,
                ignore_unmapped: ignore_unmapped
            }
        }
        return this;
    };

    this.aggregation = function (key, field, output) {
        if (key) {
            this._body.aggs[key] = {
                terms: {
                    field: field
                },
                aggs: {
                    top_tag_hits: {
                        top_hits: {
                            "_source": {
                                include: output
                            }
                        }
                    }
                }
            }
        }
        return this;
    };

    this.results = function (callback) {
        this._es.search({
            index: this._index,
            from: this._offset,
            size: this._limit,
            body: this._body
        }).then(function (resp) {
            var items = resp.hits.hits,
                newitems = [];
            if (this._viewRaw) { //if want to view raw results from es
                callback(resp);
            } else {
                if (this._view) { //if expected an results template
                    for (var i = 0; i < items.length; i++) {
                        newitems[i] = {};
                        for (var x = 0; x < this._view.length; x++) {
                            newitems[i][this._view[x]] = items[i]._source[this._view[x]];
                        }
                    }
                } else { //otherwise return all the fields
                    for (var i = 0; i < items.length; i++) {
                        newitems[i] = items[i]._source;
                    }
                }
                callback(newitems);
            }
        }.bind(this));
    };
    return this;
}
