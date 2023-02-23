<?php
require_once './ServerUtils.php';

class Tiltify {
  public const API_BASE = 'https://v5api.tiltify.com';
  public const CAUSE_ID = '7886';

  static private $_ACCESS;
  static private $_token;

  static private function _fetchCredentialsFromDB () {
    if (!isset(Tiltify::$_ACCESS)) {
      $dbh = ServerUtils::connectToDb();
      $sth = $dbh->query('SELECT * FROM `tiltify`', PDO::FETCH_ASSOC);

      // for now, let's only worry about the first record
      Tiltify::$_ACCESS = $sth->fetch();
    }
  }

  static public function fetchToken () {
    Tiltify::_fetchCredentialsFromDB();

    $ch = curl_init();
    $headers = [
      'Accept: application/json',
      'Content-Type: application/x-www-form-urlencoded',
    ];

    $payload = 'client_id=' . urlencode(Tiltify::$_ACCESS['client_id'])
    . '&client_secret=' . urlencode(Tiltify::$_ACCESS['client_secret']);

    if (isset(Tiltify::$_token)) {
      $payload .= '&grant_type=refresh_token';
    } else {
      $payload .= '&grant_type=client_credentials';
    }

    curl_setopt($ch, CURLOPT_URL, Tiltify::API_BASE . '/oauth/token');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // in seconds

    Tiltify::$_token = json_decode(curl_exec($ch));
    return Tiltify::$_token;
  }


  // API methods

  static public function fetchCampaigns ($limit=10) {
    Tiltify::fetchToken();

    return ServerUtils::curlGet(
      Tiltify::API_BASE . '/api/public/causes/' . urlencode(Tiltify::CAUSE_ID) . '/campaigns?limit=' . urlencode($limit),
      Tiltify::$_token->access_token,
    );
  }

  static public function fetchFundraisingEvents ($limit=10) {
    Tiltify::fetchToken();

    return ServerUtils::curlGet(
      Tiltify::API_BASE . '/api/public/causes/' . urlencode(Tiltify::CAUSE_ID) . '/fundraising_events?limit=' . urlencode($limit),
      Tiltify::$_token->access_token,
    );
  }

  static public function fetchLeaderboard () {
    Tiltify::fetchToken();

    return ServerUtils::curlGet(
      Tiltify::API_BASE . '/api/public/causes/' . urlencode(Tiltify::CAUSE_ID) . '/user_leaderboard',
      Tiltify::$_token->access_token,
    );
  }
}
