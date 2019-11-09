from app import app
from flask import render_template
from app import models
import json


def table_to_json(table):
    result = []
    for i in table:
        result.append(i.__dict__)
    return json.dumps(result)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/auth', methods=['GET'])
def auth(login, password):

    if models.User.query.filter_by(login=login).first():
        user = models.User.query.filter_by(login=login).first()

        if user.password == password:
            return json.dumps({'role': user.role, 'success': True})

        return json.dumps({'role': 'Неверный пароль', 'success': False})

    elif models.User.query.filter_by(email=login).first():
        user = models.User.query.filter_by(email=login).first()

        if user.password == password:
            return json.dumps({'role': user.role, 'success': True})

        return json.dumps({'role': 'Неверный пароль', 'success': False})

    return json.dumps({'role': 'Неверный логин/email', 'success': False})


@app.route('/getClients', methods=['GET'])
def getClients():
    return table_to_json(models.Client.query)


@app.route('/getProviders', methods=['GET'])
def getProviders():
    return table_to_json(models.Provider.query)


@app.route('/getDeliverersByTrain', methods=['GET'])
def getDeliverersByTrain():
    return table_to_json(models.DeliveryTrain.query)


@app.route('/getDeliverersByCar', methods=['GET'])
def getDeliverersByCar():
    return table_to_json(models.DeliveryCar.query)


@app.route('/getTasks', methods=['GET'])
def getTasks(login):
    user = models.User.query.filter_by(login=login).first()
    return user.get_task_by_login()
