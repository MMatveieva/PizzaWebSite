/**
 * Created by Mariya on 24.02.2017.
 */

var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Storage = require('../Storage');

var Cart = [];
var $order = $("#ordered");

var $totalPrice = $('.order-price-money');
var $pizzaInCart = $('.left-count-label');

function initialiseOrder() {
    $order.html("");
    Cart = Storage.get("cart");
    // console.log("Cart", PizzaCart.getPizzaInCart());
    var totalprice = 0;
    Cart.forEach(function (cart_item) {
        totalprice += cart_item.toPay;
    });
    Cart.forEach(showOnePizzaInOrder);
}

function showOnePizzaInOrder(cart_item) {
    var html_code = Templates.PizzaOrder_OneItem(cart_item);
    var $node = $(html_code);
    $order.append($node);
}

$('.confirm-button').click(function () {
    var $nameGroup = $('.name-group');
    var $phoneGroup = $('.phone-group');
    var $addressGroup = $('.address-group');

    $nameGroup.removeClass("has-success").removeClass("has-error");
    $phoneGroup.removeClass("has-success").removeClass("has-error");
    $addressGroup.removeClass("has-success").removeClass("has-error");

    $('.name-warning').addClass("hidden");
    $('.phone-warning').addClass("hidden");
    $('.address-warning').addClass("hidden");

    var name = $('.name-input').val();
    console.log("Name", name);
    var phone = $('.phone-input').val();
    console.log("Phone", phone);
    var address = $('.address-input').val();
    console.log("Address", address);

    $nameGroup.addClass(checkName(name));
    $phoneGroup.addClass(checkPhone(phone));
    $addressGroup.addClass(checkAddress(address));
});

function checkPhone(phone) {
    var res = "has-error";

    var phoneReg = /^[0-9+]/;
    if (phoneReg.test(phone) && phone != "") {
        if (phone.startsWith("+380")) {
            var update = phone.replace("+380", "");
            if (update.length == 9)
                res = "has-success";
        }
        else if (phone.startsWith("0")) {
            update = phone.replace("0", "");
            if (update.length == 9)
                res = "has-success";
        }
    }
    if (res == "has-error")
        $('.phone-warning').removeClass("hidden");
        return res;
}

function checkName(name) {
    var res = "has-error";

    var nameReg = /^[a-zA-Z-а-яА-Яії'є\s]*$/;
    if (nameReg.test(name) && name != "") {


        res = "has-success";
    }
    if (res == "has-error")
        $('.name-warning').removeClass("hidden");
    return res;
}

function checkAddress(address) {
    var res = "has-error";
    if (address != "") {
        res = "has-success";
    }

    if (res == "has-error")
        $('.address-warning').removeClass("hidden");
    return res;
}

exports.initialiseOrder = initialiseOrder;