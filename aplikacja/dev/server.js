var express = require("express"), // tutaj importujemy express
	bodyParser = require("body-parser"),
	async = require("async");
	mongo = require("mongodb"),
	MongoClient = mongo.MongoClient,
	ObjectID = require('mongodb').ObjectID,
	app = express(),
	dbUrl = "mongodb://localhost:27017/videoRental"; // adres url naszej bazy danych

// APP.USE to jest w ogóle taki middleware, który pośredniczy we wszystkich zapytaniach, które są tutaj wykonywane
app.use(express.static(__dirname + "/public")); // ustawiamy katalog 'public' na katalog publiczny
app.use(bodyParser.json()); // chcemy, żeby wszystko co będzie przesyłane, było parsowane jako json

var routes = {

	"/movies": "movies",
    "/actors": "actors",
    "/categories": "categories",
    "/rents": "rents",
    "/clients": "clients",

    "/movie/:id": "movies",
    "/actor/:id": "actors",
    "/category/:id": "categories",
    "/rent/:id": "rents",
    "/client/:id": "clients"

};

function handleError(res) {

	res.status(500);
	res.json({error: true});

};

function isValidId(id) {

	return ObjectID.isValid(id);

};

function createObjectId(id) {

	return new mongo.ObjectID(id);

};

function dbConnect(req, res, callback) {

	MongoClient.connect(dbUrl, { useNewUrlParser:true }, function(err, database) {

		if(err) return handleError(res);

		callback(req, res, database);

	});

};

function getItem(req, res) {

	var id = req.params.id,
		isValid = isValidId(id),
		colname = routes[req.route.path];

	if(!isValid) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("actors").find({_id: createObjectId(id)}).toArray(function(err, docs) {

			if(err) return handleError(res);

			res.json(docs[0]);

			database.close();

		});

	});

};

function createItem(req, res) {

	colname = routes[req.route.path];

	if(colname === "rents") {
		req.body.date = new Date(); // bo dodajemy do wypożyczenia jego datę
	}

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection(colname).insertOne(req.body, function(err, result) { // pod 'req.body' będzie wszystko to, co zostanie przesłane przez backbone

			if(err) return handleError(res);

			// jeżeli nie ma błędu, to pobieramy dokument i go zwracamy
			res.json(result.ops[0]);

			database.close();

		});

	});

};

function updateItem(req, res) {

	var id = req.params.id,
		isValid = isValidId(id),
		colname = routes[req.route.path];

	if(!isValid) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		delete req.body._id; // bo nie możemy zapisać na serwerze nowego modelu, któremu chcemy nadać id (id jest unikalne i nadawane przez mongodb) -> robimy to przed wysłaniem całego obiektu 'req.body'

		var db = database.db("videoRental");
		db.collection(colname).findOneAndUpdate({_id: createObjectId(id)}, {$set: req.body}, {returnOriginal: false}, function(err, doc) { // pod 'req.body' będzie zmieniony model (będzie to obiekt, ale nie zostanie to przesłane w formie json -> trzeba będzie doinstalować do node i express dodatek (specjalny parser 'body-parser'), żeby mogło to być przesłane w formie json)

			if(err) return handleError(res);

			// jeżeli nie ma błędu, to pobieramy dokument i go zwracamy
			res.json(doc);

			database.close();

		});

	});

};

function removeItem(req, res) {

	var id = req.params.id,
		isValid = isValidId(id),
		colname = routes[req.route.path];

	if(!isValid) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection(colname).findAndRemove({_id: createObjectId(id)}, null, function(err, result) { 

			if(err) return handleError(res);

			res.json({deleted: true}); // jeżeli zwrócimy tutaj z serwera jakikolwiek status code z poziomu 200, tzn. że wszystko poprawnie z serwera zostało usunięte

			database.close();

		});

	});

};

// 'all' działa jak get, put etc., ale obsługuje wszystkie typy żądań
	// ("*") - tzn. każdy adres url
app.all("*", function(req, res, next) {

	res.format({

		// ta funkcja wykona się, kiedy wyślemy zapytanie o dane json (tak jak robi to np. Backbone przez AJAX), tzn. kiedy będzie akceptować odpowiedź 'application/json' i potem przejdzie do kolejnej funkcji, która to zapytanie sobie obsłuży
		json: function() {
			next();
		},

		html: function() {
			res.redirect("/");
		}

	});

});

app.get("/", function(req, res) {

	res.sendfile("index.html");

});

app.get("/movies", function(req, res) {

	var limit = req.query.limit,
		skip = req.query.skip,
		order = parseInt(req.query.order),
		name = req.query.name,
		regex = new RegExp(name, "ig");

	// tutaj będziemy chcieli podłączyć się do mongodb i pobrać dostępne filmy
	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("movies").find({title: regex}, {limit: Number(limit), sort: {title: order || 1}}).skip(Number(skip)).toArray(function(err, docs) {
		// db.collection("movies").find({title: regex}).toArray(function(err, docs) {

			if(err) return handleError(res);

			res.json(docs); // odsyłamy dokumenty (tablicę json) do serwera

			database.close(); // po wykonaniu zapytania do bazy danych, powinniśmy bazę danych zamykać

		});

	});

});

app.get("/actors", function(req, res) {

	var limit = req.query.limit,
		skip = req.query.skip,
		order = parseInt(req.query.order),
		name = req.query.name,
		regex = new RegExp(name, "ig");

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		// db.collection("actors").find({name: regex}).toArray(function(err, docs) {
		db.collection("actors").find({name: regex}, {limit: Number(limit), sort: {name: order || 1}}).skip(Number(skip)).toArray(function(err, docs) {

			if(err) return handleError(res);

			res.json(docs);

			database.close();

		});

	});

});

app.get("/categories", function(req, res) {

	// tutaj odczytujemy query z zapytania
	var limit = req.query.limit,
		order = parseInt(req.query.order),
		name = req.query.name,
		regex = new RegExp(name, "ig");

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("categories").find({name: regex}, {sort: {name: order || 1}}).toArray(function(err, docs) {
			// jeżeli wyślemy zapytanie bez parametru 'name', to '{name: regex}' zostanie zignorowane i zwrócone zostaną wszystkie kategorie

			if(err) return handleError(res);

			res.json(docs);

			database.close();

		});

	});

});

app.get("/clients", function(req, res) {

	var limit = req.query.limit,
		skip = req.query.skip,
		order = parseInt(req.query.order),
		name = req.query.name,
		regex = new RegExp(name, "ig");

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("clients").find({$or: [{first_name: regex}, {last_name: regex}]}, {limit: Number(limit), sort: {first_name: order || 1}}).skip(Number(skip)).toArray(function(err, docs) {

			if(err) return handleError(res);

			docs.forEach(function(doc) {

				doc.name = doc.first_name + " " + doc.last_name;

				delete doc.first_name;
				delete doc.last_name;
				
			});

			res.json(docs);

			database.close();

		});

	});

});

app.get("/rents", function(req, res) {

	var limit = req.query.limit, // z poziomu Backbone będziemy przekazywać ten limit razem z żądaniem (tylko mam jakiś błąd 500, kiedy próbuję przekazać limit jako zmienną... -> do sprawdzenia)
		skip = req.query.skip,
		order = parseInt(req.query.order),
		name = req.query.name,
		regex = new RegExp(name, "ig");

	// tutaj będziemy chcieli podłączyć się do mongodb i pobrać dostępne filmy
	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("rents").find({}, {limit: Number(limit), sort: {date: order || 1}}).skip(Number(skip)).toArray(function(err, docs) {

			if(err) return handleError(res);

			async.each(docs, function(doc, eachCallback) {

				async.parallel([

					function(callback) {

						db.collection("movies").find({_id: new mongo.ObjectID(doc.movie_id)}, {limit: 1, fields: {title: 1}}).toArray(function(err, movie) {

							if(err) return handleError(res);

							delete doc.movie_id;
							doc.movie_title = movie[0].title;

							callback();

						});

					}, 

					function(callback) {

						db.collection("clients").find({_id: new mongo.ObjectID(doc.client_id)}, {limit: 1, fields: {first_name: 1, last_name: 1}}).toArray(function(err, client) {

							if(err) return handleError(res);

							delete doc.client_id;
							doc.client_name = client[0].first_name + " " + client[0].last_name;

							callback();

						});

					}

				], function(err) {

					if(err) {
						eachCallback(err);

						return;
					}

					eachCallback();
				});

			}, function(err) {

				if(err) return handleError(res);

				// wyszukiwanie wypożyczen - przed odesłaniem listy wypożyczen będziemy sprawdzać, czy tytuły wypozyczonych filmów zgadzają się z tym, co zostało wpiane przez użytkownika i dopiero wtedy będziemy odsyłać przefiltrowaną listę wypożyczen
				var filteredDocs = docs.filter(function(doc) {

					return doc.movie_title.match(regex);
					
				});

				res.json(filteredDocs); // ta funkcja przesyła już dla nas dokumenty uzupełnione o szczegóły wypożyczen
				database.close();
			});

		});

	});

});

// za pomocą '/:id' przypisuje się dynamiczne parametry w Express.js
app.get("/movie/:id", function(req, res) {

	var id = req.params.id,
		isValid = isValidId(id);

	if(!isValid) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("movies").find({_id: createObjectId(id)}).toArray(function(err, docs) {

			if(err) return handleError(res);

			// zapytanie do kolekcji rents sprawdzające ilość wypożyczonych filmów
			var movie = docs[0];

			db.collection("rents").count({movie_id: id}, function(err, count) {

				if(err) {
					res.status(500);
					res.json({error: true});

					return;
				}

				movie.rent_number = count;
				movie.available = count < movie.quantity;

				res.json(movie);

				database.close();

			});

		});

	});

});

app.get("/actor/:id", getItem);
app.get("/category/:id", getItem);
app.get("/client/:id", getItem);

app.get("/rent/:id", function(req, res) {

	var id = req.params.id,
		isValid = isValidId(id);

	if(!isValid) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");
		db.collection("rents").find({_id: createObjectId(id)}, {limit: 1}).toArray(function(err, docs) {

			if(err) return handleError(res);

			// tutaj dopisujemy do znalezionego wypożyczenia tytuł filmu oraz nazwę naszego klienta
			async.parallel([

				function(callback) {

					console.log(docs[0].movie_id);

					db.collection("movies").find({_id: new mongo.ObjectID(docs[0].movie_id)}, {limit: 1, fields: {title: 1}}).toArray(function(err, movie) {

						if(err) return handleError(res);

						// delete docs[0].movie_id;
						docs[0].movie_title = movie[0].title;

						callback();

					});

				}, 

				function(callback) {

					db.collection("clients").find({_id: new mongo.ObjectID(docs[0].client_id)}, {limit: 1, fields: {first_name: 1, last_name: 1}}).toArray(function(err, client) {

						if(err) return handleError(res);

						// delete docs[0].client_id;
						docs[0].client_name = client[0].first_name + " " + client[0].last_name;

						callback();

					});

				}

			], function(err) {

				if(err) return handleError(res);

				// kiedy nie ma błędu, to odsyłamy jeden znaleziony dokument
				res.json(docs[0]);

				database.close();
				
			});

		});

	});

});

// zapisywanie zmian w modelu po stronie serwera
app.put("/movie/:id", updateItem);
app.put("/actor/:id", updateItem);
app.put("/category/:id", updateItem);
app.put("/client/:id", updateItem);
app.put("/rent/:id", updateItem);

app.post("/movies", createItem);
app.post("/actors", createItem);
app.post("/categories", createItem);
app.post("/clients", createItem);
app.post("/rents", createItem);

app.delete("/movie/:id", removeItem);
app.delete("/actor/:id", removeItem);
app.delete("/category/:id", removeItem);
app.delete("/client/:id", removeItem);
app.delete("/rent/:id", removeItem);

app.get("/info/:colname", function(req, res) {

	var availableNames = ["movies", "actors", "categories", "rents", "clients"], // pozwalamy wyszukiwać liczbę filmów, aktorów itd. tylko w tych kolekcjach
		colname = req.params.colname,
		name = req.query.name, // name zostanie nam przesłane z widoku 'ListPaginationView.js' z zapytania AJAX (obiekt data)
		regex = new RegExp(name, "ig"),
		fields = [
			{ first_name: regex },
			{ last_name: regex },
			{ title: regex },
			{ name: regex }
		]; // bo po różnych polach, w zalezności od kolekcji, możemy wyszukiwać

	if(availableNames.indexOf(colname) === -1) return handleError(res);

	dbConnect(req, res, function(req, res, database) {

		var db = database.db("videoRental");

		if(colname === "rents") {

			db.collection("rents").find({}).toArray(function(err, docs) {

				var count = 0;

				async.each(docs, function(doc, callback) {

					var rent = doc;

					db.collection("movies").find({_id: new mongo.ObjectID(rent.movie_id)}, {limit: 1, fields: {title: 1}}).toArray(function(err, movie) {

						if(err) {
							callback(err);

							return;
						}

						if(movie[0].title.match(regex)) {
							count++;
						}

						callback();

						return;

					});
					
				}, 
				
				// do tej funkcji przechodzimy kiedy wykona się callback
				function(err) {

					if(err) return handleError(res);

					// odsyłamy ilość rekordów w kolekcji
					res.status(200);
					res.set("Content_Type", "text/plain");
					res.send(String(count));
		
					database.close();
					
				});
				
			});
			
		} else {

			db.collection(colname).countDocuments({$or: fields}, function(err, count) {

				if(err) return handleError(res);
	
				// odsyłamy ilość rekordów w kolekcji
				res.status(200);
				res.set("Content_Type", "text/plain");
				res.send(String(count));
	
				database.close();
	
			});
			
		}

	});

});

app.listen("8000", function() {
	console.log("Serwer aktywny");
});