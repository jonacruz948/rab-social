var express_helper = {
    handle_error: function(error, res){
        console.error("error: " + error);
        res.status(500)
        res.send({err: error})
    }
}

module.exports = express_helper;
