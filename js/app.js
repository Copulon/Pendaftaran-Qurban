window.onload = function() {
    const btnDaftar = document.getElementById("btn-daftar");
    if (btnDaftar) {
        btnDaftar.addEventListener("click", pindahKeDashboard);
    }
};

async function pindahKeDashboard() {
    // Ambil inputan
    var namaInput = document.getElementById('in-nama').value || "Peserta";
    
    var dataPeserta = {
        nama: namaInput,
        phone: document.getElementById('in-phone').value || "-",
        alamat: document.getElementById('in-alamat').value || "-",
        hewan: document.getElementById('in-hewan').value || "Sapi",
        jumlah: parseInt(document.getElementById('in-patungan').value) || 1
    };

    const sukses = await window.tambahPeserta(dataPeserta);

    if (sukses) {
        // Langsung update nama di dashboard saat itu juga
        document.getElementById('out-nama-header').innerText = namaInput;
        document.getElementById('out-banner-nama').innerText = namaInput;

        // Pindah tampilan
        document.getElementById('layer-pendaftaran').style.display = 'none';
        document.getElementById('layer-dashboard').style.display = 'flex';
        window.scrollTo(0, 0);
    } else {
        alert("Gagal menyimpan data!");
    }
}

function kembaliDaftar() {
    document.getElementById('layer-dashboard').style.display = 'none';
    document.getElementById('layer-pendaftaran').style.display = 'flex';
}

async function prosesHapus(id) { await window.hapusPeserta(id); }

async function prosesEdit(id) {
    const data = await window.ambilSatuPeserta(id);
    if (data) {
        document.getElementById('in-nama').value = data.nama;
        document.getElementById('in-phone').value = data.phone;
        document.getElementById('in-alamat').value = data.alamat;
        document.getElementById('in-hewan').value = data.hewan;
        document.getElementById('in-patungan').value = data.jumlah;
        kembaliDaftar(); 
        await window.db.collection("peserta").doc(id).delete();
    }
}

if (typeof window.listenPeserta === "function") {
    window.listenPeserta((daftarPeserta) => {
        const tbody = document.querySelector('table tbody');
        if(!tbody) return;
        tbody.innerHTML = ''; 
        
        let totalPeserta = 0;
        let totalHewan = 0;
        let nomor = 1;

        daftarPeserta.forEach((data) => {
            totalPeserta += 1;
            const jml = Number(data.jumlah) || 0;
            totalHewan += jml;
            
            tbody.innerHTML += `
                <tr>
                    <td>${nomor++}</td>
                    <td>${data.nama}</td>
                   <td>${data.alamat}</td>
                    <td>${data.hewan}</td>
                    <td>${jml}</td>
                    <td>
                        <button onclick="prosesEdit('${data.id}')">Edit</button>
                        <button onclick="prosesHapus('${data.id}')">Hapus</button>
                    </td>
                </tr>
            `;
        });

        document.getElementById('out-total-peserta').innerText = totalPeserta + " Orang";
        document.getElementById('out-total-hewan').innerText = totalHewan + " Ekor";
    });
}

// Tambahkan fungsi ini di js/app.js
function bukaFormBaru() {
    // Reset semua isi input ke kosong
    document.getElementById('in-nama').value = "";
    document.getElementById('in-phone').value = "";
    document.getElementById('in-alamat').value = "";
    document.getElementById('in-hewan').value = "Sapi";
    document.getElementById('in-patungan').value = "1";
    
    // Buka form
    kembaliDaftar();
}