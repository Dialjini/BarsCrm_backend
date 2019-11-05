from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    avatar = db.Column(db.String)

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

class Item(db.Model):
    Item_id = db.Column(db.Integer, primary_key=True)
    Properties_json = db.Column(db.String)

class EmptyClients(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Client(db.Model):
    Client_id = db.Column(db.Integer, primary_key=True)
    Description = db.Column(db.String)
    Contacts = db.Column(db.String)
    Code = db.Column(db.String)
    Name = db.Column(db.String)
    Oblast = db.Column(db.String)
    Rayon = db.Column(db.String)
    Category = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.Integer)
    Adress = db.Column(db.String)

class Tasks(db.Model):
    Task_id = db.Column(db.Integer, primary_key=True)
    Task = db.Column(db.String)
    Type = db.Column(db.String)
    Visibility = db.Column(db.String)

class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Oblast = db.Column(db.String)
    Rayon = db.Column(db.String)
    Name = db.Column(db.String)
    Group = db.Column(db.String)
    Price = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    Items = db.relationship('Item', backref='Stock', lazy='dynamic')
    Driver = db.relationship('Driver', backref='Provider', lazy='dynamic')
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.Integer)
    Adress = db.Column(db.String)

class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Type = db.Column(db.String)
    Name = db.Column(db.String)
    Date = db.Column(db.Date)
    Days = db.Column(db.Integer)
    Sum = db.Column(db.Float)
    Payed = db.Column(db.Float)
    Maneger_id = db.Column(db.Integer)

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Type = db.Column(db.String)
    Date = db.Column(db.Date)
    Name = db.Column(db.String)
    Sum = db.Column(db.Float)
    Status = db.Column(db.String)
    Manger_id = db.Column(db.Integer)

class DeliveryCar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Contact_Number = db.Column(db.String)
    Contact_Name = db.Column(db.String)
    Adress = db.Column(db.String)
    Segment = db.Column(db.String)
    Active = db.Column(db.Boolean)
    Debt_Credit = db.Column(db.String)
    Tonnaj = db.Column(db.Float)
    ExactCar = db.Column(db.String)
    Comment = db.Column(db.String)
    DoneContract = db.Column(db.String)

class DeliveryTrain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Contact_Number = db.Column(db.String)
    Contact_Name = db.Column(db.String)
    Adress = db.Column(db.String)
    Segment = db.Column(db.String)
    Active = db.Column(db.Boolean)
    Debt_Credit = db.Column(db.String)
    Station = db.Column(db.String)
    Price = db.Column(db.Float)

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Product_Type = db.Column(db.String)
    Items = db.relationship('Item', backref='Stock', lazy='dynamic')
    Type = db.Column(db.String) # ?
    Size = db.Column(db.String)
    Packing = db.Column(db.String)
    NDS = db.Column(db.String)
    Cost_Price = db.Column(db.Float)

class Driver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Contact = db.Column(db.String)