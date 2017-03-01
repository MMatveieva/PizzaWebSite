/**
 * Created by Mariya on 24.02.2017.
 */

var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Storage = require('../Storage');
var API = require('../API');

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

var $nameGroup = $('.name-group');
var $phoneGroup = $('.phone-group');
var $addressGroup = $('.address-group');

var $nameWarning = $('.name-warning');
var $phoneWarning = $('.phone-warning');
var $addressWarning = $('.address-warning');

var $nameInput = $('.name-input');
var $phoneInput = $('.phone-input');
var $addressInput = $('.address-input');

$('.confirm-button').click(function () {
    $nameGroup.removeClass("has-success").removeClass("has-error");
    $phoneGroup.removeClass("has-success").removeClass("has-error");
    $addressGroup.removeClass("has-success").removeClass("has-error");

    $nameWarning.addClass("hidden");
    $phoneWarning.addClass("hidden");
    $addressWarning.addClass("hidden");

    var name = $nameInput.val();
    console.log("Name", name);
    var phone = $phoneInput.val();
    console.log("Phone", phone);
    var address = $addressInput.val();
    console.log("Address", address);

    $nameGroup.addClass(checkName(name));
    $phoneGroup.addClass(checkPhone(phone));
    $addressGroup.addClass(checkAddress(address));

    if ($nameGroup.hasClass("has-success") && $phoneGroup.hasClass("has-success") && $addressGroup.hasClass("has-success")){
        orderPizzas();
    }
        });

$nameInput.keyup(function () {
    $nameGroup.removeClass("has-success").removeClass("has-error");
    $nameWarning.addClass("hidden");
    var name = $(this).val();
    $nameGroup.addClass(checkName(name));
    if (name == "") {
        $nameGroup.removeClass("has-success").removeClass("has-error");
        $nameWarning.addClass("hidden");
    }
});

$phoneInput.keyup(function () {
    $phoneGroup.removeClass("has-success").removeClass("has-error");
    $phoneWarning.addClass("hidden");
    var phone = $(this).val();
    $phoneGroup.addClass(checkPhone(phone));
    if (phone == "") {
        $phoneGroup.removeClass("has-success").removeClass("has-error");
        $phoneWarning.addClass("hidden");
    }
});

$addressInput.keyup(function () {
    $addressGroup.removeClass("has-success").removeClass("has-error");
    $addressWarning.addClass("hidden");
    var address = $(this).val();
    $addressGroup.addClass(checkAddress(address));
    if (address == "") {
        $addressGroup.removeClass("has-success").removeClass("has-error");
        $addressWarning.addClass("hidden");
    }
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
        $phoneWarning.removeClass("hidden");
    return res;
}

function checkName(name) {
    var res = "has-error";

    var nameReg = /^[a-zA-Z-а-яА-Яії'є\s]*$/;
    if (nameReg.test(name) && name != "") {

        res = "has-success";
    }
    if (res == "has-error")
        $nameWarning.removeClass("hidden");
    return res;
}

function checkAddress(address) {
    var res = "has-error";
    if (address != "") {
        res = "has-success";
    }
    if (res == "has-error")
        $addressWarning.removeClass("hidden");
    return res;
}

function orderPizzas() {
    var order = {};

}

exports.initialiseOrder = initialiseOrder;