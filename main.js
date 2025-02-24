import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy, 
  where
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
const firebaseConfig = {
  apiKey: "AIzaSyDFYmmVvk-jLZIeAdYKiTwVw2jqd4VINFA",
  authDomain: "insan-cemerlang.firebaseapp.com",
  projectId: "insan-cemerlang",
  storageBucket: "insan-cemerlang.appspot.com",
  messagingSenderId: "579109661574",
  appId: "1:579109661574:web:4a7cd4060f70eded945a07"
};


//inisialisasi firebase
const aplikasi = initializeApp(firebaseConfig)
const basisdata = getFirestore(aplikasi)


// fungsi ambil daftar barang
export async function ambilDaftarBarang() {
  const refDokumen = collection(basisdata, "inventory");
  const kueri = query(refDokumen, orderBy("item"));
  const cuplikanKueri = await getDocs(kueri);


  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      item: dokumen.data().item,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })
  return hasilKueri;
}


// menambah barang ke keranjang
export async function tambahBarangKeKeranjang(
  idbarang,
  nama,
  harga,
  jumlah,
  idpelanggan,
  namapelanggan
) {
  try {
    //periksa apakah idbarang sudah ada di collection transaksi? 
    //mengambil data di seluruh collection transaksi
    let refDokumen = collection(basisdata, "transaksi")
    
    //membuat query untuk mencari data berdasarkan idbarang
  let queryBarang = query(refDokumen, where("idbarang", "==",idbarang))
  
    let snapshotBarang = await getDocs(queryBarang)
    let jumlahRecord = 0
    let idtransaksi = ''
    let jumlahsebelumnya = 0
    
    snapshotBarang.forEach((dokumen) => {
      jumlahRecord++
      idtransaksi = dokumen.id
      jumlahSebelumnya = dokumen.data().jumlah
    })
    if(jumlahRecord==0){
    // kalau belum ada, tambahkan langsung ke collection
    const refDokumen = await addDoc(collection(basisdata, "transaksi"), {
      idbarang: idbarang,
      nama: nama,
      harga: harga,
      jumlah: jumlah,
      idpelanggan: idpelanggan,
      namapelanggan: namapelanggan
    })
    
    
} else if (jumlahRecord == 1){
  // kalau sudah ada, ditambahkan jumlahnya saja
  jumlahsebelumnya++
  await updateDoc(doc(basisdata, "transaksi", idtransaksi),{jumlah: jumlahsebelumnya})
}
    // menampilkan pesan berhasil
    console.log("berhasil menyimpan keranjang")
  }catch (error) {
    // menampilkan pesan gagal
    console.log(error)
  }
}

// menampilkan barang di keranjang
export async function ambilDaftarBarangDiKeranjang() {
  const refDokumen = collection(basisdata, "transaksi");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);

  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })

  return hasilKueri;
}

export async function hapusbarangdarikeranjang(id){ 
await delete(doc(basisdata, "transaksi",id))
}
{
  const refDokumen = collection(basisdata, "pelanggan");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);

  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      alamat: dokumen.data().alamat,
      nohape: dokumen.data().nohape
    })
  })

  return hasilKueri;
}
