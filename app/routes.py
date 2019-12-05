from app import app
from flask import render_template, redirect, session, request
from app import models, db
from datetime import datetime

import json


def table_to_json(query):
    result = []
    for i in query:
        subres = i.__dict__
        if '_sa_instance_state' in subres:
            subres.pop('_sa_instance_state', None)
        if 'Date' in subres:
            if subres['Date'] != None:
                try:
                    subres['Date'] = subres['Date'].strftime("%d.%m.%Y")
                except Exception:
                    print(subres['Date'])

        result.append(subres)
    return json.dumps(result)


@app.route('/')
@app.route('/index')
def index():
    try:
        print(session['username'])
    except Exception:
        print("Not logged in")

    if 'username' in session:
        return render_template('index.html')
    else:
        return render_template('login.html')


@app.route('/auth', methods=['GET'])
def auth():
    if 'login' in request.args:
        login = request.args['login']
    else:
        return 'ERROR 400 BAD REQUEST'

    if 'password' in request.args:
        password = request.args['password']
    else:
        return 'ERROR 400 BAD REQUEST'

    if models.User.query.filter_by(login=login).first():
        user = models.User.query.filter_by(login=login).first()

        if user.password == password:
            session['username'] = login
            return redirect('/', code=302)

        return json.dumps({'message': 'Неверный пароль', 'success': False})

    elif models.User.query.filter_by(email=login).first():
        user = models.User.query.filter_by(email=login).first()

        if user.password == password:
            session['username'] = login
            return redirect('/', code=302)

        return json.dumps({'message': 'Неверный пароль', 'success': False})

    return json.dumps({'message': 'Неверный логин/email', 'success': False})


@app.route('/logout', methods=['GET'])
def logout():
    if 'username' in session:
        session.pop('username', None)
    return redirect('/', code=302)

@app.route('/getClients', methods=['GET'])
def getClients():
    return table_to_json(models.Client.query.all())


@app.route('/getMessages', methods=['GET'])
def getMessages():
    if request.args['category'] == 'client':
        client = request.args['id']
        Client = models.Client.query.filter_by(id=client).first()
        return table_to_json(models.Notes.query.filter_by(Author=Client).all())
    elif request.args['category'] == 'provider':
        provider = request.args['id']
        Provider = models.Provider.query.filter_by(id=provider).first()
        return table_to_json(models.Notes.query.filter_by(Provider=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).first()
        return table_to_json(models.Notes.query.filter_by(Carrier=Carrier).all())
    else:
        return 'ERROR 400 BAD REQUEST'


@app.route('/addMessages', methods=['GET'])
def addMessages():
    if request.args['category'] == 'client':
        Owner = models.Client.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'provider':
        Owner = models.Provider.query.filter_by(id=request.args['id']).first()
    else:
        Owner = models.Carrier.query.filter_by(id=request.args['id']).first()

    i = json.loads(request.args['comments'])
    Message = models.Notes()

    Message.Date = i['comment_date']
    Message.Manager = i['comment_role']
    Message.Note = i['comment_content']
    if request.args['category'] == 'client':
        Message.Client_id = request.args['id']
    elif request.args['category'] == 'provider':
        Message.Provider_id = request.args['id']
    elif request.args['category'] == 'carrier':
        Message.Carrier_id = request.args['id']
    Owner.Notes.append(Message)
    db.session.commit()

    return 'OK'

@app.route('/getDeliveries', methods=['GET'])
def getDeliveries():
    deliveries = models.Delivery.query.all()
    result = []
    for delivery in deliveries:
        if delivery.Carrier_id:
            carrier = models.Carrier.query.filter_by(id=delivery.Carrier_id).first()
            result.append({'carrier': json.loads(table_to_json([carrier]))[0], 'delivery': json.loads(table_to_json([delivery]))[0]})
        else:
            result.append({'carrier': None, 'delivery': json.loads(table_to_json([delivery]))[0]})
    return json.dumps(result)


@app.route('/addDelivery', methods=['GET'])
def addDelivery():
    data = request.args
    table = models.Delivery()

    table.Name = data['account_name']
    table.Date = data['account_date']
    table.Price = data['account_price']
    table.Contact_Number = data['account_contact_number']
    table.Contact_Name = data['account_contact_name']
    table.Carrier_id = data['account_carrier_id']
    table.Comment = data['account_comment']
    table.Client = data['account_client']
    table.NDS = data['account_vat']
    table.Contact_End = data['account_contact_end']
    table.Customer = data['account_customer']
    table.End_date = data['account_end_date']
    table.Load_type = data['account_load_type']
    table.Payment_date = data['account_payment_date']
    table.Prefix = data['account_prefix']
    table.Start_date = data['account_start_date']
    table.Stock = data['account_stock']
    table.Type = data['account_type']

    db.session.add(table)
    db.session.commit()

    return 'OK'



@app.route('/getContacts', methods=['GET'])
def getContacts():
    if request.args['category'] == 'client':
        client = request.args['id']
        Client = models.Client.query.filter_by(id=client).first()
        return table_to_json(models.Contacts.query.filter_by(Owner=Client).all())
    elif request.args['category'] == 'provider':
        provider = request.args['id']
        Provider = models.Provider.query.filter_by(id=provider).first()
        return table_to_json(models.Contacts.query.filter_by(Provider=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).first()
        return table_to_json(models.Contacts.query.filter_by(Carrier=Carrier).all())
    else:
        return 'ERROR 400 BAD REQUEST'


@app.route('/addStock', methods=['GET'])
def addStock():
    name = request.args['stock_name']
    type = request.args['stock_type']
    stock = models.Stock()
    stock.Name = name
    stock.Type = type

    db.session.add(stock)
    db.session.commit()
    return 'OK'


@app.route('/getStockTable', methods=['GET'])
def getStockTable():
    result = []
    Stocks = models.Stock.query.all()
    for stock in Stocks:
        subres = {'items':json.loads(table_to_json(stock.Items))}

        subres['stock_address'] = stock.Name
        result.append(subres)

    return json.dumps(result)


@app.route('/getStockItems', methods=['GET'])
def getStockItems():
    data = request.args
    Stocks = models.Stock.query.filter_by(id=data['stock_id']).all()
    if len(Stocks):
        Stock = Stocks[0]
    else:
        return 'Bad Stock'

    return table_to_json(Stock.Items)


@app.route('/addItemGroup', methods=['GET'])
def addItemGroup():
    group = models.Item_groups()
    group.Group = request.args['group_name']
    db.session.add(group)
    db.session.commit()
    return 'OK'


@app.route('/getAccounts', methods=['GET'])
def getAccounts():
    result = []
    for i in models.Account.query.all():
        items = []
        for j in json.loads(i.Item_ids):
            item = models.Item.query.filter_by(Item_id=j).first()
            items.append(json.loads(table_to_json([item]))[0])
        account = json.loads(table_to_json([i]))[0]
        subres = {'items': items, 'account': account}
        result.append(subres)
    return json.dumps(result)


@app.route('/addAccount', methods=['GET'])
def addAccount():
    data = request.args
    table = models.Account()
    table.Name = data['name']
    table.Status = data['status']
    table.Date = data['date']
    table.Hello = data['hello']
    table.Sale = data['sale']
    table.Shipping = data['shipping']
    table.Sum = data['sum']
    table.Item_ids = data['item_ids']

    db.session.add(table)
    db.session.commit()

    return 'OK'


@app.route('/addItemToStock', methods=['GET'])
def addItemToStock():
    data = request.args
    Stocks = models.Stock.query.filter_by(id=data['stock_id']).all()
    if len(Stocks):
        Stock = Stocks[0]
    else:
        return 'Bad Stock'

    item = models.Item()
    item.Weight = data['item_weight']
    item.Packing = data['item_packing']
    item.Fraction = data['item_fraction']
    item.Creator = data['item_creator']
    item.Name = data['item_product']
    item.Cost = data['item_price']
    item.Volume = data['item_volume']
    item.NDS = data['item_vat']
    item.Group_id = data['group_id']
    item.Prefix = data['item_prefix']
    item.Group_name = models.Item_groups.query.filter_by(id=data['group_id']).first().Group

    Stock.Items.append(item)
    db.session.commit()

    return 'OK'


@app.route('/getStocks', methods=['GET'])
def getStocks():
    return table_to_json(models.Stock.query.all())


@app.route('/addContacts', methods=['GET'])
def addContacts():
    if request.args['category'] == 'client':
        Owner = models.Client.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'provider':
        Owner = models.Provider.query.filter_by(id=request.args['id']).first()
    else:
        Owner = models.Carrier.query.filter_by(id=request.args['id']).first()

    Contacts = []
    args = json.loads(request.args['contacts'])
    for i in args:
        Contact = models.Contacts()
        Contact.Name = i['first_name']
        Contact.Last_name = i['last_name']
        Contact.Number = i['phone']
        Contact.Email = i['email']
        Contact.Position = i['role']
        Contact.Visible = i['visible']
        if request.args['category'] == 'client':
            Contact.Client_id = request.args['id']
        elif request.args['category'] == 'provider':
            Contact.Provider_id = request.args['id']
        elif request.args['category'] == 'carrier':
            Contact.Carrier_id = request.args['id']
        Contacts.append(Contact)
    Owner.Contacts = Contacts
    db.session.commit()

    return 'OK'

@app.route('/addItems', methods=['GET'])
def addItems():
    if request.args['category'] == 'client':
        isClient = True
        Owner = models.Client.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'provider':
        isClient = False
        Owner = models.Provider.query.filter_by(id=request.args['id']).first()
    else:
        return '400 BAD REQUEST'

    Items = []
    args = json.loads(request.args['item'])
    for i in args:
        Item = models.Item()
        if isClient:
            Item.Volume = i['item_volume']
            Item.Creator = i['item_creator']
            Item.Client_id = request.args['id']
        else:
            Item.NDS = i['item_vat']
            Item.Fraction = i['item_fraction']
            Item.Packing = i['item_packing']
            Item.Weight = i['item_weight']
            Item.Provider_id = request.args['id']

        Item.Name = i['item_product']
        Item.Cost = i['item_price']

        Items.append(Item)
    Owner.Items = Items
    db.session.commit()

    return 'OK'

@app.route('/getItems', methods=['GET'])
def getItems():
    if request.args['category'] == 'client':
        client = request.args['id']
        Client = models.Client.query.filter_by(id=client).first()
        return table_to_json(models.Item.query.filter_by(Client=Client).all())
    elif request.args['category'] == 'provider':
        provider = request.args['id']
        Provider = models.Provider.query.filter_by(id=provider).first()
        return table_to_json(models.Item.query.filter_by(Provider=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).first()
        return table_to_json(models.Item.query.filter_by(Carrier=Carrier).all())
    else:
        return 'ERROR 400 BAD REQUEST'

@app.route('/getProviders', methods=['GET'])
def getProviders():
    return table_to_json(models.Provider.query.all())


@app.route('/getDeliverers', methods=['GET'])
def getDeliverers():
    return table_to_json(models.Delivery.query)


@app.route('/getTasks', methods=['GET'])
def getTasks(login):
    user = models.User.query.filter_by(login=login).first()
    return user.get_task_by_login()


@app.route('/getUsers', methods=['GET'])
def getUsers():
    return table_to_json(models.User.query.all())

@app.route('/getCarriers', methods=['GET'])
def getCarriers():
    return table_to_json(models.Carrier.query.all())


@app.route('/addProvider', methods=['GET'])
def addProvider():
    data = request.args
    if data['provider_data'] != 'new':
        new = False
    else:
        new = True

    if not new:
        Provider = models.Provider.query.filter_by(id=data['provider_data']).first()
    else:
        Provider = models.Provider()

    Provider.Name = data['provider_name']
    Provider.Rayon = data['provider_area']
    Provider.Category = data['provider_category']
    Provider.Distance = data['provider_distance']
    Provider.UHH = data['provider_inn']
    Provider.Price = data['provider_price']
    Provider.Oblast = data['provider_region']
    Provider.Train = data['provider_station']
    Provider.Tag = data['provider_tag']
    Provider.Adress = data['provider_address']
    Provider.NDS = data['provider_vat']
    Provider.Merc = data['provider_merc']
    Provider.Volume = data['provider_volume']
    Provider.Holding = data['provider_holding']

    if new:
        db.session.add(Provider)

    db.session.commit()

    return 'OK'


@app.route('/addComment', methods=['GET'])
def addComment():
    if request.args['category'] == 'client':
        Owner = models.Client.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'provider':
        Owner = models.Provider.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'carrier':
        Owner = models.Carrier.query.filter_by(id=request.args['id']).first()
    else:
        return '400 BAD REQUEST'

    Owner.Comment = request['comment']
    db.session.commit()


@app.route('/getComment', methods=['GET'])
def getComment():
    if request.args['category'] == 'client':
        Owner = models.Client.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'provider':
        Owner = models.Provider.query.filter_by(id=request.args['id']).first()
    elif request.args['category'] == 'carrier':
        Owner = models.Carrier.query.filter_by(id=request.args['id']).first()
    else:
        return '400 BAD REQUEST'
    return Owner.Comment


@app.route('/addCarrier', methods=['GET'])
def addCarier():
    data = request.args
    if data['carrier_data'] != 'new':
        new = False
    else:
        new = True
    if not new:
        Carrier = models.Carrier.query.filter_by(id=data['carrier_data']).first()
    else:
        Carrier = models.Carrier()

    Carrier.Name = data['carrier_name']
    Carrier.Address = data['carrier_address']
    Carrier.Area = data['carrier_area']
    Carrier.Capacity = data['carrier_capacity']
    Carrier.UHH = data['carrier_inn']
    Carrier.Region = data['carrier_region']
    Carrier.View = data['carrier_view']

    if new:
        db.session.add(Carrier)

    db.session.commit()

    return 'OK'


@app.route('/addClient', methods=['GET'])
def addClient():
    data = request.args
    if data['client_data'] != 'new':
        new = False
    else:
        new = True

    if not new:
        Client = models.Client.query.filter_by(id=data['client_data']).first()
    else:
        Client = models.Client()

    Client.Name = data['client_name']
    Client.Rayon = data['client_area']
    Client.Category = data['client_category']
    Client.Distance = data['client_distance']
    Client.Segment = data['client_industry']
    Client.UHH = data['client_inn']
    Client.Price = data['client_price']
    Client.Oblast = data['client_region']
    Client.Station = data['client_station']
    Client.Tag = data['client_tag']
    Client.Adress = data['client_address']
    Client.Holding = data['client_holding']
    Client.Site = data['client_site']
    Client.Demand_item = data['demand_product']
    Client.Demand_volume = data['demand_volume']
    Client.Livestock_all = data['livestock_general']
    Client.Livestock_milking = data['livestock_milking']
    Client.Livestock_milkyield = data['livestock_milkyield']


    if new:
        db.session.add(Client)

    db.session.commit()

    return 'OK'
