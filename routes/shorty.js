/*
 * POST creates a short url from a long url
 */
exports.createShort = function (req, res) {
    var urlToShorten = req.body.urlToShorten;

    if (!urlToShorten) {
        console.log('Request did not contain a url to shorten, please provide urlToShorten');
        res.render('short', {message: 'Request did not contain a url to shorten, please provide urlToShorten'});
    } else {
        console.log("Request to shorten " + urlToShorten);

        urlToShorten = addhttp(urlToShorten);

        var baseUrl = 'http://localhost:' + req.app.get('port') + '/';
        var shortCode = createShortCode(urlToShorten);

        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.render('short', { shortUrl: baseUrl + shortCode });
    }
};

/*
 * GET retrieves long url from short url
 */
exports.getLong = function (req, res) {
    // grab the path and strip the leading slash
    var shortCode = req.path.substring(1);

    console.log("Fetching URL indexed by " + shortCode);

    var theLongUrl = shortToLong[shortCode];
    console.log('Short code ' + shortCode + " refers to " + theLongUrl);

    console.log("redirecting to " + theLongUrl);

    res.writeHead(302, {'Location': theLongUrl});
    res.end();
};

var id = 0;
var longToShort = [];
var shortToLong = [];
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';

function numToBase62(n) {
    if (n > 62) {
        return numToBase62(Math.floor(n / 62)) + CHARS[n % 62];
    } else {
        return CHARS[n];
    }
}

function createShortCode(longUrl) {
    console.log("Creating short code for url " + longUrl);

    // Check if there is already a shortcode for the longUrl
    shortUrlCode = longToShort[longUrl];

    if (shortUrlCode == undefined) {
        console.log(longUrl + " has not already been shortened, so shortening it now.");
        shortUrlCode = numToBase62(id);
        while (shortUrlCode.length < 5) {
            /* Add padding */
            shortUrlCode = CHARS[0] + shortUrlCode;
        }

        console.log("Shortened " + longUrl + " to a shortcode of " + shortUrlCode);

        longToShort[longUrl] = shortUrlCode;
        shortToLong[shortUrlCode] = longUrl;
        id++;
    }

    return shortUrlCode;
}

function addhttp(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
    }
    return url;
}

