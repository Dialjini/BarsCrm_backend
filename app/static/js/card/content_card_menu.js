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
                prepend: $('<td>', { colspan: 10 }),
                append: $('<td>', {
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
                            <input type="number" id="total_costs_inv" class="total_count red bold mrl" value="15000">
                            <div class="lock_input" id="mode_costs" onclick="switchMode(this)"></div>
                        </div> 
                        <div class="costs_element">
                            <span>Скидка</span> 
                            <input type="number" id="total_discount_inv" class="total_count bold mrl" value="5000">
                            <div class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="number" id="total_privet_inv" class="total_count bold mrl" value="5000">
                            <div class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="number" id="total_delivery_inv" class="total_count bold mrl" value="5000">
                            <div class="lock_input" id="mode_delivery" onclick="switchMode(this)"></div>
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
// Добавление контакта в карточках, мб переделать в одну функцию
function addMember() {
    $('#members').append($('<div>', {
        class: 'member',
        append: $('<div>', {
            class: 'top',
            append: $('<input>', {class: 'role', id: 'role'
            }).add('<input>',    {class: 'phone', id: 'phone'
            })
        }).add($('<div>', {
            class: 'bottom',
            append: $('<input>', {class: 'surname', id: 'surname'
            }).add('<input>',    {class: 'fullname', id: 'fullname'
            }).add('<input>',    {class: 'email', id: 'email'
            })
        }))
    }));
    $('#remove_last_member').fadeIn(100);
    saveCard();
}
// Удаление последнего контакта в карточках
function removeMember() {
    $('#members').children().last().remove();
    if ($('#members').html().trim() === '') {
        $('#remove_last_member').fadeOut(0);
    }
}
// Добавление контакта в карточках Поставщик
function addMemberDelivery() {
    $('#members').append($('<div>', {
        class: 'member delivery',
        append: $('<div>', {
            class: 'top',
            append: $('<div>', {class: 'role', id: 'role', html: 'Водитель'
            }).add('<input>',    {class: 'car', id: 'car'
            })
        }).add($('<div>', {
            class: 'bottom',
            append: $('<input>', {class: 'surname', id: 'surname'
            }).add('<input>',    {class: 'fullname', id: 'fullname'
            }).add('<input>',    {class: 'email', id: 'email'
            })
        }))
    }))
    saveCard();
}
// Добавление строк в таблицах карточек
function addRow(element) {
    const tableInfo = [
        { id: 'client-table', count: 4, widthInput: [57, 43, 104, 43] },
        { id: 'provider-table', count: 6, widthInput: [57, 33, 28, 59, 24, 57] },
        { id: 'carrier-table', count: 5, widthInput: [50, 100, 160, 90, 33] },
        { id: 'account-table', count: 3, widthInput: [58, 42, 43] },
        { id: 'delivery-table', count: 2, widthInput: [45, 43] },
    ]

    function trFill(table) {
        let tr = $('<tr>');
        for (let i = 0; i < table.count; i++) {
            tr.append($('<td>', {
                append: $('<input>', {
                    css: { width: table.widthInput[i] + 'px', padding: '0' },
                })
            }));
        }
        return tr;
    }

    for (let i = 0; i < tableInfo.length; i++) {
        if (element.id == tableInfo[i].id) {
            $('#group').append(trFill(tableInfo[i]));
        }
    }
    $('#remove_last_row').fadeIn(100);
    saveCard();
}
// Удаление последней строки в таблицах карточек
function removeRow() {
    $('#group').children().last().remove();
    if ($('#group').html().trim() === '') {
        $('#remove_last_row').fadeOut(0);
    }
}
// Открепление карточки от менеджера
function unfastenCard(element) {
    $('.drop_menu').fadeIn(200);
    $('.drop_menu').click(function() {
        let idName = element.id.replace(/remove-/g, '');
        // Добавить карточку в список Карточки клиентов
        let nameOrganization = selectedLine.Name;
        closeCardMenu();


        $('#empty_customer_cards').append($('<div>', {
            class: 'fieldInfo padd',
            id: `detached_card_${idName.split('-')[1]}`, // Number
            append: $('<div>', { class: 'name', html: nameOrganization })
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
        // Делать запрос на удаление карточки из общей таблицы
    })
    // Делать запрос на сохранение открепленной карточки 
}
// Сохранение изменений в карточке
function saveCard() {
    // Айди полей карточки
    const idCardFields = [
        {   
            name: 'client', ids:
            ['client_organization_name', 'client_area', 'client_region', 'client_address', 'client_inn',
            'client_tag', 'client_category', 'client_station', 'client_price', 'client_distance', 'client_industry']
        },
        {   
            name: 'provider', ids:
            ['provider_organization_name', 'provider_area', 'provider_region', 'provider_address', 'provider_inn',
            'provider_tag', 'provider_category', 'provider_station', 'provider_price', 'provider_distance', 'provider_volume', 'provider_vat', 'provider_merc']
        },
        {   
            name: 'carrier', ids:
            ['carrier_organization_name', 'carrier_area', 'carrier_region', 'carrier_address', 'carrier_inn', 'carrier_capacity', 'carrier_view']
        },
        {   
            name: 'delivery', ids:
            ['delivery_customer', 'delivery_shipment', 'delivery_unloading', 'delivery_way', 'delivery_carrier', 'delivery_driver',
            'delivery_view', 'delivery_comment', 'delivery_client', 'delivery_contact']
        },
    ]
    saveTableAndCard[0].lastCard[0] = $('#card_menu');
}