$(document).ready(function() {
    addButtonsSubcategory(0);
    getTableData(categoryInListClient);
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
});

// Отсылаем данные для получения данных по таблице
function getTableData(table, input = false) {
    let requestTableData = (function() {
        return {
            getRequest: function (table, input) {
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
                                $('#loading').fadeIn(100);;
                            },
                            success: function(data) { gettingData(JSON.parse(data)); },
                            complete: function() {
                                $('#loading').remove();
                            }
                        });
                    }
                }
    
                function gettingData(data) {
                    if (table[0].id !== 'analytics' && table[1][1] === undefined) {
                        table[1].push(data);
                        table[1][1].reverse();
                    }
                    if (!input) $('.info').append(fillingTables(table));
                }
            }
        }
    })();
    requestTableData.getRequest(table, input)
}
// Отсылаем данные для сохранения данных по таблице
function saveInfoCard(id) {
    let createOrSaveCard = (function() {
        return {
            getRequest: function (idData, request) {
                $.ajax({
                    url: request,
                    type: 'GET',
                    data: idData,
                    dataType: 'html',
                    success: function() {
                        getTableData(saveTableAndCard);
                    }
                });
            }
        }
    })();

    // Отсылаем данные для создания/сохранения карточки
    let idData = {};
    const data = id.split('_');
    const card = data[data.length - 1];

    if (card === 'contract') {
        getTableData(saveTableAndCard);
        return;
    }

    for (let i = 0; i < idCardFields.length; i++) {
        if (data[0] == idCardFields[i].name) {
            const request = idCardFields[i].request;
            for (let j = 0; j < idCardFields[i].ids.length; j++) {
                idData[idCardFields[i].ids[j]] = $(`#${idCardFields[i].ids[j]}`).val();
            }
            idData[`${data[0]}_data`] = card;
            idData[`${data[0]}_site`] = $(`#${data[0]}_site`).val() !== '' ? $(`#${data[0]}_site`).val() : $(`#${data[0]}_site`).html();
            idData[`${data[0]}_holding`] = $(`#${data[0]}_holding`).val() !== '' ? $(`#${data[0]}_holding`).val() : $(`#${data[0]}_holding`).html();
            //idData[`${data[0]}_members`] = 
            getMembersInfo();
            createOrSaveCard.getRequest(idData, request);
            break;
        }
    }

    function getMembersInfo() {
        let members = [];
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
            if (count == 5) members.pop();
        });
        $.ajax({
            url: '/addContacts',
            type: 'GET',
            data: {category: data[0], id: data[1], contacts: JSON.stringify(members)},
            dataType: 'html',
            success: function(result) {
                console.log(result);
            }
        });
    }
}