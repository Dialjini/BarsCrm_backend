/**
 * Функции для работы с категориями и подкатегориями
 */

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

function addButtonsSubcategory(idCategory) {
    $('.info').append(
        $('<div>', {
            class: 'row',
            id: 'subcategories',
            append: $('<div>', { class: 'fields' }).add(
                $('<div>', { class: 'category', html: subcategoryButtons[idCategory][0].toUpperCase() })
            )
        })
    );

    for (let i = 1; i < subcategoryButtons[idCategory].length; i++) {
        let element;
        $('.fields').append(() => {
            if (subcategoryButtons[idCategory][0] === 'Склад' || subcategoryButtons[idCategory][0] === 'Аналитика') {
                return $('<div>', {
                    class: 'list',
                    id: subcategoryButtons[idCategory][i].id,
                    append: $('<div>', {
                        class: subcategoryButtons[idCategory][i].class,
                        append: $('<span>', {
                            html: subcategoryButtons[idCategory][i].name
                        }).add($('<img>', {
                            src: 'static/images/dropmenu_black.svg',
                            class: 'drop_down_img'
                        }))
                    })
                })
            }
            return element = $('<div>', {
                class: subcategoryButtons[idCategory][i].class,
                html: subcategoryButtons[idCategory][i].name,
                id: subcategoryButtons[idCategory][i].id
            });
        })
        $('#delivery-clear').attr('onclick', 'createCardMenu(this)');
    }
}