const username = convertName();

// Данные по подкатегории 'Клиенты' категории 'Список' (Название, Таблица с данными)
const categoryInListClient = [
    { id: 'client', name: 'Список', active: true, lastCard: [null, null] },
    [
        [
            { name: 'Код', width: 5 },
            { name: 'Название', width: 20 },
            { name: 'Область', width: 15 },
            { name: 'Район', width: 20 },
            { name: 'Категория', width: 15 },
            { name: 'Менеджер', width: 10 }
        ],
    ]
]

// Данные по подкатегории 'Поставщики' категории 'Список' (Название, Таблица с данными)
const categoryInListProvider = [
    { id: 'provider', name: 'Список', active: false, lastCard: [null, null] },
    [
        [
            { name: 'Область', width: 20 },
            { name: 'Район', width: 20 },
            { name: 'Наименование', width: 20 },
            { name: 'Группа товаров', width: 15 },
            { name: 'Цена', width: 10 },
            { name: 'Менеджер', width: 15 },
        ],
    ]
]

// Данные по подкатегории 'Перевозчики' категории 'Список' (Название, Таблица с данными)
const categoryInListCarrier = [
    { id: 'carrier', name: 'Список', active: false, lastCard: [null, null] },
    [
        [
            { name: 'Наименование', width: 25 },
            { name: 'Область', width: 15 },
            { name: 'Район', width: 15 },
            { name: 'Груз.', width: 5 },
            { name: 'Вид перевозки', width: 15 },
            { name: 'Менеджер', width: 15 },
        ],
    ]
]

// Данные по подкатегории 'Дебит' категории 'Финансы' (Название, Таблица с данными)
const categoryInFinanceDebit = [
    { id: 'debit', name: 'Финансы', active: true, lastCard: [null, null] },
    [
        [
            { name: 'Юр. лицо', width: 5 },
            { name: 'Наименование', width: 20 },
            { name: 'Дата отгрузки', width: 5 },
            { name: 'Дней отсрочки', width: 5 },
            { name: 'Сумма', width: 5 },
            { name: 'Оплачено', width: 5 },
            { name: 'Осталось', width: 5 },
            { name: 'Менеджер', width: 10 },
        ],
    ]
]

// Данные по подкатегории 'Счета' категории 'Финансы'(Название, Таблица с данными)
const categoryInFinanceAccount = [
    { id: 'account', name: 'Финансы', active: false, lastCard: [null] },
    [
        [
            { name: 'Юр. лицо', width: 5 },
            { name: 'Дата выставления', width: 10 },
            { name: 'Наименование', width: 30 },
            { name: 'Сумма', width: 10 },
            { name: 'Статус', width: 10 },
            { name: 'Приветы', width: 10 },
            { name: 'Менеджер', width: 10 },
        ],
    ]
]

// Данные по категории 'Доставка' (Название, Таблица с данными)
const categoryInDelivery = [
    { id: 'delivery', name: 'Доставка', active: true, lastCard: [null] },
    [
        [
            { name: 'Дата', width: 5 },
            { name: 'Наименование', width: 20 },
            { name: 'Склад', width: 15 },
            { name: 'Перевозчик', width: 15 },
            { name: 'Юр. лицо', width: 5 },
            { name: 'Цена с НДС', width: 10 },
            { name: 'Цена без НДС', width: 10 },
            { name: 'Дата оплаты', width: 5 },
        ],
    ]
]

// Данные по категории 'Склад' (Название, Таблица с данными)
const categoryInStock = [
    { id: 'stock', name: 'Склад', active: true, lastCard: [null, null] },
    [
        [
            { name: 'Группа товаров', width: 15 },
            { name: 'Товар', width: 15 },
            { name: 'Юр. лицо', width: 5 },
            { name: 'Объем', width: 5 },
            { name: 'Фасовка', width: 15 },
            { name: 'НДС', width: 5 },
            { name: 'Цена прайса', width: 5 },
            { name: 'Склад', width: 15 },
        ],
    ]
]

// Данные по категории 'Аналитика' (Название, Таблица с данными)
const categoryInAnalytics = [
    { id: 'analytics', name: 'Аналитика', active: true, lastCard: [] },
]

const dataName = [
    { name: 'client', link: categoryInListClient },
    { name: 'provider', link: categoryInListProvider },
    { name: 'carrier', link: categoryInListCarrier },
    { name: 'debit', link: categoryInFinanceDebit },
    { name: 'account', link: categoryInFinanceAccount },
    { name: 'delivery', link: categoryInDelivery },
    { name: 'stock', link: categoryInStock },
    { name: 'analytics', link: categoryInAnalytics },
]

// Данные по подкатегориям, для генерации соответствующей таблицы и перехода по нужным подкатегориям
const subcategoryButtons = [
    [
        'Список',
        { id: 'clientButton', objectName: categoryInListClient, name: 'Клиенты', class: 'field' },
        { id: 'providerButton', objectName: categoryInListProvider, name: 'Поставщики', class: 'field' },
        { id: 'carrierButton', objectName: categoryInListCarrier, name: 'Перевозчики', class: 'field' },
    ],
    [
        'Финансы',
        { id: 'debitButton', objectName: categoryInFinanceDebit, name: 'Дебеторка', class: 'field' },
        { id: 'accountButton', objectName: categoryInFinanceAccount, name: 'Счета', class: 'field' },
        //{ id: 'unknown', objectName: simpleObject, name: `Осталось <span class="gray">${categoryInFinanceAccount[1].length - 1}</span> счета на <span class="green">+ 234 000</span> за месяц`, class: 'info_about_accounts' }
    ],
    [
        'Доставка',
        { id: 'delivery_new', objectName: categoryInDelivery, name: 'Добавить Доставку', class: 'btn btn-main btn-div' }
    ],
    [
        'Склад',
        { id: 'stock_product', objectName: categoryInStock, name: 'Товар', class: 'field_with_modal' },
        { id: 'stock_packing', objectName: categoryInStock, name: 'Фасовка', class: 'field_with_modal' },
        { id: 'stock_volume', objectName: categoryInStock, name: 'Объем', class: 'field_with_modal' },
        { id: 'stock_stock', objectName: categoryInStock, name: 'Склад', class: 'field_with_modal' },
    ],
    [
        'Аналитика',
        { id: 'analytics_reports', objectName: categoryInAnalytics, name: 'Прибыль по клиентам', class: 'field_with_modal' },
        { id: 'analytics_period', objectName: categoryInAnalytics, name: 'Период', class: 'field_with_modal' },
    ]
];

// Регионы и их районы, с которыми работает компания
const regions = [
    { name: 'Алтайский край', areas: ['Баевскиц район', 'Благовещенский район', 'Михайловский район', 'Третьяковский район', 'Солонешенский районе'] },
    { name: 'Новосибирская область', areas: ['Новосибирский район', 'Коченевский район', 'Ордынский район', 'Красноозерский район', 'Колыванский район'] },
]

// Данные по кнопкам меню, для перехода на соответствующую категорию
const linkCategoryInfo = [
    { id: 'category-0', src: 'static/images/list.png', name: 'Рабочий стол', subcategories: [categoryInListClient, categoryInListProvider, categoryInListCarrier], number: 0, subid: ['client', 'provider', 'carrier'] }, // name: getName() { if (.active) input else break}
    { id: 'category-1', src: 'static/images/fin.png', name: 'Финансы', subcategories: [categoryInFinanceDebit, categoryInFinanceAccount], number: 1, subid: ['debit', 'account'] },
    { id: 'category-2', src: 'static/images/delivery.png', name: 'Доставка', subcategories: [categoryInDelivery], number: 2, subid: ['delivery'] },
    { id: 'category-3', src: 'static/images/stock.png', name: 'Склад', subcategories: [categoryInStock], number: 3, subid: ['stock'] },
    { id: 'category-4', src: 'static/images/analytics.png', name: 'Аналитика', subcategories: [categoryInAnalytics], number: 4, subid: ['analytics'] },
];

// Данные по вкладке "Добавить контакт"
const contactsFormInfo = [
    { id: 'client_new', name: 'Клиент' },
    { id: 'provider_new', name: 'Поставщик' },
    { id: 'carrier_new', name: 'Перевозчик' }
];

const idCardFields = [
    {   
        name: 'client', ids:
        ['client_name', 'client_area', 'client_region', 'client_address', 'client_inn',
        'client_tag', 'client_category', 'client_station', 'client_price', 'client_distance', 'client_industry'],
        request: '/addClient'
    },
    {   
        name: 'provider', ids:
        ['provider_name', 'provider_area', 'provider_region', 'provider_address', 'provider_inn',
        'provider_tag', 'provider_category', 'provider_station', 'provider_price', 'provider_distance', 'provider_volume', 'provider_vat', 'provider_merc'],
        request: '/addProvider'
    },
    {   
        name: 'carrier', ids:
        ['carrier_name', 'carrier_area', 'carrier_region', 'carrier_address', 'carrier_inn', 'carrier_capacity', 'carrier_view'],
        request: '/addCarrier'
    },
    {   
        name: 'delivery', ids:
        ['delivery_customer', 'delivery_shipment', 'delivery_unloading', 'delivery_way', 'delivery_carrier', 'delivery_driver',
        'delivery_view', 'delivery_comment', 'delivery_client', 'delivery_contact']
    },
]