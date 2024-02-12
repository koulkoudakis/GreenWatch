#!/usr/bin/env python
import requests
import json
from time import sleep
# from sense_hat import SenseHat
# from spidev import SpiDev
import random

roomID = 1
# ServerIP='192.168.0.2'
ServerIP='127.0.0.1'
duration = 23
# private_key = 'FKLVPN17IC4JPB6NPJE0MSM4ISHQRF0EQ2MNRFLEGRP3PP7HMP649SWU1PDU'
private_key = 'S5TAKIYL49N7C9BJCNY3VFVC67AHELUXNBCFLPCVGT9AR9HIQVOE1VU5HXCK'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"

class MCP:
    def __init__(self, bus = 0, device = 0):
        self.bus, self.device = bus, device
        self.spi = SpiDev()
        self.open()
        self.spi.max_speed_hz = 1000000
        
    def open(self):
        self.spi.open(self.bus, self.device)
        self.spi.max_speed_hz = 1000000
        
    def read(self, channel = 0):
        adc = self.spi.xfer2([1, (8 + channel) << 4, 0])
        data = ((adc[1] & 3) << 8) + adc[2]
        return data
    def close(self):
        self.spi.close()


#initializing sensors
# sense = SenseHat()p


while True:
    #Temperature
    # temp = round(sense.get_temperature(), 2)
    temp = round(random.random() * 50 + 50)

    #Humidity
    # hum = round(sense.get_humidity(), 2)
    hum = round(random.random() * 50 + 50)

    #Light
    # light = adc.read(channel = 0)
    light= round(random.random() * 50 + 50)

    #AirPressure
    # pres = round(sense.get_pressure(), 2)
    pres = round(random.random() * 50 + 50)

    #Dataset
    dataSet = {'temperature': temp,
                'humidity': hum,
                'light': light,
                'pressure': pres}
    
    print(dataSet)


    post_measurement = requests.post(server_url, headers=req_headers, json=dataSet)

    # server_data = json.loads(post_measurement.text)
    # sleep(int(server_data["duration"]))
    sleep(1)

    print(post_measurement)

