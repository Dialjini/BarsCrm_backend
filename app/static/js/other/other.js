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
                    url: '/getThisUser',
                    type: 'GET',
                    dataType: 'html',
                    success: function(thisUser) {
                        let user = JSON.parse(thisUser);
                        $.ajax({
                            url: '/getUsers',
                            type: 'GET',
                            dataType: 'html',
                            success: function(data) {
                                data = JSON.parse(data);
                                if (user.role == 'admin') {
                                    for (let i = 0; i < data.length; i++) {
                                        $('#task_whom').append(`
                                            <option value="${data[i].id}">${data[i].second_name}</option>
                                        `)
                                    }
                                } else {
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i].role == 'manager') {
                                            $('#task_whom').append(`
                                                <option value="${data[i].id}">${data[i].second_name}</option>
                                            `)
                                        }
                                    }
                                }
                                
                                $('#task_whom').append(`
                                    <option value="all">Всем</option>
                                `)
                            }
                        });
                    }
                })
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
                $('#tasks_list .empty').remove();
                $('#current_tasks').empty();
                $('#expired_tasks').empty();
                for (let i = 0; i < tasks.length; i++) {
                    function typeTask() {
                        if (tasks[i].Type == 'phone') return 'Звонок';
                        if (tasks[i].Type == 'email') return 'Письмо';
                        if (tasks[i].Type == 'other') return 'Другое';
                    }

                    let taskDate = tasks[i].Date.split('.');
                    if (taskDate[2].length > 2) {
                        taskDate[2] = taskDate[2].slice(2, 4)
                    }
                    let firstDate = `${taskDate.join('.')} ${tasks[i].Time}`;
                    let secondDate = `${getCurrentDate('year')} ${getCurrentTime()}`;

                    let datetime_regex = /(\d\d)\.(\d\d)\.(\d\d)\s(\d\d):(\d\d)/;

                    let first_date_arr = datetime_regex.exec(firstDate);
                    let first_datetime = new Date(first_date_arr[3], first_date_arr[2], first_date_arr[1], first_date_arr[4], first_date_arr[5]);

                    let second_date_arr = datetime_regex.exec(secondDate);
                    let second_datetime = new Date(second_date_arr[3], second_date_arr[2], second_date_arr[1], second_date_arr[4], second_date_arr[5]);
                    if (first_datetime.getTime() > second_datetime.getTime()) {
                        let mark = tasks[i].Admin ? 'mark' : '';
                        $('#tasks_list .empty').remove();
                        $('#current_tasks').prepend(
                            $('<div>', {
                                class: 'item ' + mark,
                                name: `task_${tasks[i].Task_id}`,
                                onclick: `completeTask(this)`,
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
                    } else {
                        $('#tasks_list_e .empty').remove();
                        $('#expired_tasks').prepend(
                            $('<div>', {
                                class: 'item',
                                name: `task_${tasks[i].Task_id}`,
                                onclick: `completeTask(this)`,
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
                }
            } else {
                taskInfo = {
                    task_type: $('#task_type').val(),
                    task_whom: [$('#task_whom').val()],
                    task_who: data.id,
                    task_date: $('#task_date').val(),
                    task_time: $('#task_time').val(),
                    task_comment: $('#task_comment').val(),
                }
                let date = $('#task_date').val();
                let time = $('#task_time').val();

                try {
                    if (date.split('.').length != 3) {
                        return alert('Введите дату в формате дд.мм.гггг или дд.мм.гг')
                    }
                    if (time == '') {
                        taskInfo.task_time = '00:00'
                    }
                } catch {
                    return alert('Проверьте введенные данные!')
                }
                $('#tasks_list .empty').remove();
                $('#current_tasks').empty();
                $('#expired_tasks').empty();
                socket.emit('addTask', {data: taskInfo});
                function typeTask() {
                    if (taskInfo.task_type == 'phone') return 'Звонок';
                    if (taskInfo.task_type == 'email') return 'Письмо';
                    if (taskInfo.task_type == 'other') return 'Другое';
                }
                if ($('#task_whom').val() == data.id) {
                    $('#current_tasks').append(
                        $('<div>', {
                            class: 'item',
                            name: `task_new`,
                            onclick: `completeTask(this)`,
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
            if ($('#current_tasks').children().length == 0) {
                $('#tasks_list .empty').remove();
                $('#tasks_list').append(`<div class="empty">Нет задач</div>`);
            }
            if ($('#expired_tasks').children().length == 0) {
                $('#tasks_list_e .empty').remove();
                $('#tasks_list_e').append(`<div class="empty">Нет просроченных задач</div>`);
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
function completeTask(element) {
    let id = $(element).attr('name').split('_');
    createCT('completeTask', id[1]);
}

function createCompleteForm(value) {
    return `
        <div class="create_empty_card mr">
            <div class="title mra">Задача выполнена?</div>
            <div class="select">
                <button class="btn" id="${value}" onclick="removeTask(this.id)">Да</button>
                <button class="btn btn-main" id="${value}" onclick="createCTButtons()">Нет</button>
            </div>
        </div>
    `
}

function removeTask(id) {
    for (let element of $('#current_tasks .item')) {
        $('#current_tasks').empty();
        break;
    }
    for (let element of $('#expired_tasks .item')) {
        $('#expired_tasks').empty();
        break;
    }
    socket.emit('delete_task', {data: id})
    if ($('#current_tasks').children().length == 0) {
        $('#tasks_list .empty').remove();
        $('#tasks_list').append(`<div class="empty">Нет задач</div>`);
    }
    if ($('#expired_tasks').children().length == 0) {
        $('#tasks_list_e .empty').remove();
        $('#tasks_list_e').append(`<div class="empty">Нет просроченных задач</div>`);
    }
    createCTButtons();
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
        $('#task_date').datepicker({minDate: new Date(), position: 'left top', autoClose: true})
    } else if (id == 'completeTask') {
        $('#createCT').append(createCompleteForm(values));
    }
    //$('#task_type').attr('onchange', 'selectTypeTask()')
    $('#task_type').append(`
        <option selected value="email">Письмо</option>
        <option value="phone">Звонок</option>
        <option value="other">Другое</option>
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
        createRegionMenu();
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