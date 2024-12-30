;; Quantum NFT Contract

(define-non-fungible-token quantum-nft uint)

(define-data-var last-token-id uint u0)

(define-map token-uris { token-id: uint } { uri: (string-utf8 256) })

(define-public (mint (recipient principal) (uri (string-utf8 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? quantum-nft token-id recipient))
    (map-set token-uris { token-id: token-id } { uri: uri })
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (nft-transfer? quantum-nft token-id sender recipient)
  )
)

(define-read-only (get-token-uri (token-id uint))
  (ok (get uri (unwrap! (map-get? token-uris { token-id: token-id }) (err u404))))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? quantum-nft token-id))
)

