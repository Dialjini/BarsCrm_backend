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
            name: {status: false, filter: null},
            category: {status: false, filter: null, last: null},
            manager: {status: false, filter: null, last: null},
            customer: {status: false, filter: null, last: null},
            status: {status: false, filter: null, last: null},
            date: {status: false, filter: null, last: null},
            search_on_regions: {status: false, filter: null, last: null}
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
        let data_role = $('[name="offtop__load"').attr('id').split('::');
        let this_user = {role: data_role[0], id: data_role[1]};
        const list = [
            { width: 161.125, id: 'stock_group', list: [] },
            { width: 90.656, id: 'stock_product', list: [] },
            { width: 90.656, id: 'stock_stock', list: [] },
            { width: 220, id: 'analytics_reports', list: this_user.role == 'admin' ? ['Прибыль по клиентам', 'Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров', 'Баллы и бонусы', 'Проделанная работа'] : ['Сводный по объёмам', 'По клиентам', 'По приветам', 'Отгрузки менеджеров', 'Баллы и бонусы']},
        ]

        let idList = this.id, element;
        let filter_table = categoryInStock[1][1];
        let info = ['Group_name', 'Name', 'stock_address'];

        if (!idList.includes('analytics')) {
            if (!$('.report_list').is(`#${idList}`)) {
                for (let k = 0; k < info.length; k++) {
                    for (let i = 0; i < filter_table.length; i++) {
                        for (let j = 0; j < filter_table[i].items.length; j++) {
                            if (info[k] == 'stock_address') {
                                list[k].list.push(filter_table[i].stock_address)
                            } else {
                                list[k].list.push(filter_table[i].items[j][info[k]])
                            }
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
                        analyticsFilterTable_6
                    ]
                    $('[name="unload_table"]').remove();
                    $('#analytics_block_hidden').remove()
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
                        { id: 'stock_stock', filterName: 'stock_address', name: 'Склад'},
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
                                && (filter_table[i].items[k][filter_parameters[1].name] == filter_parameters[1].filter || filter_parameters[1].filter == '')
                                && (filter_table[i][filter_parameters[2].name] == filter_parameters[2].filter || filter_parameters[2].filter == '')) {
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
                $('.table').width('max-content');
            }
        });
    });
}

let lastData = {last_id: '', last_table: ''};

// Нажатие на категорию
function linkCategory(element) {
    console.log(123);
    $('.info').empty();
    $('[name="linkCategory"], .mini_logo').removeClass('active');
    $(`#${element}`).addClass('active');
    lastData = {last_id: '', last_table: ''};
    sortStatus = {
        product: {status: false, filter: null, last: null},
        price: {status: false, filter: null},
        area: {status: false, filter: null},
        name: {status: false, filter: null},
        category: {status: false, filter: null, last: null},
        manager: {status: false, filter: null, last: null},
        customer: {status: false, filter: null, last: null},
        status: {status: false, filter: null, last: null},
        date: {status: false, filter: null, last: null},
        search_on_regions: {status: false, filter: null, last: null}
    }
    categoryInFilterStock[1][1] = [];
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        if (element == linkCategoryInfo[i].id) {
            for (let j = 0; j < linkCategoryInfo[i].subcategories.length; j++) {
                if (linkCategoryInfo[i].subcategories[j][0].active) {
                    addButtonsSubcategory(i);
                    console.log(linkCategoryInfo[i].subcategories[j]);
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
            } else if (subcategoryButtons[idCategory][i].name == 'Поставщики') {
                let user;
                $.ajax({
                    url: '/getThisUser',
                    type: 'GET',
                    async: false,
                    dataType: 'html',
                    success: function(data) {
                        user = JSON.parse(data);
                        console.log(user);

                    }
                });
                console.log(user);
                if (user.role == 'admin') {
                    return element = $('<div>', {
                        class: subcategoryButtons[idCategory][i].class,
                        html: subcategoryButtons[idCategory][i].name,
                        id: subcategoryButtons[idCategory][i].id
                    });
                }
            } else {
                return element = $('<div>', {
                    class: subcategoryButtons[idCategory][i].class,
                    html: subcategoryButtons[idCategory][i].name,
                    id: subcategoryButtons[idCategory][i].id
                });
            }
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
    $('#filter_admin').remove();
    adminPanel();
}
function add_regions() {
    $('._block, .table, #addNewPerson, #filter_admin, .add_new_regions, .add_something_r').remove();

    let promise = new Promise((resolve, reject) => {
        $('body').append(`
            <div id="preloader">
                <div id="preloader_preload"></div>
            </div>
        `)
        preloader = document.getElementById("preloader_preload");
        $.ajax({
            url: '../static/js/json/regions.json',
            cache: false,
            success: function(json) {
                console.log(json);
                resolve(json)
            }
        })
    })

    promise.then(result => {
        $('#loading').remove();
        setTimeout(function(){ fadeOutPreloader(preloader) }, 0);

        console.log(result);
        $('.info').append(`<div class="add_new_regions">
            <button class="btn">Добавить область</button>
            <button class="btn">Добавить район</button>
        </div>`)

        $('.add_new_regions button:nth-child(2)').click(function() {
            $('.add_new_regions button').removeClass('btn-main');
            $('.add_something_r').remove();

            $(this).addClass('btn-main');

            $('.info').append(`
                <div class="add_something_r" style="margin-top: 30px">
                    <select style="outline: none; border: 1px solid #d2d2d2; border-radius: 5px; color: #3a3a3a; padding: 5px 10px; font-family: 'Montserrat', sans-serif;">
                        <option selected disabled>Выберите область</option>
                        ${result.reduce((result, element) => result + `
                            <option>${element.region}</option>
                        `, '')}
                    </select>
                    <div style="margin-top: 30px;">
                        <input type="text" style="width: 200px; border: 1px solid #d2d2d2; padding: 5px 10px; border-radius: 5px; outline: none; font-family: 'Montserrat', sans-serif; margin-right: 15px;" placeholder="Введите название района">
                        <button class="btn btn-main">Добавить</button>
                    </div>
                </div>
            `)
            $('.add_something_r button.btn').click(function() {
                const region = $('.add_something_r select').val();
                const area = $('.add_something_r input[type="text"]').val();
                if (region == '' || area == '') return;
                console.log(region, area);
                let c_region = result.find(element => element.region === region);
                if (!c_region) return;
                c_region.areas.push(area);
                sort()
                console.log({json: JSON.stringify(result)});
                $.get('/updateRegions', {json: JSON.stringify(result)}, (data) => {
                    if (data == 'OK') {
                        add_regions();
                    }
                })
            })
        })
        $('.add_new_regions button:first-child').click(function() {
            $('.add_new_regions button').removeClass('btn-main');
            $('.add_something_r').remove();

            $(this).addClass('btn-main');

            $('.info').append(`
                <div class="add_something_r" style="margin-top: 30px">
                    <input type="text" style="width: 200px; border: 1px solid #d2d2d2; padding: 5px 10px; border-radius: 5px; outline: none; font-family: 'Montserrat', sans-serif; margin-right: 15px;" placeholder="Введите название области">
                    <button class="btn btn-main">Добавить</button>
                </div>
            `)

            $('.add_something_r button.btn').click(function() {
                const value = $('.add_something_r input').val();
                result.push({region: value, areas: []})
                sort()
                console.log({json: JSON.stringify(result)});
                $.get('/updateRegions', {json: JSON.stringify(result)}, (data) => {
                    if (data == 'OK') {
                        add_regions();
                    }
                })
            })
        })
        function sort() {
            result.sort((a, b) => {
                if (a.region > b.region) return 1;
                if (a.region < b.region) return -1;
                return 0;
            });
            result.forEach(element => {
                element.areas.sort((a, b) => {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });
            })
        }
    })

    activeThisField('add_new');
    
}
function items() {
    $('._block').remove();
    $('.add_new_regions, .add_something_r').remove();

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
                            const name = [data[i].items[k].Prefix, data[i].items[k].Group_name, data[i].items[k].Name, returnSpaces(data[i].items[k].Weight), data[i].items[k].Packing, returnSpaces(data[i].items[k].Volume), returnSpaces(data[i].items[k].Cost), data[i].items[k].NDS, data[i].stock_address];
            
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
            function sortFields() {
                let fields = `
                    <div class="row" id="filter_admin" style="margin-bottom: 20px;">
                        <div class="fields">${fill()}</div>
                    </div>
                `;
                function fill() {
                    return `
                        <div class="list_admin" id="stock_group">
                            <div class="field_with_modal">
                                <span id="active_field">Группа товаров</span>
                                <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                            </div>
                        </div>
                        <div class="list_admin" id="stock_product">
                            <div class="field_with_modal">
                                <span id="active_field">Товар</span>
                                <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                            </div>
                        </div>
                        <div class="list_admin" id="stock_stock">
                            <div class="field_with_modal">
                                <span id="active_field">Склад</span>
                                <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                            </div>
                        </div>
                    `
                }
                return fields;
            }
            $('.table').remove();
            $('#addNewPerson').remove();
            activeThisField('items');
            $('.info').append(sortFields()).append(getTable());
            activeAdmin();
        },
        complete: function() {
            $('#loading').remove();
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        }
    });
}
function activeAdmin() {
    $('.list_admin').click(function() {
        let data_role = $('[name="offtop__load"').attr('id').split('::');
        let this_user = {role: data_role[0], id: data_role[1]};

        const list = [
            { width: 161.125, id: 'stock_group', list: [] },
            { width: 90.656, id: 'stock_product', list: [] },
            { width: 90.656, id: 'stock_stock', list: [] },
        ]

        $.ajax({
            url: '/getStockTable',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                filter_table = JSON.parse(data);
            }
        })

        let idList = this.id, element;
        let info = ['Group_name', 'Name', 'stock_address'];

        if (!idList.includes('analytics')) {
            if (!$('.report_list').is(`#${idList}`)) {
                for (let k = 0; k < info.length; k++) {
                    for (let i = 0; i < filter_table.length; i++) {
                        for (let j = 0; j < filter_table[i].items.length; j++) {
                            if (info[k] == 'stock_address') {
                                list[k].list.push(filter_table[i].stock_address)
                            } else {
                                list[k].list.push(filter_table[i].items[j][info[k]])
                            }
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
                        for (let j = 0; j < list[i].list.length; j++) {
                            ul.append(
                                `<li id="${idList}_${j}">${list[i].list[j]}</li>`
                            )
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
                    const filter_ids = [
                        { id: 'stock_group', filterName: 'Group_name', name: 'Группа товаров'},
                        { id: 'stock_product', filterName: 'Name', name: 'Товар'},
                        { id: 'stock_stock', filterName: 'stock_address', name: 'Склад'},
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
                    categoryInStockAdmin[1][1] = [];
                    let items = []
                    for (let i = 0; i < filter_table.length; i++) {
                        for (let k = 0; k < filter_table[i].items.length; k++) {
                            if ((filter_table[i].items[k][filter_parameters[0].name] == filter_parameters[0].filter || filter_parameters[0].filter == '')
                                && (filter_table[i].items[k][filter_parameters[1].name] == filter_parameters[1].filter || filter_parameters[1].filter == '')
                                && (filter_table[i][filter_parameters[2].name] == filter_parameters[2].filter || filter_parameters[2].filter == '')) {
                                items.push({ stock_address: filter_table[i].stock_address, items: [filter_table[i].items[k]]});
                            }
                        }
                    }
                    console.log(items);
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
                    categoryInStockAdmin[1][1] = items;
                    return fillingTables(categoryInStockAdmin);
            };

            $('.info').append(createFilterTable());
            if (categoryInStockAdmin[1][1].length == 0) {
                $('.info').append(`
                    <div id="not_found" class="row">
                        <span style="margin-left: 10px; margin-top: -20px;">Ничего не найдено</span>
                    </div>
                `)
            }
        });
    });
}
function positions() {
    $('._block').remove();
    $('.add_new_regions, .add_something_r').remove();
    $('#filter_admin').remove();
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
    const fields = ['persons', 'positions', 'items', 'add_new'];
    for (let i = 0; i < fields.length; i++) {
        $(`#${fields[i]}`).removeClass('active');
        if (fields[i] == field) {
            $(`#${field}`).addClass('active');
        }
    }
}
function adminPanel(close = '') {
    let data_role = $('[name="offtop__load"').attr('id').split('::');
    let data = {role: data_role[0], id: data_role[1]};
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
                    <div class="row" id="admin_row">
                        <div class="fields" style="width: auto">
                            <div class="field active" id="persons" onclick="persons()">Сотрудники</div>
                            <div class="field" id="positions" onclick="positions()">Должности</div>
                            <div class="field" id="items" onclick="items()">Редактирование товаров</div>
                            <div class="field" id="add_new" onclick="add_regions()">Добавление обл/районов</div>
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
function addNewPerson() {
    $('#addNewPerson').remove();
    $('.table, .card_menu').remove();
    $('.add_new_regions').remove();
    
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
            function fillPacking() {
                data.Packing;
                let list = ['Насыпь', 'Мешки', 'ББ'];
                let options = '';
                for (let i = 0; i < list.length; i++) {
                    if (data.Packing == list[i]) {
                        options += `<option selected value="${list[i]}">${list[i]}</option>`
                    } else {
                        options += `<option value="${list[i]}">${list[i]}</option>`
                    }
                }
                return options;
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
                                    <td><input onkeyup="maskNumberWithout(this.id)" type="text" id="item_volume" class="string" value="${data.Volume}"></td>
                                </tr>
                                <tr>
                                    <td>Фасовка</td>
                                    <td>
                                        <select type="text" id="item_packing">${fillPacking()}</select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Категория</td>
                                    <td>
                                        ${data.Category == 'Насыпь' ? `
                                        <select id="item_category" type="text">
                                            <option selected value="Насыпь">Насыпь</option>
                                            <option value="Жир/ЗЦМ">Жир/ЗЦМ</option>
                                        </select>
                                        ` : `
                                        <select id="item_category" type="text">
                                            <option value="Насыпь">Насыпь</option>
                                            <option selected value="Жир/ЗЦМ">Жир/ЗЦМ</option>
                                        </select>
                                        `}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Вес, кг.</td>
                                    <td><input onkeyup="maskNumberWithout(this.id)" type="text" id="item_weight" class="string" value="${data.Weight}"></td>
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
                            <button class="btn btn-main btn-danger" id="${data.Item_id}" onclick="deleteItem(this.id)">Удалить товар</button>
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
function deleteItem(elem_id) {
    let id = elem_id;
    $.ajax({
        url: '/getAccounts',
        type: 'GET',
        dataType: 'html',
        success: function(account_data) {
            account_data = JSON.parse(account_data).reverse();
            for (let i = 0; i < account_data.length; i++) {
                for (let j = 0; j < account_data[i].items.length; j++) {
                    if (account_data[i].items[j].Item_id == id) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px;">Данный товар используется в счете №${account_data[i].account.id} "${account_data[i].account.Name}"!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                }
            }
            $.ajax({
                url: '/deleteItem',
                type: 'GET',
                data: {id: id},
                dataType: 'html',
                success: function() {
                    closeThisMenu('items');
                }
            });
        }
    });
}
function saveEditItem(id) {
    let item_id = id.split('_')[1];
    let list = [{type: 1, value: 'stock_id'}, {type: 1, value: 'group_id'}, {type: 1, value: 'item_product'},
                {type: 1, value: 'item_prefix'}, {type: 2, value: 'item_volume'}, {type: 1, value: 'item_packing'},
                {type: 2, value: 'item_weight'}, {type: 2, value: 'item_vat'}, {type: 2, value: 'item_price'},
                {type: 2, value: 'item_purchase_price'}, {type: 1, value: 'item_category'}];

    let data = {};

    for (let i = 0; i < list.length; i++) {
        if (list[i].type == 2) data[list[i].value] = deleteSpaces($(`#${list[i].value}`).val());
        else data[list[i].value] = $(`#${list[i].value}`).val();
        
    }
    data['item_fraction'] = 'test';
    data['item_creator'] = 'test';
    data['id'] = item_id;
    if (categoryInStock[1][1] != undefined) {
        categoryInStock[1].pop();
    }
    console.log(data);
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
    let datetime = new Date('20' + +date_arr[3], +date_arr[2] - 1, date_arr[1]);
    return datetime;
}
// Отчеты
    // Прибыль по клиентам
    function analyticsFilterTable_0(date_period, unload_status = false, main = false) {
        categoryInAnalytics[0].last = 0;
        $('#all_amount_hello').remove();
        $('#all_amount_profit').remove();

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
            if (date_create_account >= date_period[0] && date_create_account <= date_period[1] && account_data[i].account.Shipment != 'false') {
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
            let all_amount = 0;
            for (let i = 0; i < items_list.length; i++) {
                let this_client_amount = 0;
                for (let j = 0; j < items_list[i].account.length; j++) {
                    let volume = JSON.parse(items_list[i].account[j].Item_ids);
                    let delivery = JSON.parse(items_list[i].account[j].Shipping);
                    let hello = JSON.parse(items_list[i].account[j].Hello);
                    let sale = JSON.parse(items_list[i].account[j].Sale);
                    for (let v = 0; v < volume.length; v++) {
                        if (+volume[v].id == +items_list[i].item.Item_id) {
                            let cost_price = Number(+deleteSpaces(items_list[i].item.Cost) + +deleteSpaces(hello[v]) + +deleteSpaces(delivery[v]) + +deleteSpaces(sale[v])).toFixed(2);
                            let price = Number(cost_price * +deleteSpaces(items_list[i].item.Transferred_volume)).toFixed(2);
                            if (!unload_status) {
                                function fillTr() {
                                    let trContent = '';
                                    if (j == 0) {
                                        trContent += `<td rowspan="${items_list[i].account.length}">${items_list[i].item.Name}</td>`;
                                    }
                                    let profit = Number((cost_price - +deleteSpaces(items_list[i].item.Purchase_price)) * +deleteSpaces(volume[v].volume)).toFixed(2);
                                    this_client_amount += +deleteSpaces(profit);
                                    trContent += `<td>${items_list[i].account[j].Name}</td>
                                                <td>${returnSpaces(volume[v].volume)}</td>
                                                <td>${returnSpaces(price)}</td>
                                                <td>${returnSpaces(delivery[v])}</td>
                                                <td>${returnSpaces(hello[v])}</td>
                                                <td>${returnSpaces(cost_price)}</td>
                                                <td>${returnSpaces(items_list[i].item.Purchase_price)}</td>
                                                <td>${returnSpaces(Number(cost_price - +deleteSpaces(items_list[i].item.Purchase_price)).toFixed(2))}</td>
                                                <td>${returnSpaces(profit)}</td>`
                                    return trContent;
                                }
                                let tr;
                                if (j == 0) tr = `<tbody class="tr_tr"><tr>${fillTr()}</tr>`
                                else if (j == items_list[i].account.length - 1)  {
                                    tr = `<tr>${fillTr()}</tr>
                                        <tr>
                                            <td colspan="10" style="text-align: right; font-weight: 600; padding: 15px;">Итого по клиенту: ${returnSpaces(this_client_amount)} руб.</td>
                                        </tr>
                                    </tbody>`
                                } else tr = `<tr>${fillTr()}</tr>`
                                table += tr;
                                total_count++;
                            } else {
                                unload_table.push({product: items_list[i].item.Name, name: items_list[i].account[j].Name, volume: returnSpaces(volume[v].volume),
                                    price: returnSpaces(price), delivery: returnSpaces(delivery[v]), hello: returnSpaces(hello[v]), cost: returnSpaces(cost_price),
                                    purchase_price: returnSpaces(items_list[i].item.Purchase_price), earned: returnSpaces(Number(cost_price - +deleteSpaces(items_list[i].item.Purchase_price)).toFixed(2)),
                                    profit: returnSpaces(Number((cost_price - +deleteSpaces(items_list[i].item.Purchase_price)) * +deleteSpaces(volume[v].volume)).toFixed(2))
                                });
                            }
                        }
                    }
                }
                all_amount += this_client_amount;
            }
            $('#subcategories').after(`<div class="row" id="all_amount_profit"><div style="padding: 0 0 20px; color: #595959;">Итого: <span class="red">${returnSpaces(Number(all_amount).toFixed(1))} руб.</span></div></div>`);
            console.log(all_amount);
            if (unload_status) {
                return unload_table;
            }
            if (!$('div').is('#analytics_block_hidden') || main) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <input placeholder="Выберите период" type="text" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                        <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">
                    </div>
                `)
                // <div id="analytics_0" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                $('#select_period').datepicker({
                    maxDate: new Date(),
                    dateFormat: 'dd.mm.yyyy',
                    range: true,
                    toggleSelected: false,
                    multipleDatesSeparator: ' - ',
                    onSelect: (formattedDate, date, inst) => {
                        const date_range = [];
                        if (date.length == 2) {
                            console.log(date)

                            selectPeriodInAnalytics(date)

                            let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                myDatepicker.hide();
                        }
                    }
                })
                // <div id="select_period_info_accounts" onclick="visibleSelectPeriodInAnalytics()">
                //             <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                //         </div>
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
                    <th width="180">Клиент</th>
                    <th>Объем, кг.</th>
                    <th width="85">Цена, руб.</th>
                    <th>Доставка</th>
                    <th>Привет</th>
                    <th>Себес.</th>
                    <th>Закупочная цена</th>
                    <th>Заработали</th>
                    <th width="85">Прибыль</th>
                </tr>
                ${fillTable()}
            </table>
        `
        }
    }
    // Сводный по объёмам
    function analyticsFilterTable_1(date_period, unload_status = false, main = false) {
        categoryInAnalytics[0].last = 1;
        let account_data, stocks;
        $('#all_amount_hello').remove();
        $('#all_amount_profit').remove();
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
                th += `<th width="120">${all_items[i].Name}</th>`
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
                                    volume_one[l].volume = +deleteSpaces(volume_one[l].volume) + +deleteSpaces(volume_one[h].volume);
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
                                        amounts[l] += +deleteSpaces(items_volume[j].volume);
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
                                            for (let q = 0; q < stocks.length; q++) {
                                                for (let n = 0; n < stocks[q].items.length; n++) {
                                                    if (stocks[q].items[n].Item_id == items_volume[j].id) {
                                                        unload_table[g].list.push({name: stocks[q].items[n].Name, volume: deleteSpaces(items_volume[j].volume)})
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (items_volume.length - 1 != j) {
                                        j++;
                                    }
                                } else {
                                    for (let g = 0; g < unload_table.length; g++) {
                                        if (account_data[i].account.Name == unload_table[g].name) {
                                            for (let q = 0; q < stocks.length; q++) {
                                                for (let n = 0; n < stocks[q].items.length; n++) {
                                                    if (stocks[q].items[n].Item_id == all_items[l].Item_id) {
                                                        unload_table[g].list.push({name: stocks[q].items[n].Name, volume: '0'})
                                                    }
                                                }
                                            }
                                        }
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
            if (!$('div').is('#analytics_block_hidden') || main) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                        <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">
                    </div>
                `)
                // <div id="analytics_1" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                $('#select_period').datepicker({
                    maxDate: new Date(),
                    dateFormat: 'dd.mm.yyyy',
                    range: true,
                    toggleSelected: false,
                    multipleDatesSeparator: ' - ',
                    onSelect: (formattedDate, date, inst) => {
                        const date_range = [];
                        if (date.length == 2) {
                            console.log(date)

                            selectPeriodInAnalytics(date)

                            let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                myDatepicker.hide();
                        }
                    }
                })
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
                <div style="overflow-x: auto; overflow-y: scroll; position: relative;">
                    <table class="table analytics" style="width: max-content; margin-bottom: 0px">
                        <tr>
                            <th width="270">Клиент</th>
                            ${outputAllItems()}
                        </tr>
                        ${fillTable()}
                    </table>
                </div>
            `
        }
    }
    // По клиентам
    function analyticsFilterTable_2(date_period, unload_status = false) {
        categoryInAnalytics[0].last = 2;
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
        $('#all_amount_hello').remove();
        $('#all_amount_profit').remove();
        let items_list = [];
        let total_count = 0;
        for (let i = 0; i < account_data.length; i++) {
            let date_create_account = getValidationDate(account_data[i].account.Date);
            if (date_create_account >= date_period[0] && date_create_account <= date_period[1] && account_data[i].account.Shipment_list != null && account_data[i].account.Shipment_list != '') {
                for (let j = 0; j < account_data[i].items.length; j++) {
                    items_list.push({ items: [account_data[i].items[j]], account: account_data[i].account })
                }
            }
        }

        let delivery_id = null;
        function fillTable() {
            let table = '';
            let unload_table = [];
            let main_list = [];
            for (let i = 0; i < items_list.length; i++) {
                total_count++;
                for (let j = 0; j < items_list[i].items.length; j++) {
                    let volume = JSON.parse(items_list[i].account.Item_ids);

                    let hello = JSON.parse(items_list[i].account.Hello);
                    let shipping = JSON.parse(items_list[i].account.Shipping);
                    let sale = JSON.parse(items_list[i].account.Sale);
                    
                    let shipment_list = JSON.parse(items_list[i].account.Shipment_list);
                    for (let ii = 0; ii < volume.length; ii++) {
                        for (let jj = 0; jj < shipment_list.length; jj++) {
                            if (shipment_list[jj].id == items_list[i].items[j].Item_id && volume[ii].id == shipment_list[jj].id) {
                                let amount_price = Number(+deleteSpaces(shipment_list[jj].volume) * (+deleteSpaces(items_list[i].items[j].Cost) + +deleteSpaces(hello[ii]) + +deleteSpaces(shipping[ii]) + +deleteSpaces(sale[ii]))).toFixed(2);
                                    main_list.push({ name: items_list[i].account.Name, product: shipment_list[jj].name, volume: returnSpaces(shipment_list[jj].volume),
                                        start_date: shipment_list[jj].date != null || shipment_list[jj].date != '' ? shipment_list[jj].date : 'Не указана',
                                        amount: returnSpaces(amount_price)})
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < main_list.length - 1; i++) {
                for (let j = i + 1; j < main_list.length; j++) {
                    if (main_list[i].name == main_list[j].name && main_list[i].product == main_list[j].product) {
                        main_list[i].volume = returnSpaces(+deleteSpaces(main_list[i].volume) + +deleteSpaces(main_list[j].volume))
                        main_list[i].amount = returnSpaces(+deleteSpaces(main_list[i].amount) + +deleteSpaces(main_list[j].amount))
                        main_list.splice(j, 1);
                        j--;
                    }
                }
            }
            main_list.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            })
            for (let i = 0; i < main_list.length; i++) {
                let tbody = '<tbody class="tr_tr">';
                let count = 1;
                for (let j = i + 1; j < main_list.length; j++) {
                    if (main_list[i].name == main_list[j].name) count++;
                }
                for (let j = 0; j < count; j++) {
                    function fillTr() {
                        let tr_content = '';
                        unload_table.push({ name: main_list[i].name, product: main_list[i + j].product, volume: main_list[i + j].volume,
                            amount: main_list[i + j].amount})
                        if (j == 0) {
                            tr_content += `<td rowspan="${count}">${main_list[i].name}</td>`
                        }
                        tr_content += `
                            <td>${main_list[i + j].product}</td>
                            <td>${main_list[i + j].volume}</td>
                            <td>${main_list[i + j].amount}</td>
                        `
                        return tr_content;
                    }
                    let tr = `<tr>${fillTr()}</tr>`
                    tbody += tr;
                }
                for (let j = i + 1; j < main_list.length; j++) {
                    let name = main_list[i].name;
                    if (name == main_list[j].name) {
                        main_list.splice(j, 1);
                        j--;
                    }
                }
                if (tbody != '<tbody class="tr_tr">') {
                    table += tbody + '</tbody>';
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
                        <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                        <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">
                    </div>
                `)
                // <div id="analytics_2" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                $('#select_period').datepicker({
                    maxDate: new Date(),
                    dateFormat: 'dd.mm.yyyy',
                    range: true,
                    toggleSelected: false,
                    multipleDatesSeparator: ' - ',
                    onSelect: (formattedDate, date, inst) => {
                        const date_range = [];
                        if (date.length == 2) {
                            console.log(date)

                            selectPeriodInAnalytics(date)

                            let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                myDatepicker.hide();
                        }
                    }
                })
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
                        <th>Объем, кг</th>
                        <th>Сумма, руб.</th>
                    </tr>
                    ${fillTable()}
                </table>
            `
        }
    }
    // По приветам
    function analyticsFilterTable_3(date_period, unload_status = false, filter_status = '') {
        categoryInAnalytics[0].last = 3;
        $('#all_amount_profit').remove();
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
                if (accounts[i].account.Hello_costs == 0) continue;
                let date_create_account = getValidationDate(accounts[i].account.Date);
                let status = accounts[i].account.Shipment_hello == '' ? 'Не оплачено' : 'Оплачено';
                if (date_create_account >= date_period[0] && date_create_account <= date_period[1] && (filter_status == status || filter_status == '')) {
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
                    let status_html = accounts[i].account.Shipment_hello == '' ? '<span class="red">Не оплачено</span>' : '<span class="green">Оплачено</span>'
                    all_data.push({
                        client_id: id_client,
                        name: accounts[i].account.Name,
                        shipment_hello: status_html,
                        volume: +deleteSpaces(sum_volume.volume),
                        average_volume: Math.ceil(+deleteSpaces(sum_hello_volume) / +deleteSpaces(sum_volume.volume)),
                        amount_hello: Math.ceil(+deleteSpaces(sum_hello_volume)),
                        amount: Math.round(+deleteSpaces(accounts[i].account.Sum) * 0.9)
                    });
                    total_count++;
                }
            }
            if (!$('div').is('#analytics_block_hidden')) {
                $('.fields').append(`
                    <div id="info_in_accounts">
                        <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count} ${current_count_accounts(total_count, 'счет', 1)}</span> 
                        <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                        <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">
                    </div>
                `)
                // <div id="analytics_3" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                $('#select_period').datepicker({
                    maxDate: new Date(),
                    dateFormat: 'dd.mm.yyyy',
                    range: true,
                    toggleSelected: false,
                    multipleDatesSeparator: ' - ',
                    onSelect: (formattedDate, date, inst) => {
                        const date_range = [];
                        if (date.length == 2) {
                            console.log(date)

                            selectPeriodInAnalytics(date)

                            let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                myDatepicker.hide();
                        }
                    }
                })
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
                        all_data[i].amount = Math.round((+deleteSpaces(all_data[i].amount) + +deleteSpaces(all_data[j].amount)));
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
                            <td>${all_data[i].shipment_hello}</td>
                            <td>${returnSpaces(all_data[i].volume)}</td>
                            <td>${returnSpaces(all_data[i].average_volume)}</td>
                            <td>${returnSpaces(all_data[i].amount_hello)}</td>
                            <td>${returnSpaces(Number(all_data[i].amount_hello * 0.9).toFixed(1))}</td>
                        </tr>
                    `
                } else {
                    unload_table.push({ name: all_data[i].name, volume: returnSpaces(all_data[i].volume),
                        average_volume: returnSpaces(all_data[i].average_volume), hello: returnSpaces(all_data[i].amount_hello), amount: returnSpaces(all_data[i].amount)});
                }
            }
            let all_amount_hello = 0;
            for (let i = 0; i < all_data.length; i++) {
                all_amount_hello += all_data[i].amount_hello * 0.9;
            }
            $('#all_amount_hello').remove();
            $('#subcategories').after(`<div class="row" id="all_amount_hello"><div style="padding: 0 0 20px; color: #595959;">Сумма по счетам: <span class="red">${returnSpaces(Number(all_amount_hello).toFixed(1))}</span></div></div>`);
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
                        <th id="an_status" onclick="selectFilterStatusAn(this)">
                            <div class="flex jc-sb">
                                <span>Статус</span>
                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                            </div>
                        </th>
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
        $('#all_amount_profit').remove();
        $('#all_amount_hello').remove();
        categoryInAnalytics[0].last = 4;
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
                    && date_create_account >= date_period[0] && date_create_account <= date_period[1] && account.shipment_list != null && account_data_copy[i].account != null) {
                    for (let g = 0; g < amount_two.length; g++) {
                        amount.push(amount_two[g]);
                    }

                    for (let l = 0; l < amount.length - 1; l++) {
                        for (let h = l + 1; h < amount.length; h++) {
                            if (amount[l].id === amount[h].id) {
                                amount[l].amount = +deleteSpaces(amount[l].amount) + +deleteSpaces(amount[h].amount);
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
                    && date_create_account >= date_period[0] && date_create_account <= date_period[1] && account.shipment_list != null && account_data_copy[i].account != null) {
                    for (let g = 0; g < volume_two.length; g++) {
                        volume_one.push(volume_two[g]);
                    }

                    for (let l = 0; l < volume_one.length - 1; l++) {
                        for (let h = l + 1; h < volume_one.length; h++) {
                            if (volume_one[l].id === volume_one[h].id) {
                                volume_one[l].volume = +deleteSpaces(volume_one[l].volume) + +deleteSpaces(volume_one[h].volume);
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
                th += `<th width="120">${all_items[i].Name}</th>`
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
                            general_amount += Math.round(+deleteSpaces(items_amount[element].amount));
                        }
                        all_amounts += general_amount;
                        td += `<td>${returnSpaces(general_amount)}</td>`
                        let unload_table_ = [{id: 'total', name: 'Итого', volume: +deleteSpaces(general_amount)}];
                        if (!unload_status) {
                            for (let j = 0; j < items_volume.length; j++) {
                                for (let k = 0; k < all_items.length; k++) {
                                    if (+all_items[k].Item_id == +items_volume[j].id) {
                                        amounts[k] += +deleteSpaces(items_volume[j].volume);
                                        td += `<td id="item_${k + 1}">${returnSpaces(items_volume[j].volume)}</td>`
                                        if (items_volume.length - 1 != j) {
                                            j++;
                                        }
                                    } else {
                                        td += `<td id="item_${k + 1}">0</td>`
                                    }
                                }
                            }
                        } else {
                            for (let j = 0; j < items_volume.length; j++) {
                                for (let l = 0; l < all_items.length; l++) {
                                    let create_status = 0;
                                    for (let element = 0; element < unload_table_.length; element++) {
                                        if (unload_table_[element].id == items_volume[j].id) {
                                            create_status++;
                                        }
                                    }

                                    function findItemName(id) {
                                        for (let i = 0; i < all_items.length; i++) {
                                            if (all_items[i].Item_id == id) {
                                                return all_items[i].Name; 
                                            }
                                        }
                                    }
                                    
                                    if (create_status == 0) {
                                        unload_table_.push({id: +items_volume[j].id, name: findItemName(+items_volume[j].id)});
                                    }
                                    
                                    if (+all_items[l].Item_id == +items_volume[j].id) {
                                        for (let g = 0; g < unload_table_.length; g++) {
                                            if (unload_table_[g].id == items_volume[j].id) {
                                                unload_table_[g].volume = +deleteSpaces(items_volume[j].volume);
                                            }
                                        }
                                        if (items_volume.length - 1 != j) {
                                            j++;
                                        }
                                    } else {
                                        let count = 0;
                                        for (let g = 0; g < unload_table_.length; g++) {
                                            if (unload_table_[g].id != all_items[l].Item_id) {
                                                count++;
                                            }
                                        }
                                        if (count == unload_table_.length) {
                                            unload_table_.push({id: all_items[l].Item_id, name: all_items[l].Name, volume: 0})
                                        }
                                    }
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
                    return `<td>0</td>`.repeat(all_items.length + 1);
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
                        <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                        <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">

                    </div>
                `)
                // <div id="analytics_4" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                $('#select_period').datepicker({
                    maxDate: new Date(),
                    dateFormat: 'dd.mm.yyyy',
                    range: true,
                    toggleSelected: false,
                    multipleDatesSeparator: ' - ',
                    onSelect: (formattedDate, date, inst) => {
                        const date_range = [];
                        if (date.length == 2) {
                            console.log(date)

                            selectPeriodInAnalytics(date)

                            let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                myDatepicker.hide();
                        }
                    }
                })
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
                <div style="overflow-x: auto; overflow-y: scroll; position: relative;">
                    <table class="table analytics" style="width: max-content; margin-bottom: 0px">
                        <tr>
                            <th width="170">Менеджер</th>
                            <th width="130">Итого</th>
                            ${outputAllItems()}
                        </tr>
                        ${fillTable()}
                    </table>
                </div>
            `
        }
    }
    // Проделанная работа
    function analyticsFilterTable_6(date_period, unload_status = false, filter_manager = '') {
        $('#all_amount_hello').remove();
        $('#all_amount_profit').remove();
        categoryInAnalytics[0].last = 6;
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
                    console.log(result);
                    let total_count = 0;
                    let unload_info = [];
                    for (let i = 0; i < result.data.length; i++) {
                        let count = 0, length = 0;

                        for (let key in result.data[i].orgs) {
                            let current_date = getValidationDate(result.data[i].orgs[key]);
                            if (current_date >= date_period[0] && current_date <= date_period[1]) length++;
                        }

                        let table = '<tbody class="tr_tr">';
                        for (let key in result.data[i].orgs) {
                            let current_date = getValidationDate(result.data[i].orgs[key]);
                            if (current_date >= date_period[0] && current_date <= date_period[1] && (filter_manager == result.data[i].name || filter_manager == '')) {
                                if (!unload_status) {
                                    let data_one = key.split('$$');
                                    if (count == 0) {
                                        table += `
                                            <tr>
                                                <td name="username_analytics" rowspan="${length}">${result.data[i].name}</td>
                                                <td onclick="openThisCardMenu(this)" id="${data_one[2]}_${data_one[1]}_search">${data_one[0]}</td>
                                                <td>${result.data[i].orgs[key]}</td>
                                            </tr>
                                        `
                                    } else {
                                        table += `
                                            <tr>
                                                <td onclick="openThisCardMenu(this)" id="${data_one[2]}_${data_one[1]}_search">${data_one[0]}</td>
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
                        if (table != '<tbody class="tr_tr">' && !unload_status) {
                            tbody += table + '</tbody>';
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
                                <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                                <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">

                            </div>
                        `)
                        // <div id="analytics_5" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                        $('#select_period').datepicker({
                            maxDate: new Date(),
                            dateFormat: 'dd.mm.yyyy',
                            range: true,
                            toggleSelected: false,
                            multipleDatesSeparator: ' - ',
                            onSelect: (formattedDate, date, inst) => {
                                const date_range = [];
                                if (date.length == 2) {
                                    console.log(date)
        
                                    selectPeriodInAnalytics(date)
        
                                    let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                        myDatepicker.hide();
                                }
                            }
                        })
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
    // Баллы и бонусы
    function analyticsFilterTable_5(date_period, unload_status = false, filter_manager = '') {
        $('#all_amount_hello').remove();
        $('#all_amount_profit').remove();
        categoryInAnalytics[0].last = 5;
        function fillTable() {
            let tbody = '';
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
                    let account_data = JSON.parse(data);
                    let total_count = 0;
                    let unload_info = [];
                    let current_manager_id, next_manager_id;

                    account_data.sort(function (a, b) {
                        if (a.account.Manager_id < b.account.Manager_id) {
                          return 1;
                        }
                        if (a.account.Manager_id > b.account.Manager_id) {
                          return -1;
                        }
                        return 0;
                    });

                    let amount_clients = 0;
                    let amount_items_only_mound = 0;
                    let amount_bonus = 0;

                    for (let i = 0; i < account_data.length; i++) {
                        if (account_data[i].account.Payment_history == '' || account_data[i].account.Payment_history == null) {
                            continue;
                        }

                        if (i < account_data.length - 1) {
                            next_manager_id = account_data[i + 1].account.Manager_id
                        }
                        current_manager_id = account_data[i].account.Manager_id
                        
                        let payment_list = JSON.parse(account_data[i].account.Payment_history);
                        let shipment_list;
                        if (account_data[i].account.Shipment_list != '' && account_data[i].account.Shipment_list != null) {
                            shipment_list = JSON.parse(account_data[i].account.Shipment_list);
                        } else {
                            shipment_list = [];
                        }
                        let payment_date;
                        let payment_amount = 0;
                        for (let j = 0; j < payment_list.length; j++) {
                            payment_amount += +deleteSpaces(payment_list[j].sum);
                            payment_date = payment_list[j].date;
                        }
                        let table = '<tbody class="tr_tr">';
                        if (+payment_amount == +deleteSpaces(account_data[i].account.Sum)) {
                            let current_date = getValidationDate(account_data[i].account.Date);
                            let month_period = datePeriod('month');
                            let manager_surname;
                            let half_year_period = datePeriod('half_year');

                            let last_shipment_date;
                            if (shipment_list.length == 1){
                                last_shipment_date = getValidationDate(shipment_list[0].date);
                            } else if (shipment_list.length == 0) {
                                last_shipment_date = getValidationDate('01.01.10');
                            } else {
                                for (let shipment_item = 1; shipment_item < shipment_list.length; shipment_item++) {
                                    console.log(shipment_list);
                                    let valid_first_date = shipment_list[0].date != '' ? getValidationDate(shipment_list[0].date) : getValidationDate('01.01.10');
                                    let valid_second_date = shipment_list[shipment_item].date != '' ? getValidationDate(shipment_list[shipment_item].date) : getValidationDate('01.01.10');
                                    if (valid_first_date < valid_second_date) {
                                        last_shipment_date = valid_second_date;
                                        shipment_list.splice(0, 1);
                                        shipment_item--;
                                    } else {
                                        last_shipment_date = valid_first_date;
                                    }
                                }
                            }

                            $.ajax({
                                url: '/getUsers',
                                type: 'GET',
                                dataType: 'html',
                                async: false,
                                success: function(result) {
                                    result = JSON.parse(result);
                                    for (let ii = 0; ii < result.length; ii++) {
                                        if (result[ii].id == account_data[i].account.Manager_id) {
                                            manager_surname = result[ii].second_name;
                                            break;
                                        }
                                    }
                                }
                            });

                            let items;
                            $.ajax({
                                url: '/getStockTable',
                                type: 'GET',
                                async: false,
                                dataType: 'html',
                                success: function(data) {
                                    items = JSON.parse(data);
                                }
                            });
                            let items_id = JSON.parse(account_data[i].account.Item_ids);

                            for (let account = 0; account < account_data.length; account++) {
                                if (account_data[account].account.Manager_id == account_data[i].account.Manager_id && current_date >= month_period[0] && current_date <= month_period[1]
                                    && account_data[i].account.id == account_data[account].account.id) {
                                    
                                    for (let j = 0; j < account_data[account].items.length; j++) {
                                        for (let volume = 0; volume < items_id.length; volume++) {
                                            if (account_data[account].items[j].Category == 'Насыпь' && items_id[volume].id == account_data[account].items[j].Item_id) {
                                                amount_items_only_mound += +deleteSpaces(items_id[volume].volume)
                                            }
                                        } 
                                    }
                                }
                            }
                        
                            if (current_date >= date_period[0] && current_date <= date_period[1] && (filter_manager == manager_surname || filter_manager == '')) {
                                let all_volume = 0;
                                for (let volume = 0; volume < items_id.length; volume++) {
                                    all_volume += +deleteSpaces(items_id[volume].volume);
                                }
                                
                                        let count = 0;
                                        
                                        // if (getValidationDate(payment_date) <= last_shipment_date) {
                                        //     //amount_clients++;
                                        //     last_shipment_date = getValidationDate('01.01.10');
                                        // }
                                        let old_new_account;
                                        for (let j = 0; j < account_data.length; j++) {
                                            if (account_data[i].account.Name == account_data[j].account.Name &&
                                                account_data[i].account.id != account_data[j].account.id) {
                                                    if (account_data[j].account.Payment_history == '' || account_data[j].account.Payment_history == null) {
                                                        continue;
                                                    }
                                                    let payment_list_second = JSON.parse(account_data[j].account.Payment_history);
                                                    let payment_date_second;
                                                    let payment_amount_second = 0;
                                                    for (let l = 0; l < payment_list_second.length; l++) {
                                                        payment_amount_second += +deleteSpaces(payment_list_second[l].sum);
                                                        payment_date_second = payment_list_second[l].date;
                                                    }
                                                    if (payment_date == '') {
                                                        payment_date = '01.01.25'
                                                    } 
                                                    if (payment_date_second == '') {
                                                        payment_date_second = '01.01.25'
                                                    }
                                                    console.log(getValidationDate(payment_date), getValidationDate(payment_date_second))
                                                    if (getValidationDate(payment_date) <= getValidationDate(payment_date_second)) {
                                                        old_new_account = 'new';
                                                    } else {
                                                        old_new_account = 'old';
                                                        break;
                                                    }
                                                }
                                        }
                                        if (!(payment_date >= half_year_period[0] && payment_date <= half_year_period[1]) && old_new_account == 'new') {
                                            amount_clients++;
                                        }
                                        console.log(account_data[i].account)
                                        console.log(payment_date)
                                        console.log(old_new_account)

                                        for (let current_item = 0; current_item < items_id.length; current_item++) {
                                            for (let stock = 0; stock < items.length; stock++) {
                                                for (let item = 0; item < items[stock].items.length; item++) {
                                                    if (items_id[current_item].id == items[stock].items[item].Item_id) {
                                                        let new_client_coefficient_mound = [
                                                            {plus: 0.05, rate: [1, 40000]},
                                                            {plus: 0.06, rate: [40001, 80000]},
                                                            {plus: 0.07, rate: [80001, 120000]},
                                                            {plus: 0.08, rate: [120001, 160000]},
                                                            {plus: 0.09, rate: [160001, 200000]},
                                                            {plus: 0.10, rate: [200001, 10000000]},
                                                        ]
                                                        let current_bonus = 0;
                                                        let new_client_coefficient_not_mound = 0.8
                                                        let old_client_coefficient_not_mound = 0.6;
                                                        let additional_bonus_in_new_client_mound = 0;
                    
                                                        let current_coefficient = 0;

                                                        if (items[stock].items[item].Category == 'Насыпь') {
                                                            for (let coeff = 0; coeff < new_client_coefficient_mound.length; coeff++) {
                                                                if (new_client_coefficient_mound[coeff].rate[0] <= all_volume && new_client_coefficient_mound[coeff].rate[1] > all_volume) {
                                                                    current_coefficient = new_client_coefficient_mound[coeff].plus;
                                                                    break;
                                                                }
                                                            }
                                                            
                                                            if (!(payment_date >= half_year_period[0] && payment_date <= half_year_period[1]) && old_new_account == 'new') {
                                                                // console.log(+deleteSpaces(items_id[current_item].volume) * 0.05);
                                                                console.log('AYE, TRUE');
                                                                additional_bonus_in_new_client_mound = +deleteSpaces(items_id[current_item].volume) * 0.05;
                                                            }
                                                        } else {
                                                            if ((payment_date >= half_year_period[0] && payment_date <= half_year_period[1]) && old_new_account == 'new') {
                                                                console.log('AYE, TRUE');
                                                                current_coefficient = old_client_coefficient_not_mound;
                                                            } else {
                                                                current_coefficient = new_client_coefficient_not_mound;
                                                            }
                                                        }
                                                        console.log(current_coefficient, additional_bonus_in_new_client_mound);
                                                        // Неверно считается коэф за нового клиента. Сравнивать еще одинаковые названия и получает коэф тот, кто оплачен раньше и не имеет отгрузки за последние пол года
                                                        // Если есть отгрузка но до нее нет ни одной - то считать ее как новую
                                                        current_bonus = +deleteSpaces(items_id[current_item].volume) * current_coefficient + additional_bonus_in_new_client_mound;
                                                        amount_bonus += current_bonus;
                                                        if (!unload_status) {
                                                            if (count == 0) {
                                                                table += `
                                                                    <tr>
                                                                        <td name="username_analytics" rowspan="${items_id.length}">${manager_surname}</td>
                                                                        <td rowspan="${items_id.length}">${payment_date}</td>
                                                                        <td rowspan="${items_id.length}">${account_data[i].account.Name}</td>
                                                                        <td name="${items[stock].items[item].Category}" id="item_${items[stock].items[item].Item_id}">${items[stock].items[item].Name}</td>
                                                                        <td rowspan="${items_id.length}">${returnSpaces(all_volume)}</td>
                                                                        <td>${returnSpaces(current_bonus)}</td>
                                                                    </tr>
                                                                `
                                                            } else {
                                                                table += `
                                                                    <tr>
                                                                        <td name="${items[stock].items[item].Category}" id="item_${items[stock].items[item].Item_id}">${items[stock].items[item].Name}</td>
                                                                        <td>${returnSpaces(current_bonus)}</td>
                                                                    </tr>
                                                                `
                                                            }
                                                        } else {
                                                            unload_info.push({manager: manager_surname, payment_date: payment_date, name: account_data[i].account.Name,
                                                                              item_name: items[stock].items[item].Name, volume: all_volume, bonus: current_bonus,
                                                                              clients: amount_clients, items_mound: amount_items_only_mound, amount_bonus: amount_bonus});
                                                        }
                                                        count++;
                                                    }
                                                }
                                            }
                                        }
                                total_count++;
                                if (table != '<tbody class="tr_tr">' && !unload_status) {
                                    tbody += table + `</tbody>`;
                                }
                                if (next_manager_id != current_manager_id || i + 1 == account_data.length - 1) {
                                    tbody += `
                                        <tr>
                                            <td style="font-weight: 500" colspan="3">Новых клиентов: ${amount_clients}</td>
                                            <td style="font-weight: 500" colspan="2">Насыпь: ${returnSpaces(amount_items_only_mound)}</td>
                                            <td style="font-weight: 500" colspan="1">Бонус за месяц: ${returnSpaces(amount_bonus)}</td>
                                        </tr>
                                    `
                                    amount_clients = 0;
                                    amount_items_only_mound = 0;
                                    amount_bonus = 0;
                                }
                            }
                        } else {
                            if (next_manager_id != current_manager_id || i + 1 == account_data.length - 1) {
                                tbody += `
                                    <tr>
                                        <td style="font-weight: 500" colspan="3">Новых клиентов: ${amount_clients}</td>
                                        <td style="font-weight: 500" colspan="2">Насыпь: ${returnSpaces(amount_items_only_mound)}</td>
                                        <td style="font-weight: 500" colspan="1">Бонус за месяц: ${returnSpaces(amount_bonus)}</td>
                                    </tr>
                                `
                                amount_clients = 0;
                                amount_items_only_mound = 0;
                                amount_bonus = 0;
                            }
                        }
                    }
                    if (unload_status) {
                        tbody = unload_info;
                        return;
                    }
                    if (!$('div').is('#analytics_block_hidden')) {
                        $('.fields').append(`
                            <div id="info_in_accounts">
                                <span id="info_in_accounts_count" style="margin-right: 5px;">${total_count}</span> 
                                <input type="text" placeholder="Выберите период" style="outline: none; border: none; font-family: 'Montserrat', sans-serif; width: 150px; font-size: 13px; border-radius: 5px; color: #595959; position: relative; top: -2px; left: 6px;" id="select_period">
                                <img style="width: 22px; position: relative; top: -2px; left: 10px;" src="/static/images/calendar.svg">

                            </div>
                        `)
                        // <div id="analytics_6" name="unload_table" class="btn btn-main btn-div" onclick="unloadThisTable(this.id)" style="width: 90px; margin-left: 30px;">Выгрузить</div>

                        $('#select_period').datepicker({
                            maxDate: new Date(),
                            dateFormat: 'dd.mm.yyyy',
                            range: true,
                            toggleSelected: false,
                            multipleDatesSeparator: ' - ',
                            onSelect: (formattedDate, date, inst) => {
                                const date_range = [];
                                if (date.length == 2) {
                                    console.log(date)
        
                                    selectPeriodInAnalytics(date)
        
                                    let myDatepicker = $(`#select_period`).datepicker().data('datepicker');
                                        myDatepicker.hide();
                                }
                            }
                        })
                        $('body').append(`<div id="analytics_block_hidden"></div>`)
                    } else {
                        $('#info_in_accounts_count').html(`${total_count}`);
                    }
                }
            });
            return tbody;
        }
        if (unload_status) {
            return fillTable();
        } else {
            return `
                <table class="table analytics" id="bonus_table">
                    <tr>
                        <th id="pd_manager" onclick="selectManagerAnalytics(this)">
                            <div class="flex jc-sb">
                                <span>Менеджер</span>
                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                            </div>
                        </th>
                        <th>Дата</th>
                        <th>Наименование</th>
                        <th>Товар</th>
                        <th>Объем</th>
                        <th>Бонус</th>
                    </tr>
                    ${fillTable()}
                </table>
            `
        }
    }
    function openThisCardMenu(element) {
        let list = [
            {id: 'carrier', request: '/getCarriers', table: categoryInListCarrier},
            {id: 'client', request: '/getClients', table: categoryInListClient},
            {id: 'provider', request: '/getProviders', table: categoryInListProvider},
        ]
        if ($('#subcategories .category').html() == 'АНАЛИТИКА') {
            $('#subcategories').empty();
            addButtonsSubcategory(0);
            $('#clientButton').addClass('active');
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i].id == element.id.split('_')[0]) {
                $.ajax({
                    url: list[i].request,
                    type: 'GET',
                    dataType: 'html',
                    success: function(result) {
                        result = JSON.parse(result);
                        if (list[i].table[1][1] == undefined) list[i].table[1].push(result);
                        openCardMenu(element);
                    }
                });
                break;
            }
        }
    }
    function selectManagerAnalytics(element) {
        let id = element.id;
        function listManager() {
            let ul = $('<ul>', { class: 'list'});
            let filter_table = [], data;
    
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    data = JSON.parse(result);
                }
            });
            for (let i = 0; i < data.length; i++) {
                for (let name of $('[name="username_analytics"]')) {
                    console.log($(name).html(), data[i].second_name);
                    if ($('table').is('#bonus_table')) {
                        if (data[i].second_name == $(name).html()) {
                            filter_table.push({ name: $(name).html(), id: data[i].id});
                        }
                    } else {
                        if (data[i].second_name == $(name).html().split(' ')[1] && data[i].name == $(name).html().split(' ')[0]) {
                            filter_table.push({ name: $(name).html(), id: data[i].id});
                        }
                    }
                }
            }

            for (let i = 0; i < filter_table.length - 1; i++) {
                for (let j = i + 1; j < filter_table.length; j++) {
                    if (filter_table[i].id == filter_table[j].id) {
                        filter_table.splice(j, 1);
                        j--;
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
                if ($('table').is('#bonus_table')) {
                    $('.table').remove();
                    $('.info').append(analyticsFilterTable_5(datePeriod(date_filter[i].id), false, searchWord));
                } else {
                    $('.table').remove();
                    $('.info').append(analyticsFilterTable_6(datePeriod(date_filter[i].id), false, searchWord));
                }
                break;
            }
        }
        setTimeout(function() {
            $('#pd_manager .drop_arrow').removeClass('drop_active');
        }, 150)
    }
    // function visibleSelectPeriodInAnalytics() {
    //     if ($('div').is('.period_info_accounts')) {
    //         $('.period_info_accounts').remove();
    //     } else {
    //         $('#select_period_info_accounts').append(`
    //             <div class="period_info_accounts">
    //                 <ul>
    //                     <li id="day" onclick="selectPeriodInAnalytics(this.id)">за последний день</li>
    //                     <li id="weak" onclick="selectPeriodInAnalytics(this.id)">за последнюю неделю</li>
    //                     <li id="month" onclick="selectPeriodInAnalytics(this.id)">за последний месяц</li>
    //                     <li id="year" onclick="selectPeriodInAnalytics(this.id)">за последний год</li>
    //                     <li id="all" onclick="selectPeriodInAnalytics(this.id)">за все время</li>
    //                 </ul>
    //             </div>
    //         `) 
    //     }
    // }
    function selectPeriodInAnalytics(date) {
        let list = [
            {function: analyticsFilterTable_0, name: 'Прибыль по клиентам'},
            {function: analyticsFilterTable_1, name: 'Сводный по объёмам'},
            {function: analyticsFilterTable_2, name: 'По клиентам'},
            {function: analyticsFilterTable_3, name: 'По приветам'},
            {function: analyticsFilterTable_4, name: 'Отгрузки менеджеров'},
            {function: analyticsFilterTable_5, name: 'Баллы и бонусы'},
            {function: analyticsFilterTable_6, name: 'Проделанная работа'},
        ]

        for (let i = 0; i < list.length; i++) {
            if (list[i].name == $('#analytics_reports #active_field').html()) {
                $('.table').remove();
                $('.info').append(list[i].function(date));
                break;
            }
        }
    }
    function datePeriod(period) {
        let date_filter = [
            {id: 'day', period: 0, text: 'за последний день'},
            {id: 'weak', period: 7, text: 'за последнюю неделю'},
            {id: 'month', period: 30, text: 'за последний месяц'},
            {id: 'half_year', period: 180},
            {id: 'year', period: 365, text: 'за последний год'},
            {id: 'all', period: 5475, text: 'за все время'},
        ]
        for (let i = 0; i < date_filter.length; i++) {
            if (period == date_filter[i].id) {
                let today = getCurrentDate('year');
                let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)/;
    
                let date_arr = datetime_regex.exec(today);
                let first_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                let second_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                second_datetime.setDate(second_datetime.getDate() - date_filter[i].period);
                if (period != 'half_year') $('#period_accounts').html(date_filter[i].text);
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
            {function: analyticsFilterTable_5, id: 5},
            {function: analyticsFilterTable_6, id: 6}
        ]
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == number) {
                let current_data = list[i].function(datePeriod('all'), true);
                const link = document.createElement('a');
                link.href = `/excelStat?id=${number}&data=${JSON.stringify(current_data)}`;
                link.download = 'Аналитика.xlsx';
                link.click();
            }
        }
    }
    function selectFilterStatusAn(element) {
        let id = element.id;
        function listCustomer() {
            let ul = $('<ul>', { class: 'list'});
            let filter_table = ['Оплачено', 'Не оплачено'];
            for (let i = 0; i < filter_table.length; i++) {
                ul.append(`
                    <li id="${i + 1}" onclick="sortTableByStatusAn(this)">${filter_table[i]}</li>
                `)
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
                append: listCustomer()
            }))
            $('.filter_list').fadeIn(100);
        }, 250);
    }
    function sortTableByStatusAn(element) {
        let searchWord = element.innerHTML;
        $('.centerBlock .header .cancel').remove();

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
                $('.info').append(analyticsFilterTable_3(datePeriod(date_filter[i].id), false, searchWord));
                break;
            }
        }
        setTimeout(function() {
            $('#an_status .drop_arrow').removeClass('drop_active');
        }, 150)
    }