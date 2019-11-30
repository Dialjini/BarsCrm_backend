$(document).ready(function() {
    addButtonsSubcategory(0);
    getTableData(categoryInListClient);
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
});

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
                    { table: categoryInFinanceAccount, request: '/getClients' },
                    { table: categoryInDelivery, request: '/getClients' },
                    { table: categoryInStock, request: '/getClients' },
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
                }
            }
        }
    })();
    requestTableData.getRequest(table, input, close)
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
                        addItemsInfo()
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
            console.log(idData);
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
            members.push({
                role: $(element).children()[0].children[0].value,
                phone: $(element).children()[0].children[1].value,
                last_name: $(element).children()[1].children[0].value,
                first_name: $(element).children()[1].children[1].value,
                email: $(element).children()[1].children[2].value
            })
            let data = Object.keys(members[members.length - 1]);
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                if (members[members.length - 1][data[i]] == '') count++;
            }
            if (count == data.length) members.pop();
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