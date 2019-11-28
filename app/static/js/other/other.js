function createContactsFormTask() {
    const elemetsInfo = [
        { id: 'task_type', html: 'Тип задачи', type: 'text' },
        { id: 'task_whom', html: 'Кому', type: 'text' },
        { id: 'task_who', html: 'Кто', type: 'text' },
        { id: 'task_date', html: 'Дата', type: 'text' },
        { id: 'task_time', html: 'Время', type: 'text' },
        { id: 'task_comment', html: 'Комментарий', type: 'text' },
    ]

    function createInputs() {
        let content = $('<table>', { class: 'inputs' })
        for (let i = 0; i < elemetsInfo.length; i++) {
            content.append($('<tr>', {
                class: 'element',
                append: $('<td>', {
                    html: elemetsInfo[i].html
                }).add($('<td>', {
                    append: $('<input>', {
                        class: 'task_input',
                        id: elemetsInfo[i].id,
                        type: elemetsInfo[i].type
                    })
                }))
            }))
        }
        return content;
    }

    function createButtons() {
        return $('<div>', {
            class: 'buttons',
            append: $('<button>', {
                onclick: 'createCTButtons()',
                html: 'Отменить',
                class: 'btn'
            }).add('<button>', {
                class: 'btn btn-main',
                html: 'Добавить',
                onclick: 'createCTButtons()',
            })
        })
    }

    let content = $('<div>', {
        class: 'create_empty_card mr',
        append: $('<div>', {
            class: 'title mra',
            html: 'Новая задача'
        }).add(createInputs())
    })

    return content.add(createButtons());
}

// Создание "Добавить контакт"
function createContactsForm() {
    function radioBoxs() {
        let content = $('<div>', { class: 'radio_boxs' });
        for (let i = 0; i < contactsFormInfo.length; i++) {
            content.append($('<div>', {
                class: 'element',
                append: $('<input>', {
                    type: 'radio',
                    id: contactsFormInfo[i].id,
                    name: 'createEmptyCard'
                }).add($('<label>', {
                    for: contactsFormInfo[i].id,
                    html: contactsFormInfo[i].name
                }))
            }))
        }

        return content;
    }

    function createButtons() {
        return $('<div>', {
            class: 'buttons',
            append: $('<button>', {
                onclick: 'createCTButtons()',
                html: 'Отменить',
                class: 'btn'
            }).add('<button>', {
                class: 'btn btn-main',
                html: 'Добавить',
                onclick: 'сheckSelectedRadioBox()',
            })
        })
    }

    let content = $('<div>', {
        class: 'create_empty_card',
        append: $('<div>', {
            class: 'title',
            html: 'Новый контакт'
        }).add($('<div>', {
            class: 'radio_boxs',
            append: radioBoxs()
        }))
    })

    return content.add(createButtons());
}

// Проверка какой контакт выбран
function сheckSelectedRadioBox() {
    for (let i = 0; i < contactsFormInfo.length; i++) {
        if ($(`#${contactsFormInfo[i].id}`).prop('checked')) {
            createCardMenu(contactsFormInfo[i]);
            createCTButtons();
        }
    }
}

// Создание кнопок Отменить и Добавить
function createCT(id) {
    // id - id кнопки
    $('#createCT').empty();
    if (id == 'addContact') {
        $('#createCT').append(createContactsForm());
        $('#client_new').prop('checked', true);
    } else if (id == 'addTask') {
        $('#createCT').append(createContactsFormTask());
    }
};

// Создание кнопок добавление задач и контактов
function createCTButtons() {
    $('#createCT').empty();
    $('#createCT').append($('<div>', {
        class: 'buttons',
        append: $('<button>', {
            id: 'addContact',
            name: 'addBtn',
            class: 'btn',
            html: 'Добавить контакт',
            onclick: 'createCT(this.id)'
        }).add('<button>', {
            id: 'addTask',
            name: 'addBtn',
            class: 'btn btn-main',
            html: 'Добавить задачу',
            onclick: 'createCT(this.id)'
        })
    }))
}

// Создание левого меню
function createCategoryMenu() {
    for (let i = 0; i < linkCategoryInfo.length; i++) {
        $('#nav_bar').append(
            $('<div>', {
                id: linkCategoryInfo[i].id,
                class: 'block',
                name: 'linkCategory',
                onclick: 'linkCategory(this.id)',
                append: $('<img>', {
                    class: 'img_category',
                    src: linkCategoryInfo[i].src
                }).add($('<span>', {
                    html: linkCategoryInfo[i].name
                }))
            })
        );
    }
}

// Выпадающее меню "Поиска по региону"
$('#search_dropMenu').click(function() {
    if (this.classList.contains('active')) {
        $(`.drop-down, #search_dropMenu`).removeClass('active');
        $('.drop_down_search').remove();
    } else {
        $(`.drop-down, #search_dropMenu`).addClass('active');
        createDropMenu();
    }
});

$('input, textarea').focus(function() {
    $(this).data('placeholder', $(this).attr('placeholder'));
    $(this).attr('placeholder', '');
});

$('input, textarea').blur(function() {
    $(this).attr('placeholder', $(this).data('placeholder'));
});

function convertName() {
    let username = $('.fieldInfo .name').html().split(' ');
    username[0] = username[0][0];
    username[0] += '.';
    return username.reverse().join(' ');
}