# Project API Spec

## Create Project

Endpoint : POST /api/:version/project

Headers:

-   Authorization : token

Request Body :

```json
{
    "pekerjaan": "",
    "klien": "",
    "pic": "",
    "nomor_spk": "",
    "nomor_spj": "",
    "nomor_spo": "",
    "tanggal_service_po": "",
    "tanggal_delivery": "",
    "nilai_kontrak": "",
    "realisasi": "",
    "progress": "",
    "sisa_waktu": "",
    "keterangan": "",
    "status": "",
    "idUser": "",
    "idClient": "",
    "idPIC": "",
    "termin":[ {nominal: "", keterangan : "", tanggal : "", status: ""}, ...]
}
```

Response Body (Success) :

```json
{
    "data": {
        "id": "1",
        "pekerjaan": "",
        "klien": "",
        "pic": "",
        "nomor_spk": "",
        "nomor_spj": "",
        "nomor_spo": "",
        "tanggal_service_po": "",
        "tanggal_delivery": "",
        "nilai_kontrak": "",
        "realisasi": "",
        "progress": 1,
        "sisa_waktu": "",
        "keterangan": "",
        "status": "belum dikerjakan/presentasi dibawah 10%",
        "idUser": uuid,
        "idClient": uuid,
        "idPic": uuid
    }
}
```

Response Body (Failed) :

```json
{
    "errors": "ex: Create contact failed!"
}
```

## Get Project

Endpoint : GET /api/projects/:projectId

Headers:

-   Authorization : token

Request Body :

Response Body (Success) :

```json
{
    "data": {
        "id": "1",
        "pekerjaan": "",
        "klien": "",
        "pic": "",
        "nomor_spk": "",
        "nomor_spj": "",
        "nomor_spo": "",
        "tanggal_service_po": "",
        "tanggal_delivery": "",
        "nilai_kontrak": "",
        "realisasi": "",
        "progress": "",
        "sisa_waktu": "",
        "keterangan": "",
        "status": "",
        "idUser": "",
        "idClient": "",
        "idPic": ""
    }
}
```

Response Body (Failed) :

```json
{
    "errors": "ex: Create contact failed!"
}
```

## Update Project

Endpoint : PUT /api/projects/:projectId

Headers:

-   Authorization : token

Request Body :

```json
{
    "pekerjaan": "",
    "klien": "",
    "pic": "",
    "nomor_spk": "",
    "nomor_spj": "",
    "nomor_spo": "",
    "tanggal_service_po": "",
    "tanggal_delivery": "",
    "nilai_kontrak": "",
    "realisasi": "",
    "progress": "",
    "sisa_waktu": "",
    "keterangan": "",
    "status": "",
    "idUser": "",
    "idClient": "",
    "idPic": ""
}
```

Response Body (Success) :

```json
{
    "data": {
        "id": "1",
        "pekerjaan": "",
        "klien": "",
        "pic": "",
        "nomor_spk": "",
        "nomor_spj": "",
        "nomor_spo": "",
        "tanggal_service_po": "",
        "tanggal_delivery": "",
        "nilai_kontrak": "",
        "realisasi": "",
        "progress": "",
        "sisa_waktu": "",
        "keterangan": "",
        "status": "",
        "idUser": "",
        "idClient": "",
        "idPic": ""
    }
}
```

Response Body (Failed) :

```json
{
    "errors": "ex: Create contact failed!"
}
```

## Delete Project

Endpoint : DELETE /api/projects/:projectId

Headers:

-   Authorization : token

Response Body (Success) :

```json
{
    "data": true
}
```

Response Body (Failed) :

```json
{
    "errors": "ex: Delete contact failed!"
}
```

## Search Project

Endpoint : GET /api/projects/:projectId

Headers :

-   Authorization : token

Query Params :

name : string, contact first name or contact last name, optional
phone : string, contact phone, optional
email : string, contact email, optional
page : number, default 1
size : number, default 10

Response Body (Success) :

```json
{
    "data": [
        {
            "id": "1",
            "pekerjaan": "",
            "klien": "",
            "pic": "",
            "nomor_spk": "",
            "nomor_spj": "",
            "nomor_spo": "",
            "tanggal_service_po": "",
            "tanggal_delivery": "",
            "nilai_kontrak": "",
            "realisasi": "",
            "progress": "",
            "sisa_waktu": "",
            "keterangan": "",
            "status": "",
            "idUser": "",
            "idClient": "",
            "idPic": ""
        },
        {
            "id": "2",
            "pekerjaan": "",
            "klien": "",
            "pic": "",
            "nomor_spk": "",
            "nomor_spj": "",
            "nomor_spo": "",
            "tanggal_service_po": "",
            "tanggal_delivery": "",
            "nilai_kontrak": "",
            "realisasi": "",
            "progress": "",
            "sisa_waktu": "",
            "keterangan": "",
            "status": "",
            "idUser": "",
            "idClient": "",
            "idPic": ""
        }
    ],
    "paging": {
        "current_page": 1,
        "total_page": 10,
        "size": 10
    }
}
```

Response Body (Failed) :

```json
{
    "errors": "ex: Search contact failed!"
}
```
