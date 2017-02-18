/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
    var $menu = $('.menu');
    var $pizzaCount = $menu.find(".pizza-count");
    var quantity = Pizza_List.pizzaLengt;
    $pizzaCount.text(quantity);

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        console.log("New pizza", pizza.title);
        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function (pizza) {
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);
        if (Ext.Array.contains(pizza.content, filter))
            pizza_shown.push(pizza);

    });
    $pizzaCount.text(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function filterVega() {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function (pizza) {
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);


    });
    $pizzaCount.text(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
}

var $filterMenu = $('.nav-pills');
var $filter = $filterMenu.find('li');
console.log("filter ", $filter);

$filter.click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    console.log("li", $(this).find('a'));
    console.log("val ", $(this).find('a').value());
    if ($(this).val() === "Усі")
        initialiseMenu();
    else if ($(this).val === "М'ясні")
        filterPizza("meat");
    else if ($(this).val === "З ананасами")
        filterPizza("pineapple");
    else if ($(this).val === "З грибами")
        filterPizza("mushroom");
    else if ($(this).val === "З морепродуктами")
        filterPizza("ocean");
    else if ($(this).val === "Вегетаріанські")
        filterVega();
});


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
