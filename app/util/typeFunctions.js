blankChineseInfo = function() {
    return {data: {chinese: "", english: "", pronunciation: ""}, type: "chinese"};
}
blankCard = function(info, type) {
    return {'info': info, 'type': type, 'tags':[]}
}
blankChineseInfoAndCards = function() {
    var info = blankChineseInfo();

    var cards = [blankCard(info, 'chinese'),
                 blankCard(info, 'english'),
                 blankCard(info, 'pronunciation')];
    
    return {'info': info, 'cards': cards};
}
