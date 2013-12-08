// these hold the mappings between short codes and longUrls
var longToShort = [];
var shortToLong = [];

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
        var baseUrl = 'http://' + req.app.get('hostname') + '/';

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


function createShortCode(longUrl) {
    console.log("Creating short code for url " + longUrl);

    // Check if there is already a shortcode for the longUrl
    shortUrlCode = longToShort[longUrl];

    if (shortUrlCode == undefined) {
        console.log(longUrl + " has not already been shortened, so shortening it now.");
        shortUrlCode = randomString(5);
        console.log("Shortened " + longUrl + " to a shortcode of " + shortUrlCode);

        longToShort[longUrl] = shortUrlCode;
        shortToLong[shortUrlCode] = longUrl;
    }

    return shortUrlCode;
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ';
    var result = '';

    console.log("Generating random alphanumeric string of length " + length);
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

function addhttp(url) {
    console.log("Adding http:// prefix to " + url + " if it doesnt already have it.");

    if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
    }
    return url;
}

