from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Klinika RME API",
    description="Backend untuk aplikasi Rekam Medis Elektronik sederhana.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "klinika-rme-api"}


# NOTE: Router untuk pasien, kunjungan, vital sign, resep, dan auth
# akan ditambahkan di tahap berikutnya (setelah UI/UX di-approve),
# menyusul model & migration database (lihat app/models, app/schemas).
