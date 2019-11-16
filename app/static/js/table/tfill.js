/**
 * Функции для работы с таблиц
 */

var rowFilling = (object, id, table) => {

    let rowFillingDefault = () => {
        for (let i = 0; i < object.length; i++) {
            i === 0 ? element = $('<tr>') : element = $('<tr>', {id: `${id}-${i}`, onclick: 'createCardMenu(this)'});
            for (let j = 0; j < object[i].length; j++) {
                let elementTr;
                if (i == 0) {
                    if (j == object[i].length - 1 && id !== 'delivery') {
                        elementTr = $('<th>', { 
                            width: `${object[0][j].width}%`,
                            append: $('<div>', {
                                class: 'flex',
                                append: $('<span>', {
                                    html: object[0][j].name
                                }).add($('<img>', { 
                                    src: 'static/images/dropmenu_black.svg',
                                    class: 'drop_down_img manager',
                                    onclick: ''
                                }))
                            })
                        })
                        element.append(elementTr);
                        continue;
                    }
                    elementTr = $('<th>', { width: `${object[0][j].width}%`, html: object[0][j].name })
                    element.append(elementTr);
                    continue;
                } else {
                    elementTr = $('<td>', { html: object[i][j] });
                }
                element.append(elementTr);
            }
            table.append(element);
        }
        return table;
    }

    let rowFillingStock = () => {
        for (let i = 0; i < object.length; i++) {
            i === 0 ? element = $('<tr>') : element = $('<tr>', {id: `${id}-${i}`, onclick: 'createCardMenu(this, 1)'});
            for (let j = 0; j < object[i].length; j++) {
                let elementTr;
                if (i == 0) {
                    elementTr = $('<th>', { width: `${object[0][j].width}%`, html: object[0][j].name });
                    element.append(elementTr);
                    continue;
                }
                j == object[i].length - 1
                    ? elementTr = $('<td>', { class: 'pos-rel', append: $('<span>', { html: object[i][j] })
                        .add($('<img>', { src: 'static/images/transit.png', class: 'transit_img' }))}) 
                    : elementTr = $('<td>', { html: object[i][j] });
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
        { id: 'debit', function: rowFillingDefault },
        { id: 'account', function: rowFillingDefault },
        { id: 'delivery', function: rowFillingDefault },
        { id: 'stock', function: rowFillingStock },
    ]

    for (let element of tableFunctiouns) {
        if (element.id === id) {
            return element.function();
        }
    }
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
        return analyticsContent();
    }

    let table = $('<table />', {
        class: 'table',
        id: object[0].id,
    });

    return rowFilling(object[object.length - 1], object[0].id, table);
}