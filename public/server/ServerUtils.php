<?php
class ServerUtils {
    // allow CORS requests from the following Origins
    private const _ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://giversandgamers.org',
        'http://www.giversandgamers.org',
    ];

    // https://stackoverflow.com/a/9866124/356016
    static public function sendCORSHeaders () {
        if (isset($_SERVER['HTTP_ORIGIN']) and in_array($_SERVER['HTTP_ORIGIN'], ServerUtils::_ALLOWED_ORIGINS)) {
            header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
            header('Access-Control-Max-Age: 86400'); // 24h
            header('Vary: Origin');
        }

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header('Access-Control-Allow-Methods: GET, OPTIONS');
            }
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                // header('Access-Control-Allow-Headers: ' . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
                header('Access-Control-Allow-Headers: content-type, origin');
            }
            exit(0);
        }
    }

    static public function connectToDb () {
        $res = require_once('secrets.php');

        $dbh = new PDO(Secrets\DSN, Secrets\USER, Secrets\PASSWORD);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    }
}
