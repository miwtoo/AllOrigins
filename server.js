/*!
 * AllOrigins
 * written by Gabriel 'Hezag' Nunes <tohezag@gmail.com>
 * http://github.com/hezag
 */

var express = require('express'),
    app     = express(),
    router  = express.Router(),
    request = require("request"),
    zlib    = require('zlib'),
    url     = require('url');

var port = 14570;
var appUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';

function isURL(str) {
		return /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test(str);
}

router.get('/get', function(req, res) {
    var start = new Date(),
        _url = req.query.url;
    if(!_url.startsWith("http")) {
        _url = "http://" + _url;
    }
    if(typeof req.query.url != "undefined" && req.query.url.length > 6 && isURL(_url)) {
        request({
            url: _url,
            encoding: null,
            headers: {
                'User-Agent': appUserAgent
            }
        },
        function(error, response, body) {
            var _response =
            {
                contents: (error != null) ? error.toString() : body.toString(),
                status: {
                    "url": unescape(_url),
                    "content_type": (error != null) ?  '' : response.headers['content-type'],
                    "http_code": (error != null) ? '0' : response.statusCode,
                    "response_time": (new Date() - start)
                }
            };

            if ((error == null) && response.headers['content-encoding'] == 'gzip') {
                zlib.gunzip(body, function(err, dezipped) {
                    _response.contents = dezipped.toString();
                    res.jsonp(_response);
                });
            } else {
                res.jsonp(_response);
            }
        });
    }
    else {
        res.jsonp({});
    }
});

app.use(router);
app.listen(port);
console.log('Listening on ' + port);