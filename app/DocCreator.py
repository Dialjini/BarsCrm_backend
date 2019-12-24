from app import app, models, db
from flask import send_from_directory
from datetime import datetime, timedelta
from docx import Document
import os
import json
from num2t4ru import num2text


def replace_request(words, replacements, doc):
    for j in range(0, len(words)):
        for i in doc.tables[0]._cells:
            if words[j] in i.text:
                i.text = i.text.replace(str(words[j]), str(replacements[j]))
    return doc


def replace_doc(words, replacements, doc):
    for j in range(0, len(words)):
        for i in doc.paragraphs:
            if words[j] in i.text:
                i.text = i.text.replace(str(words[j]), str(replacements[j]))
        try:
            if words[j] in doc.tables[0].cell(0, 1).text:
                doc.tables[0].cell(0, 1).text = doc.tables[0].cell(0, 1).text.replace(str(words[j]), str(replacements[j]))
        except Exception:
            continue
    return doc


def Generate_DogovorNaDostavkuOOO(dir_u, info, owner, date):
    document = models.Document()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)

    document.Prefix = 'ООО'
    document.UHH = owner.UHH
    document.Owner_type = owner.__tablename__
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

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + \
                                   info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data'][
            'postal_box']

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()
    rate = datetime.now() + timedelta(days=7)
    doc = Document(os.path.dirname(__file__) + '/files/Dogovor_mezhdu_OOO_Bars_i_perevozchikom.docx')
    doc = replace_doc(doc=doc, words=['document.MonthNum', 'document.Date', 'date.d', 'date.m', 'date.y',
                                      'document.Client_contact_name', 'rate.day', 'rate.month', 'rate.year',
                                      'document.Client_name', 'document.Client_prefix_address',
                                      'document.Client_mail_address', 'document.UHH', 'document.KPP', 'document.rc',
                                      'document.kc', 'document.Bik'],
                      replacements=[document.MonthNum, document.Date, date.d, date.m, date.y,
                                    document.Client_contact_name,
                                    rate.day, rate.month, rate.year, document.Client_name,
                                    document.Client_prefix_address, document.Client_mail_address, document.UHH,
                                    document.KPP,
                                    document.rc, document.kc, document.Bik])
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))



def Generate_DogovorNaDostavkuIP(dir_u, info, owner, date):
    document = models.Document()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)

    document.Prefix = 'ИП'
    document.UHH = owner.UHH
    document.Owner_type = owner.__tablename__
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

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + \
                                   info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data'][
            'postal_box']

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()
    rate = datetime.now() + timedelta(days=7)
    doc = Document(os.path.dirname(__file__) + '/files/DOGOVOR_mezhdu_IP_i_perevozchikom.docx')
    doc = replace_doc(doc=doc, words=['document.MonthNum', 'document.Date', 'date.d', 'date.m', 'date.y',
                                      'document.Client_contact_name', 'rate.day', 'rate.month', 'rate.year',
                                      'document.Client_name', 'document.Client_prefix_address',
                                      'document.Client_mail_address', 'document.UHH', 'document.KPP', 'document.rc',
                                      'document.kc', 'document.Bik'],
                      replacements=[document.MonthNum, document.Date, date.d, date.m, date.y,
                                    document.Client_contact_name,
                                    rate.day, rate.month, rate.year, document.Client_name,
                                    document.Client_prefix_address, document.Client_mail_address, document.UHH,
                                    document.KPP,
                                    document.rc, document.kc, document.Bik])
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))


def Generate_Dogovor_na_tovari_ooo(dir_u, info, owner, date):
    document = models.Document()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)

    document.Prefix = 'ООО'
    document.UHH = owner.UHH
    document.Owner_type = owner.__tablename__
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

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data']['postal_box']

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()

    rate = datetime.now() + timedelta(days=7)
    doc = Document(os.path.dirname(__file__) + '/files/Образец_Договора_на_товары.docx')
    doc = replace_doc(doc=doc, words=['document.MonthNum', 'document.Date', 'date.d', 'date.m', 'date.y',
                                'document.Client_contact_name', 'rate.day', 'rate.month', 'rate.year',
                                'document.Client_name', 'document.Client_prefix_address',
                                'document.Client_mail_address', 'document.UHH', 'document.KPP', 'document.rc',
                                'document.kc', 'document.Bik'],
                replacements=[document.MonthNum, document.Date, date.d, date.m, date.y, document.Client_contact_name,
                              rate.day, rate.month, rate.year, document.Client_name,
                              document.Client_prefix_address, document.Client_mail_address, document.UHH, document.KPP,
                              document.rc, document.kc, document.Bik])
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))


def Generate_Dogovor_na_tovari_ip(dir_u, info, owner, date):
    document = models.Document()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)
    document.Prefix = 'ИП'

    document.Owner_type = owner.__tablename__
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

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data']['postal_box']

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()
    rate = datetime.now() + timedelta(days=7)
    doc = Document(os.path.dirname(__file__) + '/files/ДОГОВОР орион.docx')
    doc = replace_doc(doc=doc, words=['document.MonthNum', 'document.Date', 'date.d', 'date.m', 'date.y',
                                'document.Client_contact_name', 'rate.day', 'rate.month', 'rate.year',
                                'document.Client_name', 'document.Client_prefix_address',
                                'document.Client_mail_address', 'document.UHH', 'document.KPP', 'document.rc',
                                'document.kc', 'document.Bik'],
                replacements=[document.MonthNum, document.Date, date.d, date.m, date.y, document.Client_contact_name,
                              rate.day, rate.month, rate.year, document.Client_name,
                              document.Client_prefix_address, document.Client_mail_address, document.UHH, document.KPP,
                              document.rc, document.kc, document.Bik])
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))


def Generate_Zayavka_OOO(dir_u, info, owner, date, delivery):
    document = models.Document()
    delivery = models.Delivery.query.filter_by(id=delivery).first()
    Client = models.Client.query.filter_by(Name=delivery.Client).first()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)
    account = models.Account.query.filter_by(id=delivery.Account_id).first()

    document.UHH = owner.UHH
    document.Owner_type = owner.__tablename__
    document.Prefix = 'ООО'

    document.Bik = ''
    document.KPP = info['data']['kpp']
    document.rc = ''
    document.kc = ''

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.KPP = info['data']['kpp']
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data']['postal_box']

    Items = models.Item.query.all()
    item_info = {'mass': 0}
    for i in Items:
        if str(i.Item_id) in json.loads(delivery.item_ids):
            item_info['mass'] = item_info['mass'] + i.Weight
            item_info['packing'] = i.Packing

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()

    doc = Document(os.path.dirname(__file__) + '/files/Zayavka_OOO.docx')
    doc = replace_doc(doc=doc, words=['document.Date', 'date.d', 'date.m', 'date.y',
                                'document.Client_contact_name', 'document.Client_name'],
                replacements=[document.Date, date.d, date.m, date.y, document.Client_contact_name, document.Client_name])
    doc = replace_request(words=['{{Имя_клиента}}', '{{ИНН}}', '{{КПП}}', '{{Юр_адрес}}',
                                 '{{МаркаАвто}}', '{{Контакт водителя}}', '{{ПаспортныеДанныеВодителя}}',
                                 '{{Адрес_погрузки}}', '{{Контактное_лицо}}', '{{Наименование_грузополучателя}}',
                                 '{{Адрес_разгрузки}}', '{{Дата_и_время_разгрузки}}', '{{Контактное лицо на выгрузке}}',
                                 '{{Вес_груза}}', '{{Вид_упаковки}}', '{{Способ_погрузки}}', '{{Погрузка}}',
                                 '{{Разгрузка}}', '{{Сумма}}', '{{Сумма_словами}}'],
                          replacements=[document.Client_name, document.UHH, document.KPP,
                                        document.Client_prefix_address, delivery.Auto,
                                        delivery.Contact_Name + ', ' + delivery.Contact_Number, delivery.Passport_data,
                                        delivery.Stock, delivery.Contact_End, Client.Name, Client.Adress,
                                        delivery.End_date, delivery.Contact_End, str(item_info['mass']),
                                        item_info['packing'], delivery.Load_type, delivery.Date, delivery.End_date,
                                        str(account.Sum), num2text(account.Sum)], doc=doc)
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))



def Generate_Zayavka_IP(dir_u, info, owner, date, delivery):
    document = models.Document()
    delivery = models.Delivery.query.filter_by(id=delivery).first()
    Client = models.Client.query.filter_by(Name=delivery.Client).first()
    document.MonthNum = models.getMonthNum()
    document.Date = str(datetime.now().month) + '/' + str(datetime.now().year)
    account = models.Account.query.filter_by(id=delivery.Account_id).first()

    document.UHH = owner.UHH
    document.Owner_type = owner.__tablename__
    document.Prefix = 'ИП'
    document.Bik = ''
    document.KPP = info['data']['kpp']
    document.rc = ''
    document.kc = ''
    document.Prefix = 'ООО'

    document.Client_contact_name = info['data']['management']['name']
    document.Owner_id = owner.id
    try:
        document.Client_prefix_address = owner.Adress
    except Exception:
        document.Client_prefix_address = owner.Address
    document.Client_name = owner.Name
    document.KPP = info['data']['kpp']
    document.Client_mail_address = info['data']['address']['data']['postal_code'] + ', ' + info['data']['address']['data']['region_with_type']
    if info['data']['address']['data']['postal_box'] != None:
        document.Client_mail_address = document.Client_mail_address + ', ' + info['data']['address']['data']['postal_box']

    Items = models.Item.query.all()
    item_info = {'mass': 0}
    for i in Items:
        if str(i.Item_id) in json.loads(delivery.item_ids):
            item_info['mass'] = item_info['mass'] + i.Weight
            item_info['packing'] = i.Packing

    db.session.add(document)
    db.session.commit()
    document.Path = '{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id))
    db.session.commit()
    doc = Document(os.path.dirname(__file__) + '/files/Zayavka_IP.docx')
    doc = replace_doc(doc=doc, words=['document.Date', 'date.d', 'date.m', 'date.y',
                                'document.Client_contact_name', 'document.Client_name'],
                replacements=[document.Date, date.d, date.m, date.y, document.Client_contact_name, document.Client_name])
    doc = replace_request(words=['{{Имя_клиента}}', '{{ИНН}}', '{{КПП}}', '{{Юр_адрес}}',
                                 '{{МаркаАвто}}', '{{Контакт водителя}}', '{{ПаспортныеДанныеВодителя}}',
                                 '{{Адрес_погрузки}}', '{{Контактное_лицо}}', '{{Наименование_грузополучателя}}',
                                 '{{Адрес_разгрузки}}', '{{Дата_и_время_разгрузки}}', '{{Контактное лицо на выгрузке}}',
                                 '{{Вес_груза}}', '{{Вид_упаковки}}', '{{Способ_погрузки}}', '{{Погрузка}}',
                                 '{{Разгрузка}}', '{{Сумма}}', '{{Сумма_словами}}'],
                          replacements=[document.Client_name, document.UHH, document.KPP,
                                        document.Client_prefix_address, delivery.Auto,
                                        delivery.Contact_Name + ', ' + delivery.Contact_Number, delivery.Passport_data,
                                        delivery.Stock, delivery.Contact_End, Client.Name, Client.Adress,
                                        delivery.End_date, delivery.Contact_End, str(item_info['mass']),
                                        item_info['packing'], delivery.Load_type, delivery.Date, delivery.End_date,
                                        str(account.Sum), num2text(account.Sum)], doc=doc)
    doc.save(dir_u + '/{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
    return send_from_directory(directory=dir_u, filename='{}.docx'.format(owner.__tablename__ + str(owner.id) + 'N' + str(document.id)))
