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
    createDelCardMenu(element);
}
// Заполнение объема в карточке категории Склад для переноса груза из одного склада в другой
function fillVolume(value) { 
    // Делать проверку на объем, если больше, чем есть = ошибка
    value.trim();
    if (value.length > 4) { return };
    let spaceIndex = value.indexOf(' ');
    if (spaceIndex > 0) { value = value.substring(0, spaceIndex) }
    $('#volume_goods').html(value);
}
function dataСalculation(element) {
    for (let i = 0; i < list_inv.length; i++) {
        if (list_inv[i].id == element.id) {
            list_inv[i].value = $(element).val();
        }
    }
    let total = $('#total_costs_inv').val();
    let sale = $('#total_discount_inv').val();
    let privet = $('#total_privet_inv').val();
    let delivery = $('#total_delivery_inv').val();
    if ((total == '' || total == '0') && (sale != '' && privet != '' && delivery != '')) {
        let sum = +sale + +privet + +delivery;
        $('#total_costs_inv').val(sum);
    }
}
function calculationIndicators() {
    let list = [
        {id: 'total_discount_inv', tr: 'calcSale'},
        {id: 'total_privet_inv', tr: 'calcPrivet'},
        {id: 'total_delivery_inv', tr: 'calcDelivery'},
    ]
    let count = 0;
    $('#exposed_list .invoiled').each(function(i, element) {
        count++;
    });
    for (let i = 0; i < list.length; i++) {
        let data = categoryInStock[1][1];
        for (let j = 0; j < data.length; j++) {
            for (let k = 0; k < data[j].items.length; k++) {
                $('#exposed_list .invoiled').each(function(i, element) {
                    if ($(element).attr('id').split('_')[1] == data[j].items[k].Item_id) {
                        $(`#calcSale_${data[j].items[k].Item_id}`).html((+$('#total_discount_inv').val() / data[j].items[k].Volume / count).toFixed(2));
                        $(`#calcPrivet_${data[j].items[k].Item_id}`).html((+$('#total_privet_inv').val() / data[j].items[k].Volume / count).toFixed(2));
                        $(`#calcDelivery_${data[j].items[k].Item_id}`).html((+$('#total_delivery_inv').val() / data[j].items[k].Volume / count).toFixed(2));
                    }
                });
            }
        }
    }
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
function invoicingContentCard(elem, data) {
    function getFilterList() {
        let tbody = $('<tbody>', {id: 'filter_list'});
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].items.length; j++) {
                let tr = $('<tr>', { onclick: 'invoiceInTable(this)', id: `invoice_${data[i].items[j].Item_id}`});
                const name = [data[i].items[j].Group_name, data[i].items[j].Name, data[i].items[j].Prefix, data[i].items[j].Volume, data[i].items[j].Packing, data[i].items[j].NDS, data[i].items[j].Cost, data[i].stock_address];
                for (let k = 0; k < name.length; k++) {
                    tr.append($('<td>', {
                        html: name[k]
                    }))
                }
                tr.append($('<td>', {html: ''}));
                tbody.append(tr);
            }
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
    function getContentCard(listFunctions, idTable, className) {
        let content = $('<div>', {
            class: 'row_card',
            append: $('<div>', {
                class: 'info_block full ' + className,
                append: $('<table>', {
                    class: 'account_table',
                    id: idTable,
                    html: listFunctions[0](),
                    append: listFunctions[1]()
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
                            <input type="number" onkeyup="calculationIndicators()" onblur="dataСalculation(this)" id="total_discount_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="number" onkeyup="calculationIndicators()" onblur="dataСalculation(this)" id="total_privet_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="number" onkeyup="calculationIndicators()" onblur="dataСalculation(this)" id="total_delivery_inv" class="total_count bold mrl">
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
            .add(getContentCard([getTitleTable, getRowsTable], 'input_table'))
            .add(getContentCard([getTitleFilterList, getFilterList], 'output_table', 'hmax'))
            .add(nextStepButtons());
}
// Выставление счета
function invoiceInTable(element) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            let prefixAccount = null;
            let accountInUpperTable = $('#exposed_list .invoiled').attr('id');

            if (accountInUpperTable != undefined) {
                accountInUpperTable = accountInUpperTable.split('_')[1]
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].items.length; j++) {
                        let account = data[i].items[j];
                        if (account.Item_id == accountInUpperTable) {
                            prefixAccount = account.Prefix;
                        }
                    }
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].items.length; j++) {
                        let account = data[i].items[j];
                        if (account.Item_id == element.id.split('_')[1]) {
                            prefixAccount = account.Prefix;
                        }
                    }
                }
            }
            
            let tr = $('<tr>', { class: 'product invoiled', id: `invoiled_${element.id.split('_')[1]}`, onclick: 'returnBack(this)'});
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].items.length; j++) {
                    let account = data[i].items[j];
                    if (account.Prefix == prefixAccount) {
                        if (account.Item_id == element.id.split('_')[1]) {
                            let list = [account.Name, account.Packing, account.Weight + ' кг.', Math.round(account.Volume / account.Weight), account.Volume, account.Cost, 0, 0, 0, Math.round(account.Cost / account.Volume), Math.round(account.Cost * account.Volume)]
                            for (let k = 0; k < list.length; k++) {
                                if (k == 6) {
                                    tr.append($('<td>', { id: 'calcSale_' + account.Item_id, html: list[k] }));
                                    continue;
                                } else if (k == 7) {
                                    tr.append($('<td>', { id: 'calcPrivet_' + account.Item_id, html: list[k] }));
                                    continue;
                                } else if (k == 8) {
                                    tr.append($('<td>', { id: 'calcDelivery_' + account.Item_id, html: list[k] }));
                                    continue;
                                } else if (k == list.length - 1) {
                                    tr.append($('<td>', { id: 'calcSum', html: list[k] }));
                                    continue;
                                }
                                tr.append($('<td>', { html: list[k] }));
                            }
                            $(`#${element.id}`).remove();
                            $(`#empty`).last().remove();
                            $('#exposed_list').prepend(tr);

                            let sum = 0;
                            $('#exposed_list .invoiled #calcSum').each(function(i, element) {
                                sum += +$(element).html()
                            });
                            let vat = sum > 0 ? sum - ((sum * +account.NDS) / 100) : 0;
                            $('#total').html(sum);
                            $('#vat').html(sum - vat);
                            $('#without-vat').html(vat);
                            break;
                        }
                    }
                }
            }
            calculationIndicators();
        },
    });
}
function returnBack(element) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            $(`#${element.id}`).remove();
            // Возвращаем столбец из верхней таблицы обратно
            let tr = $('<tr>', { onclick: 'invoiceInTable(this)', id: element.id.replace(/invoiled_/g, 'invoice_')});
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].items.length; j++) {
                    let account = data[i].items[j];
                    if (account.Item_id == element.id.split('_')[1]) {
                        let list = [account.Group_name, account.Name, account.Prefix, account.Volume, account.Packing, account.NDS, account.Cost, data[i].stock_address]
                        for (let k = 0; k < list.length; k++) {
                            tr.append($('<td>', { html: list[k] }));
                        }
                        tr.append($('<td>', {html: ''}));

                        let sum = 0;
                        $('#exposed_list .invoiled #calcSum').each(function(i, element) {
                            sum += +$(element).html()
                        });
                        let vat = sum > 0 ? sum - ((sum * +account.NDS) / 100) : 0;
                        $('#total').html(Math.round(sum));
                        $('#vat').html(Math.round(sum - vat));
                        $('#without-vat').html(Math.round(vat));
                        break;
                    }
                }
            }
            $('#filter_list').append(tr);

            // Возвращаем пустой столбец в верхнюю таблицу
            let returnEmptyRow = $('<tr>', {class: 'product', id: 'empty'});
            for (let j = 0; j < 11; j++) {
                returnEmptyRow.append($('<td>', { html: '' }));
            }
            $('#exposed_list').append(returnEmptyRow);
            calculationIndicators();
        },
    });
}
let list_inv = [
    { disable: false, id: 'total_discount_inv', value: 0},
    { disable: false, id: 'total_privet_inv', value: 0},
    { disable: false, id: 'total_delivery_inv', value: 0},
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
    for (let i = 0; i < list_inv.length; i++) {
        list_inv[i].value = $(`#${list_inv[i].id}`).val();
    }
    calculationIndicators();
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
                        <input type="text" onchange="saveCard()" value="${getCurrentDate('year')}" id="comment_date" class="m_date">
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
            for (let i = 0; i < list_role.length - 1; i++) {
                for (let j = i + 1; j < list_role.length; j++) {
                    if (list_role[i] === list_role[j]) {
                        list_role.splice(j, 1);
                        j--;
                    }
                }
            }
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
                                <div class="done"><p>${comments.comment}</p></div>
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
        selectedLine = {role: '', phone: '', last_name: '', first_name: '', email: '', visible: true};
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
                append: $('<input>', { placeholder: 'Должность', class: 'role', id: 'role', onchange: 'saveCard()', value: selectedLine.Position, type: 'text', onkeydown: 'widthRole(this)', onkeyup: 'onkeydown()', onkeypress: 'onkeydown()', onchange: 'onkeydown()', maxlength: 30
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
    if (selectedLine.Visible == null) {
        selectedLine.Visible = true;
    } if (!selectedLine.Visible) {
        visOrHidContact(`visible_${count_members}`);
    }
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
    console.log(selectedLine);
    const tableInfo = [
        { id: 'client-group', count: 4, widthInput: [
                {id: 'item_product', width: 100, type: 'text'},
                {id: 'item_volume', width: 43, type: 'number'},
                {id: 'item_creator', width: 104, type: 'text'},
                {id: 'item_price', width: 43, type: 'number'}
            ],
            html: ['Name', 'Volume', 'Creator', 'Cost']
        },
        { id: 'provider-group', count: 6, widthInput: [
                {id: 'item_product', width: 100, type: 'text'},
                {id: 'item_price', width: 33, type: 'number'},
                {id: 'item_vat', width: 28, type: 'number'},
                {id: 'item_packing', width: 59, type: 'text'},
                {id: 'item_weight', width: 24, type: 'text'},
                {id: 'item_fraction', width: 57, type: 'text'}
            ],
            html: ['Name', 'Cost', 'NDS', 'Packing', 'Weight', 'Fraction']
        },
            { id: 'carrier-group', count: 5, widthInput: [
                    {id: 'carrier_date', width: 50, type: 'text'},
                    {id: 'carrier_client', width: 100, type: 'text'},
                    {id: 'carrier_stock', width: 160, type: 'text'},
                    {id: 'carrier_driver', width: 90, type: 'text'},
                    {id: 'carrier_price', width: 33, type: 'number'}
                ],
                html: []
        },
            { id: 'account-group', count: 3, widthInput: [
                    {id: 'account_position', width: 58, type: 'text'},
                    {id: 'account_date', width: 42, type: 'text'},
                    {id: 'account_price', width: 43, type: 'number'}
                ],
                html: []
        },
            { id: 'delivery-group', count: 2, widthInput: [
                    {id: 'delivery_date', width: 45, type: 'text'},
                    {id: 'delivery_price', width: 43, type: 'number'}
                ],
                html: []
        }
    ]

    function trFill(table) {
        let tr = $('<tr>');
        for (let i = 0; i < table.count; i++) {
            if (table.widthInput[i].id == 'item_product') {
                let count = 0;
                $('.hmax #group [name="items_list"]').each(function() {
                    count++;
                })
                tr.append($('<td>', {
                    append: $('<select>', {
                        css: { width: table.widthInput[i].width + 'px', padding: '0' },
                        id: 'item_product_' + count,
                        name: 'items_list',
                        append: getItemsList('item_product_' + count, selectedLine , id.split('-')[0])
                    })
                }));
            } else {
                tr.append($('<td>', {
                    append: $('<input>', {
                        css: { width: table.widthInput[i].width + 'px', padding: '0' },
                        id: table.widthInput[i].id, 
                        value: selectedLine[table.html[i]],
                        type: table.widthInput[i].type
                    })
                }));
            }
            
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
function getItemsList(id, selectedLine, category) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);     
            let options = '<option value="disabled" selected disabled>Выбрать</option>';
            let list_items = [];
            for (let i = 0; i < data.length; i++) 
                for (let j = 0; j < data[i].items.length; j++) 
                    list_items.push(data[i].items[j].Name);

            for (let i = 0; i < list_items.length - 1; i++) {
                for (let j = i + 1; j < list_items.length; j++) {
                    if (list_items[i] == list_items[j]) {
                        list_items.splice(j, 1);
                        j--;
                    }
                }
            }

            for (let i = 0; i < list_items.length; i++) 
                options += `<option value="${list_items[i]}">${list_items[i]}</option>`
            $(`#${id}`).empty();
            $(`#${id}`).append(options);
            if (!id.includes('item_product')) itemSelection(category, selectedLine);
            else {
                let count = 0;
                $('.hmax #group [name="items_list"]').each(function() {
                    if (selectedLine.Name == '') {
                        $(`#${id} option:contains('Выбрать')`).attr('selected', true)
                    } else {
                        $(`#${id} option`).each(function(i, element) {
                            if ($(element).html() == selectedLine.Name) {
                                $(element).attr('selected', true);
                            }
                        });
                        $(`#${id} :selected`).val($(`#${id} :selected`).html());       
                    }
                    count++;
                })
            };
        }
    });
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
        if (select.Demand_item == '') {
            $(`#demand_product option:contains('Выбрать')`).attr('selected', true)
        } else {
            $('#demand_product option').each(function(i, element) {
                if ($(element).html() == select.Demand_item) {
                    $(element).attr('selected', true);
                }
            });
            $(`#demand_product :selected`).val($(`#demand_product :selected`).html());       
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