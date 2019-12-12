from app import app
from flask import render_template, redirect, session, request, send_from_directory
from app import models, db
from flask_socketio import SocketIO
import json
from xhtml2pdf import pisa
import os

socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)


@socketio.on('my event')
def handle_message(message):
    print('received message: ' + message['data'])


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


def to_PDF(owner, name):
    if name == "Договор":
        name = "Dogovor"
    else:
        name = "Zayavka"
    f = open(os.path.dirname(__file__) + '/upload/{}.pdf'.format(owner.__tablename__ + str(owner.id)), "w+b")
    html = render_template('{}.html'.format(name), name='HERE-> Переменная')
    print('{}.html'.format(name))


    pisa.CreatePDF(html, dest=f, encoding='utf-8')
    f.close()
    dir_u = os.path.abspath(os.path.dirname(__file__) + '/upload')
    print(dir_u)

    return send_from_directory(directory=dir_u, filename='{}.pdf'.format(owner.__tablename__ + str(owner.id)))


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


@app.route('/getTemplates', methods=['GET'])
def getTemplates():
    if 'username' in session:
        return table_to_json(models.Template.query.all())
    else:
        return redirect('/', code=302)


@app.route('/downloadDoc', methods=['GET'])
def downloadDoc():
    if 'username' in session:
        if request.args['category'] == 'client':
            owner = models.Client.query.filter_by(id=request.args['card_id']).first()
        elif request.args['category'] == 'provider':
            owner = models.Provider.query.filter_by(id=request.args['card_id']).first()
        elif request.args['category'] == 'carrier':
            owner = models.Carrier.query.filter_by(id=request.args['card_id']).first()
        else:
            return 'Error 400'

        return to_PDF(owner, request.args['name'])
    else:
        return redirect('/', code=302)


@app.route('/getClients', methods=['GET'])
def getClients():
    if 'username' in session:
        return table_to_json(models.Client.query.all())
    else:
        return redirect('/', code=302)


@app.route('/stockTransit', methods=['GET'])
def stockTransit():
    Item = models.Item.query.filter_by(Item_id=request.args['id_product']).first()
    Stock = models.Stock.query.filter_by(Name=request.args['stock_select']).first()

    for i in Stock.Items:
        if i.Name == Item.Name:
            Item.Volume = Item.Volume - request.args['product_volume']
            i.Volume = i.Volume + request.args['product_volume']

            db.session.commit()
            return 'OK'
    item = models.Item()

    item.Weight = Item.Weight
    item.Packing = Item.Packing
    item.Fraction = Item.Fraction
    item.Creator = Item.Creator
    item.Name = Item.Name
    item.Cost = Item.Cost
    Item.Volume = Item.Volume - request.args['product_volume']
    item.Volume = request.args['product_volume']
    item.NDS = Item.NDS
    item.Group_id = Item.Group_id
    item.Prefix = Item.Prefix
    item.Group_name = Item.Group_name

    Stock.Items.append(item)
    db.session.commit()

    return 'OK'


@app.route('/findContacts', methods=['GET'])
def findContacts():
    if 'username' in session:
        result = []
        data = request.args['data']
        Contacts = models.Contacts.query.all()
        Deliveryies = models.Delivery.query.all()
        Users = models.User.query.all()

        for i in Deliveryies:
            if i['Contact_End'] == data or i['Contact_Number'] == data:
                result.append(json.loads(table_to_json([i]))[0])

        for i in Contacts:
            if i.Number == data or i.Email == data:
                result.append(json.loads(table_to_json([i]))[0])

        for i in Users:
            if i.email == data:
                subres = json.loads(table_to_json([i]))[0]
                subres.pop('password', None)
                result.append(subres)

        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/getMessages', methods=['GET'])
def getMessages():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addMessages', methods=['GET'])
def addMessages():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/getDeliveries', methods=['GET'])
def getDeliveries():
    if 'username' in session:
        deliveries = models.Delivery.query.all()
        result = []
        carriers = models.Carrier.query.all()
        for delivery in deliveries:
            if delivery.Carrier_id:
                print(len(carriers))
                carrier = carriers[delivery.Carrier_id - 1]
                result.append({'carrier': json.loads(table_to_json([carrier]))[0],
                               'delivery': json.loads(table_to_json([delivery]))[0]})
            else:
                result.append({'carrier': None, 'delivery': json.loads(table_to_json([delivery]))[0]})
        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/addDelivery', methods=['GET'])
def addDelivery():
    if 'username' in session:
        data = request.args
        if data['delivery_id'] == 'new':
            table = models.Delivery()
        else:
            table = models.Delivery.query.filter_by(id=data['delivery_id']).first()

        table.Name = data['delivery_name']
        table.Date = data['delivery_date']
        table.Price = data['delivery_price']
        table.Contact_Number = data['delivery_contact_number']
        table.Contact_Name = data['delivery_contact_name']
        if data['delivery_carrier_id']:
            table.Carrier_id = data['delivery_carrier_id']
        if data['delivery_account_id']:
            table.Account_id = data['delivery_account_id']
        table.Comment = data['delivery_comment']
        table.Client = data['delivery_client']
        table.NDS = data['delivery_vat']
        table.Contact_End = data['delivery_contact_end']
        table.Customer = data['delivery_customer']
        table.End_date = data['delivery_end_date']
        table.Load_type = data['delivery_load_type']
        table.Payment_date = data['delivery_payment_date']
        table.Prefix = data['delivery_prefix']
        table.Start_date = data['delivery_start_date']
        table.Stock = data['delivery_stock']
        table.Type = data['delivery_type']
        table.Item_ids = data['delivery_item_ids']
        if 'payment_list' in data:
            table.Payment_list = data['payment_list']
        else:
            table.Payment_list = None

        if data['delivery_id'] == 'new':
            db.session.add(table)
        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getContacts', methods=['GET'])
def getContacts():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addStock', methods=['GET'])
def addStock():
    if 'username' in session:
        name = request.args['stock_name']
        stock = models.Stock()
        stock.Name = name

        db.session.add(stock)
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getStockTable', methods=['GET'])
def getStockTable():
    if 'username' in session:
        result = []
        Stocks = models.Stock.query.all()
        for stock in Stocks:
            subres = {'items': json.loads(table_to_json(stock.Items))}

            subres['stock_address'] = stock.Name
            result.append(subres)

        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/getStockItems', methods=['GET'])
def getStockItems():
    if 'username' in session:
        data = request.args
        Stocks = models.Stock.query.filter_by(id=data['stock_id']).all()
        if len(Stocks):
            Stock = Stocks[0]
        else:
            return 'Bad Stock'

        return table_to_json(Stock.Items)
    else:
        return redirect('/', code=302)


@app.route('/addItemGroup', methods=['GET'])
def addItemGroup():
    if 'username' in session:
        group = models.Item_groups()
        group.Group = request.args['group_name']
        db.session.add(group)
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getItemGroup', methods=['GET'])
def getItemGroup():
    if 'username' in session:
        return table_to_json(models.Item_groups.query.all())
    else:
        return redirect('/', code=302)


@app.route('/getAllItems', methods=['GET'])
def getAllItems():
    if 'username' in session:
        return table_to_json(models.Item.query.all())
    else:
        return redirect('/', code=302)


@app.route('/getAccounts', methods=['GET'])
def getAccounts():
    if 'username' in session:
        result = []
        Items = models.Item.query.all()
        for i in models.Account.query.all():
            items = []
            for j in json.loads(i.Item_ids):
                print(j)
                item = Items[int(j['id']) - 1]
                subres = json.loads(table_to_json([item]))[0]
                subres['Transferred_volume'] = j['volume']
                items.append(subres)
            account = json.loads(table_to_json([i]))[0]
            subres = {'items': items, 'account': account}
            result.append(subres)
        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/addUser', methods=['GET'])
def addUser():
    if 'username' in session:
        data = request.args
        if data['id'] == 'new':
            user = models.User()
        else:
            user = models.User.query.filter_by(id=data['id']).first()

        user.login = data['create_login']
        user.email = data['create_email']
        user.second_name = data['create_last_name']
        user.name = data['create_first_name']
        user.third_name = data['create_patronymic']
        user.role = data['create_role']
        user.password = data['create_password']

        if data['id'] == 'new':
            db.session.add(user)
        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/addAccount', methods=['GET'])
def addAccount():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addItemToStock', methods=['GET'])
def addItemToStock():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/getStocks', methods=['GET'])
def getStocks():
    if 'username' in session:
        return table_to_json(models.Stock.query.all())
    else:
        return redirect('/', code=302)


@app.route('/addContacts', methods=['GET'])
def addContacts():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addManagerToCard', methods=['GET'])
def addManagerToCard():
    if 'username' in session:
        if request.args['category'] == 'client':
            Owner = models.Client.query.filter_by(id=request.args['card_id']).first()
        elif request.args['category'] == 'provider':
            Owner = models.Provider.query.filter_by(id=request.args['card_id']).first()
        else:
            return '400 BAD REQUEST'
        Owner.Manager_active = True
        Owner.Manager_id = request.args['manager_id']
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/deleteManagerFromCard', methods=['GET'])
def deleteManagerFromCard():
    if 'username' in session:
        if request.args['category'] == 'client':
            Owner = models.Client.query.filter_by(id=request.args['card_id']).first()
        elif request.args['category'] == 'provider':
            Owner = models.Provider.query.filter_by(id=request.args['card_id']).first()
        else:
            return '400 BAD REQUEST'
        Owner.Manager_active = False
        Owner.Manager_date = request.args['date']
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getThisUser', methods=['GET'])
def getThisUser():
    if 'username' in session:
        if models.User.query.filter_by(login=session['username']).first():
            user = models.User.query.filter_by(login=session['username']).first()
        else:
            user = models.User.query.filter_by(email=session['username']).first()
        result = json.loads(table_to_json([user]))[0]
        result.pop('password', None)
        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/addItems', methods=['GET'])
def addItems():
    if 'username' in session:
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
            if i['item_product']:
                Item = models.Junk_item()
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

        Owner.Junk_items = Items
        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getItems', methods=['GET'])
def getItems():
    if 'username' in session:
        if request.args['category'] == 'client':
            client = request.args['id']
            Client = models.Client.query.filter_by(id=client).first()
            return table_to_json(models.Junk_item.query.filter_by(Client=Client).all())
        elif request.args['category'] == 'provider':
            provider = request.args['id']
            Provider = models.Provider.query.filter_by(id=provider).first()
            return table_to_json(models.Junk_item.query.filter_by(Provider=Provider).all())
        elif request.args['category'] == 'carrier':
            carrier = request.args['id']
            Carrier = models.Provider.query.filter_by(id=carrier).first()
            return table_to_json(models.Junk_item.query.filter_by(Carrier=Carrier).all())
        else:
            return 'ERROR 400 BAD REQUEST'
    else:
        return redirect('/', code=302)


@app.route('/getProviders', methods=['GET'])
def getProviders():
    if 'username' in session:
        return table_to_json(models.Provider.query.all())
    else:
        return redirect('/', code=302)


@app.route('/getTasks', methods=['GET'])
def getTasks(login):
    if 'username' in session:
        user = models.User.query.filter_by(login=login).first()
        return user.get_task_by_login()
    else:
        return redirect('/', code=302)


@app.route('/getUsers', methods=['GET'])
def getUsers():
    if 'username' in session:
        return table_to_json(models.User.query.all())
    else:
        return redirect('/', code=302)


@app.route('/getCarriers', methods=['GET'])
def getCarriers():
    if 'username' in session:
        return table_to_json(models.Carrier.query.all())
    else:
        return redirect('/', code=302)


@app.route('/addProvider', methods=['GET'])
def addProvider():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addComment', methods=['GET'])
def addComment():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/getComment', methods=['GET'])
def getComment():
    if 'username' in session:
        if request.args['category'] == 'client':
            Owner = models.Client.query.filter_by(id=request.args['id']).first()
        elif request.args['category'] == 'provider':
            Owner = models.Provider.query.filter_by(id=request.args['id']).first()
        elif request.args['category'] == 'carrier':
            Owner = models.Carrier.query.filter_by(id=request.args['id']).first()
        else:
            return '400 BAD REQUEST'
        return Owner.Comment
    else:
        return redirect('/', code=302)


@app.route('/addCarrier', methods=['GET'])
def addCarier():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)


@app.route('/addClient', methods=['GET'])
def addClient():
    if 'username' in session:
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
    else:
        return redirect('/', code=302)
