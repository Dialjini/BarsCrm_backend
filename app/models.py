from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String)
    email = db.Column(db.String)
    name = db.Column(db.String)
    second_name = db.Column(db.String)
    third_name = db.Column(db.String)
    role = db.Column(db.String)
    password = db.Column(db.String)
    avatar = db.Column(db.String)

    tasks = db.relationship('Tasks', backref='manager', lazy='dynamic')

    def get_task_by_login(self):
        result = []

        for i in self.tasks:
            result.append(i.__dict__)

        return result


class Order(db.Model):
    Client_id = db.Column(db.Integer, primary_key=True)
    Contact_Num = db.Column(db.String)
    Destination = db.Column(db.String)
    Provider = db.Column(db.String)
    Bonus = db.Column(db.String)
    Delivery_Status = db.Column(db.String)
    Item_id = db.Column(db.String)
    Props = db.Column(db.String)
    Cost = db.Column(db.Float)
    Postponement_date = db.Column(db.String)


class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)


class Item_groups(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Group = db.Column(db.String)
    Item = db.relationship('Item', backref='Group', lazy='dynamic')


class Item(db.Model):
    Item_id = db.Column(db.Integer, primary_key=True)
    Stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'))
    Group_id = db.Column(db.Integer, db.ForeignKey('item_groups.id'))
    Name = db.Column(db.String)
    Creator = db.Column(db.String)
    Weight = db.Column(db.String)
    Fraction = db.Column(db.String)
    Packing = db.Column(db.String)
    Cost = db.Column(db.String)
    NDS = db.Column(db.String)
    Volume = db.Column(db.String)
    Group_name = db.Column(db.String)
    Prefix = db.Column(db.String)
    Purchase_price = db.Column(db.String)


class Junk_item(db.Model):
    Item_id = db.Column(db.Integer, primary_key=True)
    Client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    Provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'))
    Name = db.Column(db.String)
    Creator = db.Column(db.String)
    Weight = db.Column(db.String)
    Fraction = db.Column(db.String)
    Packing = db.Column(db.String)
    Cost = db.Column(db.String)
    NDS = db.Column(db.String)
    Volume = db.Column(db.String)
    Date = db.Column(db.String)


class EmptyClients(db.Model):
    id = db.Column(db.Integer, primary_key=True)


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Status = db.Column(db.String)
    Number = db.Column(db.String)
    Faks = db.Column(db.String)
    Source = db.Column(db.String)
    Source2 = db.Column(db.String)
    Segment = db.Column(db.String)
    Segment2 = db.Column(db.String)
    Description = db.Column(db.String)
    Contacts = db.relationship('Contacts', backref='Owner', lazy='dynamic')
    Code = db.Column(db.String)
    Name = db.Column(db.String)
    Oblast = db.Column(db.String)
    Rayon = db.Column(db.String)
    Category = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    Manager_date = db.Column(db.String)
    Manager_active = db.Column(db.Boolean)
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.String)
    Adress = db.Column(db.String)
    Fact_address = db.Column(db.String)
    Junk_items = db.relationship('Junk_item', backref='Client', lazy='dynamic')
    Notes = db.relationship('Notes', backref='Author', lazy='dynamic')
    Tag = db.Column(db.String)
    Station = db.Column(db.String)
    Distance = db.Column(db.String)
    Price = db.Column(db.String)
    Site = db.Column(db.String)
    Holding = db.Column(db.String)
    Item_ids = db.Column(db.String)
    Livestock_all = db.Column(db.String)
    Livestock_milking = db.Column(db.String)
    Livestock_milkyield = db.Column(db.String)
    Demand_item = db.Column(db.String)
    Demand_volume = db.Column(db.String)
    Last_comment = db.Column(db.String)
    Bik = db.Column(db.String)
    kc = db.Column(db.String)
    rc = db.Column(db.String)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Prefix = db.Column(db.String)
    Owner_type = db.Column(db.String)
    Type = db.Column(db.String)
    Date = db.Column(db.String)
    Client_name = db.Column(db.String)
    Client_prefix_address = db.Column(db.String)
    Client_mail_address = db.Column(db.String)
    UHH = db.Column(db.String)
    OGRN = db.Column(db.String)
    KPP = db.Column(db.String)
    rc = db.Column(db.String)
    kc = db.Column(db.String)
    Bik = db.Column(db.String)
    Client_contact_name = db.Column(db.String)
    Owner_id = db.Column(db.Integer)
    MonthNum = db.Column(db.Integer)
    Path = db.Column(db.String)
    Creation_date = db.Column(db.String)


def getMonthNum():
    Docs = Document.query.all()
    result = 1
    for i in Docs:
        if datetime.now().month > 9:
            if i.Date[0:2] == str(datetime.now().month):
                result += 1
        else:
            if i.Date[0:1] == str(datetime.now().month):
                result += 1
    return result


class Contacts(db.Model):
    Contact_id = db.Column(db.Integer, primary_key=True)
    Client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    Provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'))
    Carrier_id = db.Column(db.Integer, db.ForeignKey('carrier.id'))
    Position = db.Column(db.String)
    Name = db.Column(db.String)
    Last_name = db.Column(db.String)
    Number = db.Column(db.String)
    Phone_two = db.Column(db.String)
    Email = db.Column(db.String)
    Comment = db.Column(db.String)
    Department = db.Column(db.String)
    Group = db.Column(db.String)
    Manager = db.Column(db.String)
    Date = db.Column(db.Date)
    Birthday = db.Column(db.Date)
    Car = db.Column(db.String)
    Visible = db.Column(db.Boolean)


class Notes(db.Model):
    NoteId = db.Column(db.Integer, primary_key=True)
    Client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    Provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'))
    Carrier_id = db.Column(db.Integer, db.ForeignKey('carrier.id'))
    Done = db.Column(db.Boolean)
    Type = db.Column(db.String)
    Date = db.Column(db.String)
    Note = db.Column(db.String)
    Manager = db.Column(db.String)
    File_Path = db.Column(db.String)
    Creator = db.Column(db.String)
    Creator_id = db.Column(db.Integer)


class BadItems(db.Model):
    Item_id = db.Column(db.Integer, primary_key=True)
    Group_id = db.Column(db.Integer, db.ForeignKey('item_groups.id'))
    Name = db.Column(db.String)
    Creator = db.Column(db.String)
    Weight = db.Column(db.String)
    Fraction = db.Column(db.String)
    Packing = db.Column(db.String)
    Cost = db.Column(db.String)
    NDS = db.Column(db.String)
    Volume = db.Column(db.String)
    Group_name = db.Column(db.String)
    Prefix = db.Column(db.String)


class Tasks(db.Model):
    Task_id = db.Column(db.Integer, primary_key=True)
    User_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    Task = db.Column(db.String)
    Type = db.Column(db.String)
    Date = db.Column(db.String)
    Time = db.Column(db.String)
    Comment = db.Column(db.String)
    Admin = db.Column(db.Boolean)
    Visibility = db.Column(db.String)


class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Train = db.Column(db.String)
    Oblast = db.Column(db.String)
    Rayon = db.Column(db.String)
    Name = db.Column(db.String)
    Group = db.Column(db.String)
    Price = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    Manager_date = db.Column(db.String)
    Manager_active = db.Column(db.Boolean)
    Junk_items = db.relationship('Junk_item', backref='Provider', lazy='dynamic')
    Contacts = db.relationship('Contacts', backref='Provider', lazy='dynamic')
    Item_ids = db.Column(db.String)
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.String)
    NDS = db.Column(db.String)
    Adress = db.Column(db.String)
    Tag = db.Column(db.String)
    Distance = db.Column(db.String)
    Category = db.Column(db.String)
    Merc = db.Column(db.String)
    Volume = db.Column(db.String)
    Holding = db.Column(db.String)
    Last_comment = db.Column(db.String)
    Notes = db.relationship('Notes', backref='Provider', lazy='dynamic')
    Bik = db.Column(db.String)
    kc = db.Column(db.String)
    rc = db.Column(db.String)
    Item_list = db.Column(db.String)
    Create_date = db.Column(db.String)



class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Date = db.Column(db.String)
    Days = db.Column(db.String)
    Sum = db.Column(db.String)
    Status = db.Column(db.String)
    Sale = db.Column(db.String)
    Hello = db.Column(db.String)
    Shipping = db.Column(db.String)
    Manager_id = db.Column(db.Integer)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Date = db.Column(db.String)
    Days = db.Column(db.String)
    Sum = db.Column(db.String)
    Status = db.Column(db.String)
    Sale = db.Column(db.String)
    Hello = db.Column(db.String)
    Shipping = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    Item_ids = db.Column(db.String)
    Items_amount = db.Column(db.String)
    Payment_history = db.Column(db.String)
    Total_costs = db.Column(db.String)
    Sale_costs = db.Column(db.String)
    Hello_costs = db.Column(db.String)
    Delivery_costs = db.Column(db.String)
    Shipment = db.Column(db.String)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Priority = db.Column(db.Integer)


class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Carrier_id = db.Column(db.Integer, db.ForeignKey('carrier.id'))
    Account_id = db.Column(db.Integer)
    Name = db.Column(db.String)
    Customer = db.Column(db.String)
    Date = db.Column(db.String)
    Stock = db.Column(db.String)
    Item_ids = db.Column(db.String)
    Prefix = db.Column(db.String)
    Price = db.Column(db.String)
    NDS = db.Column(db.String)
    Payment_date = db.Column(db.String)
    Start_date = db.Column(db.String)
    End_date = db.Column(db.String)
    Load_type = db.Column(db.String)
    Contact_Number = db.Column(db.String)
    Contact_Name = db.Column(db.String)
    Contact_End = db.Column(db.String)
    Type = db.Column(db.String)
    Comment = db.Column(db.String)
    Client = db.Column(db.String)
    Payment_list = db.Column(db.String)
    Bik = db.Column(db.String)
    kc = db.Column(db.String)
    rc = db.Column(db.String)
    Amounts = db.Column(db.String)
    Auto = db.Column(db.String)
    Passport_data = db.Column(db.String)
    Postponement_date = db.Column(db.String)


class Carrier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Address = db.Column(db.String)
    Area = db.Column(db.String)
    Capacity = db.Column(db.String)
    UHH = db.Column(db.String)
    Name = db.Column(db.String)
    Region = db.Column(db.String)
    View = db.Column(db.String)
    Notes = db.relationship('Notes', backref='Carrier', lazy='dynamic')
    Delivery = db.relationship('Delivery', backref='Carrier', lazy='dynamic')
    Contacts = db.relationship('Contacts', backref='Carrier', lazy='dynamic')
    Last_comment = db.Column(db.String)
    Items_delivery = db.Column(db.String)
    Bik = db.Column(db.String)
    rc = db.Column(db.String)
    kc = db.Column(db.String)


class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Product_Type = db.Column(db.String)
    # Item_groups = db.relationship('Item_groups', backref='Stock', lazy='dynamic')
    Items = db.relationship('Item', backref='Stock', lazy='dynamic')
    Type = db.Column(db.String)
    Size = db.Column(db.String)
    Packing = db.Column(db.String)
    NDS = db.Column(db.String)
    Cost_Price = db.Column(db.String)



