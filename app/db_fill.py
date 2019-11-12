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
    table = parent_table.Contacts
    i = col + 1
    while(sheet['A' + str(i)] == None):
        table.Position = sheet['B' + str(i)]
        table.Name = sheet['C' + str(i)]
        table.Number = sheet['D' + str(i)]
        table.Email = sheet['E' + str(i)]
        table.Comment = sheet['F' + str(i)]
        table.Department = sheet['G' + str(i)]
        table.Group = sheet['H' + str(i)]
        table.Manager = sheet['I' + str(i)]
        table.Date = sheet['J' + str(i)]
        table.Birthday = sheet['K' + str(i)]

        i = i + 1
        db.session.add(table)
        db.session.commit()

def get_clients_notes(sheet, parent_table, col):
    i = col + 1
    table = parent_table.Notes
    while(sheet['A' + str(i)] == None):
        if sheet['B' + str(i)] == '+':
            table.Done = True
        else:
            table.Done = False

        table.Type = sheet['C' + str(i)]
        table.Date = sheet['D' + str(i)]
        table.Note = sheet['E' + str(i)]
        table.Manager = sheet['F' + str(i)]
        table.File_Path = sheet['H' + str(i)]

        i = i + 1
        db.session.add(table)
        db.session.commit()

    if(sheet['A' + str(i)] == 'Контактные лица'):
        get_clients_contacts(sheet=sheet, parent_table=table, col=i)

def get_client_from_xlsx(sheet, table, col=1):
    for i in range(col, 495):
        if(sheet['A'+str(i)] == 'Компания'):
            table.Date = sheet['B'+str(i + 1)]
            table.Name = sheet['C'+str(i + 1)]
            table.Number = sheet['D'+str(i + 1)]
            table.Faks = sheet['E' + str(i + 1)]
            table.Adress = sheet['F'+str(i + 1)]
            table.Manager = sheet['I' + str(i + 1)]
            table.Oblast = sheet['J' + str(i + 1)]
            table.Rayon = sheet['K' + str(i + 1)]
            table.Source = sheet['L' + str(i + 1)]
            table.Source2 = sheet['M' + str(i + 1)]
            table.Segment = sheet['N' + str(i + 1)]
            table.Segment2 = sheet['O' + str(i + 1)]
            table.Status = sheet['P' + str(i + 1)]
            table.Description = sheet['Q' + str(i + 1)]

            if (sheet['A'+str(i + 2)] == 'История'):
                get_clients_notes(sheet=sheet, parent_table=table, col= i + 2)
            if (sheet['A' + str(i + 2)] == 'Контактные лица'):
                get_clients_contacts(sheet=sheet, parent_table=table, col = i + 2)

def add_client_from_xlsx():
    sheet = openpyxl.load_workbook('app/files/book2Irkutsk.xlsx').active
    table = models.Client
    table = get_client_from_xlsx(col=1,sheet=sheet, table=table)
    db.session.add(table)
    db.session.commit()
get_client_from_xlsx()
