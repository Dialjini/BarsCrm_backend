from flask import send_from_directory
import openpyxl

alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

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

    print(data)


    wb.save('test.xlsx')

    return 'ok'

def secondScenario(data):
    return 'ok'

def thirdScenario(data):
    return 'ok'

def fourthScenario(data):
    return 'ok'

def fifthScenario(data):
    return 'ok'

def sixthScenario(data):
    return 'ok'

def createExel(id, data):
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

