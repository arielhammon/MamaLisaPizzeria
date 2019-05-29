var pizza = []; //two dimensional array of [option, price]
var order = []; //array of pizzas

var optionNames = [
    //HTML group name, number of included options, required true/false
    ["size",0, true], ["crust", 0, true], ["sauce", 0, true],
    ["cheese", 0, true], ["meat", 1, false], ["veggies", 1, false]
];

var optionClears = [
    //these checkbox groups will be cleared when a new pizza is started
    "meat", "veggies"
];

var optionsDB = [
    //this array would be replaced with a database
    //didn't use HTML elements for security reasons
    ["Personal Pizza", 6.00],
    ["Mediuim Pizza", 10.00],
    ["Large Pizza", 14.00],
    ["Extra Large Pizza", 16.00],
    ["Pepperoni", 1.00],
    ["Sausage", 1.00],
    ["Candadian Bacon", 1.00],
    ["Ground Beef", 1.00],
    ["Anchovy", 1.00],
    ["Chicken", 1.00],
    ["Tomatoes", 1.00],
    ["Onions", 1.00],
    ["Olives", 1.00],
    ["Green Peppers", 1.00],
    ["Mushrooms", 1.00],
    ["Pineapple", 1.00],
    ["Spinach", 1.00],
    ["Jalapeno", 1.00],
    ["Regular Cheese", 0.00],
    ["No Cheese", 0.00],
    ["Extra Cheese", 3.00],
    ["Marinara Sauce", 0.00],
    ["White Sauce", 0.00],
    ["Barbecue Sauce", 0.00],
    ["No Sauce", 0.00],
    ["Plain Crust", 0.00],
    ["Garlic Butter Crust", 0.00],
    ["Cheese Stuffed Crust", 3.00],
    ["Spicy Crust", 0.00],
    ["House Special Crust", 0.00]
];

function getPizzaOptions() {
    var options = [];
    var i = 0; //iterates through option element IDs
    var j = 0; //iterates through optionNamess
    var jct = 0; //number of options included in price
    var ct = 0; //number of options selected in a option group
    var desc = ""; //used to construct pizza line option description
    var price = ""; //used to construct pizza line option price
    var problem = false; //used to determine if the pizza is valid

    for (j = 0; j < optionNames.length; j++) {
        options = document.getElementsByName(optionNames[j][0]);
        jct = optionNames[j][1];
        ct = 0;
        for (i = 0; i < options.length; i++) {
            if (options[i].checked) {
                ct++;
                desc = optionsDB[options[i].value][0];
                if (ct <= jct) { //option included in price
                    price = ""
                    pizza.push([desc, price]);
                } else { //option not included in price
                    price = optionsDB[options[i].value][1];
                    if (price == 0) {price = "";}
                    pizza.push([desc, price]);
                }
            }    
        }

        //validate data and highlight problems
        if (optionNames[j][2] && ct == 0) {
            // required option was not selected
            // HTML radio groups must be selected but this code is included for security reasons
            for (i = 0; i < options.length; i++) {
                options[i].border = "2px solid red";
                problem = true;
            }
        } else {
            for (i = 0; i < options.length; i++) {
                options[i].border = "none";
            }
        }
    }
    return problem;
}

function displayError(msg, btnText) {
    document.getElementById("error-msg").innerHTML = msg;
    document.getElementById("error-button").innerHTML = btnText;
    document.getElementById("error").style.display = "block";
    
}

function clearOptionBoxes() {
    var options = [];
    var i = 0; //iterates through option element IDs
    var j = 0; //iterates through optionNamess

    for (j = 0; j < optionClears.length; j++) {
        options = document.getElementsByName(optionClears[j]);
        for (i = 0; i < options.length; i++) {
            options[i].checked = false;
        }
    }

}

function addPizza() {
    var problem = getPizzaOptions();
    if (!problem) {
        order.push(pizza);
        pizza = [];
        document.getElementById("add-pizza").style.display = "block";
        clearOptionBoxes(); //clear checkboxes but not radio buttons
    } else {
        displayError("There was a problem. Please be sure to select one of each required option groups highlighted in red.",
        "Okay. Let me revise my options.");
    }
}

function viewOrder() {
    if (order.length > 0) {
        viewOrderTable();
    } else {
        displayError("No pizza has been added to the order, yet.",
        "Okay, Continue Shopping");
    }
}

function viewOrderTable() {
    var i = 0;
    var j = 0;
    var price = 0;
    var subTotal = 0;
    var Total = 0;
    var classPrefix = "";
    var tr = null;
    var td = null;
    var span = null;
    var node = null;
    var orderTable = document.getElementById("order-table");

    while (orderTable.hasChildNodes()) {
        orderTable.removeChild(orderTable.children[0]);
    }
    for (j = 0; j < order.length; j++) { //iterate through each pizza
        if ((j % 2) == 0) { //alternate style
            classPrefix = "g";
        } else {
            classPrefix = "h";
        }
        for (i = 0; i < order[j].length; i++) { //iterate through each option
            tr = document.createElement("tr");
            tr.classList.add(classPrefix + ((i % 2)+1));
            td = document.createElement("td");
            td.classList.add("dc");
            tr.appendChild(td);
            if (i == 0) { //start of new pizza
                span = document.createElement("span");
                span.classList.add("w3-button");
                span.dataset.index = j;
                span.onclick = removePizza;
                span.innerHTML = "&times;";
                td.appendChild(span);
            }
            td = document.createElement("td");
            td.classList.add("d");
            node = document.createTextNode(order[j][i][0]); //description
            td.appendChild(node);
            tr.appendChild(td);
            td = document.createElement("td");
            td.classList.add("e");
            price = order[j][i][1];
            if (price !== "") {
                price = Number(price).toFixed(2);
                subTotal += Number(price);
                Total += Number(price);
            }
            node = document.createTextNode(price); //price
            td.appendChild(node);
            tr.appendChild(td);
            td = document.createElement("td");
            td.classList.add("f");
            tr.appendChild(td);
            orderTable.appendChild(tr);
        }
        node = document.createTextNode(subTotal.toFixed(2));
        td.appendChild(node);
        subTotal = 0;
    }
    document.getElementById("total").innerHTML = "Your total is: $" + Total.toFixed(2);
    if (order.length == 0) {
        document.getElementById("finalize").disabled = true;
        document.getElementById("cancel-order").disabled = true;
    } else {
        document.getElementById("finalize").disabled = false;
        document.getElementById("cancel-order").disabled = false;
    }
    document.getElementById("order").style.display = "block";
}

function removePizza(event) {
    order.splice(event.target.dataset.index,1);
    viewOrderTable();
}

function deleteOrderInfo() {
    document.getElementById("cancel").style.display = "none";
    clearOptionBoxes();
    pizza = [];
    order = [];
}

function cancelOrder() {
    if (order.length > 0) {
        document.getElementById("cancel").style.display = "block";
    } else {
        displayError("Sorry, nothing to cancel, yet.",
        "Okay, Continue");
    }
}

function cancelAfterView() {
    document.getElementById("order").style.display = "none";
    document.getElementById("cancel").style.display = "block";
}

function viewAfterAdd() {
    document.getElementById("add-pizza").style.display = "none";
    viewOrderTable();
}