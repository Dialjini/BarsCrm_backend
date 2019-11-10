/**
 * Функции для работы с таблиц
 */

var rowFilling = (object, id, table) => {
    for (let i = 0; i < object.length; i++) {
        if (i == 0) {
            element = $('<tr>');
        } else if (id === 'stock') {
            element = $('<tr>', {id: `${id}-${i}`, onclick: 'createCardMenu(this, 1)'});            
        } else {
            element = $('<tr>', {id: `${id}-${i}`, onclick: 'createCardMenu(this)'});
        }
        for (let j = 0; j < object[i].length; j++) {
            let el;
            // Переделать
            if (id == 'stock' && j == object[i].length - 1 && i != 0) {el = $('<td>', {
                class: 'pos-rel',
                append: $('<span>', {
                    html: object[i][j],
                }).add($('<img>', {
                    src: 'static/images/transit.png',
                    class: 'transit_img',
                }))
            })} else if (i == 0) {
                el = $('<th>', {width: `${object[0][j].width}%`, html: object[0][j].name})
            } else {
                el = $('<td>', {html: object[i][j]});
            }
            element.append(el);
        }
        table.append(element);
    }
    return table;
}

function fillingTables(object) {
    object[0].active = true;
    saveTableAndCard = object;

    for (let i = object[0].lastCard.length - 1; i >= 0; i--) {
        if (object[0].lastCard[i] != null) {
            return object[0].lastCard[i];
        }
    }

    let table = $('<table />', {
        class: 'table',
        id: object[0].id,
    });

    return rowFilling(object[object.length - 1], object[0].id, table);
}