/**
 * Created by y1275963 on 12/15/16.
 */
app.factory('myService', function(){
    var savedData = [];
    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }
});
