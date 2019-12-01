from app import app
from flask import render_template, redirect, session, request
from app import models, db
from time import strptime

import json


def table_to_json(query):
    result = []
    for i in query:
        subres = i.__dict__
        if '_sa_instance_state' in subres:
            subres.pop('_sa_instance_state', None)
        if 'Date' in subres:
            if subres['Date'] != None:
                subres['Date'] = subres['Date'].strftime("%d/%m/%Y, %H:%M:%S")

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
        Provider = models.Provider.query.filter_by(id=provider).all()
        return table_to_json(models.Notes.query.filter_by(Provider=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).all()
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

    Messages = []
    args = json.loads(request.args['comments'])
    for i in args:
        Message = models.Notes()
        Message.Date = strptime(i['comment_date'], '%d.%m.%Y')
        Message.Manager = i['comment_role']
        Message.Note = i['comment_content']
        if request.args['category'] == 'client':
            Message.Client_id = request.args['id']
        elif request.args['category'] == 'provider':
            Message.Provider_id = request.args['id']
        elif request.args['category'] == 'carrier':
            Message.Carrier_id = request.args['id']
        Messages.append(Message)
    Owner.Notes = Messages
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
