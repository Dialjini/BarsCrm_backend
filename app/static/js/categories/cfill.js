/**
 * Функции для работы с категориями и подкатегориями
 */
let test = 0;
// Нажатие на подкатегорию
function linkField() {
    // Обычная подкатегория
    $('.field').click(function() {
        sortStatus = {
            product: {status: false, filter: null, last: null},
            price: {status: false, filter: null}
        }
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
                    getTableData(subcategoryButtons[i][j].objectName);
                    break;
                }
            }
        }
    });

    // Подкатегория с вызовом модального окна
    $('.list').click(function() {
        const list = [
            { width: 161.125, id: 'stock_group', list: [] },
            { width: 90.656, id: 'stock_product', list: [] },
            { width: 110.328, id: 'stock_packing', list: [] },
            { width: 92.297, id: 'stock_stock', list: [] },
            { width: 97.281, id: 'stock_volume', list: [] },
            { width: 220, id: 'analytics_reports', list: ['Прибыль по клиентам', 'Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров'] },
            { width: 106, id: 'analytics_period', list: ['Тест 1', 'Тест 2', 'Тест 3'] },
        ]

        let info = ['Group_name', 'Name', 'Packing', 'stock_address'];
        for (let k = 0; k < info.length; k++) {
            for (let i = 0; i < categoryInStock[1][1].length; i++) {
                for (let j = 0; j < categoryInStock[1][1][i].items.length; j++) {
                    // Если value этой айдишки не ее изначально название - брать остальные показатели, у которых есть это неизначальное значение
                    if (k !== 3) list[k].list.push(categoryInStock[1][1][i].items[j][info[k]]);
                    else list[k].list.push(categoryInStock[1][1][i][info[k]])
                }
            }
        }

        let idList = this.id;
        let element;

        for (let i = 0; i < list.length; i++) {
            if (list[i].id === idList) {
                element = i;
            }
        }
        let array = list[element].list;
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i].toLowerCase() === array[j].toLowerCase()) {
                    array.splice(j, 1);
                    j--;
                }
            }
        }

        if ($(`#${idList} .drop_down_img`).hasClass('drop_active')) {
            $(`#${idList} .drop_down_img`).removeClass('drop_active');
            $(`#${idList} .report_list`).fadeOut(200);
            setTimeout(() => {
                $(`#${idList} .report_list`).remove();
            }, 300);
            return;
        }

        for (let i = 0; i < list.length; i++) {
            $(`#${list[i].id}`).width('auto');
        }

        let namesList;
        function fillingList() {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == idList) {
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
        checkWidth();
        function checkWidth() {
            let width = $(`#${idList} .report_list`).width();
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == idList) {
                    if (width > list[i].width) {
                        $(`#${idList}`).width(width);
                    } else {
                        $(`#${idList}`).width(list[i].width);
                        $(`#${idList} .report_list`).width(list[i].width);
                    }
                }
            }
        }

        $('.report_list').fadeIn(400);
        $(`#${idList} .field_with_modal`).addClass('active');
        $(`#${idList} .drop_down_img`).addClass('drop_active');

        $('li').click(function() {
            let filterName = this.innerHTML;

            $('table').remove();
            $(`#${idList} #active_field`).html(namesList[this.id.split('_')[2]]);
            $(`#${idList} .field_with_modal`).addClass('active');

            let createFilterTable = () => {
                if (idList.includes('analytics_reports')) {
                    let functions = [
                        analyticsFilterTable_0,
                        analyticsFilterTable_1,
                        analyticsFilterTable_2,
                        analyticsFilterTable_3,
                        analyticsFilterTable_4
                    ]
                    return functions[this.id.split('_')[2]]();
                } else {
                    let filter_ids = [
                        { id: 'stock_group', filterName: 'Group_name', name: 'Группа товаров'},
                        { id: 'stock_product', filterName: 'Name', name: 'Товар'},
                        { id: 'stock_packing', filterName: 'Packing', name: 'Фасовка'},
                        { id: 'stock_volume', filterName: 'Volume', name: 'Объем'},
                        { id: 'stock_stock', filterName: 'stock_address', name: 'Склад'},
                    ]
                    // Фильтрация как общая (449 строка main.js)
                    if (lastData.last_id == idList) {
                        if (lastData.last_table[0].id == 'filter_stock') {
                            let data = lastData.last_table;
                            lastData.last_table = [
                                { id: 'filter_stock', name: 'Склад', active: true, lastCard: [null, null] },
                                [[
                                    { name: 'Группа товаров', width: 15 },
                                    { name: 'Товар', width: 15 },
                                    { name: 'Юр. лицо', width: 5 },
                                    { name: 'Вес', width: 5 },
                                    { name: 'Объем', width: 5 },
                                    { name: 'Фасовка', width: 15 },
                                    { name: 'НДС', width: 5 },
                                    { name: 'Цена прайса', width: 5 },
                                    { name: 'Склад', width: 15 },
                                ]],
                            ];
                            lastData.last_table[1][1] = data[1][1];
                            let filterTable = [];
                            for (let i = 0; i < data[1][1].length; i++) {
                                for (let k = 0; k < filter_ids.length; k++) {
                                    if (filter_ids[k].id == idList) {
                                        if (data[1][1][i][filter_ids[k].filterName] == filterName) {
                                            data[1][1][i].stock_address = data[1][1][i].stock_address;
                                            filterTable.push(data[1][1][i]);
                                        }   
                                    }
                                }
                            }
                            data[1][1] = [];
                            for (let i = 0; i < filterTable.length; i++) {
                                data[1][1].push(filterTable[i]);
                            }
                            lastData.last_id = idList;
                            return fillingTables(data);
                        } else if (lastData.last_table[0].id == 'stock') {
                            let data = lastData.last_table;
                            lastData.last_table = [
                                { id: 'stock', name: 'Склад', active: true, lastCard: [null, null] },
                                [[
                                    { name: 'Юр. лицо', width: 5 },
                                    { name: 'Группа товаров', width: 15 },
                                    { name: 'Товар', width: 15 },
                                    { name: 'Вес', width: 5 },
                                    { name: 'Фасовка', width: 15 },
                                    { name: 'Объем', width: 5 },
                                    { name: 'Цена прайса', width: 5 },
                                    { name: 'НДС', width: 5 },
                                    { name: 'Склад', width: 15 },
                                ]],
                            ];
                            lastData.last_table[1][1] = data[1][1];
                            let filterTable = [];

                            for (let i = 0; i < data[1][1].length; i++) {
                                for (let j = 0; j < data[1][1][i].items.length; j++) {
                                    for (let k = 0; k < filter_ids.length; k++) {
                                        if (idList == 'stock_stock') {
                                            if (data[1][1][i][filter_ids[k].filterName] == filterName) {
                                                data[1][1][i].items[j].stock_address = data[1][1][i].stock_address;
                                                filterTable.push(data[1][1][i].items[j]);
                                            }   
                                        } else if (filter_ids[k].id == idList) {
                                            if (data[1][1][i].items[j][filter_ids[k].filterName] == filterName) {
                                                data[1][1][i].items[j].stock_address = data[1][1][i].stock_address;
                                                filterTable.push(data[1][1][i].items[j]);
                                            }
                                        }
                                    }
                                }
                            }
                            data[1][1] = [];
                            for (let i = 0; i < filterTable.length; i++) {
                                data[1][1].push(filterTable[i]);
                            }
                            data[0].id = 'filter_stock';
                            lastData.last_id = idList;
                            return fillingTables(data);
                        }
                    } else {
                        if (categoryInFilterStock[1][1].length == 0) {
                            // Фильтровать от inStock
                            let data = categoryInStock[1][1];
                            let filterTable = [];

                            lastData.last_table = [
                                { id: 'stock', name: 'Склад', active: true, lastCard: [null, null] },
                                [[
                                    { name: 'Юр. лицо', width: 5 },
                                    { name: 'Группа товаров', width: 15 },
                                    { name: 'Товар', width: 15 },
                                    { name: 'Вес', width: 5 },
                                    { name: 'Фасовка', width: 15 },
                                    { name: 'Объем', width: 5 },
                                    { name: 'Цена прайса', width: 5 },
                                    { name: 'НДС', width: 5 },
                                    { name: 'Склад', width: 15 },
                                ]],
                            ];
                            lastData.last_table[1][1] = categoryInStock[1][1];
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < data[i].items.length; j++) {
                                    for (let k = 0; k < filter_ids.length; k++) {
                                        if (idList == 'stock_stock') {
                                            if (data[i][filter_ids[k].filterName] == filterName) {
                                                data[i].items[j].stock_address = data[i].stock_address;
                                                filterTable.push(data[i].items[j]);
                                            }
                                        } else if (filter_ids[k].id == idList) {
                                            if (data[i].items[j][filter_ids[k].filterName] == filterName) {
                                                data[i].items[j].stock_address = data[i].stock_address;
                                                filterTable.push(data[i].items[j]);
                                            }
                                        }
                                    }
                                }
                            }
                            data = [];
                            for (let i = 0; i < filterTable.length; i++) {
                                data.push(filterTable[i]);
                            }
                            lastData.last_id = idList;
                            categoryInFilterStock[1][1] = data;
                            data = [
                                { id: 'filter_stock', name: 'Склад', active: true, lastCard: [null, null] },
                                [[
                                    { name: 'Юр. лицо', width: 5 },
                                    { name: 'Группа товаров', width: 15 },
                                    { name: 'Товар', width: 15 },
                                    { name: 'Вес', width: 5 },
                                    { name: 'Фасовка', width: 15 },
                                    { name: 'Объем', width: 5 },
                                    { name: 'Цена прайса', width: 5 },
                                    { name: 'НДС', width: 5 },
                                    { name: 'Склад', width: 15 },
                                ], data],
                                
                            ]
                            return fillingTables(data);
                        } else {
                            // Фильтровать filterStock
                            let data = categoryInFilterStock;
                            lastData.last_table = [
                                { id: 'filter_stock', name: 'Склад', active: true, lastCard: [null, null] },
                                [[
                                    { name: 'Юр. лицо', width: 5 },
                                    { name: 'Группа товаров', width: 15 },
                                    { name: 'Товар', width: 15 },
                                    { name: 'Вес', width: 5 },
                                    { name: 'Фасовка', width: 15 },
                                    { name: 'Объем', width: 5 },
                                    { name: 'Цена прайса', width: 5 },
                                    { name: 'НДС', width: 5 },
                                    { name: 'Склад', width: 15 },
                                ]],
                            ];
                            lastData.last_table[1][1] = categoryInFilterStock[1][1];
                            let filterTable = [];
                            for (let i = 0; i < data[1][1].length; i++) {
                                for (let k = 0; k < filter_ids.length; k++) {
                                    if (filter_ids[k].id == idList) {
                                        if (data[1][1][i][filter_ids[k].filterName] == filterName) {
                                            data[1][1][i].stock_address = data[1][1][i].stock_address;
                                            filterTable.push(data[1][1][i]);
                                        }   
                                    }
                                }
                            }
                            data[1][1] = [];
                            for (let i = 0; i < filterTable.length; i++) {
                                data[1][1].push(filterTable[i]);
                            }
                            lastData.last_id = idList;
                            return fillingTables(data);
                        }
                    }                    
                }
            };

            $('.info').append(createFilterTable());
        });
    });
}

let lastData = {last_id: '', last_table: ''};

// Нажатие на категорию
function linkCategory(element) {
    $('.info').empty();
    $('[name="linkCategory"], .mini_logo').removeClass('active');
    $(`#${element}`).addClass('active');
    lastData = {last_id: '', last_table: ''};
    sortStatus = {
        product: {status: false, filter: null, last: null},
        price: {status: false, filter: null}
    }
    categoryInFilterStock[1][1] = [];
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        if (element == linkCategoryInfo[i].id) {
            for (let j = 0; j < linkCategoryInfo[i].subcategories.length; j++) {
                if (linkCategoryInfo[i].subcategories[j][0].active) {
                    addButtonsSubcategory(i);
                    getTableData(linkCategoryInfo[i].subcategories[j]);
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
        $('#delivery_new').attr('onclick', 'reloadStockItems(this)');
    }
}

function closePersonCard() {
    // Создавать пользователя
    $('.card_menu').remove();
    adminPanel();
}

function userInfo(element) {
    function fillRoles(role) {
        if (role == 'admin') {
            return `
                <option selected value="admin">Администратор</option>
                <option value="manager">Менеджер</option>
            `
        } else {
            return `
                <option value="admin">Администратор</option>
                <option selected value="manager">Менеджер</option>
            `
        }
    }
    $.ajax({
        url: '/getUsers',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == element.id) {
                    $('.table, .card_menu').remove();
                        $('.info').append(`
                        <div class="card_menu persons" id="card_menu">
                            <div class="title">
                                <div class="left_side">
                                    <span>Редактирование сотрудника</span>
                                </div>
                                <div class="right_side">
                                    <div class="close" onclick="closePersonCard()">
                                        <img src="static/images/cancel.png">
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div class="row_card">
                                    <table class="table_block">
                                        <tr>
                                            <td>Фамилия</td>
                                            <td>
                                                <input type="text" value="${data[i].second_name}" disabled>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Имя</td>
                                            <td>
                                                <input type="name" value="${data[i].name}" disabled>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Отчество</td>
                                            <td>
                                                <input type="text" value="${data[i].third_name}" id="edit_patronymic">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Должность</td>
                                            <td>
                                                <select type="text" id="edit_role">
                                                    ${fillRoles(data[i].role)}
                                                </select>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="table_block">
                                        <tr>
                                            <td>Email</td>
                                            <td>
                                                <input type="email" value="${data[i].email}" id="edit_email">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Логин</td>
                                            <td>
                                                <input type="login" value="${data[i].login}" disabled>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Пароль</td>
                                            <td>
                                                <input type="text" value="${data[i].password}" id="edit_password">
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="next">
                                    <button class="btn btn-main" id="${data[i].id}" onclick="deleteMember(this.id)">Удалить</button>
                                    <button class="btn btn-main" id="${data[i].id}" onclick="editMember(this.id)">Изменить</button>
                                </div>
                            </div>
                        </div>`)
                }
            }
        }
    });
}

function deleteMember(idMember) {
    $.ajax({
        url: '/deleteMember',
        type: 'GET',
        data: {id: idMember},
        dataType: 'html',
        success: function() {
            $('.card_menu').remove();
            adminPanel();
        }
    });
}

function editMember(idMember) {
    $.ajax({
        url: '/getUsers',
        type: 'GET',
        dataType: 'html',
        success: function(result) {
            result = JSON.parse(result);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id == +idMember) {
                    let data = {};
                    data['create_patronymic'] = $('#edit_patronymic').val();
                    data['create_email'] = $('#edit_email').val();
                    data['create_role'] = $('#edit_role').val();
                    data['create_password'] = $('#edit_password').val();
                    data['create_last_name'] = result[i].second_name;
                    data['create_first_name'] = result[i].name;
                    data['create_login'] = result[i].login;
                    data['id'] = +idMember;
                
                    $.ajax({
                        url: '/addUser',
                        type: 'GET',
                        data: data,
                        dataType: 'html',
                        success: function() {
                            $('.card_menu').remove();
                            adminPanel();
                        }
                    });
                }
            }
        }
    });
}

function adminPanel() {
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            if (data.role == 'admin') {
                $('.info').empty();
                $('[name="linkCategory"]').removeClass('active');
                $('#mini_logo').addClass('active');

                function fillingTable() {
                    $.ajax({
                        url: '/getUsers',
                        type: 'GET',
                        dataType: 'html',
                        success: function(data) {
                            data = JSON.parse(data);
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].role == 'admin') data[i].role = 'Администратор';
                                if (data[i].role == 'manager') data[i].role = 'Менеджер';
                                $('#admin').append(`
                                    <tr id="${data[i].id}" onclick="userInfo(this)">
                                        <td>${data[i].second_name}</td>
                                        <td>${data[i].name}</td>
                                        <td>${data[i].third_name}</td>
                                        <td>${data[i].role}</td>
                                        <td>${data[i].email}</td>
                                        <td>${data[i].login}</td>
                                        <td>${data[i].password}</td>
                                    </tr>
                                `)
                            }
                        }
                    });
                }
                getContent();
                function getContent() {
                    $('.info').append(`
                        <div class="row">
                            <div class="fields">
                                <div class="btn btn-main btn-div" id="addNewPerson">Добавить сотрудника</div>
                            </div>
                            <div class="category">АДМИН ПАНЕЛЬ</div>
                        </div>
                        <table class="table" id="admin">
                            <tr>
                                <th width="170">Фамилия</th>
                                <th width="170">Имя</th>
                                <th width="170">Отчество</th>
                                <th width="130">Должность</th>
                                <th width="170">Email</th>
                                <th width="120">Логин</th>
                                <th width="150">Пароль</th>
                            </tr>
                        </table>`)
                        fillingTable();
                    }

                    $('#addNewPerson').click(function() {
                        $('.table, .card_menu').remove();
                        $('.info').append(`
                        <div class="card_menu persons" id="card_menu">
                            <div class="title">
                                <div class="left_side">
                                    <span>Добавление сотрудника</span>
                                </div>
                                <div class="right_side">
                                    <div class="close" onclick="closePersonCard()">
                                        <img src="static/images/cancel.png">
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div class="row_card">
                                    <table class="table_block">
                                        <tr>
                                            <td>Фамилия</td>
                                            <td>
                                                <input type="text" id="create_last_name">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Имя</td>
                                            <td>
                                                <input type="name" id="create_first_name">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Отчество</td>
                                            <td>
                                                <input type="text" id="create_patronymic">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Должность</td>
                                            <td>
                                                <select type="text" id="create_role">
                                                    <option value="null" selected disabled>Не выбран</option>
                                                    <option value="admin">Администратор</option>
                                                    <option value="manager">Менеджер</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="table_block">
                                        <tr>
                                            <td>Email</td>
                                            <td>
                                                <input type="email" id="create_email">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Логин</td>
                                            <td>
                                                <input type="login" id="create_login">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Пароль</td>
                                            <td>
                                                <input type="text" id="create_password">
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="next">
                                    <button class="btn btn-main" onclick="createNewMember()">Добавить</button>
                                </div>
                            </div>
                        </div>`)
                    })
            }
            return;
        }
    });
}

function createNewMember() {
    let ids = ['create_last_name', 'create_first_name', 'create_patronymic', 'create_role', 'create_password', 'create_login', 'create_email'];
    let data = {};

    for (let i = 0; i < ids.length; i++) {
        data[ids[i]] = $(`#${ids[i]}`).val();
        if ($(`#${ids[i]}`).val() == '' && ids[i] != 'create_email' && ids[i] != 'create_patronymic' || $(`#${ids[i]}`).val() == null) {
            return alert('Все поля, кроме почты и отчества, обязательны к заполнению!');
        }
    }
    data['id'] = 'new';
    $.ajax({
        url: '/addUser',
        data: data,
        type: 'GET',
        dataType: 'html',
        success: function() {
            closePersonCard();
        }
    }); 
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