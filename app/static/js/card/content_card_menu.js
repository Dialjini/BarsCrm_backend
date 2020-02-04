let list_items_acc, list_stock_acc;
function editAccount(elem) {
    let idAccount = elem.name.split('_')[1];
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            let name, date;
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

            for (let i = 0; i < categoryInFinanceAccount[1][1].length; i++) {
                if (categoryInFinanceAccount[1][1][i].account.id == idAccount) {
                    name = categoryInFinanceAccount[1][1][i].account.Name;
                    date = categoryInFinanceAccount[1][1][i].account.Date;
                    shipment = categoryInFinanceAccount[1][1][i].account.Shipment;
                }
            }

            if (shipment === 'true') {
                return $('.page').append($('<div>', { class: 'background' }).add(`
                                <div class="modal_select">
                                    <div class="title">
                                        <span>Ошибка</span>
                                        <img onclick="closeModal()" src="static/images/cancel.png">
                                    </div>
                                    <div class="content">
                                        <div class="message">
                                            <p style="font-size: 14px; color: #595959;">Товар(/ы) этого счета уже полностью отгружен(/ы)</p>
                                        </div>
                                    </div>
                                </div>
                            `));
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

                let sum = $('#total').html();

                $.ajax({
                    url: '/getThisUser',
                    type: 'GET',
                    dataType: 'html',
                    success: function(user) {
                        let this_user = JSON.parse(user);
                        $.ajax({
                            url: '/editAccount',
                            type: 'GET',
                            data: {account_id: +idAccount, status: String($('#account_status').prop('checked')),
                                manager_id: this_user.id, name: name, date: date,
                                hello: JSON.stringify(privet), sale: JSON.stringify(sale), shipping: JSON.stringify(delivery),
                                items_amount: JSON.stringify(items_amount), sum: sum, item_ids: JSON.stringify(idsItems),
                                total_costs: $('#total_costs_inv').val(), sale_costs: $('#total_discount_inv').val(),
                                hello_costs: $('#total_privet_inv').val(), delivery_costs: $('#total_delivery_inv').val(),
                                shipment: shipment},
                            dataType: 'html',
                            success: function() {
                                checkStocks(elem);
                            }
                        })
                    }
                })
            } else if (idsItems.length == 0) {
                alert('Невозможно отредактировать счет, ни один товара нет в счете!');
                return;
            }
        }
    })
}
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
function fillVolume(element) { 
    // Делать проверку на объем, если больше, чем есть = ошибка
    let value = $(element).val();
    $('#volume_goods').html(returnSpaces(deleteSpaces(value)));
}
// Контентная часть вкладки Оформление договора
function contractContentCard(elem) {
    function buttonsCategory() {
        let name = $(elem).attr('name').split('_');

        if (elem.name.includes('client')) {
            return `
                <button class="btn" style="margin-right: 10px" id="${elem.id}" onclick="comeBack(this.id)">Назад</button> 
                <button class="btn btn-main" name="${name[0]}_${name[1]}" id="${elem.id}" onclick="invoiceCard(this)">Вперёд</button> 
            `
        } else if (elem.name.includes('carrier')) {
            return `
                <button class="btn" style="margin-right: 10px" id="${elem.id}" onclick="comeBack(this.id)">Назад</button> 
                <button class="btn btn-main" name="${name[0]}_close_card_${name[1]}_contract" onclick="closeCardMenu(this.name)">Закрыть</button> 
            `
        }
    }
    function listDocuments() {
        let documents = '';
        let old_docs;
        $.ajax({
            url: '/getDocs',
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function(data) {
                old_docs = JSON.parse(data);
            }
        });
        let names = [
            {category: 'client', name: 'Договор поставки от'},
            {category: 'carrier', name: 'Договор об оказании услуг перевозки грузов от'}
        ]
        if (elem.name.includes('new')) {
            elem.name = elem.name.replace(/new/g, saveTableAndCard[1][1].length + 1)
        }
        for (let i = 0; i < old_docs.length; i++) {
            for (let j = 0; j < names.length; j++) {
                if (old_docs[i].Owner_type == elem.id && elem.id == names[j].category && old_docs[i].Owner_id == elem.name.split('_')[1]) {
                    documents += `
                    <div class="contract flex" name="${names[j].name} ${old_docs[i].Prefix}" id="${old_docs[i].id}" onclick="downloadOldDocument(this)">
                        <div class="format">DOCX</div>
                        <div class="date_number">
                            <div class="top">${old_docs[i].Creation_date}</div>
                            <div class="bottom">№ ${old_docs[i].MonthNum}/${old_docs[i].Date}</div>
                        </div>
                        <span>${names[j].name} ${old_docs[i].Prefix}</span>
                    </div>
                    `
                }
            }
        }
        return documents;
    }

    function tableAccount() {
        if (elem.name.includes('client')) {
            let accounts, managers, all_items;
            $.ajax({
                url: '/getAccounts',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    accounts = JSON.parse(data);
                }
            });
            $.ajax({
                url: '/getUsers',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    managers = JSON.parse(result);
                }
            });
            $.ajax({
                url: '/getAllItems',
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(result) {
                    all_items = JSON.parse(result);
                }
            });
            let table = `
                <table class="new_table">
                    ${fillTable()}
                </table>
            `;

            function fillTable() {
                let tbody = `
                        <tr>
                            <th>Юр. лицо</th>
                            <th>Дата выставления</th>
                            <th>Товары</th>
                            <th>Цена, руб.</th>
                            <th>Сумма, руб.</th>
                            <th>Статус</th>
                            <th>Приветы</th>
                            <th>Менеджер</th>
                        </tr>`;
                let client_id = elem.name.split('_')[1];
                for (let i = 0; i < accounts.length; i++) {
                    for (let j = 0; j < saveTableAndCard[1][1].length; j++) {
                        if (saveTableAndCard[1][1][j].Name === accounts[i].account.Name && client_id == saveTableAndCard[1][1][j].id) {
                            let tr = '';
                            let account_data = accounts[i].account;

                            if (account_data.Payment_history != undefined) {
                                let payment_list = JSON.parse(account_data.Payment_history);
                                let amount = deleteSpaces(account_data.Sum);
                                let payment_amount = 0;

                                for (let i = 0; i < payment_list.length; i++) {
                                    payment_amount += +deleteSpaces(payment_list[i].sum)
                                }

                                if (+deleteSpaces(amount) <= +deleteSpaces(payment_amount)) status = '<span class="green">Оплачено</span>'
                                else status = '<span class="red">Не оплачено</span>'
                            } else {
                                status = '<span class="red">Не оплачено</span>';
                            }
                            let managerSecondName;
                            for (let j = 0; j < managers.length; j++) {
                                if (+managers[j].id == +account_data.Manager_id) {
                                    managerSecondName = managers[j].second_name == null ? 'Фамилия не указана' : managers[j].second_name;
                                    break;
                                } else {
                                    managerSecondName = 'Не выбран';
                                }
                            }

                            let hello_sum = 0;
                            let hello_list = JSON.parse(account_data.Hello);
                            for (let g = 0; g < hello_list.length; g++) {
                                hello_sum += +deleteSpaces(hello_list[g]);
                            }

                            let items = JSON.parse(account_data.Items_amount);
                            let items_name = [];
                            for (let g = 0; g < items.length; g++) {
                                for (t = 0; t < all_items.length; t++) {
                                    if (items[g].id === all_items[t].Item_id) {
                                        items_name.push(all_items[t].Name)
                                    }
                                }
                            }
                            tr += `
                            <tbody>
                                <tr>
                                    <td rowspan="${items.length}">${accounts[i].items[0].Prefix}</td>
                                    <td rowspan="${items.length}">${account_data.Date}</td>
                                    <td>${items_name[0]}</td>
                                    <td>${returnSpaces(items[0].amount)}</td>
                                    <td rowspan="${items.length}">${returnSpaces(account_data.Sum)}</td>
                                    <td rowspan="${items.length}">${status}</td>
                                    <td rowspan="${items.length}">${returnSpaces(+hello_sum.toFixed(2))}</td>
                                    <td rowspan="${items.length}">${managerSecondName}</td>
                                </tr>
                            `

                            for (let k = 1; k < items.length; k++) {
                                tr += `
                                    <tr>
                                        <td>${items_name[k]}</td>
                                        <td>${returnSpaces(items[k].amount)}</td>
                                    </tr>`
                            }
                            tbody += tr + '</tbody>';
                        }
                    }
                }
                return tbody;
            }
            return table;
        } else {
            return '';
        }
    }
    return `
        <div class="row_card column">
            <div class="row_card" style="justify-content: flex-start">
                <table class="fit gray">
                    <tr><td class="bold" style="padding-right: 10px;">Договор от</td><td>${getCurrentDateNotComparison('currentYear')}</td></tr>
                    <tr>
                        <td class="bold">Юр. лицо</td><td>
                            <select id="select_cusmoter">
                                <option selected value="ООО">ООО</option>
                                <option value="ИП">ИП</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div class="new_contract flex" name="${elem.name}" onclick="downloadDocument(this)">
                    <img style="width: 15px;" src="static/images/plus.svg">
                </div>
            </div>
            <div class="list" id="list_contract">
                ${listDocuments()}
            </div>
        </div>
        <div class="row_card">
            ${tableAccount()}
        </div>
        <div class="next">
            ${buttonsCategory()}
        </div>`
}
function downloadOldDocument(elem) {
    const link = document.createElement('a');
    link.href = `/downloadOldDoc?id=${elem.id}`;
    link.download = $(elem).attr('name') + '.docx';
    link.click();
}
// Показ всего содержимого поля
function viewFullField(id) {
    if (!$(`div`).is(`#${id}_full_info`)) {
        let value = $(`#${id}`).val();
        $(`#${id}`).parent().append(`
            <div class="full_field" id="${id}_full_info" style="">${value}</div>
        `)
    }
}
function hiddenFullField(id) {
    $(`#${id}_full_info`).remove();
}
function inputFieldDoc(data, document_name, address, elem) {
    $.ajax({
        url: '/downloadDoc',
        data: { category: data[0], name: document_name, card_id: data[1], address: address, delivery: 'no' },
        type: 'GET',
        dataType: 'html',
        success: function(result) {
            if (result == 'BAD ADDRESS or INN') {
                return $('.page').append($('<div>', { class: 'background' }).add(`
                    <div class="modal_select">
                        <div class="title">
                            <span>Ошибка</span>
                            <img onclick="closeModal()" src="static/images/cancel.png">
                        </div>
                        <div class="content">
                            <div class="message">
                                <p style="font-size: 13px; color: #595959;">Проверьте корректность ввода ИНН и почтового индекса в карточке клиента</p>
                            </div>
                        </div>
                    </div>
                `));
            }
            $.ajax({
                url: '/getDocs',
                type: 'GET',
                dataType: 'html',
                success: function(result) {
                    let documents = '';
                    let old_docs = JSON.parse(result);
                    let names = [
                        {category: 'client', name: 'Договор поставки от'},
                        {category: 'carrier', name: 'Договор об оказании услуг перевозки грузов от'}
                    ]
                    let name_category = $(elem).attr('name');
                    if (name_category.includes('new')) {
                        name_category = name_category.replace(/new/g, saveTableAndCard[1][1].length + 1)
                    }
                    for (let i = 0; i < old_docs.length; i++) {
                        for (let j = 0; j < names.length; j++) {
                            if (old_docs[i].Owner_type == data[0] && data[0] == names[j].category && old_docs[i].Owner_id == name_category.split('_')[1]) {
                                documents += `
                                <div class="contract flex" name="${names[j].name} ${old_docs[i].Prefix}" id="${old_docs[i].id}" onclick="downloadOldDocument(this)">
                                    <div class="format">DOCX</div>
                                    <div class="date_number">
                                        <div class="top">${old_docs[i].Creation_date}</div>
                                        <div class="bottom">${old_docs[i].MonthNum}/${old_docs[i].Date}</div>
                                    </div>
                                    <span>${names[j].name} ${old_docs[i].Prefix}</span>
                                </div>
                                `
                            }
                        }
                    }
                    $('#list_contract').empty();
                    $('#list_contract').append(documents);
                }
            });
        }
    })
}
function downloadDocument(elem) {
    let check = confirm("Вы уверены, что Вы хотите создать новый договор?");
    if (!check) return;
    let data = $(elem).attr('name').split('_');
    if (data[1] == 'new') data[1] = saveTableAndCard[1][1].length + 1;
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
                        inputFieldDoc(data, document_name, data_client[i].Adress, elem);
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
                        inputFieldDoc(data, document_name, data_carrier[i].Address, elem);
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
                    const name = [data[i].items[j].Group_name, data[i].items[j].Name, data[i].items[j].Prefix, returnSpaces(data[i].items[j].Volume), data[i].items[j].Packing, data[i].items[j].NDS, returnSpaces(data[i].items[j].Cost), data[i].stock_address];
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
                </tr>`
    }
    // Вывод заголовка отфильтрованной, нижней таблицы
    function getTitleFilterList() {
        return `<tr>
                    <th>Группа товаров</th>
                    <th>Товар</th>
                    <th>Юр. лицо</th>
                    <th>Объем, кг.</th>
                    <th>Упаковка</th>
                    <th>НДС</th>
                    <th>Цена прайса, руб.</th>
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
            id: 'row_' + idTable,
            append: $('<div>', {
                class: 'info_block full ' + className,
                append: $('<table>', {
                    class: 'account_table new_table',
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
                            <input type="text" onkeyup="maskNumberWithout(this.id); all_costs()"  id="total_costs_inv" class="total_count red bold mrl">
                            <div name="unlock" class="lock_input" id="mode_costs" onclick="switchMode(this)"></div>
                        </div> 
                        <div class="costs_element">
                            <span>Скидка</span> 
                            <input type="text" onkeyup="calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_discount_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_discount" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Привет</span> 
                            <input type="text" onkeyup="maskNumberWithout(this.id); calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_privet_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_privet" onclick="switchMode(this)"></div>
                        </div>
                        <div class="costs_element">
                            <span>Доставка</span> 
                            <input type="text" onkeyup="maskNumberWithout(this.id); calculationIndicators()" value="" onblur="dataСalculation(this)" id="total_delivery_inv" class="total_count bold mrl">
                            <div name="unlock" class="lock_input" id="mode_delivery" onclick="switchMode(this)"></div>
                        </div>`,
            })
        })
        return content;
    }
    function searchContent() {
        return `
            <div class="search_items">
                <input type="text" id="invoice_search_items">
                <button onclick="searchItemsInTable()" class="btn btn-main btn-srch btn-srch-left">Поиск</button>
            </div>
        `
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
                data_name: elem.name,
                onclick: 'completionCard(this)',
                html: 'Выставить'
            })
        });
        return content;
    }

    return  getRowContent()
            .add(getContentCard([getTitleTable, getRowsTable], 'input_table', ''))
            .add(searchContent())
            .add(getContentCard([getTitleFilterList, getFilterList], 'output_table', 'hmax'))
            .add(nextStepButtons());
}
// Поиск товаров в таблице Выставления счета
function searchItemsInTable() {
    let search_item = $('#invoice_search_items').val();
    
    $.ajax({
        url: '/getStockTable',
        type: 'GET',
        dataType: 'html',
        success: function(data) { 
            data = JSON.parse(data); 
            function getTitleFilterList() {
                return `<tr>
                            <th>Группа товаров</th>
                            <th>Товар</th>
                            <th>Юр. лицо</th>
                            <th>Объем, кг.</th>
                            <th>Упаковка</th>
                            <th>НДС</th>
                            <th>Цена прайса, руб.</th>
                            <th>Склад</th>
                        </tr>`
            }

            function getFilterList() {
                let tbody = $('<tbody>', {id: 'filter_list'});
                for (let i = 0; i < data.length; i++) {
                    if (data[i].stock_address !== null) {
                        for (let j = 0; j < data[i].items.length; j++) {
                            if (data[i].items[j].Name.includes(search_item)) {
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
                }
                return tbody;
            }

            let content = $('<div>', {
                    class: 'info_block full hmax',
                    append: $('<table>', {
                        class: 'account_table',
                        id: 'output_table',
                        html: getTitleFilterList(),
                        append: getFilterList()
                    })
            })
            $('#row_output_table').empty();
            $('#row_output_table').append(content);
        }
    });
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
                                {id: `calcDelivery_${idProduct}`, html: ''}, {id: `product_unit_${idProduct}`, html: ''}, {id: `amountC_${idProduct}`, html: ''},
                            ]
                            for (let k = 0; k < list.length; k++) {
                                if (list[k].id.includes('invoiled_volume')) {
                                    tr.append($('<td>', {
                                        append: $('<input>', {
                                            type: 'text', onkeyup: 'maskNumberWithout(this.id); tarCalculation(this.id)', id: list[k].id, max: account.Volume
                                        })
                                    }))
                                } else if (list[k].id.includes('calc')) {
                                    tr.append($('<td>', {
                                        append: $('<input>', {
                                            type: 'number', id: list[k].id, name: 'create',
                                            onkeyup: 'recountPrice(this)'
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
                                sum += +deleteSpaces($(element).html())
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
    let total = deleteSpaces($('#total_costs_inv').val());
    let sale = Math.abs(deleteSpaces($('#total_discount_inv').val()));
    let privet = deleteSpaces($('#total_privet_inv').val());
    let delivery = deleteSpaces($('#total_delivery_inv').val());
    let sum = +sale + +privet + +delivery;
    $('#total_costs_inv').val(sum);

    let total_costs = deleteSpaces($('#total_costs_inv').val());

    let count = 0;
    for (let element of $('#exposed_list .invoiled')) {
        count++;
    }
    for (let element of $('#exposed_list .invoiled')) {
        $(element).children()[11].innerHTML = (+deleteSpaces($(element).children()[5].children[0].value) * +deleteSpaces($(element).children()[6].innerHTML)) + Math.ceil(+total_costs / +count);
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
                        let totalSale       = ((+deleteSpaces($('#total_discount_inv').val()) / +deleteSpaces($(`#invoiled_volume_${data[j].items[k].Item_id}`).val()) / count).toFixed(2));
                        let totalPrivet     = ((+deleteSpaces($('#total_privet_inv').val()) / +deleteSpaces($(`#invoiled_volume_${data[j].items[k].Item_id}`).val()) / count).toFixed(2));
                        let totalDelivery   = ((+deleteSpaces($('#total_delivery_inv').val()) / +deleteSpaces($(`#invoiled_volume_${data[j].items[k].Item_id}`).val()) / count).toFixed(2));
                        let price_unit      = (+totalSale * -1 + +totalPrivet + +totalDelivery + +deleteSpaces($(`#product_cost_${data[j].items[k].Item_id}`).html())).toFixed(2);

                        $(`#calcSale_${data[j].items[k].Item_id}`).val(isNaN(totalSale) || totalSale == Infinity || totalSale == -Infinity ? '' : (+totalSale * -1).toFixed(2));
                        $(`#calcPrivet_${data[j].items[k].Item_id}`).val(isNaN(totalPrivet) || totalPrivet == Infinity || totalPrivet == -Infinity ? '' : totalPrivet);
                        $(`#calcDelivery_${data[j].items[k].Item_id}`).val(isNaN(totalDelivery) || totalDelivery == Infinity || totalDelivery == -Infinity ? '' : totalDelivery);
                        $(`#product_unit_${data[j].items[k].Item_id}`).html(isNaN(price_unit) || price_unit == Infinity || price_unit == -Infinity ? '' : price_unit)
                        let total = deleteSpaces((+deleteSpaces($(`#calcDelivery_${data[j].items[k].Item_id}`).val()) + +deleteSpaces($(`#calcPrivet_${data[j].items[k].Item_id}`).val()) + +deleteSpaces($(`#calcSale_${data[j].items[k].Item_id}`).val())) * +deleteSpaces($(`#invoiled_volume_${data[j].items[k].Item_id}`).val()));
                        let amount = deleteSpaces(Math.round(+deleteSpaces($(`#product_cost_${data[j].items[k].Item_id}`).html()) * +deleteSpaces($(`#invoiled_volume_${data[j].items[k].Item_id}`).val())).toFixed(2));
                        $(`#amountC_${data[j].items[k].Item_id}`).html(+amount + total);

                        let sum = 0;
                        for (let element of $('#exposed_list .invoiled')) {
                            sum += +deleteSpaces($(element).children()[11].innerHTML);
                        }
                        data[j].items[k].NDS = data[j].items[k].NDS[0] + data[j].items[k].NDS[1];
                        let vat = sum > 0 ? deleteSpaces(sum - ((sum * +data[j].items[k].NDS) / 100)) : 0;
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
    let volume = +deleteSpaces($(`#${id}`).val());
    let weight = +deleteSpaces($(`#product_weight_${idElement}`).html());
    let unit = Math.round(+deleteSpaces($(`#product_cost_${idElement}`).html()) + +deleteSpaces($(`#calcSale_${idElement}`).val()) + +deleteSpaces($(`#calcPrivet_${idElement}`).val()) + +deleteSpaces($(`#calcDelivery_${idElement}`).val())).toFixed(2);

    $(`#product_containers_${idElement}`).html(returnSpaces(Math.floor(volume / weight)));
    $(`#product_unit_${idElement}`).html(unit == Infinity || isNaN(unit) ? '0' : returnSpaces(unit));
    calculationIndicators();
}
function recountPrice(element) {
    let dataProduct = element.id.split('_');
    let dataProductName = $(element).attr('name');

    let product;
    if (dataProductName == 'create') {
        product = $(`#exposed_list #invoiled_${dataProduct[1]}_product`);
    } else {
        product = $(`#exposed_list #product_${dataProduct[1]}`);
    }

    product.children().last().html(
        (+deleteSpaces(product.children()[5].children[0].value) * +deleteSpaces(product.children()[6].innerHTML))
        + (+deleteSpaces(product.children()[7].children[0].value) * +deleteSpaces(product.children()[5].children[0].value) + +deleteSpaces(product.children()[8].children[0].value) * +deleteSpaces(product.children()[5].children[0].value) + +deleteSpaces(product.children()[9].children[0].value) * +deleteSpaces(product.children()[5].children[0].value))
    );

    let list = [
        { id: 'total_discount_inv', type: 'calcSale' },
        { id: 'total_privet_inv',   type: 'calcPrivet' },
        { id: 'total_delivery_inv', type: 'calcDelivery' }
    ]

    for (let i = 0; i < list.length; i++) {
        if (dataProduct[0].includes(list[i].type)) {
            let other_total_sale = 0;
            $('#exposed_list .invoiled').each(function(i, element) {
                other_total_sale += (+deleteSpaces($(`#${dataProduct[0]}_${i + 1}`).val()) * +deleteSpaces($(`#invoiled_volume_${i + 1}`).val()));
            });
            if (list[i].id == 'total_discount_inv') {
                other_total_sale *= -1;
            }
            $(`#${list[i].id}`).val(other_total_sale);
            $(`#product_unit_${dataProduct[1]}`).html(+deleteSpaces(product.children()[6].innerHTML) + (+deleteSpaces(product.children()[7].children[0].value)) + (+deleteSpaces(product.children()[8].children[0].value)) + (+deleteSpaces(product.children()[9].children[0].value)));

        }
    } 
    
    let sum = 0;
    $('#exposed_list .invoiled').each(function(i, element) {
        sum += +deleteSpaces($(element).children()[11].innerHTML);
    });
    let data_account = categoryInFinanceAccount[1][1];
    for (let i = 0; i < data_account.length; i++) {
        for (let j = 0; j < data_account[i].items.length; j++) {
            if (data_account[i].items[j].Item_id == dataProduct[1]) {
                let vat = sum > 0 ? sum - ((sum * +data_account[i].items[j].NDS) / 100) : 0;
                $('#total').html(returnSpaces(Math.round(sum)));
                $('#vat').html(returnSpaces(Math.round(sum - vat)));
                $('#without-vat').html(returnSpaces(Math.round(vat)));
                break;
            }
        }
    }
}
function all_costs() {
    let amount = 3, disableValue = 0;
    for (let i = 0; i < list_inv.length; i++) {
        if (list_inv[i].disable) {
            amount--;
            disableValue += +deleteSpaces($(`#${list_inv[i].id}`).val());
        }
    }
    let value = +deleteSpaces($('#total_costs_inv').val()) - disableValue;
    if (typeof value == typeof '') return;
    let averageValue = Math.round(value / amount);
    for (let i = 0; i < list_inv.length; i++) {
        if (!list_inv[i].disable) {
            $(`#${list_inv[i].id}`).val(returnSpaces(averageValue));
        }
    }
    for (let element of $('#exposed_list .invoiled')) {
        $(element).children()[11].innerHTML = (+deleteSpaces($(element).children()[5].children[0].value) * +deleteSpaces($(element).children()[6].innerHTML))
        + (+deleteSpaces($(element).children()[7].children[0].value) * +deleteSpaces($(element).children()[5].children[0].value) + +deleteSpaces($(element).children()[8].innerHTML) * +deleteSpaces($(element).children()[5].children[0].value) + +deleteSpaces($(element).children()[9].innerHTML) * +deleteSpaces($(element).children()[5].children[0].value));
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
function addComment(manager = '', data, last = false) {
    if (manager === '') {
        $(`#messages`).empty();
        $(`#comments`).empty();
        let list_role = [];
        $('#member .member').each(function(i, element) {
            if ($(element).children()[0].children[0].children[0].value != '') {
                list_role.push({ role: $(element).children()[0].children[0].children[0].value, surname: $(element).children()[0].children[0].children[2].value })
            }
        });
        $('#messages').prepend(
            $('<tr>', {
                id: 'message',
                append: `
                    <td>
                        <input type="text" onchange="saveCard()" value="${getCurrentDateNotComparison('year')}" id="comment_date" class="m_date">
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
        $('#comment_date').datepicker({position: 'right bottom', autoClose: true})
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
        $('#messages').prepend(
            $('<tr>', {
                id: 'message',
                append: `
                    <td width="75">
                        <div type="text" id="message_date" class="m_date">${manager.date}</div>
                    </td>
                    <td style="padding-bottom: 10px">
                        <div type="text" onclick="showThisComment(this)" id="comments_${data[0]}_${data[1]}_${manager.id}" class="m_role static">${manager.name}</div>
                    </td>
                    <td width="75"><p style="width: 85px;" class="clip">${manager.note}</p></td>`
            })
        );
        if (last) {
            $('#comments').prepend(
                $('<tr>', {
                    id: 'comment',
                    append: `
                        <td>
                            <div class="done"><p style="width: 95%;">${manager.note}</p></div>
                        </td>
                        <td style="font-weight: 500;" width="100">${manager.creator == null ? 'Не определен' : manager.creator}</td>
                    `
                })
            )
        }
    }
}
function showThisComment(element) {
    $(`#comments`).empty();
    let data = element.id.split('_');
    $.ajax({
        url: '/getMessages',
        type: 'GET',
        data: {category: data[1], id: data[2]},
        dataType: 'html',
        success: function(result) {
            showComment(JSON.parse(result));
        }
    });
    function showComment(result) {
        for (let i = 0; i < result.length; i++) {
            if (+data[3] === +result[i].NoteId) {
                let comments = {
                    comment: result[i].Note,
                    creator: result[i].Creator == null ? 'Не определен' : result[i].Creator
                }
                $('#comments').prepend(
                    $('<tr>', {
                        id: 'comment',
                        append: `
                            <td>
                                <div class="done"><p style="width: 95%;">${comments.comment}</p></div>
                            </td>
                            <td style="font-weight: 500;" width="100">${comments.creator}</td>
                        `
                    })
                )
            }
        }
    }
}
// Скрытие/показ информации в карточке
function showOrHideInfo(id) {
    let table_id = 'hidden_info_' + id;
    let image_id = 'hidden_image_' + id;
    if ($(`#${image_id}`).hasClass('drop_active')) {
        $(`#${image_id}`).removeClass('drop_active');
        $(`#${table_id}`).fadeOut(200);
    } else {
        $(`#${image_id}`).addClass('drop_active');
        $(`#${table_id}`).fadeIn(200);
    }
}
// Добавление контакта в карточках, мб переделать в одну функцию
function addMember(id = 'client', selectedLine = '') {
    if (selectedLine == '') {
        selectedLine = {role: '', Number: '', Phone_two: '', Last_name: '', Name: '', Email: '', Car: '', visible: true};
    }
    if (id === 'carrier') category = {class: 'car', member: 'delivery', placeholder: 'Транспорт', select: selectedLine.Car};
    else category = {class: 'phone', member: '', placeholder: 'Телефон #1', select: selectedLine.Number};
    let count_members = 0;
    $('#member .member').each(function(i, element) {
        count_members++;
    });
    function fillListRole() {
        let options = `<option disabled selected value="Не выбрана">Должность</option>`;
        let roles;
        $.ajax({
            url: '/getRoles',
            type: 'GET',
            dataType: 'html',
            async: false,
            success: function(result) {
                roles = JSON.parse(result);
            }
        });
        for (let i = 0; i < roles.length; i++) {
            if (selectedLine.Position == roles[i].Name) {
                options += `<option selected value="${roles[i].Name}">${roles[i].Name}</option>`
            } else {
                options += `<option value="${roles[i].Name}">${roles[i].Name}</option>`
            }
        }
        return options;
    }
    function carrierPhone() {
        if (id === 'carrier') {
            return `<input placeholder="Телефон #1" class="phone" id="phone" onchange="saveCard()" value="${selectedLine.Number}">
                    <input placeholder="Телефон #2" class="phone" id="phone_two" onchange="saveCard()" value="${selectedLine.Phone_two}">`
        } else {
            return `<input placeholder="Телефон #2" class="phone" id="phone_two" onchange="saveCard()" value="${selectedLine.Phone_two}">`;
        }
    }
    $('#member').prepend($('<div>', {
        class: `member ${category.member}`,
        id: `member_${count_members}`,
        append: $('<div>', {
            class: 'm_info',
            append: $('<div>', {
                class: 'top',
                append: $('<select>', {
                    css: {
                        'margin-top': '10px'
                    },
                    append: fillListRole()
                }).add(
                    `
                     <input placeholder="Фамилия" class="last_name" id="last_name" onchange="saveCard()" value="${selectedLine.Last_name == null ? '' : selectedLine.Last_name}" type="text">
                     <input placeholder="Имя Отчество" class="first_name" id="first_name" onchange="saveCard()" value="${selectedLine.Name == null ? '' : selectedLine.Name}" type="name">
                     <input placeholder="${category.placeholder}" class="${category.class}" id="${category.class}" onchange="saveCard()" value="${category.select}">
                     ${carrierPhone()}
                     <input placeholder="Почта" class="email" id="email" onchange="saveCard()" onblur="checkEmail()" value="${selectedLine.Email == null ? '' : selectedLine.Email}" type="email">
                    `)
            })
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
        $(element).mask('8-999-999-99-99');
    }
    for (let element of $('#member .member #phone_two')) {
        $(element).mask('8-999-999-99-99');
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
        $(`#member_${id[1]} #phone_two`).attr('disabled', 'disabled')
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
        $(`#member_${id[1]} #phone_two`).removeAttr('disabled')
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
        let email = $(element).children().children().children().last()[0];
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
function deleteSpaces(string) {
    if (typeof string != 'string') return string;
    return string.replace(/\s/g,"");
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
function maskNumber(id) {
    $(`#${id}`).mask('# ##0.00', { reverse: true });
}
function maskNumberWithout(id) {
    $(`#${id}`).mask('# ##0', { reverse: true });
}
function returnSpaces(string) {
    string = String(string)
    string = deleteSpaces(string);
    let new_string = string;
    let count = 0, array = [];
    if (string.includes('.')) new_string = string.split('.')[0];

    for (let i = new_string.length - 1; i >= 0; i--) {
        array.push(new_string[i]); 
        count++;
        if (count % 3 == 0) {
            if (new_string[i - 1] == '-') {
                array.push('-');
                break;
            };
            array.push(' ');
        };
    }
    if (string.includes('.') && string.split('.')[1] != '00') {
        return array.reverse().join('').trim() + '.' + string.split('.')[1]
    }
    return array.reverse().join('').trim();
}
function changeSearchMode() {
    if ($('#active_comment_seach').prop('checked')) {
        $('#search').attr('placeholder', 'Введите текст комментария');
    } else {
        $('#search').attr('placeholder', 'Введите фамилию, телефон или email');
    }
    
}
// Период для информации по счетам (Дебеторка)
function visibleSelectPeriod(type = 'account') {
    if ($('div').is('.period_info_accounts')) {
        $('.period_info_accounts').remove();
    } else {
        $('#select_period_info_accounts').append(`
            <div class="period_info_accounts">
                <ul>
                    <li id="day" onclick="selectPeriod(this.id, '${type}')">за последний день</li>
                    <li id="weak" onclick="selectPeriod(this.id, '${type}')">за последнюю неделю</li>
                    <li id="month" onclick="selectPeriod(this.id, '${type}')">за последний месяц</li>
                    <li id="year" onclick="selectPeriod(this.id, '${type}')">за последний год</li>
                    <li id="all" onclick="selectPeriod(this.id, '${type}')">за все время</li>
                </ul>
            </div>
        `) 
    }
}
function selectPeriod(period = 'month', table) {
    let filter = [
        {id: 'account', request: '/getAccounts'},
        {id: 'delivery', request: '/getDeliveries'},
        {id: 'provider', request: '/getProviders'},
    ]
    function getCurrRequest() {
        for (let i = 0; i < filter.length; i++) {
            if (filter[i].id == table) {
                return filter[i].request;
            }
        }
    }
    let request = getCurrRequest();
    $.ajax({
        url: request,
        type: 'GET',
        dataType: 'html',
        beforeSend: function() {
            $('body').prepend(`
                <div id="preloader">
                    <div id="preloader_preload"></div>
                </div>
            `)
            preloader = document.getElementById("preloader_preload");
        },
        success: function(data) {
            account_data = JSON.parse(data);
            let date_period = datePeriod();
            function datePeriod() {
                let date_filter = [
                    {id: 'day', period: 0, text: 'за последний день'},
                    {id: 'weak', period: 7, text: 'за последнюю неделю'},
                    {id: 'month', period: 30, text: 'за последний месяц'},
                    {id: 'year', period: 365, text: 'за последний год'},
                    {id: 'all', period: 5475, text: 'за все время'},
                ]
                for (let i = 0; i < date_filter.length; i++) {
                    if (period == date_filter[i].id) {
                        let today = getCurrentDate('year');
                        let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)/;
            
                        let date_arr = datetime_regex.exec(today);
                        let first_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                        let second_datetime = new Date('20' + +date_arr[3], +date_arr[2], date_arr[1]);
                        second_datetime.setDate(second_datetime.getDate() - date_filter[i].period);
                        $('#period_accounts').html(date_filter[i].text);
                        return [second_datetime, first_datetime];
                    }
                }
            }
            let sort_accounts = [];
            let list_table = [
                {id: 'debit', table: filterDebit, date: 'account'},
                {id: 'account', table: filterAccount, date: 'account'},
                {id: 'delivery', table: filterDelivery, date: 'delivery'},
                {id: 'provider', table: filterProvider, date: ''},
            ]
            for (let i = 0; i < account_data.length; i++) {
                function getCurrDate() {
                    for (let j = 0; j < list_table.length; j++) {
                        if (list_table[j].id.includes('provider')) {
                            if (account_data[i].Create_date == null) {
                                account_data[i].Create_date = '01.01.20'
                            }
                            return getValidationDate(account_data[i].Create_date);
                        }
                        if (saveTableAndCard[0].id.includes(list_table[j].id)) {
                            return getValidationDate(account_data[i][list_table[j].date].Date);
                        }
                    }
                }
                let date_create_account = getCurrDate();
                if (date_create_account >= date_period[0] && date_create_account <= date_period[1]) {
                    sort_accounts.push(account_data[i]);
                }
            }
            function select_current_table() {
                for (let i = 0; i < list_table.length; i++) {
                    if (saveTableAndCard[0].id.includes(list_table[i].id)) {
                        return list_table[i].table;
                    }
                }
            }
            let select_table = select_current_table()
            select_table[1][1] = [];
            select_table[1][1] = sort_accounts;
            $('.period_info_accounts').remove();
            $('.table').remove();
            $('.info').append(fillingTables(select_table));
        },
        complete: function() {
            setTimeout(function(){ fadeOutPreloader(preloader) }, 0);
        }
    });
}
// End
function selectThisProvider(element) {
    let text = $(element).html();
    $(element).parent().parent().parent().children()[0].value = text;
}
function contextualSearch(element) {
    $.ajax({
        url: '/getProviders',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data).reverse();
            let parent = $(element).parent();
            let id = element.id.split('_')[2];
            function fillList() {
                let list = '';
                for (let i = 0; i < data.length; i++) {
                    list += `<li id="${data[i].id}" onclick="selectThisProvider(this)">${data[i].Name}</li>`
                }
                return list;
            }
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            // КОНТЕКСТНЫЙ ПОИСК. ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТА УЕЗЖАЕТ ВНИЗ
            parent.append(`
                <div class="context_search hmax" id="search_${id}">
                    <ul id="list_providers_for_search">
                        ${fillList()}
                    </ul>
                </div>
            `)
            searchWord(element.value);
        }
    });
}
function searchWord(value) {
    $.ajax({
        url: '/getProviders',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data).reverse();
            $('#list_providers_for_search').empty();
            for (let i = 0; i < data.length; i++) {
                let current_name = data[i].Name.toLowerCase();
                let search_name = value.toLowerCase();
                if (current_name.includes(search_name)) {
                    $('#list_providers_for_search').append(`
                        <li id="${data[i].id}" onclick="selectThisProvider(this)">${data[i].Name}</li>
                    `)
                }
            }
            if ($('#list_providers_for_search').html() == '') {
                $('#list_providers_for_search').append(`
                    <span>Ничего не найдено</span>
                `)
            }
        }
    });
}
function hiddenSearch(element) {
    setTimeout(function() {
        let id = element.id.split('_')[2];
        $(`#search_${id}`).remove();
    }, 150);
}
// Добавление строк в таблицах карточек
function addRow(id, selectedLine = '') {
    const tableInfo = [
        { id: 'client-group', tbody: 'group', count: 4, widthInput: [
                {id: 'item_product', width: 210, type: 'text'},
                {id: 'item_volume', width: 65, type: 'text'},
                {id: 'item_creator', width: 225, type: 'text'},
                {id: 'item_price', width: 90, type: 'text'}
            ],
            html: ['Name', 'Volume', 'Creator', 'Cost']
        },
        { id: 'provider-group', tbody: 'group', count: 7, widthInput: [
                {id: 'item_product', width: 210, type: 'text'},
                {id: 'item_price', width: 90, type: 'text'},
                {id: 'item_date', width: 70, type: 'text'},
                {id: 'item_vat', width: 30, type: 'number'},
                {id: 'item_packing', width: 100, type: 'text'},
                {id: 'item_weight', width: 65, type: 'text'},
                {id: 'item_fraction', width: 90, type: 'text'}
            ],
            html: ['Name', 'Cost', 'Date', 'NDS', 'Packing', 'Weight', 'Fraction']
        }, { id: 'carrier-group', tbody: 'group', count: 5, widthInput: [
                    {id: 'carrier_date', width: 50, type: 'text'},
                    {id: 'carrier_client', width: 100, type: 'text'},
                    {id: 'carrier_stock', width: 160, type: 'text'},
                    {id: 'carrier_driver', width: 90, type: 'text'},
                    {id: 'carrier_price', width: 80, type: 'text'}
                ],
                html: []
        }, { id: 'account-group', tbody: 'group', count: 2, widthInput: [
                    {id: 'account_date', width: 70, type: 'text'},
                    {id: 'account_price', width: 90, type: 'text'}
                ],
                html: ['date', 'sum']
        }, { id: 'delivery-group', tbody: 'group', count: 2, widthInput: [
                    {id: 'delivery_date', width: 70, type: 'text'},
                    {id: 'delivery_price', width: 90, type: 'text'}
                ],
                html: ['date', 'price']
        }, { id: 'flight-group', tbody: 'flight', count: 6, widthInput: [
                    {id: 'delivery_flight_product', width: 100, type: 'text'},
                    {id: 'delivery_flight_stock', width: 160, type: 'text'},
                    {id: 'delivery_flight_weight', width: 65, type: 'text'},
                    {id: 'delivery_flight_type', width: 160, type: 'text'},
                    {id: 'delivery_flight_sum', width: 90, type: 'text'}
                ],
                html: []
        }
    ]

    function trFill(table) {
        let tr = $('<tr>');

        function getListFraction(id) {
            $.ajax({
                url: '/getAllItems',
                type: 'GET',
                dataType: 'html',
                success: function(data) {
                    let options = '<option value="disabled" selected disabled>Выбрать</option>';
                    let list_items = ['Россыпь', 'Ракушка', 'Гранулы'];
                    for (let i = 0; i < list_items.length; i++) 
                        options += `<option value="${list_items[i]}">${list_items[i]}</option>`
                    $(`#${id}`).empty();
                    $(`#${id}`).append(options);
                    $('.hmax #group [name="item_fraction"]').each(function() {
                        if (selectedLine.Fraction == '') {
                            $(`#${id} option:contains('Выбрать')`).attr('selected', true)
                        } else {
                            $(`#${id} option`).each(function(i, element) {
                                if ($(element).html() == selectedLine.Fraction) {
                                    $(element).attr('selected', true);
                                }
                            });
                            $(`#${id} :selected`).val($(`#${id} :selected`).html());       
                        }
                    })
                }
            })
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
                    append: $('<input>', {
                        css: { width: table.widthInput[i].width + 'px', padding: '0' },
                        id: 'item_creator_' + count,
                        name: 'items_creator',
                        value: selectedLine[table.html[i]],
                        onfocus: 'contextualSearch(this)',
                        onblur: 'hiddenSearch(this)',
                        onkeyup: 'searchWord(this.value)',
                        autocomplete: 'off'
                    })
                }));  
            } else if (table.widthInput[i].id  == 'item_fraction') {
                let count = 0;
                $('.hmax #group [name="item_fraction"]').each(function() {
                    count++;
                })
                tr.append($('<td>', {
                    append: $('<select>', {
                        css: { width: table.widthInput[i].width + 'px', padding: '0' },
                        id: 'item_fraction_' + count,
                        name: 'item_fraction',
                        append: getListFraction('item_fraction_' + count)
                    })
                }));
            } else {
                if (table.widthInput[i].id.includes('sum') || table.widthInput[i].id.includes('weight') || table.widthInput[i].id.includes('price')) {
                    tr.append($('<td>', {
                        append: $('<input>', {
                            css: { width: table.widthInput[i].width + 'px', padding: '0' },
                            id: table.widthInput[i].id, 
                            value: selectedLine[table.html[i]],
                            type: table.widthInput[i].type,
                            onkeyup: 'maskNumber(this.id)'
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
        }
        return tr;
    }

    for (let i = 0; i < tableInfo.length; i++) {
        if (id == tableInfo[i].id) {
            $(`#${tableInfo[i].tbody}`).append(trFill(tableInfo[i]));
            $(`[name="remove_last_group"]`).fadeIn(0);
            if (id === 'client-group') {
                $('#group #item_price').mask('# ##0.00', { reverse: true });
                $('#group #item_volume').mask('# ##0.00', { reverse: true });
            }
            if (id === 'provider-group') {
                $('#group #item_price').mask('# ##0.00', { reverse: true });
                $('#group #item_weight').mask('# ##0.00', { reverse: true });
                $('#group #item_date').last().datepicker({position: 'right bottom', autoClose: true})
            }
            if (id === 'carrier-group') {
                $('#carrier_price').mask('# ##0.00', { reverse: true });
            }
            if (id === 'account-group') {
                $('#group #account_price').mask('# ##0.00', { reverse: true });
                $('#group #account_date').last().datepicker({position: 'right bottom', autoClose: true})
            }
            if (id === 'flight-group') {
                $('#delivery_flight_sum').mask('# ##0.00', { reverse: true });
                $('#delivery_flight_weight').mask('# ##0.00', { reverse: true });
            }
            if (id === 'delivery-group') {
                $('#delivery_start_date').datepicker({position: 'right top', autoClose: true})
                $('#delivery_end_date').datepicker({position: 'right top', autoClose: true})
                $('#group #delivery_date').last().datepicker({position: 'right bottom', autoClose: true})
                $('#delivery_price').mask('# ##0.00', { reverse: true });
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
        data: {category: idName[0], card_id: idName[1], date: getCurrentDateNotComparison('year')},
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
                html: `Свободна с <span id="free_card_date" class="bold">${getCurrentDateNotComparison()}</span>`
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