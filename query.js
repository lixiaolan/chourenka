var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

// CARD CHOOSING FUNCTIONS

var Query = function () {}

Query.prototype.setDB = function(indb) {
    this.db = indb;
}

/* 
   get id of next card using ljj method
*/
Query.prototype.nextCardLJJ = function(callback) {
    var that = this;
    var poolSize = 51;
    var startInterval = 1000 * 60; // * 60 * 60 * 24; // one day
    var intervalLowerLimit = 1000 * 60;
    var scaleFactor = 4;
    
    var date = new Date();
    var time = date.getTime();
    
    this.getCardIds(function(cardArray) {
        that.getCardHistory(function(cardHistory) {
            var candidates = [];

            for (var i = 0; i < cardArray.length; i++) {
                if (!cardHistory[cardArray[i]]) {
                    candidates.push(cardArray[i]);
                }
                else {
                    if (readyToShow(cardHistory[cardArray[i]], time)) {
                        candidates.push(cardArray[i]);
                    }
                }
                
                if (candidates.length > poolSize) break;
            }
            if (candidates.length > 0) {
                var randId = candidates[Math.floor(Math.random() * candidates.length)];
                callback({_id: randId});
            }
            else {
                callback({});
            }
        });
    });
    
    var readyToShow = function(historyArray, time) {
        if (historyArray.length == 0) return true;
        var interval = startInterval * 1;

        historyArray.forEach(function(el) {
            if (el.result == -1) {
                interval = Math.max(intervalLowerLimit, interval/scaleFactor);
            }
            else if (el.result == 1) {
                interval = interval * scaleFactor;
            }
        });
        
        var last = historyArray[historyArray.length - 1];

        if ((time - last.time) > interval) {
            return true;
        }
        return false;
    }
}

// DATABASE QUERY FUNCTIONS:

/* 
   This function gets the history of cards based on the an input array
   of Ids. This is done with a single query to the history collection
   instead of repeated queries.
*/
Query.prototype.getCardHistory = function(callback) {
    var history = this.db.collection('history');
    var aggObj = {
        $group :
        {
            _id : "$cardId",
            history :
            {
                $push:
                {
                    time: "$time",
                    result: "$result"
                }
            }
        }
    };
    var sortObj = {
        $sort : {
            time : 1
        }
    };
    history.aggregate([sortObj, aggObj]).toArray(function(err, array) {
        assert.equal(err, null);
        var hash = {}
        array.forEach(function(el) {
            hash[el._id] = el.history;
        });
        callback(hash);
    });
}

/*
  get array of history for input cardId. 'callback' is a callback
  taking the result data as an argument.
*/
Query.prototype.getSingleCardHistory = function(cardId, callback) {
    var history = this.db.collection('history');
    history.find({'cardId': cardId}).toArray(this.stdCallback(callback));
}

/*
  Add history item.
*/
Query.prototype.postHistory = function(cardId, result, callback) {
    // Get the documents collection
    var history = this.db.collection('history');
    
    // Get time as the number of milliseconds since midnight Jan 1 1970
    var date = new Date();
    var time = date.getTime();
    
    // Insert some documents
    history.insert({'cardId': cardId, 'time': time, 'result': result}, this.stdCallback(callback));
}

/*
  Add new card to database
*/
Query.prototype.postCard = function(cardData, callback) {
    var card = this.db.collection('card');
    card.insert(cardData, this.stdCallback(callback));
}

/*
  Save card to database
*/
Query.prototype.saveCard = function(id, cardData, callback) {
    var card = this.db.collection('card');
    card.update({'_id' : ObjectID(id)}, cardData, this.stdCallback(callback));
}

/*
  Remove card from database
*/
Query.prototype.removeCard = function(id, callback) {
    var card = this.db.collection('card');
    card.remove({'_id' : ObjectID(id)}, this.stdCallback(callback));
}

/*
  Get card from database given id object
*/
Query.prototype.getCard = function(id, callback) {
    var card = this.db.collection('card');
    card.findOne({'_id' : ObjectID(id)}, this.stdCallback(callback));
}

/*
  Add new info to database
*/
Query.prototype.postInfo = function(infoData, callback) {
    var info = this.db.collection('info');
    info.insert(infoData, this.stdCallback(callback));
}

/*
  Save info to database
*/
Query.prototype.saveInfo = function(id, infoData, callback) {
    var info = this.db.collection('info');
    info.update({'_id' : ObjectID(id)}, infoData, this.stdCallback(callback));
}

/*
  remove info from database
*/
Query.prototype.removeInfo = function(id, callback) {
    var info = this.db.collection('info');
    info.remove({'_id' : ObjectID(id)}, this.stdCallback(callback));
}

/*
  Get info from database given id object
*/
Query.prototype.getInfo = function(id, callback) {
    var info = this.db.collection('info');
    info.findOne({'_id' : ObjectID(id)}, this.stdCallback(callback));
}

/*
  Get list of card Ids based on filters (TODO)
*/
Query.prototype.getCardIds = function(callback) {
    var card = this.db.collection('card');
    var sortObj = {
        $sort : {
            ord : 1
        }
    }
    var aggObj = {
        $project : {
            "_id": 1
        }
    }
    card.aggregate([sortObj, aggObj]).toArray(function(err, result) {
        assert.equal(err, null);
        var array = [];
        result.forEach(function(el) {
            array.push("" + el._id);
        });
        callback(array);
    });    
}

/*
  Get the max order number of cards in a tag group
*/
Query.prototype.getMaxOrderNumbers = function(callback) {
    var card = this.db.collection('card');
    card.aggregate(
        [
            {
                $group:
                {
                    _id: "$ord.0",
                    max: { $max: "$ord.1" },
                }
            }
        ]
    ).toArray(function(err, result) {
        ret = {};
        result.forEach(function(val) {
            ret[val._id]=val.max;
        });
        callback(ret);
    });
}

/*
  Get list of cards based on info Id
*/
Query.prototype.getCardsWithInfoId = function(infoId, callback) {
    var card = this.db.collection('card');
    card.find({'info' : infoId}).toArray(this.stdCallback(callback));
}

/*
  Get _id to tag name map
*/
Query.prototype.getTagMap = function(callback) {
    var tags = this.db.collection('tags');
    tags.find({}).toArray(function(err, result) {
        assert.equal(err, null);
        var obj = {};
        result.forEach(function(el) {
            var elId = el._id + "";
            delete el._id;
            delete el.cards;
            obj[elId] = el;
        });
        callback(obj);
    });    
}

// UTILITY

/*
  Generates standard form callback for mongodb queries
*/
Query.prototype.stdCallback = function(callback) {
    return function(err, result) {
        assert.equal(err, null);
        callback(result);
    };
}


module.exports = Query;
