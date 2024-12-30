;; Research Management Contract

(define-data-var last-research-id uint u0)

(define-map research-projects
  { project-id: uint }
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-utf8 1000),
    status: (string-ascii 20),
    collaborators: (list 10 principal)
  }
)

(define-public (create-research-project (title (string-ascii 100)) (description (string-utf8 1000)))
  (let
    (
      (new-id (+ (var-get last-research-id) u1))
    )
    (map-set research-projects
      { project-id: new-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        status: "active",
        collaborators: (list tx-sender)
      }
    )
    (var-set last-research-id new-id)
    (ok new-id)
  )
)

(define-public (update-project-status (project-id uint) (new-status (string-ascii 20)))
  (let
    (
      (project (unwrap! (map-get? research-projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq (get creator project) tx-sender) (err u403))
    (ok (map-set research-projects
      { project-id: project-id }
      (merge project { status: new-status })
    ))
  )
)

(define-public (add-collaborator (project-id uint) (collaborator principal))
  (let
    (
      (project (unwrap! (map-get? research-projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq (get creator project) tx-sender) (err u403))
    (ok (map-set research-projects
      { project-id: project-id }
      (merge project { collaborators: (unwrap! (as-max-len? (append (get collaborators project) collaborator) u10) (err u400)) })
    ))
  )
)

(define-read-only (get-research-project (project-id uint))
  (ok (map-get? research-projects { project-id: project-id }))
)

