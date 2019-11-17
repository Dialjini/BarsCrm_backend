/**
 * Category:
 * id: category-0 = List
 * id: category-1 = Finance
 * id: category-2 = Delivery
 * id: category-3 = Stock
 * id: category-4 = Analytics 
 */

$(document).ready(function() {
    $('.info').append(fillingTables(categoryInListClient));
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
});

addButtonsSubcategory(0);

// Нажатие на подкатегорию
function linkField() {
    $('.field').click(function() {
        $('.table').remove();

        function activityReassignment(array) {
            for (let i = 1; i < array.length; i++) {
                array[i].objectName[0].active = false;
            }
        }

        $('.field').removeClass('active');
        $(`#${this.id}`).addClass('active');
        $('div').is('#card_menu, #contract-decor, #invoicing, .invoicing') ? $('.card_menu').remove() : '';

        for (let i = 0; i < subcategoryButtons.length; i++) {
            for (let j = 1; j < subcategoryButtons[i].length; j++) {
                if (this.id == subcategoryButtons[i][j].id) {
                    activityReassignment(subcategoryButtons[i]);
                    $('.info').append(fillingTables(subcategoryButtons[i][j].objectName));
                    break;
                }
            }
        }
        requestData();
    });
}

// Нажатие на категорию
function linkCategory(element) {
    $('.info').empty();
    $('[name="linkCategory"]').removeClass('active');
    $(`#${element}`).addClass('active');
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        if (element == linkCategoryInfo[i].id) {
            for (let j = 0; j < linkCategoryInfo[i].subcategories.length; j++) {
                if (linkCategoryInfo[i].subcategories[j][0].active) {
                    addButtonsSubcategory(i);
                    $('.info').append(fillingTables(linkCategoryInfo[i].subcategories[j]));
                    i <= 1 ? $(`#${linkCategoryInfo[i].subcategories[j][0].id}Button`).addClass('active') : '';
                    break;
                }
            }
        }
    }
    linkField();
}

function gettingData(data) {
    saveTableAndCard.push(data);
    console.log(saveTableAndCard);
}

function requestData() {
    $.ajax({
        url: '/getClients',
        type: 'GET',
        dataType: 'html',
        success: function(data){
            gettingData(JSON.parse(data));
        }
    });
}

// Выпадающее меню "Поиска по региону"
$('#search_dropMenu').click(function() {
    if (this.classList.contains('active')) {
        $(`.drop-down, #search_dropMenu`).removeClass('active');
        $('.drop_down_search').remove();
    } else {
        $(`.drop-down, #search_dropMenu`).addClass('active');
        createDropMenu();
    }
});