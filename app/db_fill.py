from app import models, db
import json
from xhtml2pdf import pisa
from io import StringIO, BytesIO
from xhtml2pdf.config.httpconfig import httpConfig
import xlsxwriter
import xlrd
import openpyxl
from openpyxl.styles.borders import Border, Side, BORDER_THIN, BORDER_NONE, BORDER_MEDIUM, DEFAULT_BORDER


def get_clients_contacts(sheet, parent_table, col):
    i = col + 1
    while(sheet['A' + str(i)].value == None):
        table = models.Contacts()
        table.Position = sheet['B' + str(i)].value
        table.Name = sheet['C' + str(i)].value
        table.Number = sheet['D' + str(i)].value
        table.Email = sheet['E' + str(i)].value
        table.Comment = sheet['F' + str(i)].value
        table.Department = sheet['G' + str(i)].value
        table.Group = sheet['H' + str(i)].value
        table.Manager = sheet['I' + str(i)].value
        table.Date = sheet['J' + str(i)].value
        table.Birthday = sheet['K' + str(i)].value
        table.Owner = parent_table
        i = i + 1

        parent_table.Contacts.append(table)

    return parent_table.Contacts

def get_clients_notes(sheet, parent_table, col):

    i = col + 1
    while(sheet['A' + str(i)].value == None):
        table = models.Notes()
        if sheet['B' + str(i)].value == '+':
            table.Done = True
        else:
            table.Done = False

        table.Type = sheet['C' + str(i)].value
        table.Date = sheet['D' + str(i)].value
        table.Note = sheet['E' + str(i)].value
        table.Manager = sheet['F' + str(i)].value
        table.File_Path = sheet['H' + str(i)].value
        table.Author = parent_table
        i = i + 1
        parent_table.Notes.append(table)

    if(sheet['A' + str(i)] == 'Контактные лица'):
        parent_table.Contacts = get_clients_contacts(sheet=sheet, parent_table=parent_table, col=i)

    return {'notes': parent_table.Notes, 'contacts': parent_table.Contacts}

def get_client_from_xlsx(sheet, parent_table, col=1):
    for i in range(col, sheet.max_row):
        if(sheet['A'+str(i)].value == 'Компания'):
            table = parent_table()
            table.Date = sheet['B'+str(i + 1)].value
            table.Name = sheet['C'+str(i + 1)].value
            table.Number = sheet['D'+str(i + 1)].value
            table.Faks = sheet['E' + str(i + 1)].value
            table.Adress = sheet['F'+str(i + 1)].value
            table.Manager = sheet['I' + str(i + 1)].value
            table.Oblast = sheet['J' + str(i + 1)].value
            table.Rayon = sheet['K' + str(i + 1)].value
            table.Source = sheet['L' + str(i + 1)].value
            table.Source2 = sheet['M' + str(i + 1)].value
            table.Segment = sheet['N' + str(i + 1)].value
            table.Segment2 = sheet['O' + str(i + 1)].value
            table.Status = sheet['P' + str(i + 1)].value
            table.Description = sheet['Q' + str(i + 1)].value

            print(table.__dict__)

            if (sheet['A'+str(i + 2)].value == 'История'):
                result = get_clients_notes(sheet=sheet, parent_table=table, col=i + 2)
                print(result)
                table.Notes = result['notes']
                if str(result['contacts']) != '[]':
                    table.contacts = result['contacts']

            if (sheet['A' + str(i + 2)].value == 'Контактные лица'):
                table.contacts = get_clients_contacts(sheet=sheet, parent_table=table, col=i + 2)

            print(table)
            db.session.add(table)
            db.session.commit()

def add_client_from_xlsx():
    sheet = openpyxl.load_workbook('app/files/book2Irkutsk.xlsx').active
    table = models.Client
    get_client_from_xlsx(col=1,sheet=sheet, parent_table=table)



def table_to_json(query):
    result = []
    for i in query:
        subres = i.__dict__
        subres.pop('_sa_instance_state', None)
        result.append(subres)
    return result

add_client_from_xlsx()

# print(models.Client.query.all()[0].Notes.query.all()[0].__dict__)
# print(table_to_json(models.Client.query.all()))


#print(models.Client().Notes.all())
