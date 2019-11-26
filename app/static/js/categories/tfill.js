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
            <th id="manager" onclick="selectManager()" width="${object[0][object[0].length - 1].width}%">
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
        for (let i = 0; i < object[1].length; i++) {
            let element = $('<tr>', {id: `${id}_${i + 1}`, onclick: 'createCardMenu(this)'});
            // Получать для разных таблиц - разные переменные
            let name, data = [
                { id: 'client', list: [object[1][i].id, object[1][i].Name, object[1][i].Oblast, object[1][i].Rayon, object[1][i].Category, object[1][i].Manager_id]},
                { id: 'provider', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Group, object[1][i].Price, object[1][i].Manager_id]},
                { id: 'carrier', list: [object[1][i].Name, object[1][i].Region, object[1][i].Area, object[1][i].Capacity, object[1][i].View, object[1][i].Manager_id]},
                { id: 'debit', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id, object[1][i].Manager_id]},
                { id: 'account', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id]},
                { id: 'delivery', list: [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id, object[1][i].Manager_id]}
            ]
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    name = data[i].list;
                    break;
                }
            }
            for (let j = 0; j < name.length; j++) {
                let currentInfo = name[j];
                if (currentInfo === null) {
                    currentInfo = 'Не указано';
                }

                let elementTr = $('<td>', { html: currentInfo });
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingStock = (id) => {
        table.append(getTitleTable());
        for (let i = 0; i < object[1].length; i++) {
            let element = $('<tr>', {id: `${id}_${i + 1}`, onclick: 'createCardMenu(this, 1)'});
            const name = [object[1][i].Oblast, object[1][i].Rayon, object[1][i].Name, object[1][i].Product, object[1][i].Price, object[1][i].Manager_id, object[1][i].Manager_id];

            for (let j = 0; j < name.length; j++) {
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
        { id: 'account', function: rowFillingDefault },
        { id: 'delivery', function: rowFillingDefault },
        { id: 'stock', function: rowFillingStock },
    ]

    for (let element of tableFunctiouns) {
        if (element.id === id) {
            return element.function(id);
        }
    }
}

function selectManager() {
    if ($('.table .manager').hasClass('drop_active')) {
        $('.table .manager').removeClass('drop_active');
        return;
    }
    $('.table .manager').addClass('drop_active');
}

function fillingTables(object) {
    object[0].active = true;
    saveTableAndCard = object;

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