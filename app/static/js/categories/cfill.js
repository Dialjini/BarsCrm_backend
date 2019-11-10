/**
 * Функции для работы с категориями и подкатегориями
 */

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
            if (subcategoryButtons[idCategory][0] == 'Склад') {
                return element = $('<div>', {
                    class: subcategoryButtons[idCategory][i].class,
                    id: subcategoryButtons[idCategory][i].id,
                    append: $('<span>', {
                        html: subcategoryButtons[idCategory][i].name
                    }).add($('<img>', {
                        src: 'static/images/dropmenu_black.svg',
                        class: 'drop_down_img'
                    }))
                });
            }
            return element = $('<div>', {
                class: subcategoryButtons[idCategory][i].class,
                html: subcategoryButtons[idCategory][i].name,
                id: subcategoryButtons[idCategory][i].id
            });
        });
        $('#delivery-clear').attr('onclick', 'createCardMenu(this)');
    }
}