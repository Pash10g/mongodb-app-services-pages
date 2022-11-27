// Add Realm App ID here.
const appId = process.env.APP_ID
const appConfig = {
  id: appId,
  timeout: 1000,
};

// Creates an anonymous credential
const credentials = Realm.Credentials.anonymous();

// Gets a MongoDB Realm app instance
const app = new Realm.App(appConfig);

function onLoad() {
    // Authentication
    app.logIn(credentials).then((user) => {
    console.log(`Logged in with the user: ${user.identity}`);
    });

    // MongoDB Data Access
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const mydb = mongodb.db("mydb");
    const mycollection = mydb.collection("mycollection");

    // Insert a movie
    mycollection
    .insertOne({
        title: "The Room",
        year: 2003,
        runtime: 99,
        cast: ["Tommy Wiseau", "Juliette Danielle"],
        genres: ["drama", "romance"],
    })
    .then((result) => {
        console.log(`Inserted a movie with the title 'The Room': ${result}`);
    });

    // Query for a movie that has the title 'The Room'
    mycollection.findOne({ title: "The Room" }).then((result) => {
    console.log(`Found a movie with the title 'The Room': ${result}`);
    });

    // Query for all movies that have a runtime less than 15 minutes
    mycollection
    .find({ runtime: { $lt: 15 } }, { limit: 100 })
    .asArray()
    .then((result) => {
        console.log(`Found ${result.length} short movies (less than 15 minutes):`);
        result.forEach((movie) => {
        console.log(`  - ${movie.title} (runtime: ${movie.runtime} minutes)`);
        });
    });

    // Update a movie
    mycollection
    .updateOne({ title: "The Room" }, { $set: { runtime: 99 } })
    .then((result) => {
        console.log(
        `Updated the movie 'The Room' to have a new runtime of ${result.modifiedCount} minutes.`
        );
    });

    // Delete a movie
    mycollection
    .deleteOne({ title: "The Room" })
    .then((result) => {
        console.log(`Deleted the movie 'The Room': ${result}`);
    });
}


