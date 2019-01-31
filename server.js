var fs = require("fs");
var bodyParser = require('body-parser');
let cookieParser = require('cookie-parser'); 
var express = require("express");
var app = express();
var code = "XXXXXXXX" // code that will go on the invitations
var admin = "secret"
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

// method to just check input agianst our code

// main!
app.listen(8080, function(){
    console.log("Server Running...");
    // initial landing -> login
    // if they have a cookie from me, just redirect to home page
    app.get("/", function(req, res){
        // console.log('Cookies: ', req.cookies) testing
        if(req.cookies.code == null){
                res.redirect("/login");
        }else{
            if(req.cookies.code == code){
                res.redirect("/SaveTheDate2019")
            }
        }
    })
    // serve 'login' page
    app.get("/login",function(req, res){
        fs.readFile("html/login.html", function(err, data){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();  
        })
    })

    // login submit -> validate and serve home
    //              -> fail and resend login
    // this checks the code and if correct gives them a cookie
    // that way they dont have to login again
    // cookie is not secure, but it doesnt really need to be here
    // unless I actually decide to deploy this site, in which case
    // I should probably everything more secure...
    app.post("/login", function(req,res){
        if(req.body.code == code){
            res.cookie("code", code);
            res.redirect("/SaveTheDate2019");   
        }else{
            res.redirect("/login");
        }
    })
    // Home page
    app.get("/SaveTheDate2019", function(req,res){
        console.log(req.url + ":" + req.hostname);
        if(req.cookies.code == code){
            fs.readFile("html/index.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              })
        }else{
            fs.readFile("html/login.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              })
        }
    })
    // ATTENDING
    app.post("/RSVP", function(req, res){
    //  Access the forms via express parsing. testing was done here  
    // TODO: | DONE!
    // LOG DATA TO A JSON FILE AND CREATE AN ADMIN PAGE
    // TO VIEW THE DATA, DOESNT HAVE TO BE PRETTY,
    // JUST SOMETHING WE CAN USE TO KEEP TRACK. 
        fs.readFile("guests.json", function(err, data){
            var json = JSON.parse(data);
            var guest = { name: req.body.name , seats: req.body.number, email: req.body.email };
            json.guest.push(guest);
            fs.writeFile('guests.json', JSON.stringify(json), function (err){
                if(err) throw err;
            });
        })
        var str = "Name: " + req.body.name;
        str += "<br>Attending: " + req.body.number;
        str += "<br>Email: " + req.body.email;
        str += "<br>Thanks for filling out the RSVP, " + req.body.name + "! It helps us a lot and we greatly appreciate it!";
        str += "<br> If you see anything wrong with the data you entered, contant me via email at dalbroo@siue.edu and I will gladly fix it for you."; 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(str);
        res.end();   
    })
    // NOT ATTENDING
    app.post("/RSVP0", function(req, res){
        // LOG NAME AND 'NOT ATTENDING' TO JSON DATA FILE | DONE!
        fs.readFile("guests.json", function(err, data){
            var json = JSON.parse(data);
            var guest = {name: req.body.name};
            json.noGo.push(guest);
            fs.writeFile('guests.json', JSON.stringify(json), function (err){
                if(err) throw err;
            });
        })
        // Send thank you...
        var str = "Thanks for filling out the RSVP, " + req.body.name + "! It helps us a lot and we greatly appreciate it!";
        str += "<br>If plan's change and you are able to come, just contact me via email at dalbroo@siue.edu and I would gladly add you to the list!";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(str);
        res.end();   
     })
     // Just serving images here for the page
    app.get("/first_image.jpg", function(req, res){
        var img = fs.readFileSync('images/first_image.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    })

    app.get("/second_image.jpg", function(req, res){
        var img = fs.readFileSync('images/second_image.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    })

    app.get("/third_image.jpg", function(req, res){
        var img = fs.readFileSync('images/third_image.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    })

    app.get("/fourth_image.jpg", function(req, res){
        var img = fs.readFileSync('images/fourth_image.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    })

    // admin page to display guests
    app.get("/admin", function(req,res){
        fs.readFile("html/admin_login.html", function(err, data){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();  
        })
    })
    app.post("/admin", function(req, res){
        if(req.body.code === admin){
            // right code
            fs.readFile("html/admin.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              })  
        }else{
            // entered wrong code. just redirecting back to the page
            res.redirect("/admin");
        }
    })
    app.get("/guests.json", function(req, res){
        fs.readFile('./guests.json', (err, json) => {
            let obj = JSON.parse(json);
            res.json(obj);
        });
    })
    
});
