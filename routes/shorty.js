/*
 * POST creates a short url from a long url
 */
exports.createShort = function (req, res) {
    var urlToShorten = req.body.urlToShorten;

    if (!urlToShorten) {
        console.log('Request did not contain a url to shorten, please provide urlToShorten')
        res.render('short', {message: 'Request did not contain a url to shorten, please provide urlToShorten'})
    } else {
        console.log("Shortening url of " + urlToShorten);
        var baseUrl = 'http://localhost:' + req.app.get('port') + '/'
        var shortUrlCode = createShortUrl(urlToShorten)

        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.render('short', { shortUrl: baseUrl + shortUrlCode });
    }
};

/*
 * GET retrieves long url from short url
 */
exports.getLong = function (req, res) {
    // grab the path and strip the leading slash
    var shortUrl = req.path.substring(1)

    console.log("fetching short url " + shortUrlCode)

    res.send("This will return the long url from " + shortUrlCode);
};

var id = 0;
var longToShort = new Array();
var shortToLong = new Array();
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';

function numToBase62(n) {
    if (n > 62) {
        return numToBase62(Math.floor(n / 62)) + CHARS[n % 62];
    } else {
        return CHARS[n];
    }
}

function createShortUrl(longUrl) {
    console.log("Shortening url of " + longUrl);

    /* Check whether the url has been added before */
    shortUrlCode = longToShort[longUrl];
    if (shortUrlCode == undefined) {
        shortUrlCode = numToBase62(id);
        while (shortUrlCode.length < 5) {
            /* Add padding */
            shortUrlCode = CHARS[0] + shortUrlCode;
        }
        longToShort[longUrl] = shortUrlCode;
        shortToLong[shortUrlCode] = longUrl;
        id++;
    }

    return shortUrlCode;
}

