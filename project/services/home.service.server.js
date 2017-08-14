/**
 * Created by stan on 8/11/17.
 */
module.exports = function (app) {
    app.get("/rest/restaurant", search);

    function search(req, res) {
        var address = req.params.address;
        console.log(address);
        res.send(200);
    }
};