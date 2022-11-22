<?php
header('Content-Type: application/json');
require_once('./secrets.php');

try {
    $dbh = new PDO($dsn, $user, $password);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sth = $dbh->query('SELECT * FROM `twitch`', PDO::FETCH_ASSOC);

    // for now, let's only worry about the first record
    $row = $sth->fetch();
} catch (Exception $e) {
    echo 'DB error', $e->getMessage();
    exit;
}

try {
    $ch = curl_init();
    $headers = array(
        'Accept: application/json',
        'Content-Type: application/x-www-form-urlencoded',
    );

    $payload = 'client_id=' . urlencode($row['client_id'])
        . '&client_secret=' . urlencode($row['client_secret'])
        . '&grant_type=client_credentials';

    curl_setopt($ch, CURLOPT_URL, 'https://id.twitch.tv/oauth2/token');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // in seconds

    $authToken = curl_exec($ch);
    echo $authToken;
} catch (Exception $e) {
    echo 'cURL error', $e->getMessage();
}
