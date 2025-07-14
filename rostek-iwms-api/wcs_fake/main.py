from rostek_utils.com.rest_api import RestApi
from rostek_utils.utils.thread import Worker
from time import sleep
from random import random, choice

IWMS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzkyNDc2MTgsImV4cCI6MTc3MDM1MTYxOH0.MjRd-wKBPJNodv5YuSB5BQDXHWMCRoz5SUkRm_1dO_U"


@Worker.employ
def __checkRCS():
    N = 15
    STATUS = ["available", "unavailable", "disable", "fill"]
    RCS_STATUS = ["disable", "empty", "locked", "full"]
    for i in range(N):
        PK = int(random()*9 + 1)
        ROW = int(random()*30 + 1)
        COL = int(random()*30 + 1)
        name = f"PK{PK:02d}#{ROW:02d}{COL:02d}"

        print(f"Send: {name}")
        res = RestApi.client.post(
            "http://127.0.0.1:3100/mismatch/wcs",
            headers={ "Authorization": f"Bearer {IWMS_TOKEN}" },
            json={
                "name": name,
                "status": choice(STATUS),
                "rcs_status": choice(RCS_STATUS),
            },
            timeout=3
        )
        print("Recv:", res.status_code, res.content)
        print()
        sleep(2)
    
    print("Send done")
    res = RestApi.client.post(
        "http://127.0.0.1:3100/mismatch/wcs/done",
        headers={ "Authorization": f"Bearer {IWMS_TOKEN}" },
        timeout=3
    )
    print("Recv:", res.status_code, res.content)

@RestApi.server.post("/check_RCS")
def CheckRCS():
    """
    Start to sync RCS locations
    """
    __checkRCS()
    return "OK"

RestApi.run(port=3005)