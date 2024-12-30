;; Quantum Marketplace Contract

(define-data-var last-listing-id uint u0)

(define-map marketplace-listings
  { listing-id: uint }
  {
    seller: principal,
    title: (string-ascii 100),
    description: (string-utf8 1000),
    price: uint,
    status: (string-ascii 20)
  }
)

(define-public (create-listing (title (string-ascii 100)) (description (string-utf8 1000)) (price uint))
  (let
    (
      (new-id (+ (var-get last-listing-id) u1))
    )
    (map-set marketplace-listings
      { listing-id: new-id }
      {
        seller: tx-sender,
        title: title,
        description: description,
        price: price,
        status: "active"
      }
    )
    (var-set last-listing-id new-id)
    (ok new-id)
  )
)

(define-public (purchase-listing (listing-id uint))
  (let
    (
      (listing (unwrap! (map-get? marketplace-listings { listing-id: listing-id }) (err u404)))
    )
    (asserts! (is-eq (get status listing) "active") (err u400))
    (ok (map-set marketplace-listings
      { listing-id: listing-id }
      (merge listing { status: "sold" })
    ))
  )
)

(define-read-only (get-listing (listing-id uint))
  (ok (map-get? marketplace-listings { listing-id: listing-id }))
)

