## Install mongo db
### Install
```sh
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg  --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Run
```sh
sudo systemctl start mongod
```
- In case start fail
```sh
sudo systemctl daemon-reload
```
- Set auto start
```sh
sudo systemctl enable mongod
```

### Init
```sh
mongosh

use ajinomoto
db.createUser(
  {
    user: "ro",
    pwd: "jlasidbkjsdcajsdvbaer",
    roles: [ { role: "readWrite", db: "ajinomoto" } ]
  }
)
```