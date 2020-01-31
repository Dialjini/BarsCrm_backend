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
            manager: {status: false, filter: null, last: null},
            customer: {status: false, filter: null, last: null},
            date: {status: false, filter: null, last: null},
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
        let this_user;
        $.ajax({
            url: '/getThisUser',
            type: 'GET',
            async: false,
            dataType: 'html',
            beforeSend: function() {
                $('body').append(`
                    <div id="preloader">
                        <div id="preloader_preload"></div>
                    </div>
                `)
                preloader = document.getElementById("preloader_preload");
            },
            success: function(user) {
                this_user = JSON.parse(user);
            },
            complete: function() {
                setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
            }
        })
        const list = [
            { width: 161.125, id: 'stock_group', list: [] },
            { width: 90.656, id: 'stock_product', list: [] },
            { width: 220, id: 'analytics_reports', list: this_user.role == 'admin' ? ['Прибыль по клиентам', 'Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров', 'Проделанная работа'] : ['Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров']},
        ]

        let idList = this.id, element;
        let filter_table = categoryInStock[1][1];
        let info = ['Group_name', 'Name'];

        if (!idList.includes('analytics')) {
            if (!$('.report_list').is(`#${idList}`)) {
                for (let k = 0; k < info.length; k++) {
                    for (let i = 0; i < filter_table.length; i++) {
                        for (let j = 0; j < filter_table[i].items.length; j++) {
                            list[k].list.push(filter_table[i].items[j][info[k]])
                        }
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
                    if (this_user.role == 'admin') {
                        for (let j = 0; j < list[i].list.length; j++) {
                            ul.append(
                                `<li id="${idList}_${j}">${list[i].list[j]}</li>`
                            )
                        }
                    } else {
                        if (idList == 'analytics_reports') {
                            for (let j = 0; j < list[i].list.length; j++) {
                                ul.append(
                                    `<li id="${idList}_${j + 1}">${list[i].list[j]}</li>`
                                )
                            }
                        } else {
                            for (let j = 0; j < list[i].list.length; j++) {
                                ul.append(
                                    `<li id="${idList}_${j}">${list[i].list[j]}</li>`
                                )
                            }
                        }
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
                        $(`#${idList}`).width(+width + 20);
                        for (let j = 0; j < $(`#${idList} .report_list`).children()[0].children.length; j++) {
                            $(`#${idList} .report_list`).children()[0].children[j].style.width = +width + 20 + 'px';
                        }
                    } else {
                        $(`#${idList}`).width(list[i].width);
                        $(`#${idList} .report_list`).width(list[i].width);
                        for (let j = 0; j < $(`#${idList} .report_list`).children()[0].children.length; j++) {
                            $(`#${idList} .report_list`).children()[0].children[j].style.width = list[i].width + 'px';
                        }
                    }
                }
            }
        }

        $('.report_list').fadeIn(400);
        $(`#${idList} .field_with_modal`).addClass('active');
        $(`#${idList} .drop_down_img`).addClass('drop_active');

        $('li').click(function() {
            $('#not_found').remove();
            let this_id = this.id;

            $('table').remove();
            $(`#${idList}`).width('auto');
            $(`#${idList} #active_field`).html(identify());
            function identify() {
                if (this_user.role == 'admin') return namesList[this_id.split('_')[2]]
                if (this_user.role == 'manager') return namesList[+this_id.split('_')[2] - 1]
            }
            $(`#${idList} .field_with_modal`).addClass('active');

            let createFilterTable = () => {
                if (idList.includes('analytics_reports')) {
                    let functions = [
                        analyticsFilterTable_0,
                        analyticsFilterTable_1,
                        analyticsFilterTable_2,
                        analyticsFilterTable_3,
                        analyticsFilterTable_4,
                        analyticsFilterTable_5,
                    ]
                    $('#analytics_block_hidden').remove();
                    $('[name="unload_table"]').remove();
                    $('#info_in_accounts').remove();
                    return functions[this_id.split('_')[2]](datePeriod('month'));
                } else {
                    $('.centerBlock .header .cancel').remove();
                    $('.centerBlock .header').append(`
                        <div class="cancel">
                            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
                        </div>
                    `)

                    const filter_ids = [
                        { id: 'stock_group', filterName: 'Group_name', name: 'Группа товаров'},
                        { id: 'stock_product', filterName: 'Name', name: 'Товар'},
                    ]

                    for (let i = 0; i < filter_ids.length; i++) {
                        if ($(`#${filter_ids[i].id}`).children().children()[0].innerHTML != filter_ids[i].name) {
                            for (let j = 0; j < filter_parameters.length; j++) {
                                if (filter_parameters[j].name == filter_ids[i].filterName) {
                                    filter_parameters[j].filter = $(`#${filter_ids[i].id}`).children().children()[0].innerHTML;
                                }
                            }
                        }
                    }
                    categoryInFilterStock[1][1] = [];
                    let items = []
                    for (let i = 0; i < filter_table.length; i++) {
                        for (let k = 0; k < filter_table[i].items.length; k++) {
                            if ((filter_table[i].items[k][filter_parameters[0].name] == filter_parameters[0].filter || filter_parameters[0].filter == '')
                                && (filter_table[i].items[k][filter_parameters[1].name] == filter_parameters[1].filter || filter_parameters[1].filter == '')) {
                                items.push({ stock_address: filter_table[i].stock_address, items: [filter_table[i].items[k]]});
                            }
                        }
                    }
                    for (let i = 0; i < items.length - 1; i++) {
                        for (let j = i + 1; j < items.length; j++) {
                            if (items[i].stock_address === items[j].stock_address) {
                                for (let k = 0; k < items[j].items.length; k++) {
                                    items[i].items.push(items[j].items[k]);
                                }
                                items.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    categoryInFilterStock[1][1] = items;
                    return fillingTables(categoryInFilterStock);         
                }
            };

            $('.info').append(createFilterTable());
            if (categoryInFilterStock[1][1].length == 0 && !idList.includes('analytics')) {
                $('.info').append(`
                    <div id="not_found" class="row">
                        <span style="margin-left: 10px; margin-top: -20px;">Ничего не найдено</span>
                    </div>
                `)
            }
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
        manager: {status: false, filter: null, last: null},
        customer: {status: false, filter: null, last: null},
        date: {status: false, filter: null, last: null},
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
    $('#addNewPerson').remove();
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
                        <div class="card_menu" id="card_menu">
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
                                                <input type="text" value="${data[i].second_name}" id="edit_surname">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Имя</td>
                                            <td>
                                                <input type="name" value="${data[i].name}" id="edit_name">
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
                                                <input type="login" value="${data[i].login}" id="edit_login">
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
                    data['create_first_name'] = $('#edit_name').val();
                    data['create_last_name'] = $('#edit_surname').val();
                    data['create_patronymic'] = $('#edit_patronymic').val();
                    data['create_email'] = $('#edit_email').val();
                    data['create_login'] = $('#edit_login').val();
                    data['create_role'] = $('#edit_role').val();
                    data['create_password'] = $('#edit_password').val();
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
function persons() {
    adminPanel();
}
function items() {
    $('._block').remove();
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        beforeSend: function() {
            $('body').append(`
                <div id="preloader">
                    <div id="preloader_preload"></div>
                </div>
            `)
            preloader = document.getElementById("preloader_preload");
        },
        success: function(data) {
            data = JSON.parse(data);
            function getTable() {
                let table = $('<table>', { class: 'table' });
                table.append(getTitleTable());
                function getTitleTable() {
                    let current_table = categoryInStock[1][0];
                    let element = $('<tr>');
                    for (let i = 0; i < current_table.length; i++) {
                        element.append(`<th width="${current_table[i].width}%">${current_table[i].name}</th>`)
                    }
                    return element;
                }
                for (let i = data.length - 1; i >= 0; i--) {
                    for (let k = data[i].items.length - 1; k >= 0; k--) {
                        if (data[i].stock_address != null) {
                            let element = $('<tr>', {id: `stock_${data[i].items[k].Item_id}`, onclick: 'editItem(this.id)'});
                            const name = [data[i].items[k].Prefix, data[i].items[k].Group_name, data[i].items[k].Name, data[i].items[k].Weight, data[i].items[k].Packing, data[i].items[k].Volume, data[i].items[k].Cost, data[i].items[k].NDS, data[i].stock_address];
            
                            for (let j = 0; j < name.length; j++) {
                                let elementTr = $('<td>', { html: name[j] });
                                element.append(elementTr);
                            }
                            table.append(element);
                        }
                    }
                }
                return table;
            }
            $('.table').remove();
            $('#addNewPerson').remove();
            activeThisField('items');
            $('.info').append(getTable())
        },
        complete: function() {
            $('#loading').remove();
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        }
    });
}
function positions() {
    $('._block').remove();
    $.ajax({
        url: '/getRoles',
        type: 'GET',
        dataType: 'html',
        beforeSend: function() {
            $('body').append(`
                <div id="preloader">
                    <div id="preloader_preload"></div>
                </div>
            `)
            preloader = document.getElementById("preloader_preload");
        },
        success: function(data) {
            data = JSON.parse(data);
            function getTable() {
                let list_position = $('<div>', { class: '_block' });
                for (let i = 0; i < data.length; i++) {
                    list_position.append(`<div class="block_ flex"><span>${data[i].Name}</span></div>`)
                }
                list_position.append(`
                    <div class="block_ flex block_add">
                        <input placeholder="Введите должность" class="format" type="text" id="new_position">
                        <button class="btn btn-main" style="height: 25px; font-size: 11px" onclick="addNewPosition_Save()">Добавить</button>
                    </div>
                `)
                return list_position;
            }
            $('.table').remove();
            $('#addNewPerson').remove();
            activeThisField('positions');
            $('.info').append(getTable())
        },
        complete: function() {
            $('#loading').remove();
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        }
    });
}
function activeThisField(field) {
    const fields = ['persons', 'positions', 'items'];
    for (let i = 0; i < fields.length; i++) {
        $(`#${fields[i]}`).removeClass('active');
        if (fields[i] == field) {
            $(`#${field}`).addClass('active');
        }
    }
}
function adminPanel(close = '') {
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            if (data.role == 'admin') {
                admin();
                function admin() {
                    $('.info').empty();
                    $('[name="linkCategory"]').removeClass('active');
                    $('#mini_logo').addClass('active');

                    function fillingTable() {
                        $.ajax({
                            url: '/getUsers',
                            type: 'GET',
                            dataType: 'html',
                            beforeSend: function() {
                                $('body').append(`
                                    <div id="preloader">
                                        <div id="preloader_preload"></div>
                                    </div>
                                `)
                                preloader = document.getElementById("preloader_preload");
                            },
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
                                $('.info').append(`
                                    <div id="addNewPerson" onclick="addNewPerson()" class="add_something_main" style="margin-top: -20px;">
                                        <img style="width: 15px;" src="static/images/plus.svg">
                                    <div>
                                `)
                                if (close != '') {
                                    eval(close)();
                                }
                            },
                            complete: function() {
                                $('#loading').remove();
                                setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                            }
                        });
                    }
                    getContent();
                    function getContent() {
                        $('.info').append(`
                            <div class="row">
                                <div class="fields" style="width: auto">
                                    <div class="field active" id="persons" onclick="persons()">Сотрудники</div>
                                    <div class="field" id="positions" onclick="positions()">Должности</div>
                                    <div class="field" id="items" onclick="items()">Редактирование товаров</div>
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
                }
            }
            return;
        }
    });
}
function addNewPerson() {
    $('#addNewPerson').remove();
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
}
function closeThisMenu(id) {
    adminPanel(id);
}
function editItem(id) {
    let count = id.split('_')[1];
    $.ajax({
        url: '/getThisItem',
        data: {id: count},
        type: 'GET',
        dataType: 'html',
        beforeSend: function() {
            $('body').append(`
                <div id="preloader">
                    <div id="preloader_preload"></div>
                </div>
            `)
            preloader = document.getElementById("preloader_preload");
        },
        success: function(data) {
            data = JSON.parse(data)[0];
            $('.table').remove();
            function fillListStock() {
                let info;
                $.ajax({
                    url: '/getStocks',
                    type: 'GET',
                    async: false,
                    dataType: 'html',
                    success: function(data) {
                        info = JSON.parse(data);
                    }
                });
                let options = '';
                options += `<option value="0">Не выбран</option>`
                for (let i = 0; i < info.length; i++) {
                    if (info[i].id == data.Stock_id) {
                        options += `<option selected value="${info[i].id}">${info[i].Name}</option>`
                    } else {
                        options += `<option value="${info[i].id}">${info[i].Name}</option>`
                    }
                }
                return options;
            }
            function fillListGroup() {
                let info;
                $.ajax({
                    url: '/getItemGroup',
                    type: 'GET',
                    async: false,
                    dataType: 'html',
                    success: function(data) {
                        info = JSON.parse(data);
                    }
                });
                let options = '';
                for (let i = 0; i < info.length; i++) {
                    if (info[i].id == data.Group_id) {
                        options += `<option selected value="${info[i].id}">${info[i].Group}</option>`
                    } else {
                        options += `<option value="${info[i].id}">${info[i].Group}</option>`
                    }
                }
                setTimeout(function() { fadeOutPreloader(preloader) }, 0);
                return options;
            }
            function fillListPrefix() {
                if (data.Prefix == 'ООО') {
                    return `
                        <option selected value="ООО">ООО</option>
                        <option value="ИП">ИП</option>
                    `
                } else {
                    return `
                        <option value="ООО">ООО</option>
                        <option selected value="ИП">ИП</option>
                    `
                }
            }

            $('.info').append(`
                <div class="card_menu">
                    <div class="title">
                        <div class="left_side">
                            <span>Изменение данных по товару</span>
                        </div>
                        <div class="right_side">
                            <div class="close" id="items" onclick="closeThisMenu(this.id)">
                                <img src="static/images/cancel.png">
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="row_card">
                            <table class="table_block">
                                <tr>
                                    <td>Склад</td>
                                    <td>
                                        <select type="text" id="stock_id">${fillListStock()}</select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Группа товаров</td>
                                    <td>
                                        <select type="text" id="group_id">${fillListGroup()}</select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Товар</td>
                                    <td><input type="text" id="item_product" class="string" value="${data.Name}"></td>
                                </tr>
                            </table>
                            <table class="table_block">
                                <tr>
                                    <td>Объем, кг.</td>
                                    <td><input onkeyup="maskNumber(this.id)" type="text" id="item_volume" class="string" value="${data.Volume}"></td>
                                </tr>
                                <tr>
                                    <td>Упаковка</td>
                                    <td><input type="text" id="item_packing" class="string" value="${data.Packing}"></td>
                                </tr>
                                <tr>
                                    <td>Вес, кг.</td>
                                    <td><input onkeyup="maskNumber(this.id)" type="text" id="item_weight" class="string" value="${data.Weight}"></td>
                                </tr>
                            </table>
                            <table class="table_block">
                                <tr>
                                    <td>Юр. лицо</td>
                                    <td>
                                        <select type="text" id="item_prefix">
                                            ${fillListPrefix()}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>НДС</td>
                                    <td><input maxlength="12" type="number" id="item_vat" class="string" value="${data.NDS}"></td>
                                </tr>
                                <tr>
                                    <td>Цена прайса, руб.</td>
                                    <td><input onkeyup="maskNumber(this.id)" type="text" id="item_price" class="string" value="${data.Cost}"></td>
                                </tr>
                                <tr>
                                    <td>Закупочная цена, руб.</td>
                                    <td><input onkeyup="maskNumber(this.id)" type="text" id="item_purchase_price" class="string" value="${data.Purchase_price}"></td>
                                </tr>
                            </table> 
                        </div>
                        <div class="next">
                            <button class="btn btn-main" id="item_${data.Item_id}" onclick="saveEditItem(this.id)">Изменить товар</button>
                        </div>
                    </div>
                </div>
            `);
        },
        complete: function() {
            $('#loading').remove();
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        }
    })
}
function saveEditItem(id) {
    let item_id = id.split('_')[1];
    let list = ['stock_id', 'group_id', 'item_product', 'item_prefix', 'item_volume', 'item_packing', 'item_weight', 'item_vat', 'item_price', 'item_purchase_price'];
    let data = {};

    for (let i = 0; i < list.length; i++) {
        data[list[i]] = $(`#${list[i]}`).val();
    }
    data['item_fraction'] = 'test';
    data['item_creator'] = 'test';
    data['id'] = item_id;
    $.ajax({
        url: '/editItem',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function() {
            closeThisMenu('items');
        }
    });
}
function addNewPosition_Save() {
    let value = $('#new_position').val().trim();
    let priority = 0;
    if (value != '') {
        $.ajax({
            url: '/addRole',
            data: { name: value, priority: priority },
            type: 'GET',
            dataType: 'html',
            success: function() {
                positions();
            }
        }); 
    } else {
        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px;">Введите должность!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
    } 
}
function createNewMember() {
    let ids = ['create_last_name', 'create_first_name', 'create_patronymic', 'create_role', 'create_password', 'create_login', 'create_email'];
    let data = {};

    for (let i = 0; i < ids.length; i++) {
        data[ids[i]] = $(`#${ids[i]}`).val();
        if ($(`#${ids[i]}`).val() == '' && ids[i] != 'create_email' && ids[i] != 'create_patronymic' || $(`#${ids[i]}`).val() == null) {
            return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px;">Все поля, кроме почты и отчества, обязательны к заполнению!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
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
function getValidationDate(date) {
    let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)/;
    let date_arr = datetime_regex.exec(date);
    let datetime = new Date('20' + +date_arr[3] - 1, date_arr[2], date_arr[1]);
    return datetime;
}
// Отчеты
    // Прибыль по клиентам
    function analyticsFilterTable_0(date_period, unload_status = false) {
        let account_data;
        $.ajax({
            url: '/getAccounts',
            type: 'GET',
            async: false,
            dataType: 'html',
            beforeSend: function() {
                $('body').prepend(`
                    <div id="preloader">
                        <div id="preloader_preload"></div>
                    </div>
                `)
                preloader = document.getElementById("preloader_preload");
            },
            success: function(data) {
                account_data = JSON.parse(data);
            },
            complete: function() {
                setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
            }
        });
        let items_list = [];
        for (let i = 0; i < account_data.length; i++) {
            let date_create_account = getValidationDate(account_data[i].account.Date);
            if (date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                for (let j = 0; j < account_data[i].items.length; j++) {
                    items_list.push({ item: account_data[i].items[j], account: [account_data[i].account] })
                }
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
        function fillTable() {
            let table = '';
            let total_count = 0;
            let unload_table = [];
            for (let i = 0; i < items_list.length; i++) {
                for (let j = 0; j < items_list[i].account.length; j++) {
                    let volume = JSON.parse(items_list[i].account[j].Item_ids);
                    let delivery = JSON.parse(items_list[i].account[j].Shipping);
                    let hello = JSON.parse(items_list[i].account[j].Hello);
                    for (let v = 0; v < volume.length; v++) {
                        if (+volume[v].id == +items_list[i].item.Item_id) {
                            let price = deleteSpaces(+delivery[v]) + deleteSpaces(+hello[v]) + (+deleteSpaces(items_list[i].item.Transferred_volume) * +deleteSpaces(items_list[i].item.Cost));
                            if (!unload_status) {
                                function fillTr() {
                                    let trContent = '';
                                    if (j == 0) {
                                        trContent += `<td rowspan="${items_list[i].account.length}">${items_list[i].item.Name}</td>`;
                                    }
                                    trContent += `<td>${items_list[i].account[j].Name}</td>
                                                <td>${returnSpaces(volume[v].volume)}</td>
                                                <td>${returnSpaces(price)}</td>
                                                <td>${returnSpaces(delivery[v])}</td>
                                                <td>${returnSpaces(hello[v])}</td>
                                                <td>${returnSpaces(items_list[i].item.Cost)}</td>
                                                <td>${returnSpaces(items_list[i].item.Purchase_price)}</td>
                                                <td>${returnSpaces(Math.round(+deleteSpaces(items_list[i].item.Cost) / +deleteSpaces(items_list[i].item.Volume)) - +deleteSpaces(items_list[i].item.Purchase_price))}</td>
                                                <td>${returnSpaces((Math.round(+deleteSpaces(items_list[i].item.Cost) / +deleteSpaces(items_list[i].item.Volume)) - +deleteSpaces(items_list[i].item.Purchase_price)) * +volume[v].volume)}</td>`
                                    return trContent;
                                }
                                let tr;
                                if (j == 0) tr = `<tbody class="tr_tr"><tr>${fillTr()}</tr>`
                                else if (j == items_list[i].account.length - 1) tr = `<tr>${fillTr()}</tr></tbody>`
                                else tr = `<tr>${fillTr()}</tr>`
                                table += tr;
                                total_count++;
                            } else {
                                unload_table.push({product: items_list[i].item.Name, name: items_list[i].account[j].Name, volume: returnSpaces(volume[v].volume),
                                    price: returnSpaces(price), delivery: returnSpaces(delivery[v]), hello: returnSpaces(hello[v]), cost: returnSpaces(items_list[i].item.Cost),
                                    purchase_price: returnSpaces(items_list[i].item.Purchase_price), earned: returnSpaces(Math.round(+deleteSpaces(items_list[i].item.Cost) / +deleteSpaces(items_list[i].item.Volume)) - +deleteSpaces(items_list[i].item.Purchase_price)),
                                    profit: returnSpaces((Math.round(+deleteSpaces(items_list[i].item.Cost) / +deleteSpaces(items_list[i].item.Volume)) - +deleteSpaces(items_list[i].item.Purchase_price)) * +volume[v].volume)})
                            }
                        }
                    }
                }
            }
            if (unload_status) {
                return unload_table;
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                            <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                        </div>
                    </div>
                    <div id="analytics_0" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                `)
                $('body').append(`<div id="analytics_block_hidden"></div>`)
            } else {
                $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'счет', 1)}`);
            }
            return table;
        }
        if (unload_status) {
            return fillTable();
        } else {
            return `
            <table class="table analytics">
                <tr>
                    <th>Товар</th>
                    <th width="230">Клиент</th>
                    <th>Объем, кг.</th>
                    <th>Цена, руб.</th>
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
    }
    // Сводный по объёмам
    function analyticsFilterTable_1(date_period, unload_status = false) {
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
                beforeSend: function() {
                    $('body').prepend(`
                        <div id="preloader">
                            <div id="preloader_preload"></div>
                        </div>
                    `)
                    preloader = document.getElementById("preloader_preload");
                },
                complete: function() {
                    setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                },
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
                    let date_create_account = getValidationDate(account_data[i].account.Date);
                    if (account.Name === account_data[i].account.Name && account.id !== account_data[i].account.id
                        && date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                        for (let g = 0; g < volume_two.length; g++) {
                            volume_one.push(volume_two[g]);
                        }

                        for (let l = 0; l < volume_one.length - 1; l++) {
                            for (let h = l + 1; h < volume_one.length; h++) {
                                if (volume_one[l].id === volume_one[h].id) {
                                    volume_one[l].volume = deleteSpaces(+volume_one[l].volume) + deleteSpaces(+volume_one[h].volume);
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
            let total_count = 0;
            let unload_table = [];
            for (let i = 0; i < account_data.length; i++) {
                let date_create_account = getValidationDate(account_data[i].account.Date);
                if (date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                    let items_volume = fillItemsVolume(account_data[i].account)
                    items_volume.sort(function(a, b) {
                        if (a.id > b.id) return 1;
                        if (a.id < b.id) return -1;
                        return 0;
                    })
                    if (!unload_status) {
                        table += `
                            <tr>
                                <td>${account_data[i].account.Name}</td>
                                ${fillVolume()}
                            </tr>
                        `
                        function fillVolume() {
                            let td = '';
                            for (let j = 0; j < items_volume.length; j++) {
                                for (let l = 0; l < all_items.length; l++) {
                                    if (+all_items[l].Item_id == +items_volume[j].id) {
                                        amounts[l] += deleteSpaces(+items_volume[j].volume);
                                        td += `<td id="item_${l + 1}">${returnSpaces(items_volume[j].volume)}</td>`
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
                        total_count++;
                    } else {
                        for (let j = 0; j < items_volume.length; j++) {
                            for (let l = 0; l < all_items.length; l++) {
                                let create_status = 0;
                                for (let element = 0; element < unload_table.length; element++) {
                                    if (unload_table[element].name == account_data[i].account.Name) {
                                        create_status++;
                                    }
                                }
                                if (create_status == 0) unload_table.push({name: account_data[i].account.Name, list: []});
                                
                                if (+all_items[l].Item_id == +items_volume[j].id) {
                                    for (let g = 0; g < unload_table.length; g++) {
                                        if (account_data[i].account.Name == unload_table[g].name) {
                                            unload_table[g].list.push({id: +items_volume[j].id, volume: returnSpaces(items_volume[j].volume)})
                                        }
                                    }
                                    if (items_volume.length - 1 != j) {
                                        j++;
                                    }
                                } else {
                                    for (let g = 0; g < unload_table.length; g++) {
                                        if (account_data[i].account.Name == unload_table[g].name) {
                                            unload_table[g].list.push({id: +items_volume[j].id, volume: '0'})
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (unload_status) {
                console.log(unload_table);
                return unload_table;
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                            <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                        </div>
                    </div>
                    <div id="analytics_1" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                `)
                $('body').append(`<div id="analytics_block_hidden"></div>`)
            } else {
                $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'счет', 1)}`);
            }
            let amount_tr = `<tr>${fillAmountRow()}</tr>`;
            function fillAmountRow() {
                let td = '<td></td>'
                for (let i = 0; i < amounts.length; i++) {
                    td += `<td class="bold">${returnSpaces(amounts[i])}</td>`
                }
                return td;
            }
            table += amount_tr;
            return table;
        }
        if (unload_status) {
            return fillTable();
        } else {
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
    }
    // По клиентам
    function analyticsFilterTable_2(date_period, unload_status = false) {
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
            beforeSend: function() {
                $('body').prepend(`
                    <div id="preloader">
                        <div id="preloader_preload"></div>
                    </div>
                `)
                preloader = document.getElementById("preloader_preload");
            },
            complete: function() {
                setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
            },
            success: function(data) {
                delivery_data = JSON.parse(data);
            }
        });
        let items_list = [];
        let total_count = 0;
        for (let i = 0; i < account_data.length; i++) {
            let date_create_account = getValidationDate(account_data[i].account.Date);
            if (date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                for (let j = 0; j < account_data[i].items.length; j++) {
                    items_list.push({ items: [account_data[i].items[j]], account: account_data[i].account })
                }
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
                                    volume_one[l].volume = deleteSpaces(+volume_one[l].volume) + deleteSpaces(+volume_one[h].volume);
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
            let unload_table = [];
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
                                    if (!unload_status) {
                                        function fillTr() {
                                            let trContent = '';
                                            if (j == 0) {
                                                trContent += `<td rowspan="${items_list[i].items.length}">${items_list[i].account.Name}</td>`;
                                            }
                                            trContent += `<td>${items_list[i].items[j].Name}</td>
                                                        <td>${returnSpaces(volume[v].volume)}</td>
                                                        <td>${delivery_data[delivery].delivery.Start_date != null || delivery_data[delivery].delivery.Start_date != '' ? delivery_data[delivery].delivery.Start_date : 'Не указана'}</td>
                                                        <td>${returnSpaces(amounts[v].amount)}</td>`
                                            return trContent;
                                        }
                                        let tr = `<tr>${fillTr()}</tr>`
                                        table += tr;
                                        total_count++;
                                    } else {
                                        unload_table.push({ name: items_list[i].account.Name, product: items_list[i].items[j].Name, volume: returnSpaces(volume[v].volume),
                                            start_date: delivery_data[delivery].delivery.Start_date != null || delivery_data[delivery].delivery.Start_date != '' ? delivery_data[delivery].delivery.Start_date : 'Не указана',
                                            amount: returnSpaces(amounts[v].amount)})
                                    }
                                }
                            }  
                        }      
                    }
                }
            }
            if (unload_status) {
                return unload_table;
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                            <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                        </div>
                    </div>
                    <div id="analytics_2" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                `)
                $('body').append(`<div id="analytics_block_hidden"></div>`)
            } else {
                $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'счет', 1)}`);
            }
            return table;
        }
        if (unload_status) {
            return fillTable();
        } else {
            return `
                <table class="table analytics">
                    <tr>
                        <th width="350">Клиент</th>
                        <th>Товары</th>
                        <th>Вес</th>
                        <th>Дата отгрузки</th>
                        <th>Сумма, руб.</th>
                    </tr>
                    ${fillTable()}
                </table>
            `
        }
    }
    // По приветам
    function analyticsFilterTable_3(date_period, unload_status = false) {
        function fillTable() {
            let accounts;
            $.ajax({
                url: '/getAccounts',
                type: 'GET',
                async: false,
                dataType: 'html',
                beforeSend: function() {
                    $('body').prepend(`
                        <div id="preloader">
                            <div id="preloader_preload"></div>
                        </div>
                    `)
                    preloader = document.getElementById("preloader_preload");
                },
                complete: function() {
                    setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                },
                success: function(data) {
                    accounts = JSON.parse(data);
                }
            });
            let table = '';
            let all_data = [], unload_table = [];
            let total_count = 0;
            for (let i = 0; i < accounts.length; i++) {
                let date_create_account = getValidationDate(accounts[i].account.Date);
                if (date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                    let items_volume = JSON.parse(accounts[i].account.Item_ids);
                    let items_hello = JSON.parse(accounts[i].account.Hello);
                    let sum_volume = items_volume.reduce((a, b) => ({volume: +deleteSpaces(a.volume) + +deleteSpaces(b.volume)}));
                    let sum_hello_volume = 0, id_client = 0;
                    let client_data = categoryInListClient[1][1];

                    for (let j = 0; j < client_data.length; j++) {
                        if (client_data[j].Name === accounts[i].account.Name) {
                            id_client = client_data[j].id;
                            break;
                        }
                    }

                    for (let sum = 0; sum < items_volume.length; sum++) {
                        sum_hello_volume += +deleteSpaces(items_volume[sum].volume) * +deleteSpaces(items_hello[sum]);
                    }
                    all_data.push({
                        client_id: id_client,
                        name: accounts[i].account.Name,
                        volume: +sum_volume.volume,
                        average_volume: Math.ceil(+sum_hello_volume / +sum_volume.volume),
                        amount_hello: Math.ceil(+sum_hello_volume),
                        amount: Math.round(+deleteSpaces(accounts[i].account.Sum) * 0.9)
                    });
                    total_count++;
                }
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                            <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                        </div>
                    </div>
                    <div id="analytics_3" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                `)
                $('body').append(`<div id="analytics_block_hidden"></div>`)
            } else {
                $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'счет', 1)}`);
            }
            for (let i = 0; i < all_data.length - 1; i++) {
                for (let j = i + 1; j < all_data.length; j++) {
                    if (all_data[i].name === all_data[j].name) {
                        all_data[i].volume = +deleteSpaces(all_data[i].volume) + +deleteSpaces(all_data[j].volume);
                        all_data[i].amount_hello = +deleteSpaces(all_data[i].amount_hello) + +deleteSpaces(all_data[j].amount_hello);
                        all_data[i].average_volume = Math.ceil(+deleteSpaces(all_data[i].amount_hello) / +deleteSpaces(all_data[i].volume));
                        all_data[i].amount = Math.round((+deleteSpaces(all_data[i].amount) + +deleteSpaces(all_data[j].amount)) * 0.9);
                        all_data.splice(j, 1);
                        j--;
                    }
                }
            }
            for (let i = 0; i < all_data.length; i++) {
                if (!unload_status) {
                    table += `
                        <tr id="client_${all_data[i].client_id}_search" onclick="openCardMenu(this)">
                            <td>${all_data[i].name}</td>
                            <td>${returnSpaces(all_data[i].volume)}</td>
                            <td>${returnSpaces(all_data[i].average_volume)}</td>
                            <td>${returnSpaces(all_data[i].amount_hello)}</td>
                            <td>${returnSpaces(all_data[i].amount)}</td>
                        </tr>
                    `
                } else {
                    unload_table.push({ name: all_data[i].name, volume: returnSpaces(all_data[i].volume),
                        average_volume: returnSpaces(all_data[i].average_volume), hello: returnSpaces(all_data[i].amount_hello), amount: returnSpaces(all_data[i].amount)});
                }
            }
            if (unload_status) {
                return unload_table;
            }
            return table;
        }
        if (unload_status) {
            return fillTable();
        } else {
            return `
                <table class="table analytics">
                    <tr>
                        <th width="350">Клиент</th>
                        <th>Объём</th>
                        <th>Сколько</th>
                        <th>Сумма, руб.</th>
                        <th>Итого</th>
                    </tr>
                    ${fillTable()}
                </table>
            `
        }
    }
    // Отгрузки менеджеров
    function analyticsFilterTable_4(date_period, unload_status = false) {
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
            beforeSend: function() {
                $('body').prepend(`
                    <div id="preloader">
                        <div id="preloader_preload"></div>
                    </div>
                `)
                preloader = document.getElementById("preloader_preload");
            },
            complete: function() {
                setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
            },
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
                let date_create_account = getValidationDate(account_data_copy[i].account.Date);
                if (account.Manager_id == account_data_copy[i].account.Manager_id && account.id != account_data_copy[i].account.id
                    && date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                    for (let g = 0; g < amount_two.length; g++) {
                        amount.push(amount_two[g]);
                    }

                    for (let l = 0; l < amount.length - 1; l++) {
                        for (let h = l + 1; h < amount.length; h++) {
                            if (amount[l].id === amount[h].id) {
                                amount[l].amount = deleteSpaces(+amount[l].amount) + deleteSpaces(+amount[h].amount);
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
                let date_create_account = getValidationDate(account_data_copy[i].account.Date);
                if (account.Manager_id == account_data_copy[i].account.Manager_id && account.id != account_data_copy[i].account.id
                    && date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                    for (let g = 0; g < volume_two.length; g++) {
                        volume_one.push(volume_two[g]);
                    }

                    for (let l = 0; l < volume_one.length - 1; l++) {
                        for (let h = l + 1; h < volume_one.length; h++) {
                            if (volume_one[l].id === volume_one[h].id) {
                                volume_one[l].volume = deleteSpaces(+volume_one[l].volume) + deleteSpaces(+volume_one[h].volume);
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
                th += `<th width="150">${all_items[i].Name}</th>`
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
                    let date_create_account = getValidationDate(account_data[i].account.Date);
                    if (account_data[i].account.Manager_id == manager 
                        && date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
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
                            general_amount += Math.round(deleteSpaces(+items_amount[element].amount));
                        }
                        all_amounts += general_amount;
                        td += `<td>${returnSpaces(general_amount)}</td>`
                        let unload_table_ = [{total: returnSpaces(general_amount)}];
                        for (let j = 0; j < items_volume.length; j++) {
                            for (let k = 0; k < all_items.length; k++) {
                                if (+all_items[k].Item_id == +items_volume[j].id) {
                                    if (!unload_status) {
                                        amounts[k] += deleteSpaces(+items_volume[j].volume);
                                        td += `<td id="item_${k + 1}">${returnSpaces(items_volume[j].volume)}</td>`
                                        if (items_volume.length - 1 != j) {
                                            j++;
                                        }
                                    } else {
                                        unload_table_.push({ id: +items_volume[j].id, volume: returnSpaces(items_volume[j].volume) });
                                    }
                                } else {
                                    if (!unload_status) 
                                        td += `<td id="item_${k + 1}">0</td>`
                                    else 
                                        unload_table_.push({id: +items_volume[j].id, volume: 0});
                                }
                            }
                        }
                        if (unload_status) {
                            return unload_table_;
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
                if (!unload_status) 
                    return `<td>0</td>`;
                else 
                    return {total: 0};
            }
            let table = '';
            let total_count = 0;
            let unload_table = [];
            for (let i = 0; i < managers.length; i++) {
                if (!unload_status) {
                    table += `
                        <tr>
                            <td>${managers[i].second_name}</td>
                            ${checkManager(managers[i].id)}
                        </tr>
                    `
                    total_count++;
                } else {
                    unload_table.push({ manager: managers[i].second_name, list: checkManager(managers[i].id) });
                }
            }
            if (unload_status) {
                return unload_table;
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'менеджер', 1)}</span> 
                        <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                            <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                        </div>
                    </div>
                    <div id="analytics_4" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                `)
                $('body').append(`<div id="analytics_block_hidden"></div>`)
            } else {
                $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'менеджер', 1)}`);
            }
            let amount_tr = `<tr>${fillAmountRow()}</tr>`;
            function fillAmountRow() {
                let td = `<td></td><td>${returnSpaces(all_amounts)}</td>`
                for (let i = 0; i < amounts.length; i++) {
                    td += `<td class="bold">${returnSpaces(amounts[i])}</td>`
                }
                return td;
            }
            table += amount_tr;
            return table;
        }
        if (unload_status) {
            return fillTable();
        } else {
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
    }
    // Проделанная работа
    function analyticsFilterTable_5(date_period, unload_status = false, filter_manager = '') {
        function fillTable() {
            let tbody = '';
            $.ajax({
                url: '/getManagerStat',
                type: 'GET',
                async: false,
                dataType: 'html',
                beforeSend: function() {
                    $('body').prepend(`
                        <div id="preloader">
                            <div id="preloader_preload"></div>
                        </div>
                    `)
                    preloader = document.getElementById("preloader_preload");
                },
                complete: function() {
                    setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                },
                success: function(data) {
                    result = JSON.parse(data);
                    let total_count = 0;
                    let unload_info = [];
                    for (let i = 0; i < result.data.length; i++) {
                        let count = 0, length = 0;

                        for (let key in result.data[i].orgs) {
                            let current_date = getValidationDate(result.data[i].orgs[key]);
                            if (current_date >= date_period[0] && current_date <= date_period[1]) length++;
                        }

                        for (let key in result.data[i].orgs) {
                            let current_date = getValidationDate(result.data[i].orgs[key]);
                            if (current_date >= date_period[0] && current_date <= date_period[1] && (filter_manager == result.data[i].name || filter_manager == '')) {
                                if (!unload_status) {
                                    if (count == 0) {
                                        tbody += `
                                            <tr>
                                                <td name="username_analytics" rowspan="${length}">${result.data[i].name}</td>
                                                <td>${key}</td>
                                                <td>${result.data[i].orgs[key]}</td>
                                            </tr>
                                        `
                                    } else {
                                        tbody += `
                                            <tr>
                                                <td>${key}</td>
                                                <td>${result.data[i].orgs[key]}</td>
                                            </tr>
                                        `
                                    }
                                } else {
                                    unload_info.push({ manager: result.data[i].name, name: key, last_comment: result.data[i].orgs[key] });
                                }
                                count++;
                            }
                        }
                        total_count += count;
                    }
                    if (unload_status) {
                        tbody = unload_info;
                        return;
                    }
                    if (!$('div').is('#analytics_block_hidden')) {
                        $('.fields').append(`
                            <div id="info_in_accounts">
                                <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'комментари', 3)}</span> 
                                <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                                    <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                                </div>
                            </div>
                            <div id="analytics_5" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>
                        `)
                        $('body').append(`<div id="analytics_block_hidden"></div>`)
                    } else {
                        $('#info_in_accounts_count').html(`${total_count} ${current_count_accounts(total_count, 'комментари', 3)}`);
                    }
                }
            });
            return tbody;
        }
        if (unload_status) {
            return fillTable();
        } else {
            return `
                <table class="table analytics">
                    <tr>
                        <th id="pd_manager" onclick="selectManagerAnalytics(this)">
                            <div class="flex jc-sb">
                                <span>Менеджер</span>
                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                            </div>
                        </th>
                        <th>Наименование</th>
                        <th width="350">Дата последнего комментария</th>
                    </tr>
                    ${fillTable()}
                </table>
            `
        }
    }
    function selectManagerAnalytics(element) {
        let id = element.id;
        function listManager() {
            let ul = $('<ul>', { class: 'list'});
            let filter_tabledata;
    
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    data = JSON.parse(result);
                }
            });
            let filter_table = [];
            for (let i = 0; i < data.length; i++) {
                for (let name of $('[name="username_analytics"]')) {
                    if (data[i].second_name == $(name).html().split(' ')[1] && data[i].name == $(name).html().split(' ')[0]) {
                        filter_table.push({ name: $(name).html(), id: data[i].id});
                    }
                }
            }
            
            for (let i = 0; i < filter_table.length; i++) {
                ul.append($('<li>', {
                    html: filter_table[i].name,
                    id: filter_table[i].id,
                    onclick: 'sortTableByManagersAn(this)'
                }))
            }
            return ul;
        }
        $('.filter_list').fadeOut(200);
        setTimeout(function() {
            $('.filter_list').remove();
        }, 200);
        
        if ($(`#${id} .drop_arrow`).hasClass('drop_active')) {
            return $(`#${id} .drop_arrow`).removeClass('drop_active');
        }
    
        $(`.drop_arrow`).removeClass('drop_active');
        $(`#${id} .drop_arrow`).addClass('drop_active');
        setTimeout(function() {
            $(element).append($('<div>', { 
                class: 'filter_list',
                css: {'top': `${$(element).height() + 30}px`},
                append: listManager()
            }))
            $('.filter_list').fadeIn(100);
        }, 250);
    }
    function sortTableByManagersAn(element) {
        let searchWord = element.innerHTML;
        $('.centerBlock .header .cancel').remove();
    
        let managers;
        $.ajax({
            url: '/getUsers',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                managers = JSON.parse(result);
            }
        });
        let date = $('#period_accounts').html();
        let date_filter = [
            {id: 'day', text: 'за последний день'},
            {id: 'weak', text: 'за последнюю неделю'},
            {id: 'month', text: 'за последний месяц'},
            {id: 'year', text: 'за последний год'},
            {id: 'all', text: 'за все время'},
        ]
        for (let i = 0; i < date_filter.length; i++) {
            if (date_filter[i].text == date) {
                $('.table').remove();
                $('.info').append(analyticsFilterTable_5(datePeriod(date_filter[i].id), false, searchWord));
                break;
            }
        }
    }
    function visibleSelectPeriodInAnalytics() {
        if ($('div').is('.period_info_accounts')) {
            $('.period_info_accounts').remove();
        } else {
            $('#select_period_info_accounts').append(`
                <div class="period_info_accounts">
                    <ul>
                        <li id="day" onclick="selectPeriodInAnalytics(this.id)">за последний день</li>
                        <li id="weak" onclick="selectPeriodInAnalytics(this.id)">за последнюю неделю</li>
                        <li id="month" onclick="selectPeriodInAnalytics(this.id)">за последний месяц</li>
                        <li id="year" onclick="selectPeriodInAnalytics(this.id)">за последний год</li>
                        <li id="all" onclick="selectPeriodInAnalytics(this.id)">за все время</li>
                    </ul>
                </div>
            `) 
        }
    }
    function selectPeriodInAnalytics(period) {
        let date_period = datePeriod(period);
        let list = [
            {function: analyticsFilterTable_0, name: 'Прибыль по клиентам'},
            {function: analyticsFilterTable_1, name: 'Сводный по объёмам'},
            {function: analyticsFilterTable_2, name: 'По клиентам'},
            {function: analyticsFilterTable_3, name: 'По приветам'},
            {function: analyticsFilterTable_4, name: 'Отгрузки менеджеров'},
            {function: analyticsFilterTable_5, name: 'Проделанная работа'}
        ]

        for (let i = 0; i < list.length; i++) {
            if (list[i].name == $('#analytics_reports #active_field').html()) {
                $('.table').remove();
                $('.info').append(list[i].function(date_period));
                break;
            }
        }
    }
    function datePeriod(period) {
        let date_filter = [
            {id: 'day', period: 0, text: 'за последний день'},
            {id: 'weak', period: 7, text: 'за последнюю неделю'},
            {id: 'month', period: 30, text: 'за последний месяц'},
            {id: 'year', period: 365, text: 'за последний год'},
            {id: 'all', period: 5475, text: 'за все время'},
        ]
        for (let i = 0; i < date_filter.length; i++) {
            if (period == date_filter[i].id) {
                let today = getCurrentDate('year');
                let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)/;
    
                let date_arr = datetime_regex.exec(today);
                let first_datetime = new Date('20' + +date_arr[3] - 1, date_arr[2], date_arr[1]);
                let second_datetime = new Date('20' + +date_arr[3] - 1, date_arr[2], date_arr[1]);
                second_datetime.setDate(second_datetime.getDate() - date_filter[i].period);
                $('#period_accounts').html(date_filter[i].text);
                return [second_datetime, first_datetime];
            }
        }
    }
    function unloadThisTable(id) {
        let number = id.split('_')[1];
        let list = [
            {function: analyticsFilterTable_0, id: 0},
            {function: analyticsFilterTable_1, id: 1},
            {function: analyticsFilterTable_2, id: 2},
            {function: analyticsFilterTable_3, id: 3},
            {function: analyticsFilterTable_4, id: 4},
            {function: analyticsFilterTable_5, id: 5}
        ]
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == number) {
                let current_data = list[i].function(datePeriod('all'), true);
                console.log(JSON.stringify({id: +number, data: current_data}));
                $.ajax({
                    url: '/excelStat',
                    type: 'GET',
                    data: {id: +number, data: JSON.stringify(current_data)},
                    dataType: 'html',
                    success: function(result) {
                        console.log(result);
                    }
                });
            }
        }
    }