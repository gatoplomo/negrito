
"""
#!/bin/python
from pyModbusTCP.server import ModbusServer, DataBank
from time import sleep
from random import uniform

# Create an instance of ModbusServer
server = ModbusServer("127.0.0.1", 12345, no_block=True)

try:
    print("Start server...")
    server.start()
    print("Server is online")
    state = [0]
    while True:
        DataBank.set_words(0, [int(uniform(0, 100))])
        if state != DataBank.get_words(1):
            state = DataBank.get_words(1)
            print("Value of Register 1 has changed to " +str(state))
        sleep(0.5)

except:
    print("Shutdown server ...")
    server.stop()
    print("Server is offline")
""
#!/usr/bin/env python3


Modbus/TCP server
~~~~~~~~~~~~~~~~~

Run this as root to listen on TCP privileged ports (<= 1024).

Add "--host 0.0.0.0" to listen on all available IPv4 addresses of the host.
$ sudo ./server.py --host 0.0.0.0
"""

import argparse
import logging
import sys
from pyModbusTCP.server import ModbusServer

# init logging
logging.basicConfig()

# parse arguments
parser = argparse.ArgumentParser()
parser.add_argument('-H', '--host', type=str, default='localhost', help='Host (default: localhost)')
parser.add_argument('-p', '--port', type=int, default=502, help='TCP port (default: 502)')
parser.add_argument('-d', '--debug', action='store_true', help='set debug mode')
args = parser.parse_args()

# logging setup
if args.debug:
    logging.getLogger('pyModbusTCP.server').setLevel(logging.DEBUG)

# start modbus server
server = ModbusServer(host=args.host, port=args.port)

try:
    print(f"[INFO] Starting Modbus server on {args.host}:{args.port}")
    server.start()
    print("[INFO] Server is online.")

    # Keep server running indefinitely
    while True:
        pass  # Server runs here until an interruption

except KeyboardInterrupt:
    print("\n[INFO] Server interrupted, shutting down...")
except Exception as e:
    print(f"[ERROR] An error occurred: {e}")
finally:
    server.stop()
    print("[INFO] Server is offline.")
