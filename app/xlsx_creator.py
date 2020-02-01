from flask import send_from_directory
import openpyxl

alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
            'W', 'X', 'Y', 'Z']

def getLetter(num):
    letter = ''
    while int(num) > 0:
        letter += alphabet[(int(num) % 26 - 1)]
        num /= 26

    return letter[::-1].replace('AZ', 'Z')

def firstScenario(data):
    wb = openpyxl.Workbook()
    sheet = wb.active
    sheet['A1'].value = 'Товар'
    sheet['B1'].value = 'Клиент'
    sheet['C1'].value = 'Объем, кг.'
    sheet['D1'].value = 'Цена, руб.'
    sheet['E1'].value = 'Доставка'
    sheet['F1'].value = 'Привет'
    sheet['G1'].value = 'Себестоимость'
    sheet['H1'].value = 'Закупочная цена'
    sheet['I1'].value = 'Заработали'
    sheet['J1'].value = 'Прибыль'
    column_counter = 1
    for i in data:
        column_counter += 1
        for j in range(10):
            sheet[alphabet[j] + str(column_counter)].value = list(i.values())[j]

    wb.save('app/upload/last_stat.xlsx')

    return '/upload'

def secondScenario(data):
    print(data)

    wb = openpyxl.Workbook()
    sheet = wb.active
    sheet['A1'].value = 'Товар'
    # for i in data[0]:
    wb.save('app/upload/last_stat.xlsx')

    return '/upload'

def thirdScenario(data):
    print(data)
    return '/upload'

def fourthScenario(data):
    wb = openpyxl.Workbook()
    sheet = wb.active
    sheet['A1'].value = 'Клиент'
    sheet['B1'].value = 'Объем'
    sheet['C1'].value = 'Сколько'
    sheet['D1'].value = 'Сумма, руб.'
    sheet['E1'].value = 'Итого'

    column_counter = 1
    for i in data:
        column_counter += 1
        for j in range(5):
            sheet[alphabet[j] + str(column_counter)].value = list(i.values())[j]

    wb.save('app/upload/last_stat.xlsx')
    return '/upload'

def fifthScenario(data):
    print(data)
    return '/upload'

def sixthScenario(data):
    print(data)
    return '/upload'

def createExel(id, data):
    print('HERE', id)
    if int(id) == 0:
        return firstScenario(data)
    if int(id) == 1:
        return secondScenario(data)
    if int(id) == 2:
        return thirdScenario(data)
    if int(id) == 3:
        return fourthScenario(data)
    if int(id) == 4:
        return fifthScenario(data)
    if int(id) == 5:
        return sixthScenario(data)

    return 'ok'

