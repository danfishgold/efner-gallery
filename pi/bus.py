from datetime import datetime
from time import sleep

import dateutil
import requests
from dateutil.parser import parse
from inky import InkyPHAT
from PIL import Image, ImageDraw, ImageFont

display = InkyPHAT('black')
width, height = display.resolution


font_path = "heebo/Heebo-Regular.ttf"


route = "45"
stop = "26129"

def fetch_etas():
    response = requests.get(f"https://curlbus.app/{stop}", headers=dict(Accept="application/json"))
    response_data = response.json()
    last_updated = parse(response_data['timestamp'])
    last_updated_string = last_updated.strftime('%d/%m/%y %H:%M:%S ב ןכדוע')
    etas = []
    for visit in response_data['visits'][stop]:
        if visit['line_name'] == route:
            etas.append(parse(visit['eta']))
    if etas:
        closest_eta = sorted(etas)[0]
        next_eta = round((closest_eta - datetime.now(dateutil.tz.tzlocal())).total_seconds() / 60)
        if next_eta <= 0:
            next_eta = 'וישכע'
        else:
            next_eta = f'׳קד {next_eta}'
    else:
        next_eta = "ןיא"

    return next_eta, last_updated_string


def make_image(eta, last_updated):
    image = Image.new('1', display.resolution, 0)
    draw = ImageDraw.Draw(image)

    # # Draw the line number on the top conrner
    # font = ImageFont.truetype(font_path, 30)
    # draw.text((5, 2), route, font=font, fill=255)

    # Draw the ETA
    font = ImageFont.truetype(font_path, 60)
    draw.text((width/2 - 50, height/2 - 50), eta, font=font, fill=255)

    # Draw the last_updated timestamp
    font = ImageFont.truetype(font_path, 16)
    draw.text((0, height - 20), last_updated, font=font, fill=255)
    return image


def draw(eta, last_updated):
    image = make_image(eta, last_updated)
    display.set_image(image)
    display.show()

def run():
    eta, last_updated = fetch_etas()
    draw(eta, last_updated)

while True:
    run()
    sleep(15)
