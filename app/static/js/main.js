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
        getRequest: function (table) {
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
                if (table[0].id !== 'analytics') table[1].push(data);
                $('.info').append(fillingTables(table));
            }
        }
    }
})();