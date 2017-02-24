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
    console.assert("hello");
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
    console.log($node);
    $order.append($node);
}

exports.initialiseOrder = initialiseOrder;