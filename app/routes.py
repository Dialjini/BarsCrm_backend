from app import app
from flask import render_template, redirect, session, request
from app import models, db

import json


def table_to_json(query):
    result = []
    for i in query:
        subres = i.__dict__
        if '_sa_instance_state' in subres:
            subres.pop('_sa_instance_state', None)
        if 'Date' in subres:
            subres['Date'] = subres['Date'].strftime("%m/%d/%Y, %H:%M:%S")

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
        return table_to_json(models.Notes.query.filter_by(Author=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).all()
        return table_to_json(models.Notes.query.filter_by(Author=Carrier).all())
    else:
        return 'ERROR 400 BAD REQUEST'


@app.route('/addMessages', methods=['GET'])
def addMessags():
    data = request.args
    Message = models.Notes()

    # TODO СООБЩЕНИЯ

    return 'OK'


@app.route('/getContacts', methods=['GET'])
def getContacts():
    if request.args['category'] == 'client':
        client = request.args['id']
        Client = models.Client.query.filter_by(id=client).first()
        return table_to_json(models.Contacts.query.filter_by(Owner=Client).all())
    elif request.args['category'] == 'provider':
        provider = request.args['id']
        Provider = models.Provider.query.filter_by(id=provider).all()
        return table_to_json(models.Contacts.query.filter_by(Provider=Provider).all())
    elif request.args['category'] == 'carrier':
        carrier = request.args['id']
        Carrier = models.Provider.query.filter_by(id=carrier).all()
        return table_to_json(models.Contacts.query.filter_by(Carrier=Carrier).all())
    else:
        return 'ERROR 400 BAD REQUEST'


@app.route('/addContacts', methods=['GET'])
def addContacts():
    if request.args['category'] == 'client':
        Owner = models.Client.query.filter_by(id=request.args['id'])
    elif request.args['category'] == 'provider':
        Owner = models.Provider.query.filter_by(id=request.args['id'])
    else:
        Owner = models.Carrier.query.filter_by(id=request.args['id'])

    Contact = models.Contacts()
    Contacts = []
    for i in request.args['contacts']:
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


@app.route('/getProviders', methods=['GET'])
def getProviders():
    return table_to_json(models.Provider.query.all())


@app.route('/getDeliverersByTrain', methods=['GET'])
def getDeliverersByTrain():
    return table_to_json(models.DeliveryTrain.query)


@app.route('/getDeliverersByCar', methods=['GET'])
def getDeliverersByCar():
    return table_to_json(models.DeliveryCar.query.all())


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
        Provider = models.Provider.query.filter_by(Name=data['provider_name']).first()
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


@app.route('/addCarrier', methods=['GET'])
def addCarier():
    data = request.args
    if data['carrier_data'] != 'new':
        new = False
    else:
        new = True
    if not new:
        Carrier = models.Carrier.query.filter_by(Name=data['carrier_name']).first()
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
        Client = models.Client.query.filter_by(Name=data['client_name']).first()
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

    if new:
        db.session.add(Client)

    db.session.commit()

    return 'OK'
