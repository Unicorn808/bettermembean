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
		//defaultLayout: 'main',
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

app.get('/login', function(req, res) {
	res.render('login');
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