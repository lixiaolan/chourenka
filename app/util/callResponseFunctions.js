/*
Dictionary mapping type to functions. Functions take an info data
object and generate call and reponse functions.
*/
callResponseFunctions = {
    'chinese' : {
        'call' : function(obj) {
            return "<p>"+obj.chinese+"</p>";
        },
        'response' : function(obj) {
            return "<p>"+obj.pronunciation+"</p><p>"+obj.english+"</p>";
        }
    },
    'pronunciation' : {
        'call' : function(obj) {
            return "<p>"+obj.pronunciation+"</p>";
        },
        'response' : function(obj) {
            return "<p>"+obj.english+"</p><p>"+obj.chinese+"</p>";
        }
    },
    'english' : {
        'call' : function(obj) {
            return "<p>"+obj.english+"</p>";
        },
        'response' : function(obj) {
            return "<p>"+obj.chinese+"</p><p>"+obj.pronunciation+"</p>";
        }
    }
}
        
    
