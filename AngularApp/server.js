var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001;
    nconf = require('nconf');
var compression = require('compression');


var isProd = (process.env.NODE_ENV) == 'production';
console.log("ENV IS : " + process.env.NODE_ENV);
var webpack;
var webpackDevMiddleware;
var webpackConfig;
var compiler;

if (!isProd) {
    console.log("Running in Development Mode")
    webpack = require('webpack');
    webpackDevMiddleware = require('webpack-dev-middleware');
    webpackConfig = require('./config/webpack.development.js');
    webpackConfig.devtool = "eval";
    // delete webpackConfig.output['sourceMapFilename']
    compiler = webpack(webpackConfig);
}


//Load the process.env into nconf
var configFile = isProd ? './config/production_config.json' : './config/development_config.json';
nconf.file(configFile).env();

app.get('/config.js', function(req, res){
    var config = {};
    config.NODE_ENV = process.env.NODE_ENV;
    config.INTERCOM_KEY = booleanChecker(nconf.get('INTERCOM_KEY'));
    config.INTERCOM_ENABLED = booleanChecker(nconf.get('INTERCOM_ENABLED'));
    config.INLINE_HELP_ENABLED = booleanChecker(nconf.get('INLINE_HELP_ENABLED'));
    config.BUGSNAG_KEY = booleanChecker(nconf.get('BUGSNAG_KEY'));
    config.BUGSNAG_ENABLED = booleanChecker(nconf.get('BUGSNAG_ENABLED'));
    config.GOOGLE_KEY = booleanChecker(nconf.get('GOOGLE_KEY'));
    config.GOOGLE_ENABLED = booleanChecker(nconf.get('GOOGLE_ENABLED'));
    config.STRIPE_KEY = booleanChecker(nconf.get('STRIPE_KEY'));
    config.UVIZE_SSO_LOGIN = booleanChecker(nconf.get('UVIZE_SSO_LOGIN'));
    config.API_SERVER = booleanChecker(nconf.get('API_SERVER'));


    res.setHeader('content-type', 'application/javascript');
    res.send("window.DummyApp_APP_CONFIG = " + JSON.stringify(config))
});

app.use(compression());

if (isProd) {
    app.use(express.static('deploy'));
    app.listen(port);

} else {
    console.log('Running in Dev Mode');
    app.use('/assets', express.static('deploy/assets'));
    app.use(webpackDevMiddleware(compiler, {
        output: {
            path: "/",
            publicPath: webpackConfig.output.publicPath,
            stats: {colors: true}
        }
    }));
    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log
    }));
    app.listen(port, "0.0.0.0", function(err) {
        if(err) console.log(err);
        console.log("Server running dev mode  at", "http://0.0.0.0:" + port + "/");
    });


}


//Functions
function setValue(environmentVariable, defaultConfig){
    if (typeof environmentVariable !== 'undefined') {
        return booleanChecker(environmentVariable)
    }
    return defaultConfig
}

function booleanChecker(testString) {
    if (typeof testString === 'boolean') {
        return testString
    }
    if (testString.toLowerCase() == 'true') {
        return true
    }
    if (testString.toLowerCase() == 'false') {
        return false
    }
    return testString
}
