$(document).ready(function() {
    addButtonsSubcategory(0);
    requestTableData.getRequest(categoryInListClient);
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
});

// Отсылаем данные для получения данных по таблице
let requestTableData = (function() {
    return {
        getRequest: function (table, input = false) {
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
                        success: function(data){
                            gettingData(JSON.parse(data));
                        }
                    });
                }
            }

            function gettingData(data) {
                if (table[0].id !== 'analytics' && table[1][1] === undefined) table[1].push(data);
                if (!input) $('.info').append(fillingTables(table));
            }
        }
    }
})();
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
                    success: function() {}
                });
            }
        }
    })();

    // Отсылаем данные для создания/сохранения карточки
    let idData = {};
    const data = id.split('_');
    const card = data[data.length - 1];

    for (let i = 0; i < idCardFields.length; i++) {
        if (data[0] == idCardFields[i].name) {
            const request = idCardFields[i].request;
            for (let j = 0; j < idCardFields[i].ids.length; j++) {
                idData[idCardFields[i].ids[j]] = $(`#${idCardFields[i].ids[j]}`).val();
            }
            idData[`${data[0]}_data`] = card;
            console.log(idData);
            createOrSaveCard.getRequest(idData, request);
            break;
        }
    }
}