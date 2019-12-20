let socket = io();

$(document).ready(function() {
    addButtonsSubcategory(0);
    getTableData(categoryInListClient);
    createCategoryMenu();
    createCTButtons();
    linkField();
    getUserInfo()
    $('#clientButton, #category-0').addClass('active');
    socket.emit('connection')
    socket.emit('showTasks');
    socket.on('showTasks', function(data) {
        taskCreate(data);
    });
    socket.on('refreshTasks', function() {
        socket.emit('showTasks');
    });
    socket.on('user joined', function() {
    });
});


function getUserInfo() {
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            let role = data.role;
            let surname = data.second_name;
            
            if (role == 'admin') 
                 role = 'Администратор'
            else role = 'Менеджер'
            if (surname == undefined) 
                 surname = ''

            $('#username').append(`
                <div class="name">${surname} ${data.name}</div>
            `)
            $('#username').append(`
                <div class="descr">${role}</div>
            `)
            socket.emit('add user', surname)
        }
    });
}

// Отсылаем данные для получения данных по таблице
function getTableData(table, input = false, close = false) {
    let requestTableData = (function() {
        return {
            getRequest: function (table, input, close) {
                const requests = [
                    { table: categoryInListClient, request: '/getClients' },
                    { table: categoryInListProvider, request: '/getProviders' },
                    { table: categoryInListCarrier, request: '/getCarriers' },
                    { table: categoryInFinanceDebit, request: '/getAccounts' },
                    { table: categoryInFinanceAccount, request: '/getAccounts' },
                    { table: categoryInDelivery, request: '/getDeliveries' },
                    { table: categoryInStock, request: '/getStockTable' },
                    { table: categoryInAnalytics, request: '/getClients' },
                ]
    
                for (let i = 0; i < requests.length; i++) {
                    if (requests[i].table === table) {
                        $.ajax({
                            url: requests[i].request,
                            type: 'GET',
                            dataType: 'html',
                            beforeSend: function() {
                                function fillTable() {
                                    return $('<div>', { class: 'table', id: 'loading' });
                                }
                                $('.info').append(fillTable());
                                $('#loading').fadeIn(100);
                            },
                            success: function(data) { gettingData(JSON.parse(data)); },
                            complete: function() {
                                $('#loading').remove();
                            }
                        });
                    }
                }
    
                function gettingData(data) {
                    if (($('table').is('.table') && !close) || ($('div').is('.card_menu') && !close)) {
                        $('.table').remove();
                        for (let i = table[0].lastCard.length - 1; i >= 0; i--) {
                            if (table[0].lastCard[i] != null) {
                                table[0].lastCard[i] = null;
                            }
                        }
                        table[1].pop();
                        setTimeout(() => {
                            $('.card_menu, .overflow').remove();
                        }, 0);
                    }
                    if (table[0].id !== 'analytics' && table[1][1] === undefined) {
                        table[1].push(data);
                    }
                    if (!input) $('.info').append(fillingTables(table));
                    if (table[0].id == 'client' || table[0].id == 'carrier' || table[0].id == 'provider') {
                        sortTableByArea('min', false);
                    }
                    $(`.drop-down, #search_dropMenu`).removeClass('active');
                    $('.drop_down_search').remove();
                    $.ajax({
                        url: '/getUsers',
                        type: 'GET',
                        dataType: 'html',
                        success: function(data) {
                            $('#empty_customer_cards').empty();
                            if (table[0].id == 'client') {
                                fillingDisableCardClient(JSON.parse(data));
                            } else if (table[0].id == 'provider') {
                                fillingDisableCardProvider(JSON.parse(data));
                            }
                        }
                    });
                    if (saveTableAndCard[0].id == 'client') {
                        $('.fields').append(`
                            <div class="btn btn-main btn-div" id="find_competitor" onclick="searchByCompetitor()">Поиск по конкурентам</div>
                        `)
                    } else {
                        $('#find_competitor').remove();
                    }
                }
            }
        }
    })();
    requestTableData.getRequest(table, input, close)
}

function fillingDisableCardClient(managers) {
    let dataClient = categoryInListClient[1][1];

    function fillName(id) {
        for (let i = 0; i < managers.length; i++) {
            if (managers[i].id == id) {
                return `Снято с ${managers[i].second_name}`;
            }
        }
        return ``;
    }

    function fillDate(date) {
        if (date == null || date == '') {
            return `За этой карточкой ни разу не был закреплен менеджер`;
        } else {
            return `Свободна с <span id="free_card_date" class="bold">${date}</span>`;
        }
    }

    for (let i = 0; i < dataClient.length; i++) {
        if (!dataClient[i].Manager_active) {
            $('#empty_customer_cards').prepend($('<div>', {
                class: 'fieldInfo padd',
                id: `client_${dataClient[i].id}`,
                onclick: 'createCardMenu(this)',
                append: $('<div>', { class: 'name', html: dataClient[i].Name })
                .add($('<div>', {
                    class: 'row',
                    append: $('<div>', {
                        class: 'descr',
                        html: fillName(dataClient[i].Manager_id)
                    }).add($('<div>', {
                        class: 'time',
                        html: fillDate(dataClient[i].Manager_date)
                    }))
                }))
            }));
        }
    }
}

function fillingDisableCardProvider(managers) {
    let dataProvider = categoryInListProvider[1][1];

    function fillName(id) {
        for (let i = 0; i < managers.length; i++) {
            if (managers[i].id == id) {
                return `Снято с ${managers[i].second_name}`;
            }
        }
        return ``;
    }

    function fillDate(date) {
        if (date == null) {
            return `За этой карточкой ни разу не был закреплен менеджер`;
        } else {
            return `Свободна с <span id="free_card_date" class="bold">${date}</span>`;
        }
    }

    for (let i = 0; i < dataProvider.length; i++) {
        if (!dataProvider[i].Manager_active) {
            $('#empty_customer_cards').prepend($('<div>', {
                class: 'fieldInfo padd',
                id: `provider_${dataProvider[i].id}`,
                onclick: 'createCardMenu(this)',
                append: $('<div>', { class: 'name', html: dataProvider[i].Name })
                .add($('<div>', {
                    class: 'row',
                    append: $('<div>', {
                        class: 'descr',
                        html: fillName(dataProvider[i].Manager_id)
                    }).add($('<div>', {
                        class: 'time',
                        html: fillDate(dataProvider[i].Manager_date)
                    }))
                }))
            }));
        }
    }
}

// Отсылаем данные для сохранения данных по таблице
function saveInfoCard(id, close = false, elem = null) {
    let createOrSaveCard = (function() {
        return {
            getRequest: function (idData, request) {
                $.ajax({
                    url: request,
                    type: 'GET',
                    data: idData,
                    dataType: 'html',
                    success: function() {
                        addItemsInfo();
                        addMembersInfo(close);
                    }
                });
            }
        }
    })();

    // Отсылаем данные для создания/сохранения карточки
    let idData = {};
    const data = id.split('_');
    let card = data[data.length - 1];

    if (card !== 'contract') {
        if (!checkEmail()) return
    }

    if (data[0] == 'account') {
        let idAccount = card;
        let payment_history = [];

        for (let tr of $('#group tr')) {
            let date = $(tr)[0].children[0].children[0].value;
            let sum = $(tr)[0].children[1].children[0].value;
            payment_history.push({date: date, sum: sum})
        }

        if (payment_history.length == 0) {
            payment_history.push({date: '', sum: ''})
        }

        $.ajax({
            url: '/addAccountPaymentHistory',
            data: {account_id: +idAccount, account_payment_history: JSON.stringify(payment_history)},
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function() {}
        });
        getTableData(saveTableAndCard);
        return;
    }
                                                     // Временно, пока не будет заполнение счетов и дебита
    if (card === 'contract' || data[0] == 'stock' || data[0] == 'debit') {
        getTableData(saveTableAndCard);
        return;
    }

    for (let i = 0; i < idCardFields.length; i++) {
        if (data[0] == idCardFields[i].name) {
            const request = idCardFields[i].request;
            for (let j = 0; j < idCardFields[i].ids.length; j++) {
                idData[idCardFields[i].ids[j]] = $(`#${idCardFields[i].ids[j]}`).val();
            }
            if (data[0] === 'provider') {
                let items = [];
                for (let element of $('#group tr')) {
                    items.push({
                        item_product: $(element).children()[0].children[0].value,
                        item_price: $(element).children()[1].children[0].value,
                        item_date: $(element).children()[2].children[0].value,
                        item_vat: $(element).children()[3].children[0].value,
                        item_packing: $(element).children()[4].children[0].value,
                        item_weight: $(element).children()[5].children[0].value,
                        item_fraction: $(element).children()[6].children[0].value,
                    })
                }
                idData['provider_item_list'] = JSON.stringify(items);
            }
            additionalData(i);
            createOrSaveCard.getRequest(idData, request);
            break;
        }
    }

    function additionalData(i) {
        if (data[0] == 'client') {
            idData[`livestock_general`] = $('#livestock_general').val();
            idData[`livestock_milking`] = $('#livestock_milking').val();
            idData[`livestock_milkyield`] = $('#livestock_milkyield').val();
            idData[`demand_product`] = $('#demand_product').val();
            idData[`demand_volume`] = $('#demand_volume').val();    
        }
        idData[`${data[0]}_data`] = card;
        idData[`${data[0]}_site`] = $(`#${data[0]}_site`).val() !== '' ? $(`#${data[0]}_site`).val() : $(`#${data[0]}_site`).html();
        idData[`${data[0]}_holding`] = $(`#${data[0]}_holding`).val() !== '' ? $(`#${data[0]}_holding`).val() : $(`#${data[0]}_holding`).html();
    }

    function addItemsInfo() {
        let items = [];
        if (card == 'new') {
            card = saveTableAndCard[1][1].length + 1;
        }
        $('#group tr').each(function(i, element) {
            if (data[0] == 'client') {
                items.push({
                    item_product: $(element).children()[0].children[0].value,
                    item_volume: $(element).children()[1].children[0].value,
                    item_creator: $(element).children()[2].children[0].value,
                    item_price: $(element).children()[3].children[0].value,
                })
            } else if (data[0] == 'provider') {
                items.push({
                    item_product: $(element).children()[0].children[0].value,
                    item_price: $(element).children()[1].children[0].value,
                    item_date: $(element).children()[2].children[0].value,
                    item_vat: $(element).children()[3].children[0].value,
                    item_packing: $(element).children()[4].children[0].value,
                    item_weight: $(element).children()[5].children[0].value,
                    item_fraction: $(element).children()[6].children[0].value,
                })
            } else {
                // Переводчики
                return;
            }
            let array = Object.keys(items[items.length - 1]);
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (items[items.length - 1][array[i]] == '') count++;
            }
            if (count == array.length) items.pop();
        });
        $.ajax({
            url: '/addItems',
            type: 'GET',
            data: {category: data[0], id: card, item: JSON.stringify(items)},
            dataType: 'html',
            success: function() {}
        });
    }

    function addMembersInfo(close) {
        let members = [];
        if (card == 'new') {
            card = saveTableAndCard[1][1].length + 1;
        }
        $('#member .member').each(function(i, element) {
            let visible_contact = $(element).children()[1].id.includes('visible') ? true : false;
            members.push({
                role: $(element).children()[0].children[0].children[0].value,
                phone: $(element).children()[0].children[0].children[1].value,
                last_name: $(element).children()[0].children[1].children[0].value,
                first_name: $(element).children()[0].children[1].children[1].value,
                email: $(element).children()[0].children[1].children[2].value,
                visible: visible_contact
            })
            let data = Object.keys(members[0]);
            let count = 0;
            for (let i = 0; i < data.length - 1; i++) {
                if (members[members.length - 1][data[i]] == '') count++;
            }
            if (count == data.length - 1) members.pop();
        });
        console.log(members);
        $.ajax({
            url: '/addContacts',
            type: 'GET',
            data: {category: data[0], id: card, contacts: JSON.stringify(members)},
            dataType: 'html',
            success: function() {
                if (elem !== null) {
                    removeCard(elem);
                }
                getTableData(saveTableAndCard, false, close);
            }
        });
        
        function removeCard(elem) {
            if ($('.close').is(`#${saveTableAndCard[0].id}_close_card_new`)) {
                $(`#${saveTableAndCard[0].id}_close_card_new`).attr('id', `${saveTableAndCard[0].id}_close_card_${saveTableAndCard[1][1].length + 1}`)
            }
            $('.card_menu').remove();
            $('.info').append($('<div>', {
                class: 'card_menu',
                id: 'contract-decor',
                append: getTitleInfo({
                    id: `${elem.id}`,
                    list: ['Оформление договора'],
                    status: `${elem.name.split('_')[1]}_contract`
                }).add($('<div>', {
                    class: 'content',
                    append: contractContentCard(elem)
                }))
            }))
            for (let i = 0; i < dataName.length; i++) {
                if (elem.id == dataName[i].name) {
                    dataName[i].link[0].lastCard[1] = $('.card_menu');
                    break;
                }
            }
        }
    }
}
let getCommentsInfo = (function() {
    return {
        getRequest: function (data) {
            if (typeof data === typeof '') {
                // Сохраняем комментарий
                let list = {
                    comment_date: $('#comment_date').val(),
                    comment_role: $('#comment_role').val(),
                    comment_content: $('#comment_content').val()
                };
                if (list.comment_role == null) {
                    addComment();
                    return;
                }
                data = data.split('_');
                let count = 0, array = Object.keys(list);
                for (let i = 0; i < 3; i++) {
                    if (list[array[i]] == '' || list[array[i]] == null) {
                        count++;
                    } 
                }
                if (count == 3) {
                    getComments();
                    return;
                }
                $.ajax({
                    url: '/addMessages',
                    type: 'GET',
                    data: {category: data[0], id: data[1], comments: JSON.stringify(list)},
                    dataType: 'html',
                    success: function(result) {
                        getComments()
                    }
                });
            } else { getComments() }
            function getComments() {
                $.ajax({
                    url: '/getMessages',
                    type: 'GET',
                    data: {category: data[0], id: data[1]},
                    dataType: 'html',
                    success: function(result) {
                        inputComments(JSON.parse(result), data);
                    }
                });
            }
        }
    }
    function inputComments(comments, data) {
        if (comments.length == 0) 
            addComment();
        else {
            $(`#messages, #comments`).empty();
            let list_managers = [];
            for (let i = 0; i < comments.length; i++) {
                list_managers.push({
                    name: comments[i].Manager,
                    date: comments[i].Date.split(' ')[0]
                });
            }
            for (let i = 0; i < list_managers.length - 1; i++) {
                for (let j = i + 1; j < list_managers.length; j++) {
                    if (list_managers[i].name === list_managers[j].name) {
                        if (list_managers[j].date != '')
                            list_managers[i].date = list_managers[j].date
                        list_managers.splice(j, 1);
                        j--;
                    }
                }
            }
            for (let i = 0; i < list_managers.length; i++)
                addComment(list_managers[i], data)
            $('#add_new_comment').attr('onclick', 'addComment()')
        }
        if ($(`#messages`).children().length <= 1) {
            $(`[name="remove_last_comment"]`).fadeOut(0);
        }
        if (data[2] == 'search') {
            if (data[0] == 'client') {
                categoryInListClient[0].lastCard[0] = $('.card_menu');
                categoryInListClient[0].active = true;
                categoryInListProvider[0].active = false;
                categoryInListCarrier[0].active = false;
            } else if (data[0] == 'provider') {
                categoryInListProvider[0].lastCard[0] = $('.card_menu');
                categoryInListProvider[0].active = true;
                categoryInListClient[0].active = false;
                categoryInListCarrier[0].active = false;
            } else if (data[0] == 'carrier') {
                categoryInListCarrier[0].lastCard[0] = $('.card_menu');
                categoryInListCarrier[0].active = true;
                categoryInListClient[0].active = false;
                categoryInListProvider[0].active = false;
            } else {
                alert('Что-то пошло не так!')
            }
        
            linkCategory('category-0');
            linkField();
        }
    }
})();

$('#search').keydown(function(e) {
    if (e.keyCode === 13) {
        searchCategoryInfo();
    }
});

$('#search_button').click(function() {
    searchCategoryInfo();
})

function cancelSearch() {
    for (let i = 0; i < dataName.length; i++) {
        if (saveTableAndCard[0].id == dataName[i].name) {
            getTableData(dataName[i].link);
            break;
        }
    }
    $('.centerBlock .header .cancel').remove();
    $('#search').val('');
    $('.modal_search').remove();
    $('.overflow').remove();
    sortStatus = {
        product: {status: false, filter: null, last: null},
        price: {status: false, filter: null},
        area: {status: false, filter: null},
        category: {status: false, filter: null, last: null},
        manager: {status: false, filter: null, last: null}
    }
}

function searchFill(element) {
    $('.centerBlock .header .cancel').remove();

    let search = $(element).html();
    let data = saveTableAndCard[1][1];
    let listData = [
        { id: 'client', list: 'Rayon', filter: filterClient },
        { id: 'provider', list: 'Rayon', filter: filterProvider },
        { id: 'carrier', list: 'Region', filter: filterCarrier },
    ]
    let searchCards = [];
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id == saveTableAndCard[0].id) {
            for (let j = 0; j < data.length; j++) {
                let string = String(data[j][listData[i].list]).toLowerCase();
                if (string.includes(search.toLowerCase())) {
                    searchCards.push(data[j]);
                }
            }
            let clientCards = [];
            for (let j = 0; j < searchCards.length; j++) {
                if (searchCards[j].Category === 'Клиент') {
                    clientCards.push(searchCards[j]);
                    searchCards.splice(j, 1);
                    j--;
                }
            }
            for (let j = 0; j < clientCards.length; j++) {
                searchCards.push(clientCards[j]);
            }
            listData[i].filter[1][1] = searchCards;
            $('.table').remove();
            $('.info').append(fillingTables(listData[i].filter, true));
            break;
        }
    }
    $('.centerBlock .header .cancel').remove();
    $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
}
function openCardMenu(element) {
    let id = element.id.split('_');
    $('.modal_select').remove();
    $('.overflow').remove();

    createCardMenu(element);
}
function searchCategoryInfo() {
    $('.centerBlock .header .cancel').remove();

    let searchInfo = $('#search').val();
    let phone = +searchInfo;

    if (!isNaN(phone) && searchInfo.length > 3) {
        $.ajax({
            url: '/findContacts',
            type: 'GET',
            data: {data: +searchInfo},
            dataType: 'html',
            success: function(result) {
                console.log(JSON.parse(result));
                $('.modal_search').remove();
                $('.overflow').remove();

                let data = JSON.parse(result);
                function fillTable() {
                    let table = $('<table>', { class: 'table_search' });
                    table.append(`
                        <tr>
                            <th>Телефон</th>
                            <th>ФИО</th>
                            <th width="300">Организация</th>
                            <th>Должность</th>
                            <th>Статус</th>
                        </tr>
                    `)
                    for (let i = 0; i < data.length; i++) {
                        let currentDataBySelectTable, currentRequest;
                        let tr;
                        if (data[i].Client_id != null) {
                            tr = $('<tr>', { id: `client_${data[i].Client_id}_search`, onclick: 'openCardMenu(this)' })
                            currentRequest = { request: '/getClients', id: data[i].Client_id, mainTable: categoryInListClient };
                        } else if (data[i].Provider_id != null) {
                            tr = $('<tr>', { id: `provider_${data[i].Provider_id}_search`, onclick: 'openCardMenu(this)' })
                            currentRequest = { request: '/getProviders', id: data[i].Provider_id, mainTable: categoryInListProvider };
                        } else if (data[i].Carrier_id != null) {
                            tr = $('<tr>', { id: `carrier_${data[i].Carrier_id}_search`, onclick: 'openCardMenu(this)' })
                            currentRequest = { request: '/getCarriers', id: data[i].Carrier_id, mainTable: categoryInListCarrier };
                        }
                        $.ajax({
                            url: currentRequest.request,
                            type: 'GET',
                            dataType: 'html',
                            success: function(result) {
                                currentDataBySelectTable = JSON.parse(result);
                                if (currentRequest.mainTable[1][1] == undefined) {
                                    currentRequest.mainTable[1].push(currentDataBySelectTable);
                                }
                                for (let j = 0; j < currentDataBySelectTable.length; j++) {
                                    if (currentRequest.id == currentDataBySelectTable[j].id) {
                                        let status = data[i].Visible ? 'Активен' : 'Архив'
                                        tr.append(`
                                            <td>${data[i].Number}</td>
                                            <td>${data[i].Last_name} ${data[i].Name}</td>
                                            <td>${currentDataBySelectTable[j].Name}</td>
                                            <td>${data[i].Position}</td>
                                            <td>${status}</td>
                                        `)
                                        break;
                                    }
                                }
                            }
                        })
                        table.append(tr);
                    }
                    return table;
                }
                function createModalMenu() {
                    let modal_menu = $('<div>', { 
                        class: 'modal_select modal_search',
                        append: $('<div>', { class: 'title', html: `
                            <span>Поиск по номеру телефона</span>
                            <div class="close" onclick="closeModalMenu()">
                                <img src="static/images/cancel.png">
                            </div>
                        ` }).add(
                            $('<div>', { class: 'content', append: fillTable() })
                        )
                    });

                    return modal_menu;
                }
                $('.info').prepend($('<div>', {class: 'overflow'}));
                $('.overflow').height($('.container')[0].scrollHeight);
                $('.info').append(createModalMenu());
            }
        });
        return;
    }

    let data = saveTableAndCard[1][1];
    let listData = [
        { id: 'client', list: ['id', 'Name', 'Oblast', 'Rayon', 'Category'], filter: filterClient },
        { id: 'provider', list: ['Oblast', 'Rayon', 'Name', 'Group', 'Price'], filter: filterProvider },
        { id: 'carrier', list: ['Name', 'Region', 'Area', 'Capacity', 'View'], filter: filterCarrier },
        { id: 'account', list: ['Prefix', 'Date', 'Name', 'Sum', 'Status', 'Hello'], filter: filterAccount },
        { id: 'delivery', list: ['Date', 'Name', 'Stock', 'Carrier_id', 'Prefix', 'Price', 'Payment_date'], filter: filterDelivery },
    ]
    let searchCards = [];
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id == saveTableAndCard[0].id && saveTableAndCard[0].id == 'account') {
            for (let j = 0; j < data.length; j++) {
                for (let k = 0; k < listData[i].list.length; k++) {
                    let string;
                    if (listData[i].list[k] == 'Prefix') {
                        string = String(data[j].items[0][listData[i].list[k]]).toLowerCase()
                    } else {
                        string = String(data[j].account[listData[i].list[k]]).toLowerCase();
                    }
                    if (string.includes(searchInfo.toLowerCase())) {
                        searchCards.push(data[j]);
                        break;
                    }
                }
            }
            listData[i].filter[1][1] = searchCards;
            $('.table').remove();
            $('.info').append(fillingTables(listData[i].filter, true));
            break;
        }
        if (listData[i].id == saveTableAndCard[0].id && saveTableAndCard[0].id == 'delivery') {
            for (let j = 0; j < data.length; j++) {
                for (let k = 0; k < listData[i].list.length; k++) {
                    let string = String(data[j].delivery[listData[i].list[k]]).toLowerCase();
                    if (string.includes(searchInfo.toLowerCase())) {
                        searchCards.push(data[j]);
                        break;
                    }
                }
            }
            listData[i].filter[1][1] = searchCards;
            $('.table').remove();
            $('.info').append(fillingTables(listData[i].filter, true));
            break;
        }
        if (listData[i].id == saveTableAndCard[0].id) {
            for (let j = 0; j < data.length; j++) {
                for (let k = 0; k < listData[i].list.length; k++) {
                    let string = String(data[j][listData[i].list[k]]).toLowerCase();
                    if (string.includes(searchInfo.toLowerCase())) {
                        searchCards.push(data[j]);
                        break;
                    }
                }
            }
            let clientCards = [];
            for (let j = 0; j < searchCards.length; j++) {
                if (searchCards[j].Category === 'Клиент') {
                    clientCards.push(searchCards[j]);
                    searchCards.splice(j, 1);
                    j--;
                }
            }
            for (let j = 0; j < clientCards.length; j++) {
                searchCards.push(clientCards[j]);
            }
            listData[i].filter[1][1] = searchCards;
            $('.table').remove();
            $('.info').append(fillingTables(listData[i].filter, true));
            break;
        }
    }
    $('.centerBlock .header .cancel').remove();
    $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
}