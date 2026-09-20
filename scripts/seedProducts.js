// Seed script for products
// This requires the project to be built first

const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/abn-platform';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    
    // Seed the social media product
    const productData = {
      name: 'Guia Completo de Social Media para Empreendedores',
      description: 'Este guia completo ensina como usar as redes sociais para crescer o seu negócio. Inclui estratégias para Instagram, Facebook, LinkedIn e TikTok, com exemplos práticos e templates prontos a usar. Ideal para empreendedores que querem aumentar a sua presença online e atrair mais clientes.',
      price: 1500,
      category: 'Marketing Digital',
      image: '',
      status: 'ativo',
      stock: 0, // 0 para ilimitado (produto digital)
      digital: true,
      downloadUrl: 'https://example.com/guia-social-media.pdf',
      order: 1,
      productType: 'digital',
      fileType: 'pdf',
      fileSize: '15MB',
      duration: '',
      previewUrl: ''
    };

    return Product.findOneAndUpdate(
      { name: productData.name },
      productData,
      { upsert: true, new: true }
    );
  })
  .then((product) => {
    console.log('Produto de social media criado/atualizado:', product.name);
    console.log('Preço:', product.price, 'MT');
    console.log('Tipo:', product.productType, '-', product.fileType);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  });
