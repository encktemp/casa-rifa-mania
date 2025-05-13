const mercadoPago = require('mercadopago');

// Configuração com o Access Token
mercadoPago.configurations.setAccessToken('APP_USR-4202260275063709-051217-f391e465abec64f41ea822c264a821ca-384855683');

// Função para criar a preferência de pagamento
function createPaymentPreference(req, res) {
  const preference = {
    items: [
      {
        title: 'Produto Exemplo',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 100
      }
    ]
  };

  mercadoPago.preferences.create(preference)
    .then(response => {
      res.status(200).json(response.body);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}

module.exports = { createPaymentPreference };
