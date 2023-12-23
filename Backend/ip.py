import os
import json
import csv
from datetime import datetime
import time
import signal
import sys

devices = [
    "192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.4", "192.168.1.5",
    "192.168.1.6", "192.168.1.7", "192.168.1.8", "192.168.1.9", "192.168.1.10",
    "192.168.1.11", "192.168.1.12", "192.168.1.13", "192.168.1.14", "192.168.1.15",
    "192.168.1.16", "192.168.1.17", "192.168.1.18"
]

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

def count_csv_rows(file_name):
    with open(file_name, 'r', newline='') as csvfile:
        csv_reader = csv.reader(csvfile)
        row_count = sum(1 for row in csv_reader) 
        return row_count

def write_csv(file_name, data):
    with open(file_name, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)

def create_monthly_csv(file_name):
    if not os.path.isfile(file_name):
        with open(file_name, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Sl No', 'Device IP', 'Downtime Started', 'Downtime Ended', 'Duration'])  # Write header

def check_device_status(device):
    data = load_data(file_path)

    found = False
    for d in data:
        if d['device_ip'] == device:
            found = True
            break
    if not found:
        data.append({'device_ip': device, 'color': 'green', 'time': '', 'state': 'Online'})

    response = os.system("ping -c 1 " + device)
    now = datetime.now()
    time_now = now.strftime("%d/%m/%Y %H:%M:%S")

    if response == 0:
        updated_data = check_update_online(device, now, data)
    else:
        updated_data = check_update_offline(device, time_now, data)

    save_data(file_path, updated_data)

def check_update_offline(device, time_now, data):
    for d in data:
        if d['device_ip'] == device and d['color'] == 'red':
            continue
        elif d['device_ip'] == device:
            d['color'] = "red"
            d['time'] = time_now
            d['state'] = 'Offline'
    return data

def check_update_online(device, time, data):
    for d in data:
        if d['device_ip'] == device:
            if d['state'] == "Offline":
                current_date = datetime.now()
                time_diff = current_date - datetime.strptime(d['time'], '%d/%m/%Y %H:%M:%S')
                formatted_time_diff = f"{time_diff.days // 7} week(s) {time_diff.days % 7} day(s) {time_diff.seconds // 3600} hour(s) {(time_diff.seconds % 3600) // 60} minute(s)"
                month_file_name = 'files/' + current_date.strftime('%B') + '.csv'
                create_monthly_csv(month_file_name)
                write_csv(month_file_name, [count_csv_rows(month_file_name), d["device_ip"], d['time'], time.strftime("%d/%m/%Y %H:%M:%S"), formatted_time_diff])
            d['color'] = "green"
            d['time'] = ''
            d['state'] = 'Online'
    return data


while True:
    for d in devices:
        check_device_status(d)
    time.sleep(5)
