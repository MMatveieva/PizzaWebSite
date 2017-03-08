/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function (req, res) {
    res.send(Pizza_List);
};

var LIQPAY_PUBLIC_KEY = "KEY_HERE";
var LIQPAY_PRIVATE_KEY = "KEY_HERE";

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.createOrder = function (req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    function orderInf() {
        var str = "";
        for (var i = 0; i < order_info.pizzas.length; ++i) {
            var pSize = "";
            if (order_info.pizzas[i].size == "small_size")
                pSize = "Мала";
            else pSize = "Велика";
            str += "- " + order_info.pizzas[i].quantity + "шт." + " [" + pSize + "] "
                + order_info.pizzas[i].pizza.title + "\n";
        }
        return str;
    }

    var descript = "Замовлення піци: " + order_info.name + "\nАдреса доставки: " + order_info.address + "\nТелефон: "
        + order_info.phone + "\nЗамовлення: \n" + orderInf() + "Разом: " + order_info.money + "грн.";
    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.money,
        currency: "UAH",
        description: descript,
        order_id: Math.random(),
//!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    res.send({
        success: true,
        count: order_info.pizzas.length,
        data: data,
        signature: signature
    });
};
