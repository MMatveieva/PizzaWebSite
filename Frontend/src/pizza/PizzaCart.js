/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../Storage');
var PizzaOrder = require('./PizzaOrder');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML елемент куди будуть додаватися піци
var $cart = $("#cart");
var $buyPanel = $(".buy-panel");

var $totalPrice = $('.order-price-money');
var totalprice = 0;
var $pizzaInCart = $('.left-count-label');

function isPizzaInCart(pizza, size) {
    var res = -1;
    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza.title == pizza.title && Cart[i].size == size)
            res = i;
    }
    return res;
}

function addToCart(pizza, size) {
    var check = isPizzaInCart(pizza, size);
    if (check > -1) {
        Cart[check].quantity++;
        Cart[check].toPay += Cart[check].money;
        totalprice += Cart[check].money;
    } else {
        var p = 0;
        if (size === "big_size") {
            p = pizza.big_size.price;
            totalprice += pizza.big_size.price;
        } else {
            p = pizza.small_size.price;
            totalprice += pizza.small_size.price;
        }
        //Додавання однієї піци в кошик покупок
        Cart.push({
            toPay: p,
            pizza: pizza,
            size: size,
            quantity: 1,
            money: p
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
    $buyPanel.find(".order-price-title").removeClass("hidden");
    $totalPrice.removeClass("hidden");
    $('.or-button').removeClass("disabled");
    $totalPrice.text(totalprice + " грн");

}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var index = Cart.indexOf(cart_item);
    console.log("index", index);
    Cart.splice(index, 1);
    totalprice -= cart_item.money;
    $totalPrice.text(totalprice + " грн");
    //Після видалення оновити відображення
    if (Cart.length > 0)
        updateCart();
    else initialiseEmptyCart();
}

function initialiseEmptyCart() {
    Storage.set("cart", null);
    var html_code = Templates.EmptyCart();
    $cart.html(html_code);
    $pizzaInCart.text(0);
    $buyPanel.find(".order-price-title").addClass("hidden");
    $totalPrice.addClass("hidden");
    $('.or-button').addClass("disabled");
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    var SavedCart = Storage.get("cart");
    if (SavedCart) {
        Cart = SavedCart;
        updateCart();
        totalprice = 0;
        Cart.forEach(function (cart_item) {
            totalprice += cart_item.toPay;
        });
        $totalPrice.text(totalprice + " грн");
    }
    else initialiseEmptyCart();
}

$(".clear-order").click(function () {
    Cart.splice(0, Cart.length);
    totalprice = 0;
    initialiseEmptyCart();
});


$('.or-button').click(function () {

});

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.set("cart", Cart);

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        var $quantityLabel = $node.find('.quantity');
        var $priceLabel = $node.find('.price');

        $node.find(".plus-button").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            cart_item.toPay += cart_item.money;
            totalprice += cart_item.money;
            $totalPrice.text(totalprice + " грн");
            $priceLabel.text(cart_item.toPay + "грн");
            $quantityLabel.text(cart_item.quantity);
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus-button").click(function () {
            if (cart_item.quantity > 1) {
                cart_item.quantity--;
                cart_item.toPay -= cart_item.money;
                totalprice -= cart_item.money;
                $totalPrice.text(totalprice + " грн");
                $priceLabel.text(cart_item.toPay + "грн");
                $quantityLabel.text(cart_item.quantity);
                //Оновлюємо відображення
                updateCart();
            } else {
                removeFromCart(cart_item);
            }
        });

        $node.find(".delete-button").click(function () {
            removeFromCart(cart_item);
        });
        $cart.append($node);
        // $node.hide();
        // $node.fadeIn(200);
    }

    $pizzaInCart.text(Cart.length);
    Cart.forEach(showOnePizzaInCart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
//exports.money = totalprice;