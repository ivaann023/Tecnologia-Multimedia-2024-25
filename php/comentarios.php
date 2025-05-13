<?php
header('Content-Type: application/json; charset=utf-8');

// 1) Leer y validar JSON de entrada
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (
    !$data ||
    !isset($data['excursionId'], $data['author'], $data['comment'], $data['rating'])
) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

// 2) Validar y castear excursionId como entero
if (filter_var($data['excursionId'], FILTER_VALIDATE_INT) === false) {
    echo json_encode(['success' => false, 'message' => 'excursionId inválido']);
    exit;
}
$excursionId = (int)$data['excursionId'];

// 3) Sanear y validar resto de campos
$author  = htmlspecialchars(trim($data['author']),  ENT_QUOTES, 'UTF-8');
$comment = htmlspecialchars(trim($data['comment']), ENT_QUOTES, 'UTF-8');
$rating  = filter_var(
    $data['rating'],
    FILTER_VALIDATE_INT,
    ['options' => ['min_range' => 1, 'max_range' => 5]]
);
if ($rating === false) {
    echo json_encode(['success' => false, 'message' => 'Rating inválido (debe ser 1–5)']);
    exit;
}

// 4) Ruta al JSON de reviews
$jsonFile = __DIR__ . '/../json/reviews.json';

// 5) Cargar o inicializar estructura
if (file_exists($jsonFile)) {
    $content = file_get_contents($jsonFile);
    $reviews = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE || !isset($reviews['itemListElement'])) {
        $reviews = [
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            'itemListElement' => []
        ];
    }
} else {
    $reviews = [
        '@context'        => 'https://schema.org',
        '@type'           => 'ItemList',
        'itemListElement' => []
    ];
}

// 6) Asegurar que itemListElement es array
if (!is_array($reviews['itemListElement'])) {
    $reviews['itemListElement'] = [];
}

// 7) Buscar (o crear) el nodo de esta excursión, comparando como enteros
$itemList = &$reviews['itemListElement'];
$found    = false;
foreach ($itemList as &$li) {
    if (
        isset($li['@type'], $li['@identifier']) &&
        in_array($li['@type'], ['ListItem','UserReview'], true) &&
        ((int)$li['@identifier'] === $excursionId)
    ) {
        $found = true;
        break;
    }
}
if (! $found) {
    $li = [
        '@type'            => 'UserReview',
        '@identifier'      => $excursionId,
        'position'         => count($itemList) + 1,
        'aggregateRating'  => [
            '@type'       => 'AggregateRating',
            'ratingValue' => 0,
            'reviewCount' => 0
        ],
        'associatedReview'=> []
    ];
    $itemList[] = &$li;
}

// 8) Construir el nuevo Review
$newReview = [
    '@type'         => 'Review',
    'author'        => ['@type'=>'Person','name'=>$author],
    'datePublished' => date('Y-m-d'),
    'reviewBody'    => $comment,
    'reviewRating'  => ['@type'=>'Rating','ratingValue'=>$rating]
];

// 9) Añadirlo y recalcular aggregateRating
$li['associatedReview'][] = $newReview;
$count = count($li['associatedReview']);
$sum   = array_sum(array_map(fn($r)=>intval($r['reviewRating']['ratingValue']), $li['associatedReview']));
$li['aggregateRating']['reviewCount'] = $count;
$li['aggregateRating']['ratingValue'] = round($sum / $count, 1);

// 10) Guardar de nuevo en disco (LOCK_EX para concurrencia)
$jsonString = json_encode($reviews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$bytes = file_put_contents($jsonFile, $jsonString, LOCK_EX);

if ($bytes === false) {
    echo json_encode([
        'success'   => false,
        'message'   => 'Error al escribir reviews.json',
        'writtenBytes' => 0
    ]);
    exit;
}

// 11) Responder éxito con el nuevo review y rating
echo json_encode([
    'success'         => true,
    'newReview'       => $newReview,
    'aggregateRating' => $li['aggregateRating'],
    'writtenBytes'    => $bytes
]);
