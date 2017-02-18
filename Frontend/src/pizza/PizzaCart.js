/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
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
    $buyPanel.find(".order-price-money").removeClass("hidden");
    $totalPrice.text(totalprice + " грн");
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
    var html_code = Templates.EmptyCart();
    $cart.html(html_code);
    $pizzaInCart.text(0);
    $totalPrice.text(totalprice + " грн");
    $buyPanel.find(".order-price-title").addClass("hidden");
    $buyPanel.find(".order-price-money").addClass("hidden");
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus-button").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            cart_item.toPay += cart_item.money;
            totalprice += cart_item.money;
            $totalPrice.text(totalprice + " грн");
            $node.find('.price').text(cart_item.toPay + "грн");
            $node.find('.quantity').text(cart_item.quantity);
            console.log("Cart", Cart);
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    $pizzaInCart.text(Cart.length);
    Cart.forEach(showOnePizzaInCart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;