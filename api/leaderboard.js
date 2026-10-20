module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  res.status(200).json([
    { peringkat: 1, nama: 'CyberDyne Global', ceo: 'Viktor Kane', valuasi: 85400000, kategori: 'Sindikat Bisnis Antariksa' },
    { peringkat: 2, nama: 'Titan Orbital Corp', ceo: 'Sarah Chen', valuasi: 42100000, kategori: 'Megacorp Multinasional' },
    { peringkat: 3, nama: 'Aether Nexus Ltd', ceo: 'CryptoWhale_99', valuasi: 18400000, kategori: 'Konglomerat Blue-Chip' },
    { peringkat: 4, nama: 'OmniNet Solutions', ceo: 'CyberTycoon_ID', valuasi: 9200000, kategori: 'Konglomerat Blue-Chip' },
    { peringkat: 5, nama: 'Quantum Leap Labs', ceo: 'Luna_Quantum', valuasi: 5400000, kategori: 'Korporasi Menengah' }
  ]);
};
