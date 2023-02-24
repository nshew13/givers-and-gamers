<?php
require_once './ServerUtils.php';
require_once './Tiltify.php';
ServerUtils::sendCORSHeaders();
header('Content-Type: application/json');

try {
  if (isset($_GET['action'])) {
    switch ($_GET['action']) {
      case 'fetchCampaigns':
        echo Tiltify::fetchCampaigns(100);
        break;
      case 'fetchFundraisingEvents':
        echo Tiltify::fetchFundraisingEvents();
        break;
      case 'fetchLeaderboard':
        echo Tiltify::fetchLeaderboard();
        break;
      default:
        echo 'unknown action: ' . $_GET['action'];
        break;
    }
  }
} catch (Exception $e) {
  echo json_encode($e);
  exit;
}
