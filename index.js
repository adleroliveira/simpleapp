var Hapi = require('hapi');
var fs = require('fs');

var server = new Hapi.Server();
server.connection({ port: 3000 });

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
                            filename: data.file.hapi.filename,
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
        }
    });


    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});