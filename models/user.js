var shortid = require('shortid');

module.exports = {
  identity: 'user',
  connection: 'userDB',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: function() {
        return shortid.generate();
      }
    },
    first_name: {
      type : 'string',
      required : true
    },
	last_name: {
      type : 'string',
      required : true
    },
	email: {
      type : 'string',
      required : true
    },
	birthday: {
      type : 'string',
      required : false
    },
	password: {
      type : 'string',
      required : true
    },
	avatars: {
      type : 'string',
      required : false
    }
  }
}