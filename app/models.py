from app import db
import json
from xhtml2pdf import pisa
from io import StringIO, BytesIO
from xhtml2pdf.config.httpconfig import httpConfig
import xlsxwriter
import xlrd
import openpyxl
from openpyxl.styles.borders import Border, Side, BORDER_THIN, BORDER_NONE, BORDER_MEDIUM, DEFAULT_BORDER

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String)
    email = db.Column(db.String, unique=True)
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

class Item(db.Model):
    Item_id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Creator = db.Column(db.String)
    Bags = db.Column(db.Float)
    MKR = db.Column(db.Float)
    Pile = db.Column(db.Float)
    Cost = db.Column(db.Float)
    NDS = db.Column(db.String)


class EmptyClients(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Client(db.Model):
    Client_id = db.Column(db.Integer, primary_key=True)
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
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.String)
    Adress = db.Column(db.String)
    Notes = db.relationship('Notes', backref='Author', lazy='dynamic')


class Contacts(db.Model):
    Contact_id = db.Column(db.Integer, primary_key=True)
    Position = db.Column(db.String)
    Name = db.Column(db.String)
    Number = db.Column(db.String)
    Email = db.Column(db.String)
    Comment = db.Column(db.String)
    Department = db.Column(db.String)
    Group = db.Column(db.String)
    Manager = db.Column(db.String)
    Date = db.Column(db.Date)
    Birthday = db.Column(db.Date)

class Notes(db.Model):
    NoteId = db.Column(db.Integer, primary_key=True)
    Done = db.Column(db.Boolean)
    Type = db.Column(db.String)
    Date = db.Column(db.Date)
    Note = db.Column(db.String)
    Manager = db.Column(db.String)
    File_Path = db.Column(db.String)

class Tasks(db.Model):
    Task_id = db.Column(db.Integer, primary_key=True)
    Task = db.Column(db.String)
    Type = db.Column(db.String)
    Visibility = db.Column(db.String)


class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Pods = db.Column(db.String)
    Raps = db.Column(db.String)
    Len = db.Column(db.String)
    Vets = db.Column(db.String)
    Train = db.Column(db.String)
    Oblast = db.Column(db.String)
    Rayon = db.Column(db.String)
    Name = db.Column(db.String)
    Group = db.Column(db.String)
    Price = db.Column(db.String)
    Manager_id = db.Column(db.Integer)
    Items = db.relationship('Item', backref='Stock', lazy='dynamic')
    Driver = db.relationship('Driver', backref='Provider', lazy='dynamic')
    UTC = db.Column(db.Integer)
    UHH = db.Column(db.String)
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
