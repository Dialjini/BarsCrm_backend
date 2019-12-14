/**
 * Функции для работы с таблиц
 */
let rowFilling = (object, id, table) => {
    let getTitleTable = () => {
        let element = $('<tr>');
        for (let i = 0; i < object[0].length - 1; i++) {
            if (i == 1 && id == 'stock') {
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
            } else {
                elementTr = `<th width="${object[0][i].width}%">${object[0][i].name}</th>`;
            }
            element.append(elementTr);
        }
        if (id !== 'delivery' && id !== 'stock') {
            element.append(`
            <th id="manager" onclick="selectManager(this)" width="${object[0][object[0].length - 1].width}%">
                <div class="flex jc-sb">
                    <span>${object[0][object[0].length - 1].name}</span>
                    <img src="static/images/dropmenu_black.svg" class="drop_down_img manager">
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

        for (let i = object[1].length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `${id}_${i + 1}`, onclick: 'createCardMenu(this)'});
            let managerSecondName;
            for (let j = 0; j < managers.length; j++) {
                if (+managers[j].id == +object[1][i].Manager_id && object[1][i].Manager_active) {
                    managerSecondName = managers[j].second_name;
                    break;
                } else {
                    managerSecondName = 'Не выбран';
                }
            }
            // Получать для разных таблиц - разные переменные
            let name, data = [
                { id: 'client', list: [object[1][i].id, object[1][i].Name, object[1][i].Oblast, object[1][i].Rayon, object[1][i].Category, managerSecondName] },
                { id: 'provider', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Group, object[1][i].Price, managerSecondName] },
                { id: 'carrier', list: [object[1][i].Name, object[1][i].Region, object[1][i].Area, object[1][i].Capacity, object[1][i].View, managerSecondName] },
            ]
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    name = data[i].list;
                    break;
                }
            }
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

    let rowFillingDelivery = (id) => {
        table.append(getTitleTable());
        for (let i = object[1].length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `delivery_${i + 1}`, onclick: 'createDelCardMenu(this)'});
            let carrier_name = object[1][i].carrier == null ? 'Не выбран' : object[1][i].carrier.Name
            object[1][i].delivery.NDS = object[1][i].delivery.NDS[0] + object[1][i].delivery.NDS[1];
            const name = [object[1][i].delivery.Date, object[1][i].delivery.Name, object[1][i].delivery.Stock, carrier_name, object[1][i].delivery.Customer, object[1][i].delivery.Price, object[1][i].delivery.Price - ((object[1][i].delivery.Price * +object[1][i].delivery.NDS) / 100), object[1][i].delivery.Payment_date];
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
        for (let i = object[1].length - 1; i >= 0; i--) {
            console.log(object[1][i]);
            if (object[1][i].account.Payment_history != undefined) {
                let payment_list = JSON.parse(object[1][i].account.Payment_history);
                let amount = object[1][i].account.Sum;
                let payment_amount = 0;

                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +payment_list[i].sum
                }

                if (+amount <= +payment_amount) status = '<span class="green">Оплачено</span>'
                else status = '<span class="red">Неоплачено</span>'
            } else {
                status = '<span class="red">Неоплачено</span>';
            }

            let element = $('<tr>', {id: `account_${i + 1}`, onclick: 'createCardMenu(this)'});
            const name = [object[1][i].items[0].Prefix, object[1][i].account.Date, object[1][i].account.Name, object[1][i].account.Sum, status, object[1][i].account.Hello, object[1][i].account.Manager_id];

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
        $.ajax({
            url: '/getDeliveries',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(result) { deliveryTable = JSON.parse(result) },
        });
        table.append(getTitleTable());
        for (let i = object[1].length - 1; i >= 0; i--) {
            let payment_amount = 0;
            if (object[1][i].account.Payment_history != undefined) {
                let payment_list = JSON.parse(object[1][i].account.Payment_history);
                let amount = object[1][i].account.Sum;

                for (let i = 0; i < payment_list.length; i++) {
                    payment_amount += +payment_list[i].sum
                }
            } else {
                payment_amount = 0;
            }

            let first_date;

            for (let j = 0; j < deliveryTable.length; j++) {
                if (deliveryTable[j].delivery.Account_id == i + 1) {
                    first_date = deliveryTable[j].delivery.Start_date;
                    break;
                }
            }
            if (first_date == undefined) {
                first_date = 'Не указано';
            }

            let element = $('<tr>');
            const name = [object[1][i].items[0].Prefix, object[1][i].account.Name, first_date, 'xx.xx.xx', object[1][i].account.Sum, payment_amount, +object[1][i].account.Sum - payment_amount, object[1][i].account.Manager_id];

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
        for (let i = object[1].length - 1; i >= 0; i--) {
            for (let k = 0; k < object[1][i].items.length; k++) {
                let element = $('<tr>', {id: `stock_${object[1][i].items[k].Item_id}`, onclick: 'createCardMenu(this, 1)'});
                const name = [object[1][i].items[k].Group_name, object[1][i].items[k].Name, object[1][i].items[k].Prefix, object[1][i].items[k].Weight, object[1][i].items[k].Volume, object[1][i].items[k].Packing, object[1][i].items[k].NDS, object[1][i].items[k].Cost, object[1][i].stock_address];

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
        for (let i = object[1].length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `stock_${object[1][i].Item_id}`, onclick: 'createCardMenu(this, 1)'});
            const name = [object[1][i].Group_name, object[1][i].Name, object[1][i].Prefix, object[1][i].Volume, object[1][i].Packing, object[1][i].NDS, object[1][i].Cost, object[1][i].stock_address];

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
        { id: 'provider', function: rowFillingDefault },
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
function sortTableByManagers(element) {
    let searchWord = element.innerHTML;
    console.log(searchWord);
    // Сортировать таблицу по searchWord;
}
function selectManager(element) {
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

        for (let i = 0; i < data.length; i++) {
            if (data[i].role == 'manager') {
                ul.append($('<li>', {
                    html: data[i].second_name,
                    id: data[i].id,
                    onclick: 'sortTableByManagers(this)'
                }))
            }
        }
        return ul;
    }
    if ($('.table .manager').hasClass('drop_active')) {
        $('.table .manager').removeClass('drop_active');
        $('.list_manager').fadeOut(200);
        setTimeout(function() {
            $('.list_manager').remove();
        }, 200);
        return;
    }
    $('.table .manager').addClass('drop_active');
    $(element).append($('<div>', { 
        class: 'list_manager',
        css: {'top': `${$(element).height() + 20}px`},
        append: listManager()
    }))
    $('.list_manager').fadeIn(200);
}

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