from app import app, models, db
from flask import send_from_directory
from datetime import datetime
from docx import Document
import os


def Generate_Account(f, date, dir_u, info, owner):
    html = render_template('Dogovor.html')
    f.close()
    return send_from_directory(directory=dir_u, filename='{}.pdf'.format(owner.__tablename__ + str(owner.id)))


def Generate_DogovorNaDostavku(f, date, dir_u, info, owner):
    html = render_template('Dogovor.html')
    f.close()
    return send_from_directory(directory=dir_u, filename='{}.pdf'.format(owner.__tablename__ + str(owner.id)))


def Generate_Dogovor(f, dir_u, info, owner, date):
    document = models.Document()
    document.MonthNum = document.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)
    document.UHH = owner.UHH
    if owner.Bik:
        document.Bik = owner.Bik
    else:
        document.Bik = ''
    document.KPP = info['data']['kpp']
    if owner.rc:
        document.rc = owner.rc
    else:
        document.rc = ''
    if owner.kc:
        document.kc = owner.kc
    else:
        document.kc = ''

    document.Owner_id = owner.id
    document.Client_prefix_address = owner.Adress
    document.Client_name = owner.Name
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data']['postal_box']

    db.session.add(document)
    db.session.commit()

    html = render_template('Dogovor.html', document=document, date=date)
    pypandoc.convert(source=html, format='html', to='docx',
                              outputfile=os.path.dirname(__file__) + '/upload/{}.docx'.format(owner.__tablename__ + str(owner.id)))
    f.close()
    print(document.__dict__)
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id)))


def Generate_Zayavka(f, date, dir_u, info, owner):
    html = render_template('Zayavka.html')
    f.close()
    return send_from_directory(directory=dir_u, filename='{}.pdf'.format(owner.__tablename__ + str(owner.id)))

