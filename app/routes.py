from app import app
from flask import render_template
from app import models
import json


def table_to_json(query):
    result = []
    for i in query:
        subres = i.__dict__
        subres.pop('_sa_instance_state', None)
        result.append(subres)
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
    return table_to_json(models.Client.query.all())


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
