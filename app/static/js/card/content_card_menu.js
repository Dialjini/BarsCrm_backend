// Контентная часть Аналитики
function analyticsContent() {
    // Получить данные, чтобы заполнить таблицу(-ы)
    return `
        <table class="table analytics">
            <tr>
                <th>Товар</th>
                <th>Клиент</th>
                <th>Объем</th>
                <th>Цена</th>
                <th>Доставка</th>
                <th>Привет</th>
                <th>Себестоимость</th>
                <th>Купили</th>
                <th>Заработали</th>
                <th>Прибыль</th>
            </tr>
            <tr>
                <td rowspan="2">Жмых</td>
                <td>Лютик</td>
                <td>7904</td>
                <td>109</td>
                <td>2</td>
                <td>6</td>
                <td>101</td>
                <td>80</td>
                <td>21</td>
                <td>166000</td>
            </tr>
            <tr>
                <td>Ромашка</td>
                <td>7904</td>
                <td>89</td>
                <td>3</td>
                <td>8</td>
                <td>104</td>
                <td>65</td>
                <td>43</td>
                <td>122300</td>
            </tr>
        </table>

        <table class="table analytics">
            <tr>
                <th>Товар</th>
                <th>Клиент</th>
                <th>Объем</th>
                <th>Цена</th>
                <th>Доставка</th>
                <th>Привет</th>
                <th>Себестоимость</th>
                <th>Купили</th>
                <th>Заработали</th>
                <th>Прибыль</th>
            </tr>
            <tr>
                <td rowspan="2">Барда</td>
                <td>Лютик</td>
                <td>7904</td>
                <td>109</td>
                <td>2</td>
                <td>6</td>
                <td>101</td>
                <td>80</td>
                <td>21</td>
                <td>166000</td>
            </tr>
            <tr>
                <td>Ромашка</td>
                <td>7904</td>
                <td>89</td>
                <td>3</td>
                <td>8</td>
                <td>104</td>
                <td>65</td>
                <td>43</td>
                <td>122300</td>
            </tr>
        </table>
    `
}
// Оформление доставки из карточки Счета
function arrangeDelivery(element) {
    categoryInFinanceAccount[0].lastCard[0] = null;            
    $('.card_menu').remove();
    
    linkCategory('category-2');
    createCardMenu(element);
}
// Заполнение объема в карточке категории Склад для переноса груза из одного склада в другой
function fillVolume(value) { 
    // Делать проверку на объем, если больше, чем есть = ошибка
    value.trim();
    if (value.length > 4) { return };
    let spaceIndex = value.indexOf(' ');
    if (spaceIndex > 0) { value = value.substring(0, spaceIndex) }
    $('#volume_goods').html(value + ' т');
}
// Контентная часть вкладки Оформление договора
function contractContentCard(elem) {
    return `
        <div class="row_card column">
            <table class="fit gray">
                <tr><td class="bold" style="padding-right: 10px;">Договор от</td><td>${getCurrentDate('currentYear')}</td></tr>
                <tr><td class="bold">Менеджер</td><td>${username}</td></tr>
            </table>
            <div class="list" id="list_contract">

                <div class="contract flex">
                    <span>Новый договор</span>
                </div>

            </div>
        </div>
        <div class="next">
            <button class="btn" style="margin-right: 10px" id="${elem.id}" onclick="comeBack(this)">Назад</button> 
            <button class="btn btn-main" id="${elem.id}" onclick="invoiceCard(this)">Выставить счёт</button> 
        </div>
    `
}
// Контентная часть вкладки Выставления счета
function invoicingContentCard(elem) {
    // Изначально искать ту строку и передавать в функции
    // Там подставлять тот контент, который соответствует свойствам
    // Через тбоди добавлять строку в таблицу ???
    // Вывод контента отфильтрованной, нижней таблицы
    function getFilterList(count) {
        let tbody = $('<tbody>', {id: 'filter_list'});
        for (let i = 0; i < count; i++) {
            let tr = $('<tr>', { onclick: 'invoiceInTable(this)', id: `invoice-${i}`});
            for (let j = 0; j < 9; j++) {
                tr.append($('<td>', {
                    html: info[i][j]
                }))
            }
            tbody.append(tr);
        }
        return tbody;
    }
    // Вывод заголовка основной таблицы
    function getTitleTable() {
        return `<tr>
                    <th rowspan="2">Товар</th>
                    <th colspan="2">Фасовка</th>
                    <th colspan="2">Количество</th>
                    <th colspan="5">Цена</th>
                    <th style="width: 90px;" rowspan="2">Сумма</th>
                </tr>
                <tr>
                    <th>Тара</th>
                    <th width="55">Вес</th>
                    <th width="55">В тарах</th>
                    <th width="55">Объем</th>
                    <th width="85">Цена прайса</th>
                    <th width="55">Скидка</th>
                    <th width="55">Привет</th>
                    <th width="55">Доставка</th>
                    <th width="85">За единицу</th>
                </tr>`
    }
    // Вывод заголовка отфильтрованной, нижней таблицы
    function getTitleFilterList() {
        return `<tr>
                    <th>Группа товаров</th>
                    <th>Товар</th>
                    <th>Юр. лицо</th>
                    <th>Объем</th>
                    <th>Фасовка</th>
                    <th>НДС</th>
                    <th>Цена прайса</th>
                    <th>Склад</th>
                    <th></th>
                </tr>`
    }
    // Вывод контента основной таблицы
    function getRowsTable(info = '') {
        let tbody = $('<tbody>', { id: 'exposed_list' });
        for (let i = 0; i < 5; i++) {
            let tr = $('<tr>', {class: 'product', id: 'empty'});
            for (let j = 0; j < 11; j++) {
                tr.append($('<td>', {
                    html: info
                }))
            }
            tbody.append(tr);
        }

        const string = ['Общая', 'НДС', 'Без НДС'];
        const stringID = ['total', 'vat', 'without-vat'];

        for (let i = 0; i < 3; i++) {
            tbody = tbody.add($('<tr>', {
                prepend: $('<td>', { colspan: 9, css: {'border': 'none'} }),
                append: $('<td>', {
                    colspan: 2,
                    class: 'fz10',
                    append: $('<div>', {
                        class: 'flex jc-sb',
                        prepend: $('<span>', {
                            class: 'gray',
                            html: string[i]
                        }),
                        append: $('<span>', {
                            id: stringID[i],
                        })
                    })
                })
            }))
        }

        return tbody;
    }
    // Вывод контента вкладки
    function getContentCard(listFunctions, arg) {
        let content = $('<div>', {
            class: 'row_card',
            append: $('<div>', {
                class: 'info_block full',
                append: $('<table>', {
                    class: 'account_table',
                    id: 'output_table',
                    html: listFunctions[0](),
                    append: listFunctions[1](arg)
                })
            })
        })
        return content;
    }
    // Вывод информации (Привет, доставка, скидка)
    function getRowContent() {
        let content = $('<div>', {
            class: 'row_card',
            append: $('<div>', {
                class: 'costs gray',
                html: ` <div class="costs_element">
                            <span>Всего затраты</span>
                            <input type="number" id="total_costs_inv" class="total_count red bold mrl">
                            <div name="unlock" class="lock_input" id="mode_costs" onclick="switchMode(this)"></div>
                        </div> 
                        <div class="costs_element">
                            <span>Скидка</span> 
                            <input type="number" id="total_discount_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="number" id="total_privet_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="number" id="total_delivery_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_delivery" onclick="switchMode(this)"></div>
                        </div>`,
            })
        })
        return content;
    }
    // Кнопки во вкладке
    function nextStepButtons() {
        let content = $('<div>', {
            class: 'next',
            prepend: $('<button>', {
                class: 'btn',
                id: elem.id + '-inv',
                onclick: 'comeBack(this)',
                html: 'Назад'
            }),
            append: $('<button>', {
                class: 'btn btn-main',
                id: 'account',
                name: elem.id,
                onclick: 'completionCard(this)',
                html: 'Выставить'
            })
        });
        return content;
    }

    return  getRowContent()
            .add(getContentCard([getTitleTable, getRowsTable], ''))
            .add(getContentCard([getTitleFilterList, getFilterList], 5))
            .add(nextStepButtons());
}
let list_inv = [
    { disable: false, id: 'total_discount_inv'},
    { disable: false, id: 'total_privet_inv'},
    { disable: false, id: 'total_delivery_inv'},
]
// Смена режима в Выставлении счета (показатели)
function switchMode(element) {
    let selectInput = $(`#${element.id.replace(/mode_/g, 'total_')}_inv`);
    if ($(element).attr('name') == 'lock') {
        $(element).css('background-image', 'url(static/images/unlc.svg)');
        $(element).attr('name', 'unlock');
        selectInput.removeAttr('disabled');
        selectInput.removeClass('disable');
        for (let i = 0; i < list_inv.length; i++) {
            if (list_inv[i].id == selectInput[0].id) {
                list_inv[i].disable = false;
            }
        }
    } else if ($(element).attr('name') == 'unlock') {
        $(element).css('background-image', 'url(static/images/lock.svg)');
        $(element).attr('name', 'lock');
        selectInput.attr('disabled', 'disabled');
        selectInput.addClass('disable');
        if ($('#total_costs_inv').val() == '') {
            let value = 0;
            for (let i = 0; i < list_inv.length; i++) {
                value += +$(`#${list_inv[i].id}`).val();
            }
            $('#total_costs_inv').val(value);
        } else {
            let disableValue = 0;
            for (let i = 0; i < list_inv.length; i++) {
                if (list_inv[i].id == selectInput[0].id) {
                    list_inv[i].disable = true;
                }
            }
            let amount = 3;
            for (let i = 0; i < list_inv.length; i++) {
                if (list_inv[i].disable) {
                    amount--;
                    disableValue += +$(`#${list_inv[i].id}`).val();
                }
            }
            let value = $('#total_costs_inv').val() - disableValue;
            if (typeof value == typeof '') return;
            let averageValue = Math.round(value / amount);
            for (let i = 0; i < list_inv.length; i++) {
                if (!list_inv[i].disable) {
                    $(`#${list_inv[i].id}`).val(averageValue);
                }
            }
        }
    }
}
// Временная переменная
const info = [
    ['Xxxxxx', 'Xxxxxx', 'ООО', 20, 'Xxxxxxx', 18, 1000, 'Xxxxxx Xxxxx', ''],
    ['Xxxxxx', 'Xxxxxx', 'ООО', 30, 'Xxxxxxx', 28, 4000, 'Xxxxxx Xxxxx', ''],
    ['Xxxxxx', 'Xxxxxx', 'ООО', 40, 'Xxxxxxx', 38, 2000, 'Xxxxxx Xxxxx', ''],
    ['Xxxxxx', 'Xxxxxx', 'ООО', 50, 'Xxxxxxx', 48, 5000, 'Xxxxxx Xxxxx', ''],
    ['Xxxxxx', 'Xxxxxx', 'ООО', 60, 'Xxxxxxx', 58, 3000, 'Xxxxxx Xxxxx', ''],
];
// Выставление счета
function invoiceInTable(element) {
    const stringID = ['total', 'vat', 'without-vat'];

    function fillInfoInRow(index) {
        let test = ['Дольки апельсина с чесноком', 'Пакетик', '1488 кг', '123', '', '500000', '10020', 'Пока', '1000', '500', 'Много'];
        if (test[index] === '') {
            return '000'
        } else {
            return test[index];
        }
    }
    
    let tr = $('<tr>', { class: 'product invoiled', id: `${element.id}-invoiled`, onclick: 'returnBack(this)'});
    for (let i = 0; i < 11; i++) {
        tr.append($('<td>', { html: fillInfoInRow(i)}));
    }
    // Пункт 45
    $('#total').html('Многа');
    $('#vat').html('1000');
    $('#without-vat').html('Многа');

    $(`#${element.id}`).remove();
    $(`#empty`).last().remove();
    $('#exposed_list').prepend(tr);
}
function returnBack(element) {
    $(`#${element.id}`).remove();
    
    // Возвращаем столбец из верхней таблицы обратно
    let returnFillRow = $('<tr>', { onclick: 'invoiceInTable(this)', id: element.id.replace(/-invoiled/g, '')});
    let max = info[element.id.split('-')[1]];
    for (let i = 0; i < max.length; i++) {
        returnFillRow.append($('<td>', { html: max[i] }));
    }
    $('#filter_list').append(returnFillRow);

    // Возвращаем пустой столбец в верхнюю таблицу
    let returnEmptyRow = $('<tr>', {class: 'product', id: 'empty'});
    for (let j = 0; j < 11; j++) {
        returnEmptyRow.append($('<td>', { html: '' }));
    }
    $('#exposed_list').append(returnEmptyRow);
}
// Добавление комментариев в карточках
function addComment(manager = '', data) {
    if (manager === '') {
        $(`#messages`).empty();
        $(`#comments`).empty();
        let list_role = [];
        $('#member .member').each(function(i, element) {
            if ($(element).children()[0].children[0].children[0].value != '') {
                list_role.push($(element).children()[0].children[0].children[0].value)
            }
        });
        $('#messages').append(
            $('<tr>', {
                id: 'message',
                append: `
                    <td>
                        <input type="text" onchange="saveCard()" placeholder="01.01.2020" id="comment_date" class="m_date">
                    </td>
                    <td>
                        <select onselect="saveCard()" id="comment_role" class="m_role">
                            <option value="Не указано" selected disabled>Не указано</option>
                            ${getRoleList()}
                        <select>
                    </td>`
            })
        );
        $('#comments').append(
            $('<tr>', {
                id: 'comment',
                append: `
                    <td>
                        <textarea class="m_comment" id="comment_content" onchange="saveCard()"></textarea>
                    </td>`
            })
        )
        $('#add_new_comment').attr('onclick', 'getCommentsInfo.getRequest(this.name)')
        function getRoleList() {
            let list = '';
            for (let i = 0; i < list_role.length; i++) {
                list = list.concat(`<option value="${list_role[i]}">${list_role[i]}</option>`)
            }
            return list;
        }
    } else {
        $('#messages').append(
            $('<tr>', {
                id: 'message',
                append: `
                    <td>
                        <div type="text" id="message_date" class="m_date">${manager.date}</div>
                    </td>
                    <td>
                        <div type="text" onclick="showComments(this)" id="comments_${data[0]}_${data[1]}" class="m_role static">${manager.name}</div>
                    </td>`
            })
        );
    }
}
function showComments(element) {
    $(`#comments`).empty();
    let data = element.id.split('_');
    let value = $(element).html();
    $.ajax({
        url: '/getMessages',
        type: 'GET',
        data: {category: data[1], id: data[2]},
        dataType: 'html',
        success: function(result) {
            showAllComments(JSON.parse(result), value);
        }
    });
    function showAllComments(result, value) {
        for (let i = 0; i < result.length; i++) {
            if (value === result[i].Manager) {
                let comments = {
                    date: result[i].Date.split(' ')[0],
                    comment: result[i].Note
                }
                $('#comments').prepend(
                    $('<tr>', {
                        id: 'comment',
                        append: `
                            <td width="70px">${comments.date}</td>
                            <td>
                                <div class="done"><pre>${comments.comment}</pre></div>
                            </td>
                        `
                    })
                )
            }
        }
    }
}
// Добавление контакта в карточках, мб переделать в одну функцию
function addMember(id = 'client', selectedLine = '') {
    if (id === 'carrier') category = {class: 'car', member: 'delivery', placeholder: 'Транспорт'};
    else category = {class: 'phone', member: '', placeholder: 'Телефон'};
    if (selectedLine == '') {
        selectedLine = {role: '', phone: '', last_name: '', first_name: '', email: ''};
    }
    let count_members = 0;
    $('#member .member').each(function(i, element) {
        count_members++;
    });
    $('#member').append($('<div>', {
        class: `member ${category.member}`,
        id: `member_${count_members}`,
        append: $('<div>', {
            class: 'm_info',
            append: $('<div>', {
                class: 'top',
                append: $('<input>', { placeholder: 'Должность', class: 'role', id: 'role', onchange: 'saveCard()', value: selectedLine.Position, type: 'text', size: 'onkeydown()', onkeydown: 'widthRole(this)', onkeyup: 'onkeydown()', onkeypress: 'onkeydown()', onchange: 'onkeydown()'
                }).add('<input>',    { placeholder: category.placeholder, class: category.class, id: 'phone', onchange: 'saveCard()', value: selectedLine.Number, type: 'tel'
                })
            }).add($('<div>', {
                class: 'bottom',
                append: $('<input>', { placeholder: 'Фамилия', class: 'last_name', id: 'last_name', onchange: 'saveCard()', value: selectedLine.Last_name, type: 'text'
                }).add('<input>',    { placeholder: 'Имя Отчество', class: 'first_name', id: 'first_name', onchange: 'saveCard()', value: selectedLine.Name, type: 'name'
                }).add('<input>',    { placeholder: 'Почта', class: 'email', id: 'email', onchange: 'saveCard()', onblur: 'checkEmail()', value: selectedLine.Email, type: 'email'
                })
            }))
        }).add($('<div>', { class: 'visible', id: `visible_${count_members}`, onclick: 'visOrHidContact(this.id)' }))
    }));
    $('#member .member').each(function(i, element) {
        widthRole($(element).children()[0].children[0].children[0]);
    });
    saveCard();
}
// Скрытие/Показ контакта
function visOrHidContact(idElem) {
    let id = idElem.split('_');
    if (id[0] == 'visible') {
        $(`#${idElem}`).attr('id', `hidden_${id[1]}`);
        $(`#member_${id[1]}`).addClass('hidden');

        $(`#member_${id[1]} #role`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #phone`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #last_name`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #first_name`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #email`).attr('disabled', 'disabled')

        let save = $(`#member_${id[1]}`).remove();
        $('#member').append(save);
    } else {
        $(`#${idElem}`).attr('id', `visible_${id[1]}`);
        $(`#member_${id[1]}`).removeClass('hidden');

        $(`#member_${id[1]} #role`).removeAttr('disabled')
        $(`#member_${id[1]} #phone`).removeAttr('disabled')
        $(`#member_${id[1]} #last_name`).removeAttr('disabled')
        $(`#member_${id[1]} #first_name`).removeAttr('disabled')
        $(`#member_${id[1]} #email`).removeAttr('disabled')

        let save = $(`#member_${id[1]}`).remove();
        $('#member').prepend(save);
    }
}
// Автоширина поля Должность
function widthRole(element) {
    let width = $(element).val().length * 7;
    if (width > 110) $(element).css('width', `${width}px`)
    else $(element).css('width', '110px')
}
// Проверка email адреса 
function checkEmail() {
    let listEmail = [];
    $('#member .member').each(function(i, element) {
        let email = $(element).children()[0].children[1].children[2];
        let value = email.value;
        if (value == '') {
            listEmail.push('true');
            return false;
        }
        let check = value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
        if (check == null) {
            $(email).addClass('wrong_input');
            setTimeout(function(){
                $(email).removeClass('wrong_input');
            }, 2250);
            listEmail.push('false');
        } else listEmail.push('true');
    });
    for (let i = 0; i < listEmail.length; i++) {
        if (listEmail[i] == 'false') {
            return false;
        }
    }
    return true;
}
// Удаление последнего контакта в карточках
// Удаление последней строки в таблицах карточек
function removeMemberOrRow(id) {
    id = id.split('_')[2];
    $(`#${id}`).children().last().remove();
    if ($(`#${id}`).children().length <= 1) {
        $(`[name="remove_last_${id}"]`).fadeOut(0);
    }
}
// Добавление строк в таблицах карточек
function addRow(id, selectedLine = '') {
    const tableInfo = [
        { id: 'client-group', count: 4, widthInput: [
                {id: 'item_product', width: 57},
                {id: 'item_volume', width: 43},
                {id: 'item_creator', width: 104},
                {id: 'item_price', width: 43}
            ],
            html: ['Name', 'Volume', 'Creator', 'Cost']
        },
        { id: 'provider-group', count: 6, widthInput: [
                {id: 'item_product', width: 57},
                {id: 'item_price', width: 33},
                {id: 'item_vat', width: 28},
                {id: 'item_packing', width: 59},
                {id: 'item_weight', width: 24},
                {id: 'item_fraction', width: 57}
            ],
            html: ['Name', 'Cost', 'NDS', 'Packing', 'Weight', 'Fraction']
        },
            { id: 'carrier-group', count: 5, widthInput: [
                    {id: 'carrier_date', width: 50},
                    {id: 'carrier_client', width: 100},
                    {id: 'carrier_stock', width: 160},
                    {id: 'carrier_driver', width: 90},
                    {id: 'carrier_price', width: 33}
                ],
                html: []
        },
            { id: 'account-group', count: 3, widthInput: [
                    {id: 'account_position', width: 58},
                    {id: 'account_date', width: 42},
                    {id: 'account_price', width: 43}
                ],
                html: []
        },
            { id: 'delivery-group', count: 2, widthInput: [
                    {id: 'delivery_date', width: 45},
                    {id: 'delivery_price', width: 43}
                ],
                html: []
        }
    ]

    function trFill(table) {
        let tr = $('<tr>');
        for (let i = 0; i < table.count; i++) {
            tr.append($('<td>', {
                append: $('<input>', {
                    css: { width: table.widthInput[i].width + 'px', padding: '0' },
                    id: table.widthInput[i].id, value: selectedLine[table.html[i]]
                })
            }));
        }
        return tr;
    }

    for (let i = 0; i < tableInfo.length; i++) {
        if (id == tableInfo[i].id) {
            $(`#group`).append(trFill(tableInfo[i]));
            $(`[name="remove_last_group"]`).fadeIn(0);
            break;
        }
    }
    saveCard();
}
function itemSelection(element, select) {
    if (element === 'client' || element === 'provider') {
        if (select.Category == '') {
            $(`#${element}_category option:contains('Выбрать')`).attr('selected', true)
        } else {
            $(`#${element}_category option:contains('${select.Category}')`).attr('selected', true)
            $(`#${element}_category :selected`).val($(`#${element}_category :selected`).html());       
        }
        if (select.Segment == '') {
            $(`#${element}_industry option:contains('Выбрать')`).attr('selected', true)
        } else {
            $(`#${element}_industry option:contains('${select.Segment}')`).attr('selected', true)
            $(`#${element}_industry :selected`).val($(`#${element}_industry :selected`).html());
        }
    } else {
        let option = $(`#${element.id} :selected`);
        option.val(option.html());
    }
    saveCard();
}
// Открепление карточки от менеджера
function unfastenCard() {
    $('.drop_menu').fadeIn(200);
}
function detachmentCard(element) {
    let idName = element.id.replace(/remove-/g, '').split('-');
    // Добавить карточку в список Карточки клиентов
    closeCardMenu(idName);

    $('#empty_customer_cards').append($('<div>', {
        class: 'fieldInfo padd',
        id: `detached_card_${idName[1]}`, // Number
        append: $('<div>', { class: 'name', html: $(`#${idName[0]}_name`).val() })
        .add($('<div>', {
            class: 'row',
            append: $('<div>', {
                class: 'descr',
                html: `Снято с ${username}`
            }).add($('<div>', {
                class: 'time',
                html: `Свободна с <span id="free_card_date" class="bold">${getCurrentDate()}</span>`
            }))
        }))
    }));
    // Делать запрос на удаление менеджера из карточки
    for (let i = 0; i < dataName.length; i++) {
        if (dataName[i].name === idName[0]) getTableData(dataName[i].link); 
    }
}
// Сохранение изменений в карточке
function saveCard() {
    saveTableAndCard[0].lastCard[0] = $('#card_menu');
}