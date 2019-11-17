// Смущают глобальные переменные
let saveTableAndCard;
let selectedLine = '';

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

    // Делаем запрос в бд
    if (getInfo[1] !== 'clear') {
        for (let element of dataName) {
            if (element.name === getInfo[0]) {
                selectedLine = element.link[1][getInfo[1]];
            }
        }
    } else {
        selectedLine = ['', '', '', '', '', '', '', '', '', '', ''];
    }
    // Информация по всем карточкам подкатегорий
    const titleObject = [{
            id: 'client',
            list: [`Код: ${selectedLine[0]}`, `Местное время: ${getCurrentTime()}`, `Какой-то их сайт`, `Холдинг`],
            link: clientContentCard,
            status: getInfo[1]
        },
        {
            id: 'provider',
            list: [`Код: ${selectedLine[0]}`, `Местное время: ${getCurrentTime()}`, `Холдинг`],
            link: providerContentCard,
            status: getInfo[1]
        },
        {
            id: 'carrier',
            list: [`Код: 1`, `Местное время: 14:42`],
            link: carrierContentCard,
            status: getInfo[1]
        },
        {
            id: 'account',
            list: [`Счета от ${selectedLine[0]}`],
            link: accountContentCard,
            status: getInfo[1]
        },
        {
            id: 'debit',
            list: [''],
            link: debitContentCard,
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

    $('.info').append(cardMenu());

    // Проверка на заполненность Контактов и строк таблиц
    if ($('#members').html().trim() !== '') {
        $('#remove_last_member').fadeIn(0);
    }
    if ($('#group').html().trim() !== '') {
        $('#remove_last_row').fadeIn(0);
    }

    // Модальное окно для Склада
    if (getInfo[0] === 'stock') {
        $('.info').prepend($('<div>', {class: 'overflow'}));
        $('#card_menu').addClass('modal');
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
// Получаем контент карточки
function getContentInfo(element) {
    let content = $('<div>', { class: 'content' });
    content.append(element.link(selectedLine));
    return content;
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