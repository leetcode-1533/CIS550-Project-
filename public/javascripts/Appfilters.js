/**
 * Created by y1275963 on 12/15/16.
 */
app.filter('numberToAlphabet', function(){
    return function(number){
        return String.fromCharCode(number+65);
    }
});

app.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
});