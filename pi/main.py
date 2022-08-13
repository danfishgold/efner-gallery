import logging
import os
import sys
from base64 import b64decode
from time import sleep

try:
    from typing import TypedDict
except:
    TypedDict = object

from dateutil.parser import parse as parse_date
from dotenv import load_dotenv
from supabase import Client, create_client

logging.root.handlers = []
logging.basicConfig(format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.DEBUG,
                    handlers=[
                        logging.FileHandler("debug.log"),
                        logging.StreamHandler(sys.stdout)
                    ])

logging.info(f"Starting {__file__}")

load_dotenv()

try:
    from inky import InkyPHAT
    display = InkyPHAT('red')
    width, height = display.resolution

except ImportError as e:
    logging.info("Loading fake inky package")
    class FakeDisplay:
        def show(self):
            pass

        def set_image(self, image):
            pass

    display = FakeDisplay()
    width = 212
    height = 104


class DBArt(TypedDict):
    id: str
    created_at: str
    pixels: str
    name: str
    artist: str

class DBCurrentArt(TypedDict):
    id: str
    regular_art_id: str
    new_art_id: str

class Art:
    def __init__(self, db_art: DBArt):
        self.id = db_art['id']
        self.created_at = parse_date(db_art["created_at"])
        self.pixels = Art.decode_pixels(db_art["pixels"])
        self.name = db_art["name"]
        self.artist = db_art["artist"]

    @staticmethod
    def decode_pixels(base_64_string: str):
        byte_array = b64decode(base_64_string)
        string_bits = ''.join(format(byte, '08b') for byte in byte_array)
        return [1 if bit == '0' else 0 for bit in string_bits]


url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    logging.error("Missing environment variables for Supabase",file=sys.stderr)
    exit(1)

supabase: Client = create_client(url, key)

def load_art():
    logging.info("Fetching all art")
    art_records = supabase.table("arts").select("*").order('created_at', desc=False).execute().data

    try:
        current_art_record: DBCurrentArt = supabase.table('current_art').select("*").limit(1).single().execute().data
        current_art_id = current_art_record['new_art_id'] or current_art_record['regular_art_id']

        current_art_index = next(index for index,art_record in enumerate(art_records) if art_record['id'] == current_art_id)
        next_art = Art(art_records[(current_art_index + 1) % len(art_records)])
        logging.info(f"Next art id: {next_art.id}")
    except BaseException as error:
        current_art_record = dict()
        next_art = Art(art_records[0])
        logging.error(f"Failed to get current art. Showing first art id: {next_art.id}")
        logging.error(error)

    logging.info("Updating current_art record")
    supabase.table('current_art').upsert({**current_art_record, 'regular_art_id': next_art.id}).execute()
    logging.info(f"Displaying art id {next_art.id} titled {next_art.name} by {next_art.artist}")
    display.set_image(next_art.pixels)
    display.show()

def run():
    logging.info("Clearing the display")
    display.set_image([0]*width*height)
    display.show()

    while True:
        try:
            load_art()
        except KeyboardInterrupt:
            logging.error("Exiting due to keyboard interrupt")
            exit(1)
        except BaseException as error:
            logging.error(error)
        sleep(60)

run()

