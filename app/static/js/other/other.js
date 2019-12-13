function createContactsFormTask(values) {
    const elementsInfo = [
        { id: 'task_type', html: 'Тип задачи', type: 'text', element: 'select' },
        { id: 'task_whom', html: 'Кому', type: 'text', element: 'select' },
        { id: 'task_date', html: 'Дата', type: 'text', element: 'input' },
        { id: 'task_time', html: 'Время', type: 'text', element: 'input' },
        { id: 'task_comment', html: 'Комментарий', type: 'text', element: 'input' },
    ]

    function createInputs() {
        let content = $('<table>', { class: 'inputs' })
        for (let i = 0; i < elementsInfo.length; i++) {
            content.append($('<tr>', {
                class: 'element',
                append: $('<td>', {
                    html: elementsInfo[i].html
                }).add($('<td>', {
                    append: $(`<${elementsInfo[i].element}>`, {
                        class: 'task_input',
                        id: elementsInfo[i].id,
                        type: elementsInfo[i].type,
                        value: values[elementsInfo[i].id]
                    })
                }))
            }))
            if (elementsInfo[i].id == 'task_whom') {
                $.ajax({
                    url: '/getUsers',
                    type: 'GET',
                    dataType: 'html',
                    success: function(data) {
                        data = JSON.parse(data);
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].role == 'manager') {
                                $('#task_whom').append(`
                                    <option value="${data[i].id}">${data[i].second_name}</option>
                                `)
                            }
                        }
                        $('#task_whom').append(`
                            <option value="all">Всем</option>
                        `)
                    }
                });
            }
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
                onclick: 'taskCreate()',
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
// Создание задачи
function taskCreate(tasks = 'new') {
    let taskInfo;
    $.ajax({
        url: '/getThisUser',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            data = JSON.parse(data);
            if (tasks != 'new') {
                tasks = JSON.parse(tasks);
                if (tasks.length > 0) {
                    $('#tasks_list').empty();
                }
                for (let i = 0; i < tasks.length; i++) {
                    function typeTask() {
                        if (tasks[i].Type == 'phone') return 'Звонок';
                        if (tasks[i].Type == 'email') return 'Письмо';
                    }
                    $('#tasks_list').prepend(
                        $('<div>', {
                            class: 'item',
                            name: `task_id`,
                            onclick: `editTask(this.name)`,
                            append: $('<img>', {
                                src: `static/images/${tasks[i].Type}.svg`,
                                class: 'importance'
                            }).add($('<div>', {
                                class: 'fieldInfo',
                                append: $('<div>', {
                                    class: 'row',
                                    append: $('<div>', {
                                        class: 'name',
                                        html: typeTask()
                                    }).add($('<div>', {
                                        class: 'time',
                                        html: tasks[i].Time
                                    }))
                                }).add($('<div>', {
                                    class: 'row',
                                    append: $('<div>', {
                                        class: 'descr',
                                        html: tasks[i].Comment
                                    }).add($('<div>', {
                                        class: 'time',
                                        append: $('<span>', {
                                            class: 'bold',
                                            html: tasks[i].Date
                                        })
                                    }))
                                }))
                            }))
                        })
                    )
                }
                $('#tasks_list').prepend(`
                    <div class="title">
                        <span>Действующие задачи</span>
                    </div>`)
            } else {
                taskInfo = {
                    task_type: $('#task_type').val(),
                    task_whom: [$('#task_whom').val()],
                    task_who: data.id,
                    task_date: $('#task_date').val(),
                    task_time: $('#task_time').val(),
                    task_comment: $('#task_comment').val(),
                }
                socket.emit('addTask', {data: taskInfo});
                function typeTask() {
                    if (taskInfo.task_type == 'phone') return 'Звонок';
                    if (taskInfo.task_type == 'email') return 'Письмо';
                }
                $('#tasks_list .empty').remove();
                if ($('#task_whom').val() == data.id) {
                    $('#tasks_list').append(
                        $('<div>', {
                            class: 'item',
                            name: `task_id`,
                            onclick: `editTask(this.name)`,
                            append: $('<img>', {
                                src: `static/images/${taskInfo.task_type}.svg`,
                                class: 'importance'
                            }).add($('<div>', {
                                class: 'fieldInfo',
                                append: $('<div>', {
                                    class: 'row',
                                    append: $('<div>', {
                                        class: 'name',
                                        html: typeTask()
                                    }).add($('<div>', {
                                        class: 'time',
                                        html: taskInfo.task_time
                                    }))
                                }).add($('<div>', {
                                    class: 'row',
                                    append: $('<div>', {
                                        class: 'descr',
                                        html: taskInfo.task_comment
                                    }).add($('<div>', {
                                        class: 'time',
                                        append: $('<span>', {
                                            class: 'bold',
                                            html: taskInfo.task_date
                                        })
                                    }))
                                }))
                            }))
                        })
                    )
                } 
                createCTButtons();
            }
        }
    });
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
function editTask(id) {
    // $.ajax({
    //     url: '/getTask',
    //     type: 'GET',
    //     data: {id: id},
    //     dataType: 'html',
    //     success: function(data) { createCT('addTask', JSON.parse(data)); },
    // });
}
// Создание кнопок Отменить и Добавить
function createCT(id, values = 'empty') {
    // id - id кнопки
    $('#createCT').empty();
    if (id == 'addContact') {
        $('#createCT').append(createContactsForm());
        $('#client_new').prop('checked', true);
    } else if (id == 'addTask') {
        if (values === 'empty') values = {task_type: '', task_whom: '', task_who: '', task_date: '', task_time: '', task_comment: ''}
        $('#createCT').append(createContactsFormTask(values));
        $('#task_date').datepicker({minDate: new Date(), position: 'left top'})
    }
    //$('#task_type').attr('onchange', 'selectTypeTask()')
    $('#task_type').append(`
        <option selected value="email">Письмо</option>
        <option value="phone">Звонок</option>
    `)
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

function convertName(username) {
    username = username.split(' ');
    username[0] = username[0][0];
    username[0] += '.';
    return username.reverse().join(' ');
}