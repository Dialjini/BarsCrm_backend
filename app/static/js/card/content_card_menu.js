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
let list_items_acc, list_stock_acc;
function checkStocks(element) {
    let idAccount = element.name.split('_')[1];
    let payment_history = [];

    for (let tr of $('#group tr')) {
        let date = $(tr)[0].children[0].children[0].value;
        let sum = $(tr)[0].children[1].children[0].value;
        payment_history.push({date: date, sum: sum})
    }

    if (payment_history.length == 0) {
        payment_history.push({date: '', sum: ''})
    }

    $.ajax({
        url: '/addAccountPaymentHistory',
        data: {account_id: +idAccount, account_payment_history: JSON.stringify(payment_history)},
        type: 'GET',
        dataType: 'html',
        success: function() {
            list_stock_acc = $('#stock_items_list').attr('data-stock').split(',');
            list_items_acc = $('#stock_items_list').attr('data-items').split(',');
            let sortItemsStock = [];

            let dataStock, dataItem;
            $.ajax({
                url: '/getStocks',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    dataStock = JSON.parse(result);
                }
            });

            $.ajax({
                url: '/getAllItems',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    dataItem = JSON.parse(result);
                }
            });

            for (let i = 0; i < dataStock.length; i++) {
                for (let j = 0; j < list_stock_acc.length; j++) {
                    if (list_stock_acc[j] == dataStock[i].id) {
                        sortItemsStock.push({ stock: dataStock[i].id, items: [] });
                    }
                }
            }
            for (let i = 0; i < sortItemsStock.length; i++) {
                for (let j = 0; j < dataItem.length; j++) {
                    if (sortItemsStock[i].stock == dataItem[j].Stock_id) {
                        sortItemsStock[i]['items'].push(dataItem[j].Item_id)
                    }
                }
            }

            function fillListStock() {
                let buttons = '';
                for (let i = 0; i < dataStock.length; i++) {
                    for (let j = 0; j < sortItemsStock.length; j++) {
                        if (dataStock[i].id == sortItemsStock[j].stock) {
                            buttons += `<button class="selectStock" name="${element.name}" id="${element.id}" onclick="arrangeDelivery(this)" data-items="${sortItemsStock[j].items}" data-stock="${dataStock[i].Name}">${dataStock[i].Name}</button>`
                            break;
                        }
                    }
                }
                return buttons;
            }

            if (list_stock_acc.length > 1) {
                $('.page').prepend($('<div>', { class: 'background' }));
                $('.page').prepend(
                    $('<div>', {
                        class: 'modal_select',
                        append: `
                            <div class="title">
                                <span>Выбор склада</span>
                                <img onclick="closeModal()" src="static/images/cancel.png">
                            </div>
                            <div class="content">
                                <div class="message">
                                    <p>В счёте присутствуют несколько складов. <br> Выберите склад, чтобы создать доставку товаров выбранного склада <br>
                                    (Доставка будет только на те товары, которые находятся в выбранном складе)</p>
                                </div>
                                <div class="list_stock">
                                    ${fillListStock()}
                                </div>
                            </div>
                        `
                    })
                );
            } else {
                for (let i = 0; i < dataStock.length; i++) {
                    for (let j = 0; j < list_stock_acc.length; j++) {
                        if (dataStock[i].id == list_stock_acc[j]) {
                            list_stock_acc[j] = dataStock[i].Name;
                        }
                    }
                }
                $(element).attr('data-stock', list_stock_acc);
                $(element).attr('data-items', list_items_acc);
                arrangeDelivery(element);
            }
        }
    })
}
function closeModal() {
    $('.background').remove();
    $('.modal_select').remove();
}
// Оформление доставки из карточки Счета
function arrangeDelivery(element) {
    list_stock_acc = $(element).attr('data-stock');
    list_items_acc = $(element).attr('data-items').split(',');
    closeModal();
    categoryInFinanceAccount[0].lastCard[0] = null;
    categoryInFinanceAccount[1].pop();
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
        }
    });            
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
// Контентная часть вкладки Оформление договора
function contractContentCard(elem) {
    function buttonsCategory() {
        if (elem.name.includes('client')) {
            return `
                <button class="btn" style="margin-right: 10px" id="${elem.id}" onclick="comeBack(this.id)">Назад</button> 
                <button class="btn btn-main" id="${elem.id}" onclick="invoiceCard(this)">Выставить счёт</button> 
            `
        } else if (elem.name.includes('carrier')) {
            let name = $(elem).attr('name').split('_');
            return `
                <button class="btn" style="margin-right: 10px" id="${elem.id}" onclick="comeBack(this.id)">Назад</button> 
                <button class="btn btn-main" name="${name[0]}_close_card_${name[1]}_contract" onclick="closeCardMenu(this.name)">Закрыть</button> 
            `
        }
    }
    return `
        <div class="row_card column">
            <table class="fit gray">
                <tr><td class="bold" style="padding-right: 10px;">Договор от</td><td>${getCurrentDate('currentYear')}</td></tr>
                <tr>
                    <td class="bold">Юр. лицо</td><td>
                        <select id="select_cusmoter">
                            <option selected value="ООО">ООО</option>
                            <option value="ИП">ИП</option>
                        </select>
                    </td>
                </tr>
            </table>
            <div class="list" id="list_contract">

                <div class="contract flex" name="${elem.name}" onclick="downloadDocument(this)">
                    <span>Новый договор</span>
                </div>

            </div>
        </div>
        <div class="next">
            ${buttonsCategory()}
        </div>
    `
}
function downloadDocument(elem) {
    let data = $(elem).attr('name').split('_');
    let select_cusmoter = $('#select_cusmoter').val()
    if (data[0] == 'client') {
        $.ajax({
            url: '/getClients',
            type: 'GET',
            dataType: 'html',
            success: function(data_client) {
                data_client = JSON.parse(data_client);
                for (let i = 0; i < data_client.length; i++) {
                    if (data_client[i].id == data[1]) {
                        let document_name;
                        if (select_cusmoter == 'ООО') {
                            document_name = 'Dogovor_na_tovari_ooo';
                        } else {
                            document_name = 'Dogovor_na_tovari_ip';
                        }
                        const link = document.createElement('a');
                        link.href = `http://127.0.0.1:5000/downloadDoc?category=${data[0]}&name=${document_name}&card_id=${data[1]}&address=${data_client[i].Adress}&delivery=no`;
                        if (select_cusmoter == 'ООО') {
                            link.download = 'Договор поставки ООО';
                        } else {
                            link.download = 'Договор поставки ИП';
                        }
                        link.click();
                    }
                }
            }
        }); 
    } else if (data[0] == 'carrier') {
        $.ajax({
            url: '/getCarriers',
            type: 'GET',
            dataType: 'html',
            success: function(data_carrier) {
                data_carrier = JSON.parse(data_carrier);
                for (let i = 0; i < data_carrier.length; i++) {
                    if (data_carrier[i].id == data[1]) {
                        let document_name;
                        if (select_cusmoter == 'ООО') {
                            document_name = 'DogovorNaDostavkuOOO';
                        } else {
                            document_name = 'DogovorNaDostavkuIP';
                        }
                        const link = document.createElement('a');
                        link.href = `http://127.0.0.1:5000/downloadDoc?category=${data[0]}&name=${document_name}&card_id=${data[1]}&address=${data_carrier[i].Address}&delivery=no`;
                        if (select_cusmoter == 'ООО') {
                            link.download = 'Договор на доставку ООО';
                        } else {
                            link.download = 'Договор на доставку ИП';
                        }
                        link.click();
                    }
                }
            }
        }); 
    }    
}
// Контентная часть вкладки Выставления счета
function invoicingContentCard(elem, data) {
    function getFilterList() {
        let tbody = $('<tbody>', {id: 'filter_list'});
        for (let i = 0; i < data.length; i++) {
            if (data[i].stock_address !== null) {
                for (let j = 0; j < data[i].items.length; j++) {
                    let tr = $('<tr>', { onclick: 'invoiceInTable(this)', id: `invoice_${data[i].items[j].Item_id}`});
                    const name = [data[i].items[j].Group_name, data[i].items[j].Name, data[i].items[j].Prefix, data[i].items[j].Volume, data[i].items[j].Packing, data[i].items[j].NDS, data[i].items[j].Cost, data[i].stock_address];
                    for (let k = 0; k < name.length; k++) {
                        tr.append($('<td>', {
                            html: name[k]
                        }))
                    }
                    tbody.append(tr);
                }
            }
        }
        return tbody;
    }
    // Вывод заголовка основной таблицы
    function getTitleTable() {
        return `<tr>
                    <th width="15" rowspan="2"></th>
                    <th width="150" rowspan="2">Товар</th>
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
                </tr>`
    }
    // Вывод контента основной таблицы
    function getRowsTable(info = '') {
        let tbody = $('<tbody>', { id: 'exposed_list' });
        for (let i = 0; i < 5; i++) {
            let tr = $('<tr>', {class: 'product', id: 'empty'});
            for (let j = 0; j < 12; j++) {
                tr.append($('<td>', {
                    html: info
                }))
            }
            tbody.append(tr);
        }

        const string = ['НДС', 'Без НДС', 'Общая'];
        const stringID = ['vat', 'without-vat', 'total'];

        for (let i = 0; i < 3; i++) {
            tbody = tbody.add($('<tr>', {
                prepend: $('<td>', { colspan: 10, css: {'border': 'none'} }),
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
                            <input type="number" onkeyup="all_costs()"  id="total_costs_inv" class="total_count red bold mrl">
                            <div name="unlock" class="lock_input" id="mode_costs" onclick="switchMode(this)"></div>
                        </div> 
                        <div class="costs_element">
                            <span>Скидка</span> 
                            <input type="number" onkeyup="calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_discount_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="number" onkeyup="calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_privet_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="number" onkeyup="calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_delivery_inv" class="total_count bold mrl">
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
                onclick: 'comeBack(this.id)',
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
            
            let tr = $('<tr>', { class: 'product invoiled', id: `invoiled_${element.id.split('_')[1]}_product` });
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].items.length; j++) {
                    let account = data[i].items[j];
                    if (account.Prefix == prefixAccount) {
                        if (account.Item_id == element.id.split('_')[1]) {
                            tr.append($('<td>', { id: `invoiled_${element.id.split('_')[1]}`, onclick: 'returnBack(this)', append:
                            $('<img>', { src: '../static/images/returnBack.png', width: 12 })
                        }))
                            let idProduct = element.id.split('_')[1];
                            let list = [
                                {id: ``, html: account.Name}, {id: ``, html: account.Packing},
                                {id: `product_weight_${idProduct}`, html: account.Weight},
                                {id: `product_containers_${idProduct}`, html: ''},
                                {id: `invoiled_volume_${idProduct}`, html: ''},
                                {id: `product_cost_${idProduct}`, html: account.Cost},
                                {id: `calcSale_${idProduct}`, html: ''}, {id: `calcPrivet_${idProduct}`, html: ''},
                                {id: `calcDelivery_${idProduct}`, html: ''}, {id: `product_unit_${idProduct}`, html: ''}, {id: `calcSum_${idProduct}`, html: ''},
                            ]
                            for (let k = 0; k < list.length; k++) {
                                if (list[k].id.includes('invoiled_volume')) {
                                    tr.append($('<td>', {
                                        append: $('<input>', {
                                            type: 'number', onkeyup: 'tarCalculation(this.id)', id: list[k].id, max: account.Volume
                                        })
                                    }))
                                } else if (list[k].id.includes('calcSale')) {
                                    tr.append($('<td>', {
                                        append: $('<input>', {
                                            type: 'number', id: list[k].id,
                                            onkeyup: 'recountPrice(this.id)'
                                        })
                                    }))
                                } else {
                                    tr.append($('<td>', { id: list[k].id, html: list[k].html }));
                                }
                            }
                            $(`#${element.id}`).remove();
                            $(`#empty`).last().remove();
                            $('#exposed_list').prepend(tr);

                            let sum = 0;
                            $('#exposed_list .invoiled #amount_product').each(function(i, element) {
                                sum += +$(element).html()
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
            }
            calculationIndicators();
        },
    });
}
function dataСalculation(element) {
    for (let i = 0; i < list_inv.length; i++) {
        if (list_inv[i].id == element.id) {
            list_inv[i].value = $(element).val();
        }
    }
    let total = $('#total_costs_inv').val();
    let sale = Math.abs($('#total_discount_inv').val());
    let privet = $('#total_privet_inv').val();
    let delivery = $('#total_delivery_inv').val();
    let sum = +sale + +privet + +delivery;
    $('#total_costs_inv').val(sum);

    let total_costs = $('#total_costs_inv').val();

    let count = 0;
    for (let element of $('#exposed_list .invoiled')) {
        count++;
    }
    for (let element of $('#exposed_list .invoiled')) {
        $(element).children()[11].innerHTML = (+$(element).children()[5].children[0].value * +$(element).children()[6].innerHTML) + Math.ceil(total_costs / count);
    }
    calculationIndicators();
}
let currentVatValue = 0;
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
                        let totalSale = Math.abs((+$('#total_discount_inv').val() / $(`#invoiled_volume_${data[j].items[k].Item_id}`).val() / count).toFixed(2));
                        let totalPrivet = (+$('#total_privet_inv').val() / $(`#invoiled_volume_${data[j].items[k].Item_id}`).val() / count).toFixed(2);
                        let totalDelivery = (+$('#total_delivery_inv').val() / $(`#invoiled_volume_${data[j].items[k].Item_id}`).val() / count).toFixed(2);

                        $(`#calcSale_${data[j].items[k].Item_id}`).val(isNaN(totalSale) || totalSale == Infinity || totalSale == -Infinity ? '' : -totalSale);
                        $(`#calcPrivet_${data[j].items[k].Item_id}`).html(isNaN(totalPrivet) || totalPrivet == Infinity || totalPrivet == -Infinity ? '' : totalPrivet);
                        $(`#calcDelivery_${data[j].items[k].Item_id}`).html(isNaN(totalDelivery) || totalDelivery == Infinity || totalDelivery == -Infinity ? '' : totalDelivery);
                        let total = (+$(`#calcDelivery_${data[j].items[k].Item_id}`).html() + +$(`#calcPrivet_${data[j].items[k].Item_id}`).html() + +$(`#calcSale_${data[j].items[k].Item_id}`).val()) * +$(`#invoiled_volume_${data[j].items[k].Item_id}`).val();
                        let amount = Math.round(+$(`#product_cost_${data[j].items[k].Item_id}`).html() * +$(`#invoiled_volume_${data[j].items[k].Item_id}`).val()).toFixed(2);
                        $(`#calcSum_${data[j].items[k].Item_id}`).html(+amount + total);

                        let sum = 0;
                        for (let element of $('#exposed_list .invoiled')) {
                            sum += +$(element).children()[11].innerHTML;
                        }
                        data[j].items[k].NDS = data[j].items[k].NDS[0] + data[j].items[k].NDS[1];
                        let vat = sum > 0 ? sum - ((sum * +data[j].items[k].NDS) / 100) : 0;
                        currentVatValue = +data[j].items[k].NDS;
                        $('#total').html(Math.round(sum));
                        $('#vat').html(Math.round(sum - vat));
                        $('#without-vat').html(Math.round(vat));
                    }
                });
            }
        }
    }
}
function tarCalculation(id) {
    let idElement = id.split('_')[2];
    let volume = +$(`#${id}`).val();
    let weight = +$(`#product_weight_${idElement}`).html();
    let unit = Math.round(+$(`#product_cost_${idElement}`).html() / volume).toFixed(2);

    $(`#product_containers_${idElement}`).html(Math.floor(volume / weight));
    $(`#product_unit_${idElement}`).html(unit == Infinity || isNaN(unit) ? '0' : unit);
    calculationIndicators();
}
function recountPrice(id) {
    let idProduct = id.split('_')[1];
    let product = $(`#exposed_list #invoiled_${idProduct}_product`);

    product.children().last().html(
        (+product.children()[5].children[0].value * +product.children()[6].innerHTML)
        + (+product.children()[7].children[0].value * +product.children()[5].children[0].value + +product.children()[8].innerHTML * +product.children()[5].children[0].value + +product.children()[9].innerHTML * +product.children()[5].children[0].value)
    );
    
    let sum = 0;
    $('#exposed_list .invoiled').each(function(i, element) {
        sum += +$(element).children()[11].innerHTML;
    });
    
    $('#total').html(Math.round(sum));
    let vat = sum > 0 ? sum - ((sum * currentVatValue) / 100) : 0;
    $('#total').html(Math.round(sum));
    $('#vat').html(Math.round(sum - vat));
    $('#without-vat').html(Math.round(vat));
}
function all_costs() {
    let amount = 3, disableValue = 0;
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
    for (let element of $('#exposed_list .invoiled')) {
        $(element).children()[11].innerHTML = (+$(element).children()[5].children[0].value * +$(element).children()[6].innerHTML)
        + (+$(element).children()[7].children[0].value * +$(element).children()[5].children[0].value + +$(element).children()[8].innerHTML * +$(element).children()[5].children[0].value + +$(element).children()[9].innerHTML * +$(element).children()[5].children[0].value);
    }
    calculationIndicators();
}
function returnBack(element) {
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data);
            $(`#${element.id}_product`).remove();
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

                        let sum = 0;
                        $('#exposed_list .invoiled').each(function(i, element) {
                            sum += +$(element).children()[11].innerHTML;
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
            $('#filter_list').append(tr);

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
                list_role.push({ role: $(element).children()[0].children[0].children[0].value, surname: $(element).children()[0].children[1].children[0].value })
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
        $('#comment_date').datepicker({minDate: new Date(), position: 'right bottom', autoClose: true})
        $('#add_new_comment').attr('onclick', 'getCommentsInfo.getRequest(this.name)')
        function getRoleList() {
            let list = '';
            for (let i = 0; i < list_role.length - 1; i++) {
                for (let j = i + 1; j < list_role.length; j++) {
                    if (list_role[i].role === list_role[j].role && list_role[i].surname == list_role[j].surname) {
                        list_role.splice(j, 1);
                        j--;
                    }
                }
            }
            for (let i = 0; i < list_role.length; i++) {
                list = list.concat(`<option value="${list_role[i].role} | ${list_role[i].surname}">${list_role[i].role} | ${list_role[i].surname}</option>`)
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
    function fillListRole() {
        let options = `<option disabled selected value="Не выбрана">Должность</option>`;
        let roles = ['Собственник', 'Директор', 'Генеральный директор', 'Заместитель директора', 'Председатель', 'Главный бухгалтер',
                     'Бухгалтер', 'Снабжение', 'Зоотехник', 'Агроном', 'Секретарь', 'Логист', 'Зав. гаражом', 'Водитель'];
        for (let i = 0; i < roles.length; i++) {
            if (selectedLine.Position == roles[i]) {
                options += `<option selected value="${roles[i]}">${roles[i]}</option>`
            } else {
                options += `<option value="${roles[i]}">${roles[i]}</option>`
            }
        }
        return options;
    }
    $('#member').append($('<div>', {
        class: `member ${category.member}`,
        id: `member_${count_members}`,
        append: $('<div>', {
            class: 'm_info',
            append: $('<div>', {
                class: 'top',
                append: $('<select>', {
                    append: fillListRole()
                }).add('<input>',    { placeholder: category.placeholder, class: category.class, id: category.class, onchange: 'saveCard()', value: selectedLine.Number })
            }).add($('<div>', {
                class: 'bottom',
                append: $('<input>', { placeholder: 'Фамилия', class: 'last_name', id: 'last_name', onchange: 'saveCard()', value: selectedLine.Last_name, type: 'text'
                }).add('<input>',    { placeholder: 'Имя Отчество', class: 'first_name', id: 'first_name', onchange: 'saveCard()', value: selectedLine.Name, type: 'name'
                }).add('<input>',    { placeholder: 'Почта', class: 'email', id: 'email', onchange: 'saveCard()', onblur: 'checkEmail()', value: selectedLine.Email, type: 'email'
                })
            }))
        }).add($('<div>', { class: 'visible', id: `visible_${count_members}`, onclick: 'visOrHidContact(this.id)', append:
        $('<img>', { src: '../static/images/visible.png'})
    }))
    }));
    if (selectedLine.Visible == null) {
        selectedLine.Visible = true;
    } if (!selectedLine.Visible) {
        visOrHidContact(`visible_${count_members}`);
    }
    for (let element of $('#member .member #phone')) {
        $(element).mask('89999999999');
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
        $(`#member_${id[1]} #car`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #last_name`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #first_name`).attr('disabled', 'disabled')
        $(`#member_${id[1]} #email`).attr('disabled', 'disabled')
        $(`#hidden_${id[1]}`).empty();
        $(`#hidden_${id[1]}`).append($('<img>', { src: '../static/images/hidden.png' }));

        let save = $(`#member_${id[1]}`).remove();
        $('#member').append(save);
    } else {
        $(`#${idElem}`).attr('id', `visible_${id[1]}`);
        $(`#member_${id[1]}`).removeClass('hidden');

        $(`#member_${id[1]} #role`).removeAttr('disabled')
        $(`#member_${id[1]} #car`).removeAttr('disabled')
        $(`#member_${id[1]} #phone`).removeAttr('disabled')
        $(`#member_${id[1]} #last_name`).removeAttr('disabled')
        $(`#member_${id[1]} #first_name`).removeAttr('disabled')
        $(`#member_${id[1]} #email`).removeAttr('disabled')
        $(`#visible_${id[1]}`).empty();
        $(`#visible_${id[1]}`).append($('<img>', { src: '../static/images/visible.png' }));

        let save = $(`#member_${id[1]}`).remove();
        $('#member').prepend(save);
    }
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
        { id: 'client-group', tbody: 'group', count: 4, widthInput: [
                {id: 'item_product', width: 100, type: 'text'},
                {id: 'item_volume', width: 60, type: 'number'},
                {id: 'item_creator', width: 180, type: 'text'},
                {id: 'item_price', width: 65, type: 'number'}
            ],
            html: ['Name', 'Volume', 'Creator', 'Cost']
        },
        { id: 'provider-group', tbody: 'group', count: 7, widthInput: [
                {id: 'item_product', width: 100, type: 'text'},
                {id: 'item_price', width: 65, type: 'number'},
                {id: 'item_date', width: 60, type: 'text'},
                {id: 'item_vat', width: 28, type: 'number'},
                {id: 'item_packing', width: 60, type: 'text'},
                {id: 'item_weight', width: 30, type: 'text'},
                {id: 'item_fraction', width: 60, type: 'text'}
            ],
            html: ['Name', 'Cost', 'Date', 'NDS', 'Packing', 'Weight', 'Fraction']
        }, { id: 'carrier-group', tbody: 'group', count: 5, widthInput: [
                    {id: 'carrier_date', width: 50, type: 'text'},
                    {id: 'carrier_client', width: 100, type: 'text'},
                    {id: 'carrier_stock', width: 160, type: 'text'},
                    {id: 'carrier_driver', width: 90, type: 'text'},
                    {id: 'carrier_price', width: 65, type: 'number'}
                ],
                html: []
        }, { id: 'account-group', tbody: 'group', count: 2, widthInput: [
                    {id: 'account_date', width: 70, type: 'text'},
                    {id: 'account_price', width: 65, type: 'number'}
                ],
                html: ['date', 'sum']
        }, { id: 'delivery-group', tbody: 'group', count: 2, widthInput: [
                    {id: 'delivery_date', width: 60, type: 'text'},
                    {id: 'delivery_price', width: 65, type: 'number'}
                ],
                html: ['date', 'price']
        }, { id: 'flight-group', tbody: 'flight', count: 6, widthInput: [
                    {id: 'delivery_flight_product', width: 100, type: 'text'},
                    {id: 'delivery_flight_stock', width: 160, type: 'text'},
                    {id: 'delivery_flight_weight', width: 30, type: 'number'},
                    {id: 'delivery_flight_type', width: 160, type: 'text'},
                    {id: 'delivery_flight_sum', width: 70, type: 'number'}
                ],
                html: []
        }
    ]

    function trFill(table) {
        let tr = $('<tr>');

        function getListCompetitor(id) {
            $.ajax({
                url: '/getClients',
                type: 'GET',
                dataType: 'html',
                success: function(data) {
                    data = JSON.parse(data);
                    let competitors = [];
                    let options = '';
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].Category == 'Конкурент') {
                            let name = data[i].Name
                            competitors.push(name);
                        }
                    }
                    options += `<option disabled selected>Не выбран</option>`
                    for (let i = 0; i < competitors.length; i++) {
                        options += `<option value='${competitors[i]}'>${competitors[i]}</option>`
                    }
                    if (competitors.length == 0) {
                        options = `<option disabled selected>Конкурентов нет</option>`
                    }
                    $(`#${id}`).empty();
                    $(`#${id}`).append(options);
                    let count = 0;
                    $('.hmax #group [name="items_creator"]').each(function() {
                        if (selectedLine.Creator == '') {
                            $(`#${id} option:contains('Выбрать')`).attr('selected', true)
                        } else {
                            $(`#${id} option`).each(function(i, element) {
                                if ($(element).html() == selectedLine.Creator) {
                                    $(element).attr('selected', true);
                                }
                            });
                            $(`#${id} :selected`).val($(`#${id} :selected`).html());       
                        }
                        count++;
                    })
                }
            });
        }

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
            } else if (table.widthInput[i].id == 'item_creator') {
                let count = 0;
                $('.hmax #group [name="items_creator"]').each(function() {
                    count++;
                })
                tr.append($('<td>', {
                    append: $('<select>', {
                        css: { width: table.widthInput[i].width + 'px', padding: '0' },
                        id: 'item_creator_' + count,
                        name: 'items_creator',
                        append: getListCompetitor('item_creator_' + count)
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
            $(`#${tableInfo[i].tbody}`).append(trFill(tableInfo[i]));
            $(`[name="remove_last_group"]`).fadeIn(0);
            if (id === 'provider-group') {
                $('#group #item_date').last().datepicker({minDate: new Date(), position: 'right bottom', autoClose: true})
            }
            if (id === 'delivery-group') {
                $('#delivery_start_date').datepicker({minDate: new Date(), position: 'right top', autoClose: true})
                $('#delivery_end_date').datepicker({minDate: new Date(), position: 'right top', autoClose: true})
                $('#group #delivery_date').last().datepicker({minDate: new Date(), position: 'right bottom', autoClose: true})
            }
            if (id === 'account-group') {
                $('#account_date').datepicker({minDate: new Date(), position: 'right bottom', autoClose: true})
            }
        }
    }

    if ($(`#group`).children().length <= 1) {
        $(`[name="remove_last_group"]`).fadeOut(0);
    }
    saveCard();
}
function getItemsList(id, selectedLine, category) {
    $.ajax({
        url: '/getAllItems',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);     
            let options = '<option value="disabled" selected disabled>Выбрать</option>';
            let list_items = [];
            let list_ids = [];
            for (let i = 0; i < data.length; i++) {
                list_items.push(data[i].Name);
            }
                 
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
// Закрепление менеджера за карточкой
function selectManagerInCard(element) {
    let idManager = element.id;
    let idCard = $(element).attr('card');

    closeCardMenu(idCard);
    idCard = idCard.split('_');

    $.ajax({
        url: '/addManagerToCard',
        type: 'GET',
        data: {category: idCard[0], card_id: +idCard[1], manager_id: idManager},
        dataType: 'html',
        success: function() {}
    });
} 
// Открепление карточки от менеджера
function unfastenCard() {
    $('.drop_menu').fadeIn(200);
}
function detachmentCard(element) {
    let idName = element.id.split('_');
    // Добавить карточку в список Карточки клиентов
    closeCardMenu(element.id);
    $.ajax({
        url: '/deleteManagerFromCard',
        type: 'GET',
        data: {category: idName[0], card_id: idName[1], date: getCurrentDate('year')},
        dataType: 'html',
        success: function() {}
    });

    $('#empty_customer_cards').append($('<div>', {
        class: 'fieldInfo padd',
        id: `${idName[0]}_${idName[1]}`,
        onclick: 'createCardMenu(this)',
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
    if ($('#card_menu').html() != undefined) {
        saveTableAndCard[0].lastCard[0] = $('#card_menu');
    }
}