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
    let getInfo = element.id.split('-');
    let selectedLine = new Object();

    // Информация по всем карточкам подкатегорий
    // Подставить актуальные данные
    const titleObject = [
        {
            id: 'client',
            list: [`Местное время: ${getCurrentTime()}`, `Какой-то их сайт`, `Холдинг`],
            link: clientContentCard,
            status: getInfo[1]
        },
        {
            id: 'provider',
            list: [`Местное время: ${getCurrentTime()}`, `Холдинг`],
            link: providerContentCard,
            status: getInfo[1]
        },
        {
            id: 'carrier',
            list: [`Местное время: 14:42`],
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
            list: [`Счета от ${selectedLine[0]}`],
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
            if (getInfo[1] !== 'clear') {
                selectedLine = dataName[i].link[1][1][titleObject[i].status - 1];
                titleObject[i].list.unshift(`Код: ${selectedLine.Client_id}`);
            } else {
                selectedLine = ['', '', '', '', '', '', '', '', '', '', ''];
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
            if (element.status == 'clear') {
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

    // Модальное окно для Склада
    if (getInfo[0] === 'stock') {
        $('.info').prepend($('<div>', {class: 'overflow'}));
        $('#card_menu').addClass('modal');
    // Проверка на заполненность Контактов и строк таблиц (Не у Склада)
    } else { 
        if ($('#members').html().trim() !== '') {
            $('#remove_last_member').fadeIn(0);
        }
        if ($('#group').html().trim() !== '') {
            $('#remove_last_row').fadeIn(0);
        }
    }
    // Контентная часть Клиентов
    function clientContentCard(selectedLine) {
        let content = ` <div class="row_card">
                            <table class="table_block">
                                <tr>
                                    <td>Наименование</td>
                                    <td><input type="text" id="client_organization_name" onchange="saveCard()" value="${selectedLine.Name}"></td>
                                </tr>
                                <tr>
                                    <td>Район</td>
                                    <td><input type="text" id="client_area" value="${selectedLine.Rayon}"></td>
                                </tr>
                                <tr>
                                    <td>Область/Край</td>
                                    <td><input type="text" id="client_region" value="${selectedLine.Oblast}"></td>
                                </tr>
                                <tr>
                                    <td>Адрес</td>
                                    <td><input type="text" id="client_address" value="${selectedLine.Adress}"></td>
                                </tr>
                                <tr>
                                    <td>ИНН</td>
                                    <td><input type="text" id="client_inn" value="${selectedLine.UHH}"></td>
                                </tr>
                            </table>
                            <table class="table_block">
                                <tr>
                                    <td>Тег</td>
                                    <td><input type="text" id="client_tag" class="string" value="${selectedLine[2]}"></td>
                                </tr>
                                <tr>
                                    <td>Категория</td>
                                    <td><input type="text" id="client_category" class="string" value="${selectedLine.Category}"></td>
                                </tr>
                                <tr>
                                    <td>Ж/Д Станция</td>
                                    <td> <input type="text" id="client_station" class="string" value="${selectedLine[2]}"></td>
                                </tr>
                                <tr>
                                    <td>Цена вагона</td>
                                    <td><input type="text" id="client_price" class="string" value="${selectedLine[2]}"></td>
                                </tr>
                                <tr>
                                    <td>км от НСК</td>
                                    <td><input type="text" id="client_distance" class="string" value="${selectedLine[2]}"></td>
                                </tr>
                            </table>
                            <div class="info_block">
                                <span class="lightgray">Отрасль</span><input id="client_industry" class="string" value="${selectedLine.Segment}">
                                <span class="lightgray" style="margin-top: 17px;">Поголовье</span>
                                <table>
                                    <tr>
                                        <td>Общее</td>
                                        <td>Дойного</td>
                                        <td>Надои</td>
                                    </tr>
                                    <tbody>

                                    </tbody>
                                </table>
                                <span class="lightgray" style="margin-top: 17px;">Спрос</span>
                                <table>
                                    <tr>
                                        <td>Товар</td>
                                        <td>Объем</td>
                                    </tr>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row_card">
                            <div class="left_side">
                                <div class="hmax" id="members">
                                    <div id="client_member_1" class="member">
                                        <div class="top">
                                            <div class="role" id="role">Директор</div>
                                            <input type="phone" class="phone" id="phone" value="${selectedLine[2]}">
                                        </div>
                                        <div class="bottom">
                                            <input type="text" class="surname" id="surname" value="${selectedLine[2]}">
                                            <input type="text" class="fullname" id="fullname" value="${selectedLine[2]}">
                                            <input type="email" class="email" id="email" value="${selectedLine[2]}">
                                        </div>
                                    </div>
                                </div>
                                <div class="events">
                                    <img class="add_something" src="static/images/add.png" onclick="addMember()">
                                    <img id="remove_last_member" class="add_something" src="static/images/remove.png" onclick="removeMember()">
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
                                        <tbody id="group">

                                        </tbody>
                                    </table>
                                </div>
                                <div class="events">
                                    <img class="add_something" id="client-table" src="static/images/add.png" onclick="addRow(this)">
                                    <img id="remove_last_row" class="add_something" src="static/images/remove.png" onclick="removeRow()">
                                </div>
                            </div>
                        </div>
                        <div class="area">
                            <div class="history">
                                <div class="title">
                                    <div>История обращений</div>
                                    <img class="add_something" src="static/images/add.png">
                                </div>
                                <div class="messages">
                                    <table class="message">
                                        <tr>
                                            <td>10.10.18</td>
                                            <td>Директор</td>
                                            <td>Начали переговоры</td>
                                        </tr>
                                        <tr>
                                            <td>10.10.18</td>
                                            <td>Менеждер</td>
                                            <td>Начали переговоры</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="last_comment">
                                <div class="title">Последний комментарий</div>
                                <div class="messages">
                                    <table class="message">
                                        <tr>
                                            <td style="width: 15%">10.10.18</td>
                                            <td style="width: 20%">Менеджер</td>
                                            <td style="width: 65%">Товар получен, счет оплачен</td>
                                            <td style="width: 10%" class="lightgray">Иванова</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="next">
                            <button class="btn btn-main" id="client" onclick="contractNext(this)">Оформить Договор</button>
                        </div>
                        `
        return content;
    }
    // Контентная часть Поставщиков
    function providerContentCard(selectedLine) {
        return `         <div class="row_card">
                            <table class="table_block">
                                <tr>
                                    <td>Наименование</td>
                                    <td>
                                        <input type="text" id="provider_organization_name" value="${selectedLine.Name}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Районе</td>
                                    <td>
                                        <input type="text" id="provider_area" value="${selectedLine.Rayon}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Область/Край</td>
                                    <td>
                                        <input type="text" id="provider_region" value="${selectedLine.Oblast}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Адрес</td>
                                    <td>
                                        <input type="text" id="provider_address" value="${selectedLine.Adress}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>ИНН</td>
                                    <td>
                                        <input type="text" id="provider_inn" value="${selectedLine.UHH}">
                                    </td>
                                </tr>
                            </table>
                            <table class="table_block">
                                <tr>
                                    <td>Тег</td>
                                    <td>
                                        <input type="text" id="provider_tag" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Категория</td>
                                    <td>
                                        <input type="text" id="provider_category" class="string" value="${selectedLine.Category}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ж/Д Станция</td>
                                    <td>
                                        <input type="text" id="provider_station" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Цена вагона</td>
                                    <td>
                                        <input type="text" id="provider_price" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>км от НСК</td>
                                    <td>
                                        <input type="text" id="provider_distance" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                            </table>
                            <table class="table_block">
                                <tr>
                                    <td>Объем про-ва</td>
                                    <td>
                                        <input type="text" id="provider_volume" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>НДС</td>
                                    <td>
                                        <input type="number" id="provider_vat" class="string" value="${selectedLine[selectedLine.length - 2]}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>Мерекурий</td>
                                    <td>
                                        <input type="text" id="provider_merc" class="string" value="${selectedLine[2]}">
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="row_card">
                            <div class="left_side">
                                <div class="hmax" id="members">
                                    <div id="provider_member_1" class="member">
                                        <div class="top">
                                            <div class="role" id="role">Директор</div>
                                            <input type="phone" class="phone" id="phone" value="${selectedLine[2]}">
                                        </div>
                                        <div class="bottom">
                                            <input type="text" class="surname" id="surname" value="${selectedLine[2]}">
                                            <input type="text" class="fullname" id="fullname" value="${selectedLine[2]}">
                                            <input type="email" class="email" id="email" value="${selectedLine[2]}">
                                        </div>
                                    </div>
                                </div>
                                <div class="events">
                                    <img class="add_something" src="static/images/add.png" onclick="addMember()">
                                    <img id="remove_last_member" class="add_something" src="static/images/remove.png" onclick="removeMember()">
                                </div>
                            </div>
                            <div class="info_block">
                                <span class="lightgray">Группа товаров</span>
                                <div class="hmax">
                                    <table>
                                        <tr><td>Товар</td><td>Цена</td><td>НДС</td><td>Упаковка</td><td>Вес</td><td>Фракция</td></tr>
                                        <tbody id="group">
                                            
                                        </tbody>
                                    </table>
                                </div>
                                <div class="events">
                                    <img class="add_something" id="provider-table" src="static/images/add.png" onclick="addRow(this)">
                                    <img id="remove_last_row" class="add_something" src="static/images/remove.png" onclick="removeRow()">
                                </div>
                            </div>
                        </div>
                        <div class="area">
                            <div class="history">
                                <div class="title">
                                    <div>История обращений</div>
                                    <img class="add_something" src="static/images/add.png">
                                </div>
                                <div class="messages">
                                    <table class="message">
                                        <tr>
                                            <td>10.10.18</td>
                                            <td>Директор</td>
                                            <td>Начали переговоры</td>
                                        </tr>
                                        <tr>
                                            <td>10.10.18</td>
                                            <td>Менеждер</td>
                                            <td>Начали переговоры</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="last_comment">
                                <div class="title">Последний комментарий</div>
                                <div class="messages">
                                    <table class="message">
                                        <tr>
                                            <td style="width: 15%">10.10.18</td>
                                            <td style="width: 20%">Менеджер</td>
                                            <td style="width: 65%">Товар получен, счет оплачен</td>
                                            <td style="width: 10%" class="lightgray">Иванова</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="next">
                            <button class="btn btn-main" id="provider" onclick="contractNext(this)">Оформить Договор</button> 
                        </div>
                        `
    }
    // Контентная часть Перевозчиков
    function carrierContentCard(selectedLine) {
        return ` <div class="row_card" style="justify-content: flex-start">
                    <table class="table_block" style="margin-right: 50px;">
                        <tr>
                            <td>Наименование</td>
                            <td>
                                <input type="text" id="carrier_organization_name" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Районе</td>
                            <td>
                                <input type="text" id="carrier_area" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Область/Край</td>
                            <td>
                                <input type="text" id="carrier_region" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Адрес</td>
                            <td>
                                <input type="text" id="carrier_address" value="${selectedLine[2]}">
                            </td>
                        </tr>
                    </table>
                    <table class="table_block">
                        <tr>
                            <td>ИНН</td>
                            <td>
                                <input type="text" id="carrier_inn" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Грузоподъемность</td>
                            <td>
                                <input type="text" id="carrier_capacity" value="${selectedLine[2]}" class="string">
                            </td>
                        </tr>
                        <tr>
                            <td>Вид перевозки</td>
                            <td>
                                <input type="text" id="carrier_view" value="${selectedLine[2]}" class="string">
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="row_card" id="media">
                    <div class="left_side">
                        <div class="hmax" id="members">
                            <div id="carrier_member_1" class="member delivery">
                                <div class="top">
                                    <div class="role" id="role">Водитель</div>
                                    <input type="text" value="${selectedLine[2]}" class="car" id="car">
                                </div>
                                <div class="bottom">
                                    <input type="text" value="${selectedLine[2]}" class="surname" id="surname">
                                    <input type="text" value="${selectedLine[2]}" class="fullname" id="fullname">
                                    <input type="email" value="${selectedLine[2]}" class="email" id="email">
                                </div>
                            </div>
                        </div>
                        <div class="events">
                            <img class="add_something" src="static/images/add.png" onclick="addMemberDelivery()">
                            <img id="remove_last_member" class="add_something" src="static/images/remove.png" onclick="removeMember()">
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
                                <tbody id="group">
                                    <tr>
                                        <td class="date"><input value="${selectedLine[3]}" type="text"></td>
                                        <td class="name"><input value="${selectedLine[3]}" type="text"></td>
                                        <td class="stock"><input value="${selectedLine[3]}" type="text"></td>
                                        <td class="driver"><input value="${selectedLine[3]}" type="text"></td>
                                        <td class="price"><input value="${selectedLine[3]}" type="text"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="carrier-table" src="static/images/add.png" onclick="addRow(this)">
                            <img class="add_something" id="remove_last_row" src="static/images/remove.png" onclick="removeRow()">
                        </div>
                    </div>
                </div>
                <div class="area">
                    <div class="history">
                        <div class="title">
                            <div>История обращений</div>
                            <img class="add_something" src="static/images/add.png">
                        </div>
                        <div class="messages">
                            <table class="message">

                            </table>
                        </div>
                    </div>
                    <div class="last_comment">
                        <div class="title">Последний комментарий</div>
                        <div class="messages">
                            <table class="message">
                                <tr>
                                    <td style="width: 15%"></td>
                                    <td style="width: 20%"></td>
                                    <td style="width: 65%"></td>
                                    <td style="width: 10%" class="lightgray"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="carrier" onclick="contractNext(this)">Оформить Договор</button>
                </div>`
    }
    // Контентная часть Счета
    function accountContentCard(selectedLine) {
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
                            <tr class="product">
                                <td>Продукт</td>
                                <td>Бочка</td>
                                <td>25</td>
                                <td>100</td>
                                <td>15000</td>
                                <td>180000</td>
                                <td>5000</td>
                                <td>5000</td>
                                <td>5000</td>
                                <td>195</td>
                                <td>195000</td>
                            </tr>
                            <tr class="product">
                                <td>Продукт 2</td>
                                <td>Мешок</td>
                                <td>30</td>
                                <td>200</td>
                                <td>20000</td>
                                <td>200000</td>
                                <td>10000</td>
                                <td>10000</td>
                                <td>10000</td>
                                <td>300</td>
                                <td>25000</td>
                            </tr>
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
                            <tr>
                                <td colspan="10"></td>
                                <td class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Общая</span>234000</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10"></td>
                                <td class="fz10">
                                    <div class="flex jc-sb"><span class="gray">НДС</span>12222</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10"></td>
                                <td class="fz10">
                                    <div class="flex jc-sb"><span class="gray">Без НДС</span>123332</div>
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
                                <tbody id="group">

                                </tbody>
                            </table>
                        </div>
                        <div class="events">
                            <img class="add_something" id="account-table" src="static/images/add.png" onclick="addRow(this)">
                            <img class="add_something" id="remove_last_row" src="static/images/remove.png" onclick="removeRow()">
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn btn-main" id="delivery-1" onclick="arrangeDelivery(this)">Оформить Доставку</button>
                </div>`
    }
    // Контентная часть Дебеторки
    function debitContentCard(selectedLine) {
        return `<div class="row_card"></div>`
    }
    // Контентная часть Доставки
    function deliveryContentCard(selectedLine) {
        return `<div class="row_card">
                    <table class="table_block">
                        <tr>
                            <td>Заказчик</td>
                            <td>
                                <input type="text" id="delivery_customer" value="${selectedLine[1]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Дата отгрузки</td>
                            <td>
                                <input type="text" id="delivery_shipment" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Дата разгрузки</td>
                            <td>
                                <input type="text" id="delivery_unloading" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Способ погрузки</td>
                            <td>
                                <input type="text" id="delivery_way" value="${selectedLine[2]}">
                            </td>
                        </tr>
                    </table>
                    <table class="table_block">
                        <tr>
                            <td>Перевозчик</td>
                            <td>
                                <input type="text" id="delivery_carrier" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Водитель</td>
                            <td>
                                <input type="text" id="delivery_driver" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Вид перевозки</td>
                            <td>
                                <input type="text" id="delivery_view" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Комментарий</td>
                            <td>
                                <input type="text" id="delivery_comment" value="${selectedLine[2]}">
                            </td>
                        </tr>
                    </table>
                    <table class="table_block">
                        <tr>
                            <td>Клиент</td>
                            <td>
                                <input type="text" id="delivery_client" value="${selectedLine[2]}">
                            </td>
                        </tr>
                        <tr>
                            <td>Контакт на выгрузке</td>
                            <td>
                                <input type="text" id="delivery_contact" value="${selectedLine[2]}">
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
                                <img class="add_something" id="delivery-table" src="static/images/add.png" onclick="addRow(this)">
                                <img class="add_something" id="remove_last_row" src="static/images/remove.png" onclick="removeRow()">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="next">
                    <button class="btn" style="margin-right: 10px" onclick="closeCardMenu()">Забирает сам</button>
                    <button class="btn btn-main" id="delivery" onclick="closeCardMenu()">Оформить Заявку</button>
                </div>`
    }
    // Контентная часть Склада
    function stockContentCard(selectedLine) {
        return `<div class="row_card">
                    <div class="info_block">
                        <div class="mb">
                            <span class="bold">Транзит со склада</span>
                            <input value="${selectedLine[selectedLine.length - 1]}">
                        </div>
                        <div>
                            <table>
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
                                        <td>${selectedLine[0]}</td>
                                        <td>${selectedLine[1]}</td>
                                        <td>${selectedLine[2]}</td>
                                        <td id="from">${selectedLine[3]}</td>
                                        <td>${selectedLine[4]}</td>
                                        <td>${selectedLine[6]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </div>
                </div>
                <div class="row_card">
                    <div class="info_block">
                        <div>
                            <span class="bold">На склад</span>
                            <input value="">
                        </div>
                        <div class="mb">
                            <span class="bold">Объем</span>
                            <input oninput="fillVolume(this.value)">
                        </div>
                        <div>
                            <table>
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
                                        <td>${selectedLine[0]}</td>
                                        <td>${selectedLine[1]}</td>
                                        <td>${selectedLine[2]}</td>
                                        <td id="volume_goods">т</td>
                                        <td>${selectedLine[4]}</td>
                                        <td>${selectedLine[6]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>     
                </div>
                <div class="next">
                    <button class="btn btn-main" onclick="closeCardMenu()">Оформить</button>
                </div>
                `
    }
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
    saveCard();
    $('.card_menu').remove();
    $('.info').append($('<div>', {
        class: 'card_menu',
        id: 'contract-decor',
        append: getTitleInfo({
            id: `${elem.id}`,
            list: ['Оформление договора']
        }).add($('<div>', {
            class: 'content',
            append: contractContentCard(elem)
        }))
    }))
    for (let i = 0; i < dataName.length; i++) {
        if (elem.id == dataName[i].name) {
            dataName[i].link[0].lastCard[1] = $('.card_menu');
            break;
        }
    }
}
// Переход на вкладку выставления счета
function invoiceCard(elem) {
    function invoiceCardContent() {
        return $('<div>', {
            class: 'card_menu invoicing',
            id: `${elem.id}_invoicing_card`,
            append: $('<div>', {
                class: 'content',
                append: invoicingContentCard(elem)
            })
        })
    }
    $('.card_menu').remove();
    categoryInFinanceAccount[0].lastCard[0] = invoiceCardContent();

    categoryInFinanceAccount[0].active = true;
    categoryInFinanceDebit[0].active = false;
    
    linkCategory('category-1');
    linkField();
}
// Завершение выставления счета и закрытие карточки 
function completionCard(element) {
    for (let i = 0; i < dataName.length; i++) {
        if (element.name === dataName[i].name) {
            dataName[i].link[0].lastCard = [null, null];
        }
    }
    closeCardMenu();
}
// Закрытие карточки
function closeCardMenu(id = '') {
    // Если открыта карточка Выставления счета в Счете - закрыть ее
    if (categoryInFinanceAccount[0].lastCard[0] !== null) {
        if (id.replace(/_close_card/g, '') === categoryInFinanceAccount[0].lastCard[0][0].id.replace(/_invoicing_card/, '')) {
            categoryInFinanceAccount[0].lastCard[0] = null;
        }
    }
    // Сохраняет данные на сервер
    $('.table').remove();
    for (let i = saveTableAndCard[0].lastCard.length - 1; i >= 0; i--) {
        if (saveTableAndCard[0].lastCard[i] != null) {
            saveTableAndCard[0].lastCard[i] = null;
        }
    }
    selectedLine = {};
    $('.info').append(fillingTables(saveTableAndCard));
    setTimeout(() => {
        $('.card_menu, .overflow').remove();
    }, 0);
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
                id: `${element.id}_close_card`,
                onclick: 'closeCardMenu(this.id)',
                append: $('<img>', {src: 'static/images/cancel.png'})
            })
        }

        if (element.id === 'stock') {
            return $('<div>', {
                class: 'right_side',
                append: closeButton()
            })
        } else {
            return $('<div>', {
                class: 'right_side',
                append: $('<div>', { class: 'gray', id: 'user',
                    append: $('<div>', {
                        class: 'drop_menu',
                        id: `${element.id}-user`,
                        html: 'Открепить карточку от менеджера'
                    }).add($('<div>', {
                        onclick: 'unfastenCard(this)',
                        class: 'hover',
                        id: `remove-${element.id}-${element.status}`,
                        append: $('<img>', {
                            src: 'static/images/dropmenu_black.svg',
                            class: 'drop_down_img padl',
                        }).add($('<span>', { html: username, class: 'marl' }))
                    }))
                }).add(closeButton())
            })
        }
    }

    title.append(getRightSide());

    return title;
}
// Смена режима в Выставлении счета (показатели)
let enteredValues = 0;
function switchMode(element) {
    let selectInput = $(`#${element.id.replace(/mode_/g, 'total_')}_inv`);
    if ($(element).css('background-image').includes('lock.svg')) {
        $(element).css('background-image', 'url(static/images/unlc.svg)');
        selectInput.removeAttr('disabled');
    } else if ($(element).css('background-image').includes('unlc.svg')) {
        $(element).css('background-image', 'url(static/images/lock.svg)');
        selectInput.attr('disabled', 'disabled');
        // Автоматическое вычисление для других показателей
    }
}