// console.log('sdfksdkfksjd')

var request = require('request')
var fs = require('fs')

// var jsfile2 = require('./routes/loginroute.js')

module.exports = function(app) {

    var refreshtoken;
    var accesstoken;
    var folder_id;
    // var file_entries;
    app.get('/', function(req, res) {

        var options = {
            "method": "get",
            "url": "https://account.box.com/api/oauth2/authorize?response_type=code&client_id=qn370t5htueaj9nqz2hd5zo37mwfne73&state=4wj57IG2upmMo58SixPt1oqC7HjK54Bm",
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            } else {
                res.send(body);
            }

        });
    });

    app.get('/index', function(req, res) {

        // var dataString = 'grant_type=authorization_code&code='+req.query.code+'&client_id=qn370t5htueaj9nqz2hd5zo37mwfne73&client_secret=IRaHCCCuivLQmG1hfEcnaKARlEGhC5zv';

        var options = {
            "method": "post",
            "url": "https://api.box.com/oauth2/token",
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            "form": {
                "grant_type": 'authorization_code',
                "client_id": 'qn370t5htueaj9nqz2hd5zo37mwfne73',
                "client_secret": 'IRaHCCCuivLQmG1hfEcnaKARlEGhC5zv',
                "code": req.query.code
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            } else {    
                // console.log(body);
                if (typeof body == "string") {
                    body = JSON.parse(body)
                }
                refreshtoken = body.refresh_token;
                accesstoken = body.access_token;
                // console.log(a);
                return res.redirect("/main");
            }
        });

    });

    app.get('/pass_token', function(req, res) {
        // res.render("main.html");

        var options = {
            "method": "post",
            "url": "https://api.box.com/oauth2/revoke",
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            "form": {
                "client_id": 'qn370t5htueaj9nqz2hd5zo37mwfne73',
                "client_secret": 'IRaHCCCuivLQmG1hfEcnaKARlEGhC5zv',
                "token": refreshtoken
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
                return res.redirect('/main');
            } else {
                return res.redirect("/");
            }
        });
    });

    app.get('/main', function(req, res) {
        // res.render("main.html");
        // console.log(accesstoken);
        var options = {
            "method": "get",
            "url": "https://api.box.com/2.0/folders/0",
            "headers": {
                "authorization": 'Bearer ' + accesstoken
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            } else {
                // console.log(body);
                // return res.redirect("/");
                if (typeof body == "string") {
                    body = JSON.parse(body)
                }
                // console.log("collection entries **********************************", body);
                res.render("main.html", { data: body.item_collection.entries });
            }
        });
    });

    app.get('/inside_folder/:id', function(req, res) {
        // console.log("///////////////////", req.params.id);
        folder_id = req.params.id;

        var options = {
            "method": "get",
            "url": "https://api.box.com/2.0/folders/" + folder_id + "/items",
            "headers": {
                "authorization": 'Bearer ' + accesstoken
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
                // return res.redirect('/');
            } else {
                // console.log(body);
                // return res.redirect("/");
                if (typeof body == "string") {
                    body = JSON.parse(body)
                }
                // console.log(body);
                console.log("accesstoken : ", accesstoken);
                console.log("refreshtoken : ", refreshtoken);

                // console.log(body.entries);
                // file_entries = body.entries;
                res.render("index.html", { data: body.entries });
                // console.log("--------------- ", body);
                // console.log("dasdfsdfsdfsdfd ", body.entries[0].name);
            }
        });

    });

    app.get('/delete_file/:id', function(req, res) {
        console.log(req.params.id);
        var id = req.params.id;

        var options = {
            "method": "delete",
            "url": "https://api.box.com/2.0/files/" + id,
            "headers": {
                "authorization": 'Bearer ' + accesstoken
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/main");
            }
        });
    });

    // app.get('/restore', function(req, res) {
    //     // console.log(req.params.id);
    //     var id = req.params.id;

    //     var options = {
    //         "method": "delete",
    //         "url": "https://api.box.com/2.0/files/"+id,
    //         "headers": {
    //             "authorization": 'Bearer ' + accesstoken
    //         }
    //     }

    //     request(options, function(err, response, body) {
    //         if (err) {
    //             console.log(err);
    //             // return res.redirect('/');
    //         } else {
    //             // console.log(body);
    //             // return res.redirect("/");
    //             // if (typeof body == "string") {
    //             //     body = JSON.parse(body)
    //             // }
    //             // console.log(body);
    //             // console.log(accesstoken);
    //             // console.log(body.entries);
    //             // res.render("index.html", { data : body.entries });
    //             // console.log("File Is being downloaded");
    //             // var file = __dirname + '/folder/' + id;
    //             // res.download(file);
    //             res.redirect("/main");
    //         }
    //     });
    // });

    app.get('/file_info/:id/:name', function(req, res) {
        // console.log(req.params.id);
        var id = req.params.id;
        var file_name = req.params.name;
        // console.log('//////////////////  ', file_name)

        var options = {
            "method": "get",
            "url": "https ://api.box.com/2.0/files/" + id + "/content",
            "headers": {
                "authorization": 'Bearer ' + accesstoken
            }
        }
        request(options).pipe(res);
    });

    // app.get('/update_file/:id', function(req, res) {
    //     console.log(req.params.id);
    //     var id = req.params.id;

    //     var options = {
    //         "method": "put",
    //         "url": "https://api.box.com/2.0/files/" + id,
    //         "headers": {
    //             "authorization": 'Bearer ' + accesstoken
    //         }
    //     }

    //     request(options, function(err, response, body) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.redirect("/main");
    //         }
    //     });
    // });

    app.post('/upload_file', function(req, res) {
        // if (!req.files)
        //     return res.status(400).send('No files were uploaded.');
        var file_name = req.files.samplefile.name
        console.log(file_name);
        var options = {
            method: 'POST',
            url: 'https://upload.box.com/api/2.0/files/content',
            headers: {
                authorization: 'Bearer ' + accesstoken,
                'content-type': 'multipart/form-data'
            },
            formData: {
                name: {
                    value: 'fs.createReadStream("req.files.samplefile.name")',
                    options: { filename: req.files.samplefile.name, contentType: null }
                },
                'parent.id': '0'
            }
        };

        request(options, function(error, response, body) {
            // if (error) throw new Error(error);

            // console.log(body);
            res.redirect("/main");
        });
    });

    app.post('/upload_file_in_folder', function(req, res) {
        // if (!req.files)
        //     return res.status(400).send('No files were uploaded.');
        var file_name = req.files.samplefile.name
        console.log(file_name);
        console.log("folder_id", folder_id);

        var options = {
            method: 'POST',
            url: 'https://upload.box.com/api/2.0/files/content',
            headers: {
                authorization: 'Bearer ' + accesstoken,
                'content-type': 'multipart/form-data'
            },
            formData: {
                name: {
                    value: 'fs.createReadStream("req.files.samplefile.name")',
                    options: { filename: req.files.samplefile.name, contentType: null }
                },
                'parent.id': folder_id
            }
        };

        request(options, function(error, response, body) {
            // if (error) throw new Error(error);

            // console.log(body);
            res.redirect("/main");
        });
    });


}


//
