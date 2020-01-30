from app import app
from flask import render_template, redirect, session, request, send_from_directory
from app import models, db, reqs, DocCreator
from flask_socketio import SocketIO, emit
import json
import os
from datetime import datetime

socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)


usernames = {}

class Inside_date:
    def __init__(self, d, m, y):
        months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа',
                  'сентября', 'октября', 'ноября', 'декабря']
        self.d = d
        self.m = months[m - 1]
        self.y = y


@socketio.on('delete_task')
def delete_task(data):
    task = models.Tasks.query.filter_by(Task_id=int(data['data'])).first()
    db.session.delete(task)
    db.session.commit()
    emit('refreshTasks', broadcast=True)


@socketio.on('connection')
def user_connected():
    print("user connect")


@socketio.on('add user')
def add_user(data):
    global usernames
    print("add user")
    print(data)
    session['username'] = data
    usernames[data] = session['username']

    emit('user joined', {'username': session['username']}, broadcast= True)


def sendTasks():
    tasks = []
    Tasks = models.Tasks.query.all()

    print(session['id'])
    for i in Tasks:
        socketio.sleep(0)
        print(session['id'])
        print(tasks)
        try:
            if 'all' in json.loads(i.Visibility):
                tasks.append(json.loads(table_to_json([i]))[0])
            elif str(session['id']) in json.loads(i.Visibility):
                tasks.append(json.loads(table_to_json([i]))[0])
        except Exception as er:
            print(er)
    emit('showTasks', json.dumps(tasks), broadcast=False)



@socketio.on('addTask')
def addTask(message):
    task = models.Tasks()
    user = models.User.query.filter_by(id=int(message['data']['task_who'])).first()
    if user.role == 'admin':
        task.Admin = True
    else:
        task.Admin = False

    task.Visibility = json.dumps(message['data']['task_whom'])
    task.User_id = int(message['data']['task_who'])
    task.Type = message['data']['task_type']
    task.Date = message['data']['task_date']
    task.Time = message['data']['task_time']
    task.Comment = message['data']['task_comment']

    db.session.add(task)
    db.session.commit()
    emit('refreshTasks', broadcast=True)


@socketio.on('showTasks')
def showTasks():
    sendTasks()


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


def to_PDF(name, owner, address, delivery):
    info = {}
    for i in reqs.getINNinfo(owner.UHH)['suggestions']:
        if str(i['data']['address']['data']['postal_code']) == str(address[0:6]):
            info = i
    if str(info) == '{}':
        return 'BAD ADDRESS or INN'
    owner.UTC = int(info['data']['address']['data']['timezone'][3:])
    db.session.commit()

    date = Inside_date(d=str(datetime.now().day), m=int(datetime.now().month), y=str(datetime.now().year))
    dir_u = os.path.abspath(os.path.dirname(__file__) + '/upload')

    print(name)

    if name == 'DogovorNaDostavkuIP':
        return DocCreator.Generate_DogovorNaDostavkuIP(dir_u=dir_u, info=info, owner=owner, date=date)
    elif name == 'DogovorNaDostavkuOOO':
        return DocCreator.Generate_DogovorNaDostavkuOOO(dir_u=dir_u, info=info, owner=owner, date=date)
    elif name == 'Dogovor_na_tovari_ooo':
        return DocCreator.Generate_Dogovor_na_tovari_ooo(dir_u=dir_u, info=info, owner=owner, date=date)
    elif name == 'Dogovor_na_tovari_ip':
        return DocCreator.Generate_Dogovor_na_tovari_ip(dir_u=dir_u, info=info, owner=owner, date=date)
    elif name == 'ZayavkaOOO':
        return DocCreator.Generate_Zayavka_OOO(dir_u=dir_u, info=info, owner=owner, date=date, delivery=delivery)
    elif name == 'ZayavkaIP':
        return DocCreator.Generate_Zayavka_IP(dir_u=dir_u, info=info, owner=owner, date=date, delivery=delivery)
    else:
        return '400 Bad Request'

@app.route('/')
@app.route('/index')
def index():
    try:
        print(session['username'])
        print(session['id'])
    except Exception:
        print("Not logged in")

    if 'username' in session:
        return render_template('index.html', last_update=1921)
    else:
        return render_template('login.html', last_update=1883)


@app.route('/getAllTasks')
def getAllTasks():
    return table_to_json(models.Tasks.query.all())


@app.route('/getMyTasks')
def getMyTasks():
    tasks = []
    Tasks = models.Tasks.query.all()
    if models.User.query.filter_by(login=session['username']).first():
        user = models.User.query.filter_by(login=session['username']).first()
    else:
        user = models.User.query.filter_by(email=session['username']).first()
    for i in Tasks:
        try:
            if 'all' in json.loads(i.Visibility):
                tasks.append(json.loads(table_to_json([i]))[0])
            elif str(user.id) in json.loads(i.Visibility):
                tasks.append(json.loads(table_to_json([i]))[0])
        except Exception as er:
            print(er)
    return json.dumps(tasks)


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
            session['id'] = user.id
            # join_room('all')
            return redirect('/', code=302)

        return json.dumps({'message': 'Неверный пароль', 'success': False})

    elif models.User.query.filter_by(email=login).first():
        user = models.User.query.filter_by(email=login).first()

        if user.password == password:
            session['username'] = login
            session['id'] = user.id
            return redirect('/', code=302)

        return json.dumps({'message': 'Неверный пароль', 'success': False})

    return json.dumps({'message': 'Неверный логин/email', 'success': False})


@app.route('/getManagerStat', methods=['GET'])
def getManagerStat():
    if 'username' in session:
        managers = models.User.query.all()
        comments = models.Notes.query.all()
        clients = models.Client.query.all()
        providers = models.Provider.query.all()
        carriers = models.Carrier.query.all()
        all_comments = 0
        result = []
        last_res = {}
        for j in managers:
            if j.role == 'admin':
                continue
            else:
                manager_info = {}
                manager_info['orgs'] = {}
                for i in comments:
                    if i.Creator_id == j.id:
                        all_comments += 1
                        manager_info['id'] = j.id
                        manager_info['name'] = j.name + ' ' + j.second_name
                        if i.Client_id:
                            manager_info['orgs'][clients[i.Client_id - 1].Name] = i.Date
                        elif i.Provider_id:
                            manager_info['orgs'][providers[i.Provider_id - 1].Name] = i.Date
                        elif i.Carrier_id:
                            manager_info['orgs'][carriers[i.Carrier_id - 1].Name] = i.Date
                        else:
                            continue
                result.append(manager_info)
        last_res['all_comments'] = all_comments
        last_res['data'] = result
        return json.dumps(last_res)
    else:
        return redirect('/', code=302)


@app.route('/logout', methods=['GET'])
def logout():
    if 'username' in session:
        session.pop('username', None)
        session.pop('id', None)
    return redirect('/', code=302)


@app.route('/addAccountPaymentHistory', methods=['GET'])
def addAccountPaymentHistory():
    if 'username' in session:
        table = models.Account.query.filter_by(id=request.args['account_id']).first()
        table.Payment_history = request.args['account_payment_history']
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)

@app.route('/editAccount', methods=['GET'])
def editAccount():
    if 'username' in session:
        table = models.Account.query.filter_by(id=request.args['account_id']).first()
        data = request.args
        table.Name = data['name']
        table.Status = data['status']
        table.Date = data['date']
        table.Hello = data['hello']
        table.Sale = data['sale']
        table.Shipping = data['shipping']
        table.Sum = data['sum']
        table.Item_ids = data['item_ids']
        table.Items_amount = data['items_amount']
        table.Manager_id = data['manager_id']
        table.Total_costs = data['total_costs']
        table.Sale_costs = data['sale_costs']
        table.Hello_costs = data['hello_costs']
        table.Delivery_costs = data['delivery_costs']
        table.Shipment = data['shipment']

        db.session.commit()
        return 'OK'
    else:
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
        return to_PDF(owner=owner, name=request.args['name'],
                    address=request.args['address'], delivery=request.args['delivery'])
    else:
        return redirect('/', code=302)


@app.route('/getClients', methods=['GET'])
def getClients():
    if 'username' in session:
        return table_to_json(models.Client.query.all())
    else:
        return redirect('/', code=302)


@app.route('/deleteMember', methods=['GET'])
def deleteMember():
    user = models.User.query.filter_by(id=request.args['id']).first()

    db.session.delete(user)
    db.session.commit()
    return 'OK'


@app.route('/stockTransit', methods=['GET'])
def stockTransit():
    Item = models.Item.query.filter_by(Item_id=request.args['id_product']).first()
    Stock = models.Stock.query.filter_by(Name=request.args['stock_select']).first()

    for i in Stock.Items:
        if i.Name == Item.Name:
            Item.Volume = str(int(Item.Volume) - int(request.args['product_volume']))
            i.Volume = str(int(i.Volume) + int(request.args['product_volume']))

            db.session.commit()
            return 'OK'
    item = models.Item()

    item.Weight = Item.Weight
    item.Packing = Item.Packing
    item.Fraction = Item.Fraction
    item.Creator = Item.Creator
    item.Name = Item.Name
    item.Cost = Item.Cost
    Item.Volume = str(int(Item.Volume) - int(request.args['product_volume']))
    item.Volume = str(request.args['product_volume'])
    item.NDS = Item.NDS
    item.Group_id = Item.Group_id
    item.Prefix = Item.Prefix
    item.Group_name = Item.Group_name

    Stock.Items.append(item)
    db.session.commit()

    return 'OK'

@app.route('/addRole', methods=['GET'])
def addRole():
    if 'username' in session:
        role = models.Role()
        role.Name = request.args['name']
        role.Priority = int(request.args['priority'])
        db.session.add(role)
        db.session.commit()
        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getRoles', methods=['GET'])
def getRoles():
    if 'username' in session:
        return table_to_json(models.Role.query.all())
    else:
        return redirect('/', code=302)


@app.route('/findComments', methods=['GET'])
def findComments():
    if 'username' in session:
        result = []
        data = request.args['data']
        Comments = models.Notes.query.all()
        for i in Comments:
            try:
                if data in i.Note:
                    result.append(json.loads(table_to_json([i]))[0])
            except Exception:
                continue

        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/findContacts', methods=['GET'])
def findContacts():
    if 'username' in session:
        result = []
        data = request.args['data']
        Contacts = models.Contacts.query.all()
        Deliveryies = models.Delivery.query.all()
        Users = models.User.query.all()
        for i in Deliveryies:
            try:
                if data in i['Contact_End'] or data in i['Contact_Number']:
                    result.append(json.loads(table_to_json([i]))[0])
            except Exception:
                a='nothin'

        for i in Contacts:
            try:
                if data in i.Number or data in i.Email or data in i.Last_name:
                    result.append(json.loads(table_to_json([i]))[0])
            except Exception:
                a='nothin'

        for i in Users:
            try:
                if data in i.email:
                     subres = json.loads(table_to_json([i]))[0]
                     subres.pop('password', None)
                     result.append(subres)
            except Exception:
                a='nothin'

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
        Message.Creator = i['comment_creator']
        Message.Creator_id = int(i['comment_creator_id'])
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
        print(data['delivery_id'])
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
        table.Amounts = data['delivery_amounts']
        table.Auto = data['delivery_car']
        table.Passport_data = data['delivery_passport']
        table.Postponement_date = data['delivery_postponement_date']

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


@app.route('/fixDelivery', methods=['GET'])
def fixDelivery():
    Delivery = models.Delivery.query.filter_by(id=request.args['id']).first()
    Delivery.Item_ids = request.args['items_ids']
    Delivery.Amounts = request.args['amounts']

    db.session.commit()
    return 'OK'

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

        # subres = {'items': json.loads(table_to_json(models.BadItems.query.all())), 'stock_address': None}
        # result.append(subres)

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
        table.Items_amount = data['items_amount']
        table.Manager_id = data['manager_id']
        table.Total_costs = data['total_costs']
        table.Sale_costs = data['sale_costs']
        table.Hello_costs = data['hello_costs']
        table.Delivery_costs = data['delivery_costs']
        table.Shipment = data['shipment']

        db.session.add(table)
        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/getAllClientItems', methods=['GET'])
def getAllClientItems():
    if 'username' in session:
        result = []
        clients = models.Client.query.all()
        for client in clients:
            result.append({'client_id': client.id, 'data': json.loads(table_to_json(client.Junk_items))})

        return json.dumps(result)


@app.route('/getAllClientContacts', methods=['GET'])
def getAllClientContacts():
    if 'username' in session:
        result = []
        clients = models.Client.query.all()
        for client in clients:
            result.append({'client_id': client.id, 'data': json.loads(table_to_json(client.Contacts))})

        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/editItem', methods=['GET'])
def editItem():
    if 'username' in session:
        data = request.args
        item = models.Item.query.filter_by(Item_id=data['id']).first()
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
        item.Purchase_price = data['item_purchase_price']

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
            item.Purchase_price = data['item_purchase_price']

            db.session.add(item)
            db.session.commit()

            return 'OK no stock'

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
        item.Purchase_price = data['item_purchase_price']

        Stock.Items.append(item)
        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/deleteCard', methods=['GET'])
def deleteCard():
    if 'username' in session:
        if request.args['category'] == 'client':
            card = models.Client.query.filter_by(id=request.args['id']).first() 

        elif request.args['category'] == 'provider':
            card = models.Provider.query.filter_by(id=request.args['id']).first() 

        elif request.args['category'] == 'carrier':
            card = models.Carrier.query.filter_by(id=request.args['id']).first()

        else:
            return 'ERROR'

        db.session.delete(card)
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
            del_contacts = models.Contacts.query.filter_by(Client_id=request.args['id']).all()
        elif request.args['category'] == 'provider':
            Owner = models.Provider.query.filter_by(id=request.args['id']).first()
            del_contacts = models.Contacts.query.filter_by(Provider_id=request.args['id']).all()
        elif request.args['category'] == 'carrier':
            Owner = models.Carrier.query.filter_by(id=request.args['id']).first()
            del_contacts = models.Contacts.query.filter_by(Carrier_id=request.args['id']).all()
        else:
            return '400 Bad request'

        for i in del_contacts:
            db.session.delete(i)

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
            Contact.Car = i['car']
            if request.args['category'] == 'client':
                Contact.Client_id = Owner.id
            elif request.args['category'] == 'provider':
                Contact.Provider_id = Owner.id
            elif request.args['category'] == 'carrier':
                Contact.Carrier_id = Owner.id
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
        print(session['username'])
        if models.User.query.filter_by(login=session['username']).first():
            user = models.User.query.filter_by(login=session['username']).first()
        else:
            user = models.User.query.filter_by(email=session['username']).first()
        result = json.loads(table_to_json([user]))[0]
        result.pop('password', None)
        return json.dumps(result)
    else:
        return redirect('/', code=302)


@app.route('/getThisItem', methods=['GET'])
def getThisItem():
    if 'username' in session:
        item = models.Item.query.filter_by(Item_id=request.args['id']).first()
        return table_to_json([item])
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
                    Item.Date = i['item_date']
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
            Stock = models.Stock.query.filter_by(Name=Provider.Adress).first()
            Stock.Name = data['provider_address']

        else:
            Provider = models.Provider()
            Stock = models.Stock()
            Stock.Name = data['provider_address']
            Provider.Create_date = data['provider_create_date']

        Provider.Name = data['provider_name']
        Provider.Rayon = data['provider_area']
        Provider.Distance = data['provider_distance']
        Provider.UHH = data['provider_inn']
        Provider.Price = data['provider_price']
        Provider.Oblast = data['provider_region']
        Provider.Train = data['provider_station']
        Provider.Adress = data['provider_address']
        Provider.Merc = data['provider_merc']
        Provider.Volume = data['provider_volume']
        Provider.Holding = data['provider_holding']
        Provider.Item_list = data['provider_item_list']

        if new:
            db.session.add(Provider)
            db.session.add(Stock)

        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)

@app.route('/deleteDoc', methods=['GET'])
def deleteDoc():
    doc = models.Document.query.filter_by(id=request.args['id']).first()

    db.session.delete(doc)
    db.session.commit()
    return 'OK'


@app.route('/getDocs', methods=['GET'])
def getDocs():
    if 'username' in session:
        return table_to_json(models.Document.query.all())
    else:
        return redirect('/', code=302)


@app.route('/downloadOldDoc', methods=['GET'])
def downloadOldDoc():
    if 'username' in session:
        document = models.Document.query.filter_by(id=request.args['id']).first()
        print(os.path.abspath(os.path.dirname(__file__) + '/upload')+document.Path)
        return send_from_directory(directory=os.path.abspath(os.path.dirname(__file__) + '/upload'),
                                   filename=document.Path)
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
        Carrier.Bik = data['carrier_bik']
        Carrier.kc = data['carrier_kc']
        Carrier.rc = data['carrier_rc']

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
        Client.Adress = data['client_address']
        Client.Fact_address = data['client_factual_address']
        Client.Holding = data['client_holding']
        Client.Site = data['client_site']
        Client.Livestock_all = data['livestock_general']
        Client.Livestock_milking = data['livestock_milking']
        Client.Livestock_milkyield = data['livestock_milkyield']
        Client.Bik = data['client_bik']
        Client.kc = data['client_kc']
        Client.rc = data['client_rc']

        if new:
            db.session.add(Client)

        db.session.commit()

        return 'OK'
    else:
        return redirect('/', code=302)


@app.route('/excelStat', methods=['GET'])
def excelStat():
    if 'username' in session:
        print(request.args)
        print(request.args['id'])
        print(json.loads(request.args['data']))
        return 'ok'
    else:
        return redirect('/', code=302)
