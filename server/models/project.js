'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ProjectSchema = new Schema({
  title: String, 
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },  
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ProjectSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

ProjectSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator team tasks').exec(cb);
  }
};


ProjectSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

ProjectSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}


function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

ProjectSchema.plugin(slugGenerator());

mongoose.model('Project', ProjectSchema);



