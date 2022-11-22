<?php
require_once './ServerUtils.php';

ServerUtils::sendCORSHeaders();

try {
    $dbh = ServerUtils::connectToDb();
    $sth = $dbh->query('SELECT * FROM `twitch`', PDO::FETCH_ASSOC);

    // for now, let's only worry about the first record
    $row = $sth->fetch();
} catch (Exception $e) {
    echo '<pre>DB error: ', $e->getMessage(), '</pre>';
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
    header('Content-Type: application/json');
    echo $authToken;
} catch (Exception $e) {
    echo '<pre>cURL error: ', $e->getMessage(), '</pre>';
}
