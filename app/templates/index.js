'use strict';

var h5bp = require('h5bp');

var app = h5bp.createServer({root: __dirname + '/public'});
app.listen(3000);
