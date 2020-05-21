const mongoose = require('mongoose');
const { db, secret }    = require('../../config/database');
var nigerianStates = require('../helpers/jsonData/nigeria-states.json');
var chineseStates = require('../helpers/jsonData/chinese-states.json');
var colorJson = require('../helpers/jsonData/color-codes.json');
mongoose.Promise = require('bluebird');
mongoose.connect(db);

const Countries = require('../models/country');
const States = require('../models/state');
const Colors = require('../models/color');

var states = [];
var colors = [];

Object.keys(colorJson).forEach(function(key, index) {
colors.push({name: key, hexcode: colorJson[key]})
})  

Countries.collection.drop();
States.collection.drop();
Colors.collection.drop();

Promise.all([ 
  Countries.insertMany([{
    'name': 'China',
    'latitude': 104.1954,
    'longitude': 35.8617,
  },
  {
  'name': 'Nigeria',
  'latitude': 8.6753,
  'longitude': 9.0820,
  }])
  .then(countries => {
    console.log(`${countries.length} countries created`);    
    var chinese_id, nigerian_id = '';
    for(let i=0;i<countries.length;i++){
      if(countries[i].name == 'China'){
        chinese_id = countries[i]._id;
      }
      if(countries[i].name == 'Nigeria'){
        nigerian_id = countries[i]._id;
      }
    }
    if(chinese_id ){
    for(let i=0;i<chineseStates.length;i++){
     states.push({name: chineseStates[i].name, country_id: chinese_id})
    }      
    }else{
      console.warn("chinese id is null!")
    }
    if(nigerian_id ){
      for(let i=0;i<nigerianStates.length;i++){
       states.push({name: nigerianStates[i], country_id: nigerian_id})
      }      
      }else{
        console.warn("nigerian id is null!")
      }
    if(states){
        States.insertMany(states)
  .then(states => {
    console.log(`${states.length} states created`);    
 })
  .catch((err) => {
    console.log(err);
  })
    }else{
      console.log("states is null")
    }
  })
  .catch((err) => {
    console.log(err);
  }),
  // .finally(() => {
  //   mongoose.connection.close();
  // });

  Colors.insertMany(colors)
  .then(colors => {
    console.log(`${colors.length} colors created`);    
 })
  .catch((err) => {
    console.log(err);
  })
]).then(() => {
  console.log('********** Successfully seeded db **********');
 // mongoose.connection.close();
}).catch((err) =>{
console.warn(err)
});

