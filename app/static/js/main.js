/**
 * Category:
 * id: category-0 = List
 * id: category-1 = Finance
 * id: category-2 = Delivery
 * id: category-3 = Stock
 * id: category-4 = Analytics 
 */

$(document).ready(function() {
    requestData.getRequest();
    createCategoryMenu();
    createCTButtons();
    linkField();
    addButtonsSubcategory(0);
    $('#clientButton, #category-0').addClass('active');
});

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
    });
    // Подкатегория с вызовом модального окна
    $('.list').click(function() {
        // const list = [
        //     { id: 'stock_product', list: ['1231', '123', '123'] },
        //     { id: 'analytics_reports', list: ['Прибыль по клиентам', 'Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров'] },
        // ]

        if ($(`#${this.id} .drop_down_img`).hasClass('drop_active')) {
            $(`#${this.id} .drop_down_img`).removeClass('drop_active');
            $(`#${this.id} .field_with_modal`).removeClass('active');
            $(`#${this.id} .report_list`).fadeOut(200);
            setTimeout(() => {
                $(`#${this.id} .report_list`).remove();
            }, 300);
            return;
        }

        $('.report_list').remove();
        $('.drop_down_img').removeClass('drop_active');
        $('.field_with_modal').removeClass('active');
        $(this).append($('<div>', { class: 'report_list', id: this.id }));

        $('.report_list').fadeIn(400);
        function fillingReportList() {
            
        }
        $(`#${this.id} .field_with_modal`).addClass('active');
        $(`#${this.id} .drop_down_img`).addClass('drop_active');
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
    categoryInListClient[1].push(data);
    $('.info').append(fillingTables(categoryInListClient));
}

let requestData = (function() {
    return {
        getRequest: function () {
            $.ajax({
                url: '/getClients',
                type: 'GET',
                dataType: 'html',
                success: function(data){
                    gettingData(JSON.parse(data));
                }
            });
        }
    }
})();

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