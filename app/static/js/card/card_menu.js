// Смущают глобальные переменные
let saveTableAndCard;

// Отслеживание нажатия для всплывающей карточки "Открепить менеджера..."
$(document).mouseup(function(e) {
    let container = $('.drop_menu');
    if (container.has(e.target).length === 0) {
        container.fadeOut(200);
    }
});
// Получение текущего времени в формате hh:mm
function getCurrentTime() {
    let time = new Date();
    let hour = time.getHours() > 12 ? time.getHours() : (time.getHours() < 10 ? '0' + time.getHours() : time.getHours());
    let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    return `${hour}:${minute}`
}
// Получение текущей даты в формате dd.mm или dd.mm.yy
function getCurrentDate(year = 'none') {
    let time = new Date();
    let month = time.getMonth() + 1;
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    if (year !== 'none') {
        let year = time.getFullYear();
        year = String(year).substring(2, 4);
        return `${day}.${month}.${year}`;
    }
    return `${day}.${month}`;
}
// Создание карточки
function createCardMenu(element, index = 0) {
    // Вывод обычной карточки или карточки-окна
    if (index == 0) {
        $('.table, .blockCreateEmptyCard').remove();
        $('[name="linkCategory"]').removeClass('active');
    } else {
        $('.overflow').remove();
    }

    $('.card_menu').remove();
    let getInfo = element.id.split('_');
    let selectedLine = new Object();

    // Информация по всем карточкам подкатегорий
    // Подставить актуальные данные
    const titleObject = [
        {
            id: 'client',
            list: [`Местное время: ${getCurrentTime()}`],
            link: clientContentCard,
            status: getInfo[1]
        },
        {
            id: 'provider',
            list: [`Местное время: ${getCurrentTime()}`],
            link: providerContentCard,
            status: getInfo[1]
        },
        {
            id: 'carrier',
            list: [`Местное время: ${getCurrentTime()}`],
            link: carrierContentCard,
            status: getInfo[1]
        },
        {
            id: 'debit',
            list: [''],
            link: debitContentCard,
            status: getInfo[1]
        },
        {
            id: 'account',
            list: [],
            link: accountContentCard,
            status: getInfo[1]
        },
        {
            id: 'delivery',
            list: [`Оформить заявку на Доставку`],
            link: deliveryContentCard,
            status: getInfo[1]
        },
        {
            id: 'stock',
            list: [''],
            link: stockContentCard,
            status: getInfo[1]
        }
    ]

    // Получаем нужную информацию по карточке
    for (let i = 0; i < titleObject.length; i++) {
        if (titleObject[i].id.includes(getInfo[0])) {
            element = titleObject[i];
            // Вытягиваем данные по Айди карточки и поставляем в поля
            if (getInfo[1] !== 'new') {
                let data_list = dataName[i].link[1][1];
                if (getInfo[0] === 'stock') {
                    for (let j = 0; j < data_list.length; j++) {
                        for (let k = 0; k < data_list[j].items.length; k++) {
                            if (data_list[j].items[k].Item_id == getInfo[1]) {
                                selectedLine = data_list[j].items[k];
                                selectedLine['stock_address'] = data_list[j].stock_address;
                                break;
                            }
                        }
                    }
                } else if (getInfo[0] === 'account') {
                    for (let j = 0; j < data_list.length; j++) {
                        if (data_list[j].account.id == getInfo[1]) {
                            selectedLine = data_list[j];
                        }
                    }
                } else if (getInfo[0] === 'delivery') {
                    for (let j = 0; j < data_list.length; j++) {
                        if (data_list[j].delivery.id == getInfo[1]) {
                            selectedLine = data_list[j].delivery;
                        }
                    }
                } else {
                    selectedLine = data_list[titleObject[i].status - 1];
                }

                console.log(getInfo, selectedLine);
                // Передать данные счета в карточку доставки
                
                let list = Object.keys(selectedLine);
                for (let elem = 0; elem < list.length; elem++) {
                    if (selectedLine[list[elem]] == null || selectedLine[list[elem]] == 'null'){ 
                        selectedLine[list[elem]] = '';

                    }
                }

                titleObject[i].list.unshift(`Код: ${selectedLine.id || selectedLine.Item_id || selectedLine.account.id}`);
                if (getInfo[0] === 'client') {
                    titleObject[i].list.push(`<span id="${getInfo[0]}_site">${selectedLine.Site}</span>`);
                    titleObject[i].list.push(`<span id="${getInfo[0]}_holding">${selectedLine.Holding}</span>`)
                } 
                if (getInfo[0] === 'provider') {
                    titleObject[i].list.push(`<span id="${getInfo[0]}_holding">${selectedLine.Holding}</span>`)
                } 
                if (getInfo[0] === 'account') {
                    titleObject[i].list.push(`Счета от ${selectedLine.items[0].Prefix}`)
                }
            } else {
                const emptyData = [
                    { id: 'client', list: ['Name', 'Rayon', 'Category', 'Distance', 'Segment', 'UHH', 'Price', 'Oblast', 'Station', 'Tag', 'Adress', 'Site', 'Holding', 'Demand_item', 'Demand_volume', 'Livestock_all', 'Livestock_milking', 'Livestock_milkyield'] },
                    { id: 'provider', list: ['Name', 'Rayon', 'Category', 'Distance', 'UHH', 'Price', 'Oblast', 'Train', 'Tag', 'Adress', 'NDS', 'Merc', 'Volume', 'Holding'] },
                    { id: 'carrier', list: ['Name', 'Address', 'Area', 'Capacity', 'UHH', 'Region', 'View'] },
                    { id: 'delivery', list: ['Customer', 'Start_date', 'End_date', 'Load_type', 'Type', 'Comment', 'Client', 'Contact_Number']}
                ]
                if (dataName[i].link[1][1] === undefined) getTableData(dataName[i].link, false, true);
                titleObject[i].list.unshift(`Код: 0`);
                
                for (let i = 0; i < emptyData.length; i++) {
                    if (getInfo[0] == emptyData[i].id) {
                        for (let j = 0; j < emptyData[i].list.length; j++) {
                            selectedLine[emptyData[i].list[j]] = '';
                        }
                    }
                }

                if (getInfo[0] === 'client') {
                    titleObject[i].list.push(`<input id="${getInfo[0]}_site" placeholder="Сайт"  value="${selectedLine.Site}">`);
                    titleObject[i].list.push(`<input type="text" placeholder="Холдинг" id="${getInfo[0]}_holding" value="${selectedLine.Holding}">`);
                } if (getInfo[0] === 'provider') {
                    titleObject[i].list.push(`<input type="text" placeholder="Холдинг" id="${getInfo[0]}_holding" value="${selectedLine.Holding}">`);
                }  
            }
        }
    }

    // Собираем саму карточку
    function cardMenu() {
        let container = $('<div>', {
            class: 'card_menu',
            id: 'card_menu',
            append: getTitleInfo(element).add(getContentInfo(element))
        })
        return container;
    }
    // Запоминаем карточку
    for (let i = 0; i < dataName.length; i++) {
        if (getInfo[0] == dataName[i].name) {
            if (getInfo[0] !== 'stock') {
                saveTableAndCard = dataName[i].link;
                dataName[i].link[0].lastCard[0] = cardMenu();
            }
            break;
        }
    }

    // Переход в нужную категорию
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        if (linkCategoryInfo[i].subid.includes(saveTableAndCard[0].id)) {
            $(`#${linkCategoryInfo[i].id}`).addClass('active');
            if (element.status == 'new') {
                $('div').is('#subcategories') ? $('#subcategories').remove() : '';
                addButtonsSubcategory(linkCategoryInfo[i].id[linkCategoryInfo[i].id.length - 1]);
                $(`#${saveTableAndCard[0].id}Button`).addClass('active');
                linkField();
            }
            break;
        }
    }

    // Получаем контент карточки
    function getContentInfo(element) {
        let content = $('<div>', { class: 'content' });
        content.append(element.link(selectedLine));
        return content;
    }
    
    $('.info').append(cardMenu());
    $('.next .btn, #add_new_comment').attr('name', getInfo.join('_'));
    itemSelection(getInfo[0], selectedLine);

    // Получаем данные по клиентам // Временно, пока не будем работать с счетами и доставкой
    if (getInfo[0] == 'client' || getInfo[0] == 'provider' || getInfo[0] == 'carrier') getContactsAndItems();
    function getContactsAndItems() {
        if (getInfo[1] == 'new') {
            addMember(getInfo[0]);
            addRow(`${getInfo[0]}-group`);
            $('[name="remove_last_group"]').fadeOut(0);
        } else {
            $.ajax({
                url: '/getItems',
                type: 'GET',
                data: {category: getInfo[0], id: getInfo[1]},
                dataType: 'html',
                success: function(result) {
                    inputItems(JSON.parse(result));
                }
            });
            $.ajax({
                url: '/getContacts',
                type: 'GET',
                data: {category: getInfo[0], id: getInfo[1]},
                dataType: 'html',
                success: function(result) {
                    inputContacts(JSON.parse(result));
                }
            });
            getCommentsInfo.getRequest(getInfo);
        }
        function inputItems(items) {
            if (items.length == 0) 
                addRow(`${getInfo[0]}-group`);
            else {
                for (let i = 0; i < items.length; i++) {
                    addRow(`${getInfo[0]}-group`, items[i]);
                }
            }
            if ($(`#group`).children().length <= 1) {
                $(`[name="remove_last_group"]`).fadeOut(0);
            }
        }
        function inputContacts(contacts) {
            if (contacts.length == 0) 
                addMember(getInfo[0]);
            else {
                for (let i = 0; i < contacts.length; i++) {
                    addMember(getInfo[0], contacts[i]);
                }
            }
        }
    }

    // Модальное окно для Склада
    if (getInfo[0] === 'stock') {
        $('.info').prepend($('<div>', {class: 'overflow'}));
        $('#card_menu').addClass('modal');
    // Проверка на заполненность Контактов и строк таблиц (Не у Склада)
    } else { 
        try {
            if ($('#group').html().trim() !== '') {
                $('#remove_last_row').fadeIn(0);
            }
        } catch {}
    }

    // Контентная часть Клиентов
    function clientContentCard(selectedLine) {
        let content = $('<div>', { 
            class: 'row_card',
            append: $('<table>', {
                class: 'table_block',
                append: $('<tr>', {
                    append: $('<td>', {
                        class: 'bold',
                        html: 'Наименование'
                    }).add($('<td>', {
                        append: $('<input>', {
                            type: 'text',
                            id: 'client_name',
                            onchange: 'saveCard()',
                            value: selectedLine.Name
                        })
                    }))
                }).add(`<tr>
                            <td>Район</td>
                            <td><input type="text" id="client_area" onchange="saveCard()" value="${selectedLine.Rayon}"></td>
                        </tr>
                        <tr>
                            <td>Область/Край</td>
                            <td><input type="text" id="client_region" onchange="saveCard()" value="${selectedLine.Oblast}"></td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td><input type="text" id="client_address" onchange="saveCard()" value="${selectedLine.Adress}"></td>
                        </tr>
                        <tr>
                            <td>ИНН</td>
                            <td><input type="text" id="client_inn" onchange="saveCard()" value="${selectedLine.UHH}"></td>
                        </tr>`)
            }).add(`<table class="table_block">
                        <tr>
                            <td>Тег</td>
                            <td><input type="text" id="client_tag" onchange="saveCard()" class="string" value="${selectedLine.Tag}"></td>
                        </tr>
                        <tr>
                            <td>Категория</td>
                            <td>
                                <select id="client_category" onchange="itemSelection(this)">
                                    <option value="disabled" selected disabled>Выбрать</option>
                                    <option value="category_0">Клиент</option>
                                    <option value="category_1">Потенциальный клиент</option>
                                    <option value="category_2">Лидер</option>
                                    <option value="category_3">Неперспективный клиент</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ж/Д Станция</td>
                            <td> <input type="text" id="client_station" onchange="saveCard()" class="string" value="${selectedLine.Station}"></td>
                        </tr>
                        <tr>
                            <td>Цена вагона</td>
                            <td><input type="text" id="client_price" onchange="saveCard()" class="string" value="${selectedLine.Price}"></td>
                        </tr>
                        <tr>
                            <td>км от НСК</td>
                            <td><input type="text" id="client_distance" onchange="saveCard()" class="string" value="${selectedLine.Distance}"></td>
                        </tr>
                    </table>
                    <div class="info_block">
                        <span class="lightgray">Отрасль</span>
                        <select id="client_industry" onchange="itemSelection(this)">
                            <option value="disabled" selected disabled>Выбрать</option>
                            <option value="industry_0">Животноводство</option>
                            <option value="industry_1">Птицеводство</option>
                            <option value="industry_2">Свиноводство</option>
                            <option value="industry_3">Растениеводство</option>
                            <option value="industry_4">Рыбоводство</option>
                            <option value="industry_5">Комбикормовый</option>
                        </select>
                        <span class="lightgray" style="margin-top: 17px;">Поголовье</span>
                        <table>
                            <tr>
                                <td>Общее</td>
                                <td>Дойного</td>
                                <td>Надои</td>
                            </tr>
                            <tbody id="livestock">
                                <tr>
                                    <td><input id="livestock_general" type="text" style="width: 75px" value="${selectedLine.Livestock_all}"></td>
                                    <td><input id="livestock_milking" type="text" style="width: 75px" value="${selectedLine.Livestock_milking}"></td>
                                    <td><input id="livestock_milkyield" type="text" style="width: 75px" value="${selectedLine.Livestock_milkyield}"></td>
                                </tr>
                            </tbody>
                        </table>
                        <span class="lightgray" style="margin-top: 17px;">Спрос</span>
                        <table>
                            <tr>
                                <td>Товар</td>
                                <td>Объем</td>
                            </tr>
                            <tbody id="demand">
                                <tr>
                                    <td><input id="demand_product" type="text" style="width: 196px" value="${selectedLine.Demand_item}"></td>
                                    <td><input id="demand_volume" type="text" style="width: 50px" value="${selectedLine.Demand_volume}"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`)
        }).add(`<div class="row_card">
                    <div class="left_side">
                        <div class="hmax" id="member"></div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMember()">
                        </div>
                    </div>
                    <div class="info_block">
                        <span class="lightgray">Группа товаров</span>
                        <div class="hmax">
                            <table>
                                <tr>
                                    <td>Товар</td>
                                    <td>Объем</td>
                                    <td>У кого</td>
                                    <td>Цена</td>
                                </tr>
                                <tbody id="group"></tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="client-group" src="static/images/add.png" onclick="addRow(this.id)">
                            <img name="remove_last_group" class="add_something" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                        </div>
                    </div>
                </div>
                <div class="area">
                    <div class="history">
                        <div class="title">
                            <div>История обращений</div>
                            <img id="add_new_comment" onclick="addComment()" class="add_something" src="static/images/add.png">
                        </div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="messages"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="last_comment">
                        <div class="title">Последние комментарии</div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="comments"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="client" onclick="contractNext(this)">Оформить Договор</button>
                </div>`)
        return content;
    }
    // Контентная часть Поставщиков
    function providerContentCard(selectedLine) {
        let content = $('<div>', {
            class: 'row_card',
            append: $('<table>', {
                class: 'table_block',
                append: $('<tr>', {
                    append: $('<td>', {
                        class: 'bold',
                        html: 'Наименование'
                    }).add($('<td>', {
                        append: $('<input>', {
                            type: 'text',
                            id: 'provider_name',
                            value: selectedLine.Name,
                            onchange: 'saveCard()'
                        })
                    }))
                }).add(`<tr>
                            <td>Район</td>
                            <td>
                                <input type="text" id="provider_area" onchange="saveCard()" value="${selectedLine.Rayon}">
                            </td>
                        </tr>
                        <tr>
                            <td>Область/Край</td>
                            <td>
                                <input type="text" id="provider_region" onchange="saveCard()" value="${selectedLine.Oblast}">
                            </td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td>
                                <input type="text" id="provider_address" onchange="saveCard()" value="${selectedLine.Adress}">
                            </td>
                        </tr>
                        <tr>
                            <td>ИНН</td>
                            <td>
                                <input type="text" id="provider_inn" onchange="saveCard()" value="${selectedLine.UHH}">
                            </td>
                        </tr>`)
            }).add(`<table class="table_block">
                        <tr>
                            <td>Тег</td>
                            <td>
                                <input type="text" id="provider_tag" class="string" onchange="saveCard()" value="${selectedLine.Tag}">
                            </td>
                        </tr>
                        <tr>
                            <td>Категория</td>
                            <td>
                                <select id="provider_category" onchange="itemSelection(this)">
                                    <option value="disabled" selected disabled>Выбрать</option>
                                    <option value="category_0">Клиент</option>
                                    <option value="category_1">Потенциальный клиент</option>
                                    <option value="category_2">Лидер</option>
                                    <option value="category_3">Неперспективный клиент</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ж/Д Станция</td>
                            <td>
                                <input type="text" id="provider_station" class="string" onchange="saveCard()" value="${selectedLine.Train}">
                            </td>
                        </tr>
                        <tr>
                            <td>Цена вагона</td>
                            <td>
                                <input type="text" id="provider_price" class="string" onchange="saveCard()" value="${selectedLine.Price}">
                            </td>
                        </tr>
                        <tr>
                            <td>км от НСК</td>
                            <td>
                                <input type="text" id="provider_distance" class="string" onchange="saveCard()" value="${selectedLine.Distance}">
                            </td>
                        </tr>
                    </table>
                    <table class="table_block">
                        <tr>
                            <td>Объем про-ва</td>
                            <td>
                                <input type="text" id="provider_volume" class="string" onchange="saveCard()" value="${selectedLine.Volume}">
                            </td>
                        </tr>
                        <tr>
                            <td>НДС</td>
                            <td>
                                <input type="text" id="provider_vat" class="string" onchange="saveCard()" value="${selectedLine.NDS}">
                            </td>
                        </tr>
                        <tr>
                            <td>Мерекурий</td>
                            <td>
                                <input type="text" id="provider_merc" class="string" onchange="saveCard()" value="${selectedLine.Merc}">
                            </td>
                        </tr>
                    </table>`)
        }).add(`<div class="row_card">
                    <div class="left_side">
                        <div class="hmax" id="member"></div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMember()">
                        </div>
                    </div>
                    <div class="info_block">
                        <span class="lightgray">Группа товаров</span>
                        <div class="hmax">
                            <table>
                                <tr><td>Товар</td><td>Цена</td><td>НДС</td><td>Упаковка</td><td>Вес</td><td>Фракция</td></tr>
                                <tbody id="group"></tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="provider-group" src="static/images/add.png" onclick="addRow(this.id)">
                            <img name="remove_last_group" class="add_something" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                        </div>
                    </div>
                </div>
                <div class="area">
                    <div class="history">
                        <div class="title">
                            <div>История обращений</div>
                            <img id="add_new_comment" onclick="addComment()" class="add_something" src="static/images/add.png">
                        </div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="messages"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="last_comment">
                        <div class="title">Последние комментарии</div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="comments"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="provider" onclick="contractNext(this)">Оформить Договор</button> 
                </div>`)
        return content;
    }
    // Контентная часть Перевозчиков
    function carrierContentCard(selectedLine) {
        let content = $('<div>', {
            class: 'row_card',
            css: { 'justify-content': 'flex-start' },
            append: $('<table>', {
                class: 'table_block',
                css: {'margin-right': '50px'},
                append: $('<tr>', {
                    append: $('<td>', {
                        class: 'bold',
                        html: 'Наименование'
                    }).add($('<td>', {
                        append: $('<input>', {
                            type: 'text',
                            id: 'carrier_name',
                            value: selectedLine.Name,
                            onchange: 'saveCard()'
                        })
                    }))
                }).add(`<tr>
                            <td>Район</td>
                            <td>
                                <input type="text" id="carrier_area" onchange="saveCard()" value="${selectedLine.Area}">
                            </td>
                        </tr>
                        <tr>
                            <td>Область/Край</td>
                            <td>
                                <input type="text" id="carrier_region" onchange="saveCard()" value="${selectedLine.Region}">
                            </td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td>
                                <input type="text" id="carrier_address" onchange="saveCard()" value="${selectedLine.Address}">
                            </td>
                        </tr>`)
            }).add(`<table class="table_block">
                        <tr>
                            <td>ИНН</td>
                            <td>
                                <input type="text" id="carrier_inn" onchange="saveCard()" value="${selectedLine.UHH}">
                            </td>
                        </tr>
                        <tr>
                            <td>Грузоподъемность</td>
                            <td>
                                <input type="text" id="carrier_capacity" onchange="saveCard()" value="${selectedLine.Capacity}" class="string">
                            </td>
                        </tr>
                        <tr>
                            <td>Вид перевозки</td>
                            <td>
                                <input type="text" id="carrier_view" onchange="saveCard()" value="${selectedLine.View}" class="string">
                            </td>
                        </tr>
                    </table>`)
        }).add(`<div class="row_card" id="media">
                    <div class="left_side">
                        <div class="hmax" id="member"></div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMember('carrier')">
                        </div>
                    </div>
                    <div class="info_block" style="width: fit-content">
                        <span class="lightgray">Рейсы</span>
                        <div class="hmax">
                            <table>
                                <tr>
                                    <td>Дата</td>
                                    <td>Клиент</td>
                                    <td>Склад</td>
                                    <td>Водитель</td>
                                    <td>Цена</td>
                                </tr>
                                <tbody id="group"></tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="carrier-group" src="static/images/add.png" onclick="addRow(this.id)">
                            <img class="add_something" name="remove_last_group" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                        </div>
                    </div>
                </div>
                <div class="area">
                    <div class="history">
                        <div class="title">
                            <div>История обращений</div>
                            <img id="add_new_comment" onclick="addComment()" class="add_something" src="static/images/add.png">
                        </div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="messages"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="last_comment">
                        <div class="title">Последние комментарии</div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="comments"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="carrier" onclick="contractNext(this)">Оформить Договор</button>
                </div>`)
        return content;
    }
    // Контентная часть Счета
    function accountContentCard(selectedLine) {
        let sum = 0, vat = 0;
        function fillingProducts() {
            let list_items = selectedLine.items;
            let table = '';


            for (let i = 0; i < list_items.length; i++) {
                sum += Math.round(list_items[i].Cost * list_items[i].Volume);
                table = table.concat(`
                    <tr class="product" id="product_${list_items[i].Item_id}">
                        <td>${list_items[i].Name}</td>
                        <td>${list_items[i].Packing}</td>
                        <td>${list_items[i].Weight} кг.</td>
                        <td>${Math.round(list_items[i].Volume / list_items[i].Weight)}</td>
                        <td>${list_items[i].Volume}</td>
                        <td>${list_items[i].Cost}</td>
                        <td>${(selectedLine.account.Sale / list_items[i].Volume / list_items.length).toFixed(2)}</td>
                        <td>${(selectedLine.account.Hello / list_items[i].Volume / list_items.length).toFixed(2)}</td>
                        <td>${(selectedLine.account.Shipping / list_items[i].Volume / list_items.length).toFixed(2)}</td>
                        <td>${Math.round(list_items[i].Cost / list_items[i].Volume)}</td>
                        <td>${Math.round(list_items[i].Cost * list_items[i].Volume)}</td>
                    </tr>
                `)
            }
            vat = sum > 0 ? sum - ((sum * +list_items[0].NDS) / 100) : 0;

            if (5 - list_items.length > 0) {
                for (let i = 0; i < 5 - list_items.length; i++) {
                    table = table.concat(`
                        <tr class="product">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    `);
                }
            }
            return table;
        }
        return ` <div class="row_card">
                    <div class="info_block full">
                        <table class="account_table">
                            <tr>
                                <th rowspan="2">Товар</th>
                                <th colspan="2">Фасовка</th>
                                <th colspan="2">Количество</th>
                                <th colspan="5">Цена</th>
                                <th style="width: 90px;" rowspan="2">Сумма</th>
                            </tr>
                            <tr>
                                <th>Тара</th>
                                <th>Вес</th>
                                <th>В тарах</th>
                                <th>Объем</th>
                                <th>Цена прайса</th>
                                <th>Скидка</th>
                                <th>Привет</th>
                                <th>Доставка</th>
                                <th>За единицу</th>
                            </tr>
                            ${fillingProducts()}
                            <tr>
                                <td colspan="9" style="border: none; border-top: 1px solid #e9e9e9"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Общая</span><span>${sum}</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" style="border: none"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">НДС</span><span>${sum - vat}</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" style="border: none"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Без НДС</span><span>${vat}</span></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="row_card">
                    <div class="info_block">
                        <span class="lightgray">Оплата</span>
                        <div class="hmax">
                            <table>
                                <tr>
                                    <th>Позиция</th>
                                    <th>Дата</th>
                                    <th>Сумма</th>
                                </tr>
                                <tbody id="group"></tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="account-group" src="static/images/add.png" onclick="addRow(this.id)">
                            <img class="add_something" name="remove_last_group" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="delivery_new" onclick="arrangeDelivery(this)">Оформить Доставку</button>
                </div>`
    }
    // Контентная часть Дебеторки
    function debitContentCard(selectedLine) {
        return `<div class="row_card"></div>`
    }
    // Контентная часть Склада
    function stockContentCard(selectedLine) {
        return `<div class="row_card">
                    <div class="info_block full">
                        <div class="mb">
                            <span class="bold">Транзит со склада</span>
                            <input class="margin" maxlength="30" onchange="onkeydown()" type="text" onkeydown="widthRole(this)" onkeyup="onkeydown()" onkeypress="onkeydown()" value="${selectedLine.stock_address}">
                        </div>
                        <div>
                            <table class="full">
                                <tr>
                                    <td>Группа товаров</td>
                                    <td>Товар</td>
                                    <td>Юр. лицо</td>
                                    <td>Объем</td>
                                    <td>Фасовка</td>
                                    <td>Цена прайса</td>
                                </tr>
                                <tbody>
                                    <tr>
                                        <td>${selectedLine.Group_name}</td>
                                        <td>${selectedLine.Name}</td>
                                        <td>${selectedLine.Prefix}</td>
                                        <td id="from">${selectedLine.Volume}</td>
                                        <td>${selectedLine.Packing}</td>
                                        <td>${selectedLine.Cost}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </div>
                </div>
                <div class="row_card">
                    <div class="info_block full">
                        <div>
                            <span class="bold">На склад</span>
                            <select class="margin">
                                <option value="Склад 1">Склад 1</option>
                                <option value="Склад 2">Склад 2</option>
                                <option value="Склад 3">Склад 3</option>
                                <option value="Склад 4">Склад 4</option>
                            </select>
                        </div>
                        <div class="mb">
                            <span class="bold">Объем</span>
                            <input style="width: 60px" class="margin" oninput="fillVolume(this.value)">
                        </div>
                        <div>
                            <table class="full">
                                <tr>
                                    <td>Группа товаров</td>
                                    <td>Товар</td>
                                    <td>Юр. лицо</td>
                                    <td>Объем</td>
                                    <td>Фасовка</td>
                                    <td>Цена прайса</td>
                                </tr>
                                <tbody>
                                    <tr>
                                        <td>${selectedLine.Group_name}</td>
                                        <td>${selectedLine.Name}</td>
                                        <td>${selectedLine.Prefix}</td>
                                        <td id="volume_goods"></td>
                                        <td>${selectedLine.Packing}</td>
                                        <td>${selectedLine.Cost}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>     
                </div>
                <div class="next">
                    <button class="btn btn-main" onclick="closeCardMenu('stock_new')">Оформить</button>
                </div>
                `
    }
    // Контентная часть Доставки
    function deliveryContentCard(selectedLine) {
        console.log(selectedLine);
        function carrierSelect() {
            let data = categoryInListCarrier[1][1];
            let list_name = [];
            let select = '<select id="delivery_carrier_id" onchange="selectDrivers(this)">';
            select += '<option value="disabled" selected disabled>Не выбран</option>'
            for (let i = 0; i < data.length; i++) {
                select += `<option value="${data[i].id}">${data[i].Name}</option>`;
                list_name.push({ name: data[i].Name, id: data[i].id });
            }
            select += '</select>';
            return select;
        }
        
        return `<div class="row_card">
                        <table class="table_block">
                            <tr>
                                <td>Заказчик</td>
                                <td>
                                    <input type="text" id="delivery_customer" value="${selectedLine.Customer}">
                                </td>
                            </tr>
                            <tr>
                                <td>Дата отгрузки</td>
                                <td>
                                    <input type="text" id="delivery_start_date" value="${selectedLine.Start_date}">
                                </td>
                            </tr>
                            <tr>
                                <td>Дата разгрузки</td>
                                <td>
                                    <input type="text" id="delivery_end_date" value="${selectedLine.End_date}">
                                </td>
                            </tr>
                            <tr>
                                <td>Способ погрузки</td>
                                <td>
                                    <input type="text" id="delivery_load_type" value="${selectedLine.Load_type}">
                                </td>
                            </tr>
                        </table>
                        <table class="table_block">
                            <tr>
                                <td>Перевозчик</td>
                                <td>
                                    ${carrierSelect()}
                                </td>
                            </tr>
                            <tr>
                                <td>Водитель</td>
                                <td>
                                    <select id="delivery_driver"></select>
                                </td>
                            </tr>
                            <tr>
                                <td>Вид перевозки</td>
                                <td>
                                    <input type="text" id="delivery_type" value="${selectedLine.Type}">
                                </td>
                            </tr>
                            <tr>
                                <td>Комментарий</td>
                                <td>
                                    <input type="text" id="delivery_comment" value="${selectedLine.Comment}">
                                </td>
                            </tr>
                        </table>
                        <table class="table_block">
                            <tr>
                                <td>Клиент</td>
                                <td>
                                    <input type="text" id="delivery_client" value="${selectedLine.Client}">
                                </td>
                            </tr>
                            <tr>
                                <td>Контакт на выгрузке</td>
                                <td>
                                    <input type="text" id="delivery_contact_number" value="${selectedLine.Contact_Number}">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="row_card">
                        <div class="info_block">
                            <div>
                                <span class="lightgray">Рейс</span>
                                <table>
                                    <tr>
                                        <th>Товар</th>
                                        <th>Склад</th>
                                        <th>Вес</th>
                                        <th>Вид упаковки</th>
                                        <th>Сумма</th>
                                        <th>Клиент</th>
                                    </tr>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                            <div class="info_block fit" style="margin-top: 15px;">
                                <span class="lightgray" style="margin-top: 10px;">Оплата</span>
                                <div class="hmax">
                                    <table style="width: fit-content">
                                        <tr>
                                            <th>Дата</th>
                                            <th>Сумма</th>
                                        </tr>
                                        <tbody id="group">

                                        </tbody>
                                    </table>
                                </div>
                                <div class="events">
                                    <img class="add_something" id="delivery-group" src="static/images/add.png" onclick="addRow(this.id)">
                                    <img class="add_something" name="remove_last_group" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="next">
                        <button class="btn" style="margin-right: 10px" id="delivery_new" onclick="closeCardMenu(this.id)">Забирает сам</button>
                        <button class="btn btn-main" id="delivery_new" onclick="makeRequest(this.name)">Оформить Заявку</button>
                    </div>`
    }
}
function makeRequest(element) {
    let data = {};
    for (let i = 0; i < idCardFields[3].ids.length; i++) {
        data[idCardFields[3].ids[i]] = $(`#${idCardFields[3].ids[i]}`).val();
    }

    let idDelivery = element.split('_');
    data['delivery_id'] = idDelivery[idDelivery.length - 1];
    data['delivery_date'] = '06.12.2019';
    data['delivery_vat'] = '20';
    data['delivery_name'] = 'Тестовый';
    data['delivery_contact_end'] = 'Петя';
    data['delivery_payment_date'] = '10.12.2019';
    data['delivery_prefix'] = 'ООО';
    data['delivery_stock'] = 'ул. Пушкина';
    data['delivery_price'] = '1000';
    data['delivery_contact_name'] = 'Василий';
    console.log(data);
    $.ajax({
        url: '/addDelivery',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function(data) {
            console.log(data);
        }
    });
    
    closeCardMenu(element);
}
function selectDrivers() {
    $('#delivery_driver').append(
        `<option>Водитель 1</option>
        <option>Водитель 2</option>
        <option>Водитель 3</option>`
    )
}
function createDelCardMenu(element) {
    $.ajax({
        url: '/getCarriers',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            if (categoryInListCarrier[1][1] === undefined) {
                categoryInListCarrier[1].push(data);
            }
            createCardMenu(element);
        },
    });
}
// Переход на предыдущую вкладку карточки
function comeBack(elem) {
    for (let i = 0; i < dataName.length; i++) {
        if (dataName[i].name === elem.id) { // Переход по вкладкам карточки в одной категории и подкатегории
            $('.card_menu').remove();
            for (let j = dataName[i].link[0].lastCard.length - 1; j >= 0; j--) {
                if (dataName[i].link[0].lastCard[j] !== null) {
                    dataName[i].link[0].lastCard[j] = null;
                    break;
                }
            }
            $('.info').append(fillingTables(dataName[i].link));
        } else if (dataName[i].name + '-inv' === elem.id) { // Переход по вкладкам карточки из категории Финансы в категорию Рабочий стол
            for (let i = 0; i < linkCategoryInfo[0].subcategories.length; i++) {
                linkCategoryInfo[0].subcategories[i][0].active = false;
                if (linkCategoryInfo[0].subcategories[i][0].id == elem.id.replace(/-inv/g, '')) {
                    linkCategoryInfo[0].subcategories[i][0].active = true;
                }
            }
            categoryInFinanceAccount[0].lastCard[0] = null;            
            $('.card_menu').remove();
            linkCategory('category-0');
        }
    }
}
// Переход на вкладку оформления договора карточки
function contractNext(elem) {
    if (!checkEmail()) return;
    saveInfoCard(elem.name, true, elem);
    getCommentsInfo.getRequest(elem.name);
    saveCard();
}
// Переход на вкладку выставления счета
function invoiceCard(elem) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            if (categoryInStock[1][1] == undefined) categoryInStock[1].push(data);
            function invoiceCardContent(data) {
                return $('<div>', {
                    class: 'card_menu invoicing',
                    id: `${elem.id}_invoicing_card`,
                    append: $('<div>', {
                        class: 'content',
                        append: invoicingContentCard(elem, data)
                    })
                })
            }
            // Вытягивать данные по таблице
            $('.card_menu').remove();
            categoryInFinanceAccount[0].lastCard[0] = invoiceCardContent(data);
        
            categoryInFinanceAccount[0].active = true;
            categoryInFinanceDebit[0].active = false;
            
            linkCategory('category-1');
            linkField();
        },
    });
}
// Завершение выставления счета и закрытие карточки 
function completionCard(element) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            let idsItems = [];
            $('#exposed_list .invoiled').each(function(i, element) {
                let idProduct = $(element).attr('id').split('_')[1];
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].items.length; j++) {
                        let account = data[i].items[j];
                        if (account.Item_id == idProduct) {
                            idsItems.push(account.Item_id);
                        }
                    }
                }
            });
            
            if (idsItems.length > 0) {
                let sale = $('#total_discount_inv').val();
                let privet = $('#total_privet_inv').val();
                let delivery = $('#total_delivery_inv').val();
                let status = 'true';
                let date = getCurrentDate('year');
                let name;
                let sum = '1000';

                // Передать данные на сервер и создать карточку счета
                for (let i = 0; i < dataName.length; i++) {
                    if (element.name === dataName[i].name) {
                        name = dataName[i].link[0].lastCard[0].children()[1].children[0].children[0].children[0].children[1].children[0].value;
                        dataName[i].link[0].lastCard = [null, null];
                    }
                }

                $.ajax({
                    url: '/addAccount',
                    type: 'GET',
                    data: {name: name, status: status, date: date, hello: privet, sale: sale, shipping: delivery, sum: sum, item_ids: JSON.stringify(idsItems)},
                    dataType: 'html',
                    success: function() {
                        closeCardMenu('account_new');
                    }
                })
            } else {
                alert('Невозможно создать счет, ни один товар не выбран!');
            }
        }
    })
}

// Закрытие карточки
function closeCardMenu(id = '') {
    // Сохраняет данные на сервер
    if (id[1] == 'user') {
        getTableData(saveTableAndCard);
        return;
    }
    if (!id.includes('new') && !id.includes('stock') && !id.includes('delivery')) { 
        saveInfoCard(id);
        let idSplit = id.split('_');
        let idComment = `${idSplit[0]}_${idSplit[idSplit.length - 1]}`;
        if (!id.includes('account')) getCommentsInfo.getRequest(idComment);
    } else getTableData(saveTableAndCard);

    // Если открыта карточка Выставления счета в Счете - закрыть ее
    if (categoryInFinanceAccount[0].lastCard[0] !== null) {
        if (id.split('_')[0] === categoryInFinanceAccount[0].lastCard[0][0].id.split('_')[0]) {
            categoryInFinanceAccount[0].lastCard[0] = null;
        }
    }
};
// Заполняем Заголовок карточки
function getTitleInfo(element) {
    let title = $('<div>', { class: 'title' });
    let left = $('<div>', { class: 'left_side' });
    title.append(left);
    for (let i = 0; i < element.list.length; i++) {
        left.append($('<span>', {
            html: element.list[i]
        }));
    }
    
    function getRightSide() {
        function closeButton()  {
            return $('<div>', {
                class: 'close',
                id: `${element.id}_close_card_${element.status}`,
                onclick: element.id !== 'delivery' ? 'closeCardMenu(this.id)' : 'makeRequest(this.id)',
                append: $('<img>', {src: 'static/images/cancel.png'})
            })
        }

        function getUserInfo() {
            return $('<div>', { class: 'gray', id: 'user',
                        append: $('<div>', {
                            class: 'drop_menu',
                            id: `${element.id}-user-${element.status}`,
                            html: 'Открепить карточку от менеджера',
                            onclick: 'detachmentCard(this)'
                        }).add($('<div>', {
                            onclick: 'unfastenCard(this)',
                            class: 'hover',
                            id: `remove-${element.id}-${element.status}`,
                            append: $('<img>', {
                                src: 'static/images/dropmenu_black.svg',
                                class: 'drop_down_img padl',
                            }).add($('<span>', { html: username, class: 'marl' }))
                        }))
                    })
        }
        if (element.id === 'stock' || element.id === 'delivery') {
            return $('<div>', {
                class: 'right_side',
                append: closeButton()
            })
        } else {
            let block = $('<div>', { class: 'right_side' });
            if (!element.status.includes('contract') && !element.status.includes('new')) {
                block.append(getUserInfo());
            }
            block.append(closeButton());
            return block;
        }
    }

    title.append(getRightSide());

    return title;
}