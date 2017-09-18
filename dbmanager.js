pgp = require('pg-promise')();

class DBManager {
    ConnectToDB(_host, _port, _database, _user, _password)
    {
        var CONN = {
            host: _host,
            port: _port,
            database: _database,
            user: _user,
            password: _password
        };

        return pgp(CONN);
    }
}

module.exports = DBManager;