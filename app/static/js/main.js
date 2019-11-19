/**
 * Category:
 * id: category-0 = List
 * id: category-1 = Finance
 * id: category-2 = Delivery
 * id: category-3 = Stock
 * id: category-4 = Analytics 
 */

$(document).ready(function() {
    addButtonsSubcategory(0);
    requestData.getRequest();
    createCategoryMenu();
    createCTButtons();
    linkField();
    $('#clientButton, #category-0').addClass('active');
});

function gettingData(data) {
    categoryInListClient[1].push(data);
    $('.info').append(fillingTables(categoryInListClient));
}

let requestData = (function() {
    return {
        getRequest: function () {
            $.ajax({
                url: '/getClients',
                type: 'GET',
                dataType: 'html',
                success: function(data){
                    gettingData(JSON.parse(data));
                }
            });
        }
    }
})();