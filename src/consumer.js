require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./PlaylistServices');
const MailSender = require('./MailSender');
const Listener = require('./listener');
 
const init = async () => {

	const playlistsService = new PlaylistService();
  	const mailSender = new MailSender();
  	const listener = new Listener(playlistsService, mailSender);

  	// buat koneksi dengan server RabbitMQ
  	const connection = await amqp.connect(process.env.RABBITMQ_SERVER);

  	// buat channel menggunakan fungsi connection.createChannel.
  	const channel = await connection.createChannel();

  	// pastikan queue dengan nama export:playlists telah terbuat menggunakan fungsi channel.assertQueue.
  	await channel.assertQueue('export:playlists', {
	   durable: true,
  	});

  	channel.consume('export:playlists', listener.listen, { noAck: true });

};

init();