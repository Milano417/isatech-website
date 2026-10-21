<?php
/**
 * API ISATech — stockage en fichiers JSON (aucune base de données requise).
 *
 * Lecture publique : GET  api/?action=public
 * Contact          : POST api/?action=contact
 * Administration   : toutes les autres actions (session + jeton CSRF).
 */

declare(strict_types=1);

const DATA_DIR = __DIR__ . '/../data';
const UPLOAD_DIR = __DIR__ . '/../uploads';
const UPLOAD_URL = 'uploads';
const MAX_UPLOAD = 8 * 1024 * 1024;
const COLLECTIONS = ['formations', 'news', 'gallery', 'infos', 'messages'];

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);
session_name('ISATECH_ADMIN');
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $code = 400): void
{
    respond(['error' => $message], $code);
}

function read_json(string $name, $default = [])
{
    $file = DATA_DIR . "/$name.json";
    if (!is_file($file)) return $default;
    $data = json_decode((string) file_get_contents($file), true);
    return $data === null ? $default : $data;
}

function write_json(string $name, $data): void
{
    $file = DATA_DIR . "/$name.json";
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (file_put_contents($file, $json, LOCK_EX) === false) {
        fail("Impossible d'écrire dans data/$name.json (vérifiez les permissions).", 500);
    }
}

function body(): array
{
    $data = json_decode((string) file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function require_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Méthode non autorisée.', 405);
}

function is_admin(): bool
{
    return !empty($_SESSION['admin']);
}

function require_admin(): void
{
    require_post();
    if (!is_admin()) fail('Session expirée, veuillez vous reconnecter.', 401);
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals($_SESSION['csrf'] ?? '', $token)) fail('Jeton de sécurité invalide.', 403);
}

function new_id(string $prefix): string
{
    return $prefix . bin2hex(random_bytes(5));
}

function clean_string($value, int $max = 20000): string
{
    return mb_substr(trim((string) $value), 0, $max);
}

function too_many_attempts(): bool
{
    $attempts = array_filter($_SESSION['login_attempts'] ?? [], fn($t) => $t > time() - 900);
    $_SESSION['login_attempts'] = $attempts;
    return count($attempts) >= 5;
}

$action = $_GET['action'] ?? '';

switch ($action) {

    case 'public':
        $formations = array_values(array_filter(read_json('formations'), fn($f) => !empty($f['published'])));
        usort($formations, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
        $news = array_values(array_filter(read_json('news'), fn($n) => !empty($n['published'])));
        usort($news, fn($a, $b) => strcmp($b['date'] ?? '', $a['date'] ?? ''));
        $infos = array_values(array_filter(read_json('infos'), fn($i) => !empty($i['active'])));
        usort($infos, fn($a, $b) => strcmp($b['date'] ?? '', $a['date'] ?? ''));
        $gallery = read_json('gallery');
        usort($gallery, fn($a, $b) => strcmp($b['date'] ?? '', $a['date'] ?? ''));
        respond([
            'settings' => read_json('settings', new stdClass()),
            'formations' => $formations,
            'news' => $news,
            'infos' => $infos,
            'gallery' => $gallery,
        ]);

    case 'contact':
        require_post();
        $in = body();
        if (!empty($in['website'])) respond(['ok' => true]); // pot de miel anti-robots
        $name = clean_string($in['name'] ?? '', 120);
        $email = clean_string($in['email'] ?? '', 160);
        $message = clean_string($in['message'] ?? '', 5000);
        if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Veuillez renseigner votre nom, un email valide et votre message.');
        }
        $last = $_SESSION['last_contact'] ?? 0;
        if ($last > time() - 30) fail('Merci de patienter quelques secondes avant un nouvel envoi.', 429);
        $_SESSION['last_contact'] = time();
        $messages = read_json('messages');
        array_unshift($messages, [
            'id' => new_id('m'),
            'name' => $name,
            'email' => $email,
            'phone' => clean_string($in['phone'] ?? '', 40),
            'subject' => clean_string($in['subject'] ?? '', 200),
            'message' => $message,
            'status' => 'nouveau',
            'date' => date('c'),
        ]);
        write_json('messages', array_slice($messages, 0, 1000));
        respond(['ok' => true]);

    case 'session':
        $auth = read_json('auth', []);
        if (is_admin() && empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
        respond([
            'authenticated' => is_admin(),
            'needsSetup' => empty($auth['hash']),
            'csrf' => is_admin() ? $_SESSION['csrf'] : null,
        ]);

    case 'setup':
        require_post();
        $auth = read_json('auth', []);
        if (!empty($auth['hash'])) fail('Le mot de passe est déjà configuré.', 403);
        $password = (string) (body()['password'] ?? '');
        if (mb_strlen($password) < 8) fail('Le mot de passe doit contenir au moins 8 caractères.');
        write_json('auth', ['hash' => password_hash($password, PASSWORD_DEFAULT)]);
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        respond(['ok' => true, 'csrf' => $_SESSION['csrf']]);

    case 'login':
        require_post();
        if (too_many_attempts()) fail('Trop de tentatives. Réessayez dans 15 minutes.', 429);
        $auth = read_json('auth', []);
        $password = (string) (body()['password'] ?? '');
        if (empty($auth['hash']) || !password_verify($password, $auth['hash'])) {
            $_SESSION['login_attempts'][] = time();
            fail('Mot de passe incorrect.', 401);
        }
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['login_attempts'] = [];
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        respond(['ok' => true, 'csrf' => $_SESSION['csrf']]);

    case 'logout':
        require_post();
        $_SESSION = [];
        session_destroy();
        respond(['ok' => true]);

    case 'admin_data':
        if (!is_admin()) fail('Non autorisé.', 401);
        $out = ['settings' => read_json('settings', new stdClass())];
        foreach (COLLECTIONS as $c) $out[$c] = read_json($c);
        respond($out);

    case 'save':
        require_admin();
        $in = body();
        $collection = $in['collection'] ?? '';
        $item = $in['item'] ?? null;
        if (!in_array($collection, COLLECTIONS, true) || $collection === 'messages' || !is_array($item)) {
            fail('Requête invalide.');
        }
        $list = read_json($collection);
        if (empty($item['id'])) {
            $item['id'] = new_id(substr($collection, 0, 1));
            array_unshift($list, $item);
        } else {
            $found = false;
            foreach ($list as $i => $existing) {
                if (($existing['id'] ?? null) === $item['id']) {
                    $list[$i] = $item;
                    $found = true;
                    break;
                }
            }
            if (!$found) array_unshift($list, $item);
        }
        write_json($collection, $list);
        respond(['ok' => true, 'item' => $item]);

    case 'delete':
        require_admin();
        $in = body();
        $collection = $in['collection'] ?? '';
        $id = $in['id'] ?? '';
        if (!in_array($collection, COLLECTIONS, true)) fail('Requête invalide.');
        $list = read_json($collection);
        $removed = null;
        $list = array_values(array_filter($list, function ($x) use ($id, &$removed) {
            if (($x['id'] ?? null) === $id) { $removed = $x; return false; }
            return true;
        }));
        write_json($collection, $list);
        // Supprime aussi le fichier d'une photo envoyée depuis l'admin
        if ($collection === 'gallery' && $removed && strpos($removed['url'] ?? '', UPLOAD_URL . '/') === 0) {
            $file = UPLOAD_DIR . '/' . basename($removed['url']);
            if (is_file($file)) @unlink($file);
        }
        respond(['ok' => true]);

    case 'message_status':
        require_admin();
        $in = body();
        $messages = read_json('messages');
        foreach ($messages as $i => $m) {
            if (($m['id'] ?? null) === ($in['id'] ?? '')) {
                $messages[$i]['status'] = in_array($in['status'] ?? '', ['nouveau', 'lu', 'traite'], true) ? $in['status'] : 'lu';
            }
        }
        write_json('messages', $messages);
        respond(['ok' => true]);

    case 'settings':
        require_admin();
        $settings = body()['settings'] ?? null;
        if (!is_array($settings)) fail('Requête invalide.');
        write_json('settings', $settings);
        respond(['ok' => true]);

    case 'upload':
        require_admin();
        $file = $_FILES['file'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) fail("Échec de l'envoi du fichier.");
        if ($file['size'] > MAX_UPLOAD) fail('Image trop lourde (8 Mo maximum).');
        $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if (!isset($types[$mime]) || @getimagesize($file['tmp_name']) === false) {
            fail('Format non accepté (JPG, PNG, WEBP ou GIF uniquement).');
        }
        if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
        $name = date('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . $types[$mime];
        if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $name)) {
            fail("Impossible d'enregistrer l'image (vérifiez les permissions du dossier uploads).", 500);
        }
        respond(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);

    case 'password':
        require_admin();
        $in = body();
        $auth = read_json('auth', []);
        if (!password_verify((string) ($in['current'] ?? ''), $auth['hash'] ?? '')) fail('Mot de passe actuel incorrect.');
        $new = (string) ($in['new'] ?? '');
        if (mb_strlen($new) < 8) fail('Le nouveau mot de passe doit contenir au moins 8 caractères.');
        write_json('auth', ['hash' => password_hash($new, PASSWORD_DEFAULT)]);
        respond(['ok' => true]);

    default:
        fail('Action inconnue.', 404);
}
