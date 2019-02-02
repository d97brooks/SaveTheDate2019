var fs = require("fs");
var bodyParser = require('body-parser');
let cookieParser = require('cookie-parser'); 
var express = require("express");
var app = express();
const code = "XXXXXXXX"; // code that will go on the invitations
const admin = "secret"; // my password to access admin page
var nodemailer = require('nodemailer');
const crypto = require('crypto'); // use to hash cookies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
const secret = "another secret"; // used to hash codes
const hash = crypto.createHmac('sha256', secret).update(code).digest('hex'); // cookie hash code
const adminHash = crypto.createHmac('sha256', secret).update(admin).digest('hex'); // cookies hash admin


// send a thank you email...
function rsvpResponse(address){
    if(address == ""){
        console.log("No Email Entered")
    }else{
        var transporter = nodemailer.createTransport({
        service: 'gmail',
            auth: {
                user: 'myemail@gmail.com',
                pass: 'pwd'
            }
        });

        var mailOptions = {
            from: '<reminder@mysite.com>',
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
        console.log("No Email Entered")
        success = false;
    }else{
        var transporter = nodemailer.createTransport({
        service: 'Gmail',
            auth: {
                user: 'myemail@gmail.com',
                pass: 'pwd'
            }
        });
    
        var mailOptions = {
            from: '<reminder@mysite.com>',
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
            if(req.cookies.code == hash){
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
            res.cookie("code", hash);
            res.redirect("/SaveTheDate2019");   
        }else{
            res.redirect("/login");
        }
    })
    // Home page
    app.get("/SaveTheDate2019", function(req,res){
        if(req.cookies.code === hash || req.cookies.code === adminHash){
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
        if(req.body.email != "")
            str += "<br>Email: " + req.body.email;
        str += "<br><br>Thanks for filling out the RSVP, " + req.body.name + "! It helps us a lot and we greatly appreciate it!";
        str += "<br> If you see anything wrong with the data you entered, contact me via email at dalbroo@siue.edu and I will gladly fix it for you."; 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(str);
        res.end();   

        //send a thankyou email
        rsvpResponse(req.body.email);
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
        }else{
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
                res.write("Successful emails sent: " + count + "/" + total + "<br>Note: Some people may have entered their email wrong or not entered one at all.");
                res.end();
            })
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("Error: Subject or Contents of email was empty.");
            res.end();
        }
    })

});