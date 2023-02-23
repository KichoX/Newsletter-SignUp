const { response, json } = require("express");
const express = require("express");
const bodyParser = require("body-parser"); 
const request = require("request");
const e = require("express");
const https = require("https");
const { url } = require("inspector");

const app = express();

app.use(express.static("public")); //to use static files in this folder
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html" ); 
  });


  app.post("/", function(req, res){
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/5d44cb25c2";

    const options = {
        method: "POST",
        auth: "kristijan:5d5ef5f3eefba22e4944ccc86382d634-us9"
    };



    const request = https.request(url, options, function(response) {
        let data = "";
        response.on("data", function(chunk) {
            data += chunk;
        });
        response.on("end", function() {
            console.log(JSON.parse(data));
        });
    });


    if ( response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }

    request.write(jsonData);
    request.end();
});


app.listen(process.env.PORT || 3000, function(){    //both on heroku and local
    console.log("THE server is RUNNING on port 3000!"); 
})

//5d5ef5f3eefba22e4944ccc86382d634-us9
//5d44cb25c2