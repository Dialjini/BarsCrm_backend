/**
 * Функции для работы с категориями и подкатегориями
 */

// Нажатие на подкатегорию
function linkField() {
    // Обычная подкатегория
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
        const list = [
            {width: 112, id: 'stock_product', list: ['Тест 1', 'Тест 2', 'Тест 3'] },
            {width: 110, id: 'stock_packing', list: ['Тест 1', 'Тест 2', 'Тест 3'] },
            {width: 99, id: 'stock_volume', list: ['10', '20', '30'] },
            {width: 240, id: 'stock_stock', list: ['Мой Склад', 'Твой Склад', 'Наш Склад'] },
            {width: 220, id: 'analytics_reports', list: ['Прибыль по клиентам', 'Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров'] },
            {width: 106, id: 'analytics_period', list: ['Тест 1', 'Тест 2', 'Тест 3'] },
        ]

        let idList = this.id;

        if ($(`#${idList} .drop_down_img`).hasClass('drop_active')) {
            $(`#${idList} .drop_down_img`).removeClass('drop_active');
            $(`#${idList} .report_list`).fadeOut(200);
            setTimeout(() => {
                $(`#${idList} .report_list`).remove();
            }, 300);
            return;
        }

        let namesList;

        function fillingList() {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == idList) {
                    $(`#${idList} .report_list`).width(list[i].width);
                    $(`#${idList}`).width(list[i].width);
                    namesList = list[i].list;
                    let ul = $('<ul>');
                    for (let j = 0; j < list[i].list.length; j++) {
                        ul.append(
                            `<li id="${idList}_${j}">${list[i].list[j]}</li>`
                        )
                    }
                    return ul;
                } 
            }
        }

        $('.report_list').remove();
        $('.drop_down_img').removeClass('drop_active');
        $('.field_with_modal').removeClass('active');
        $(this).append($('<div>', {
            class: 'report_list',
            id: idList,
        }));

        $('.report_list').append(fillingList());

        $('.report_list').fadeIn(400);
        $(`#${idList} .field_with_modal`).addClass('active');
        $(`#${idList} .drop_down_img`).addClass('drop_active');

        $('li').click(function() {
            $('table').remove();
            $(`#${idList} #active_field`).html(namesList[this.id.split('_')[2]]);
            $(`#${idList} .field_with_modal`).addClass('active');

            let createFilterTable = () => {
                if (this.id.includes('analytics')) {
                    let functions = [
                        analyticsFilterTable_0,
                        analyticsFilterTable_1,
                        analyticsFilterTable_2,
                        analyticsFilterTable_3,
                        analyticsFilterTable_4
                    ]
                    return functions[this.id.split('_')[2]]();
                }
            };

            $('.info').append(createFilterTable());
        });
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
                            html: subcategoryButtons[idCategory][i].name,
                            id: 'active_field',
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

// Отчеты
    // Прибыль по клиентам
    function analyticsFilterTable_0() {
        // Получить данные, чтобы заполнить таблицу(-ы)
        return `
            <table class="table analytics">
                <tr>
                    <th>Товар</th>
                    <th>Клиент</th>
                    <th>Объем</th>
                    <th>Цена</th>
                    <th>Доставка</th>
                    <th>Привет</th>
                    <th>Себестоимость</th>
                    <th>Купили</th>
                    <th>Заработали</th>
                    <th>Прибыль</th>
                </tr>
                <tr>
                    <td rowspan="2">Жмых</td>
                    <td>Лютик</td>
                    <td>7904</td>
                    <td>109</td>
                    <td>2</td>
                    <td>6</td>
                    <td>101</td>
                    <td>80</td>
                    <td>21</td>
                    <td>166000</td>
                </tr>
                <tr>
                    <td>Ромашка</td>
                    <td>7904</td>
                    <td>89</td>
                    <td>3</td>
                    <td>8</td>
                    <td>104</td>
                    <td>65</td>
                    <td>43</td>
                    <td>122300</td>
                </tr>
            </table>

            <table class="table analytics">
                <tr>
                    <th>Товар</th>
                    <th>Клиент</th>
                    <th>Объем</th>
                    <th>Цена</th>
                    <th>Доставка</th>
                    <th>Привет</th>
                    <th>Себестоимость</th>
                    <th>Купили</th>
                    <th>Заработали</th>
                    <th>Прибыль</th>
                </tr>
                <tr>
                    <td rowspan="2">Барда</td>
                    <td>Лютик</td>
                    <td>7904</td>
                    <td>109</td>
                    <td>2</td>
                    <td>6</td>
                    <td>101</td>
                    <td>80</td>
                    <td>21</td>
                    <td>166000</td>
                </tr>
                <tr>
                    <td>Ромашка</td>
                    <td>7904</td>
                    <td>89</td>
                    <td>3</td>
                    <td>8</td>
                    <td>104</td>
                    <td>65</td>
                    <td>43</td>
                    <td>122300</td>
                </tr>
            </table>
        `
    }
    // Сводный по объёмам
    function analyticsFilterTable_1() {
        // Один tr - один клиент
        return `
            <table class="table analytics">
                <tr>
                    <th>Клиент</th>
                    <th>Товар 1</th>
                    <th>Товар 2</th>
                    <th>Товар 3</th>
                    <th>Товар 4</th>
                    <th>Товар 5</th>
                    <th>Товар 6</th>
                </tr>
                <tr>
                    <td>Лютик</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Цветик</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Семицветик</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Ромашка</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Антошка</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td></td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                </tr>
            </table>
        `
    }
    // По клиентам
    function analyticsFilterTable_2() {
        // Один клиент - один tbody. rowspan - количество товаров
        return `
            <table class="table analytics">
                <tr>
                    <th>Клиент</th>
                    <th>Товары</th>
                    <th>Вес</th>
                    <th>Дата отгрузки</th>
                    <th>Сумма</th>
                </tr>
                <tbody>
                    <tr>
                        <td rowspan="3">Лютик</td>
                        <td>Товар 1</td>
                        <td>Объём</td>
                        <td>Дата</td>
                        <td>Сумма</td>
                    </tr>
                    <tr>
                        <td>Товар 2</td>
                        <td>Объём</td>
                        <td>Дата</td>
                        <td>Сумма</td>
                    </tr>
                    <tr>
                        <td>Товар 3</td>
                        <td>Объём</td>
                        <td>Дата</td>
                        <td>Сумма</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td rowspan="2">Ромашка</td>
                        <td>Товар 1</td>
                        <td>Объём</td>
                        <td>Дата</td>
                        <td>Сумма</td>
                    </tr>
                    <tr>
                        <td>Товар 2</td>
                        <td>Объём</td>
                        <td>Дата</td>
                        <td>Сумма</td>
                    </tr>
                </tbody>
            </table>
        `
    }
    // По приветам
    function analyticsFilterTable_3() {
        // Один tr - один клиент.
        return `
            <table class="table analytics">
                <tr>
                    <th>Клиент</th>
                    <th>Объём</th>
                    <th>Сколько</th>
                    <th>Сумма</th>
                    <th>Итого</th>
                </tr>
                <tr>
                    <td>Лютик</td>
                    <td>Объём</td>
                    <td>Привет/Объём</td>
                    <td>Привет из счета</td>
                    <td>Сумма * 0.9</td>
                </tr>
                <tr>
                    <td>Ромашка</td>
                    <td>Объём</td>
                    <td>Привет/Объём</td>
                    <td>Привет из счета</td>
                    <td>Сумма * 0.9</td>
                </tr>
            </table>
        `
    }
    // Отгрузки менеджеров
    function analyticsFilterTable_4() {
        // Один tr - один клиент
        return `
            <table class="table analytics">
                <tr>
                    <th>Менеджер</th>
                    <th>Итого</th>
                    <th>Товар 1</th>
                    <th>Товар 2</th>
                    <th>Товар 3</th>
                    <th>Товар 4</th>
                    <th>Товар 5</th>
                    <th>Товар 6</th>
                </tr>
                <tr>
                    <td>Сидоров</td>
                    <td>Сумма по товарам</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Петров</td>
                    <td>Сумма по товарам</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Иванов</td>
                    <td>Сумма по товарам</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Кустов</td>
                    <td>Сумма по товарам</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td>Пупкин</td>
                    <td>Сумма по товарам</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                    <td>Объем</td>
                </tr>
                <tr>
                    <td></td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                    <td class="bold">Сумма</td>
                </tr>
            </table>
        `
    }