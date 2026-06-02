// Hubungkan ke Firestore secara global
window.db = firebase.firestore();

// Daftarkan fungsi tambah data ke memori browser
window.tambahPeserta = async function(data) {
  try {
    await window.db.collection("peserta").add(data);
    return true;
  } catch(error) {
    console.error("Gagal simpan data cloud:", error);
    return false;
  }
};

// Daftarkan fungsi dengerin data ke memori browser
window.listenPeserta = function(callback) {
  window.db.collection("peserta").onSnapshot((snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  }, (error) => {
    console.error("Gagal baca data cloud:", error);
  });
};

// Tambahkan fungsi ini ke dalam firestore.js
window.hapusPeserta = async function(id) {
    if (confirm("Yakin ingin menghapus data peserta ini?")) {
        try {
            await window.db.collection("peserta").doc(id).delete();
            return true;
        } catch(error) {
            console.error("Gagal hapus:", error);
            return false;
        }
    }
    return false;
};

// Fungsi untuk ambil satu data saja untuk kebutuhan Edit
window.ambilSatuPeserta = async function(id) {
    const doc = await window.db.collection("peserta").doc(id).get();
    return doc.exists ? doc.data() : null;
};