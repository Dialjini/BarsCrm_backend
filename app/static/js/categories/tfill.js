/**
 * Функции для работы с таблиц
 */
function current_count_accounts(value, text, type) {
    let current_count = [
        {type: 1, array: [
            {numbers: [1], name: ''},
            {numbers: [2, 3, 4], name: 'а'},
            {numbers: [5, 6, 7, 8, 9, 0], name: 'ов'},
        ]},
        {type: 2, array: [
            {numbers: [1], name: 'а'},
            {numbers: [2, 3, 4], name: 'и'},
            {numbers: [5, 6, 7, 8, 9, 0], name: 'ов'},
        ]},
        {type: 3, array: [
            {numbers: [1], name: 'й'},
            {numbers: [2, 3, 4], name: 'я'},
            {numbers: [5, 6, 7, 8, 9, 0], name: 'ев'},
        ]},
    ]
    let divider = '1';
    for (let i = 1; i < String(value).length; i++) {
        divider += '0';
    }
    for (let k = 0; k < current_count.length; k++) {
        if (current_count[k].type == type) {
            for (let i = 0; i < current_count[k].array.length; i++) {
                for (let j = 0; j < current_count[k].array[i].numbers.length; j++) {
                    if (Math.floor(+value / +divider )== 1 && divider != '1') {
                        return text + 'ов'
                    } else {
                        if (value % 10 == current_count[k].array[i].numbers[j]) {
                            return text + current_count[k].array[i].name;
                        }
                    }
                }
            }
        }
    }
}

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
                        return `<button class="btn btn-add-items" id="item_add" onclick="createCardMenu(this)">Добавить</button>`
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
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
            } else if (i == 3 && id == 'provider' || i == 3 && id == 'filter_provider') {
                elementTr = `
                <th id="pd_group" onclick="selectGroupProduct(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
            } else if (i == 4 && id == 'provider' || i == 4 && id == 'filter_provider') {
                elementTr = `
                <th id="pd_price" onclick="selectFilterPrice(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
            } else if (i == 4 && id == 'client') {
                elementTr = `
                <th id="cl_category" onclick="selectFilterCategory(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
            } else if (i == 4 && id == 'delivery' || i == 4 && id == 'filter_delivery') {
                elementTr = `
                <th id="dl_customer" onclick="selectFilterCustomer(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
            } else if (i == 7 && id == 'delivery' || i == 7 && id == 'filter_delivery') {
                elementTr = `
                <th id="dl_status" onclick="selectFilterStatus(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
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
                    <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                </div>
            </th>`);
        } else if (id == 'delivery' || id == 'filter_delivery') {
            element.append(`
            <th id="dl_date" onclick="selectFilterDate(this)" width="${object[0][object[0].length - 1].width}%">
                <div class="flex jc-sb">
                    <span>${object[0][object[0].length - 1].name}</span>
                    <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                </div>
            </th>`)
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
                { id: 'carrier', list: [selectTableData[i].Name, selectTableData[i].Region, selectTableData[i].Area, returnSpaces(selectTableData[i].Capacity), selectTableData[i].View, managerSecondName] },
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
                    <td>${returnSpaces(item_list[0].item_price)}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${managerSecondName}</td>
                </tr>
            `)

            item_list = JSON.parse(selectTableData[i].Item_list);

            if (item_list != null) {
                for (let j = 1; j < item_list.length; j++) {
                    tbody.append(`
                        <tr>
                            <td>${item_list[j].item_product}</td>
                            <td>${returnSpaces(item_list[j].item_price)}</td>
                        </tr>
                    `)
                }
            }
            table.append(tbody);
        }
        info_in_providers(id);
        return table;
    }

    function info_in_providers(id) {
        if (id != 'filter_provider') {
            $('#info_in_accounts').remove()
            $('.fields').append(`
            <div id="info_in_accounts">
                <span id="info_in_accounts_count" style="margin-right: 5px;">${selectTableData.length}</span> 
                <div id="select_period_info_accounts" onclick="visibleSelectPeriod('provider')">
                    <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                </div>
            </div>
        `)
        } else {
            $('#info_in_accounts_count').html(`${selectTableData.length}`);
        }
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
                    <td>${returnSpaces(item_list[0].item_price)}</td>
                    <td rowspan="${item_list.length == 0 ? 1 : item_list.length}">${managerSecondName}</td>
                </tr>
            `)

            item_list = JSON.parse(selectTableData[i].Item_list);

            if (item_list != null) {
                for (let j = 1; j < item_list.length; j++) {
                    tbody.append(`
                    <tr>
                        <td>${item_list[j].item_product}</td>
                        <td>${returnSpaces(item_list[j].item_price)}</td>
                    </tr>
                    `)
                }
            }
            table.append(tbody);
        }
        info_in_providers(id);
        return table;
    }

    let rowFillingDelivery = (id) => {
        table.append(getTitleTable());
        let table_length = selectTableData.length;
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            if (selectTableData[i].delivery.Type == 'not-document') {
                table_length--;
                continue;
            }

            let list = selectTableData[i].delivery.Payment_list, sum_list = 0;
            if (list == null) list = '';
            if (list.length > 0) {
                list = JSON.parse(selectTableData[i].delivery.Payment_list);
                for (let i = 0; i < list.length; i++) {
                    sum_list += +deleteSpaces(list[i].price);
                }
            }
            let element = $('<tr>', {id: `delivery_${i + 1}`, onclick: 'createDelCardMenu(this)'});
            let carrier_name = selectTableData[i].carrier == null ? 'Не выбран' : selectTableData[i].carrier.Name
            selectTableData[i].delivery.NDS = selectTableData[i].delivery.NDS[0] + selectTableData[i].delivery.NDS[1];
            let amount = 0;
            let count = selectTableData[i].delivery.Amounts != undefined ? JSON.parse(selectTableData[i].delivery.Amounts) : [];
            let vat = selectTableData[i].delivery.Customer == 'ООО' ? '' : 1.26;
            for (let i = 0; i < count.length; i++) {
                amount += +deleteSpaces(count[i].sum);
            }

            let status = +amount - +sum_list <= 0 ? '<span class="green">Оплачено</span>' : '<span class="red">Не оплачено</span>'
            let price_without_vat = returnSpaces(Math.ceil(amount * vat));
            let customer = selectTableData[i].delivery.Customer;
            let payment_date = selectTableData[i].delivery.Payment_date;
            if (selectTableData[i].delivery.Name == 'Транзит') {
                full_name = `Транзит с ${selectTableData[i].delivery.Stock} на ${selectTableData[i].delivery.Contact_Number}`;
            } else {
                full_name = selectTableData[i].delivery.Name;
            }
            let stock_names = selectTableData[i].delivery.Stock
            if (stock_names.indexOf('-s!s-') != -1) {
                stock_names = stock_names.replace(/-s!s-/g, ' | ');
            }
            const name = [selectTableData[i].delivery.Date, full_name, stock_names, carrier_name, selectTableData[i].delivery.Customer, customer == 'ООО' ? returnSpaces(amount) : price_without_vat, customer == 'ООО' ? '' : returnSpaces(amount), status, payment_date == '' ? 'Не указано' : payment_date];
            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        if (id != 'filter_delivery') {
            $('#info_in_accounts').remove()
            $('.fields').append(`
                <div id="info_in_accounts">
                    <span id="info_in_accounts_count" style="margin-right: 5px;">${table_length} ${current_count_accounts(selectTableData.length, 'доставк', 2)}</span> 
                    <div id="select_period_info_accounts" onclick="visibleSelectPeriod('delivery')">
                        <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                    </div>
                </div>
            `)
        } else {
            $('#info_in_accounts_count').html(`${table_length} ${current_count_accounts(selectTableData.length, 'доставк', 2)}`);
        }
        return table;
    }

    let rowFillingAccount = (id) => {
        table.append(getTitleTable());
        let table_non = $('<tbody>');
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
                let amount = deleteSpaces(selectTableData[i].account.Sum);
                let payment_amount = 0;

                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +deleteSpaces(payment_list[i].sum);
                }
                if (+amount <= +payment_amount) status = '<span class="green">Оплачено</span>'
                else if (+payment_amount == 0) status = '<span class="red">Не оплачено</span>'
                else status = '<span class="red">Частично оплачено</span>'
                if (selectTableData[i].account.Status == 'true') {
                    status = '<span style="color: #e8e8e8">Не актуальный</span>'
                }
            } else {
                status = '<span class="red">Не оплачено</span>';
            }

            if (selectTableData[i].account.Shipment == 'false') {
                shipment = '<span class="red">Не отгружено</span>';
                if (selectTableData[i].account.Status == 'true') {
                    shipment = '<span style="color: #e8e8e8">Не отгружено</span>'
                }
            } else if (selectTableData[i].account.Shipment == 'true') {
                shipment = '<span class="green">Отгружено</span>';
                if (selectTableData[i].account.Status == 'true') {
                    shipment = '<span style="color: #e8e8e8">Отгружено</span>'
                }
            } else {
                shipment = '<span class="red">Частично отгружено</span>';
                if (selectTableData[i].account.Status == 'true') {
                    shipment = '<span style="color: #e8e8e8">Частично отгружено</span>'
                }
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
                hello_sum += +deleteSpaces(hello_list[i]);
            }

            let element = $('<tr>', {id: `account_${i + 1}`, onclick: 'createCardMenu(this)'});
            const name = [selectTableData[i].items[0].Prefix, selectTableData[i].account.Date, selectTableData[i].account.Name, returnSpaces(selectTableData[i].account.Sum), status, shipment, returnSpaces(+hello_sum.toFixed(2)), managerSecondName];

            for (let j = 0; j < name.length; j++) {
                let elementTr = status.includes('Не актуальный') ? $('<td>', { html: `<span style="color: #e8e8e8">${name[j]}</span>` }) : $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            if (selectTableData[i].account.Status == 'true') {
                table_non.append(element);
            } else {
                table.append(element);
            }
        }
        table.append(table_non);
        if (id != 'filter_account') {
            $('.fields').append(`
                <div id="info_in_accounts">
                    <span id="info_in_accounts_count" style="margin-right: 5px;">${selectTableData.length} ${current_count_accounts(selectTableData.length, 'счет', 1)}</span> 
                    <div id="select_period_info_accounts" onclick="visibleSelectPeriod()">
                        <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                    </div>
                </div>
            `)
        } else {
            $('#info_in_accounts_count').html(`${selectTableData.length} ${current_count_accounts(selectTableData.length, 'счет', 1)}`);
        }
        return table;
    }

    let rowFillingDebit = (id) => {
        let deliveryTable, managers;
        $.ajax({
            url: '/getUsers',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                managers = JSON.parse(result);
                $.ajax({
                    url: '/getDeliveries',
                    type: 'GET',
                    async: false,
                    dataType: 'html',
                    success: function(result) { deliveryTable = JSON.parse(result) },
                });
            }
        });
        $(table).attr('class', 'table analytics')
        table.append(getTitleTable());
        let balance_owed = 0, count_accounts = 0;
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
            let payment_amount = 0, item_amount = 0, payment_list = [{sum: 0, date: ''}];
            if (selectTableData[i].account.Payment_history != undefined) {
                payment_list = JSON.parse(selectTableData[i].account.Payment_history);
                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +deleteSpaces(payment_list[i].sum)
                }
            } else {
                payment_amount = 0;
            }

            if (selectTableData[i].account.Items_amount != undefined) {
                let amount_all = JSON.parse(selectTableData[i].account.Items_amount);
                for (let i = 0; i < amount_all.length; i++) {
                    item_amount += +deleteSpaces(amount_all[i].amount)
                }
            } else {
                item_amount = 0;
            }

            let shipment = selectTableData[i].account.Shipment;

            for (let i = 0; i < payment_list.length; i++) {
                if (payment_list[i].sum != 0 || shipment !== 'false') {
                    if (+deleteSpaces(selectTableData[i].account.Sum) > +deleteSpaces(payment_amount)) {
                        balance_owed += (item_amount - payment_amount);
                        count_accounts++;
                        break;
                    }
                }
            }

            let count_delivery = 0;
            let delivery_data = [];

            for (let j = 0; j < deliveryTable.length; j++) {
                if (deliveryTable[j].delivery.Account_id == i + 1) {
                    count_delivery++;
                    delivery_data.push({ first_date: deliveryTable[j].delivery.Start_date,
                                         id: deliveryTable[j].delivery.Account_id,
                                         postponement_date: deliveryTable[j].delivery.Postponement_date,
                                         customer: deliveryTable[j].delivery.Customer});
                }
            }
            for (let j = 0; j < delivery_data.length; j++) {
                if (delivery_data[j].first_date == '' || delivery_data[j].first_date == null) {
                    delivery_data[j].first_date = 'Не указано';
                }
                if (delivery_data[j].postponement_date == '' || delivery_data[j].postponement_date == null) {
                    delivery_data[j].postponement_date = 'Не указано';
                }
            }
            if (payment_amount == 0 && shipment == 'false') continue;
            if (+deleteSpaces(selectTableData[i].account.Sum) <= +deleteSpaces(payment_amount)) continue;
            let element = $('<tbody>', {id: `account_${i + 1}`, onclick: 'transferToAccounts(this)', class: 'tr_tr'});
            for (let j = 0; j < delivery_data.length; j++) {
                if (j == 0) {
                    element.append(`
                        <tr>
                            <td>${delivery_data[j].customer}</td>
                            <td rowspan="${count_delivery}">${selectTableData[i].account.Name}</td>
                            <td>${delivery_data[j].first_date}</td>
                            <td>${delivery_data[j].postponement_date}</td>
                            <td rowspan="${count_delivery}">${returnSpaces(selectTableData[i].account.Sum)}</td>
                            <td rowspan="${count_delivery}">${returnSpaces(payment_amount)}</td>
                            <td rowspan="${count_delivery}">${returnSpaces(+deleteSpaces(selectTableData[i].account.Sum) - +deleteSpaces(payment_amount))}</td>
                            <td rowspan="${count_delivery}">${managerSecondName}</td>
                        </tr>
                    `)
                } else {
                    element.append(`
                        <tr>
                            <td>${delivery_data[j].customer}</td>
                            <td>${delivery_data[j].first_date}</td>
                            <td>${delivery_data[j].postponement_date}</td>
                        </tr>
                    `)
                }
            }
            for (let j = 0; j < name.length; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            table.append(element);
        }
        if (id != 'filter_debit') {
            $('#info_in_accounts').remove();
            $('.fields').append(`
            <div id="info_in_accounts">
                <span id="info_in_accounts_count">${count_accounts} ${current_count_accounts(count_accounts, 'счет', 1)} на </span> 
                <span id="info_in_accounts_amount" class="red">${returnSpaces(balance_owed)} руб.</span>
                <div id="select_period_info_accounts" onclick="visibleSelectPeriod()">
                    <span id="period_accounts">за последний месяц</span> <img src="static/images/dropmenu_black.svg" class="drop_down_img">
                </div>
            </div>
        `)
        } else {
            $('#info_in_accounts_count').html(`${count_accounts} ${current_count_accounts(count_accounts, 'счет', 1)} на `);
            $('#info_in_accounts_amount').html(`${returnSpaces(balance_owed)} руб.`);
        }

        return table;
    }

    let rowFillingStock = (id) => {
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            for (let k = selectTableData[i].items.length - 1; k >= 0; k--) {
                if (selectTableData[i].stock_address != null) {
                    let element = $('<tr>', {id: `stock_${selectTableData[i].items[k].Item_id}`, onclick: 'createCardMenu(this, 1)'});
                    const name = [selectTableData[i].items[k].Prefix, selectTableData[i].items[k].Group_name, selectTableData[i].items[k].Name, returnSpaces(selectTableData[i].items[k].Weight), selectTableData[i].items[k].Packing, returnSpaces(selectTableData[i].items[k].Volume), returnSpaces(selectTableData[i].items[k].Cost), selectTableData[i].items[k].NDS, selectTableData[i].stock_address];
    
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

    let rowFillingStockAdmin = (id) => {
        table.append(getTitleTable());
        for (let i = selectTableData.length - 1; i >= 0; i--) {
            for (let k = selectTableData[i].items.length - 1; k >= 0; k--) {
                if (selectTableData[i].stock_address != null) {
                    let element = $('<tr>', {id: `stock_${selectTableData[i].items[k].Item_id}`, onclick: 'editItem(this.id)'});
                    const name = [selectTableData[i].items[k].Prefix, selectTableData[i].items[k].Group_name, selectTableData[i].items[k].Name, returnSpaces(selectTableData[i].items[k].Weight), selectTableData[i].items[k].Packing, returnSpaces(selectTableData[i].items[k].Volume), returnSpaces(selectTableData[i].items[k].Cost), selectTableData[i].items[k].NDS, selectTableData[i].stock_address];
    
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

    const tableFunctiouns = [
        { id: 'client', function: rowFillingDefault },
        { id: 'provider', function: rowFillingProvider },
        { id: 'filter_provider', function: rowFillingFilterProvider },
        { id: 'carrier', function: rowFillingDefault },
        { id: 'debit', function: rowFillingDebit },
        { id: 'filter_debit', function: rowFillingDebit },
        { id: 'account', function: rowFillingAccount },
        { id: 'filter_account', function: rowFillingAccount },
        { id: 'delivery', function: rowFillingDelivery },
        { id: 'filter_delivery', function: rowFillingDelivery },
        { id: 'stock', function: rowFillingStock },
        { id: 'filter_stock', function: rowFillingStock },
        { id: 'filter_stock_admin', function: rowFillingStockAdmin },
    ]

    for (let element of tableFunctiouns) {
        if (element.id === id) {
            return element.function(id);
        }
    }
}
let competitor_data = [];
function searchByCompetitor() {
    $.ajax({
        url: '/getAllClientItems',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            let contacts_list = JSON.parse(data);
            let competitor_list = [], competitors = [];
            for (let i = 0; i < contacts_list.length; i++) {
                for (let j = 0; j < contacts_list[i].data.length; j++) {
                    if (contacts_list[i].data[j].Name !== 'Выбрать' && contacts_list[i].data[j].Creator !== 'Не выбран' && contacts_list[i].data[j].Creator !== 'Конкурентов нет') {
                        competitor_list.push(contacts_list[i].data[j].Client_id);
                        competitors.push(contacts_list[i].data[j]);
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
            function fillTable(managers) {
                let table = '';
                competitor_data = [];
                for (let i = 0; i < filter_table.length; i++) {
                    for (let j = 0; j < competitors.length; j++) {
                        if (filter_table[i].id == competitors[j].Client_id) {
                            for (let k = 0; k < managers.length; k++) {
                                if (managers[k].id == filter_table[i].Manager_id || filter_table[i].Manager_id == null) {
                                    competitor_data.push({
                                        id: filter_table[i].id,
                                        name: filter_table[i].Name,
                                        item: competitors[j].Name,
                                        volume: competitors[j].Volume,
                                        creator: competitors[j].Creator,
                                        cost: competitors[j].Cost,
                                        manager: managers[k].second_name
                                    })
                                    table += `
                                        <tr id="client_${filter_table[i].id}_search" onclick="openCardMenu(this)">
                                            <td>${filter_table[i].Name}</td>
                                            <td>${competitors[j].Name}</td>
                                            <td>${competitors[j].Volume}</td>
                                            <td>${competitors[j].Creator}</td>
                                            <td>${competitors[j].Cost}</td>
                                            <td>${filter_table[i].Manager_id == null ? 'Ни к кому не прикреплена' : managers[k].second_name}</td>
                                        </tr>
                                    `
                                    break;
                                }
                            }
                        }
                    }
                }

                return table;
            }
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                dataType: 'html',
                success: function(data) {
                    data = JSON.parse(data);
                    $('.page').append($('<div>', { class: 'background' }).add(`
                        <div class="modal_select modal_search search_by_competitor--client">
                            <div class="title">
                                <span>Поиск по конкурентам</span>
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <table class="table_search" id ="table_search_comp">
                                    <tr>
                                        <th width="200">Клиент</th>
                                        <th class="cl_com_filters" id="cl_com_product" onclick="clientCompFilter(this)" width="140">
                                            <div class="flex jc-sb">
                                                <span>Товар</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_volume" onclick="clientCompFilter(this)" width="100">
                                            <div class="flex jc-sb">
                                                <span>Объем</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th>У кого</th>
                                        <th class="cl_com_filters" id="cl_com_price" onclick="clientCompFilter(this)" width="100">
                                            <div class="flex jc-sb">
                                                <span>Цена</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_manager" onclick="clientCompFilter(this)" width="110">
                                            <div class="flex jc-sb">
                                                <span>Менеджер</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                    </tr>
                                    <tbody id="content_table_comp">
                                        ${fillTable(data)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `));
                }
            });
        }
    });
}
function sortCompTableByPrice(element) {
    competitor_data.sort(function(a, b) {
        if (+deleteSpaces(a.cost) > +deleteSpaces(b.cost)) return 1;
        if (+deleteSpaces(a.cost) < +deleteSpaces(b.cost)) return -1;
        return 0;
    })
    if (element.id == 'max') {
        competitor_data.reverse();
    }
    $('#content_table_comp').empty();
    let tbody = '';
    for (let i = 0; i < competitor_data.length; i++) {
        tbody += `
            <tr id="client_${competitor_data[i].id}_search" onclick="openCardMenu(this)">
                <td>${competitor_data[i].name}</td>
                <td>${competitor_data[i].item}</td>
                <td>${competitor_data[i].volume}</td>
                <td>${competitor_data[i].creator}</td>
                <td>${competitor_data[i].cost}</td>
                <td>${competitor_data[i].manager}</td>
            </tr>
        `
    }
    $('#content_table_comp').append(tbody);

    setTimeout(function() {
        $('#cl_com_price .drop_arrow').removeClass('drop_active');
    }, 150)
}
function sortCompTableByProduct(element) {
    $('#content_table_comp').empty();
    let tbody = '';
    let competitor_data_copy = competitor_data.slice();
    competitor_data = [];
    for (let i = 0; i < competitor_data_copy.length; i++) {
        if (competitor_data_copy[i].item == element.innerHTML) {
            competitor_data.push(competitor_data_copy[i]);
            tbody += `
                <tr id="client_${competitor_data_copy[i].id}_search" onclick="openCardMenu(this)">
                    <td>${competitor_data_copy[i].name}</td>
                    <td>${competitor_data_copy[i].item}</td>
                    <td>${competitor_data_copy[i].volume}</td>
                    <td>${competitor_data_copy[i].creator}</td>
                    <td>${competitor_data_copy[i].cost}</td>
                    <td>${competitor_data_copy[i].manager}</td>
                </tr>
            `
        }
    }
    $('#content_table_comp').append(tbody);

    setTimeout(function() {
        $('#cl_com_product .drop_arrow').removeClass('drop_active');
    }, 150)
}
function sortCompTableByManagers(element) {
    $('#content_table_comp').empty();
    let tbody = '';
    let competitor_data_copy = competitor_data.slice();
    competitor_data = [];
    for (let i = 0; i < competitor_data_copy.length; i++) {
        if (competitor_data_copy[i].manager == element.innerHTML) {
            competitor_data.push(competitor_data_copy[i]);
            tbody += `
                <tr id="client_${competitor_data_copy[i].id}_search" onclick="openCardMenu(this)">
                    <td>${competitor_data_copy[i].name}</td>
                    <td>${competitor_data_copy[i].item}</td>
                    <td>${competitor_data_copy[i].volume}</td>
                    <td>${competitor_data_copy[i].creator}</td>
                    <td>${competitor_data_copy[i].cost}</td>
                    <td>${competitor_data_copy[i].manager}</td>
                </tr>
            `
        }
    }
    $('#content_table_comp').append(tbody);

    setTimeout(function() {
        $('#cl_com_manager .drop_arrow').removeClass('drop_active');
    }, 150)
}
function sortCompTableByVolume(element) {
    competitor_data.sort(function(a, b) {
        if (+deleteSpaces(a.volume) > +deleteSpaces(b.volume)) return 1;
        if (+deleteSpaces(a.volume) < +deleteSpaces(b.volume)) return -1;
        return 0;
    })
    if (element.id == 'max') {
        competitor_data.reverse();
    }
    $('#content_table_comp').empty();
    let tbody = '';
    for (let i = 0; i < competitor_data.length; i++) {
        tbody += `
            <tr id="client_${competitor_data[i].id}_search" onclick="openCardMenu(this)">
                <td>${competitor_data[i].name}</td>
                <td>${competitor_data[i].item}</td>
                <td>${competitor_data[i].volume}</td>
                <td>${competitor_data[i].creator}</td>
                <td>${competitor_data[i].cost}</td>
                <td>${competitor_data[i].manager}</td>
            </tr>
        `
    }
    $('#content_table_comp').append(tbody);

    setTimeout(function() {
        $('#cl_com_volume .drop_arrow').removeClass('drop_active');
    }, 150)
}
function clientCompFilter(element) {
    let id = element.id;
    let list = [
        {id: 'cl_com_product', func: listProduct},
        {id: 'cl_com_volume', func: listVolume},
        {id: 'cl_com_price', func: listPrice},
        {id: 'cl_com_manager', func: listManager},
    ]
    function listVolume() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortCompTableByVolume(this)">По возраст.</li>
            <li id="max" onclick="sortCompTableByVolume(this)">По убыванию</li>
        `)
        return ul;
    }
    function listPrice() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortCompTableByPrice(this)">По возраст.</li>
            <li id="max" onclick="sortCompTableByPrice(this)">По убыванию</li>
        `)
        return ul;
    }
    function listProduct() {
        let ul = $('<ul>', { class: 'list'});
        $.ajax({
            url: '/getAllClientItems',
            type: 'GET',
            dataType: 'html',
            async: false,
            success: function(data) {
                data = JSON.parse(data);
                let list = [];
                for (let i = 0; i < data.length; i++) { 
                    for (let j = 0; j < data[i].data.length; j++) {
                        list.push(data[i].data[j]);
                    }
                }
                for (let i = 0; i < list.length - 1; i++) {
                    for (let j = i + 1; j < list.length; j++) {
                        if (list[i].Name == list[j].Name) {
                            list.splice(j, 1);
                            j--;
                        }
                    }
                }
                for (let j = 0; j < list.length; j++) {
                    ul.append(`
                        <li onclick="sortCompTableByProduct(this)">${list[j].Name}</li>
                    `)
                }
            }
        });
        
        return ul;
    }
    function listManager() {
        let ul = $('<ul>', { class: 'list'});

        $.ajax({
            url: '/getUsers',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                data_user = JSON.parse(result);
                $.ajax({
                    url: '/getAllClientItems',
                    type: 'GET',
                    dataType: 'html',
                    async: false,
                    success: function(data) {
                        data_items = JSON.parse(data);
                    }
                });
            }
        });
        let filter_table = [];
        for (let j = 0; j < categoryInListClient[1][1].length; j++) {
            for (let i = 0; i < data_user.length; i++) {
                for (let k = 0; k < data_items.length; k++) {
                    for (let h = 0; h < data_items[k].data.length; h++) {
                        if (data_user[i].role == 'manager' && categoryInListClient[1][1][j].Manager_id == data_user[i].id
                            && categoryInListClient[1][1][j].id == data_items[k].data[h].Client_id) {
                            filter_table.push(data_user[i]);
                        }
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
                html: filter_table[i].second_name,
                id: filter_table[i].id,
                onclick: 'sortCompTableByManagers(this)'
            }))
        }
        return ul;
    }
    function selectFunc() {
        for (let i = 0; i < list.length; i++) {
            if (id == list[i].id) {
                // $('#table_search_comp').remove()
                return list[i].func(element);
            }
        }
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
            append: selectFunc()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
let sortStatus = {
    product: {status: false, filter: null, last: null},
    price: {status: false, filter: null},
    area: {status: false, filter: null},
    category: {status: false, filter: null, last: null},
    manager: {status: false, filter: null, last: null},
    customer: {status: false, filter: null, last: null},
    status: {status: false, filter: null, last: null},
    date: {status: false, filter: null, last: null},
    search_on_regions: {status: false, filter: null, last: null}
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
    setTimeout(function() {
        $('#cl_category .drop_arrow').removeClass('drop_active');
    }, 150)
}
function sortTableByStatus(element) {
    let value = $(element).html();
    if (saveTableAndCard[0].id == 'delivery' || saveTableAndCard[0].id == 'filter_delivery') {
        let data;
        if (!sortStatus.customer.status && !sortStatus.date.status) {
            if (filterDelivery[1][1] != undefined) filterDelivery[1].pop();
            data = categoryInDelivery[1][1];
        } else {
            if (filterDelivery[1][1] == undefined) {
                data = categoryInDelivery[1][1];
            } else {
                data = sortStatus.status.last == null ? filterDelivery[1][1] : sortStatus.status.last;
            }
        }
        let filter_table = [];
        for (let i = 0; i < data.length; i++) {
            let payment_list = JSON.parse(data[i].delivery.Payment_list) == null ? [{price: 0}] : JSON.parse(data[i].delivery.Payment_list);
            let amount_list = JSON.parse(data[i].delivery.Amounts) == null ? [{sum: 0}] : JSON.parse(data[i].delivery.Amounts);
            let payment_sum = 0, amount_sum = 0;

            for (let j = 0; j < payment_list.length; j++) 
                payment_sum += +deleteSpaces(payment_list[j].price);

            for (let j = 0; j < amount_list.length; j++) 
                amount_sum += +deleteSpaces(amount_list[j].sum);

            if (element.id == 1 && amount_sum == payment_sum) filter_table.push(data[i]);
            if (element.id == 2 && amount_sum != payment_sum) filter_table.push(data[i]);
        }
        filterDelivery[1][1] = filter_table;
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.status.status = true;
        sortStatus.status.filter = value;

        $('.centerBlock .header .cancel').remove();
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
        setTimeout(function() {
            $('#dl_status .drop_arrow').removeClass('drop_active');
        }, 150)
    } 
}
function sortTableByDate(element) {
    let value = $(element).html();
    if (saveTableAndCard[0].id == 'delivery' || saveTableAndCard[0].id == 'filter_delivery') {
        let data;
        if (!sortStatus.customer.status && !sortStatus.status.status) {
            if (filterDelivery[1][1] != undefined) filterDelivery[1].pop();
            data = categoryInDelivery[1][1];
        } else {
            if (filterDelivery[1][1] == undefined) {
                data = categoryInDelivery[1][1];
            } else {
                data = sortStatus.date.last == null ? filterDelivery[1][1] : sortStatus.date.last;
            }
        }
        let filter_table = [];
        for (let i = 0; i < data.length; i++) {
            if (element.id == 'true' && data[i].delivery.Payment_date != '') {
                filter_table.push(data[i]);
            }
            if (element.id == 'false' && data[i].delivery.Payment_date == '') {
                filter_table.push(data[i]);
            }
        }
        filterDelivery[1][1] = filter_table;
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.date.status = true;
        sortStatus.date.filter = value;

        $('.centerBlock .header .cancel').remove();
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
        setTimeout(function() {
            $('#dl_date .drop_arrow').removeClass('drop_active');
        }, 150)
    } 
}
function sortTableByCustomer(element) {
    let value = $(element).html();
    if (saveTableAndCard[0].id == 'delivery' || saveTableAndCard[0].id == 'filter_delivery') {
        let data;
        if (!sortStatus.date.status && !sortStatus.status.status) {
            if (filterDelivery[1][1] != undefined) filterDelivery[1].pop();
            data = categoryInDelivery[1][1];
        } else {
            if (filterDelivery[1][1] == undefined) {
                data = categoryInDelivery[1][1];
            } else {
                data = sortStatus.customer.last == null ? filterDelivery[1][1] : sortStatus.customer.last;
            }
        }
        let filter_table = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].delivery.Customer == value) {
                filter_table.push(data[i]);
            }
        }
        filterDelivery[1][1] = filter_table;
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.customer.status = true;
        sortStatus.customer.filter = value;

        $('.centerBlock .header .cancel').remove();
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
        setTimeout(function() {
            $('#dl_customer .drop_arrow').removeClass('drop_active');
        }, 150)
    }
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
                } else {
                    if (filterClient[1][1] == undefined) {
                        data = categoryInListClient[1][1];
                    } else {
                        data = sortStatus.manager.last == null ? filterClient[1][1] : sortStatus.manager.last;
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
            setTimeout(function() {
                $('#pd_manager .drop_arrow').removeClass('drop_active');
            }, 150)
            break;
        }
    }
}
function sortTableByArea(filter, input = true) {
    let newTableData;
    if (saveTableAndCard[0].id == 'client') {
        if (!sortStatus.manager.status && !sortStatus.category.status && !sortStatus.search_on_regions.status) {
            if (filterClient[1][1] != undefined) filterClient[1].pop();
            newTableData = categoryInListClient.slice();
        } else {
            newTableData = filterClient;
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
    setTimeout(function() {
        $('#all_area .drop_arrow').removeClass('drop_active');
    }, 150)
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
            filter_data.push({id: data[i].id, product: item_list[j].item_product, price: +deleteSpaces(item_list[j].item_price)});
        }
    }
        
    let table_data = []
    for (let i = 0; i < data.length; i++) {
        let item_list = typeof data[i].Item_list == 'string' ? JSON.parse(data[i].Item_list) : []; 
        for (let k = 0; k < item_list.length; k++) {
            for (let j = 0; j < filter_data.length; j++) {
                if (filter_data[j].id == data[i].id
                    && filter_data[j].product == item_list[k].item_product
                    && filter_data[j].price == +deleteSpaces(item_list[k].item_price)
                    && filter_data[j].product != 'Выбрать' && item_list[k].item_product != 'Выбрать'
                    && item_list[k].item_price != '') {
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
        if (+deleteSpaces(JSON.parse(a.Item_list)[0].item_price) > +deleteSpaces(JSON.parse(b.Item_list)[0].item_price)) return 1;
        if (+deleteSpaces(JSON.parse(a.Item_list)[0].item_price) < +deleteSpaces(JSON.parse(b.Item_list)[0].item_price)) return -1;
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
    setTimeout(function() {
        $('#pd_price .drop_arrow').removeClass('drop_active');
    }, 150)
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
    setTimeout(function() {
        $('#pd_group .drop_arrow').removeClass('drop_active');
    }, 150)
}
// End
// Выпадающие меню Start
function selectFilterDate(element) {
    let id = element.id;
    function listDate() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="true" onclick="sortTableByDate(this)">Указана</li>
            <li id="false" onclick="sortTableByDate(this)">Не указана</li>
        `)
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
            append: listDate()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
function selectFilterStatus(element) {
    let id = element.id;
    function listCustomer() {
        let ul = $('<ul>', { class: 'list'});
        let filter_table = ['Оплачено', 'Не оплачено'];
        for (let i = 0; i < filter_table.length; i++) {
            ul.append(`
                <li id="${i + 1}" onclick="sortTableByStatus(this)">${filter_table[i]}</li>
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
function selectFilterCustomer(element) {
    let id = element.id;
    function listCustomer() {
        let ul = $('<ul>', { class: 'list'});
        let filter_table = ['ООО', 'ИП'];
        for (let i = 0; i < filter_table.length; i++) {
            ul.append(`
                <li onclick="sortTableByCustomer(this)">${filter_table[i]}</li>
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
function selectFilterCategory(element) {
    let id = element.id;
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
        for (let i = 0; i < filter_table.length; i++) {
            ul.append(`
                <li onclick="sortTableByCategory(this)">${filter_table[i]}</li>
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
            append: listCategory()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
function selectFilterArea(element) {
    let id = element.id;
    function listArea() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortTableByArea(this)">От А до Я</li>
            <li id="max" onclick="sortTableByArea(this)">От Я до А</li>
        `)
        // получить список групп товаров
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
            append: listArea()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
function selectFilterPrice(element) {
    let id = element.id;
    function listPrice() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortTableByPrice(this)">По возраст.</li>
            <li id="max" onclick="sortTableByPrice(this)">По убыванию</li>
        `)
        // получить список групп товаров
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
            append: listPrice()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
function selectGroupProduct(element) {
    let id = element.id;
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
            append: listGroup()
        }))
        $('.filter_list').fadeIn(100);
    }, 250);
}
function selectManager(element) {
    let id = element.id;
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
        let current_period_month = datePeriod('month');
        if (user.role == 'admin') return analyticsFilterTable_0(current_period_month);
        if (user.role == 'manager') return analyticsFilterTable_1(current_period_month);
    }

    let table = $('<table />', {
        class: 'table',
        id: object[0].id,
    });

    return rowFilling(object[object.length - 1], object[0].id, table);
}