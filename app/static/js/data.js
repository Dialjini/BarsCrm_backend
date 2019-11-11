const username = convertName();

// Данные по подкатегории 'Клиенты' категории 'Список' (Название, Таблица с данными)
const categoryInListClient = [
    { id: 'client', name: 'Список', active: true, lastCard: [null, null] },
    [
        [
            { name: 'Код', width: 1 },
            { name: 'Название', width: 20 },
            { name: 'Область', width: 15 },
            { name: 'Район', width: 20 },
            { name: 'Категория', width: 15 },
            { name: 'Менеджер', width: 10 }
        ],
        ['46011', 'OOO Лютик', 'Новосибирская', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46012', 'OOO Цветик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Петров'],
        ['46013', 'OOO Семицветик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Кустов'],
        ['46014', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Ершов'],
        ['46015', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Ерманенко'],
        ['46016', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Мухамеднурова'],
        ['46017', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46018', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46019', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46020', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46021', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46022', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46023', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46024', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46025', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46026', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46027', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46028', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46029', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46030', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46031', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46032', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46033', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46034', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46035', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров'],
        ['46036', 'OOO Лютик', 'Xxxxx xxxxxx', 'ул. Пушкина, д. Колотушкина', 'Xxxxx xxxxxxxxx', 'Сидоров']
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
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
        ['Новосибирская', 'Новосибирский', 'ООО Лютик', 'Xxxxx Xxxxxxx', '1500', 'Сидоров'],
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
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
        ['ООО Лютик', 'Новосибирская', 'Новосибирский', '15 т', 'Брат все сделает', 'Сидоров'],
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
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
        ['ООО', 'ООО Лютик', '10.10.19', '10', '1500', '1300', '200', 'Сидоров'],
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
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ИП', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ЗАО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
        ['ООО', '10.10.19', 'ООО Лютик', '1500', 'Оплачено', 'Привет', 'Сидоров'],
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
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш', 'И его брат', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'А этот Ваш', 'А еще и Наш брат', 'ООО', '102000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '50000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
        ['10.10.19', 'ООО Лютик', 'Склад Наш и Ваш', 'Мой брат перевезет', 'ООО', '10000', '5000', '15.10.19'],
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
        ['Мыльное и рыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['У нас тут обед', 'Картошечка', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Будет', 'С макарошками', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['И с котлетками', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
        ['Мыльное', 'Мыло', 'ООО', '15 т', 'Мой брат все сделает', '20', '15000', 'Склад Наш и Ваш'],
    ]
]

// Данные по категории 'Аналитика' (Название, Таблица с данными)
const categoryInAnalytics = [
    { id: 'analytics', name: 'Аналитика', active: true },
]

const dataName = [
    { name: 'client', link: categoryInListClient },
    { name: 'provider', link: categoryInListProvider },
    { name: 'carrier', link: categoryInListCarrier },
    { name: 'debit', link: categoryInFinanceDebit },
    { name: 'account', link: categoryInFinanceAccount },
    { name: 'delivery', link: categoryInDelivery },
    { name: 'stock', link: categoryInStock },
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
        { id: 'delivery-clear', objectName: categoryInDelivery, name: 'Добавить Доставку', class: 'btn btn-main btn-div' }
    ],
    [
        'Склад',
        { id: 'unknown', objectName: categoryInStock, name: 'Товар', class: 'fieldStock' },
        { id: 'unknown', objectName: categoryInStock, name: 'Фасовка', class: 'fieldStock' },
        { id: 'unknown', objectName: categoryInStock, name: 'Объем', class: 'fieldStock' },
        { id: 'unknown', objectName: categoryInStock, name: 'Склад', class: 'fieldStock' },
    ],
    [
        'Аналитика'
    ]
];

// Регионы и их районы, с которыми работает компания
const regions = [
    { name: 'Алтайский край', areas: ['Баевскиц район', 'Благовещенский район', 'Михайловский район', 'Третьяковский район', 'Солонешенский районе'] },
    { name: 'Новосибирская область', areas: ['Новосибирский район', 'Коченевский район', 'Ордынский район', 'Красноозерский район', 'Колыванский район'] },
]

// Данные по кнопкам меню, для перехода на соответствующую категорию
const linkCategoryInfo = [
    { id: 'category-0', src: 'images/list.png', name: 'Рабочий стол', subcategories: [categoryInListClient, categoryInListProvider, categoryInListCarrier], number: 0, subid: ['client', 'provider', 'carrier'] }, // name: getName() { if (.active) input else break}
    { id: 'category-1', src: 'images/fin.png', name: 'Финансы', subcategories: [categoryInFinanceDebit, categoryInFinanceAccount], number: 1, subid: ['debit', 'account'] },
    { id: 'category-2', src: 'images/delivery.png', name: 'Доставка', subcategories: [categoryInDelivery], number: 2, subid: ['delivery'] },
    { id: 'category-3', src: 'images/stock.png', name: 'Склад', subcategories: [categoryInStock], number: 3, subid: ['stock'] },
    { id: 'category-4', src: 'images/analytics.png', name: 'Аналитика', subcategories: [categoryInAnalytics], number: 4, subid: ['analytics'] },
];

// Данные по вкладке "Добавить контакт"
const contactsFormInfo = [
    { id: 'client-clear', name: 'Клиент' },
    { id: 'provider-clear', name: 'Поставщик' },
    { id: 'carrier-clear', name: 'Перевозчик' }
];