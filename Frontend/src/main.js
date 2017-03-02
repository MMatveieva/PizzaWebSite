/**
 * Created by chaika on 25.01.16.
 */

$(function () {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var PizzaOrder = require('./pizza/PizzaOrder');
    //var Pizza_List = require('./Pizza_List');
    var GoogleMap = require('./GoogleMaps');

    PizzaCart.initialiseCart();
    PizzaOrder.initialiseOrder();
    PizzaMenu.initialiseMenu();

    //Коли сторінка завантажилась
    google.maps.event.addDomListener(window, 'load', GoogleMap.initialize);
});