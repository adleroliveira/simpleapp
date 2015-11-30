var Hapi = require('hapi');
var fs = require('fs');
var Request = require('request');
var dream = require('dreamjs');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 5000 });

var dogwaterOptions = {
    connections: {
        userDB: {
            adapter: 'userDisk'
        }
    },
    adapters: {
        userDisk: 'sails-disk'
    },
    defaults: {
        migrate: 'safe'
    },
    models: [require('./models/user')]
};

server.register([
    {
        register: require('inert')
    },
    {
        register: require('blipp')
    },
    {
        register: require('dogwater'),
        options: dogwaterOptions
    },
    {
        register: require('bedwetter'),
        options: {}
    }
], function (err) {
    if (err) {
        console.log(err);
        throw err;
    }

    server.route(require('./routes/user'));

    server.route({
        method: 'POST',
        path: '/uploadfile',
        config: {

            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },

            handler: function (request, reply) {
                var data = request.payload;
                if (data.file) {
                    var name = data.file.hapi.filename;
                    var path = __dirname + "/public/avatars/" + name;
                    var file = fs.createWriteStream(path);

                    file.on('error', function (err) {
                        console.error(err)
                    });

                    data.file.pipe(file);

                    data.file.on('end', function (err) {
                        var ret = {
                            filename: '/avatars/' + data.file.hapi.filename,
                            headers: data.file.hapi.headers
                        }
                        reply(JSON.stringify(ret));
                    })
                }

            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./public/index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/fillusers',
        handler: function (request, reply) {
            var schema = {
                first_name: 'name',
                last_name: 'last',
                email: 'email',
                birthday: 'birthday',
                password: 'string',
                avatar: function () {
                    return 'http://lorempixel.com/200/200/?' + Math.random();
                }
            };
            
            dream.schema(schema)
                .generateRnd()
                .output(function (err, result) {
                    request.model.user.create(result).exec(function(err, r){
                        reply(r[0]);
                    });
                });
        }
    });

    server.route({
        method: 'GET',
        path: '/js/{filename}',
        handler: function (request, reply) {
            reply.file('./public/angularControllers/' + request.params.filename);
        }
    });

    server.route({
        method: 'GET',
        path: '/avatars/{filename}',
        handler: function (request, reply) {
            
            reply.file('./public/avatars/' + request.params.filename);
            // if (request.params.filename.indexOf('http')>=0) {
            //     
            //     Request(decodeURIComponent(request.params.filename))
            //         .on('response', function (response) {
            //             reply(response);
            //         });
            // } else {
            //     reply.file('./public/avatars/' + request.params.filename);
            // }
        }
    });


    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});