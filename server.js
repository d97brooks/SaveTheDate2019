var fs = require("fs");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var express = require("express");
var nodemailer = require('nodemailer');
var crypto = require('crypto'); // use to hash cookies

// secret information
const code = "XXXXXXXX"; // code that will go on the invitations
const admin = "secret"; // my password to access admin page
const myEmail = "me@gmail.com"
const myPwd = "pwd"

var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());


const secret = "another secret"; // used to hash codes
const adminHash = crypto.createHmac('sha256', secret).update(admin).digest('hex'); // cookies hash admin


var incorrectCode = "<style>*{margin-top: 10%; background-color: grey; text-align: center;}</style> <p>The code you entered was incorrect. Click <a href='/SaveTheDate2019#rsvp'> Here</a> to submit with the correct code. <br> If you lost the code, please contact me at dalbroo@siue.edu and I will send it to you. </p>";


const PORT = 8080;
// send a thank you email...
function rsvpResponse(address){
    if(address == ""){
    }else{
        var transporter = nodemailer.createTransport({
        service: 'gmail',
            auth: {
                user: myEmail,
                pass: myPwd
            }
        });

        var mailOptions = {
            from: '<reminder@davis-brooks-wedding.com>',
            to: address,
            subject: 'RSVP Confirmation',
            text: 'Thanks again for RSVPing!\nWe will be sending out reminders closer to the wedding from this address.\n\n Cheers!\n Dalton & Lauren'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
// reminder() takes an address, subject, and content of an email and returns true if successful.
function reminder(address, subject, content){
    var success = true;
    if(address == ""){
        success = false;
    }else{
        var transporter = nodemailer.createTransport({
        service: 'Gmail',
            auth: {
                user: myEmail,
                pass: myPwd
            }
        });
    
        var mailOptions = {
            from: '<reminder@davis-brooks-wedding.com>',
             to: address,
             subject: subject,
              text: content
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                success = false;
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    return success;
}

app.listen(PORT, function(){
    console.log("HTTP Server Running on %s...", PORT);
    // initial landing -> login
    // if they have a cookie from me, just redirect to home page
    app.get("/", function(req, res){
        res.redirect("/SaveTheDate2019");
    })
    
    // Home page
    app.get("/SaveTheDate2019", function(req,res){
        console.log("index.html served : " + Date(Date.now()).toLocaleString());
            fs.readFile("html/index.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              })
    })
    // ATTENDING
    app.post("/RSVP", function(req, res){
        if(req.body.inviteCode === code){
        fs.readFile("guests.json", function(err, data){
            var json = JSON.parse(data);
            var guest = { name: req.body.name, adults: req.body.adults, kids: req.body.kids, vegetarians: req.body.vegetarians, email: req.body.email};
            json.guest.push(guest);
            fs.writeFile('guests.json', JSON.stringify(json), function (err){
                if(err) throw err;
            });
        })
        var str = "Name: " + req.body.name;
        str += "<br>Adults: " + req.body.adults + " <br>Kids: " + req.body.kids;
        str += "<br>Vegetarians: " + req.body.vegetarians;  
        if(req.body.email != "")
            str += "<br>Email: " + req.body.email;
        str += "<br><br>Thanks for filling out the RSVP, " + req.body.name + "! It helps us a lot and we greatly appreciate it!";
        str += "<br> If you see anything wrong with the data you entered, contact me via email at dalbroo@siue.edu and I will gladly fix it for you."; 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<style>*{background-color: #ffe7e7;}</style>"+str);
        res.end();   

        //send a thankyou email
        rsvpResponse(req.body.email);
        
        //log to console successful RSVP
        console.log("RSVP for " + req.body.name + " saved : " + Date(Date.now()).toLocaleString());
        
        }else{

            // Code entered wrong, do something here that notifies them besides sending them back to the page?
            // res.redirect("/SaveTheDate2019#rsvp");
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(incorrectCode);
            res.end();

        }
    })

    // NOT ATTENDING
    app.post("/RSVP0", function(req, res){

        if(req.body.inviteCode === code){
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
        var str = "<style>*{background-color: #ffe7e7;}</style>Thanks for filling out the RSVP, " + req.body.name + "! It helps us a lot and we greatly appreciate it!";
        str += "<br>If plan's change and you are able to come, just contact me via email at dalbroo@siue.edu and I would gladly add you to the list!";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(str);
        res.end();   

        console.log("NoRSVP for " + req.body.name + " saved : " + Date(Date.now()).toLocaleString());

        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(incorrectCode);
            res.end();
        }
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
        if(req.cookies.code === adminHash){
            fs.readFile("html/admin.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              }) 
        }else{
            fs.readFile("html/admin_login.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();  
            })
        }
    })

    app.post("/admin", function(req, res){
        if(req.body.code === admin){
            // right code
            res.cookie("code", adminHash);
            fs.readFile("html/admin.html", function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();   
              })  
              console.log("Successful ADMIN login: " + Date(Date.now()).toLocaleString());
        }else{
            console.log("Failed ADMIN login: " + Date(Date.now()).toLocaleString());
            // entered wrong code. just redirecting back to the page
            res.redirect("/admin");
        }
    })

    // dont want anyone to have access to this besides admin
    app.get("/guests.json", function(req, res){
        if(req.cookies.code == null){
            res.redirect("/admin");
        }else{
            if(req.cookies.code === adminHash){
                fs.readFile('./guests.json', (err, json) => {
                    let obj = JSON.parse(json);
                    res.json(obj);
                });
        }
    }
    })
    // send a reminder to all guests who have an email address.
    // admin POST sends content of email, server responds with successful email data
    app.post("/reminder", function(req, res){
        if(req.cookies.code == null){ 
            res.redirect("/admin");
        }else{
            if(req.cookies.code === adminHash){ // make sure its from the admin
                if(req.body.content != "" && req.body.subject != ""){
                    fs.readFile("guests.json", function(err, data){
                        var content = req.body.content;
                        var subject = req.body.subject;
                        var json = JSON.parse(data);
                        var guest = json["guest"];
                        var count = 0;
                        var total = guest.length;
                            for(var i = 0; i < guest.length; i++){
                                var success = reminder(guest[i].email, subject, content);
                                if(success === true){
                                    count++;
                                }
                            }

                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write("<style>*{background-color: black; color:lime;}</style>Successful emails sent: " + count + "/" + total + "<br>Note: Some people may have entered their email wrong or not entered one at all.");
                        res.end();
                    })
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("<style>*{background-color: black; color:lime;}</style>Error: Subject or Contents of email was empty.");
                    res.end();
                }
            }
        }
    })

    app.post("/update", function(req, res){
        if(req.cookies.code != adminHash){
            res.redirect("/admin");
        }else{
            fs.writeFile('guests.json', req.body.guests, function (err){
                if(err) throw err;
            });
            res.redirect("/admin");
            }
    })

    app.get("/admin.js", function(req, res){
        if(req.cookies.code != adminHash){
            res.redirect("/admin");
        }else{
            fs.readFile("admin.js", function(err, data){
                res.writeHead(200, {'Content-Type': 'app/js'});
                res.write(data);
                res.end();  
            })    
        }
    })
    app.get('*', function(req, res){
        res.status(404).redirect("/SaveTheDate2019");
      });

});
