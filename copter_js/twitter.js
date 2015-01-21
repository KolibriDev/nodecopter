var Twitter = require('node-twitter');
var twitterRestClient;

function statusWithImage(text, imgPath) {
    twitterRestClient.statusesUpdateWithMedia({
            'status': text,
            'media[]': imgPath
        },
        function(error, result) {
            if (error) {
                console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
            }

            if (result) {
                console.log(result);
            }
        }
    );
}

function status(text) {
    twitterRestClient.statusesUpdate({
        status: text
            //, in_reply_to_status_id: 357237590082072576
    }, function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
        }
    });
}

module.exports = function(options) {
    var twitterRestClient = new Twitter.RestClient(
        options.CONSUMER_KEY,
        options.CONSUMER_SECRET,
        options.TOKEN,
        options.TOKEN_SECRET
    );
    return {
    	"status":status,
    	"statusWithImage":statusWithImage
    }
}
