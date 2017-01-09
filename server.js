var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var filesystem = require('fs');
var Query = require('./query.js');
var args = process.argv.slice(2);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();

// db query object
var query = new Query();

// Connection URL
var url ='mongodb://localhost:1234/data';

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());

// Public API:
app.post('/app/next_card_and_info', function(req, res) {
    query.nextCardLJJ(function(cardIdObj) {
        getCardAndInfo(cardIdObj._id, function(cardAndInfo) {
            res.send(cardAndInfo);
        });
    });
});

app.post('/app/post_history', function(req, res) {
    query.postHistory(req.body._id, req.body.result, function(result) {
        res.send(result);        
    });
});

// TODO: app.post('/app/get_card', function(req, res) {});
// TODO: app.post('/app/get_info', function(req, res) {});
app.post('/app/get_card_and_info', function(req, res) {
    getCardAndInfo(req.body._id, function(cardAndInfo) {
        res.send(cardAndInfo);
    });
});
app.post('/app/get_info_and_cards', function(req, res) {
    var infoId = req.body._id;
    query.getInfo(infoId, function(info) {
        query.getCardsWithInfoId(infoId, function(cards) {
            res.send({'cards': cards, 'info': info});
        });
    });
});

// TODO: app.post('/app/save_card', function(req, res) {});
// TODO: app.post('/app/save_info', function(req, res) {});
app.post('/app/save_info_and_cards', function(req, res) {
    var cards = req.body.cards;
    var info = req.body.info;
    var iid = "" + info._id;

    var dbCalls = 1 + cards.length;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var cid = card._id;
        delete card._id;
        card.info = iid;
        query.saveCard(cid, card, function(result) {
            dbCalls--;
            if (dbCalls <= 0) {
                res.send(result);
            }
        });
    }

    delete info._id;
    query.saveInfo(iid, info, function(result) {
        dbCalls--;
        if (dbCalls <= 0) {
            res.send(result);
        }
    });
});

// TODO: app.post('/app/add_info', function(req, res) {});
// TODO: app.post('/app/add_card', function(req, res) {});
app.post('/app/add_info_and_cards', function(req, res) {
    var cards = req.body.cards;
    var info = req.body.info;
    console.log("before add info");
    query.postInfo(info, function(addedInfoResult) {
        console.log("after add info");
        var iid = "" + addedInfoResult.insertedIds[0];
        var dbCalls = cards.length;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.info = iid;
            delete card._id; // just in case
            query.postCard(card, function(result) {
                dbCalls--;
                if (dbCalls <= 0) {
                    query.getInfo(iid, function(infoRes) {
                        query.getCardsWithInfoId(iid, function(cardsRes) {
                            res.send({'cards': cardsRes, 'info': infoRes});
                        });
                    });
                }
            });
        }
    });
});

// TODO: app.post('/app/remove_info', function(req, res) {});
// TODO: app.post('/app/remove_card', function(req, res) {});
app.post('/app/remove_info_and_cards', function(req, res) {
    var cards = req.body.cards;
    var info = req.body.info;
    var iid = "" + info._id;

    var dbCalls = 1 + cards.length;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var cid = "" + card._id;
        query.removeCard(cid, function(result) {
            dbCalls--;
            if (dbCalls <= 0) {
                res.send(result);
            }
        });
    }
    
    query.removeInfo(iid, function(result) {
        dbCalls--;
        if (dbCalls <= 0) {
            res.send(result);
        }
    });
});

// Utility Functions:
var getCardAndInfo = function(cardId, callback) {
    query.getCard(cardId, function(card) {
        query.getInfo(card.info, function(info) {
            card.info = info;
            callback(card);
        });
    });
};

// Connect to database and then start server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    query.setDB(db);
    http.createServer(app).listen(1235);});


// Old api

// app.get('/app/next_card', function(req, res){
//     query.nextCardLJJ(function(cardIdObj) {
//         query.getCard(cardIdObj._id, function(card) {
//             query.getInfo(card.info, function(info) {
//                 card.info = info;
//                 res.send(card);
//             });
//         });
//     });
// });

// app.post('/app/get_card', function(req, res) {
//     query.getCard(req.body._id, function(card) {
//         query.getInfo(card.info, function(info) {
//             card.info = info;
//             res.send(card);
//         });
//     });
// });    

// app.post('/app/post_history', function(req, res) {
//     if (!req.body._id) {
//         res.send({});
//         return;
//     }
//     query.getCard(req.body._id, function(card) {
//         if (!card) {
//             res.send({});
//             return;
//         }
//         query.postHistory(req.body._id, req.body.result, function(result) {
//             res.send(result);                
//         });
//     });
// });

// app.post('/app/save_card', function(req, res) {
//     var card = req.body;
//     var cid = card._id;
//     var info = req.body.info;
//     var iid = info._id;
//     delete card._id;
//     delete card.info;
//     card.info = iid;
//     delete info._id;

//     query.saveInfo(iid, info, function(result) {
//         query.saveCard(cid, card, function(result) {
//             res.send(result);
//         });
//     });
// });

// app.post('/app/remove_card', function(req, res) {
//     query.removeCard(req.body._id, function(result) {
//         res.send(result);
//     });
// });

// app.post('/app/add_card', function(req, res) {
//     query.postCard(req.body.call, req.body.response, function(result) {
//         query.getCard(result.insertedIds[0], function(card) {
//             res.send(card);
//         });
//     });
// });
