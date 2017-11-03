const express 		= require('express'), app = express();
const exphbs  		= require('express-handlebars');
const bp 			= require('body-parser');
const mongo 		= require('mongodb');
const session 		= require('express-session');
const passwordHash 	= require('password-hash');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost/db";

app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs(
	{
		defaultLayout: 'landing',
		helpers: {
			eq: function (v1, v2) {
				return v1 === v2;
			},
			ne: function (v1, v2) {
				return v1 !== v2;
			},
			lt: function (v1, v2) {
				return v1 < v2;
			},
			gt: function (v1, v2) {
				return v1 > v2;
			},
			lte: function (v1, v2) {
				return v1 <= v2;
			},
			gte: function (v1, v2) {
				return v1 >= v2;
			},
			and: function (v1, v2) {
				return v1 && v2;
			},
			or: function (v1, v2) {
				return v1 || v2;
			}
		}
	}));


app.use(session({ secret: 'hello i am a super secret phrase, dont leak me pls 123 abc wew', cookie: { maxAge: 3600000 }}));
app.use(bp.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public_html'));
app.listen(process.env.PORT || 8080);

var landingPages = ["login", "register", "about", ""];
var dashPages = ["dashboard"];

for(var i = 0; i < landingPages.length; i++) {
	let pg = landingPages[i] === "" ? "index" : landingPages[i];
	app.get('/' + pg, function(req, res) {
		res.render(pg);
	});
}

app.post('/register', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        var errors = [];
        if(req.body.username == null || req.body.username.length == 0)
            errors.push("You must enter a username!");
        else if(req.body.username.length > 16)
            errors.push("Username must be 16 letters or less!");
        if(req.body.username != null && !/^\w+$/.test(req.body.username))
            errors.push("Username can only contain A-Z, 0-9, and underscores!");

        if(req.body.password == null || req.body.password.length == 0)
            errors.push("You must enter a password!");

        /*todo: schoolCode */

        var nxt = function() {
            if(errors.length == 0) {
                var userObj = { user: req.body.username, pass: passwordHash.generate(req.body.password) };
                db.collection("users").insertOne(userObj, function(err, dbres) {
                    if (err) {
                        req.session.registerError = err.toString();
                        res.render("register", { error: err.toString() });
                    } else {
                        req.session.loggedIn = true;
                        req.session.username = userObj.user;

                        res.writeHead(302, {
                            'Location': '/dashboard'
                        });
                        res.end();
                    }
                    db.close();
                });
            } else {
                res.render('register', {error: 'Invalid username or password'});
            }
        };

        if(errors.length == 0) {
            db.collection('users').find({"user": req.body.username}).count().then(cnt => {
                if(cnt > 0)
                    errors.push("Username already taken!");
                nxt();
            });
        } else nxt();
    });
});

app.post('/login', function(req, res) {
	var user = req.body.username || "";
	var pass = req.body.password || "";
	
	if(user == "") {
		res.render('login', { error: "Please enter a username!" });
	} else if(pass == "") {
		res.render('login', { error: "Please enter a password!" });
	} else {		
		MongoClient.connect(url, function(err, db) {
			if(err) {
				res.render('login', {layout: 'login', error: err.toString()});
				db.close();
			} else {
				db.collection('users').findOne({"user": req.body.username}).then((userObj) => {
					if(userObj != null) {
						if(passwordHash.verify(req.body.password, userObj.pass)) {
							req.session.loggedIn = true;
							req.session.username = userObj.user;
							res.writeHead(302, {
							  'Location': '/dashboard'
							});
							res.end();
						} else {
							res.render('login', {error: 'Invalid username or password'}); // if u wanna be more specific just change this to 'Invalid password'
						}
					} else {
						res.render('login', {error: 'Invalid username or password'}); // if u wanna be more specific just change this to 'Invalid username'
					}
					
					db.close();
				});
			}
		});
	}
});