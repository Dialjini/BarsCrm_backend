$(document).ready(function() {
    addButtonsSubcategory(0);
    getTableData(categoryInListClient);
    getTaskList();
    createCategoryMenu();
    createCTButtons();
    linkField();
    getUserInfo()
    $('#clientButton, #category-0').addClass('active');
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
                <div class="name">${surname + data.name}</div>
            `)
            $('#username').append(`
                <div class="descr">${role}</div>
            `)
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
                    { table: categoryInFinanceDebit, request: '/getClients' },
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
                    ;
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
        if (date == null) {
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
                                                     // Временно, пока не будет заполнение счетов и дебита
    if (card === 'contract' || data[0] == 'stock' || data[0] == 'account' || data[0] == 'debit') {
        getTableData(saveTableAndCard);
        return;
    }

    for (let i = 0; i < idCardFields.length; i++) {
        if (data[0] == idCardFields[i].name) {
            const request = idCardFields[i].request;
            for (let j = 0; j < idCardFields[i].ids.length; j++) {
                idData[idCardFields[i].ids[j]] = $(`#${idCardFields[i].ids[j]}`).val();
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
                    item_vat: $(element).children()[2].children[0].value,
                    item_packing: $(element).children()[3].children[0].value,
                    item_weight: $(element).children()[4].children[0].value,
                    item_fraction: $(element).children()[5].children[0].value,
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
    }
})();