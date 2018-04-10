require("dotenv").config(); 
//code to read and set any environment variables

var Twitter = require("twitter"); 
var Spotify = require("node-spotify-api"); 
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js"); 
//imports the keys.js file and store it in a variable

var client = new Twitter(keys.twitter); 
var spotify = new Spotify(keys.spotify);
//access keys info 

var input = process.argv;
var command = process.argv[2];

var searchTerm = "";
for(var i = 3; i < input.length; i++){
    if (i > 3 && i < input.length){
        searchTerm += " " + input[i]; 
    } else {
        searchTerm += input[i];
    }
}


switch(command){
    case "my-tweets":
        getTweets();
    break;

    case "spotify-this-song":
        if (searchTerm){
            getSong(searchTerm);
        } else {
            getSong("The Sign");
        }
    break;

    case "movie-this":
        if (searchTerm){
            getMovie(searchTerm);
        } else {
            getMovie("Mr. Nobody")
        }
    break;

    case "do-what-it-says":
        doIt();
    break;

    default:
        console.log("\nPlease enter a LIRI command: my-tweets, spotify-this-song, movie-this, or do-what-it-says\n");
    break;
}


function getTweets(){
    var params = {screen_name: "liritestaccount", count: 20};
      client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
          for(var i = 0; i < tweets.length; i++){

            var displayTweets = 
`\nDate: ${tweets[i].created_at.substring(0,19)}\n
${tweets[i].text}\n
---------------------------------------------------------`

            console.log(displayTweets);
            fs.appendFile("log.txt", displayTweets, (error) => {
                if (error) throw err;
              });
          } 
        } else {
            console.log("Error");
        }
    });
}

function getSong(song){
    spotify.search({type: "track", query: song}, function(error, data){
        if(!error){
            for(var i = 0; i < data.tracks.items.length; i++){

                var s = data.tracks.items[i];
                var displaySong = 
`\nArtist: ${s.artists[0].name}\n
Song: ${s.name}\n
Preview: ${s.preview_url}\n
Album: ${s.album.name}\n
---------------------------------------------------------`

                console.log(displaySong);
                fs.appendFile("log.txt", displaySong, (error) => {
                    if (error) throw err;
                  });
            }
        } else {
            console.log("Error");
        }
    });
}

function getMovie(movie){
    var url = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`

    request(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        
        var m = JSON.parse(body);
        var displayMovie = 
`\nTitle: ${m.Title}\n
Year: ${m.Year}\n
IMDB Rating: ${m.imdbRating}\n
Rotten Tomatoes Rating: ${m.Ratings[1].Value}\n
Country: ${m.Country}\n
Language: ${m.Language}\n
Plot: ${m.Plot}\n
Actors: ${m.Actors}\n
---------------------------------------------------------`

            console.log(displayMovie);
            fs.appendFile("log.txt", displayMovie, (error) => {
                if (error) throw err;
              });
        } else {
            console.log("Error");
        }
    });
}

function doIt(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            console.log("Error");
        } else {
            var text = data.split(",");
            getSong(text[1]);
        }
    });
}