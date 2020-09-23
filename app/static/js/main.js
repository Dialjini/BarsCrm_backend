let socket = io();
let preloader = document.getElementById("preloader_preload");
let client_filter = '', provider_filter = '', carrier_filter = '';

$(document).ready(function() {
    getUserInfo()
    addButtonsSubcategory(0);
    getTableData(categoryInListClient);
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
    socket.emit('connection')
    socket.emit('showTasks');
});

socket.on('showTasks', function(data) {
    $('#current_tasks').empty();
    $('#expired_tasks').empty();
    taskCreate(data);
});
socket.on('refreshTasks', function() {
    socket.emit('showTasks');
});
let user;
socket.on('user joined', function() {
});

function fadeOutPreloader(el) {
    el.style.opacity = 1;
    let interpreloader = setInterval(function() {
        el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity <= 0.05) {
            clearInterval(interpreloader);
            preloader.style.display = "none";
        }
    },16);
    $('#preloader').remove();
}

function getUserInfo() {
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            let role = data.role;
            let surname = data.second_name;
            user = data;
            $('.page').append(`
                <div name="offtop__load" id="${data.role}::${data.id}::${data.second_name}"></div>
            `)
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
function getTableData(table, input = false, close = false, close_card = false) {
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
                        let data = {};
                        console.log($('#search').val());
                        if ($('#search').val() != '') {
                            searchCategoryInfo();
                            setTimeout(() => {
                                $('.card_menu, .overflow').remove();
                            }, 0);
                            $('#loading').remove();
                            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                        } else {
                            $.ajax({
                                url: requests[i].request,
                                type: 'GET',
                                dataType: 'html',
                                data: data,
                                beforeSend: function() {
                                    function fillTable() {
                                        return $('<div>', { class: 'table', id: 'loading' });
                                    }
                                    $('.info').append(fillTable());
                                    $('#loading').fadeIn(100);
                                    if (!$('div').is('#preloader')) {
                                        $('body').append(`
                                            <div id="preloader">
                                                <div id="preloader_preload"></div>
                                            </div>
                                        `)
                                        preloader = document.getElementById("preloader_preload");
                                    }
                                },
                                success: function(data) { gettingData(JSON.parse(data)); },
                                complete: function() {
                                    $('#loading').remove();
                                    setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
                                }
                            });
                        }
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
                    
                    if (table[0].id === 'debit') {
                        if (table[1][1] !== undefined) {
                            table[1].pop(data);
                        }
                        table[1].push(data);
                    }
                    if (table[0].id !== 'analytics') {
                        if (table[1][1] != undefined) table[1].pop();
                        table[1].push(data);
                    }
                    if (table[0].id == 'client') {
                        client_all_data = table[1][1].slice();
                        
                    } 
                    if (table[0].id == 'provider') {
                        provider_all_data = table[1][1].slice();
                    } 
                    if (table[0].id == 'carrier') {
                        carrier_all_data = table[1][1].slice();
                    } 
                    
                    if (!input) $('.info').append(fillingTables(table));
                    
                    if (saveTableAndCard[0].id == 'analytics') {
                        if (user.role == 'manager') {
                            $('#analytics_reports .field_with_modal')[0].children[0].innerHTML = 'Сводный по объёмам';
                            $('.table').width('fit-content');
                        }
                    }
                    
                    if (table[0].id == 'client' || table[0].id == 'carrier' || table[0].id == 'provider') {
                        console.log(input, close);
                        sortTableByArea('min', false, close_card);
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
                    $('#find_competitor').remove();
                    $('#amount_cards').remove();
                    if (saveTableAndCard[0].id == 'client') {
                        $('.fields').append(`<div class="btn btn-main btn-div" id="find_competitor" onclick="searchByCompetitor()">Поиск по конкурентам</div>`)
                    }     
                    if (   saveTableAndCard[0].id == 'client' 
                        || saveTableAndCard[0].id == 'carrier'
                        || saveTableAndCard[0].id == 'account') $('#info_in_accounts').remove()
                    if (saveTableAndCard[0].name == 'Список')   $('.fields').append(`<div id="amount_cards"><span>${saveTableAndCard[1][1].length}</span></div>`)
                    if (saveTableAndCard[0].id == 'provider')   $('#amount_cards').remove();
                    if (saveTableAndCard[0].id == 'account') {
                        $('#invoice_search_items').keydown(function(e) {
                            if (e.keyCode === 13) {
                                searchItemsInAccount();
                            }
                        });
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
function saveInfoCard(id, close = false, elem = null, checkINN = 'none') {
    let createOrSaveCard = (function() {
        return {
            getRequest: function (idData, request) {
                console.log(idData, request)
                $.ajax({
                    url: request,
                    type: 'GET',
                    data: idData,
                    dataType: 'html',
                    success: function() {
                        addItemsInfo();
                        addMembersInfo(close, idData);
                    }
                });
            }
        }
    })();

    // Отсылаем данные для создания/сохранения карточки
    let idData = {};
    const data = id.split('_');
    let card = data[data.length - 1];

    if (data[0] == 'account' && card == 'new') {
        card = categoryInFinanceAccount[1][1].length + 1;
    }

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
            dataType: 'html',
            success: function() { 
                if (data[data.length - 1] == 'new') {
                    return getTableData(saveTableAndCard);
                } else {
                    $.ajax({
                        url: '/getStockTable',
                        type: 'GET',
                        dataType: 'html',
                        success: function(data) {
                            data = JSON.parse(data);
                            $.ajax({
                                url: '/getAccounts',
                                type: 'GET',
                                dataType: 'html',
                                success: function(account_data) {
                                    account_data = JSON.parse(account_data);
                                    let name, date;
                                    let idsItems = [];
                                    for (let element of $('#exposed_list .invoiled')) {
                                        let idProduct = $(element).attr('id').split('_')[1];
                                        for (let i = 0; i < data.length; i++) {
                                            for (let j = 0; j < data[i].items.length; j++) {
                                                let account = data[i].items[j];
                                                if (account.Item_id == idProduct) {
                                                    idsItems.push({ id: +idProduct, volume: $(`#invoiled_volume_${idProduct}`).val() });
                                                }
                                            }
                                        }
                                    }
                                    console.log(account_data);
                                    for (let i = 0; i < account_data.length; i++) {
                                        if (account_data[i].account.id == idAccount) {
                                            name = account_data[i].account.Name;
                                            date = account_data[i].account.Date;
                                            shipment = account_data[i].account.Shipment;
                                            manager_id = account_data[i].account.Manager_id;
                                        }
                                    }
                                    
                                    if (idsItems.length > 0) {
                                        let sale = [], privet = [], delivery = [], items_amount = [];
                                        for (let element of $('#exposed_list .invoiled')) {
                                            let idProduct = $(element).attr('id').split('_')[1];
                                            sale.push($(element).children()[7].children[0].value);
                                            privet.push($(element).children()[8].children[0].value);
                                            delivery.push($(element).children()[9].children[0].value);
                                            items_amount.push({ id: +idProduct, amount: $(element).children()[11].innerHTML });
                                        }

                                        let sum = $('#total').html();
                                        $.ajax({
                                            url: '/editAccount',
                                            type: 'GET',
                                            data: {account_id: +idAccount, status: String($('#account_status').prop('checked')),
                                                name: name, date: date, manager_id: manager_id,
                                                hello: JSON.stringify(privet), sale: JSON.stringify(sale), shipping: JSON.stringify(delivery),
                                                items_amount: JSON.stringify(items_amount), sum: sum, item_ids: JSON.stringify(idsItems),
                                                total_costs: $('#total_costs_inv').val(), sale_costs: $('#total_discount_inv').val(),
                                                hello_costs: $('#total_privet_inv').val(), delivery_costs: $('#total_delivery_inv').val(),
                                                shipment: shipment, shipment_hello: $('#shipment_date').val()},
                                            dataType: 'html',
                                            success: function() {
                                                categoryInFinanceAccount[1].pop();
                                                categoryInFinanceAccount[1].push(account_data);
                                                getTableData(categoryInFinanceAccount);
                                            }
                                        })
                                    } else if (idsItems.length == 0) {
                                        alert('Невозможно отредактировать счет, ни один товара нет в счете!');
                                        return;
                                    }
                                }
                            });
                        }
                    })
                }
            }
        });
    }
                                                     // Временно, пока не будет заполнение счетов и дебита
    if (card === 'contract' || data[0] == 'stock' || data[0] == 'debit') {
        getTableData(saveTableAndCard);
        return;
    }
    console.log(id, close, elem, checkINN)

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
            console.log(idData);
            if (id.includes('client_close_card_')) {
                if (idData[`client_name`] == '' || idData[`client_name`] == null) {
                    $('#preloader').remove();
                    return $('.page').append($('<div>', { class: 'background' }).add(`
                        <div class="modal_select">
                            <div class="title">
                                <span>Ошибка</span>
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <div class="message">
                                    <p style="font-size: 14px; color: #595959;">Наименование клиента должно быть указано!</p>
                                </div>
                            </div>
                        </div>
                    `));
                }
                if (idData[`client_region`] == '' || idData[`client_region`] == null) {
                    $('#preloader').remove();
                    return $('.page').append($('<div>', { class: 'background' }).add(`
                        <div class="modal_select">
                            <div class="title">
                                <span>Ошибка</span>
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <div class="message">
                                    <p style="font-size: 14px; color: #595959;">Область/Край должен(а) быть выбран(а)!</p>
                                </div>
                            </div>
                        </div>
                    `));
                }
                if (idData[`client_area`] == '' || idData[`client_area`] == null) {
                    $('#preloader').remove();
                    return $('.page').append($('<div>', { class: 'background' }).add(`
                        <div class="modal_select">
                            <div class="title">
                                <span>Ошибка</span>
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <div class="message">
                                    <p style="font-size: 14px; color: #595959;">Район должен быть выбран!</p>
                                </div>
                            </div>
                        </div>
                    `));
                }
                let clients = [];
                $.ajax({
                    url: '/getClients',
                    type: 'GET',
                    async: false,
                    success: function(data) {
                        clients = JSON.parse(data);
                    }
                })
                let name = idData[`client_name`];
                console.log(idData);
                let area = idData[`client_area`];
                let region = idData[`client_region`];
                console.log(clients);
                for (let client of clients) {
                    if (client.Oblast == region && client.Rayon == area && client.Name == name && client.id != id.split('_').pop()) {
                        $('#preloader').remove();
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                            <div class="modal_select">
                                <div class="title">
                                    <span>Ошибка</span>
                                    <img onclick="closeModal()" src="static/images/cancel.png">
                                </div>
                                <div class="content">
                                    <div class="message">
                                        <p style="font-size: 14px; color: #595959;">"${name}" уже есть в районе ${area}!</p>
                                    </div>
                                </div>
                            </div>
                        `));
                    }
                }   
            }
            if (checkINN == 'check') {
                for (let elem = 0; elem < categoryInListClient[1][1].length; elem++) {
                    if (categoryInListClient[1][1][elem].id == idData.client_data && (categoryInListClient[1][1][elem].Manager_id == null || categoryInListClient[1][1][elem].Manager_id == '')) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                            <div class="modal_select">
                                <div class="title">
                                    <span>Ошибка</span>
                                    <img onclick="closeModal()" src="static/images/cancel.png">
                                </div>
                                <div class="content">
                                    <div class="message">
                                        <p style="font-size: 13px; color: #595959;">Необходимо прикрепить менеджера к этой карточке</p>
                                    </div>
                                </div>
                            </div>
                        `));
                    }
                }
                if (data[0] == 'client' || data[0] == 'carrier') {
                    if (data[0] == 'client') {
                        if (idData[`client_name`] == '' || idData[`client_name`] == null) {
                            $('#preloader').remove();
                            return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Наименование клиента должно быть указано!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                        }
                        if (idData[`client_region`] == '' || idData[`client_region`] == null) {
                            return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Область/Край должен(а) быть выбран(а)!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                        }
                        if (idData[`client_area`] == '' || idData[`client_area`] == null) {
                            return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Район должен быть выбран!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                        }
                        let clients = [];
                        $.ajax({
                            url: '/getClients',
                            type: 'GET',
                            async: false,
                            success: function(data) {
                                clients = JSON.parse(data);
                            }
                        })
                        let name = idData[`client_name`];
                        let area = idData[`client_area`];
                        let region = idData[`client_region`];
                        console.log(clients)
                        for (let client of clients) {
                            if (client.Oblast == region && client.Rayon == area && client.Name == name && client.id != id.split('_').pop()) {
                                console.log(client, id)
                                $('#preloader').remove();
                                return $('.page').append($('<div>', { class: 'background' }).add(`
                                    <div class="modal_select">
                                        <div class="title">
                                            <span>Ошибка</span>
                                            <img onclick="closeModal()" src="static/images/cancel.png">
                                        </div>
                                        <div class="content">
                                            <div class="message">
                                                <p style="font-size: 14px; color: #595959;">"${name}" уже есть в районе ${area}!</p>
                                            </div>
                                        </div>
                                    </div>
                                `));
                            }
                        }
                    }
                    if (isNaN(+idData[`${data[0]}_address`].slice(0, 6))) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 13px; color: #595959;">В начале адреса нужно указать почтовый индекс, содержащий 6 цифр</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                    if (idData[`${data[0]}_inn`] == '') {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Введите ИНН</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    } else if (idData[`${data[0]}_inn`].length < 10 || idData[`${data[0]}_inn`].length > 12) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 13px; color: #595959;">ИНН должен содержать от 10 до 12 цифр</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                    if (idData[`${data[0]}_bik`].length != 9) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">БИК должен содержать 9 цифр</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                    if (idData[`${data[0]}_kc`].length != 20) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Корреспондентский счёт должен содержать 20 цифр</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                    if (idData[`${data[0]}_rc`].length != 20) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Расчётный счёт должен содержать 20 цифр</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                }
            }
            createOrSaveCard.getRequest(idData, request);
            break;
        }
    }

    function additionalData(i) {
        let data_role = $('[name="offtop__load"').attr('id').split('::');
        let this_user = {role: data_role[0], id: data_role[1]};

        if (data[0] == 'client') {
            idData[`livestock_general`] = $('#livestock_general').val();
            idData[`livestock_milking`] = $('#livestock_milking').val();
            idData[`livestock_milkyield`] = $('#livestock_milkyield').val(); 
            if (data[data.length - 1] == 'new') {
                idData[`manager_id`] = this_user.role == 'manager' ? this_user.id : 'admin';  
                idData[`manager_active`] = true;  
                idData[`manager_date`] = getCurrentDateNotComparison('year'); 
            } 
        }
        if (data[0] == 'provider') {
            idData[`provider_create_date`] = getCurrentDateNotComparison('year');
            if (data[data.length - 1] == 'new') {
                idData[`manager_id`] = this_user.role == 'manager' ? this_user.id : 'admin';  
                idData[`manager_active`] = true;  
                idData[`manager_date`] = getCurrentDateNotComparison('year'); 
            } 
        }
        if (data[0] == 'carrier') {
            idData[`items_delivery`] = JSON.stringify([]);
        }
        idData[`${data[0]}_data`] = card;
        idData[`${data[0]}_site`] = $(`#${data[0]}_site`).val() !== '' ? $(`#${data[0]}_site`).val() : $(`#${data[0]}_site`).html();
        idData[`${data[0]}_holding`] = $(`#${data[0]}_holding`).val() !== '' ? $(`#${data[0]}_holding`).val() : $(`#${data[0]}_holding`).html();
    }

    function addItemsInfo() {
        let list = [
            {id: 'client', request: 'getClients'},
            {id: 'carrier', request: 'getCarriers'},
            {id: 'provider', request: 'getProviders'},
        ]
        let current_request = list.filter((element) => element.id == saveTableAndCard[0].id)[0];
        let items = [];
        if (card == 'new') {
            $.ajax({
                url: current_request.request,
                type: 'GET',
                async: false,
                success: function(data) {
                    data = JSON.parse(data);
                    saveTableAndCard[1][1] = data;
                    card = saveTableAndCard[1][1].length;
                }
            })
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
        console.log({category: data[0], id: card, item: JSON.stringify(items)})
        if (data[0] != 'carrier') {
            $.ajax({
                url: '/addItems',
                type: 'GET',
                data: {category: data[0], id: card, item: JSON.stringify(items)},
                dataType: 'html',
                success: function() {}
            });
        }
    }

    let categ = data[0];
    function addMembersInfo(close, idData) {
        let list = [
            {id: 'client', request: '/getClients'},
            {id: 'carrier', request: '/getCarriers'},
            {id: 'provider', request: '/getProviders'},
        ]
        let current_request = list.filter((element) => element.id == saveTableAndCard[0].id)[0];
        let members = [];
        if (card == 'new') {
            $.ajax({
                url: current_request.request,
                type: 'GET',
                async: false,
                success: function(data) {
                    data = JSON.parse(data);
                    saveTableAndCard[1][1] = data;
                    card = saveTableAndCard[1][1].length;
                }
            })
        }
        saveTableAndCard[1][1].forEach(function(element) {
            if (current_request.id == 'carrier') {

            } else {
                if (element.Name == idData.client_name && element.Oblast == idData.client_region && element.Rayon == idData.client_area) {
                    console.log(element)
                    card = element.id;
                }
            }
        })
        $('#member .member').each(function(i, element) {
            let current_id = $(element).attr('name').split('_')[1];
            let new_id = $(element).attr('id');
            let temp = {};
            let visible = $(element).children()[1].id.includes('visible') ? true : false;
            let variables = ['role', 'last_name', 'first_name', 'car', 'phone', 'phone_two', 'email'];
            let type = current_id == 'new' ? `#${new_id}` : `[name="contact_${current_id}"]`
            variables.forEach((element) => temp[element] = $(`${type} [name="${element}"]`).val());
            temp['visible'] = visible;
            temp['id'] = current_id;
            if (temp.car == undefined) temp.car = 'null';
            console.log(temp);
            if (temp.id == 'new') {
                members.push(temp)
            } else {
                $.ajax({
                    url: '/editContact',
                    type: 'GET',
                    data: {id: temp.id, first_name: temp.first_name, last_name: temp.last_name, role: temp.role, car: temp.car,
                           phone: temp.phone, phone_two: temp.phone_two, email: temp.email, visible: temp.visible},
                    dataType: 'html',
                    success: function(data) {
                        console.log(data);
                    }
                });
            }
        });
        
        console.log({category: data[0], id: card, contacts: members})
        $.ajax({
            url: '/addContacts',
            type: 'GET',
            data: {category: data[0], id: card, contacts: JSON.stringify(members)},
            dataType: 'html',
            success: function() {
                if (elem !== null) {
                    removeCard(elem);
                }
                getTableData(saveTableAndCard, false, close, true);
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
                let data_role = $('[name="offtop__load"').attr('id').split('::');
                let user = {role: data_role[0], id: data_role[1], second_name: data_role[2]};
                console.log(data_role, user)
                let list = {
                    comment_date: $('#comment_date').val(),
                    comment_role: $('#comment_role').val(),
                    comment_content: $('#comment_content').val(),
                    comment_creator: user.second_name,
                    comment_creator_id: user.id
                };
                data = data.split('_');
                if (list.comment_role == null || list.comment_content == '') {
                    getComments();
                    return;
                }
                let count = 0, array = Object.keys(list);
                for (let i = 1; i < 3; i++) {
                    if (list[array[i]] == '' || list[array[i]] == null) {
                        count++;
                    } 
                }
                if (count == 2) {
                    return getComments();
                }
                console.log({category: data[0], id: data[1], comments: JSON.stringify(list)});
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
                if (data[1] == 'new') return;
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
        console.log(comments, data);
        if (comments.length == 0) 
            addComment();
        else {
            $(`#messages, #comments`).empty();
            let list_managers = [];
            for (let i = 0; i < comments.length; i++) {
                list_managers.push({
                    name: comments[i].Manager,
                    date: comments[i].Date.split(' ')[0],
                    note: comments[i].Note,
                    id: comments[i].NoteId,
                    creator: comments[i].Creator,
                });
            }
            for (let i = 0; i < list_managers.length - 1; i++)
                addComment(list_managers[i], data)
            addComment(list_managers[list_managers.length - 1], data, true);
        }
        if ($(`#messages`).children().length <= 1) {
            $(`[name="remove_last_comment"]`).fadeOut(0);
        }
        if (data[2] == 'search') {
            let list = [
                {id: 'client', category: categoryInListClient},
                {id: 'provider', category: categoryInListProvider},
                {id: 'carrier', category: categoryInListCarrier},
            ]
            list.forEach(function (element) {
                element.category[0].active = false;
                if (element == data[0]) {
                    element.category[0].lastCard[0] = $('.card_menu');
                    element.category[0].active = true;
                }
            })
            
            console.log(123);
            $('#search').val('');
            // linkCategory('category-0');
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
    if (saveTableAndCard[0].id == 'client') {
        client_filter = ''
    } else if (saveTableAndCard[0].id == 'provider') {
        provider_filter = ''
    } else if (saveTableAndCard[0].id == 'provider') {
        carrier_filter = ''
    }

    $('#search').val('');

    for (let i = 0; i < dataName.length; i++) {
        if (saveTableAndCard[0].id == dataName[i].name) {
            if (saveTableAndCard[0].id == 'stock') {
                $('.row').remove();
                addButtonsSubcategory(3);
                linkField();
            }
            getTableData(dataName[i].link);
            break;
        }
    }
    $('.centerBlock .header .cancel').remove();
    $('.modal_search').remove();
    $('.overflow').remove();
    lastData = {
        last_id: '',
        last_table: '',
    }
    filter_parameters = [ {name: 'Group_name', filter: ''}, {name: 'Name', filter: ''}, {name: 'stock_address', filter: ''} ];
    categoryInFilterStock[1][1] = [];
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
}
function showRegionList(element) {
    const $ul = $(element).closest('div.region').children('ul.list_regions');
    const $img = $(element).children('img');

    $img.toggleClass('active');
    $ul.toggleClass('d_none');
}
function searchRegionFill(element) {
    $('.centerBlock .header .cancel').remove();

    let search = $(element).html();
    if (saveTableAndCard[0].id == 'client') {
        client_filter = {type: 'Oblast', value: search};
    } else if (saveTableAndCard[0].id == 'provider') {
        provider_filter = {type: 'Oblast', value: search};
    } else if (saveTableAndCard[0].id == 'provider') {
        carrier_filter = {type: 'Region', value: search};
    }

    let listData = [
        { data: client_all_data, id: 'client', list: 'Oblast', filter: filterClient },
        { data: provider_all_data, id: 'provider', list: 'Oblast', filter: filterProvider },
        { data: carrier_all_data, id: 'carrier', list: 'Region', filter: filterCarrier },
    ]
    console.log(saveTableAndCard);
    let searchCards = [];
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id == saveTableAndCard[0].id) {
            let data = listData[i].data.length > 0 ? listData[i].data : saveTableAndCard[1][1];
            console.log(data);
            for (let j = 0; j < data.length; j++) {
                let string = String(data[j][listData[i].list]).toLowerCase();
                console.log(string, search.toLowerCase())
                if (string == search.toLowerCase()) {
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
            sortStatus.search_on_regions.status = true;
            $('#amount_cards span').html(searchCards.length)
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
function searchFill(element) {
    $('.centerBlock .header .cancel').remove();

    let search = $(element).html();
    if (saveTableAndCard[0].id == 'client') {
        client_filter = {type: 'Rayon', value: search};
    } else if (saveTableAndCard[0].id == 'provider') {
        provider_filter = {type: 'Rayon', value: search};
    } else if (saveTableAndCard[0].id == 'provider') {
        carrier_filter = {type: 'Area', value: search};
    }

    let listData = [
        { data: client_all_data, id: 'client', list: 'Rayon', filter: filterClient },
        { data: provider_all_data, id: 'provider', list: 'Rayon', filter: filterProvider },
        { data: carrier_all_data, id: 'carrier', list: 'Area', filter: filterCarrier },
    ]
    let searchCards = [];
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id == saveTableAndCard[0].id) {
            let data = listData[i].data.length > 0 ? listData[i].data : saveTableAndCard[1][1];
            for (let j = 0; j < data.length; j++) {
                let string = String(data[j][listData[i].list]).toLowerCase();
                console.log(string, search)
                if (string == search.toLowerCase()) {
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
            listData[i].filter[1][1] = searchCards.reverse();
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
    $('.modal_select').remove();
    $('.overflow').remove();
    $('.background').remove();

    createCardMenu(element);
}
function searchCategoryInfo() {
    $('.centerBlock .header .cancel').remove();
    let searchInfo = $('#search').val();
    if ($('#active_comment_seach').prop('checked')) {
        $.ajax({
            url: '/findComments',
            type: 'GET',
            data: {data: searchInfo},
            dataType: 'html',
            success: function(result) {
                $('.modal_search').remove();
                $('.overflow').remove();

                let data = JSON.parse(result);
                function fillTable() {
                    let table = $('<table>', { class: 'table_search' });
                    table.append(`
                        <tr>
                            <th>Должность</th>
                            <th>Имя Отчество</th>
                            <th width="300">Организация</th>
                            <th>Дата создания</th>
                            <th width="200">Комментарий</th>
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
                                        let manager_info = data[i].Manager.split('|');
                                        tr.append(`
                                            <td>${manager_info[0] == undefined ? '' : manager_info[0]}</td>
                                            <td>${manager_info[1] == undefined ? manager_info[0] : manager_info[1]}</td>
                                            <td>${currentDataBySelectTable[j].Name}</td>
                                            <td>${data[i].Date}</td>
                                            <td><p style="width: 200px" class="clip">${data[i].Note}</p></td>
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
                            <span>Поиск</span>
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
        })
    } else if ($('#active_comment_seach_name').prop('checked')) {
        $('.modal_search').remove();
        $('.overflow').remove();
        let list = [
            {id: 'client', filter_table: filterClient},
            {id: 'provider', filter_table: filterProvider},
            {id: 'carrier', filter_table: filterCarrier},
            {id: 'debit', filter_table: filterAccount},
            {id: 'account', filter_table: filterAccount},
            {id: 'delivery', filter_table: filterDelivery},
        ]

        for (let i = 0; i < list.length; i++) {
            if (saveTableAndCard[0].id == list[i].id) {
                let data = saveTableAndCard[1][1];
                let table = [];
                for (let j = 0; j < data.length; j++) {
                    let current_name = return_current_name();
                    function return_current_name() {
                        if (saveTableAndCard[0].id == 'account') return data[j].account.Name.toLowerCase()
                        else if (saveTableAndCard[0].id == 'delivery') return data[j].delivery.Name.toLowerCase()
                        else return data[j].Name.toLowerCase()
                    }
                    if (current_name.includes(searchInfo.toLowerCase())) {
                        table.push(data[j]);
                    }
                }
                list[i].filter_table[1][1] = table;
                $('.table').remove();
                $('.info').append(fillingTables(list[i].filter_table));
                break;
            }
        }

        $('.centerBlock .header .cancel').remove();
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
    } else {
        $.ajax({
            url: '/findContacts',
            type: 'GET',
            data: {data: searchInfo},
            dataType: 'html',
            success: function(result) {
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
                            <span>Поиск по номеру телефона/фамилии/почте</span>
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
    }
}