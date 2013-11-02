/*
 * GET index page.
 */

exports.index = function (req, res) {
    console.log('Displaying index page where users can enter a long url')

    res.render('index');
};