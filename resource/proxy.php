<?php
// Your domain
const HOST = '%USER_HOST%';
// Your unique identifier. Keep it private.
const CUSTOMER_ID = '%USER_CUSTOMER_ID%';
// Domain of our server
const DESTINATION_HOST = 'https://proxy.trackadblock.com';

// Cancelling request if access token is not valid
// Please don't remove this line, because our server will block request anyway
// This is done, just so unnecessary requests are not made
if (!areRequestsBlocked()) {
    redirectAnalytics();
}

/**
 * Sending analytics data to our server, where it can be processed and sent to google analytics
 */
function redirectAnalytics()
{
    // Getting url address of analytics
    $url = $_GET['url'];
    // Getting requests body
    $payload = file_get_contents('php://input');
    // Getting HTTP method used in the request
    $method = $_SERVER['REQUEST_METHOD'];
    // Getting IP address of the user
    $ip = $_SERVER['REMOTE_ADDR'];
    // Getting information of whether user has Ad Block
    $adBlock = $_GET['ab'];

    // Building URL address
    $destination = DESTINATION_HOST . '/proxy';
    // Adding HTTP headers
    $headers = [
        'C-Analytics-URL: ' . $url,
        'C-Analytics-M: ' . $method,
        'C-Analytics-IP: ' . $ip,
        'C-Analytics-AB: ' . $adBlock
    ];
    // Making HTTP request
    $result = makeRequest($destination, 'POST', $headers, $payload);
    if ($result)
        echo $result;//TODO does it work?
}

/**
 * Checking if access token is still valid and requests can be processed by our server
 * Information of whether access is blocked, is saved as "executable" permissions flag of the file, because it's faster to read this info than content of the file
 * Our server is contacted every 10 minutes, and date of last recheck is saved as last modification date of the cache file
 */
function areRequestsBlocked()
{
    // Path to cache file
    $cacheFilePath = '../7A70RTc95RGbyJjROLF9';//TODO find appropriate name
    // Creating cache file if it doesn't exists
    if (!file_exists($cacheFilePath)) {
        touch($cacheFilePath);
        if (!file_exists($cacheFilePath)) {
            echo 'Failed to create cache file.';
            return true;
        }
    }
    // Requests are currently blocked, if "executable" permission is missing in cache file
    $blocked = !is_executable($cacheFilePath);
    // Checking last modification date of cache file
    $changeDate = filemtime($cacheFilePath);
    // Get amount of seconds since which our server was contacted, to see if access token is still valid
    $lastRecheckedSeconds = time() - $changeDate;
    // Contacting our server every 10 minutes
    if ($lastRecheckedSeconds > 60) {
        // Changing file modification date, which represents last date of checking if token is still valid
        touch($cacheFilePath);
        // Contacting our server, to see if access token is still valid
        $blocked = !recheckAccessTokenValid();
        if ($blocked) {
            // Setting "executable" permission to true, which means token is invalid
            chmod($cacheFilePath, 0600);
        } else {
            // Setting "executable" permission to false, which means token is valid
            chmod($cacheFilePath, 0700);
        }
    }
    return $blocked;
}

/**
 * Contacting our server, to see if access token is still valid
 */
function recheckAccessTokenValid()
{
    // Building url address
    $destination = DESTINATION_HOST . '/access';
    // Making http request
    $result = makeRequest($destination, 'GET', [], null);
    return $result === '1';
}

/**
 * Make HTTP Request to a given url address and with a given headers & method
 */
function makeRequest($destination, $method, $headers, $body)
{
    // Combining HTTP headers
    $allHeaders = array_merge($headers, getCommonHeaders());

    $options = array(
        'http' => array(
            'method' => $method,
            'content' => $body,
            'header' => $allHeaders)
    );
    // Sending HTTP request to the worker
    $context = stream_context_create($options);
    // Getting optional body of a response
    return file_get_contents($destination, false, $context);
}

/**
 * Returns HTTP headers that are used in all types of connections to our server
 */
function getCommonHeaders() {
    // Getting domain from which request was made
    $referrer = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

    return [
        'C-Analytics-HOST: ' . HOST,
        'C-Analytics-CID: ' . CUSTOMER_ID,
        'C-Analytics-REF: ' . $referrer
    ];
}

?>
