/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
var Pizza_List;
API.getPizzaList(function (err, data) {
    if (err) {
        console.log("Cannot find PizzaList")
    }
    Pizza_List = data;
    console.log(Pizza_List);
    initialiseMenu();
});
//var Pizza_List = require('../Pizza_List');

//HTML елемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var $menu = $('.menu');
var $pizzaCount = $menu.find(".pizza-count");
var $pizzaLabel = $('.pizza-label');

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
            return false;
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
            return false;
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
    var quantity = Pizza_List.length;
    $pizzaCount.text(quantity);
    $pizzaLabel.text("Усі піци");
    // console.log("pizzaCount", quantity);
}

var $filterMenu = $('.nav-pills');
var $filter = $filterMenu.find('li a');

$filter.click(function () {
    $(this).parent().addClass('active').siblings().removeClass('active');
    //console.log("val ", $(this).text());
    if ($(this).text() === "Усі")
        initialiseMenu();
    else if ($(this).text() === "М'ясні") {
        $pizzaLabel.text("М'ясні піци");
        filterPizza("meat");
    }
    else if ($(this).text() === "З ананасами") {
        $pizzaLabel.text("Піци з ананасами");
        filterPizza("pineapple");
    }
    else if ($(this).text() === "З грибами") {
        $pizzaLabel.text("Піци з грибами");
        filterPizza("mushroom");
    }
    else if ($(this).text() === "З морепродуктами") {
        $pizzaLabel.text("Піци з морепродуктами");
        filterPizza("ocean");
    }
    else if ($(this).text() === "Вегетаріанські") {
        $pizzaLabel.text("Вегетаріанські піци");
        filterPizza("vega");
    }
});


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
