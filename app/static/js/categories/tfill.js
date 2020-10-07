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
                    let data_role = $('[name="offtop__load"').attr('id').split('::');
                    let data = {role: data_role[0], id: data_role[1]};
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
            } else if (i == 1 && id == 'client' || i == 1 && id == 'filter_client' || i == 2 && id == 'provider' || i == 2 && id == 'filter_provider') {
                elementTr = `
                <th id="all_name" onclick="selectFilterName(this)" width="${object[0][i].width}%">
                    <div class="flex jc-sb">
                        <span>${object[0][i].name}</span>
                        <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                    </div>
                </th>`
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
        console.log(id);
        if (id === 'debit' || id === 'account') {
            element.append(`
            <th id="pd_manager" onclick="selectManagerInAccount(this)" width="${object[0][object[0].length - 1].width}%">
                <div class="flex jc-sb">
                    <span>${object[0][object[0].length - 1].name}</span>
                    <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                </div>
            </th>`);
        } else if (id !== 'delivery' && id !== 'stock') {
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
            
            for (let i = 0; i < item_list.length - 1; i++) {
                for (let j = i + 1; j < item_list.length; j++) {
                    if (item_list[i].item_product == item_list[j].item_product) {
                        let first_date = item_list[i].item_date == '' ? getValidationDate('01.01.1970') : getValidationDate(item_list[i].item_date);
                        let second_date = item_list[j].item_date == '' ? getValidationDate('01.01.1970') : getValidationDate(item_list[j].item_date);
                        if (first_date > second_date) {
                            item_list.splice(j, 1);
                            j--;
                        } else {
                            item_list.splice(i, 1);
                            i == 0 ? i : i--;
                        }
                    }
                }
            }
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

            if (item_list != null) {
                for (let j = 1; j < item_list.length; j++) {
                    console.log(j, item_list.length);
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
            let list = selectTableData[i].delivery.Payment_list, sum_list = 0;
            if (list == null) list = '';
            if (list.length > 0) {
                list = JSON.parse(selectTableData[i].delivery.Payment_list);
                for (let i = 0; i < list.length; i++) {
                    sum_list += +deleteSpaces(list[i].price);
                }
            }
            let element = $('<tr>', {id: `delivery_${selectTableData[i].delivery.id}`, onclick: 'createDelCardMenu(this)'});
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

            let element = $('<tr>', {id: `account_${selectTableData[i].account.id}`, onclick: 'createCardMenu(this)'});
            const name = [selectTableData[i].items[0].Prefix, selectTableData[i].account.Date, selectTableData[i].account.Name, returnSpaces(selectTableData[i].account.Sum), status, shipment, returnSpaces(selectTableData[i].account.Hello_costs), managerSecondName];

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
        let managers, items;
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
            url: '/getStockTable',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                items = JSON.parse(result);
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
                for (let k = 0; k < payment_list.length; k++) {
                    payment_amount += +deleteSpaces(payment_list[k].sum)
                }
            } else {
                payment_amount = 0;
            }

            if (selectTableData[i].account.Items_amount != undefined) {
                let amount_all = JSON.parse(selectTableData[i].account.Items_amount);
                for (let k = 0; k < amount_all.length; k++) {
                    item_amount += +deleteSpaces(amount_all[k].amount)
                }
            } else {
                item_amount = 0;
            }

            let shipment = selectTableData[i].account.Shipment;
            for (let k = 0; k < payment_list.length; k++) {
                if (payment_list[k].sum != 0 || shipment !== 'false') {
                    if (+deleteSpaces(selectTableData[i].account.Sum) > +deleteSpaces(payment_amount)) {
                        balance_owed += (item_amount - payment_amount);
                        count_accounts++;
                        break;
                    }
                }
            }

            if (payment_amount == 0 && shipment == 'false') continue;
            if (+deleteSpaces(selectTableData[i].account.Sum) <= +deleteSpaces(payment_amount)) continue;
            let element = $('<tbody>', {id: `account_${selectTableData[i].account.id}`, onclick: 'transferToAccounts(this)', class: 'tr_tr'});
            let shipment_list = selectTableData[i].account.Shipment_list == null ? [] : JSON.parse(selectTableData[i].account.Shipment_list);
            console.log(selectTableData[i]);
            let volume = JSON.parse(selectTableData[i].account.Item_ids);

            let hello = JSON.parse(selectTableData[i].account.Hello);
            let shipping = JSON.parse(selectTableData[i].account.Shipping);
            let sale = JSON.parse(selectTableData[i].account.Sale);

            let count = 0;
            for (let stock = 0; stock < items.length; stock++) {
                for (let item = 0; item < items[stock].items.length; item++) {
                    for (let ii = 0; ii < volume.length; ii++) {
                        for (let j = 0; j < shipment_list.length; j++) {
                            if (shipment_list[j].id == volume[ii].id && items[stock].items[item].Item_id == volume[ii].id) {
                                count++;
                                let amount_price = +deleteSpaces(shipment_list[j].volume) * (+deleteSpaces(items[stock].items[item].Cost) + (+deleteSpaces(hello[ii]) + +deleteSpaces(shipping[ii]) + +deleteSpaces(sale[ii])));
                                if (count == 1) {
                                    element.append(`
                                        <tr>
                                            <td rowspan="${shipment_list.length}">${selectTableData[i].items[0].Prefix}</td>
                                            <td rowspan="${shipment_list.length}">${selectTableData[i].account.Name}</td>
                                            <td>${shipment_list[j].date}</td>
                                            <td>${shipment_list[j].delay}</td>
                                            <td>${returnSpaces(amount_price)}</td>
                                            <td rowspan="${shipment_list.length}">${returnSpaces(payment_amount)}</td>
                                            <td rowspan="${shipment_list.length}">${returnSpaces(+deleteSpaces(selectTableData[i].account.Sum) - +deleteSpaces(payment_amount))}</td>
                                            <td rowspan="${shipment_list.length}">${managerSecondName}</td>
                                        </tr>
                                    `)
                                } else {
                                    element.append(`
                                        <tr>
                                            <td>${shipment_list[j].date}</td>
                                            <td>${shipment_list[j].delay}</td>
                                            <td>${returnSpaces(amount_price)}</td>
                                        </tr>
                                    `)
                                }
                            }
                        }
                    }
                }
            }
            // for (let j = 0; j < delivery_data.length; j++) {
            //     if (j == 0) {
            //         element.append(`
            //             <tr>
            //                 <td>${delivery_data[j].customer}</td>
            //                 <td rowspan="${count_delivery}">${selectTableData[i].account.Name}</td>
            //                 <td>${delivery_data[j].first_date}</td>
            //                 <td>${delivery_data[j].postponement_date}</td>
            //                 <td rowspan="${count_delivery}">${returnSpaces(selectTableData[i].account.Sum)}</td>
            //                 <td rowspan="${count_delivery}">${returnSpaces(payment_amount)}</td>
            //                 <td rowspan="${count_delivery}">${returnSpaces(+deleteSpaces(selectTableData[i].account.Sum) - +deleteSpaces(payment_amount))}</td>
            //                 <td rowspan="${count_delivery}">${managerSecondName}</td>
            //             </tr>
            //         `)
            //     } else {
            //         element.append(`
            //             <tr>
            //                 <td>${delivery_data[j].customer}</td>
            //                 <td>${delivery_data[j].first_date}</td>
            //                 <td>${delivery_data[j].postponement_date}</td>
            //             </tr>
            //         `)
            //     }
            // }
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
        console.log(selectTableData);
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
                            <div class="title" style="justify-content: flex-end;">
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <table class="table_search" id="table_search_comp">
                                    <tr>
                                        <th class="cl_com_filters" id="cl_com_client" onclick="clientCompFilter(this)" width="210">
                                            <div class="flex jc-sb">
                                                <span>Клиент</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_product" onclick="clientCompFilter(this)" width="180">
                                            <div class="flex jc-sb">
                                                <span>Товар</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_volume" onclick="clientCompFilter(this)" width="105">
                                            <div class="flex jc-sb">
                                                <span>Объем</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_provider" onclick="clientCompFilter(this)" width="360">
                                            <div class="flex jc-sb">
                                                <span>У кого</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_price" onclick="clientCompFilter(this)" width="105">
                                            <div class="flex jc-sb">
                                                <span>Цена</span>
                                                <img src="static/images/dropmenu.svg" class="drop_down_img drop_arrow">
                                            </div>
                                        </th>
                                        <th class="cl_com_filters" id="cl_com_manager" onclick="clientCompFilter(this)" width="120">
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
function sortCompTableByProviders(element) {
    $('#content_table_comp').empty();
    let tbody = '';
    for (let i = 0; i < competitor_data.length; i++) {
        if ((element.innerHTML == competitor_data[i].creator && element.id == 'provider') || (element.innerHTML == competitor_data[i].name && element.id == 'client')) {
            tbody += `
            <tr id="client_${competitor_data[i].id}_search" onclick="openCardMenu(this)">
                <td>${competitor_data[i].name}</td>
                <td>${competitor_data[i].item}</td>
                <td>${competitor_data[i].volume}</td>
                <td>${competitor_data[i].creator}</td>
                <td>${competitor_data[i].cost}</td>
                <td>${competitor_data[i].manager != null ? competitor_data[i].manager : 'Ни к кому не прикреплена'}</td>
            </tr>
        `
        }
    }
    $('#content_table_comp').append(tbody);

    setTimeout(function() {
        $('#cl_com_provider .drop_arrow').removeClass('drop_active');
    }, 150)
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
                <td>${competitor_data[i].manager != null ? competitor_data[i].manager : 'Ни к кому не прикреплена'}</td>
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
                    <td>${competitor_data_copy[i].manager != null ? competitor_data[i].manager : 'Ни к кому не прикреплена'}</td>
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
                    <td>${competitor_data_copy[i].manager != null ? competitor_data[i].manager : 'Ни к кому не прикреплена'}</td>
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
                <td>${competitor_data[i].manager != null ? competitor_data[i].manager : 'Ни к кому не прикреплена'}</td>
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
        {id: 'cl_com_client', func: contextualSearchComp},
        {id: 'cl_com_provider', func: contextualSearchComp},
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
                for (let i = 0; i < list.length; i++) {
                    if (list[i].Name == 'Выбрать') {
                        list.splice(i, 1);
                        i == 0 ? i : i--;
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
    function contextualSearchComp(element) {
        $.ajax({
            url: '/getAllClientItems',
            type: 'GET',
            dataType: 'html',
            async: false,
            success: function(data) {
                all_items = JSON.parse(data);
            }
        });
            let parent = $(element).parent();
            let positions = $(element).position();
            let width = $(element).width() - 40;
            parent.append(`
                <div class="input_search_word" style="left: ${positions.left}px; top: ${positions.top}px; width: ${width}px">
                    <input id="${element.id == 'cl_com_provider' ? 'provider' : 'client'}" onkeyup="searchWordComp(this)">
                </div>
            `)
            let id = element.id.split('_')[2];
            function fillList() {
                let list = '';
                let client_array = [];
                for (let i = 0; i < all_items.length; i++) {
                    for (let j = 0; j < all_items[i].data.length; j++) {
                        if (element.id == 'cl_com_provider' && all_items[i].data[j].Creator !== '')
                            list += `<li class="select_this_provider" id="provider" onclick="sortCompTableByProviders(this)">${all_items[i].data[j].Creator}</li>`
                        if (element.id == 'cl_com_client' && all_items[i].data[j].Client_id != null && all_items[i].data[j].Name != 'Выбрать') {
                            for (let k = 0; k < categoryInListClient[1][1].length; k++) {
                                if (categoryInListClient[1][1][k].id == all_items[i].data[j].Client_id) {
                                    client_array.push(categoryInListClient[1][1][k].Name);
                                }
                            }
                        }
                    }
                }
                if (element.id == 'cl_com_client') {
                    for (let i = 0; i < client_array.length - 1; i++) {
                        for (let j = i + 1; j < client_array.length; j++) {
                            if (client_array[i] == client_array[j]) {
                                client_array.splice(j, 1);
                                j--;
                            }
                        }
                    }

                    for (let i = 0; i < client_array.length; i++) {
                        list += `<li class="select_this_provider" id="client" onclick="sortCompTableByProviders(this)">${client_array[i]}</li>`
                    }
                }
                return list;
            }
            console.log(all_items);
            return `
                <div class="context_search hmax" id="search_${id}">
                    <ul id="list_providers_for_search">
                        ${fillList()}
                    </ul>
                </div>
            `
    }
    $('.filter_list').fadeOut(200);
    $('.input_search_word').fadeOut(200);
    setTimeout(function() {
        $('.filter_list').remove();
        $('.input_search_word').remove();
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
    name: {status: false, filter: null},
    category: {status: false, filter: null, last: null},
    manager: {status: false, filter: null, last: null},
    customer: {status: false, filter: null, last: null},
    status: {status: false, filter: null, last: null},
    date: {status: false, filter: null, last: null},
    search_on_regions: {status: false, filter: null, last: null}
}
function searchWordComp(element) {
    $.ajax({
        url: '/getAllClientItems',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            all_items = JSON.parse(data).reverse();
            $('#list_providers_for_search').empty();
            let client_array = [];
            for (let i = 0; i < all_items.length; i++) {
                for (let j = 0; j < all_items[i].data.length; j++) {
                    if (element.id == 'provider') {
                        let current_name = all_items[i].data[j].Creator.toLowerCase();
                        let search_name = element.value.toLowerCase();
                        if (current_name.includes(search_name) && current_name != '')
                            $('#list_providers_for_search').append(`
                                <li class="select_this_provider" id="${element.id}" onclick="sortCompTableByProviders(this)">${all_items[i].data[j].Creator}</li>
                            `)
                    } else {
                        for (let k = 0; k < categoryInListClient[1][1].length; k++) {
                            if (categoryInListClient[1][1][k].id == all_items[i].data[j].Client_id && all_items[i].data[j].Name != 'Выбрать') {
                                client_array.push(categoryInListClient[1][1][k].Name);
                            }
                        }
                    }
                }
            }
            if (element.id == 'client') {
                for (let i = 0; i < client_array.length - 1; i++) {
                    for (let j = i + 1; j < client_array.length; j++) {
                        if (client_array[i] == client_array[j]) {
                            client_array.splice(j, 1);
                            j--;
                        }
                    }
                }
            
                for (let i = 0; i < client_array.length; i++) {
                    let current_name = client_array[i].toLowerCase();
                    let search_name = element.value.toLowerCase();
                    if (current_name.includes(search_name) && current_name != '')
                        $('#list_providers_for_search').append(`
                            <li class="select_this_provider" id="${element.id}" onclick="sortCompTableByProviders(this)">${client_array[i]}</li>
                        `)
                }
            }
            if ($('#list_providers_for_search').html() == '') {
                $('#list_providers_for_search').append(`
                    <span class="select_this_provider">Ничего не найдено</span>
                `)
            }
        }
    });
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
    $('#amount_cards span').html(filter_table.length)
    filterClient[1][1] = filter_table;
    $('.table').remove();
    $('.info').append(fillingTables(filterClient));
    windows.

    sortStatus.category.status = true;
    sortStatus.category.filter = currentCategory;

    $('.centerBlock .header .cancel').remove();
    console.log(123);

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
        $('#amount_cards span').html(filter_table.length)
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.status.status = true;
        sortStatus.status.filter = value;

        $('.centerBlock .header .cancel').remove();
    console.log(123);

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
        $('#amount_cards span').html(filter_table.length)
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.date.status = true;
        sortStatus.date.filter = value;

        $('.centerBlock .header .cancel').remove();
    console.log(123);

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
        $('#amount_cards span').html(filter_table.length)
        $('.table').remove();
        $('.info').append(fillingTables(filterDelivery));

        sortStatus.customer.status = true;
        sortStatus.customer.filter = value;

        $('.centerBlock .header .cancel').remove();
    console.log(123);

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
    console.log(123);

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
                    $('#amount_cards span').html(searchCards.length)
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
    console.log(123);
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
function sortTableByManagersInAccount(element) {
    let searchWord = element.innerHTML;
    $('.centerBlock .header .cancel').remove();
    console.log(123);

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
                    if (filterAccount[1][1] != undefined) filterAccount[1].pop();
                    data = categoryInListClient[1][1];
                } else {
                    if (filterAccount[1][1] == undefined) {
                        data = categoryInListClient[1][1];
                    } else {
                        data = sortStatus.manager.last == null ? filterAccount[1][1] : sortStatus.manager.last;
                    }
                }
                sortStatus.manager.last = categoryInListClient[1][1]
            } else {
                data = saveTableAndCard[1][1]
            }
            let listData = [
                { id: 'account', list: 'Manager_id', filter: filterAccount },
                { id: 'debit', list: 'Manager_id', filter: filterDebit },
            ]
            let searchCards = [];
            for (let i = 0; i < listData.length; i++) {
                if (listData[i].id == saveTableAndCard[0].id) {
                    for (let j = 0; j < data.length; j++) {
                        let string = data[j].account[listData[i].list];
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
                    $('#amount_cards span').html(searchCards.length)
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
    console.log(123);

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
function sortTableByName(filter, input = true) {
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
        let oneName_data = [newTableData[1][1][i]]
        for (let j = i + 1; j < newTableData[1][1].length; j++) {
            if (newTableData[1][1][i].Name === newTableData[1][1][j].Name) {
                oneName_data.push(newTableData[1][1][j]);
                newTableData[1][1].splice(j, 1);
                j--;
            }
        }
        for (let k = 0; k < oneName_data.length; k++) {
            filter_table.push(oneName_data[k]);
        }
    }
    filter_table.sort(function (a, b) {
        if (sort == 'max') {
            if (a.Name < b.Name) return 1;
            if (a.Name > b.Name) return -1;
        } else {
            if (a.Name > b.Name) return 1;
            if (a.Name < b.Name) return -1;
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
        sortStatus.name.status = true;
        sortStatus.name.filter = sort;
    }
    
    $('.centerBlock .header .cancel').remove();
    console.log(123);

    if (input) {
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
    }
    setTimeout(function() {
        $('#all_name .drop_arrow').removeClass('drop_active');
    }, 150)
}
function sortTableByArea(filter, input = true, close_card = false) {
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
    if (input || close_card) {
        $('.centerBlock .header .cancel').remove();
        
        $('.centerBlock .header').append(`
            <div class="cancel">
                <button class="btn btn-main" onclick="cancelSearch()">Отменить поиск</button>
            </div>
        `)
    }
    if (client_filter == '' && provider_filter == '' && carrier_filter == '') {
        $('.centerBlock .header .cancel').remove()
    };
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
        for (let i = 0; i < item_list.length - 1; i++) {
            for (let j = i + 1; j < item_list.length; j++) {
                if (item_list[i].item_product == item_list[j].item_product) {
                    let first_date = item_list[i].item_date == '' ? getValidationDate('01.01.1970') : getValidationDate(item_list[i].item_date);
                    let second_date = item_list[j].item_date == '' ? getValidationDate('01.01.1970') : getValidationDate(item_list[j].item_date);
                    if (first_date > second_date) {
                        item_list.splice(j, 1);
                        j--;
                    } else {
                        item_list.splice(i, 1);
                        i == 0 ? i : i--;
                    }
                }
            }
        }
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
    $('#amount_cards span').html(table_data.length)
    $('.table').remove();
    $('.info').append(fillingTables(filterProvider, true));

    sortStatus.price.status = true;
    sortStatus.price.filter = filter.id;
    $('.centerBlock .header .cancel').remove();
    console.log(123);
    

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
    $('#amount_cards span').html(table_data.length)
    $('.table').remove();
    $('.info').append(fillingTables(filterProvider, true));

    sortStatus.product.status = true;
    sortStatus.product.filter = filter.innerHTML;
    $('.centerBlock .header .cancel').remove();
    console.log(123);

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
function selectFilterName(element) {
    let id = element.id;
    function listArea() {
        let ul = $('<ul>', { class: 'list'});
        ul.append(`
            <li id="min" onclick="sortTableByName(this)">От А до Я</li>
            <li id="max" onclick="sortTableByName(this)">От Я до А</li>
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
        let data;

        $.ajax({
            url: '/getUsers',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                data = JSON.parse(result);
            }
        });
        console.log(data);
        let filter_table = [];
        for (let j = 0; j < saveTableAndCard[1][1].length; j++) {
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].role, data[i].id, saveTableAndCard[1][1][j].Manager_id)
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
        console.log(filter_table);
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
function selectManagerInAccount(element) {
    let id = element.id;
    function listManager() {
        let ul = $('<ul>', { class: 'list'});
        let data;
        // let current_managers = [];
        // $('.table tbody').toArray().forEach(function(element) {
        //     if ($('.table').attr('id') == 'debit') {
        //         current_managers.push($($(element).children()[0].children).last().html())
        //     } else [
        //         current_managers.push($($(element).children()[0].children).last().html())
        //     ]
        //     //console.log($(element).children().children().last().html())
        // })

        $.ajax({
            url: '/getUsers',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) {
                data = JSON.parse(result);
            }
        });
        console.log(data);
        let filter_table = [];
        for (let j = 0; j < saveTableAndCard[1][1].length; j++) {
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].role, data[i].id, saveTableAndCard[1][1][j].account.Manager_id)
                if (data[i].role == 'manager' && saveTableAndCard[1][1][j].account.Manager_id == data[i].id) {
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
        console.log(filter_table);
        for (let i = 0; i < filter_table.length; i++) {
            ul.append($('<li>', {
                html: filter_table[i].second_name,
                id: filter_table[i].id,
                onclick: 'sortTableByManagersInAccount(this)'
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
    if (client_filter != '' && object[0].id === 'client') {
        object[1][1] = object[1][1].filter(element => element[client_filter.type].toLowerCase() === client_filter.value.toLowerCase());
    }
    if (provider_filter != '' && object[0].id === 'provider') {
        object[1][1] = object[1][1].filter(element => element[provider_filter.type].toLowerCase() === provider_filter.value.toLowerCase());
    }
    if (carrier_filter != '' && object[0].id === 'carrier') {
        object[1][1] = object[1][1].filter(element => element[carrier_filter.type].toLowerCase() === carrier_filter.value.toLowerCase());
    }

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
        let current_period_month = analytics_filter.filter.period && analytics_filter.filter.period != '' ? getPeriod() : datePeriod('month');
        function datePeriod(period) {
            let date_filter = [
                {id: 'day', period: 0, text: 'за последний день'},
                {id: 'weak', period: 7, text: 'за последнюю неделю'},
                {id: 'month', period: 30, text: 'за последний месяц'},
                {id: 'half_year', period: 180},
                {id: 'year', period: 365, text: 'за последний год'},
                {id: 'all', period: 5475, text: 'за все время'},
            ]
            for (let i = 0; i < date_filter.length; i++) {
                if (period == date_filter[i].id) {
                    let today = getCurrentDate('year');
                    let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)/;
        
                    let date_arr = datetime_regex.exec(today);
                    let first_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                    let second_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                    second_datetime.setDate(first_datetime.getDate() - date_filter[i].period);
                    if (period != 'half_year') $('#period_accounts').html(date_filter[i].text);
                    return [second_datetime, first_datetime];
                }
            }
        }
        function getPeriod() {
            const period = analytics_filter.filter.period.split(' - ');
            return period.map(date => {
                return getValidationDate(date)
            })
        }
        console.log(current_period_month);
        $('#analytics_block_hidden').remove();
        if (user.role == 'admin') {
            let list = [
                {function: analyticsFilterTable_0, id: 0, name: 'Прибыль по клиентам'},
                {function: analyticsFilterTable_1, id: 1, name: 'Сводный по объёмам'},
                {function: analyticsFilterTable_2, id: 2, name: 'По клиентам'},
                {function: analyticsFilterTable_3, id: 3, name: 'По приветам'},
                {function: analyticsFilterTable_4, id: 4, name: 'Отгрузки менеджеров'},
                {function: analyticsFilterTable_5, id: 5, name: 'Баллы и бонусы'},
                {function: analyticsFilterTable_6, id: 6, name: 'Проделанная работа'},
            ]
            
            let current_block = list.filter((element) => element.id == object[0].last)[0];
            $('#active_field').html(current_block.name)
            return current_block.function(current_period_month);
        } 
        if (user.role == 'manager') return analyticsFilterTable_1(current_period_month, false, true);
    }

    let table = $('<table />', {
        class: 'table',
        id: object[0].id,
    });

    return rowFilling(object[object.length - 1], object[0].id, table);
}