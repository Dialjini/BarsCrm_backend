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
    let month = +time.getMonth() + 1 < 10 ? '0' + (+time.getMonth() + 1) : +time.getMonth() + 1;
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
    $('body').append(`
        <div id="preloader">
            <div id="preloader_preload"></div>
        </div>
    `)
    preloader = document.getElementById("preloader_preload");

    sortStatus = {
        product: {status: false, filter: null, last: null},
        price: {status: false, filter: null},
        area: {status: false, filter: null},
        category: {status: false, filter: null, last: null},
        manager: {status: false, filter: null, last: null},
        customer: {status: false, filter: null, last: null},
        date: {status: false, filter: null, last: null},
    }
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
    let accountInfoInDelivery = null;

    // Информация по всем карточкам подкатегорий
    // Подставить актуальные данные
    const titleObject = [
        {
            id: 'client',
            list: [],
            link: clientContentCard,
            status: getInfo[1]
        },
        {
            id: 'provider',
            list: [],
            link: providerContentCard,
            status: getInfo[1]
        },
        {
            id: 'carrier',
            list: [],
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
        },
        {
            id: 'item',
            list: ['Добавление товара', '* Все поля обязательны к заполнению'],
            link: addItemsInStockContent,
            status: getInfo[1]
        },
        
    ]

    // Получаем нужную информацию по карточке
    for (let i = 0; i < titleObject.length; i++) {
        if (titleObject[i].id.includes(getInfo[0])) {
            infoElement = titleObject[i];
            // Вытягиваем данные по Айди карточки и поставляем в поля
            if (getInfo[1] == 'add') break;
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
                    for (let l = 0; l < data_list.length; l++) {
                        if (data_list[l].id == titleObject[i].status) {
                            selectedLine = data_list[l];
                        }
                    }
                }

                // Передать данные счета в карточку доставки
                
                let list = Object.keys(selectedLine);
                for (let elem = 0; elem < list.length; elem++) {
                    if (selectedLine[list[elem]] == null || selectedLine[list[elem]] == 'null'){ 
                        selectedLine[list[elem]] = '';

                    }
                }
                let date = new Date();
                titleObject[i].list.unshift(`Код: ${selectedLine.id || selectedLine.Item_id || selectedLine.account.id}`);
                if (getInfo[0] === 'client' || getInfo[0] === 'provider' || getInfo[0] === 'carrier') {
                    titleObject[i].list.push(selectedLine.UTC == '' || selectedLine.UTC == undefined ? 'Местное время неопределенно' : `Местное время: ${selectedLine.UTC + date.getUTCHours() < 10 ? '0' + (+selectedLine.UTC + +date.getUTCHours()) : selectedLine.UTC + date.getUTCHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`)
                    if (getInfo[0] === 'client') {
                        titleObject[i].list.push(`<span id="${getInfo[0]}_site">${selectedLine.Site}</span>`);
                        titleObject[i].list.push(`<span id="${getInfo[0]}_holding">${selectedLine.Holding}</span>`)
                    } 
                    if (getInfo[0] === 'provider') {
                        titleObject[i].list.push(`<span id="${getInfo[0]}_holding">${selectedLine.Holding}</span>`)
                    } 
                }
                if (getInfo[0] === 'account') {
                    titleObject[i].list.push(`Счёт от ${selectedLine.items[0].Prefix}`)
                }
            } else {
                const emptyData = [
                    { id: 'client', list: ['Name', 'Rayon', 'Category', 'Distance', 'Segment', 'UHH', 'Price', 'Oblast', 'Station', 'Tag', 'Adress', 'Fact_address', 'Site', 'Holding', 'Demand_item', 'Demand_volume', 'Livestock_all', 'Livestock_milking', 'Livestock_milkyield', 'Bik', 'kc', 'rc'] },
                    { id: 'provider', list: ['Name', 'Rayon', 'Category', 'Distance', 'UHH', 'Price', 'Oblast', 'Train', 'Tag', 'Adress', 'NDS', 'Merc', 'Volume', 'Holding'] },
                    { id: 'carrier', list: ['Name', 'Address', 'Area', 'Capacity', 'UHH', 'Region', 'View', 'Bik', 'kc', 'rc'] },
                    { id: 'delivery', list: ['Customer', 'Start_date', 'Postponement_date','End_date', 'Load_type', 'Type', 'Comment', 'Client', 'Contact_Number', 'Account_id', 'Stock', 'Item_ids', 'Payment_list', 'Auto', 'Passport_data']}
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
                } if (getInfo[0] === 'delivery') {
                    if (element.name !== undefined) {
                        let id = element.name.split('_')[1];
                        selectedLine['Account_id'] = categoryInFinanceAccount[1][1][id - 1].account.id;
                    }
                } 
            }
        }
    }

    // Собираем саму карточку
    function cardMenu() {
        let container = $('<div>', {
            class: 'card_menu',
            id: 'card_menu',
            append: getTitleInfo(infoElement, selectedLine).add(getContentInfo(infoElement))
        })
        return container;
    }

    // Запоминаем карточку
    for (let i = 0; i < dataName.length; i++) {
        if (getInfo[0] == dataName[i].name) {
            saveTableAndCard = dataName[i].link;
            dataName[i].link[0].lastCard[0] = cardMenu();
            break;
        }
    }

    // Переход в нужную категорию
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        if (linkCategoryInfo[i].subid.includes(saveTableAndCard[0].id)) {
            $(`#${linkCategoryInfo[i].id}`).addClass('active');
            if (infoElement.status == 'new') {
                $('div').is('#subcategories') ? $('#subcategories').remove() : '';
                addButtonsSubcategory(linkCategoryInfo[i].id[linkCategoryInfo[i].id.length - 1]);
                $(`#${saveTableAndCard[0].id}Button`).addClass('active');
                linkField();
            }
            break;
        }
    }

    // Получаем контент карточки
    function getContentInfo(infoElement) {
        let content = $('<div>', { class: 'content' });
        content.append(infoElement.link(selectedLine));
        return content;
    }
    for (let i = 0; i < dataName.length; i++) {
        if (getInfo[0] == dataName[i].name) {
            saveTableAndCard = dataName[i].link;
            dataName[i].link[0].lastCard[0]
            $('.info').append(dataName[i].link[0].lastCard[0])
            break;
        }
    }

    $('.next .btn, #add_new_comment, #save_new_comment').attr('name', getInfo.join('_'));
    itemSelection(getInfo[0], selectedLine);
    if (getInfo[0] === 'stock') categoryInStock[0].lastCard[0] = null;

    // Получаем данные по клиентам // Временно, пока не будем работать с счетами и доставкой
    if (getInfo[0] == 'client' || getInfo[0] == 'provider' || getInfo[0] == 'carrier') getContactsAndItems();
    else if (getInfo[0] == 'delivery') {
        let list = selectedLine.Payment_list;
        if (list.length == 0) {
            addRow(`delivery-group`);
        } else {
            list = JSON.parse(selectedLine.Payment_list);
            for (let i = 0; i < list.length; i++) {
                addRow(`delivery-group`, list[i]);
            }
        }
        setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
    } else if (getInfo[0] == 'account') {
        let payment_list;
        if (selectedLine.account.Payment_history != undefined) {
            payment_list = JSON.parse(selectedLine.account.Payment_history);
        } else {
            payment_list = [{position: '', date: '', sum: ''}];
        }
        for (let i = 0; i < payment_list.length; i++) {
            addRow('account-group', payment_list[i]);
        }
        setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
    }

    function getContactsAndItems() {
        getListRegions(selectedLine, getInfo[0])
        let category = getInfo[0];
        let idElement = getInfo[1];
        if (idElement == 'new') {
            addMember(category);
            addRow(`${category}-group`);
            $('[name="remove_last_group"]').fadeOut(0);
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        } else {
            if (category == 'client' || category == 'provider') {
                $.ajax({
                    url: '/getItems',
                    type: 'GET',
                    data: {category: category, id: idElement},
                    dataType: 'html',
                    success: function(result) {
                        inputItems(JSON.parse(result));
                    }
                });
            } else {
                // Запрос для перевозчиков
                // Такие же как и в доставке
                // Можно привязывать их при makeRequest()
                inputItems([])
            }
            $.ajax({
                url: '/getContacts',
                type: 'GET',
                data: {category: category, id: idElement},
                dataType: 'html',
                success: function(result) {
                    inputContacts(JSON.parse(result));
                    getCommentsInfo.getRequest(getInfo);
                }
            });
        }
        function inputItems(items) {
            if (items.length == 0) 
                addRow(`${category}-group`);
            else {
                for (let i = 0; i < items.length; i++) {
                    addRow(`${category}-group`, items[i]);
                }
            }
        }
        function inputContacts(contacts) {
            if (contacts.length == 0) 
                addMember(category);
            else {
                for (let i = 0; i < contacts.length; i++) {
                    addMember(category, contacts[i]);
                }
            }
            setTimeout(function(){ fadeOutPreloader(preloader); }, 100);
        }
    }

    // Модальное окно для Склада
    if (getInfo[0] === 'stock') {
        $('.info').prepend($('<div>', {class: 'overflow'}));
        $('.overflow').height($('.container')[0].scrollHeight);
        $('#card_menu').addClass('modal');
        setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
    // Проверка на заполненность Контактов и строк таблиц (Не у Склада)
    } else { 
        try {
            if ($('#group').html().trim() !== '') {
                $('#remove_last_row').fadeIn(0);
            }
        } catch {}
    }
    function getListRegions(select, category) {
        $.ajax({
            url: 'static/js/regions/regions.json',
            async: false,
            success: function(json) {
                let dbRegion = select.Oblast != undefined ? select.Oblast : select.Region;
                let dbArea = select.Rayon != undefined ? select.Rayon : select.Area;
                let selectRegion = $('<select>');
                let options = '<option value="">Не выбран</option>';
                for (let i = 0; i < json.length; i++) {
                    if (json[i].region == dbRegion) {
                        options += `<option selected value="${json[i].region}">${json[i].region}</option>`
                        selectRegion.id = `${category}_select`;
                        selectRegion.value = json[i].region;
                    } else {
                        options += `<option value="${json[i].region}">${json[i].region}</option>`
                    }
                }
                $(`#${category}_region`).empty();
                $(`#${category}_region`).append(options);
                getListAreas(selectRegion, dbArea)
            }
        })
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
                            value: selectedLine.Name,
                            class: 'string'
                        })
                    }))
                }).add(`<tr>
                            <td>Область/Край</td>
                            <td>
                                <select id="client_region" onchange="getListAreas(this)"></select>
                            </td>
                        </tr>
                        <tr>
                            <td>Район</td>
                            <td><select id="client_area" onchange="saveCard()"></select></td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td><input type="text" class="string" id="client_address" onchange="saveCard()" value="${selectedLine.Adress}"></td>
                        </tr>
                        <tr>
                            <td>Факт. адрес</td>
                            <td><input type="text" class="string" id="client_factual_address" onchange="saveCard()" value="${selectedLine.Fact_address}"></td>
                        </tr>
                    `)
            }).add(`
                    <div class="visible_block">
                        <div class="visible_info">
                            <div id="props" class="visible_title" onclick="showOrHideInfo(this.id)">
                                <span>Реквизиты</span>
                                <img id="hidden_image_props" src="static/images/dropmenu_black.svg" class="drop_down_img">
                            </div>
                            <table id="hidden_info_props" class="table_block" style="display:none; margin-bottom: 20px;">
                                <tr>
                                    <td>ИНН</td>
                                    <td><input maxlength="12" class="string" type="text" id="client_inn" onchange="saveCard()" value="${selectedLine.UHH}"></td>
                                </tr>
                                <tr>
                                    <td>БИК</td>
                                    <td><input type="text" class="string" maxlength="9" id="client_bik" onchange="saveCard()" value="${selectedLine.Bik}"></td>
                                </tr>
                                <tr>
                                    <td>Корр. счёт</td>
                                    <td><input type="text" class="string" maxlength="20" id="client_kc" onchange="saveCard()" value="${selectedLine.kc}"></td>
                                </tr>
                                <tr>
                                    <td>Расч. счёт</td>
                                    <td><input type="text" class="string" maxlength="20" id="client_rc" onchange="saveCard()" value="${selectedLine.rc}"></td>
                                </tr>
                            </table>
                        </div>
                        <div class="visible_info">
                            <div id="additional" class="visible_title" onclick="showOrHideInfo(this.id)">
                                <span>Доп. информация</span>
                                <img id="hidden_image_additional" src="static/images/dropmenu_black.svg" class="drop_down_img">
                            </div>
                            <table id="hidden_info_additional" class="table_block" style="display: none;">
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
                                    <td>Цена вагона, руб.</td>
                                    <td><input type="text" onkeyup="maskNumber(this.id)" id="client_price" onchange="saveCard()" class="string" value="${selectedLine.Price}"></td>
                                </tr>
                                <tr>
                                    <td>км от НСК</td>
                                    <td><input type="text" onkeyup="maskNumber(this.id)" id="client_distance" onchange="saveCard()" class="string" value="${selectedLine.Distance}"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
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
                                <th>Общее</th>
                                <th>Дойного</th>
                                <th>Надои</th>
                            </tr>
                            <tbody id="livestock">
                                <tr>
                                    <td><input onkeyup="maskNumber(this.id)" id="livestock_general" type="text" style="width: 75px" value="${selectedLine.Livestock_all}"></td>
                                    <td><input onkeyup="maskNumber(this.id)" id="livestock_milking" type="text" style="width: 75px" value="${selectedLine.Livestock_milking}"></td>
                                    <td><input onkeyup="maskNumber(this.id)" id="livestock_milkyield" type="text" style="width: 75px" value="${selectedLine.Livestock_milkyield}"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`)
        }).add(`<div class="row_card" id="media">
                    <div class="left_side">
                        <div class="hmax" id="member"></div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMember()">
                        </div>
                    </div>
                    <div class="info_block" style="width: fit-content">
                        <span class="lightgray">Группа товаров</span>
                        <div class="hmax">
                            <table>
                                <tr>
                                    <th>Товар</th>
                                    <th>Объем, кг.</th>
                                    <th>У кого</th>
                                    <th>Цена, руб.</th>
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
                        <div class="title">
                            <div>Последние комментарии</div>
                            <img id="save_new_comment" onclick="getCommentsInfo.getRequest(this.name)" class="add_something save" src="static/images/save_comment.png">
                        </div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="comments"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="client" onclick="contractNext(this)">Выставить</button>
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
                            onchange: 'saveCard()',
                            class: 'string'
                        })
                    }))
                }).add(`<tr>
                            <td>Область/Край</td>
                            <td>
                                <select id="provider_region" onchange="getListAreas(this)"></select>
                            </td>
                        </tr>
                        <tr>
                            <td>Район</td>
                            <td><select id="provider_area" onchange="saveCard()"></select></td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td>
                                <input type="text" class="string" id="provider_address" onchange="saveCard()" value="${selectedLine.Adress}">
                            </td>
                        </tr>
                        <tr>
                            <td>ИНН</td>
                            <td>
                                <input type="text" maxlength="12" class="string" id="provider_inn" onchange="saveCard()" value="${selectedLine.UHH}">
                            </td>
                        </tr>`)
            }).add(`<table class="table_block">
                        <tr>
                            <td>Ж/Д Станция</td>
                            <td>
                                <input type="text" id="provider_station" class="string" onchange="saveCard()" value="${selectedLine.Train}">
                            </td>
                        </tr>
                        <tr>
                            <td>Цена вагона, руб.</td>
                            <td>
                                <input onkeyup="maskNumber(this.id)" type="text" id="provider_price" class="string" onchange="saveCard()" value="${selectedLine.Price}">
                            </td>
                        </tr>
                        <tr>
                            <td>км от НСК</td>
                            <td>
                                <input onkeyup="maskNumber(this.id)" type="text" id="provider_distance" class="string" onchange="saveCard()" value="${selectedLine.Distance}">
                            </td>
                        </tr>
                    </table>
                    <table class="table_block">
                        <tr>
                            <td>Объем про-ва, кг.</td>
                            <td>
                                <input onkeyup="maskNumber(this.id)" type="text" id="provider_volume" class="string" onchange="saveCard()" value="${selectedLine.Volume}">
                            </td>
                        </tr>
                        <tr>
                            <td>Меркурий</td>
                            <td>
                                <input type="text" id="provider_merc" class="string" onchange="saveCard()" value="${selectedLine.Merc}">
                            </td>
                        </tr>
                    </table>`)
        }).add(`<div class="row_card" id="media">
                    <div class="left_side">
                        <div class="hmax" id="member"></div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMember()">
                        </div>
                    </div>
                    <div class="info_block" style="width: fit-content">
                        <span class="lightgray">Группа товаров</span>
                        <div class="hmax">
                            <table>
                                <tr>
                                    <th>Товар</th>
                                    <th>Цена, руб.</th>
                                    <th>Дата</th>
                                    <th>НДС</th>
                                    <th>Упаковка</th>
                                    <th>Вес</th>
                                    <th>Фракция</th>
                                </tr>
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
                        <div class="title">
                            <div>Последние комментарии</div>
                            <img id="save_new_comment" onclick="getCommentsInfo.getRequest(this.name)" class="add_something save" src="static/images/save_comment.png">
                        </div>
                        <div class="messages">
                            <table class="message">
                                <tbody id="comments"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="provider" onclick="closeCardMenu(this.name)">Сохранить</button> 
                </div>`)
        return content;
    }
    // Контентная часть Перевозчиков
    function carrierContentCard(selectedLine) {
        function listView() {
            if (selectedLine.View == '') {
                return `
                    <option selected disabled value="">Не выбран</option>
                    <option value="Авто">Авто</option>
                    <option value="Ж/Д">Ж/Д</option>
                `
            } else {
                if (selectedLine.View == 'Авто') {
                    return `
                        <option selected value="Авто">Авто</option>
                        <option value="Ж/Д">Ж/Д</option>
                    `
                } if (selectedLine.View == 'Ж/Д') {
                    return `
                        <option value="Авто">Авто</option>
                        <option selected value="Ж/Д">Ж/Д</option>
                    `
                }
            }
        }
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
                            onchange: 'saveCard()',
                            class: 'string'
                        })
                    }))
                }).add(`<tr>
                            <td>Область/Край</td>
                            <td>
                                <select id="carrier_region" onchange="getListAreas(this)"></select>
                            </td>
                        </tr>
                        <tr>
                            <td>Район</td>
                            <td><select id="carrier_area" onchange="saveCard()"></select></td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td>
                                <input type="text" id="carrier_address" onchange="saveCard()" class="string" value="${selectedLine.Address}">
                            </td>
                        </tr>`)
            }).add(`<table class="table_block">
                        <tr>
                            <td>ИНН</td>
                            <td>
                                <input type="text" id="carrier_inn" maxlength="12" onchange="saveCard()" class="string" value="${selectedLine.UHH}">
                            </td>
                        </tr>
                        <tr>
                            <td>БИК</td>
                            <td><input type="text" class="string" maxlength="9" id="carrier_bik" onchange="saveCard()" value="${selectedLine.Bik}"></td>
                        </tr>
                        <tr>
                            <td>Корр. счёт</td>
                            <td><input type="text" class="string" maxlength="20" id="carrier_kc" onchange="saveCard()" value="${selectedLine.kc}"></td>
                        </tr>
                        <tr>
                            <td>Расч. счёт</td>
                            <td><input type="text" class="string" maxlength="20" id="carrier_rc" onchange="saveCard()" value="${selectedLine.rc}"></td>
                        </tr>
                    </table>`).add(`
                    <table class="table_block">
                        <tr>
                            <td>Грузоподъемность, кг.</td>
                            <td>
                                <input onkeyup="maskNumber(this.id)" type="text" id="carrier_capacity" onchange="saveCard()" value="${selectedLine.Capacity}" class="string">
                            </td>
                        </tr>
                        <tr>
                            <td>Вид перевозки</td>
                            <td>
                                <select id="carrier_view">
                                    ${listView()}
                                </select>
                            </td>
                        </tr>
                    </table>
                    `)
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
                                    <th>Дата</th>
                                    <th>Клиент</th>
                                    <th>Склад</th>
                                    <th>Водитель</th>
                                    <th>Цена, руб.</th>
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
                        <div class="title">
                            <div>Последние комментарии</div>
                            <img id="save_new_comment" onclick="getCommentsInfo.getRequest(this.name)" class="add_something save" src="static/images/save_comment.png">
                        </div>
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
        $.ajax({
            url: '/getStockTable',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                data = JSON.parse(data);
                if (categoryInStock[1][1] == undefined) categoryInStock[1].push(data);
            }
        })

        let sum = 0, vat = 0;

        let sale = JSON.parse(selectedLine.account.Sale);
        let privet = JSON.parse(selectedLine.account.Hello);
        let delivery = JSON.parse(selectedLine.account.Shipping);
        let items_amount = JSON.parse(selectedLine.account.Items_amount);

        function fillingProducts() {
            let list_items = selectedLine.items;
            let table = '';
            let list_stock_id = [], list_items_id = [];
            for (let i = 0; i < list_items.length; i++) {
                list_stock_id.push(list_items[i].Stock_id);
                list_items_id.push(list_items[i].Item_id);
                sum += +deleteSpaces(items_amount[i].amount);
                table = table.concat(`
                    <tr class="product invoiled" id="product_${list_items[i].Item_id}">
                        <td id="invoiled_${list_items[i].Item_id}" onclick="deleteProduct(this.id)">
                            <img src="../static/images/returnBack.png" style="width: 12px;">
                        </td>
                        <td>${list_items[i].Name}</td>
                        <td>${list_items[i].Packing}</td>
                        <td id="product_weight_${list_items[i].Item_id}">${returnSpaces(list_items[i].Weight)}</td>
                        <td id="product_containers_${list_items[i].Item_id}">${returnSpaces(Math.round(+deleteSpaces(list_items[i].Transferred_volume) / +deleteSpaces(list_items[i].Weight)))}</td>
                        <td>
                            <input type="text" onkeyup="maskNumberWithout(this.id); tarCalculation(this.id)" id="invoiled_volume_${list_items[i].Item_id}" value="${returnSpaces(list_items[i].Transferred_volume)}">
                        </td>
                        <td id="product_cost_${list_items[i].Item_id}">${returnSpaces(list_items[i].Cost)}</td>
                        <td>
                            <input onkeyup="recountPrice(this.id)" type="text" value="${returnSpaces(sale[i])}" id="calcSale_${list_items[i].Item_id}">
                        </td>
                        <td>
                            <input onkeyup="recountPrice(this.id)" type="text" value="${returnSpaces(privet[i])}" id="calcPrivet_${list_items[i].Item_id}">
                        </td>
                        <td>
                            <input onkeyup="recountPrice(this.id)" type="text" value="${returnSpaces(delivery[i])}" id="calcDelivery_${list_items[i].Item_id}">
                        </td>
                        <td id="product_unit_${list_items[i].Item_id}">${returnSpaces(Math.round(+deleteSpaces(list_items[i].Cost) / +deleteSpaces(list_items[i].Transferred_volume)))}</td>
                        <td id="amountC_${list_items[i].Item_id}">${items_amount[i].amount}</td>
                    </tr>
                `)
            }
            
            for (let i = 0; i < list_stock_id.length - 1; i++) {
                for (let j = i + 1; j < list_stock_id.length; j++) {
                    if (list_stock_id[i] == list_stock_id[j]) {
                        list_stock_id.splice(j, 1);
                        j--;
                    }
                }
            }

            table = table.concat(`
                <div id="stock_items_list" style="display: none" data-stock="${list_stock_id}" data-items="${list_items_id}"></div>
            `)

            list_items[0].NDS = list_items[0].NDS[0] + list_items[0].NDS[1];
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
                            <td></td>
                        </tr>
                    `);
                }
            }
            return table;
        }
        return `<div class="row_card">
                    <div class="costs gray">
                        <div class="costs_element">
                            <span>Всего затраты</span>
                            <input type="text" value="${selectedLine.account.Total_costs}" onkeyup="maskNumberWithout(this.id); all_costs()" id="total_costs_inv" class="total_count red bold mrl">
                            <div name="unlock" class="lock_input" id="mode_costs" onclick="switchMode(this)"></div>
                        </div> 
                        <div class="costs_element">
                            <span>Скидка</span> 
                            <input type="text" value="${selectedLine.account.Sale_costs}" onkeyup="calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_discount_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="text" value="${selectedLine.account.Hello_costs}" onkeyup="maskNumberWithout(this.id); calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_privet_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="text" value="${selectedLine.account.Delivery_costs}" onkeyup="maskNumberWithout(this.id); calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_delivery_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_delivery" onclick="switchMode(this)"></div>
                        </div>
                    </div>
                </div>
                <div class="row_card">
                    <div class="info_block full">
                        <table class="account_table new_table">
                            <tr>
                                <th width="15" rowspan="2"></th>
                                <th width="150" rowspan="2">Товар</th>
                                <th colspan="2">Упаковка</th>
                                <th colspan="2">Количество</th>
                                <th colspan="5">Цена, руб.</th>
                                <th style="width: 90px;" rowspan="2">Сумма</th>
                            </tr>
                            <tr>
                                <th>Вид</th>
                                <th width="55">Вес, кг.</th>
                                <th width="65">Всего, шт.</th>
                                <th width="75">Объем, кг.</th>
                                <th width="85">Цена прайса, руб.</th>
                                <th width="60">Скидка</th>
                                <th width="60">Привет</th>
                                <th width="60">Доставка</th>
                                <th width="75">За единицу</th>
                            </tr>
                            <tbody id="exposed_list">
                                ${fillingProducts()}
                            </tbody>
                            <tr>
                                <td colspan="10" style="border: none; border-top: 1px solid #e9e9e9"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">НДС</span><span id="vat">${returnSpaces(Math.round(sum - vat))}</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10" style="border: none;"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Без НДС</span><span id="without-vat">${returnSpaces(Math.round(vat))}</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10" style="border: none;"></td>
                                <td colspan="2" class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Общая</span><span id="total">${returnSpaces(Math.round(sum))}</span></div>
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
                                    <th>Дата</th>
                                    <th>Сумма, руб.</th>
                                </tr>
                                <tbody id="group"></tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="account-group" src="static/images/add.png" onclick="addRow(this.id)">
                            <img name="remove_last_group" class="add_something" src="static/images/remove.png" onclick="removeMemberOrRow(this.name)">
                        </div>
                    </div>
                    <div class="info_block">
                        <span class="lightgray">Актуальность счета</span>
                        ${selectedLine.account.Status == 'true' ? `<input checked type="checkbox" id="account_status">` : `<input type="checkbox" id="account_status">`}
                        <label for="account_status">Этот счет не актуален</label>
                    </div>
                </div>
                <div class="next">
                    <div style="display:none" id="list_stock" data-stock=""></div>
                    <button class="btn btn-main" id="delivery_new" onclick="editAccount(this)">Отгрузить</button>
                </div>`
    }
    // Контентная часть Дебеторки
    function debitContentCard(selectedLine) {
        return `Секретное место. Если вы видите это сообщение, то что-то пошло не так. Сообщите об этом вашему непосредственному руководству.`
    }
    // Контентная часть Склада
    function stockContentCard(selectedLine) {
        function listStock() {
            let data = categoryInStock[1][1];
            let list = [];
            for (let i = 0; i < data.length; i++) {
                list.push(data[i].stock_address);
                if (list[i] == selectedLine.stock_address) {
                    list.splice(i, 1);
                }
            }
            let options = '<option disabled selected>Не выбран</option>';
            for (let i = 0; i < list.length; i++) {
                options += `<option value="${list[i]}">${list[i]}</option>`
            }
            if (list.length == 0) {
                options = `<option value="null" disabled selected>Нет другого склада</option>`
            }
            return options;
        }

        return `<div class="row_card">
                    <div class="info_block full">
                        <div class="mb">
                            <span class="bold">Транзит со склада</span>
                            <select class="margin">
                                <option selected disabled value="${selectedLine.stock_address}">${selectedLine.stock_address}</option>
                            </select>
                        </div>
                        <div>
                            <table class="full">
                                <tr>
                                    <td>Группа товаров</td>
                                    <td>Товар</td>
                                    <td>Юр. лицо</td>
                                    <td>Объем, кг.</td>
                                    <td>Упаковка</td>
                                    <td>Цена прайса, руб.</td>
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
                            <select id="stock_select" class="margin">
                                ${listStock()}
                            </select>
                        </div>
                        <div class="mb">
                            <span class="bold">Объем, кг.</span>
                            <input onkeyup="maskNumber(this.id)" style="width: 60px" type="text" id="volume_transit" class="margin" oninput="fillVolume(this.value)">
                        </div>
                        <div>
                            <table class="full">
                                <tr>
                                    <td>Группа товаров</td>
                                    <td>Товар</td>
                                    <td>Юр. лицо</td>
                                    <td>Объем, кг.</td>
                                    <td>Упаковка</td>
                                    <td>Цена прайса, руб.</td>
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
                    <button class="btn btn-main" id="transit" onclick="transitProduct(this)">Оформить</button>
                </div>
                `
    }
    // Контентная часть Доставки
    function deliveryContentCard(selectedLine) {
        function carrierSelect() {
            let data = categoryInListCarrier[1][1];
            let list_name = [];
            let select = '<select id="delivery_carrier_id" onchange="selectDrivers(this.value)">';
            select += '<option value="disabled" selected disabled>Не выбран</option>'
            for (let i = 0; i < data.length; i++) {
                if (selectedLine.Carrier_id != '' && selectedLine.Carrier_id == data[i].id) {
                    select += `<option value="${data[i].id}" selected>${data[i].Name}</option>`;
                    selectDrivers(data[i].id, selectedLine);
                }
                else 
                    select += `<option value="${data[i].id}">${data[i].Name}</option>`;
                list_name.push({ name: data[i].Name, id: data[i].id });
            }
            select += '</select>';
            return select;
        }
        function fillAccounts() {
            let options = '';
            $.ajax({
                url: '/getAccounts',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    data = JSON.parse(data);
                    if (categoryInFinanceAccount[1][1] == undefined) {
                        categoryInFinanceAccount[1].push(data);
                    }   
                    if (selectedLine.Account_id == '') {
                        options += `<option disabled selected>Не выбран</option>`;
                        for (let i = 0; i < data.length; i++) {
                            options += `<option value="${data[i].account.id}">Счёт ${data[i].account.id}</option>`
                        }
                    } else options += `<option disabled selected value="${selectedLine.Account_id}">Счёт ${selectedLine.Account_id}</option>`
                }
            });
            return options;
        }
        function fillClients() {
            let options = '';
            let data = categoryInFinanceAccount[1][1];

            for (let i = 0; i < data.length; i++) {
                if (data[i].account.id == selectedLine.Account_id) {
                    if (selectedLine.Account_id != '') {
                        selectedLine.Name = data[i].account.Name;
                        options += `<option disabled selected value="${data[i].account.Name}">${data[i].account.Name}</option>`
                    } else {
                        options += `<option selected disabled>Не выбран</option>`;
                    }
                    break;
                }
            }
            if (selectedLine.Account_id == '') {
                options += `<option selected disabled>Выберите счёт</option>`;
            }
            return options;
        }
        function fillCustomer() {
            let options = '';
            if (selectedLine.Customer == 'ИП') {
                options += `
                    <option selected>ИП</option>
                    <option>ООО</option>
                `
            } else {
                options += `
                    <option>ИП</option>
                    <option selected>ООО</option>
                `
            }
            return options;
        }
        function fillContacts() {
            let dataClients = categoryInListClient[1][1];
            let listContacts, data;
            let options = '';

            for (let i = 0; i < dataClients.length; i++) {
                if (dataClients[i].Name == selectedLine.Name) {
                    data = {id: dataClients[i].id, category: 'client'}
                    break;
                }
            }

            if (data == undefined) {
                return `<option selected disabled>Выберите счёт</option>`
            }

            $.ajax({
                url: '/getContacts',
                type: 'GET',
                async: false,
                data: data,
                dataType: 'html',
                success: function(data) {
                    listContacts = JSON.parse(data);
                }
            });
            if (listContacts.length == 0) {
                options += '<option selected disabled>Контакты не указаны</option>'
            } else {
                for (let i = 0; i < listContacts.length; i++) {
                    if (+selectedLine.Contact_End == +listContacts[i].Contact_id) {
                        options += `<option selected value="${listContacts[i].Contact_id}">${listContacts[i].Position} | ${listContacts[i].Name} | ${listContacts[i].Number}</option>`
                    } else {
                        options += `<option value="${listContacts[i].Contact_id}">${listContacts[i].Position} | ${listContacts[i].Name} | ${listContacts[i].Number}</option>`
                    }
                }
            }
            return options;
        }
        function fillStocks() {
            if (list_stock_acc == undefined) {
                if (selectedLine.Stock == '') {
                    return `<option selected value="null">Выберите счёт</option>`
                } else {
                    return `<option selected value="${selectedLine.Stock}">${selectedLine.Stock}</option>`
                }
            } else {
                return `<option selected value="${list_stock_acc}">${list_stock_acc}</option>`
            }
        }
        function fillFlights() {
            let listAllItems = [];
            let listStocks;
            $.ajax({
                url: '/getAllItems',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    listAllItems = JSON.parse(data);
                }
            });
            $.ajax({
                url: '/getStocks',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    listStocks = JSON.parse(data);
                }
            });

            let tr = '';
            let dataAccount = categoryInFinanceAccount[1][1];

            for (let i = 0; i < listAllItems.length; i++) {
                if (list_items_acc == undefined) {
                    if (selectedLine.Item_ids != '') {
                        list_items_acc = JSON.parse(selectedLine.Item_ids);
                    } else {
                        return '';
                    }
                }

                let amounts;
                if (selectedLine.Amounts != undefined) {
                    amounts = JSON.parse(selectedLine.Amounts);
                }
                
                for (let j = 0; j < list_items_acc.length; j++) {
                    for (let k = 0; k < listStocks.length; k++) {
                        for (let l = 0; l < dataAccount.length; l++) {
                            let inputVolume = JSON.parse(dataAccount[l].account.Item_ids);
                            for (let m = 0; m < inputVolume.length; m++) {
                                if (+list_items_acc[j] == +listAllItems[i].Item_id 
                                    && +listAllItems[i].Stock_id == listStocks[k].id
                                    && dataAccount[l].account.id == selectedLine.Account_id
                                    && +listAllItems[i].Item_id == inputVolume[m].id) {
                                    if (amounts == undefined) {
                                        tr += `
                                        <tr id="item_flight_${listAllItems[i].Item_id}" name="item_flight">
                                            <td>${listAllItems[i].Name}</td>
                                            <td>${listStocks[k].Name}</td>
                                            <td>${inputVolume[m].volume}</td>
                                            <td>${listAllItems[i].Packing}</td>
                                            <td><input onkeyup="maskNumber(this.id)" id="item_sum" type="text"></td>
                                        </tr>
                                        `
                                    } else {
                                        tr += `
                                        <tr id="item_flight_${listAllItems[i].Item_id}" name="item_flight">
                                            <td>${listAllItems[i].Name}</td>
                                            <td>${listStocks[k].Name}</td>
                                            <td>${inputVolume[m].volume}</td>
                                            <td>${listAllItems[i].Packing}</td>
                                            <td><input onkeyup="maskNumber(this.id)" id="item_sum" value="${amounts.length == 1 ? amounts[0] : amounts[i]}" type="text"></td>
                                        </tr>
                                        `
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return tr;
        }
        return `<div class="row_card">
                        <table class="table_block">
                            <tr>
                                <td>Заказчик</td>
                                <td>
                                    <select id="delivery_customer">
                                        ${fillCustomer()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Дней отсрочки</td>
                                <td>
                                    <input type="number" style="width: 200px" id="delivery_postponement_date" value="${selectedLine.Postponement_date}">
                                </td>
                            </tr>
                            <tr>
                                <td>Дата отгрузки</td>
                                <td>
                                    <input type="text" style="width: 200px" id="delivery_start_date" value="${selectedLine.Start_date}">
                                </td>
                            </tr>
                            <tr>
                                <td>Дата разгрузки</td>
                                <td>
                                    <input type="text" style="width: 200px" id="delivery_end_date" value="${selectedLine.End_date}">
                                </td>
                            </tr>
                            <tr>
                                <td>Способ погрузки</td>
                                <td>
                                    <input type="text" style="width: 200px" id="delivery_load_type" value="${selectedLine.Load_type}">
                                </td>
                            </tr>
                        </table>
                        <table class="table_block">
                            <tr>
                                <td>Счёт</td>
                                <td>
                                    <select id="delivery_account" onchange="selectAccount(this.value)">
                                        ${fillAccounts()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Клиент</td>
                                <td>
                                    <select id="delivery_client">
                                        ${fillClients()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Контакт на выгрузке</td>
                                <td>
                                    <select id="delivery_contact_name">
                                        ${fillContacts()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Склад</td>
                                <td>
                                    <select id="delivery_stock">
                                        ${fillStocks()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Комментарий</td>
                                <td>
                                    <input type="text" style="width: 200px" id="delivery_comment" value="${selectedLine.Comment}">
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
                                <td>Вид перевозки</td>
                                <td>
                                    <select id="delivery_type" disabled>
                                        <option selected disabled></option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Водитель</td>
                                <td>
                                    <select id="delivery_driver"></select>
                                </td>
                            </tr>
                            <tr>
                                <td>Марка авто</td>
                                <td>
                                    <input type="text" style="width: 200px" value="${selectedLine.Auto}" id="delivery_car">
                                </td>
                            </tr>
                            <tr>
                                <td>Паспортные данные</td>
                                <td>
                                    <input type="text" style="width: 200px" value="${selectedLine.Passport_data}" id="delivery_passport">
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
                                        <th>Сумма, руб.</th>
                                    </tr>
                                    <tbody id="flight">
                                        ${fillFlights()}
                                    </tbody>
                                </table>
                            </div>
                            <div class="info_block fit" style="margin-top: 15px;">
                                <span class="lightgray" style="margin-top: 10px;">Оплата</span>
                                <div class="hmax">
                                    <table style="width: fit-content">
                                        <tr>
                                            <th>Дата</th>
                                            <th>Сумма, руб.</th>
                                        </tr>
                                        <tbody id="group"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="next">
                        <button class="btn" style="margin-right: 10px" id="delivery_new" onclick="closeCardMenu(this.id)">Забирает сам</button>
                        <button class="btn btn-main" id="delivery_new" onclick="createDocument(this)">Оформить Заявку</button>
                    </div>`
    }
    // Контентная часть добавления товара
    function addItemsInStockContent() {
        function fillListStock() {
            let info;
            $.ajax({
                url: '/getStocks',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    info = JSON.parse(data);
                }
            });
            let options = '';
            options += `<option value="0">Не выбран</option>`
            for (let i = 0; i < info.length; i++) {
                options += `<option value="${info[i].id}">${info[i].Name}</option>`
            }
            return options;
        }
        function fillListGroup() {
            let info;
            $.ajax({
                url: '/getItemGroup',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    info = JSON.parse(data);
                }
            });
            let options = '';
            for (let i = 0; i < info.length; i++) {
                options += `<option value="${info[i].id}">${info[i].Group}</option>`
            }
            setTimeout(function() { fadeOutPreloader(preloader) }, 0);
            return options;
        }
        return `
            <div class="row_card">
                <table class="table_block">
                    <tr>
                        <td>Склад</td>
                        <td>
                            <select type="text" id="stock_id">${fillListStock()}</select>
                        </td>
                    </tr>
                    <tr>
                        <td>Группа товаров</td>
                        <td>
                            <select type="text" id="group_id">${fillListGroup()}</select>
                        </td>
                    </tr>
                    <tr>
                        <td>Товар</td>
                        <td><input type="text" id="item_product" onchange="saveCard()" class="string"></td>
                    </tr>
                </table>
                <table class="table_block">
                    <tr>
                        <td>Объем, кг.</td>
                        <td><input onkeyup="maskNumber(this.id)" type="text" id="item_volume" onchange="saveCard()" class="string"></td>
                    </tr>
                    <tr>
                        <td>Упаковка</td>
                        <td><input type="text" id="item_packing" onchange="saveCard()" class="string"></td>
                    </tr>
                    <tr>
                        <td>Вес, кг.</td>
                        <td><input onkeyup="maskNumber(this.id)" type="text" id="item_weight" onchange="saveCard()" class="string"></td>
                    </tr>
                </table>
                <table class="table_block">
                    <tr>
                        <td>Юр. лицо</td>
                        <td>
                            <select type="text" id="item_prefix">
                                <option value="ООО">ООО</option>
                                <option value="ИП">ИП</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>НДС</td>
                        <td><input maxlength="12" type="number" id="item_vat" onchange="saveCard()" class="string"></td>
                    </tr>
                    <tr>
                        <td>Цена прайса, руб.</td>
                        <td><input onkeyup="maskNumber(this.id)" type="text" id="item_price" onchange="saveCard()" class="string"></td>
                    </tr>
                    <tr>
                        <td>Закупочная цена, руб.</td>
                        <td><input onkeyup="maskNumber(this.id)" type="text" id="item_purchase_price" onchange="saveCard()" class="string"></td>
                    </tr>
                </table> 
            </div>
            <div> 
                <table class="table_block" style="margin-bottom: 15px;">
                    <tr>
                        <td><input id="create_stock" type="text" style="width: 240px; margin-right: 15px;" placeholder="Адрес склада"></td>
                        <td><button class="btn btn-main" onclick="createNewStock()">Создать</button></td>
                    </tr>
                </table>
                <table class="table_block">
                    <tr>
                        <td><input id="create_group" type="text" style="width: 240px; margin-right: 15px;" placeholder="Группа товаров"></td>
                        <td><button class="btn btn-main" onclick="createNewGroup()">Создать</button></td>
                    </tr>
                </table>
            </div>
            <div class="next">
                <button class="btn btn-main" id="item_new" onclick="createNewItem()">Добавить товар</button>
            </div>
        `;
    }
}
function deleteProduct(id) {
    let check = confirm('Вы уверены, что хотите удалить этот товар из счета? После этого действия товар вернуться будет невозможно!')
    if (!check) return;
    $(`#product_${id.split('_')[1]}`).remove();
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            // Возвращаем столбец из верхней таблицы обратно
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].items.length; j++) {
                    let account = data[i].items[j];
                    if (account.Item_id == id.split('_')[1]) {
                        let sum = 0;
                        $('#exposed_list .invoiled').each(function(i, element) {
                            sum += +deleteSpaces($(element).children()[11].innerHTML);
                        });
                        account.NDS = account.NDS[0] + account.NDS[1];
                        let vat = sum > 0 ? sum - ((sum * +account.NDS) / 100) : 0;
                        $('#total').html(Math.round(sum));
                        $('#vat').html(Math.round(sum - vat));
                        $('#without-vat').html(Math.round(vat));
                        break;
                    }
                }
            }

            // Возвращаем пустой столбец в верхнюю таблицу
            let returnEmptyRow = $('<tr>', {class: 'product', id: 'empty'});
            for (let j = 0; j < 12; j++) {
                returnEmptyRow.append($('<td>', { html: '' }));
            }
            $('#exposed_list').append(returnEmptyRow);
            calculationIndicators();
        },
    });
}
function getListAreas(element, area = '') {
    let region = element.value;
    let category;
    try {
        category = element.id.split('_')[0];
    } catch {}
    $.ajax({
        url: 'static/js/regions/regions.json',
        async: false,
        success: function(json) {
            let options = '<option value="">Не выбран</option>';
            for (let i = 0; i < json.length; i++) {
                if (json[i].region == region) {
                    for (let j = 0; j < json[i].areas.length; j++) {
                        if (json[i].areas[j] == area) {
                            options += `<option selected value="${json[i].areas[j]}">${json[i].areas[j]}</option>`
                        } else {
                            options += `<option value="${json[i].areas[j]}">${json[i].areas[j]}</option>`
                        }
                    }
                }
            }
            $(`#${category}_area`).empty();
            $(`#${category}_area`).append(options);
            saveCard();
        }
    });
}
function createDocument(element) {
    let data = $(element).attr('name').split('_');
    if (data[1].includes('new')) {
        data[1] = data[1].replace(/new/g, saveTableAndCard[1][1].length + 1)
    }
    let carrier = ['carrier', +$('#delivery_carrier_id').val()];
    let select_cusmoter = $('#delivery_customer').val()
    if ($('#delivery_carrier_id').val() == null) {
        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 12px; color: #595959;">Выберите перевозчика!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
    }
    $.ajax({
        url: '/getCarriers',
        type: 'GET',
        dataType: 'html',
        success: function(data_carrier) {
            data_carrier = JSON.parse(data_carrier);
            for (let i = 0; i < data_carrier.length; i++) {
                if (data_carrier[i].id == carrier[1]) {
                    let document_name;
                    if (select_cusmoter == 'ООО') {
                        document_name = 'ZayavkaOOO';
                    } else {
                        document_name = 'ZayavkaIP';
                    }
                    const link = document.createElement('a');
                    link.href = `/downloadDoc?category=${carrier[0]}&name=${document_name}&card_id=${carrier[1]}&address=${data_carrier[i].Address}&delivery=${data[1]}`;
                    if (select_cusmoter == 'ООО') {
                        link.download = 'Заявка ООО.docx';
                    } else {
                        link.download = 'Заявка ИП.docx';
                    }
                    link.click();
                }
            }
        }
    }); 
}
function makeRequest(element) {
    let infoAccount = categoryInFinanceAccount[1][1][+$('#delivery_account')[0].value - 1];
    let data = {};
    for (let i = 0; i < idCardFields[3].ids.length; i++) {
        data[idCardFields[3].ids[i]] = $(`#${idCardFields[3].ids[i]}`).val();
    }

    data['delivery_carrier_id'] = +$('#delivery_carrier_id').val();

    if (infoAccount == undefined) {
        var result = confirm('При закрытии карточки данные не сохранятся, т.к вы не выбрали счет!');
        if (result) { return closeCardMenu(element.id) }
        else { return };
    }
    if (data['delivery_carrier_id'] == 0) {
        var result = confirm('При закрытии карточки данные не сохранятся, т.к вы не выбрали перевозчика!');
        if (result) { return closeCardMenu(element.id) }
        else { return };
    }

    let idDelivery = element.name != undefined ? element.name.split('_') : element.id.split('_');
    data['delivery_id'] = idDelivery[idDelivery.length - 1] == 'new' ? 'new' : +idDelivery[idDelivery.length - 1];
    data['delivery_date'] = getCurrentDate('year');
    data['delivery_contact_end'] = +$('#delivery_contact_name').val();
    data['delivery_contact_number'] = '';
    data['delivery_contact_name'] = $('#delivery_driver').val();
    data['delivery_account_id'] = +$('#delivery_account')[0].value;
    data['delivery_client'] = $('#delivery_client')[0].value;
    data['delivery_car'] = $('#delivery_car').val();
    data['delivery_passport'] = $('#delivery_passport').val();
    data['delivery_postponement_date'] = $('#delivery_postponement_date').val();

    let amounts = [];
    for (let element of $('#flight #item_sum')) {
        amounts.push(element.value);
    }

    data['delivery_amounts'] = JSON.stringify(amounts);

    let payment_list = [];
    for (let element of $('#group #delivery_date')) {
        if ($(element).val() != '') {
            payment_list.push({ date: $(element).val(), price: '' });
            data['delivery_payment_date'] = $(element).val();
        } else {
            payment_list.push({ date: '', price: '' });
        }
    }
    for (let i = 0; i < $('#group #delivery_price').length; i++) {
        if ($('#group #delivery_price')[i].value != '') {
            payment_list[i]['price'] = $('#group #delivery_price')[i].value;
        } else if ($('#group #delivery_price')[i].value == '' && $('#group #delivery_date')[i].value == '') {
            payment_list.splice(i, 1);
        }
    }

    if (payment_list.length > 0) {
        data['payment_list'] = JSON.stringify(payment_list);
    } else {
        data['delivery_payment_date'] = '';
    }
    data['delivery_prefix'] = infoAccount.items[0].Prefix;
    data['delivery_price'] = infoAccount.account.Sum;
    data['delivery_vat'] = infoAccount.items[0].NDS;
    data['delivery_name'] = infoAccount.account.Name;
    let items_ids = [];
    for (let element of $('#flight [name="item_flight"]')) {
        items_ids.push($(element).attr('id').split('_')[2]);
    }
    data['delivery_item_ids'] = JSON.stringify(items_ids);
    $.ajax({
        url: '/addDelivery',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function() {
            list_items_acc = null;
            list_stock_acc = null;
            closeCardMenu(element.id);
        }
    });
    
}
function transferToAccounts(element) {
    $.ajax({
        url: '/getAccounts',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            if (categoryInFinanceAccount[1][1] == undefined) {
                categoryInFinanceAccount[1].push(JSON.parse(data));
            }

            createCardMenu(element);
            categoryInFinanceAccount[0].lastCard[0] = $('.card_menu');
            categoryInFinanceAccount[0].active = true;
            categoryInFinanceDebit[0].active = false;
            $('#debitButton').removeClass('active');
            $('#accountButton').addClass('active');
            linkField();
        }
    });
}
function transitProduct(element) {
    let products;
    $.ajax({
        url: '/getAllItems',
        type: 'GET',
        dataType: 'html',
        success: function(result) {
            products = JSON.parse(result);

            let idProduct = element.name.split('_')[1];
            let stock_select = $('#stock_select').val();
            let product_volume = $('#volume_transit').val();

            if (stock_select == null) {
                return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 12px; color: #595959;">Выберите склад!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
            }

            if (Math.sign(product_volume) != 1) {
                return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 12px; color: #595959;">Введите корректное значение в поле Объём!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
            }

            for (let i = 0; i < products.length; i++) {
                if (products[i].Item_id == idProduct) {
                    if (+products[i].Volume < +product_volume) {
                        return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 12px; color: #595959;">На складе нет такого объема этого продукта!</p>
                                        </div>
                                    </div>
                                </div>
                            `));
                    }
                }
            }

            let data = {stock_select: stock_select, id_product: +idProduct, product_volume: +product_volume};

            $.ajax({
                url: '/stockTransit',
                type: 'GET',
                data: data,
                dataType: 'html',
                success: function() {
                    closeCardMenu('stock_new');
                }
            });
        }
    });
}
function selectAccount(value) {
    let data = categoryInFinanceAccount[1][1];
    let dataClients = categoryInListClient[1][1];
    let nameClient, request;

    for (let i = 0; i < data.length; i++) {
        if (data[i].account.id == +value) {
            $('#delivery_client').empty();
            $('#delivery_client').append(`<option>${data[i].account.Name}</option>`);
            nameClient = data[i].account.Name;
            break;
        }
    }

    for (let i = 0; i < dataClients.length; i++) {
        if (dataClients[i].Name == nameClient) {
            request = {id: dataClients[i].id, category: 'client'}
        }
    }

    let options = '';

    $.ajax({
        url: '/getContacts',
        type: 'GET',
        async: false,
        data: request,
        dataType: 'html',
        success: function(data) {
            request = JSON.parse(data);
        }
    });

    if (request.length == 0) {
        options += '<option selected disabled>Контакты не указаны</option>'
    } else {
        for (let i = 0; i < request.length; i++) {
            options += `<option value="${request[i].Contact_id}">${request[i].Position} | ${request[i].Name} | ${request[i].Number}</option>`
        }
    }

    $('#delivery_contact_name').empty();
    $('#delivery_contact_name').append(options);

    for (let i = 0; i < data.length; i++) {
        if (data[i].account.id == +value) {
            let listStock = [];
            for (let j = 0; j < data[i].items.length; j++) {
                listStock.push(data[i].items[j].Stock_id);
            }
            for (let j = 0; j < listStock.length - 1; j++) {
                for (let k = j + 1; k < listStock.length; k++) {
                    if (listStock[j] == listStock[k]) {
                        listStock.splice(k, 1);
                        k--;
                    }
                }
            }

            let dataStock;
            let options = '';

            $.ajax({
                url: '/getStocks',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    dataStock = JSON.parse(data);
                }
            });

            for (let j = 0; j < dataStock.length; j++) {
                for (let k = 0; k < listStock.length; k++) {
                    if (dataStock[j].id == listStock[k]) {
                        options += `<option value="${dataStock[j].Name}">${dataStock[j].Name}</option>`
                    }
                }
            }
            $('#delivery_stock').empty();
            $('#delivery_stock').append(options);
            break;
        }
    }
}
function createNewItem() {
    let list = ['stock_id', 'group_id', 'item_product', 'item_prefix', 'item_volume', 'item_packing', 'item_weight', 'item_vat', 'item_price', 'item_purchase_price'];
    let data = {};

    for (let i = 0; i < list.length; i++) {
        data[list[i]] = $(`#${list[i]}`).val();
    }
    data['item_fraction'] = 'test';
    data['item_creator'] = 'test';
    $.ajax({
        url: '/addItemToStock',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function() {
            closeCardMenu('stock_new');
        }
    });
}
function createNewStock() {
    let data = {};
    if ($('#create_stock').val() == '') return;
    data['stock_name'] = $('#create_stock').val();
    $.ajax({
        url: '/addStock',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function() {
            createCardMenu($('<div>', { id: 'item_add' })[0])
        }
    });
}
function createNewGroup() {
    let data = {};
    if ($('#create_group').val() == '') return;
    data['group_name'] = $('#create_group').val();
    $.ajax({
        url: '/addItemGroup',
        type: 'GET',
        data: data,
        dataType: 'html',
        success: function() {
            createCardMenu($('<div>', { id: 'item_add' })[0])
        }
    });
}
function selectDrivers(value, select = {Contact_Name: ''}) {
    $.ajax({
        url: '/getContacts',
        type: 'GET',
        data: {category: 'carrier', id: value},
        dataType: 'html',
        success: function(result) {
            $('#delivery_driver').empty();
            $('#delivery_driver').append(
                `<option value="Не выбран" selected disabled>Не выбран</option>`
            )
            result = JSON.parse(result);
            let data = categoryInListCarrier[1][1];

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (data[i].id === result[j].Carrier_id) {
                        $('#delivery_type option').html(data[i].View);
                        break;
                    }
                }
            }

            for (let i = 0; i < result.length; i++) {
                if (select.Contact_Name != '' && select.Contact_Name == result[i].Position){
                    $('#delivery_driver').append(`<option value="${result[i].Position}" selected>${result[i].Position} | ${result[i].Last_name}</option>`)
                } else {
                    $('#delivery_driver').append(`<option value="${result[i].Position}">${result[i].Position} | ${result[i].Last_name}</option>`)
                }
            }
            
        }
    });
}
function reloadStockItems(element) {
    list_items_acc = null;
    list_stock_acc = null;

    createDelCardMenu(element);
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
        if (dataName[i].name === elem) { // Переход по вкладкам карточки в одной категории и подкатегории
            $('.card_menu').remove();
            for (let j = dataName[i].link[0].lastCard.length - 1; j >= 0; j--) {
                if (dataName[i].link[0].lastCard[j] !== null) {
                    dataName[i].link[0].lastCard[j] = null;
                    break;
                }
            }
            $('.info').append(fillingTables(dataName[i].link));
            if ($('.m_comment').is('#comment_content')) {
                $('#comment_content').remove();
                let id = $('.close').attr('id').split('_');
                let data = [id[0], id[3]];
                getCommentsInfo.getRequest(data);
            }
            break;
        } else if (dataName[i].name + '-inv' === elem) { // Переход по вкладкам карточки из категории Финансы в категорию Рабочий стол
            for (let i = 0; i < linkCategoryInfo[0].subcategories.length; i++) {
                linkCategoryInfo[0].subcategories[i][0].active = false;
                if (linkCategoryInfo[0].subcategories[i][0].id == elem.replace(/-inv/g, '')) {
                    linkCategoryInfo[0].subcategories[i][0].active = true;
                }
            }
            categoryInFinanceAccount[0].lastCard[0] = null;            
            $('.card_menu').remove();
            linkCategory('category-0');
            break;
        }
    }
}
// Переход на вкладку оформления договора карточки
function contractNext(elem) {
    if (!checkEmail()) return;
    saveInfoCard(elem.name, true, elem, 'check');
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
function completionCard(elem) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            let idsItems = [];
            for (let element of $('#exposed_list .invoiled')) {
                let idProduct = $(element).attr('id').split('_')[1];
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].items.length; j++) {
                        let account = data[i].items[j];
                        if (account.Item_id == idProduct) {
                            idsItems.push({ id: +idProduct, volume: $(`#invoiled_volume_${idProduct}`).val() });
                        }
                    }
                }
            }
            
            if (idsItems.length > 0) {
                let sale = [], privet = [], delivery = [], items_amount = [];
                for (let element of $('#exposed_list .invoiled')) {
                    let idProduct = $(element).attr('id').split('_')[1];
                    sale.push($(element).children()[7].children[0].value);
                    privet.push($(element).children()[8].children[0].value);
                    delivery.push($(element).children()[9].children[0].value);
                    items_amount.push({ id: +idProduct, amount: $(element).children()[11].innerHTML });
                }

                let status = 'false';
                let date = getCurrentDate('year');
                let name;
                let sum = $('#total').html();
                let shipment = 'false';

                // Передать данные на сервер и создать карточку счета
                for (let i = 0; i < dataName.length; i++) {
                    if ('client' == dataName[i].name) {
                        console.log(dataName[i].link[0].lastCard[0]);
                        console.log(dataName[i].link[0].lastCard[0].children()[1]);
                        console.log(dataName[i].link[0].lastCard[0].children()[1].children[0].children[0]);
                        console.log(dataName[i].link[0].lastCard[0].children()[1].children[0].children[0].children[0].children[1]);
                        console.log(dataName[i].link[0].lastCard[0].children()[1].children[0].children[0].children[0].children[1].children[0].value);
                        name = dataName[i].link[0].lastCard[0].children()[1].children[0].children[0].children[0].children[1].children[0].value;
                        dataName[i].link[0].lastCard = [null, null];
                    }
                }
                $.ajax({
                    url: '/getThisUser',
                    type: 'GET',
                    dataType: 'html',
                    success: function(user) {
                        let this_user = JSON.parse(user);
                        $.ajax({
                            url: '/addAccount',
                            type: 'GET',
                            data: {manager_id: this_user.id, name: name, status: status, date: date,
                                hello: JSON.stringify(privet), sale: JSON.stringify(sale), shipping: JSON.stringify(delivery),
                                items_amount: JSON.stringify(items_amount), sum: sum, item_ids: JSON.stringify(idsItems),
                                total_costs: $('#total_costs_inv').val(), sale_costs: $('#total_discount_inv').val(),
                                hello_costs: $('#total_privet_inv').val(), delivery_costs: $('#total_delivery_inv').val(),
                                shipment: shipment},
                            dataType: 'html',
                            success: function() {
                                closeCardMenu('account_new');
                            }
                        })
                    }
                })
            } else if (idsItems.length == 0) {
                alert('Невозможно создать счет, ни один товар не выбран!');
                return;
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
    if (!id.includes('stock') && !id.includes('delivery') && !id.includes('item')) { 
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
function closeModalMenu() {
    $('.modal_search').remove();
    $('.overflow').remove();
    $('.search #search').val('');
}
function deleteCard(id) {
    let check = confirm('Удалить карточку?');
    if (!check) return;
    let data = id.split('_');
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(result) {
            this_user = JSON.parse(result);
            if (this_user.role == 'admin') {
                $.ajax({
                    url: '/deleteCard',
                    type: 'GET',
                    data: { category: data[0], id: data[1] },
                    dataType: 'html',
                    success: function() {
                        getTableData(saveTableAndCard);
                    }
                });
            }
        }
    });
}
// Заполняем Заголовок карточки
function getTitleInfo(element, selectedLine) {
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
                onclick: element.id !== 'delivery' ? 'closeCardMenu(this.id)' : 'makeRequest(this)',
                append: $('<img>', {src: 'static/images/cancel.png'})
            })
        }

        function getUserInfo() {
            let data, this_user;
            
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    data = JSON.parse(result);
                }
            });
            $.ajax({
                url: '/getThisUser',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    this_user = JSON.parse(result);
                }
            });
            if (!selectedLine.Manager_active) {
                function listManager() {
                    let ul = $('<ul>', { class: 'list'});
            
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].role == 'manager') {
                            ul.append($('<li>', {
                                html: data[i].second_name,
                                id: data[i].id,
                                card: `${element.id}_${element.status}`,
                                onclick: 'selectManagerInCard(this)'
                            }))
                        }
                    }

                    if (this_user.role == 'admin') {
                        ul.append($('<li>', {
                            html: 'Удалить карточку',
                            id: `${element.id}_${element.status}`,
                            onclick: 'deleteCard(this.id)'
                        }))
                    }

                    return ul;
                }
                return $('<div>', { class: 'gray', id: 'user',
                        append: $('<div>', {
                            class: 'drop_menu none',
                            id: `${element.id}-user-${element.status}`,
                            html: listManager(),
                        }).add($('<div>', {
                            onclick: 'unfastenCard(this)',
                            class: 'hover',
                            id: `remove-${element.id}-${element.status}`,
                            append: $('<img>', {
                                src: 'static/images/dropmenu_black.svg',
                                class: 'drop_down_img padl',
                            }).add($('<span>', { html: 'Прикрепить карточку к менеджеру', class: 'marl' }))
                        }))
                    })
            } else {
                let name;
                for (let i = 0; i < data.length; i++) {
                    if (+data[i].id == +selectedLine.Manager_id) {
                        name = convertName(`${data[i].name} ${data[i].second_name}`);
                        username = name;
                        break;
                    }
                }
                return $('<div>', { class: 'gray', id: 'user',
                        append: $('<div>', {
                            class: 'drop_menu',
                            id: `${element.id}_${element.status}`,
                            html: 'Открепить карточку от менеджера',
                            onclick: 'detachmentCard(this)'
                        }).add($('<div>', {
                            onclick: 'unfastenCard(this)',
                            class: 'hover',
                            id: `remove-${element.id}-${element.status}`,
                            append: $('<img>', {
                                src: 'static/images/dropmenu_black.svg',
                                class: 'drop_down_img padl',
                            }).add($('<span>', { html: name, class: 'marl' }))
                        }))
                    })
            }
            
        }
        if (element.id === 'client' || element.id === 'provider') {
            let block = $('<div>', { class: 'right_side' });
            if (!element.status.includes('contract') && !element.status.includes('new')) {
                block.append(getUserInfo());
            }
            block.append(closeButton());
            return block;
        } else {
            return $('<div>', {
                class: 'right_side',
                append: closeButton()
            })
        }
    }

    title.append(getRightSide());

    return title;
}