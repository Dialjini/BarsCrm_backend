/**
 * Функции для работы с таблиц
 */

let rowFilling = (object, id, table) => {
    let getTitleTable = () => {
        let element = $('<tr>');
        for (let i = 0; i < object[0].length - 1; i++) {
            elementTr = `<th width="${object[0][i].width}%">${object[0][i].name}</th>`;
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

        for (let i = object[1].length - 1; i >= 0; i--) {
            let element = $('<tr>', {id: `${id}_${i + 1}`, onclick: 'createCardMenu(this)'});
            // Получать для разных таблиц - разные переменные
            let name, data = [
                { id: 'client', list: [object[1][i].id, object[1][i].Name, object[1][i].Oblast, object[1][i].Rayon, object[1][i].Category, object[1][i].Manager_id]},
                { id: 'provider', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Group, object[1][i].Price, object[1][i].Manager_id]},
                { id: 'carrier', list: [object[1][i].Name, object[1][i].Region, object[1][i].Area, object[1][i].Capacity, object[1][i].View, object[1][i].Manager_id]},
                { id: 'debit', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id, object[1][i].Manager_id]},
                { id: 'account', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id]},
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
            //let prefix = object[1][i].items[0].Prefix;
            let element = $('<tr>', {id: `delivery_${i + 1}`, onclick: 'createDelCardMenu(this)'});
            const name = [object[1][i].delivery.Date, object[1][i].delivery.Name, object[1][i].delivery.Stock, object[1][i].delivery.Carrier_id, object[1][i].delivery.Prefix, object[1][i].delivery.Price, +object[1][i].delivery.Price - ((+object[1][i].delivery.Price * +object[1][i].delivery.NDS) / 100), object[1][i].delivery.Payment_date];

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
            //let prefix = object[1][i].items[0].Prefix;
            let element = $('<tr>', {id: `account_${i + 1}`, onclick: 'createCardMenu(this)'});
            const name = [123, object[1][i].account.Date, object[1][i].account.Name, object[1][i].account.Sum, object[1][i].account.Status, object[1][i].account.Hello, object[1][i].account.Manager_id];

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
                const name = [object[1][i].items[k].Group_name, object[1][i].items[k].Name, object[1][i].items[k].Prefix, object[1][i].items[k].Volume, object[1][i].items[k].Packing, object[1][i].items[k].NDS, object[1][i].items[k].Cost, object[1][i].stock_address];

                for (let j = 0; j < name.length - 1; j++) {
                    let elementTr = $('<td>', { html: name[j] });
                    element.append(elementTr);
                }
                element.append($('<td>', { class: 'pos-rel', append: $('<span>', { html: name[name.length - 1] })
                            .add($('<img>', { src: 'static/images/transit.png', class: 'transit_img' }))}));
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

            for (let j = 0; j < name.length - 1; j++) {
                let elementTr = $('<td>', { html: name[j] });
                element.append(elementTr);
            }
            element.append($('<td>', { class: 'pos-rel', append: $('<span>', { html: name[name.length - 1] })
                        .add($('<img>', { src: 'static/images/transit.png', class: 'transit_img' }))}));
            table.append(element);
        }
        return table;
    }

    const tableFunctiouns = [
        { id: 'client', function: rowFillingDefault },
        { id: 'provider', function: rowFillingDefault },
        { id: 'carrier', function: rowFillingDefault },
        { id: 'debit', function: rowFillingDefault },
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

function selectManager(element) {
    function listManager() {
        let ul = $('<ul>', { class: 'list'});
        const data = [
            { id: 0, name: 'Петров' },
            { id: 1, name: 'Пупсин' },
            { id: 2, name: 'Кустов' },
            { id: 3, name: 'Сидоров' },
        ]
        // data = массив фамилий менеджеров
        for (let i = 0; i < data.length; i++) {
            ul.append($('<li>', {
                html: data[i].name,
                id: data[i].id,
                onclick: ''
            }))
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

function fillingTables(object) {
    if (object[0].id !== 'filter_stock') {
        object[0].active = true;
        saveTableAndCard = object;
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