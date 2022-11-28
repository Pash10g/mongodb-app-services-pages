

async function getAxiosAppId() {
     
    
    var response = await axios.get('https://eu-west-1.aws.data.mongodb-api.com/app/realm-web-app-msmqs/endpoint/getAppIDAPIToken')
        

    return response.data;
}





async function onLoad(){

    var appVars = await getAxiosAppId();

    console.log("appVars: " + JSON.stringify(appVars));
    

    // Add Realm App ID here.
    const appId = appVars.appId
    const appConfig = {
    id: appId,
    timeout: 1000,
    };

    // Creates an anonymous credential
    const credentials = Realm.Credentials.anonymous();

    // Gets a MongoDB Realm app instance
    const app = new Realm.App(appConfig);
    var HTMLstr = "";

    // Authentication
    app.logIn(credentials).then((user) => {
    console.log(`Logged in with the user: ${user.id}`);
    console.assert(user.id === app.currentUser.id);
    });

    // MongoDB Data Access
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const mydb = mongodb.db("mydb");
    const mycollection = mydb.collection("mycollection");

    // Insert a movie
   var result = await  mycollection
    .insertOne({
        title: "The Room",
        year: 2003,
        runtime: 99,
        cast: ["Tommy Wiseau", "Juliette Danielle"],
        genres: ["drama", "romance"],
    })

    HTMLstr += "Inserted a movie: " + JSON.stringify(result) + "<br>"

    console.log(`Inserted a movie with the title 'The Room': ${JSON.stringify(result)}`);


    // Query for a movie that has the title 'The Room'
    var result = await mycollection.findOne({ title: "The Room" })
    console.log(`Found a movie with the title 'The Room': ${JSON.stringify(result)}`);

    HTMLstr += "Found a movie with the title 'The Room': " + JSON.stringify(result) + "<br>";
    // Query for all movies that have a runtime less than 15 minutes
    var result = await mycollection
    .find({ runtime: { $gt: 15 } }, { limit: 100 });

    console.log(`Found ${result.length} short movies (less than 15 minutes):`);
    document.getElementById("movies").innerHTML =  buildTableRecords(result)

    HTMLstr += `Found ${result.length} short movies (less than 15 minutes): <br>`;
    // Update a movie
    var result = await mycollection
    .updateOne({ title: "The Room" }, { $set: { runtime: 99 } })

        console.log(
        `Updated the movie 'The Room' to have a new runtime of ${result.modifiedCount} minutes.`
        );

    HTMLstr += `Updated the movie 'The Room' to have a new runtime of ${result.modifiedCount} minutes. <br>`;
    // Delete a movie
    var result = await mycollection
    .deleteMany({ title: "The Room" })
   
    console.log(`Deleted the movie 'The Room': ${JSON.stringify(result)}`);
    HTMLstr += `Deleted the movie 'The Room': ${JSON.stringify(result)} <br>`;

    document.getElementById("output").innerHTML = HTMLstr;
}
    

function buildTableRecords(records) {
    var HTMLstr = "";
    records.forEach((movie) => {
        HTMLstr += "<tr>";   
        HTMLstr +=  `<td class="cell">${movie.title}</td>`;
        HTMLstr +=  `<td class="cell">${movie.runtime}</td>`;
        HTMLstr +=  `<td class="cell">${movie.year}</td>`;
        HTMLstr +=  `</tr>`;
    });
    return HTMLstr;
}
