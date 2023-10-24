import os
import time
import json
from datetime import datetime

devices = ["192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.4", "192.168.1.5","192.168.1.6","192.168.1.7","192.168.1.8","192.168.1.9","192.168.1.10"]
file_path = "data.json" 

def load_data(file_path):
    try:
        with open(file_path, "r") as json_file:
            data = json.load(json_file)
        return data
    except FileNotFoundError:
        return []
    

def save_data(file_path, data):
    with open(file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)

def check_update_offline(device, time):
    data = load_data(file_path)
    for d in data:
        # print(d)
        if d['device_ip'] == device and d['color'] == 'red':
            continue
        elif d['device_ip'] == device:
            d['color'] = "red"
            d['time'] = time
            d['state'] = 'Offline'
    return data

def check_update_online(device, time):
    data = load_data(file_path)
    for d in data:
        if d['device_ip'] == device:
            d['color'] = "green"
            d['time'] = ''
            d['state'] = 'Online'
    return data

def check_device_status(device):
    response = os.system("ping -c 1 " + device)
    now = datetime.now()
    time_now = now.strftime("%d/%m/%Y %H:%M:%S")
    if response == 0 :
        return check_update_online(device,time_now)
    else :
        return check_update_offline(device,time_now)


while True :
    for d in devices:
        data = check_device_status(d)
        save_data(file_path, data)
    time.sleep(5)

    
check_update_online("192.168.1.3","1234")