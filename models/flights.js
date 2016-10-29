// const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect');

// const dbConnection = 'mongodb://localhost:27017/flight_search';

// function saveFlight(req, res, next) {
//   // creating an empty object for the insertObj
//   const insertObj = {};
//   // copying all of req.body into insertObj
//   for(key in req.body) {
//     insertObj[key] = req.body[key];
//     // console.log('this is key ', insertObj[key]);
//   }
//   // Adding userId to insertObj
//   insertObj.trips.userId = req.session.userId;

//   // MongoClient.connect(dbConnection, (err, db) => {
//   getDB().then((db) => {
//     if (err) return next(err);
//     // console.log(insertObj.trips);
//     db.collection('trips')
//       // .insert(req.body.trips, (inErr, flightsaved) => {
//       .insert(insertObj.trips, (inErr, flightsaved) => {
//         if (inErr) return next(inErr);

//         res.saved = flightsaved;
//         db.close();
//         return next();
//       });
//       return false;
//   });
//   return false;
// }

function displaySavedFlights(req, res, next) {
  // MongoClient.connect(dbConnection, (err, db) => {
  getDB().then((db) => {
  // if (err) return next(err);

  db.collection('trips')
    // .find({})
    .find({ userId: { $eq: req.session.userId } }) //this is how we find the favorites for the user i want
    .toArray((toArrayErr, saveddata) => {
      if (toArrayErr) return next(toArrayErr);
      // console.log(saveddata);
      res.savedflights = saveddata;
      db.close();
      return next();
    });
    return false;
  });
  return false;
}

function saveFlight(req, res, next) {
  // creating an empty object for the insertObj
  const insertObj = {};
  // copying all of req.body into insertObj
  for(key in req.body) {
    insertObj[key] = req.body[key];
    // console.log('this is key ', insertObj[key]);
  }
  // Adding userId to insertObj
  insertObj.trips.userId = req.session.userId;
  console.log('user with key ', insertObj.trips.userId);

  // MongoClient.connect(dbConnection, (err, db) => {
  getDB().then((db) => {
    if (err) return next(err);
    // console.log(insertObj.trips);
    db.collection('trips')
      // .insert(req.body.trips, (inErr, flightsaved) => {
      .insert(insertObj.trips, (inErr, flightsaved) => {
        if (inErr) return next(inErr);

        res.saved = flightsaved;
        db.close();
        return next();
      });
      return false;
  });
  return false;
}

function deleteSavedFlight(req, res, next) {
  // MongoClient.connect(dbConnection, (err, db) => {
  getDB().then((db) => {
    if (err) return next(err);
    // console.log('this is deleting', req.params.id);
    db.collection('trips')
      .findAndRemove({ _id: ObjectID(req.params.id) }, (rerr, doc) => {
        if (rerr) return next(rerr);

        res.deleted = doc;
        db.close();
        return next();
      });
      return false;
  });
  return false;
}

function editSavedFlights (req, res, next) {
  // MongoClient.connect(dbConnection, (err, db) => {
  getDB().then((db) => {
    if (err) return next(err);
    // console.log('this is the edits req ', req.params.id);

    db.collection('trips')
      .findAndModify({ _id: ObjectID(req.params.id) }, [],
        { $set: req.body.edit }, { new: true }, (editErr, doc) => {
        if (editErr) return next(editErr);

        res.edited = doc;
        // console.log(res.edited);
        db.close();
        return next();
      });
      return false;
  });
  return false;
}

module.exports = { saveFlight, displaySavedFlights, deleteSavedFlight, editSavedFlights };
