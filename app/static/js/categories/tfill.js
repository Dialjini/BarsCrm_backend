/**
 * Функции для работы с таблиц
 */
let rowFilling = (object, id, table) => {
    let selectTableData = object[1];
    let getTitleTable = () => {
        let element = $('<tr>');
        for (let i = 0; i < object[0].length - 1; i++) {
            if (i == 2 && id == 'stock') {
                function checkRole() {
                    let data;
                    $.ajax({
                        url: '/getThisUser',
                        type: 'GET',
                        dataType: 'html',
                        async: false,
                        success: function(result) {
                            data = JSON.parse(result);
                        }
                    });
                    if (data.role == 'admin') {
                        return `<button class="btn btn-main btn-add-items" id="item_add" onclick="createCardMenu(this)">Добавить</button>`
                    }
                    return '';
                }
                elementTr = `
                <th width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        ${checkRole()}
                    </div>
                </th>`;
            } else if (i == 3 && id == 'client' || i == 1 && id == 'provider' || i == 1 && id == 'filter_provider' || i == 2 && id == 'carrier') {
                elementTr = `
                <th id="all_area" onclick="selectFilterArea(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu_black.svg" class="drop_down_img all_area">
                    </div>
                </th>`
            } else if (i == 3 && id == 'provider' || i == 3 && id == 'filter_provider') {
                elementTr = `
                <th id="pd_group" onclick="selectGroupProduct(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu_black.svg" class="drop_down_img pd_group">
                    </div>
                </th>`
            } else if (i == 4 && id == 'provider' || i == 4 && id == 'filter_provider') {
                elementTr = `
                <th id="pd_price" onclick="selectFilterPrice(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu_black.svg" class="drop_down_img pd_price">
                    </div>
                </th>`
            } else if (i == 4 && id == 'client') {
                elementTr = `
                <th id="cl_category" onclick="selectFilterCategory(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu_black.svg" class="drop_down_img cl_category">
                    </div>
                </th>`
            } else {
                elementTr = `<th width="${object[0][i].width}%">${object[0][i].name}</th>`;
            }
            element.append(elementTr);
        }
        if (id !== 'delivery' && id !== 'stock') {
            element.append(`
            <th id="pd_manager" onclick="selectManager(this)" width="${object[0][object[0].length - 1].width}%">
                <div class="flex jc-sb">
                    <span>${object[0][object[0].length - 1].name}</span>
                    <img src="static/images/dropmenu_black.svg" class="drop_down_img pd_manager">
                </div>
            </th>`);
        } else {
            element.append(`<th width="${object[0][object[0].length - 1].width}%">${object[0][object[0].length - 1].name}</th>`);
        }
        return element;
    }

    let rowFillingDefault = (id) => {
        table.append(getTitleTable());
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
        for (let i = 0; i < selectTableData.length; i++) {
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +selectTableData[i].Manager_id && selectTableData[i].Manager_active) {
                    managerSecondName = managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }

            let name, data = [
                { id: 'client', list: [selectTableData[i].id, selectTableData[i].Name, selectTableData[i].Oblast, selectTableData[i].Rayon, selectTableData[i].Category, managerSecondName] },
                { id: 'carrier', list: [selectTableData[i].Name, selectTableData[i].Region, selectTableData[i].Area, selectTableData[i].Capacity, selectTableData[i].View, managerSecondName] },
            ]

            for (let j = 0; j < data.length; j++) {
                if (data[j].id === id) {
                    name = data[j].list;
                    break;
                }
            }

            let element = $('<tr>', {id: `${id}_${selectTableData[i].id}`, onclick: 'createCardMenu(this)'});
            for (let j = 0; j < name.length; j++) {
                let currentInfo = name[j];
                if (currentInfo === null || currentInfo === '') {
                    currentInfo = 'Не указано';
                }

                let elementTr = $('<td>', { html: currentInfo });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingFilterProvider = (id) => {
        table.append(getTitleTable());
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

        for (let i = selectTableData.length - 1; i >= 0; i--) {
            let tbody = $('<tbody>', { id: `provider_${selectTableData[i].id}`, name: 'provider' , onclick: 'createCardMenu(this)' });
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +selectTableData[i].Manager_id && selectTableData[i].Manager_active) {
                    managerSecondName = managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }
            let item_list = JSON.parse(selectTableData[i].Item_list);
            if (item_list == null) item_list = [{item_product: '', item_price: ''}];
            let region = selectTableData[i].Oblast == null ? 'Не указано' : selectTableData[i].Oblast;
            let area = selectTableData[i].Rayon == null ? 'Не указано' : selectTableData[i].Rayon;
            let name = selectTableData[i].Name == null ? 'Не указано' : selectTableData[i].Name;
            tbody.append(`
                <tr>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${region}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${area}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${name}</td>
                    <td>${item_list[0].item_product}</td>
                    <td>${item_list[0].item_price}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${managerSecondName}</td>
                </tr>
            `)

            item_list = JSON.parse(selectTableData[i].Item_list);

            if (item_list != null) {
                for (let j = 1; j < item_list.length; j++) {
                    tbody.append(`
                    <tr>
                        <td>${item_list[j].item_product}</td>
                        <td>${item_list[j].item_price}</td>
                    </tr>
                    `)
                }
            }
            table.append(tbody);
        }
        return table;
    }

    let rowFillingProvider = (id) => {
        table.append(getTitleTable());
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

        for (let i = selectTableData.length - 1; i >= 0; i--) {
            let tbody = $('<tbody>', { id: `provider_${i + 1}`, name: 'provider' , onclick: 'createCardMenu(this)' });
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +selectTableData[i].Manager_id && selectTableData[i].Manager_active) {
                    managerSecondName = managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }
            let item_list = JSON.parse(selectTableData[i].Item_list);
            if (item_list == null) item_list = [{item_product: '', item_price: ''}];
            let region = selectTableData[i].Oblast == null ? 'Не указано' : selectTableData[i].Oblast;
            let area = selectTableData[i].Rayon == null ? 'Не указано' : selectTableData[i].Rayon;
            let name = selectTableData[i].Name == null ? 'Не указано' : selectTableData[i].Name;
            tbody.append(`
                <tr>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${region}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${area}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${name}</td>
                    <td>${item_list[0].item_product}</td>
                    <td>${item_list[0].item_price}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${managerSecondName}</td>
                </tr>
            `)

            item_list = JSON.parse(selectTableData[i].Item_list);

            if (item_list != null) {
                for (let j = 1; j < item_list.length; j++) {
                    tbody.append(`
                    <tr>
                        <td>${item_list[j].item_product}</td>
                        <td>${item_list[j].item_price}</td>
                    </tr>
                    `)
                }
            }
            table.append(tbody);
        }
        return table;
    }

    let rowFillingDelivery = (id) => {
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `delivery_${i + 1}`, onclick: 'createDelCardMenu(this)'});
            let carrier_name = selectTableData[i].carrier == null ? 'Не выбран' : selectTableData[i].carrier.Name
            selectTableData[i].delivery.NDS = selectTableData[i].delivery.NDS[0] + selectTableData[i].delivery.NDS[1];
            let amount = 0;
            let count = selectTableData[i].delivery.Amounts != undefined ? JSON.parse(selectTableData[i].delivery.Amounts) : [];
            let vat = selectTableData[i].delivery.Customer == 'ООО' ? 0.74 : 1.26;
            for (let i = 0; i < count.length; i++) {
                amount += +count[i];
            }
            const name = [selectTableData[i].delivery.Date, selectTableData[i].delivery.Name, selectTableData[i].delivery.Stock, carrier_name, selectTableData[i].delivery.Customer, Math.ceil(amount * vat), amount, selectTableData[i].delivery.Payment_date];
            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingAccount = (id) => {
        table.append(getTitleTable());
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
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            if (selectTableData[i].account.Payment_history != undefined) {
                let payment_list = JSON.parse(selectTableData[i].account.Payment_history);
                let amount = selectTableData[i].account.Sum;
                let payment_amount = 0;

                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +payment_list[i].sum
                }

                if (+amount <= +payment_amount) status = '<span class="green">Оплачено</span>'
                else status = '<span class="red">Неоплачено</span>'
            } else {
                status = '<span class="red">Неоплачено</span>';
            }
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +selectTableData[i].account.Manager_id) {
                    managerSecondName = managers[j].second_name == null ? 'Фамилия не указана' : managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }

            let hello_sum = 0;
            let hello_list = JSON.parse(selectTableData[i].account.Hello);
            for (let i = 0; i < hello_list.length; i++) {
                hello_sum += +hello_list[i];
            }

            let element = $('<tr>', {id: `account_${i + 1}`, onclick: 'createCardMenu(this)'});
            const name = [selectTableData[i].items[0].Prefix, selectTableData[i].account.Date, selectTableData[i].account.Name, selectTableData[i].account.Sum, status, hello_sum, managerSecondName];

            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingDebit = (id) => {
        let deliveryTable;
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
        $.ajax({
            url: '/getDeliveries',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) { deliveryTable = JSON.parse(result) },
        });
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +selectTableData[i].account.Manager_id) {
                    managerSecondName = managers[j].second_name == null ? 'Фамилия не указана' : managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }
            let payment_amount = 0;
            if (selectTableData[i].account.Payment_history != undefined) {
                let payment_list = JSON.parse(selectTableData[i].account.Payment_history);
                let amount = selectTableData[i].account.Sum;

                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +payment_list[i].sum
                }
            } else {
                payment_amount = 0;
            }

            let first_date, postponement_date;

            for (let j = 0; j < deliveryTable.length; j++) {
                if (deliveryTable[j].delivery.Account_id == i + 1) {
                    first_date = deliveryTable[j].delivery.Start_date;
                    postponement_date = deliveryTable[j].delivery.Postponement_date;
                    break;
                }
            }
            if (first_date == undefined) first_date = 'Не указано';
            if (postponement_date == undefined) postponement_date = 'Не указано';

            let element = $('<tr>', {id: `account_${i + 1}`, onclick: 'transferToAccounts(this)'});
            const name = [selectTableData[i].items[0].Prefix, selectTableData[i].account.Name, first_date, postponement_date, selectTableData[i].account.Sum, payment_amount, +selectTableData[i].account.Sum - payment_amount, managerSecondName];

            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingStock = (id) => {
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            for (let k = selectTableData[i].items.length - 1; k >= 0; k--) {
                let element = $('<tr>', {id: `stock_${selectTableData[i].items[k].Item_id}`, onclick: 'createCardMenu(this, 1)'});
                const name = [selectTableData[i].items[k].Prefix, selectTableData[i].items[k].Group_name, selectTableData[i].items[k].Name, selectTableData[i].items[k].Weight, selectTableData[i].items[k].Packing, selectTableData[i].items[k].Volume, selectTableData[i].items[k].Cost, selectTableData[i].items[k].NDS, selectTableData[i].stock_address];

                for (let j = 0; j < name.length; j++) {
                    let elementTr = $('<td>', { html: name[j] });
                    element.append(elementTr);
                }
                table.append(element);
            }
        }
        return table;
    }

    let rowFillingFilterStock = (id) => {
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `stock_${selectTableData[i].Item_id}`, onclick: 'createCardMenu(this, 1)'});
            const name = [selectTableData[i].Prefix, selectTableData[i].Group_name, selectTableData[i].Name, selectTableData[i].Weight, selectTableData[i].Packing, selectTableData[i].Volume, selectTableData[i].Cost, selectTableData[i].NDS, selectTableData[i].stock_address];

            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    const tableFunctiouns = [
        { id: 'client', function: rowFillingDefault },
        { id: 'provider', function: rowFillingProvider },
        { id: 'filter_provider', function: rowFillingFilterProvider },
        { id: 'carrier', function: rowFillingDefault },
        { id: 'debit', function: rowFillingDebit },
        { id: 'account', function: rowFillingAccount },
        { id: 'delivery', function: rowFillingDelivery },
        { id: 'stock', function: rowFillingStock },
        { id: 'filter_stock', function: rowFillingFilterStock },
    ]

    for (let element of tableFunctiouns) {
        if (element.id === id) {
            return element.function(id);
        }
    }
}
function searchByCompetitor() {
    $.ajax({
        url: '/getAllClientItems',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            let contacts_list = JSON.parse(data);
            let competitor_list = [];
            for (let i = 0; i < contacts_list.length; i++) {
                for (let j = 0; j < contacts_list[i].data.length; j++) {
                    if (contacts_list[i].data[j].Name !== 'Выбрать' && contacts_list[i].data[j].Creator !== 'Не выбран' && contacts_list[i].data[j].Creator !== 'Конкурентов нет') {
                        competitor_list.push(contacts_list[i].data[j].Client_id);
                    }
                }
            }
            let client_data = categoryInListClient[1][1];
            let filter_table = [];
            for (let i = 0; i < competitor_list.length; i++) {
                for (let j = 0; j < client_data.length; j++) {
                    if (competitor_list[i] === client_data[j].id) {
                        filter_table.push(client_data[j]);
                    }
                }
            }
            if (filterClient[1][1] != undefined) {
                filterClient[1].pop();
            }
            filterClient[1][1] = [];
            for (let i = 0; i < filter_table.length - 1; i++) {
                for (let j = i + 1; j < filter_table.length; j++) {
                    if (filter_table[i].id === filter_table[j].id) {
                        filter_table.splice(j, 1);
                        j--;
                    }
                }
            }
            for (let i = 0; i < filter_table.length; i++) {
                filterClient[1][1].push(filter_table[i]);
            }
            console.log(filterClient);
            $('.table').remove();
            $('.info').append(fillingTables(filterClient));
        }
    });
}
let sortStatus = {
    product: {status: false, filter: null, last: null},
    price: {status: false, filter: null},
    area: {status: false, filter: null},
    category: {status: false, filter: null, last: null},
    manager: {status: false, filter: null, last: null}
}
// Фильтры таблиц Start
function sortTableByCategory(filter) {
    let currentCategory = filter.innerHTML;
    let filter_table = [];
    let data;
    if (!sortStatus.manager.status && !sortStatus.area.status) {
        if (filterClient[1][1] != undefined) filterClient[1].pop();
        data = categoryInListClient[1][1];
    } else {
        if (filterClient[1][1] == undefined) {
            data = categoryInListClient[1][1];
        } else {
            data = sortStatus.category.last == null ? filterClient[1][1] : sortStatus.category.last;
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].Category === currentCategory) {
            filter_table.push(data[i]);
        }
    }
    
    if (filterClient[1][1] != undefined) {
        filterClient[1].pop();
    }
    filterClient[1][1] = filter_table;
    $('.table').remove();
    $('.info').append(fillingTables(filterClient));

    sortStatus.category.status = true;
    sortStatus.category.filter = currentCategory;

    $('.centerBlock .header .cancel').remove();
    $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
}
function sortTableByManagers(element) {
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

    for (let i = 0; i < managers.length; i++) {
        if (managers[i].role == 'manager' && managers[i].second_name == searchWord) {
            let search = managers[i].id;
            let data;
            if (saveTableAndCard[0].id == 'client') {
                if (!sortStatus.category.status && !sortStatus.area.status) {
                    if (filterClient[1][1] != undefined) filterClient[1].pop();
                    data = categoryInListClient[1][1];
                    console.log('client');
                } else {
                    if (filterClient[1][1] == undefined) {
                        data = categoryInListClient[1][1];
                        console.log('bad_filter_client');
                    } else {
                        data = sortStatus.manager.last == null ? filterClient[1][1] : sortStatus.manager.last;
                        console.log('filter_client');
                    }
                }
                sortStatus.manager.last = categoryInListClient[1][1]
            } else {
                data = saveTableAndCard[1][1]
            }
            let listData = [
                { id: 'client', list: 'Manager_id', filter: filterClient },
                { id: 'provider', list: 'Manager_id', filter: filterProvider },
                { id: 'carrier', list: 'Manager_id', filter: filterCarrier },
            ]
            let searchCards = [];
            for (let i = 0; i < listData.length; i++) {
                if (listData[i].id == saveTableAndCard[0].id) {
                    for (let j = 0; j < data.length; j++) {
                        let string = data[j][listData[i].list];
                        if (string == search) {
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
                    $('.info').append(fillingTables(listData[i].filter));
                    break;
                }
            }
            if (saveTableAndCard[0].id == 'client') {
                sortStatus.manager.status = true;
                sortStatus.manager.filter = searchWord;
            }
            
            $('.centerBlock .header .cancel').remove();
            $('.centerBlock .header').append(`
                <div class="cancel">
                    <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
                </div>
            `)
            break;
        }
    }
}
function sortTableByArea(filter, input = true) {
    let newTableData;
    if (saveTableAndCard[0].id == 'client') {
        if (!sortStatus.manager.status && !sortStatus.category.status) {
            if (filterClient[1][1] != undefined) filterClient[1].pop();
            newTableData = categoryInListClient.slice();
            console.log('client');
        } else {
            newTableData = filterClient;
            console.log('filter_client');
        }
    } else {
        newTableData = saveTableAndCard.slice();
    }
    let filter_table = [];
    let sort = filter.id == undefined ? filter : filter.id;

    for (let i = 0; i < newTableData[1][1].length; i++) {
        let oneRegion_data = [newTableData[1][1][i]]
        for (let j = i + 1; j < newTableData[1][1].length; j++) {
            if (newTableData[1][1][i].Oblast === newTableData[1][1][j].Oblast) {
                oneRegion_data.push(newTableData[1][1][j]);
                newTableData[1][1].splice(j, 1);
                j--;
            }
        }
        oneRegion_data.sort(function (a, b) {
            if (a.Rayon != undefined) {
                if (sort == 'min') {
                    if (newTableData[0].id == 'provider') {
                        if (a.Rayon < b.Rayon) return 1;
                        if (a.Rayon > b.Rayon) return -1;
                    } else {
                        if (a.Rayon > b.Rayon) return 1;
                        if (a.Rayon < b.Rayon) return -1;
                    }
                    
                } else {
                    if (newTableData[0].id == 'provider') {
                        if (a.Rayon > b.Rayon) return 1;
                        if (a.Rayon < b.Rayon) return -1;
                    } else {
                        if (a.Rayon < b.Rayon) return 1;
                        if (a.Rayon > b.Rayon) return -1;
                    }
                }
            } else {
                if (sort == 'min') {
                    if (a.Area > b.Area) return 1;
                    if (a.Area < b.Area) return -1;
                } else {
                    if (a.Area < b.Area) return 1;
                    if (a.Area > b.Area) return -1;
                }
            }
            
            return 0;
        })
        for (let k = 0; k < oneRegion_data.length; k++) {
            filter_table.push(oneRegion_data[k]);
        }
    }
    filter_table.sort(function (a, b) {
        if (a.Oblast != undefined) {
            if (newTableData[0].id == 'provider') {
                if (a.Oblast < b.Oblast) return 1;
                if (a.Oblast > b.Oblast) return -1;
            } else {
                if (a.Oblast > b.Oblast) return 1;
                if (a.Oblast < b.Oblast) return -1;
            }
        } else {
            if (a.Region > b.Region) return 1;
            if (a.Region < b.Region) return -1;
        }
        return 0;
    })
    let filter_table_client = [];
    for (let i = 0; i < filter_table.length; i++) {
        if (filter_table[i].Category === 'Клиент') {
            filter_table_client.push(filter_table[i]);
            filter_table.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < filter_table_client.length; i++) {
        filter_table.unshift(filter_table_client[i]);
    }
    if (newTableData[1][1] != undefined) {
        newTableData[1].pop();
    }
    console.log(filter_table);
    newTableData[1].push(filter_table);
    $('.table').remove();
    $('.info').append(fillingTables(newTableData, true));

    if (saveTableAndCard[0].id == 'client') {
        sortStatus.area.status = true;
        sortStatus.area.filter = sort;
    }
    
    $('.centerBlock .header .cancel').remove();
    if (input) {
        $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
    }
}
function sortTableByPrice(filter) {
    let data;
    if (!sortStatus.product.status) {
        if (filterProvider[1][1] != undefined) filterProvider[1].pop();
        data = categoryInListProvider[1][1];
    } else {
        data = filterProvider[1][1];
    }

    let filter_data = [];
    for (let i = 0; i < data.length; i++) {
        let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
        for (let j = 0; j < item_list.length; j++) {
            filter_data.push({id: data[i].id, product: item_list[j].item_product, price: +item_list[j].item_price});
        }
    }
        
    let table_data = []
    for (let i = 0; i < data.length; i++) {
        let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
        for (let k = 0; k < item_list.length; k++) {
            for (let j = 0; j < filter_data.length; j++) {
                if (filter_data[j].id == data[i].id
                    && filter_data[j].product == item_list[k].item_product
                    && filter_data[j].price == item_list[k].item_price) {
                        table_data.push({
                            Oblast: data[i].Oblast, Rayon: data[i].Rayon, Name: data[i].Name,
                            Item_list: JSON.stringify([{item_product: item_list[k].item_product, item_price: item_list[k].item_price}]),
                            Manager_id: data[i].Manager_id, id: data[i].id, Manager_active: true
                        });
                }
            }
        }
    }

    table_data.sort(function (a, b) {
        if (+JSON.parse(a.Item_list)[0].item_price > +JSON.parse(b.Item_list)[0].item_price) return 1;
        if (+JSON.parse(a.Item_list)[0].item_price < +JSON.parse(b.Item_list)[0].item_price) return -1;
        return 0;
    });

    if (filter.id == 'min') {
        table_data.reverse();
    }

    if (filterProvider[1][1] != undefined) filterProvider[1].pop();

    filterProvider[1].push(table_data)
    $('.table').remove();
    $('.info').append(fillingTables(filterProvider, true));

    sortStatus.price.status = true;
    sortStatus.price.filter = filter.id;
    $('.centerBlock .header .cancel').remove();
    $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
}
function sortTableByProduct(filter) {
    let data;
    if (!sortStatus.price.status) {
        if (filterProvider[1][1] != undefined) filterProvider[1].pop();
        data = categoryInListProvider[1][1];
    } else {
        data = sortStatus.product.last == null ? filterProvider[1][1] : sortStatus.product.last;
    }

    sortStatus.product.last = categoryInListProvider[1][1];

    console.log(data);
    let filter_data = [];
    for (let i = 0; i < data.length; i++) {
        let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
        for (let j = 0; j < item_list.length; j++) {
            filter_data.push({id: data[i].id, product: item_list[j].item_product, price: +item_list[j].item_price});
        }
    }

    let table_data = []
    for (let i = 0; i < data.length; i++) {
        let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
        for (let k = 0; k < item_list.length; k++) {
            for (let j = 0; j < filter_data.length; j++) {
                if (filter_data[j].id == data[i].id
                    && filter_data[j].product == item_list[k].item_product
                    && filter_data[j].price == item_list[k].item_price && filter.innerHTML == item_list[k].item_product) {
                        table_data.push({
                            Oblast: data[i].Oblast, Rayon: data[i].Rayon, Name: data[i].Name,
                            Item_list: JSON.stringify([{item_product: item_list[k].item_product, item_price: item_list[k].item_price}]),
                            Manager_id: data[i].Manager_id, id: data[i].id, Manager_active: true
                        });
                }
            }
        }
    }

    if (filterProvider[1][1] != undefined) filterProvider[1].pop();
    console.log(filterProvider[1])
    filterProvider[1].push(table_data)
    $('.table').remove();
    $('.info').append(fillingTables(filterProvider, true));

    sortStatus.product.status = true;
    sortStatus.product.filter = filter.innerHTML;
    $('.centerBlock .header .cancel').remove();
    $('.centerBlock .header').append(`
        <div class="cancel">
            <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
        </div>
    `)
}
// End
// Выпадающие меню Start
function selectFilterCategory(element) {
    function listCategory() {
        let ul = $('<ul>', { class: 'list'});
        let data = saveTableAndCard[1][1];
        let filter_table = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].Category != null && data[i].Category != '') {
                filter_table.push(data[i].Category);
            }
        }

        for (let i = 0; i < filter_table.length - 1; i++) {
            for (let j = i + 1; j < filter_table.length; j++) {
                if (filter_table[i] == filter_table[j]) {
                    filter_table.splice(j, 1);
                    j--;
                }
            }
        }
        console.log(filter_table);
        for (let i = 0; i < filter_table.length; i++) {
            ul.append(`
                <li onclick="sortTableByCategory(this)">${filter_table[i]}</li>
            `)
        }


        // получить список групп товаров
        return ul;
    }
    if ($('.table .cl_category').hasClass('drop_active')) {
        $('.table .cl_category').removeClass('drop_active');
        $('.list_category').fadeOut(200);
        setTimeout(function() {
            $('.list_category').remove();
        }, 200);
        return;
    }
    $('.table .cl_category').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_category',
        css: {'top': `${$(element).height() + 20}px`},
        append: listCategory()
    }))
    $('.list_category').fadeIn(200);
}
function selectFilterArea(element) {
    function listPrice() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortTableByArea(this)">От А до Я</li>
            <li id="max" onclick="sortTableByArea(this)">От Я до А</li>
        `)
        // получить список групп товаров
        return ul;
    }
    if ($('.table .all_area').hasClass('drop_active')) {
        $('.table .all_area').removeClass('drop_active');
        $('.list_area').fadeOut(200);
        setTimeout(function() {
            $('.list_area').remove();
        }, 200);
        return;
    }
    $('.table .all_area').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_area',
        css: {'top': `${$(element).height() + 20}px`},
        append: listPrice()
    }))
    $('.list_area').fadeIn(200);
}
function selectFilterPrice(element) {
    function listPrice() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortTableByPrice(this)">По возраст.</li>
            <li id="max" onclick="sortTableByPrice(this)">По убыванию</li>
        `)
        // получить список групп товаров
        return ul;
    }
    if ($('.table .pd_price').hasClass('drop_active')) {
        $('.table .pd_price').removeClass('drop_active');
        $('.list_price').fadeOut(200);
        setTimeout(function() {
            $('.list_price').remove();
        }, 200);
        return;
    }
    $('.table .pd_price').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_price',
        css: {'top': `${$(element).height() + 20}px`},
        append: listPrice()
    }))
    $('.list_price').fadeIn(200);
}
function selectGroupProduct(element) {
    function listGroup() {
        let ul = $('<ul>', { class: 'list'});
        let data = categoryInListProvider[1][1];
        let list = [];
        for (let i = 0; i < data.length; i++) {
            let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
            if (item_list.length > 0) {
                for (let j = 0; j < item_list.length; j++) {
                    list.push(item_list[j].item_product);
                }
            }
        }
        for (let i = 0; i < list.length - 1; i++) {
            for (let j = i + 1; j < list.length; j++) {
                if (list[i] == list[j]) {
                    list.splice(j, 1);
                    j--;
                }
            }
        }
        for (let j = 0; j < list.length; j++) {
            ul.append(`
                <li onclick="sortTableByProduct(this)">${list[j]}</li>
            `)
        }
        
        return ul;
    }
    if ($('.table .pd_group').hasClass('drop_active')) {
        $('.table .pd_group').removeClass('drop_active');
        $('.list_group').fadeOut(200);
        setTimeout(function() {
            $('.list_group').remove();
        }, 200);
        return;
    }
    $('.table .pd_group').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_group',
        css: {'top': `${$(element).height() + 20}px`},
        append: listGroup()
    }))
    $('.list_group').fadeIn(200);
}
function selectManager(element) {
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
        for (let j = 0; j < saveTableAndCard[1][1].length; j++) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].role == 'manager' && saveTableAndCard[1][1][j].Manager_id == data[i].id) {
                    filter_table.push(data[i]);
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
                html: filter_table[i].second_name,
                id: filter_table[i].id,
                onclick: 'sortTableByManagers(this)'
            }))
        }
        return ul;
    }
    if ($('.table .pd_manager').hasClass('drop_active')) {
        $('.table .pd_manager').removeClass('drop_active');
        $('.list_manager').fadeOut(200);
        setTimeout(function() {
            $('.list_manager').remove();
        }, 200);
        return;
    }
    $('.table .pd_manager').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_manager',
        css: {'top': `${$(element).height() + 20}px`},
        append: listManager()
    }))
    $('.list_manager').fadeIn(200);
}
// End
function fillingTables(object, filter = false) {
    if (object[0].id !== 'filter_stock') {
        object[0].active = true;
        if (!filter) {
            saveTableAndCard = object;
        }
    }

    for (let i = object[0].lastCard.length - 1; i >= 0; i--) {
        if (object[0].lastCard[i] != null) {
            return object[0].lastCard[i];
        }
    }

    if (object[0].id === 'analytics') {
        return analyticsFilterTable_0();
    }

    let table = $('<table />', {
        class: 'table',
        id: object[0].id,
    });

    return rowFilling(object[object.length - 1], object[0].id, table);
}