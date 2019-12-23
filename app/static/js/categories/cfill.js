/**
 * Функции для работы с категориями и подкатегориями
 */
// Нажатие на подкатегорию
function linkField() {
    // Обычная подкатегория
    $('.field').click(function() {
        sortStatus = {
            product: {status: false, filter: null, last: null},
            price: {status: false, filter: null},
            area: {status: false, filter: null},
            category: {status: false, filter: null, last: null},
            manager: {status: false, filter: null, last: null}
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
            { width: 106, id: 'analytics_period', list: ['За день', 'За неделю', 'За месяц', 'За год'] },
        ]

        let idList = this.id;
        let element;
        let info = ['Group_name', 'Name', 'Packing', 'stock_address'];
        if (!idList.includes('analytics')) {
            for (let k = 0; k < info.length; k++) {
                for (let i = 0; i < categoryInStock[1][1].length; i++) {
                    for (let j = 0; j < categoryInStock[1][1][i].items.length; j++) {
                        // Если value этой айдишки не ее изначально название - брать остальные показатели, у которых есть это неизначальное значение
                        if (k !== 3) list[k].list.push(categoryInStock[1][1][i].items[j][info[k]]);
                        else list[k].list.push(categoryInStock[1][1][i][info[k]])
                    }
                }
            }
        }

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
            if ($('#active_field').html() == 'Сводный по объёмам' || $('#active_field').html() == 'Отгрузки менеджеров') {
                $('.table').width('fit-content');
            }
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
        price: {status: false, filter: null},
        area: {status: false, filter: null},
        category: {status: false, filter: null, last: null},
        manager: {status: false, filter: null, last: null}
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
        let account_data;
        $.ajax({
            url: '/getAccounts',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                account_data = JSON.parse(data);
            }
        });
        let items_list = [];
        for (let i = 0; i < account_data.length; i++) {
            for (let j = 0; j < account_data[i].items.length; j++) {
                items_list.push({ item: account_data[i].items[j], account: [account_data[i].account] })
            }
        }
        for (let i = 0; i < items_list.length - 1; i++) {
            for (let j = i + 1; j < items_list.length; j++) {
                if (items_list[i].item.Item_id == items_list[j].item.Item_id) {
                    for (let k = 0; k < items_list[j].account.length; k++) {
                        items_list[i].account.push(items_list[j].account[k])
                    }
                    items_list.splice(j, 1);
                    j--;
                }
            }
        }
        console.log(items_list);
        function fillTable() {
            let table = '';
            for (let i = 0; i < items_list.length; i++) {
                for (let j = 0; j < items_list[i].account.length; j++) {
                    let volume = JSON.parse(items_list[i].account[j].Item_ids);
                    let delivery = JSON.parse(items_list[i].account[j].Shipping);
                    let hello = JSON.parse(items_list[i].account[j].Hello);
                    for (let v = 0; v < volume.length; v++) {
                        if (+volume[v].id == +items_list[i].item.Item_id) {
                            function fillTr() {
                                let trContent = '';
                                if (j == 0) {
                                    trContent += `<td rowspan="${items_list[i].account.length}">${items_list[i].item.Name}</td>`;
                                }
                                let price = +delivery[v] + +hello[v] + Math.round(+items_list[i].item.Cost / +items_list[i].item.Volume);
                                trContent += `<td>${items_list[i].account[j].Name}</td>
                                            <td>${volume[v].volume}</td>
                                            <td>${price}</td>
                                            <td>${delivery[v]}</td>
                                            <td>${hello[v]}</td>
                                            <td>${Math.round(+items_list[i].item.Cost / +items_list[i].item.Volume)}</td>
                                            <td>${items_list[i].item.Purchase_price}</td>
                                            <td>${Math.round(+items_list[i].item.Cost / +items_list[i].item.Volume) - +items_list[i].item.Purchase_price}</td>
                                            <td>${(Math.round(+items_list[i].item.Cost / +items_list[i].item.Volume) - +items_list[i].item.Purchase_price) * +volume[v].volume}</td>`
                                return trContent;
                            }
                            let tr = `<tr>${fillTr()}</tr>`
                            table += tr;
                        }
                    }
                }
            }
            return table;
        }
        return `
            <table class="table analytics">
                <tr>
                    <th>Товар</th>
                    <th width="270">Клиент</th>
                    <th>Объем</th>
                    <th>Цена</th>
                    <th>Доставка</th>
                    <th>Привет</th>
                    <th>Себестоимость</th>
                    <th>Закупочная цена</th>
                    <th>Заработали</th>
                    <th>Прибыль</th>
                </tr>
                ${fillTable()}
            </table>
        `
    }
    // Сводный по объёмам
    function analyticsFilterTable_1() {
        let account_data;
        let stocks;
        $.ajax({
            url: '/getStockTable',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                stocks = JSON.parse(data);
            }
        });
        let all_items = [];
        for (let i = 0; i < stocks.length; i++) {
            for (let j = 0; j < stocks[i].items.length; j++) {
                all_items.push(stocks[i].items[j]);
            }
        }

        all_items.sort(function(a, b) {
            if (a.Item_id > b.Item_id) return 1;
            if (a.Item_id < b.Item_id) return -1;
            return 0;
        })

        function outputAllItems() {
            let th = '';
            for (let i = 0; i < all_items.length; i++) {
                th += `<th width="70">${all_items[i].Name}</th>`
            }
            return th;
        }
        function fillTable() {
            $.ajax({
                url: '/getAccounts',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    account_data = JSON.parse(data);
                }
            });
            
            let amounts = [];
            for (let i = 0; i < all_items.length; i++) {
                amounts[i] = 0;
            }

            let table = '';
            function fillItemsVolume(account) {
                let volume_one = JSON.parse(account.Item_ids);
                for (let i = 0; i < account_data.length; i++) {
                    let volume_two = JSON.parse(account_data[i].account.Item_ids);
                    if (account.Name === account_data[i].account.Name && account.id !== account_data[i].account.id) {
                        for (let g = 0; g < volume_two.length; g++) {
                            volume_one.push(volume_two[g]);
                        }

                        for (let l = 0; l < volume_one.length - 1; l++) {
                            for (let h = l + 1; h < volume_one.length; h++) {
                                if (volume_one[l].id === volume_one[h].id) {
                                    volume_one[l].volume = +volume_one[l].volume + +volume_one[h].volume;
                                    volume_one.splice(h, 1);
                                    h--;
                                }
                            }
                        }
                        account_data.splice(i, 1);
                        i--;
                    }
                }
                return volume_one;
            }
            for (let i = 0; i < account_data.length; i++) {
                let items_volume = fillItemsVolume(account_data[i].account)
                items_volume.sort(function(a, b) {
                    if (a.id > b.id) return 1;
                    if (a.id < b.id) return -1;
                    return 0;
                })
                table += `
                    <tr>
                        <td>${account_data[i].account.Name}</td>
                        ${fillVolume()}
                    </tr>
                `
                console.log(items_volume);
                function fillVolume() {
                    let td = '';
                    for (let j = 0; j < items_volume.length; j++) {
                        for (let l = 0; l < all_items.length; l++) {
                            if (+all_items[l].Item_id == +items_volume[j].id) {
                                amounts[l] += +items_volume[j].volume;
                                td += `<td id="item_${l + 1}">${items_volume[j].volume}</td>`
                                if (items_volume.length - 1 != j) {
                                    j++;
                                }
                            } else {
                                td += `<td id="item_${l + 1}">0</td>`
                            }
                        }
                    }
                    return td;
                }
            }
            let amount_tr = `<tr>${fillAmountRow()}</tr>`;
            function fillAmountRow() {
                let td = '<td></td>'
                for (let i = 0; i < amounts.length; i++) {
                    td += `<td class="bold">${amounts[i]}</td>`
                }
                return td;
            }
            table += amount_tr;
            return table;
        }
        return `
            <table class="table analytics">
                <tr>
                    <th width="270">Клиент</th>
                    ${outputAllItems()}
                </tr>
                ${fillTable()}
            </table>
        `
    }
    // По клиентам
    function analyticsFilterTable_2() {
        let account_data, delivery_data;
        $.ajax({
            url: '/getAccounts',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                account_data = JSON.parse(data);
            }
        });
        $.ajax({
            url: '/getDeliveries',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                delivery_data = JSON.parse(data);
            }
        });
        let items_list = [];
        for (let i = 0; i < account_data.length; i++) {
            for (let j = 0; j < account_data[i].items.length; j++) {
                items_list.push({ items: [account_data[i].items[j]], account: account_data[i].account })
            }
        }
        for (let i = 0; i < items_list.length - 1; i++) {
            for (let j = i + 1; j < items_list.length; j++) {
                if (items_list[i].account.Name === items_list[j].account.Name && items_list[i].account.id === items_list[j].account.id) {
                    for (let k = 0; k < items_list[j].items.length; k++) {
                        items_list[i].items.push(items_list[j].items[k])
                    }
                    if (items_list[i].account.id !== items_list[j].account.id) {
                        let volume_two = JSON.parse(items_list[j].account.Item_ids);
                        let amount_two = JSON.parse(items_list[j].account.Items_amount);
                        let volume_one = JSON.parse(items_list[i].account.Item_ids);
                        let amount_one = JSON.parse(items_list[i].account.Items_amount);

                        for (let g = 0; g < volume_two.length; g++) {
                            volume_one.push(volume_two[g]);
                            amount_one.push(amount_two[g]);
                        }

                        for (let l = 0; l < volume_one.length - 1; l++) {
                            for (let h = l + 1; h < volume_one.length; h++) {
                                if (volume_one[l].id === volume_one[h].id) {
                                    volume_one[l].volume = +volume_one[l].volume + +volume_one[h].volume;
                                    volume_one.splice(h, 1);
                                    h--;
                                }
                            }
                        }
                        items_list[i].account.Item_ids = JSON.stringify(volume_one);
                        items_list[i].account.Items_amount = JSON.stringify(amount_one);
                    }
                    items_list.splice(j, 1);
                    j--;
                }
            }
        }
        function fillTable() {
            let table = '';
            for (let i = 0; i < items_list.length; i++) {
                for (let j = 0; j < items_list[i].items.length; j++) {
                    let volume = JSON.parse(items_list[i].account.Item_ids);
                    let amounts = JSON.parse(items_list[i].account.Items_amount);
                    for (let v = 0; v < volume.length; v++) {
                        for (let delivery = 0; delivery < delivery_data.length; delivery++) {
                            let deliveries_ids = JSON.parse(delivery_data[delivery].delivery.Item_ids);
                            for (let id = 0; id < deliveries_ids.length; id++) {
                                if (+volume[v].id == +items_list[i].items[j].Item_id
                                    && +items_list[i].items[j].Item_id == +deliveries_ids[id]
                                    && delivery_data[delivery].delivery.Account_id == +items_list[i].account.id) {
                                    function fillTr() {
                                        let trContent = '';
                                        if (j == 0) {
                                            trContent += `<td rowspan="${items_list[i].items.length}">${items_list[i].account.Name}</td>`;
                                        }
                                        trContent += `<td>${items_list[i].items[j].Name}</td>
                                                    <td>${volume[v].volume}</td>
                                                    <td>${delivery_data[delivery].delivery.Start_date != null ? delivery_data[delivery].delivery.Start_date : 'Не указана'}</td>
                                                    <td>${amounts[v].amount}</td>`
                                        return trContent;
                                    }
                                    let tr = `<tr>${fillTr()}</tr>`
                                    table += tr;
                                }
                            }  
                        }      
                    }
                }
            }
            return table;
        }
        return `
            <table class="table analytics">
                <tr>
                    <th width="350">Клиент</th>
                    <th>Товары</th>
                    <th>Вес</th>
                    <th>Дата отгрузки</th>
                    <th>Сумма</th>
                </tr>
                ${fillTable()}
            </table>
        `
    }
    // По приветам
    function analyticsFilterTable_3() {
        function fillTable() {
            let accounts;
            $.ajax({
                url: '/getAccounts',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    accounts = JSON.parse(data);
                }
            });
            let table = '';
            let all_data = [];
            for (let i = 0; i < accounts.length; i++) {
                let items_volume = JSON.parse(accounts[i].account.Item_ids);
                let items_hello = JSON.parse(accounts[i].account.Hello);
                let sum_volume = items_volume.reduce((a, b) => ({volume: +a.volume + +b.volume}));
                let sum_hello_volume = 0, id_client = 0;
                let client_data = categoryInListClient[1][1];

                for (let j = 0; j < client_data.length; j++) {
                    if (client_data[j].Name === accounts[i].account.Name) {
                        id_client = client_data[j].id;
                        break;
                    }
                }

                for (let sum = 0; sum < items_volume.length; sum++) {
                    sum_hello_volume += +items_volume[sum].volume * +items_hello[sum];
                }
                all_data.push({
                    client_id: id_client,
                    name: accounts[i].account.Name,
                    volume: +sum_volume.volume,
                    average_volume: Math.ceil(+sum_hello_volume / +sum_volume.volume),
                    amount_hello: Math.ceil(+sum_hello_volume),
                    amount: Math.round(+accounts[i].account.Sum * 0.9)
                });
            }
            for (let i = 0; i < all_data.length - 1; i++) {
                for (let j = i + 1; j < all_data.length; j++) {
                    if (all_data[i].name === all_data[j].name) {
                        all_data[i].volume += all_data[j].volume;
                        all_data[i].amount_hello += all_data[j].amount_hello;
                        all_data[i].average_volume = Math.ceil(all_data[i].amount_hello / all_data[i].volume);
                        all_data[i].amount = Math.round((all_data[i].amount + all_data[j].amount) * 0.9);
                        all_data.splice(j, 1);
                        j--;
                    }
                }
            }
            for (let i = 0; i < all_data.length; i++) {
                table += `
                    <tr id="client_${all_data[i].client_id}_search" onclick="openCardMenu(this)">
                        <td>${all_data[i].name}</td>
                        <td>${all_data[i].volume}</td>
                        <td>${all_data[i].average_volume}</td>
                        <td>${all_data[i].amount_hello}</td>
                        <td>${all_data[i].amount}</td>
                    </tr>
                `
            }
            return table;
        }
        return `
            <table class="table analytics">
                <tr>
                    <th width="350">Клиент</th>
                    <th>Объём</th>
                    <th>Сколько</th>
                    <th>Сумма</th>
                    <th>Итого</th>
                </tr>
                ${fillTable()}
            </table>
        `
    }
    // Отгрузки менеджеров
    function analyticsFilterTable_4() {
        let stocks, account_data;
        $.ajax({
            url: '/getAccounts',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                account_data = JSON.parse(data);
            }
        });
        $.ajax({
            url: '/getStockTable',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                stocks = JSON.parse(data);
            }
        });
        let all_items = [];
        for (let i = 0; i < stocks.length; i++) {
            for (let j = 0; j < stocks[i].items.length; j++) {
                all_items.push(stocks[i].items[j]);
            }
        }

        all_items.sort(function(a, b) {
            if (a.Item_id > b.Item_id) return 1;
            if (a.Item_id < b.Item_id) return -1;
            return 0;
        })

        let amounts = [], all_amounts = 0;
        for (let i = 0; i < all_items.length; i++) {
            amounts[i] = 0;
        }
        function fillItemsAmount(account) {
            let account_data_copy = account_data.slice();
            let amount = JSON.parse(account.Items_amount);
            for (let i = 0; i < account_data_copy.length; i++) {
                let amount_two = JSON.parse(account_data_copy[i].account.Items_amount);
                if (account.Manager_id == account_data_copy[i].account.Manager_id && account.id != account_data_copy[i].account.id) {
                    for (let g = 0; g < amount_two.length; g++) {
                        amount.push(amount_two[g]);
                    }

                    for (let l = 0; l < amount.length - 1; l++) {
                        for (let h = l + 1; h < amount.length; h++) {
                            if (amount[l].id === amount[h].id) {
                                amount[l].amount = +amount[l].amount + +amount[h].amount;
                                amount.splice(h, 1);
                                h--;
                            }
                        }
                    }
                    account_data_copy.splice(i, 1);
                    i--;
                }
            }
            return amount;
        }
        function fillItemsVolume(account) {
            let account_data_copy = account_data.slice();
            let volume_one = JSON.parse(account.Item_ids);
            for (let i = 0; i < account_data_copy.length; i++) {
                let volume_two = JSON.parse(account_data_copy[i].account.Item_ids);
                if (account.Manager_id == account_data_copy[i].account.Manager_id && account.id != account_data_copy[i].account.id) {
                    for (let g = 0; g < volume_two.length; g++) {
                        volume_one.push(volume_two[g]);
                    }

                    for (let l = 0; l < volume_one.length - 1; l++) {
                        for (let h = l + 1; h < volume_one.length; h++) {
                            if (volume_one[l].id === volume_one[h].id) {
                                volume_one[l].volume = +volume_one[l].volume + +volume_one[h].volume;
                                volume_one.splice(h, 1);
                                h--;
                            }
                        }
                    }
                    account_data_copy.splice(i, 1);
                    i--;
                }
            }
            return volume_one;
        }

        function outputAllItems() {
            let th = '';
            for (let i = 0; i < all_items.length; i++) {
                th += `<th width="70">${all_items[i].Name}</th>`
            }
            return th;
        }

        function fillTable() {
            let users;
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    users = JSON.parse(data);
                }
            });
            let managers = [];

            for (let i = 0; i < users.length; i++) {
                if (users[i].role === 'manager') {
                    managers.push(users[i]);
                } 
            }
            
            function fillItemsInfo(manager) {
                let td = '';
                for (let i = 0; i < account_data.length; i++) {
                    if (account_data[i].account.Manager_id == manager) {
                        let items_volume = fillItemsVolume(account_data[i].account)
                        let items_amount = fillItemsAmount(account_data[i].account);
                        items_volume.sort(function(a, b) {
                            if (a.id > b.id) return 1;
                            if (a.id < b.id) return -1;
                            return 0;
                        })
                        items_amount.sort(function(a, b) {
                            if (a.id > b.id) return 1;
                            if (a.id < b.id) return -1;
                            return 0;
                        })
                        let general_amount = 0;

                        for (let element = 0; element < items_amount.length; element++) {
                            general_amount += Math.round(+items_amount[element].amount);
                        }
                        all_amounts += general_amount;
                        td += `<td>${general_amount}</td>`
                        for (let j = 0; j < items_volume.length; j++) {
                            for (let k = 0; k < all_items.length; k++) {
                                if (+all_items[k].Item_id == +items_volume[j].id) {
                                    amounts[k] += +items_volume[j].volume;
                                    td += `<td id="item_${k + 1}">${items_volume[j].volume}</td>`
                                    if (items_volume.length - 1 != j) {
                                        j++;
                                    }
                                } else {
                                    td += `<td id="item_${k + 1}">0</td>`
                                }
                            }
                        }
                        break;
                    }
                }
                return td;
            }
            function checkManager(manager) {
                for (let i = 0; i < account_data.length; i++) {
                    if (account_data[i].account.Manager_id == manager) {
                        return fillItemsInfo(manager);
                    }
                }
                return `<td>0</td><td>0</td><td>0</td><td>0</td>`;
            }
            let table = '';
            for (let i = 0; i < managers.length; i++) {
                table += `
                    <tr>
                        <td>${managers[i].second_name}</td>
                        ${checkManager(managers[i].id)}
                    </tr>
                `
            }
            let amount_tr = `<tr>${fillAmountRow()}</tr>`;
            function fillAmountRow() {
                let td = `<td></td><td>${all_amounts}</td>`
                for (let i = 0; i < amounts.length; i++) {
                    td += `<td class="bold">${amounts[i]}</td>`
                }
                return td;
            }
            table += amount_tr;
            return table;
        }
        return `
            <table class="table analytics">
                <tr>
                    <th width="170">Менеджер</th>
                    <th width="130">Итого</th>
                    ${outputAllItems()}
                </tr>
                ${fillTable()}
            </table>
        `
    }