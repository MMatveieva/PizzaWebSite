/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML елемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var $menu = $('.menu');
var $pizzaCount = $menu.find(".pizza-count");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

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
        // console.log("New pizza", pizza.title);
        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if (filter === "vega") {
        Pizza_List.forEach(function (pizza) {
            if (!pizza.content.hasOwnProperty('meat') && !pizza.content.hasOwnProperty('ocean'))
                pizza_shown.push(pizza);
        });
    }
    else {
        Pizza_List.forEach(function (pizza) {
            //Якщо піца відповідає фільтру
            if (pizza.content.hasOwnProperty(filter)) {
                //console.log("pizza", pizza.title);
                pizza_shown.push(pizza);
            }
        });
    }
    $pizzaCount.text(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
    var quantity = Pizza_List.pizzaLength;
    $pizzaCount.text(8);
    console.log("pizzaCount", quantity);
}

var $filterMenu = $('.nav-pills');
var $filter = $filterMenu.find('li a');

$filter.click(function () {
    $(this).parent().addClass('active').siblings().removeClass('active');
    //console.log("val ", $(this).text());
    if ($(this).text() === "Усі")
        initialiseMenu();
    else if ($(this).text() === "М'ясні")
        filterPizza("meat");
    else if ($(this).text() === "З ананасами")
        filterPizza("pineapple");
    else if ($(this).text() === "З грибами")
        filterPizza("mushroom");
    else if ($(this).text() === "З морепродуктами")
        filterPizza("ocean");
    else if ($(this).text() === "Вегетаріанські")
        filterPizza("vega");
});


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
